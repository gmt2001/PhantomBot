$.on('ircJoinComplete', function (event) {
    if (!$.inidb.HasKey('settings', event.getChannel().getName(), 'checker_storepath')) {
        $.inidb.SetString('settings', event.getChannel().getName(), 'checker_storepath', "addons/donationchecker/latestdonation.txt");
    }

    if (!$.inidb.HasKey('settings', event.getChannel().getName(), 'donation_toggle')) {
        $.inidb.SetBoolean('settings', event.getChannel().getName(), 'checker_storepath', true);
    }
});

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("donationalert")) {
        if (!$.isAdmin(sender, channel)) { // added this check so people can't spam the usage.
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) { // added usage
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.donationhandler.donationalert-usage", channel), channel);
            return;
        }

        var action = args[0];

        if (action.equalsIgnoreCase("filepath")) {
            if (!$.isAdmin(sender, channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                return;
            }

            if (args[1].equalsIgnoreCase('viewfilepath')) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.donationhandler.current-file-path", channel, $.inidb.GetString('settings', channel.getName(), 'checker_storepath')), channel);
                return;
            }

            while (args[1].indexOf('\\') != -1 && !args[1].equalsIgnoreCase('viewfilepath') && $.strlen(args[1]) > 0) {
                args[1] = args[1].replace('\\', '/');
            }

            $.inidb.SetString('settings', channel.getName(), 'checker_storepath', args[1]);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.donationhandler.new-file-path-set", channel), channel);
            return;
        }

        if (action.equalsIgnoreCase("toggle")) {
            if ($.inidb.GetBoolean('settings', channel.getName(), 'donation_toggle')) {
                $.inidb.SetBoolean('settings', channel.getName(), 'donation_toggle', false);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.donationhandler.donation-toggle-off", channel), channel);
                return;
            } else {
                $.inidb.SetBoolean('settings', channel.getName(), 'donation_toggle', true);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.donationhandler.donation-toggle-on", channel), channel);
                return;
            }
        }
    }
});

$.timer.addTimer("./handlers/donationHandler.js", "currdonation", true, function () {
    var channels = $.phantombot.getChannels();

    for (var i = 0; i < channels.size(); i++) {
        var channel = channels.get(i);

        if ($.moduleEnabled("./handlers/donationHandler.js", channel) && $.inidb.GetBoolean('settings', channel.getName(), 'donation_toggle')) {
            var currDonation = $.readFile($.inidb.GetString('settings', channel.getName(), 'checker_storepath'));
            if (currDonation != null && $.strlen(currDonation) > 0 && !currDonation.equalsIgnoreCase($.inidb.GetString("settings", channel.getName(), "lastdonation"))) {
                $.inidb.SetString("settings", channel.getName(), "lastdonation", currDonation);
                $.say($.lang.get("net.phantombot.donationhandler.new-donation", channel, $.username.resolve(channel.getName().replaceFirst("#", "")), currDonation), channel);
            }
        }
    }
}, 10 * 1000);

$.registerChatCommand("./handlers/donationHandler.js", "donationalert", "mod");
