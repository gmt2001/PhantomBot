$.getOrdinal = function (n, channel) {
    var p = $.lang.get("net.phantombot.common.ordinal-prefixes", channel);
    var s = $.lang.get("net.phantombot.common.ordinal-suffixes", channel);
    var v = n % 100;

    if (p.length == 10 && s.length == 10) {
        return (p[(v - 20) % 10] || p[v] || p[0]) + n + (s[(v - 20) % 10] || s[v] || s[0]);
    } else if (p.length != 10) {
        $.logError("./systems/raidSystem.js", 6, channel, "The ordinal prefixes did not contain all numbers. String: net.phantombot.common.ordinal-prefixes");
        println("[raidSystem.js] The ordinal prefixes did not contain all numbers. String: net.phantombot.common.ordinal-prefixes");
        return n;
    } else if (s.length != 10) {
        $.logError("./systems/raidSystem.js", 7, channel, "The ordinal suffixes did not contain all numbers. String: net.phantombot.common.ordinal-suffixes");
        println("[raidSystem.js] The ordinal suffixes did not contain all numbers. String: net.phantombot.common.ordinal-suffixes");
        return n;
    }
}

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("raid")) {
        if (args.length >= 1) {
            if (!$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            if (args.length == 1) {
                $.say($.lang.get("net.phantombot.raidsystem.raid-success", channel, $.username.resolve(args[0]), ""), channel);
                return;
            }

            if (args.length >= 2) {
                var count = 1;
                argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);

                if (!isNaN(parseInt(args[1]))) {
                    if (parseInt(args[1]) > 10) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.raidsystem.raid-error-toomuch", channel, 10), channel);
                        return;
                    }

                    count = parseInt(args[1]);

                    if (args.length > 2) {
                        argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + $.strlen(args[1]) + 2);
                    } else {
                        argsString = "";
                    }
                }

                for (var i = 0; i < count; i++) {
                    $.say($.lang.get("net.phantombot.raidsystem.raid-success", channel, $.username.resolve(args[0]), argsString), channel);
                }
                return;
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.raidsystem.raid-usage", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("raider")) {
        if (args.length > 0) {
            if (!$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            $.inidb.SetInteger('raiders', channel.getName(), args[0].toLowerCase() + "_count", $.inidb.GetInteger('raiders', channel.getName(), args[0].toLowerCase() + "_count") + 1);

            $.say($.lang.get("net.phantombot.raidsystem.raider-success", channel, $.username.resolve(args[0]), $.getOrdinal($.inidb.GetInteger('raiders', channel.getName(), args[0].toLowerCase() + "_count"), channel), $.username.resolve(args[0])), channel);
            return;
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.raidsystem.raider-usage", channel), channel);
            return;
        }
    }
});

$.registerChatCommand("./systems/raidSystem.js", "raid", "mod");
$.registerChatCommand("./systems/raidSystem.js", "raider", "mod");
