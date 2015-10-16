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

/**
 *
 * @author gmt2001
 */
public class DataStore
{

    private static final DataStore instance = new DataStore();

    public static DataStore instance()
    {
        return instance;
    }

    protected DataStore()
    {
    }

    public void SaveChangedNow()
    {
    }

    public void SaveAll(boolean force)
    {
    }

    public void ReloadFile(String fName)
    {
    }
    
    public void LoadConfig(String configStr)
    {
    }

    public String[] GetFileList()
    {
        return new String[]
        {
        };
    }

    public String[] GetCategoryList(String fName)
    {
        return new String[]
        {
        };
    }

    public String[] GetKeyList(String fName, String section)
    {
        return new String[]
        {
        };
    }

    public String GetString(String fName, String section, String key)
    {
        return "";
    }

    public void SetString(String fName, String section, String key, String value)
    {
    }

    public Object GetObject(String fName, String section, String key)
    {
        return null;
    }

    public void SetObject(String fName, String section, String key, Object value)
    {
    }

    public int GetInteger(String fName, String section, String key)
    {
        return 0;
    }

    public void SetInteger(String fName, String section, String key, int value)
    {
    }

    public float GetFloat(String fName, String section, String key)
    {
        return 0.0f;
    }

    public void SetFloat(String fName, String section, String key, float value)
    {
    }

    public double GetDouble(String fName, String section, String key)
    {
        return 0.0;
    }

    public void SetDouble(String fName, String section, String key, double value)
    {
    }

    public Boolean GetBoolean(String fName, String section, String key)
    {
        return false;
    }

    public void SetBoolean(String fName, String section, String key, Boolean value)
    {
    }

    public void RemoveKey(String fName, String section, String key)
    {
    }

    public void RemoveSection(String fName, String section)
    {
    }

    public void AddFile(String fName)
    {
    }

    public void RemoveFile(String fName)
    {
    }

    public boolean FileExists(String fName)
    {
        return false;
    }

    public boolean HasKey(String fName, String section, String key)
    {
        return false;
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
