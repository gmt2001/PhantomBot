$.raffleToggle = $.inidb.get("settings", "raffleToggle");
$.whisperRaffle = $.inidb.get("settings", "whisperRaffle");

if ($.raffleToggle == undefined || $.raffleToggle == null) {
    $.raffleToggle = "true";
}

if ($.whisperRaffle == undefined || $.whisperRaffle == null) {
    $.whisperRaffle = "false";
}

$.getWhisperString = function(sender) {
    // TODO: Incorporate $.whisper once it is available.
    if ($.whisperRaffle == "true") {
        return "/w " + sender + " ";
    } else {
        return "";
    }
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

$.getRewardString = function(reward) {
    if (!$.moduleEnabled("./systems/pointSystem.js") || isNaN(reward)) {
        $.raffleMode = 0;
        return reward;
    } else {
        $.raffleMode = 1;
        return getPointsString(Math.max(parseInt(reward), 0));
    }
}

$.enterRaffle = function(user, message) {
    // List of return codes:
    // - 0: Wrong keyword.
    // - 1: Successfully entered the raffle.
    // - 2: Raffle isn't running.
    // - 3: User already entered the raffle.
    // - 4: User doesn't have enough points to enter.
    // - 5: The broadcaster tried to enter.
    // - 6: User isn't following but following is required to enter.

    if ($.raffleRunning == 1) {
        if ($.raffleKeyword == "!raffle" && message.toLowerCase() != "!raffle") {
            return 0;
        } else if (!message.toLowerCase().contains($.raffleKeyword.toLowerCase())) {
            return 0;
        }

        if ($.array.contains($.raffleEntrants, user)) {
            return 3;
        }

        if ($.moduleEnabled("./systems/pointSystem.js") && $.rafflePrice > 0) {
            var points = $.inidb.get('points', user);

            if (points == null || isNaN(points)) {
                points = 0;
            } else {
                points = parseInt(points);
            }

            if ($.rafflePrice > points) {
                return 4;
            }

            $.inidb.decr('points', user, $.rafflePrice);
        }
        
        if ($.raffleFollowers == 1) {
            var userFollows = $.inidb.get('followed', user);
            if (userFollows == null || userFollows == undefined) {
                // Let's give the user a fair chance, check again.
                var userFollowsCheck = $.twitch.GetUserFollowsChannel($.username.resolve(user.toLowerCase()), $.channelName);
                
                if (userFollowsCheck.getInt("_http") != 200) {
                    if (user.toLowerCase() == $.channelName.toLowerCase()) {
                        return 5;
                    } else {
                        return 6;
                    }
                }
            }
        }
    
        $.raffleEntrants.push(user);
        return 1;
    } else {
        return 2;
    }
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("whisperraffle")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        if ($.whisperRaffle == "false") {
            $.inidb.set("settings", "whisperRaffle", "true");
            $.whisperRaffle = $.inidb.get('settings', 'whisperRaffle');

            $.say($.lang.get("net.phantombot.common.whisper-enabled", "Raffle System"));
        } else if ($.whisperRaffle == "true") {
            $.inidb.set("settings", "whisperRaffle", "false");
            $.whisperRaffle = $.inidb.get('settings', 'whisperRaffle');

            $.say($.lang.get("net.phantombot.common.whisper-disabled", "Raffle System"));
        }
    }

    if(command.equalsIgnoreCase("raffle")) {
        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("start") || action.equalsIgnoreCase("new") || action.equalsIgnoreCase("run")) {
                if ($.moduleEnabled("./systems/pointSystem.js") && $.inidb.get("settings", "permTogglePoints") == "true") {
                    if (!$.isModv3(sender, event.getTags())) {
                        $.say($.modmsg);
                        return;
                    }
                } else {
                    // This is the default. If points permtoggle allows mods, allow mods here as well.
                    // If the points module is inactive, use isAdmin for safety reasons.
                    if (!$.isAdmin(sender)) {
                        $.say($.adminmsg);
                        return;
                    }
                }

                if ($.raffleRunning == 1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.start-error-running"));
                    return;
                } else {
                    $.raffleTime = new Date();
                    $.raffleMonth = $.raffleTime.getMonth() + 1;
                    $.raffleDay = $.raffleTime.getDate();
                    $.raffleYear = $.raffleTime.getFullYear();
                    $.raffleDateString = $.raffleMonth + "/" + $.raffleDay + "/" + $.raffleYear;

                    $.raffleEntrants = [];
                    $.raffleMode = 0;
                    $.raffleRunning = 0;

                    $.raffleFollowers = 0;
                    $.rafflePrice = 0;
                    $.raffleKeyword = "!raffle";
                    $.raffleReward = "";
                    $.raffleWinnings = "";

                    var i = 1;

                    if (args[i] != null && args[i] != undefined && (args[i].equalsIgnoreCase("-followers") || args[i].equalsIgnoreCase("-followed") || args[i].equalsIgnoreCase("-follow"))) {
                        $.raffleFollowers = 1;
                        i++;
                    }
                    if (args[i] != null && args[i] != undefined && !args[i].isEmpty()) {
                        $.raffleReward = args[i];
                        i++;
                    }
                    if ($.moduleEnabled("./systems/pointSystem.js") && args[i] != null && args[i] != undefined && !isNaN(args[i])) {
                        $.rafflePrice = parseInt(args[i]);
                        i++;
                    }
                    if (args[i] != null && args[i] != undefined && !args[i].isEmpty()) {
                        if (args[i] == "!raffle") {
                            $.raffleKeyword = args[i];
                            i++;
                        } else if(args[i].startsWith('!')) {
                            if ($.moduleEnabled("./systems/pointSystem.js")) {
                                $.say$.getWhisperString(sender) + ($.lang.get("net.phantombot.rafflesystem.start-error-invalid-points"));
                                return;
                            } else {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.start-error-invalid-default"));
                                return;
                            }
                        } else {
                            $.raffleKeyword = args[i];
                            i++;
                        }
                    }

                    if ($.raffleReward == "") {
                        if ($.moduleEnabled("./systems/pointSystem.js")) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.start-usage-points"));
                            return;
                        } else {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.start-usage-default"));
                            return;
                        }
                    } else {
                        if ($.moduleEnabled("./systems/pointSystem.js")) {
                            if ($.raffleFollowers == 1 && $.rafflePrice > 0) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-followers-price", $.getRewardString($.raffleReward), $.getPointsString($.rafflePrice), $.raffleKeyword));
                            } else if ($.raffleFollowers == 1 && $.rafflePrice <= 0) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-followers", $.getRewardString($.raffleReward), $.raffleKeyword));
                            } else if ($.raffleFollowers == 0 && $.rafflePrice > 0) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-price", $.getRewardString($.raffleReward), $.getPointsString($.rafflePrice), $.raffleKeyword));
                            } else {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-default", $.getRewardString($.raffleReward), $.raffleKeyword));
                            }
                        } else {
                            if ($.raffleFollowers == 1) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-followers", $.getRewardString($.raffleReward), $.raffleKeyword));
                            } else {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-default", $.getRewardString($.raffleReward), $.raffleKeyword));
                            }
                        }
                    }

                    $.raffleRunning = 1;

                    $.inidb.set('raffles', 'reward', $.raffleReward);
                    $.inidb.set('raffles', 'winner', $.winnerUsername);
                    $.inidb.set('raffles', 'price', $.rafflePrice);
                    $.inidb.set('raffles', 'mode', $.raffleMode);
                    $.inidb.set('raffles', 'follow', $.raffleFollowers);
                    $.inidb.set('raffles', 'keyword', $.raffleKeyword);
                    $.inidb.set('raffles', 'date', $.raffleDateString);
                }
            } else if (action.equalsIgnoreCase("close") || action.equalsIgnoreCase("stop") || action.equalsIgnoreCase("end") || action.equalsIgnoreCase("draw")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.modmsg);
                    return;
                }

                $.raffleTime = new Date();
                $.raffleMonth = $.raffleTime.getMonth() + 1;
                $.raffleDay = $.raffleTime.getDate();
                $.raffleYear = $.raffleTime.getFullYear();
                $.raffleDateString = $.raffleMonth + "/" + $.raffleDay + "/" + $.raffleYear;
     
                if ($.raffleRunning == 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.close-error-notrunning"));
                    return;
                } else {
                    $.raffleRunning = 0;

                    if ($.raffleEntrants.length == 0) {
                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-noentries"));
                        return;
                    }
                    
                    i = 0;
                    
                    do {
                        if (i > ($.raffleEntrants.length * 2)) {
                            $.winnerUsername = null;
                            break;
                        }
                        
                        $.winnerUsername = $.raffleEntrants[$.randRange(1, $.raffleEntrants.length) - 1];
                        $.winnerFollows = $.inidb.get('followed', $.winnerUsername.toLowerCase());
                        
                        if ($.raffleFollowers && ($.winnerFollows == null || $.winnerFollows == undefined || $.winnerFollows == "1")){
                            $.winnerFollowsCheck = $.twitch.GetUserFollowsChannel($.winnerUsername.toLowerCase(), $.channelName);
                            
                            if ($.winnerFollowsCheck.getInt("_http") == 200) {
                                $.winnerFollows = "1";
                            }
                        }
                        
                        i++;
                    } while ($.raffleFollowers == 1 && ($.winnerFollows == null || $.winnerFollows == undefined || $.winnerFollows != "1"));
                    
                    if ($.winnerUsername == null) {
                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-nofollow"));
                        return;
                    }

                    if ($.raffleMode == 0) {
                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-default", $.username.resolve($.winnerUsername), $.getRewardString($.raffleReward)));
                    } else {
                        $.inidb.incr('points', $.winnerUsername.toLowerCase(), $.raffleReward);

                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-points", $.username.resolve($.winnerUsername), $.getRewardString($.raffleReward)));
                    }

                    $.inidb.set('raffles', 'reward', $.raffleReward);
                    $.inidb.set('raffles', 'winner', $.winnerUsername);
                    $.inidb.set('raffles', 'price', $.rafflePrice);
                    $.inidb.set('raffles', 'mode', $.raffleMode);
                    $.inidb.set('raffles', 'follow', $.raffleFollowers);
                    $.inidb.set('raffles', 'keyword', $.raffleKeyword);
                    $.inidb.set('raffles', 'entries', $.raffleEntrants.length);
                    $.inidb.set('raffles', 'players', $.raffleEntrants);
                    $.inidb.set('raffles', 'date', $.raffleDateString);
                }
            } else if (action.equalsIgnoreCase("repick") || action.equalsIgnoreCase("redraw")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.modmsg);
                    return;
                }

                $.raffleTime = new Date();
                $.raffleMonth = $.raffleTime.getMonth() + 1;
                $.raffleDay = $.raffleTime.getDate();
                $.raffleYear = $.raffleTime.getFullYear();
                $.raffleDateString = $.raffleMonth + "/" + $.raffleDay + "/" + $.raffleYear;
     
                if ($.raffleRunning == 1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.redraw-error-running"));
                    return;
                }

                if ($.raffleEntrants.length == 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.redraw-error-noentries"));
                }
                
                if ($.raffleMode == 1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.redraw-error-pointraffle", $.inidb.get('settings', 'pointNameMultiple')));
                    return;
                }
     
                i = 0;
                
                do {
                    if (i > ($.raffleEntrants.length * 2)) {
                        $.winnerUsername = null;
                        break;
                    }
                    
                    $.winnerUsername = $.raffleEntrants[$.randRange(1, $.raffleEntrants.length) - 1];
                    $.winnerFollows = $.inidb.get('followed', $.winnerUsername.toLowerCase());
                    
                    if ($.raffleFollowers && ($.winnerFollows == null || $.winnerFollows == undefined || $.winnerFollows == "1")){
                        $.winnerFollowsCheck = $.twitch.GetUserFollowsChannel($.winnerUsername.toLowerCase(), $.channelName);
                        
                        if ($.winnerFollowsCheck.getInt("_http") == 200) {
                            $.winnerFollows = "1";
                        }
                    }
                    
                    i++;
                } while ($.raffleFollowers == 1 && ($.winnerFollows == null || $.winnerFollows == undefined || $.winnerFollows != "1"));
                
                if ($.winnerUsername == null) {
                    $.say($.lang.get("net.phantombot.rafflesystem.redraw-success-nofollow"));
                    return;
                }

                $.say($.lang.get("net.phantombot.rafflesystem.redraw-success-default", $.username.resolve($.winnerUsername), $.getRewardString($.raffleReward)));

                $.inidb.set('raffles', 'reward', $.raffleReward);
                $.inidb.set('raffles', 'winner', $.winnerUsername);
                $.inidb.set('raffles', 'price', $.rafflePrice);
                $.inidb.set('raffles', 'mode', $.raffleMode);
                $.inidb.set('raffles', 'follow', $.raffleFollowers);
                $.inidb.set('raffles', 'keyword', $.raffleKeyword);
                $.inidb.set('raffles', 'entries', $.raffleEntrants.length);
                $.inidb.set('raffles', 'players', $.raffleEntrants);
                $.inidb.set('raffles', 'date', $.raffleDateString);
            } else if (action.equalsIgnoreCase("results")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.modmsg);
                    return;
                }

                var prevRaffleReward = $.inidb.get('raffles', 'reward');
                var prevRaffleWinner = $.inidb.get('raffles', 'winner');
                var prevRafflePrice = $.inidb.get('raffles', 'price');
                var prevRaffleMode = $.inidb.get('raffles', 'mode');
                var prevRaffleFollowers = $.inidb.get('raffles', 'follow');
                var prevRaffleKeyword = $.inidb.get('raffles', 'keyword');
                var prevRaffleEntrantsCount = $.inidb.get('raffles', 'entries');
                var prevRaffleDate = $.inidb.get('raffles', 'date');

                if (prevRaffleWinner == null) prevRaffleWinner = "None";
                if (prevRaffleWinner != null) prevRaffleWinner = $.username.resolve(prevRaffleWinner);
                if (prevRaffleMode == 0) prevRaffleMode = "Other";
                if (prevRaffleMode == 1) prevRaffleMode = "Points";
                if (prevRaffleFollowers == 0) prevRaffleFollowers = "No";
                if (prevRaffleFollowers == 1) prevRaffleFollowers = "Yes";
                if (isNaN(prevRaffleEntrantsCount)) prevRaffleEntrantsCount = 0;

                if (prevRaffleReward == null || prevRafflePrice == null || prevRaffleMode == null || prevRaffleKeyword == null || prevRaffleDate == null) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.result-error-notfound"));
                    return;
                }

                if ($.raffleRunning == 1) {
                    $.say($.lang.get("net.phantombot.rafflesystem.result-success-running", getRewardString(prevRaffleReward), getPointsString(prevRafflePrice), prevRaffleMode, prevRaffleFollowers, prevRaffleKeyword, prevRaffleEntrantsCount));
                    return;
                } else {
                    $.say($.lang.get("net.phantombot.rafflesystem.result-success-norunning", getRewardString(prevRaffleReward), getPointsString(prevRafflePrice), prevRaffleMode, prevRaffleFollowers, prevRaffleKeyword, prevRaffleEntrantsCount, prevRaffleWinner, prevRaffleDate));
                    return;
                }
            } else if (action.equalsIgnoreCase("entries") || action.equalsIgnoreCase("entrants")) {
                var raffleEntrants = $.inidb.get('raffles', 'players');
                var arrayRaffleEntrants = raffleEntrants.split(',');
                var maxRaffleEntrants = arrayRaffleEntrants.length;
                var maxResults = 15;
                var returnString = "";

                if (args[1] != null && isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.usage"));
                    return;
                } else if (args[1] == null || parseInt(args[1]) <= 1) {
                    for (i = 0; i < maxResults; i++) { 
                        if (arrayRaffleEntrants[i] != null) {
                            returnString += arrayRaffleEntrants[i] + ", ";
                        }
                    }
                    if (returnString == "") {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.entries-error-noresults"));
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.entries-success", 1, Math.ceil(maxRaffleEntrants / maxResults), returnString.slice(0,-2)));
                    }
                    return;
                } else if (parseInt(args[1])) {
                    var offset = (Math.round(args[1]) - 1) * maxResults;

                    for (i = 0; i < maxResults; i++) { 
                        if (arrayRaffleEntrants[i + offset] != null) {
                            returnString += arrayRaffleEntrants[i + offset] + ", ";
                        }
                    }
                    if (returnString == "") {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.entries-error-noresults"));
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.entries-success", Math.round(args[1]), Math.ceil(maxRaffleEntrants / maxResults), returnString.slice(0,-2)));
                    }
                    return;
                }
            } else if (action.equalsIgnoreCase("toggle")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.modmsg);
                    return;
                }
                if ($.raffleToggle == "false") {
                    $.inidb.set("settings", "raffleToggle", "true");
                    $.raffleToggle = $.inidb.get('settings', 'raffleToggle');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.toggle-enabled"));
                } else if ($.raffleToggle == "true") {
                    $.inidb.set("settings", "raffleToggle", "false");
                    $.raffleToggle = $.inidb.get('settings', 'raffleToggle');

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.toggle-disabled"));
                }
            }
        } else {
            if ($.raffleRunning) {
                if ($.raffleKeyword != "!raffle") {
                    if ($.moduleEnabled("./systems/pointSystem.js")) {
                        if ($.raffleFollowers == 1 && $.rafflePrice > 0) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-followers-price", $.getRewardString($.raffleReward), $.getPointsString($.rafflePrice), $.raffleKeyword));
                        } else if ($.raffleFollowers == 1 && $.rafflePrice <= 0) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-followers", $.getRewardString($.raffleReward), $.raffleKeyword));
                        } else if ($.raffleFollowers == 0 && $.rafflePrice > 0) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-price", $.getRewardString($.raffleReward), $.getPointsString($.rafflePrice), $.raffleKeyword));
                        } else {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-default", $.getRewardString($.raffleReward), $.raffleKeyword));
                        }
                    } else {
                        if ($.raffleFollowers == 1) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-followers", $.getRewardString($.raffleReward), $.raffleKeyword));
                        } else {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-default", $.getRewardString($.raffleReward), $.raffleKeyword));
                        }
                    }
                } else {
                    switch ($.enterRaffle(sender, "!raffle")) {
                        case 1:
                            if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-success"));
                            break;
                        case 2:
                            // Don't know how we would get here, but it's there if it needs to be.
                            if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-notrunning", "Moderator"));
                            break;
                        case 3:
                            if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-entered"));
                            break;
                        case 4:
                            if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-notenough", $.inidb.get('settings', 'pointNameMultiple')));
                            break;
                        case 5:
                            if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-iscaster"));
                            break;
                        case 6:
                            if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-nofollow"));
                            break;
                        default:
                            // We realistically aren't able to reach this. Just return.
                            return;
                    }
                }
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-notrunning", "Moderator"));
            }
        }
    }
});

$.on('ircChannelMessage', function(event) {
    var sender = event.getSender();
    var message = event.getMessage();
    
    if ($.raffleRunning == 1) {
        switch ($.enterRaffle(sender, message)) {
            case 0:
                // We don't want spam. Just return.
                return;
                break;
            case 1:
                if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-success"));
                break;
            case 2:
                // We don't want spam. Just return.
                return;
                break;
            case 3:
                if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-entered"));
                break;
            case 4:
                if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-notenough", $.inidb.get('settings', 'pointNameMultiple')));
                break;
            case 5:
                if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-iscaster"));
                break;
            case 6:
                if ($.raffleToggle == "true") $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.rafflesystem.enter-error-nofollow"));
                break;
            default:
                // We realistically aren't able to reach this. Just return.
                return;
        }
    } else {
        // We don't want spam. Just return.
        return;
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/raffleSystem.js')) {
        $.registerChatCommand("./systems/raffleSystem.js", "raffle");
    }
}, 10 * 1000);
