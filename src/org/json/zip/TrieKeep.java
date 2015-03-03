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

import org.json.Kim;
import org.json.zip.JSONzip;
import org.json.zip.Keep;
import org.json.zip.PostMortem;

class TrieKeep
extends Keep {
    private int[] froms = new int[this.capacity];
    private int[] thrus = new int[this.capacity];
    private Node root;
    private Kim[] kims;

    public TrieKeep(int bits) {
        super(bits);
        this.kims = new Kim[this.capacity];
        this.root = new Node();
    }

    public Kim kim(int integer) {
        Kim kim = this.kims[integer];
        int from = this.froms[integer];
        int thru = this.thrus[integer];
        if (from != 0 || thru != kim.length) {
            kim = new Kim(kim, from, thru);
            this.froms[integer] = 0;
            this.thrus[integer] = kim.length;
            this.kims[integer] = kim;
        }
        return kim;
    }

    public int length(int integer) {
        return this.thrus[integer] - this.froms[integer];
    }

    public int match(Kim kim, int from, int thru) {
        Node node = this.root;
        int best = -1;
        for (int at = from; at < thru && (node = node.get(kim.get(at))) != null; ++at) {
            if (node.integer != -1) {
                best = node.integer;
            }
            ++from;
        }
        return best;
    }

    @Override
    public boolean postMortem(PostMortem pm) {
        boolean result = true;
        TrieKeep that = (TrieKeep)pm;
        if (this.length != that.length) {
            JSONzip.log("\nLength " + this.length + " <> " + that.length);
            return false;
        }
        if (this.capacity != that.capacity) {
            JSONzip.log("\nCapacity " + this.capacity + " <> " + that.capacity);
            return false;
        }
        for (int i = 0; i < this.length; ++i) {
            Kim thatkim;
            Kim thiskim = this.kim(i);
            if (thiskim.equals(thatkim = that.kim(i))) continue;
            JSONzip.log("\n[" + i + "] " + thiskim + " <> " + thatkim);
            result = false;
        }
        return result && this.root.postMortem(that.root);
    }

    public void registerMany(Kim kim) {
        int length = kim.length;
        int limit = this.capacity - this.length;
        if (limit > 40) {
            limit = 40;
        }
        int until = length - 2;
        for (int from = 0; from < until; ++from) {
            int len = length - from;
            if (len > 10) {
                len = 10;
            }
            Node node = this.root;
            for (int at = from; at < (len+=from); ++at) {
                Node next = node.vet(kim.get(at));
                if (next.integer == -1 && at - from >= 2) {
                    next.integer = this.length;
                    this.uses[this.length] = 1;
                    this.kims[this.length] = kim;
                    this.froms[this.length] = from;
                    this.thrus[this.length] = at + 1;
                    ++this.length;
                    if (--limit <= 0) {
                        return;
                    }
                }
                node = next;
            }
        }
    }

    public void registerOne(Kim kim) {
        int integer = this.registerOne(kim, 0, kim.length);
        if (integer != -1) {
            this.kims[integer] = kim;
        }
    }

    public int registerOne(Kim kim, int from, int thru) {
        if (this.length < this.capacity) {
            Node node = this.root;
            for (int at = from; at < thru; ++at) {
                node = node.vet(kim.get(at));
            }
            if (node.integer == -1) {
                int integer = this.length++;
                node.integer = integer;
                this.uses[integer] = 1;
                this.kims[integer] = kim;
                this.froms[integer] = from;
                this.thrus[integer] = thru;
                return integer;
            }
        }
        return -1;
    }

    public void reserve() {
        if (this.capacity - this.length < 40) {
            int to = 0;
            this.root = new Node();
            for (int from = 0; from < this.capacity; ++from) {
                if (this.uses[from] <= 1) continue;
                Kim kim = this.kims[from];
                int thru = this.thrus[from];
                Node node = this.root;
                for (int at = this.froms[from]; at < thru; ++at) {
                    Node next;
                    node = next = node.vet(kim.get(at));
                }
                node.integer = to;
                this.uses[to] = TrieKeep.age(this.uses[from]);
                this.froms[to] = this.froms[from];
                this.thrus[to] = thru;
                this.kims[to] = kim;
                ++to;
            }
            if (this.capacity - to < 40) {
                this.power = 0;
                this.root = new Node();
                to = 0;
            }
            this.length = to;
            for (; to < this.capacity; ++to) {
                this.uses[to] = 0;
                this.kims[to] = null;
                this.froms[to] = 0;
                this.thrus[to] = 0;
            }
        }
    }

    @Override
    public Object value(int integer) {
        return this.kim(integer);
    }

    class Node
    implements PostMortem {
        private int integer;
        private Node[] next;

        public Node() {
            this.integer = -1;
            this.next = null;
        }

        public Node get(int cell) {
            return this.next == null ? null : this.next[cell];
        }

        public Node get(byte cell) {
            return this.get(cell & 255);
        }

        @Override
        public boolean postMortem(PostMortem pm) {
            Node that = (Node)pm;
            if (that == null) {
                JSONzip.log("\nMisalign");
                return false;
            }
            if (this.integer != that.integer) {
                JSONzip.log("\nInteger " + this.integer + " <> " + that.integer);
                return false;
            }
            if (this.next == null) {
                if (that.next == null) {
                    return true;
                }
                JSONzip.log("\nNext is null " + this.integer);
                return false;
            }
            for (int i = 0; i < 256; ++i) {
                Node node = this.next[i];
                if (node != null) {
                    if (node.postMortem(that.next[i])) continue;
                    return false;
                }
                if (that.next[i] == null) continue;
                JSONzip.log("\nMisalign " + i);
                return false;
            }
            return true;
        }

        public void set(int cell, Node node) {
            if (this.next == null) {
                this.next = new Node[256];
            }
            this.next[cell] = node;
        }

        public void set(byte cell, Node node) {
            this.set(cell & 255, node);
        }

        public Node vet(int cell) {
            Node node = this.get(cell);
            if (node == null) {
                node = new Node();
                this.set(cell, node);
            }
            return node;
        }

        public Node vet(byte cell) {
            return this.vet(cell & 255);
        }
    }

}

