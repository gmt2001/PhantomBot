$.lang.data = new Array();
$.lang.langdata = new Array();

$.lang.load = function (channel) {
    $.loadScriptForce("./lang/lang-english.js");

    var list = $.findFiles("./scripts/lang", "lang-english-");

    for (i = 0; i < list.length; i++) {
        $.loadScriptForce("./lang/" + list[i]);
    }

    $.lang.langdata["english"] = $.lang.data;

    if ($.inidb.HasKey("settings", channel.getName(), "lang")) {
        $.loadScriptForce("./lang/lang-" + $.inidb.GetString("settings", channel.getName(), "lang") + ".js");

        list = $.findFiles("./scripts/lang", "lang-" + $.inidb.GetString("settings", channel.getName(), "lang") + "-");

        for (i = 0; i < list.length; i++) {
            $.loadScriptForce("./lang/" + list[i]);
        }

        $.lang.langdata[$.inidb.GetString("settings", channel.getName(), "lang")] = $.lang.data;
    }
}

$.on('ircJoinComplete', function (event) {
    $.lang.load(event.getChannel());
});

$.lang.get = function (str_name, channel) {
    var lang = "english";

    if ($.inidb.HasKey("settings", channel.getName(), "lang")) {
        lang = $.inidb.GetString("settings", channel.getName(), "lang");
    }

    if ($.lang.langdata[lang][str_name] == undefined || $.lang.langdata[lang][str_name] == null) {
        $.logError("./util/lang.js", 33, channel, "Lang string missing: " + str_name);
        Packages.com.gmt2001.Console.err.println("[lang.js] Lang string missing: [" + lang + "] " + str_name);

        if (str_name.equalsIgnoreCase("net.phantombot.lang.not-exists")) {
            return "!!! Missing string in lang file !!!";
        } else {
            return $.lang.get("net.phantombot.lang.not-exists", channel);
        }
    }

    var s = $.lang.langdata[lang][str_name];
    var i;
    for (i = 1; i < arguments.length; i++) {
        s = $.replaceAll(s, "$" + i, arguments[i]);
    }

    return s;
}

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var args = event.getArgs();
    var argsString = event.getArguments().trim();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("lang")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            var lang = "english";

            if ($.inidb.HasKey("settings", channel.getName(), "lang")) {
                lang = $.inidb.GetString("settings", channel.getName(), "lang");
            }

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.lang.curlang", channel, lang), channel);
        } else {
            if (!$.fileExists("./scripts/lang/lang-" + args[0].toLowerCase() + ".js")) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.lang.lang-not-exists", channel), channel);
                return;
            } else {
                $.inidb.SetString("settings", channel.getName(), "lang", args[0].toLowerCase());
                $.lang.load(channel);

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.lang.lang-changed", channel, args[0].toLowerCase()), channel);
            }
        }
    }
});
