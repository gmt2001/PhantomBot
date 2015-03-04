package me.mast3rplan.phantombot.event.twitch.follower;

import me.mast3rplan.phantombot.event.twitch.TwitchEvent;

public abstract class TwitchFollowerEvent extends TwitchEvent {
    private String follower;
    private Type type;

    enum Type {
        FOLLOW,
        UNFOLLOW;
    }

    protected TwitchFollowerEvent(String follower, Type type) {
        this.follower = follower;
        this.type = type;
    }

    public String getFollower() {
        return follower;
    }

    public Type getType() {
        return type;
    }
}
