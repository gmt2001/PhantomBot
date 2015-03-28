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
package me.mast3rplan.phantombot;

import java.util.Iterator;
import java.util.List;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelJoinEvent;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelLeaveEvent;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelUserModeEvent;
import me.mast3rplan.phantombot.event.irc.complete.IrcConnectCompleteEvent;
import me.mast3rplan.phantombot.event.irc.complete.IrcJoinCompleteEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcChannelMessageEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcPrivateMessageEvent;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.*;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;

public class IrcEventHandler implements IRCEventListener
{

    @Override
    public void receiveEvent(IRCEvent event)
    {
        EventBus eventBus = EventBus.instance();
        Session session = event.getSession();

        switch (event.getType())
        {
            case CONNECT_COMPLETE:
                com.gmt2001.Console.out.println("Connected to IRC " + session.getNick() + "@" + session.getConnectedHostName());
                eventBus.post(new IrcConnectCompleteEvent(session));
                break;
            case JOIN_COMPLETE:
                com.gmt2001.Console.out.println("Channel Joined [" + ((JoinCompleteEvent) event).getChannel().getName() + "]");
                eventBus.post(new IrcJoinCompleteEvent(session, ((JoinCompleteEvent) event).getChannel()));
                break;
            case JOIN:
                JoinEvent joinEvent = (JoinEvent) event;
                com.gmt2001.Console.out.println("User Joined Channel [" + joinEvent.getChannelName() + "] " + joinEvent.getNick());
                eventBus.post(new IrcChannelJoinEvent(session, joinEvent.getChannel(), joinEvent.getNick()));
                break;
            case PART:
                PartEvent partEvent = (PartEvent) event;
                com.gmt2001.Console.out.println("User Left Channel [" + partEvent.getChannelName() + "] " + partEvent.getNick());
                eventBus.post(new IrcChannelLeaveEvent(session, partEvent.getChannel(), partEvent.getNick(), partEvent.getPartMessage()));
                break;
            case CHANNEL_MESSAGE:
                MessageEvent cmessageEvent = (MessageEvent) event;
                com.gmt2001.Console.out.println("Message from Channel [" + cmessageEvent.getChannel().getName() + "] " + cmessageEvent.getNick());
                Channel cchannel = cmessageEvent.getChannel();
                String cusername = cmessageEvent.getNick();
                String cmessage = cmessageEvent.getMessage();

                eventBus.post(new IrcChannelMessageEvent(session, cusername, cmessage, cchannel));
                break;
            case PRIVATE_MESSAGE:
                MessageEvent pmessageEvent = (MessageEvent) event;
                String pusername = pmessageEvent.getNick();
                String pmessage = pmessageEvent.getMessage();

                eventBus.post(new IrcPrivateMessageEvent(session, pusername, pmessage));
                break;
            case MODE_EVENT:
                ModeEvent modeEvent = (ModeEvent) event;

                if (modeEvent.getChannel() != null && modeEvent.getChannel().getName().length() > 1
                        && modeEvent.getModeType() == ModeEvent.ModeType.CHANNEL)
                {
                    List<ModeAdjustment> l = modeEvent.getModeAdjustments();
                    Iterator it = l.iterator();

                    while (it.hasNext())
                    {
                        ModeAdjustment adj = (ModeAdjustment) it.next();

                        com.gmt2001.Console.out.println("MODE [" + modeEvent.getChannel().getName() + "] " + adj.toString());

                        if (adj.getArgument().length() > 0)
                        {
                            eventBus.post(new IrcChannelUserModeEvent(session, modeEvent.getChannel(), adj.getArgument(),
                                    String.valueOf(adj.getMode()), adj.getAction() == ModeAdjustment.Action.PLUS));
                        }
                    }
                }
                break;
        }
    }
}
