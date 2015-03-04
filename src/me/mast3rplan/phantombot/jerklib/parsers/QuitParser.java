package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.QuitEvent;

import java.util.List;

public class QuitParser implements CommandParser {
    public QuitEvent createEvent(IRCEvent event) {
        Session session = event.getSession();
        String nick = event.getNick();
        List<Channel> chanList = event.getSession().removeNickFromAllChannels(nick);
        return new QuitEvent
                (
                        event.getRawEventData(),
                        session,
                        event.arg(0), // message
                        chanList
                );
    }
}
