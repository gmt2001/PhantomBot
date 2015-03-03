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
package me.mast3rplan.phantombot.jerklib;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Connection;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.RequestedConnection;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.ConnectionCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinEvent;
import me.mast3rplan.phantombot.jerklib.events.KickEvent;
import me.mast3rplan.phantombot.jerklib.events.ModeEvent;
import me.mast3rplan.phantombot.jerklib.events.NickChangeEvent;
import me.mast3rplan.phantombot.jerklib.events.NickInUseEvent;
import me.mast3rplan.phantombot.jerklib.events.PartEvent;
import me.mast3rplan.phantombot.jerklib.events.QuitEvent;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;

public class DefaultInternalEventHandler
implements IRCEventListener {
    private ConnectionManager manager;
    private Map<IRCEvent.Type, IRCEventListener> stratMap = new HashMap<IRCEvent.Type, IRCEventListener>();
    private Logger log;

    public DefaultInternalEventHandler(ConnectionManager manager) {
        this.log = Logger.getLogger(this.getClass().getName());
        this.manager = manager;
        this.initStratMap();
    }

    public void addEventHandler(IRCEvent.Type type, IRCEventListener listener) {
        this.stratMap.put(type, listener);
    }

    public boolean removeEventHandler(IRCEvent.Type type) {
        return this.stratMap.remove((Object)type) != null;
    }

    public IRCEventListener getEventHandler(IRCEvent.Type type) {
        return this.stratMap.get((Object)type);
    }

    @Override
    public void receiveEvent(IRCEvent event) {
        IRCEventListener l = this.stratMap.get((Object)event.getType());
        if (l != null) {
            l.receiveEvent(event);
        } else {
            String command = event.command();
            if (command.equals("PING")) {
                event.getSession().getConnection().pong(event);
            } else if (command.equals("PONG")) {
                event.getSession().getConnection().gotPong();
            }
        }
        this.manager.addToRelayList(event);
    }

    public void joinComplete(IRCEvent e) {
        JoinCompleteEvent jce = (JoinCompleteEvent)e;
        if (e.getSession().getChannel(jce.getChannel().getName()) == null) {
            e.getSession().addChannel(jce.getChannel());
            jce.getSession().sayRaw("MODE " + jce.getChannel().getName());
        }
    }

    public void join(IRCEvent e) {
        JoinEvent je = (JoinEvent)e;
        je.getChannel().addNick(je.getNick());
    }

    public void quit(IRCEvent e) {
        QuitEvent qe = (QuitEvent)e;
        e.getSession().removeNickFromAllChannels(qe.getNick());
    }

    public void part(IRCEvent e) {
        PartEvent pe = (PartEvent)e;
        if (!pe.getChannel().removeNick(pe.getNick())) {
            this.log.severe("Could Not remove nick " + pe.getNick() + " from " + pe.getChannelName());
        }
        if (pe.getNick().equalsIgnoreCase(e.getSession().getNick())) {
            pe.getSession().removeChannel(pe.getChannel());
        }
    }

    public void nick(IRCEvent e) {
        NickChangeEvent nce = (NickChangeEvent)e;
        e.getSession().nickChanged(nce.getOldNick(), nce.getNewNick());
        if (nce.getOldNick().equals(e.getSession().getNick())) {
            Profile p = e.getSession().getRequestedConnection().getProfile();
            p.setActualNick(nce.getNewNick());
            p.setFirstNick(nce.getNewNick());
        }
    }

    public void nickInUse(IRCEvent e) {
        Session session = e.getSession();
        if (!session.isLoggedIn() && session.getShouldUseAltNicks()) {
            Profile p = session.getRequestedConnection().getProfile();
            NickInUseEvent niu = (NickInUseEvent)e;
            String usedNick = niu.getInUseNick();
            String newNick = "";
            if (usedNick.equals(p.getFirstNick())) {
                if (p.getFirstNick().equals(p.getSecondNick())) {
                    return;
                }
                newNick = p.getSecondNick();
            } else if (usedNick.equals(p.getSecondNick())) {
                if (p.getSecondNick().equals(p.getThirdNick())) {
                    return;
                }
                newNick = p.getThirdNick();
            }
            if (newNick.length() > 0) {
                session.changeNick(newNick);
            }
        }
    }

    public void kick(IRCEvent e) {
        KickEvent ke = (KickEvent)e;
        if (!ke.getChannel().removeNick(ke.getWho())) {
            this.log.info("COULD NOT REMOVE NICK " + ke.getWho() + " from channel " + ke.getChannel().getName());
        }
        Session session = e.getSession();
        if (ke.getWho().equals(session.getNick())) {
            session.removeChannel(ke.getChannel());
            if (session.isRejoinOnKick()) {
                session.join(ke.getChannel().getName());
            }
        }
    }

    public void connectionComplete(IRCEvent e) {
        String profileNick;
        Session session = e.getSession();
        String nick = e.arg(0);
        if (!nick.equalsIgnoreCase(profileNick = session.getNick())) {
            Profile pi = session.getRequestedConnection().getProfile();
            pi.setActualNick(nick);
            NickChangeEvent nce = new NickChangeEvent(e.getRawEventData(), session, profileNick, nick);
            this.manager.addToRelayList(nce);
        }
        ConnectionCompleteEvent ccEvent = (ConnectionCompleteEvent)e;
        session.getConnection().setHostName(ccEvent.getActualHostName());
        session.loginSuccess();
        session.connected();
    }

    public void mode(IRCEvent event) {
        ModeEvent me = (ModeEvent)event;
        if (me.getModeType() == ModeEvent.ModeType.CHANNEL) {
            me.getChannel().updateModes(me.getModeAdjustments());
        } else {
            me.getSession().updateUserModes(me.getModeAdjustments());
        }
    }

  private void initStratMap()
  {
    this.stratMap.put(IRCEvent.Type.CONNECT_COMPLETE, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.connectionComplete(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.JOIN_COMPLETE, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.joinComplete(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.JOIN, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.join(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.QUIT, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.quit(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.PART, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.part(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.NICK_CHANGE, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.nick(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.NICK_IN_USE, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.nickInUse(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.KICK_EVENT, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.kick(e);
      }
    });
    this.stratMap.put(IRCEvent.Type.MODE_EVENT, new IRCEventListener()
    {
      public void receiveEvent(IRCEvent e)
      {
        DefaultInternalEventHandler.this.mode(e);
      }
    });
  }
}

