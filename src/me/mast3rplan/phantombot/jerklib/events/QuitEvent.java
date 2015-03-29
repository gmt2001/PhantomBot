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

import java.util.List;

/**
 * This is the event fired when someone quits
 *
 * @author mohadib
 */
public class QuitEvent extends IRCEvent
{

    private final String msg;
    private final List<Channel> chanList;

    public QuitEvent(String rawEventData, Session session, String msg, List<Channel> chanList)
    {
        super(rawEventData, session, Type.QUIT);
        this.msg = msg;
        this.chanList = chanList;
    }

    /**
     * getQuitMessage get the quit message
     *
     * @return the quit message
     */
    public final String getQuitMessage()
    {
        return msg;
    }

    /**
     * returns a list of Channel objects the nick who quit was in
     *
     * @return List of channels nick was in
     * @see Channel
     */
    public final List<Channel> getChannelList()
    {
        return chanList;
    }
}
