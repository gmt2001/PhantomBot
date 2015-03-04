package me.mast3rplan.phantombot.event.irc.channel;

import me.mast3rplan.phantombot.event.irc.IrcEvent;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

public class IrcChannelEvent extends IrcEvent {
    private Channel channel;

    protected IrcChannelEvent(Session session, Channel channel) {
        super(session);
        this.channel = channel;
    }

    public Channel getChannel() {
        return channel;
    }
}
