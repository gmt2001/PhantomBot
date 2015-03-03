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
import me.mast3rplan.phantombot.event.twitch.subscriber.TwitchSubscribeEvent;
import me.mast3rplan.phantombot.event.twitch.subscriber.TwitchSubscribesInitializedEvent;
import me.mast3rplan.phantombot.event.twitch.subscriber.TwitchUnsubscribeEvent;
import org.json.JSONArray;
import org.json.JSONObject;

public class SubscribersCache
implements Runnable {
    private static final Map<String, SubscribersCache> instances = Maps.newHashMap();
    private boolean run = false;
    private Map<String, JSONObject> cache;
    private String channel;
    private int count;
    private Thread updateThread;
    private boolean firstUpdate = true;
    private Date timeoutExpire = new Date();
    private Date lastFail = new Date();
    private int numfail = 0;

    public static SubscribersCache instance(String channel) {
        SubscribersCache instance = instances.get(channel);
        if (instance == null) {
            instance = new SubscribersCache(channel);
            instances.put(channel, instance);
            return instance;
        }
        return instance;
    }

    public SubscribersCache(String channel) {
        this.channel = channel;
        this.updateThread = new Thread(this);
        this.cache = Maps.newHashMap();
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        this.updateThread.setUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        this.updateThread.start();
    }

    public int getCount(String channel) throws Exception {
        JSONObject j = TwitchAPIv3.instance().GetChannelSubscriptions(channel, 1, 0, false);
        if (j.getBoolean("_success")) {
            if (j.getInt("_http") == 200) {
                int i = j.getInt("_total");
                return i;
            }
            throw new Exception("[HTTPErrorException] HTTP " + j.getInt("status") + " " + j.getString("error") + ". req=" + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   content=" + j.getString("_content"));
        }
        throw new Exception("[" + j.getString("_exception") + "] " + j.getString("_exceptionMessage"));
    }

    public boolean is(String username) {
        return this.cache.containsKey(username);
    }

    public JSONObject get(String username) {
        return this.cache.get(username);
    }

    public void doRun(boolean run) {
        this.run = run;
    }

public void run()
  {
        try
        {
            Thread.sleep(30000L);
        }
        catch(InterruptedException e)
        {
            out.println((new StringBuilder()).append("SubscribersCache.run>>Failed to initial sleep: [InterruptedException] ").append(e.getMessage()).toString());
        }
        do
        {
            try
            {
                if((new Date()).after(timeoutExpire) && run && TwitchAPIv3.instance().HasOAuth())
                {
                    int newCount = getCount(channel);
                    if((new Date()).after(timeoutExpire) && newCount != count)
                        updateCache(newCount);
                }
            }
            catch(Exception e)
            {
                if(e.getMessage().startsWith("[SocketTimeoutException]") || e.getMessage().startsWith("[IOException]"))
                {
                    Calendar c = Calendar.getInstance();
                    if(lastFail.after(new Date()))
                        numfail++;
                    else
                        numfail = 1;
                    c.add(12, 1);
                    lastFail = c.getTime();
                    if(numfail >= 5)
                        timeoutExpire = c.getTime();
                }
                out.println((new StringBuilder()).append("SubscribersCache.run>>Failed to update subscribers: ").append(e.getMessage()).toString());
            }
            try
            {
                Thread.sleep(30000L);
            }
            catch(InterruptedException e)
            {
                out.println((new StringBuilder()).append("SubscribersCache.run>>Failed to sleep: [InterruptedException] ").append(e.getMessage()).toString());
            }
        } while(true);
  }
  
  private void updateCache(int newCount)
    throws Exception
  {
    Map<String, JSONObject> newCache = Maps.newHashMap();
    
    final List<JSONObject> responses = Lists.newArrayList();
    List<Thread> threads = Lists.newArrayList();
    for (int i = 0; i < Math.ceil(newCount / 100.0D); i++)
    {
      final int offset = i * 100;
      Thread thread = new Thread()
      {
        public void run()
        {
          JSONObject j = TwitchAPIv3.instance().GetChannelSubscriptions(SubscribersCache.this.channel, 100, offset, true);
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
                out.println("SubscribersCache.updateCache>>Failed to update subscribers: " + e.getMessage());
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
              if ((e.getMessage().startsWith("[SocketTimeoutException]")) || (e.getMessage().startsWith("[IOException]")))
              {
                Calendar c = Calendar.getInstance();
                if (SubscribersCache.this.lastFail.after(new Date())) {
                  SubscribersCache.this.numfail++;
                } else {
                  SubscribersCache.this.numfail = 1;
                }
                c.add(12, 1);
                
                SubscribersCache.this.lastFail = c.getTime();
                if (SubscribersCache.this.numfail >= 5) {
                  SubscribersCache.this.timeoutExpire = c.getTime();
                }
              }
              out.println("SubscribersCache.updateCache>>Failed to update subscribers: " + e.getMessage());
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
      JSONArray subscribers = response.getJSONArray("subscriptions");
      if (subscribers.length() == 0) {
        break;
      }
      for (int j = 0; j < subscribers.length(); j++)
      {
        JSONObject subscriber = subscribers.getJSONObject(j);
        newCache.put(subscriber.getJSONObject("user").getString("name"), subscriber);
      }
    }
    List<String> subscribers = Lists.newArrayList();
    List<String> unsubscribers = Lists.newArrayList();
    for (String key : newCache.keySet()) {
      if ((this.cache == null) || (!this.cache.containsKey(key))) {
        subscribers.add(key);
      }
    }
    if (this.cache != null) {
      for (String key : this.cache.keySet()) {
        if (!newCache.containsKey(key)) {
          unsubscribers.add(key);
        }
      }
    }
    this.cache = newCache;
    this.count = newCache.size();
    for (String subscriber : subscribers) {
      EventBus.instance().post(new TwitchSubscribeEvent(subscriber));
    }
    for (String subscriber : unsubscribers) {
      EventBus.instance().post(new TwitchUnsubscribeEvent(subscriber));
    }
    if (this.firstUpdate)
    {
      this.firstUpdate = false;
      EventBus.instance().post(new TwitchSubscribesInitializedEvent());
    }
  }
    public void addSubscriber(String username) {
        this.cache.put(username, null);
    }

    public void setCache(Map<String, JSONObject> cache) {
        this.cache = cache;
    }

    public Map<String, JSONObject> getCache() {
        return this.cache;
    }

}

