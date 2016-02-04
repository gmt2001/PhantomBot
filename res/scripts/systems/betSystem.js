$.betMinimum = parseInt($.inidb.get('settings', 'bet_minimum'));
$.betMaximum = parseInt($.inidb.get('settings', 'bet_maximum'));
$.betLength = parseInt($.inidb.get('settings', 'bet_length'));

if ($.betMinimum == undefined || $.betMinimum == null || isNaN($.betMinimum) || $.betMinimum < 0) {
    $.betMinimum = 0;
}

if ($.betMaximum == undefined || $.betMaximum == null || isNaN($.betMaximum) || $.betMaximum < 0) {
    $.betMaximum = 50;
}

if ($.betLength == undefined || $.betLength == null || isNaN($.betLength) || $.betLength < 0) {
    $.betLength = 180;
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;

    var bet = 0;
    var betTotal = 0;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("bet")) {
        if (!$.moduleEnabled("./systems/pointSystem.js")) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.points-disabled"));
            return;
        }

        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("open") || action.equalsIgnoreCase("start")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                if ($.betRunning == true) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.start-error-running"));
                    return;
                } else {
                    $.betEntries = 0;
                    $.betOptions = [];
                    $.betTable = [];
                    $.betPot = 0;
                    $.betStarter = sender;
                    $.betOptionsString = "";

                    var betOptionsSlice = args.slice(1);
                    var betIdentifier = System.currentTimeMillis();

                    var betDate = new Date();
                    var betMonth = betDate.getMonth() + 1;
                    var betDay = betDate.getDate();
                    var betYear = betDate.getFullYear();
                    var betDateString = betMonth + "/" + betDay + "/" + betYear;

                    if (betOptionsSlice.length < 2) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.start-error-notenough"));
                        return;
                    }

                    for (var i = 0; i < betOptionsSlice.length; i++) {
                        $.betOptions.push(betOptionsSlice[i].trim().toLowerCase());

                        if ($.betOptionsString != "") {
                            $.betOptionsString += " vs ";
                        }

                        $.betOptionsString = $.betOptionsString + "\"" + betOptionsSlice[i].trim().toUpperCase() + "\"";
                    }

                    $.inidb.set('bets', 'pot', 0);
                    $.inidb.set('bets', 'winners', "");
                    $.inidb.set('bets', 'entries', 0);
                    $.inidb.set('bets', 'date', betDateString);
                    $.inidb.set('bets', 'options', $.betOptionsString);

                    $.betRunning = true;
                    $.betStart = System.currentTimeMillis();

                    $.say($.lang.get("net.phantombot.betsystem.start-success", $.betOptionsString, $.betLength, $.inidb.get('settings', 'pointNameMultiple')));

                    setTimeout(function () {
                        if (!$.betRunning)
                            return;
                        $.say($.lang.get("net.phantombot.betsystem.autoclose-success", $.getPointsString($.betPot)));
                    }, $.betLength * 1000);
                }
            } else if (action.equalsIgnoreCase("close") || action.equalsIgnoreCase("end") || action.equalsIgnoreCase("stop") || action.equalsIgnoreCase("win")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                if ($.betRunning != true) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.close-error-notrunning"));
                    return;
                }

                if ($.betStarter != sender) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.close-error-notowner"));
                    return;
                }

                if (args[1] == null) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.close-error-nooption"));
                    return;
                }

                var winningString = args.slice(1).join(" ").trim().toLowerCase();

                if (!$.array.contains($.betOptions, winningString)) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.close-error-notfound"));
                    return;
                }

                $.betRunning = false;

                for (var user in $.betTable) {
                    bet = $.betTable[user];
                    if (bet.option.equalsIgnoreCase(winningString)) {
                        betTotal += parseInt(bet.amount);
                    }
                }

                var betPointsWon = 0;
                var betWinPercent = 0;
                var betWinners = "";
                var a = 0;

                for (var user in $.betTable) {
                    a++;
                    bet = $.betTable[user];
                    if (bet.option.equalsIgnoreCase(winningString)) {
                        betPointsWon = parseInt($.betPot / betTotal)

                        if (betPointsWon > 0) {
                            if (betWinners.length > 0) {
                                betWinners += ", ";
                            }
                            betWinners += $.username.resolve(user);
                        }
                    }
                }
                ;

                if (a < $.betMinimum) {
                    for (var user in $.betTable) {
                        bet = $.betTable[user];
                        $.inidb.incr('points', user, bet.amount);
                    }

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.close-success-notenough", $.inidb.get('settings', 'pointNameMultiple')));
                    return;
                } else {
                    if (betTotal <= 0) {
                        $.say($.lang.get("net.phantombot.betsystem.close-success-nowinners"));
                        return;
                    }

                    if (betPot <= 0) {
                        for (var user in $.betTable) {
                            bet = $.betTable[user];
                            $.inidb.incr('points', user, bet.amount);
                        }

                        $.say($.lang.get("net.phantombot.betsystem.close-success-sameoption", $.inidb.get('settings', 'pointNameMultiple')));
                        return;
                    } else {
                        for (var user in $.betTable) {
                            bet = $.betTable[user];
                            if (bet.option.equalsIgnoreCase(winningString)) {
                                betWinPercent = (bet.amount / betTotal);
                                $.inidb.incr('points', user, $.betPot * betWinPercent);
                            }
                        }
                        $.say($.lang.get("net.phantombot.betsystem.close-success", winningString.toUpperCase(), $.getPointsString($.betPot * betWinPercent)));
                    }
                }

                $.inidb.set('bets', 'winners', betWinners);
                $.inidb.set('bets', 'last_winners', betWinners);
                $.inidb.set('bets', 'last_winning_option', winningString);
                $.inidb.set('bets', 'last_options', $.betOptionsString);
                $.inidb.set('bets', 'last_entries', $.betEntries);
                $.inidb.set('bets', 'last_pot', parseInt($.betPot));

                $.betPot = 0;
                betTotal = 0;
                betWinners = "";
            } else if (action.equalsIgnoreCase("min") || action.equalsIgnoreCase("minimum")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.betmin-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.betmin-error-negative", $.inidb.get('settings', 'pointNameMultiple')));
                    return;
                } else {
                    $.inidb.set('settings', 'bet_minimum', args[1]);
                    $.betMinimum = parseInt($.inidb.get('settings', 'bet_minimum'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.betmin-success", $.inidb.get('settings', 'pointNameMultiple'), $.getPointsString($.betMinimum)));
                    return;
                }
            } else if (action.equalsIgnoreCase("max") || action.equalsIgnoreCase("maximum")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.betmax-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.betmax-error-negative", $.inidb.get('settings', 'pointNameMultiple')));
                    return;
                } else {
                    $.inidb.set('settings', 'bet_maximum', args[1]);
                    $.betMaximum = parseInt($.inidb.get('settings', 'bet_maximum'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.betmax-success", $.inidb.get('settings', 'pointNameMultiple'), $.getPointsString($.betMaximum)));
                    return;
                }
            } else if (action.equalsIgnoreCase("time") || action.equalsIgnoreCase("length")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.time-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.time-error-negative"));
                    return;
                } else {
                    $.inidb.set('settings', 'bet_length', args[1]);
                    $.betLength = parseInt($.inidb.get('settings', 'bet_length'));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.time-success", $.betLength));
                    return;
                }
            } else if (action.equalsIgnoreCase("results")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                var curBetEntries = $.inidb.get('bets', 'entries');
                var curBetOptions = $.inidb.get('bets', 'options');
                var curBetPot = $.inidb.get('bets', 'pot');

                if (isNaN(parseInt(curBetEntries)))
                    curBetEntries = 0;
                if (isNaN(parseInt(curBetPot)))
                    curBetPot = 0;

                var prevBetEntries = $.inidb.get('bets', 'last_entries');
                var prevBetOptions = $.inidb.get('bets', 'last_options');
                var prevBetPot = $.inidb.get('bets', 'last_pot');
                var prevBetWinningOption = $.inidb.get('bets', 'last_winning_option');
                var prevBetDate = $.inidb.get('bets', 'date');

                if (isNaN(parseInt(prevBetEntries)))
                    prevBetEntries = 0;
                if (isNaN(parseInt(prevBetPot)))
                    prevBetPot = 0;
                if (prevBetWinningOption == null)
                    prevBetWinningOption = "None";

                if ($.betRunning == 1) {
                    if (curBetEntries == 0 && curBetPot == 0) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.result-running-error-notfound", $.inidb.get('settings', 'pointNameMultiple'), curBetOptions));
                        return;
                    }

                    $.say($.lang.get("net.phantombot.betsystem.result-running-success", $.getPointsString(curBetPot), curBetEntries, curBetOptions));
                    return;
                } else {
                    if (prevBetOptions == null || prevBetOptions == undefined || prevBetOptions == "undefined") {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.result-norunning-error-notfound"));
                        return;
                    }

                    $.say($.lang.get("net.phantombot.betsystem.result-norunning-success", $.getPointsString(prevBetPot), prevBetEntries, prevBetOptions, prevBetWinningOption.toUpperCase(), prevBetDate));
                    return;
                }
            } else if (action.equalsIgnoreCase("entries") || action.equalsIgnoreCase("entrants")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                if ($.betRunning == 1) {
                    var arrayBetEntrants = $.betTable;
                } else {
                    var arrayBetEntrants = $.inidb.get('bets', 'last_winners').split(',');
                }

                var maxBetEntrants = arrayBetEntrants.length;
                var maxResults = 15;
                var returnString = "";

                if (args[1] != null && isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.entries-usage"));
                    return;
                } else if (args[1] == null || parseInt(args[1]) <= 1 || maxBetEntrants <= maxResults) {
                    for (i = 0; i < maxResults; i++) {
                        if (arrayBetEntrants[i] != null) {
                            returnString += $.username.resolve(arrayBetEntrants[i]).trim() + ", ";
                        }
                    }
                    if (returnString == "") {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.entries-error-noresults"));
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.entries-success", 1, Math.ceil(maxBetEntrants / maxResults), returnString.slice(0, -2)));
                    }
                    return;
                } else if (parseInt(args[1])) {
                    var offset = (Math.round(args[1]) - 1) * maxResults;

                    for (i = 0; i < maxResults; i++) {
                        if (arrayBetEntrants[i + offset] != null) {
                            returnString += $.username.resolve(arrayBetEntrants[i + offset]).trim() + ", ";
                        }
                    }
                    if (returnString == "") {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.entries-error-noresults"));
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.entries-success", Math.round(args[1]), Math.ceil(maxBetEntrants / maxResults), returnString.slice(0, -2)));
                    }
                    return;
                }
            } else if (!isNaN(parseInt(action))) {
                if ($.betRunning == 1) {
                    var betWager = parseInt(args[0]);
                    var betOption = args.slice(1).join(" ").trim().toLowerCase();
                    var userPoints = $.inidb.get('points', sender);
                    if (isNaN(parseInt(userPoints)))
                        userPoints = 0;

                    if (($.betStart + ($.betLength * 1000)) < System.currentTimeMillis()) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.status-notrunning", "Moderator"));
                        return;
                    }

                    if (!$.array.contains($.betOptions, betOption)) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.enter-error-notvalid"));
                        return;
                    }

                    if (betWager < 1) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.enter-error-negative", $.inidb.get('settings', 'pointNameMultiple')));
                        return;
                    } else if (betWager < $.betMinimum) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.enter-error-belowmin", $.getPointsString($.betMinimum)));
                        return;
                    } else if (betWager > $.betMaximum) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.enter-error-abovemax", $.getPointsString($.betMaximum)));
                        return;
                    }

                    if (betWager > userPoints) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.enter-error-notenough", $.inidb.get('settings', 'pointNameMultiple'), $.getPointsString(betWager)));
                        return;
                    }

                    if (sender in $.betTable) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.enter-error-entered"));
                        return;
                    }

                    $.inidb.decr('points', sender, betWager);
                    $.betPot += betWager;
                    $.inidb.set('bets', 'pot', parseInt($.betPot));
                    $.betEntries++;
                    $.inidb.set('bets', 'entries', $.betEntries);

                    $.betTable[sender] = {
                        amount: betWager,
                        option: betOption
                    };

                    if ($.betPot < 1) {
                        var tempPot = args[0];
                    } else {
                        var tempPot = $.betPot;
                    }

                    $.say($.lang.get("net.phantombot.betsystem.enter-success", username, $.getPointsString(betWager), betOption.toUpperCase(), $.getPointsString(tempPot)));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.status-notrunning", "Moderator"));
                    return;
                }
            }
        }
        else {
            if ($.betRunning == 1) {
                var curBetOptions = $.inidb.get('bets', 'options');

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.status-running", $.inidb.get('settings', 'pointNameMultiple'), curBetOptions));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.betsystem.status-notrunning", "Moderator"));
                return;
            }
        }
    }
});

setTimeout(function () {
    if ($.moduleEnabled('./systems/betSystem.js')) {
        $.registerChatCommand("./systems/betSystem.js", "bet");
    }
}, 10 * 1000);
