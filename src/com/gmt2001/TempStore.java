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
package com.gmt2001;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

/**
 *
 * @author gmt2001
 */
public class TempStore
{

    private final HashMap<String, TempFile> files = new HashMap<>();
    private static final TempStore instance = new TempStore();

    public static TempStore instance()
    {
        return instance;
    }

    private TempStore()
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    private static class TempFile
    {

        protected HashMap<String, HashMap<String, Object>> data = new HashMap<>();
    }

    public void AddFile(String fName)
    {
        if (!files.containsKey(fName))
        {
            TempFile f = new TempFile();
            files.put(fName, f);
        }
    }

    public String[] GetFileList()
    {
        Set<String> o = files.keySet();

        String[] s = new String[o.size()];

        Iterator it = o.iterator();
        int i = 0;

        while (it.hasNext())
        {
            s[i++] = (String) it.next();
        }

        return s;
    }

    public String[] GetCategoryList(String fName)
    {
        AddFile(fName);

        Set<String> o = files.get(fName).data.keySet();

        String[] s = new String[o.size()];

        Iterator it = o.iterator();
        int i = 0;

        while (it.hasNext())
        {
            s[i++] = (String) it.next();
        }

        return s;
    }

    public String[] GetKeyList(String fName, String section)
    {
        AddFile(fName);

        Set<String> o = files.get(fName).data.get(section).keySet();

        String[] s = new String[o.size()];

        Iterator it = o.iterator();
        int i = 0;

        while (it.hasNext())
        {
            s[i++] = (String) it.next();
        }

        return s;
    }
    
    public Object GetObject(String fName, String section, String key)
    {
        AddFile(fName);

        key = key.replaceAll("=", "_eq_");

        if (key.startsWith(";") || key.startsWith("["))
        {
            key = "_" + key;
        }

        if (!files.containsKey(fName) || !files.get(fName).data.containsKey(section)
                || !files.get(fName).data.get(section).containsKey(key))
        {
            return null;
        }

        return files.get(fName).data.get(section).get(key);
    }
    
    public void SetObject(String fName, String section, String key, Object value)
    {
        AddFile(fName);

        key = key.replaceAll("=", "_eq_");

        if (key.startsWith(";") || key.startsWith("["))
        {
            key = "_" + key;
        }

        if (!files.get(fName).data.containsKey(section))
        {
            files.get(fName).data.put(section, new HashMap<String, Object>());
        }

        files.get(fName).data.get(section).put(key, value);
    }

    public String GetString(String fName, String section, String key)
    {
        return (String) GetObject(fName, section, key);
    }

    public void SetString(String fName, String section, String key, String value)
    {
        SetObject(fName, section, key, value);
    }

    public int GetInteger(String fName, String section, String key)
    {
        return (Integer) GetObject(fName, section, key);
    }

    public void SetInteger(String fName, String section, String key, int value)
    {
        SetObject(fName, section, key, value);
    }

    public float GetFloat(String fName, String section, String key)
    {
        return (Float) GetObject(fName, section, key);
    }

    public void SetFloat(String fName, String section, String key, float value)
    {
        SetObject(fName, section, key, value);
    }

    public double GetDouble(String fName, String section, String key)
    {
        return (Double) GetObject(fName, section, key);
    }

    public void SetDouble(String fName, String section, String key, double value)
    {
        SetObject(fName, section, key, value);
    }

    public Boolean GetBoolean(String fName, String section, String key)
    {
        return (Boolean) GetObject(fName, section, key);
    }

    public void SetBoolean(String fName, String section, String key, Boolean value)
    {
        SetObject(fName, section, key, value);
    }

    public void RemoveKey(String fName, String section, String key)
    {
        AddFile(fName);

        if (key.startsWith(";") || key.startsWith("["))
        {
            key = "_" + key;
        }

        files.get(fName).data.get(section).remove(key);
    }

    public void RemoveSection(String fName, String section)
    {
        AddFile(fName);

        files.get(fName).data.remove(section);
    }

    public void RemoveFile(String fName)
    {
        files.remove(fName);
    }

    public boolean FileExists(String fName)
    {
        return files.containsKey(fName);
    }

    public boolean HasKey(String fName, String section, String key)
    {
        return GetString(fName, section, key) != null;
    }

    public boolean exists(String type, String key)
    {
        return HasKey(type, "", key);
    }

    public String get(String type, String key)
    {
        return GetString(type, "", key);
    }

    public void set(String type, String key, String value)
    {
        SetString(type, "", key, value);
    }

    public void del(String type, String key)
    {
        RemoveKey(type, "", key);
    }

    public void incr(String type, String key, int amount)
    {
        int ival = GetInteger(type, "", key);

        ival += amount;

        SetInteger(type, "", key, ival);
    }

    public void decr(String type, String key, int amount)
    {
        int ival = GetInteger(type, "", key);

        ival -= amount;

        SetInteger(type, "", key, ival);
    }
}
