$.announceFollows = false;
$.announceFollowsAllowed = false;
$.followMessage = $.inidb.get('settings', 'followmessage');
$.followReward = parseInt($.inidb.get('settings', 'followreward'));

if ($.followMessage == null || $.followMessage == undefined || $.strlen($.followMessage) == 0 || $.followMessage == "") {
    if ($.moduleEnabled("./systems/pointSystem.js")) {
        if ($.followReward < 1) {
            $.followMessage = $.lang.get("net.phantombot.followHandler.new-follow-message-no-reward");
        } else if ($.followReward > 0 && $.moduleEnabled('./systems/pointSystem.js')) {
            $.followMessage = $.lang.get("net.phantombot.followHandler.new-follow-message-and-reward");
        }
    } else {
        $.followMessage = $.lang.get("net.phantombot.followHandler.new-follow-message-no-reward");
    }
}

if ($.followReward == null || $.followReward == undefined || $.followReward == "" || isNaN($.followReward) || $.followReward.isEmpty()) {
    $.followReward = 100;
}

$.getFollowAge = function (user, channel) {
    var follow = $.twitch.GetUserFollowsChannel(user, channel);
    var Followed_At = follow.getString("created_at");

    var date = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssz");
    var s0 = Followed_At.substring(0, Followed_At.length() - 6);
    var s1 = Followed_At.substring(Followed_At.length() - 6, Followed_At.length());
    Followed_At = s0 + "GMT" + s1;

    var datefmt = new java.text.SimpleDateFormat("MMMM d, YYYY");
    var gtf = new java.text.SimpleDateFormat("MM/dd/yyyy HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    var now = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone)).getTime();

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

if ($.lastfollow == undefined || $.lastfollow == null) {
    $.lastfollow = 0;
    $.followtrain = 0;
}

$.on('twitchFollow', function (event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);
    var followed = $.inidb.get('followed', follower);

    if (followed == null || followed == undefined || followed.isEmpty()) {
        $.inidb.set('followed', follower, 1);
        var p = $.followReward;

        if ($.announceFollows == true && $.announceFollowsAllowed == true && $.moduleEnabled("./handlers/followHandler.js")) {
            var s = $.followMessage;

            s = $.replaceAll(s, '(name)', username);

            if ($.moduleEnabled("./systems/pointSystem.js")) {
                s = $.replaceAll(s, '(pointname)', $.getPointsString(p));
                s = $.replaceAll(s, '(reward)', p.toString());
            }

            $.writeToFile(username + " ", "./web/latestfollower.txt", false);

            $.followtrain++;
            $.lastfollow = System.currentTimeMillis();

            if (!$.timer.hasTimer("./handlers/followHandler.js", "followtrain", true)) {
                $.timer.addTimer("./handlers/followHandler.js", "followtrain", true, function () {
                    $.checkFollowTrain();
                }, 1000);
            }
            $.say(s);
        }

        if ($.moduleEnabled("./systems/pointSystem.js") && p > 0) {
            $.inidb.incr('points', follower, p);
        }
    } else if (followed == 0) {
        $.inidb.set('followed', follower, 1);
    }
});

$.on('twitchUnfollow', function (event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);

    var followed = $.inidb.get('followed', follower);

    if (followed == null || followed == undefined || followed.isEmpty()) {
        return;
    }

    if (followed == 1) {
        $.inidb.set('followed', follower, 0);
    }
});

$.on('twitchFollowsInitialized', function (event) {
    println(">>Enabling new follower announcements");

    $.announceFollowsAllowed = true;

    if (!$.inidb.exists("settings", "announcefollows") || $.inidb.get("settings", "announcefollows").equalsIgnoreCase("true")) {
        $.inidb.set("settings", "announcefollows", "true");
        $.announceFollows = true;
    }
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var action = sender;
    var action2 = $.channelName;

    if (args.length > 0) {
        action = args[0];
    }
    if (args.length > 1) {
        action2 = args[1];
    }
    var check = $.twitch.GetUserFollowsChannel($.username.resolve(action.toLowerCase()), action2.toLowerCase());

    if (command.equalsIgnoreCase("followed")) {
        if (args.length > 0) {
            if (!$.isModv3(sender)) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }
            if ($.inidb.get("followed", args[0].toLowerCase()) == 1) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.is-following", args[0]));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.not-following", args[0]));
                return;
            }
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.followed-command-usage"));
            return;
        }
    }

    if (command.equalsIgnoreCase("follow") || command.equalsIgnoreCase("shoutout") || command.equalsIgnoreCase("caster")) {
        if (!$.isModv3(sender)) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.shoutout-usage"));
            return;
        }
        var user = $.username.resolve(args[0]);

        if (!$.isOnline(user)) {
            $.say($.lang.get("net.phantombot.followHandler.shoutout-offline", user.toLowerCase(), $.getGame(user.toLowerCase())));
            return;
        } else {
            $.say($.lang.get("net.phantombot.followHandler.shoutout-online", user.toLowerCase(), $.getGame(user.toLowerCase())));
            return;
        }
    }

    if (command.equalsIgnoreCase("followannounce")) {
        if (!$.isModv3(sender)) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if ($.announceFollows == true) {
            $.inidb.set("settings", "announcefollows", "false");
            $.announceFollows = false;
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.follow-ads-off"));
            return;
        } else {
            $.inidb.set("settings", "announcefollows", "true");
            $.announceFollows = true;
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.follow-ads-on"));
            return;
        }
    }
    
    if (command.equalsIgnoreCase("followmessage")) {		
        if (!$.isAdmin(sender)) {		
            $.say($.getWhisperString(sender) + $.adminmsg);		
            return;		
        }		
		
        if ($.strlen(argsString) == 0) {		
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.current-follow-message", $.followMessage));		
		
            var s = $.lang.get("net.phantombot.followHandler.follow-message-usage");		
		
            if ($.moduleEnabled("./systems/pointSystem.js")) {		
                s += $.lang.get("net.phantombot.followHandler.follow-message-usage-points");		
            }		
		
            $.say($.getWhisperString(sender) + s);
            
        } else {		
            $.logEvent("followHandler.js", 108, username + " changed the new follower message to: " + argsString);		
		
            $.inidb.set('settings', 'followmessage', argsString);
            $.followMessage = $.inidb.get('settings', 'followmessage');
		
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.follow-message-set"));		
        }		
    }

    if (command.equalsIgnoreCase("followreward")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'followreward')) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.current-follow-reward", $.inidb.get('settings', 'followreward')));
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.current-follow-reward-usage"));
            }
        } else {
            if (!parseInt(argsString) < 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.follow-reward-error"));
                return;
            }

            $.logEvent("followHandler.js", 134, username + " changed the new follower points reward to: " + argsString);

            $.inidb.set('settings', 'followreward', argsString);
            $.followReward = parseInt(argsString);

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.follow-reward-set"));
        }
    }

    if (command.equalsIgnoreCase("followage") || command.equalsIgnoreCase("followtime") || command.equalsIgnoreCase("following")) {
        if (action.equalsIgnoreCase("help")) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.followtime-usage"));
            return;
        } else if (check.getInt("_http") != 200) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.error-not-following", action, action2));
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.followtime", action, action2, $.getFollowAge(action, action2)));
            return;
        }
    }
});

$.checkFollowTrain = function () {
    if (System.currentTimeMillis() - $.lastfollow > 65 * 1000) {
        $.timer.clearTimer("./handlers/followHandler.js", "followtrain", true);
        $.followtimer = null;

        if ($.followtrain > 1) {
            if ($.followtrain == 3) {
                $.say($.lang.get("net.phantombot.followHandler.triple-follow-train"));
            } else if ($.followtrain == 4) {
                $.say($.lang.get("net.phantombot.followHandler.Quadra-follow-train"));
            } else if ($.followtrain == 5) {
                $.say($.lang.get("net.phantombot.followHandler.penta-follow-train"));
            } else if ($.followtrain > 5 && $.followtrain <= 10) {
                $.say($.lang.get("net.phantombot.followHandler.mega-follow-train", $.followtrain));
            } else if ($.followtrain > 10 && $.followtrain <= 20) {
                $.say($.lang.get("net.phantombot.followHandler.ultra-follow-train", $.followtrain));
            } else if ($.followtrain > 20) {
                $.say($.lang.get("net.phantombot.followHandler.massive-follow-train", $.followtrain));
            }
        }

        $.followtrain = 0;
    }
};

var keys = $.inidb.GetKeyList("followed", "");

for (var i = 0; i < keys.length; i++) {
    if ($.inidb.get("followed", keys[i])==1) {
        Packages.me.mast3rplan.phantombot.cache.FollowersCache.instance($.channelName).addFollower(keys[i]);
    }
}

setTimeout(function () {
    if ($.moduleEnabled('./handlers/followHandler.js')) {
        $.registerChatCommand("./handlers/followHandler.js", "followed", "mod");
        $.registerChatCommand("./handlers/followHandler.js", "follow", "mod");
        $.registerChatCommand("./handlers/followHandler.js", "followannounce", "mod");
        $.registerChatCommand("./handlers/followHandler.js", "followmessage", "admin");
        $.registerChatCommand("./handlers/followHandler.js", "followreward", "admin");
        $.registerChatCommand("./handlers/followHandler.js", "followcount");
        $.registerChatCommand("./handlers/followHandler.js", "followage");
    }
}, 10 * 1000);
