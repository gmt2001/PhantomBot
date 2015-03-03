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
package org.json;

import java.util.Arrays;
import org.json.JSONException;

public class Kim {
    private byte[] bytes = null;
    private int hashcode = 0;
    public int length = 0;
    private String string = null;

    public Kim(byte[] bytes, int from, int thru) {
        int sum = 1;
        this.hashcode = 0;
        this.length = thru - from;
        if (this.length > 0) {
            this.bytes = new byte[this.length];
            for (int at = 0; at < this.length; ++at) {
                int value = bytes[at + from] & 255;
                this.hashcode+=(sum+=value);
                this.bytes[at] = (byte)value;
            }
            this.hashcode+=sum << 16;
        }
    }

    public Kim(byte[] bytes, int length) {
        this(bytes, 0, length);
    }

    public Kim(Kim kim, int from, int thru) {
        this(kim.bytes, from, thru);
    }

    public Kim(String string) throws JSONException {
        int stringLength = string.length();
        this.hashcode = 0;
        this.length = 0;
        if (stringLength > 0) {
            for (int i = 0; i < stringLength; ++i) {
                char c = string.charAt(i);
                if (c <= '') {
                    ++this.length;
                    continue;
                }
                if (c <= '\u3fff') {
                    this.length+=2;
                    continue;
                }
                if (c >= '\ud800' && c <= '\udfff') {
                    char d = string.charAt(++i);
                    if (c > '\udbff' || d < '\udc00' || d > '\udfff') {
                        throw new JSONException("Bad UTF16");
                    }
                }
                this.length+=3;
            }
            this.bytes = new byte[this.length];
            int at = 0;
            int sum = 1;
            for (int i2 = 0; i2 < stringLength; ++i2) {
                int b;
                int character = string.charAt(i2);
                if (character <= 127) {
                    this.bytes[at] = (byte)character;
                    this.hashcode+=(sum+=character);
                    ++at;
                    continue;
                }
                if (character <= 16383) {
                    b = 128 | character >>> 7;
                    this.bytes[at] = (byte)b;
                    this.hashcode+=(sum+=b);
                    b = character & 127;
                    this.bytes[++at] = (byte)b;
                    this.hashcode+=(sum+=b);
                    ++at;
                    continue;
                }
                if (character >= 55296 && character <= 56319) {
                    character = ((character & 1023) << 10 | string.charAt(++i2) & 1023) + 65536;
                }
                b = 128 | character >>> 14;
                this.bytes[at] = (byte)b;
                this.hashcode+=(sum+=b);
                b = 128 | character >>> 7 & 255;
                this.bytes[++at] = (byte)b;
                this.hashcode+=(sum+=b);
                b = character & 127;
                this.bytes[++at] = (byte)b;
                this.hashcode+=(sum+=b);
                ++at;
            }
            this.hashcode+=sum << 16;
        }
    }

    public int characterAt(int at) throws JSONException {
        int c = this.get(at);
        if ((c & 128) == 0) {
            return c;
        }
        int c1 = this.get(at + 1);
        if ((c1 & 128) == 0) {
            int character = (c & 127) << 7 | c1;
            if (character > 127) {
                return character;
            }
        } else {
            int c2 = this.get(at + 2);
            int character = (c & 127) << 14 | (c1 & 127) << 7 | c2;
            if ((c2 & 128) == 0 && character > 16383 && character <= 1114111 && (character < 55296 || character > 57343)) {
                return character;
            }
        }
        throw new JSONException("Bad character at " + at);
    }

    public static int characterSize(int character) throws JSONException {
        if (character < 0 || character > 1114111) {
            throw new JSONException("Bad character " + character);
        }
        return character <= 127 ? 1 : (character <= 16383 ? 2 : 3);
    }

    public int copy(byte[] bytes, int at) {
        System.arraycopy(this.bytes, 0, bytes, at, this.length);
        return at + this.length;
    }

    public boolean equals(Object obj) {
        if (!(obj instanceof Kim)) {
            return false;
        }
        Kim that = (Kim)obj;
        if (this == that) {
            return true;
        }
        if (this.hashcode != that.hashcode) {
            return false;
        }
        return Arrays.equals(this.bytes, that.bytes);
    }

    public int get(int at) throws JSONException {
        if (at < 0 || at > this.length) {
            throw new JSONException("Bad character at " + at);
        }
        return this.bytes[at] & 255;
    }

    public int hashCode() {
        return this.hashcode;
    }

    public String toString() throws JSONException {
        if (this.string == null) {
            int c;
            int length = 0;
            char[] chars = new char[this.length];
            for (int at = 0; at < this.length; at+=Kim.characterSize((int)c)) {
                c = this.characterAt(at);
                if (c < 65536) {
                    chars[length] = (char)c;
                    ++length;
                    continue;
                }
                chars[length] = (char)(55296 | c - 65536 >>> 10);
                chars[++length] = (char)(56320 | c & 1023);
                ++length;
            }
            this.string = new String(chars, 0, length);
        }
        return this.string;
    }
}

