$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();

    if (!$.inidb.HasKey("settings", channel.getName(), "play_limit")) {
        $.inidb.SetInteger("settings", channel.getName(), "play_limit", 5);
    }
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("letmeplay")) {
        if (args.length > 0) {
            if ($.tempdb.GetInteger("t_playrequestcount", channel.getName(), sender) >= $.inidb.GetInteger("settings", channel.getName(), "play_limit")) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.request-limit-hit", channel, $.inidb.GetInteger("settings", channel.getName(), "play_limit")), channel);
                return;
            }

            $.tempdb.SetInteger("t_playrequestcount", channel.getName(), sender, $.tempdb.GetInteger("t_playrequestcount", channel.getName(), sender) + 1);
            $.tempdb.SetString("t_gamertags", channel.getName(), sender, args[0]);
            $.tempdb.SetString("t_state", channel.getName(), "queue_waitinglist", $.tempdb.GetString("t_state", channel.getName(), "queue_waitinglist") + ":" + sender);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.added-to-waiting-list", channel), channel);
            return;
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.error-adding-to-waiting-list", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("currentplayer")) {
        if ($.strlen($.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer")) == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.no-current-players", channel), channel);
            return;
        }
        
        $.say($.lang.get("net.phantombot.queueSystem.current-player", channel, $.username.resolve($.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer")), $.tempdb.GetString("t_gamertags", channel.getName(), $.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer"))), channel);
        return;
    }

    if (command.equalsIgnoreCase("waitinglist")) {
        if (args.length > 0) {
            if (!$.isAdmin(sender, channel) || !$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            if (args[0].equalsIgnoreCase("limit")) {
                if (args.length > 1 && !isNaN(args[1])) {
                    $.inidb.SetInteger("settings", channel.getName(), "play_limit", args[1]);
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.request-limit-set", channel, args[1]), channel);
                    return;
                } else {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.request-limit-error-usage", channel), channel);
                    return;
                }
            }
        }

        var list = $.tempdb.GetString("t_state", channel.getName(), "queue_waitinglist");

        if (list.startsWith(":")) {
            list = list.substring(1);
        }

        if ($.strlen(list) == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.no-player-in-q", channel), channel);
            return;
        }

        list = list.replaceAll(":", ", ");

        $.say($.lang.get("net.phantombot.queueSystem.current-players", channel, list), channel);
        return;
    }

    if (command.equalsIgnoreCase("nextround")) {
        if (!$.isMod(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }

        if ($.strlen($.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer")) > 0) {
            $.tempdb.SetInteger("t_playrequestcount", channel.getName(), $.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer"), $.tempdb.GetInteger("t_playrequestcount", channel.getName(), $.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer")) - 1);
        }

        var list = $.tempdb.GetString("t_state", channel.getName(), "queue_waitinglist");

        if (list.startsWith(":")) {
            list = list.substring(1);
        }

        if ($.strlen(list) > 0) {
            list = list.split(":");

            $.tempdb.SetString("t_state", channel.getName(), "queue_currentPlayer", list.shift());
            $.tempdb.SetString("t_state", channel.getName(), "queue_waitinglist", list.join(":"));

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.senders-turn-to-player", channel, $.username.resolve($.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer"))), $.tempdb.GetString("t_gamertags", channel.getName(), $.tempdb.GetString("t_state", channel.getName(), "queue_currentPlayer")), channel);
            return;
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.queueSystem.no-players-waiting", channel), channel);
            return;
        }
    }
});

$.registerChatCommand("./systems/queueSystem.js", "letmeplay");
$.registerChatCommand("./systems/queueSystem.js", "currentplayer");
$.registerChatCommand("./systems/queueSystem.js", "waitinglist");
$.registerChatCommand("./systems/queueSystem.js", "nextround", "mod");
