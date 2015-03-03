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

import com.gmt2001.Console.err;
import com.gmt2001.UncaughtExceptionHandler;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import javax.net.ssl.HttpsURLConnection;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class TwitchAPIv3 {
    private static final TwitchAPIv3 instance = new TwitchAPIv3();
    private static final String base_url = "https://api.twitch.tv/kraken";
    private static final String header_accept = "application/vnd.twitchtv.v3+json";
    private static final int timeout = 2000;
    private String clientid = "";
    private String oauth = "";
    
    public static Gson gson = new Gson();

    public static TwitchAPIv3 instance() {
        return instance;
    }

    private TwitchAPIv3() {
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
    }

    private JSONObject GetData(request_type type, String url, boolean isJson) {
        return this.GetData(type, url, "", isJson);
    }

    private JSONObject GetData(request_type type, String url, String post, boolean isJson) {
        return this.GetData(type, url, post, "", isJson);
    }

    private JSONObject GetData(request_type type, String url, String post, String oauth, boolean isJson) {
        JSONObject j = new JSONObject("{}");
        InputStream i = null;
        String rawcontent = "";
        try {
            url = url.contains((CharSequence)"?") ? url + "&utcnow=" + System.currentTimeMillis() : url + "?utcnow=" + System.currentTimeMillis();
            URL u = new URL(url);
            HttpsURLConnection c = (HttpsURLConnection)u.openConnection();
            c.addRequestProperty("Accept", "application/vnd.twitchtv.v3+json");
            if (isJson) {
                c.addRequestProperty("Content-Type", "application/json");
            } else {
                c.addRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            }
            if (!this.clientid.isEmpty()) {
                c.addRequestProperty("Client-ID", this.clientid);
            }
            if (!oauth.isEmpty()) {
                c.addRequestProperty("Authorization", "OAuth " + oauth);
            }
            c.setRequestMethod(type.name());
            c.setUseCaches(false);
            c.setDefaultUseCaches(false);
            c.setConnectTimeout(2000);
            if (!post.isEmpty()) {
                c.setDoOutput(true);
            }
            c.connect();
            if (!post.isEmpty()) {
                OutputStream o = c.getOutputStream();
                IOUtils.write(post, o);
                o.close();
            }
            i = c.getResponseCode() == 200 ? c.getInputStream() : c.getErrorStream();
            String content = c.getResponseCode() == 204 || i == null || i.available() == 0 ? "{}" : IOUtils.toString(i, c.getContentEncoding());
            rawcontent = content;
            j = new JSONObject(content);
            j.put("_success", true);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", c.getResponseCode());
            j.put("_exception", "");
            j.put("_exceptionMessage", "");
            j.put("_content", content);
        }
        catch (JSONException ex) {
            if (ex.getMessage().contains((CharSequence)"A JSONObject text must begin with")) {
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
        }
        catch (NullPointerException ex) {
            err.printStackTrace(ex);
        }
        catch (MalformedURLException ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "MalformedURLException");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        }
        catch (SocketTimeoutException ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "SocketTimeoutException");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        }
        catch (IOException ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "IOException");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        }
        catch (Exception ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "Exception [" + ex.getClass().getName() + "]");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
        }
        if (i != null) {
            try {
                i.close();
            }
            catch (IOException ex) {
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

    public void SetClientID(String clientid) {
        this.clientid = clientid;
    }

    public void SetOAuth(String oauth) {
        this.oauth = oauth.replace((CharSequence)"oauth:", (CharSequence)"");
    }

    public boolean HasOAuth() {
        return !this.oauth.isEmpty();
    }

    public JSONObject GetChannel(String channel) {
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/channels/" + channel, false);
    }

    public JSONObject UpdateChannel(String channel, String status, String game, int delay) {
        return this.UpdateChannel(channel, this.oauth, status, game, delay);
    }

    public JSONObject UpdateChannel(String channel, String oauth, String status, String game) {
        return this.UpdateChannel(channel, oauth, status, game, -1);
    }

    public JSONObject UpdateChannel(String channel, String status, String game) {
        return this.UpdateChannel(channel, this.oauth, status, game, -1);
    }

    public JSONObject UpdateChannel(String channel, String oauth, String status, String game, int delay) {
        JSONObject j = new JSONObject("{}");
        JSONObject c = new JSONObject("{}");
        if (!status.isEmpty()) {
            c.put("status", status);
        }
        if (!game.isEmpty()) {
            JSONArray a;
            JSONObject g = this.SearchGame(game);
            String gn = game;
            if (g.getBoolean("_success") && g.getInt("_http") == 200 && (a = g.getJSONArray("games")).length() > 0) {
                boolean found = false;
                for (int i = 0; !(i >= a.length() || found); ++i) {
                    JSONObject o = a.getJSONObject(i);
                    gn = o.getString("name");
                    if (!gn.equalsIgnoreCase(game)) continue;
                    found = true;
                }
                if (!found) {
                    JSONObject o = a.getJSONObject(0);
                    gn = o.getString("name");
                }
            }
            c.put("game", gn);
        }
        if (delay >= 0) {
            c.put("delay", delay);
        }
        j.put("channel", c);
        return this.GetData(request_type.PUT, "https://api.twitch.tv/kraken/channels/" + channel, j.toString(), oauth, true);
    }

    public JSONObject SearchGame(String game) {
        try {
            return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/search/games?q=" + URLEncoder.encode(game, "UTF-8") + "&type=suggest", false);
        }
        catch (UnsupportedEncodingException ex) {
            JSONObject j = new JSONObject("{}");
            j.put("_success", false);
            j.put("_type", "");
            j.put("_url", "");
            j.put("_post", "");
            j.put("_http", 0);
            j.put("_exception", "Exception [" + ex.getClass().getName() + "]");
            j.put("_exceptionMessage", ex.getMessage());
            j.put("_content", "");
            return j;
        }
    }

    public JSONObject GetChannelFollows(String channel, int limit, int offset, boolean ascending) {
        limit = Math.max(0, Math.min(limit, 100));
        offset = Math.max(0, offset);
        String dir = "desc";
        if (ascending) {
            dir = "asc";
        }
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/channels/" + channel + "/follows?limit=" + limit + "&offset=" + offset + "&direction=" + dir, false);
    }

    public JSONObject GetChannelSubscriptions(String channel, int limit, int offset, boolean ascending) {
        return this.GetChannelSubscriptions(channel, limit, offset, ascending, this.oauth);
    }

    public JSONObject GetChannelSubscriptions(String channel, int limit, int offset, boolean ascending, String oauth) {
        limit = Math.max(0, Math.min(limit, 100));
        offset = Math.max(0, offset);
        String dir = "desc";
        if (ascending) {
            dir = "asc";
        }
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/channels/" + channel + "/subscriptions?limit=" + limit + "&offset=" + offset + "&direction=" + dir, oauth, false);
    }

    public JSONObject GetStream(String channel) {
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/streams/" + channel, false);
    }

    public JSONObject GetUser(String user) {
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/users/" + user, false);
    }

    public JSONObject RunCommercial(String channel, int length) {
        return this.RunCommercial(channel, length, this.oauth);
    }

    public JSONObject RunCommercial(String channel, int length, String oauth) {
        return this.GetData(request_type.POST, "https://api.twitch.tv/kraken/channels/" + channel + "/commercial", "length=" + length, oauth, false);
    }

    public JSONObject GetChatUsers(String channel) {
        return this.GetData(request_type.GET, "https://tmi.twitch.tv/group/user/" + channel + "/chatters", false);
    }

    public JSONObject GetHostUsers(String channel) {
        return this.GetData(request_type.GET, "https://chatdepot.twitch.tv/rooms/" + channel + "/hosts", false);
    }

    private static enum request_type {
        GET,
        POST,
        PUT,
        DELETE;
        

        private request_type() {
        }
    }
    
    public static boolean isOnline(String channelname) {
        try {
        String online = API.readJsonFromUrl("https://api.twitch.tv/kraken/streams/"+channelname);
        JsonObject joonline = gson.fromJson(online, JsonObject.class);
        if(joonline.get("stream").isJsonNull())
        {
            return false;
        }
        else
        {
            return true;
        }
        }
        catch (Exception error)
        {
            error.printStackTrace();
            return false;
        }
    }
    
    public static String getGame(String channelname) {
        try {
        String game = API.readJsonFromUrl("https://api.twitch.tv/kraken/channels/"+channelname);
        JsonObject jogame = gson.fromJson(game, JsonObject.class);
        if(!jogame.get("game").isJsonNull())
        {
            return jogame.get("game").getAsString();
        }
        else
        {
            return null;
        }
        }
        catch (Exception error)
        {
            error.printStackTrace();
            return  null;
        }
    }
        
    public static String getStatus(String channelname) {
        try {
        String status = API.readJsonFromUrl("https://api.twitch.tv/kraken/channels/"+channelname);
        JsonObject jostatus = gson.fromJson(status, JsonObject.class);
        if(!jostatus.get("status").isJsonNull())
        {
            return jostatus.get("status").getAsString();
        }
        else
        {
            return null;
        }
        }
        catch (Exception error)
        {
            error.printStackTrace();
            return  null;
        }
    }
}

