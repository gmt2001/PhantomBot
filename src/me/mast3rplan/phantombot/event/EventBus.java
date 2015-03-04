package me.mast3rplan.phantombot.event;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import java.util.List;
import java.util.Set;

public class EventBus {
    private static final EventBus instance = new EventBus();
    public static EventBus instance() {
        return instance;
    }

    private com.google.common.eventbus.EventBus eventBus = new com.google.common.eventbus.EventBus("PhantomBot");
    private Set<Listener> listeners = Sets.newHashSet();

    public void register(Listener listener) {
        listeners.add(listener);
        eventBus.register(listener);
    }

    public void unregister(Listener listener) {
        listeners.remove(listener);
        eventBus.unregister(listener);
    }

    public void post(Event event) {
        eventBus.post(event);
    }
}
