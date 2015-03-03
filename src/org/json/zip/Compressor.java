/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * Credits: mast3rplan, gmt2001, PhantomIndex, GloriousEggroll
 * gloriouseggroll@gmail.com, phantomindex@gmail.com
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
package org.json.zip;

import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.Kim;
import org.json.zip.BitWriter;
import org.json.zip.Huff;
import org.json.zip.JSONzip;
import org.json.zip.Keep;
import org.json.zip.MapKeep;
import org.json.zip.TrieKeep;

public class Compressor
extends JSONzip {
    final BitWriter bitwriter;

    public Compressor(BitWriter bitwriter) {
        this.bitwriter = bitwriter;
    }

    private static int bcd(char digit) {
        if (digit >= '0' && digit <= '9') {
            return digit - 48;
        }
        switch (digit) {
            case '.': {
                return 10;
            }
            case '-': {
                return 11;
            }
            case '+': {
                return 12;
            }
        }
        return 13;
    }

    public void flush() throws JSONException {
        this.pad(8);
    }

    private void one() throws JSONException {
        this.write(1, 1);
    }

    public void pad(int factor) throws JSONException {
        try {
            this.bitwriter.pad(factor);
        }
        catch (Throwable e) {
            throw new JSONException(e);
        }
    }

    private void write(int integer, int width) throws JSONException {
        try {
            this.bitwriter.write(integer, width);
        }
        catch (Throwable e) {
            throw new JSONException(e);
        }
    }

    private void write(int integer, Huff huff) throws JSONException {
        huff.write(integer, this.bitwriter);
    }

    private void write(Kim kim, Huff huff) throws JSONException {
        this.write(kim, 0, kim.length, huff);
    }

    private void write(Kim kim, int from, int thru, Huff huff) throws JSONException {
        for (int at = from; at < thru; ++at) {
            this.write(kim.get(at), huff);
        }
    }

    private void writeAndTick(int integer, Keep keep) throws JSONException {
        int width = keep.bitsize();
        keep.tick(integer);
        this.write(integer, width);
    }

    private void writeArray(JSONArray jsonarray) throws JSONException {
        boolean stringy = false;
        int length = jsonarray.length();
        if (length == 0) {
            this.write(1, 3);
        } else {
            Object value = jsonarray.get(0);
            if (value == null) {
                value = JSONObject.NULL;
            }
            if (value instanceof String) {
                stringy = true;
                this.write(6, 3);
                this.writeString((String)value);
            } else {
                this.write(7, 3);
                this.writeValue(value);
            }
            for (int i = 1; i < length; ++i) {
                value = jsonarray.get(i);
                if (value == null) {
                    value = JSONObject.NULL;
                }
                if (value instanceof String != stringy) {
                    this.zero();
                }
                this.one();
                if (value instanceof String) {
                    this.writeString((String)value);
                    continue;
                }
                this.writeValue(value);
            }
            this.zero();
            this.zero();
        }
    }

    private void writeJSON(Object value) throws JSONException {
        if (JSONObject.NULL.equals(value)) {
            this.write(4, 3);
        } else if (Boolean.FALSE.equals(value)) {
            this.write(3, 3);
        } else if (Boolean.TRUE.equals(value)) {
            this.write(2, 3);
        } else {
            if (value instanceof Map) {
                value = new JSONObject((Map)value);
            } else if (value instanceof Collection) {
                value = new JSONArray((Collection)value);
            } else if (value.getClass().isArray()) {
                value = new JSONArray(value);
            }
            if (value instanceof JSONObject) {
                this.writeObject((JSONObject)value);
            } else if (value instanceof JSONArray) {
                this.writeArray((JSONArray)value);
            } else {
                throw new JSONException("Unrecognized object");
            }
        }
    }

    private void writeName(String name) throws JSONException {
        Kim kim = new Kim(name);
        int integer = this.namekeep.find(kim);
        if (integer != -1) {
            this.one();
            this.writeAndTick(integer, this.namekeep);
        } else {
            this.zero();
            this.write(kim, this.namehuff);
            this.write(256, this.namehuff);
            this.namekeep.register(kim);
        }
    }

    private void writeObject(JSONObject jsonobject) throws JSONException {
        boolean first = true;
        Iterator keys = jsonobject.keys();
        while (keys.hasNext()) {
            Object key = keys.next();
            if (!(key instanceof String)) continue;
            if (first) {
                first = false;
                this.write(5, 3);
            } else {
                this.one();
            }
            this.writeName((String)key);
            Object value = jsonobject.get((String)key);
            if (value instanceof String) {
                this.zero();
                this.writeString((String)value);
                continue;
            }
            this.one();
            this.writeValue(value);
        }
        if (first) {
            this.write(0, 3);
        } else {
            this.zero();
        }
    }

    private void writeString(String string) throws JSONException {
        if (string.length() == 0) {
            this.zero();
            this.zero();
            this.write(256, this.substringhuff);
            this.zero();
        } else {
            Kim kim = new Kim(string);
            int integer = this.stringkeep.find(kim);
            if (integer != -1) {
                this.one();
                this.writeAndTick(integer, this.stringkeep);
            } else {
                this.writeSubstring(kim);
                this.stringkeep.register(kim);
            }
        }
    }

    private void writeSubstring(Kim kim) throws JSONException {
        this.substringkeep.reserve();
        this.zero();
        int from = 0;
        int thru = kim.length;
        int until = thru - 3;
        int previousFrom = -1;
        int previousThru = 0;
        do {
            int at;
            int integer = -1;
            for (at = from; at <= until; ++at) {
                integer = this.substringkeep.match(kim, at, thru);
                if (integer != -1) break;
            }
            if (integer == -1) break;
            if (from != at) {
                this.zero();
                this.write(kim, from, at, this.substringhuff);
                this.write(256, this.substringhuff);
                if (previousFrom != -1) {
                    this.substringkeep.registerOne(kim, previousFrom, previousThru);
                    previousFrom = -1;
                }
            }
            this.one();
            this.writeAndTick(integer, this.substringkeep);
            from = at + this.substringkeep.length(integer);
            if (previousFrom != -1) {
                this.substringkeep.registerOne(kim, previousFrom, previousThru);
                previousFrom = -1;
            }
            previousFrom = at;
            previousThru = from + 1;
        } while (true);
        this.zero();
        if (from < thru) {
            this.write(kim, from, thru, this.substringhuff);
            if (previousFrom != -1) {
                this.substringkeep.registerOne(kim, previousFrom, previousThru);
            }
        }
        this.write(256, this.substringhuff);
        this.zero();
        this.substringkeep.registerMany(kim);
    }

    private void writeValue(Object value) throws JSONException {
        if (value instanceof Number) {
            long longer;
            String string = JSONObject.numberToString((Number)value);
            int integer = this.values.find(string);
            if (integer != -1) {
                this.write(2, 2);
                this.writeAndTick(integer, this.values);
                return;
            }
            if ((value instanceof Integer || value instanceof Long) && (longer = ((Number)value).longValue()) >= 0 && longer < 16384) {
                this.write(0, 2);
                if (longer < 16) {
                    this.zero();
                    this.write((int)longer, 4);
                    return;
                }
                this.one();
                if (longer < 128) {
                    this.zero();
                    this.write((int)longer, 7);
                    return;
                }
                this.one();
                this.write((int)longer, 14);
                return;
            }
            this.write(1, 2);
            for (int i = 0; i < string.length(); ++i) {
                this.write(Compressor.bcd(string.charAt(i)), 4);
            }
            this.write(endOfNumber, 4);
            this.values.register(string);
        } else {
            this.write(3, 2);
            this.writeJSON(value);
        }
    }

    private void zero() throws JSONException {
        this.write(0, 1);
    }

    public void zip(JSONObject jsonobject) throws JSONException {
        this.begin();
        this.writeJSON(jsonobject);
    }

    public void zip(JSONArray jsonarray) throws JSONException {
        this.begin();
        this.writeJSON(jsonarray);
    }
}

