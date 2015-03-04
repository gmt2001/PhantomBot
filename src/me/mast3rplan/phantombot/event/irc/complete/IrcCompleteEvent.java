package me.mast3rplan.phantombot.event.irc.complete;

import me.mast3rplan.phantombot.event.irc.IrcEvent;
import me.mast3rplan.phantombot.jerklib.Session;

public abstract class IrcCompleteEvent extends IrcEvent {
    protected IrcCompleteEvent(Session session) {
        super(session);
    }
}
