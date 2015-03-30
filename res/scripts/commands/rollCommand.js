var arrRollLimiter = new Array();
$var.lastRandomWin = "";
$var.lastRandomLost = "";

$.rollbonus = parseInt($.inidb.get('settings', 'roll_bonus'));
$.rolltimer = parseInt($.inidb.get('settings', 'roll_timer'));

if ($.rollbonus === undefined || $.rollbonus === null || isNaN($.rollbonus) || $.rollbonus < 0) {
    $.rollbonus = 2;
}

if ($.rolltimer === undefined || $.rolltimer === null || isNaN($.rolltimer) || $.rolltimer < 0) {
    $.rolltimer = 30;
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

    if (command.equalsIgnoreCase("roll") && argsString.isEmpty()) {

        var found = false;
        var i;

        if (command.equalsIgnoreCase("roll") && argsString.isEmpty()) {



            for (i = 0; i < arrRollLimiter.length; i++) {
                if (arrRollLimiter[i][0].equalsIgnoreCase(username)) {
                    if (arrRollLimiter[i][1] < System.currentTimeMillis()) {
                        arrRollLimiter[i][1] = System.currentTimeMillis() + ($.rolltimer * 1000);
                        break;
                    } else {
                        $.say(username + ", you can only use !roll once every " + $.rolltimer + " seconds!");
                        return;
                    }

                    found = true;
                }
            }


            if (found === false) {
                arrRollLimiter.push(new Array(username, System.currentTimeMillis() + ($.rolltimer * 1000)));
            }
        }
        if (args.length === 0 && $.moduleEnabled("./systems/pointSystem.js")) {
            var d1 = $.randRange(1, 6);
            var d2 = $.randRange(1, 6);
            var die1 = d1;
            var die2 = d2;

            var lost = new Array(0);
            lost.push("Better luck next time!");
            lost.push("Man you suck at this!");
            lost.push("Dreamin', don't give it up " + sender );
            lost.push("This is sad.");
            lost.push("Can you like.. win? please?");
            lost.push("Good job! Keep breaking the record for longest losing streak.");
            lost.push("Don't looooose your waaaaaaay!");
            lost.push("You just weren't good enough.");
            lost.push("Will " + username + " finally win? Find out on the next episode of DragonBall Z!");
            lost.push( sender + " has lost something great today!");
            lost.push("Perhaps if you trained in the mountains in solitude, you could learn the art to rolling doubles.");
            lost.push("Believe in the heart of the cards!");
            lost.push("Believe in me who believes in you!");
            lost.push("That one roll was full of hope and dreams, too bad you got nothing.");
            lost.push("The gods have forsaken you!");
            lost.push("To win you must gain sight beyond sight!");
            lost.push("You're great at losing! Don't let anyone tell you otherwise.");
            lost.push("I am known as Valentinez Alkalinella Xifax Sicidabohertz Gombigobilla Blue Stradivari Talentrent Pierre Andri Charton-Haymoss Ivanovici Baldeus George Doitzel Kaiser III, and I came to tell you that you didn't win.");
            lost.push("So tell me, what’s it like living in a constant haze of losses?");
			
			
            var win = new Array(0);
            win.push("Congratulations!");
            win.push("Damn you won..");
            win.push("YATZEE!");
            win.push("This double will pierce through the heavens!");
            win.push("Was hoping you'd lose there.");
            win.push("You got lucky.");
            win.push("You have been blessed by the gods!");
            win.push("This shit is rigged!");
            win.push("Train keepa' rollin' all night long!");
            win.push("GOOOOOOOOOOOOAAAAAAAAAAAAAAL!");
            win.push("Oh my, you did it! HNNG!");
            win.push("Now you think you're number one, shining bright for everyone!");
            win.push("X GON GIVE IT TO YA!");
            win.push("Why am I crying in french?!");
            win.push("If there were many clumsy, perverted and fun people like you the world would be a better place.");
			
            if (points === null) {
                points = 0;
            }

            if (d1 == d2) {
                do {
                    s = $.randElement(win);
                } while (s.equalsIgnoreCase($var.lastRandomWin) && win.length > 1);

                $.say(username + " rolled Doubles >> " + die1 + " & " + die2 + "! " + "You won " + (die1 + die2 * $.rollbonus) + " " + $.pointname + "!" + " " + s);
                $.inidb.incr('points', sender, die1 + die2 * $.rollbonus);
            } else {
                do {
                    s = $.randElement(lost);
                } while (s.equalsIgnoreCase($var.lastRandomLost) && lost.length > 1);
                

               
                $.say(username + " rolled a " + die1 + " & " + die2 + ". " + s);
            }
        } 
    }

    if (command.equalsIgnoreCase("roll") && !argsString.isEmpty()) {
        if (args.length >= 2) {

            if (action.equalsIgnoreCase("bonus") && !argsString.isEmpty()) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                $.inidb.set('settings', 'roll_bonus', args[1]);
                $.rollbonus = parseInt(args[1]);
                $.say("The bonus for each double rolled will now be multiplied by x" + $.rollbonus + "!");
            }

            if (action.equalsIgnoreCase("time") && !argsString.isEmpty()) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                $.inidb.set('settings', 'roll_timer', parseInt(args[1]));
                $.rolltimer = parseInt(args[1]);
                $.say("Roll limit set to once every " + $.rolltimer + " seconds!");

            }
        } else if (action.equalsIgnoreCase("bonus") || action.equalsIgnoreCase("time") || action.equalsIgnoreCase("config")) {
            $.say("[Roll Settings] - [Roll Bonus: x" + $.rollbonus + "] - [Cooldown: " + $.rolltimer + " seconds]");
        }
        if (action.equalsIgnoreCase("commands") && !argsString.isEmpty()) {

            $.say("'!roll' -- 'roll bonus <amount>' -- '!roll time <seconds>'");

        }

        if ((args.length == 1 && action.equalsIgnoreCase("help")) || !$.moduleEnabled("./systems/pointSystem.js")) {
            $.say("To do a DnD roll, say '!roll <dice definition> [ + <dice definition or number>]. For example: '!roll 2d6 + d20 + 2'. Limit 7 dice definitions or numbers per !roll command. A dice definition is [#]d<sides>. Valid number of sides: 4, 6, 8, 10, 12, 20, 100");
        } else if (args.length < 14) {
            var result = "";
            var die = 0;
            var dtotal = 0;
            var numd = 0;
            var dsides = 0;
            var dstr = new Array();
            var lookd = true;
            var Pattern = java.util.regex.Pattern;
            var Matcher = java.util.regex.Matcher;
            var p = Pattern.compile("[0-9]*d{1}(4|6|8|10|12|20|100){1}");
            var m;
            var mes = "";
            var pos;
            var valid = true;

            args = argsString.split("\\+");

            dstr[4] = "<n>";
            dstr[6] = "[n]";
            dstr[8] = "<<n>>";
            dstr[10] = "{n}";
            dstr[12] = "<{n}>";
            dstr[20] = "{(n)}";
            dstr[100] = "**n**";

            for (i = 0; i < args.length; i++) {
                args[i] = args[i].trim();
                lookd = true;

                m = p.matcher(args[i]);

                if (m.matches() === true && lookd) {
                    lookd = false;

                    s = args[i].substring(m.start(), m.end());

                    pos = s.indexOf("d");

                    if (pos == 0) {
                        numd = 1;
                    } else {
                        numd = parseInt(s.substring(0, pos));
                    }

                    dsides = parseInt(s.substring(pos + 1));

                    for (var r = 0; r < numd; r++) {
                        die = $.randRange(1, dsides);
                        dtotal += die;

                        if (!result.equals("")) {
                            result = result + " + ";
                        }

                        result = result + dstr[dsides].replace("n", die);
                    }
                }

                if (!isNaN(parseInt(args[i])) && lookd) {
                    lookd = false;

                    die = parseInt(args[i]);
                    dtotal += die;

                    if (!result.equals("")) {
                        result = result + " + ";
                    }

                    result = result + die;
                }

                if (isNaN(parseInt(args[i])) && lookd) {
                    valid = false;
                }
            }
            if (dtotal == 20) {
                mes = " for a MASSIVE hit!!";
            }
            if (dtotal == 1) {
                mes = " FAILURE.";
            }
            if (valid) {
	
                $.say(username + " rolled " + result + " = " + dtotal + mes);
            } 
        } else {
            $.say("Dont spam rolls, " + username + "!");
        }

    }
});

$.registerChatCommand("./commands/rollCommand.js", "roll");