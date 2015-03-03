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
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.OutputStream;
import java.util.LinkedList;
import java.util.NavigableSet;
import java.util.TreeMap;

public class BannedCache {
    private TreeMap<String, Long> bannedUsers = new TreeMap();

    public boolean userIsBanned(String user) {
        return this.bannedUsers.containsKey(user);
    }

    public String[] getReformedUsers() {
        LinkedList<String> users = new LinkedList<String>();
        long time = System.currentTimeMillis();
        for (String s : this.bannedUsers.navigableKeySet()) {
            if (this.bannedUsers.get(s) > time) continue;
            users.add(s);
        }
        return users.toArray(new String[0]);
    }

    public void addUser(String user, long seconds) {
        this.bannedUsers.put(user, System.currentTimeMillis() + seconds * 1000);
    }

    public void loadFromFile(String file) {
        try {
            FileInputStream fis = new FileInputStream(file);
            try {
                ObjectInputStream ois = new ObjectInputStream(fis);
                try {
                    Object obj = ois.readObject();
                    if (obj instanceof TreeMap) {
                        this.bannedUsers = (TreeMap)obj;
                    }
                }
                catch (ClassNotFoundException ex) {
                    // empty catch block
                }
                ois.close();
            }
            catch (IOException ex) {
                // empty catch block
            }
            try {
                fis.close();
            }
            catch (IOException ex) {}
        }
        catch (FileNotFoundException ex) {
            // empty catch block
        }
    }

    public void removeUser(String user) {
        this.bannedUsers.remove(user);
    }

    public void syncToFile(String file) {
        try {
            FileOutputStream fos = new FileOutputStream(file);
            try {
                ObjectOutputStream oos = new ObjectOutputStream(fos);
                oos.writeObject(this.bannedUsers);
                oos.close();
            }
            catch (IOException ex) {
                // empty catch block
            }
            try {
                fos.close();
            }
            catch (IOException ex) {}
        }
        catch (FileNotFoundException ex) {
            // empty catch block
        }
    }
}

