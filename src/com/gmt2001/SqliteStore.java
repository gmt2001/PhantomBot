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

import java.io.File;
import java.io.IOException;
import org.apache.commons.io.FileUtils;

/**
 *
 * @author gmt2001
 */
public class SqliteStore extends DataStore
{

    private String dbname = "phantombot.db";
    private int cache_size = 2000;
    private boolean safe_write = false;
    private static final SqliteStore instance = new SqliteStore();

    public static SqliteStore instance()
    {
        return instance;
    }

    @SuppressWarnings("OverridableMethodCallInConstructor")
    private SqliteStore()
    {
        LoadConfig("");
    }

    @Override
    public void LoadConfig(String configStr)
    {
        if (configStr.isEmpty())
        {
            configStr = "sqlite3config.txt";
        }

        try
        {
            File f = new File("./" + configStr);

            if (!f.exists())
            {
                return;
            }

            String data = FileUtils.readFileToString(new File("./" + configStr));
            String[] lines = data.replaceAll("\\r", "").split("\\n");

            for (String line : lines)
            {
                if (line.startsWith("dbname=") && line.length() > 8)
                {
                    dbname = line.substring(7);
                }
                if (line.startsWith("cachesize=") && line.length() > 11)
                {
                    cache_size = Integer.parseInt(line.substring(10));
                }
                if (line.startsWith("safewrite=") && line.length() > 11)
                {
                    safe_write = line.substring(10).equalsIgnoreCase("true") || line.substring(10).equalsIgnoreCase("1");
                }
            }
        } catch (IOException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }
    }
}
