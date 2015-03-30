println("Start upgrade...");

var keys;
var i;
var s;

if ($.inidb.GetInteger("init", "upgrade", "version") < 1) {
    println("   Starting version 1 upgrades...");
    
    keys = $.inidb.GetKeyList("bool", "");
    
    println("     Moving greeting enabled booleans to new system...");
    for (i = 0; i < keys.length; i++) {
        if ($.inidb.get("bool", keys[i]) == "true") {
            s = keys[i].substring(0, keys[i].indexOf("_greeting_enabled")).toLowerCase();
            
            $.inidb.set("greeting", s + "_enabled", "1");
            $.inidb.del("bool", keys[i]);
        }
    }
    
    keys = $.inidb.GetKeyList("string", "");
    
    println("     Moving greeting prefix/suffix strings to new system...");
    for (i = 0; i < keys.length; i++) {
        if (keys[i].indexOf("_greeting_prefix") != -1) {
            s = keys[i].substring(0, keys[i].indexOf("_greeting_prefix")).toLowerCase();
            
            if ($.inidb.exists("greeting", s)) {
                $.inidb.set("greeting", s, $.inidb.get("string", keys[i]) + " <name> " + $.inidb.get("greeting", s));
            } else {
                $.inidb.set("greeting", s, $.inidb.get("string", keys[i]) + " <name>");
            }
            
            $.inidb.del("string", keys[i]);
        } else if (keys[i].indexOf("_greeting_suffix") != -1) {
            s = keys[i].substring(0, keys[i].indexOf("_greeting_suffix")).toLowerCase();
            
            if ($.inidb.exists("greeting", s)) {
                $.inidb.set("greeting", s, $.inidb.get("greeting", s) + " " + $.inidb.get("string", keys[i]));
            } else {
                $.inidb.set("greeting", s, $.inidb.get("string", keys[i]));
            }
            
            $.inidb.del("string", keys[i]);
        }
    }
    
    if ($.inidb.FileExists("greetings")) {
        keys = $.inidb.GetKeyList("greetings", "");
    
        println("     Moving phantomindex greetings to new system...");
        for (i = 0; i < keys.length; i++) {
            if (keys[i].equalsIgnoreCase("default_greeting")) {
                $.inidb.set("greeting", "_default", $.inidb.get("greetings", keys[i]));
                $.inidb.del("greetings", keys[i]);
            } else {
                s = keys[i].substring(9).toLowerCase();
            
                $.inidb.set("greeting", s, $.inidb.get("greetings", keys[i]));
            
                $.inidb.del("greetings", keys[i]);
            }
        }
    }
    
    keys = $.inidb.GetKeyList("events", "");
    
    println("     Moving events to new system...");
    for (i = 0; i < keys.length; i++) {
        $.inidb.set("announcements", keys[i], $.inidb.get("events", keys[i]));
        $.inidb.del("events", keys[i]);
    }
    
    println("     Cleaning up old files");
    $.inidb.RemoveFile("bool");
    $.inidb.RemoveFile("string");
    
    if ($.inidb.FileExists("greetings")) {
        $.inidb.RemoveFile("greetings");
    }
    
    $.inidb.RemoveFile("events");
    
    $.deleteFile("./scripts/events.js", false);
    
    println("   End version 1 upgrades...");
}

if ($.inidb.GetInteger("init", "upgrade", "version") < 2) {
    println("   Starting version 2 upgrades...");
    
    println("     Populating new chat moderation values");
    
    if (!$.inidb.exists("settings", "warningcountresettime")) {
        $.inidb.set("settings", "warningcountresettime", "600");
    }
    
    if (!$.inidb.exists("settings", "timeouttype")) {
        $.inidb.set("settings", "timeouttype", "timeout");
    }
    
    if (!$.inidb.exists("settings", "autopurgemessage")) {
        $.inidb.set("settings", "autopurgemessage", "follow the rules!");
    }
    
    if (!$.inidb.exists("settings", "capsallowed")) {
        $.inidb.set("settings", "capsallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "capstriggerratio")) {
        $.inidb.set("settings", "capstriggerratio", "0.45");
    }
    
    if (!$.inidb.exists("settings", "capstriggerlength")) {
        $.inidb.set("settings", "capstriggerlength", "70");
    }
    
    if (!$.inidb.exists("settings", "capsmessage")) {
        $.inidb.set("settings", "capsmessage", "that was way too many caps!");
    }
    
    if (!$.inidb.exists("settings", "linksallowed") && $.inidb.exists("settings", "linkson")) {
        $.inidb.set("settings", "linksallowed", $.inidb.get("settings", "linkson"));
    
        if ($.inidb.get("settings", "linksallowed") == null || $.inidb.get("settings", "linksallowed") == undefined
            || $.inidb.get("settings", "linksallowed").isEmpty()) {
            $.inidb.set("settings", "linksallowed", "0");
        }
        
        $.inidb.del("settings", "linkson");
    } else {
        $.inidb.set("settings", "linksallowed", "0");
        $.inidb.del("settings", "linkson");
    }
    
    if (!$.inidb.exists("settings", "permittime")) {
        $.inidb.set("settings", "permittime", "60");
    }
    
    if (!$.inidb.exists("settings", "youtubeallowed")) {
        $.inidb.set("settings", "youtubeallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "casterallowed")) {
        $.inidb.set("settings", "casterallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "linksmessage")) {
        $.inidb.set("settings", "linksmessage", "dont post links without permission!");
    }
    
    if (!$.inidb.exists("settings", "warning1type")) {
        $.inidb.set("settings", "warning1type", "purge");
    }
    
    if (!$.inidb.exists("settings", "warning2type")) {
        $.inidb.set("settings", "warning2type", "purge");
    }
    
    if (!$.inidb.exists("settings", "warning3type")) {
        $.inidb.set("settings", "warning3type", "600");
    }
    
    if (!$.inidb.exists("settings", "warning1message")) {
        $.inidb.set("settings", "warning1message", "");
    }
    
    if (!$.inidb.exists("settings", "warning2message")) {
        $.inidb.set("settings", "warning2message", "");
    }
    
    if (!$.inidb.exists("settings", "warning3message")) {
        $.inidb.set("settings", "warning3message", "");
    }
    
    println("     Updating permission groups...");

    var caster = 0;
    var admin = 1;
    var mod = 2;
    var sub = 3;
    var don = 4;
    var host = 5;
    var reg = 6;
    var view = 7;
    
    keys = $.inidb.GetKeyList("groups", "");
    
    for (i = 0; i < keys.length; i++) {
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Caster")) {
            caster = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Administrator")) {
            admin = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Moderator")) {
            mod = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Subscriber")) {
            sub = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Donator")) {
            don = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Hoster")) {
            host = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Regular")) {
            reg = i;
        }
        if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Viewer")) {
            view = i;
        }
    }
    
    keys = $.inidb.GetKeyList("group", "");
    var toinc = new Array();
    
    for (i = 0; i < keys.length; i++) {
        if (parseInt($.inidb.get("group", keys[i])) == mod || parseInt($.inidb.get("group", keys[i])) == admin) {
            toinc.push(keys[i]);
        }
    }
    
    for (i = 0; i < toinc.length; i++) {
        var level = parseInt($.inidb.get("group", toinc[i]));
        
        level++;
        
        $.inidb.set("group", toinc[i], level);
    }
    
    println("     Updating follow message...");
    
    if ($.inidb.exists("settings", "followmessage")) {
        s = $.inidb.get("settings", "followmessage");
        
        while (s.indexOf('<name>') != -1) {
            s = s.replace('<name>', '(name)');
        }
        
        while (s.indexOf('< name>') != -1) {
            s = s.replace('< name>', '(name)');
        }
        
        while (s.indexOf('<pointname>') != -1) {
            s = s.replace('<pointname>', '(pointname)');
        }
        
        while (s.indexOf('< pointname>') != -1) {
            s = s.replace('< pointname>', '(pointname)');
        }
        
        $.inidb.set("settings", "followmessage", s);
    }
    
    println("     Updating custom commands...");
    
    keys = $.inidb.GetKeyList("command", "");
    
    for (i = 0; i < keys.length; i++) {
        s = $.inidb.get("command", keys[i]);
        
        while (s.indexOf('<sender>') != -1) {
            s = s.replace('<sender>', '(sender)');
        }
        
        while (s.indexOf('< sender>') != -1) {
            s = s.replace('< sender>', '(sender)');
        }
        
        for (var b = 1; b <= 10; b++) {
            while (s.indexOf('<' + b + '>') != -1) {
                s = s.replace('<' + b + '>', '(' + b + ')');
            }
            
            while (s.indexOf('< ' + b + '>') != -1) {
                s = s.replace('< ' + b + '>', '(' + b + ')');
            }
        }
        
        $.inidb.set("command", keys[i], s);
    }
    
    println("     Updating phantomindex moderation values...");
    
    if ($.inidb.exists("settings", "capson") && !$.inidb.get("settings", "capson").isEmpty()) {
        $.inidb.set("settings", "capsallowed", $.inidb.get("settings", "capson"));
        $.inidb.del("settings", "capson");
    }
    
    if ($.inidb.exists("settings", "caps_msg") && !$.inidb.get("settings", "caps_msg").isEmpty()) {
        $.inidb.set("settings", "capsmessage", $.inidb.get("settings", "caps_msg"));
        $.inidb.del("settings", "caps_msg");
    }
    
    if ($.inidb.exists("settings", "caps_limit")) {
        println("         [ERROR] Unable to convert caps limit to caps ratio/length. Deleting...");
        $.inidb.del("settings", "caps_limit");
    }
    
    println("   End version 2 upgrades...");
}

if ($.inidb.GetInteger("init", "upgrade", "version") < 3) {
    println("   Starting version 3 upgrades...");
    
    println("     Populating new chat moderation values");
    
    if (!$.inidb.exists("settings", "spamallowed")) {
        $.inidb.set("settings", "spamallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "spamlimit")) {
        $.inidb.set("settings", "spamlimit", "8");
    }
    
    if (!$.inidb.exists("settings", "spammessage")) {
        $.inidb.set("settings", "spammessage", "dont spam chat!");
    }
    
    if (!$.inidb.exists("settings", "casterallowed")) {
        $.inidb.set("settings", "casterallowed", "0");
    }
    
    println("   End version 3 upgrades...");
}

if ($.inidb.GetInteger("init", "upgrade", "version") < 4) {
    println("   Starting version 4 upgrades...");
    
    println("     Populating new chat moderation values");
    
    if (!$.inidb.exists("settings", "symbolsallowed")) {
        $.inidb.set("settings", "symbolsallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "symbolslimit")) {
        $.inidb.set("settings", "symbolslimit", "16");
    }
    
    if (!$.inidb.exists("settings", "symbolsrepeatlimit")) {
        $.inidb.set("settings", "symbolsrepeatlimit", "14");
    }
    
    if (!$.inidb.exists("settings", "symbolsmessage")) {
        $.inidb.set("settings", "symbolsmessage", "dont spam symbols!");
    }
    
    if (!$.inidb.exists("settings", "repeatallowed")) {
        $.inidb.set("settings", "repeatallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "repeatlimit")) {
        $.inidb.set("settings", "repeatlimit", "14");
    }
    
    if (!$.inidb.exists("settings", "repeatmessage")) {
        $.inidb.set("settings", "repeatmessage", "dont spam repeating characters!");
    }
    
    if (!$.inidb.exists("settings", "graphemeallowed")) {
        $.inidb.set("settings", "graphemeallowed", "0");
    }
    
    if (!$.inidb.exists("settings", "graphemelimit")) {
        $.inidb.set("settings", "graphemelimit", "6");
    }
    
    if (!$.inidb.exists("settings", "graphememessage")) {
        $.inidb.set("settings", "graphememessage", "dont post grapheme clusters!");
    }
    
    println("   End version 4 upgrades...");
}

if ($.inidb.GetInteger("init", "upgrade", "version") < 5) {
    println("   Starting version 5 upgrades...");
    
    println("     Populating twitch/twitter command values");
    
    if (!$.inidb.exists("twitchtwitter", "perm")) {
        $.inidb.set("twitchtwitter", "perm", "mod");
    }
    
    if (!$.inidb.exists("twitchtwitter", "list")) {
        $.inidb.set("twitchtwitter", "list", "");
    }
    
    if (!$.inidb.exists("twitchtwitter", "twitchmsg")) {
        $.inidb.set("twitchtwitter", "twitchmsg", "Make sure you follow (name) on twitch at twitch.tv/(name)");
    }
    
    if (!$.inidb.exists("twitchtwitter", "twittermsg")) {
        $.inidb.set("twitchtwitter", "twittermsg", "Make sure you follow @(name) at twitter.com/(name)");
    }
    
    println("   End version 5 upgrades...");
}

if ($.inidb.GetInteger("init", "upgrade", "version") < 6) {
    println("   Starting version 6 upgrades...");
    
    println("     Populating new chat moderation values");
    
    if (!$.inidb.exists("settings", "subsallowed")) {
        $.inidb.set("settings", "subsallowed", "0");
    }
    
    println("   End version 6 upgrades...");
}

if ($.inidb.GetInteger("init", "upgrade", "version") < 7) {
    println("   Starting version 7 upgrades...");
    
    $.inidb.del("settings", "casterallowed");
    
    println("     Migrating cost values to pricecom");
    
    if ($.inidb.exists("settings", "roll_cost")) {
        $.inidb.set("pricecom", "roll", $.inidb.get("settings", "roll_cost"));
        
        $.inidb.del("settings", "roll_cost");
    }
    
    if ($.inidb.exists("settings", "vetosong_cost")) {
        $.inidb.set("pricecom", "vetosong", $.inidb.get("settings", "vetosong_cost"));
        
        $.inidb.del("settings", "vetosong_cost");
    }
    
    if ($.inidb.exists("pricecom", "songrequest") && !$.inidb.exists("pricecom", "addsong")) {
        $.inidb.set("pricecom", "addsong", $.inidb.get("pricecom", "songrequest"));
    }
    
    if ($.inidb.exists("pricecom", "songrequest")) {
        $.inidb.del("pricecom", "songrequest");
    }
    
    println("     Creating default aliases");
    
    $.inidb.set("aliases", "songrequest", "addsong");
    $.inidb.set("aliases", "deletesong", "delsong");
    $.inidb.set("aliases", "removesong", "delsong");
    $.inidb.set("aliases", "songsteal", "stealsong");
    $.inidb.set("aliases", "music", "song");
    
    if (!$.inidb.exists("groups", "0") || !$.inidb.get("groups", "0").equalsIgnoreCase("caster")) {
        println("     Upgrading groups system");
        
        keys = $.inidb.GetKeyList("groups", "");
        var castgroup = 0;
        var admingroup = 1;
        var modgroup = 2;
        var subgroup = 3;
        var dongroup = 4;
        var hostgroup = 5;
        var reggroup = 6;
        var viewgroup = 7;

        for (i = 0; i < keys.length; i++) {
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Caster") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Casters")) {
                admingroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Administrator") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Administrators")) {
                admingroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Moderator") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Moderators")) {
                modgroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Subscriber") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Subscribers")) {
                admingroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Donator") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Donators")) {
                modgroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Hoster") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Hosters")) {
                admingroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Regular") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Regulars")) {
                modgroup = keys[i];
            }
            
            if ($.inidb.get("groups", keys[i]).equalsIgnoreCase("Viewer") || $.inidb.get("groups", keys[i]).equalsIgnoreCase("Viewers")) {
                modgroup = keys[i];
            }
            
            $.inidb.del("groups", keys[i]);
        }
        
        keys = $.inidb.GetKeyList("group", "");
        
        var users = new Array();
        
        for (i = 0; i < keys.length; i++) {
            var group = $.inidb.get("group", keys[i]);
            
            if (group == castgroup) {
                users.push(new Array(keys[i], 0));
            }
            
            if (group == admingroup) {
                users.push(new Array(keys[i], 1));
            }
            
            if (group == modgroup) {
                users.push(new Array(keys[i], 2));
            }
            
            if (group == subgroup) {
                users.push(new Array(keys[i], 3));
            }
            
            if (group == dongroup) {
                users.push(new Array(keys[i], 4));
            }
            
            if (group == hostgroup) {
                users.push(new Array(keys[i], 5));
            }
            
            if (group == reggroup) {
                users.push(new Array(keys[i], 6));
            }
            
            if (group == viewgroup) {
                users.push(new Array(keys[i], 7));
            }            
            
            if (group == 0 || group == 1 || group == 2) {
                users.push(new Array(keys[i], 7));
            }
            
            $.inidb.del("group", keys[i]);
        }
        
        for (i = 0; i < users.length; i++) {
            $.inidb.set("group", users[i][0], users[i][1]);
        }
    }
    
    println("   End version 7 upgrades...");
}

println("   Saving...");

$.inidb.SetInteger("init", "upgrade", "version", parseInt($.upgrade_version));
$.inidb.SaveAll(true);

println("End upgrade...");