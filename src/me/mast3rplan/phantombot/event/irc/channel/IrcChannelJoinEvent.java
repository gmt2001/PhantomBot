package me.mast3rplan.phantombot.event.irc.channel;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

public class IrcChannelJoinEvent extends IrcChannelEvent {
    private String user;

    public IrcChannelJoinEvent(Session session, Channel channel, String user) {
        super(session, channel);
        this.user = user;
    }

    public String getUser() {
        return user;
    }
}
