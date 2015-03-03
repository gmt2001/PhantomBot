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
package me.mast3rplan.phantombot.jerklib;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Connection;
import me.mast3rplan.phantombot.jerklib.Session;

public class WriteRequest {
    private final Type type;
    private final String message;
    private final String nick;
    private final Channel channel;
    private final Session session;

    WriteRequest(String message, Session session, String nick) {
        this.type = Type.PRIVATE_MSG;
        this.message = message;
        this.session = session;
        this.nick = nick;
        this.channel = null;
    }

    WriteRequest(String message, Channel channel, Session session) {
        this.type = Type.CHANNEL_MSG;
        this.message = message;
        this.channel = channel;
        this.session = session;
        this.nick = null;
    }

    WriteRequest(String message, Session session) {
        this.type = Type.RAW_MSG;
        this.message = message;
        this.session = session;
        this.channel = null;
        this.nick = null;
    }

    public Type getType() {
        return this.type;
    }

    public String getMessage() {
        return this.message;
    }

    public Channel getChannel() {
        return this.channel;
    }

    public String getNick() {
        return this.nick;
    }

    public Session getSession() {
        return this.session;
    }

    Connection getConnection() {
        return this.session.getConnection();
    }

    public static enum Type {
        CHANNEL_MSG,
        PRIVATE_MSG,
        RAW_MSG;
        

        private Type() {
        }
    }

}

