/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gmt2001.Console;

/**
 *
 * @author Gary Tekulsky
 */
public class out
{

    private static final out instance = new out();
    
    public static out instance()
    {
        return instance;
    }
    
    private out()
    {
    }
    
    public static void print(Object o)
    {
        System.out.print(o);
    }
    
    public static void println()
    {
        System.out.println();
    }
    
    public static void println(Object o)
    {
        System.out.println(o);
    }
}
