package com.gmt2001;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.net.URLEncoder;
import javax.net.ssl.HttpsURLConnection;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Communicates with Twitch Kraken server using the version 3 API
 *
 * @author gmt2001
 */
public class TwitchAPIv3
{

    private static final TwitchAPIv3 instance = new TwitchAPIv3();
    private static final String base_url = "https://api.twitch.tv/kraken";
    private static final String header_accept = "application/vnd.twitchtv.v3+json";
    private static final int timeout = 2 * 1000;
    private String clientid = "";
    private String oauth = "";
    public static Gson gson = new Gson();

    private enum request_type
    {

        GET, POST, PUT, DELETE
    };

    public static TwitchAPIv3 instance()
    {
        return instance;
    }
    
    private TwitchAPIv3()
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    private JSONObject GetData(request_type type, String url, boolean isJson)
    {
        return GetData(type, url, "", isJson);
    }

    private JSONObject GetData(request_type type, String url, String post, boolean isJson)
    {
        return GetData(type, url, post, "", isJson);
    }

    private JSONObject GetData(request_type type, String url, String post, String oauth, boolean isJson)
    {
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

            c.addRequestProperty("Accept", header_accept);

            if (isJson)
            {
                c.addRequestProperty("Content-Type", "application/json");
            } else
            {
                c.addRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            }

            if (!clientid.isEmpty())
            {
                c.addRequestProperty("Client-ID", clientid);
            }

            if (!oauth.isEmpty())
            {
                c.addRequestProperty("Authorization", "OAuth " + oauth);
            }

            c.setRequestMethod(type.name());

            c.setUseCaches(false);
            c.setDefaultUseCaches(false);
            c.setConnectTimeout(timeout);

            if (!post.isEmpty())
            {
                c.setDoOutput(true);
            }

            c.connect();

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

            j = new JSONObject(content);
            j.put("_success", true);
            j.put("_type", type.name());
            j.put("_url", url);
            j.put("_post", post);
            j.put("_http", c.getResponseCode());
            j.put("_exception", "");
            j.put("_exceptionMessage", "");
            j.put("_content", content);
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

    /**
     * Sets the Twitch API Client-ID header
     *
     * @param clientid
     */
    public void SetClientID(String clientid)
    {
        this.clientid = clientid;
    }

    /**
     * Sets the Twitch API OAuth header
     *
     * @param clientid
     */
    public void SetOAuth(String oauth)
    {
        this.oauth = oauth.replace("oauth:", "");
    }

    public boolean HasOAuth()
    {
        return !this.oauth.isEmpty();
    }

    /**
     * Gets a channel object
     *
     * @param channel
     * @return
     */
    public JSONObject GetChannel(String channel)
    {
        return GetData(request_type.GET, base_url + "/channels/" + channel, false);
    }

    /**
     * Updates the status and game of a channel
     *
     * @param channel
     * @param status
     * @param game
     * @param delay -1 to not update
     * @return
     */
    public JSONObject UpdateChannel(String channel, String status, String game, int delay)
    {
        return UpdateChannel(channel, this.oauth, status, game, delay);
    }

    /**
     * Updates the status and game of a channel
     *
     * @param channel
     * @param oauth
     * @param status
     * @param game
     * @return
     */
    public JSONObject UpdateChannel(String channel, String oauth, String status, String game)
    {
        return UpdateChannel(channel, oauth, status, game, -1);
    }

    /**
     * Updates the status and game of a channel
     *
     * @param channel
     * @param status
     * @param game
     * @return
     */
    public JSONObject UpdateChannel(String channel, String status, String game)
    {
        return UpdateChannel(channel, this.oauth, status, game, -1);
    }

    /**
     * Updates the status and game of a channel
     *
     * @param channel
     * @param oauth
     * @param status
     * @param game
     * @param delay -1 to not update
     * @return
     */
    public JSONObject UpdateChannel(String channel, String oauth, String status, String game, int delay)
    {
        JSONObject j = new JSONObject("{}");
        JSONObject c = new JSONObject("{}");

        if (!status.isEmpty())
        {
            c.put("status", status);
        }

        if (!game.isEmpty())
        {
            JSONObject g = SearchGame(game);
            String gn = game;

            if (g.getBoolean("_success"))
            {
                if (g.getInt("_http") == 200)
                {
                    JSONArray a = g.getJSONArray("games");

                    if (a.length() > 0)
                    {
                        boolean found = false;

                        for (int i = 0; i < a.length() && !found; i++)
                        {
                            JSONObject o = a.getJSONObject(i);

                            gn = o.getString("name");

                            if (gn.equalsIgnoreCase(game))
                            {
                                found = true;
                            }
                        }

                        if (!found)
                        {
                            JSONObject o = a.getJSONObject(0);

                            gn = o.getString("name");
                        }
                    }
                }
            }

            c.put("game", gn);
        }

        if (delay >= 0)
        {
            c.put("delay", delay);
        }

        j.put("channel", c);

        return GetData(request_type.PUT, base_url + "/channels/" + channel, j.toString(), oauth, true);
    }

    public JSONObject SearchGame(String game)
    {
        try
        {
            return GetData(request_type.GET, base_url + "/search/games?q=" + URLEncoder.encode(game, "UTF-8") + "&type=suggest", false);
        } catch (UnsupportedEncodingException ex)
        {
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

    /**
     * Gets an object listing the users following a channel
     *
     * @param channel
     * @param limit between 1 and 100
     * @param offset
     * @param ascending
     * @return
     */
    public JSONObject GetChannelFollows(String channel, int limit, int offset, boolean ascending)
    {
        limit = Math.max(0, Math.min(limit, 100));
        offset = Math.max(0, offset);

        String dir = "desc";

        if (ascending)
        {
            dir = "asc";
        }

        return GetData(request_type.GET, base_url + "/channels/" + channel + "/follows?limit=" + limit + "&offset=" + offset + "&direction=" + dir, false);
    }

    /**
     * Gets an object listing the users subscribing to a channel
     *
     * @param channel
     * @param limit between 1 and 100
     * @param offset
     * @param ascending
     * @return
     */
    public JSONObject GetChannelSubscriptions(String channel, int limit, int offset, boolean ascending)
    {
        return GetChannelSubscriptions(channel, limit, offset, ascending, this.oauth);
    }

    /**
     * Gets an object listing the users subscribing to a channel
     *
     * @param channel
     * @param limit between 1 and 100
     * @param offset
     * @param ascending
     * @param oauth
     * @return
     */
    public JSONObject GetChannelSubscriptions(String channel, int limit, int offset, boolean ascending, String oauth)
    {
        limit = Math.max(0, Math.min(limit, 100));
        offset = Math.max(0, offset);

        String dir = "desc";

        if (ascending)
        {
            dir = "asc";
        }

        return GetData(request_type.GET, base_url + "/channels/" + channel + "/subscriptions?limit=" + limit + "&offset=" + offset + "&direction=" + dir, oauth, false);
    }

    /**
     * Gets a stream object
     *
     * @param channel
     * @return
     */
    public JSONObject GetStream(String channel)
    {
        return GetData(request_type.GET, base_url + "/streams/" + channel, false);
    }

    /**
     * Gets a user object
     *
     * @param user
     * @return
     */
    public JSONObject GetUser(String user)
    {
        return GetData(request_type.GET, base_url + "/users/" + user, false);
    }

    /**
     * Runs a commercial
     *
     * @param channel
     * @param length (30, 60, 90)
     * @return
     */
    public JSONObject RunCommercial(String channel, int length)
    {
        return RunCommercial(channel, length, this.oauth);
    }

    /**
     * Runs a commercial
     *
     * @param channel
     * @param length (30, 60, 90)
     * @param oauth
     * @return
     */
    public JSONObject RunCommercial(String channel, int length, String oauth)
    {
        return GetData(request_type.POST, base_url + "/channels/" + channel + "/commercial", "length=" + length, oauth, false);
    }

    /**
     * Gets a list of users in the channel
     *
     * @param channel
     * @return
     */
    public JSONObject GetChatUsers(String channel)
    {
        return GetData(request_type.GET, "https://tmi.twitch.tv/group/user/" + channel + "/chatters", false);
    }

    /**
     * Gets a list of users hosting the channel
     *
     * @param channel
     * @return
     */
    public JSONObject GetHostUsers(String channel)
    {
        return GetData(request_type.GET, "https://chatdepot.twitch.tv/rooms/" + channel + "/hosts", false);
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
