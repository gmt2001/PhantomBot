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

import java.util.Date;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public class TopicEvent
extends IRCEvent {
    private String setBy;
    private String hostname;
    private Date setWhen;
    private Channel channel;
    private StringBuffer buff = new StringBuffer();

    public TopicEvent(String rawEventData, Session session, Channel channel, String topic) {
        super(rawEventData, session, IRCEvent.Type.TOPIC);
        this.channel = channel;
        this.buff.append(topic);
    }

    public String getTopic() {
        return this.buff.toString();
    }

    @Override
    public String getHostName() {
        return this.hostname;
    }

    public void setSetWhen(String setWhen) {
        this.setWhen = new Date(1000 * Long.parseLong(setWhen));
    }

    public void setSetBy(String setBy) {
        this.setBy = setBy;
    }

    public String getSetBy() {
        return this.setBy;
    }

    public Date getSetWhen() {
        return this.setWhen;
    }

    public Channel getChannel() {
        return this.channel;
    }

    public void appendToTopic(String topic) {
        this.buff.append(topic);
    }

    public int hashCode() {
        return this.channel.hashCode();
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (o instanceof TopicEvent && o.hashCode() == this.hashCode()) {
            return ((TopicEvent)o).getChannel().equals(this.getChannel());
        }
        return false;
    }
}

