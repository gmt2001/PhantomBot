var betstart = 0;
var betlength = 1 * 120 * 1000;
var minbets = 2;
var pot = 0;
var totalwin = 0;
var entries = 0;
var bet = 0;
var betstarter;


$.on('command', function (event) {
    var sender = event.getSender();
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

    if (command.equalsIgnoreCase("bet")) {
        if (!$.moduleEnabled("./systems/pointSystem.js")) {
            $.say("You can not use !bet because points are disabled!");
            return;
        }

        $var.bet_toggle = true;
        if ($.inidb.get('settings', 'bet_toggle') == 1) {
            $var.bet_toggle = true;
        } else if ($.inidb.get('settings', 'bet_toggle') == 2) {
            $var.bet_toggle = false;
        }


        if (args.length >= 1) {
            if (action.equalsIgnoreCase("results")) {
         
                var rWinner = $.inidb.get('bets', 'winner');
                var rWinOp = $.inidb.get('bets', 'winning_option');
                var rOptions = $.inidb.get('bets', 'options');
                var rEntries = $.inidb.get('bets', 'entries');
                var rPot = $.inidb.get('bets', 'pot');
                var bDate = $.inidb.get('bets', 'date');

                if ($var.bet_running) {
                    if ( pot == 0 && entries == 0) {
                        $.say("/me Nothing at the moment. '!bet < amount > < option >' to wager your " + $.pointname + " on one of the following options: " + $var.bet_optionsString);
                        return;
                    } else {
                        $.say("[Current Results] Pot: " + pot + " " + $.pointname + ", Bets: " + entries +", Options: " + rOptions + ".");
                    }
                
                } else {

                    if (rOptions == null) {
                        $.say("There are no past bets.")
                    } else {

                        if (rWinner == null) {
                            rWinner = "None";
                        }
                        if (rPot == null) {
                            rPot = 0;
                        }
                        if (rEntries == null) {
                            rEntries = 0;
                        }
                        if (rWinOp == null) {
                            rWinOp = "None";
                        }

                        $.say("[" + bDate +"] - [Pot: " + rPot + " " + $.pointname + "] - [Options: " + rOptions + "] - [Entries: " + rEntries + "] - [Winning Option: " + rWinOp + "] - [Winner: " + rWinner + "]");
                    }

                }

            }

            if (action.equalsIgnoreCase("toggle")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if ($var.bet_toggle == false) {

                    $var.bet_toggle = true;
                    $.inidb.set('settings', 'bet_toggle', 1);
                    $.say("Bet messages have been turned on!");

                } else if ($var.bet_toggle == true) {

                    $var.bet_toggle = false;
                    $.inidb.set('settings', 'bet_toggle', 2);
                    $.say("Bet messages have been turned off!");
                }

            }
        
        }

        if (args.length >= 1) {


            if (action.equalsIgnoreCase("open") && !$var.bet_running || action.equalsIgnoreCase("start") && !$var.bet_running) {
                betstarter = sender;

                $var.bet_options = [];

                var boptions = args.slice(1);
                if (boptions.length <= 1 ){
                    boptions[0] = "1p";
                    boptions[1] = "2p";
                }

                var optionString = "";

                for (i = 0; i < boptions.length; i++) {
                    $var.bet_options.push(boptions[i].trim().toLowerCase());

                    if (!optionString.equals("")) {
                        optionString = optionString + " vs ";
                    }

                    optionString = optionString + "'" + boptions[i].trim().toUpperCase() + "'";
                }

                $var.bet_table = {};
                $var.bet_running = true;
                $.say("/me Betting is now open for: " + optionString + " >> You have " + (betlength / 1000) + " seconds to wager your " + $.pointname + " with '!bet < amount > < option >'");
                $var.bet_optionsString = optionString;
                $.inidb.set('bets', 'date', date);
                $.inidb.set('bets', 'options', optionString); //

                $var.bet_id = System.currentTimeMillis();

                betstart = System.currentTimeMillis();

                var betid = $var.bet_id

                setTimeout(function () {
                    if (!$var.bet_running) return;
                    if ($var.bet_id != betid) return;

                    $.say("/me Betting is now closed! [Pot: " + pot + " " + $.pointname + "] please wait for the results!")
                }, betlength);


            } else if (action.equalsIgnoreCase("time") && !$var.bet_running) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }

                if (parseInt(args[1]) >= 60) {
                    betlength = parseInt(args[1]) * 1000;

                    $.say("The bet time limit is now set to " + args[1] + " seconds!")
                } else if (args[1] == "0") {
                    $.say("The bet time limit is currently set to " + betlength + " seconds!")
                } else {
                    $.say("The minimum bet time limit is 60 seconds!")
                }



            } else if (action.equalsIgnoreCase("win") || action.equalsIgnoreCase("close") || action.equalsIgnoreCase("end")) {
                if (sender == betstarter || $.isMod(sender)) {
                    
                } else {
                    $.say("@" + $.username.resolve(betstarter) + " opened this bet and is the only that can close it with '!bet win <option>'");
                    return;
                }

                if (!$var.bet_running) return;
                var winning = args.slice(1).join(" ").trim().toLowerCase();

                if (!$.array.contains($var.bet_options, winning)) {
                    $.say($.username.resolve(sender) + ", " + winning + " doesn't match any of the options.");
                    return;
                }

                for (var user in $var.bet_table) {
                    bet = $var.bet_table[user];
                    if (bet.option.equalsIgnoreCase(winning)) {
                        totalwin += parseInt(bet.amount);
                    } else {
                    //pot += parseInt(bet.amount);
                    }
                }

                var a = 0;
                var winners = ""
                var moneyWon = 0


                for (user in $var.bet_table) {
                    a++;
                    bet = $var.bet_table[user];
                    if (bet.option.equalsIgnoreCase(winning)) {
                        moneyWon = parseInt((bet.amount / totalwin) * pot );
                        println("[Bet Pot Amount] " + bet.amount + " / totalwin: " + totalwin + ") * pot: " + pot);

                        if (moneyWon > 0) {
                            if (winners.length > 0) {
                                winners = winners + ", "
                            }

                            winners = winners + $.username.resolve(user)
                            $.inidb.set('bets', 'players', winners); //
                        }
                    }
                }

                if (a < minbets) {
                    $.say("/me [BET CLOSED] >> There weren't enough bets to determine a proper win.");

                    for (user in $var.bet_table) {
                        bet = $var.bet_table[user];
                        $.inidb.incr('points', user, bet.amount);
                    }
                } else {
                    if (pot == 0) {
                        $.say("/me Everyone wagered on the same winning option. Deducted " + $.pointname + " has been returned!");

                        for (user in $var.bet_table) {
                            bet = $var.bet_table[user];
                            $.inidb.incr('points', user, (bet.amount));
                        }
                    } else if (totalwin == 0) {
                        $.say("/me Everyone lost the bet!");
                    } else {
                        for (user in $var.bet_table) {
                            bet = $var.bet_table[user];
                            if (bet.option.equalsIgnoreCase(winning)) {
                                moneyWon = parseInt(pot);
                                $.inidb.incr('points', user, moneyWon / 2);

                            }
                        }

                        $.say("/me [DA-DA-DAA!] The results are in! " + winning + " has won! [Winning Pot: " + pot + " " + $.pointname + "] Pot will be sent to the following viewers: " + winners);
                        $.inidb.set('bets', 'winner', (winners)); //
                        $.inidb.set('bets', 'winning_option', pot); //
                        pot = 0;
                    }
                }
                $var.bet_running = false;
            } else {
                if (args[1] == "1p" && !$var.bet_running || args[1] == "2p" && !$var.bet_running) {
					
                    betstarter = sender;

                    $var.bet_options = [];

                    var boptions = args.slice(1);
                    if (boptions.length <= 1){
                        boptions[0] = "1p";
                        boptions[1] = "2p";
                    }

                    var optionString = "";

                    for (i = 0; i < boptions.length; i++) {
                        $var.bet_options.push(boptions[i].trim().toLowerCase());

                        if (!optionString.equals("")) {
                            optionString = optionString + " vs ";
                        }

                        optionString = optionString + "'" + boptions[i].trim().toUpperCase() + "'";
                    } 

                    $var.bet_table = {};
                    $var.bet_running = true;
                    $.say("/me Betting is now open for: " + optionString + " >> You have " + (betlength / 1000) + " seconds to wager your " + $.pointname + " with '!bet < amount > < 1p / 2p >'");
                    $var.bet_optionsString = optionString;
                    $.inidb.set('bets', 'date', date);
                    $.inidb.set('bets', 'options', optionString); //

                    $var.bet_id = System.currentTimeMillis();

                    betstart = System.currentTimeMillis();

                    var betid = $var.bet_id

                    setTimeout(function () {
                        if (!$var.bet_running) return;
                        if ($var.bet_id != betid) return;

                        $.say("/me Betting is now closed! [Pot: " + pot + " " + $.pointname + "] please wait for the results!")
                    }, betlength);
                } 
                
                if (!$var.bet_running) return;
                var amount = parseInt(args[0]);
                var option = args.slice(1).join(" ").trim().toLowerCase();

				
				
                if (betstart + betlength < System.currentTimeMillis()) {
                    $.say("Sorry, betting is closed, " + $.username.resolve(sender) + "!")
                    return;
                }

                if (!$.array.contains($var.bet_options, option)) {
                    $.say(option + " is not a valid option, " + $.username.resolve(sender) + "!");
                    return;
                }

                if (amount <= 0) {
                    $.say("Nice try, but I can't let you do that " + $.username.resolve(sender) + ".");
                    return;
                }

                var points = $.inidb.get('points', sender);
                if (points == null) points = 0;
                else points = parseInt(points);

                if (amount > points) {
                    $.say($.username.resolve(sender) + ", " + " you don't have that amount of " + $.pointname + " to wager!");
                    return;
                }


                if (sender in $var.bet_table) {
                    $.say("You have already placed your bet " + username + "!");
                    return;
                } else {
                    $.inidb.decr('points', sender, amount);
                    pot += parseInt(amount);
                    entries++
                    $.inidb.set('bets', 'entries', entries); //
                }

                if (pot < 1) {
                    potmessage = args[0];
                } else {
                    potmessage = pot;
                }

                if ($var.bet_toggle == true) {
                    $.say("/me " + $.username.resolve(sender) + " wagers " + args[0] + " " + $.pointname + " on " + option + "! [Pot: " + potmessage + " " + $.pointname + "]");
                } else if ($var.bet_toggle == false) {
                    println($.username.resolve(sender) + " wagers " + args[0] + " " + $.pointname + " on " + option + "! [Pot: " + potmessage + " " + $.pointname + "]");
                }
                
                $.inidb.set('bets', 'pot', parseInt(pot)); //
                $var.bet_table[sender] = {
                    amount: parseInt(amount),
                    option: option
                };
            }
        } else {
            if ($var.bet_running) {
                if (betstart + betlength < System.currentTimeMillis()) {
                    $.say("/me Betting is now closed! Please wait " + username + " for the results! [Current Pot: " + pot + " " + $.pointname + "] for options " + $var.bet_optionsString);
                } else {

                    var betmessage = "";
                    betmessage = ", the options are: " + $var.bet_optionsString + "! Type '!bet < amount > < option >' to enter!";

                    if (argsString.isEmpty()) {
                        $.say("/me [Current Pot] >> " + pot + " " + $.pointname + " << " + username + " " + betmessage);
                    }
                }

            } else {
                if (argsString.isEmpty()) {
                    $.say("Usage: '!bet open' - '!bet open < options >' - '!bet time < seconds >' - '!bet results' - '!bet win < option >' - '!bet < amount > < option >'");

                }

            }
        }
    }
});

$.registerChatCommand("./commands/betSystem.js", "bet");
$.registerChatCommand("./commands/betSystem.js", "bet win");
$.registerChatCommand("./commands/betSystem.js", "bet open");
$.registerChatCommand("./commands/betSystem.js", "bet time", "mod");
$.registerChatCommand("./commands/betSystem.js", "bet results");