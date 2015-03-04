package me.mast3rplan.phantombot.jerklib.events;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

import java.util.List;

/**
 * This is the event fired when someone quits
 *
 * @author mohadib
 */
public class QuitEvent extends IRCEvent {

    private final String msg;
    private final List<Channel> chanList;

    public QuitEvent(String rawEventData, Session session, String msg, List<Channel> chanList) {
        super(rawEventData, session, Type.QUIT);
        this.msg = msg;
        this.chanList = chanList;
    }


    /**
     * getQuitMessage get the quit message
     *
     * @return the quit message
     */
    public final String getQuitMessage() {
        return msg;
    }

    /**
     * returns a list of Channel objects
     * the nick who quit was in
     *
     * @return List of channels nick was in
     * @see Channel
     */
    public final List<Channel> getChannelList() {
        return chanList;
    }
}
