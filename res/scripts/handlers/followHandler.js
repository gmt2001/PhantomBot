$.getFollowAge = function(user, channel) {
    var follow = $.twitch.GetUserFollowsChannel(user, channel);
    var Followed_At = follow.getString("created_at");

    var date = new java.text.SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssz");
    var s0 = Followed_At.substring(0, Followed_At.length() - 6);
    var s1 = Followed_At.substring(Followed_At.length() - 6, Followed_At.length() );
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

$.on('twitchFollow', function(event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);
    var followed = $.inidb.get('followed', follower);
    
    if (followed == null || followed == undefined || followed.isEmpty()) {
        $.inidb.set('followed', follower, 1);
        var p = parseInt($.inidb.get('settings', 'followreward'));
        
        if (isNaN(p)) {
            p = 100;
        }
        
        if (($.announceFollows == true) && $.moduleEnabled("./handlers/followHandler.js")) {
            var s = $.inidb.get('settings', 'followmessage');
            
            if (s == null || s == undefined || $.strlen(s) == 0) {
                if ($.moduleEnabled("./systems/pointSystem.js")) {
                    s = $.lang.get("net.phantombot.followHandler.default-say");
                } else {
                    s = $.lang.get("net.phantombot.followHandler.default-say-2");
                }
            }
            
            while (s.indexOf('(name)') != -1) {
                s = s.replace('(name)', username);
            }
            
            if ($.moduleEnabled("./systems/pointSystem.js")) {
                while (s.indexOf('(pointname)') != -1) {
                    s = s.replace('(pointname)', $.getPointsString(p));
                }
                
                while (s.indexOf('(reward)') != -1) {
                    s = s.replace('(reward)', p.toString());
                }
            }
            
            $.writeToFile(username + " ", "./web/latestfollower.txt", false);
            
            $.followtrain++;
            $.lastfollow = System.currentTimeMillis();
            
            if (!$.timer.hasTimer("./handlers/followHandler.js", "followtrain", true)) {
                $.timer.addTimer("./handlers/followHandler.js", "followtrain", true, function() {
                    $.checkFollowTrain();
                }, 1000);
            }
            if (!$.firstrun) {
                $.say(s);
            }
        }
        
        if ($.moduleEnabled("./systems/pointSystem.js") && p > 0) {
            $.inidb.incr('points', follower, p);
        }
    } else if (followed.equalsIgnoreCase("0")) {
        $.inidb.set('followed', follower, 1);
    }
});

$.on('twitchUnfollow', function(event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);

    var followed = $.inidb.get('followed', follower);
    
    if (followed == null || followed == undefined || followed.isEmpty()) {
        return;
    }
    
    if (followed.equalsIgnoreCase("1")) {
        $.inidb.set('followed', follower, 0);
    }
});

$.on('twitchFollowsInitialized', function(event) {
    println(">>Enabling new follower announcements");
    
    $.announceFollows = $.inidb.get("settings", "announcefollows");
    if ($.announceFollows == undefined || $.announceFollows == null || isNaN($.announceFollows)) {
        $.inidb.set("settings", "announcefollows", "true");
        $.announceFollows = true;
    }
});

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var action = args[0];
    var action2 = args[1];
    if (action == null) action = sender;
    if (action2 == null) action2 = $.channelName;
    var check = $.twitch.GetUserFollowsChannel($.username.resolve(action.toLowerCase()), action2.toLowerCase());
	
    if (command.equalsIgnoreCase("followed")) {
        if (args[0] != null) {
            if (!$.isModv3(sender)) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }
            if ($.inidb.get("followed",args[0].toLowerCase())==1){
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

    if (command.equalsIgnoreCase("follow")) {
        if (args[0] != null) {
            if (!$.isModv3(sender)) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }
            if ($.username.resolve(args[0])) {
                $.say($.lang.get("net.phantombot.followHandler.shoutout-command", args[0]));
            }
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.followed-command-usage"));
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
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.current-follow-message", $.inidb.get('settings', 'followmessage')));
            
            var s = $.lang.get("net.phantombot.followHandler.follow-message-usage");
            
            if ($.moduleEnabled("./systems/pointSystem.js")) {
                s += $.lang.get("net.phantombot.followHandler.follow-message-usage-points");
            }
            
            $.say($.getWhisperString(sender) + s);
        } else {
            $.logEvent("followHandler.js", 108, username + " changed the new follower message to: " + argsString);
            
            $.inidb.set('settings', 'followmessage', argsString);
            
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
            
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.follow-reward-set"));
        }
    }

    if (command.equalsIgnoreCase("followage") || command.equalsIgnoreCase("followtime") || command.equalsIgnoreCase("following")) {
        if (action.equalsIgnoreCase("help")) {
            $.say("@" + $.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.followtime-usage"));
            return;
        } else if (check.getInt("_http") != 200) {
            $.say("@" + $.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.error-not-following", action, action2));
            return;
        } else {
            $.say("@" + $.getWhisperString(sender) + $.lang.get("net.phantombot.followHandler.followtime", action, action2, $.getFollowAge(action, action2)));
            return;
        }
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./handlers/followHandler.js')) {
        $.registerChatCommand("./handlers/followHandler.js", "followmessage", "admin");
        $.registerChatCommand("./handlers/followHandler.js", "followreward", "admin");
        $.registerChatCommand("./handlers/followHandler.js", "followcount");
        $.registerChatCommand("./handlers/followHandler.js", "followage");
    }
},10 * 1000);

$.checkFollowTrain = function() {
    if (System.currentTimeMillis() - $.lastfollow > 65 * 1000) {
        $.timer.clearTimer("./handlers/followHandler.js", "followtrain", true);
        $.followtimer = null;
        
        if (!$.firstrun) {
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
        }
        
        $.followtrain = 0;
    }
};

var keys = $.inidb.GetKeyList("followed", "");

for (var i = 0; i < keys.length; i++) {
    if ($.inidb.get("followed", keys[i]).equalsIgnoreCase("1")) {
        $.followers.addFollower(keys[i]);
    }
}

setTimeout(function () {
    if ($.moduleEnabled('./handlers/followHandler.js')) {
        $.registerChatCommand("./handlers/followHandler.js", "followed", "mod");
        $.registerChatCommand("./handlers/followHandler.js", "follow", "mod");
        $.registerChatCommand("./handlers/followHandler.js", "followannounce", "mod");
    }
}, 10 * 1000);
