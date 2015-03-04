package me.mast3rplan.phantombot.event.irc.message;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

public class IrcChannelMessageEvent extends IrcMessageEvent {
    private Channel channel;

    public IrcChannelMessageEvent(Session session, String sender, String message, Channel channel) {
        super(session, sender, message);
        this.channel = channel;
    }

    public Channel getChannel() {
        return channel;
    }
}
