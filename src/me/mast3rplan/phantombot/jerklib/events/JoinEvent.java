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

/**
 * JoinIRCEvent is the event that will be dispatched when someone joins a channel
 *
 * @author mohadib
 */
public class JoinEvent extends IRCEvent {

    private final String channelName;
    private final Channel chan;

    public JoinEvent
            (
                    String rawEventData,
                    Session session,
                    Channel chan
            ) {
        super(rawEventData, session, Type.JOIN);
        this.channelName = chan.getName();
        this.chan = chan;
    }

    /**
     * returns the name of the channel joined to cause this event
     *
     * @return Name of channel
     */
    public final String getChannelName() {
        return channelName;
    }

    /**
     * returns the Channel object joined
     *
     * @return The Channel object
     * @see Channel
     */
    public final Channel getChannel() {
        return chan;
    }
}
