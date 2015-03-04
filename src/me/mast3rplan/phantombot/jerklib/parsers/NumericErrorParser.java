package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.NumericErrorEvent;

public class NumericErrorParser implements CommandParser {
    public IRCEvent createEvent(IRCEvent event) {
        return new NumericErrorEvent
                (
                        event.arg(0),
                        event.getRawEventData(),
                        event.getSession()
                );
    }
}
