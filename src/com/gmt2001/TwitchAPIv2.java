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
import java.net.URLConnection;
import javax.net.ssl.HttpsURLConnection;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;

public class TwitchAPIv2 {
    private static final TwitchAPIv2 instance = new TwitchAPIv2();
    private static final String base_url = "https://api.twitch.tv/kraken";
    private static final String header_accept = "application/vnd.twitchtv.v2+json";
    private static final int timeout = 5000;
    private String clientid = "";

    public static TwitchAPIv2 instance() {
        return instance;
    }

    private JSONObject GetData(request_type type, String url) {
        return this.GetData(type, url, "");
    }

    private JSONObject GetData(request_type type, String url, String post) {
        return this.GetData(type, url, post, "");
    }

    private JSONObject GetData(request_type type, String url, String post, String oauth) {
        JSONObject j = new JSONObject();
        try {
            URL u = new URL(url);
            HttpsURLConnection c = (HttpsURLConnection)u.openConnection();
            c.addRequestProperty("Accept", "application/vnd.twitchtv.v2+json");
            if (!this.clientid.isEmpty()) {
                c.addRequestProperty("Client-ID", this.clientid);
            }
            if (!oauth.isEmpty()) {
                c.addRequestProperty("Authorization", "OAuth " + oauth);
            }
            c.setRequestMethod(type.name());
            c.setUseCaches(false);
            c.setDefaultUseCaches(false);
            c.setConnectTimeout(5000);
            c.connect();
            if (!post.isEmpty()) {
                IOUtils.write(post, c.getOutputStream());
            }
            String content = c.getResponseCode() == 200 ? IOUtils.toString(c.getInputStream(), c.getContentEncoding()) : IOUtils.toString(c.getErrorStream(), c.getContentEncoding());
            j = new JSONObject(content);
            j.put("_success", true);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", c.getResponseCode());
            j.put("_exception", "");
            j.put("_exceptionMessage", "");
        }
        catch (MalformedURLException ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "MalformedURLException");
            j.put("_exceptionMessage", ex.getMessage());
        }
        catch (SocketTimeoutException ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "SocketTimeoutException");
            j.put("_exceptionMessage", ex.getMessage());
        }
        catch (IOException ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "IOException");
            j.put("_exceptionMessage", ex.getMessage());
        }
        catch (Exception ex) {
            j.put("_success", false);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", 0);
            j.put("_exception", "Exception [" + ex.getClass().getName() + "]");
            j.put("_exceptionMessage", ex.getMessage());
        }
        return j;
    }

    public void SetClientID(String clientid) {
        this.clientid = clientid;
    }

    public JSONObject GetChannel(String channel) {
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/channels/" + channel);
    }

    public JSONObject UpdateChannel(String channel, String oauth, String status, String game) {
        JSONObject j = new JSONObject();
        JSONObject c = new JSONObject();
        if (!status.isEmpty()) {
            c.put("status", status);
        }
        if (!game.isEmpty()) {
            c.put("game", game);
        }
        j.put("channel", c);
        return this.GetData(request_type.PUT, "https://api.twitch.tv/kraken/channels/" + channel, j.toString(), oauth);
    }

    public JSONObject GetChannelFollows(String channel, int limit, int offset) {
        limit = Math.max(0, Math.min(limit, 100));
        offset = Math.max(0, offset);
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/channels/" + channel + "/follows?limit=" + limit + "&offset=" + offset);
    }

    public JSONObject GetStream(String channel) {
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/streams/" + channel);
    }

    public JSONObject GetUser(String user) {
        return this.GetData(request_type.GET, "https://api.twitch.tv/kraken/users/" + user);
    }

    private static enum request_type {
        GET,
        POST,
        PUT,
        DELETE;
        

        private request_type() {
        }
    }

}

