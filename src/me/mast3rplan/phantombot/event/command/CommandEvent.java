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
package me.mast3rplan.phantombot.event.command;

import java.util.Iterator;
import java.util.LinkedList;
import me.mast3rplan.phantombot.event.Event;

public class CommandEvent
extends Event {
    private String sender;
    private String command;
    private String arguments;
    private String[] args;

    public CommandEvent(String sender, String command, String arguments) {
        this.sender = sender;
        this.command = command;
        this.arguments = arguments;
        LinkedList<String> tmpArgs = new LinkedList<String>();
        boolean inquote = false;
        String tmpStr = "";
        for (char c : arguments.toCharArray()) {
            if (c == '\"') {
                inquote = !inquote;
                continue;
            }
            if (!(inquote || c != ' ')) {
                if (tmpStr.length() <= 0) continue;
                tmpArgs.add(tmpStr);
                tmpStr = "";
                continue;
            }
            tmpStr = tmpStr + c;
        }
        if (tmpStr.length() > 0) {
            tmpArgs.add(tmpStr);
        }
        this.args = new String[tmpArgs.size()];
        int i = 0;
        Iterator i$ = tmpArgs.iterator();
        while (i$.hasNext()) {
            String s;
            this.args[i] = s = (String)i$.next();
            ++i;
        }
    }

    public String getSender() {
        return this.sender;
    }

    public String getCommand() {
        return this.command;
    }

    public String[] getArgs() {
        return this.args;
    }

    public String getArguments() {
        return this.arguments;
    }
}

