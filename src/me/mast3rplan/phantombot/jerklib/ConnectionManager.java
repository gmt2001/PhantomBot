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
import com.gmt2001.Console.out;
import com.gmt2001.UncaughtExceptionHandler;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.nio.channels.CancelledKeyException;
import java.nio.channels.SelectableChannel;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.nio.channels.UnresolvedAddressException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import me.mast3rplan.phantombot.jerklib.Connection;
import me.mast3rplan.phantombot.jerklib.DefaultInternalEventHandler;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.RequestedConnection;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.WriteRequest;
import me.mast3rplan.phantombot.jerklib.events.GenericErrorEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.UnresolvedHostnameErrorEvent;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;
import me.mast3rplan.phantombot.jerklib.listeners.WriteRequestListener;
import me.mast3rplan.phantombot.jerklib.parsers.DefaultInternalEventParser;
import me.mast3rplan.phantombot.jerklib.parsers.InternalEventParser;
import me.mast3rplan.phantombot.jerklib.tasks.Task;
import me.mast3rplan.phantombot.jerklib.util.IdentServer;

public final class ConnectionManager {
    final Map<String, Session> sessionMap = Collections.synchronizedMap(new HashMap());
    final Map<SocketChannel, Session> socChanMap = Collections.synchronizedMap(new HashMap());
    private final List<WriteRequestListener> writeListeners = Collections.synchronizedList(new ArrayList(1));
    private final List<IRCEvent> eventQueue = new ArrayList<IRCEvent>();
    private final List<IRCEvent> relayQueue = new ArrayList<IRCEvent>();
    private final List<WriteRequest> requestForWriteListenerEventQueue = new ArrayList<WriteRequest>();
    private IRCEventListener internalEventHandler;
    private InternalEventParser internalEventParser;
    private Timer loopTimer;
    private Timer dispatchTimer;
    private Profile defaultProfile;
    private Selector selector;
    private boolean autoReCon;
    private int reconTriesShort;
    private long reconnectIntervalShort;
    private int reconTriesMed;
    private long reconnectIntervalMed;
    private int reconTriesLong;
    private long reconnectIntervalLong;

    public ConnectionManager(Profile defaultProfile) {
        this.internalEventHandler = new DefaultInternalEventHandler(this);
        this.internalEventParser = new DefaultInternalEventParser();
        this.autoReCon = true;
        this.reconTriesShort = 20;
        this.reconnectIntervalShort = 30000;
        this.reconTriesMed = 15;
        this.reconnectIntervalMed = 120000;
        this.reconTriesLong = 40;
        this.reconnectIntervalLong = 300000;
        this.defaultProfile = defaultProfile;
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        try {
            this.selector = Selector.open();
        }
        catch (IOException e) {
            err.printStackTrace(e);
        }
        this.startMainLoop();
    }

    ConnectionManager() {
        this.internalEventHandler = new DefaultInternalEventHandler(this);
        this.internalEventParser = new DefaultInternalEventParser();
        this.autoReCon = true;
        this.reconTriesShort = 20;
        this.reconnectIntervalShort = 30000;
        this.reconTriesMed = 15;
        this.reconnectIntervalMed = 120000;
        this.reconTriesLong = 40;
        this.reconnectIntervalLong = 300000;
    }

    public void setAutoReconnect(boolean bool) {
        this.autoReCon = bool;
    }

    public List<Session> getSessions() {
        return Collections.unmodifiableList(new ArrayList<Session>(this.sessionMap.values()));
    }

    public Session getSession(String name) {
        return this.sessionMap.get(name);
    }

    public void reconnectSession(String hostname) {
        Session s = this.getSession(hostname);
        s.reconnect();
    }

    public void addWriteRequestListener(WriteRequestListener listener) {
        this.writeListeners.add(listener);
    }

    public List<WriteRequestListener> getWriteListeners() {
        return Collections.unmodifiableList(this.writeListeners);
    }

    public Session requestConnection(String hostName) {
        return this.requestConnection(hostName, 6667);
    }

    public Session requestConnection(String hostName, int port) {
        return this.requestConnection(hostName, port, this.defaultProfile.clone());
    }

    public Session requestConnection(String hostName, int port, String pass) {
        return this.requestConnection(hostName, port, pass, this.defaultProfile.clone());
    }

    public Session requestConnection(String hostName, int port, Profile profile) {
        RequestedConnection rCon = new RequestedConnection(hostName, port, profile);
        Session session = new Session(rCon, this);
        session.setInternalParser(this.internalEventParser);
        this.sessionMap.put(hostName, session);
        new IdentServer(this.defaultProfile.getName());
        return session;
    }

    public Session requestConnection(String hostName, int port, String pass, Profile profile) {
        RequestedConnection rCon = new RequestedConnection(hostName, port, pass, profile);
        Session session = new Session(rCon, this);
        session.setInternalParser(this.internalEventParser);
        this.sessionMap.put(hostName, session);
        new IdentServer(this.defaultProfile.getName());
        return session;
    }

    public synchronized void quit(String quitMsg) {
        this.loopTimer.cancel();
        this.dispatchTimer.cancel();
        for (Session session : new ArrayList<Session>(this.sessionMap.values())) {
            session.close(quitMsg);
        }
        this.sessionMap.clear();
        this.socChanMap.clear();
        try {
            this.selector.close();
        }
        catch (IOException e) {
            err.printStackTrace(e);
        }
    }

    public synchronized void quit() {
        this.quit("");
    }

    public Profile getDefaultProfile() {
        return this.defaultProfile;
    }

    public void setDefaultProfile(Profile profile) {
        this.defaultProfile = profile;
    }

    public void setDefaultInternalEventHandler(IRCEventListener handler) {
        this.internalEventHandler = handler;
    }

    public IRCEventListener getDefaultEventHandler() {
        return this.internalEventHandler;
    }

    public void setDefaultInternalEventParser(InternalEventParser parser) {
        this.internalEventParser = parser;
    }

    public InternalEventParser getDefaultInternalEventParser() {
        return this.internalEventParser;
    }

    void removeSession(Session session) {
        this.sessionMap.remove(session.getRequestedConnection().getHostName());
        Iterator<Session> it = this.socChanMap.values().iterator();
        while (it.hasNext()) {
            if (!it.next().equals(session)) continue;
            it.remove();
            return;
        }
    }

    void addToEventQueue(IRCEvent event) {
        this.eventQueue.add(event);
    }

    void addToRelayList(IRCEvent event) {
        if (event == null) {
            err.printStackTrace(new Exception());
            this.quit("Null Pointers ?? In my Code??! :(");
            return;
        }
        List<IRCEvent> list = this.relayQueue;
        synchronized (list) {
            this.relayQueue.add(event);
        }
    }

    void startMainLoop() {
        this.dispatchTimer = new Timer();
        this.loopTimer = new Timer();
        TimerTask dispatchTask = new TimerTask(){

            @Override
            public void run() {
                ConnectionManager.this.relayEvents();
                ConnectionManager.this.notifyWriteListeners();
            }
        };
        TimerTask loopTask = new TimerTask(){

            @Override
            public void run() {
                ConnectionManager.this.makeConnections();
                ConnectionManager.this.doNetworkIO();
                ConnectionManager.this.parseEvents();
                ConnectionManager.this.checkServerConnections();
            }
        };
        this.loopTimer.schedule(loopTask, 0, 200);
        this.dispatchTimer.schedule(dispatchTask, 0, 200);
    }

    void doNetworkIO() {
        try {
            if (this.selector.selectNow() > 0) {
                Iterator<SelectionKey> it = this.selector.selectedKeys().iterator();
                while (it.hasNext()) {
                    SelectionKey key = it.next();
                    Session session = this.socChanMap.get(key.channel());
                    it.remove();
                    try {
                        if (!key.isValid()) continue;
                        if (key.isReadable()) {
                            this.socChanMap.get(key.channel()).getConnection().read();
                        }
                        if (key.isWritable()) {
                            this.socChanMap.get(key.channel()).getConnection().doWrites();
                        }
                        if (!key.isConnectable()) continue;
                        this.finishConnection(key);
                    }
                    catch (CancelledKeyException ke) {
                        session.disconnected(ke);
                    }
                }
            }
        }
        catch (IOException e) {
            err.printStackTrace(e);
        }
    }

    void finishConnection(SelectionKey key) {
        SocketChannel chan = (SocketChannel)key.channel();
        Session session = this.socChanMap.get(chan);
        if (chan.isConnectionPending()) {
            try {
                if (session.getConnection() == null) {
                    session.markForRemoval();
                } else if (session.getConnection().finishConnect()) {
                    session.halfConnected();
                    session.login();
                } else {
                    session.connecting();
                }
            }
            catch (IOException e) {
                GenericErrorEvent error = new GenericErrorEvent(e.getMessage(), session, e);
                this.addToRelayList(error);
                session.markForRemoval();
                key.cancel();
                err.printStackTrace(e);
            }
        }
    }

    void checkServerConnections() {
        Map<String, Session> map = this.sessionMap;
        synchronized (map) {
            Iterator<Session> it = this.sessionMap.values().iterator();
            while (it.hasNext()) {
                Session session = it.next();
                Session.State state = session.getState();
                if (state == Session.State.MARKED_FOR_REMOVAL) {
                    it.remove();
                    continue;
                }
                if (state != Session.State.NEED_TO_PING) continue;
                session.getConnection().ping();
            }
        }
    }

    void parseEvents() {
        List<IRCEvent> list = this.eventQueue;
        synchronized (list) {
            if (this.eventQueue.isEmpty()) {
                return;
            }
            for (IRCEvent event : this.eventQueue) {
                IRCEvent newEvent = event.getSession().getInternalEventParser().receiveEvent(event);
                this.internalEventHandler.receiveEvent(newEvent);
            }
            this.eventQueue.clear();
        }
    }

    Map<IRCEvent.Type, List<Task>> removeCanceled(Session session) {
        Map<IRCEvent.Type, List<Task>> tasks;
        Map<IRCEvent.Type, List<Task>> map = tasks = session.getTasks();
        synchronized (map) {
            for (List<Task> thisTasks : tasks.values()) {
                Iterator<Task> x = thisTasks.iterator();
                while (x.hasNext()) {
                    Task rmTask = x.next();
                    if (!rmTask.isCanceled()) continue;
                    x.remove();
                }
            }
        }
        return tasks;
    }

    void relayEvents() {
        ArrayList<IRCEvent> events = new ArrayList<IRCEvent>();
        ArrayList<IRCEventListener> templisteners = new ArrayList<IRCEventListener>();
        HashMap<IRCEvent.Type, List<Task>> tempTasks = new HashMap<IRCEvent.Type, List<Task>>();
        List<IRCEvent> list = this.relayQueue;
        synchronized (list) {
            events.addAll(this.relayQueue);
            this.relayQueue.clear();
        }
        for (IRCEvent event : events) {
            Collection<IRCEventListener> listeners;
            List nullTasks;
            Session s = event.getSession();
            if (s == null) continue;
            Collection<IRCEventListener> collection = listeners = s.getIRCEventListeners();
            synchronized (collection) {
                templisteners.addAll(listeners);
            }
            tempTasks.putAll(this.removeCanceled(s));
            List typeTasks = (List)tempTasks.get((Object)event.getType());
            if (typeTasks != null) {
                templisteners.addAll(typeTasks);
            }
            if ((nullTasks = (List)tempTasks.get(null)) != null) {
                templisteners.addAll(nullTasks);
            }
            for (IRCEventListener listener : templisteners) {
                try {
                    listener.receiveEvent(event);
                }
                catch (Exception e) {
                    err.println("me.mast3rplan.phantombot.jerklib:Cought Client Exception");
                    err.printStackTrace(e);
                }
            }
            templisteners.clear();
            tempTasks.clear();
        }
    }

    void notifyWriteListeners() {
        ArrayList<WriteRequestListener> list = new ArrayList<WriteRequestListener>();
        ArrayList<WriteRequest> wRequests = new ArrayList<WriteRequest>();
        List list2 = this.requestForWriteListenerEventQueue;
        synchronized (list2) {
            if (this.requestForWriteListenerEventQueue.isEmpty()) {
                return;
            }
            wRequests.addAll(this.requestForWriteListenerEventQueue);
            this.requestForWriteListenerEventQueue.clear();
        }
        list2 = this.writeListeners;
        synchronized (list2) {
            list.addAll(this.writeListeners);
        }
        for (WriteRequestListener listener : list) {
            for (WriteRequest request : wRequests) {
                listener.receiveEvent(request);
            }
        }
    }

    void makeConnections() {
        Map<String, Session> map = this.sessionMap;
        synchronized (map) {
            for (Session session : this.sessionMap.values()) {
                String msg;
                Session.State state = session.getState();
                if (state == Session.State.NEED_TO_RECONNECT) {
                    session.disconnected(new Exception("Connection Timeout Possibly"));
                }
                if (state != Session.State.DISCONNECTED || session.isClosing) continue;
                long last = session.getLastRetry();
                long current = System.currentTimeMillis();
                long reconnectIntervalCur = this.reconnectIntervalShort;
                int reconTriesCur = this.reconTriesShort;
                if (session.getRetries() >= this.reconTriesShort) {
                    if (session.getRetries() < this.reconTriesShort + this.reconTriesMed) {
                        reconnectIntervalCur = this.reconnectIntervalMed;
                        reconTriesCur = this.reconTriesMed;
                    } else {
                        reconnectIntervalCur = this.reconnectIntervalLong;
                        reconTriesCur = this.reconTriesLong;
                    }
                }
                if (last > 0 && current - last < reconnectIntervalCur) continue;
                try {
                    if (!(this.autoReCon && session.getRetries() < reconTriesCur)) {
                        session.markForRemoval();
                        err.println("Retries up, marked for removal");
                        continue;
                    }
                    session.retried();
                    this.connect(session);
                }
                catch (UnresolvedAddressException e) {
                    msg = e.getMessage() == null ? e.toString() : e.getMessage();
                    UnresolvedHostnameErrorEvent error = new UnresolvedHostnameErrorEvent(session, msg, session.getRequestedConnection().getHostName(), e);
                    this.addToRelayList(error);
                    session.disconnected(e);
                }
                catch (IOException e) {
                    msg = e.getMessage() == null ? e.toString() : e.getMessage();
                    GenericErrorEvent error = new GenericErrorEvent(msg, session, e);
                    this.addToRelayList(error);
                    session.disconnected(e);
                }
            }
        }
    }

    void connect(Session session) throws IOException {
        SocketChannel sChannel = SocketChannel.open();
        sChannel.configureBlocking(false);
        out.println("Connecting to " + session.getRequestedConnection().getHostName() + ":" + session.getRequestedConnection().getPort());
        sChannel.connect(new InetSocketAddress(session.getRequestedConnection().getHostName(), session.getRequestedConnection().getPort()));
        sChannel.register(this.selector, sChannel.validOps());
        Connection con = new Connection(this, sChannel, session);
        session.setConnection(con);
        this.socChanMap.put(sChannel, session);
    }

}

