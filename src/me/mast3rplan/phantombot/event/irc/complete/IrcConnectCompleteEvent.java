package me.mast3rplan.phantombot.event.irc.complete;

import me.mast3rplan.phantombot.jerklib.Session;

public class IrcConnectCompleteEvent extends IrcCompleteEvent {
    public IrcConnectCompleteEvent(Session session) {
        super(session);
    }
}
