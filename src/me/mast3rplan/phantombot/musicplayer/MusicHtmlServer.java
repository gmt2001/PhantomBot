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
package me.mast3rplan.phantombot.musicplayer;

import com.gmt2001.Console.err;
import com.gmt2001.Console.out;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;

public class MusicHtmlServer
  extends Thread
{
  private int port;
  
  private static void log(Socket connection, String msg) {}
  
  private static void errorReport(PrintStream pout, Socket connection, String code, String title, String msg)
  {
    pout.print("HTTP/1.0 " + code + " " + title + "\r\n" + "\r\n" + "<!DOCTYPE HTML PUBLIC \"-//IETF//DTD HTML 2.0//EN\">\r\n" + "<TITLE>" + code + " " + title + "</TITLE>\r\n" + "</HEAD><BODY>\r\n" + "<H1>" + title + "</H1>\r\n" + msg + "<P>\r\n" + "<HR><ADDRESS>FileServer 1.0 at " + connection.getLocalAddress().getHostName() + " Port " + connection.getLocalPort() + "</ADDRESS>\r\n" + "</BODY></HTML>\r\n");
    








    log(connection, code + " " + title);
  }
  
  private static String guessContentType(String path)
  {
    if ((path.endsWith(".html")) || (path.endsWith(".htm"))) {
      return "text/html";
    }
    if ((path.endsWith(".txt")) || (path.endsWith(".java"))) {
      return "text/plain";
    }
    if (path.endsWith(".gif")) {
      return "image/gif";
    }
    if (path.endsWith(".class")) {
      return "application/octet-stream";
    }
    if ((path.endsWith(".jpg")) || (path.endsWith(".jpeg"))) {
      return "image/jpeg";
    }
    return "text/plain";
  }
  
  private static void sendFile(InputStream file, OutputStream out)
  {
    try
    {
      byte[] buffer = new byte[1000];
      while (file.available() > 0) {
        out.write(buffer, 0, file.read(buffer));
      }
    }
    catch (IOException e)
    {
      err.println(e);
    }
  }
  
  public MusicHtmlServer(int port)
  {
    this.port = port;
    start();
  }
  
  public void run()
  {
    String wwwhome = "./web";
    

    ServerSocket socket = null;
    try
    {
      socket = new ServerSocket(this.port);
    }
    catch (IOException e)
    {
      err.println("Could not start server: " + e);
      System.exit(-1);
    }
    out.println("MusicFileServer accepting connections on port " + this.port);
    for (;;)
    {
      Socket connection = null;
      try
      {
        connection = socket.accept();
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        OutputStream out = new BufferedOutputStream(connection.getOutputStream());
        PrintStream pout = new PrintStream(out);
        

        String request = in.readLine();
        if (request == null) {
          continue;
        }
        log(connection, request);
        for (;;)
        {
          String misc = in.readLine();
          if ((misc == null) || (misc.length() == 0)) {
            break;
          }
        }
        if ((!request.startsWith("GET")) || (request.length() < 14) || ((!request.endsWith("HTTP/1.0")) && (!request.endsWith("HTTP/1.1"))))
        {
          errorReport(pout, connection, "400", "Bad Request", "Your browser sent a request that this server could not understand.");
        }
        else
        {
          String req = request.substring(4, request.length() - 9).trim();
          if ((req.indexOf("..") != -1) || (req.indexOf("/.ht") != -1) || (req.endsWith("~")))
          {
            errorReport(pout, connection, "403", "Forbidden", "You don't have permission to access the requested URL.");
          }
          else
          {
            String path = wwwhome + "/" + req;
            File f = new File(path);
            if ((f.isDirectory()) && (!path.endsWith("/")))
            {
              pout.print("HTTP/1.0 301 Moved Permanently\r\nLocation: http://" + connection.getLocalAddress().getHostAddress() + ":" + connection.getLocalPort() + "/" + req + "/\r\n\r\n");
              


              log(connection, "301 Moved Permanently");
            }
            else
            {
              if (f.isDirectory())
              {
                path = path + "index.html";
                f = new File(path);
              }
              try
              {
                InputStream file = new FileInputStream(f);
                pout.print("HTTP/1.0 200 OK\r\nContent-Type: " + guessContentType(path) + "\r\n" + "Date: " + new Date() + "\r\n" + "Server: FileServer 1.0\r\n\r\n");
                


                sendFile(file, out);
                log(connection, "200 OK");
              }
              catch (FileNotFoundException e)
              {
                errorReport(pout, connection, "404", "Not Found", "The requested URL was not found on this server.");
              }
            }
          }
        }
        out.flush();
      }
      catch (IOException e)
      {
        err.println(e);
      }
      try
      {
        if (connection != null) {
          connection.close();
        }
      }
      catch (IOException e)
      {
        err.println(e);
      }
    }
  }
}
