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

import java.util.List;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.KickEvent;
import me.mast3rplan.phantombot.jerklib.parsers.CommandParser;

public class KickParser
implements CommandParser {
    @Override
    public IRCEvent createEvent(IRCEvent event) {
        Session session = event.getSession();
        Channel channel = session.getChannel(event.arg(0));
        String msg = "";
        if (event.args().size() == 3) {
            msg = event.arg(2);
        }
        return new KickEvent(event.getRawEventData(), session, event.getNick(), event.arg(1), msg, channel);
    }
}

