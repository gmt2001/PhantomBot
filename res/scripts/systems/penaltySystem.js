$.stopPoints = function(user) {
    var penaltyPoints = parseInt($.inidb.get('penalty', user.toLowerCase() + "_points"));
    var penaltyPointsCount = (isNaN(penaltyPoints)) ? 0 : penaltyPoints;

    var penaltyUserPoints = parseInt($.inidb.get('penalty', user.toLowerCase() + "_pointscount"));
    var penaltyUserPointsCount = (isNaN(penaltyUserPoints)) ? 0 : penaltyUserPoints;

    var userPoints = parseInt($.inidb.get('points', user.toLowerCase()));
    var userPointsCount = (isNaN(userPoints)) ? 0 : userPoints;

    if ($.isOnline($.channelName)) {
        var pointsGain = parseInt($.inidb.get('settings', 'pointGain'));
        var pointsGainCount = (isNaN(pointsGain)) ? 1 : pointsGain;
    } else {
        var pointsGain = parseInt($.inidb.get('settings', 'pointGainOffline'));
        var pointsGainCount = (isNaN(pointsGain)) ? 1 : pointsGain;
    }

    if (penaltyUserPointsCount == 0) {
        $.inidb.set('penalty', user + "_pointscount", userPointsCount);
        penaltyUserPointsCount = userPointsCount;
    }

    $.inidb.set('penalty', user + "_points", penaltyPointsCount + pointsGainCount);
    $.inidb.set('points', user, penaltyUserPointsCount);
}

$.returnPoints = function(user) {
    var penaltyPoints = parseInt($.inidb.get('penalty', user.toLowerCase() + "_points"));
    var penaltyPointsCount = (isNaN(penaltyPoints)) ? 0 : penaltyPoints;

    var penaltyUserPoints = parseInt($.inidb.get('penalty', user.toLowerCase() + "_pointscount"));
    var penaltyUserPointsCount = (isNaN(userPoints)) ? 0 : userPoints;

    var userPoints = parseInt($.inidb.get('points', user.toLowerCase()));
    var userPointsCount = (isNaN(userPoints)) ? 0 : userPoints;

    if (penaltyUserPointsCount == 0) {
        $.inidb.set('penalty', user + "_pointscount", userPointsCount);
        penaltyUserPointsCount = userPointsCount;
    }

    $.inidb.set('penalty', user + "_points", 0);
    $.inidb.set('points', user, penaltyUserPointsCount + penaltyPointsCount);
}

$.getPointsString = function (points) {
    points = parseInt(points);
    var pointsString;

    if (points == 1) {
        pointsString = points + " " + $.inidb.get('settings', 'pointNameSingle');
    } else {
        pointsString = points + " " + $.inidb.get('settings', 'pointNameMultiple');
    }

    return pointsString;
}

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("penalty")) {
        if (!$.moduleEnabled("./systems/pointSystem.js")) {
            $.say($.lang.get("net.phantombot.penaltysystem.points-disabled"));
            return;
        }

        if (args.length == 0) {
            if ($.inidb.get('penalty', sender.toLowerCase()) == null || $.inidb.get('penalty', sender.toLowerCase()) == "false") {
                $.say($.lang.get("net.phantombot.penaltysystem.get-nopenalty"));
                return;
            } else {
                if (parseInt($.inidb.get('penalty', sender.toLowerCase() + "_threshold")) == -1) {
                    $.say($.lang.get("net.phantombot.penaltysystem.get-penalty-indefinitely", $.inidb.get('settings', 'pointNameMultiple'), "Moderator"));
                    return;
                } else {
                    $.say($.lang.get("net.phantombot.penaltysystem.get-penalty", $.inidb.get('settings', 'pointNameMultiple'), getPointsString(parseInt($.inidb.get('penalty', sender + "_threshold")))));
                    return;
                }
            }
        } else if (args.length == 1) {
            if ($.inidb.get("visited", args[0].toLowerCase()) == "visited") {
                if (!$.isModv3(sender, event.getTags())) {
                    if ($.inidb.get('penalty', args[0].toLowerCase()) == null || $.inidb.get('penalty', args[0].toLowerCase()) == "false") {
                        $.say($.lang.get("net.phantombot.penaltysystem.get-other-nopenalty", $.username.resolve(args[0].toLowerCase())));
                        return;
                    } else {
                        if (parseInt($.inidb.get('penalty', args[0].toLowerCase() + "_threshold")) == -1) {
                            $.say($.lang.get("net.phantombot.penaltysystem.get-other-penalty-indefinitely", $.username.resolve(args[0].toLowerCase()), $.inidb.get('settings', 'pointNameMultiple'), "Moderator"));
                            return;
                        } else {
                            $.say($.lang.get("net.phantombot.penaltysystem.get-other-penalty", $.username.resolve(args[0].toLowerCase()), $.inidb.get('settings', 'pointNameMultiple'), getPointsString(parseInt($.inidb.get('penalty', args[0].toLowerCase() + "_threshold")))));
                            return;
                        }
                    }
                } else {
                    if ($.inidb.get('penalty', args[0].toLowerCase()) == null || $.inidb.get('penalty', args[0].toLowerCase()) == "false") {
                        var penaltyPoints = parseInt($.inidb.get('penalty', args[0].toLowerCase() + "_points"));
                        var penaltyPointsCount = (isNaN(penaltyPoints)) ? 0 : penaltyPoints;

                        var userPoints = parseInt($.inidb.get('points', args[0].toLowerCase()));
                        var userPointsCount = (isNaN(userPoints)) ? 0 : userPoints;

                        $.inidb.set('penalty', args[0].toLowerCase(), "true");
                        $.inidb.set('penalty', args[0].toLowerCase() + "_points", penaltyPointsCount);
                        $.inidb.set('penalty', args[0].toLowerCase() + "_pointscount", userPointsCount);
                        $.inidb.set('penalty', args[0].toLowerCase() + "_threshold", -1);

                        $.say($.lang.get("net.phantombot.penaltysystem.set-enabled-indefinitely", $.username.resolve(args[0]), $.inidb.get('settings', 'pointNameMultiple'), "Moderator"));
                        return;
                    } else {
                        $.returnPoints(args[0].toLowerCase());

                        $.inidb.set('penalty', args[0].toLowerCase(), "false");
                        $.inidb.set('penalty', args[0].toLowerCase() + "_points", 0);
                        $.inidb.set('penalty', args[0].toLowerCase() + "_pointscount", 0);
                        $.inidb.set('penalty', args[0].toLowerCase() + "_threshold", 0);

                        $.say($.lang.get("net.phantombot.penaltysystem.set-disabled", $.username.resolve(args[0].toLowerCase())));
                        return;
                    }
                }
            } else {
                $.say($.lang.get("net.phantombot.common.user-404", $.username.resolve(args[0].toLowerCase())));
                return;
            }
        } else if (args.length == 2 && !isNaN(parseInt(args[1]))) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.modmsg);
                return;
            }

            if ($.inidb.get("visited", args[0].toLowerCase()) == "visited") {
                // Instead of disabling when a penalty is running (old version), we want to always update the _threshold to args[1].

                var penaltyPoints = parseInt($.inidb.get('penalty', args[0].toLowerCase() + "_points"));
                var penaltyPointsCount = (isNaN(penaltyPoints)) ? 0 : penaltyPoints;

                var userPoints = parseInt($.inidb.get('points', args[0].toLowerCase()));
                var userPointsCount = (isNaN(userPoints)) ? 0 : userPoints;

                $.inidb.set('penalty', args[0].toLowerCase(), "true");
                $.inidb.set('penalty', args[0].toLowerCase() + "_points", penaltyPointsCount);
                $.inidb.set('penalty', args[0].toLowerCase() + "_pointscount", userPointsCount);
                $.inidb.set('penalty', args[0].toLowerCase() + "_threshold", args[1]);

                $.say($.lang.get("net.phantombot.penaltysystem.set-enabled-threshold", $.username.resolve(args[0].toLowerCase()), $.inidb.get('settings', 'pointNameMultiple'), getPointsString(parseInt($.inidb.get('penalty', args[0].toLowerCase() + "_threshold")))));
                return;
            } else {
                $.say($.lang.get("net.phantombot.common.user-404", $.username.resolve(args[0].toLowerCase())));
                return;
            }
        } else {
            $.say($.lang.get("net.phantombot.penaltysystem.usage"));
            return;
        }
    }
});

$.timer.addTimer("./systems/penaltySystem.js", "penaltySystem", true, function() {
    if (!$.moduleEnabled("./systems/pointSystem.js")) {
        // No spammerino, pleaserino.
        return;
    }

    if ($.penlastpointinterval == null || $.penlastpointinterval == undefined) {
        $.penlastpointinterval = System.currentTimeMillis();
        return;
    }

    if (!$.isOnline($.channelName)) {
        if ($.penlastpointinterval + (parseInt($.inidb.get('settings', 'pointIntervalOffline')) * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        } else {
            $.penlastpointinterval = System.currentTimeMillis();
        }
    } else {
        if ($.penlastpointinterval + (parseInt($.inidb.get('settings', 'pointInterval')) * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        } else {
            $.penlastpointinterval = System.currentTimeMillis();
        }
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();

        if ($.inidb.get('penalty', nick) == "true") {
            $.stopPoints(nick);

            var penaltypoints = parseInt($.inidb.get('penalty', nick + "_points"));
            var penaltythreshold = parseInt($.inidb.get('penalty', nick + "_threshold"));

            if (penaltythreshold < 0) {
                return;
            }
            
            if (penaltypoints >= penaltythreshold && $.inidb.get('penalty', nick) == "true") {
                $.returnPoints(nick);

                $.inidb.set('penalty', nick, "false");
                $.inidb.set('penalty', nick + "_points", 0);
                $.inidb.set('penalty', nick + "_pointscount", 0);
                $.inidb.set('penalty', nick + "_threshold", 0);

                $.say($.lang.get("net.phantombot.penaltysystem.lifted", $.username.resolve(nick), getPointsString(penaltypoints)));
            }
        }
    }
}, 1000);

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/penaltySystem.js')) {
        $.registerChatCommand("./systems/penaltySystem.js", "penalty");
    }
}, 10 * 1000);
