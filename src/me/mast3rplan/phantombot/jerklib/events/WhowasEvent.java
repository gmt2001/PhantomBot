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
 * Event fired when whowas data received
 *
 * @author mohadib
 */
public class WhowasEvent extends IRCEvent
{

    private final String hostName, userName, nick, realName;

    public WhowasEvent(
            String hostName,
            String userName,
            String nick,
            String realName,
            String rawEventData,
            Session session)
    {
        super(rawEventData, session, Type.WHOWAS_EVENT);
        this.hostName = hostName;
        this.userName = userName;
        this.nick = nick;
        this.realName = realName;
    }

    /**
     * get hostname of whoised user
     *
     * @return hostname
     */
    public String getHostName()
    {
        return hostName;
    }

    /**
     * get nick who was event is about
     *
     * @return nick who was event is about
     */
    public String getNick()
    {
        return nick;
    }

    /**
     * get users realname
     *
     * @return realname
     */
    public String getRealName()
    {
        return realName;
    }

    /**
     * get username
     *
     * @return username
     */
    public String getUserName()
    {
        return userName;
    }
}
