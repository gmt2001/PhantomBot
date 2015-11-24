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
package me.mast3rplan.phantombot.event.command;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import me.mast3rplan.phantombot.event.Event;
import me.mast3rplan.phantombot.jerklib.Channel;

public class CommandEvent extends Event
{

    private final String sender;
    private String command;
    private final String arguments;
    private String[] args;
    private final Map<String, String> tags;

    /**
     * 
     * @param sender
     * @param command
     * @param arguments 
     * 
     * @deprecated Use a version which accepts the channel argument instead
     */
    @Deprecated public CommandEvent(String sender, String command, String arguments)
    {
        super(null);
        
        this.sender = sender;
        this.command = command;
        this.arguments = arguments;
        this.tags = new HashMap<>();
        parse();
    }

    public CommandEvent(String sender, String command, String arguments, Channel channel)
    {
        super(channel);
        
        this.sender = sender;
        this.command = command;
        this.arguments = arguments;
        this.tags = new HashMap<>();
        parse();
    }

    /**
     * 
     * @param sender
     * @param command
     * @param arguments
     * @param tags 
     * 
     * @deprecated Use a version which accepts the channel argument instead
     */
    @Deprecated public CommandEvent(String sender, String command, String arguments, Map<String, String> tags)
    {
        super(null);
        
        this.sender = sender;
        this.command = command;
        this.arguments = arguments;
        this.tags = tags;
        parse();
    }

    public CommandEvent(String sender, String command, String arguments, Map<String, String> tags, Channel channel)
    {
        super(channel);
        
        this.sender = sender;
        this.command = command;
        this.arguments = arguments;
        this.tags = tags;
        parse();
    }

    private void parse()
    {
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

    public void setCommand(String command)
    {
        this.command = command;
    }

    public String[] getArgs()
    {
        return args;
    }

    public String getArguments()
    {
        return arguments;
    }

    public Map<String, String> getTags()
    {
        return tags;
    }
}
