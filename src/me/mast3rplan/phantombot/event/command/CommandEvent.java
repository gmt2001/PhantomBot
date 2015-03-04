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
        List<String> tmpArgs = new LinkedList();
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
