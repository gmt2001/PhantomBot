package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.MotdEvent;

public class MotdParser implements CommandParser {
    public IRCEvent createEvent(IRCEvent event) {
        return new MotdEvent
                (
                        event.getRawEventData(),
                        event.getSession(),
                        event.arg(1),
                        event.prefix()
                );
    }
}
