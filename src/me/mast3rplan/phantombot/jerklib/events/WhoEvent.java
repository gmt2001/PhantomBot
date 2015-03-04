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

/**
 * Created: Jan 31, 2008 6:31:31 PM
 *
 * @author <a href="mailto:robby.oconnor@gmail.com">Robert O'Connor</a>
 * @see me.mast3rplan.phantombot.jerklib.events.WhoEvent
 */
public class WhoEvent extends IRCEvent {
    private final String nick, userName, realName, hostName, channel;
    private final String serverName;
    private final boolean isAway;
    private final int hopCount;

    public WhoEvent
            (
                    String channel,
                    int hopCount,
                    String hostName,
                    boolean away,
                    String nick,
                    String rawEventData,
                    String realName,
                    String serverName,
                    Session session,
                    String userName
            ) {
        super(rawEventData, session, Type.WHO_EVENT);
        this.channel = channel;
        this.hopCount = hopCount;
        this.hostName = hostName;
        isAway = away;
        this.nick = nick;
        this.realName = realName;
        this.serverName = serverName;
        this.userName = userName;
    }

    /**
     * Get the nick of the user
     *
     * @return the nick of the user.
     */
    public String getNick() {
        return nick;
    }

    /**
     * Get the username of the user
     *
     * @return the username
     */
    public String getUserName() {
        return userName;
    }

    /**
     * Get the hostname of the user
     *
     * @return the hostname
     */
    public String getHostName() {
        return hostName;
    }

    /**
     * Get the real name of the user.
     *
     * @return the real name
     */
    public String getRealName() {
        return realName;
    }

    /**
     * Retrieve the channel (for when you WHO a channel)
     *
     * @return the channel or an empty String
     */
    public String getChannel() {
        return channel.equals("*") ? "" : channel;
    }

    /**
     * Get whether or not the user is away.
     *
     * @return whether or not the user is away.
     */
    public boolean isAway() {
        return isAway;
    }


    /**
     * Returns the number of hops between you and the user.
     *
     * @return the hop count
     */
    public int getHopCount() {
        return hopCount;
    }


    /**
     * Get the server the user is on.
     *
     * @return the server.
     */
    public String getServerName() {
        return serverName;
    }
}
