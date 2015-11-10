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
package me.mast3rplan.phantombot;

import java.io.File;
import java.io.FileInputStream;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.Date;
import java.util.Scanner;
import java.util.TreeMap;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.irc.message.IrcChannelMessageEvent;
import me.mast3rplan.phantombot.jerklib.Channel;

/**
 *
 * @author jesse
 */
public class HTTPServer extends Thread
{

    int port;
    String pass;
    ServerSocket socket;
    Boolean dorun = true;

    HTTPServer(int p, String oauth)
    {
        port = p;
        pass = oauth.replace("oauth:", "");

        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    @Override
    @SuppressWarnings(
            {
                "SleepWhileInLoop", "null", "deprecation"
            })
    public void run()
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        String webhome = "./web";

        try
        {
            socket = new ServerSocket(port);
        } catch (IOException e)
        {
            com.gmt2001.Console.err.println("Could not start HTTP server: " + e);
            com.gmt2001.Console.err.logStackTrace(e);
            return;
        }

        com.gmt2001.Console.out.println("HTTP server accepting connections on port " + port);

        while (dorun)
        {
            try
            {
                Socket conn = socket.accept();
                Scanner scan = new Scanner(new BufferedInputStream(conn.getInputStream()));
                PrintStream out = new PrintStream(new BufferedOutputStream(conn.getOutputStream()));

                for (int i = 0; i < 20 || !scan.hasNextLine(); i++)
                {
                    if (!scan.hasNextLine())
                    {
                        try
                        {
                            Thread.sleep(100);
                        } catch (InterruptedException ex)
                        {
                            com.gmt2001.Console.err.printStackTrace(ex);
                        }
                    }
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
                    switch (request[0])
                    {
                        case "GET":
                            File target = null;
                            String data = null;

                            if (args.containsKey("password"))
                            {
                                String password = URLDecoder.decode(args.get("password"), "UTF-8").replace("oauth:", "");

                                if (password.equals(pass) && (request[1].toLowerCase().startsWith("addons")
                                        || request[1].toLowerCase().startsWith("/addons")))
                                {
                                    if (request[1].startsWith("/"))
                                    {
                                        target = new File("." + request[1]);
                                    } else
                                    {
                                        target = new File("." + "/" + request[1]);
                                    }
                                } else if (password.equals(pass) && (request[1].toLowerCase().startsWith("inistore")
                                        || request[1].toLowerCase().startsWith("/inistore")))
                                {
                                    String realTarget = request[1];

                                    if (realTarget.startsWith("/"))
                                    {
                                        realTarget = realTarget.substring(10);
                                    } else
                                    {
                                        realTarget = realTarget.substring(9);
                                    }

                                    if (realTarget.toLowerCase().endsWith(".ini"))
                                    {
                                        realTarget = realTarget.substring(0, realTarget.length() - 4);
                                    }

                                    String[] sections = PhantomBot.instance().getDataStore().GetCategoryList(realTarget);

                                    data = "";

                                    for (String section : sections)
                                    {
                                        if (!section.equalsIgnoreCase(""))
                                        {
                                            data += "\r\n\r\n[" + section + "]";
                                        }

                                        String[] keys = PhantomBot.instance().getDataStore().GetKeyList(realTarget, section);

                                        for (String key : keys)
                                        {
                                            String value = PhantomBot.instance().getDataStore().GetString(realTarget, section, key);

                                            data += "\r\n" + key + "=" + value;
                                        }
                                    }
                                }
                            }

                            if (target == null)
                            {
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
                            }

                            if (target.exists() || data != null)
                            {
                                int length;
                                byte[] b;
                                String contentType;

                                if (data == null)
                                {
                                    FileInputStream fis = new FileInputStream(target);
                                    length = fis.available();

                                    b = new byte[length + 1];
                                    fis.read(b);

                                    contentType = inferContentType(target.getPath());
                                } else
                                {
                                    length = data.length();
                                    b = data.getBytes();

                                    contentType = "text/text";
                                }

                                out.print("HTTP/1.0 200 OK\n"
                                        + "ContentType: " + contentType + "\n"
                                        + "Date: " + new Date() + "\n"
                                        + "Server: basic HTTP server\n"
                                        + "Content-Length: " + length + "\n"
                                        + "\n");

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
                            break;
                        case "PUT":
                            if (args.containsKey("password"))
                            {
                                String password = URLDecoder.decode(args.get("password"), "UTF-8").replace("oauth:", "");

                                if (password.equals(pass))
                                {
                                    if (!args.containsKey("user") || !args.containsKey("message"))
                                    {
                                        out.print("HTTP/1.0 400 Bad Request\n"
                                                + "ContentType: " + "text/text" + "\n"
                                                + "Date: " + new Date() + "\n"
                                                + "Server: basic HTTP server\n"
                                                + "Content-Length: " + "17" + "\n"
                                                + "\n"
                                                + "missing or invalid parameter"
                                                + "\n");
                                    } else
                                    {
                                        String user = URLDecoder.decode(args.get("user"), "UTF-8");
                                        String message = URLDecoder.decode(args.get("message"), "UTF-8");
                                        Channel channel = PhantomBot.instance().getChannel();

                                        if (args.containsKey("channel"))
                                        {
                                            channel = PhantomBot.instance().getChannel(URLDecoder.decode(args.get("channel"), "UTF-8"));
                                        }

                                        if (channel == null)
                                        {
                                            out.print("HTTP/1.0 400 Bad Request\n"
                                                    + "ContentType: " + "text/text" + "\n"
                                                    + "Date: " + new Date() + "\n"
                                                    + "Server: basic HTTP server\n"
                                                    + "Content-Length: " + "17" + "\n"
                                                    + "\n"
                                                    + "missing or invalid parameter"
                                                    + "\n");
                                        } else
                                        {
                                            EventBus.instance().post(new IrcChannelMessageEvent(PhantomBot.instance().getSession(), user, message, channel));

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
                                } else
                                {
                                    com.gmt2001.Console.out.println("Invalid password recieved for remote http PUT request. Recieved: " + password + " Expected: " + pass);
                                }
                            } else
                            {
                                com.gmt2001.Console.out.println("No password recieved for remote http PUT request.");
                            }
                            break;
                    }
                }

                out.flush();

                if (conn != null)
                {
                    conn.close();
                }

            } catch (IOException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
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
            com.gmt2001.Console.err.printStackTrace(ex);
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
