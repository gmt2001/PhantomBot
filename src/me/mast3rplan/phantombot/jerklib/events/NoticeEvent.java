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

public class NoticeEvent
extends IRCEvent {
    private final String message;
    private final String toWho;
    private final String byWho;
    private final Channel channel;

    public NoticeEvent(String rawEventData, Session session, String message, String toWho, String byWho, Channel channel) {
        super(rawEventData, session, IRCEvent.Type.NOTICE);
        this.message = message;
        this.toWho = toWho;
        this.byWho = byWho;
        this.channel = channel;
    }

    public String getNoticeMessage() {
        return this.message;
    }

    public String byWho() {
        return this.byWho;
    }

    public Channel getChannel() {
        return this.channel;
    }

    public String toWho() {
        return this.toWho;
    }
}

