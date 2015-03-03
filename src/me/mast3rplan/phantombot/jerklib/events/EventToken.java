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
package me.mast3rplan.phantombot.jerklib.events;

import java.util.ArrayList;
import java.util.List;

public class EventToken {
    private final String data;
    private String prefix = "";
    private String command = "";
    private List<String> arguments = new ArrayList<String>();
    private int offset = 0;

    public EventToken(String data) {
        this.data = data;
        this.parse();
    }

    private void parse() {
        int idx;
        if (this.data.length() == 0) {
            return;
        }
        if (this.data.startsWith(":")) {
            this.extractPrefix(this.data);
            this.incTillChar();
        }
        if (this.data.length() > this.offset && (idx = this.data.indexOf(" ", this.offset)) >= 0) {
            this.command = this.data.substring(this.offset, idx);
            this.offset+=this.command.length();
        }
        this.incTillChar();
        this.extractArguments();
    }

    private void extractArguments() {
        String argument = "";
        for (int i = this.offset; i < this.data.length(); ++i) {
            if (!Character.isWhitespace(this.data.charAt(i))) {
                if ((argument = argument + this.data.charAt(i)).length() == 1 && argument.equals(":")) {
                    argument = this.data.substring(i + 1);
                    this.arguments.add(argument);
                    return;
                }
                ++this.offset;
                continue;
            }
            if (argument.length() > 0) {
                this.arguments.add(argument);
                argument = "";
            }
            ++this.offset;
        }
        if (argument.length() != 0) {
            this.arguments.add(argument);
        }
    }

    private void incTillChar() {
        for (int i = this.offset; i < this.data.length(); ++i) {
            if (!Character.isWhitespace(this.data.charAt(i))) {
                return;
            }
            ++this.offset;
        }
    }

    private void extractPrefix(String data) {
        this.prefix = data.substring(1, data.indexOf(" "));
        this.offset+=this.prefix.length() + 1;
    }

    public String getHostName() {
        int index = this.prefix.indexOf(64);
        if (index != -1 && index + 1 < this.prefix.length()) {
            return this.prefix.substring(index + 1);
        }
        return "";
    }

    public String getUserName() {
        int sindex = this.prefix.indexOf(33);
        int eindex = this.prefix.indexOf("@");
        if (eindex == -1) {
            eindex = this.prefix.length() - 1;
        }
        if (sindex != -1 && sindex + 1 < this.prefix.length()) {
            return this.prefix.substring(sindex + 1, eindex);
        }
        return "";
    }

    public String getNick() {
        if (this.prefix.indexOf("!") != -1) {
            return this.prefix.substring(0, this.prefix.indexOf(33));
        }
        return "";
    }

    public String prefix() {
        return this.prefix;
    }

    public String command() {
        return this.command;
    }

    public List<String> args() {
        return this.arguments;
    }

    public String arg(int index) {
        if (index < this.arguments.size()) {
            return this.arguments.get(index);
        }
        return null;
    }

    public String getRawEventData() {
        return this.data;
    }

    public int numeric() {
        int i = -1;
        try {
            i = Integer.parseInt(this.command);
        }
        catch (NumberFormatException e) {
            // empty catch block
        }
        return i;
    }

    public String toString() {
        return this.data;
    }
}

