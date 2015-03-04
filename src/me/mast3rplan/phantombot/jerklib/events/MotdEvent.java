package me.mast3rplan.phantombot.jerklib.events;

import me.mast3rplan.phantombot.jerklib.Session;

/**
 * MOTDEvent is the event dispatched for every MOTD line from the server
 *
 * @author mohadib
 */
public class MotdEvent extends IRCEvent {

    private final String motdLine, hostName;

    public MotdEvent(String rawEventData, Session session, String motdLine, String hostName) {
        super(rawEventData, session, Type.MOTD);
        this.motdLine = motdLine;
        this.hostName = hostName;
    }

    /**
     * Gets a line of the MOTD
     *
     * @return One line of the MOTD
     */
    public String getMotdLine() {
        return motdLine;
    }

    /**
     * returns name of host this event originated from
     *
     * @return hostname
     */
    public String getHostName() {
        return hostName;
    }
}
