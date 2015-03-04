/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gmt2001.Console;

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
 * @author Gary Tekulsky
 */
public class err
{
    private static final err instance = new err();
    
    public static err instance()
    {
        return instance;
    }
    
    private err()
    {
    }

    public static void print(Object o)
    {
        System.err.print(o);
        
        try
        {
            FileOutputStream fos = new FileOutputStream("stderr.txt", true);
            PrintStream ps = new PrintStream(fos);

            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            
            String timestamp = datefmt.format(new Date());
            
            ps.println(">>" + timestamp + "Z " + o.toString());
            
            fos.close();
        } catch (FileNotFoundException ex)
        {
            ex.printStackTrace(System.err);
        } catch (IOException ex)
        {
            ex.printStackTrace(System.err);
        }
    }
    
    public static void println()
    {
        System.err.println();
    }
    
    public static void println(Object o)
    {
        System.err.println(o);
        
        try
        {
            FileOutputStream fos = new FileOutputStream("stderr.txt", true);
            PrintStream ps = new PrintStream(fos);

            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            
            String timestamp = datefmt.format(new Date());
            
            ps.println(timestamp + "Z " + o.toString());
            ps.println();
            
            fos.close();
        } catch (FileNotFoundException ex)
        {
            ex.printStackTrace(System.err);
        } catch (IOException ex)
        {
            ex.printStackTrace(System.err);
        }
    }
    
    public static void printStackTrace(Throwable e)
    {
        e.printStackTrace(System.err);
        
        Writer trace = new StringWriter();
        PrintWriter ptrace = new PrintWriter(trace);

        e.printStackTrace(ptrace);

        try
        {
            FileOutputStream fos = new FileOutputStream("stderr.txt", true);
            PrintStream ps = new PrintStream(fos);

            SimpleDateFormat datefmt = new SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
            datefmt.setTimeZone(TimeZone.getTimeZone("GMT"));
            
            String timestamp = datefmt.format(new Date());
            
            ps.println(timestamp + "Z " + trace.toString());
            ps.println();
            
            fos.close();
        } catch (FileNotFoundException ex)
        {
            ex.printStackTrace(System.err);
        } catch (IOException ex)
        {
            ex.printStackTrace(System.err);
        }
    }
}
