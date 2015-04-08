$.pointname = $.inidb.get('settings', 'pointname');
$.pointgain = parseInt($.inidb.get('settings', 'pointgain'));
$.offlinegain = parseInt($.inidb.get('settings', 'offlinegain'));
$.pointbonus = parseInt($.inidb.get('settings', 'pointbonus'));
$.pointinterval = parseInt($.inidb.get('settings', 'pointinterval'));
$.offlineinterval = parseInt($.inidb.get('settings', 'offlineinterval'));
$.mingift = parseInt($.inidb.get('settings', 'mingift'));

if ($.pointname == undefined || $.pointname == null || $.pointname.isEmpty()) {
    $.pointname = "Points";
}

if ($.pointgain == undefined || $.pointgain == null || isNaN($.pointgain) || $.pointgain < 0) {
    $.pointgain = 1;
}

if ($.offlinegain == undefined || $.offlinegain == null || isNaN($.offlinegain) || $.offlinegain < 0) {
    $.offlinegain = 1;
}

if ($.pointbonus == undefined || $.pointbonus == null || isNaN($.pointbonus) || $.pointbonus < 0) {
    $.pointbonus = 0.5;
}

if ($.pointinterval == undefined || $.pointinterval == null || isNaN($.pointinterval) || $.pointinterval < 0) {
    $.pointinterval = 10;
}

if ($.offlineinterval == undefined || $.offlineinterval == null || isNaN($.offlineinterval) || $.offlineinterval < 0) {
    $.offlineinterval = 10;
}

if ($.mingift == undefined || $.mingift == null || isNaN($.mingift) || $.mingift < 0) {
    $.mingift = 10;
}

$.getPoints = function (user) {
    var points = $.inidb.get('points', user);

    var timeString = "";

    var time = $.inidb.get('time', user);

    if (points == null) points = 0;
    if (time == null) time = 0;

    var minutes = parseInt((time / 60) % 60);
    var hours = parseInt(time / 3600);

    timeString = " -- [";
    if (hours != 0) timeString += " " + hours + " Hrs";
    else if (minutes != 0) timeString += " " + minutes + " Mins";
    else timeString += " " + minutes + " Mins";
    timeString += " ]";

	if ($.inidb.get('settings', 'timetoggle') == "false") {
		timeString = ".";
	}
	
    $.say($.username.resolve(user) + " has " + points.toString() + " " + $.pointname + timeString);
}


$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var points_user = sender;
    var args;
    var points;
    
    points = $.inidb.get('points', points_user);

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }


    if (command.equalsIgnoreCase("points") || command.equalsIgnoreCase($.pointname) || command.equalsIgnoreCase("bank")) {
        if (args.length >=1) {
            var action = args[0];


            $var.perm_toggle = false;
            if ($.inidb.get('settings', 'perm_toggle') == 1) {
                $var.perm_toggle = true;
            } else if ($.inidb.get('settings', 'perm_toggle') == 2) {
                $var.perm_toggle = false;
            }

            if (action.equalsIgnoreCase("give") || action.equalsIgnoreCase("send") || action.equalsIgnoreCase("add")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.adminmsg);
                        return;
                    }
                }
            
                username = args[1].toLowerCase();
                points = parseInt(args[2]);
            
                if (points < 0){
                    $.say($.username.resolve(sender) + ", you can't send a negative amount.");
                    return;
                } else {
                    $.inidb.incr('points', username, points);
                    $.say(points + " " + $.pointname + " was sent to " + $.username.resolve(username) + ". New balance is: " + $.inidb.get('points', username.toLowerCase()) + " " + $.pointname + ".");
                }

            } else if (action.equalsIgnoreCase("take") || action.equalsIgnoreCase("withdraw")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.adminmsg);
                        return;
                    }
                }
            
                username = args[1].toLowerCase();
                points = parseInt(args[2]);
            
                if (points > $.inidb.get('points', username)) {
                    $.say($.username.resolve(sender) + ", why are you trying to take more than what" + $.username.resolve(username) + " has in " + $.pointname + "?");
                } else {
                    $.inidb.decr('points', username, points);
                    $.say(points + " " + $.pointname + " was withdrawn from " + $.username.resolve(username) + ". New balance is: " + $.inidb.get('points', username.toLowerCase()) + " " + $.pointname + ".");

                }

            } else if (action.equalsIgnoreCase("set")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.adminmsg);
                        return;
                    }
                }
            
                username = args[1].toLowerCase();
                points = parseInt(args[2]);
            
                if (points < 0) {
                    $.say($.username.resolve(sender) + ", you know very well you can't set someone's " + $.pointname + " to a negative number.");
                } else {
                    $.inidb.set('points', username, points);
                    $.say($.username.resolve(username) + "'s " + $.pointname + " were set to " + points + " " + $.pointname + ". New balance is: " + $.inidb.get('points', username.toLowerCase()) + " " + $.pointname + ".");
                }

            } else if (action.equalsIgnoreCase("gain")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if (args[1] < 0) {
                    $.say("That'll cause people to lose " + $.pointname + ". Don't use negatives!");
                    return;
                } else {
                    $.inidb.set('settings', 'pointgain', args[1]);
                    $.pointgain = parseInt(args[1]);

                    $.say(username + " has set the current point earnings to " + $.pointgain + " " + $.pointname + " every " + $.pointinterval + " minute(s) while stream is online.");
                }
            } else if (action.equalsIgnoreCase("offlinegain")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if (args[1] < 0) {
                    $.say("That'll cause people to lose " + $.pointname + ". Don't use negatives!");
                    return;
                } else {
                    $.inidb.set('settings', 'offlinegain', args[1]);
                    $.offlinegain = parseInt(args[1]);

                    $.say(username + " has set the offline point earnings to " + $.offlinegain + " " + $.pointname + " every " + $.offlineinterval + " minute(s) while stream is offline.");
                }
            } else if (action.equalsIgnoreCase("all")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say($.adminmsg);
                        return;
                    }
                }

                if (args[1] < 0) {
                    $.say($.username.resolve(sender) + " seems like you want to give everyone negative " + $.pointname + "!");
                    return;
                } else {
                    var name;
                    var i;
                    for (i = 0; i < $.users.length; i++) {
                        name = $.users[i][0];
                        $.inidb.incr('points', name.toLowerCase(), args[1]);
                    }
                    $.say(args[1] + " " + $.pointname + " has been sent to everyone in the channel!");
                }
            } else if (action.equalsIgnoreCase("bonus")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if (args[1] < 0) {
                    $.say("That'll cause people to lose " + $.pointname + ". Don't use negatives!")
                    return;
                } else {
                    $.inidb.set('settings', 'pointbonus', args[1]);
                    $.pointbonus = parseInt(args[1]);

                    $.say(username + " has set the current point bonus to " + $.pointbonus + " " + $.pointname + " per group level.");
                }

            } else if (action.equalsIgnoreCase("interval")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if (args[1] < 0) {
                    $.say("Can't set the interval with negative minutes.");
                    return;
                } else {
                    $.inidb.set('settings', 'pointinterval', args[1]);
                    $.pointinterval = parseInt(args[1]);

                    $.say(username + " has set the interval time for earning points to " + $.pointinterval + " minutes.");
                }

            } else if (action.equalsIgnoreCase("offlineinterval")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if (args[1] < 0) {
                    $.say("Can't set the interval with negative minutes.");
                    return;
                } else {
                    $.inidb.set('settings', 'offlineinterval', args[1]);
                    $.offlineinterval = parseInt(args[1]);

                    $.say(username + " has set the interval time for earning points to " + $.offlineinterval + " minutes while the stream is offline.");
                }

            } else if (action.equalsIgnoreCase("mingift")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if (args[1] < 0 || args[1] == null) {
					$.say("Usage: !points mingift <amount> - Sets the minimum amount of points that can be gifted to others. Must be 0 or higher.");
                    return;
                } else {
                    $.inidb.set('settings', 'mingift', args[1]);

                    $.say(username + " has set the minimum amount of " + $.pointname + " that can be gifted to: " + args[1] + " " + $.pointname + ".");
                }

            } else if (action.equalsIgnoreCase("name")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                $.inidb.set('settings', 'pointname', argsString2);
                $.say(username + " has changed the name of " + $.pointname + " to '" + argsString2 + "'!");

                $.pointname = argsString2;
            } else if (action.equalsIgnoreCase("toggle") && !argsString.isEmpty()) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if ($var.perm_toggle == false) {

                    $var.perm_toggle = true;
                    $.inidb.set('settings', 'perm_toggle', 1);
                    $.say("From now on Mods will be able to use privileged point commands!");

                } else if ($var.perm_toggle == true) {

                    $var.perm_toggle = false;
                    $.inidb.set('settings', 'perm_toggle', 2);
                    $.say("From now on only Admins will be able to use privileged point commands!");
                }
            } else if (action.equalsIgnoreCase("gain") || action.equalsIgnoreCase("bonus") || action.equalsIgnoreCase("interval") || action.equalsIgnoreCase("offlineinterval") || action.equalsIgnoreCase("name") || action.equalsIgnoreCase("config") ||  action.equalsIgnoreCase("mingift")) {
                $.say("[Point Settings] - [Name: " + $.pointname + "] - [Gain: " + $.pointgain + " " + $.pointname + "] - [Interval: " + $.pointinterval + " minutes] - [Offline Gain: " + $.offlinegain + " " + $.pointname + "] - [Offline interval: " + $.offlineinterval + " minutes] - [Bonus: " + $.pointbonus + " " + $.pointname + "] - [Gifting Minimum: " + $.mingift + "]");
            } else if (action.equalsIgnoreCase("help")) {
                $.say("Usage: '!points give <name> <amount>' -- '!points take <name> <amount>' -- '!points set <name> <amount>' -- '!points gift <name> <amount>' -- '!points gain <amount>' -- '!points bonus <amount>' -- '!points name <amount>'");
                return;
            } else {
                points_user = args[0].toLowerCase();
                $.getPoints(points_user);
            }
        }
        else {
            $.getPoints(points_user);
        }
    }
 
    if (command.equalsIgnoreCase("gift")) {
        username = args[0].toLowerCase();
        if (username == sender) {
            $.say("Why would you need to gift yourself DansGame?!");
            return;
        }

        if (points > $.inidb.get('points', sender)) {
            $.say($.username.resolve(sender) + ", you don't have that much points to gift to " + $.username.resolve(username) + "!");
            return;

        } else {
            if (args[1] < $.mingift) {
                $.say($.username.resolve(sender) + ", you can't gift " + $.pointname + " that's lower than the minimum amount! Minimum: " + $.mingift + " " + $.pointname + ".");
                return;
            } else if (points < args[1]){
                $.say($.username.resolve(sender) + ", you can't gift " + $.pointname + " what you don't have.");
                return;
            } else {
                $.inidb.decr('points', sender, points);
                $.inidb.incr('points', username, points);
                $.say(points + " " + $.pointname + " was gifted to " + $.username.resolve(username) + " by " + $.username.resolve(sender) + ".");
            }

        }
    }
         
});

$.setInterval(function() {
    var amount;
    if (!$.moduleEnabled("./systems/pointSystem.js")) {
        return;
    }

    if ($.lastpointinterval == null || $.lastpointinterval == undefined) {
        $.lastpointinterval = System.currentTimeMillis();
        return;
    }

    if (!$.isOnline($.channelName)) {
        amount = $.offlinegain;
        if ($.lastpointinterval + ($.offlineinterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    } else {
        amount = $.pointgain;
        if ($.lastpointinterval + ($.pointinterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();

        amount = amount + ($.pointbonus * $.getGroupPointMultiplier(nick));
        $.inidb.incr('points', nick, amount);
    }

    $.lastpointinterval = System.currentTimeMillis();
}, 1000);

$.registerChatCommand("./systems/pointSystem.js", "points");
$.registerChatCommand("./systems/pointSystem.js", "bank");
$.registerChatCommand("./systems/pointSystem.js", "points help");
