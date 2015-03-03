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

import com.gmt2001.Console.out;
import com.gmt2001.UncaughtExceptionHandler;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Connection;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.RequestGenerator;
import me.mast3rplan.phantombot.jerklib.RequestedConnection;
import me.mast3rplan.phantombot.jerklib.ServerInformation;
import me.mast3rplan.phantombot.jerklib.events.ConnectionLostEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;
import me.mast3rplan.phantombot.jerklib.parsers.InternalEventParser;
import me.mast3rplan.phantombot.jerklib.tasks.Task;

public class Session
extends RequestGenerator {
    private final List<IRCEventListener> listenerList = new ArrayList<IRCEventListener>();
    private final Map<IRCEvent.Type, List<Task>> taskMap = new HashMap<IRCEvent.Type, List<Task>>();
    private final RequestedConnection rCon;
    private Connection con;
    private final ConnectionManager conman;
    private boolean rejoinOnKick = true;
    private boolean isAway;
    private boolean isLoggedIn;
    private boolean useAltNicks = true;
    private long lastRetry = -1;
    private long lastResponse = System.currentTimeMillis();
    private ServerInformation serverInfo = new ServerInformation();
    private State state = State.DISCONNECTED;
    private InternalEventParser parser;
    private IRCEventListener internalEventHandler;
    private List<ModeAdjustment> userModes = new ArrayList<ModeAdjustment>();
    private final Map<String, Channel> channelMap = new HashMap<String, Channel>();
    private int retries = 0;
    public boolean isClosing = false;

    Session(RequestedConnection rCon, ConnectionManager conman) {
        this.rCon = rCon;
        this.conman = conman;
        this.setSession(this);
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
    }

    public InternalEventParser getInternalEventParser() {
        return this.parser;
    }

    public void setInternalParser(InternalEventParser parser) {
        this.parser = parser;
    }

    public void setInternalEventHandler(IRCEventListener handler) {
        this.internalEventHandler = handler;
    }

    public IRCEventListener getInternalEventHandler() {
        return this.internalEventHandler;
    }

    void updateUserModes(List<ModeAdjustment> modes) {
        for (ModeAdjustment ma : modes) {
            this.updateUserMode(ma);
        }
    }

    private void updateUserMode(ModeAdjustment mode) {
        int index = this.indexOfMode(mode.getMode(), this.userModes);
        if (mode.getAction() == ModeAdjustment.Action.MINUS) {
            if (index != -1) {
                ModeAdjustment ma = this.userModes.remove(index);
                if (ma.getAction() == ModeAdjustment.Action.MINUS) {
                    this.userModes.add(ma);
                }
            } else {
                this.userModes.add(mode);
            }
        } else {
            if (index != -1) {
                this.userModes.remove(index);
            }
            this.userModes.add(mode);
        }
    }

    private int indexOfMode(char mode, List<ModeAdjustment> modes) {
        for (int i = 0; i < modes.size(); ++i) {
            ModeAdjustment ma = modes.get(i);
            if (ma.getMode() != mode) continue;
            return i;
        }
        return -1;
    }

    public List<ModeAdjustment> getUserModes() {
        return new ArrayList<ModeAdjustment>(this.userModes);
    }

    public void sayChannel(Channel channel, String msg) {
        super.sayChannel(msg, channel);
    }

    public boolean isConnected() {
        return this.state == State.CONNECTED;
    }

    public boolean isRejoinOnKick() {
        return this.rejoinOnKick;
    }

    public void setRejoinOnKick(boolean rejoin) {
        this.rejoinOnKick = rejoin;
    }

    void loginSuccess() {
        this.isLoggedIn = true;
    }

    public boolean isLoggedIn() {
        return this.isLoggedIn;
    }

    public void setShouldUseAltNicks(boolean use) {
        this.useAltNicks = use;
    }

    public boolean getShouldUseAltNicks() {
        return this.useAltNicks;
    }

    public void close(String quitMessage) {
        this.isClosing = true;
        if (this.con != null) {
            this.con.quit(quitMessage);
        }
        this.conman.removeSession(this);
        this.isLoggedIn = false;
    }

    public String getNick() {
        return this.getRequestedConnection().getProfile().getActualNick();
    }

    @Override
    public void changeNick(String newNick) {
        super.changeNick(newNick);
    }

    public boolean isAway() {
        return this.isAway;
    }

    @Override
    public void setAway(String message) {
        this.isAway = true;
        super.setAway(message);
    }

    public void unsetAway() {
        if (this.isAway) {
            super.unSetAway();
            this.isAway = false;
        }
    }

    public ServerInformation getServerInformation() {
        return this.serverInfo;
    }

    public RequestedConnection getRequestedConnection() {
        return this.rCon;
    }

    public String getConnectedHostName() {
        return this.con == null ? "" : this.con.getHostName();
    }

    public void addIRCEventListener(IRCEventListener listener) {
        this.listenerList.add(listener);
    }

    public boolean removeIRCEventListener(IRCEventListener listener) {
        return this.listenerList.remove(listener);
    }

    public Collection<IRCEventListener> getIRCEventListeners() {
        return Collections.unmodifiableCollection(this.listenerList);
    }

    public void onEvent(Task task) {
        this.onEvent(task, new IRCEvent.Type[]{null});
    }

    public /* varargs */ void onEvent(Task task, IRCEvent.Type ... types) {
        Map<IRCEvent.Type, List<Task>> map = this.taskMap;
        synchronized (map) {
            for (IRCEvent.Type type : types) {
                if (!this.taskMap.containsKey((Object)type)) {
                    ArrayList<Task> tasks = new ArrayList<Task>();
                    tasks.add(task);
                    this.taskMap.put(type, tasks);
                    continue;
                }
                this.taskMap.get((Object)type).add(task);
            }
        }
    }

    Map<IRCEvent.Type, List<Task>> getTasks() {
        return Collections.unmodifiableMap(new HashMap<IRCEvent.Type, List<Task>>(this.taskMap));
    }

    public void removeTask(Task t) {
        Map<IRCEvent.Type, List<Task>> map = this.taskMap;
        synchronized (map) {
            Iterator<IRCEvent.Type> it = this.taskMap.keySet().iterator();
            while (it.hasNext()) {
                List<Task> tasks = this.taskMap.get((Object)it.next());
                if (tasks == null) continue;
                tasks.remove(t);
            }
        }
    }

    public List<Channel> getChannels() {
        return Collections.unmodifiableList(new ArrayList<Channel>(this.channelMap.values()));
    }

    public Channel getChannel(String channelName) {
        return this.channelMap.get(channelName.toLowerCase());
    }

    void addChannel(Channel channel) {
        this.channelMap.put(channel.getName().toLowerCase(), channel);
    }

    boolean removeChannel(Channel channel) {
        return this.channelMap.remove(channel.getName().toLowerCase()) == null;
    }

    void nickChanged(String oldNick, String newNick) {
        Map<String, Channel> map = this.channelMap;
        synchronized (map) {
            for (Channel chan : this.channelMap.values()) {
                if (!chan.getNicks().contains(oldNick)) continue;
                chan.nickChanged(oldNick, newNick);
            }
        }
    }

    public List<Channel> removeNickFromAllChannels(String nick) {
        ArrayList<Channel> returnList = new ArrayList<Channel>();
        for (Channel chan : this.channelMap.values()) {
            if (!chan.removeNick(nick)) continue;
            returnList.add(chan);
        }
        return Collections.unmodifiableList(returnList);
    }

    long getLastRetry() {
        return this.lastRetry;
    }

    void retried() {
        if (this.retries > 0) {
            out.println("Failed to connect to '" + this.rCon.getHostName() + "', retrying connection.");
        }
        ++this.retries;
        this.lastRetry = System.currentTimeMillis();
    }

    void setConnection(Connection con) {
        this.con = con;
    }

    Connection getConnection() {
        return this.con;
    }

    void gotResponse() {
        this.lastResponse = System.currentTimeMillis();
        this.state = State.CONNECTED;
    }

    void pingSent() {
        this.state = State.PING_SENT;
    }

    void disconnected(Exception e) {
        if (this.state == State.DISCONNECTED) {
            return;
        }
        this.state = State.DISCONNECTED;
        if (this.con != null) {
            this.con.quit("");
            this.con = null;
        }
        this.isLoggedIn = false;
        this.conman.addToRelayList(new ConnectionLostEvent("", this, e));
    }

    void connected() {
        this.retries = 0;
        this.gotResponse();
    }

    void connecting() {
        this.state = State.CONNECTING;
    }

    void halfConnected() {
        this.state = State.HALF_CONNECTED;
    }

    void markForRemoval() {
        this.state = State.MARKED_FOR_REMOVAL;
    }

    State getState() {
        long current = System.currentTimeMillis();
        if (this.state == State.DISCONNECTED) {
            return this.state;
        }
        if (current - this.lastResponse > 300000 && this.state == State.NEED_TO_PING) {
            this.state = State.NEED_TO_RECONNECT;
        } else if (current - this.lastResponse > 200000 && this.state != State.PING_SENT) {
            this.state = State.NEED_TO_PING;
        }
        return this.state;
    }

    public int getRetries() {
        return this.retries;
    }

    public boolean isChannelToken(String token) {
        String[] chanPrefixes;
        ServerInformation serverInfo = this.getServerInformation();
        for (String prefix : chanPrefixes = serverInfo.getChannelPrefixes()) {
            if (!token.startsWith(prefix)) continue;
            return true;
        }
        return false;
    }

    void login() {
        if (this.rCon.getPass() != null) {
            this.sayRaw("PASS " + this.rCon.getPass());
        }
        this.sayRaw("NICK " + this.getNick());
        this.sayRaw("USER " + this.rCon.getProfile().getName() + " 0 0 :" + this.rCon.getProfile().getRealName());
    }

    public int hashCode() {
        return this.rCon.getHostName().hashCode();
    }

    public boolean equals(Object o) {
        if (o instanceof Session && o.hashCode() == this.hashCode()) {
            return ((Session)o).getRequestedConnection().getHostName().matches(this.getRequestedConnection().getHostName()) && ((Session)o).getNick().matches(this.getNick());
        }
        return false;
    }

    public void reconnect() {
        this.state = State.NEED_TO_RECONNECT;
    }

    public static enum State {
        CONNECTED,
        CONNECTING,
        HALF_CONNECTED,
        DISCONNECTED,
        MARKED_FOR_REMOVAL,
        NEED_TO_PING,
        PING_SENT,
        NEED_TO_RECONNECT;
        

        private State() {
        }
    }

}

