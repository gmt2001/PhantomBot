var ircPrefix = ".";
var autoBanPhrases = new Array();
var autoPurgePhrases = new Array();
var permitList = new Array();
var sinbin = new Array();
var warningcountresettime = parseInt($.inidb.get("settings", "warningcountresettime")) * 1000;
var autopurgemessage = $.inidb.get("settings", "autopurgemessage");
var autobanmessage = $.inidb.get("settings", "autobanmessage");
var capsallowed = $.inidb.get("settings", "capsallowed").equalsIgnoreCase("1");
var capstriggerratio = parseFloat($.inidb.get("settings", "capstriggerratio"));
var capstriggerlength = parseInt($.inidb.get("settings", "capstriggerlength"));
var capsmessage = $.inidb.get("settings", "capsmessage");
var linksallowed = $.inidb.get("settings", "linksallowed").equalsIgnoreCase("1");
var permittime = parseInt($.inidb.get("settings", "permittime"));
var youtubeallowed = $.inidb.get("settings", "youtubeallowed").equalsIgnoreCase("1");
var subsallowed = $.inidb.get("settings", "subsallowed").equalsIgnoreCase("1");
var regsallowed = $.inidb.get("settings", "regsallowed").equalsIgnoreCase("1");
var linksmessage = $.inidb.get("settings", "linksmessage");
var spamallowed = $.inidb.get("settings", "spamallowed").equalsIgnoreCase("1");
var spamlimit = parseInt($.inidb.get("settings", "spamlimit"));
var spammessage = $.inidb.get("settings", "spammessage");
var symbolsallowed = $.inidb.get("settings", "symbolsallowed").equalsIgnoreCase("1");
var symbolslimit = parseInt($.inidb.get("settings", "symbolslimit"));
var symbolsrepeatlimit = parseInt($.inidb.get("settings", "symbolsrepeatlimit"));
var symbolsmessage = $.inidb.get("settings", "symbolsmessage");
var repeatallowed = $.inidb.get("settings", "repeatallowed").equalsIgnoreCase("1");
var repeatlimit = parseInt($.inidb.get("settings", "repeatlimit"));
var repeatmessage = $.inidb.get("settings", "repeatmessage");
var graphemeallowed = $.inidb.get("settings", "graphemeallowed").equalsIgnoreCase("1");
var graphemelimit = parseInt($.inidb.get("settings", "graphemelimit"));
var graphememessage = $.inidb.get("settings", "graphememessage");
var warningtypes = new Array($.inidb.get("settings", "warning1type"), $.inidb.get("settings", "warning2type"), $.inidb.get("settings", "warning3type"));
var warningmessages = new Array($.inidb.get("settings", "warning1message"), $.inidb.get("settings", "warning2message"), $.inidb.get("settings", "warning3message"));

if ($.spamtracker == null || $.spamtracker == undefined) {
    $.spamtracker = new Array();
}

var lines = $.readFile("sinbin");
var i;
var spl;

for (i = 0; i < lines.length; i++) {
    spl = lines[i].split("=");

    sinbin.push(new Array(spl[0], parseInt(spl[1]), parseInt(spl[2])));
}


function issueCommand(command) {
    $.say(command);
    setTimeout(function () {
        $.say(command);
        $.say(command);
    }, 1800);
}

function banUser(user) {
    issueCommand(ircPrefix + "ban " + user);
}

function unbanUser(user) {
    issueCommand(ircPrefix + "unban " + user);
}

function clearChat() {
    issueCommand(ircPrefix + "clear");
}

function timeoutUserFor(user, fortime) {
    timeoutUser(user, fortime);
}

function timeoutUser(user, fortime) {
    issueCommand(ircPrefix + "timeout " + user + " " + fortime);
}

function autoPurgeUser(user, warnmessage) {
    var ban = false;
    var idx = -1;
    var count;
    var lastincrease;
    var warning;

    for (var i = 0; i < sinbin.length; i++) {
        if (user.equalsIgnoreCase(sinbin[i][0])) {
            idx = i;
        }
    }

    if (idx == -1) {
        count = 0;
        lastincrease = System.currentTimeMillis();
    } else {
        count = sinbin[idx][1];
        lastincrease = sinbin[idx][2];

        if (warningcountresettime >= 0 && lastincrease + warningcountresettime < System.currentTimeMillis()) {
            count = 0;
        }

        lastincrease = System.currentTimeMillis();
    }

    count++;

    warning = warnmessage;

    if (count == 1) {
        if ($.strlen(warningmessages[0]) > 0) {
            warning += " >> " + warningmessages[0];
        }

        if (warningtypes[0].equalsIgnoreCase("purge")) {
            $.logEvent("chatModerator.js", 124, ">> Strike 1 >> Purged");

            timeoutUser(user, 1);

            warning += $.lang.get("net.phantombot.chatmoderator.purged");
        } else if (warningtypes[0].equalsIgnoreCase("ban")) {
            $.logEvent("chatModerator.js", 130, ">> Strike 1 >> Banned");

            banUser(user);

            warning += $.lang.get("net.phantombot.chatmoderator.banned");
        } else {
            $.logEvent("chatModerator.js", 136, ">> Strike 1 >> Timed out (" + warningtypes[0] + ")");

            timeoutUserFor(user, parseInt(warningtypes[0]));

            warning += $.lang.get("net.phantombot.chatmoderator.timedout", warningtypes[0]);
        }
    } else if (count == 2) {
        if ($.strlen(warningmessages[1]) > 0) {
            warning += " >> " + warningmessages[1];
        }

        if (warningtypes[1].equalsIgnoreCase("purge")) {
            $.logEvent("chatModerator.js", 148, ">> Strike 2 >> Purged");

            timeoutUser(user, 1);

            warning += $.lang.get("net.phantombot.chatmoderator.purged");
        } else if (warningtypes[1].equalsIgnoreCase("ban")) {
            $.logEvent("chatModerator.js", 154, ">> Strike 2 >> Banned");

            banUser(user);

            warning += $.lang.get("net.phantombot.chatmoderator.banned");
        } else {
            $.logEvent("chatModerator.js", 160, ">> Strike 2 >> Timed out (" + warningtypes[1] + ")");

            timeoutUserFor(user, parseInt(warningtypes[1]));

            warning += $.lang.get("net.phantombot.chatmoderator.timedout", warningtypes[1]);
        }
    } else {
        if ($.strlen(warningmessages[2]) > 0) {
            warning += " >> " + warningmessages[2];
        }

        if (warningtypes[2].equalsIgnoreCase("purge")) {
            $.logEvent("chatModerator.js", 172, ">> Strike 3 >> Purged");

            timeoutUser(user, 1);

            warning += $.lang.get("net.phantombot.chatmoderator.purged");
        } else if (warningtypes[2].equalsIgnoreCase("ban")) {
            $.logEvent("chatModerator.js", 178, ">> Strike 3 >> Banned");

            banUser(user);

            warning += $.lang.get("net.phantombot.chatmoderator.banned");
        } else {
            $.logEvent("chatModerator.js", 184, ">> Strike 3 >> Timed out (" + warningtypes[2] + ")");

            timeoutUserFor(user, parseInt(warningtypes[2]));

            warning += $.lang.get("net.phantombot.chatmoderator.timedout", warningtypes[2]);
        }
    }

    $.say($.getWhisperString(user) + warning);

    if (idx == -1) {
        sinbin.push(new Array(user.toLowerCase(), count, lastincrease));
    } else {
        sinbin[idx][1] = count;
        sinbin[idx][2] = lastincrease;
    }

    var lines = new Array();

    for (i = 0; i < sinbin.length; i++) {
        lines.push(sinbin[i][0] + "=" + sinbin[i][1] + "=" + sinbin[i][2]);
    }

    $.saveArray(lines, "sinbin", false);
}

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var i;
    var lines;
    var found;

    if (command.equalsIgnoreCase("whitelist")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if (args.length > 0) {
            $.inidb.set('whitelist', 'link', args[0]);
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.whitelist-add", args[0]));
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.whitelist-usage"));
            return;
        }


    }
    if (command.equalsIgnoreCase("chat") && username.equalsIgnoreCase($.botname)) {
        $.say(argsString);
    } else if (command.equalsIgnoreCase("purge")) {
        if ($.isModv3(sender, event.getTags())) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 225, username + " purged " + args[0]);

                timeoutUser(args[0], 1);
            } else {
                $.say($.lang.get("net.phantombot.common.err-user"));
            }
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("forgive")) {
        if ($.isAdmin(sender)) {
            if (args.length == 1) {
                for (i = 0; i < sinbin.length; i++) {
                    if (args[0].equalsIgnoreCase(sinbin[i][0])) {

                        sinbin[i][1]--;

                        $.logEvent("chatModerator.js", 242, username + " forgave " + args[0] + ". Now at " + sinbin[i][1] + " strike(s)");

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.forgive", $.username.resolve(args[0]), sinbin[i][1]));
                    }
                }

                lines = new Array();

                for (i = 0; i < sinbin.length; i++) {
                    if (i < sinbin.length && sinbin[i][1] <= 0) {
                        sinbin.splice(i, 1);
                        i--;
                    }
                }

                for (i = 0; i < sinbin.length; i++) {
                    if (sinbin[i][1] > 0) {
                        lines.push(sinbin[i][0] + "=" + sinbin[i][1] + "=" + sinbin[i][2]);
                    }
                }

                $.saveArray(lines, "sinbin", false);
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.err-user"));
            }
        } else {
            $.say($.getWhisperString(sender) + $.adminmsg);
        }
    } else if (command.equalsIgnoreCase("increase")) {
        if ($.isAdmin(sender)) {
            if (args.length == 1) {
                found = false;

                for (i = 0; i < sinbin.length; i++) {
                    if (args[0].equalsIgnoreCase(sinbin[i][0])) {

                        sinbin[i][1]++;

                        $.logEvent("chatModerator.js", 280, username + " gave a strike to " + args[0] + ". Now at " + sinbin[i][1] + " strike(s)");

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.increase", $.username.resolve(args[0]), sinbin[i][1]));

                        found = true;
                    }
                }

                if (found == false) {
                    sinbin.push(new Array(args[0].toLowerCase(), 1, System.currentTimeMillis()));

                    $.logEvent("chatModerator.js", 291, username + " gave a strike to " + args[0] + ". Now at 1 strike(s)");

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.increase", $.username.resolve(args[0]), 1));
                }

                lines = new Array();

                for (i = 0; i < sinbin.length; i++) {
                    if (sinbin[i][1] > 0) {
                        lines.push(sinbin[i][0] + "=" + sinbin[i][1] + "=" + sinbin[i][2]);
                    }
                }

                $.saveArray(lines, "sinbin", false);
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.err-user"));
            }
        } else {
            $.say($.getWhisperString(sender) + $.adminmsg);
        }
    } else if (command.equalsIgnoreCase("timeout")) {
        if ($.isModv3(sender, event.getTags())) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 326, username + " timed out " + args[0] + " for 600 second(s)");

                timeoutUserFor(args[0], 600);
            } else if (args.length == 2 && !isNaN(args[1])) {
                $.logEvent("chatModerator.js", 330, username + " timed out " + args[0] + " for " + args[1] + " second(s)");

                timeoutUserFor(args[0], args[1]);
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.err-user"));
            }
        } else {
            $.say($.getWhisperString(sender) + $.adminmsg);
        }
    } else if (command.equalsIgnoreCase("permit")) {
        if ($.isModv3(sender, event.getTags())) {
            if ($.strlen(argsString) > 0 && linksallowed == false) {
                permitList.push(new Array(argsString.toLowerCase(), System.currentTimeMillis() + (permittime * 1000)));

                $.logEvent("chatModerator.js", 344, username + " permitted " + argsString);

                $.say($.lang.get("net.phantombot.chatmoderator.permit", $.username.resolve(argsString), permittime));
            }
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("ban")) {
        if ($.isModv3(sender, event.getTags())) {
            if (args.length == 2) {
                var time = parseInt(args[1]);

                if (time <= 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.ban-err-time", time));
                }

                $.logEvent("chatModerator.js", 360, username + " banned " + args[0] + " for " + time + " hour(s)");

                banUserFor(args[0], time * 60 * 60);

                $.say($.lang.get("net.phantombot.chatmoderator.ban", $.username.resolve(args[0]), time));
            } else {
                $.logEvent("chatModerator.js", 370, username + " banned " + args[0] + " indefinitely");

                banUser(args[0]);

                $.say($.lang.get("net.phantombot.chatmoderator.ban-indef", $.username.resolve(args[0])));
            }
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("unban")) {
        if ($.isModv3(sender, event.getTags())) {
            $.logEvent("chatModerator.js", 381, username + " unbanned " + args[0]);

            unbanUser(args[0]);

            $.say($.lang.get("net.phantombot.chatmoderator.unban", $.username.resolve(args[0])));
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("clear")) {
        if ($.isModv3(sender, event.getTags())) {
            $.logEvent("chatModerator.js", 391, username + " cleared chat");

            clearChat();

            setTimeout(function () {
                $.say($.lang.get("net.phantombot.chatmoderator.clearchat", username));
            }, 1000);
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("autoban")) {
        if ($.isModv3(sender, event.getTags())) {
            if ($.strlen(argsString) > 0) {
                $.logEvent("chatModerator.js", 404, username + " added a phrase to the autoban list: " + argsString);

                autoBanPhrases.push(argsString);

                var num_phrases = $.inidb.get("autobanphrases", "num_phrases");

                if (isNaN(num_phrases)) {
                    num_phrases = 0;
                }

                $.inidb.set("autobanphrases", "phrase_" + num_phrases, argsString);
                $.inidb.incr("autobanphrases", "num_phrases", 1);

                $.say($.lang.get("net.phantombot.chatmoderator.autoban"));
            }
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("autopurge")) {
        if ($.isModv3(sender, event.getTags())) {
            if ($.strlen(argsString) > 0) {
                $.logEvent("chatModerator.js", 404, username + " added a phrase to the autopurge list: " + argsString);

                autoPurgePhrases.push(argsString);

                var num_phrases = $.inidb.get("autopurgephrases", "num_phrases");

                if (isNaN(num_phrases)) {
                    num_phrases = 0;
                }

                $.inidb.set("autopurgephrases", "phrase_" + num_phrases, argsString);
                $.inidb.incr("autopurgephrases", "num_phrases", 1);

                $.say($.lang.get("net.phantombot.chatmoderator.autopurge"));
            }
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    } else if (command.equalsIgnoreCase("chatmod")) {
        if ($.isModv3(sender, event.getTags())) {
            if (args.length < 1 || args[0].equalsIgnoreCase("help")) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.chatmod-help-1"));
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.chatmod-help-2") + "warningcountresettime, autopurgemessage, autobanmessage, capsallowed, capstriggerratio, capstriggerlength, "
                        + "capsmessage, linksallowed, permittime, youtubeallowed, subsallowed, regsallowed, linksmessage, spamallowed, spamlimit, spammessage");
                $.say($.getWhisperString(sender) + ">>symbolsallowed, symbolslimit, symbolsrepeatlimit, symbolsmessage, repeatallowed, repeatlimit, repeatmessage, graphemeallowed, "
                        + "graphemelimit, graphememessage, warning1type, warning2type, warning3type, warning1message, warning2message, warning3message, disable, enable");
            } else {
                var val;

                if (args.length > 1) {
                    argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);

                    $.logEvent("chatModerator.js", 437, username + " attempted to change chat moderation setting " + args[0] + " to " + argsString);
                }

                if (args[0].equalsIgnoreCase("warningcountresettime")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.chatmoderator.chatmod-warn-reset-time", warningcountresettime));
                    } else {
                        if (val < 0) {
                            val = -1;
                        }

                        $.inidb.set("settings", "warningcountresettime", argsString);

                        warningcountresettime = val;

                        if (val < 0) {
                            $.say($.lang.get("net.phantombot.chatmoderator.chatmod-warn-reset-time-never"));
                        } else {
                            $.say($.lang.get("net.phantombot.chatmoderator.chatmod-warn-reset-time-set", val));
                        }
                    }
                } else if (args[0].equalsIgnoreCase("autopurgemessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current manual autopurge message is '" + autopurgemessage + "'. To change it use: !chatmod autopurgemessage <any text>");
                    } else {

                        $.inidb.set("settings", "autopurgemessage", val);

                        autopurgemessage = val;

                        $.say($.getWhisperString(sender) + "Changed manual autopurge message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("autobanmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current manual autoban message is '" + autobanmessage + "'. To change it use: !chatmod autobanmessage <any text>");
                    } else {

                        $.inidb.set("settings", "autobanmessage", val);

                        autobanmessage = val;

                        $.say($.getWhisperString(sender) + "Changed manual autoban message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("capsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (capsallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender) + "Caps are currently " + val + ". To change it use: !chatmod capsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }

                        $.inidb.set("settings", "capsallowed", val);

                        capsallowed = val.equalsIgnoreCase("1");

                        if (capsallowed) {
                            $.say($.getWhisperString(sender) + "Caps are now allowed!");
                        } else {
                            $.say($.getWhisperString(sender) + "Caps are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("capstriggerratio")) {
                    val = parseFloat(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The current percentage of caps required to trigger a caps warning is " + capstriggerratio + ". To change it use: !chatmod capstriggerratio <number between 0.2 and 1.0>");
                    } else {
                        if (val > 1.0) {
                            val = val / 100;
                        }

                        if (val > 1.0) {
                            val = 1.0;
                        }

                        if (val < 0.2) {
                            val = 0.2;
                        }

                        $.inidb.set("settings", "capstriggerratio", val);

                        capstriggerratio = val;

                        $.say($.getWhisperString(sender) + "Changed caps warning trigger percentage to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("capstriggerlength")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The current message length required to check for caps is " + capstriggerlength + ". To change it use: !chatmod capstriggerlength <number greater than 0>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.set("settings", "capstriggerlength", val);

                        capstriggerlength = val;

                        $.say($.getWhisperString(sender) + "Changed caps warning minimum message length to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("capsmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current caps warning message is '" + capsmessage + "'. To change it use: !chatmod capsmessage <any text>");
                    } else {

                        $.inidb.set("settings", "capsmessage", val);

                        capsmessage = val;

                        $.say($.getWhisperString(sender) + "Changed caps warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("linksallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (linksallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender) + "Links are currently " + val + ". To change it use: !chatmod linksallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }

                        $.inidb.set("settings", "linksallowed", val);

                        linksallowed = val.equalsIgnoreCase("1");

                        if (linksallowed) {
                            $.say($.getWhisperString(sender) + "Links are now allowed!");
                        } else {
                            $.say($.getWhisperString(sender) + "Links are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("permittime")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The current permit time is " + permittime + " seconds. To change it use: !chatmod permittime <number that is at least 60>");
                    } else {
                        if (val < 60) {
                            val = 60;
                        }

                        $.inidb.set("settings", "permittime", val);

                        permittime = val;

                        $.say($.getWhisperString(sender) + "Changed permit time to " + val + " seconds!");
                    }
                } else if (args[0].equalsIgnoreCase("youtubeallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (youtubeallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say("Youtube links are currently " + val + ". To change it use: !chatmod youtubeallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }

                        $.inidb.set("settings", "youtubeallowed", val);

                        youtubeallowed = val.equalsIgnoreCase("1");

                        if (youtubeallowed) {
                            $.say($.getWhisperString(sender) + "Youtube links are now allowed!");
                        }
                        else {
                            $.say($.getWhisperString(sender) + "Youtube links are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("subsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (subsallowed) {
                            val = "allowed";
                        } else {
                            val = "NOT allowed";
                        }

                        $.say($.getWhisperString(sender) + "Subscribers are currently " + val + " to post links. To change it use: !chatmod subsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }

                        $.inidb.set("settings", "subsallowed", val);

                        subsallowed = val.equalsIgnoreCase("1");

                        if (subsallowed) {
                            $.say($.getWhisperString(sender) + "Subscribers are now allowed to post links!");
                        } else {
                            $.say($.getWhisperString(sender) + "Subscribers are no longer allowed to post links!");
                        }
                    }

                } else if (args[0].equalsIgnoreCase("regsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (regsallowed) {
                            val = "allowed";
                        } else {
                            val = "NOT allowed";
                        }

                        $.say($.getWhisperString(sender) + "Regulars are currently " + val + " to post links. To change it use: !chatmod regsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }

                        $.inidb.set("settings", "regsallowed", val);

                        regsallowed = val.equalsIgnoreCase("1");

                        if (regsallowed) {
                            $.say($.getWhisperString(sender) + "Regulars are now allowed to post links!");
                        } else {
                            $.say($.getWhisperString(sender) + "Regulars are no longer allowed to post links!");
                        }
                    }

                } else if (args[0].equalsIgnoreCase("linksmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current link warning message is '" + linksmessage + "'. To change it use: !chatmod linksmessage <any text>");
                    } else {

                        $.inidb.set("settings", "linksmessage", val);

                        linksmessage = val;

                        $.say($.getWhisperString(sender) + "Changed link warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("spamallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (spamallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender) + "Chat spam is currently " + val + ". To change it use: !chatmod spamallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }

                        $.inidb.set("settings", "spamallowed", val);

                        spamallowed = val.equalsIgnoreCase("1");

                        if (spamallowed) {
                            $.say($.getWhisperString(sender) + "Chat spam is now allowed!");
                        } else {
                            $.say($.getWhisperString(sender) + "Chat spam is now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("spamlimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The current number of messages allowed per 30 seconds is " + spamlimit + ". To change it use: !chatmod spamlimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.set("settings", "spamlimit", val);

                        spamlimit = val;

                        $.say($.getWhisperString(sender) + "Changed number of messages allowed per 30 seconds to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("spammessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current spam warning message is '" + spammessage + "'. To change it use: !chatmod spammessage <any text>");
                    } else {

                        $.inidb.set("settings", "spammessage", val);

                        spammessage = val;

                        $.say($.getWhisperString(sender) + "Changed spam warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("symbolsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (symbolsallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender) + "Symbol spam is currently " + val + ". To change it use: !chatmod symbolsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }

                        $.inidb.set("settings", "symbolsallowed", val);

                        symbolsallowed = val.equalsIgnoreCase("1");

                        if (symbolsallowed) {
                            $.say($.getWhisperString(sender) + "Symbol spam is now allowed!");
                        } else {
                            $.say($.getWhisperString(sender) + "Symbol spam is now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("symbolslimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The current maximum number of symbols allowed in a message is " + symbolslimit + ". To change it use: !chatmod symbolslimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.set("settings", "symbolslimit", val);

                        symbolslimit = val;

                        $.say($.getWhisperString(sender) + "Changed number of symbols allowed per message to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("symbolsrepeatlimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The current maximum repeating symbols sequence allowed in a message is " + symbolsrepeatlimit + ". To change it use: !chatmod symbolsrepeatlimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.set("settings", "symbolsrepeatlimit", val);

                        symbolsrepeatlimit = val;

                        $.say($.getWhisperString(sender) + "Changed maximum repeating symbols sequence allowed in a message to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("symbolsmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current symbols warning message is '" + symbolsmessage + "'. To change it use: !chatmod symbolsmessage <any text>");
                    } else {

                        $.inidb.set("settings", "symbolsmessage", val);

                        symbolsmessage = val;

                        $.say($.getWhisperString(sender) + "Changed symbols warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("repeatallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (repeatallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender) + "Repeating character spam is currently " + val + ". To change it use: !chatmod repeatallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }

                        $.inidb.set("settings", "repeatallowed", val);

                        repeatallowed = val.equalsIgnoreCase("1");

                        if (repeatallowed) {
                            $.say($.getWhisperString(sender) + "Repeating character spam is now allowed!");
                        } else {
                            $.say($.getWhisperString(sender) + "Repeating character spam is now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("repeatlimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The maximum number of repeating sequences/repeating sequence length is " + repeatlimit + ". To change it use: !chatmod repeatlimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.set("settings", "repeatlimit", val);

                        repeatlimit = val;

                        $.say($.getWhisperString(sender) + "Changed maximum number of repeating sequences/repeating sequence length to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("repeatmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current repeating character warning message is '" + repeatmessage + "'. To change it use: !chatmod repeatmessage <any text>");
                    } else {

                        $.inidb.set("settings", "repeatmessage", val);

                        repeatmessage = val;

                        $.say($.getWhisperString(sender) + "Changed repeating character warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("graphemeallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (graphemeallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender) + "Long grapheme clusters are currently " + val + ". To change it use: !chatmod graphemeallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }

                        $.inidb.set("settings", "graphemeallowed", val);

                        graphemeallowed = val.equalsIgnoreCase("1");

                        if (graphemeallowed) {
                            $.say($.getWhisperString(sender) + "Long grapheme clusters are now allowed!");
                        } else {
                            $.say($.getWhisperString(sender) + "Long grapheme clusters are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("graphemelimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender) + "The maximum allowed grapheme cluster length is " + graphemelimit + ". To change it use: !chatmod graphemelimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.set("settings", "graphemelimit", val);

                        graphemelimit = val;

                        $.say($.getWhisperString(sender) + "Changed maximum allowed grapheme cluster length to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("graphememessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current long grapheme cluster are warning message is '" + graphememessage + "'. To change it use: !chatmod graphememessage <any text>");
                    } else {

                        $.inidb.set("settings", "graphememessage", val);

                        graphememessage = val;

                        $.say($.getWhisperString(sender) + "Changed long grapheme cluster warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("warning1type")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("purge") && !val.equalsIgnoreCase("ban") && !isNaN(val))) {
                        if (warningtypes[0].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[0].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[0] + " seconds";
                        }

                        $.say($.getWhisperString(sender) + "The current action taken upon first warning is " + val + ". To change it use: !chatmod warning1type <'purge', 'ban', or the number of seconds to timeout for>");
                    } else {

                        $.inidb.set("settings", "warning1type", val);

                        warningtypes[0] = val;

                        if (warningtypes[0].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[0].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[0] + " seconds";
                        }

                        $.say($.getWhisperString(sender) + "Changed first warning action to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("warning2type")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("purge") && !val.equalsIgnoreCase("ban") && !isNaN(val))) {
                        if (warningtypes[1].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[1].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[1] + " seconds";
                        }

                        $.say($.getWhisperString(sender) + "The current action taken upon second warning is " + val + ". To change it use: !chatmod warning2type <'purge', 'ban', or the number of seconds to timeout for>");
                    } else {

                        $.inidb.set("settings", "warning2type", val);

                        warningtypes[1] = val;

                        if (warningtypes[1].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[1].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[1] + " seconds";
                        }

                        $.say($.getWhisperString(sender) + "Changed second warning action to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("warning3type")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("purge") && !val.equalsIgnoreCase("ban") && !isNaN(val))) {
                        if (warningtypes[2].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[2].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[2] + " seconds";
                        }

                        $.say($.getWhisperString(sender) + "The current action taken upon third/final warning is " + val + ". To change it use: !chatmod warning3type <'purge', 'ban', or the number of seconds to timeout for>");
                    } else {

                        $.inidb.set("settings", "warning3type", val);

                        warningtypes[2] = val;

                        if (warningtypes[2].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[2].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[2] + " seconds";
                        }

                        $.say($.getWhisperString(sender) + "Changed third/final warning action to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("warning1message")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current first warning message is '" + warningmessages[0] + "'. To change it use: !chatmod warning1message <any text>");
                    } else {

                        $.inidb.set("settings", "warning1message", val);

                        warningmessages[0] = val;

                        $.say($.getWhisperString(sender) + "Changed first warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("disable")) {
                    val = '1';
                    $.inidb.set('settings', 'linksallowed', val);
                    $.println(">Link filter disabled.");
                    $.inidb.set('settings', 'capsallowed', val);
                    $.println(">Caps filter disabled.");
                    $.inidb.set('settings', 'symbolsallowed', val);
                    $.println(">Symbol filter disabled.");
                    $.inidb.set('settings', 'graphemeallowed', val);
                    $.println(">Grapheme filter disabled.");
                    $.inidb.set('settings', 'repeatallowed', val);
                    $.println(">Repeat filter disabled.");
                    $.say("Chat Moderator has been disabled.");
                } else if (args[0].equalsIgnoreCase("enable")) {
                    val = '0';
                    $.inidb.set('settings', 'linksallowed', val);
                    $.println(">Link filter enabled.");
                    $.inidb.set('settings', 'capsallowed', val);
                    $.println(">Caps filter enabled.");
                    $.inidb.set('settings', 'symbolsallowed', val);
                    $.println(">Symbol filter enabled.");
                    $.inidb.set('settings', 'graphemeallowed', val);
                    $.println(">Grapheme filter enabled.");
                    $.inidb.set('settings', 'repeatallowed', val);
                    $.println(">Repeat filter enabled.");
                    $.say("Chat Moderator has been enabled.");
                } else if (args[0].equalsIgnoreCase("warning2message")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current second warning message is '" + warningmessages[1] + "'. To change it use: !chatmod warning2message <any text>");
                    } else {

                        $.inidb.set("settings", "warning2message", val);

                        warningmessages[1] = val;

                        $.say($.getWhisperString(sender) + "Changed second warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("warning3message")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender) + "The current third/final warning message is '" + warningmessages[2] + "'. To change it use: !chatmod warning3message <any text>");
                    } else {

                        $.inidb.set("settings", "warning3message", val);

                        warningmessages[2] = val;

                        $.say($.getWhisperString(sender) + "Changed third/final warning message to '" + val + "'!");
                    }
                }
            }
        } else {
            $.say($.getWhisperString(sender) + $.modmsg);
        }
    }
});

$.on('ircChannelMessage', function (event) {
    var sender = event.getSender().toLowerCase();
    var chatName = $.username.resolve(sender, event.getTags());
    var username = chatName.toLowerCase();
    var message = event.getMessage();
    var omessage = message;

    var msglen = -1;
    var phlen = -1;

    msglen = $.strlen(message);

    var caps = event.getCapsCount();
    var capsRatio = (caps * 1.0) / msglen;
    var i;

    var numsymbols = $.getNumberOfNonLetters(event);
    var rptsymbols = $.getLongestNonLetterSequence(event);
    var numrepeat = $.getNumberOfRepeatSequences(event);
    var rptrepeat = $.getLongestRepeatedSequence(event);
    var grapheme = $.getLongestUnicodeGraphemeCluster(event);


    if (message != null && message != undefined) {
        message = message.toLowerCase();
    }

    for (i = 0; i < autoBanPhrases.length; i++) {
        phlen = $.strlen(autoBanPhrases[i]);

        if (autoBanPhrases[i] != null && autoBanPhrases[i] != undefined && message.indexOf(autoBanPhrases[i].toLowerCase()) != -1
                && !$.isModv3(sender, event.getTags()) && phlen > 0) {
            $.logEvent("chatModerator.js", 1123, "Autoban triggered by " + username + ". Message: " + omessage);

            banUser(username);
            $.say($.getWhisperString(sender) + autobanmessage + i);
            return;
        }
    }

    for (i = 0; i < autoPurgePhrases.length; i++) {
        phlen = $.strlen(autoPurgePhrases[i]);

        if (autoPurgePhrases[i] != null && autoPurgePhrases[i] != undefined && message.indexOf(autoPurgePhrases[i].toLowerCase()) != -1
                && !$.isModv3(sender, event.getTags()) && phlen > 0) {
            $.logEvent("chatModerator.js", 1123, "Autopurge triggered by " + username + ". Message: " + omessage);

            autoPurgeUser(username, autopurgemessage + i);
            return;
        }
    }

    //Change the second parameter to true to use aggressive link detection
    if (linksallowed == false && $.hasLinks(event, false) && !$.isModv3(sender, event.getTags()) && (!$.isSubv3(sender, event.getTags()) || !subsallowed) && (!$.isReg(sender) || !regsallowed)) {
        var permitted = false;

        for (i = 0; i < permitList.length; i++) {
            if (i < permitList.length) {
                if (permitList[i][0] != null && permitList[i][0] != undefined && permitList[i][0].toLowerCase().equalsIgnoreCase(sender)) {
                    if (permitList[i][1] >= System.currentTimeMillis()) {
                        permitted = true;
                    }

                    permitList.splice(i, 1);
                    i--;
                }
            }
        }

        if ($.inidb.exists('whitelist', 'link') && message.contains($.inidb.get('whitelist', 'link'))) {
            permitted = true;
        }

        if (youtubeallowed == true && (message.indexOf("youtube.com") != -1 || message.indexOf("youtu.be") != -1)) {
            permitted = true;
        }

        if (permitted == false) {
            $.logEvent("chatModerator.js", 1154, "Automatic link punishment triggered by " + username + ". Link: " + $.getLastLink() + "      Message: " + omessage);

            autoPurgeUser(username, linksmessage);
        }
    } else if (capsallowed == false && capsRatio > capstriggerratio && msglen > capstriggerlength && !$.isModv3(sender, event.getTags()) && (!$.isSubv3(sender, event.getTags()) || !subsallowed) && (!$.isReg(sender) || !regsallowed)) {
        autoPurgeUser(username, capsmessage + " Message Length: " + $.strlen(message) + "    Caps Limit: " + $.inidb.get("settings", "capstriggerratio"));
        $.logEvent("chatModerator.js", 1163, "Automatic caps punishment triggered by " + username + ". Message Length: " + $.strlen(message) + "    Caps Ratio: " + capsRatio + "    Message: " + omessage);
    } else if (!symbolsallowed && !$.isModv3(sender, event.getTags()) && (!$.isSubv3(sender, event.getTags()) || !subsallowed) && (!$.isReg(sender) || !regsallowed) && (numsymbols > symbolslimit || rptsymbols > symbolsrepeatlimit)) {
        autoPurgeUser(username, symbolsmessage + " Symbol limit: " + $.inidb.get("settings", "symbolslimit") + ". Total symbols: " + numsymbols);
        $.logEvent("chatModerator.js", 1193, "Automatic symbols punishment triggered by " + username + ". Longest symbol sequence: " + rptsymbols + ". Total symbols: " + numsymbols + ". Message: " + omessage);
    } else if (!repeatallowed && !$.isModv3(sender, event.getTags()) && (!$.isSubv3(sender, event.getTags()) || !subsallowed) && (!$.isReg(sender) || !regsallowed) && (numrepeat > repeatlimit || rptrepeat > repeatlimit) && rptrepeat > 6) {
        autoPurgeUser(username, repeatmessage + " Repeating Character limit: " + $.inidb.get("settings", "repeatlimit") + ". Total Characters: " + numrepeat);
        $.logEvent("chatModerator.js", 1199, "Automatic repeat punishment triggered by " + username + ". Longest repeat sequence: " + rptrepeat + ". Total repeat sequences: " + numrepeat + ". Message: " + omessage);
    } else if (!graphemeallowed && !$.isModv3(sender, event.getTags()) && (!$.isSubv3(sender, event.getTags()) || !subsallowed) && (!$.isReg(sender) || !regsallowed) && grapheme > graphemelimit) {
        autoPurgeUser(username, graphememessage + " Grapheme limit: " + $.inidb.get("settings", "graphemelimit"));
        $.logEvent("chatModerator.js", 1205, "Automatic grapheme punishment triggered by " + username + ". Longest grapheme sequence: " + grapheme + ". Message: " + omessage);
    } else if (!spamallowed && !$.isModv3(sender, event.getTags()) && (!$.isSubv3(sender, event.getTags()) || !subsallowed) && (!$.isReg(sender) || !regsallowed)) {
        var idx = -1;

        for (i = 0; i < $.spamtracker.length; i++) {
            if ($.spamtracker[i][0].equalsIgnoreCase(sender)) {
                idx = i;
            }
        }

        if (idx == -1) {
            $.spamtracker.push(new Array(sender, 0, new Array()));
            idx = $.spamtracker.length - 1;
        }

        $.spamtracker[idx][1]++;
        $.spamtracker[idx][2].push(System.currentTimeMillis() + (30 * 1000));

        if ($.spamtracker[idx][1] >= spamlimit) {
            autoPurgeUser(username, spammessage + " Spam limit: " + $.inidb.get("settings", "spamlimit"));
            $.logEvent("chatModerator.js", 1223, "Automatic spam punishment triggered by " + username + ". Messages in the last 30 seconds: " + $.spamtracker[idx][1]);
        }
    }
});

$.registerChatCommand("./util/chatModerator.js", "purge", "mod");
$.registerChatCommand("./util/chatModerator.js", "timeout", "mod");
$.registerChatCommand("./util/chatModerator.js", "ban", "mod");
$.registerChatCommand("./util/chatModerator.js", "unban", "mod");
$.registerChatCommand("./util/chatModerator.js", "clear", "mod");
$.registerChatCommand("./util/chatModerator.js", "autopurge", "mod");
$.registerChatCommand("./util/chatModerator.js", "autoban", "mod");
$.registerChatCommand("./util/chatModerator.js", "permit", "mod");
$.registerChatCommand("./util/chatModerator.js", "chatmod", "mod");

$.timer.addTimer("./util/chatModerator.js", "maintainlists", true, function () {
    var i;
    for (i = 0; i < permitList.length; i++) {
        if (i < permitList.length) {
            if (permitList[i][1] < System.currentTimeMillis()) {
                permitList.splice(i, 1);
                i--;
            }
        }
    }

    for (i = 0; i < $.spamtracker.length; i++) {
        if (i < $.spamtracker.length) {
            for (var b = 0; b < $.spamtracker[i][2].length; b++) {
                if (b < $.spamtracker[i][2].length) {
                    if ($.spamtracker[i][2][b] < System.currentTimeMillis()) {
                        $.spamtracker[i][2].splice(b, 1);
                        $.spamtracker[i][1]--;
                        b--;
                    }
                }
            }

            if ($.spamtracker[i][1] <= 0 || $.spamtracker[i][2].length == 0) {
                $.spamtracker.splice(i, 1);
                i--;
            }
        }
    }
}, 1000);

var num_phrases = parseInt($.inidb.get("autopurgephrases", "num_phrases"));

for (i = 0; i < num_phrases; i++) {
    autoPurgePhrases.push($.inidb.get("autopurgephrases", "phrase_" + i));
}


var num_phrases = parseInt($.inidb.get("autobanphrases", "num_phrases"));

for (i = 0; i < num_phrases; i++) {
    autoBanPhrases.push($.inidb.get("autobanphrases", "phrase_" + i));
}
