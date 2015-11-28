$.upgrade = function (channel) {
    println("Start upgrade [" + channel.getName() + "] ...");

    var keys;
    var i;

    println("   Skipping versions 1 though 12 (obsolete)...");

    if ($.inidb.GetInteger("init", channel.getName(), "version") < 13) {
        println("   Starting version 13 upgrades...");

        println("     Creating stream command default aliases");

        $.inidb.SetString("aliases", channel.getName(), "status", "title");
        $.inidb.SetString("aliases", channel.getName(), "settitle", "title");
        $.inidb.SetString("aliases", channel.getName(), "topic", "title");
        $.inidb.SetString("aliases", channel.getName(), "setgame", "game");

        println("   End version 13 upgrades...");
    }

    if ($.inidb.GetInteger("init", channel.getName(), "version") < 14) {
        println("   Starting version 14 upgrades...");

        println("     Updating subscribeHandler.js disable path");

        if (!$.moduleEnabled("./subscribeHandler.js", channel)) {
            $.inidb.SetBoolean('modules', channel.getName(), "./handlers/subscribeHandler.js" + '_enabled', false);
        }

        println("     Creating blank currentsong.txt");
        $.writeToFile("", "./addons/youtubePlayer/currentsong.txt", false);
        $.inidb.SetString('settings', channel.getName(), "lastdonation", "");
        $.inidb.SetString('settings', channel.getName(), "lastsong", "");
        println("   End version 14 upgrades...");
    }

    if ($.inidb.GetInteger("init", channel.getName(), "version") < 15) {
        println("   Starting version 15 upgrades...");

        println("     Updating youtubePlayer.js musicplayer command");
        var keys = $.inidb.GetKeyList("aliases", channel.getName());

        for (var i = 0; i < keys.length; i++) {
            if ($.inidb.GetString("aliases", channel.getName(), keys[i]) == "song") {
                $.inidb.SetString("aliases", channel.getName(), keys[i], "musicplayer")
            }
        }
        println("   End version 15 upgrades...");
    }

    if ($.inidb.GetInteger("init", channel.getName(), "version") < 16) {
        println("   Starting version 16 upgrades...");

        println("     Updating pointsystem.js setting files");
        if ($.inidb.Exists("settings", channel.getName(), "pointname")) {
            $.inidb.SetString("settings", channel.getName(), "pointNameSingle", $.inidb.GetString("settings", channel.getName(), "pointname"));

            $.inidb.RemoveKey("settings", channel.getName(), "pointname");
        }

        if ($.inidb.Exists("settings", channel.getName(), "pointgain")) {
            $.inidb.SetInteger("settings", channel.getName(), "pointGain", $.inidb.GetInteger("settings", channel.getName(), "pointgain"));

            $.inidb.RemoveKey("settings", channel.getName(), "pointgain");
        }

        if ($.inidb.Exists("settings", channel.getName(), "offlinegain")) {
            $.inidb.SetInteger("settings", channel.getName(), "pointGainOffline", $.inidb.GetInteger("settings", channel.getName(), "offlinegain"));

            $.inidb.RemoveKey("settings", channel.getName(), "offlinegain");
        }

        if ($.inidb.Exists("settings", channel.getName(), "pointbonus")) {
            $.inidb.SetInteger("settings", channel.getName(), "pointBonus", $.inidb.GetInteger("settings", channel.getName(), "pointbonus"));

            $.inidb.RemoveKey("settings", channel.getName(), "pointbonus");
        }

        if ($.inidb.Exists("settings", channel.getName(), "pointinverval")) {
            $.inidb.SetInteger("settings", channel.getName(), "pointInterval", $.inidb.GetInteger("settings", channel.getName(), "pointinterval"));

            $.inidb.RemoveKey("settings", channel.getName(), "pointinterval");
        }

        if ($.inidb.Exists("settings", channel.getName(), "offlineinterval")) {
            $.inidb.SetInteger("settings", channel.getName(), "pointIntervalOffline", $.inidb.GetInteger("settings", channel.getName(), "offlineinterval"));

            $.inidb.RemoveKey("settings", channel.getName(), "offlineinterval");
        }

        if ($.inidb.Exists("settings", channel.getName(), "mingift")) {
            $.inidb.SetInteger("settings", channel.getName(), "pointGiftMin", $.inidb.GetInteger("settings", channel.getName(), "mingift"));

            $.inidb.RemoveKey("settings", channel.getName(), "mingift");
        }
        println("     Updating timesystem.js setting files");

        if ($.inidb.Exists("settings", channel.getName(), "timelevel")) {
            $.inidb.SetBoolean("settings", channel.getName(), "timeLevel", $.inidb.GetBoolean("settings", channel.getName(), "timelevel"));

            $.inidb.RemoveKey("settings", channel.getName(), "timelevel");
        }

        if ($.inidb.Exists("settings", channel.getName(), "timepromotehours")) {
            $.inidb.SetInteger("settings", channel.getName(), "timePromoteHours", $.inidb.GetInteger("settings", channel.getName(), "timepromotehours"));

            $.inidb.RemoveKey("settings", channel.getName(), "timepromotehours");
        }

        if ($.inidb.Exists("settings", channel.getName(), "timeZone")) {
            $.inidb.SetString("settings", channel.getName(), "timezone", $.inidb.GetString("settings", channel.getName(), "timeZone"));

            $.inidb.RemoveKey("settings", channel.getName(), "timeZone");
        }

        if ($.inidb.Exists("settings", channel.getName(), "raffle_toggle")) {
            $.inidb.SetBoolean("settings", channel.getName(), "raffleToggle", $.inidb.GetBoolean("settings", channel.getName(), "raffle_toggle"));

            $.inidb.RemoveKey("settings", channel.getName(), "raffle_toggle");
        }

        println("   End version 16 upgrades...");
    }

    if ($.inidb.GetInteger("init", channel.getName(), "version") < 17) {
        println("   Starting version 17 upgrades...");

        if (!$.inidb.Exists("settings", channel.getName(), "autopurgemessage")
                || $.inidb.GetString("settings", channel.getName(), "autopurgemessage").equalsIgnoreCase("follow the rules!")) {
            $.inidb.SetString("settings", channel.getName(), "autopurgemessage", "auto-purged for using banned phrase #");
        }

        if (!$.inidb.Exists("settings", channel.getName(), "autobanmessage")) {
            $.inidb.SetString("settings", channel.getName(), "autobanmessage", "auto-banned for using banned phrase #");
        }

        $.inidb.SetString("aliases", channel.getName(), "caster", "shoutout");
        $.inidb.SetString("aliases", channel.getName(), "follow", "shoutout");
        $.inidb.SetString("aliases", channel.getName(), "followtime", "followage");
        $.inidb.SetString("aliases", channel.getName(), "following", "followage");

        println("   End version 17 upgrades...");
    }

    println("   Saving...");

    $.inidb.SetInteger("init", channel.getName(), "version", parseInt($.upgrade_version));
    $.inidb.SaveAll(true);

    println("End upgrade...");
}