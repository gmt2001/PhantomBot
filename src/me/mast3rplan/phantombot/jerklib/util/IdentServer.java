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

import com.gmt2001.Console.err;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.net.ServerSocket;
import java.net.Socket;

public class IdentServer
implements Runnable {
    private ServerSocket socket;
    private String login;
    private Socket soc;
    private Thread t = null;

    public IdentServer(String login) {
        this.login = login;
        try {
            this.socket = new ServerSocket(113);
            this.socket.setSoTimeout(60000);
            this.t = new Thread(this);
            this.t.start();
        }
        catch (Exception e) {
            // empty catch block
        }
    }

    @Override
    public void run() {
        if (this.socket == null) {
            return;
        }
        try {
            this.soc = this.socket.accept();
            this.reply();
        }
        catch (IOException e) {
            // empty catch block
        }
        if (this.t != null) {
            try {
                this.t.join(1);
            }
            catch (InterruptedException e) {
                err.printStackTrace(e);
            }
        }
        this.t = null;
    }

    public void reply() {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(this.soc.getInputStream()));
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(this.soc.getOutputStream()));
            String line = reader.readLine();
            if (line != null) {
                writer.write(line + " : USERID : UNIX : " + this.login + "\r\n");
                writer.flush();
                writer.close();
                reader.close();
            }
            this.socket.close();
        }
        catch (IOException e) {
            // empty catch block
        }
    }
}

