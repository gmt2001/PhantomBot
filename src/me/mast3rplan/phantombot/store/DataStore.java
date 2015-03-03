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
package me.mast3rplan.phantombot.store;

import java.util.Iterator;
import java.util.Set;
import redis.clients.jedis.Jedis;

public class DataStore {
    private static final String PREFIX = "pb";
    private static final Jedis jedis = new Jedis("localhost");
    private static final DataStore instance = new DataStore();

    public static DataStore instance() {
        return instance;
    }

    public String[] getKeys(String type, String pattern) {
        Set o = jedis.keys("pb_" + type + "_" + pattern);
        String[] s = new String[o.size()];
        Iterator it = o.iterator();
        int i = 0;
        while (it.hasNext()) {
            s[i++] = (String)it.next();
        }
        return s;
    }

    public String[] getKeys(String pattern) {
        Set o = jedis.keys("pb_" + pattern);
        String[] s = new String[o.size()];
        Iterator it = o.iterator();
        int i = 0;
        while (it.hasNext()) {
            s[i++] = (String)it.next();
        }
        return s;
    }

    public boolean exists(String type, String key) {
        return jedis.exists("pb_" + type + "_" + key);
    }

    public String get(String type, String key) {
        return jedis.get("pb_" + type + "_" + key);
    }

    public void set(String type, String key, String value) {
        jedis.set("pb_" + type + "_" + key, value);
    }

    public void del(String type, String key) {
        jedis.del("pb_" + type + "_" + key);
    }

    public void incr(String type, String key, int amount) {
        jedis.incrBy("pb_" + type + "_" + key, (long)amount);
    }

    public void decr(String type, String key, int amount) {
        jedis.decrBy("pb_" + type + "_" + key, (long)amount);
    }
}

