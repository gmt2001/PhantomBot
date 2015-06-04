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
package me.mast3rplan.phantombot.twitch;

import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;
import org.apache.commons.io.IOUtils;
import org.json.JSONObject;

public class TwitchAPI
{

    public static final String URL = "https://api.twitch.tv/kraken";
    private static final TwitchAPI instance = new TwitchAPI();

    public static TwitchAPI instance()
    {
        return instance;
    }

    public JSONObject getObject(String url) throws IOException
    {
        URLConnection connection = new URL(url).openConnection();
        connection.setUseCaches(false);
        connection.setDefaultUseCaches(false);
        String content = IOUtils.toString(connection.getInputStream(), connection.getContentEncoding());
        return new JSONObject(content);
    }

    public JSONObject getUser(String username) throws IOException
    {
        return getObject(URL + "/users/" + username);
    }

    public JSONObject getChannel(String name) throws IOException
    {
        return getObject(URL + "/channels/" + name);
    }

    public JSONObject getChannel(String name, String subsection) throws IOException
    {
        return getObject(URL + "/channels/" + name + "/" + subsection);
    }

    public JSONObject getStream(String name) throws IOException
    {
        return getObject(URL + "/streams/" + name);
    }

    public JSONObject getStream(String name, String subsection) throws IOException
    {
        return getObject(URL + "/streams/" + name + "/" + subsection);
    }

    public JSONObject postObject(String url) throws IOException
    {
        URLConnection connection = new URL(url).openConnection();
        connection.setUseCaches(false);
        connection.setDefaultUseCaches(false);
        connection.addRequestProperty(url, url);
        String content = IOUtils.toString(connection.getInputStream(), connection.getContentEncoding());
        return new JSONObject(content);
    }
}
