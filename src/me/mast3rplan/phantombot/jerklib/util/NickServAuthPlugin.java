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
package me.mast3rplan.phantombot.jerklib.util;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.ModeEvent;
import me.mast3rplan.phantombot.jerklib.tasks.Task;
import me.mast3rplan.phantombot.jerklib.tasks.TaskImpl;

public class NickServAuthPlugin
extends TaskImpl {
    private final Session session;
    private final String pass;
    private final char identMode;
    private final List<String> channels;
    private boolean authed;

    public NickServAuthPlugin(String pass, char identMode, Session session, List<String> channels) {
        super("NickServAuth");
        this.pass = pass;
        this.identMode = identMode;
        this.session = session;
        this.channels = channels;
        session.onEvent(this, IRCEvent.Type.CONNECT_COMPLETE, IRCEvent.Type.MODE_EVENT);
    }

    @Override
    public void receiveEvent(IRCEvent e) {
        if (e.getType() == IRCEvent.Type.CONNECT_COMPLETE) {
            this.connectionComplete(e);
        } else if (e.getType() == IRCEvent.Type.MODE_EVENT) {
            this.mode(e);
        }
    }

    private void mode(IRCEvent e) {
        ModeEvent me = (ModeEvent)e;
        if (me.getModeType() == ModeEvent.ModeType.USER) {
            for (ModeAdjustment ma : me.getModeAdjustments()) {
                if (ma.getMode() != this.identMode || ma.getAction() != ModeAdjustment.Action.PLUS) continue;
                this.authed = true;
                this.joinChannels();
                this.taskComplete(new Boolean(true));
            }
        }
    }

    private void connectionComplete(IRCEvent e) {
        this.authed = false;
        e.getSession().sayPrivate("nickserv", "identify " + this.pass);
        final Timer t = new Timer();
        t.schedule(new TimerTask(){

            @Override
            public void run() {
                if (!NickServAuthPlugin.this.authed) {
                    NickServAuthPlugin.this.taskComplete(new Boolean(false));
                }
                this.cancel();
                t.cancel();
            }
        }, 40000);
    }

    private void joinChannels() {
        for (String name : this.channels) {
            this.session.join(name);
        }
    }

}

