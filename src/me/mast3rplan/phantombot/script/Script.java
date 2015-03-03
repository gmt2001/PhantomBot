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

import com.gmt2001.UncaughtExceptionHandler;
import com.google.common.collect.Lists;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import me.mast3rplan.phantombot.script.ScriptApi;
import me.mast3rplan.phantombot.script.ScriptDestroyable;
import me.mast3rplan.phantombot.script.ScriptFileWatcher;
import org.apache.commons.io.FileUtils;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeObject;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

public class Script {
    public static final NativeObject global = new NativeObject();
    private List<ScriptDestroyable> destroyables = Lists.newArrayList();
    private NativeObject vars = new NativeObject();
    private ScriptFileWatcher fileWatcher;
    private File file;

    public Script(File file) {
        this.fileWatcher = new ScriptFileWatcher(this);
        this.file = file;
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
        new Thread(this.fileWatcher).start();
    }

    public void reload() throws IOException {
        for (ScriptDestroyable destroyable : this.destroyables) {
            destroyable.destroy();
        }
        this.destroyables.clear();
        this.load();
    }

    public void load() throws IOException {
        Context context = Context.enter();
        ScriptableObject scope = context.initStandardObjects((ScriptableObject)global, false);
        scope.defineProperty("$", (Object)global, 0);
        scope.defineProperty("$api", (Object)ScriptApi.instance(), 0);
        scope.defineProperty("$script", (Object)this, 0);
        scope.defineProperty("$var", (Object)this.vars, 0);
        context.evaluateString((Scriptable)scope, FileUtils.readFileToString(this.file), this.file.getName(), 1, (Object)null);
    }

    public List<ScriptDestroyable> destroyables() {
        return this.destroyables;
    }

    public File getFile() {
        return this.file;
    }

    public String getPath() {
        return this.file.toPath().toString();
    }
}

