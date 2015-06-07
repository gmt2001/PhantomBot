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
package me.mast3rplan.phantombot.persistance;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.concurrent.locks.ReentrantLock;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author jesse
 */
public class Array
{

    private ArrayList<String> data;
    private ReentrantLock lock;
    private String file;

    public static Array create(String file)
    {
        Array array = new Array();
        array.data = new ArrayList<String>();
        array.file = file;
        array.lock = new ReentrantLock();
        array.readFile();
        return array;
    }

    public String getElement(int index)
    {
        String s;
        try
        {
            lock.lock();
            s = data.get(index);
        } finally
        {
            lock.unlock();
        }
        return s;
    }

    public int getSize()
    {
        int i;
        try
        {
            lock.lock();
            i = data.size();
        } finally
        {
            lock.unlock();
        }
        return i;
    }

    public void insert(String s)
    {
        try
        {
            lock.lock();
            data.add(s);
        } finally
        {
            lock.unlock();
        }
        new SyncFile(this).run();
    }

    private void readFile()
    {
        new ReadFile(this).run();
    }

    private Array()
    {
    }

    private class ReadFile implements Runnable
    {

        Array array;

        @Override
        public void run()
        {
            try
            {
                array.lock.lock();
                FileInputStream fis = new FileInputStream(array.file);
                Scanner fscn = new Scanner(fis);
                while (fscn.hasNextLine())
                {
                    array.data.add(fscn.nextLine());
                }
                try
                {
                    fis.close();
                } catch (IOException ex)
                {
                }
            } catch (FileNotFoundException ex)
            {
                Logger.getLogger(Array.class.getName()).log(Level.SEVERE, null, ex);
            } finally
            {
                array.lock.unlock();
            }
        }

        ReadFile(Array a)
        {
            array = a;
        }
    }

    private class SyncFile implements Runnable
    {

        Array array;

        @Override
        public void run()
        {
            try
            {
                array.lock.lock();
                FileOutputStream fos = new FileOutputStream(array.file);
                PrintStream ps = new PrintStream(fos);
                for (String s : array.data)
                {
                    ps.println(s);
                }
                try
                {
                    fos.close();
                } catch (IOException ex)
                {
                }
            } catch (FileNotFoundException ex)
            {
                Logger.getLogger(Array.class.getName()).log(Level.SEVERE, null, ex);
            } finally
            {
                array.lock.unlock();
            }
        }

        SyncFile(Array a)
        {
            array = a;
        }
    }
}
