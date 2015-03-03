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
import java.util.List;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public class WhoisEvent
extends IRCEvent {
    private final String host;
    private final String user;
    private final String realName;
    private final String nick;
    private String whoisServer;
    private String whoisServerInfo;
    private List<String> channelNames;
    private boolean isOp;
    private long secondsIdle;
    private int signOnTime;

    public WhoisEvent(String nick, String realName, String user, String host, String rawEventData, Session session) {
        super(rawEventData, session, IRCEvent.Type.WHOIS_EVENT);
        this.nick = nick;
        this.realName = realName;
        this.user = user;
        this.host = host;
    }

    public List<String> getChannelNames() {
        return this.channelNames;
    }

    public void setChannelNamesList(List<String> chanNames) {
        this.channelNames = chanNames;
    }

    public String getHost() {
        return this.host;
    }

    public String getUser() {
        return this.user;
    }

    public String getRealName() {
        return this.realName;
    }

    @Override
    public String getNick() {
        return this.nick;
    }

    public boolean isAnOperator() {
        return this.isOp;
    }

    public boolean isIdle() {
        return this.secondsIdle > 0;
    }

    public long secondsIdle() {
        return this.secondsIdle;
    }

    public void setSecondsIdle(int secondsIdle) {
        this.secondsIdle = this.secondsIdle();
    }

    public Date signOnTime() {
        return new Date(1000 * (long)this.signOnTime);
    }

    public void setSignOnTime(int signOnTime) {
        this.signOnTime = signOnTime;
    }

    public String whoisServer() {
        return this.whoisServer;
    }

    public void setWhoisServer(String whoisServer) {
        this.whoisServer = whoisServer;
    }

    public String whoisServerInfo() {
        return this.whoisServerInfo;
    }

    public void setWhoisServerInfo(String whoisServerInfo) {
        this.whoisServerInfo = whoisServerInfo;
    }

    public void appendRawEventData(String rawEventData) {
    }
}

