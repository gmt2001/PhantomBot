package me.mast3rplan.phantombot.event.twitch.follower;

public class TwitchFollowEvent extends TwitchFollowerEvent {
    public TwitchFollowEvent(String follower) {
        super(follower, Type.FOLLOW);
    }
}
