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
package me.mast3rplan.phantombot.script;

import com.gmt2001.Console.err;
import com.gmt2001.UncaughtExceptionHandler;
import java.io.File;

public class ScriptFileWatcher
  implements Runnable
{
  private Script script;
  
  public ScriptFileWatcher(Script script)
  {
    this.script = script;
    
    Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
  }
  
  public void run()
  {
    File file = this.script.getFile();
    long lastUpdate = file.lastModified();
    try
    {
      for (;;)
      {
        Thread.sleep(100L);
        if (file.lastModified() != lastUpdate)
        {
          lastUpdate = file.lastModified();
          this.script.reload();
        }
      }
    }
    catch (Exception e)
    {
      err.printStackTrace(e);
    }
  }
}
