package me.mast3rplan.phantombot.event.irc;

import me.mast3rplan.phantombot.event.Event;
import me.mast3rplan.phantombot.jerklib.Session;

public abstract class IrcEvent extends Event {
    private Session session;

    protected IrcEvent(Session session) {
        this.session = session;
    }

    public Session getSession() {
        return session;
    }
}
