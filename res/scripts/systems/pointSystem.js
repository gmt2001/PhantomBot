$.pointname = $.inidb.get('settings', 'pointname');
$.pointgain = parseInt($.inidb.get('settings', 'pointgain'));
$.pointbonus = parseInt($.inidb.get('settings', 'pointbonus'));
$.pointinterval = parseInt($.inidb.get('settings', 'pointinterval'));

if ($.pointname == undefined || $.pointname == null || $.pointname.isEmpty()) {
    $.pointname = "Points";
}

if ($.pointgain == undefined || $.pointgain == null || isNaN($.pointgain) || $.pointgain < 0) {
    $.pointgain = 1;
}

if ($.pointbonus == undefined || $.pointbonus == null || isNaN($.pointbonus) || $.pointbonus < 0) {
    $.pointbonus = 0.5;
}

if ($.pointinterval == undefined || $.pointinterval == null || isNaN($.pointinterval) || $.pointinterval < 0) {
    $.pointinterval = 10;
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

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }


    if (command.equalsIgnoreCase("points") || command.equalsIgnoreCase($.pointname) || command.equalsIgnoreCase("bank")) {
            action = args[0];
        if (action == ("all") || action == ("gift") || action == ("give") || 
            action == ("take") || action == ("set") || action == ("gain") || 
            action == ("bonus") || action == ("interval") || action == ("name") || 
            action == ("help") || action == ("setting") || action == ("toggle") || action == ("config")) {

        } else { 


            if (args.length == 1) {
                points_user = args[0].toLowerCase();
            }

            points = $.inidb.get('points', points_user);

            var timeString = "";

            var time = $.inidb.get('time', points_user);

            if (points == null) points = 0;
            if (time == null) time = 0;

            var minutes = int((time / 60) % 60);
            var hours = int(time / 3600);

            timeString = " -- [";
            if (hours != 0) timeString += " " + hours + " Hrs";
            else if (minutes != 0) timeString += " " + minutes + " Mins";
            else timeString += " " + minutes + " Mins";
            timeString += " ]";

            $.say($.username.resolve(points_user) + " has " + int(points) + " " + $.pointname + timeString);
        }

    }

    if (command.equalsIgnoreCase("points") || command.equalsIgnoreCase($.pointname) || command.equalsIgnoreCase("bank")) {

        $var.perm_toggle = false;
        if ($.inidb.get('settings', 'perm_toggle') == 1) {
            $var.perm_toggle = true;
        } else if ($.inidb.get('settings', 'perm_toggle') == 2) {
            $var.perm_toggle = false;
        }

        action = args[0];
        if (args.length >= 1) {
        if (action.equalsIgnoreCase("toggle") && !argsString.isEmpty()) {
            if (!$.isAdmin(sender)) {
                $.say("You must be an Administrator to use that command, " + username + "!");
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

        }
        }


        if (args.length >= 3) {

            action = args[0];
            username = args[1].toLowerCase();
            points = int(args[2]);

            if (action.equalsIgnoreCase("give")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say("You must be an Administrator to use that command, " + username + "!");
                        return;
                    }
                }
                if (points < 0) {
                    $.say($.username.resolve(sender) + " seems like you want to TAKE " + $.username.resolve(username) + "'s " + $.pointname + " instead of giving them. NO NEGATIVES DAMNIT!");
                    return;
                } else {
                    $.inidb.incr('points', username, points);
                    $.say(points + " " + $.pointname + " was sent to " + $.username.resolve(username) + ".");
                }


            } else if (action.equalsIgnoreCase("take")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say("You must be an Administrator to use that command, " + username + "!");
                        return;
                    }
                }
                if (points > $.inidb.get('points', username)) {
                    $.say($.username.resolve(sender) + ", why are you trying to take more than what" + $.username.resolve(username) + " has in " + $.pointname + "?");
                } else {
                    $.inidb.decr('points', username, points);
                    $.say(points + " " + $.pointname + " was withdrawn from " + $.username.resolve(username) + ".");

                }

            } else if (action.equalsIgnoreCase("set")) {
                if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say("You must be an Administrator to use that command, " + username + "!");
                        return;
                    }
                }
                if (points < 0) {
                    $.say($.username.resolve(sender) + ", you know very well you can't set someone's " + $.pointname + " to a negative number.");
                } else {
                    $.inidb.set('points', username, points);
                    $.say($.username.resolve(username) + "'s " + $.pointname + " was set to " + points + " " + $.pointname + ".");
                }

            } else if (action.equalsIgnoreCase("gift")) {
                if (username == sender) {
                    $.say("Why would you need to gift yourself DansGame?!");
                    return;
                }

                if (points > $.inidb.get('points', sender)) {
                    $.say($.username.resolve(sender) + ", you don't have that much points to gift to " + $.username.resolve(username) + "!");
                    return;

                } else {
                    if (points < 0) {
                        $.say($.username.resolve(sender) + ", seems like you want to take " + $.username.resolve(username) + "'s " + $.pointname + " instead of giving them. NO NEGATIVES DAMNIT!");
                        return;
                    } else {
                        $.inidb.decr('points', sender, points);
                        $.inidb.incr('points', username, points);
                        $.say(points + " " + $.pointname + " was gifted to " + $.username.resolve(username) + " by " + $.username.resolve(sender) + ".");
                    }

                }

            }

        } else {
            if (!argsString.isEmpty() && action.equalsIgnoreCase("help")) {
                $.say("Usage: '!points give <name> <amount>' -- '!points take <name> <amount>' -- '!points set <name> <amount>' -- '!points gift <name> <amount>' -- '!points gain <amount>' -- '!points bonus <amount>' -- '!points name <amount>'");
                return;
            }

        }

        if (args.length >= 2) {

            points = $.inidb.get('points', points_user);
            action = args[0];
            var name = argsString2;

            if (action.equalsIgnoreCase("gain")) {
                if (!$.isAdmin(sender)) {
                    $.say("You must be an Administrator to use that command, " + username + "!");
                    return;
                }

                if (args[1] < 0) {
                    $.say("That'll cause people to lose " + $.pointname + ". Don't use negatives!");
                    return;
                } else {
                    $.inidb.set('settings', 'pointgain', args[1]);
                    $.pointgain = parseInt(args[1]);

                    $.say(username + " has set the current point earnings to " + $.pointgain + " " + $.pointname + " every " + $.pointinterval + " minutes.");
                }
            }

            if (action.equalsIgnoreCase("all")) {
               if ($var.perm_toggle == true) {
                    if (!$.isMod(sender)) {
                        $.say("You must be an Moderator to use that command, " + username + "!");
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender)) {
                        $.say("You must be an Administrator to use that command, " + username + "!");
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
            }

            if (action.equalsIgnoreCase("bonus")) {
                if (!$.isAdmin(sender)) {
                    $.say("You must be an Administrator to use that command, " + username + "!");
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

            }

            if (action.equalsIgnoreCase("interval")) {
                if (!$.isAdmin(sender)) {
                    $.say("You must be an Administrator to use that command, " + username + "!");
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

            }

            if (action.equalsIgnoreCase("name")) {
                if (!$.isAdmin(sender)) {
                    $.say("You must be an Administrator to use that command, " + username + "!");
                    return;
                }

                $.inidb.set('settings', 'pointname', name);
                $.say(username + " has changed the name of " + $.pointname + " to '" + name + "'!");

                $.pointname = name;
            }

        } else {
            actions = args[0];
            if (!argsString.isEmpty() && action == ("gain") || action == ("bonus") || action == ("interval") || action == ("name") || action == ("config")) {
                $.say("[Point Settings] - [Name: " + $.pointname + "] - [Gain: " + $.pointgain + " " + $.pointname + "] - [Interval: " + $.pointinterval + " minutes] - [Bonus: " + $.pointbonus + " " + $.pointname + "]");
            }

        }
    }

});

$api.setInterval($script, function() {
    if (!$.moduleEnabled("./systems/pointSystem.js")) {
        return;
    }

    if ($.lastpointinterval == null || $.lastpointinterval == undefined) {
        $.lastpointinterval = System.currentTimeMillis();
        return;
    }

    if ($.lastpointinterval + ($.pointinterval * 60 * 1000) >= System.currentTimeMillis()) {
        return;
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();
        var amount = $.pointgain;

        amount = amount + ($.pointbonus * $.getUserGroupId(nick));

        $.inidb.incr('points', nick, amount);
    }

    $.lastpointinterval = System.currentTimeMillis();
}, 1000);

$.registerChatCommand("./systems/pointSystem.js", "points");
$.registerChatCommand("./systems/pointSystem.js", "bank");
$.registerChatCommand("./systems/pointSystem.js", "points help");
