package me.mast3rplan.phantombot.event.irc.complete;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

public class IrcJoinCompleteEvent extends IrcCompleteEvent {
    private Channel channel;

    public IrcJoinCompleteEvent(Session session, Channel channel) {
        super(session);
        this.channel = channel;
    }

    public Channel getChannel() {
        return channel;
    }
}
