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
package me.mast3rplan.phantombot.jerklib.tasks;

import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent.Type;
import me.mast3rplan.phantombot.jerklib.listeners.TaskCompletionListener;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * An impl of the Task interface. This impl also provides methods for
 * notifications to listeners.
 *
 * @author mohadib
 * @see Session#onEvent(me.mast3rplan.phantombot.jerklib.tasks.Task)
 * @see Session#onEvent(Task,
 * me.mast3rplan.phantombot.jerklib.events.IRCEvent.Type...)
 * @see Type
 */
public abstract class TaskImpl implements Task
{

    private final List<TaskCompletionListener> listeners = new ArrayList<TaskCompletionListener>();
    private boolean canceled;
    private String name;

    public TaskImpl(String name)
    {
        this.name = name;
    }


    /* (non-Javadoc)
     * @see me.mast3rplan.phantombot.jerklib.tasks.Task#getName()
     */
    public String getName()
    {
        return name;
    }

    /* (non-Javadoc)
     * @see me.mast3rplan.phantombot.jerklib.tasks.Task#cancel()
     */
    public void cancel()
    {
        canceled = true;
    }

    /* (non-Javadoc)
     * @see me.mast3rplan.phantombot.jerklib.tasks.Task#isCanceled()
     */
    public boolean isCanceled()
    {
        return canceled;
    }

    /**
     * Add a listener to be notified by this Task
     *
     * @param listener
     * @see me.mast3rplan.phantombot.jerklib.tasks.TaskImpl#taskComplete(Object)
     */
    public void addTaskListener(TaskCompletionListener listener)
    {
        listeners.add(listener);
    }

    /**
     * remove a listener
     *
     * @param listener
     * @return true if a listener was removed , else false
     */
    public boolean removeTaskListener(TaskCompletionListener listener)
    {
        return listeners.remove(listener);
    }

    /**
     * get a list of TaskCompletionListeners
     *
     * @return list of listeners
     */
    public List<TaskCompletionListener> getTaskListeners()
    {
        return Collections.unmodifiableList(listeners);
    }

    /**
     * Can be called to notifiy listeners
     *
     * @param result
     */
    protected void taskComplete(Object result)
    {
        for (TaskCompletionListener listener : listeners)
        {
            listener.taskComplete(result);
        }
    }
}
