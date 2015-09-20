$.timelevel = $.inidb.get('settings', 'timelevel');
if($.timelevel == null) {
    $.timelevel = "false";
}
 
$.timePromoteHours = $.inidb.get("settings", "timePromoteHours");
if($.timePromoteHours == "" || $.timePromoteHours == null){
    $.timePromoteHours = 36; //in hours
    $.inidb.set("settings","timePromoteHours","");
}
 
if($.firstrun) {
    $.say("");
    $.say($.lang.get("net.phantombot.timesystem.current-timezone-usage", $.timezone));
    $.say($.lang.get("net.phantombot.timesystem.timezone-list"));
    $.say("");
}
 
$.displayTime = function(time) {
    // Date object takes starting time in ms - multiply by 1000
    var DateFormatter = new Date(time * 1000);
 
    // Create a string to stuff the output into.
    var output = "";
 
    // If you've triggered, you want to trigger on every subsequent.
    // Not quite a switch case, which won't work here, but close.
    var bFallThrough = false;
 
    // Date object is defined using the Unix Epoch (1/1/1970 00:00:00.000) - Trim off the 1970
    if (DateFormatter.getUTCFullYear() > 1970) {
        output += (DateFormatter.getUTCFullYear() - 1970) + " years, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCMonth() > 0 || bFallThrough) {
        output += DateFormatter.getUTCMonth() + " months, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCDate() > 1 || bFallThrough) {
        output += DateFormatter.getUTCDate() + " days, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCHours() > 0 || bFallThrough) {
        output += DateFormatter.getUTCHours() + " hours, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCMinutes() > 0 || bFallThrough) {
        output += DateFormatter.getUTCMinutes() + " minutes, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCSeconds() > 0 || bFallThrough) {
        if (bFallThrough) {
            output += "and ";
        }
        output += DateFormatter.getUTCSeconds() + " seconds";
    }
 
    // Done with concatenation and the like, return the output.
    return output;
}
 
$.setTimeZone = function (timezone) {
    var validIDs = java.util.TimeZone.getAvailableIDs();
    for (var i=0; i < validIDs.length; i++) {
        var currentID = validIDs[i];
        if (currentID != null && currentID.toLowerCase()==timezone.toLowerCase()) {
            $.inidb.set("timezone", "timezone", currentID);
            $.timezone = $.inidb.get("timezone", "timezone");
            $.say("New time zone " + currentID + " set!");
            return;
        }
    }
    $.say($.lang.get("net.phantombot.timesystem.error"));
    $.say($.lang.get("net.phantombot.timesystem.timezone-list"));
    $.say($.lang.get("net.phantombot.timesystem.current-timezone", $.timezone));
}
 
$.getWhisperString = function(sender) {
    var whispermode = $.inidb.get("settings", "whisper_time");
    // Just put this logic in here. The odds that an entire string is different are slim.
    if (whispermode == "true") {
        return "/w " + sender + " ";
    } else {
        return "";
    }
}
 
$.getWhisperStringStatic = function(sender) {
    var whispermode = $.inidb.get("settings", "whisper_time");
        return "/w " + sender + " ";
}
 
$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags()).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;
    var action;
    var time;
    var timezone;
    var whispermode = $.inidb.get("settings", "whisper_time");
   
    if (whispermode == undefined || whispermode == null) {
        whispermode = "false";
    }
 
    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
 
    if (command.equalsIgnoreCase("timezone")) {
        if (args.length == 0) {
            if (!$.isAdmin(sender)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.current-timezone", $.timezone));
                return;
            }
            else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.current-timezone", $.timezone));
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.timezone-list"));
                return;
            }
        } else if (args[0] == "help"){
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.current-timezone-usage", $.timezone));
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.timezone-list"));
            return;
        } else {
            timezone = args[0];
 
            if (!$.isAdmin(sender)) {
                $.say($.lang.get("net.phantombot.cmd.adminonly"));
                return;
            }
            $.setTimeZone(timezone);
            $.timezone = $.inidb.get("timezone", "timezone");
        }
    }
 
    if (command.equalsIgnoreCase("timelevel")) {
        if (!$.isAdmin(sender)) {
            $.say($.lang.get("net.phantombot.cmd.adminonly"));
            return;
        } else {
            if ($.timelevel=="true") {
                $.timelevel = "false";
                $.inidb.set('settings','timelevel', "false");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-level-off"));
                return;
            } else {
                $.timelevel = "true";
                $.inidb.set('settings','timelevel', "true");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-level-on"));
                return;
            }
        }  
    }
 
    if (command.equalsIgnoreCase("streamertime")) {
        var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone));
        var now = cal.getTime();
        var datefmt = new java.text.SimpleDateFormat("EEEE MMMM d, yyyy @ h:mm a z");
        datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
        var timestamp = datefmt.format(now);
           
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.streamer-local-time", timestamp, $.username.resolve($.ownerName)));
        return;
    }
 
    if (command.equalsIgnoreCase("whispertime")) {
        if (!$.isAdmin(sender)) {
            $.say($.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        if (whispermode == "false") {
            $.inidb.set("settings", "whisper_time", "true");
            whispermode = "true";
 
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.whisper-enabled", "Time System"));
        } else if (whispermode == "true") {
            $.inidb.set("settings", "whisper_time", "false");
            whispermode = "false";
 
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.whisper-disabled", "Time System"));
        }
    }
   
    if (command.equalsIgnoreCase("timepromotehours")) {
        if (!$.isAdmin(sender)) {
            $.say($.lang.get("net.phantombot.cmd.adminonly"));
            return;
        } else {
            if (parseInt(args[0])) {
                if( parseInt(args[0]) < 1 ) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-promote-hours-minimum"));
                    return;
                } else {
                    $.timePromoteHours = args[0];
                    $.inidb.set("settings","timePromoteHours", args[0]);
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-promote-hours-set", args[0]));
                    return;
                }
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-promote-hours-grater-then-0"));
                return;
            }
        }  
    }
   
    if (command.equalsIgnoreCase("timetoggle")) {
        if (!$.isAdmin(sender)) {
            $.say($.lang.get("net.phantombot.cmd.adminonly"));
            return;
        } else {
            var points = "points";
            if ($.timetoggle == "true") {
                $.timetoggle = "false";
                $.inidb.set('settings','timetoggle', "false");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-toggle-off", points));
                return;
            } else {
                $.timetoggle = "true";
                $.inidb.set('settings','timetoggle', "true");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-toggle-on", points));
                return;
            }
        }  
    }
 
    if (command.equalsIgnoreCase("time")) {
        if (args.length == 3) {
            if (!$.isAdmin(sender)) {
                $.say($.lang.get("net.phantombot.cmd.adminonly"));
                return;
            }
           
            action = args[0];
            username = args[1].toLowerCase();
            time = parseInt(args[2]);
 
            if (action.equalsIgnoreCase("give")) {
                $.logEvent("timeSystem.js", 28, $.username.resolve(sender, event.getTags()) + " gave " + time + " time to " + username);
               
                $.inidb.incr('time', username, time);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.give-time", time, $.username.resolve(username)));
                return;
            } else if (action.equalsIgnoreCase("take")) {
                $.logEvent("timeSystem.js", 32, $.username.resolve(sender, event.getTags()) + " took " + time + " time from " + username);
               
                $.inidb.decr('time', username, time);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.take-time", $.username.resolve(username), time));
                return;
            } else if (action.equalsIgnoreCase("set")) {
                $.logEvent("timeSystem.js", 36, $.username.resolve(sender, event.getTags()) + " set " + username + "'s time to " + time);
               
                $.inidb.set('time', username, time);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.set-time", $.username.resolve(username), time));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.help-usage"));
                return;
            }  
        } else {
            if (!argsString.isEmpty() && args[0].equalsIgnoreCase("help")) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.help-usage"));
                return;
            }
           
            var points_user = sender;
            if(args.length == 1) {
                points_user = args[0].toLowerCase();
            }
           
            var points = $.inidb.get('points', points_user);
            time = $.inidb.get('time', points_user);
           
            if(points == null) points = 0;
            if(time == null) time = 0;          
 
            var minutes = parseInt((time / 60) % 60);
            var hours = parseInt(time / 3600);
           
            var timeString = "";
            if (hours>0)
            {
                timeString+=hours.toString();
                timeString+=" Hrs ";
            }
            if (minutes>0)
            {
                timeString+=minutes.toString();
                timeString+=" Min"
            }
           
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.timecheck", $.username.resolve(sender), timeString));
            return;
        }
    }
});
 
$.timer.addTimer("./systems/timeSystem.js", "timesystem", true, function() {
    if (!$.moduleEnabled("./systems/timeSystem.js")) {
        return;
    }
   
    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();
       
        $.inidb.incr('time', nick, 60);
        if ($.timelevel == "true") {
            //this promotes viewers to regulars if they spend more than 36 hours in the stream
            if(!$.isMod(nick)) {
                if ( parseInt($.getUserGroupId(nick)) > 6 && $.inidb.get('followed', nick) == 1 ) {
                    if(parseInt($.inidb.get('time', nick)) >= parseInt($.timePromoteHours*60)*60) {
                        var levelup = parseInt($.getUserGroupId(nick)) -1;
                       
                        $.setUserGroupById(nick, levelup);
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.timesystem.time-promote"), $.username.resolve(nick), $.username.resolve(levelup));
                        return;
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
        $.registerChatCommand("/systems/timeSystem.js", "streamertime");
        $.registerChatCommand("/systems/timeSystem.js", "timelevel", "admin");
        $.registerChatCommand("/systems/timeSystem.js", "timepromotehours", "admin");
        $.registerChatCommand("/systems/timeSystem.js", "timetoggle", "admin");
        $.registerChatCommand("/systems/timeSystem.js", "whispertime", "admin");
    }
},10*1000);
