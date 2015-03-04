package me.mast3rplan.phantombot.event.twitch.subscriber;

public class TwitchSubscribeEvent extends TwitchSubscriberEvent {
    public TwitchSubscribeEvent(String subscriber) {
        super(subscriber, Type.SUBSCRIBE);
    }
}
