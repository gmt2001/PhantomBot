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
package com.gmt2001;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Date;
import javax.net.ssl.HttpsURLConnection;
import me.mast3rplan.phantombot.PhantomBot;
import org.apache.commons.io.IOUtils;
import org.joda.time.Period;
import org.joda.time.format.ISOPeriodFormat;
import org.joda.time.format.PeriodFormatter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * Communicates with YouTube via the version 3 API
 * 
 * @author gmt2001
 */
public class YouTubeAPIv3
{
    private static final YouTubeAPIv3 instance = new YouTubeAPIv3();
    private String apikey = "AIzaSyCzHxG53pxE0hWrWBIMMGm75PRHBQ8ZP8c";

    private enum request_type
    {

        GET, POST, PUT, DELETE
    };
    
    public static YouTubeAPIv3 instance()
    {
        return instance;
    }
    
    private YouTubeAPIv3()
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    private JSONObject GetData(request_type type, String url)
    {
        return GetData(type, url, "");
    }
    
    private JSONObject GetData(request_type type, String url, String post)
    {
        Date start = new Date();
        JSONObject j = new JSONObject("{}");
        InputStream i = null;
        String rawcontent = "";

        try
        {
            if (url.contains("?"))
            {
                url += "&utcnow=" + System.currentTimeMillis();
            } else
            {
                url += "?utcnow=" + System.currentTimeMillis();
            }

            URL u = new URL(url);
            HttpsURLConnection c = (HttpsURLConnection) u.openConnection();

            c.setRequestMethod(type.name());

            c.setUseCaches(false);
            c.setDefaultUseCaches(false);
            c.setConnectTimeout(5000);
            c.setReadTimeout(10000);

            if (!post.isEmpty())
            {
                c.setDoOutput(true);
            }
            
            Date preconnect = new Date();
            c.connect();
            Date postconnect = new Date();

            if (!post.isEmpty())
            {
                OutputStream o = c.getOutputStream();
                IOUtils.write(post, o);
                o.close();
            }
            
            String content;

            if (c.getResponseCode() == 200)
            {
                i = c.getInputStream();
            } else
            {
                i = c.getErrorStream();
            }

            if (c.getResponseCode() == 204 || i == null || i.available() == 0)
            {
                content = "{}";
            } else
            {
                content = IOUtils.toString(i, c.getContentEncoding());
            }

            rawcontent = content;
            Date prejson = new Date();
            j = new JSONObject(content);
            j.put("_success", true);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", c.getResponseCode());
            j.put("_exception", "");
            j.put("_exceptionMessage", "");
            j.put("_content", content);
            Date postjson = new Date();
            
            if (PhantomBot.enableDebugging)
            {
                com.gmt2001.Console.out.println(">>>[DEBUG] YouTubeAPIv3.GetData Timers " + (preconnect.getTime() - start.getTime()) + " "
                        + (postconnect.getTime() - start.getTime()) + " " + (prejson.getTime() - start.getTime()) + " "
                        + (postjson.getTime() - start.getTime()));
            }
        } catch (JSONException ex)
        {
            if (ex.getMessage().contains("A JSONObject text must begin with"))
            {
                j = new JSONObject("{}");
                j.put("_success", true);
                j.put("_type", type.name());
                j.put("_url", url);
                j.put("_post", post);
                j.put("_http", 0);
                j.put("_exception", "");
                j.put("_exceptionMessage", "");
                j.put("_content", rawcontent);
            }
        } catch (NullPointerException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        } catch (MalformedURLException ex)
        {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "MalformedURLException");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        } catch (SocketTimeoutException ex)
        {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "SocketTimeoutException");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        } catch (IOException ex)
        {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "IOException");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        } catch (Exception ex)
        {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "Exception [" + ex.getClass().getName() + "]");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        }

        if (i != null)
        {
            try
            {
                i.close();
            } catch (IOException ex)
            {
                j.put("_success", false);
                j.put("_type", type.name());
                j.put("_url", url);
                j.put("_post", post);
                j.put("_http", 0);
                j.put("_exception", "IOException");
                j.put("_exceptionMessage", ex.getMessage());
                j.put("_content", "");
            }
        }

        return j;
    }
    
    public void SetAPIKey(String apikey)
    {
        this.apikey = apikey;
    }
    
    public String[] SearchForVideo(String q)
    {
        q = q.replace(" ", "%20");
        JSONObject j = GetData(request_type.GET, "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=" + q + "&type=video&key=" + apikey);
        if (j.getBoolean("_success"))
        {
            if (j.getInt("_http") == 200)
            {
                JSONArray a = j.getJSONArray("items");
                
                if (a.length() > 0)
                {
                    JSONObject i = a.getJSONObject(0);
                    
                    JSONObject id = i.getJSONObject("id");
                    JSONObject sn = i.getJSONObject("snippet");
                    
                    return new String[]{ id.getString("videoId"), sn.getString("title"), sn.getString("channelTitle") };
                }
            }
        }
        
        return new String[]{ "", "", "" };
    }
    
    public int[] GetVideoLength(String id)
    {
        JSONObject j = GetData(request_type.GET, "https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=" + id + "&maxResults=1&key=" + apikey);
        
        if (j.getBoolean("_success"))
        {
            if (j.getInt("_http") == 200)
            {
                JSONArray a = j.getJSONArray("items");
                
                if (a.length() > 0)
                {
                    JSONObject i = a.getJSONObject(0);
                    
                    JSONObject cd = i.getJSONObject("contentDetails");
                    
                    PeriodFormatter formatter = ISOPeriodFormat.standard();
                    
                    Period d = formatter.parsePeriod(cd.getString("duration"));
                    
                    //String d = cd.getString("duration").substring(2);
                    int h=0;
                    int m=0;
                    int s=0;
                    
                    String hours = d.toStandardHours().toString().substring(2);
                    h = Integer.parseInt(hours.substring(0, hours.indexOf("H")));
                    
                    String minutes = d.toStandardMinutes().toString().substring(2);
                    m = Integer.parseInt(minutes.substring(0, minutes.indexOf("M")));

                    String seconds = d.toStandardSeconds().toString().substring(2);
                    s = Integer.parseInt(seconds.substring(0, seconds.indexOf("S")));
                    
                    /*if (d.contains("H"))
                    {
                        h = Integer.parseInt(d.substring(0, d.indexOf("H")));
                        
                        d = d.substring(0, d.indexOf("H"));
                    }
                    
                    if (d.contains("M"))
                    {
                        m = Integer.parseInt(d.substring(0, d.indexOf("M")));
                        
                        d = d.substring(0, d.indexOf("M"));
                    }
                    
                    s = Integer.parseInt(d.substring(0, d.indexOf("S")));
                    */
                    
                    return new int[]{ h, m, s };
                }
            }
        }
        
        return new int[]{ 0, 0, 0 };
    }
}
