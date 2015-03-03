println("Start initialsettings...");

$.touchFile("./initialSettings");

var lines = $.readFile("./initialSettings");
var spl;
var file;
var section;
var key;
var value;

Packages.com.gmt2001.Console.out.print("   0/" + lines.length);

for (var i = 0; i < lines.length; i++) {
    spl = lines[i].split("=");
    
    if (spl.length > 3) {
        file = spl[0];
        section = spl[1];
        key = spl[2];
        value = lines[i].substr($.strlen(file) + $.strlen(section) + $.strlen(key) + 3);

        $.inidb.SetString(file, section, key, value);
    }
    
    Packages.com.gmt2001.Console.out.print("\r   " + i + "/" + lines.length);
}

println("\r   " + lines.length + "/" + lines.length);

println("   Saving...");

$.inidb.SetBoolean("init", "initialsettings", "loaded", true);
$.inidb.SetInteger("init", "initialsettings", "update", parseInt($.initialsettings_update));
$.inidb.SaveAll(true);

println("End initialsettings...");