package com.gmt2001;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 *
 * @author gmt2001
 */
public class UncaughtExceptionHandler implements Thread.UncaughtExceptionHandler
{

    private static final UncaughtExceptionHandler instance = new UncaughtExceptionHandler();;
    
    public static UncaughtExceptionHandler instance()
    {
        return instance;
    }
    
    @Override
    public void uncaughtException(Thread t, Throwable e)
    {
        Writer trace = new StringWriter();
        PrintWriter ptrace = new PrintWriter(trace);

        e.printStackTrace(ptrace);
        com.gmt2001.Console.err.printStackTrace(e);

        try
        {
            FileOutputStream fos = new FileOutputStream("stacktrace.txt", true);
            PrintStream ps = new PrintStream(fos);

            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            
            String timestamp = datefmt.format(new Date());
            
            ps.println(timestamp + "Z (" + t.toString() + ") " + trace.toString());
            ps.println();
            
            fos.close();
        } catch (FileNotFoundException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        } catch (IOException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }
    }
}
