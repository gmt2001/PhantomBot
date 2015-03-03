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
package me.mast3rplan.phantombot.twitch;

import com.gmt2001.API;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;


public class TwitchAPI {
    public static final String URL = "https://api.twitch.tv/kraken";
    private static final TwitchAPI instance = new TwitchAPI();

    public static TwitchAPI instance() {
        return instance;
    }

    public JSONObject getObject(String url) throws IOException {
        URLConnection connection = new URL(url).openConnection();
        connection.setUseCaches(false);
        connection.setDefaultUseCaches(false);
        String content = IOUtils.toString(connection.getInputStream(), connection.getContentEncoding());
        return new JSONObject(content);
    }

    public JSONObject getUser(String username) throws IOException {
        return this.getObject("https://api.twitch.tv/kraken/users/" + username);
    }

    public JSONObject getChannel(String name) throws IOException {
        return this.getObject("https://api.twitch.tv/kraken/channels/" + name);
    }

    public JSONObject getChannel(String name, String subsection) throws IOException {
        return this.getObject("https://api.twitch.tv/kraken/channels/" + name + "/" + subsection);
    }

    public JSONObject getStream(String name) throws IOException {
        return this.getObject("https://api.twitch.tv/kraken/streams/" + name);
    }

    public JSONObject getStream(String name, String subsection) throws IOException {
        return this.getObject("https://api.twitch.tv/kraken/streams/" + name + "/" + subsection);
    }

    public JSONObject postObject(String url) throws IOException {
        URLConnection connection = new URL(url).openConnection();
        connection.setUseCaches(false);
        connection.setDefaultUseCaches(false);
        connection.addRequestProperty(url, url);
        String content = IOUtils.toString(connection.getInputStream(), connection.getContentEncoding());
        return new JSONObject(content);
    }
    
}

