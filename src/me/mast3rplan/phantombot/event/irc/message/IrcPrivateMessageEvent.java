package me.mast3rplan.phantombot.event.irc.message;

import me.mast3rplan.phantombot.jerklib.Session;

/**
 *
 * @author gmt2001
 */
public class IrcPrivateMessageEvent extends IrcMessageEvent
{
    public IrcPrivateMessageEvent(Session session, String sender, String message) {
        super(session, sender, message);
    }
}
