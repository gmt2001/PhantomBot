package me.mast3rplan.phantombot.event.twitch.host;

public class TwitchHostedEvent extends TwitchHostEvent {
    public TwitchHostedEvent(String hoster) {
        super(hoster, Type.HOST);
    }
}
