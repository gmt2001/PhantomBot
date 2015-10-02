var regularsGroupID = 6;

$.timeLevel = $.inidb.get('settings', 'timeLevel');
$.timePromoteHours = $.inidb.get('settings', 'timePromoteHours');
$.timeZone = $.inidb.get("timezone", "timeZone");
$.timeOffline = $.inidb.get("timezone", "timeOffline");
$.permToggleTime = $.inidb.get("settings", "permToggleTime");

if ($.timeLevel == undefined || $.timeLevel == null || $.timeLevel.isEmpty()) {
    $.timeLevel = "false";
}

if ($.timePromoteHours == undefined || $.timePromoteHours == null || isNaN($.timePromoteHours) || $.timePromoteHours < 0) {
    $.timePromoteHours = 36;
}

if ($.timeZone == undefined || $.timeZone == null || $.timeZone.isEmpty()) {
    $.timeZone = "America/New_York";
}

if ($.timeOffline == undefined || $.timeOffline == null || $.timeOffline.isEmpty()) {
    $.timeOffline = "true";
}

if ($.permToggleTime == undefined || $.permToggleTime == null) {
    $.permToggleTime = "false";
}

if($.firstrun) {
    $.say("");
    $.say("The current time zone is '" + $.timeZone + "'.");
    $.say("To change it use '!timezone (timezone)'.");
    $.say("A list of time zones can be found here: ");
    $.say("http://en.wikipedia.org/wiki/List_of_tz_database_time_zones.");
    $.say("");
}


$.getUserTime = function (user) {
    // "getUserTime" instead of "getTime" to prevent issues with the "real" function.
    var time = $.inidb.get('time', user.toLowerCase());
    if (time == null) time = 0;

    return time;
}

$.getTimeString = function (time) {
    var minutes = parseInt((time / 60) % 60);
    var hours = parseInt((time / 3600) % 24);
    var days = parseInt((time / 86400) % 7);
    var weeks = parseInt(time / 604800);

    var timeString = "";

    if (time > 0) {
        if (weeks > 0) {
            timeString += weeks.toString();
            timeString += "w "
        }
        if (days > 0) {
            timeString += days.toString();
            timeString += "d "
        }
        if (hours > 0) {
            timeString += hours.toString();
            timeString += "h "
        }
        if (minutes > 0) {
            timeString += minutes.toString();
            timeString += "m "
        }
        if (weeks == 0 && days == 0 && hours == 0 && minutes == 0) {
            return false;
        }

        timeString = timeString.trim();
    } else {
        return false;
    }

    return timeString;
}

$.validateTimezone = function (timezone) {
    var validIDs = java.util.TimeZone.getAvailableIDs();

    for (i in validIDs)
    {
        if (validIDs[i] != null && validIDs[i].toLowerCase() == timezone.toLowerCase()) {
            return true;
        }
    }

    return false;
}

$.setTimezone = function (timezone) { 
    if (validateTimezone(timezone)) {
        $.inidb.set("timezone", "timeZone", timezone);
        $.timeZone = $.inidb.get('timezone', 'timeZone');

        return true;
    } else {
        return false;
    }
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags()).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;
    var action;
    var time;
    var timeZone;
    
    if(argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if(command.equalsIgnoreCase("time")) {
        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("give") || action.equalsIgnoreCase("send") || action.equalsIgnoreCase("add")) {
                if ($.permToggleTime == "true") {
                    if (!$.isModv3(sender, event.getTags())) {
                        $.say($.getWhisperString(sender) + $.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.getWhisperString(sender) + $.adminmsg);
                        return;
                    }
                }

                if (args[1] == null || args[2] == null || isNaN(parseInt(args[2]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.give-usage"));
                    return;
                }
            
                username = args[1].toLowerCase();
                time = parseInt(args[2]);
            
                if (time < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.give-error-negative"));
                    return;
                } else {
                    if ($.inidb.get("visited", username.toLowerCase()) == "visited") {
                        $.inidb.incr('time', username.toLowerCase(), time);

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.give-success", $.getTimeString(time), $.username.resolve(username), $.getTimeString($.inidb.get('time', username.toLowerCase()))));
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("take") || action.equalsIgnoreCase("withdraw")) {
                if ($.permToggleTime == "true") {
                    if (!$.isModv3(sender, event.getTags())) {
                        $.say($.getWhisperString(sender) + $.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.getWhisperString(sender) + $.adminmsg);
                        return;
                    }
                }

                if (args[1] == null || args[2] == null || isNaN(parseInt(args[2]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.take-usage"));
                    return;
                }

                username = args[1].toLowerCase();
                time = parseInt(args[2]);

                if (time > $.inidb.get('time', username.toLowerCase())) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.take-error-toomuch", $.username.resolve(username)));       
                    return;
                } else {
                    if ($.inidb.get("visited", username.toLowerCase()) == "visited")  {
                        $.inidb.decr('time', username.toLowerCase(), time);

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.take-success", $.getTimeString(time), $.username.resolve(username), $.getTimeString($.inidb.get('time', username.toLowerCase()))))
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("set")) {
                if ($.permToggleTime == "true") {
                    if (!$.isModv3(sender, event.getTags())) {
                        $.say($.getWhisperString(sender) + $.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.getWhisperString(sender) + $.adminmsg);
                        return;
                    }
                }

                if (args[1] == null || args[2] == null || isNaN(parseInt(args[2]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.set-usage"));
                    return;
                }
            
                username = args[1].toLowerCase();
                time = parseInt(args[2]);
            
                if (time < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.set-error-negative"));  
                    return;
                } else {
                    if ($.inidb.get("visited", username.toLowerCase()) == "visited")  {
                        $.inidb.set('time', username.toLowerCase(), time);

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.set-success", $.username.resolve(username), $.getTimeString($.inidb.get('time', username.toLowerCase()))));
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("reset")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                $.inidb.RemoveFile("time");
                $.inidb.ReloadFile("time");

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.reset-success", $.getTimeString(0)));
            } else if (action.equalsIgnoreCase("promotehours")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.promotehours-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.promotehours-error-negative", $.getGroupNameById(regularsGroupID).toLowerCase()));
                    return;
                } else {
                    $.inidb.set('settings', 'timePromoteHours', args[1]);
                    $.timePromoteHours = parseInt($.inidb.get('settings', 'timePromoteHours'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.promotehours-success", $.getGroupNameById(regularsGroupID).toLowerCase(), $.timePromoteHours));
                    return;
                }
            } else if (action.equalsIgnoreCase("autolevel")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if ($.timeLevel.toString() == "false") {
                    $.inidb.set('settings', 'timeLevel', "true");
                    $.timeLevel = $.inidb.get('settings', 'timeLevel');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.autolevel-enabled", $.getGroupNameById(regularsGroupID).toLowerCase(), $.timePromoteHours));
                    return;
                } else {
                    $.inidb.set('settings', 'timeLevel', "false");
                    $.timeLevel = $.inidb.get('settings', 'timeLevel');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.autolevel-disabled", $.getGroupNameById(regularsGroupID).toLowerCase(), $.timePromoteHours));
                    return;
                }
            } else if (action.equalsIgnoreCase("offline") || action.equalsIgnoreCase("offlinetime")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if ($.timeOffline.toString() == "false") {
                    $.inidb.set('settings', 'timeOffline', "true");
                    $.timeOffline = $.inidb.get('settings', 'timeOffline');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.offlinetime-enabled"));
                    return;
                } else {
                    $.inidb.set('settings', 'timeOffline', "false");
                    $.timeOffline = $.inidb.get('settings', 'timeOffline');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.offlinetime-disabled"));
                    return;
                }
            } else if (action.equalsIgnoreCase("toggle")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if ($.permToggleTime == "false") {
                    $.inidb.set('settings', 'permToggleTime', "true");
                    $.permToggleTime = $.inidb.get('settings', 'permToggleTime');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.toggle-success", "Moderator"));
                } else if ($.permToggleTime == "true") {
                    $.inidb.set('settings', 'permToggleTime', "false");
                    $.permToggleTime = $.inidb.get('settings', 'permToggleTime');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.toggle-success", "Administrator"));
                }
            } else if (action.equalsIgnoreCase("help")) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.help"));
                return;
            } else {
                var othername = "";
                if(args[0]!=null) {
                    othername = args[0].toLowerCase();
                }
                
                if ($.inidb.get("visited", othername.toLowerCase()) == "visited")  {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.get-other", $.username.resolve(othername), $.getTimeString($.getUserTime(othername))));
                            return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(othername)));
                    return;
                }
            }
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.get-self", $.getTimeString($.getUserTime(sender))));
            return;
        }
    }

    if(command.equalsIgnoreCase("timezone")) {
        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("help") || action.equalsIgnoreCase("usage")) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timezone.usage"));
                return;
            } else {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (setTimezone(action)) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timezone.success", action));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timezone.error-invalid", action));
                    return;
                }
                return;
            }
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timezone.get", $.timeZone));
            return;
        }
    }

    if (command.equalsIgnoreCase("streamertime")) {
        var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timeZone));
        var now = cal.getTime();
        var datefmt = new java.text.SimpleDateFormat("EEEE MMMM d, yyyy @ h:mm a z");
        datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timeZone));
        var timestamp = datefmt.format(now);
            
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.streamertime", timestamp, $.username.resolve($.ownerName)));
    }
});

$.timer.addTimer("./systems/timeSystem.js", "timesystem", true, function() {
    if (!$.moduleEnabled("./systems/timeSystem.js")) {
        return;
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();

        if ($.isOnline($.channelName)) {
            $.inidb.incr('time', nick, 60);
        } else {
            if ($.timeOffline == "true") {
                $.inidb.incr('time', nick, 60);
            }
        }

        if ($.timeLevel == "true") {
            if(!$.isMod(nick)) {
                if (parseInt($.getUserGroupId(nick)) > regularsGroupID && $.inidb.get('followed', nick) == 1) {
                    if(parseInt($.inidb.get('time', nick)) >= parseInt($.timePromoteHours * 60) * 60) {
                        var levelup = parseInt($.getUserGroupId(nick)) - 1;

                        $.setUserGroupById(nick, levelup);
                        $.say($.getWhisperString(nick) + $.lang.get("net.phantombot.timesystem.autolevel-promote", $.username.resolve(nick), $.getGroupNameById(levelup).toLowerCase(), $.timePromoteHours));
                    }
                }
            }
        }
    }
}, 60 * 1000);

$.timer.addTimer("./systems/timeSystem.js", "autosave", true, function() {
    $.inidb.SaveAll(true);
}, 300* 1000);

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/timeSystem.js')) {
        $.registerChatCommand("./systems/timeSystem.js", "time");
        $.registerChatCommand("./systems/timeSystem.js", "time help");
        $.registerChatCommand("./systems/timeSystem.js", "timezone");
        $.registerChatCommand("./systems/timeSystem.js", "streamertime");
    }
},10*1000);
