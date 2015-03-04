package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.ServerInformationEvent;

public class ServerInformationParser implements CommandParser {
    public IRCEvent createEvent(IRCEvent event) {
        Session session = event.getSession();
        session.getServerInformation().parseServerInfo(event.getRawEventData());
        return new ServerInformationEvent(session, event.getRawEventData(), session.getServerInformation());
    }
}
