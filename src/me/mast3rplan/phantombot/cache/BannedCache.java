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

    public void addUser(String user, long seconds)
    {
        bannedUsers.put(user, System.currentTimeMillis() + (seconds * 1000));
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
