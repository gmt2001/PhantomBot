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
import me.mast3rplan.phantombot.PhantomBot;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelJoinEvent;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelLeaveEvent;
import org.json.JSONArray;
import org.json.JSONObject;

public class ChannelUsersCache implements Runnable
{

    private static final Map<String, ChannelUsersCache> instances = Maps.newHashMap();

    public static ChannelUsersCache instance(String channel)
    {
        ChannelUsersCache instance = instances.get(channel);

        if (instance == null)
        {
            instance = new ChannelUsersCache(channel);

            instances.put(channel, instance);
            return instance;
        }

        return instance;
    }
    private Map<String, String> cache;
    private String channel;
    private Thread updateThread;
    private Date timeoutExpire = new Date();
    private Date lastFail = new Date();
    private int numfail = 0;

    public ChannelUsersCache(String channel)
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

    public String get(String username)
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
            com.gmt2001.Console.out.println("ChannelUsersCache.run>>Failed to initial sleep: [InterruptedException] " + e.getMessage());
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

                com.gmt2001.Console.out.println("ChannelUsersCache.run>>Failed to update users: " + e.getMessage());
            }

            try
            {
                Thread.sleep(30 * 1000);
            } catch (InterruptedException e)
            {
                com.gmt2001.Console.out.println("ChannelUsersCache.run>>Failed to sleep: [InterruptedException] " + e.getMessage());
            }
        }
    }

    private void updateCache() throws Exception
    {
        Map<String, String> newCache = Maps.newHashMap();

        JSONObject j = TwitchAPIv3.instance().GetChatUsers(channel);

        if (j.getBoolean("_success"))
        {
            if (j.getInt("_http") == 200)
            {
                JSONObject users = j.getJSONObject("chatters");

                JSONArray mods = users.getJSONArray("moderators");
                JSONArray staff = users.getJSONArray("staff");
                JSONArray admins = users.getJSONArray("admins");
                JSONArray global_mods = users.getJSONArray("global_mods");
                JSONArray viewers = users.getJSONArray("viewers");

                for (int i = 0; i < mods.length(); i++)
                {
                    newCache.put(mods.getString(i), "mod");
                }

                for (int i = 0; i < staff.length(); i++)
                {
                    newCache.put(staff.getString(i), "staff");
                }

                for (int i = 0; i < admins.length(); i++)
                {
                    newCache.put(admins.getString(i), "admin");
                }

                for (int i = 0; i < global_mods.length(); i++)
                {
                    newCache.put(admins.getString(i), "global_mod");
                }

                for (int i = 0; i < viewers.length(); i++)
                {
                    newCache.put(viewers.getString(i), "viewer");
                }
            } else
            {
                try
                {
                    throw new Exception("[HTTPErrorException] HTTP " + j.getString("error") + ". req="
                            + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   message="
                            + j.getString("message"));
                } catch (Exception e)
                {
                    com.gmt2001.Console.out.println("ChannelUsersCache.updateCache>>Failed to update users: " + e.getMessage());
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

                com.gmt2001.Console.out.println("ChannelUsersCache.updateCache>>Failed to update users: " + e.getMessage());
            }
        }

        List<String> join = Lists.newArrayList();
        List<String> part = Lists.newArrayList();

        for (String key : newCache.keySet())
        {
            if (cache == null || !cache.containsKey(key))
            {
                join.add(key);
            }
        }

        if (cache != null)
        {
            for (String key : cache.keySet())
            {
                if (!newCache.containsKey(key))
                {
                    part.add(key);
                }
            }
        }

        this.cache = newCache;

        for (String joined : join)
        {
            EventBus.instance().post(new IrcChannelJoinEvent(PhantomBot.instance().getSession(), PhantomBot.instance().getChannel(), joined));
        }

        for (String parted : part)
        {
            EventBus.instance().post(new IrcChannelLeaveEvent(PhantomBot.instance().getSession(), PhantomBot.instance().getChannel(), parted, "Left"));
        }
    }

    public void setCache(Map<String, String> cache)
    {
        this.cache = cache;
    }

    public Map<String, String> getCache()
    {
        return cache;
    }
}
