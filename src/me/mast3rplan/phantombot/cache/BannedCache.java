/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
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

    private TreeMap<String, Long> bannedUsers = new TreeMap();

    public boolean userIsBanned(String user)
    {
        return bannedUsers.containsKey(user);
    }

    public String[] getReformedUsers()
    {
        List<String> users = new LinkedList();
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
