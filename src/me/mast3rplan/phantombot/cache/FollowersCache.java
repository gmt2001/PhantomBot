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

import com.gmt2001.Console.out;
import com.gmt2001.TwitchAPIv3;
import com.gmt2001.UncaughtExceptionHandler;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import me.mast3rplan.phantombot.event.Event;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.twitch.follower.TwitchFollowEvent;
import me.mast3rplan.phantombot.event.twitch.follower.TwitchFollowsInitializedEvent;
import me.mast3rplan.phantombot.event.twitch.follower.TwitchUnfollowEvent;
import org.json.JSONArray;
import org.json.JSONObject;

public class FollowersCache
implements Runnable {
    private static final Map<String, FollowersCache> instances = Maps.newHashMap();
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

    public static FollowersCache instance(String channel) {
        FollowersCache instance = instances.get(channel);
        if (instance == null) {
            instance = new FollowersCache(channel);
            instances.put(channel, instance);
            return instance;
        }
        return instance;
    }

    public FollowersCache(String channel) {
        this.channel = channel;
        this.updateThread = new Thread(this);
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        this.updateThread.setUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        this.updateThread.start();
    }

  public int quickUpdate(String channel)
    throws Exception
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
        for (String key : newCache.keySet()) {
          if ((this.cache == null) || (!this.cache.containsKey(key)))
          {
            this.cache.put(key, newCache.get(key));
            EventBus.instance().post(new TwitchFollowEvent(key));
          }
        }
        this.count = this.cache.size();
        
        return i;
      }
      throw new Exception("[HTTPErrorException] HTTP " + ". req=" + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post"));
    }
    throw new Exception("[" + j.getString("_exception") + "] " + j.getString("_exceptionMessage"));
  }

    public boolean is(String username) {
        return this.cache.containsKey(username);
    }

    public JSONObject get(String username) {
        return this.cache.get(username);
    }

    @Override
    public void run() {
        try {
            Thread.sleep(30000);
        }
        catch (InterruptedException e) {
            out.println("FollowersCache.run>>Failed to initial sleep: [InterruptedException] " + e.getMessage());
        }
        if (this.firstUpdate) {
            this.firstUpdate = false;
            EventBus.instance().post(new TwitchFollowsInitializedEvent());
        }
        do {
            try {
                if (new Date().after(this.timeoutExpire)) {
                    int newCount = this.quickUpdate(this.channel);
                }
            }
            catch (Exception e) {
                if (e.getMessage().startsWith("[SocketTimeoutException]") || e.getMessage().startsWith("[IOException]")) {
                    Calendar c = Calendar.getInstance();
                    this.numfail = this.lastFail.after(new Date()) ? ++this.numfail : 1;
                    c.add(12, 1);
                    this.lastFail = c.getTime();
                    if (this.numfail >= 5) {
                        this.timeoutExpire = c.getTime();
                    }
                }
                out.println("FollowersCache.run>>Failed to update followers: " + e.getMessage());
            }
            try {
                Thread.sleep(30000);
            }
            catch (InterruptedException e) {
                out.println("FollowersCache.run>>Failed to sleep: [InterruptedException] " + e.getMessage());
            }
        } while (true);
    }

private void updateCache(int newCount)
    throws Exception
  {
    Map<String, JSONObject> newCache = Maps.newHashMap();
    
    final List<JSONObject> responses = Lists.newArrayList();
    List<Thread> threads = Lists.newArrayList();
    
    this.hasFail = false;
    
    Calendar c = Calendar.getInstance();
    
    c.add(10, 1);
    
    this.nextFull = c.getTime();
    for (int i = 0; i < Math.ceil(newCount / 100.0D); i++)
    {
      final int offset = i * 100;
      Thread thread = new Thread()
      {
        public void run()
        {
          JSONObject j = TwitchAPIv3.instance().GetChannelFollows(FollowersCache.this.channel, 100, offset, true);
          if (j.getBoolean("_success"))
          {
            if (j.getInt("_http") == 200) {
              responses.add(j);
            } else {
              try
              {
                throw new Exception("[HTTPErrorException] HTTP " + j.getInt("status") + " " + j.getString("error") + ". req=" + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   message=" + j.getString("message"));
              }
              catch (Exception e)
              {
                out.println("FollowersCache.updateCache>>Failed to update followers: " + e.getMessage());
              }
            }
          }
          else {
            try
            {
              throw new Exception("[" + j.getString("_exception") + "] " + j.getString("_exceptionMessage"));
            }
            catch (Exception e)
            {
              if (((e.getMessage().startsWith("[SocketTimeoutException]")) || (e.getMessage().startsWith("[IOException]"))) && (!FollowersCache.this.hasFail))
              {
                FollowersCache.this.hasFail = true;
                
                Calendar c = Calendar.getInstance();
                if (FollowersCache.this.lastFail.after(new Date())) {
                  FollowersCache.this.numfail++;
                } else {
                  FollowersCache.this.numfail = 1;
                }
                c.add(12, 1);
                
                FollowersCache.this.lastFail = c.getTime();
                if (FollowersCache.this.numfail >= 5) {
                  FollowersCache.this.timeoutExpire = c.getTime();
                }
              }
              out.println("FollowersCache.updateCache>>Failed to update followers: " + e.getMessage());
            }
          }
        }
      };
      threads.add(thread);
      thread.start();
    }
    for (Thread thread : threads) {
      thread.join();
    }
    for (JSONObject response : responses)
    {
      JSONArray followers = response.getJSONArray("follows");
      if (followers.length() == 0) {
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
    for (String key : newCache.keySet()) {
      if ((this.cache == null) || (!this.cache.containsKey(key))) {
        followers.add(key);
      }
    }
    if (this.cache != null) {
      for (String key : this.cache.keySet()) {
        if (!newCache.containsKey(key)) {
          unfollowers.add(key);
        }
      }
    }
    this.cache = newCache;
    this.count = newCache.size();
    for (String follower : followers) {
      EventBus.instance().post(new TwitchFollowEvent(follower));
    }
    for (String follower : unfollowers) {
      EventBus.instance().post(new TwitchUnfollowEvent(follower));
    }
    if (this.firstUpdate)
    {
      this.firstUpdate = false;
      EventBus.instance().post(new TwitchFollowsInitializedEvent());
    }
  }

    public void addFollower(String username) {
        this.cache.put(username, null);
    }

    public void setCache(Map<String, JSONObject> cache) {
        this.cache = cache;
    }

    public Map<String, JSONObject> getCache() {
        return this.cache;
    }

}

