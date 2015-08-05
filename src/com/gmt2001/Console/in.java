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
    private static final BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

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
