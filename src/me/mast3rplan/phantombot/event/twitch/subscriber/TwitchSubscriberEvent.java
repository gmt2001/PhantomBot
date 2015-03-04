package me.mast3rplan.phantombot.event.twitch.subscriber;

import me.mast3rplan.phantombot.event.twitch.TwitchEvent;

public abstract class TwitchSubscriberEvent extends TwitchEvent {
    private String subscriber;
    private Type type;

    enum Type {
        SUBSCRIBE,
        UNSUBSCRIBE;
    }

    protected TwitchSubscriberEvent(String subscriber, Type type) {
        this.subscriber = subscriber;
        this.type = type;
    }

    public String getSubscriber() {
        return subscriber;
    }

    public Type getType() {
        return type;
    }
}
