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

import com.gmt2001.UncaughtExceptionHandler;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentLinkedQueue;
import me.mast3rplan.phantombot.jerklib.Connection;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.ServerInformation;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.WriteRequest;
import me.mast3rplan.phantombot.jerklib.events.TopicEvent;

public class Channel {
    private String name;
    private Session session;
    private Map<String, List<ModeAdjustment>> userMap;
    private List<ModeAdjustment> channelModes = new ArrayList<ModeAdjustment>();
    private TopicEvent topicEvent;
    private ConcurrentLinkedQueue<String> messages = new ConcurrentLinkedQueue();
    private ConcurrentLinkedQueue<String> prioritymessages = new ConcurrentLinkedQueue();
    private Timer sayTimer = new Timer();
    private Boolean allowSendMessages = false;
    private long msginterval = 1600;

    public Channel(String name, Session session) {
        this.userMap = new HashMap<String, List<ModeAdjustment>>(){

            @Override
            public List<ModeAdjustment> get(Object key) {
                List rList = (List)super.get(key);
                if (key != null && rList == null) {
                    rList = (List)super.get(key.toString().toLowerCase());
                }
                return rList;
            }

            @Override
            public List<ModeAdjustment> remove(Object key) {
                List rList = (List)super.remove(key);
                if (key != null && rList == null) {
                    rList = (List)super.remove(key.toString().toLowerCase());
                }
                return rList;
            }

            @Override
            public boolean containsKey(Object key) {
                boolean b = super.containsKey(key);
                if (!b) {
                    b = super.containsKey(key.toString().toLowerCase());
                }
                return b;
            }
        };
        this.name = name;
        this.session = session;
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        this.sayTimer.schedule((TimerTask)new MessageTask(this), 300, 100);
    }

    public void setAllowSendMessages(Boolean allow) {
        this.allowSendMessages = allow;
    }

    void updateModes(List<ModeAdjustment> modes) {
        ServerInformation info = this.session.getServerInformation();
        ArrayList<String> nickModes = new ArrayList<String>(info.getNickPrefixMap().values());
        for (ModeAdjustment mode : modes) {
            if (nickModes.contains(String.valueOf(mode.getMode())) && this.userMap.containsKey(mode.getArgument())) {
                this.updateMode(mode, this.userMap.get(mode.getArgument()));
                continue;
            }
            if (mode.getMode() == 'q' || mode.getMode() == 'b') continue;
            this.updateMode(mode, this.channelModes);
        }
    }

    private void updateMode(ModeAdjustment mode, List<ModeAdjustment> modes) {
        int index = this.indexOfMode(mode.getMode(), modes);
        if (mode.getAction() == ModeAdjustment.Action.MINUS) {
            if (index != -1) {
                ModeAdjustment ma = modes.remove(index);
                if (ma.getAction() == ModeAdjustment.Action.MINUS) {
                    modes.add(ma);
                }
            } else {
                modes.add(mode);
            }
        } else {
            if (index != -1) {
                modes.remove(index);
            }
            modes.add(mode);
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

    public List<ModeAdjustment> getUsersModes(String nick) {
        if (this.userMap.containsKey(nick)) {
            return new ArrayList<ModeAdjustment>((Collection)this.userMap.get(nick));
        }
        return new ArrayList<ModeAdjustment>();
    }

    public List<String> getNicksForMode(ModeAdjustment.Action action, char mode) {
        ArrayList<String> nicks = new ArrayList<String>();
        for (String nick : this.getNicks()) {
            List<ModeAdjustment> modes = this.userMap.get(nick);
            for (ModeAdjustment ma : modes) {
                if (ma.getMode() != mode || ma.getAction() != action) continue;
                nicks.add(nick);
            }
        }
        return nicks;
    }

    public List<ModeAdjustment> getChannelModes() {
        return new ArrayList<ModeAdjustment>(this.channelModes);
    }

    public void mode(String mode) {
        this.session.mode(this.name, mode);
    }

    public String getTopic() {
        return this.topicEvent != null ? this.topicEvent.getTopic() : "";
    }

    public String getTopicSetter() {
        return this.topicEvent != null ? this.topicEvent.getSetBy() : "";
    }

    public Date getTopicSetTime() {
        return this.topicEvent == null ? null : this.topicEvent.getSetWhen();
    }

    public void setTopic(String topic) {
        this.write(new WriteRequest("TOPIC " + this.name + " :" + topic, this.session));
    }

    public void setTopicEvent(TopicEvent topicEvent) {
        this.topicEvent = topicEvent;
    }

    public String getName() {
        return this.name;
    }

    /*
     * Unable to fully structure code
     * Enabled aggressive block sorting
     * Lifted jumps to return sites
     */
  public void say(String message)
  {
    if ((message.startsWith(".timeout ")) || (message.startsWith(".ban ")) || (message.startsWith(".unban ")) || (message.equals(".clear")) || (message.equals(".mods")))
    {
      if (message.length() + 14 + this.name.length() < 512)
      {
        this.prioritymessages.add(message);
      }
      else
      {
        int maxlen = 498 - this.name.length();
        int pos = 0;
        for (int i = 0; i < Math.ceil(message.length() / (maxlen * 0.0D)); i++) {
          if (pos + maxlen >= message.length())
          {
            this.prioritymessages.add(message.substring(pos));
          }
          else
          {
            this.prioritymessages.add(message.substring(pos, pos + maxlen));
            pos += maxlen;
          }
        }
      }
    }
    else if (message.length() + 14 + this.name.length() < 512)
    {
      this.messages.add(message);
    }
    else
    {
      int maxlen = 498 - this.name.length();
      int pos = 0;
      for (int i = 0; i < Math.ceil(message.length() / (maxlen * 0.0D)); i++) {
        if (pos + maxlen >= message.length())
        {
          this.messages.add(message.substring(pos));
        }
        else
        {
          this.messages.add(message.substring(pos, pos + maxlen));
          pos += maxlen;
        }
      }
    }
  }
    public void notice(String message) {
        this.session.notice(this.getName(), message);
    }

    public void addNick(String nick) {
        if (!this.userMap.containsKey(nick)) {
            ServerInformation info = this.session.getServerInformation();
            Map<String, String> nickPrefixMap = info.getNickPrefixMap();
            ArrayList<ModeAdjustment> modes = new ArrayList<ModeAdjustment>();
            for (String prefix : nickPrefixMap.keySet()) {
                if (!nick.startsWith(prefix)) continue;
                modes.add(new ModeAdjustment(ModeAdjustment.Action.PLUS, nickPrefixMap.get(prefix).charAt(0), ""));
            }
            if (!modes.isEmpty()) {
                nick = nick.substring(1);
            }
            this.userMap.put(nick, modes);
        }
    }

    boolean removeNick(String nick) {
        return this.userMap.remove(nick) != null;
    }

    void nickChanged(String oldNick, String newNick) {
        List<ModeAdjustment> modes = this.userMap.remove(oldNick);
        this.userMap.put(newNick, modes);
    }

    public List<String> getNicks() {
        return new ArrayList<String>(this.userMap.keySet()){

            @Override
            public int indexOf(Object o) {
                if (o != null) {
                    for (int i = 0; i < this.size(); ++i) {
                        if (!((String)this.get(i)).equalsIgnoreCase(o.toString())) continue;
                        return i;
                    }
                }
                return -1;
            }
        };
    }

    public void part(String partMsg) {
        if (partMsg == null || partMsg.length() == 0) {
            partMsg = "Leaving";
        }
        this.write(new WriteRequest("PART " + this.getName() + " :" + partMsg, this.session));
    }

    public void action(String text) {
        this.write(new WriteRequest("\u0001ACTION " + text + "\u0001", this, this.session));
    }

    public void names() {
        this.write(new WriteRequest("NAMES " + this.getName(), this, this.session));
    }

    public void deVoice(String userName) {
        this.write(new WriteRequest("MODE " + this.getName() + " -v " + userName, this.session));
    }

    public void voice(String userName) {
        this.write(new WriteRequest("MODE " + this.getName() + " +v " + userName, this.session));
    }

    public void op(String userName) {
        this.write(new WriteRequest("MODE " + this.getName() + " +o " + userName, this.session));
    }

    public void deop(String userName) {
        this.write(new WriteRequest("MODE " + this.getName() + " -o " + userName, this.session));
    }

    public void kick(String userName, String reason) {
        if (reason == null || reason.length() == 0) {
            reason = this.session.getNick();
        }
        this.write(new WriteRequest("KICK " + this.getName() + " " + userName + " :" + reason, this.session));
    }

    private void write(WriteRequest req) {
        this.session.getConnection().addWriteRequest(req);
    }

    public Session getSession() {
        return this.session;
    }

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Channel)) {
            return false;
        }
        Channel channel = (Channel)o;
        if (!this.session.getConnectedHostName().equals(channel.getSession().getConnectedHostName())) {
            return false;
        }
        if (!this.name.equals(channel.getName())) {
            return false;
        }
        return true;
    }

    public int hashCode() {
        int result = this.name != null ? this.name.hashCode() : 0;
        result = 31 * result + this.session.getConnectedHostName().hashCode();
        return result;
    }

    public String toString() {
        return "[Channel: name=" + this.name + "]";
    }

    public void setMsgInterval(long msginterval) {
        this.msginterval = msginterval;
    }

    class MessageTask
    extends TimerTask {
        Channel chan;
        long lastMessage;

        public MessageTask(Channel c) {
            this.lastMessage = 0;
            this.chan = c;
            Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        }

        @Override
        public void run() {
            long now = System.currentTimeMillis();
            if (now - this.lastMessage >= Channel.this.msginterval) {
                String pmsg = (String)this.chan.prioritymessages.poll();
                if (pmsg != null) {
                    this.chan.session.sayChannel(this.chan, pmsg);
                    this.lastMessage = now;
                } else {
                    String msg = (String)this.chan.messages.poll();
                    if (msg != null) {
                        if (Channel.this.allowSendMessages.booleanValue() || msg.startsWith(".timeout ") || msg.startsWith(".ban ") || msg.startsWith(".unban ") || msg.equals(".clear") || msg.equals(".mods")) {
                            this.chan.session.sayChannel(this.chan, msg);
                        }
                        this.lastMessage = now;
                    }
                }
            }
        }
    }

}

