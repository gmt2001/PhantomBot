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

import jcurses.event.ValueChangedEvent;
import jcurses.event.ValueChangedListener;
import jcurses.widgets.*;

public class Console
    implements ValueChangedListener
{

    public static Console instance()
    {
        return instance;
    }

    private Console()
    {
        crlf = true;
        w = new Window(80, 24, true, "PhantombotJ");
        r = w.getRootPanel();
        m = (DefaultLayoutManager)r.getLayoutManager();
        l = new List();
        l.setSelectable(false);
        t = new TextField(80);
        t.setDelimiter('>');
        m.addWidget(l, 0, 0, 80, 23, 4, 4);
        w.show();
    }

    private static Console init()
    {
        Console c = new Console();
        c.t.addListener(c);
        return c;
    }

    public void println()
    {
        l.add("");
        crlf = true;
    }

    public void println(String s)
    {
        l.add(s);
        crlf = true;
    }

    public void print(String s)
    {
        boolean hascrlf = false;
        if(s.contains("\n"))
        {
            hascrlf = true;
            s = s.replaceAll("\n", "");
        }
        s = s.replaceAll("\r", "");
        if(crlf)
        {
            l.add(s);
        } else
        {
            l.remove(l.getItemsCount() - 1);
            l.add(s);
        }
        crlf = hascrlf;
    }

    public void valueChanged(ValueChangedEvent vce)
    {
        println((new StringBuilder()).append(">>").append(t.getText()).toString());
    }

    private static final Console instance = init();
    private Window w;
    private Panel r;
    private DefaultLayoutManager m;
    private List l;
    private TextField t;
    private boolean crlf;

}
