package me.mast3rplan.phantombot.event.twitch.subscriber;

public class TwitchUnsubscribeEvent extends TwitchSubscriberEvent {
    public TwitchUnsubscribeEvent(String subscriber) {
        super(subscriber, Type.UNSUBSCRIBE);
    }
}
