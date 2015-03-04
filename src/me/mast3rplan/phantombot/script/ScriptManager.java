package me.mast3rplan.phantombot.script;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

public class ScriptManager {
    private static HashMap<String, Script> scripts = new HashMap<>();

    public static void loadScript(File scriptFile) throws IOException {
        if (scripts.containsKey(scriptFile.toPath().toString())) {
            return;
        }

        Script script = new Script(scriptFile);
        scripts.put(scriptFile.toPath().toString(), script);
        script.load();
    }
    
    public static Script loadScriptR(File scriptFile) throws IOException {
        loadScript(scriptFile);
        return getScript(scriptFile);
    }
    
    public static Script getScript(File scriptFile) throws IOException {
        if (!scripts.containsKey(scriptFile.toPath().toString())) {
            return null;
        }
        
        return scripts.get(scriptFile.toPath().toString());
    }
}
