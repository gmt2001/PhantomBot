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

import com.gmt2001.Console.out;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringWriter;
import java.io.Writer;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import org.apache.commons.io.IOUtils;

public class HTTPResponse {
    private Map<String, String> values = new HashMap();
    private String body = "";

    HTTPResponse(String address, String request) throws IOException {
        Socket sock = new Socket(address, 80);
        StringWriter output = new StringWriter();
        IOUtils.write((String)request, (OutputStream)sock.getOutputStream(), (String)"utf-8");
        IOUtils.copy((InputStream)sock.getInputStream(), (Writer)output);
        out.println((Object)output.toString());
        Scanner scan = new Scanner(sock.getInputStream());
        String errorLine = scan.nextLine();
        String line = scan.nextLine();
        while (!line.equals("")) {
            String[] keyval = line.split(":", 2);
            if (keyval.length == 2) {
                this.values.put(keyval[0], keyval[1].trim());
            }
            line = scan.nextLine();
        }
        while (scan.hasNextLine()) {
            this.body = this.body + scan.nextLine();
        }
        sock.close();
    }

    public String getBody() {
        return this.body;
    }
}
