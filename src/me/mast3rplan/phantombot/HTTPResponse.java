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
public class HTTPResponse
{

    private Map<String, String> values = new HashMap<String, String>();
    private String body = "";

    HTTPResponse(String address, String request) throws IOException
    {

        Socket sock = new Socket(address, 80);
        Writer output = new StringWriter();
        IOUtils.write(request, sock.getOutputStream(), "utf-8");
        IOUtils.copy(sock.getInputStream(), output);
        com.gmt2001.Console.out.println(output.toString());
        Scanner scan = new Scanner(sock.getInputStream());
        String errorLine = scan.nextLine();
        for (String line = scan.nextLine(); !line.equals(""); line = scan.nextLine())
        {
            String[] keyval = line.split(":", 2);
            if (keyval.length == 2)
            {
                values.put(keyval[0], keyval[1].trim());
            } else
            {
                //?
            }
        }
        while (scan.hasNextLine())
        {
            body += scan.nextLine();
        }
        sock.close();

    }

    public String getBody()
    {
        return body;
    }
}
