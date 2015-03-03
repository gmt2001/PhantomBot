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

public class ChannelHostCache
  implements Runnable
{
  private static final Map<String, ChannelHostCache> instances = Maps.newHashMap();
  private Map<String, JSONObject> cache;
  private String channel;
  private Thread updateThread;
  
  public static ChannelHostCache instance(String channel)
  {
    ChannelHostCache instance = (ChannelHostCache)instances.get(channel);
    if (instance == null)
    {
      instance = new ChannelHostCache(channel);
      
      instances.put(channel, instance);
      return instance;
    }
    return instance;
  }
  
  private boolean firstUpdate = true;
  private Date timeoutExpire = new Date();
  private Date lastFail = new Date();
  private int numfail = 0;
  
  public ChannelHostCache(String channel)
  {
    this.channel = channel;
    this.updateThread = new Thread(this);
    
    Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
    this.updateThread.setUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
    
    this.updateThread.start();
  }
  
  public boolean is(String username)
  {
    return this.cache.containsKey(username);
  }
  
  public JSONObject get(String username)
  {
    return (JSONObject)this.cache.get(username);
  }
  
  public int count()
  {
    return this.cache.size();
  }
  
  public void run()
  {
    try
    {
      Thread.sleep(30000L);
    }
    catch (InterruptedException e)
    {
      out.println("ChannelHostCache.run>>Failed to initial sleep: [InterruptedException] " + e.getMessage());
    }
    for (;;)
    {
      try
      {
        if (new Date().after(this.timeoutExpire)) {
          updateCache();
        }
      }
      catch (Exception e)
      {
        if ((e.getMessage().startsWith("[SocketTimeoutException]")) || (e.getMessage().startsWith("[IOException]")))
        {
          Calendar c = Calendar.getInstance();
          if (this.lastFail.after(new Date())) {
            this.numfail += 1;
          } else {
            this.numfail = 1;
          }
          c.add(12, 1);
          
          this.lastFail = c.getTime();
          if (this.numfail >= 5) {
            this.timeoutExpire = c.getTime();
          }
        }
        out.println("ChannelHostCache.run>>Failed to update hosts: " + e.getMessage());
      }
      try
      {
        Thread.sleep(30000L);
      }
      catch (InterruptedException e)
      {
        out.println("ChannelHostCache.run>>Failed to sleep: [InterruptedException] " + e.getMessage());
      }
    }
  }
  
  private void updateCache()
    throws Exception
  {
    Map<String, JSONObject> newCache = Maps.newHashMap();
    
    JSONObject j = TwitchAPIv3.instance().GetHostUsers(this.channel);
    if (j.getBoolean("_success"))
    {
      if (j.getInt("_http") == 200)
      {
        JSONArray hosts = j.getJSONArray("hosts");
        for (int i = 0; i < hosts.length(); i++) {
          newCache.put(hosts.getJSONObject(i).getString("host"), hosts.getJSONObject(i));
        }
      }
      else
      {
        try
        {
          throw new Exception("[HTTPErrorException] HTTP " + j.getInt("status") + " " + j.getString("error") + ". req=" + j.getString("_type") + " " + j.getString("_url") + " " + j.getString("_post") + "   message=" + j.getString("message"));
        }
        catch (Exception e)
        {
          out.println("ChannelHostCache.updateCache>>Failed to update hosts: " + e.getMessage());
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
          if (this.lastFail.after(new Date())) {
            this.numfail += 1;
          } else {
            this.numfail = 1;
          }
          c.add(12, 1);
          
          this.lastFail = c.getTime();
          if (this.numfail >= 5) {
            this.timeoutExpire = c.getTime();
          }
        }
        out.println("ChannelHostCache.updateCache>>Failed to update hosts: " + e.getMessage());
      }
    }
    List<String> hosted = Lists.newArrayList();
    List<String> unhosted = Lists.newArrayList();
    for (String key : newCache.keySet()) {
      if ((this.cache == null) || (!this.cache.containsKey(key))) {
        hosted.add(key);
      }
    }
    if (this.cache != null) {
      for (String key : this.cache.keySet()) {
        if (!newCache.containsKey(key)) {
          unhosted.add(key);
        }
      }
    }
    this.cache = newCache;
    for (String hoster : hosted) {
      EventBus.instance().post(new TwitchHostedEvent(hoster));
    }
    for (String unhoster : unhosted) {
      EventBus.instance().post(new TwitchUnhostedEvent(unhoster));
    }
    if (this.firstUpdate)
    {
      this.firstUpdate = false;
      EventBus.instance().post(new TwitchHostsInitializedEvent());
    }
  }
  
  public void setCache(Map<String, JSONObject> cache)
  {
    this.cache = cache;
  }
  
  public Map<String, JSONObject> getCache()
  {
    return this.cache;
  }
}
