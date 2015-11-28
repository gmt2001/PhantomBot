$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();

    if (!$.inidb.Exists("settings", channel.getName(), "timePromoteHours")) {
        $.inidb.SetInteger("settings", channel.getName(), "timePromoteHours", 36);
    }

    if (!$.inidb.Exists("timezone", channel.getName(), "timezone")) {
        $.inidb.SetString("timezone", channel.getName(), "timezone", "America/New_York");
    }

    if (!$.inidb.Exists("timezone", channel.getName(), "timeOffline")) {
        $.inidb.SetBoolean("timezone", channel.getName(), "timeOffline", true);
    }

    if ($.tempdb.GetBoolean('t_state', channel.getName(), 'firstrun')) {
        $.say("", channel);
        $.say("The current time zone for is '" + $.inidb.GetString("timezone", channel.getName(), "timezone") + "'.", channel);
        $.say("To change it use '!timezone (timezone)'.", channel);
        $.say("A list of time zones can be found here: ", channel);
        $.say("http://en.wikipedia.org/wiki/List_of_tz_database_time_zones.", channel);
        $.say("", channel);
    }

    $.tempdb.SetInteger("t_state", channel.getName(), "bot_up", System.currentTimeMillis());
});

$.getUserTime = function (user, channel) {
    return $.inidb.GetInteger('time', channel.getName(), user.toLowerCase());
}

$.getTimeString = function (time, channel) {
    var minutes = parseInt((time / 60) % 60);
    var hours = parseInt((time / 3600) % 24);
    var days = parseInt((time / 86400) % 7);
    var weeks = parseInt(time / 604800);

    var timeString = "";

    var p = $.lang.get("net.phantombot.common.time-prefixes", channel);
    var s = $.lang.get("net.phantombot.common.time-suffixes", channel);

    if (p.length != 4) {
        $.logError("./systems/timeSystem.js", 54, channel, "The time prefixes did not contain all numbers. String: net.phantombot.common.time-prefixes");
        println("[timeSystem.js] The time prefixes did not contain all numbers. String: net.phantombot.common.time-prefixes");
        return minutes;
    } else if (s.length != 4) {
        $.logError("./systems/timeSystem.js", 55, channel, "The time suffixes did not contain all numbers. String: net.phantombot.common.time-suffixes");
        println("[timeSystem.js] The time suffixes did not contain all numbers. String: net.phantombot.common.time-suffixes");
        return minutes;
    }

    if (time > 0) {
        if (weeks > 0) {
            timeString += p[0] + weeks.toString() + s[0] + " ";
        }
        if (days > 0) {
            timeString += p[1] + days.toString() + s[1] + " ";
        }
        if (hours > 0) {
            timeString += p[2] + hours.toString() + s[2] + " ";
        }
        if (minutes > 0) {
            timeString += p[3] + minutes.toString() + s[3] + " ";
        }
        if (weeks == 0 && days == 0 && hours == 0 && minutes == 0) {
            timeString += p[3] + "0" + s[3] + " ";
        }
    } else {
        timeString += p[3] + "0" + s[3] + " ";
    }

    timeString = timeString.trim();

    return timeString;
}

$.validateTimezone = function (timezone) {
    var validIDs = java.util.TimeZone.getAvailableIDs();

    for (i in validIDs) {
        if (validIDs[i] != null && validIDs[i].toLowerCase() == timezone.toLowerCase()) {
            return true;
        }
    }

    return false;
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("time")) {
        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("give") || action.equalsIgnoreCase("send") || action.equalsIgnoreCase("add")) {
                if ($.inidb.GetBoolean("settings", channel.getName(), "permToggleTime")) {
                    if (!$.isMod(sender, event.getTags(), channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender, channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                        return;
                    }
                }

                if (args.length < 3 || isNaN(args[2])) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.give-usage", channel), channel);
                    return;
                }

                if (!$.inidb.GetBoolean("visited", channel.getName(), args[1].toLowerCase())) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.user-404", channel, args[1]), channel);
                    return;
                }

                if (parseInt(args[2]) < 0) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.give-error-negative", channel), channel);
                    return;
                } else {
                    $.inidb.SetInteger('time', channel.getName(), args[1].toLowerCase(), $.inidb.GetInteger('time', channel.getName(), args[1].toLowerCase()) + args[2]);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.give-success", channel, $.getTimeString(args[2], channel), $.username.resolve(args[1]), $.getTimeString($.inidb.GetInteger('time', channel.getName(), args[1].toLowerCase()), channel)), channel);
                    return;
                }
            } else if (action.equalsIgnoreCase("take") || action.equalsIgnoreCase("withdraw")) {
                if ($.inidb.GetBoolean("settings", channel.getName(), "permToggleTime")) {
                    if (!$.isMod(sender, event.getTags(), channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender, channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                        return;
                    }
                }

                if (args.length < 3 || isNaN(args[2])) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.take-usage", channel), channel);
                    return;
                }

                if (!$.inidb.GetBoolean("visited", channel.getName(), args[1].toLowerCase())) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.user-404", channel, args[1]), channel);
                    return;
                }

                if (parseInt(args[2]) > $.inidb.GetInteger('time', channel.getName(), args[1].toLowerCase())) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.take-error-toomuch", channel, $.username.resolve(args[1])), channel);
                    return;
                } else {
                    $.inidb.SetInteger('time', channel.getName(), args[1].toLowerCase(), $.inidb.GetInteger('time', channel.getName(), args[1].toLowerCase()) - args[2]);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.take-success", channel, $.getTimeString(args[2], channel), $.username.resolve(args[1]), $.getTimeString($.inidb.GetInteger('time', channel.getName(), args[1].toLowerCase()), channel)), channel);
                    return;
                }
            } else if (action.equalsIgnoreCase("set")) {
                if ($.inidb.GetBoolean("settings", channel.getName(), "permToggleTime")) {
                    if (!$.isMod(sender, event.getTags(), channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender, channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                        return;
                    }
                }

                if (args.length < 3 || isNaN(args[2])) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.set-usage", channel), channel);
                    return;
                }

                if (!$.inidb.GetBoolean("visited", channel.getName(), args[1].toLowerCase())) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.user-404", channel, args[1]), channel);
                    return;
                }

                if (parseInt(args[2]) < 0) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.set-error-negative", channel), channel);
                    return;
                } else {
                    $.inidb.SetInteger('time', channel.getName(), args[1].toLowerCase(), args[2]);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.set-success", channel, $.username.resolve(args[1]), $.getTimeString($.inidb.GetInteger('time', channel.getName(), args[1].toLowerCase()), channel)), channel);
                    return;
                }
            } else if (action.equalsIgnoreCase("reset")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                $.inidb.RemoveSection("time", channel.getName());

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.reset-success", channel, $.getTimeString(0, channel)), channel);
            } else if (action.equalsIgnoreCase("promotehours")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                if (args.length == 0 || isNaN(args[1])) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.promotehours-usage", channel), channel);
                    return;
                }

                if (parseInt(args[1]) < 0) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.promotehours-error-negative", channel, $.getGroupNameById(6)), channel);
                    return;
                } else {
                    $.inidb.SetInteger('settings', channel.getName(), 'timePromoteHours', args[1]);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.promotehours-success", channel, $.getGroupNameById(6), args[1]), channel);
                    return;
                }
            } else if (action.equalsIgnoreCase("autolevel")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                if ($.inidb.GetBoolean('settings', channel.getName(), 'timeLevel')) {
                    $.inidb.SetBoolean('settings', channel.getName(), 'timeLevel', true);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.autolevel-enabled", channel, $.getGroupNameById(6), $.inidb.GetInteger('settings', channel.getName(), 'timePromoteHours')), channel);
                    return;
                } else {
                    $.inidb.SetBoolean('settings', channel.getName(), 'timeLevel', false);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.autolevel-disabled", channel, $.getGroupNameById(6), $.inidb.GetInteger('settings', channel.getName(), 'timePromoteHours')), channel);
                    return;
                }
            } else if (action.equalsIgnoreCase("offline") || action.equalsIgnoreCase("offlinetime")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                if (!$.inidb.GetBoolean('settings', channel.getName(), 'timeOffline')) {
                    $.inidb.SetBoolean('settings', channel.getName(), 'timeOffline', true);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.offlinetime-enabled", true), true);
                    return;
                } else {
                    $.inidb.SetBoolean('settings', channel.getName(), 'timeOffline', false);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.offlinetime-disabled", true), true);
                    return;
                }
            } else if (action.equalsIgnoreCase("toggle")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                if (!$.inidb.GetBoolean("settings", channel.getName(), "permToggleTime")) {
                    $.inidb.SetBoolean("settings", channel.getName(), "permToggleTime", true);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.toggle-success", true, "Moderator"), true);
                } else {
                    $.inidb.SetBoolean("settings", channel.getName(), "permToggleTime", false);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.toggle-success", true, "Administrator"), true);
                }
            } else if (action.equalsIgnoreCase("help")) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.help", true), true);
                return;
            } else {
                if (args.length > 0 && $.inidb.GetBoolean("visited", channel.getName(), args[0].toLowerCase())) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.get-other", channel, $.username.resolve(args[0].toLowerCase()), $.getTimeString($.getUserTime(args[0].toLowerCase(), channel), channel)), channel);
                    return;
                } else {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.user-404", channel, args[0]), channel);
                    return;
                }
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timesystem.get-self", channel, $.getTimeString($.getUserTime(sender, channel), channel)), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("timezone")) {
        if (args.length >= 1) {
            if (args[0].equalsIgnoreCase("help") || args[0].equalsIgnoreCase("usage")) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timezone.usage", channel), channel);
                return;
            } else {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                if ($.validateTimezone(args[0])) {
                    $.inidb.SetString("timezone", channel.getName(), "timezone", args[0]);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timezone.success", channel, args[0]), channel);
                    return;
                } else {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timezone.error-invalid", channel, args[0]), channel);
                    return;
                }
                return;
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.timezone.get", channel, $.inidb.GetString("timezone", channel.getName(), "timezone")), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("streamertime")) {
        var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));
        var now = cal.getTime();
        var datefmt = new java.text.SimpleDateFormat("EEEE MMMM d, yyyy @ h:mm a z");
        datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));
        var timestamp = datefmt.format(now);

        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.streamertime", channel, timestamp, $.username.resolve($.channelName)), channel);
    }

    if (command.equalsIgnoreCase("botuptime")) {
        $.say($.lang.get("net.phantombot.botuptime.success", channel, $.username.resolve($.botName), $.getTimeString(parseInt(System.currentTimeMillis() - $.tempdb.GetInteger("t_state", channel.getName(), "bot_up") / 1000), channel)), channel);
        return;
    }

    if (command.equalsIgnoreCase("uptime")) {
        if ($.isOnline(channel.getName().replaceFirst("#", ""))) {
            $.say($.lang.get("net.phantombot.uptime.success-online", channel, $.username.resolve(channel.getName().replaceFirst("#", "")), $.getUptime(channel.getName().replaceFirst("#", ""))));
            return;
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.uptime.success-offline", channel, $.username.resolve(channel.getName().replaceFirst("#", ""))));
            return;
        }
    }
});

$.timer.addTimer("./systems/timeSystem.js", "timesystem", true, function () {
    var channels = $.phantombot.getChannels();

    for (var i = 0; i < channels.size(); i++) {
        var channel = channels.get(i);

        if (!$.moduleEnabled("./systems/timeSystem.js", channel)) {
            return;
        }

        var keys = $.tempdb.GetKeyList("t_users", channel.getName());
        
        for (var b = 0; b < keys.length; b++) {
            var nick = keys[b];

            if ($.isOnline(channel.getName().replaceFirst("#", "")) || $.inidb.GetBoolean('settings', channel.getName(), 'timeOffline')) {
                $.inidb.SetInteger('time', channel.getName(), nick, $.inidb.GetInteger('time', channel.getName(), nick) + 60);
            }

            if ($.inidb.GetBoolean('settings', channel.getName(), 'timeLevel')) {
                if (!$.isMod(nick, null, channel)) {
                    if ($.getUserGroupId(nick, channel) > 6 && $.inidb.GetBoolean('followed', channel.getName(), nick)) {
                        if ($.inidb.GetInteger('time', channel.getName(), nick) >= ($.inidb.GetInteger('settings', channel.getName(), 'timePromoteHours') * 60 * 60)) {
                            var levelup = $.getUserGroupId(nick, channel) - 1;

                            $.setUserGroupById(nick, channel, levelup);
                            $.say($.getWhisperString(nick, channel) + $.lang.get("net.phantombot.timesystem.autolevel-promote", channel, $.username.resolve(nick), $.getGroupNameById(levelup, channel), $.inidb.GetInteger('settings', channel.getName(), 'timePromoteHours')), channel);
                        }
                    }
                }
            }
        }
    }
}, 60 * 1000);

$.registerChatCommand("./systems/timeSystem.js", "time");
$.registerChatCommand("./systems/timeSystem.js", "time help");
$.registerChatCommand("./systems/timeSystem.js", "timezone");
$.registerChatCommand("./systems/timeSystem.js", "streamertime");
$.registerChatCommand("./systems/timeSystem.js", "uptime");
$.registerChatCommand("./systems/timeSystem.js", "botuptime");
