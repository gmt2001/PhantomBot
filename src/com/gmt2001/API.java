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

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
 
public class API {
public static String readJsonFromUrl(String urlString) throws Exception {
BufferedReader reader = null;
try {
URL url = new URL(urlString);
reader = new BufferedReader(new InputStreamReader(url.openStream()));
StringBuffer buffer = new StringBuffer();
int read;
char[] chars = new char[1024];
while ((read = reader.read(chars)) != -1)
buffer.append(chars, 0, read);
 
return buffer.toString();
} finally {
if (reader != null)
reader.close();
}
}
}
