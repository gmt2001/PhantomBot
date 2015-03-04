
package me.mast3rplan.phantombot.jerklib.listeners;

import me.mast3rplan.phantombot.jerklib.events.IRCEvent;

/**
 * IRCEventListener - Listener to receive IRCEvents
 *
 * @author mohadib
 */
public interface IRCEventListener {

    /**
     * recieveEvent() - receive IRCEvents
     *
     * @param e <code>IrcEvent<code> the event
     */
    public void receiveEvent(IRCEvent e);
}
