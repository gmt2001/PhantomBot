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
package me.mast3rplan.phantombot.cache;

import com.gmt2001.TwitchAPIv3;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.twitch.follower.TwitchFollowEvent;
import me.mast3rplan.phantombot.event.twitch.follower.TwitchFollowsInitializedEvent;
import me.mast3rplan.phantombot.event.twitch.follower.TwitchUnfollowEvent;
import org.json.JSONArray;
import org.json.JSONObject;

public class FollowersCache implements Runnable
{

    private static final Map<String, FollowersCache> instances = Maps.newHashMap();

    public static FollowersCache instance(String channel)
    {
        FollowersCache instance = instances.get(channel);
        if (instance == null)
        {
            instance = new FollowersCache(channel);

            instances.put(channel, instance);
            return instance;
        }

        return instance;
    }
    private Map<String, JSONObject> cache = Maps.newHashMap();
    private String channel;
    private int count = 0;
    private Thread updateThread;
    private boolean firstUpdate = true;
    private Date timeoutExpire = new Date();
    private Date nextFull = new Date();
    private Date lastFail = new Date();
    private int numfail = 0;
    private boolean hasFail = false;

    public FollowersCache(String channel)
    {
        this.channel = channel;
        this.updateThread = new Thread(this);

        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
        this.updateThread.setUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        updateThread.start();
    }

    public int quickUpdate(String channel) throws Exception
    {
        JSONObject j = TwitchAPIv3.instance().GetChannelFollows(channel, 100, 0, false);

        if (j.getBoolean("_success"))
        {
            if (j.getInt("_http") == 200)
            {
                int i = j.getInt("_total");

                Map<String, JSONObject> newCache = Maps.newHashMap();
                JSONArray followers = j.getJSONArray("follows");

                for (int b = 0; b < followers.length(); b++)
                {
                    JSONObject follower = followers.getJSONObject(b);
                    newCache.put(follower.getJSONObject("user").getString("name"), follower);
                }

                for (String key : newCache.keySet())
                {
                    if (cache == null || !cache.containsKey(key))
                    {
                        cache.put(key, newCache.get(key));
                        EventBus.instance().post(new TwitchFollowEvent(key));
                    }
                }

                this.count = cache.size();

                return i;
            } else
            {
                throw new Exception("[HTTPErrorException] HTTP " + j.getInt("status") + " " + j.getString("error") + ". req="
                        + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   message="
                        + j.getString("message"));
            }
        } else
        {
            throw new Exception("[" + j.getString("_exception") + "] " + j.getString("_exceptionMessage"));
        }
    }

    public boolean is(String username)
    {
        return cache.containsKey(username);
    }

    public JSONObject get(String username)
    {
        return cache.get(username);
    }

    @Override
    public void run()
    {
        try
        {
            Thread.sleep(30 * 1000);
        } catch (InterruptedException e)
        {
            com.gmt2001.Console.out.println("FollowersCache.run>>Failed to initial sleep: [InterruptedException] " + e.getMessage());
        }
        EventBus.instance().post(new TwitchFollowsInitializedEvent());
        while (true)
        {
            try
            {
                if (new Date().after(timeoutExpire))
                {
                    int newCount = quickUpdate(channel);

                    /*if (new Date().after(timeoutExpire) && (Math.abs(newCount - count) > 30 || firstUpdate || new Date().after(nextFull)))
                     {
                     this.updateCache(newCount);
                     }*/

                    /*if (firstUpdate)
                    {
                        firstUpdate = false;
                        EventBus.instance().post(new TwitchFollowsInitializedEvent());
                    }*/
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

                com.gmt2001.Console.out.println("FollowersCache.run>>Failed to update followers: " + e.getMessage());
            }

            try
            {
                Thread.sleep(30 * 1000);
            } catch (InterruptedException e)
            {
                com.gmt2001.Console.out.println("FollowersCache.run>>Failed to sleep: [InterruptedException] " + e.getMessage());
            }
        }
    }

    private void updateCache(int newCount) throws Exception
    {
        Map<String, JSONObject> newCache = Maps.newHashMap();

        final List<JSONObject> responses = Lists.newArrayList();
        List<Thread> threads = Lists.newArrayList();

        hasFail = false;

        Calendar c = Calendar.getInstance();

        c.add(Calendar.HOUR, 1);

        nextFull = c.getTime();

        for (int i = 0; i < Math.ceil(newCount / 100.0); i++)
        {
            final int offset = i * 100;
            Thread thread = new Thread()
            {
                @Override
                public void run()
                {
                    JSONObject j = TwitchAPIv3.instance().GetChannelFollows(channel, 100, offset, true);

                    if (j.getBoolean("_success"))
                    {
                        if (j.getInt("_http") == 200)
                        {
                            responses.add(j);

                        } else
                        {
                            try
                            {
                                throw new Exception("[HTTPErrorException] HTTP " + j.getInt("status") + " " + j.getString("error") + ". req="
                                        + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   message="
                                        + j.getString("message"));
                            } catch (Exception e)
                            {
                                com.gmt2001.Console.out.println("FollowersCache.updateCache>>Failed to update followers: " + e.getMessage());
                            }
                        }
                    } else
                    {
                        try
                        {
                            throw new Exception("[" + j.getString("_exception") + "] " + j.getString("_exceptionMessage"));
                        } catch (Exception e)
                        {
                            if ((e.getMessage().startsWith("[SocketTimeoutException]") || e.getMessage().startsWith("[IOException]")) && !hasFail)
                            {
                                hasFail = true;

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

                            com.gmt2001.Console.out.println("FollowersCache.updateCache>>Failed to update followers: " + e.getMessage());
                        }
                    }
                }
            };
            threads.add(thread);
            thread.start();
        }

        for (Thread thread : threads)
        {
            thread.join();
        }

        for (JSONObject response : responses)
        {
            JSONArray followers = response.getJSONArray("follows");

            if (followers.length() == 0)
            {
                break;
            }

            for (int j = 0; j < followers.length(); j++)
            {
                JSONObject follower = followers.getJSONObject(j);
                newCache.put(follower.getJSONObject("user").getString("name"), follower);
            }
        }

        List<String> followers = Lists.newArrayList();
        List<String> unfollowers = Lists.newArrayList();

        for (String key : newCache.keySet())
        {
            if (cache == null || !cache.containsKey(key))
            {
                followers.add(key);
            }
        }

        if (cache != null)
        {
            for (String key : cache.keySet())
            {
                if (!newCache.containsKey(key))
                {
                    unfollowers.add(key);
                }
            }
        }

        this.cache = newCache;
        this.count = newCache.size();

        for (String follower : followers)
        {
            EventBus.instance().post(new TwitchFollowEvent(follower));
        }

        for (String follower : unfollowers)
        {
            EventBus.instance().post(new TwitchUnfollowEvent(follower));
        }

        if (firstUpdate)
        {
            firstUpdate = false;
            EventBus.instance().post(new TwitchFollowsInitializedEvent());
        }
    }

    public void addFollower(String username)
    {
        cache.put(username, null);
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
