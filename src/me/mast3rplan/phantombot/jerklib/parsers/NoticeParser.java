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
import me.mast3rplan.phantombot.jerklib.events.NoticeEvent;

public class NoticeParser implements CommandParser {

	/*
	 *:DIBLET!n=fran@c-68-35-11-181.hsd1.nm.comcast.net NOTICE #me.mast3rplan.phantombot.jerklib :test
	 *:anthony.freenode.net NOTICE mohadib_ :NickServ set your hostname to foo
	 *:DIBLET!n=fran@c-68-35-11-181.hsd1.nm.comcast.net NOTICE #me.mast3rplan.phantombot.jerklib :test
	 *:NickServ!NickServ@services. NOTICE mohadib_ :This nickname is owned by someone else
	 * NOTICE AUTH :*** No identd (auth) response
	 */

    public IRCEvent createEvent(IRCEvent event) {
        Session session = event.getSession();

        String toWho = "";
        String byWho = session.getConnectedHostName();
        Channel chan = null;

        if (!session.isChannelToken(event.arg(0))) {
            toWho = event.arg(0);
            if (toWho.equals("AUTH")) toWho = "";
        } else {
            chan = session.getChannel(event.arg(0));
        }

        if (event.prefix().length() > 0) {
            if (event.prefix().contains("!")) {
                byWho = event.getNick();
            } else {
                byWho = event.prefix();
            }
        }

        return new NoticeEvent
                (
                        event.getRawEventData(),
                        event.getSession(),
                        event.arg(1),
                        toWho,
                        byWho,
                        chan
                );
    }
}
