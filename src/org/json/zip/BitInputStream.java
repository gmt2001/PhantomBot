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

import java.io.IOException;
import java.io.InputStream;
import org.json.zip.BitReader;

public class BitInputStream
implements BitReader {
    static final int[] mask = new int[]{0, 1, 3, 7, 15, 31, 63, 127, 255};
    private int available = 0;
    private int unread = 0;
    private InputStream in;
    private long nrBits = 0;

    public BitInputStream(InputStream in) {
        this.in = in;
    }

    public BitInputStream(InputStream in, int firstByte) {
        this.in = in;
        this.unread = firstByte;
        this.available = 8;
    }

    @Override
    public boolean bit() throws IOException {
        return this.read(1) != 0;
    }

    @Override
    public long nrBits() {
        return this.nrBits;
    }

    @Override
    public boolean pad(int factor) throws IOException {
        int padding = factor - (int)(this.nrBits % (long)factor);
        boolean result = true;
        for (int i = 0; i < padding; ++i) {
            if (!this.bit()) continue;
            result = false;
        }
        return result;
    }

    @Override
    public int read(int width) throws IOException {
        int take;
        if (width == 0) {
            return 0;
        }
        if (width < 0 || width > 32) {
            throw new IOException("Bad read width.");
        }
        int result = 0;
        for (; width > 0; width-=take) {
            if (this.available == 0) {
                this.unread = this.in.read();
                if (this.unread < 0) {
                    throw new IOException("Attempt to read past end.");
                }
                this.available = 8;
            }
            if ((take = width) > this.available) {
                take = this.available;
            }
            result|=(this.unread >>> this.available - take & mask[take]) << width - take;
            this.nrBits+=(long)take;
            this.available-=take;
        }
        return result;
    }
}

