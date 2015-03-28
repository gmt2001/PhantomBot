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
package me.mast3rplan.phantombot.cache;

import com.gmt2001.TwitchAPIv3;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.twitch.host.TwitchHostedEvent;
import me.mast3rplan.phantombot.event.twitch.host.TwitchHostsInitializedEvent;
import me.mast3rplan.phantombot.event.twitch.host.TwitchUnhostedEvent;
import org.json.JSONArray;
import org.json.JSONObject;

public class ChannelHostCache implements Runnable
{

    private static final Map<String, ChannelHostCache> instances = Maps.newHashMap();

    public static ChannelHostCache instance(String channel)
    {
        ChannelHostCache instance = instances.get(channel);

        if (instance == null)
        {
            instance = new ChannelHostCache(channel);

            instances.put(channel, instance);
            return instance;
        }

        return instance;
    }
    private Map<String, JSONObject> cache;
    private String channel;
    private Thread updateThread;
    private boolean firstUpdate = true;
    private Date timeoutExpire = new Date();
    private Date lastFail = new Date();
    private int numfail = 0;

    public ChannelHostCache(String channel)
    {
        this.channel = channel;
        this.updateThread = new Thread(this);

        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
        this.updateThread.setUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        updateThread.start();
    }

    public boolean is(String username)
    {
        return cache.containsKey(username);
    }

    public JSONObject get(String username)
    {
        return cache.get(username);
    }

    public int count()
    {
        return cache.size();
    }

    @Override
    public void run()
    {
        try
        {
            Thread.sleep(30 * 1000);
        } catch (InterruptedException e)
        {
            com.gmt2001.Console.out.println("ChannelHostCache.run>>Failed to initial sleep: [InterruptedException] " + e.getMessage());
        }

        while (true)
        {
            try
            {
                if (new Date().after(timeoutExpire))
                {
                    this.updateCache();
                }
            } catch (Exception e)
            {
                if (e.getMessage().startsWith("[SocketTimeoutException]") || e.getMessage().startsWith("[IOException]"))
                {
                    Calendar c = Calendar.getInstance();

                    if (lastFail.after(new Date()))
                    {
                        numfail++;
                    } else
                    {
                        numfail = 1;
                    }

                    c.add(Calendar.MINUTE, 1);

                    lastFail = c.getTime();

                    if (numfail >= 5)
                    {
                        timeoutExpire = c.getTime();
                    }
                }

                com.gmt2001.Console.out.println("ChannelHostCache.run>>Failed to update hosts: " + e.getMessage());
            }

            try
            {
                Thread.sleep(30 * 1000);
            } catch (InterruptedException e)
            {
                com.gmt2001.Console.out.println("ChannelHostCache.run>>Failed to sleep: [InterruptedException] " + e.getMessage());
            }
        }
    }

    private void updateCache() throws Exception
    {
        Map<String, JSONObject> newCache = Maps.newHashMap();

        JSONObject j = TwitchAPIv3.instance().GetHostUsers(channel);

        if (j.getBoolean("_success"))
        {
            if (j.getInt("_http") == 200)
            {
                JSONArray hosts = j.getJSONArray("hosts");

                for (int i = 0; i < hosts.length(); i++)
                {
                    newCache.put(hosts.getJSONObject(i).getString("host"), hosts.getJSONObject(i));
                }
            } else
            {
                try
                {
                    throw new Exception("[HTTPErrorException] HTTP " + j.getInt("status") + " " + j.getString("error") + ". req="
                            + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   message="
                            + j.getString("message"));
                } catch (Exception e)
                {
                    com.gmt2001.Console.out.println("ChannelHostCache.updateCache>>Failed to update hosts: " + e.getMessage());
                }
            }
        } else
        {
            try
            {
                throw new Exception("[" + j.getString("_exception") + "] " + j.getString("_exceptionMessage"));
            } catch (Exception e)
            {
                if (e.getMessage().startsWith("[SocketTimeoutException]") || e.getMessage().startsWith("[IOException]"))
                {
                    Calendar c = Calendar.getInstance();

                    if (lastFail.after(new Date()))
                    {
                        numfail++;
                    } else
                    {
                        numfail = 1;
                    }

                    c.add(Calendar.MINUTE, 1);

                    lastFail = c.getTime();

                    if (numfail >= 5)
                    {
                        timeoutExpire = c.getTime();
                    }
                }

                com.gmt2001.Console.out.println("ChannelHostCache.updateCache>>Failed to update hosts: " + e.getMessage());
            }
        }

        List<String> hosted = Lists.newArrayList();
        List<String> unhosted = Lists.newArrayList();

        for (String key : newCache.keySet())
        {
            if (cache == null || !cache.containsKey(key))
            {
                hosted.add(key);
            }
        }

        if (cache != null)
        {
            for (String key : cache.keySet())
            {
                if (!newCache.containsKey(key))
                {
                    unhosted.add(key);
                }
            }
        }

        this.cache = newCache;

        for (String hoster : hosted)
        {
            EventBus.instance().post(new TwitchHostedEvent(hoster));
        }

        for (String unhoster : unhosted)
        {
            EventBus.instance().post(new TwitchUnhostedEvent(unhoster));
        }

        if (firstUpdate)
        {
            firstUpdate = false;
            EventBus.instance().post(new TwitchHostsInitializedEvent());
        }
    }

    public void setCache(Map<String, JSONObject> cache)
    {
        this.cache = cache;
    }

    public Map<String, JSONObject> getCache()
    {
        return cache;
    }
}
