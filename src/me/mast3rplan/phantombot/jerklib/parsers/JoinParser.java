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
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinEvent;

/**
 * @author mohadib
 */
public class JoinParser implements CommandParser {

    // :r0bby!n=wakawaka@guifications/user/r0bby JOIN :#me.mast3rplan.phantombot.jerklib
    // :mohadib_!~mohadib@68.35.11.181 JOIN &test

    public IRCEvent createEvent(IRCEvent event) {
        Session session = event.getSession();

        if (!event.getNick().equalsIgnoreCase(event.getSession().getNick())) {
            //someone else joined a channel we are in
            return new JoinEvent(event.getRawEventData(), session, session.getChannel(event.arg(0)));
        }

        //we joined a channel
        return new JoinCompleteEvent(event.getRawEventData(), event.getSession(), new Channel(event.arg(0), event.getSession()));
    }
}
