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

import java.util.Date;

/**
 * Event fired when topic is received
 *
 * @author mohadib
 * @see Channel
 */
public class TopicEvent extends IRCEvent
{

    private String setBy, hostname;
    private Date setWhen;
    private Channel channel;
    private StringBuffer buff = new StringBuffer();

    public TopicEvent(String rawEventData, Session session, Channel channel, String topic)
    {
        super(rawEventData, session, Type.TOPIC);
        this.channel = channel;
        buff.append(topic);
    }

    /**
     * Gets the topic
     *
     * @return the topic
     */
    public String getTopic()
    {
        return buff.toString();
    }

    /**
     * @return hostname
     */
    public String getHostName()
    {
        return hostname;
    }

    /**
     * @param setWhen
     */
    public void setSetWhen(String setWhen)
    {
        this.setWhen = new Date(1000L * Long.parseLong(setWhen));
    }

    /**
     * @param setBy
     */
    public void setSetBy(String setBy)
    {
        this.setBy = setBy;
    }

    /**
     * Gets who set the topic
     *
     * @return topic setter
     */
    public String getSetBy()
    {
        return setBy;
    }

    /**
     * Gets when topic was set
     *
     * @return when
     */
    public Date getSetWhen()
    {
        return setWhen;
    }

    /* (non-Javadoc)
     * @see me.mast3rplan.phantombot.jerklib.events.TopicEvent#getChannel()
     */
    public Channel getChannel()
    {
        return channel;
    }

    /**
     * @param topic
     */
    public void appendToTopic(String topic)
    {
        buff.append(topic);
    }

    /* (non-Javadoc)
     * @see java.lang.Object#hashCode()
     */
    public int hashCode()
    {
        return channel.hashCode();
    }

    /* (non-Javadoc)
     * @see java.lang.Object#equals(java.lang.Object)
     */
    public boolean equals(Object o)
    {
        if (o == this)
        {
            return true;
        }
        if (o instanceof TopicEvent && o.hashCode() == hashCode())
        {
            return ((TopicEvent) o).getChannel().equals(getChannel());
        }
        return false;
    }
}
