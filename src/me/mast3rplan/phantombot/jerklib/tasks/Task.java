package me.mast3rplan.phantombot.jerklib.tasks;

import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent.Type;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;

/**
 * Task is a job that can be ran by the Session when
 * certain types of events are received. This class is
 * very much like IRCEventListener , but it can be
 * associated with Types of events. See Session's onEvent
 * methods for details.
 * <p/>
 * <a href="http://me.mast3rplan.phantombot.jerklib.wikia.com/wiki/Tasks">Task Tutorial</a>
 *
 * @author mohadib
 * @see Session#onEvent(me.mast3rplan.phantombot.jerklib.tasks.Task)
 * @see Session#onEvent(Task, me.mast3rplan.phantombot.jerklib.events.IRCEvent.Type...)
 * @see Type
 */
public interface Task extends IRCEventListener {
    /**
     * Gets the name of a task
     *
     * @return name of task
     */
    public String getName();

    /**
     * Cancel a task. This task will not run again. If the task is currently running
     * it will finish then not run again.
     */
    public void cancel();

    /**
     * @return true if task is canceled , else false
     */
    public boolean isCanceled();
}
