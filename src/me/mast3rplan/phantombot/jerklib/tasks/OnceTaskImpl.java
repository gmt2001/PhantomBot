package me.mast3rplan.phantombot.jerklib.tasks;

import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent.Type;

/**
 * An augmented {@link me.mast3rplan.phantombot.jerklib.tasks.TaskImpl} that only executes once
 * as it cancels itself out of the task queue once completed,
 * <em>even if it fails (= throws an <code>Exception</code>)</em>.
 *
 * @author pbleser
 * @see OnceUntilSucceedsTaskImpl
 * @see Session#onEvent(me.mast3rplan.phantombot.jerklib.tasks.Task)
 * @see Session#onEvent(Task, me.mast3rplan.phantombot.jerklib.events.IRCEvent.Type...)
 * @see me.mast3rplan.phantombot.jerklib.tasks.TaskImpl
 * @see Type
 */
public abstract class OnceTaskImpl extends TaskImpl {
    public OnceTaskImpl(String name) {
        super(name);
    }

    /**
     * Process the {@link IRCEvent}, once.
     *
     * @param e the {@link IRCEvent} to process
     */
    public abstract void receiveEventOnce(IRCEvent e);

    /**
     * {@inheritDoc}
     */
    public final void receiveEvent(IRCEvent e) {
        try {
            receiveEventOnce(e);
        } finally {
            this.cancel();
        }
    }

}