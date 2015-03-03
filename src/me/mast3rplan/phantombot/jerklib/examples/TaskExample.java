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
package me.mast3rplan.phantombot.jerklib.examples;

import com.gmt2001.Console.out;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.MotdEvent;
import me.mast3rplan.phantombot.jerklib.tasks.Task;
import me.mast3rplan.phantombot.jerklib.tasks.TaskImpl;

public class TaskExample {
    public TaskExample() {
        ConnectionManager conman = new ConnectionManager(new Profile("scripy"));
        Session session = conman.requestConnection("irc.freenode.net");
        session.onEvent(new TaskImpl("join_channels"){

            @Override
            public void receiveEvent(IRCEvent e) {
                e.getSession().join("#me.mast3rplan.phantombot.jerklib");
            }
        }, IRCEvent.Type.CONNECT_COMPLETE);
        session.onEvent(new TaskImpl("hello"){

            @Override
            public void receiveEvent(IRCEvent e) {
                JoinCompleteEvent jce = (JoinCompleteEvent)e;
                jce.getChannel().say("Hello from JerkLib!");
            }
        }, IRCEvent.Type.JOIN_COMPLETE);
        session.onEvent(new TaskImpl("motd_join"){

            @Override
            public void receiveEvent(IRCEvent e) {
                if (e.getType() == IRCEvent.Type.MOTD) {
                    MotdEvent me = (MotdEvent)e;
                    out.println(me.getMotdLine());
                } else {
                    JoinCompleteEvent je = (JoinCompleteEvent)e;
                    je.getChannel().say("Yay tasks!");
                }
            }
        }, IRCEvent.Type.MOTD, IRCEvent.Type.JOIN_COMPLETE);
        session.onEvent(new TaskImpl("print"){

            @Override
            public void receiveEvent(IRCEvent e) {
                out.println(e.getRawEventData());
            }
        });
    }

    public static void main(String[] args) {
        new TaskExample();
    }

}

