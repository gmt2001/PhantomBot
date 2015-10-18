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
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import org.apache.commons.io.FileUtils;
import org.sqlite.SQLiteConfig;

/**
 *
 * @author gmt2001
 */
public class SqliteStore extends DataStore
{

    private String dbname = "phantombot.db";
    private int cache_size = 2000;
    private boolean safe_write = false;
    private Connection connection = null;
    private static final SqliteStore instance = new SqliteStore();

    public static SqliteStore instance()
    {
        return instance;
    }

    @SuppressWarnings("OverridableMethodCallInConstructor")
    private SqliteStore()
    {
        try
        {
            Class.forName("org.sqlite.JDBC");
        } catch (ClassNotFoundException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

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

            SQLiteConfig config = new SQLiteConfig();
            config.setCacheSize(cache_size);
            config.setSynchronous(safe_write ? SQLiteConfig.SynchronousMode.FULL : SQLiteConfig.SynchronousMode.NORMAL);
            connection = DriverManager.getConnection("jdbc:sqlite:" + dbname.replaceAll("\\\\", "/"), config.toProperties());
            connection.setAutoCommit(true);
        } catch (IOException | SQLException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }
    }

    @Override
    protected void finalize() throws Throwable
    {
        super.finalize();

        connection.close();
    }

    @Override
    public void AddFile(String fName)
    {
        fName = fName.replaceAll(" ", "_");

        if (!FileExists(fName))
        {
            try
            {
                Statement statement = connection.createStatement();
                statement.setQueryTimeout(10);

                statement.executeUpdate("CREATE TABLE phantombot_" + fName + " (section TEXT, variable TEXT, value TEXT);");
            } catch (SQLException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }
    }

    @Override
    public void RemoveKey(String fName, String section, String key)
    {
        fName = fName.replaceAll(" ", "_");

        if (FileExists(fName))
        {
            try
            {
                Statement statement = connection.createStatement();
                statement.setQueryTimeout(10);

                statement.executeUpdate("DELETE FROM phantombot_" + fName + " WHERE section='" + section + "' AND variable='" + key + "';");
            } catch (SQLException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }
    }

    @Override
    public void RemoveSection(String fName, String section)
    {
        fName = fName.replaceAll(" ", "_");

        if (FileExists(fName))
        {
            try
            {
                Statement statement = connection.createStatement();
                statement.setQueryTimeout(10);

                statement.executeUpdate("DELETE FROM phantombot_" + fName + " WHERE section='" + section + "';");
            } catch (SQLException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }
    }

    @Override
    public void RemoveFile(String fName)
    {
        fName = fName.replaceAll(" ", "_");

        if (FileExists(fName))
        {
            try
            {
                Statement statement = connection.createStatement();
                statement.setQueryTimeout(10);

                statement.executeUpdate("DROP TABLE phantombot_" + fName + ";");
            } catch (SQLException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }
    }

    @Override
    public boolean FileExists(String fName)
    {
        fName = fName.replaceAll(" ", "_");

        try
        {
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(10);

            ResultSet rs = statement.executeQuery("SELECT name FROM sqlite_master WHERE type='table' AND name='phantombot_" + fName + "';");

            return rs.first();
        } catch (SQLException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

        return false;
    }

    @Override
    public String[] GetFileList()
    {
        try
        {
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(10);

            ResultSet rs = statement.executeQuery("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'phantombot_%';");

            String[] s = new String[rs.getFetchSize()];
            int i = 0;

            while (rs.next())
            {
                s[i++] = rs.getString("name");
            }

            return s;
        } catch (SQLException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

        return new String[]
        {
        };
    }

    @Override
    public String[] GetCategoryList(String fName)
    {
        fName = fName.replaceAll(" ", "_");
        
        if (FileExists(fName))
        {
            try
            {
                Statement statement = connection.createStatement();
                statement.setQueryTimeout(10);

                ResultSet rs = statement.executeQuery("SELECT section FROM phantombot_" + fName + " GROUP BY section;");

                String[] s = new String[rs.getFetchSize()];
                int i = 0;

                while (rs.next())
                {
                    s[i++] = rs.getString("section");
                }

                return s;
            } catch (SQLException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        return new String[]
        {
        };
    }
    
    @Override
    public String[] GetKeyList(String fName, String section)
    {
        fName = fName.replaceAll(" ", "_");
        
        if (FileExists(fName))
        {
            try
            {
                Statement statement = connection.createStatement();
                statement.setQueryTimeout(10);

                ResultSet rs = statement.executeQuery("SELECT variable FROM phantombot_" + fName + " WHERE section='" + section + "';");

                String[] s = new String[rs.getFetchSize()];
                int i = 0;

                while (rs.next())
                {
                    s[i++] = rs.getString("variable");
                }

                return s;
            } catch (SQLException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        return new String[]
        {
        };
    }

    @Override
    public boolean HasKey(String fName, String section, String key)
    {
        return GetString(fName, section, key) != null;
    }

    @Override
    public String GetString(String fName, String section, String key)
    {
        String result = null;

        fName = fName.replaceAll(" ", "_");

        if (!FileExists(fName))
        {
            return result;
        }

        try
        {
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(10);

            ResultSet rs = statement.executeQuery("SELECT * FROM phantombot_" + fName + " WHERE section='" + section + "' AND variable='" + key + "';");

            if (rs.first())
            {
                result = rs.getString("value");
            }
        } catch (SQLException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

        return result;
    }

    @Override
    public void SetString(String fName, String section, String key, String value)
    {
        fName = fName.replaceAll(" ", "_");

        AddFile(fName);

        try
        {
            Statement statement = connection.createStatement();
            statement.setQueryTimeout(10);

            if (HasKey(fName, section, key))
            {
                statement.executeUpdate("UPDATE phantombot_" + fName + " SET value='" + value + "' WHERE section='" + section + "' AND variable='" + key + "';");
            } else
            {
                statement.executeUpdate("INSERT INTO phantombot_" + fName + " values('" + section + "', '" + key + "', '" + value + "');");
            }
        } catch (SQLException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }
    }

    @Override
    public int GetInteger(String fName, String section, String key)
    {
        String sval = GetString(fName, section, key);

        try
        {
            return Integer.parseInt(sval);
        } catch (Exception ex)
        {
            return 0;
        }
    }

    @Override
    public void SetInteger(String fName, String section, String key, int value)
    {
        String sval = Integer.toString(value);

        SetString(fName, section, key, sval);
    }

    @Override
    public float GetFloat(String fName, String section, String key)
    {
        String sval = GetString(fName, section, key);

        try
        {
            return Float.parseFloat(sval);
        } catch (Exception ex)
        {
            return 0.0f;
        }
    }

    @Override
    public void SetFloat(String fName, String section, String key, float value)
    {
        String sval = Float.toString(value);

        SetString(fName, section, key, sval);
    }

    @Override
    public double GetDouble(String fName, String section, String key)
    {
        String sval = GetString(fName, section, key);

        try
        {
            return Double.parseDouble(sval);
        } catch (Exception ex)
        {
            return 0.0;
        }
    }

    @Override
    public void SetDouble(String fName, String section, String key, double value)
    {
        String sval = Double.toString(value);

        SetString(fName, section, key, sval);
    }

    @Override
    public Boolean GetBoolean(String fName, String section, String key)
    {
        int ival = GetInteger(fName, section, key);

        return ival == 1;
    }

    @Override
    public void SetBoolean(String fName, String section, String key, Boolean value)
    {
        int ival = 0;

        if (value)
        {
            ival = 1;
        }

        SetInteger(fName, section, key, ival);
    }
}
