package me.mast3rplan.phantombot.script;

public abstract class ScriptDestroyable<T> {
    private T object;

    protected ScriptDestroyable(T object) {
        this.object = object;
    }

    public void destroy() {
        this.destroy(object);
    }

    public abstract void destroy(T object);
}
