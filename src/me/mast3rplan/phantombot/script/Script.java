package me.mast3rplan.phantombot.script;

import com.google.common.collect.Lists;
import java.io.File;
import java.io.IOException;
import java.util.List;
import org.apache.commons.io.FileUtils;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.NativeObject;
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
        
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        new Thread(fileWatcher).start();
    }

    public void reload() throws IOException {
        for(ScriptDestroyable destroyable : destroyables) {
            destroyable.destroy();
        }
        destroyables.clear();
        load();
    }

    public void load() throws IOException {
        Context context = Context.enter();
        ScriptableObject scope = context.initStandardObjects(global, false);
        scope.defineProperty("$", global, 0);
        scope.defineProperty("$api", ScriptApi.instance(), 0);
        scope.defineProperty("$script", this, 0);
        scope.defineProperty("$var", vars, 0);

        context.evaluateString(scope, FileUtils.readFileToString(file), file.getName(), 1, null);
    }

    public List<ScriptDestroyable> destroyables() {
        return destroyables;
    }

    public File getFile() {
        return file;
    }
    
    public String getPath() {
        return file.toPath().toString();
    }
}
