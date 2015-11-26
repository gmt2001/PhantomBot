var ircPrefix = ".";

function issueCommand(command, channel) {
    $.say(command, channel);
    $.timer.addTimer("./util/chatModerator.js", "issueCommand" + command, false, function (param) {
        $.say(param[0], param[1]);
        $.say(param[0], param[1]);
    }, 1800, new Array(command, channel));
}

function banUser(user, channel) {
    issueCommand(ircPrefix + "ban " + user, channel);
}

function unbanUser(user, channel) {
    issueCommand(ircPrefix + "unban " + user, channel);
}

function clearChat(channel) {
    issueCommand(ircPrefix + "clear", channel);
}

function timeoutUser(user, fortime, channel) {
    issueCommand(ircPrefix + "timeout " + user + " " + fortime, channel);
}

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChanne();

    if (command.equalsIgnoreCase("whitelist")) {
        if (!$.isMod(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }

        if (args.length > 0) {
            $.inidb.SetString('whitelist', channel.getName(), 'link', args[0]);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.chatmoderator.whitelist-add", channel, args[0]), channel);
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.chatmoderator.whitelist-usage", channel), channel);
            return;
        }
    }
    if (command.equalsIgnoreCase("chat") && username.equalsIgnoreCase($.botname)) {
        $.say(argsString, channel);
    } else if (command.equalsIgnoreCase("purge")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 225, channel, username + " purged " + args[0]);

                timeoutUser(args[0], 1, channel);
            } else {
                $.say($.lang.get("net.phantombot.common.err-user", channel), channel);
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("timeout")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 326, channel, username + " timed out " + args[0] + " for 600 second(s)");

                timeoutUser(args[0], 600, channel);
            } else if (args.length == 2 && !isNaN(args[1])) {
                $.logEvent("chatModerator.js", 330, channel, username + " timed out " + args[0] + " for " + args[1] + " second(s)");

                timeoutUser(args[0], args[1], channel);
            } else {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.err-user", channel), channel);
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("permit")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            if ($.strlen(argsString) > 0 && !$.inidb.GetBoolean("settings", channel.getName(), "linksallowed")) {
                $.tempdb.SetInteger("t_permit", channel.getName(), argsString.toLowerCase(), System.currentTimeMillis() + ($.inidb.GetInteger("settings", channel.getName(), "permittime") * 1000));

                $.logEvent("chatModerator.js", 344, channel, username + " permitted " + argsString);

                $.say($.lang.get("net.phantombot.chatmoderator.permit", channel, $.username.resolve(argsString), $.inidb.GetInteger("settings", channel.getName(), "permittime")), channel);
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("ban")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            $.logEvent("chatModerator.js", 370, channel, username + " banned " + args[0] + " indefinitely");

            banUser(args[0], channel);

            $.say($.lang.get("net.phantombot.chatmoderator.ban-indef", channel, $.username.resolve(args[0])));
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("unban")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            $.logEvent("chatModerator.js", 381, channel, username + " unbanned " + args[0]);

            unbanUser(args[0], channel);

            $.say($.lang.get("net.phantombot.chatmoderator.unban", channel, $.username.resolve(args[0])), channel);
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("clear")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            $.logEvent("chatModerator.js", 391, channel, username + " cleared chat");

            clearChat(channel);

            $.timer.addTimer("./util/chatModerator.js", "clearchat", false, function (param) {
                $.say($.lang.get("net.phantombot.chatmoderator.clearchat", param[0], param[1]), param[0]);
            }, 1000, new Array(channel, username));
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("autoban")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            if ($.strlen(argsString) > 0) {
                $.logEvent("chatModerator.js", 404, channel, username + " added a phrase to the autoban list: " + argsString);

                var num_phrases = $.inidb.GetInteger("autobanphrases", channel.getName(), "num_phrases");

                $.inidb.SetString("autobanphrases", channel.getName(), "phrase_" + num_phrases, argsString);
                $.inidb.SetInteger("autobanphrases", channel.getName(), "num_phrases", num_phrases + 1);

                $.say($.lang.get("net.phantombot.chatmoderator.autoban", channel), channel);
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("autopurge")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            if ($.strlen(argsString) > 0) {
                $.logEvent("chatModerator.js", 404, channel, username + " added a phrase to the autopurge list: " + argsString);

                var num_phrases = $.inidb.GetInteger("autopurgephrases", channel.getName(), "num_phrases");

                $.inidb.SetString("autopurgephrases", channel.getName(), "phrase_" + num_phrases, argsString);
                $.inidb.SetInteger("autopurgephrases", channel.getName(), "num_phrases", num_phrases + 1);

                $.say($.lang.get("net.phantombot.chatmoderator.autopurge", channel), channel);
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    } else if (command.equalsIgnoreCase("chatmod")) {
        if ($.isMod(sender, event.getTags(), channel)) {
            if (args.length < 1 || args[0].equalsIgnoreCase("help")) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.chatmoderator.chatmod-help-1", channel), channel);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.chatmoderator.chatmod-help-2", channel) + "autopurgemessage, autobanmessage, capsallowed, capstriggerratio, capstriggerlength, "
                        + "capsmessage, linksallowed, permittime, youtubeallowed, subsallowed, regsallowed, linksmessage", channel);
                $.say($.getWhisperString(sender, channel) + ">>symbolsallowed, symbolslimit, symbolsrepeatlimit, symbolsmessage, repeatallowed, repeatlimit, repeatmessage, graphemeallowed, "
                        + "graphemelimit, graphememessage, disable, enable", channel);
            } else {
                var val;

                if (args.length > 1) {
                    argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);

                    $.logEvent("chatModerator.js", 437, channel, username + " attempted to change chat moderation setting " + args[0] + " to " + argsString);
                }

                if (args[0].equalsIgnoreCase("autopurgemessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current autopurge message is '" + $.inidb.GetString("settings", channel.getName(), "autopurgemessage") + "'. To change it use: !chatmod autopurgemessage <any text>", channel);
                    } else {
                        $.inidb.SetString("settings", channel.getName(), "autopurgemessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed autopurge message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("autobanmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current autoban message is '" + $.inidb.GetString("settings", channel.getName(), "autobanmessage") + "'. To change it use: !chatmod autobanmessage <any text>", channel);
                    } else {

                        $.inidb.SetString("settings", channel.getName(), "autobanmessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed autoban message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("capsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "capsallowed")) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender, channel) + "Caps are currently " + val + ". To change it use: !chatmod capsallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "capsallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Caps are now allowed!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "capsallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Caps are now moderated!", channel);
                        }
                    }
                } else if (args[0].equalsIgnoreCase("capstriggerratio")) {
                    val = parseFloat(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The current percentage of caps required to trigger a caps warning is " + $.inidb.GetFloat("settings", channel.getName(), "capstriggerratio") + ". To change it use: !chatmod capstriggerratio <number between 0.2 and 1.0>", channel);
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

                        $.inidb.SetFloat("settings", channel.getName(), "capstriggerratio", val);

                        $.say($.getWhisperString(sender, channel) + "Changed caps warning trigger percentage to " + val + "!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("capstriggerlength")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The current message length required to check for caps is " + $.inidb.GetInteger("settings", channel.getName(), "capstriggerlength") + ". To change it use: !chatmod capstriggerlength <number greater than 0>", channel);
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.SetInteger("settings", channel.getName(), "capstriggerlength", val);

                        $.say($.getWhisperString(sender, channel) + "Changed caps warning minimum message length to " + val + "!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("capsmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current caps warning message is '" + $.inidb.GetString("settings", channel.getName(), "capsmessage") + "'. To change it use: !chatmod capsmessage <any text>", channel);
                    } else {

                        $.inidb.SetString("settings", channel.getName(), "capsmessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed caps warning message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("linksallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "linksallowed")) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender, channel) + "Links are currently " + val + ". To change it use: !chatmod linksallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "linksallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Links are now allowed!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "linksallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Links are now moderated!", channel);
                        }
                    }
                } else if (args[0].equalsIgnoreCase("permittime")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The current permit time is " + $.inidb.GetInteger("settings", channel.getName(), "permittime") + " seconds. To change it use: !chatmod permittime <number that is at least 60>", channel);
                    } else {
                        if (val < 60) {
                            val = 60;
                        }

                        $.inidb.SetInteger("settings", channel.getName(), "permittime", val);

                        $.say($.getWhisperString(sender, channel) + "Changed permit time to " + val + " seconds!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("youtubeallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "youtubeallowed")) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender, channel) + "Youtube links are currently " + val + ". To change it use: !chatmod youtubeallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "youtubeallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Youtube links are now allowed!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "youtubeallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Youtube links are now moderated!", channel);
                        }
                    }
                } else if (args[0].equalsIgnoreCase("subsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "subsallowed")) {
                            val = "allowed";
                        } else {
                            val = "NOT allowed";
                        }

                        $.say($.getWhisperString(sender, channel) + "Subscribers are currently " + val + " to post links. To change it use: !chatmod subsallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "subsallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Subscribers are now allowed to post links!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "subsallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Subscribers are no longer allowed to post links!", channel);
                        }
                    }

                } else if (args[0].equalsIgnoreCase("regsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "regsallowed")) {
                            val = "allowed";
                        } else {
                            val = "NOT allowed";
                        }

                        $.say($.getWhisperString(sender, channel) + "Regulars are currently " + val + " to post links. To change it use: !chatmod regsallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "regsallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Regulars are now allowed to post links!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "regsallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Regulars are no longer allowed to post links!", channel);
                        }
                    }

                } else if (args[0].equalsIgnoreCase("linksmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current link warning message is '" + $.inidb.GetString("settings", channel.getName(), "linksmessage") + "'. To change it use: !chatmod linksmessage <any text>", channel);
                    } else {

                        $.inidb.SetString("settings", channel.getName(), "linksmessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed link warning message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("symbolsallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "symbolsallowed")) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender, channel) + "Symbol spam is currently " + val + ". To change it use: !chatmod symbolsallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "symbolsallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Symbol spam is now allowed!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "symbolsallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Symbol spam is now moderated!", channel);
                        }
                    }
                } else if (args[0].equalsIgnoreCase("symbolslimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The current maximum number of symbols allowed in a message is " + $.inidb.GetInteger("settings", channel.getName(), "symbolslimit") + ". To change it use: !chatmod symbolslimit <number, at least 1>", channel);
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.SetInteger("settings", channel.getName(), "symbolslimit", val);

                        $.say($.getWhisperString(sender, channel) + "Changed number of symbols allowed per message to " + val + "!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("symbolsrepeatlimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The current maximum repeating symbols sequence allowed in a message is " + $.inidb.GetInteger("settings", channel.getName(), "symbolsrepeatlimit") + ". To change it use: !chatmod symbolsrepeatlimit <number, at least 1>", channel);
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.SetInteger("settings", channel.getName(), "symbolsrepeatlimit", val);

                        $.say($.getWhisperString(sender, channel) + "Changed maximum repeating symbols sequence allowed in a message to " + val + "!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("symbolsmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current symbols warning message is '" + $.inidb.GetString("settings", channel.getName(), "symbolsmessage") + "'. To change it use: !chatmod symbolsmessage <any text>", channel);
                    } else {
                        $.inidb.SetString("settings", channel.getName(), "symbolsmessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed symbols warning message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("repeatallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "repeatallowed")) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender, channel) + "Repeating character spam is currently " + val + ". To change it use: !chatmod repeatallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "repeatallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Repeating character spam is now allowed!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "repeatallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Repeating character spam is now moderated!", channel);
                        }
                    }
                } else if (args[0].equalsIgnoreCase("repeatlimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The maximum number of repeating sequences/repeating sequence length is " + $.inidb.GetInteger("settings", channel.getName(), "repeatlimit") + ". To change it use: !chatmod repeatlimit <number, at least 1>", channel);
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.SetInteger("settings", channel.getName(), "repeatlimit", val);

                        $.say($.getWhisperString(sender, channel) + "Changed maximum number of repeating sequences/repeating sequence length to " + val + "!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("repeatmessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current repeating character warning message is '" + $.inidb.GetString("settings", channel.getName(), "repeatmessage") + "'. To change it use: !chatmod repeatmessage <any text>", channel);
                    } else {
                        $.inidb.SetString("settings", channel.getName(), "repeatmessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed repeating character warning message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("graphemeallowed")) {
                    val = argsString;

                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if ($.inidb.GetBoolean("settings", channel.getName(), "graphemeallowed")) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }

                        $.say($.getWhisperString(sender, channel) + "Long grapheme clusters are currently " + val + ". To change it use: !chatmod graphemeallowed <'true' or 'false'>", channel);
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            $.inidb.SetBoolean("settings", channel.getName(), "graphemeallowed", true);
                            $.say($.getWhisperString(sender, channel) + "Long grapheme clusters are now allowed!", channel);
                        } else {
                            $.inidb.SetBoolean("settings", channel.getName(), "graphemeallowed", false);
                            $.say($.getWhisperString(sender, channel) + "Long grapheme clusters are now moderated!", channel);
                        }
                    }
                } else if (args[0].equalsIgnoreCase("graphemelimit")) {
                    val = parseInt(argsString);

                    if (args.length == 1 || isNaN(val)) {
                        $.say($.getWhisperString(sender, channel) + "The maximum allowed grapheme cluster length is " + $.inidb.GetInteger("settings", channel.getName(), "graphemelimit") + ". To change it use: !chatmod graphemelimit <number, at least 1>", channel);
                    } else {
                        if (val < 1) {
                            val = 1;
                        }

                        $.inidb.SetInteger("settings", channel.getName(), "graphemelimit", val);

                        $.say($.getWhisperString(sender, channel) + "Changed maximum allowed grapheme cluster length to " + val + "!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("graphememessage")) {
                    val = argsString;

                    if (args.length == 1) {
                        $.say($.getWhisperString(sender, channel) + "The current long grapheme cluster are warning message is '" + $.inidb.GetString("settings", channel.getName(), "graphememessage") + "'. To change it use: !chatmod graphememessage <any text>", channel);
                    } else {

                        $.inidb.SetString("settings", channel.getName(), "graphememessage", val);

                        $.say($.getWhisperString(sender, channel) + "Changed long grapheme cluster warning message to '" + val + "'!", channel);
                    }
                } else if (args[0].equalsIgnoreCase("disable")) {
                    $.inidb.SetBoolean('settings', channel.getName(), 'chatmod_disabled', true);
                    $.say($.getWhisperString(sender, channel) + "Chat Moderator has been disabled.", channel);
                } else if (args[0].equalsIgnoreCase("enable")) {
                    $.inidb.SetBoolean('settings', channel.getName(), 'chatmod_disabled', false);
                    $.say($.getWhisperString(sender, channel) + "Chat Moderator has been enabled.", channel);
                }
            }
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
        }
    }
});

$.on('ircChannelMessage', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var message = event.getMessage();
    var channel = event.getChannel();
    var omessage = message;

    var msglen = -1;
    var phlen = -1;
    var phrase;

    msglen = $.strlen(message);

    if (message != null && message != undefined) {
        message = message.toLowerCase();
    }

    var keys = $.inidb.GetKeyList("autobanphrases", channel.getName());
    for (i = 0; i < keys.length; i++) {
        phrase = $.inidb.GetString("autobanphrases", channel.getName(), keys[i]);
        phlen = $.strlen(phrase);

        if (message.contains(phrase.toLowerCase()) && !$.isMod(sender, event.getTags(), channel) && phlen > 0) {
            $.logEvent("chatModerator.js", 1123, channel, "Autoban triggered by " + username + ". Message: " + omessage);

            banUser(sender, channel);
            $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "autobanmessage") + i + $.lang.get("net.phantombot.chatmoderator.banned", channel), channel);
            return;
        }
    }

    keys = $.inidb.GetKeyList("autopurgephrases", channel.getName());
    for (i = 0; i < keys.length; i++) {
        phrase = $.inidb.GetString("autopurgephrases", channel.getName(), keys[i]);
        phlen = $.strlen(phrase);

        if (message.contains(phrase.toLowerCase()) && !$.isMod(sender, event.getTags(), channel) && phlen > 0) {
            $.logEvent("chatModerator.js", 1123, channel, "Autopurge triggered by " + username + ". Message: " + omessage);

            purgeUser(sender, channel);
            $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "autopurgemessage") + i + $.lang.get("net.phantombot.chatmoderator.purged", channel), channel);
            return;
        }
    }

    if ($.inidb.GetBoolean('settings', channel.getName(), 'chatmod_disabled')) {
        return;
    }

    var caps = event.getCapsCount();
    var capsRatio = (caps * 1.0) / msglen;
    var i;

    var numsymbols = $.getNumberOfNonLetters(event);
    var rptsymbols = $.getLongestNonLetterSequence(event);
    var numrepeat = $.getNumberOfRepeatSequences(event);
    var rptrepeat = $.getLongestRepeatedSequence(event);
    var grapheme = $.getLongestUnicodeGraphemeCluster(event);

    //Change the second parameter to true to use aggressive link detection
    if (!$.inidb.GetBoolean("settings", channel.getName(), "linksallowed") && $.hasLinks(event, false) && !$.isMod(sender, event.getTags(), channel)
            && (!$.isSub(sender, event.getTags(), channel) || !$.inidb.GetBoolean("settings", channel.getName(), "subsallowed"))
            && (!$.isReg(sender, channel) || !$.inidb.GetBoolean("settings", channel.getName(), "regsallowed"))) {
        var permitted = false;

        if ($.tempdb.GetInteger("t_permit", channel.getName(), sender) >= System.currentTimeMillis()) {
            permitted = true;
            $.tempdb.RemoveKey("t_permit", channel.getName(), sender);
        }

        if ($.inidb.Exists('whitelist', channel.getName(), 'link') && message.contains($.inidb.GetString('whitelist', channel.getName(), 'link').toLowerCase())) {
            permitted = true;
        }

        if ($.inidb.GetBoolean("settings", channel.getName(), "youtubeallowed") && (message.contains("youtube.com") || message.contains("youtu.be"))) {
            permitted = true;
        }

        if (permitted == false) {
            $.logEvent("chatModerator.js", 1154, channel, "Automatic link punishment triggered by " + username + ". Link: " + $.getLastLink(channel) + "      Message: " + omessage);

            purgeUser(sender, channel);
            $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "linksmessage") + i + $.lang.get("net.phantombot.chatmoderator.purged", channel), channel);
        }
    } else if (!$.inidb.GetBoolean("settings", channel.getName(), "capsallowed") && !$.isMod(sender, event.getTags(), channel)
            && (!$.isSub(sender, event.getTags(), channel) || !$.inidb.GetBoolean("settings", channel.getName(), "subsallowed"))
            && (!$.isReg(sender, channel) || !$.inidb.GetBoolean("settings", channel.getName(), "regsallowed"))
            && capsRatio > $.inidb.GetFloat("settings", channel.getName(), "capstriggerratio")
            && msglen > $.inidb.GetInteger("settings", channel.getName(), "capstriggerlength")) {
        purgeUser(sender, channel);
        $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "capsmessage") + $.lang.get("net.phantombot.chatmoderator.purged", channel), channel);
        $.logEvent("chatModerator.js", 1163, channel, "Automatic caps punishment triggered by " + username + ". Message Length: " + $.strlen(message) + "    Caps Ratio: " + capsRatio + "    Message: " + omessage);
    } else if (!$.inidb.GetBoolean("settings", channel.getName(), "symbolsallowed") && !$.isMod(sender, event.getTags(), channel)
            && (!$.isSub(sender, event.getTags(), channel) || !$.inidb.GetBoolean("settings", channel.getName(), "subsallowed"))
            && (!$.isReg(sender, channel) || !$.inidb.GetBoolean("settings", channel.getName(), "regsallowed"))
            && (numsymbols > $.inidb.GetInteger("settings", channel.getName(), "symbolslimit")
                    || rptsymbols > $.inidb.GetInteger("settings", channel.getName(), "symbolsrepeatlimit"))) {
        purgeUser(sender, channel);
        $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "symbolsmessage") + $.lang.get("net.phantombot.chatmoderator.purged", channel), channel);
        $.logEvent("chatModerator.js", 1193, channel, "Automatic symbols punishment triggered by " + username + ". Longest symbol sequence: " + rptsymbols + ". Total symbols: " + numsymbols + ". Message: " + omessage);
    } else if (!$.inidb.GetBoolean("settings", channel.getName(), "repeatallowed") && !$.isMod(sender, event.getTags(), channel)
            && (!$.isSub(sender, event.getTags(), channel) || !$.inidb.GetBoolean("settings", channel.getName(), "subsallowed"))
            && (!$.isReg(sender, channel) || !$.inidb.GetBoolean("settings", channel.getName(), "regsallowed"))
            && (numrepeat > $.inidb.GetInteger("settings", channel.getName(), "repeatlimit")
                    || rptrepeat > $.inidb.GetInteger("settings", channel.getName(), "repeatlimit")) && rptrepeat > 6) {
        purgeUser(sender, channel);
        $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "repeatmessage") + $.lang.get("net.phantombot.chatmoderator.purged", channel), channel);
        $.logEvent("chatModerator.js", 1199, channel, "Automatic repeat punishment triggered by " + username + ". Longest repeat sequence: " + rptrepeat + ". Total repeat sequences: " + numrepeat + ". Message: " + omessage);
    } else if (!$.inidb.GetBoolean("settings", channel.getName(), "graphemeallowed") && !$.isMod(sender, event.getTags(), channel)
            && (!$.isSub(sender, event.getTags(), channel) || !$.inidb.GetBoolean("settings", channel.getName(), "subsallowed"))
            && (!$.isReg(sender, channel) || !$.inidb.GetBoolean("settings", channel.getName(), "regsallowed"))
            && grapheme > $.inidb.GetInteger("settings", channel.getName(), "graphemelimit")) {
        purgeUser(sender, channel);
        $.say(username + " -> " + $.inidb.GetString("settings", channel.getName(), "graphememessage") + $.lang.get("net.phantombot.chatmoderator.purged", channel), channel);
        $.logEvent("chatModerator.js", 1205, channel, "Automatic grapheme punishment triggered by " + username + ". Longest grapheme sequence: " + grapheme + ". Message: " + omessage);
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
    var channels = $.phantombot.getChannels();

    for (var c = 0; c < channels.size(); c++) {
        var channel = channels.get(c);
        var keys = $.tempdb.GetKeyList("t_permit", channel.getName());
        
        for (var i = 0; i < keys.length; i++) {
            if ($.tempdb.GetInteger("t_permit", channel.getName(), keys[i]) < System.currentTimeMillis()) {
                $.tempdb.RemoveKey("t_permit", channel.getName(), keys[i]);
            }
        }
    }
}, 1000);
