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

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public class PartEvent
extends IRCEvent {
    private final String who;
    private final String partMessage;
    private final Channel channel;

    public PartEvent(String rawEventData, Session session, String who, Channel channel, String partMessage) {
        super(rawEventData, session, IRCEvent.Type.PART);
        this.channel = channel;
        this.who = who;
        this.partMessage = partMessage;
    }

    @Override
    public final String getNick() {
        return this.who;
    }

    public final String getChannelName() {
        return this.channel.getName();
    }

    public final Channel getChannel() {
        return this.channel;
    }

    public final String getPartMessage() {
        return this.partMessage;
    }
}

