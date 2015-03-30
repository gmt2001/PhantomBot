$var.pollID = 0;
var results = [];
var high = 0;
var length = 0;
var options = []
var current = "";
var optionsStr = "";
var l = 0;
var count = 0;

function makeVote(option) {
    current = $.pollResults.get(option);
    if (current != null) {
        var n = current.intValue() + 1;
        $.pollResults.put(option, n);
        $var.pollTotalVotes++;
        return true;
    }
    return false;
}

$.endPoll = function () {
    if (pollCallback != null) {
        $var.pollID += 1;
        results = [];
        high = 0;
        options = $var.pollOptions;
        for (var i = 0; i < options.length; ++i) {
            count = $.pollResults.get(options[i].toLowerCase()).intValue();
            if (high < count) {
                high = count;
                results = [options[i]];
            } else if (high == count) {
                results[results.length] = options[i];
            }
        }
        $var.vote_running = false;
        pollCallback(results);
        $.pollResults.clear();
        $.pollVoters.clear();
        $var.pollMaster = null;
        pollCallback = null;
        return true;
    }
    return false;
};

$.runPoll = function (callback, options, time, pollMaster) {
    if ($var.vote_running) {
        return false;
    } else {
        $var.vote_running = true;
    }

    for (var i = 0; i < options.length; ++i) {
        var option = options[i];
        $.pollResults.put(option.toLowerCase(), 0);
    }
    $var.pollOptions = options;
    $var.pollMaster = pollMaster;
    $var.pollTotalVotes = 0;

    if (time > 0) {
        pollCallback = callback;
        var oldID = $var.pollID;
        setTimeout(function () {
            if (oldID == $var.pollID) {
                $.endPoll();
            } else {
                println("Poll closed manually");
            }
        }, time);
        setTimeout(function () {
            if (oldID == $var.pollID) {
                $.say("The poll will close in " + (time * 0.3) / 1000 + " seconds, cast your vote soon.");
            } else {
                println("Poll closed manually");
            }
        }, time * 0.7);
    } else {
        pollCallback = callback;
    }
    return true;
};

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var currentTime = new Date();
    var action = args[0];
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var date = month + "/" + day + "/" + year;

    if (command.equalsIgnoreCase("vote")) {
        if (!$var.vote_running) {
            $.say("There are no open polls running.");
            return;
        }
        if ($.pollVoters.contains(sender)) {
            $.say(username + ", you have already voted.");
            return;
        }
        if (!makeVote(args[0].toLowerCase())) {
            $.say("'" + args[0] + "' is not a valid option!");
        } else {
            $.pollVoters.add(sender);
            if ($var.vote_toggle == true) {
                $.say("Your vote has been recorded, " + username + ".");
            } else if ($var.vote_toggle == false) {
                println("Your vote has been recorded, " + username + ".");
            }
            
        }



    } else if (command.equalsIgnoreCase("poll")) {
        if (!argsString.isEmpty()) {
            action = args[0].toLowerCase();
        }


        $var.vote_toggle = true;
        if ($.inidb.get('settings', 'vote_toggle') == 1) {
            $var.vote_toggle = true;
        } else if ($.inidb.get('settings', 'vote_toggle') == 2) {
            $var.vote_toggle = false;
        }

        if (args.length >= 1) {

            if (action.equalsIgnoreCase("toggle")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if ($var.vote_toggle == false) {

                    $var.vote_toggle = true;
                    $.inidb.set('settings', 'vote_toggle', 1);
                    $.say("Vote messages have been turned on!");

                } else if ($var.vote_toggle == true) {

                    $var.vote_toggle = false;
                    $.inidb.set('settings', 'vote_toggle', 2);
                    $.say("Vote messages have been turned off!");
                }



            }
            if (action.equalsIgnoreCase("results")) {
                if ($var.vote_running) {

                    $.say("[Poll Session] - [" + parseInt($var.pollTotalVotes) + " Total Votes] - [Options: " + $.displayOptions + "]");

                } else {

                    var date = $.inidb.get('polls', 'date');
                    var vOptions = $.inidb.get('polls', 'vote_options');
                    var vTotal = $.inidb.get('polls', 'total_votes');
                    var WinR = $.inidb.get('polls', 'winning_result');
                    var WinRV = $.inidb.get('polls', 'winning_result_votes');

                    if (vOptions == null) {
                        $.say("No past polls.");
                    } else {
                        if (vTotal == null) {
                            vTotal = 0;
                        }

                        if (WinR == null) {
                            WinR = "None";
                        }

                        if (WinRV == null) {
                            WinRV = "0";
                        }

                        $.say("[" + date + "] - [" + vTotal + " Total Votes] - [Winning Result: " + WinR + " with " + WinRV + " votes] - [Options: " + vOptions + "]") 
                    }

                }

            }
        }

        if (args.length >= 2) {
            if (action.equalsIgnoreCase("open")) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }
                length = 0;
                options = []

                if (args.length < 2) {
                    $.say("Usage: '!poll open -t <seconds> <option 1> <option 2>' -- '!poll results' -- '!poll close'");
                    return;
                }

                argStart = 1
                if (args[argStart] == '-t') {
                    length = parseInt(args[argStart + 1]);
                    argStart += 2
                }

                options = args.slice(argStart);

                if (options.length < 2) {
                    $.say("Not enough options, polls must have at least two options!");
                    return;
                }
                if (options.length > 10) {
                    $.say("Max number of options in a poll is 10!");
                    return;
                }

                if ($var.vote_running) {
                    $.say("A vote is already running");
                    return;
                }
            }

            if ($.runPoll(function (result) {
                if (result.length) {
                    $.say("Polls are closed! The winner is \"" + result + "\" with " + $.pollResults.get(result[0]).intValue() + " out of " + parseInt($var.pollTotalVotes) + " votes.");
                    $.inidb.set('polls', 'total_votes', parseInt($var.pollTotalVotes));
                    $.inidb.set('polls', 'winning_result', result);
                    $.inidb.set('polls', 'winning_result_votes', $.pollResults.get(result[0]).intValue());

                } else {
                    var optionsStr = "";
                    var l = result.length - 2;
                    for (var i = 0; i < l; ++i) {
                        optionsStr += result[i] + ", ";
                    }

                    $.say("The poll resulted in a " + result.length + " way tie '" + optionsStr + result[l] + " and " + result[l + 1] + "', each received " + $.pollResults.get(result[0]).intValue() + " out of " + parseInt($var.pollTotalVotes) + " votes.");
                    $.inidb.set('polls', 'total_votes', parseInt($var.pollTotalVotes));
                    $.inidb.set('polls', 'winning_result', result);
                    $.inidb.set('polls', 'winning_result_votes', $.pollResults.get(result[0]).intValue());

                }

            }, options, length * 1000, sender)) {
                optionsStr = "";
                l = options.length - 2;
                for (var i = 0; i < l; ++i) {
                    optionsStr += options[i] + ", ";
                }

                $.displayOptions = optionsStr + options[l] + " and " + options[l + 1];

                $.say("Polls are open! Vote with '!vote <option>'. The options are: " + $.displayOptions);
                $.inidb.set('polls', 'vote_options', $.displayOptions);
                $.inidb.set('polls', 'date', date);
            }


        } else if (args.length >= 1 && action.equalsIgnoreCase("close")) {
            if ($var.pollMaster == null) {
                
            }

            if (!$.isMod(sender)) {
                if ($var.pollMaster != sender) {
                    $.say($.modmsg);
                }
            }

            if (!$.endPoll()) {
                $.say("There is no poll running.");
            }
        

        } else {
            if (argsString.isEmpty()) {
                $.say("Usage: '!poll open [-t <seconds>] <option 1> <option 2>' -- '!poll results' -- '!poll close'");
            }

        }

    }
    

});


$.registerChatCommand("./systems/pollSystem.js", "poll", "mod");