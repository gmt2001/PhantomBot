var maxSpamCount = 10;

$.getOrdinal = function (n) {
    var p = $.lang.get("net.phantombot.common.ordinal-prefixes");
    var s = $.lang.get("net.phantombot.common.ordinal-suffixes");
    var v = n % 100;

    if (p.length == 10 && s.length == 10) {
        return (p[(v - 20) % 10] || p[v] || p[0]) + n + (s[(v - 20) % 10] || s[v] || s[0]);
    } else if (p.length != 10) {
        $.logError("./systems/raidSystem.js", 6, "The ordinal prefixes did not contain all numbers. String: net.phantombot.common.ordinal-prefixes");
        println("[raidSystem.js] The ordinal prefixes did not contain all numbers. String: net.phantombot.common.ordinal-prefixes");
        return n;
    } else if (s.length != 10) {
        $.logError("./systems/raidSystem.js", 7, "The ordinal suffixes did not contain all numbers. String: net.phantombot.common.ordinal-suffixes");
        println("[raidSystem.js] The ordinal suffixes did not contain all numbers. String: net.phantombot.common.ordinal-suffixes");
        return n;
    }
}

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("raid")) {
        if (args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            if (args.length >=2 && !isNaN(parseInt(args[1]))) {
                if(parseInt(args[1]) > maxSpamCount) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.raidsystem.raid-error-toomuch", maxSpamCount));
                    return;
                }

                for(var i = 0; i < parseInt(args[1]); i++) {
                    $.say($.lang.get("net.phantombot.raidsystem.raid-success", args[0].toLowerCase()));
                }

                return;
            } else {
                $.say($.lang.get("net.phantombot.raidsystem.raid-success", args[0].toLowerCase()));
                return;
            }
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.raidsystem.raid-usage"));       
            return;
        }
    }
    
    if (command.equalsIgnoreCase("raider")) {
        if (args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            $.inidb.incr('raiders', args[0].toLowerCase() + "_count", 1);

            $.say($.lang.get("net.phantombot.raidsystem.raider-success", $.username.resolve(args[0]), getOrdinal($.inidb.get('raiders', args[0].toLowerCase()  + "_count")), args[0].toLowerCase()));  
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.raidsystem.raider-usage"));       
            return;
        }
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/raidSystem.js')) {
        $.registerChatCommand("./systems/raidSystem.js", "raid", "mod");
        $.registerChatCommand("./systems/raidSystem.js", "raider", "mod");
    }
},10*1000);
