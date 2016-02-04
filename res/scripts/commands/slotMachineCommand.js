var arrSlotLimiter = new Array();
$var.lastSlotWin = "";
$var.lastSlotLoss = "";

$.slotBonus = parseInt($.inidb.get('slotMachine', 'slotBonus'));
$.slotCost = parseInt($.inidb.get('slotMachine', 'slotCost'));
$.slotCMessages = parseInt($.inidb.get('slotMachine', 'slotCMessages'));
$.slotEmote1 = $.inidb.get('slotMachine', 'slotEmote1');
$.slotEmote2 = $.inidb.get('slotMachine', 'slotEmote2');
$.slotEmote3 = $.inidb.get('slotMachine', 'slotEmote3');
$.slotEmote4 = $.inidb.get('slotMachine', 'slotEmote4');
$.slotEmote5 = $.inidb.get('slotMachine', 'slotEmote5');
$.slotEmote6 = $.inidb.get('slotMachine', 'slotEmote6');
$.slotEmote7 = $.inidb.get('slotMachine', 'slotEmote7');
$.slotEmoteReward1 = parseInt($.inidb.get('slotMachine', 'slotEmoteReward1'));
$.slotEmoteReward2 = parseInt($.inidb.get('slotMachine', 'slotEmoteReward2'));
$.slotEmoteReward3 = parseInt($.inidb.get('slotMachine', 'slotEmoteReward3'));
$.slotEmoteReward4 = parseInt($.inidb.get('slotMachine', 'slotEmoteReward4'));
$.slotEmoteReward5 = parseInt($.inidb.get('slotMachine', 'slotEmoteReward5'));
$.slotEmoteReward6 = parseInt($.inidb.get('slotMachine', 'slotEmoteReward6'));
$.slotJackpot = parseInt($.inidb.get('slotMachine', 'slotJackpot'));
$.slotSeeingEmoteReward7 = parseInt($.inidb.get('slotMachine', 'slotSeeingEmoteReward7'));
$.slotDoubleEmoteReward6 = parseInt($.inidb.get('slotMachine', 'slotDoubleEmoteReward6'));
$.slotDoubleEmoteReward5 = parseInt($.inidb.get('slotMachine', 'slotDoubleEmoteReward5'));
$.slotDoubleEmoteReward4 = parseInt($.inidb.get('slotMachine', 'slotDoubleEmoteReward4'));
$.slotDoubleEmoteReward3 = parseInt($.inidb.get('slotMachine', 'slotDoubleEmoteReward3'));
$.slotHalfRewards = parseInt($.inidb.get('slotMachine', 'slotHalfRewards'));

if ($.slotBonus === undefined || $.slotBonus === null || isNaN($.slotBonus) || $.slotBonus < 0) {
    $.slotBonus = 1;
}

if ($.slotCost === undefined || $.slotCost === null || isNaN($.slotCost) || $.slotCost < 0) {
    $.slotCost = 3; //To be integrated
}

if ($.slotCMessages === undefined || $.slotCMessages === null || isNaN($.slotCMessages) || $.slotCMessages < 0 || $.slotCMessages === true || $.slotCMessages === false) {
    $.slotCMessages = 1;
}

if ($.slotEmote1 === "" || $.slotEmote1 === null) {
    $.slotEmote1 = "Kappa "; //Most likely
}

if ($.slotEmote2 === "" || $.slotEmote2 === null) {
    $.slotEmote2 = "KappaPride "; //Second most likely
}

if ($.slotEmote3 === "" || $.slotEmote3 === null) {
    $.slotEmote3 = "BloodTrail ";
}

if ($.slotEmote4 === "" || $.slotEmote4 === null) {
    $.slotEmote4 = "MrDestructoid ";
}

if ($.slotEmote5 === "" || $.slotEmote5 === null) {
    $.slotEmote5 = "<3 ";
}

if ($.slotEmote6 === "" || $.slotEmote6 === null) {
    $.slotEmote6 = "deIlluminati "; //Second least likely
}

if ($.slotEmote7 === "" || $.slotEmote7 === null) {
    $.slotEmote7 = "VaultBoy "; //Least likely
}

if ($.slotEmoteReward1 === undefined || $.slotEmoteReward1 === null || isNaN($.slotEmoteReward1) || $.slotEmoteReward1 < 0) {
    $.slotEmoteReward1 = 20; //Most likely
}

if ($.slotEmoteReward2 === undefined || $.slotEmoteReward2 === null || isNaN($.slotEmoteReward2) || $.slotEmoteReward2 < 0) {
    $.slotEmoteReward2 = 30; //Second most likely
}

if ($.slotEmoteReward3 === undefined || $.slotEmoteReward3 === null || isNaN($.slotEmoteReward3) || $.slotEmoteReward3 < 0) {
    $.slotEmoteReward3 = 40;
}

if ($.slotEmoteReward4 === undefined || $.slotEmoteReward4 === null || isNaN($.slotEmoteReward4) || $.slotEmoteReward4 < 0) {
    $.slotEmoteReward4 = 50;
}

if ($.slotEmoteReward5 === undefined || $.slotEmoteReward5 === null || isNaN($.slotEmoteReward5) || $.slotEmoteReward5 < 0) {
    $.slotEmoteReward5 = 60;
}

if ($.slotEmoteReward6 === undefined || $.slotEmoteReward6 === null || isNaN($.slotEmoteReward6) || $.slotEmoteReward6 < 0) {
    $.slotEmoteReward6 = 70; //Second least likely
}

if ($.slotJackpot === undefined || $.slotJackpot === null || isNaN($.slotJackpot) || $.slotJackpot < 0) {
    $.slotJackpot = 300; //slotEmoteReward7
}

if ($.slotSeeingEmoteReward7 === undefined || $.slotSeeingEmoteReward7 === null || isNaN($.slotSeeingEmoteReward7) || $.slotSeeingEmoteReward7 < 0) {
    $.slotSeeingEmoteReward7 = 10;
}

if ($.slotDoubleEmoteReward7 === undefined || $.slotDoubleEmoteReward7 === null || isNaN($.slotDoubleEmoteReward7) || $.slotDoubleEmoteReward7 < 0) {
    $.slotDoubleEmoteReward7 = 60;
}

if ($.slotDoubleEmoteReward6 === undefined || $.slotDoubleEmoteReward6 === null || isNaN($.slotDoubleEmoteReward6) || $.slotDoubleEmoteReward6 < 0) {
    $.slotDoubleEmoteReward6 = 10;
}

if ($.slotDoubleEmoteReward5 === undefined || $.slotDoubleEmoteReward5 === null || isNaN($.slotDoubleEmoteReward5) || $.slotDoubleEmoteReward5 < 0) {
    $.slotDoubleEmoteReward5 = 5;
}

if ($.slotDoubleEmoteReward4 === undefined || $.slotDoubleEmoteReward4 === null || isNaN($.slotDoubleEmoteReward4) || $.slotDoubleEmoteReward4 < 0) {
    $.slotDoubleEmoteReward4 = 3;
}

if ($.slotDoubleEmoteReward3 === undefined || $.slotDoubleEmoteReward3 === null || isNaN($.slotDoubleEmoteReward3) || $.slotDoubleEmoteReward3 < 0) {
    $.slotDoubleEmoteReward3 = 3;
}

if ($.slotHalfRewards === "" || $.slotHalfRewards === null) {
    $.slotHalfRewards = 1;
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var points = $.inidb.get('points', sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var s;
    var action = args[0];

    if (command.equalsIgnoreCase("slot") && argsString.isEmpty()) {

        var found = false;
        var i;

        if (command.equalsIgnoreCase("slot") && argsString.isEmpty()) {


            for (i = 0; i < arrSlotLimiter.length; i++) {
                if (arrSlotLimiter[i][0].equalsIgnoreCase(username)) {
                    found = true;
                }
            }

            if (found === false) {
                arrSlotLimiter.push(new Array(username));
            }
        }

        if (args.length === 0 && $.moduleEnabled("./systems/pointSystem.js")) {
            var b1 = $.randRange(1, 1000);
            var b2 = $.randRange(1, 1000);
            var b3 = $.randRange(1, 1000);
            //b1
            if (b1 <= 25) {
                var symbol1 = slotEmote7;
            }
            if (b1 > 25 && b1 <= 75) {
                var symbol1 = slotEmote6;
            }
            if (b1 > 75 && b1 <= 175) {
                var symbol1 = slotEmote5;
            }
            if (b1 > 175 && b1 <= 300) {
                var symbol1 = slotEmote4;
            }
            if (b1 > 300 && b1 <= 450) {
                var symbol1 = slotEmote3;
            }
            if (b1 > 450 && b1 <= 700) {
                var symbol1 = slotEmote2;
            }
            if (b1 > 700) {
                var symbol1 = slotEmote1;
            }
            //b2
            if (b2 <= 25) {
                var symbol2 = slotEmote7;
            }
            if (b2 > 25 && b2 <= 75) {
                var symbol2 = slotEmote6;
            }
            if (b2 > 75 && b2 <= 175) {
                var symbol2 = slotEmote5;
            }
            if (b2 > 175 && b2 <= 300) {
                var symbol2 = slotEmote4;
            }
            if (b2 > 300 && b2 <= 450) {
                var symbol2 = slotEmote3;
            }
            if (b2 > 450 && b2 <= 700) {
                var symbol2 = slotEmote2;
            }
            if (b2 > 700) {
                var symbol2 = slotEmote1;
            }
            //b3
            if (b3 <= 25) {
                var symbol3 = slotEmote7;
            }
            if (b3 > 25 && b3 <= 75) {
                var symbol3 = slotEmote6;
            }
            if (b3 > 75 && b3 <= 175) {
                var symbol3 = slotEmote5;
            }
            if (b3 > 175 && b3 <= 300) {
                var symbol3 = slotEmote4;
            }
            if (b3 > 300 && b3 <= 450) {
                var symbol3 = slotEmote3;
            }
            if (b3 > 450 && b3 <= 700) {
                var symbol3 = slotEmote2;
            }
            if (b3 > 700) {
                var symbol3 = slotEmote1;
            }

            var lost = new Array(0); //Add loss messages.
            lost.push("Better luck next time!");
            lost.push("I understand, slot machines are hard for you.");
            lost.push("Dreamin', don't give it up " + sender);
            lost.push("This is sad.");
            lost.push("Can you like.. win? please?");
            lost.push("You're not doing too good.");
            lost.push("Don't looooose your waaaaaaay!");
            lost.push("You just weren't good enough.");
            lost.push("Will " + username + " finally win? Find out on the next episode of DragonBall Z!");
            lost.push(sender + " has lost something great today!");
            lost.push("Perhaps if you trained in the mountains in solitude, you could learn the art to winning.");
            lost.push("Believe in the heart of the cards!");
            lost.push("Believe in me who believes in you!");
            lost.push("This reeks of loss.");
            lost.push("The gods have forsaken you!");
            lost.push("To win you must gain sight beyond sight!");
            lost.push("You're great at losing! Don't let anyone tell you otherwise.");
            lost.push("So tell me, whatӳ it like living in a constant haze of losses?");

            var win = new Array(0); //Add win messages
            win.push("Congratulations!");
            win.push("YATZEE!");
            win.push("Fabulous!");
            win.push("You got lucky.");
            win.push("GOOOOOOOOOOOOAAAAAAAAAAAAAAL!");
            win.push("Oh my, you did it! HNNG!");
            win.push("Baby, now you think you're number one, shining bright for everyone!");
            win.push("X GON GIVE IT TO YA!");
            win.push("If there were many clumsy, perverted and fun people like you the world would be a better place.");


            if (points === null) {
                points = 0;
            }

            if (symbol1 == symbol2 && symbol2 == symbol3) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                if (symbol1 == slotEmote1) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " won " + slotEmoteReward1 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotEmoteReward1) * $.slotBonus);
                }
                if (symbol1 == slotEmote2) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " won " + slotEmoteReward2 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotEmoteReward2) * $.slotBonus);
                }
                if (symbol1 == slotEmote3) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + " won " + slotEmoteReward3 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotEmoteReward3) * $.slotBonus);
                }
                if (symbol1 == slotEmote4) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " won " + slotEmoteReward4 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotEmoteReward4) * $.slotBonus);
                }
                if (symbol1 == slotEmote5) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " won " + slotEmoteReward5 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotEmoteReward5) * $.slotBonus);
                }
                if (symbol1 == slotEmote6) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " won " + slotEmoteReward6 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotEmoteReward6) * $.slotBonus);
                }
                if (symbol1 == slotEmote7) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + "JACKPOT! " + username + " won " + slotJackpot * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + " points!");
                    $.inidb.incr('points', sender, (slotJackpot) * $.slotBonus);
                }
            } else if (symbol1 == slotEmote7 || symbol2 == slotEmote7 || symbol3 == slotEmote7) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " saw a " + slotEmote7 + "! Here's " + slotSeeingEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                $.inidb.incr('points', sender, (slotSeeingEmoteReward7) * $.slotBonus);
                if ((symbol1 == symbol2 && symbol1 == slotEmote7 && slotHalfRewards == 1) || (symbol1 == symbol3 && symbol1 == slotEmote7 && slotHalfRewards == 1) || (symbol3 == symbol2 && symbol3 == slotEmote7 && slotHalfRewards == 1)) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " kind of won! Here's  " + slotDoubleEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotDoubleEmoteReward7) * $.slotBonus);
                }
            } else if ((symbol1 == symbol2 && symbol1 == slotEmote7 && slotHalfRewards == 1) || (symbol1 == symbol3 && symbol1 == slotEmote7 && slotHalfRewards == 1) || (symbol3 == symbol2 && symbol3 == slotEmote7 && slotHalfRewards == 1)) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " kind of won! Here's " + slotDoubleEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                $.inidb.incr('points', sender, (slotDoubleEmoteReward7) * $.slotBonus);
                if (symbol1 == slotEmote7 || symbol2 == slotEmote7 || symbol3 == slotEmote7) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " saw a " + slotEmote7 + "! Here's " + slotSeeingEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotSeeingEmoteReward7) * $.slotBonus);
                }
            } else if ((symbol1 == symbol2 && symbol1 == slotEmote6 && slotHalfRewards == 1) || (symbol1 == symbol3 && symbol1 == slotEmote6 && slotHalfRewards == 1) || (symbol3 == symbol2 && symbol3 == slotEmote6 && slotHalfRewards == 1)) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " kind of won! Here's " + slotDoubleEmoteReward6 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                $.inidb.incr('points', sender, (slotDoubleEmoteReward6) * $.slotBonus);
                if (symbol1 == slotEmote7 || symbol2 == slotEmote7 || symbol3 == slotEmote7) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " saw a " + slotEmote7 + "! Here's " + slotSeeingEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotSeeingEmoteReward7) * $.slotBonus);
                }
            } else if ((symbol1 == symbol2 && symbol1 == slotEmote3 && slotHalfRewards == 1) || (symbol1 == symbol3 && symbol1 == slotEmote3 && slotHalfRewards == 1) || (symbol3 == symbol2 && symbol3 == slotEmote3 && slotHalfRewards == 1)) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " kind of won! Here's " + slotDoubleEmoteReward5 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                $.inidb.incr('points', sender, (slotDoubleEmoteReward5) * $.slotBonus);
                if (symbol1 == slotEmote7 || symbol2 == slotEmote7 || symbol3 == slotEmote7) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " saw a " + slotEmote7 + "! Here's " + slotSeeingEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotSeeingEmoteReward7) * $.slotBonus);
                }
            } else if ((symbol1 == symbol2 && symbol1 == slotEmote4 && slotHalfRewards == 1) || (symbol1 == symbol3 && symbol1 == slotEmote4 && slotHalfRewards == 1) || (symbol3 == symbol2 && symbol3 == slotEmote4 && slotHalfRewards == 1)) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " kind of won! Here's " + slotDoubleEmoteReward4 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                $.inidb.incr('points', sender, (slotDoubleEmoteReward4) * $.slotBonus);
                if (symbol1 == slotEmote7 || symbol2 == slotEmote7 || symbol3 == slotEmote7) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " saw a " + slotEmote7 + "! Here's " + slotSeeingEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotSeeingEmoteReward7) * $.slotBonus);
                }
            } else if ((symbol1 == symbol2 && symbol1 == slotEmote5 && slotHalfRewards == 1) || (symbol1 == symbol3 && symbol1 == slotEmote5 && slotHalfRewards == 1) || (symbol3 == symbol2 && symbol3 == slotEmote5 && slotHalfRewards == 1)) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);
                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " kind of won! Here's " + slotDoubleEmoteReward3 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                $.inidb.incr('points', sender, (slotDoubleEmoteReward3) * $.slotBonus);
                if (symbol1 == slotEmote7 || symbol2 == slotEmote7 || symbol3 == slotEmote7) {
                    $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + username + " saw a " + slotEmote7 + "! Here's " + slotSeeingEmoteReward7 * $.slotBonus + " " + $.pointNameMultiple + "!" + " " + s);
                    $.inidb.incr('points', sender, (slotSeeingEmoteReward7) * $.slotBonus);
                }
            } else {
                do {
                    s = $.randElement(lost);
                } while (s.equalsIgnoreCase($var.lastRandomLost) && lost.length > 1);

                $.say(symbol1 + " \u2726 " + symbol2 + " \u2726 " + symbol3 + " " + " " + s);
            }
        }
    }

    if (command.equalsIgnoreCase("slot") && !argsString.isEmpty()) {
        if (args.length >= 2) {
            if (action.equalsIgnoreCase("bonus") && !argsString.isEmpty()) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }

                $.inidb.set('slotMachine', 'slotBonus', args[1]);
                $.slotBonus = parseInt(args[1]);
                $.say("The bonus for each win will now be multiplied by x" + $.slotBonus + "!");
            }

            if (action.equalsIgnoreCase("time") && !argsString.isEmpty()) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }

                $.inidb.set('slotMachine', 'slotTimer', parseInt(args[1]));
                $.slotTimer = parseInt(args[1]);
                $.say("Slot limit set to once every " + $.slotTimer + " seconds!");

            }

            if (action.equalsIgnoreCase("emote") && !argsString.isEmpty()) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }
                if (args[1].equalsIgnoreCase("1") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote1', args[2]);
                    $.slotEmote1 = args[2];
                    $.say("Slot emote 1 is now: " + slotEmote1 + " and common.");
                } else if (args[1].equalsIgnoreCase("2") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote2', args[2]);
                    $.slotEmote2 = args[2];
                    $.say("Slot emote 2 is now: " + slotEmote2 + " and uncommon.");
                } else if (args[1].equalsIgnoreCase("3") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote3', args[2]);
                    $.slotEmote3 = args[2] + " ";
                    $.say("Slot emote 3 is now: " + slotEmote3 + " and very uncommon.");
                } else if (args[1].equalsIgnoreCase("4") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote4', args[2]);
                    $.slotEmote4 = args[2];
                    $.say("Slot emote 4 is now: " + slotEmote4 + " and kind of rare.");
                } else if (args[1].equalsIgnoreCase("5") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote5', args[2]);
                    $.slotEmote5 = args[2];
                    $.say("Slot emote 5 is now: " + slotEmote5 + " and rare.");
                } else if (args[1].equalsIgnoreCase("6") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote6', args[2]);
                    $.slotEmote6 = args[2];
                    $.say("Slot emote 6 is now: " + slotEmote6 + " and very rare.");
                } else if (args[1].equalsIgnoreCase("7") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmote7', args[2]);
                    $.slotEmote7 = args[2];
                    $.say("Slot emote 7 is now: " + slotEmote7 + " and legendary.");
                } else {
                    $.say("Emote 1 is: " + slotEmote1 + " and common. 2. " + slotEmote2 + " 3. " + slotEmote3 + " 4. " + slotEmote4 + " 5. " + slotEmote5 + " 6. " + slotEmote6 + " 7. " + slotEmote7 + " and the rarest.");
                }

            }

            if (action.equalsIgnoreCase("reward") && !argsString.isEmpty()) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }
                if (args[1].equalsIgnoreCase("1") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward1', args[2]);
                    $.slotEmoteReward1 = args[2];
                    $.say("The reward for emote 1 is now: " + slotEmoteReward1 + " and common.");
                } else if (args[1].equalsIgnoreCase("2") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward2', args[2]);
                    $.slotEmoteReward2 = args[2];
                    $.say("The reward for emote 2 is now: " + slotEmoteReward2 + " and uncommon.");
                } else if (args[1].equalsIgnoreCase("3") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward3', args[2]);
                    $.slotEmoteReward3 = args[2];
                    $.say("The reward for emote 3 is now: " + slotEmoteReward3 + " and very uncommon.");
                } else if (args[1].equalsIgnoreCase("4") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward4', args[2]);
                    $.slotEmoteReward4 = args[2];
                    $.say("The reward for emote 4 is now: " + slotEmoteReward4 + " and kind of rare.");
                } else if (args[1].equalsIgnoreCase("5") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward5', args[2]);
                    $.slotEmoteReward5 = args[2];
                    $.say("The reward for emote 5 is now: " + slotEmoteReward5 + " and rare.");
                } else if (args[1].equalsIgnoreCase("6") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward6', args[2]);
                    $.slotEmoteReward6 = args[2];
                    $.say("The reward for emote 6 is now: " + slotEmoteReward6 + " and very rare.");
                } else if (args[1].equalsIgnoreCase("7") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotEmoteReward7', args[2]);
                    $.slotJackpot = args[2];
                    $.say("The reward for emote 7 (Jackpot) is now: " + slotJackpot + " and legendary.");
                } else {
                    $.say("The reward for emote 1 is: " + slotEmoteReward1 + " and common. [2] " + slotEmoteReward2 + " [3] " + slotEmoteReward3 + " [4] " + slotEmoteReward4 + " [5] " + slotEmoteReward5 + " [6] " + slotEmoteReward6 + " [7] " + slotJackpot + " and the rarest.");
                }

            }

            if ((action.equalsIgnoreCase("halfReward") && !argsString.isEmpty()) || (action.equalsIgnoreCase("halfRewards") && !argsString.isEmpty())) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }
                if (args[1].equalsIgnoreCase("off")) {
                    $.inidb.set('slotMachine', 'slotHalfRewards', 0);
                    $.slotCMessages = 0;
                    $.say("Slot halfrewards off!");
                }
                if (args[1].equalsIgnoreCase("on")) {
                    $.inidb.set('slotMachine', 'slotHalfRewards', 1);
                    $.slotCMessages = 1;
                    $.say("Slot halfrewards on!");
                }
                if (args[1].equalsIgnoreCase("toggle")) {
                    if (!slotCMessages) {
                        $.inidb.set('slotMachine', 'slotHalfRewards', 1);
                        $.slotCMessages = 1;
                        $.say("Slot halfrewards on!");
                    } else {
                        $.inidb.set('slotMachine', 'slotHalfRewards', 0);
                        $.slotCMessages = 0;
                        $.say("Slot halfrewards off!");
                    }
                }
                if (args[1].equalsIgnoreCase("3") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotDoubleEmoteReward3', args[2]);
                    $.slotDoubleEmoteReward3 = args[2];
                    $.say("The reward for seeing two " + slotEmote3 + " is now: " + slotDoubleEmoteReward3);
                } else if (args[1].equalsIgnoreCase("4") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotDoubleEmoteReward4', args[2]);
                    $.slotDoubleEmoteReward4 = args[2];
                    $.say("The reward for seeing two " + slotEmote4 + " is now: " + slotDoubleEmoteReward4);
                } else if (args[1].equalsIgnoreCase("5") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotDoubleEmoteReward5', args[2]);
                    $.slotDoubleEmoteReward5 = args[2];
                    $.say("The reward for seeing two " + slotEmote5 + " is now: " + slotDoubleEmoteReward5);
                } else if (args[1].equalsIgnoreCase("6") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotDoubleEmoteReward6', args[2]);
                    $.slotDoubleEmoteReward6 = args[2];
                    $.say("The reward for seeing two " + slotEmote6 + " is now: " + slotDoubleEmoteReward6);
                } else if (args[1].equalsIgnoreCase("7") && args[2] != null) {
                    $.inidb.set('slotMachine', 'slotDoubleEmoteReward7', args[2]);
                    $.slotDoubleEmoteReward7 = args[2];
                    $.say("The reward for seeing two " + slotEmote7 + " is now: " + slotDoubleEmoteReward7);
                } else if (!args[1].equalsIgnoreCase("toggle") && !args[1].equalsIgnoreCase("on") && !args[1].equalsIgnoreCase("off")) {
                    $.say("The reward for seeing two emote 3s is: " + slotDoubleEmoteReward3 + " [4s] " + slotDoubleEmoteReward4 + " [5s] " + slotDoubleEmoteReward5 + " [6s] " + slotDoubleEmoteReward6 + " [7s] " + slotDoubleEmoteReward7);
                }

            }

            if (action.equalsIgnoreCase("seeReward") && !argsString.isEmpty()) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }
                if (args[1] != null) {
                    $.inidb.set('slotMachine', 'slotSeeingEmoteReward7', args[1]);
                    $.slotSeeingEmoteReward7 = args[1];
                    $.say("The reward for seeing a " + slotEmote7 + " is now: " + slotSeeingEmoteReward7);
                } else {
                    $.say("The reward for seeing a " + slotEmote7 + " is: " + slotSeeingEmoteReward7);
                }

            }

            if (action.equalsIgnoreCase("jackpot") && !argsString.isEmpty()) {
                if (!$.isMod(sender)) {
                    $.say($.modmsg);
                    return;
                }
                if (args[1] != null) {
                    $.inidb.set('slotMachine', 'slotJackpot', args[1]);
                    $.slotJackpot = args[1];
                    $.say("The Jackpot is now: " + slotJackpot);
                } else {
                    $.say("The Jackpot is: " + slotJackpot);
                }

            }

        } else if (action.equalsIgnoreCase("emotes") || action.equalsIgnoreCase("emote")) {
            $.say("Emote 1 is: " + slotEmote1 + " and common. 2. " + slotEmote2 + " 3. " + slotEmote3 + " 4. " + slotEmote4 + " 5. " + slotEmote5 + " 6. " + slotEmote6 + " 7. " + slotEmote7 + " and the rarest.");
        } else if (action.equalsIgnoreCase("rewards") || action.equalsIgnoreCase("reward")) {
            $.say("The reward for emote 1 is: " + slotEmoteReward1 + " and common. [2] " + slotEmoteReward2 + " [3] " + slotEmoteReward3 + " [4] " + slotEmoteReward4 + " [5] " + slotEmoteReward5 + " [6] " + slotEmoteReward6 + " [7] " + slotJackpot + " and the rarest.");
        } else if (action.equalsIgnoreCase("halfRewards") || action.equalsIgnoreCase("halfReward")) {
            if (slotHalfRewards == 1) {
                $.say("Halfrewards: On. The reward for seeing two emote 3s is: " + slotDoubleEmoteReward3 + " [4s] " + slotDoubleEmoteReward4 + " [5s] " + slotDoubleEmoteReward5 + " [6s] " + slotDoubleEmoteReward6 + " [7s] " + slotDoubleEmoteReward7);
            } else {
                $.say("Halfrewards: Off. The reward for seeing two emote 3s is: " + slotDoubleEmoteReward3 + " [4s] " + slotDoubleEmoteReward4 + " [5s] " + slotDoubleEmoteReward5 + " [6s] " + slotDoubleEmoteReward6 + " [7s] " + slotDoubleEmoteReward7);
            }
        } else if (action.equalsIgnoreCase("seeRewards") || action.equalsIgnoreCase("seeReward")) {
            $.say("The reward for seeing a " + slotEmote7 + " is: " + slotSeeingEmoteReward7);
        } else if (action.equalsIgnoreCase("bonus") || action.equalsIgnoreCase("time") || action.equalsIgnoreCase("config") || action.equalsIgnoreCase("toggle") || action.equalsIgnoreCase("jackpot")) {
            if (slotCMessages == 1) {
                if (slotHalfRewards == 1) {
                    $.say("[Slot Settings] - [Win Bonus: x" + $.slotBonus + "] - [Cooldown: " + $.slotTimer + " seconds] - [Jackpot: " + slotJackpot + " ] - [Cooldown messages: On ] - [Halfrewards: On ]");
                } else {
                    $.say("[Slot Settings] - [Win Bonus: x" + $.slotBonus + "] - [Cooldown: " + $.slotTimer + " seconds] - [Jackpot: " + slotJackpot + " ] - [Cooldown messages: On ] - [Halfrewards: Off ]");
                }
            } else {
                if (slotHalfRewards == 1) {
                    $.say("[Slot Settings] - [Win Bonus: x" + $.slotBonus + "] - [Cooldown: " + $.slotTimer + " seconds] - [Jackpot: " + slotJackpot + " ] - [Cooldown messages: Off ] - [Halfrewards: On ]");
                } else {
                    $.say("[Slot Settings] - [Win Bonus: x" + $.slotBonus + "] - [Cooldown: " + $.slotTimer + " seconds] - [Jackpot: " + slotJackpot + " ] - [Cooldown messages: Off ] - [Halfrewards: Off ]");
                }
            }
        } else {
            $.say("'!slot' -- 'slot bonus <amount>' -- '!slot time <seconds>' -- '!slot emote <1-7> <New Emote>' -- !slot <emotes/rewards/halfrewards/seerewards/jackpot/bonus/time/config> '!slot reward <1-7> <New Reward>' -- '!slot CooldownMessages <On/Off>'");
        }
        /*
         if (action.equalsIgnoreCase("commands") && !argsString.isEmpty()) {
         $.say("'!slot' -- 'slot bonus <amount>' -- '!slot time <seconds>' -- '!slot emote <1-7> <New Emote>' -- !slot emotes -- !slot rewards -- '!slot reward <1-7> <New Reward>'-- '!slot CooldownMessages <On/Off>'");
         } */
    }


});

$.registerChatCommand("./commands/slotCommand.js", "slot");
