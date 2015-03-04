package me.mast3rplan.phantombot.event.twitch.follower;

public class TwitchUnfollowEvent extends TwitchFollowerEvent {
    public TwitchUnfollowEvent(String follower) {
        super(follower, Type.UNFOLLOW);
    }
}
