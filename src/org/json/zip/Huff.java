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

import org.json.JSONException;
import org.json.zip.BitReader;
import org.json.zip.BitWriter;
import org.json.zip.JSONzip;
import org.json.zip.None;
import org.json.zip.PostMortem;

public class Huff
implements None,
PostMortem {
    private final int domain;
    private final Symbol[] symbols;
    private Symbol table;
    private boolean upToDate = false;
    private int width;

    public Huff(int domain) {
        int i;
        this.domain = domain;
        int length = domain * 2 - 1;
        this.symbols = new Symbol[length];
        for (i = 0; i < domain; ++i) {
            this.symbols[i] = new Symbol(i);
        }
        for (i = domain; i < length; ++i) {
            this.symbols[i] = new Symbol(-1);
        }
    }

    public void generate() {
        if (!this.upToDate) {
            Symbol next;
            Symbol symbol;
            Symbol head;
            Symbol previous = head = this.symbols[0];
            this.table = null;
            head.next = null;
            for (int i = 1; i < this.domain; ++i) {
                symbol = this.symbols[i];
                if (symbol.weight < head.weight) {
                    symbol.next = head;
                    head = symbol;
                    continue;
                }
                if (symbol.weight < previous.weight) {
                    previous = head;
                }
                while ((next = previous.next) != null) {
                    if (symbol.weight < next.weight) break;
                    previous = next;
                }
                symbol.next = next;
                previous.next = symbol;
                previous = symbol;
            }
            int avail = this.domain;
            previous = head;
            do {
                Symbol first = head;
                Symbol second = first.next;
                head = second.next;
                symbol = this.symbols[avail];
                ++avail;
                symbol.weight = first.weight + second.weight;
                symbol.zero = first;
                symbol.one = second;
                symbol.back = null;
                first.back = symbol;
                second.back = symbol;
                if (head == null) break;
                if (symbol.weight < head.weight) {
                    symbol.next = head;
                    previous = head = symbol;
                    continue;
                }
                while ((next = previous.next) != null) {
                    if (symbol.weight < next.weight) break;
                    previous = next;
                }
                symbol.next = next;
                previous.next = symbol;
                previous = symbol;
            } while (true);
            this.table = symbol;
            this.upToDate = true;
        }
    }

    private boolean postMortem(int integer) {
        Symbol back;
        int[] bits = new int[this.domain];
        Symbol symbol = this.symbols[integer];
        if (symbol.integer != integer) {
            return false;
        }
        int i = 0;
        while ((back = symbol.back) != null) {
            if (back.zero == symbol) {
                bits[i] = 0;
            } else if (back.one == symbol) {
                bits[i] = 1;
            } else {
                return false;
            }
            ++i;
            symbol = back;
        }
        if (symbol != this.table) {
            return false;
        }
        this.width = 0;
        symbol = this.table;
        while (symbol.integer == -1) {
            symbol = bits[--i] != 0 ? symbol.one : symbol.zero;
        }
        return symbol.integer == integer && i == 0;
    }

    @Override
    public boolean postMortem(PostMortem pm) {
        for (int integer = 0; integer < this.domain; ++integer) {
            if (this.postMortem(integer)) continue;
            JSONzip.log("\nBad huff ");
            JSONzip.logchar(integer, integer);
            return false;
        }
        return this.table.postMortem(((Huff)pm).table);
    }

    public int read(BitReader bitreader) throws JSONException {
        try {
            this.width = 0;
            Symbol symbol = this.table;
            while (symbol.integer == -1) {
                ++this.width;
                symbol = bitreader.bit() ? symbol.one : symbol.zero;
            }
            this.tick(symbol.integer);
            return symbol.integer;
        }
        catch (Throwable e) {
            throw new JSONException(e);
        }
    }

    public void tick(int value) {
        ++this.symbols[value].weight;
        this.upToDate = false;
    }

    public void tick(int from, int to) {
        for (int value = from; value <= to; ++value) {
            this.tick(value);
        }
    }

    private void write(Symbol symbol, BitWriter bitwriter) throws JSONException {
        try {
            Symbol back = symbol.back;
            if (back != null) {
                ++this.width;
                this.write(back, bitwriter);
                if (back.zero == symbol) {
                    bitwriter.zero();
                } else {
                    bitwriter.one();
                }
            }
        }
        catch (Throwable e) {
            throw new JSONException(e);
        }
    }

    public void write(int value, BitWriter bitwriter) throws JSONException {
        this.width = 0;
        this.write(this.symbols[value], bitwriter);
        this.tick(value);
    }

    private static class Symbol
    implements PostMortem {
        public Symbol back;
        public Symbol next;
        public Symbol zero;
        public Symbol one;
        public final int integer;
        public long weight;

        public Symbol(int integer) {
            this.integer = integer;
            this.weight = 0;
            this.next = null;
            this.back = null;
            this.one = null;
            this.zero = null;
        }

        @Override
        public boolean postMortem(PostMortem pm) {
            boolean result = true;
            Symbol that = (Symbol)pm;
            if (this.integer != that.integer || this.weight != that.weight) {
                return false;
            }
            if (this.back != null != (that.back != null)) {
                return false;
            }
            Symbol zero = this.zero;
            Symbol one = this.one;
            if (zero == null) {
                if (that.zero != null) {
                    return false;
                }
            } else {
                result = zero.postMortem(that.zero);
            }
            if (one == null) {
                if (that.one != null) {
                    return false;
                }
            } else {
                result = one.postMortem(that.one);
            }
            return result;
        }
    }

}

