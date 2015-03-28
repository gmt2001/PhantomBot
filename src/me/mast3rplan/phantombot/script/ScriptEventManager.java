/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * Credits: mast3rplan, gmt2001, PhantomIndex, GloriousEggroll
 * gloriouseggroll@gmail.com, phantomindex@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
package me.mast3rplan.phantombot.script;

import com.google.common.collect.Lists;
import com.google.common.eventbus.Subscribe;
import java.util.Iterator;
import java.util.List;
import me.mast3rplan.phantombot.PhantomBot;
import me.mast3rplan.phantombot.event.Event;
import me.mast3rplan.phantombot.event.Listener;
import org.apache.commons.lang3.text.WordUtils;

public class ScriptEventManager implements Listener
{

    private static final ScriptEventManager instance = new ScriptEventManager();

    public static ScriptEventManager instance()
    {
        return instance;
    }
    private static final String[] eventPackages = new String[]
    {
        "me.mast3rplan.phantombot.event.command",
        "me.mast3rplan.phantombot.event.console",
        "me.mast3rplan.phantombot.event.twitch.follower",
        "me.mast3rplan.phantombot.event.twitch.host",
        "me.mast3rplan.phantombot.event.twitch.subscriber",
        "me.mast3rplan.phantombot.event.irc",
        "me.mast3rplan.phantombot.event.irc.channel",
        "me.mast3rplan.phantombot.event.irc.complete",
        "me.mast3rplan.phantombot.event.irc.message",
        "me.mast3rplan.phantombot.event.musicplayer"
    };

    private ScriptEventManager()
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    private static class EventHandlerEntry
    {

        Class<? extends Event> eventClass;
        ScriptEventHandler handler;

        private EventHandlerEntry(Class<? extends Event> eventClass, ScriptEventHandler handler)
        {
            this.eventClass = eventClass;
            this.handler = handler;
        }
    }
    private List<EventHandlerEntry> entries = Lists.newArrayList();

    @Subscribe
    public void onEvent(Event event)
    {
        try
        {
            for (EventHandlerEntry entry : entries)
            {
                if (event.getClass().isAssignableFrom(entry.eventClass))
                {
                    if (PhantomBot.enableDebugging)
                    {
                        com.gmt2001.Console.out.println(">>>[DEBUG] Dispatching event " + entry.eventClass.getName());
                    }

                    entry.handler.handle(event);
                }
            }
        } catch (Exception e)
        {
            com.gmt2001.Console.out.println(">>>[DEBUG] Failed to dispatch event " + event.getClass().getName());
            com.gmt2001.Console.err.printStackTrace(e);
        }
    }

    public void register(String eventName, ScriptEventHandler handler)
    {
        Class<? extends Event> eventClass = null;
        for (String eventPackage : eventPackages)
        {
            try
            {
                eventClass = Class.forName(eventPackage + "." + WordUtils.capitalize(eventName) + "Event").asSubclass(Event.class);
                break;
            } catch (ClassNotFoundException e)
            {
            }
        }

        if (eventClass == null)
        {
            throw new RuntimeException("Event class not found: " + eventName);
        }

        entries.add(new EventHandlerEntry(eventClass, handler));
    }

    public void unregister(ScriptEventHandler handler)
    {
        EventHandlerEntry entry = null;
        Iterator<EventHandlerEntry> iterator = entries.iterator();
        while (iterator.hasNext())
        {
            entry = iterator.next();
            if (entry.handler == handler)
            {
                iterator.remove();
            }
        }
    }
}
