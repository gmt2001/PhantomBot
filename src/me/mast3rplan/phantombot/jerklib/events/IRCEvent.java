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
import me.mast3rplan.phantombot.jerklib.events.EventToken;

public class IRCEvent
extends EventToken {
    private final Type type;
    private final String data;
    private final Session session;

    public IRCEvent(String data, Session session, Type type) {
        super(data);
        this.type = type;
        this.session = session;
        this.data = data;
    }

    public Type getType() {
        return this.type;
    }

    @Override
    public String getRawEventData() {
        return this.data;
    }

    public Session getSession() {
        return this.session;
    }

    @Override
    public String toString() {
        return this.data;
    }

    public static enum Type {
        TOPIC,
        PRIVATE_MESSAGE,
        CHANNEL_MESSAGE,
        NOTICE,
        MOTD,
        DEFAULT,
        QUIT,
        PART,
        JOIN,
        NICK_CHANGE,
        NICK_IN_USE,
        EXCEPTION,
        SERVER_INFORMATION,
        CONNECT_COMPLETE,
        UPDATE_HOST_NAME,
        JOIN_COMPLETE,
        MODE_EVENT,
        KICK_EVENT,
        NICK_LIST_EVENT,
        WHO_EVENT,
        WHOIS_EVENT,
        WHOWAS_EVENT,
        CHANNEL_LIST_EVENT,
        INVITE_EVENT,
        SERVER_VERSION_EVENT,
        AWAY_EVENT,
        ERROR,
        CTCP_EVENT,
        CONNECTION_LOST;
        

        private Type() {
        }
    }

}

