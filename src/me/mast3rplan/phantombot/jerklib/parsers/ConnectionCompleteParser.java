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

import me.mast3rplan.phantombot.jerklib.events.ConnectionCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public class ConnectionCompleteParser implements CommandParser
{

    /* :irc.nmglug.org 001 namnar :Welcome to the nmglug.org 
	 	
     Lets user know channels can now be joined etc.
	 	
     Lets user update *records* 
     A requested connection to irc.freenode.net might actually
     connect to kubrick.freenode.net etc 
     */
    public ConnectionCompleteEvent createEvent(IRCEvent event)
    {
        return new ConnectionCompleteEvent(
                event.getRawEventData(),
                event.prefix(), // actual hostname
                event.getSession(),
                event.getSession().getConnectedHostName() // requested hostname
                );
    }
}
