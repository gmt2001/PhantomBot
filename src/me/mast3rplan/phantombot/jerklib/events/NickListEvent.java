package me.mast3rplan.phantombot.jerklib.events;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

import java.util.List;

/**
 * Event fired when nick list event comes from server
 *
 * @author mohadib
 */
public class NickListEvent extends IRCEvent {
    private final List<String> nicks;
    private final Channel channel;

    public NickListEvent(String rawEventData, Session session, Channel channel, List<String> nicks) {
        super(rawEventData, session, Type.NICK_LIST_EVENT);
        this.channel = channel;
        this.nicks = nicks;

    }

    /**
     * Gets the channel the nick list came from
     *
     * @return Channel
     * @see Channel
     */
    public Channel getChannel() {
        return channel;
    }

    /**
     * Gets the nick list for the Channel
     *
     * @return List of nicks in channel
     */
    public List<String> getNicks() {
        return nicks;
    }
}
