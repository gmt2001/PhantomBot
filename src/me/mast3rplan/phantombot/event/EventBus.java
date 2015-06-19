/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package me.mast3rplan.phantombot.event;

import com.google.common.collect.Sets;
import java.util.Set;
import java.util.concurrent.Executors;

public class EventBus
{

    private static final EventBus instance = new EventBus();

    public static EventBus instance()
    {
        return instance;
    }
    private com.google.common.eventbus.AsyncEventBus eventBus = new com.google.common.eventbus.AsyncEventBus(Executors.newCachedThreadPool());
    private Set<Listener> listeners = Sets.newHashSet();

    public void register(Listener listener)
    {
        listeners.add(listener);
        eventBus.register(listener);
    }

    public void unregister(Listener listener)
    {
        listeners.remove(listener);
        eventBus.unregister(listener);
    }

    public void post(Event event)
    {
        eventBus.post(event);
    }
}
