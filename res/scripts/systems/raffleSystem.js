$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();

    if (!$.inidb.HasKey("settings", channel.getName(), "raffleToggle")) {
        $.inidb.SetBoolean("settings", channel.getName(), "raffleToggle", true);
    }
});

$.getRewardString = function (reward, channel) {
    if (!$.moduleEnabled("./systems/pointSystem.js", channel) || isNaN(reward)) {
        return reward;
    } else {
        return $.getPointsString(Math.max(parseInt(reward), 0), channel);
    }
}

$.enterRaffle = function (user, channel, message) {
    // List of return codes:
    // - 0: Wrong keyword.
    // - 1: Successfully entered the raffle.
    // - 2: Raffle isn't running.
    // - 3: User already entered the raffle.
    // - 4: User doesn't have enough points to enter.
    // - 5: The broadcaster tried to enter.
    // - 6: User isn't following but following is required to enter.

    if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
        if ($.tempdb.GetString("t_state", channel.getName(), "raffleKeyword").startsWith("!")) {
            if (!message.equalsIgnoreCase($.tempdb.GetString("t_state", channel.getName(), "raffleKeyword"))) {
                return 0;
            }
        } else if (!message.toLowerCase().contains($.tempdb.GetString("t_state", channel.getName(), "raffleKeyword"))) {
            return 0;
        }

        if (user.equalsIgnoreCase(channel.getName().replaceFirst("#", ""))) {
            return 5;
        }

        if ($.tempdb.HasKey("t_raffleEntrants", channel.getName(), user)) {
            return 3;
        }

        if ($.moduleEnabled("./systems/pointSystem.js", channel) && $.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice") > 0
                && $.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice") > $.getPoints(user, channel)) {
            return 4;
        }

        if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers")) {
            if (!$.inidb.GetBoolean('followed', channel.getName(), user)) {
                if ($.twitch.GetUserFollowsChannel(user, channel.getName().replaceFirst("#", "")).getInt("_http") != 200) {
                    return 6;
                }
            }
        }

        if ($.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice") > 0) {
            $.setPoints(user, $.getPoints(user, channel) - $.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice"), channel);
        }

        $.tempdb.SetBoolean("t_raffleEntrants", channel.getName(), user, true);

        return 1;
    } else {
        return 2;
    }
}

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel()

    if (command.equalsIgnoreCase("raffle")) {
        if (args.length >= 1 && !args[0].equalsIgnoreCase("announce")) {
            var action = args[0];

            if (action.equalsIgnoreCase("start") || action.equalsIgnoreCase("new") || action.equalsIgnoreCase("run")) {
                if ($.moduleEnabled("./systems/pointSystem.js", channel) && $.inidb.GetBoolean("settings", channel.getName(), "permTogglePoints")) {
                    if (!$.isMod(sender, event.getTags(), channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                        return;
                    }
                } else {
                    if (!$.isAdmin(sender, channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                        return;
                    }
                }

                if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.start-error-running", channel), channel);
                    return;
                } else {
                    var raffleTime = new Date();
                    var raffleMonth = raffleTime.getMonth() + 1;
                    var raffleDay = raffleTime.getDate();
                    var raffleYear = raffleTime.getFullYear();
                    var raffleDateString = raffleMonth + "/" + raffleDay + "/" + raffleYear;

                    $.tempdb.RemoveSection("t_raffleEntrants", channel.getName());
                    $.tempdb.SetBoolean("t_state", channel.getName(), "raffleMode", false);
                    $.tempdb.SetBoolean("t_state", channel.getName(), "raffleRunning", false);

                    var raffleFollowers = true;
                    var rafflePrice = 0;
                    var raffleKeyword = "!raffle";
                    var raffleReward = "";

                    var i = 1;

                    if (args.length > i && (args[i].equalsIgnoreCase("-followers") || args[i].equalsIgnoreCase("-followed") || args[i].equalsIgnoreCase("-follow"))) {
                        raffleFollowers = true;
                        i++;
                    }
                    if (args.length > i && $.strlen(args[i]) > 0) {
                        raffleReward = args[i];
                        i++;
                    }
                    if ($.moduleEnabled("./systems/pointSystem.js", channel) && args.length > i && !isNaN(args[i])) {
                        rafflePrice = Math.max(parseInt(args[i]), 0);
                        i++;
                    }
                    if (args.length > i && $.strlen(args[i]) > 0) {
                        raffleKeyword = args[i];
                        i++;
                    }

                    if ($.strlen(raffleReward) == 0) {
                        if ($.moduleEnabled("./systems/pointSystem.js", channel)) {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.start-usage-points", channel), channel);
                            return;
                        } else {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.start-usage-default", channel), channel);
                            return;
                        }
                    } else {
                        if ($.moduleEnabled("./systems/pointSystem.js", channel)) {
                            if (raffleFollowers && rafflePrice > 0) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-followers-price", channel, $.getRewardString(raffleReward, channel), $.getPointsString(rafflePrice, channel), raffleKeyword), channel);
                            } else if (raffleFollowers) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-followers", channel, $.getRewardString(raffleReward, channel), raffleKeyword), channel);
                            } else if (rafflePrice > 0) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-price", channel, $.getRewardString(raffleReward, channel), $.getPointsString(rafflePrice, channel), raffleKeyword), channel);
                            } else {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-default", channel, $.getRewardString(raffleReward, channel), raffleKeyword), channel);
                            }
                        } else {
                            if (raffleFollowers) {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-followers", channel, $.getRewardString(raffleReward, channel), raffleKeyword), channel);
                            } else {
                                $.say($.lang.get("net.phantombot.rafflesystem.start-success-default", channel, $.getRewardString(raffleReward, channel), raffleKeyword), channel);
                            }
                        }
                    }

                    $.tempdb.SetBoolean("t_state", channel.getName(), "raffleRunning", true);
                    $.tempdb.SetBoolean("t_state", channel.getName(), "raffleMode", ($.moduleEnabled("./systems/pointSystem.js", channel) && !isNaN(raffleReward)));
                    $.tempdb.SetString("t_state", channel.getName(), "raffleReward", raffleReward);
                    $.tempdb.SetInteger("t_state", channel.getName(), "rafflePrice", rafflePrice);
                    $.tempdb.SetBoolean("t_state", channel.getName(), "raffleFollowers", raffleFollowers);
                    $.tempdb.SetString("t_state", channel.getName(), "raffleKeyword", raffleKeyword);
                    $.tempdb.SetString("t_state", channel.getName(), "raffleDateString", raffleDateString);
                }
            } else if (action.equalsIgnoreCase("close") || action.equalsIgnoreCase("stop") || action.equalsIgnoreCase("end") || action.equalsIgnoreCase("draw")) {
                if (!$.isMod(sender, event.getTags(), channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                    return;
                }

                if (!$.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.close-error-notrunning", channel), channel);
                    return;
                } else {
                    $.tempdb.SetBoolean("t_state", channel.getName(), "raffleRunning", false);

                    var keys = $.tempdb.GetKeyList("t_raffleEntrants", channel.getName());

                    if (keys.length == 0) {
                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-noentries", channel), channel);
                        return;
                    }

                    var i = 0;
                    var winnerUsername = "";

                    do {
                        if (i > (keys.length * 2)) {
                            break;
                        }

                        winnerUsername = keys[$.randRange(1, keys.length) - 1];

                        if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers")) {
                            if ($.twitch.GetUserFollowsChannel(winnerUsername, channel.getName().replaceFirst("#", "")).getInt("_http") != 200) {
                                winnerUsername = "";
                            }
                        }

                        i++;
                    } while ($.strlen(winnerUsername) == 0);

                    if ($.strlen(winnerUsername) == 0) {
                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-nofollow", channel), channel);
                        return;
                    }

                    $.tempdb.SetString('t_state', channel.getName(), 'rafflePrevWinners', winnerUsername);

                    if (!$.tempdb.GetBoolean("t_state", channel.getName(), "raffleMode")) {
                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-default", channel, $.username.resolve(winnerUsername), $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel)), channel);
                    } else {
                        $.setPoints(winnerUsername, $.getPoints(winnerUsername, channel) + parseInt($.tempdb.GetString("t_state", channel.getName(), "raffleReward")), channel);

                        $.say($.lang.get("net.phantombot.rafflesystem.close-success-points", channel, $.username.resolve(winnerUsername), $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel)), channel);
                    }

                    var raffleEntrants = "";

                    for (var i = 0; i < keys.length; i++) {
                        if ($.strlen(raffleEntrants) > 0) {
                            raffleEntrants += ",";
                        }

                        raffleEntrants += keys[i];
                    }

                    $.inidb.SetString('raffles', channel.getName(), 'reward', $.tempdb.GetString("t_state", channel.getName(), "raffleReward"));
                    $.inidb.SetString('raffles', channel.getName(), 'winner', winnerUsername);
                    $.inidb.SetInteger('raffles', channel.getName(), 'price', $.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice"));
                    $.inidb.SetBoolean('raffles', channel.getName(), 'mode', $.tempdb.GetBoolean("t_state", channel.getName(), "raffleMode"));
                    $.inidb.SetBoolean('raffles', channel.getName(), 'follow', $.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers"));
                    $.inidb.SetString('raffles', channel.getName(), 'keyword', $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword"));
                    $.inidb.SetInteger('raffles', channel.getName(), 'entries', keys.length);
                    $.inidb.SetString('raffles', channel.getName(), 'players', raffleEntrants);
                    $.inidb.SetString('raffles', channel.getName(), 'date', $.tempdb.GetString("t_state", channel.getName(), "raffleDateString"));
                }
            } else if (action.equalsIgnoreCase("repick") || action.equalsIgnoreCase("redraw")) {
                if (!$.isMod(sender, event.getTags(), channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                    return;
                }

                if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.redraw-error-running", channel), channel);
                    return;
                }

                var keys = $.tempdb.GetKeyList("t_raffleEntrants", channel.getName());

                if (keys.length == 0) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.redraw-error-noentries", channel), channel);
                }

                if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleMode")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.redraw-error-pointraffle", channel), channel);
                    return;
                }

                var i = 0;
                var winnerUsername = "";
                var prevWinners = $.tempdb.GetString('t_state', channel.getName(), 'rafflePrevWinners').split(",");

                do {
                    if (i > (keys.length * 2)) {
                        break;
                    }

                    winnerUsername = keys[$.randRange(1, keys.length) - 1];

                    if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers")) {
                        if ($.twitch.GetUserFollowsChannel(winnerUsername, channel.getName().replaceFirst("#", "")).getInt("_http") != 200) {
                            winnerUsername = "";
                        }
                    }

                    i++;
                } while ($.strlen(winnerUsername) == 0 || $.array.contains(prevWinners, winnerUsername));

                if ($.strlen(winnerUsername) == 0) {
                    $.inidb.SetString('raffles', channel.getName(), 'winner', "");
                    $.say($.lang.get("net.phantombot.rafflesystem.redraw-success-nofollow", channel), channel);
                    return;
                }

                if ($.array.contains(prevWinners, winnerUsername)) {
                    $.inidb.SetString('raffles', channel.getName(), 'winner', "");
                    $.say($.lang.get("net.phantombot.rafflesystem.redraw-success-noprev", channel), channel);
                    return;
                }

                $.say($.lang.get("net.phantombot.rafflesystem.redraw-success-default", channel, $.username.resolve(winnerUsername), $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel)), channel);

                $.inidb.SetString('raffles', channel.getName(), 'winner', winnerUsername);
            } else if (action.equalsIgnoreCase("results")) {
                if (!$.isMod(sender, event.getTags(), channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                    return;
                }

                if (!$.inidb.HasKey('raffles', channel.getName(), 'mode') && !$.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.result-error-notfound", channel), channel);
                    return;
                }

                var prevRaffleReward = $.inidb.GetString('raffles', channel.getName(), 'reward');
                var prevRaffleWinner = $.inidb.GetString('raffles', channel.getName(), 'winner');
                var prevRafflePrice = $.inidb.GetInteger('raffles', channel.getName(), 'price');
                var prevRaffleMode = $.inidb.GetBoolean('raffles', channel.getName(), 'mode');
                var prevRaffleFollowers = $.inidb.GetBoolean('raffles', channel.getName(), 'follow');
                var prevRaffleKeyword = $.inidb.GetString('raffles', channel.getName(), 'keyword');
                var prevRaffleEntrantsCount = $.inidb.GetInteger('raffles', channel.getName(), 'entries');
                var prevRaffleDate = $.inidb.GetString('raffles', channel.getName(), 'date');

                if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                    prevRaffleReward = $.tempdb.GetString("t_state", channel.getName(), "raffleReward");
                    prevRaffleWinner = "";
                    prevRafflePrice = $.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice");
                    prevRaffleMode = $.tempdb.GetBoolean("t_state", channel.getName(), "raffleMode");
                    prevRaffleFollowers = $.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers");
                    prevRaffleKeyword = $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword");
                    prevRaffleEntrantsCount = $.tempdb.GetKeyList("t_raffleEntrants", channel.getName()).length;
                    prevRaffleDate = "";
                }

                if ($.strlen(prevRaffleWinner) == 0) {
                    prevRaffleWinner = "Nobody";
                } else {
                    prevRaffleWinner = $.username.resolve(prevRaffleWinner);
                }

                if (prevRaffleMode) {
                    prevRaffleMode = "Points";
                } else {
                    prevRaffleMode = "Points";
                }

                if (prevRaffleFollowers) {
                    prevRaffleFollowers = "Yes";
                } else {
                    prevRaffleFollowers = "No";
                }

                if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                    $.say($.lang.get("net.phantombot.rafflesystem.result-success-running", channel, $.getRewardString(prevRaffleReward, channel), $.getPointsString(prevRafflePrice, channel), prevRaffleMode, prevRaffleFollowers, prevRaffleKeyword, prevRaffleEntrantsCount));
                    return;
                } else {
                    $.say($.lang.get("net.phantombot.rafflesystem.result-success-norunning", channel, $.getRewardString(prevRaffleReward, channel), $.getPointsString(prevRafflePrice, channel), prevRaffleMode, prevRaffleFollowers, prevRaffleKeyword, prevRaffleEntrantsCount, prevRaffleWinner, prevRaffleDate));
                    return;
                }
            } else if (action.equalsIgnoreCase("entries") || action.equalsIgnoreCase("entrants")) {
                if (!$.isMod(sender, event.getTags(), channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                    return;
                }

                var raffleEntrants = $.inidb.GetString('raffles', channel.getName(), 'players');

                if ($.strlen(raffleEntrants) == 0) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.entries-error-noresults", channel), channel);
                    return;
                }

                var arrayRaffleEntrants = raffleEntrants.split(',');
                var maxRaffleEntrants = arrayRaffleEntrants.length;
                var maxResults = 15;
                var returnString = "";

                if (args.length == 0 || isNaN(args[1]) || parseInt(args[1]) < 1) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.entries-usage", channel), channel);
                    return;
                } else {
                    var offset = (parseInt(args[1]) - 1) * maxResults;

                    if (offset >= maxRaffleEntrants) {
                        offset = maxRaffleEntrants - 1;
                    }

                    for (i = 0; i < Math.min(maxResults, maxRaffleEntrants - offset); i++) {
                        if ($.strlen(returnString) > 0) {
                            returnString += ", ";
                        }

                        returnString += $.username.resolve(arrayRaffleEntrants[i + offset]);
                    }

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.entries-success", channel, parseInt(args[1]), Math.ceil(maxRaffleEntrants / maxResults), returnString), channel);
                    return;
                }
            } else if (action.equalsIgnoreCase("toggle")) {
                if (!$.isMod(sender, event.getTags(), channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                    return;
                }
                if (!$.inidb.GetBoolean('settings', channel.getName(), 'raffleToggle')) {
                    $.inidb.SetBoolean('settings', channel.getName(), 'raffleToggle', true);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.toggle-enabled", channel), channel);
                } else {
                    $.inidb.SetBoolean('settings', channel.getName(), 'raffleToggle', false);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.toggle-disabled", channel), channel);
                }
            }
        } else {
            if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
                if (!$.tempdb.GetString("t_state", channel.getName(), "raffleKeyword").equalsIgnoreCase("!raffle")
                        || (args.length == 1 && args[0].equalsIgnoreCase("announce"))
                        || ($.tempdb.HasKey("t_raffleEntrants", channel.getName(), sender) && $.isMod(sender, event.getTags(), channel))) {
                    if ($.moduleEnabled("./systems/pointSystem.js", channel)) {
                        if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers") && $.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice") > 0) {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-followers-price", channel, $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel), $.getPointsString($.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice"), channel), $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword")), channel);
                        } else if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers")) {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-followers", channel, $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel), $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword")), channel);
                        } else if ($.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice") > 0) {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-price", channel, $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel), $.getPointsString($.tempdb.GetInteger("t_state", channel.getName(), "rafflePrice"), channel), $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword")), channel);
                        } else {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-default", channel, $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel), $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword")), channel);
                        }
                    } else {
                        if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleFollowers")) {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-followers", channel, $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel), $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword")), channel);
                        } else {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-notcommand-default", channel, $.getRewardString($.tempdb.GetString("t_state", channel.getName(), "raffleReward"), channel), $.tempdb.GetString("t_state", channel.getName(), "raffleKeyword")), channel);
                        }
                    }
                }
            } else {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-error-notrunning", channel, "Moderator"), channel);
            }
        }
    }
});

$.on('ircChannelMessage', function (event) {
    var sender = event.getSender();
    var message = event.getMessage();
    var channel = event.getChannel();

    if ($.tempdb.GetBoolean("t_state", channel.getName(), "raffleRunning")) {
        switch ($.enterRaffle(sender, channel, message)) {
            case 1:
                if ($.inidb.GetBoolean("settings", channel.getName(), "raffleToggle")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-success", channel), channel);
                }
                break;
            case 3:
                if ($.inidb.GetBoolean("settings", channel.getName(), "raffleToggle")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-error-entered", channel), channel);
                }
                break;
            case 4:
                if ($.inidb.GetBoolean("settings", channel.getName(), "raffleToggle")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-error-notenough", channel, $.getPointsName(false, channel)));
                }
                break;
            case 5:
                if ($.inidb.GetBoolean("settings", channel.getName(), "raffleToggle")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-error-iscaster", channel), channel);
                }
                break;
            case 6:
                if ($.inidb.GetBoolean("settings", channel.getName(), "raffleToggle")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.rafflesystem.enter-error-nofollow", channel), channel);
                }
                break;
        }
    }
});

$.registerChatCommand("./systems/raffleSystem.js", "raffle");
$.registerChatCommand("./systems/raffleSystem.js", "raffle announce");
