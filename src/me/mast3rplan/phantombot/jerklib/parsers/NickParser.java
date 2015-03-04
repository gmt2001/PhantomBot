package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.NickChangeEvent;

public class NickParser implements CommandParser {
    public IRCEvent createEvent(IRCEvent event) {
        Session session = event.getSession();
        return new NickChangeEvent
                (
                        event.getRawEventData(),
                        session,
                        event.getNick(), // old
                        event.arg(0)// new nick
                );
    }
}
