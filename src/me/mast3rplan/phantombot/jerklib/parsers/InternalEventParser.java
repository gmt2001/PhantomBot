package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public interface InternalEventParser {
    public IRCEvent receiveEvent(IRCEvent e);
}
