$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();
    var keys = $.inidb.GetKeyList("subscribed", channel.getName());

    for (var i = 0; i < keys.length; i++) {
        if ($.inidb.GetBoolean("subscribed", channel.getName(), keys[i])) {
            $.botpkgroot.cache.SubscribersCache.instance(channel.getName()).addSubscriber(keys[i]);
        }
    }

    if (!$.inidb.HasKey("settings", channel.getName(), "subscribemessage")) {
        if ($.moduleEnabled("./systems/pointSystem.js", channel) && (!$.inidb.HasKey('settings', channel.getName(), 'subscribereward')
                || $.inidb.GetInteger('settings', channel.getName(), 'subscribereward') > 0)) {
            $.inidb.SetString("settings", channel.getName(), "subscribemessage", $.lang.get("net.phantombot.followHandler.default-sub-message-with-points", channel));
        } else {
            $.inidb.SetString("settings", channel.getName(), "subscribemessage", $.lang.get("net.phantombot.followHandler.default-sub-message", channel));
        }
    }

    if (!$.inidb.HasKey('settings', channel.getName(), 'subscribereward')) {
        $.inidb.SetInteger('settings', channel.getName(), 'subscribereward', 100);
    }
});

$.on('twitchSubscribe', function (event) {
    var subscriber = event.getSubscriber().toLowerCase();
    var username = $.username.resolve(subscriber);
    var channel = event.getChannel();

    if ($.tempdb.GetBoolean('t_state', channel.getName(), 'announceSubscribes') || !$.inidb.GetBoolean('settings', channel.getName(), 'subscribemode')) {
        var s = $.inidb.GetString("settings", channel.getName(), "subscribemessage");

        s = $.replaceAll(s, '(name)', username);

        if ($.moduleEnabled("./systems/pointSystem.js", channel)) {
            var p = $.inidb.GetInteger('settings', channel.getName(), 'subscribereward');
            s = $.replaceAll(s, '(pointname)', $.getPointsString(p, channel));
            s = $.replaceAll(s, '(reward)', p);
            $.inidb.SetInteger("points", channel.getName(), subscriber, $.inidb.GetInteger("points", channel.getName(), subscriber) + p);
        }

        if (!$.inidb.GetBoolean('settings', channel.getName(), 'sub_silentmode')) {
            $.say(s, channel);
        }
    }

    $.inidb.SetBoolean('subscribed', channel.getName(), subscriber, true);
});

$.on('twitchUnsubscribe', function (event) {
    var subscriber = event.getSubscriber().toLowerCase();
    var channel = event.getChannel();

    $.inidb.SetBoolean('subscribed', channel.getName(), subscriber, false);
});

$.on('twitchSubscribesInitialized', function (event) {
    var channel = event.getChannel();
    println(">> [" + channel.getName() + "] Enabling new subscriber announcements");

    $.tempdb.SetBoolean('t_state', channel.getName(), 'announceSubscribes', true);
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("subsilentmode")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if ($.inidb.GetBoolean('settings', channel.getName(), 'sub_silentmode')) {
            $.inidb.SetBoolean('settings', channel.getName(), 'sub_silentmode', false);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.sub-silent-mode-off", channel), channel);
            return;
        } else {
            $.inidb.SetBoolean('settings', channel.getName(), 'sub_silentmode', true);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.sub-silent-mode-on", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("subscribereward")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.new-sub-current-reward", channel, $.getPointsString($.inidb.GetInteger('settings', channel.getName(), 'subscribereward'), channel)), channel);
            return;
        } else {
            if (isNaN(args[0]) || parseInt(args[0]) < 0) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.sub-reward-error", channel), channel);
                return;
            }

            $.logEvent("subscribeHandler.js", 133, channel, username + " changed the new subscriber points reward to: " + args[0]);

            $.inidb.SetInteger('settings', channel.getName(), 'subscribereward', args[0]);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.new-sub-reward-set", channel, $.getPointsString(args[0], channel)), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("subscribecount")) {
        var keys = $.inidb.GetKeyList("subscribed", channel.getName());
        var count = 0;

        for (i = 0; i < keys.length; i++) {
            if ($.inidb.GetBoolean("subscribed", channel.getName(), keys[i])) {
                count++;
            }
        }

        $.say($.lang.get("net.phantombot.subscribeHandler.current-subs", channel, count), channel);
        return;
    }

    if (command.equalsIgnoreCase("subscribemessage")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if ($.strlen(argsString) == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.current.sub-message", channel, $.inidb.GetString("settings", channel.getName(), "subscribemessage")), channel);

            var s = $.lang.get("net.phantombot.subscribeHandler.sub-message-usage", channel);

            if ($.moduleEnabled("./systems/pointSystem.js", channel)) {
                s += $.lang.get("net.phantombot.subscribeHandler.sub-message-points-usage", channel);
            }

            $.say($.getWhisperString(sender, channel) + s, channel);
            return;
        } else {
            $.logEvent("subscribeHandler.js", 107, channel, username + " changed the new subscriber message to: " + argsString);

            $.inidb.SetString('settings', channel.getName(), 'subscribemessage', argsString);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.new-sub-message-set", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("subscribemode")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            var submode = "twitchnotify";

            if ($.inidb.GetBoolean('settings', channel.getName(), 'subscribemode')) {
                submode = "auto";
            }

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.current-sub-mode", channel, submode), channel);
            return;
        }

        if (args[0].equalsIgnoreCase("twitchnotify")) {
            $.logEvent("subscribeHandler.js", 167, channel, username + " changed the new subscriber detection method to twitchnotify");

            $.inidb.SetBoolean('settings', channel.getName(), 'subscribemode', false);
            $.botpkgroot.cache.SubscribersCache.instance(channel.getName()).doRun(false);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.changed-sub-mode-twitchnotify", channel), channel);
            return;
        } else {
            $.logEvent("subscribeHandler.js", 175, channel, username + " changed the new subscriber detection method to auto");

            $.inidb.SetBoolean('settings', channel.getName(), 'subscribemode', true);
            $.botpkgroot.cache.SubscribersCache.instance(channel.getName()).doRun(true);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.subscribeHandler.changed-sub-mode-auto", channel), channel);
            return;
        }
    }
});

$.on('ircPrivateMessage', function (event) {
    if (event.getSender().equalsIgnoreCase("twitchnotify") && event.getChannel() != null) {
        var message = event.getMessage().toLowerCase();
        var channel = event.getChannel();

        if (message.contains("just subscribed") || message.contains("subscribed for")) {
            var spl = message.split(" ");
            var EventBus = $.botpkgroot.event.EventBus;
            var TwitchSubscribeEvent = $.botpkgroot.event.twitch.subscriber.TwitchSubscribeEvent;

            EventBus.instance().post(new TwitchSubscribeEvent(spl[0], channel));
        }
    }
});

$.registerChatCommand("./handlers/subscribeHandler.js", "subscribemessage", "admin");
$.registerChatCommand("./handlers/subscribeHandler.js", "subsilentmode", "admin");
$.registerChatCommand("./handlers/subscribeHandler.js", "subscribereward", "admin");
$.registerChatCommand("./handlers/subscribeHandler.js", "subscribecount");
$.registerChatCommand("./handlers/subscribeHandler.js", "subscribemode", "admin");

$.timer.addTimer("./handlers/subscribeHandler.js", "subscribehandler", true, function () {
    var channels = $.phantombot.getChannels();

    for (var i = 0; i < channels.size(); i++) {
        var channel = channels.get(i);
        
        if (!$.moduleEnabled("./handlers/subscribeHandler.js", channel) || !$.inidb.GetBoolean('settings', channel.getName(), 'subscribemode')) {
            $.botpkgroot.cache.SubscribersCache.instance(channel.getName()).doRun(false);
        } else {
            $.botpkgroot.cache.SubscribersCache.instance(channel.getName()).doRun(true);
        }
    }
}, 60 * 1000);
