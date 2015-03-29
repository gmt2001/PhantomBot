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

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.Date;
import java.util.Scanner;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.irc.message.IrcChannelMessageEvent;

/**
 *
 * @author jesse
 */
public class HTTPServer extends Thread
{

    int port;
    ServerSocket socket;
    Boolean dorun = true;

    HTTPServer(int p)
    {
        port = p;

        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    @Override
    public void run()
    {
        String webhome = "./web";

        try
        {
            socket = new ServerSocket(port);
        } catch (IOException e)
        {
            com.gmt2001.Console.err.println("Could not start HTTP server: " + e);
            return;
        }

        com.gmt2001.Console.out.println("HTTP server accepting connections on port " + port);

        while (dorun)
        {
            try
            {

                Socket conn = socket.accept();
                Scanner scan = new Scanner(conn.getInputStream());
                PrintStream out = new PrintStream(conn.getOutputStream());

                if (!scan.hasNextLine())
                {
                    throw new IOException();
                }

                String[] request = scan.nextLine().split(" ");
                TreeMap<String, String> args = new TreeMap<>();

                while (scan.hasNextLine())
                {
                    String line = scan.nextLine();
                    String[] arg = line.split(":");

                    if (arg.length == 2)
                    {
                        args.put(arg[0].trim(), arg[1].trim());
                    }

                    if (line.isEmpty())
                    {
                        break;
                    }
                }

                if (request.length == 3)
                {
                    if (request[0].equals("GET"))
                    {
                        File target = null;

                        if (request[1].startsWith("/"))
                        {
                            target = new File(webhome + request[1]);
                        } else
                        {
                            target = new File(webhome + "/" + request[1]);
                        }

                        if (target.exists() && target.isDirectory())
                        {
                            if (request[1].endsWith("/"))
                            {
                                target = new File(webhome + "/" + request[1] + "index.html");
                            } else
                            {
                                target = new File(webhome + "/" + request[1] + "/" + "index.html");
                            }
                        }

                        if (target.exists())
                        {
                            FileInputStream fis = new FileInputStream(target);
                            int length = fis.available();

                            out.print("HTTP/1.0 200 OK\n"
                                    + "ContentType: " + inferContentType(target.getPath()) + "\n"
                                    + "Date: " + new Date() + "\n"
                                    + "Server: basic HTTP server\n"
                                    + "Content-Length: " + length + "\n"
                                    + "\n");

                            byte[] b = new byte[length + 1];
                            fis.read(b);

                            out.write(b, 0, length);

                            out.print("\n");
                        } else
                        {
                            out.print("HTTP/1.0 404 Not Found\n"
                                    + "ContentType: " + "text/text" + "\n"
                                    + "Date: " + new Date() + "\n"
                                    + "Server: basic HTTP server\n"
                                    + "Content-Length: " + "18" + "\n"
                                    + "\n"
                                    + "HTTP 404 Not Found"
                                    + "\n");
                        }
                    } else if (request[0].equals("PUT"))
                    {
                        InetAddress rmt = conn.getInetAddress();

                        if (rmt.getHostAddress().equals("127.0.0.1") || rmt.getHostAddress().equals("0:0:0:0:0:0:0:1"))
                        {
                            if (!args.containsKey("user") || !args.containsKey("message"))
                            {
                                out.print("HTTP/1.0 400 Bad Request\n"
                                        + "ContentType: " + "text/text" + "\n"
                                        + "Date: " + new Date() + "\n"
                                        + "Server: basic HTTP server\n"
                                        + "Content-Length: " + "17" + "\n"
                                        + "\n"
                                        + "missing parameter"
                                        + "\n");
                            } else
                            {
                                String user = URLDecoder.decode(args.get("user"), "UTF-8");
                                String message = URLDecoder.decode(args.get("message"), "UTF-8");

                                EventBus.instance().post(new IrcChannelMessageEvent(PhantomBot.instance().getSession(), user, message, PhantomBot.instance().getChannel()));

                                out.print("HTTP/1.0 200 OK\n"
                                        + "ContentType: " + "text/text" + "\n"
                                        + "Date: " + new Date() + "\n"
                                        + "Server: basic HTTP server\n"
                                        + "Content-Length: " + "12" + "\n"
                                        + "\n"
                                        + "event posted"
                                        + "\n");
                            }
                        }
                    }
                }

                out.flush();

                if (conn != null)
                {
                    conn.close();
                }

            } catch (IOException ex)
            {
                Logger.getLogger(HTTPServer.class.getName()).log(Level.SEVERE, null, ex);
            }

        }
    }

    public void dispose()
    {
        try
        {
            dorun = false;
            socket.close();
        } catch (IOException ex)
        {
            Logger.getLogger(HTTPServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    private static String inferContentType(String path)
    {
        if (path.endsWith(".html") || path.endsWith(".htm"))
        {
            return "text/html";
        } else if (path.endsWith(".css"))
        {
            return "text/css";
        } else if (path.endsWith(".png"))
        {
            return "image/png";
        }
        return "text/text";
    }
}
