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

import me.mast3rplan.phantombot.jerklib.events.AwayEvent;
import me.mast3rplan.phantombot.jerklib.events.AwayEvent.EventType;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public class AwayParser implements CommandParser
{

    public IRCEvent createEvent(IRCEvent event)
    {

        /*
         * :swiftco.wa.us.dal.net 306 mohadib__ :You have been marked as being away
         * :swiftco.wa.us.dal.net 305 mohadib__ :You are no longer marked as being away 
         * :card.freenode.net 301 r0bby_ r0bby :foo
         * :calvino.freenode.net 301 jetirc1 jetirc :gone 
         * :jetirc!jetirc@745d63.host 301 jetirc1 :gone for now
         */

        switch (event.numeric())
        {
            case 305:
            {
                return new AwayEvent("", EventType.RETURNED_FROM_AWAY, false, true, event.arg(0), event.getRawEventData(), event.getSession());
            }
            case 306:
            {
                return new AwayEvent("", EventType.WENT_AWAY, true, true, event.arg(0), event.getRawEventData(), event.getSession());
            }
            default:
                return new AwayEvent(event.arg(event.args().size() - 1), EventType.USER_IS_AWAY, true, false, event.arg(event.args().size() - 2), event.getRawEventData(), event.getSession());
        }
    }
}
