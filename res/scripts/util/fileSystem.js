$.readFile = function(path) {
    var lines = [];
    
    try {
        var fis = new java.io.FileInputStream (path);
        var scan = new java.util.Scanner (fis);
        for (var i = 0; scan.hasNextLine (); ++i) {
            lines [i] = scan.nextLine ();
        }
        fis.close ();
    } catch (e) {
        println ("Failed to open '" + path + "': " + e);
    }
    
    return lines;
}

$.saveArray = function(array, path, append) {
    try {
        var fos = new java.io.FileOutputStream (path, append);
        var ps = new java.io.PrintStream (fos);
        var l=array.length;
        for (var i=0; i<l; ++i) {
            ps.println (array [i]);
        }
        fos.close ();
    } catch (e) {
        println ("Failed to write to '" + path + "': " + e);
    }
}

$.writeToFile = function(string, path, append) {
    try {
        var fos = new java.io.FileOutputStream (path, append);
        var ps = new java.io.PrintStream (fos);
        ps.println (string);
        fos.close ();
    } catch (e) {
        println ("Failed to write to '" + path + "': " + e);
    }
}

$.touchFile = function(path) {
    try {
        var fos = new java.io.FileOutputStream(path, true);
        fos.close ();
    } catch (e) {
        println ("Failed to touch '" + path + "': " + e);
    }
}

$.deleteFile = function(path, now) {
    try {
        var f = new java.io.File(path);
        
        if (now) {
            f['delete']();
        } else {
            f.deleteOnExit();
        }
    } catch (e) {
        println("Failed to delete '" + path + "': " + e)
    }
}

$.fileExists = function(path) {
    try {
        var f = new java.io.File(path);
        return f.exists();
    } catch (e) {
        return false;
    }
    
    return false;
}

$.findFiles = function(directory, pattern) {
    try {
        var f = new java.io.File(directory);
        
        var ret = new Array();
        
        if (!f.isDirectory()) {
            throw "not a valid directory";
        } else {
            var files = f.list();
            
            for (var i = 0; i < files.length; i++) {
                if (files[i].indexOf(pattern) != -1) {
                    ret.push(files[i]);
                }
            }
            
            return ret;
        }
    } catch (e) {
        println("Failed to search in '" + directory + "': " + e)
    }
    
    return new Array();
}

$.isDirectory = function(path) {
    try {
        var f = new java.io.File(path);
        return f.isDirectory();
    } catch (e) {
        return false;
    }
    
    return false;
}