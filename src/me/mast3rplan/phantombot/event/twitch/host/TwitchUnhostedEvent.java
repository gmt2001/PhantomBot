package me.mast3rplan.phantombot.event.twitch.host;

public class TwitchUnhostedEvent extends TwitchHostEvent {
    public TwitchUnhostedEvent(String hoster) {
        super(hoster, Type.UNHOST);
    }
}
