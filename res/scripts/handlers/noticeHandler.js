$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();

    if (!$.inidb.HasKey('notice', channel.getName(), 'interval')) {
        $.inidb.SetInteger('notice', channel.getName(), 'interval', 10);
    }

    if (!$.inidb.HasKey('notice', channel.getName(), 'reqmessages')) {
        $.inidb.SetInteger('notice', channel.getName(), 'reqmessages', 25);
    }

    if (!$.inidb.HasKey('notice', channel.getName(), 'notices_toggle')) {
        $.inidb.SetBoolean('notice', channel.getName(), 'notices_toggle', true);
    }
});

$.on('ircChannelMessage', function (event) {
    var channel = event.getChannel();

    $.tempdb.SetInteger("t_state", channel.getName(), "messageCount", $.tempdb.GetInteger("t_state", channel.getName(), "messageCount") + 1);
});

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("notice")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-usage", channel), channel);
            return;
        }

        var action = args[0];
        var message;
        var num_messages = $.inidb.GetInteger("notice", channel.getName(), "num_messages");

        if (args.length >= 2) {
            message = argsString.substring(argsString.indexOf(action) + $.strlen(action.length) + 1)
        }

        if (action.equalsIgnoreCase("get")) {
            if (args.length < 2) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-get-usage", channel, num_messages, (num_messages - 1)), channel);
                return;
            } else if (!$.inidb.HasKey('notices', channel.getName(), 'message_' + message)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-get-error", channel, num_messages, (num_messages - 1), args[1]), channel);
                return;
            } else {
                $.say($.inidb.GetString('notices', channel.getName(), 'message_' + message), channel);
                return;
            }
        } else if (action.equalsIgnoreCase("insert")) {
            var id = args[1];

            if (args.length < 3 || isNaN(id) || parseInt(id) > num_messages) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-insert-usage", channel), channel);
                return;
            } else {
                message = argsString.substring(argsString.indexOf(id) + $.strlen(id) + $.strlen(action) + 2);

                if (id < num_messages) {
                    for (var i = (num_messages - 1); i >= 0; i--) {
                        if (i > parseInt(id)) {
                            $.inidb.SetString('notices', channel.getName(), 'message_' + (i + 1), $.inidb.GetString('notices', channel.getName(), 'message_' + i));
                        }
                    }

                    $.inidb.SetString('notices', channel.getName(), 'message_' + parseInt(id), message);
                } else {
                    $.inidb.SetString('notices', channel.getName(), 'message_' + num_messages, message);
                }

                $.inidb.SetInteger('notice', channel.getName(), 'num_messages', num_messages + 1);

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-added-success", channel, message, num_messages + 1), channel);
                return;
            }
        } else if (action.equalsIgnoreCase("timer") || action.equalsIgnoreCase("interval")) {
            if (args.length < 2 || isNaN(message) || parseInt(message) < 2) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-current-interval", channel, $.inidb.GetInteger('notice', channel.getName(), 'interval')), channel);
                return;
            } else {
                $.inidb.SetInteger('notice', channel.getName(), 'interval', message);

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-interval-set-success", channel, message), channel);
                return;
            }
        } else if (action.equalsIgnoreCase("config")) {
            var notices;

            if ($.inidb.GetBoolean('notice', channel.getName(), 'notices_toggle')) {
                notices = $.lang.get("net.phantombot.noticehandler.notice-enabled", channel);
            } else {
                notices = $.lang.get("net.phantombot.noticehandler.notice-disabled", channel);
            }

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-config", channel, notices, $.inidb.GetInteger('notice', channel.getName(), 'interval'), $.inidb.GetInteger('notice', channel.getName(), 'reqmessages'), num_messages), channel);
            return;
        } else if (action.equalsIgnoreCase("toggle")) {
            if (!$.isAdmin(sender, channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                return;
            }

            if (!$.inidb.GetBoolean('notice', channel.getName(), 'notices_toggle')) {
                $.inidb.SetBoolean('notice', channel.getName(), 'notices_toggle', true);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-toggle-on", channel), channel);
                return;
            } else {
                $.inidb.SetBoolean('notice', channel.getName(), 'notices_toggle', false);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-toggle-off", channel), channel);
                return;
            }
        } else if (action.equalsIgnoreCase("req")) {
            if (args.length < 2 || isNaN(message) || parseInt(message) < 0) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-req-message-usage", channel, $.inidb.GetInteger('notice', channel.getName(), 'reqmessages')), channel);
                return;
            } else {
                $.inidb.SetInteger('notice', channel.getName(), 'reqmessages', message);

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.norice-req-message-set-success", channel, message), channel);
                return;
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-usage", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("addnotice")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-add-usage", channel), channel);
            return;
        }

        $.inidb.SetString('notices', channel.getName(), 'message_' + $.inidb.GetInteger("notice", channel.getName(), "num_messages"), argsString);
        $.inidb.SetInteger('notice', channel.getName(), 'num_messages', $.inidb.GetInteger("notice", channel.getName(), "num_messages") + 1);
        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-added-success", channel, argsString, $.inidb.GetInteger("notice", channel.getName(), "num_messages")), channel);
        return;
    }

    if (command.equalsIgnoreCase("delnotice")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0 || isNaN(args[0])) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-remove-usage", channel), channel);
            return;
        } else if (!$.inidb.HasKey('notices', channel.getName(), 'message_' + args[0])) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-remove-error2", channel), channel);
            return;
        } else if ($.inidb.GetInteger("notice", channel.getName(), "num_messages") == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-remove-error", channel), channel);
            return;
        }

        if ($.inidb.GetInteger("notice", channel.getName(), "num_messages") > 1) {
            for (i = 0; i < $.inidb.GetInteger("notice", channel.getName(), "num_messages"); i++) {
                if (i > parseInt(args[0])) {
                    $.inidb.SetString('notices', channel.getName(), 'message_' + (i - 1), $.inidb.GetString('notices', channel.getName(), 'message_' + i));
                }
            }
        }

        $.inidb.RemoveKey('notices', channel.getName(), 'message_' + args[0]);
        $.inidb.SetInteger('notice', channel.getName(), 'num_messages', $.inidb.GetInteger("notice", channel.getName(), "num_messages") - 1);

        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.noticehandler.notice-remove-success", channel, $.inidb.GetInteger("notice", channel.getName(), "num_messages")), channel);
        return;
    }
});

$.registerChatCommand("./handlers/noticeHandler.js", "notice");
$.registerChatCommand("./handlers/noticeHandler.js", "delnotice");
$.registerChatCommand("./handlers/noticeHandler.js", "addnotice");

$.messageTime = 0;
$.messageIndex = 0;

function sendMessage(channel) {
    if ($.inidb.GetInteger("notice", channel.getName(), "num_messages") == 0) {
        return;
    }

    if (!$.inidb.HasKey('notices', channel.getName(), 'message_' + $.tempdb.GetInteger("t_state", channel.getName(), "messageIndex"))) {
        $.tempdb.SetInteger("t_state", channel.getName(), "messageIndex", 0);
        return;
    }

    var message = $.inidb.GetString('notices', channel.getName(), 'message_' + $.tempdb.GetInteger("t_state", channel.getName(), "messageIndex"));
    var cmds = "";

    if (message.toLowerCase().startsWith("(runcommand:") && message.indexOf(")") > 12) {
        message = message.substring(12);
        cmds = message.substring(0, message.indexOf(")"));
        message = message.substring(message.indexOf(")") + 1);
    }

    $.tempdb.SetInteger("t_state", channel.getName(), "messageIndex", $.tempdb.GetInteger("t_state", channel.getName(), "messageIndex") + 1);

    if ($.tempdb.GetInteger("t_state", channel.getName(), "messageIndex") >= $.inidb.GetInteger("notice", channel.getName(), "num_messages")) {
        $.tempdb.SetInteger("t_state", channel.getName(), "messageIndex", 0);
    }

    if ($.strlen(cmds) > 0) {
        var cmd = cmds;
        var prm = "";

        if (cmd.indexOf(" ") > 0) {
            cmd = cmd.substring(0, cmd.indexOf(" "));
            prm = cmd.substring(cmd.indexOf(" "));
        }

        var EventBus = $.botpkgroot.event.EventBus;
        var CommandEvent = $.botpkgroot.event.command.CommandEvent;

        EventBus.instance().post(new CommandEvent($.botName, cmd, prm, channel));
    }

    if ($.strlen(message) > 0) {
        $.say(message, channel);
        return;
    }
}

$.timer.addTimer("./handlers/noticeHandler.js", "notices", true, function () {
    var channels = $.phantombot.getChannels();

    for (var i = 0; i < channels.size(); i++) {
        var channel = channels.get(i);

        if (!$.moduleEnabled("./handlers/noticeHandler.js", channel) || !$.inidb.GetBoolean('notice', channel.getName(), 'notices_toggle')) {
            return;
        }

        if (($.tempdb.GetInteger("t_state", channel.getName(), "messageTime") + ($.inidb.GetInteger('notice', channel.getName(), 'interval') * 60 * 1000)) < System.currentTimeMillis()) {
            if ($.tempdb.GetInteger("t_state", channel.getName(), "messageCount") >= $.inidb.GetInteger('notice', channel.getName(), 'reqmessages')) {
                sendMessage(channel);
                $.tempdb.SetInteger("t_state", channel.getName(), "messageCount", 0);

                $.tempdb.SetInteger("t_state", channel.getName(), "messageTime", System.currentTimeMillis());
            }
        }
    }
}, 10 * 1000);
