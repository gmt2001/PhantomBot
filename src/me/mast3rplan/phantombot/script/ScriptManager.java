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

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

public class ScriptManager
{

    private static HashMap<String, Script> scripts = new HashMap<>();

    public static void loadScript(File scriptFile) throws IOException
    {
        if (scripts.containsKey(scriptFile.toPath().toString()))
        {
            return;
        }

        Script script = new Script(scriptFile);
        scripts.put(scriptFile.toPath().toString(), script);
        script.load();
    }

    public static Script loadScriptR(File scriptFile) throws IOException
    {
        loadScript(scriptFile);
        return getScript(scriptFile);
    }

    public static Script getScript(File scriptFile) throws IOException
    {
        if (!scripts.containsKey(scriptFile.toPath().toString()))
        {
            return null;
        }

        return scripts.get(scriptFile.toPath().toString());
    }
}
