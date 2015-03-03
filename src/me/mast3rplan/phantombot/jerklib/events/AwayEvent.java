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

import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public class AwayEvent
extends IRCEvent {
    private final boolean isAway;
    private final boolean isYou;
    private final String awayMessage;
    private final String nick;
    private EventType eventType;

    public AwayEvent(String awayMessage, EventType eventType, boolean away, boolean you, String nick, String rawEventData, Session session) {
        super(rawEventData, session, IRCEvent.Type.AWAY_EVENT);
        this.awayMessage = awayMessage;
        this.eventType = eventType;
        this.isAway = away;
        this.isYou = you;
        this.nick = nick;
    }

    public String getAwayMessage() {
        return this.awayMessage;
    }

    public boolean isAway() {
        return this.isAway;
    }

    public boolean isYou() {
        return this.isYou;
    }

    @Override
    public String getNick() {
        return this.nick;
    }

    public EventType getEventType() {
        return this.eventType;
    }

    public static enum EventType {
        WENT_AWAY,
        RETURNED_FROM_AWAY,
        USER_IS_AWAY;
        

        private EventType() {
        }
    }

}

