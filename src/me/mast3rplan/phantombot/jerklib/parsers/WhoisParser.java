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
package me.mast3rplan.phantombot.jerklib.parsers;

import java.util.Arrays;
import java.util.List;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.WhoisEvent;
import me.mast3rplan.phantombot.jerklib.parsers.CommandParser;

public class WhoisParser
implements CommandParser {
    private WhoisEvent we;

    @Override
    public IRCEvent createEvent(IRCEvent event) {
        switch (event.numeric()) {
            case 311: {
                this.we = new WhoisEvent(event.arg(0), event.arg(4), event.arg(1), event.arg(2), event.getRawEventData(), event.getSession());
                break;
            }
            case 319: {
                if (this.we == null) break;
                List<String> chanNames = Arrays.asList(event.arg(2).split("\\s+"));
                this.we.setChannelNamesList(chanNames);
                this.we.appendRawEventData(event.getRawEventData());
                break;
            }
            case 312: {
                if (this.we == null) break;
                this.we.setWhoisServer(event.arg(2));
                this.we.setWhoisServerInfo(event.arg(3));
                this.we.appendRawEventData(event.getRawEventData());
                break;
            }
            case 320: {
                if (this.we == null) break;
                this.we.appendRawEventData(event.getRawEventData());
                break;
            }
            case 317: {
                if (this.we == null) break;
                this.we.setSignOnTime(Integer.parseInt(event.arg(3)));
                this.we.setSecondsIdle(Integer.parseInt(event.arg(2)));
                this.we.appendRawEventData(event.getRawEventData());
                break;
            }
            case 318: {
                if (this.we == null) break;
                this.we.appendRawEventData(event.getRawEventData());
                return this.we;
            }
        }
        return event;
    }
}

