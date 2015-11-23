$.bankheistIsOn = false;
$.pointsId = 0;
$.entrySeconds = 0;
$.senderId = "";
$.senderBet = "";
$.heistUserPoints = "";
$.userPointsId = "";
$.winningPot = 0;

$.bankheistToggle = $.inidb.get("settings", "bankheistToggle");
if ($.bankheistToggle == null) {
    $.bankheistToggle = false;
    $.inidb.set("settings", "bankheistToggle", "false");
}

$.bankheistMaxBet = $.inidb.get("settings", "bankheistmaxbet");
if ($.bankheistMaxBet == null) {
    $.bankheistMaxBet = 1000; //max amount available to bet
    $.inidb.set("settings", "bankheistmaxbet", $.bankheistMaxBet);
}

$.signupMinutes = $.inidb.get("bankheist_timers", "signupMinutes");
if ($.signupMinutes == null) {
    $.signupMinutes = 1; //in minute
    $.inidb.set("bankheist_timers", "signupMinutes", $.signupMinutes);
}

$.heistMinutes = $.inidb.get("bankheist_timers", "heistMinutes");
if ($.heistMinutes == null) {
    $.heistMinutes = 30; //in minutes
    $.inidb.set("bankheist_timers", "heistMinutes", $.heistMinutes);
}

$.stringNoJoin = $.inidb.get("bankheist_strings", "stringNoJoin");
if ($.stringNoJoin == null) {
    $.stringNoJoin = $.lang.get("net.phantombot.bankheistsystem.bank-is-safe");
    $.inidb.set("bankheist_strings", "stringNoJoin", $.stringNoJoin);
}

$.stringStarting = $.inidb.get("bankheist_strings", "stringStarting");
if ($.stringStarting == null) {
    $.stringStarting = $.lang.get("net.phantombot.bankheistsystem.starting");
    $.inidb.set("bankheist_strings", "stringStarting", $.stringStarting);
}

$.stringFlawless = $.inidb.get("bankheist_strings", "stringFlawless");
if ($.stringFlawless == null) {
    $.stringFlawless = $.lang.get("net.phantombot.bankheistsystem.stringFlawless");
    $.inidb.set("bankheist_strings", "stringFlawless", $.stringFlawless);
}

$.stringCasualties = $.inidb.get("bankheist_strings", "stringCasualties");
if ($.stringCasualties == null) {
    $.stringCasualties = $.lang.get("net.phantombot.bankheistsystem.stringCasualties");
    $.inidb.set("bankheist_strings", "stringCasualties", $.stringCasualties);
}

$.stringPayouts = $.inidb.get("bankheist_strings", "stringPayouts");
if ($.stringPayouts == null) {
    $.stringPayouts = $.lang.get("net.phantombot.bankheistsystem.payouts");
    $.inidb.set("bankheist_strings", "stringPayouts", $.stringPayouts);
}

$.stringAllDead = $.inidb.get("bankheist_strings", "stringAllDead");
if ($.stringAllDead == null) {
    $.stringAllDead = $.lang.get("net.phantombot.bankheistsystem.all-dead");
    $.inidb.set("bankheist_strings", "stringAllDead", $.stringAllDead);
}

$.banksClosed = $.inidb.get("bankheist_strings", "banksClosed");
if ($.banksClosed == null) {
    $.banksClosed = $.lang.get("net.phantombot.bankheistsystem.bank-closed");
    $.inidb.set("bankheist_strings", "banksClosed", $.banksClosed);
}

$.enterABet = $.inidb.get("bankheist_strings", "enterABet");
if ($.enterABet == null) {
    $.enterABet = $.lang.get("net.phantombot.bankheistsystem.enter-bet-usage");
    $.inidb.set("bankheist_strings", "enterABet", $.enterABet);
}

$.affordBet = $.inidb.get("bankheist_strings", "affordBet");
if ($.affordBet == null) {
    $.affordBet = $.lang.get("net.phantombot.bankheistsystem.afford-bet");
    $.inidb.set("bankheist_strings", "affordBet", $.affordBet);
}

$.alreadyBet = $.inidb.get("bankheist_strings", "alreadyBet");
if ($.alreadyBet == null) {
    $.alreadyBet = $.lang.get("net.phantombot.bankheistsystem.already-beted");
    $.inidb.set("bankheist_strings", "alreadyBet", $.alreadyBet);
}

$.startedHeist = $.inidb.get("bankheist_strings", "startedHeist");
if ($.startedHeist == null) {
    $.startedHeist = $.lang.get("net.phantombot.bankheistsystem.heist-started");
    $.inidb.set("bankheist_strings", "startedHeist", $.startedHeist);
}

$.joinedHeist = $.inidb.get("bankheist_strings", "joinedHeist");
if ($.joinedHeist == null) {
    $.joinedHeist = $.lang.get("net.phantombot.bankheistsystem.joined-heist");
    $.inidb.set("bankheist_strings", "joinedHeist", $.joinedHeist);
}

$.banksOpen = $.inidb.get("bankheist_strings", "banksOpen");
if ($.banksOpen == null) {
    $.banksOpen = $.lang.get("net.phantombot.bankheistsystem.bank-open");
    $.inidb.set("bankheist_strings", "banksOpen", $.banksOpen);
}

$.heistCancelled = $.inidb.get("bankheist_strings", "heistCancelled");
if ($.heistCancelled == null) {
    $.heistCancelled = $.lang.get("net.phantombot.bankheistsystem.heist-canceled");
    $.inidb.set("bankheist_strings", "heistCancelled", $.heistCancelled);
}

$.betTooLarge = $.inidb.get("bankheist_strings", "betTooLarge");
if ($.betTooLarge == null) {
    $.betTooLarge = $.lang.get("net.phantombot.bankheistsystem.max-allowed");
    $.inidb.set("bankheist_strings", "betTooLarge", $.betTooLarge);
}

$.chances50 = $.inidb.get("bankheist_chances", "chances50");
if ($.chances50 == null) {
    $.chances50 = $.randInterval(33, 36);
    $.inidb.set("bankheist_chances", "chances50", $.chances50);
}

$.chances40 = $.inidb.get("bankheist_chances", "chances40");
if ($.chances40 == null) {
    $.chances40 = $.randInterval(39, 44);
    $.inidb.set("bankheist_chances", "chances40", $.chances40);
}

$.chances30 = $.inidb.get("bankheist_chances", "chances30");
if ($.chances30 == null) {
    $.chances30 = $.randInterval(43, 50);
    $.inidb.set("bankheist_chances", "chances30", $.chances30);
}

$.chances20 = $.inidb.get("bankheist_chances", "chances20");
if ($.chances20 == null) {
    $.chances20 = $.randInterval(48, 58);
    $.inidb.set("bankheist_chances", "chances20", $.chances20);
}

$.chances10 = $.inidb.get("bankheist_chances", "chances10");
if ($.chances10 == null) {
    $.chances10 = $.randInterval(55, 65);
    $.inidb.set("bankheist_chances", "chances10", $.chances10);
}

$.ratio50 = $.inidb.get("bankheist_ratios", "ratio50");
if ($.ratio50 == null) {
    $.ratio50 = 2.75;
    $.inidb.set("bankheist_ratios", "ratio50", $.ratio50);
}

$.ratio40 = $.inidb.get("bankheist_ratios", "ratio40");
if ($.ratio40 == null) {
    $.ratio40 = 2.25;
    $.inidb.set("bankheist_ratios", "ratio40", $.ratio40);
}

$.ratio30 = $.inidb.get("bankheist_ratios", "ratio30");
if ($.ratio30 == null) {
    $.ratio30 = 2;
    $.inidb.set("bankheist_ratios", "ratio30", $.ratio30);
}

$.ratio20 = $.inidb.get("bankheist_ratios", "ratio20");
if ($.ratio20 == null) {
    $.ratio20 = 1.7;
    $.inidb.set("bankheist_ratios", "ratio20", $.ratio20);
}

$.ratio10 = $.inidb.get("bankheist_ratios", "ratio10");
if ($.ratio10 == null) {
    $.ratio10 = 1.5;
    $.inidb.set("bankheist_ratios", "ratio10", $.ratio10);
}

function processBankheist() {
    $.winningPot = 0;
    if ($.pointsId + 1 == 1) {
        $.bankheistIsOn = false;
        $.say($.stringNoJoin);
        $.entrySeconds = 0;
        $.pointsId = 0;
        return;
    } else {
        $.bankheistIsOn = false;
        $.say($.stringStarting);
        var people = $.pointsId;
        var chances = 0;
        var winningsRatio = 1;

        if (people >= 40) {
            chances = parseInt($.chances50);
            winningsRatio = parseInt($.ratio50);
        } else if (people <= 39 && people >= 30) {
            chances = parseInt($.chances40);
            winningsRatio = parseInt($.ratio40);
        } else if (people <= 29 && people >= 20) {
            chances = parseInt($.chances30);
            winningsRatio = parseInt($.ratio30);
        } else {
            if (people < 20 && people >= 10) {
                chances = parseInt($.chances20);
                winningsRatio = parseInt($.ratio20);
            } else if (people < 10) {
                chances = parseInt($.chances10);
                winningsRatio = parseInt($.ratio10);
            }
        }
        var winnersList = $.stringPayouts;
        var winnersListEmpty = true;
        var i = 1;
        $.flawless = 1;
        while (i <= people) {
            var name = $.inidb.get("bankheist_roster", i);
            var bet = $.inidb.get("bankheist_bets", i);
            var username = $.username.resolve(name);
            var randomNum = $.randRange(1, 100);
            $.heistUserPoints = parseInt($.inidb.get("points", name));
            if (randomNum <= chances) {
                var betWin = parseInt(Math.round(winningsRatio * bet));
                $.winningPot += betWin;
                $.inidb.incr("points", name, betWin + bet);
                winnersList += username;
                winnersList += " ";
                winnersList += "(+" + betWin.toString() + ")";

                if (i < people) {
                    winnersList += ", ";
                }

                winnersListEmpty = false;
            } else {
                $.flawless -= 1;
            }
            i++;
        }
        if (winnersListEmpty == true) {
            $.entrySeconds = 0;
            $.pointsId = 0;
            $.say($.stringAllDead);
        } else {
            $.entrySeconds = 0;
            $.pointsId = 0;
            $.inidb.SaveAll(true);
            var string = "";
            if (winnersList.substr(winnersList.length - 1) == ",") {
                winnersList = winnersList.substring(0, winnersList.length - 1);
            }
            if (winnersList.substr(winnersList.length - 2) == ", ") {
                winnersList = winnersList.substring(0, winnersList.length - 2);
            }

            if ($.flawless > 0) {
                string = $.stringFlawless;
            } else {
                string = $.stringCasualties;
            }

            string = string.replace('(pointname)', $.getPointsString($.winningPot));

            $.say(string);
            $.say(winnersList);
        }
    }
};

function startHeist() {

    $.startBankHeist = $.timer.addTimer("./systems/bankheistSystem.js", "bankheist", true, function () {
        if (!$.isOnline($.channelName)) {
            return;
        }
        $.enterBankheist = $.timer.addTimer("./systems/bankheistSystem.js", "enterbankheist", true, function () {
            $.entrySeconds++;
            if ($.entrySeconds == 1) {
                $.bankheistIsOn = true;
                $.inidb.RemoveFile("bankheist_roster");
                $.inidb.RemoveFile("bankheist_bets");

                $.senderId = "";
                $.senderBet = "";
                $.say($.banksOpen + $.signupMinutes + $.lang.get("net.phantombot.bankheistsystem.min-to-join"));
            } else {
                $.processBankheist();
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
            }
            return;
        }, (parseInt($.signupMinutes) * 60) * 1000); //signup time
    }, (parseInt($.heistMinutes) * 60) * 1000); //bankheist run time

}
;

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var args = event.getArgs();
    var betAmount = args[0];


    if (command.equalsIgnoreCase("bankheist")) {
        if (args[0] == null) {
            $.say($.getWhisperString(sender) + $.banksClosed);
            return;
        }

        if (args[0] == "toggle") {
            if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            if ($.bankheistToggle == false) {
                $.bankheistToggle = true;
                $.inidb.set("settings", "bankheistToggle", "true");

                startHeist();

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.bankheist-enabled"));
                return;

            } else {
                $.bankheistToggle = false;
                $.inidb.set("settings", "bankheistToggle", "false");
                $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                $.inidb.RemoveFile("bankheist_roster");
                $.inidb.RemoveFile("bankheist_bets");

                $.senderId = "";
                $.senderBet = "";
		$.bankheistIsOn = false;
		$.entrySeconds = 0;
		$.winningPot = 0;
		$.pointsId = 0;
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.bankheist-disabled"));
                return;
            }
        } else if (args[0].equalsIgnoreCase("start")) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
            $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
            $.say(username + " " + $.heistCancelled + $.signupMinutes + " minute(s)");
            $.timer.addTimer("./systems/bankheistSystem.js", "enterbankheist", true, function () {
                $.entrySeconds++;
                if ($.entrySeconds == 1) {
                    $.bankheistIsOn = true;
                    $.inidb.RemoveFile("bankheist_roster");
                    $.inidb.RemoveFile("bankheist_bets");

                    $.senderId = "";
                    $.senderBet = "";
                    $.say($.banksOpen);
                } else {
                    $.processBankheist();
                    startHeist();
                    $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                }
                return;
            }, (parseInt($.signupMinutes) * 60) * 1000); //60 second entry window
            return;

        } else if (args[0].equalsIgnoreCase("clear")) {
            
                $.inidb.set("settings", "bankheistToggle", "false");
                $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                $.inidb.RemoveFile("bankheist_roster");
                $.inidb.RemoveFile("bankheist_bets");

                $.senderId = "";
                $.senderBet = "";
		$.bankheistIsOn = false;
		$.entrySeconds = 0;
		$.winningPot = 0;
		$.pointsId = 0;
                return;
                
        } else if (!isNaN(betAmount) && parseInt(betAmount) > 0) {

            if ($.bankheistIsOn == false) {
                $.say($.getWhisperString(sender) + $.banksClosed);
                return;
            } else {
                $.heistUserPoints = parseInt($.inidb.get("points", sender));
                $.userPointsId = parseInt($.pointsId + 1);

                if (parseInt(betAmount) > $.heistUserPoints || parseInt(betAmount) == 0) {
				//Changed to use point system for formatting
                    $.say($.getWhisperString(sender) + $.affordBet + "[Points available: " + $.getPointsString($.heistUserPoints) + " ]");
                    return;
                } else if (parseInt(betAmount) > $.bankheistMaxBet) {
				//Only reformats the numbers and doesn't add suffix
                    $.say($.getWhisperString(sender) + $.betTooLarge + $.formatNumbers($.bankheistMaxBet) + ".");
                    return;
                } else {
                    if ($.inidb.exists("bankheist_roster", sender))
                    {
                        $.senderId = $.inidb.get("bankheist_roster", sender);
                        $.senderBet = $.inidb.get("bankheist_bets", $.senderId);
						//Changed to point system for formatting
                        $.say($.getWhisperString(sender) + username + $.alreadyBet + $.getPointsString($.senderBet));
                        return;
                    } else {
                        $.inidb.set("bankheist_roster", $.userPointsId.toString(), sender);
                        $.inidb.set("bankheist_roster", sender, $.userPointsId.toString());
                        $.pointsId++;
                        $.inidb.set("bankheist_bets", $.userPointsId, betAmount);
                        $.inidb.decr("points", sender, betAmount);
                        if ($.userPointsId == 1) {
                            $.say(username + " " + $.startedHeist);
                        } else {
                            $.say($.getWhisperString(sender) + $.joinedHeist);
                        }
                    }
                }
            }
        } else {
            var argsString = event.getArguments().trim();
            var modValue = "";
            if (args[1] != null) {
                if (isNaN(args[1])) {
                    modValue = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
                } else {
                    modValue = args[1];
                }
            }

            if (args[0].equalsIgnoreCase("signupMinutes")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.signupMinutes = modValue;
                $.inidb.set("bankheist_timers", "signupMinutes", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-signupMinutes", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("heistMinutes")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.heistMinutes = modValue;
                $.inidb.set("bankheist_timers", "heistMinutes", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-heistMinutes", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("heistCancelled")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.heistCancelled = modValue;
                $.inidb.set("bankheist_strings", "heistCancelled", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-heistCancelled", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("banksOpen")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.banksOpen = modValue;
                $.inidb.set("bankheist_strings", "banksOpen", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-banksOpen", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("startedHeist")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.startedHeist = modValue;
                $.inidb.set("bankheist_strings", "startedHeist", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-startedHeist", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("stringStarting")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.stringStarting = modValue;
                $.inidb.set("bankheist_strings", "stringStarting", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-stringStarting", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("stringNoJoin")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.stringNoJoin = modValue;
                $.inidb.set("bankheist_strings", "stringNoJoin", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-stringNoJoin", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("banksClosed")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.banksClosed = modValue;
                $.inidb.set("bankheist_strings", "banksClosed", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-banksClosed", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("stringAllDead")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.stringAllDead = modValue;
                $.inidb.set("bankheist_strings", "stringAllDead", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-stringAllDead", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("affordBet")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.affordBet = modValue;
                $.inidb.set("bankheist_strings", "affordBet", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-affordBet", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("alreadyBet")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.alreadyBet = modValue;
                $.inidb.set("bankheist_strings", "alreadyBet", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-alreadyBet", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("joinedHeist")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.joinedHeist = modValue;
                $.inidb.set("bankheist_strings", "joinedHeist", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-joinedHeist", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("enterABet")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.enterABet = modValue;
                $.inidb.set("bankheist_strings", "enterABet", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-enterABet", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("stringPayouts")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.stringPayouts = modValue;
                $.inidb.set("bankheist_strings", "stringPayouts", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-stringPayouts", modValue));
                return;
            }
            if (args[0].equalsIgnoreCase("stringFlawless")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.stringFlawless = modValue;
                $.inidb.set("bankheist_strings", "stringFlawless", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-stringFlawless", modValue));
                return;
            }
            if (args[0].equalsIgnoreCase("stringCasualties")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.stringCasualties = modValue;
                $.inidb.set("bankheist_strings", "stringCasualties", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-stringCasualties", modValue));
                return;
            }
            if (args[0].equalsIgnoreCase("betTooLarge")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.betTooLarge = modValue;
                $.inidb.set("bankheist_strings", "betTooLarge", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-betTooLarge", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("chances50")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.chances50 = modValue;
                $.inidb.set("bankheist_chances", "chances50", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-chances50", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("chances40")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.chances40 = modValue;
                $.inidb.set("bankheist_chances", "chances40", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-chances40", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("chances30")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.chances30 = modValue;
                $.inidb.set("bankheist_chances", "chances30", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-chances30", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("chances20")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.chances20 = modValue;
                $.inidb.set("bankheist_chances", "chances20", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-chances20", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("chances10")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.chances10 = modValue;
                $.inidb.set("bankheist_chances", "chances10", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-chances10", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("ratio50")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.ratio50 = modValue;
                $.inidb.set("bankheist_ratios", "ratio50", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-ratio50", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("ratio40")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.ratio40 = modValue;
                $.inidb.set("bankheist_ratios", "ratio40", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-ratio40", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("ratio30")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.ratio30 = modValue;
                $.inidb.set("bankheist_ratios", "ratio30", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-ratio30", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("ratio20")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.ratio20 = modValue;
                $.inidb.set("bankheist_ratios", "ratio20", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-ratio20", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("ratio10")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.ratio10 = modValue;
                $.inidb.set("bankheist_ratios", "ratio10", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-ratio10", modValue));
                return;
            }

            if (args[0].equalsIgnoreCase("maxbet")) {
                if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }
                $.bankheistMaxBet = modValue;
                $.inidb.set("settings", "bankheistmaxbet", modValue);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-maxbet", modValue));
                return;
            }

            if ($.isModv3(sender)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bankheistsystem.new-value-for-user-error-404"));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.enterABet);
                return;
            }

        }
    }
});

setTimeout(function () {
    if ($.moduleEnabled('./systems/bankheistSystem.js')) {
        $.registerChatCommand("./systems/bankheistSystem.js", "bankheist");
        if ($.bankheistToggle == true) {
            startHeist();
        }
    }
}, 10 * 1000);
