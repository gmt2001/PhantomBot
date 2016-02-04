$.greetMaxChars = parseInt($.inidb.get("settings", "greeting_max_chars"));
$.greetGlobal = $.inidb.get("greeting", "_default");
$.greetToggleGlobal = $.inidb.get("greeting", "autogreet");

if ($.greetMaxChars == undefined || $.greetMaxChars == null || isNaN($.greetMaxChars) || $.greetMaxChars < 0) {
    $.greetMaxChars = 80;
}

if ($.greetGlobal == undefined || $.greetGlobal == null) {
    $.greetGlobal = "(name) has entered the channel!";
}

if ($.greetToggleGlobal == undefined || $.greetToggleGlobal == null) {
    $.greetToggleGlobal = "true";
}

$.on("command", function (event) {
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

    if (command.equalsIgnoreCase("greet") || command.equalsIgnoreCase("greeting")) {
        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("toggle")) {
                if (args.length > 1) {
                    if ($.isModv3(sender, event.getTags()) && (args[1].equalsIgnoreCase("default") || args[1].equalsIgnoreCase("global"))) {
                        if ($.greetToggleGlobal == "false") {
                            $.inidb.set("greeting", "autogreet", "true");
                            $.greetToggleGlobal = $.inidb.get("greeting", "autogreet");

                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.toggle-enabled-global"));
                        } else {
                            $.inidb.set("greeting", "autogreet", "false");
                            $.greetToggleGlobal = $.inidb.get("greeting", "autogreet");

                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.toggle-disabled-global"));
                        }
                    } else if ($.isModv3(sender, event.getTags()) && (!args[1].isEmpty())) {
                        if (args[1].equalsIgnoreCase("user") && args[2] != undefined) {
                            var greetuser = args[2].toLowerCase();
                        } else {
                            var greetuser = args[1].toLowerCase();
                        }

                        if ($.inidb.get("visited", greetuser) == "visited") {
                            var greetToggle = $.inidb.get("greeting", greetuser + "_enabled");

                            if (greetToggle == "false" || greetToggle == undefined || greetToggle == null) {
                                $.inidb.set("greeting", greetuser + "_enabled", "true");
                                greetToggle = $.inidb.get("greeting", greetuser + "_enabled");

                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.toggle-enabled-other", $.username.resolve(greetuser)));
                            } else {
                                $.inidb.set("greeting", greetuser + "_enabled", "false");
                                greetToggle = $.inidb.get("greeting", greetuser + "_enabled");

                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.toggle-disabled-other", $.username.resolve(greetuser)));
                            }
                        } else {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(greetuser)));
                        }
                    }
                } else {
                    var greetToggle = $.inidb.get("greeting", sender + "_enabled");

                    if (greetToggle == "false" || greetToggle == undefined || greetToggle == null) {
                        $.inidb.set("greeting", sender + "_enabled", "true");
                        greetToggle = $.inidb.get("greeting", sender + "_enabled");

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.toggle-enabled"));
                    } else {
                        $.inidb.set("greeting", sender + "_enabled", "false");
                        greetToggle = $.inidb.get("greeting", sender + "_enabled");

                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.toggle-disabled"));
                    }
                }
            } else if (action.equalsIgnoreCase("set")) {
                if (args.length > 1) {
                    if ($.isModv3(sender, event.getTags()) && (args[1].equalsIgnoreCase("default") || args[1].equalsIgnoreCase("global"))) {
                        var message = argsString.substring(argsString.indexOf(args[1]) + $.strlen(args[1]) + 1);

                        if ($.strlen(message) == 0) {
                            $.inidb.set("greeting", "_default", $.greetGlobalDefault);
                            $.greetGlobal = $.inidb.get("greeting", "_default");

                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-cleared-global"));
                        } else if ($.strlen(message) > $.greetMaxChars) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-error-toolong-global", $.greetMaxChars, $.strlen(message)));
                        } else {
                            if (message.indexOf("(name)") != -1) {
                                $.inidb.set("greeting", "_default", message.trim());
                                $.greetGlobal = $.inidb.get("greeting", "_default");

                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-success-global", $.greetGlobal));
                            } else {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-error-noname-global"));
                            }
                        }
                    } else if ($.isModv3(sender, event.getTags()) && (args[1].equalsIgnoreCase("user") && args[2] != undefined)) {
                        var greetuser = args[2].toLowerCase();

                        if ($.inidb.get("visited", greetuser) == "visited") {
                            var greet = $.inidb.get("greeting", greetuser);
                            var message = argsString.substring(argsString.indexOf(args[2]) + $.strlen(args[2]) + 1);

                            if ($.strlen(message) == 0) {
                                $.inidb.set("greeting", greetuser, "");
                                greet = $.inidb.get("greeting", greetuser);

                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-cleared-other", $.username.resolve(greetuser)));
                            } else if ($.strlen(message) > $.greetMaxChars) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-error-toolong-other", $.username.resolve(greetuser), $.greetMaxChars, $.strlen(message)));
                            } else {
                                if (message.indexOf("(name)") != -1) {
                                    $.inidb.set("greeting", greetuser, message.trim());
                                    greet = $.inidb.get("greeting", greetuser);

                                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-success-other", $.username.resolve(greetuser), greet.replace("(name)", $.username.resolve(greetuser))));
                                } else {
                                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-error-noname-other", $.username.resolve(greetuser)));
                                }
                            }
                        } else {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.user-404", $.username.resolve(greetuser)));
                        }
                    } else {
                        var greet = $.inidb.get("greeting", sender);
                        var message = argsString.substring(argsString.indexOf(action) + $.strlen(action) + 1);

                        if ($.strlen(message) == 0) {
                            $.inidb.set("greeting", sender, "");
                            greet = $.inidb.get("greeting", sender);

                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-cleared"));
                        } else if ($.strlen(message) > $.greetMaxChars) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-error-toolong", $.greetMaxChars, $.strlen(message)));
                        } else {
                            if (message.indexOf("(name)") != -1) {
                                $.inidb.set("greeting", sender, message.trim());
                                greet = $.inidb.get("greeting", sender);

                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-success", greet.replace("(name)", username)));
                            } else {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.set-error-noname"));
                            }
                        }
                    }
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.usage"));
                }
            } else if (action.equalsIgnoreCase("max") || action.equalsIgnoreCase("setmax") || action.equalsIgnoreCase("maxchars")) {
                if (!$.isAdmin(sender)) {
                    $.say($.getWhisperString(sender) + $.adminmsg);
                    return;
                }

                if (args[1] == null || isNaN(parseInt(args[1]))) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.maxchars-usage"));
                    return;
                }

                if (args[1] < 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.maxchars-error-negative"));
                    return;
                } else {
                    $.inidb.set("settings", "greeting_max_chars", args[1]);
                    $.greetMaxChars = parseInt($.inidb.get("settings", "greeting_max_chars"));

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.maxchars-success", $.greetMaxChars));
                    return;
                }
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.greetingsystem.usage"));
            }
        } else {
            var greet = $.inidb.get("greeting", sender);

            if (greet == null || greet == undefined || greet == "") {
                $.say($.getWhisperString(sender) + $.greetGlobal.replace("(name)", username));
            } else {
                $.say($.getWhisperString(sender) + greet.replace("(name)", username));
            }
        }
    }
});

$.on('ircChannelJoin', function (event) {
    var sender = event.getUser().toLowerCase();
    var username = $.username.resolve(sender);

    $.inidb.set("visited", sender, "visited");

    if ($.inidb.get("greeting", sender + "_enabled") == "true") {
        var greet = $.inidb.get("greeting", sender);

        if (greet == null || greet == undefined || greet == "") {
            $.say($.greetGlobal.replace("(name)", username));
        } else {
            $.say(greet.replace("(name)", username));
        }
    } else if ($.inidb.get("greeting", "autogreet") == "true") {
        $.say($.greetGlobal.replace("(name)", username));
    }
});

setTimeout(function () {
    if ($.moduleEnabled('./systems/greetingSystem.js')) {
        $.registerChatCommand("./systems/greetingSystem.js", "greet");
        $.registerChatCommand("./systems/greetingSystem.js", "greet toggle");
        $.registerChatCommand("./systems/greetingSystem.js", "greet toggle default");
        $.registerChatCommand("./systems/greetingSystem.js", "greet toggle user");
        $.registerChatCommand("./systems/greetingSystem.js", "greet set");
        $.registerChatCommand("./systems/greetingSystem.js", "greet set default");
        $.registerChatCommand("./systems/greetingSystem.js", "greet set user");
    }
}, 10 * 1000);