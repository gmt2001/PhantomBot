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

import java.util.List;
import java.util.logging.Logger;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.ConnectionCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.JoinCompleteEvent;
import me.mast3rplan.phantombot.jerklib.events.MessageEvent;
import me.mast3rplan.phantombot.jerklib.listeners.DefaultIRCEventListener;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;

public class DefaultListenerExample
extends DefaultIRCEventListener
implements Runnable {
    Session session;
    static final String CHANNEL_TO_JOIN = "#me.mast3rplan.phantombot.jerklib";

    @Override
    public void run() {
        ConnectionManager manager = new ConnectionManager(new Profile("ble", "bleh bleh", "ble", "ble_", "ble__"));
        this.session = manager.requestConnection("irc.freenode.net");
        this.session.addIRCEventListener(this);
    }

    @Override
    protected void handleJoinCompleteEvent(JoinCompleteEvent event) {
        event.getChannel().say("Hello from BaseListenerExample");
    }

    @Override
    protected void handleConnectComplete(ConnectionCompleteEvent event) {
        event.getSession().join("#me.mast3rplan.phantombot.jerklib");
    }

    @Override
    protected void handleChannelMessage(MessageEvent event) {
        this.log.info(event.getChannel().getName() + ":" + event.getNick() + ":" + event.getMessage());
        if ("now die".equalsIgnoreCase(event.getMessage())) {
            event.getChannel().say("Okay, fine, I'll die");
            try {
                Thread.sleep(2000);
            }
            catch (InterruptedException e) {
                // empty catch block
            }
            System.exit(0);
        }
    }

    public static void main(String[] args) {
        DefaultListenerExample ble = new DefaultListenerExample();
        Thread t = new Thread(ble);
        t.start();
        try {
            Thread.sleep(30000);
        }
        catch (InterruptedException e) {
            // empty catch block
        }
        ble.sayGoodbye();
        try {
            Thread.sleep(5000);
        }
        catch (InterruptedException e) {
            // empty catch block
        }
        System.exit(0);
    }

    private void sayGoodbye() {
        for (Channel chan : this.session.getChannels()) {
            chan.say("I'm melting! (built-in sword of Damocles... or bucket of water, whatever)");
        }
    }
}

