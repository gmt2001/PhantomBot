println("Start initialsettings...");

if ($.firstrun) {
    println("   Loading default settings...");
    
    println("      Setting default module statuses...");
    $.inidb.set("modules", "./commands/8ballCommand.js" + "_enabled", "0");
    $.inidb.set("modules", "./commands/killCommand.js" + "_enabled", "0");
    $.inidb.set("modules", "./commands/marathonCommand.js" + "_enabled", "0");
    $.inidb.set("modules", "./commands/randomCommand.js" + "_enabled", "0");
    $.inidb.set("modules", "./handlers/donationHandler.js" + "_enabled", "0");
    $.inidb.set("modules", "./handlers/hostHandler.js" + "_enabled", "0");
    $.inidb.set("modules", "./handlers/phraseHandler.js" + "_enabled", "0");
    $.inidb.set("modules", "./handlers/subscribeHandler.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/bankheistSystem.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/betSystem.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/bidSystem.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/greetingSystem.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/levelQueueSystem.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/pollSystem.js" + "_enabled", "0");
    $.inidb.set("modules", "./systems/queueSystem.js" + "_enabled", "0");
    
    println("      Setting default chatmod settings...");
    $.inidb.set("settings", "warningcountresettime", "600");
    $.inidb.set("settings", "autopurgemessage", "follow the rules!");
    $.inidb.set("settings", "capsallowed", "0");
    $.inidb.set("settings", "capstriggerratio", "0.45");
    $.inidb.set("settings", "capstriggerlength", "70");
    $.inidb.set("settings", "capsmessage", "that was way too many caps!");
    $.inidb.set("settings", "linksallowed", "0");
    $.inidb.set("settings", "permittime", "60");
    $.inidb.set("settings", "youtubeallowed", "0");
    $.inidb.set("settings", "linksmessage", "dont post links without permission!");
    $.inidb.set("settings", "warning1type", "purge");
    $.inidb.set("settings", "warning2type", "purge");
    $.inidb.set("settings", "warning3type", "purge");
    $.inidb.set("settings", "warning1message", "");
    $.inidb.set("settings", "warning2message", "");
    $.inidb.set("settings", "warning3message", "");
    $.inidb.set("settings", "spamallowed", "1");
    $.inidb.set("settings", "spamlimit", "12");
    $.inidb.set("settings", "spammessage", "dont spam chat!");
    $.inidb.set("settings", "symbolsallowed", "0");
    $.inidb.set("settings", "symbolslimit", "24");
    $.inidb.set("settings", "symbolsrepeatlimit", "18");
    $.inidb.set("settings", "symbolsmessage", "dont spam symbols!");
    $.inidb.set("settings", "repeatallowed", "0");
    $.inidb.set("settings", "repeatlimit", "18");
    $.inidb.set("settings", "repeatmessage", "dont spam repeating characters!");
    $.inidb.set("settings", "graphemeallowed", "0");
    $.inidb.set("settings", "graphemelimit", "6");
    $.inidb.set("settings", "graphememessage", "dont post grapheme clusters!");
    $.inidb.set("settings", "subsallowed", "0");
    $.inidb.set("settings", "regsallowed", "0");
    
    println("     Creating default command aliases...");
    $.inidb.set("aliases", "songrequest", "addsong");
    $.inidb.set("aliases", "deletesong", "delsong");
    $.inidb.set("aliases", "removesong", "delsong");
    $.inidb.set("aliases", "songsteal", "stealsong");
    $.inidb.set("aliases", "music", "musicplayer");
    $.inidb.set("aliases", "status", "title");
    $.inidb.set("aliases", "settitle", "title");
    $.inidb.set("aliases", "topic", "title");
    $.inidb.set("aliases", "setgame", "game");
    
    println("     Creating logs folder");
    $.mkDir("logs");
    
    println("     Creating blank currentsong.txt");
    $.writeToFile("", "./addons/youtubePlayer/currentsong.txt", false);
    $.inidb.set("settings", "lastdonation", "");
    $.inidb.set("settings", "lastsong", "");
}

println("   Loading initial settings text file...");
$.touchFile("./initialSettings.txt");

var lines = $.readFile("./initialSettings.txt");
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