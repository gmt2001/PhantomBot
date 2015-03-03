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

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.CtcpEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.MessageEvent;
import me.mast3rplan.phantombot.jerklib.parsers.CommandParser;

public class PrivMsgParser
implements CommandParser {
    @Override
    public MessageEvent createEvent(IRCEvent event) {
        Session session = event.getSession();
        IRCEvent.Type type = session.isChannelToken(event.arg(0)) ? IRCEvent.Type.CHANNEL_MESSAGE : IRCEvent.Type.PRIVATE_MESSAGE;
        Channel chan = type == IRCEvent.Type.CHANNEL_MESSAGE ? session.getChannel(event.arg(0)) : null;
        MessageEvent me = new MessageEvent(chan, event.arg(1), event.getRawEventData(), session, type);
        String msg = me.getMessage();
        if (msg.startsWith("\u0001")) {
            return new CtcpEvent(msg.substring(1, msg.length() - 1), me.getMessage(), me.getRawEventData(), me.getChannel(), me.getSession());
        }
        return me;
    }
}

