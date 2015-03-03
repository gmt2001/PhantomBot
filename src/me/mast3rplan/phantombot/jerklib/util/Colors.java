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

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class Colors {
    public static final String NORMAL = "\u000f";
    public static final String BOLD = "\u0002";
    public static final String UNDERLINE = "\u001f";
    public static final String REVERSE = "\u0016";
    public static final String WHITE = "\u000300";
    public static final String BLACK = "\u000301";
    public static final String DARK_BLUE = "\u000302";
    public static final String DARK_GREEN = "\u000303";
    public static final String RED = "\u000304";
    public static final String BROWN = "\u000305";
    public static final String PURPLE = "\u000306";
    public static final String OLIVE = "\u000307";
    public static final String YELLOW = "\u000308";
    public static final String GREEN = "\u000309";
    public static final String TEAL = "\u000310";
    public static final String CYAN = "\u000311";
    public static final String BLUE = "\u000312";
    public static final String MAGENTA = "\u000313";
    public static final String DARK_GRAY = "\u000314";
    public static final String LIGHT_GRAY = "\u000315";
    private static final List<String> colorList = new ArrayList<String>();

    private Colors() {
    }

    public static List<String> getColorsList() {
        return Collections.unmodifiableList(colorList);
    }

    static {
        colorList.add("\u000301");
        colorList.add("\u000312");
        colorList.add("\u0002");
        colorList.add("\u000305");
        colorList.add("\u000311");
        colorList.add("\u000302");
        colorList.add("\u000314");
        colorList.add("\u000303");
        colorList.add("\u000309");
        colorList.add("\u000315");
        colorList.add("\u000313");
        colorList.add("\u000f");
        colorList.add("\u000307");
        colorList.add("\u000306");
        colorList.add("\u000304");
        colorList.add("\u000310");
        colorList.add("\u001f");
        colorList.add("\u000300");
        colorList.add("\u000308");
    }
}

