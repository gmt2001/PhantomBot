$.pointNameSingle = $.inidb.get('settings', 'pointNameSingle');
$.pointNameMultiple = $.inidb.get('settings', 'pointNameMultiple');
$.pointGain = parseInt($.inidb.get('settings', 'pointGain'));
$.pointGainOffline = parseInt($.inidb.get('settings', 'pointGainOffline'));
$.pointBonus = parseInt($.inidb.get('settings', 'pointBonus'));
$.pointInterval = parseInt($.inidb.get('settings', 'pointInterval'));
$.pointIntervalOffline = parseInt($.inidb.get('settings', 'pointIntervalOffline'));
$.pointGiftMin = parseInt($.inidb.get('settings', 'pointGiftMin'));
$.whisperPoints = $.inidb.get("settings", "whisperPoints");
$.permTogglePoints = $.inidb.get("settings", "permTogglePoints");

if ($.pointNameSingle == undefined || $.pointNameSingle == null || $.pointNameSingle.isEmpty()) {
    $.pointNameSingle = "point";
}

if ($.pointNameMultiple == undefined || $.pointNameMultiple == null || $.pointNameMultiple.isEmpty()) {
    $.pointNameMultiple = "points";
}


if ($.pointGain == undefined || $.pointGain == null || isNaN($.pointGain) || $.pointGain < 0) {
    $.pointGain = 1;
}

if ($.pointGainOffline == undefined || $.pointGainOffline == null || isNaN($.pointGainOffline) || $.pointGainOffline < 0) {
    $.pointGainOffline = 1;
}

if ($.pointBonus == undefined || $.pointBonus == null || isNaN($.pointBonus) || $.pointBonus < 0) {
    $.pointBonus = 0.5;
}

if ($.pointInterval == undefined || $.pointInterval == null || isNaN($.pointInterval) || $.pointInterval < 0) {
    $.pointInterval = 10;
}

if ($.pointIntervalOffline == undefined || $.pointIntervalOffline == null || isNaN($.pointIntervalOffline) || $.pointIntervalOffline < 0) {
    $.pointIntervalOffline = 10;
}

if ($.pointGiftMin == undefined || $.pointGiftMin == null || isNaN($.pointGiftMin) || $.pointGiftMin < 0) {
    $.pointGiftMin = 10;
}

if ($.whisperPoints == undefined || $.whisperPoints == null) {
    $.whisperPoints = "false";
}

if ($.permTogglePoints == undefined || $.permTogglePoints == null) {
    $.permTogglePoints = "false";
}

$.getWhisperString = function (sender) {
    // TODO: Incorporate $.whisper once it is available.
    if ($.whisperPoints == "true") {
        return "/w " + sender + " ";
    } else {
        return "";
    }
}

$.getPoints = function (user) {
    var points = $.inidb.get('points', user.toLowerCase());
    if (points == null)
        points = 0;

    return points;
}

$.getPointsString = function (points) {
    points = parseInt(points);
    var pointsString = "";

    if (points == 1) {
        pointsString += points.toString() + " " + $.pointNameSingle;
    } else {
        pointsString += points.toString() + " " + $.pointNameMultiple;
    }

    return pointsString;
}

$.getUserTime = function (user) {
    // "getUserTime" instead of "getTime" to prevent issues with the "real" function.
    var time = $.inidb.get('time', user.toLowerCase());
    if (time == null)
        time = 0;

    return time;
}

$.getTimeEnabled = function () {
    if ($.moduleEnabled('./systems/timeSystem.js')) {
        if ($.inidb.get('settings', 'timetoggle') == "false") {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
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
        return "0s";
    }

    return timeString;
}


$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var pointsUser = sender;
    var args;
    var points;

    var noPointsString = $.getPointsString(0);
    var getPointsStringResult;
    var getTimeStringResult;

    points = $.inidb.get('points', pointsUser);

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("points") || command.equalsIgnoreCase($.pointNameSingle) || command.equalsIgnoreCase($.pointNameMultiple)) {
        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("give") || action.equalsIgnoreCase("send") || action.equalsIgnoreCase("add")) {
                if ($.permTogglePoints == "true") {
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
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.give-usage"));
                    return;
                }

                username = args[1].toLowerCase();
                points = parseInt(args[2]);

                if (points < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.give-error-negative", $.pointNameMultiple));
                    return;
                } else {
                    if ($.inidb.get("visited", username.toLowerCase()) == "visited") {
                        $.inidb.incr('points', username.toLowerCase(), points);

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.give-success", $.getPointsString(points), $.username.resolve(username), $.getPointsString($.inidb.get('points', username.toLowerCase()))));
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("take") || action.equalsIgnoreCase("withdraw")) {
                if ($.permTogglePoints == "true") {
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
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.take-usage"));
                    return;
                }

                username = args[1].toLowerCase();
                points = parseInt(args[2]);

                if (points > $.inidb.get('points', username.toLowerCase())) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.take-error-toomuch", $.username.resolve(username), $.pointNameMultiple));
                    return;
                } else {
                    if ($.inidb.get("visited", username.toLowerCase()) == "visited") {
                        $.inidb.decr('points', username.toLowerCase(), points);

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.take-success", $.getPointsString(points), $.username.resolve(username), $.getPointsString($.inidb.get('points', username.toLowerCase()))))
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("set")) {
                if ($.permTogglePoints == "true") {
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
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.set-usage"));
                    return;
                }

                username = args[1].toLowerCase();
                points = parseInt(args[2]);

                if (points < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.set-error-negative", $.pointNameMultiple));
                    return;
                } else {
                    if ($.inidb.get("visited", username.toLowerCase()) == "visited") {
                        $.inidb.set('points', username.toLowerCase(), points);

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.set-success", $.pointNameSingle, $.username.resolve(username), $.getPointsString($.inidb.get('points', username.toLowerCase()))));
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("gain")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gain-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gain-error-negative", $.pointNameMultiple));
                    return;
                } else {
                    $.inidb.set('settings', 'pointGain', args[1]);
                    $.pointGain = parseInt($.inidb.get('settings', 'pointGain'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gain-success", $.pointNameSingle, $.getPointsString($.pointGain), $.pointInterval));
                    return;
                }
            } else if (action.equalsIgnoreCase("offlinegain")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gain-offline-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gain-offline-error-negative", $.pointNameMultiple));
                    return;
                } else {
                    $.inidb.set('settings', 'pointGainOffline', args[1]);
                    $.pointGainOffline = parseInt($.inidb.get('settings', 'pointGainOffline'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gain-offline-success", $.pointNameSingle, $.getPointsString($.pointGainOffline), $.pointIntervalOffline));
                    return;
                }
            } else if (action.equalsIgnoreCase("all")) {
                if ($.permTogglePoints == "true") {
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

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.give-all-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.give-all-error-negative", $.pointNameMultiple));
                    return;
                } else {
                    var name;
                    var i;

                    for (i = 0; i < $.users.length; i++) {
                        name = $.users[i][0];
                        $.inidb.incr('points', name.toLowerCase(), args[1]);
                    }

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.give-all-success", $.getPointsString(args[1])));
                    return;
                }
            } else if (action.equalsIgnoreCase("bonus")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.bonus-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.bonus-error-negative", $.pointNameMultiple));
                    return;
                } else {
                    $.inidb.set('settings', 'pointBonus', args[1]);
                    $.pointBonus = parseInt($.inidb.get('settings', 'pointBonus'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.bonus-success", $.pointNameSingle, $.getPointsString($.pointBonus)));
                    return;
                }
            } else if (action.equalsIgnoreCase("interval")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.interval-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.interval-error-negative", $.pointNameSingle));
                    return;
                } else {
                    $.inidb.set('settings', 'pointInterval', args[1]);
                    $.pointInterval = parseInt($.inidb.get('settings', 'pointInterval'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.interval-success", $.pointNameSingle, $.pointInterval));
                    return;
                }
            } else if (action.equalsIgnoreCase("offlineinterval")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.interval-offline-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.interval-offline-error-negative", $.pointNameSingle));
                    return;
                } else {
                    $.inidb.set('settings', 'pointIntervalOffline', args[1]);
                    $.pointIntervalOffline = parseInt($.inidb.get('settings', 'pointIntervalOffline'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.interval-offline-success", $.pointNameSingle, $.pointIntervalOffline));
                    return;
                }
            } else if (action.equalsIgnoreCase("mingift")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.mingift-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.mingift-error-negative", $.pointNameSingle));
                    return;
                } else {
                    $.inidb.set('settings', 'pointGiftMin', args[1]);
                    $.pointGiftMin = parseInt($.inidb.get('settings', 'pointGiftMin'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.mingift-success", $.pointNameMultiple, $.getPointsString($.pointGiftMin)));
                    return;
                }
            } else if (action.equalsIgnoreCase("name")) {
                // This will need updated documentation.
                // Added support for setting both "points" and "point" names.
                // To keep things clear for the end user, notify them of a way to customize the opposite name.
                // Example: When editing "points", show a way to edit "point" as well.

                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                // Only check for null here, do not just return usage, usage is handled in code below.
                // Every path has a return, so we should not need any additional usage handling.
                if (args[1] != null) {
                    var firstArgString = args[1].toString();
                }
                if (args[2] != null) {
                    //var secondArgString = args[2].toString();
                    var argsString = event.getArguments().trim();
                    var secondArgString = argsString.substring(argsString.indexOf(args[2].toString()), argsString.length());
                }

                if (args[1] == null) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.name-usage"));
                    return;
                } else if (firstArgString.toLowerCase() == "single") {
                    if (args[2] != null) {
                        $.inidb.set('settings', 'pointNameSingle', secondArgString);
                        $.pointNameSingle = $.inidb.get('settings', 'pointNameSingle');

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.name-success-single", $.pointNameSingle, $.pointNameSingle, secondArgString, $.pointNameMultiple));
                        return;
                    } else {
                        $.inidb.set('settings', 'pointNameMultiple', firstArgString);
                        $.pointNameMultiple = $.inidb.get('settings', 'pointNameMultiple');

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.name-success-multiple", $.pointNameMultiple, $.pointNameMultiple, firstArgString, $.pointNameSingle));
                        return;
                    }
                } else if (firstArgString.toLowerCase() == "multiple" || firstArgString.toLowerCase() == "multi") {
                    if (args[2] != null) {
                        $.inidb.set('settings', 'pointNameMultiple', secondArgString);
                        $.pointNameMultiple = $.inidb.get('settings', 'pointNameMultiple');

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.name-success-multiple", $.pointNameMultiple, $.pointNameMultiple, secondArgString, $.pointNameSingle));
                        return;
                    } else {
                        $.inidb.set('settings', 'pointNameMultiple', firstArgString);
                        $.pointNameMultiple = $.inidb.get('settings', 'pointNameMultiple');

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.name-success-multiple", $.pointNameMultiple, $.pointNameMultiple, firstArgString, $.pointNameSingle));
                        return;
                    }
                } else {
                    // Special case: The old way of setting points' name.
                    // To combat the change, update both the single and multiple.
                    // Also notify the user of a way to set a single point's name.

                    $.inidb.set('settings', 'pointNameSingle', firstArgString);
                    $.inidb.set('settings', 'pointNameMultiple', firstArgString);
                    $.pointNameSingle = $.inidb.get('settings', 'pointNameSingle');
                    $.pointNameMultiple = $.inidb.get('settings', 'pointNameMultiple');
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.name-success-both", $.pointNameMultiple, $.pointNameMultiple, firstArgString, $.pointNameSingle));
                    return;
                }
            } else if (action.equalsIgnoreCase("reset")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                $.inidb.RemoveFile("points");
                $.inidb.ReloadFile("points");

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.reset-success", $.pointNameMultiple));
                return;
            } else if (action.equalsIgnoreCase("toggle")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if ($.permTogglePoints == "false") {
                    $.inidb.set('settings', 'permTogglePoints', "true");
                    $.permTogglePoints = $.inidb.get('settings', 'permTogglePoints');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.toggle-success", "Moderator"));
                    return;
                } else if ($.permTogglePoints == "true") {
                    $.inidb.set('settings', 'permTogglePoints', "false");
                    $.permTogglePoints = $.inidb.get('settings', 'permTogglePoints');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.toggle-success", "Administrator"));
                    return;
                }
            } else if (action.equalsIgnoreCase("timetoggle") || action.equalsIgnoreCase("toggletime")) {
                if (!$.isAdmin(sender)) {
                    return;
                }

                if ($.getTimeEnabled() == false) {
                    $.inidb.set('settings', 'pointTimeToggle', "false");

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.time-disabled"));
                    return;
                }

                if ($.pointTimeToggle == "false") {
                    $.inidb.set('settings', 'pointTimeToggle', "true");
                    $.pointTimeToggle = $.inidb.get('settings', 'pointTimeToggle');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.timetoggle-enabled", $.pointNameSingle));
                    return;
                } else if ($.pointTimeToggle == "true") {
                    $.inidb.set('settings', 'pointTimeToggle', "false");
                    $.pointTimeToggle = $.inidb.get('settings', 'pointTimeToggle');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.timetoggle-disabled", $.pointNameSingle));
                    return;
                }
            } else if (action.equalsIgnoreCase("config")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.config", $.pointNameSingle, $.pointNameMultiple, $.getPointsString($.pointGain), $.getPointsString($.pointGainOffline), $.pointInterval, $.pointIntervalOffline, $.getPointsString($.pointBonus), $.getPointsString($.pointGiftMin)));
                return;
            } else if (action.equalsIgnoreCase("help")) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.help"));
                return;
            } else {
                pointsUser = args[0].toLowerCase();

                getPointsStringResult = $.getPointsString($.getPoints(pointsUser));
                getTimeStringResult = $.getTimeString($.getUserTime(pointsUser));

                if ($.inidb.get("visited", pointsUser.toLowerCase()) == "visited") {
                    if (pointsUser == sender) {
                        if (noPointsString == getPointsStringResult) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-self-nopoints", $.pointNameMultiple));
                            return;
                        } else {
                            if ($.getTimeEnabled() == true && getTimeStringResult != "false" && getTimeStringResult != false) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-self-time", getPointsStringResult, getTimeStringResult));
                                return;
                            } else {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-self", getPointsStringResult));
                                return;
                            }
                        }
                    } else {
                        if (noPointsString == getPointsStringResult) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-other-nopoints", $.username.resolve(pointsUser), $.pointNameMultiple));
                            return;
                        } else {
                            if ($.getTimeEnabled() == true && getTimeStringResult != "false" && getTimeStringResult != false) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-other-time", $.username.resolve(pointsUser), getPointsStringResult, getTimeStringResult));
                                return;
                            } else {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-other", $.username.resolve(pointsUser), getPointsStringResult));
                                return;
                            }
                        }
                    }
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(pointsUser)));
                    return;
                }
            }
        }
        else {
            getPointsStringResult = $.getPointsString($.getPoints(pointsUser));
            getTimeStringResult = $.getTimeString($.getUserTime(pointsUser));

            if (noPointsString == getPointsStringResult) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-self-nopoints", $.pointNameMultiple));
                return;
            } else {
                if ($.getTimeEnabled() == true && getTimeStringResult != "false" && getTimeStringResult != false) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-self-time", getPointsStringResult, getTimeStringResult));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.get-self", getPointsStringResult));
                    return;
                }
            }
        }
    }

    if (command.equalsIgnoreCase("makeitrain")) {
        if (args[0] == null || isNaN(parseInt(args[0]))) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.makeitrain-usage"));
            return;
        }

        if (args[0] > $.inidb.get('points', sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.makeitrain-error-notenough", $.getPointsString(args[0])));
            return;
        }

        if (args[0] < 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.makeitrain-error-negative", $.pointNameMultiple));
            return;
        } else if ($.users.length < 5 || args[0] < $.users.length + 1) {
            // In order to prevent point duplication, require a minimum of coins based on amount of users, and add 1 to that.
            // Also, to prevent possible weird calculations, limit makeitrains to $.users.length > 5.
            // If this is not used, it is possible for users to do "!makeitrain 1" to boost another user.
            // If we wish to remove this protection, simply remove this entire else if.

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.makeitrain-error-invalid", $.getPointsString(args[0])));
            return;
        } else {
            $.inidb.decr('points', sender, args[0]);
            var name;
            var i;
            var reward = args[0] / ($.users.length);

            for (i = 0; i < $.users.length; i++) {
                name = $.users[i][0];
                $.inidb.incr('points', name.toLowerCase(), reward.toFixed(0));
            }

            $.inidb.decr('points', sender, reward.toFixed(0));
            $.say($.lang.get("net.phantombot.pointsystem.makeitrain-success", username, $.getPointsString(args[0]), $.getPointsString(reward.toFixed(0))));
            return;
        }
    }

    if (command.equalsIgnoreCase("gift") || command.equalsIgnoreCase("transfer")) {
        if (args[0] == null || args[1] == null || isNaN(parseInt(args[1]))) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-usage"));
            return;
        }

        username = args[0].toLowerCase();

        if (args[1] < 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-error-negative", $.pointNameMultiple));
            return;
        }

        if (username == sender) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-error-toself", $.pointNameMultiple));
            return;
        }

        if (points > $.inidb.get('points', sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-error-notenough", $.getPointsString(args[1]), $.username.resolve(args[0])));
            return;
        } else {
            if (parseInt(args[1]) < $.pointGiftMin) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-error-notminimum", $.getPointsString($.pointGiftMin)));
                return;
            } else if (points < parseInt(args[1])) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-error-notenough", $.getPointsString(args[1]), $.username.resolve(args[0])));
                return;
            } else {
                if ($.inidb.get("visited", username.toLowerCase()) == "visited") {
                    $.inidb.decr('points', sender.toLowerCase(), parseInt(args[1]));
                    $.inidb.incr('points', username.toLowerCase(), parseInt(args[1]));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.pointsystem.gift-success", $.getPointsString(args[1]), $.username.resolve(args[0]), $.getPointsString($.inidb.get('points', $.username.resolve(args[0]).toLowerCase())), $.getPointsString($.inidb.get('points', sender.toLowerCase()))));
                    $.say($.getWhisperStringStatic(args[0]) + $.lang.get("net.phantombot.pointsystem.gift-received", $.getPointsString(args[1]), $.username.resolve(sender), $.getPointsString($.inidb.get('points', $.username.resolve(args[0]).toLowerCase())), $.getPointsString($.inidb.get('points', sender.toLowerCase()))));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(username)));
                    return;
                }
            }
        }
    }
});

$.timer.addTimer("./systems/pointSystem.js", "pointsystem", true, function () {
    var amount;
    if (!$.moduleEnabled("./systems/pointSystem.js")) {
        return;
    }

    if ($.lastpointInterval == null || $.lastpointInterval == undefined) {
        $.lastpointInterval = System.currentTimeMillis();
        return;
    }

    if (!$.isOnline($.channelName)) {
        amount = $.pointGainOffline;
        if ($.lastpointInterval + ($.pointIntervalOffline * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    } else {
        amount = $.pointGain;
        if ($.lastpointInterval + ($.pointInterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    }

    var points = 0;
    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();

        points = amount + ($.pointBonus * $.getGroupPointMultiplier(nick));
        $.inidb.incr('points', nick, points);
    }

    $.lastpointInterval = System.currentTimeMillis();
}, 60 * 1000);

setTimeout(function () {
    if ($.moduleEnabled('./systems/pointSystem.js')) {
        $.registerChatCommand("./systems/pointSystem.js", "points");
        $.registerChatCommand("./systems/pointSystem.js", "makeitrain");
        $.registerChatCommand("./systems/pointSystem.js", "whisperpoints", "mod");
    }
}, 10 * 1000);
