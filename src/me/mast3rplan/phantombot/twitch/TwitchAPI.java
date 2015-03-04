package me.mast3rplan.phantombot.twitch;

import java.io.IOException;
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
        return getObject(URL + "/users/" + username);
    }

    public JSONObject getChannel(String name) throws IOException {
        return getObject(URL + "/channels/" + name);
    }

    public JSONObject getChannel(String name, String subsection) throws IOException {
        return getObject(URL + "/channels/" + name + "/" + subsection);
    }
    
    public JSONObject getStream(String name) throws IOException {
        return getObject(URL + "/streams/" + name);
    }
    
    public JSONObject getStream(String name, String subsection) throws IOException {
        return getObject(URL + "/streams/" + name + "/" + subsection);
    }

    public JSONObject postObject (String url) throws IOException {
        URLConnection connection = new URL(url).openConnection();
        connection.setUseCaches(false);
        connection.setDefaultUseCaches(false);
        connection.addRequestProperty (url, url);
        String content = IOUtils.toString(connection.getInputStream(), connection.getContentEncoding());
        return new JSONObject(content);
    }
    
}
