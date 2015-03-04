package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.NickInUseEvent;

public class NickInUseParser implements CommandParser {
    public IRCEvent createEvent(IRCEvent event) {
        return new NickInUseEvent
                (
                        event.arg(1),
                        event.getRawEventData(),
                        event.getSession()
                );
    }
}
