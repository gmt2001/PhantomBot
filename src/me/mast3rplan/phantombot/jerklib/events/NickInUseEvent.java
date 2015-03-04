package me.mast3rplan.phantombot.jerklib.events;

import me.mast3rplan.phantombot.jerklib.Session;

/**
 * NickInUseEvent is fired when me.mast3rplan.phantombot.jerklib is trying to use a nick
 * that is in use on a given server.
 *
 * @author mohadib
 */
public class NickInUseEvent extends IRCEvent {

    private final String inUseNick;

    public NickInUseEvent(String inUseNick, String rawEventData, Session session) {
        super(rawEventData, session, Type.NICK_IN_USE);
        this.inUseNick = inUseNick;
    }

    /**
     * returns nick that is in use
     *
     * @return nick that is in use.
     */
    public String getInUseNick() {
        return inUseNick;
    }
}
