package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.PartEvent;

/**
 * @author mohadib
 */
public class PartParser implements CommandParser {
    public PartEvent createEvent(IRCEvent event) {
        return new PartEvent
                (
                        event.getRawEventData(),
                        event.getSession(),
                        event.getNick(), // who
                        event.getSession().getChannel(event.arg(0)),
                        event.args().size() == 2 ? event.arg(1) : ""
                );
    }
}
