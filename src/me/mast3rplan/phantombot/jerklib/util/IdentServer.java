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



package me.mast3rplan.phantombot.jerklib.util;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

//http://books.google.com/books?id=MbHAnBh9AqQC&pg=PA310&lpg=PA310&dq=irc+fake+ident&source=web&ots=c5sHoXuzFS&sig=ZOuAeIFxKUYanirnj_hbnfpCXBQ&hl=en#PPA311,M1
public class IdentServer implements Runnable {
    private ServerSocket socket;
    private String login;
    private Socket soc;
    private Thread t = null;

    public IdentServer(String login) {

        this.login = login;
        try {
            socket = new ServerSocket(113);
            socket.setSoTimeout(60000);
            t = new Thread(this);
            t.start();
        } catch (Exception e) {
        }
    }

    public void run() {
        if (socket == null) return;
        try {
            soc = socket.accept();
            reply();
        } catch (IOException e) {
        }

        if (t != null) {
            try {
                t.join(1);
            } catch (InterruptedException e) {
                com.gmt2001.Console.err.printStackTrace(e);
            }
        }
        t = null;
    }

    public void reply() {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(soc.getInputStream()));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(soc.getOutputStream()));

            String line = reader.readLine();
            if (line != null) {
                writer.write(line + " : USERID : UNIX : " + login + "\r\n");
                writer.flush();
                writer.close();
                reader.close();
            }
            socket.close();
        } catch (IOException e) {
        }
    }
}