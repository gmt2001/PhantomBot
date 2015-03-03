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
import java.io.OutputStream;
import org.json.zip.BitInputStream;
import org.json.zip.BitWriter;

public class BitOutputStream
implements BitWriter {
    private long nrBits = 0;
    private OutputStream out;
    private int unwritten;
    private int vacant = 8;

    public BitOutputStream(OutputStream out) {
        this.out = out;
    }

    @Override
    public long nrBits() {
        return this.nrBits;
    }

    @Override
    public void one() throws IOException {
        this.write(1, 1);
    }

    @Override
    public void pad(int factor) throws IOException {
        int padding = factor - (int)(this.nrBits % (long)factor);
        int excess = padding & 7;
        if (excess > 0) {
            this.write(0, excess);
            padding-=excess;
        }
        for (; padding > 0; padding-=8) {
            this.write(0, 8);
        }
        this.out.flush();
    }

    @Override
    public void write(int bits, int width) throws IOException {
        if (bits == 0 && width == 0) {
            return;
        }
        if (width <= 0 || width > 32) {
            throw new IOException("Bad write width.");
        }
        while (width > 0) {
            int actual = width;
            if (actual > this.vacant) {
                actual = this.vacant;
            }
            this.unwritten|=(bits >>> width - actual & BitInputStream.mask[actual]) << this.vacant - actual;
            width-=actual;
            this.nrBits+=(long)actual;
            this.vacant-=actual;
            if (this.vacant != 0) continue;
            this.out.write(this.unwritten);
            this.unwritten = 0;
            this.vacant = 8;
        }
    }

    @Override
    public void zero() throws IOException {
        this.write(0, 1);
    }
}

