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
package me.mast3rplan.phantombot.jerklib.listeners;

import java.util.logging.Logger;
import me.mast3rplan.phantombot.jerklib.events.AwayEvent;
import me.mast3rplan.phantombot.jerklib.events.ChannelListEvent;
import me.mast3rplan.phantombot.jerklib.events.ConnectionCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.CtcpEvent;
import me.mast3rplan.phantombot.jerklib.events.ErrorEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.InviteEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinEvent;
import me.mast3rplan.phantombot.jerklib.events.KickEvent;
import me.mast3rplan.phantombot.jerklib.events.MessageEvent;
import me.mast3rplan.phantombot.jerklib.events.ModeEvent;
import me.mast3rplan.phantombot.jerklib.events.MotdEvent;
import me.mast3rplan.phantombot.jerklib.events.NickChangeEvent;
import me.mast3rplan.phantombot.jerklib.events.NickInUseEvent;
import me.mast3rplan.phantombot.jerklib.events.NickListEvent;
import me.mast3rplan.phantombot.jerklib.events.NoticeEvent;
import me.mast3rplan.phantombot.jerklib.events.PartEvent;
import me.mast3rplan.phantombot.jerklib.events.QuitEvent;
import me.mast3rplan.phantombot.jerklib.events.ServerInformationEvent;
import me.mast3rplan.phantombot.jerklib.events.ServerVersionEvent;
import me.mast3rplan.phantombot.jerklib.events.TopicEvent;
import me.mast3rplan.phantombot.jerklib.events.WhoEvent;
import me.mast3rplan.phantombot.jerklib.events.WhoisEvent;
import me.mast3rplan.phantombot.jerklib.events.WhowasEvent;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;

public abstract class DefaultIRCEventListener
implements IRCEventListener {
    protected Logger log;

    public DefaultIRCEventListener() {
        this.log = Logger.getLogger(this.getClass().getName());
    }

    @Override
    public void receiveEvent(IRCEvent e) {
        IRCEvent.Type t = e.getType();
        boolean handled = this.handleChannelEvents(t, e);
        handled|=this.handleServerEvents(t, e);
        if (!(handled|=this.handleOnChannelEvents(t, e))) {
            this.log.info("Unhandled event: " + e.getRawEventData());
        }
    }

    protected boolean handleChannelEvents(IRCEvent.Type t, IRCEvent e) {
        if (IRCEvent.Type.TOPIC.equals((Object)t)) {
            this.handleTopicEvent((TopicEvent)e);
            return true;
        }
        if (IRCEvent.Type.AWAY_EVENT.equals((Object)t)) {
            this.handleAwayEvent((AwayEvent)e);
            return true;
        }
        if (IRCEvent.Type.CHANNEL_LIST_EVENT.equals((Object)t)) {
            this.handleChannelListEvent((ChannelListEvent)e);
            return true;
        }
        if (IRCEvent.Type.CHANNEL_MESSAGE.equals((Object)t)) {
            this.handleChannelMessage((MessageEvent)e);
            return true;
        }
        if (IRCEvent.Type.NICK_CHANGE.equals((Object)t)) {
            this.handleNickChangeEvent((NickChangeEvent)e);
            return true;
        }
        if (IRCEvent.Type.NICK_IN_USE.equals((Object)t)) {
            this.handleNickInUseEvent((NickInUseEvent)e);
            return true;
        }
        if (IRCEvent.Type.PRIVATE_MESSAGE.equals((Object)t)) {
            this.handlePrivateMessage((MessageEvent)e);
            return true;
        }
        return false;
    }

    protected boolean handleServerEvents(IRCEvent.Type t, IRCEvent e) {
        if (IRCEvent.Type.CONNECT_COMPLETE.equals((Object)t)) {
            this.handleConnectComplete((ConnectionCompleteEvent)e);
            return true;
        }
        if (IRCEvent.Type.CTCP_EVENT.equals((Object)t)) {
            this.handleCtcpEvent((CtcpEvent)e);
            return true;
        }
        if (IRCEvent.Type.ERROR.equals((Object)t)) {
            this.handleErrorEvent((ErrorEvent)e);
            return true;
        }
        if (IRCEvent.Type.INVITE_EVENT.equals((Object)t)) {
            this.handleInviteEvent((InviteEvent)e);
            return true;
        }
        if (IRCEvent.Type.JOIN.equals((Object)t)) {
            this.handleJoinEvent((JoinEvent)e);
            return true;
        }
        if (IRCEvent.Type.JOIN_COMPLETE.equals((Object)t)) {
            this.handleJoinCompleteEvent((JoinCompleteEvent)e);
            return true;
        }
        if (IRCEvent.Type.MOTD.equals((Object)t)) {
            this.handleMotdEvent((MotdEvent)e);
            return true;
        }
        if (IRCEvent.Type.NOTICE.equals((Object)t)) {
            this.handleNoticeEvent((NoticeEvent)e);
            return true;
        }
        if (IRCEvent.Type.SERVER_INFORMATION.equals((Object)t)) {
            this.handleServerInformationEvent((ServerInformationEvent)e);
            return true;
        }
        if (IRCEvent.Type.SERVER_VERSION_EVENT.equals((Object)t)) {
            this.handleServerVersionEvent((ServerVersionEvent)e);
            return true;
        }
        return false;
    }

    protected boolean handleOnChannelEvents(IRCEvent.Type t, IRCEvent e) {
        if (IRCEvent.Type.KICK_EVENT.equals((Object)t)) {
            this.handleKickEvent((KickEvent)e);
            return true;
        }
        if (IRCEvent.Type.MODE_EVENT.equals((Object)t)) {
            this.handleModeEvent((ModeEvent)e);
            return true;
        }
        if (IRCEvent.Type.NICK_LIST_EVENT.equals((Object)t)) {
            this.handleNickListEvent((NickListEvent)e);
            return true;
        }
        if (IRCEvent.Type.PART.equals((Object)t)) {
            this.handlePartEvent((PartEvent)e);
            return true;
        }
        if (IRCEvent.Type.QUIT.equals((Object)t)) {
            this.handleQuitEvent((QuitEvent)e);
            return true;
        }
        if (IRCEvent.Type.WHO_EVENT.equals((Object)t)) {
            this.handleWhoEvent((WhoEvent)e);
            return true;
        }
        if (IRCEvent.Type.WHOIS_EVENT.equals((Object)t)) {
            this.handleWhoisEvent((WhoisEvent)e);
            return true;
        }
        if (IRCEvent.Type.WHOWAS_EVENT.equals((Object)t)) {
            this.handleWhowasEvent((WhowasEvent)e);
            return true;
        }
        return false;
    }

    protected void handleWhowasEvent(WhowasEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleWhoisEvent(WhoisEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleWhoEvent(WhoEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleTopicEvent(TopicEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleServerVersionEvent(ServerVersionEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handlePrivateMessage(MessageEvent event) {
        this.handleChannelMessage(event);
    }

    protected void handleServerInformationEvent(ServerInformationEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleQuitEvent(QuitEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handlePartEvent(PartEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleNoticeEvent(NoticeEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleNickListEvent(NickListEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleNickInUseEvent(NickInUseEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleNickChangeEvent(NickChangeEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleMotdEvent(MotdEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleModeEvent(ModeEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleKickEvent(KickEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleJoinCompleteEvent(JoinCompleteEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleJoinEvent(JoinEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleInviteEvent(InviteEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleErrorEvent(ErrorEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleCtcpEvent(CtcpEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleConnectComplete(ConnectionCompleteEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleChannelMessage(MessageEvent event) {
        this.log.finest(event.getRawEventData());
    }

    protected void handleChannelListEvent(ChannelListEvent e) {
        this.log.finest(e.getRawEventData());
    }

    protected void handleAwayEvent(AwayEvent e) {
        this.log.finest(e.getRawEventData());
    }
}

