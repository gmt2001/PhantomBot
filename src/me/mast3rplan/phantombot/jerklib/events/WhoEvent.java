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

public class WhoEvent
extends IRCEvent {
    private final String nick;
    private final String userName;
    private final String realName;
    private final String hostName;
    private final String channel;
    private final String serverName;
    private final boolean isAway;
    private final int hopCount;

    public WhoEvent(String channel, int hopCount, String hostName, boolean away, String nick, String rawEventData, String realName, String serverName, Session session, String userName) {
        super(rawEventData, session, IRCEvent.Type.WHO_EVENT);
        this.channel = channel;
        this.hopCount = hopCount;
        this.hostName = hostName;
        this.isAway = away;
        this.nick = nick;
        this.realName = realName;
        this.serverName = serverName;
        this.userName = userName;
    }

    @Override
    public String getNick() {
        return this.nick;
    }

    @Override
    public String getUserName() {
        return this.userName;
    }

    @Override
    public String getHostName() {
        return this.hostName;
    }

    public String getRealName() {
        return this.realName;
    }

    public String getChannel() {
        return this.channel.equals("*") ? "" : this.channel;
    }

    public boolean isAway() {
        return this.isAway;
    }

    public int getHopCount() {
        return this.hopCount;
    }

    public String getServerName() {
        return this.serverName;
    }
}

