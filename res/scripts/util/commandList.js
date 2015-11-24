
if ($.commandList == null || $.commandList == undefined) {
    $.commandList = new Array();
}

$.commandsPerPage = 20;

$.registerChatCommand = function (script, command, group) {
    var scriptFile = script.replace("\\", "/").replace("./scripts/", "");
    var i;

    if (group == null || group == undefined) {
        group = "";
    }

    if (command == null || command == undefined) {
        return;
    }

    for (i = 0; i < $.commandList.length; i++) {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            if (!$.commandList[i][0].equalsIgnoreCase(scriptFile)) {
                $.logError("commandList.js", 26, null, "Command already registered (" + command + ", " + $.commandList[i][0] + ", " + scriptFile + ")");
            }

            return;
        }
    }

    $.commandList.push(new Array(scriptFile, command, group));
}

$.unregisterChatCommand = function (command) {
    for (var i = 0; i < $.commandList.length; i++) {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            commandList.splice(i, 1);
            break;
        }
    }
}

$.registerCustomChatCommand = function (script, channel, command) {
    var scriptFile = script.replace("\\", "/").replace("./scripts/", "");
    var i;

    if (command == null || command == undefined) {
        return;
    }

    for (i = 0; i < $.commandList.length; i++) {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            if (!$.commandList[i][0].equalsIgnoreCase(scriptFile)) {
                $.logError("commandList.js", 66, channel, "Command already registered (" + command + ", " + $.commandList[i][0] + ", " + scriptFile + ")");
            }

            return;
        }
    }

    if ($.tempdb.Exists("t_customcommandlist", channel.getName(), command)
            && !$.tempdb.GetString("t_customcommandlist_script", channel.getName(), command).equalsIgnoreCase(scriptFile)) {
        $.logError("commandList.js", 76, "Command already registered (" + command + ", " + $.customCommandList[i][0] + ", " + scriptFile + ")");
        return;
    }

    $.tempdb.SetString("t_customcommandlist_script", channel.getName(), command, scriptFile);
    $.tempdb.SetString("t_customcommandlist", channel.getName(), command, "");
}

$.setCustomChatCommandGroup = function (command, channel, group) {
    if ($.tempdb.Exists("t_customcommandlist", channel.getName(), command)) {
        $.tempdb.SetString("t_customcommandlist", channel.getName(), command, group);
    }
}

$.unregisterCustomChatCommand = function (command, channel) {
    $.tempdb.RemoveKey("t_customcommandlist_script", channel.getName(), command);
    $.tempdb.RemoveKey("t_customcommandlist", channel.getName(), command);
}

$.commandExists = function (command, channel) {
    var i;

    for (i = 0; i < $.commandList.length; i++)
    {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            return true;
        }
    }

    if (channel == null) {
        return false;
    }

    return $.tempdb.Exists("t_customcommandlist", channel.getName(), command);
}

$.isCustomCommand = function (command, channel) {
    return $.tempdb.Exists("t_customcommandlist", channel.getName(), command);
}

$.getCommandGroup = function (command, channel) {
    var i;

    for (i = 0; i < $.commandList.length; i++)
    {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            return $.commandList[i][2];
        }
    }

    if (channel == null) {
        return "";
    }

    return $.tempdb.GetString("t_customcommandlist", channel.getName(), command);
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var args = event.getArgs();
    var channel = event.getChannel();

    if (command.equalsIgnoreCase("botcommands")) { // !botcommands for bot commands and !commands for custom commands.
        var cmdList = "";
        var length = 0;
        var start = 0;
        var num = length;
        var page = "";
        var numPages = 1;
        var more = ""
        var commandsPerPage = $.inidb.GetInteger("commands", channel.getName(), "_commandsPerPage");
        var i;

        if (commandsPerPage < 10) {
            commandsPerPage = 20;
        }

        for (i = 0; i < $.commandList.length; i++) {
            if ($.moduleEnabled($.commandList[i][0], channel) && (($.commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender, channel))
                    || ($.commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender, event.getTags(), channel))
                    || ($.commandList[i][2].equalsIgnoreCase("caster") && $.isCaster(sender, channel)) || $.commandList[i][2].equalsIgnoreCase(""))) {
                length++;
            }
        }

        if (length > commandsPerPage) {
            numPages = Math.ceil(length / commandsPerPage);
            num = 1
            var i;

            if (args.length > 0 && !isNaN(parseInt(args[0]))) {
                start = commandsPerPage * (parseInt(args[0]) - 1);

                page = $.lang.get("net.phantombot.commandlist.page", channel, args[0], numPages);
            } else {
                page = $.lang.get("net.phantombot.commandlist.page", channel, 1, numPages);
            }

            num = Math.min(commandsPerPage, length - start);
            more = $.lang.get("net.phantombot.commandlist.more", channel);
        } else {
            num = length;
        }

        if (parseInt(args[0]) > numPages) {
            return;
        }

        for (i = 0; i < $.commandList.length; i++) {
            if (i > start) {
                break;
            }

            if (!$.moduleEnabled($.commandList[i][0], channel) || !(($.commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender, channel))
                    || ($.commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender, event.getTags(), channel))
                    || ($.commandList[i][2].equalsIgnoreCase("caster") && $.isAdmin(sender, channel)) || $.commandList[i][2].equalsIgnoreCase(""))) {
                start++;
            }
        }

        for (i = start; num > 0; i++) {
            if (!$.moduleEnabled($.commandList[i][0], channel) || !(($.commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender, channel))
                    || ($.commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender, event.getTags(), channel))
                    || ($.commandList[i][2].equalsIgnoreCase("caster") && $.isAdmin(sender, channel)) || $.commandList[i][2].equalsIgnoreCase(""))) {
                continue;
            }

            if (cmdList.length > 0) {
                cmdList = cmdList + " - ";
            }

            cmdList = cmdList + "!" + $.commandList[i][1];

            num--;
        }

        if (length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.commandlist.nocommands", channel), channel);
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.commandlist.commands", channel) + page + ": " + cmdList + more, channel);
        }
    }
    
    if (command.equalsIgnoreCase("commands")) { // !botcommands for bot commands and !commands for custom commands.
        var cmdList = "";
        var length = 0;
        var start = 0;
        var num = length;
        var page = "";
        var numPages = 1;
        var more = ""
        var commandsPerPage = $.inidb.GetInteger("commands", channel.getName(), "_commandsPerPage");
        var i;
        var commandList = new Array();

        if (commandsPerPage < 10) {
            commandsPerPage = 20;
        }
        
        var keys = $.tempdb.GetKeyList("t_customcommandlist", channel.getName());
        
        for (i = 0; i < keys.length; i++) {
            commandList.push(new Array($.tempdb.GetString("t_customcommandlist_script", channel.getName(), keys[i]), keys[i], $.tempdb.GetString("t_customcommandlist", channel.getName(), keys[i])));
        }

        for (i = 0; i < commandList.length; i++) {
            if ($.moduleEnabled(commandList[i][0], channel) && ((commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender, channel))
                    || (commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender, event.getTags(), channel))
                    || (commandList[i][2].equalsIgnoreCase("caster") && $.isCaster(sender, channel)) || commandList[i][2].equalsIgnoreCase(""))) {
                length++;
            }
        }

        if (length > commandsPerPage) {
            numPages = Math.ceil(length / commandsPerPage);
            num = 1
            var i;

            if (args.length > 0 && !isNaN(parseInt(args[0]))) {
                start = commandsPerPage * (parseInt(args[0]) - 1);

                page = $.lang.get("net.phantombot.commandlist.page", channel, args[0], numPages);
            } else {
                page = $.lang.get("net.phantombot.commandlist.page", channel, 1, numPages);
            }

            num = Math.min(commandsPerPage, length - start);
            more = $.lang.get("net.phantombot.commandlist.more", channel);
        } else {
            num = length;
        }

        if (parseInt(args[0]) > numPages) {
            return;
        }

        for (i = 0; i < commandList.length; i++) {
            if (i > start) {
                break;
            }

            if (!$.moduleEnabled(commandList[i][0], channel) || !((commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender, channel))
                    || (commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender, event.getTags(), channel))
                    || (commandList[i][2].equalsIgnoreCase("caster") && $.isAdmin(sender, channel)) || commandList[i][2].equalsIgnoreCase(""))) {
                start++;
            }
        }

        for (i = start; num > 0; i++) {
            if (!$.moduleEnabled(commandList[i][0], channel) || !((commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender, channel))
                    || (commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender, event.getTags(), channel))
                    || (commandList[i][2].equalsIgnoreCase("caster") && $.isAdmin(sender, channel)) || commandList[i][2].equalsIgnoreCase(""))) {
                continue;
            }

            if (cmdList.length > 0) {
                cmdList = cmdList + " - ";
            }

            cmdList = cmdList + "!" + commandList[i][1];

            num--;
        }

        if (length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.commandlist.nocommands", channel), channel);
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.commandlist.commands", channel) + page + ": " + cmdList + more, channel);
        }
    }

    if (command.equalsIgnoreCase("commandsperpage")) {
        if (args.length > 0 && !isNaN(parseInt(args[0])) && parseInt(args[0]) >= 10 && $.isAdmin(sender, channel)) {
            $.logEvent("commandList.js", 259, channel, username + " changed the commands per page to " + args[0]);

            $.inidb.SetInteger("commands", channel.getName(), "_commandsPerPage", args[0]);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.commandlist.commands-per-page", channel, args[0]), channel);
        } else if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.commandlist.commands-per-page-usage", channel), channel);
        }
    }
});

$.registerChatCommand("./util/commandList.js", "commandsperpage", "admin");
$.registerChatCommand("./util/commandList.js", "botcommands", "mod");
$.registerChatCommand("./util/commandList.js", "commands", "");
