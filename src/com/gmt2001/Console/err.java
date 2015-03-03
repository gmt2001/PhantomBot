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
package com.gmt2001.Console;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

public class err {
    private static final err instance = new err();

    public static err instance() {
        return instance;
    }

    private err() {
    }

    public static void print(Object o) {
        System.err.print(o);
        try {
            FileOutputStream fos = new FileOutputStream("stderr.txt", true);
            PrintStream ps = new PrintStream(fos);
            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            String timestamp = datefmt.format(new Date());
            ps.println(">>" + timestamp + "Z " + o.toString());
            fos.close();
        }
        catch (FileNotFoundException ex) {
            ex.printStackTrace(System.err);
        }
        catch (IOException ex) {
            ex.printStackTrace(System.err);
        }
    }

    public static void println() {
        System.err.println();
    }

    public static void println(Object o) {
        System.err.println(o);
        try {
            FileOutputStream fos = new FileOutputStream("stderr.txt", true);
            PrintStream ps = new PrintStream(fos);
            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            String timestamp = datefmt.format(new Date());
            ps.println(timestamp + "Z " + o.toString());
            ps.println();
            fos.close();
        }
        catch (FileNotFoundException ex) {
            ex.printStackTrace(System.err);
        }
        catch (IOException ex) {
            ex.printStackTrace(System.err);
        }
    }

    public static void printStackTrace(Throwable e) {
        e.printStackTrace(System.err);
        StringWriter trace = new StringWriter();
        PrintWriter ptrace = new PrintWriter(trace);
        e.printStackTrace(ptrace);
        try {
            FileOutputStream fos = new FileOutputStream("stderr.txt", true);
            PrintStream ps = new PrintStream(fos);
            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            String timestamp = datefmt.format(new Date());
            ps.println(timestamp + "Z " + trace.toString());
            ps.println();
            fos.close();
        }
        catch (FileNotFoundException ex) {
            ex.printStackTrace(System.err);
        }
        catch (IOException ex) {
            ex.printStackTrace(System.err);
        }
    }
}

