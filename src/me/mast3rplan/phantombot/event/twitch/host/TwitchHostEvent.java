package me.mast3rplan.phantombot.event.twitch.host;

import me.mast3rplan.phantombot.event.twitch.TwitchEvent;

public abstract class TwitchHostEvent extends TwitchEvent {
    private String hoster;
    private Type type;

    enum Type {
        HOST,
        UNHOST;
    }

    protected TwitchHostEvent(String hoster, Type type) {
        this.hoster = hoster;
        this.type = type;
    }

    public String getHoster() {
        return hoster;
    }

    public Type getType() {
        return type;
    }
}
