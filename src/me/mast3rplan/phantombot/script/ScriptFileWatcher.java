package me.mast3rplan.phantombot.script;

import java.io.File;

public class ScriptFileWatcher implements Runnable {
    private Script script;

    public ScriptFileWatcher(Script script) {
        this.script = script;
        
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    @Override
    public void run() {
        File file = script.getFile();
        long lastUpdate = file.lastModified();
        while(true) {
            try {
                Thread.sleep(100);
                if(file.lastModified() != lastUpdate) {
                    lastUpdate = file.lastModified();
                    script.reload();
                }
            } catch (Exception e) {
                com.gmt2001.Console.err.printStackTrace(e);
            }
        }
    }
}
