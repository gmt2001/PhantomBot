$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();
    var keys = $.inidb.GetKeyList("followed", channel.getName());

    for (var i = 0; i < keys.length; i++) {
        if ($.inidb.GetBoolean("followed", channel.getName(), keys[i])) {
            $.botpkgroot.cache.FollowersCache.instance(channel.getName()).addFollower(keys[i]);
        }
    }

    if (!$.inidb.HasKey("settings", channel.getName(), "followmessage")) {
        if ($.moduleEnabled("./systems/pointSystem.js", channel) && (!$.inidb.HasKey('settings', channel.getName(), 'followreward')
                || $.inidb.GetInteger('settings', channel.getName(), 'followreward') > 0)) {
            $.inidb.SetString("settings", channel.getName(), "followmessage", $.lang.get("net.phantombot.followHandler.new-follow-message-and-reward", channel));
        } else {
            $.inidb.SetString("settings", channel.getName(), "followmessage", $.lang.get("net.phantombot.followHandler.new-follow-message-no-reward", channel));
        }
    }

    if (!$.inidb.HasKey('settings', channel.getName(), 'followreward')) {
        $.inidb.SetInteger('settings', channel.getName(), 'followreward', 100);
    }
});

$.getFollowAge = function (user, channel) {
    var follow = $.twitch.GetUserFollowsChannel(user, channel);
    var Followed_At = follow.getString("created_at");

    var date = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssz");
    var s0 = Followed_At.substring(0, Followed_At.length() - 6);
    var s1 = Followed_At.substring(Followed_At.length() - 6, Followed_At.length());
    Followed_At = s0 + "GMT" + s1;

    var datefmt = new java.text.SimpleDateFormat("MMMM d, YYYY");
    var gtf = new java.text.SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));
    var now = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone"))).getTime();

    var FollowTime = new java.util.Date(gtf.format(date.parse(Followed_At)));
    var TotalFollowTime = new java.util.Date(gtf.format(now));

    var diff = (TotalFollowTime.getTime() - FollowTime.getTime());
    var diffSeconds = diff / 1000 % 60;
    var diffMinutes = diff / (60 * 1000) % 60;
    var diffHours = diff / (60 * 60 * 1000) % 24;
    var diffDays = diff / (24 * 60 * 60 * 1000);
    var diffWeek = diff / (7 * 24 * 60 * 60 * 1000);
    var diffMonth = diff / (31 * 24 * 60 * 60 * 1000);
    var diffYear = diff / (12 * 31 * 24 * 60 * 60 * 1000);

    diffMinutes = diffMinutes.toString().substring(0, diffMinutes.toString().indexOf("."));
    diffHours = diffHours.toString().substring(0, diffHours.toString().indexOf("."));
    diffDays = diffDays.toString().substring(0, diffDays.toString().indexOf("."));
    diffWeek = diffWeek.toString().substring(0, diffWeek.toString().indexOf("."));
    diffMonth = diffMonth.toString().substring(0, diffMonth.toString().indexOf("."));
    diffYear = diffYear.toString().substring(0, diffYear.toString().indexOf("."));

    if (diffMonth > 12) {
        return diffYear + " years, " + diffHours + " hrs, " + diffMinutes + " min and " + diffSeconds + " sec.";
    } else if (diffWeek > 5) {
        return diffMonth + " months, " + diffHours + " hrs, " + diffMinutes + " min and " + diffSeconds + " sec.";
    } else if (diffDays > 15) {
        return diffWeek + " weeks, " + diffHours + " hrs, " + diffMinutes + " min and " + diffSeconds + " sec.";
    } else {
        return diffDays + " days, " + diffHours + " hrs, " + diffMinutes + " min and " + diffSeconds + " sec.";
    }
}

$.on('twitchFollow', function (event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);
    var channel = event.getChannel();

    if (!$.inidb.HasKey('followed', channel.getName(), follower)) {
        if ($.inidb.GetBoolean("settings", channel.getName(), "announcefollows")
                && $.tempdb.GetBoolean("t_state", channel.getName(), "announceFollowsAllowed")
                && $.moduleEnabled("./handlers/followHandler.js", channel)) {
            var s = $.inidb.GetString("settings", channel.getName(), "followmessage");

            s = $.replaceAll(s, '(name)', username);

            if ($.moduleEnabled("./systems/pointSystem.js", channel) && $.inidb.GetInteger('settings', channel.getName(), 'followreward') > 0) {
                var p = $.inidb.GetInteger('settings', channel.getName(), 'followreward');
                s = $.replaceAll(s, '(pointname)', $.getPointsString(p, channel));
                s = $.replaceAll(s, '(reward)', p);
                $.setPoints(follower, $.getPoints(follower, channel) + p, channel);
            }

            $.writeToFile(username + " ", "./web/latestfollower.txt", false);

            $.tempdb.SetInteger("t_state", channel.getName(), "followtrain", $.tempdb.GetInteger("t_state", channel.getName(), "followtrain") + 1);
            $.tempdb.SetInteger("t_state", channel.getName(), "lastfollow", System.currentTimeMillis());

            if (!$.timer.hasTimer("./handlers/followHandler.js", "followtrain_" + channel.getName(), true)) {
                $.timer.addTimer("./handlers/followHandler.js", "followtrain_" + channel.getName(), true, function (channel) {
                    $.checkFollowTrain(channel);
                }, 1000, channel);
            }

            $.say(s, channel);
        }
    }

    $.inidb.SetBoolean('followed', channel.getName(), follower, true);
});

$.on('twitchUnfollow', function (event) {
    var follower = event.getFollower().toLowerCase();
    var channel = event.getChannel();

    if ($.inidb.HasKey('followed', channel.getName(), follower)) {
        $.inidb.SetBoolean('followed', channel.getName(), follower, false);
    }
});

$.on('twitchFollowsInitialized', function (event) {
    var channel = event.getChannel();
    println(">> [" + channel.getName() + "] Enabling new follower announcements");

    $.tempdb.SetBoolean("t_state", channel.getName(), "announceFollowsAllowed", true);

    if (!$.inidb.HasKey("settings", channel.getName(), "announcefollows")) {
        $.inidb.SetBoolean("settings", channel.getName(), "announcefollows", true);
    }
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var action = sender;
    var channel = event.getChannel();
    var action2 = channel.getName().replaceFirst("#", "");

    if (args.length > 0) {
        action = args[0];
    }
    
    if (args.length > 1) {
        action2 = args[1];
    }

    if (command.equalsIgnoreCase("followed")) {
        if (args.length > 0) {
            if (!$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }
            
            if ($.inidb.GetBoolean("followed", channel.getName(), args[0].toLowerCase())) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.is-following", channel, args[0]), channel);
                return;
            } else {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.not-following", channel, args[0]), channel);
                return;
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.followed-command-usage"));
            return;
        }
    }

    if (command.equalsIgnoreCase("shoutout")) {
        if (!$.isMod(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.shoutout-usage", channel), channel);
            return;
        }
        
        var user = $.username.resolve(args[0]);

        if (!$.isOnline(user)) {
            $.say($.lang.get("net.phantombot.followHandler.shoutout-offline", channel, user, $.getGame(user.toLowerCase())), channel);
            return;
        } else {
            $.say($.lang.get("net.phantombot.followHandler.shoutout-online", channel, user, $.getGame(user.toLowerCase())), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("followannounce")) {
        if (!$.isMod(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }

        if ($.inidb.GetBoolean("settings", channel.getName(), "announcefollows")) {
            $.inidb.SetBoolean("settings", channel.getName(), "announcefollows", false);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.follow-ads-off", channel), channel);
            return;
        } else {
            $.inidb.SetBoolean("settings", channel.getName(), "announcefollows", true);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.follow-ads-on", channel), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("followmessage")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if ($.strlen(argsString) == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.current-follow-message", channel, $.inidb.GetString("settings", channel.getName(), "followmessage")), channel);

            var s = $.lang.get("net.phantombot.followHandler.follow-message-usage", channel);

            if ($.moduleEnabled("./systems/pointSystem.js", channel)) {
                s += $.lang.get("net.phantombot.followHandler.follow-message-usage-points", channel);
            }

            $.say($.getWhisperString(sender, channel) + s, channel);

        } else {
            $.logEvent("followHandler.js", 108, channel, username + " changed the new follower message to: " + argsString);

            $.inidb.SetString("settings", channel.getName(), "followmessage", argsString);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.follow-message-set", channel), channel);
        }
    }

    if (command.equalsIgnoreCase("followreward")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            if ($.inidb.HasKey('settings', channel.getName(), 'followreward')) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.current-follow-reward", channel, $.inidb.GetInteger('settings', channel.getName(), 'followreward')), channel);
            } else {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.current-follow-reward-usage", channel), channel);
            }
        } else {
            if (isNaN(args[0]) || parseInt(args[0]) < 0) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.follow-reward-error", channel), channel);
                return;
            }

            $.logEvent("followHandler.js", 134, channel, username + " changed the new follower points reward to: " + args[0]);

            $.inidb.SetInteger('settings', channel.getName(), 'followreward', args[0]);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.follow-reward-set", channel), channel);
        }
    }

    if (command.equalsIgnoreCase("followage")) {
        if (action.equalsIgnoreCase("help")) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.followtime-usage", channel), channel);
            return;
        }
        
        var check = $.twitch.GetUserFollowsChannel($.username.resolve(action.toLowerCase()), action2.toLowerCase());
        
        if (check.getInt("_http") != 200) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.error-not-following", channel, action, action2), channel);
            return;
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.followHandler.followtime", channel, action, action2, $.getFollowAge(action, action2)), channel);
            return;
        }
    }
});

$.checkFollowTrain = function (channel) {
    if (System.currentTimeMillis() - $.tempdb.GetInteger("t_state", channel.getName(), "lastfollow") > 65 * 1000) {
        $.timer.clearTimer("./handlers/followHandler.js", "followtrain_" + channel.getName(), true);

        var followtrain = $.tempdb.GetInteger("t_state", channel.getName(), "followtrain");

        if (followtrain > 1) {
            if (followtrain == 3) {
                $.say($.lang.get("net.phantombot.followHandler.triple-follow-train"));
            } else if (followtrain == 4) {
                $.say($.lang.get("net.phantombot.followHandler.Quadra-follow-train"));
            } else if (followtrain == 5) {
                $.say($.lang.get("net.phantombot.followHandler.penta-follow-train"));
            } else if (followtrain > 5 && followtrain <= 10) {
                $.say($.lang.get("net.phantombot.followHandler.mega-follow-train", followtrain));
            } else if (followtrain > 10 && followtrain <= 20) {
                $.say($.lang.get("net.phantombot.followHandler.ultra-follow-train", followtrain));
            } else if (followtrain > 20) {
                $.say($.lang.get("net.phantombot.followHandler.massive-follow-train", followtrain));
            }
        }

        $.tempdb.SetInteger("t_state", channel.getName(), "followtrain", 0);
    }
};

$.registerChatCommand("./handlers/followHandler.js", "followed", "mod");
$.registerChatCommand("./handlers/followHandler.js", "shoutout", "mod");
$.registerChatCommand("./handlers/followHandler.js", "followannounce", "mod");
$.registerChatCommand("./handlers/followHandler.js", "followmessage", "admin");
$.registerChatCommand("./handlers/followHandler.js", "followreward", "admin");
$.registerChatCommand("./handlers/followHandler.js", "followage");
