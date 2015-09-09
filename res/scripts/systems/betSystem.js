var betstart = 0;
var betlength = 1 * 180 * 1000;
var minbets = 2;
var pot = 0;
var totalwin = 0;
var entries = 0;
var last_entries = 0;
var bet = 0;
var whispermode = $.inidb.get('settings', 'whisper_bet');
var betstarter;
var winners = "";
var optionString = "";


$.bet_minimum = parseInt($.inidb.get('settings', 'bet_minimum'));
$.bet_maximum = parseInt($.inidb.get('settings', 'bet_maximum'));

if ($.bet_minimum === undefined || $.bet_minimum == null || isNaN($.bet_minimum) || $.bet_minimum < 0) {
	$.bet_minimum = 0;
}
if ($.bet_maximum === undefined || $.bet_maximum == null || isNaN($.bet_maximum) || $.bet_maximum < 0) {
	$.bet_maximum = 0;
}

$.on('command', function (event) {
	var sender = event.getSender();
	var username = $.username.resolve(sender, event.getTags());
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
			
			if (whispermode = "true") {
			$.say("/w " + username + " You can not use !bet because points are disabled!");
			} else {
			$.say(username + ", you can not use !bet because points are disabled!");
			}

			
			return;
		}

		if (args.length >= 1) {
			
			if (action.equalsIgnoreCase("whisper") && $.isModv3(sender, event.getTags())) {
				
				if (whispermode != "true") {
				$.inidb.set("settings", "whisper_bet", "true");
				whispermode = "true";
				$.say("[Whisper Mode] has been activated for the Bet System!");			
				return;	
				} else if (whispermode == "true"){
				$.inidb.set("settings", "whisper_bet", "false");
				whispermode = "false";
				$.say("[Whisper Mode] has been deactivated for the Bet System!");		
				}

				}
			
			if (action.equalsIgnoreCase("min") && $.isModv3(sender, event.getTags())) {

				if (args[1] === 0) {
					if (whispermode = "true") {
					$.say("/w " + username + " You have disabled the minimum bet amount!");
					} else {
					$.say(username + ", you have disabled the minimum bet amount!");
					}
					$.inidb.set('settings', 'bet_minimum', args[1]);
					$.bet_minimum = args[1];
					return;
				}

				if (args[1] == null) {
					if ($.bet_minimum === 0 && $.bet_maximum > 0) {
						if (whispermode = "true") {
						$.say("/w " + username + " You may bet up to " + $.bet_maximum + " " + $.pointname + " or lower!");
						} else {
						$.say(username + ", you may bet up to " + $.bet_maximum + " " + $.pointname + " or lower!");
						}
						return;
					}

					if ($.bet_maximum === 0 && $.bet_minimum > 0) {
						if (whispermode = "true") {
						$.say("/w " + username + " You may bet no lower than " + $.bet_minimum + " " + $.pointname + ".");
						} else {
						$.say(username + ", you may bet no lower than " + $.bet_minimum + " " + $.pointname + ".");
						}
						return;
					}

					$.say("[BET] Current Bet Maximum: " + $.bet_maximum + " " + $.pointname + ", Current Bet Minimum: " + $.bet_minimum + " " + $.pointname + ".");
					return;
				}

				if (parseInt(args[1]) < 0 || parseInt(args[1]) > $.bet_maximum && $.bet_maximum !== 0) {
					if (whispermode = "true") {
					$.say("/w " + username + "You can't set the minimum bet amount below 0 or higher than the bet maximum!");
					} else {
					$.say(username + ", you can't set the minimum bet amount below 0 or higher than the bet maximum!");	
					}
					return;

				} else {
					$.inidb.set('settings', 'bet_minimum', args[1]);
					$.bet_minimum = args[1];
					if (whispermode = "true") {
					$.say("/w " + username + " You have set the minimum amount someone could bet to: " + args[1] + " " + $.pointname + ".");
					} else {
					$.say(username + ", you have set the minimum amount someone could bet to: " + args[1] + " " + $.pointname + ".");
					}
				}

			}

			if (action.equalsIgnoreCase("max") && $.isModv3(sender, event.getTags())) {

				if (args[1] === 0) {
					if (whispermode = "true") {
					$.say("/w " + username + " You have disabled the maximum bet amount!");
					} else {
					$.say(username + ", you have disabled the maximum bet amount!");
					}
					$.inidb.set('settings', 'bet_maximum', args[1]);
					$.bet_maximum = args[1];
					return;
				}

				if (args[1] == null) {
					if ($.bet_minimum === 0 && $.bet_maximum > 0) {
						if (whispermode = "true") {
						$.say("/w " + username + " You may bet up to " + $.bet_maximum + " " + $.pointname + " or lower!");
						} else {
						$.say(username + ", you may bet up to " + $.bet_maximum + " " + $.pointname + " or lower!");
						}
						return;
					}

					if ($.bet_maximum === 0 && $.bet_minimum > 0) {
						if (whispermode = "true") {
						$.say("/w " + username + " You may bet no lower than " + $.bet_minimum + " " + $.pointname + ".");
						} else {
						$.say(username + ", you may bet no lower than " + $.bet_minimum + " " + $.pointname + ".");	
						}
						return;
					}
					if (whispermode = "true") {
					$.say("/w " + username + " The Current Bet Maximum: " + $.bet_maximum + " " + $.pointname + ", Current Bet Minimum: " + $.bet_minimum + " " + $.pointname + ".");
					} else {
					$.say("/w " + username + ", The Current Bet Maximum: " + $.bet_maximum + " " + $.pointname + ", Current Bet Minimum: " + $.bet_minimum + " " + $.pointname + ".");	
					}
					return;
				}

				if (parseInt(args[1]) < $.bet_minimum) {
					if (whispermode = "true") {
					$.say("/w " + username + " You can't set the maximum bet amount below the minimum amount!");
					} else {
					$.say(username + ", you can't set the maximum bet amount below the minimum amount!");
					}
					return;
				} else {
					$.bet_maximum = args[1];
					$.inidb.set('settings', 'bet_maximum', args[1]);
					
					if (whispermode = "true") {
					$.say("/w " + username + " You have set the maximum amount someone could bet to: " + args[1] + " " + $.pointname + ".");
					} else {
					$.say(username + ", you have set the maximum amount someone could bet to: " + args[1] + " " + $.pointname + ".");
					}
				}

			}

			if (action.equalsIgnoreCase("results")) {

				var rWinner = $.inidb.get('bets', 'last_winners');
				var rWinOp = $.inidb.get('bets', 'last_winning_option');
				var crOptions = $.inidb.get('bets', 'options');
				var rOptions = $.inidb.get('bets', 'last_options');
				var crEntries = $.inidb.get('bets', 'entries');
				var rEntries = $.inidb.get('bets', 'last_entries');
				var crPot = $.inidb.get('bets', 'pot');
				var rPot = $.inidb.get('bets', 'last_pot');
				var bDate = $.inidb.get('bets', 'date');

				if ($var.bet_running) {
					if (pot === 0 && entries === 0) {
						if (whispermode = "true") {
						$.say("/w " + username + " Nothing at the moment. '!bet < amount > < option >' to wager your " + $.pointname + " on one of the following options: " + $var.bet_optionsString);
						} else {
						$.say(username + ", There's nothing at the moment. '!bet < amount > < option >' to wager your " + $.pointname + " on one of the following options: " + $var.bet_optionsString);	
						}
						return;
					} else {
						if (whispermode = "true") {
						$.say("/w " + username + " [Current Results] Pot: " + crPot + " " + $.pointname + ", Bets: " + crEntries + ", Options: " + crOptions + ".");
						} else {
						$.say(username + ", The [Current Results] Pot: " + crPot + " " + $.pointname + ", Bets: " + crEntries + ", Options: " + crOptions + ".");	
						}
					}

				} else {

					if (rOptions == null) {
						if (whispermode = "true") {
						$.say("/w " + username + " There are no past bets.");
						} else {
						$.say("/w " + username + ", there are no past bets.");
						}
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
						if (whispermode = "true") {
						$.say("/w " + username + " [" + bDate + "] - [Pot: " + rPot + " " + $.pointname + "] - [Options: " + rOptions + "] - [Entries: " + rEntries + "] - [Winning Option: " + rWinOp + "] - [Winners: " + rWinner + "]");
						} else {
						$.say("[" + bDate + "] - [Pot: " + rPot + " " + $.pointname + "] - [Options: " + rOptions + "] - [Entries: " + rEntries + "] - [Winning Option: " + rWinOp + "] - [Winners: " + rWinner + "]");
						}
					}

				}

			}

			if (action.equalsIgnoreCase("open") && !$var.bet_running || action.equalsIgnoreCase("start") && !$var.bet_running) {
                if (!$.isAdmin(sender)) {
					if (whispermode = "true") {
                    $.say("/w " + username + " " + $.adminmsg);
					} else {
					$.say(username + " " + $.adminmsg);	
					}
                    return;
                }
				entries = 0;
				optionString = "";
				$.inidb.set('bets', 'pot', 0); //
				$.inidb.set('bets', 'winners', "");
				$.inidb.set('bets', 'entries', 0); //
				betstarter = sender;
				$var.bet_options = [];

				var boptions = args.slice(1);
				if (boptions.length <= 1) {
					if (whispermode = "true") {
					$.say("/w " + username + " You must enter at least two options to start a bet!");
					} else {
					$.say(username + ", you must enter at least two options to start a bet!");
					}
					return;

				}

				for (var i = 0; i < boptions.length; i++) {
					$var.bet_options.push(boptions[i].trim().toLowerCase());

					if (!optionString.equals("")) {
						optionString = optionString + " vs ";
					}

					optionString = optionString + "'" + boptions[i].trim().toUpperCase() + "'";
				}
				$var.bet_table = {};
				$var.bet_running = true;
				$.say("/me [BET] is now open for: " + optionString + " >> You have " + (betlength / 1000) + " seconds to wager your " + $.pointname + " with '!bet < amount > < option >'");
				$var.bet_optionsString = optionString;
				$.inidb.set('bets', 'date', date);
				$.inidb.set('bets', 'options', optionString); //

				$var.bet_id = System.currentTimeMillis();

				betstart = System.currentTimeMillis();

				var betid = $var.bet_id;

				setTimeout(function () {
					if (!$var.bet_running)
						return;
					if ($var.bet_id != betid)
						return;

					$.say("/me [BET] is now closed! [Pot: " + pot + " " + $.pointname + "] please wait for the results!");
				}, betlength);

			} else if (action.equalsIgnoreCase("time") && !$var.bet_running) {
				if (!$.isModv3(sender, event.getTags())) {
					if (whispermode = "true") {
					$.say("/w " + username + " " + $.modmsg);
					} else {
					$.say(username + " " + $.modmsg);
					}
					return;
				}

				if (parseInt(args[1]) >= 60) {
					betlength = parseInt(args[1]) * 1000;

					$.say("/me [BET] time limit is now set to " + args[1] + " seconds!");
				} else if (args[1] == "0") {
					$.say("/me [BET] time limit is currently set to " + betlength + " seconds!");
				} else {
					$.say("/me [BET] time limit is 60 seconds!");
				}

			} else if (action.equalsIgnoreCase("win") || action.equalsIgnoreCase("close") || action.equalsIgnoreCase("end")) {
				if (sender == betstarter || $.isModv3(sender, event.getTags())) {}
				else {
					if (whispermode = "true") {
					$.say("/w " + username + " @" + $.username.resolve(betstarter) + " opened this bet and is the only that can close it with '!bet win (option)'");
					} else {
					$.say("@" + $.username.resolve(betstarter) + " opened this bet and is the only that can close it with '!bet win (option)'");
					}
					return;
				}
				if (!$var.bet_running)
					return;

				var winning = args.slice(1).join(" ").trim().toLowerCase();

				if (!$.array.contains($var.bet_options, winning)) {
					if (whispermode = "true") {
					$.say("/w " + username + " " + winning + " doesn't match any of the options.");
					} else {
					$.say(username + ", " + winning + " doesn't match any of the options.");
					}
					return;
				}

				for (var user in $var.bet_table) {
					bet = $var.bet_table[user];
					if (bet.option.equalsIgnoreCase(winning)) {
						totalwin += parseInt(bet.amount);
					} else {}

				}

				var a = 0;
				var moneyWon = 0;
				var win_percent = 0;

				for (user in $var.bet_table) {
					a++;
					bet = $var.bet_table[user];
					if (bet.option.equalsIgnoreCase(winning)) {
						moneyWon = parseInt((pot / totalwin));
						
						if (moneyWon > 0) {

							if (winners.length > 0) {
								winners = winners + ", ";
							}
	
							winners += $.username.resolve(user);
							println("Winners = " + winners);
						}

					}
				}
				
				$.inidb.set('bets', 'winners', winners);
				println("Setting winners to = " + winners + ".");
				
				if (a < minbets) {
					$.say("/me [BET CLOSED] There weren't enough bets to determine a proper win. Sending " + $.pointname + " back!");

					for (user in $var.bet_table) {
						bet = $var.bet_table[user];
						$.inidb.incr('points', user, bet.amount);
					}
				} else {
					if (pot === 0) {
						$.say("/me [BET CLOSED] Everyone wagered on the same winning option. Deducted " + $.pointname + " have been returned!");

						for (user in $var.bet_table) {
							bet = $var.bet_table[user];
							$.inidb.incr('points', user, (bet.amount));
						}
					} else if (totalwin === 0) {
						$.say("/me [BET CLOSED] Everyone lost the bet! Womp womp :(");
					} else {
						for (user in $var.bet_table) {
							bet = $var.bet_table[user];
							if (bet.option.equalsIgnoreCase(winning)) {
								win_percent = (bet.amount / totalwin);

								$.inidb.incr('points', user, pot * win_percent);
								println("Calculations for " + user + " were: " + bet.amount + "/" + totalwin + " = win%. " + pot + "*" + win_percent + " = points won.");

							}
						}

						$.say("/me [BET CLOSED] The results are in! " + winning + " has won! [Winning Pot: " + pot + " " + $.pointname + "] Pot will be sent to the following viewers: " + winners);

					}
				}
				$.inidb.set('bets', 'last_winners', winners);
				$.inidb.set('bets', 'last_winning_option', winning);
				$.inidb.set('bets', 'last_options', optionString); //
				$.inidb.set('bets', 'last_entries', entries); //
				$.inidb.set('bets', 'last_pot', parseInt(pot)); //
				println("Setting ini...winners: " + winners + ". winning option: " + winning + ". Reseting pot.");
				pot = 0;
				totalwin = 0;
				winners = "";
				$var.bet_running = false;
			} else {

				if (!$var.bet_running)
					return;

				var amount = parseInt(args[0]);
				var option = args.slice(1).join(" ").trim().toLowerCase();

				if (betstart + betlength < System.currentTimeMillis()) {
					if (whispermode = "true") {
					$.say("/w " + username + " Sorry, betting is closed, " + username + "!");
					} else {
					$.say("Sorry, betting is closed, " + username + "!");	
					}
					return;
				}

				if (!$.array.contains($var.bet_options, option)) {
					if (whispermode = "true") {
					$.say("/w " + username + " " + option + " is not a valid option!");
					} else {
					$.say(username + ", " + option + " is not a valid option!");	
					}
					return;
				}

				if ($.bet_minimum === 0) {}
				else if (amount < $.bet_minimum) {
					if (whispermode = "true") {
					$.say("/w " + username + " The minimum amount of " + $.pointname + " that you can wager is: " + $.bet_minimum + " " + $.pointname + ".");
					} else {
					$.say(username + ", the minimum amount of " + $.pointname + " that you can wager is: " + $.bet_minimum + " " + $.pointname + ".");	
					}
					return;
				}

				if ($.bet_maximum === 0) {}
				else if (amount > $.bet_maximum) {
					if (whispermode = "true") {
					$.say("/w " + username + " The maximum amount of " + $.pointname + " that you can wager is: " + $.bet_maximum + " " + $.pointname + ".");
					} else {
					$.say(username + ", the maximum amount of " + $.pointname + " that you can wager is: " + $.bet_maximum + " " + $.pointname + ".");	
					}
					return;
				}

				var points = $.inidb.get('points', sender);
				if (points == null)
					points = 0;
				else
					points = parseInt(points);

				if (amount > points) {
					if (whispermode = "true") {
					$.say("/w " + username + " You don't have that amount of " + $.pointname + " to wager!");
					} else {
					$.say(username + ", you don't have that amount of " + $.pointname + " to wager!");	
					}
					return;
				}

				if (amount < 1) {
					if (whispermode = "true") {
					$.say("/w " + username + " Your wager must be greater than 0!");
					} else {
					$.say(username + ", your wager must be greater than 0!");	
					}
					return;
				}

				if (sender in $var.bet_table) {
					if (whispermode = "true") {
					$.say("/w " + username + " You have already placed your bet!");
					} else {
					$.say(username + ", you have already placed your bet!");	
					}
					return;
				} else {
					$.inidb.decr('points', sender, amount);
					pot += parseInt(amount);
					entries++;
					$.inidb.set('bets', 'entries', entries); //
				}

				if (pot < 1) {
					potmessage = args[0];
				} else {
					potmessage = pot;
				}
				$.say("/me " + username + " wagers " + args[0] + " " + $.pointname + " on " + option + "! [Pot: " + potmessage + " " + $.pointname + "]");
				$.inidb.set('bets', 'pot', parseInt(pot)); //


				$var.bet_table[sender] = {
					amount : parseInt(amount),
					option : option
				};
			}
		} else {
			if ($var.bet_running) {
				if (betstart + betlength < System.currentTimeMillis()) {
					if (whispermode = "true") {
					$.say("/w " + username + " Betting is now closed! Please wait for the results! [Current Pot: " + pot + " " + $.pointname + "] for options " + $var.bet_optionsString);
					} else {
					$.say(username + ", betting is now closed! Please wait for the results! [Current Pot: " + pot + " " + $.pointname + "] for options " + $var.bet_optionsString);
					}
				} else {

					var betmessage = "";
					betmessage = ", the options are: " + optionsString + "! Type '!bet (amount) (option)' to enter!";

					if (argsString.isEmpty()) {
						if (whispermode = "true") {
						$.say("/w " + username + " [Current Pot] >> " + pot + " " + $.pointname + " << " + username + " " + betmessage);
						} else {
						$.say("[Current Pot] >> " + pot + " " + $.pointname + " << " + username + " " + betmessage);
						}

					}

				}
			} else {
				if (argsString.isEmpty()) {
					$.say("Usage: '!bet open' - '!bet open (options)' - '!bet time (seconds)' - '!bet results' - '!bet win (option)' - '!bet (amount) (option)'");

				}

			}

		}

	}
});

setTimeout(function () {
	if ($.moduleEnabled('./systems/betSystem.js')) {
		$.registerChatCommand("./systems/betSystem.js", "bet");
		$.registerChatCommand("./systems/betSystem.js", "bet win");
		$.registerChatCommand("./systems/betSystem.js", "bet open");
		$.registerChatCommand("./systems/betSystem.js", "bet time", "mod");
		$.registerChatCommand("./systems/betSystem.js", "bet results");
		$.registerChatCommand("./systems/betSystem.js", "bet whisper");
	}
}, 10 * 1000);
