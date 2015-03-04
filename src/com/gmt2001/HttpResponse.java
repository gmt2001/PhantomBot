package com.gmt2001;

import com.gmt2001.HttpRequest.RequestType;
import java.util.HashMap;

/**
 *
 * @author gmt2001
 */
public class HttpResponse
{

    public RequestType type;
    public String url;
    public String post;
    public String content;
    public HashMap<String, String> headers;
    public int httpCode;
    public boolean success;
    public String exception;
}
