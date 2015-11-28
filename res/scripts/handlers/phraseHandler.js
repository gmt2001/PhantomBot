$.on('ircChannelMessage', function (event) {
    var message = event.getMessage().toLowerCase().trim();
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var channel = event.getChannel();

    message = message.replace(/[^a-zA-Z0-9\s]+/g, '');

    if ($.inidb.HasKey('phrases', channel.getName(), message)) {
        var s = $.inidb.GetString('phrases', channel.getName(), message);

        s = $.replaceAll(s, "(sender)", username);

        $.say(s, channel);
    }
});

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("addphrase")) {
        if (!$.isMod(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }

        if (args.length < 2) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.phrasehandler.trigger-error-add-usage", channel), channel);
            return;
        }

        argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
        args[0] = args[0].toLowerCase().replace(/[^a-zA-Z0-9\s]+/g, '');

        $.inidb.SetString('phrases', channel.getName(), args[0], argsString);

        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.phrasehandler.trigger-add-success", channel, args[0], argsString), channel);
        return;
    }

    if (command.equalsIgnoreCase("delphrase")) {
        if (!$.isMod(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.phrasehandler.trigger-remove-usage", channel), channel);
            return;
        }

        args[0] = args[0].toLowerCase().replace(/[^a-zA-Z0-9\s]+/g, '');

        $.inidb.RemoveKey('phrases', channel.getName(), args[0]);
        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.phrasehandler.trigger-remove-success", channel, args[0]), channel);
        return;
    }
});

$.registerChatCommand("./handlers/phraseHandler.js", "addphrase", "mod");
$.registerChatCommand("./handlers/phraseHandler.js", "delphrase", "mod");
