$.lang = new Array();

$.lang.curlang = "english";

if ($.inidb.exists("settings", "lang")) {
    $.lang.curlang = $.inidb.get("settings", "lang");
}

$.lang.data = new Array();

$.lang.load = function() {
    $.loadScriptForce("./lang/lang-english.js");
    
    var list = $.findFiles("./scripts/lang", "lang-english-");
    
    for (i = 0; i < list.length; i++) {
        $.loadScriptForce("./lang/" + list[i]);
    }
    
    $.loadScriptForce("./lang/lang-" + $.lang.curlang + ".js");
    
    list = $.findFiles("./scripts/lang", "lang-" + $.lang.curlang + "-");
    
    for (i = 0; i < list.length; i++) {
        $.loadScriptForce("./lang/" + list[i]);
    }
}

$.lang.load();

$.lang.get = function(str_name) {
    if ($.lang.data[str_name] == undefined || $.lang.data[str_name] == null) {
        $.logError("./util/lang.js", 33, "Lang string missing: " + str_name);
        Packages.com.gmt2001.Console.err.println("[lang.js] Lang string missing: " + str_name);
        
        if (str_name.equalsIgnoreCase("net.phantombot.lang.not-exists")) {
            return "!!! Missing string in lang file !!!";
        } else {
            return $.lang.get("net.phantombot.lang.not-exists");
        }
    }
    
    var s = $.lang.data[str_name];
    var i;
    for (i = 1; i < arguments.length; i++) {
        while (s.indexOf("$" + i) >= 0) {
            s = s.replace("$" + i, arguments[i]);
        }
    }
    
    return s;
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    
    if (command.equalsIgnoreCase("lang")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;                
        }
        
        if (args.length == 0) {
            $.say($.lang.get("net.phantombot.lang.curlang", $.lang.curlang));
        } else {
            if (!$.fileExists("./scripts/lang/lang-" + args[0].toLowerCase() + ".js")) {
                $.say($.lang.get("net.phantombot.lang.lang-not-exists"));
                return; 
            } else {
                $.inidb.set("settings", "lang", args[0].toLowerCase());
                $.lang.curlang = args[0].toLowerCase();
                $.lang.load();
                
                $.say($.lang.get("net.phantombot.lang.lang-changed", args[0].toLowerCase()));
            }
        }
    }
});
