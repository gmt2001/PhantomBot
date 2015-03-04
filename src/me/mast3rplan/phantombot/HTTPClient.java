/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package me.mast3rplan.phantombot;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

/**
 *
 * @author jesse
 */
public class HTTPClient {
    
    final static String version = "http/1.1";
    
    static HTTPResponse getResource (String resource) throws MalformedURLException, IOException {
        URL url = new URL (resource);
        return new HTTPResponse (url.getHost (), "GET " + url.getPath () + " " + version + "\nHost: " + url.getHost () + "\n\n");
    }
    
}
