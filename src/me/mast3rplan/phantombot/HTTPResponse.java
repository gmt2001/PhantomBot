/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package me.mast3rplan.phantombot;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.net.Socket;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author jesse
 */
public class HTTPResponse {
    
    private Map <String, String> values = new HashMap <String, String> ();
    private String body = "";
    
    HTTPResponse (String address, String request) throws IOException {
        
        Socket sock = new Socket (address, 80);
        Writer output = new StringWriter();
        IOUtils.write (request, sock.getOutputStream (), "utf-8");
        IOUtils.copy (sock.getInputStream (), output);
        com.gmt2001.Console.out.println(output.toString());
        Scanner scan = new Scanner (sock.getInputStream ());
        String errorLine = scan.nextLine ();
        for (String line = scan.nextLine (); !line.equals (""); line = scan.nextLine ()) {
            String [] keyval = line.split (":", 2);
            if (keyval.length == 2) {
                values.put (keyval [0], keyval [1].trim ());
            } else {
                //?
            }
        }
        while (scan.hasNextLine ()) {
            body += scan.nextLine ();
        }
        sock.close ();
        
    }
    
    public String getBody () {return body;}
    
}
