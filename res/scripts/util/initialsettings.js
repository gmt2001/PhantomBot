$.initialsettings = function (channel) {
    println("Start initialsettings [" + channel.getName() + "] ...");

    println("   Loading default settings...");

    println("      Setting default module statuses...");
    $.inidb.SetBoolean("modules", channel.getName(), "./commands/8ballCommand.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./commands/killCommand.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./commands/marathonCommand.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./commands/randomCommand.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./handlers/donationHandler.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./handlers/hostHandler.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./handlers/phraseHandler.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./handlers/subscribeHandler.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/bankheistSystem.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/betSystem.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/bidSystem.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/greetingSystem.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/levelQueueSystem.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/pollSystem.js" + "_enabled", false);
    $.inidb.SetBoolean("modules", channel.getName(), "./systems/queueSystem.js" + "_enabled", false);

    println("      Setting default chatmod settings...");
    $.inidb.SetInteger("settings", channel.getName(), "warningcountresettime", 600);
    $.inidb.SetString("settings", channel.getName(), "autopurgemessage", "auto-purged for using banned phrase #");
    $.inidb.SetString("settings", channel.getName(), "autobanmessage", "auto-banned for using banned phrase #");
    $.inidb.SetBoolean("settings", channel.getName(), "capsallowed", false);
    $.inidb.SetFloat("settings", channel.getName(), "capstriggerratio", 0.45);
    $.inidb.SetInteger("settings", channel.getName(), "capstriggerlength", 70);
    $.inidb.SetString("settings", channel.getName(), "capsmessage", "that was way too many caps!");
    $.inidb.SetBoolean("settings", channel.getName(), "linksallowed", false);
    $.inidb.SetInteger("settings", channel.getName(), "permittime", 60);
    $.inidb.SetBoolean("settings", channel.getName(), "youtubeallowed", false);
    $.inidb.SetString("settings", channel.getName(), "linksmessage", "dont post links without permission!");
    $.inidb.SetString("settings", channel.getName(), "warning1type", "purge");
    $.inidb.SetString("settings", channel.getName(), "warning2type", "purge");
    $.inidb.SetString("settings", channel.getName(), "warning3type", "purge");
    $.inidb.SetString("settings", channel.getName(), "warning1message", "");
    $.inidb.SetString("settings", channel.getName(), "warning2message", "");
    $.inidb.SetString("settings", channel.getName(), "warning3message", "");
    $.inidb.SetBoolean("settings", channel.getName(), "spamallowed", true);
    $.inidb.SetInteger("settings", channel.getName(), "spamlimit", 12);
    $.inidb.SetString("settings", channel.getName(), "spammessage", "dont spam chat!");
    $.inidb.SetBoolean("settings", channel.getName(), "symbolsallowed", false);
    $.inidb.SetInteger("settings", channel.getName(), "symbolslimit", 24);
    $.inidb.SetInteger("settings", channel.getName(), "symbolsrepeatlimit", 18);
    $.inidb.SetString("settings", channel.getName(), "symbolsmessage", "dont spam symbols!");
    $.inidb.SetBoolean("settings", channel.getName(), "repeatallowed", false);
    $.inidb.SetInteger("settings", channel.getName(), "repeatlimit", 18);
    $.inidb.SetString("settings", channel.getName(), "repeatmessage", "dont spam repeating characters!");
    $.inidb.SetBoolean("settings", channel.getName(), "graphemeallowed", false);
    $.inidb.SetInteger("settings", channel.getName(), "graphemelimit", 6);
    $.inidb.SetString("settings", channel.getName(), "graphememessage", "dont post grapheme clusters!");
    $.inidb.SetBoolean("settings", channel.getName(), "subsallowed", false);
    $.inidb.SetBoolean("settings", channel.getName(), "regsallowed", false);

    println("     Creating default command aliases...");
    $.inidb.SetString("aliases", channel.getName(), "songrequest", "addsong");
    $.inidb.SetString("aliases", channel.getName(), "deletesong", "delsong");
    $.inidb.SetString("aliases", channel.getName(), "removesong", "delsong");
    $.inidb.SetString("aliases", channel.getName(), "songsteal", "stealsong");
    $.inidb.SetString("aliases", channel.getName(), "music", "musicplayer");
    $.inidb.SetString("aliases", channel.getName(), "status", "title");
    $.inidb.SetString("aliases", channel.getName(), "settitle", "title");
    $.inidb.SetString("aliases", channel.getName(), "topic", "title");
    $.inidb.SetString("aliases", channel.getName(), "setgame", "game");
    $.inidb.SetString("aliases", channel.getName(), "caster", "shoutout");
    $.inidb.SetString("aliases", channel.getName(), "follow", "shoutout");
    $.inidb.SetString("aliases", channel.getName(), "followtime", "followage");
    $.inidb.SetString("aliases", channel.getName(), "following", "followage");

    println("     Creating logs folder");
    $.mkDir("logs");

    println("     Creating blank currentsong.txt");
    $.writeToFile("", "./addons/youtubePlayer/currentsong.txt", false);
    $.inidb.SetString("settings", channel.getName(), "lastdonation", "");
    $.inidb.SetString("settings", channel.getName(), "lastsong", "");

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

            if (section.equalsIgnoreCase(channel.getName())) {
                $.inidb.SetString(file, section, key, value);
            }
        }

        Packages.com.gmt2001.Console.out.print("\r   " + i + "/" + lines.length);
    }

    println("\r   " + lines.length + "/" + lines.length);

    println("   Saving...");

    $.inidb.SetBoolean("init", channel.getName(), "initialsettings", true);
    $.inidb.SaveAll(true);

    println("End initialsettings...");
}