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

import com.gmt2001.Console.err;
import com.gmt2001.UncaughtExceptionHandler;
import java.io.IOException;
import java.nio.Buffer;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.channels.SocketChannel;
import java.nio.charset.Charset;
import java.nio.charset.CharsetEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.RequestedConnection;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.WriteRequest;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.listeners.WriteRequestListener;

class Connection {
    private Logger log;
    private final ConnectionManager manager;
    private final SocketChannel socChannel;
    final List<WriteRequest> writeRequests;
    private final ByteBuffer readBuffer;
    private boolean gotFragment;
    private final StringBuffer stringBuff;
    private String actualHostName;
    private final Session session;
    long lastWrite;
    int bursts;
    int maxBurst;
    long nextWrite;

    Connection(ConnectionManager manager, SocketChannel socChannel, Session session) {
        this.log = Logger.getLogger(this.getClass().getName());
        this.writeRequests = Collections.synchronizedList(new ArrayList());
        this.readBuffer = ByteBuffer.allocate(2048);
        this.stringBuff = new StringBuffer();
        this.lastWrite = System.currentTimeMillis();
        this.bursts = 0;
        this.maxBurst = 5;
        this.nextWrite = -1;
        this.manager = manager;
        this.socChannel = socChannel;
        this.session = session;
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
    }

    Profile getProfile() {
        return this.session.getRequestedConnection().getProfile();
    }

    void setHostName(String name) {
        this.actualHostName = name;
    }

    String getHostName() {
        return this.actualHostName;
    }

    void addWriteRequest(WriteRequest request) {
        this.writeRequests.add(request);
    }

    boolean finishConnect() throws IOException {
        return this.socChannel.finishConnect();
    }

    int read() {
        if (!this.socChannel.isConnected()) {
            this.log.severe("Read call while sochan.isConnected() == false");
            return -1;
        }
        this.readBuffer.clear();
        int numRead = 0;
        try {
            numRead = this.socChannel.read(this.readBuffer);
        }
        catch (Exception e) {
            err.printStackTrace(e);
            this.session.disconnected(e);
        }
        if (numRead == -1) {
            this.session.disconnected(new Exception("Num read -1"));
        }
        if (this.session.getState() == Session.State.DISCONNECTED || numRead <= 0) {
            return 0;
        }
        this.readBuffer.flip();
        String tmpStr = new String(this.readBuffer.array(), 0, numRead);
        if (tmpStr.indexOf("\r\n") == -1) {
            this.stringBuff.append(tmpStr);
            this.gotFragment = true;
            return numRead;
        }
        if (this.gotFragment) {
            tmpStr = this.stringBuff.toString() + tmpStr;
            this.stringBuff.delete(0, this.stringBuff.length());
            this.gotFragment = false;
        }
        String[] strSplit = tmpStr.split("\r\n");
        for (int i = 0; i < strSplit.length - 1; ++i) {
            this.manager.addToEventQueue(new IRCEvent(strSplit[i], this.session, IRCEvent.Type.DEFAULT));
        }
        String last = strSplit[strSplit.length - 1];
        if (!tmpStr.endsWith("\r\n")) {
            this.stringBuff.append(last);
            this.gotFragment = true;
        } else {
            this.manager.addToEventQueue(new IRCEvent(last, this.session, IRCEvent.Type.DEFAULT));
        }
        return numRead;
    }

    int doWrites() {
        String data;
        if (this.writeRequests.isEmpty()) {
            return 0;
        }
        WriteRequest req = null;
        if (this.nextWrite > System.currentTimeMillis()) {
            return 0;
        }
        if (System.currentTimeMillis() - this.lastWrite < 3000) {
            if (this.bursts == this.maxBurst) {
                this.nextWrite = System.currentTimeMillis() + 8000;
                this.bursts = 0;
                return 0;
            }
            ++this.bursts;
        } else {
            this.bursts = 0;
            this.lastWrite = System.currentTimeMillis();
        }
        req = this.writeRequests.remove(0);
        if (req.getType() == WriteRequest.Type.CHANNEL_MSG) {
            data = "PRIVMSG " + req.getChannel().getName() + " :" + req.getMessage() + "\r\n";
        } else if (req.getType() == WriteRequest.Type.PRIVATE_MSG) {
            if (req.getMessage().length() > 255) {
                this.writeRequests.add(0, new WriteRequest(req.getMessage().substring(100), req.getSession(), req.getNick()));
                data = "PRIVMSG " + req.getNick() + " :" + req.getMessage().substring(0, 100) + "\r\n";
            } else {
                data = "PRIVMSG " + req.getNick() + " :" + req.getMessage() + "\r\n";
            }
        } else {
            data = req.getMessage();
            if (!data.endsWith("\r\n")) {
                data = data + "\r\n";
            }
        }
        int amount = 0;
        try {
            Charset ch = Charset.forName("utf-8");
            CharsetEncoder cr = ch.newEncoder();
            ByteBuffer bf = cr.encode(CharBuffer.wrap((CharSequence)data));
            ByteBuffer buff = ByteBuffer.allocate(bf.capacity());
            buff.put(bf);
            buff.flip();
            amount = this.socChannel.write(buff);
        }
        catch (IOException e) {
            err.printStackTrace(e);
            this.session.disconnected(e);
        }
        if (this.session.getState() == Session.State.DISCONNECTED) {
            return amount;
        }
        this.fireWriteEvent(req);
        return amount;
    }

    void ping() {
        this.writeRequests.add(new WriteRequest("PING " + this.actualHostName + "\r\n", this.session));
        this.session.pingSent();
    }

    void pong(IRCEvent event) {
        this.session.gotResponse();
        String data = event.getRawEventData().substring(event.getRawEventData().lastIndexOf(":") + 1);
        this.writeRequests.add(new WriteRequest("PONG " + data + "\r\n", this.session));
    }

    void gotPong() {
        this.session.gotResponse();
    }

    void quit(String quitMessage) {
        try {
            if (quitMessage == null) {
                quitMessage = "";
            }
            WriteRequest request = new WriteRequest("QUIT :" + quitMessage + "\r\n", this.session);
            this.writeRequests.add(request);
            this.doWrites();
            this.socChannel.close();
        }
        catch (IOException e) {
            err.printStackTrace(e);
        }
    }

    void fireWriteEvent(WriteRequest request) {
        for (WriteRequestListener listener : this.manager.getWriteListeners()) {
            listener.receiveEvent(request);
        }
    }
}

