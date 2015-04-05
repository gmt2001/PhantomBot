if ($.inidb.FileExists("timezone")) {
    $.timezone = $.inidb.get("timezone", "timezone");
}
else {
    $.inidb.set("timezone", "timezone", "America/New_York" );
    $.timezone = $.inidb.get("timezone", "timezone");
}
$.timelevel = $.inidb.get('settings', 'timelevel');
if($.timelevel == null) {
    $.timelevel = "false";
}

$.say("");
$.say("The current time zone is '" + $.timezone + "'! To change it use '!timezone <timezone>'.")
$.say("A list of time zones can be found here: http://en.wikipedia.org/wiki/List_of_tz_database_time_zones.");
$.say("");

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
    $.say("Error! Invalid time zone specified. Time zone has not been changed.");
    $.say("For a list of valid time zones visit http://en.wikipedia.org/wiki/List_of_tz_database_time_zones.");
    $.say("Current time zone is: " + $.timezone);
}




$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;
    var action;
    var time;
    var timezone;
	

    if(argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
    if (command.equalsIgnoreCase("timezone")) {
        if (args.length == 0) {
            if (!$.isAdmin(sender)) {
                $.say("The caster's time zone is '" + $.timezone + ".");
                return;
            }
            else {
                $.say("The current time zone is '" + $.timezone + ".");
                $.say(" A list of time zones can be found here: http://en.wikipedia.org/wiki/List_of_tz_database_time_zones.");
                return;
            }
        } else if (args[0]=="help"){
            $.say("The current time zone is '" + $.timezone + "'! To change it use '!timezone <timezone>'.")
            $.say("A list of time zones can be found here: http://en.wikipedia.org/wiki/List_of_tz_database_time_zones.");
            return;
        } else {
            timezone = args[0];

            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }
            $.setTimeZone(timezone);
            $.timezone = $.inidb.get("timezone", "timezone");
        }
		
    }
    if (command.equalsIgnoreCase("timelevel")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        } else {
            if ($.timelevel=="true") {
                $.timelevel = "false";
                $.inidb.set('settings','timelevel', "false");
                $.say("Earning higher group rank by spending time in chat has been disabled.");
                return;
            } else {
                $.timelevel = "true";
                $.inidb.set('settings','timelevel', "true");
                $.say("Earning higher group rank by spending time in chat has been enabled.");
                return;
            }
        }  
    }
	
    if (command.equalsIgnoreCase("timetoggle")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        } else {
            if ($.timetoggle=="true") {
                $.timetoggle = "false";
                $.inidb.set('settings','timetoggle', "false");
                $.say("Time won't be displayed when viewing your " + $.pointname + " any more.");
                return;
            } else {
                $.timetoggle = "true";
                $.inidb.set('settings','timetoggle', "true");
                $.say("Time will be displayed when viewing your " + $.pointname + " now.");
                return;
            }
        }  
    }

    if(command.equalsIgnoreCase("time")) {
        if(args.length == 3) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);

                return;
            }
			
            action = args[0];
            username = args[1].toLowerCase();
            time = parseInt(args[2]);

            if(action.equalsIgnoreCase("give")) {
                $.logEvent("timeSystem.js", 28, $.username.resolve(sender) + " gave " + time + " time to " + username);




                $.inidb.incr('time', username, time);
                $.say(time + " seconds was added towards " + $.username.resolve(username) + ".");


            } else if(action.equalsIgnoreCase("take")) {
                $.logEvent("timeSystem.js", 32, $.username.resolve(sender) + " took " + time + " time from " + username);




                $.inidb.decr('time', username, time);
                $.say($.username.resolve(username) + "'s time was deducted by " + time + " seconds.");

            } else if(action.equalsIgnoreCase("set")) {
                $.logEvent("timeSystem.js", 36, $.username.resolve(sender) + " set " + username + "'s time to " + time);




                $.inidb.set('time', username, time);
                $.say($.username.resolve(username) + "'s time was set to " + time + " seconds.");

            } else {
                $.say("Usage: !time give <username> <amount in seconds>, !time take <username> <amount in seconds>, !time set <username> <amount in seconds>");
            }	
        } else {

            if (!argsString.isEmpty() && args[0].equalsIgnoreCase("help")) {
                $.say("Usage: !time give <username> <amount in seconds>, !time take <username> <amount in seconds>, !time set <username> <amount in seconds>");
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
			
            var time2 = new Date; 

            var minutes = parseInt((time / 60) % 60);
            var hours = parseInt(time / 3600);

            var timeString = "";
            if(hours != 0) timeString += " " + hours + " Hrs";
            else if(minutes != 0) timeString += " " + minutes + " Mins";
            else timeString += " " + minutes + " Mins";
			
            $.say($.username.resolve(points_user) + " has been in this channel for a total of " + hours + " hours & " + minutes + " minutes.");
        }
    }
});

$.registerChatCommand("./systems/timeSystem.js", "time");
$.registerChatCommand("./systems/timeSystem.js", "time help");
$.registerChatCommand("./systems/timeSystem.js", "timezone");
$.registerChatCommand("/systems/timeSystem.js", "timelevel");
$.registerChatCommand("/systems/timeSystem.js", "timetoggle");


$.setInterval(function() {
    if (!$.moduleEnabled("./systems/timeSystem.js")) {
        return;
    }
    
    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();
        
        $.inidb.incr('time', nick, 60);
        if ($.timelevel=="true") {
            //this promotes viewers to regulars if they spend more than 36 hours in the stream
            if ((parseInt($.getUserGroupId(nick))> 6) && ($.inidb.get('followed', nick) == 1) && (parseInt($.inidb.get('time', nick)) >= 12960 * 10)) {
                var levelup = parseInt($.getUserGroupId(nick)) -1;
                
                $.setUserGroupById(nick, levelup);
                $.say($.username.resolve(nick) + " has been promoted to a " + $.getGroupNameById(levelup) + "! Congratulations!");
            }
        }
    }
}, 60 * 1000);