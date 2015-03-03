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
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import me.mast3rplan.phantombot.script.Script;
import me.mast3rplan.phantombot.script.ScriptDestroyable;
import me.mast3rplan.phantombot.script.ScriptEventHandler;
import me.mast3rplan.phantombot.script.ScriptEventManager;
import me.mast3rplan.phantombot.script.ScriptManager;

public class ScriptApi {
    private static final ScriptApi instance = new ScriptApi();
    private static final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(8);

    public static ScriptApi instance() {
        return instance;
    }

    private ScriptApi() {
        Thread.setDefaultUncaughtExceptionHandler(UncaughtExceptionHandler.instance());
    }

    public void on(Script script, String eventName, ScriptEventHandler handler) {
        script.destroyables().add(new ScriptDestroyable<ScriptEventHandler>(handler){

            @Override
            public void destroy(ScriptEventHandler handler) {
                ScriptEventManager.instance().unregister(handler);
            }
        });
        ScriptEventManager.instance().register(eventName, handler);
    }

    public ScheduledFuture<?> setTimeout(Script script, Runnable task, int milliseconds) {
        ScheduledFuture future = scheduler.schedule(task, (long)milliseconds, TimeUnit.MILLISECONDS);
        script.destroyables().add(new ScriptDestroyable<ScheduledFuture>(future){

            @Override
            public void destroy(ScheduledFuture future) {
                future.cancel(false);
            }
        });
        return future;
    }

    public ScheduledFuture<?> setInterval(Script script, Runnable task, int milliseconds) {
        ScheduledFuture future = scheduler.scheduleAtFixedRate(task, milliseconds, milliseconds, TimeUnit.MILLISECONDS);
        script.destroyables().add(new ScriptDestroyable<ScheduledFuture>(future){

            @Override
            public void destroy(ScheduledFuture future) {
                future.cancel(false);
            }
        });
        return future;
    }

    public boolean clearTimeout(ScheduledFuture<?> future) {
        return future.cancel(false);
    }

    public boolean clearInterval(ScheduledFuture<?> future) {
        return future.cancel(false);
    }

    public void loadScript(Script script, String fileName) throws IOException {
        ScriptManager.loadScript(new File(new File("./scripts/"), fileName));
    }

    public Script loadScriptR(Script script, String fileName) throws IOException {
        return ScriptManager.loadScriptR(new File(new File("./scripts/"), fileName));
    }

    public Script getScript(Script script, String fileName) throws IOException {
        return ScriptManager.getScript(new File(new File("./scripts/"), fileName));
    }

}

