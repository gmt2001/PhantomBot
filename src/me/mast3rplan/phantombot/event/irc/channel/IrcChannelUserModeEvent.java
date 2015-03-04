package me.mast3rplan.phantombot.event.irc.channel;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Session;

public class IrcChannelUserModeEvent extends IrcChannelEvent {
    private String user;
    private String mode;
    private Boolean add;

    public IrcChannelUserModeEvent(Session session, Channel channel, String user, String mode, Boolean add) {
        super(session, channel);
        this.user = user;
        this.mode = mode;
        this.add = add;
    }

    public String getUser() {
        return user;
    }
    
    public String getMode() {
        return mode;
    }
    
    public Boolean getAdd() {
        return add;
    }
}
