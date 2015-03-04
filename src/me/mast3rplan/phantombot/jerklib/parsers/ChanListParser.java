package me.mast3rplan.phantombot.jerklib.parsers;

import me.mast3rplan.phantombot.jerklib.events.ChannelListEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ChanListParser implements CommandParser {
    public IRCEvent createEvent(IRCEvent event) {
        String data = event.getRawEventData();
        Pattern p = Pattern.compile("^:\\S+\\s322\\s\\S+\\s(\\S+)\\s(\\d+)\\s:(.*)$");
        Matcher m = p.matcher(data);
        if (m.matches()) {
            return new ChannelListEvent
                    (
                            data,
                            m.group(1),
                            m.group(3),
                            Integer.parseInt(m.group(2)),
                            event.getSession()
                    );
        }
        return event;
    }
}
