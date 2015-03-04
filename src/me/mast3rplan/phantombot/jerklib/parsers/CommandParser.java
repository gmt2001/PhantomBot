package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

public interface CommandParser {
    public IRCEvent createEvent(IRCEvent event);
}
