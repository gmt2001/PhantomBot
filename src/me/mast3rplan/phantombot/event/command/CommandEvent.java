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



package me.mast3rplan.phantombot.event.command;

import java.util.LinkedList;
import java.util.List;
import me.mast3rplan.phantombot.event.Event;

public class CommandEvent extends Event
{

    private String sender;
    private String command;
    private String arguments;
    private String[] args;

    public CommandEvent(String sender, String command, String arguments)
    {
        this.sender = sender;
        this.command = command;
        this.arguments = arguments;
        List<String> tmpArgs = new LinkedList<>();
        boolean inquote = false;
        String tmpStr = "";
        for (char c : arguments.toCharArray())
        {
            if (c == '"')
            {
                inquote = !inquote;
            } else if (!inquote && c == ' ')
            {
                if (tmpStr.length() > 0)
                {
                    tmpArgs.add(tmpStr);
                    tmpStr = "";
                }
            } else
            {
                tmpStr += c;
            }
        }
        if (tmpStr.length() > 0)
        {
            tmpArgs.add(tmpStr);
        }
        args = new String[tmpArgs.size()];
        int i = 0;
        for (String s : tmpArgs)
        {
            args[i] = s;
            ++i;
        }
    }

    public String getSender()
    {
        return sender;
    }

    public String getCommand()
    {
        return command;
    }

    public String[] getArgs()
    {
        return args;
    }

    public String getArguments()
    {
        return arguments;
    }
}
