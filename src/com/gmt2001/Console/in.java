/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.gmt2001.Console;

import java.io.BufferedReader;
import java.io.InputStreamReader;

/**
 *
 * @author Gary Tekulsky
 */
public class in
{
    private static final in instance = new in();
    private static BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
    
    public static in instance()
    {
        return instance;
    }

    private in()
    {
    }

    public static String readLine() throws Exception
    {
        return br.readLine();
    }
}
