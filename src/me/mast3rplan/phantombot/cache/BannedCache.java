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
package me.mast3rplan.phantombot.cache;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.LinkedList;
import java.util.List;
import java.util.TreeMap;
import me.mast3rplan.phantombot.jerklib.Channel;

/**
 *
 * @author jesse
 */
public class BannedCache
{

    private TreeMap<String, Long> bannedUsers = new TreeMap<>();

    public boolean userIsBanned(String user)
    {
        return bannedUsers.containsKey(user);
    }
    
    public boolean userIsBanned(String user, Channel channel)
    {
        return bannedUsers.containsKey(user + "::" + channel.getName());
    }

    public String[] getReformedUsers()
    {
        List<String> users = new LinkedList<>();
        long time = System.currentTimeMillis();

        for (String s : bannedUsers.navigableKeySet())
        {
            if (bannedUsers.get(s) <= time)
            {
                users.add(s);
            }
        }

        return users.toArray(new String[0]);
    }

    public String[] getReformedUsers(Channel channel)
    {
        List<String> users = new LinkedList<>();
        long time = System.currentTimeMillis();

        for (String s : bannedUsers.navigableKeySet())
        {
            if (bannedUsers.get(s) <= time && s.split("::")[1].equalsIgnoreCase(channel.getName()))
            {
                users.add(s);
            }
        }

        return users.toArray(new String[0]);
    }

    public void addUser(String user, long seconds)
    {
        bannedUsers.put(user, System.currentTimeMillis() + (seconds * 1000));
    }

    public void addUser(String user, long seconds, Channel channel)
    {
        bannedUsers.put(user + "::" + channel.getName(), System.currentTimeMillis() + (seconds * 1000));
    }

    @SuppressWarnings("unchecked") //suppress warning about unchecked TreeMap object. You can check if it's a treemap, but there's no way to check if its a <String,Long> Treemap
    public void loadFromFile(String file)
    {
        FileInputStream fis;
        ObjectInputStream ois;

        try
        {
            fis = new FileInputStream(file);

            try
            {
                ois = new ObjectInputStream(fis);

                try
                {
                    Object obj = ois.readObject();

                    if (obj instanceof TreeMap)
                    {
                        bannedUsers = (TreeMap) obj;
                    }
                } catch (ClassNotFoundException ex)
                {
                }

                ois.close();
            } catch (IOException ex)
            {
            }
            try
            {
                fis.close();
            } catch (IOException ex)
            {
            }
        } catch (FileNotFoundException ex)
        {
        }
    }

    public void removeUser(String user)
    {
        bannedUsers.remove(user);
    }

    public void removeUser(String user, Channel channel)
    {
        bannedUsers.remove(user + "::" + channel.getName());
    }

    public void syncToFile(String file)
    {
        FileOutputStream fos;
        ObjectOutputStream oos;

        try
        {
            fos = new FileOutputStream(file);

            try
            {
                oos = new ObjectOutputStream(fos);
                oos.writeObject(bannedUsers);
                oos.close();
            } catch (IOException ex)
            {
            }
            try
            {
                fos.close();
            } catch (IOException ex)
            {
            }
        } catch (FileNotFoundException ex)
        {
        }
    }
}
