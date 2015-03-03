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
package com.gmt2001;

import com.gmt2001.Console.err;
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

public class UncaughtExceptionHandler
implements Thread.UncaughtExceptionHandler {
    private static final UncaughtExceptionHandler instance = new UncaughtExceptionHandler();

    public static UncaughtExceptionHandler instance() {
        return instance;
    }

    @Override
    public void uncaughtException(Thread t, Throwable e) {
        StringWriter trace = new StringWriter();
        PrintWriter ptrace = new PrintWriter(trace);
        e.printStackTrace(ptrace);
        err.printStackTrace(e);
        try {
            FileOutputStream fos = new FileOutputStream("stacktrace.txt", true);
            PrintStream ps = new PrintStream(fos);
            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            String timestamp = datefmt.format(new Date());
            ps.println(timestamp + "Z (" + t.toString() + ") " + trace.toString());
            ps.println();
            fos.close();
        }
        catch (FileNotFoundException ex) {
            err.printStackTrace(ex);
        }
        catch (IOException ex) {
            err.printStackTrace(ex);
        }
    }
}

