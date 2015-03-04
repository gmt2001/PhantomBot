package com.gmt2001;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map.Entry;
import javax.net.ssl.HttpsURLConnection;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author gmt2001
 */
public class HttpRequest
{

    private static final int timeout = 5 * 1000;

    public static enum RequestType
    {

        GET, POST, PUT, DELETE
    }

    private HttpRequest()
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    public static HttpResponse getData(RequestType type, String url, String post, HashMap<String, String> headers)
    {
        HttpResponse r = new HttpResponse();
        boolean isHttps = url.startsWith("https");

        r.type = type;
        r.url = url;
        r.post = post;
        r.headers = headers;

        try
        {
            URL u = new URL(url);

            if (isHttps)
            {
                HttpsURLConnection h = ((HttpsURLConnection) u.openConnection());

                for (Entry<String, String> e : headers.entrySet())
                {
                    h.addRequestProperty(e.getKey(), e.getValue());
                }
                
                h.setRequestMethod(type.name());
                h.setUseCaches(false);
                h.setDefaultUseCaches(false);
                h.setConnectTimeout(timeout);

                if (!post.isEmpty())
                {
                    h.setDoOutput(true);
                }

                h.connect();

                if (!post.isEmpty())
                {
                    IOUtils.write(post, h.getOutputStream());
                }

                if (h.getResponseCode() == 200)
                {
                    r.content = IOUtils.toString(h.getInputStream(), h.getContentEncoding());
                    r.httpCode = h.getResponseCode();
                    r.success = true;
                } else
                {
                    r.content = IOUtils.toString(h.getErrorStream(), h.getContentEncoding());
                    r.httpCode = h.getResponseCode();
                    r.success = false;
                }
            } else
            {
                HttpURLConnection h = ((HttpURLConnection) u.openConnection());

                for (Entry<String, String> e : headers.entrySet())
                {
                    h.addRequestProperty(e.getKey(), e.getValue());
                }

                h.setRequestMethod(type.name());
                h.setUseCaches(false);
                h.setDefaultUseCaches(false);
                h.setConnectTimeout(timeout);

                if (!post.isEmpty())
                {
                    h.setDoOutput(true);
                }

                h.connect();

                if (!post.isEmpty())
                {
                    IOUtils.write(post, h.getOutputStream());
                }

                if (h.getResponseCode() == 200)
                {
                    r.content = IOUtils.toString(h.getInputStream(), h.getContentEncoding());
                    r.httpCode = h.getResponseCode();
                    r.success = true;
                } else
                {
                    r.content = IOUtils.toString(h.getErrorStream(), h.getContentEncoding());
                    r.httpCode = h.getResponseCode();
                    r.success = false;
                }
            }
        } catch (IOException ex)
        {
            r.success = false;
            r.httpCode = 0;
            r.exception = ex.getMessage();

            com.gmt2001.Console.err.printStackTrace(ex);
        }

        return r;
    }
}
