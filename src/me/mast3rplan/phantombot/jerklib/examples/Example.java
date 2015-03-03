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
import java.util.List;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.MessageEvent;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;

public class Example
implements IRCEventListener {
    private ConnectionManager manager = new ConnectionManager(new Profile("scripy"));

    public Example() {
        Session session = this.manager.requestConnection("irc.freenode.net");
        session.addIRCEventListener(this);
    }

    @Override
    public void receiveEvent(IRCEvent e) {
        if (e.getType() == IRCEvent.Type.CONNECT_COMPLETE) {
            e.getSession().join("#me.mast3rplan.phantombot.jerklib");
        } else if (e.getType() == IRCEvent.Type.CHANNEL_MESSAGE) {
            MessageEvent me = (MessageEvent)e;
            out.println(me.getNick() + ":" + me.getMessage());
            me.getChannel().say("Modes :" + me.getChannel().getUsersModes(me.getNick()).toString());
        } else if (e.getType() == IRCEvent.Type.JOIN_COMPLETE) {
            JoinCompleteEvent jce = (JoinCompleteEvent)e;
            jce.getChannel().say("Hello from Jerklib!");
        } else {
            out.println((Object)e.getType() + " " + e.getRawEventData());
        }
    }

    public static void main(String[] args) {
        new Example();
    }
}

