$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();
    
    if (!$.inidb.HasKey('settings', channel.getName(), 'hosttimeout')) {
        $.inidb.SetInteger('settings', channel.getName(), 'hosttimeout', 60);
    }

    if (!$.inidb.HasKey('settings', channel.getName(), 'hostmessage')) {
        if ($.moduleEnabled("./systems/pointSystem.js", channel) && $.inidb.GetInteger('settings', channel.getName(), 'hostreward') > 0) {
            $.inidb.SetString('settings', channel.getName(), 'hostmessage', $.lang.get("net.phantombot.hosthandler.default-host-welcome-message-and-reward", channel, $.getPointsString($.inidb.GetInteger('settings', channel.getName(), 'hostreward'), channel)));
        } else {
            $.inidb.SetString('settings', channel.getName(), 'hostmessage', $.lang.get("net.phantombot.hosthandler.default-host-welcome-message", channel));
        }
    }
});

$.isHostUser = function (user, channel) {
    return $.tempdb.GetBoolean("t_hostlist", channel.getName(), user.toLowerCase());
}

$.on('twitchHosted', function (event) {
    var hoster = event.getHoster().toLowerCase();
    var username = $.username.resolve(hoster);
    var channel = event.getChannel();

    if ($.tempdb.GetBoolean("t_state", channel.getName(), "announceHosts") && $.moduleEnabled("./handlers/hostHandler.js", channel)
            && ($.tempdb.GetInteger("t_hostlist", channel.getName(), hoster) < System.currentTimeMillis())) {
        var s = $.inidb.GetString('settings', channel.getName(), 'hostmessage');
        
        if ($.moduleEnabled("./systems/pointSystem.js", channel) && $.inidb.GetInteger('settings', channel.getName(), 'hostreward') > 0) {
            $.inidb.SetInteger("points", channel.getName(), hoster, $.inidb.GetInteger("points", channel.getName(), hoster) + $.inidb.GetInteger('settings', channel.getName(), 'hostreward'));
        }

        s = $.replaceAll(s, '(name)', username);
        
        $.say(s, channel);
    }

    $.tempdb.SetBoolean("t_hostlist", channel.getName(), hoster, true);
    $.tempdb.SetInteger("t_hosttimeout", channel.getName(), hoster, System.currentTimeMillis() + ($.inidb.GetInteger('settings', channel.getName(), 'hosttimeout') * 60 * 1000));
});

$.on('twitchUnhosted', function (event) {
    var hoster = event.getHoster().toLowerCase();
    var channel = event.getChannel();
    
    $.tempdb.RemoveKey("t_hostlist", channel.getName(), hoster);
    $.tempdb.SetInteger("t_hosttimeout", channel.getName(), hoster, System.currentTimeMillis() + ($.inidb.GetInteger('settings', channel.getName(), 'hosttimeout') * 60 * 1000));
});

$.on('twitchHostsInitialized', function (event) {
    var channel = event.getChannel();
    println(">> [" + channel.getName() + "] Enabling new hoster announcements");

    $.tempdb.SetBoolean("t_state", channel.getName(), "announceHosts", true);
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("hostreward")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-reward-current-and-usage", channel, $.getPointsString($.inidb.GetInteger('settings', channel.getName(), 'hostreward'), channel)), channel);
                return;
        } else {
            if (parseInt(args[0]) < 0) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-reward-error", channel), channel);
                return;
            }

            $.logEvent("hostHandler.js", 134, channel, username + " changed the host points reward to: " + args[0]);

            $.inidb.SetInteger('settings', channel.getName(), 'hostreward', args[0]);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-reward-set-success", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("hostmessage")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if ($.strlen(argsString) == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.current-host-message", channel, $.inidb.GetString('settings', channel.getName(), 'hostmessage')), channel);

            var s = $.lang.get("net.phantombot.hosthandler.host-message-usage", channel);

            $.say($.getWhisperString(sender, channel) + s, channel);
            return;
        } else {
            $.logEvent("hostHandler.js", 73, channel, username + " changed the new hoster message to: " + argsString);

            $.inidb.SetString('settings', channel.getName(), 'hostmessage', argsString);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-message-set-success", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("hostcount")) {
        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-count", channel, $.tempdb.GetKeyList("t_hostlist", channel.getName()).length), channel);
        return;
    }

    if (command.equalsIgnoreCase("hosttime")) {
        if (args.length < 1) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-timeout-time", channel, $.inidb.GetInteger('settings', channel.getName(), 'hosttimeout')), channel);
            return;
        } else if (args.length >= 1) {
            if (!$.isAdmin(sender, channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                return;
            }
            if (parseInt(args[0]) < 30) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-timeout-time-error", channel), channel);
                return;
            } else {
                $.inidb.SetInteger('settings', channel.getName(), 'hosttimeout', parseInt(args[0]));
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-timeout-time-set", channel, parseInt(args[0])), channel);
                return;
            }
        }
    }

    if (command.equalsIgnoreCase("hostlist")) {
        var m = "";
        var keys = $.tempdb.GetKeyList("t_hostlist", channel.getName());
        
        for (var b = 0; b < Math.ceil(keys.length / 30); b++) {
            m = "";

            for (var i = (b * 30); i < Math.min(keys.length, ((b + 1) * 30)); i++) {
                if ($.strlen(m) > 0) {
                    m += ", ";
                }

                m += keys[i];
            }

            if (b == 0) {
                $.say($.lang.get("net.phantombot.hosthandler.host-list", channel, keys.length, m), channel);
                return;
            } else {
                $.say(">>" + m, channel);
                return;
            }
        }

        if (keys.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.hosthandler.host-list-error", channel), channel);
            return;
        }
    }
});

$.registerChatCommand("./handlers/hostHandler.js", "hostmessage", "admin");
$.registerChatCommand("./handlers/hostHandler.js", "hostreward");
$.registerChatCommand("./handlers/hostHandler.js", "hosttime");
$.registerChatCommand("./handlers/hostHandler.js", "hostcount");
$.registerChatCommand("./handlers/hostHandler.js", "hostlist");
