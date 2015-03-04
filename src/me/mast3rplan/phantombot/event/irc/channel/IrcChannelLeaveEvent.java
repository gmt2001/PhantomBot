package me.mast3rplan.phantombot.event.irc.channel;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

public class IrcChannelLeaveEvent extends IrcChannelEvent {
    private String user;
    private String message;

    public IrcChannelLeaveEvent(Session session, Channel channel, String user, String message) {
        super(session, channel);
        this.user = user;
        this.message = message;
    }

    public String getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }
}
