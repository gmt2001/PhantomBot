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

import org.json.zip.JSONzip;
import org.json.zip.None;
import org.json.zip.PostMortem;

abstract class Keep
implements None,
PostMortem {
    protected int capacity;
    protected int length;
    protected int power;
    protected long[] uses;

    public Keep(int bits) {
        this.capacity = JSONzip.twos[bits];
        this.length = 0;
        this.power = 0;
        this.uses = new long[this.capacity];
    }

    public static long age(long use) {
        return use >= 32 ? 16 : use / 2;
    }

    public int bitsize() {
        while (JSONzip.twos[this.power] < this.length) {
            ++this.power;
        }
        return this.power;
    }

    public void tick(int integer) {
        long[] arrl = this.uses;
        int n = integer;
        arrl[n] = arrl[n] + 1;
    }

    public abstract Object value(int var1);
}

