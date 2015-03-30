

if ($.commandList == null || $.commandList == undefined) {
    $.commandList = new Array();
}

if ($.customCommandList == null || $.customCommandList == undefined) {
    $.customCommandList = new Array();
}

$.commandsPerPage = 20;

$.registerChatCommand = function(script, command, group) {
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
                $.logError("commandList.js", 26, "Command already registered (" + command + ", " + $.commandList[i][0] + ", " + scriptFile + ")");
            }
            
            return;
        }
    }
    
    for (i = 0; i < $.customCommandList.length; i++) {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            if (!$.customCommandList[i][0].equalsIgnoreCase(scriptFile)) {
                $.logError("commandList.js", 36, "Command already registered (" + command + ", " + $.customCommandList[i][0] + ", " + scriptFile + ")");
            }
            
            return;
        }
    }
        
    $.commandList.push(new Array(scriptFile, command, group));
}

$.unregisterChatCommand = function(command) {
    for (var i = 0; i < $.commandList.length; i++) {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            commandList.splice(i, 1);
            break;
        }
    }
}

$.registerCustomChatCommand = function(script, command) {
    var scriptFile = script.replace("\\", "/").replace("./scripts/", "");
    var i;
    
    if (command == null || command == undefined) {
        return;
    }
    
    for (i = 0; i < $.commandList.length; i++) {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            if (!$.commandList[i][0].equalsIgnoreCase(scriptFile)) {
                $.logError("commandList.js", 66, "Command already registered (" + command + ", " + $.commandList[i][0] + ", " + scriptFile + ")");
            }
            
            return;
        }
    }
    
    for (i = 0; i < $.customCommandList.length; i++) {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            if (!$.customCommandList[i][0].equalsIgnoreCase(scriptFile)) {
                $.logError("commandList.js", 76, "Command already registered (" + command + ", " + $.customCommandList[i][0] + ", " + scriptFile + ")");
            }
            
            return;
        }
    }
        
    $.customCommandList.push(new Array(scriptFile, command, ""));
}

$.setCustomChatCommandGroup = function(command, group) {
    for (i = 0; i < $.customCommandList.length; i++)
    {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            $.customCommandList[i][2] = group;
            
            return;
        }
    }
}

$.unregisterCustomChatCommand = function(command) {
    for (var i = 0; i < $.customCommandList.length; i++) {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            customCommandList.splice(i, 1);
            break;
        }
    }
}

$.commandExists = function(command) {
    var i;
    
    for (i = 0; i < $.commandList.length; i++)
    {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            return true;
        }
    }
    
    for (i = 0; i < $.customCommandList.length; i++)
    {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            return true;
        }
    }
    
    return false;
}

$.isCustomCommand = function(command) {
    var i;
    
    for (i = 0; i < $.customCommandList.length; i++)
    {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            return true;
        }
    }
    
    return false;
}

$.getCommandGroup = function(command) {
    var i;
    
    for (i = 0; i < $.commandList.length; i++)
    {
        if ($.commandList[i][1].equalsIgnoreCase(command)) {
            return $.commandList[i][2];
        }
    }
    
    for (i = 0; i < $.customCommandList.length; i++)
    {
        if ($.customCommandList[i][1].equalsIgnoreCase(command)) {
            return $.customCommandList[i][2];
        }
    }
    
    return "";
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("commands")) {
        var cmdList = "";
        var length = 0;
        var start = 0;
        var num = length;
        var page = "";
        var numPages = 1;
        var more = ""
        var commandsPerPage = $.commandsPerPage;
        var i;
        
        for (i = 0; i < $.commandList.length + $.customCommandList.length; i++) {
            if (i < $.commandList.length) {
                if ($.moduleEnabled($.commandList[i][0]) && (($.commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender))
                    || ($.commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender))
                    || ($.commandList[i][2].equalsIgnoreCase("caster") && $.isCaster(sender)) || $.commandList[i][2].equalsIgnoreCase(""))) {
                    length++;
                }
            } else {
                if ($.moduleEnabled($.customCommandList[i - $.commandList.length][0])
                    && (($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("admin") && $.isAdmin(sender))
                        || ($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("mod") && $.isMod(sender))
                        || ($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("caster") && $.isCaster(sender))
                        || $.customCommandList[i - $.commandList.length][2].equalsIgnoreCase(""))) {
                    length++;
                }
            }
        }
        
        if (commandsPerPage == null) {
            commandsPerPage = 20;
        }
        
        if (length > commandsPerPage) {
            numPages = Math.ceil(length / commandsPerPage);
            
            if (args.length > 0 && !isNaN(parseInt(args[0]))) {
                start = commandsPerPage * (parseInt(args[0]) - 1);
                
                page = " page " + args[0] + " of " + numPages + " ";
            } else {
                page = " page 1 of " + numPages + " ";
            }
            
            num = Math.min(commandsPerPage, length - start);
            
            more = " >> Type '!commands < #>' for more"
        } else {
            num = length;
        }
        
        if (parseInt(args[0]) > numPages) {
            return;
        }
        
        for (i = 0; i < $.commandList.length + $.customCommandList.length; i++) {
            if (i > start) {
                break;
            }
            
            if (i < $.commandList.length) {
                if (!$.moduleEnabled($.commandList[i][0]) || !(($.commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender))
                    || ($.commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender))
                    || ($.commandList[i][2].equalsIgnoreCase("caster") && $.isCaster(sender)) || $.commandList[i][2].equalsIgnoreCase(""))) {
                    start++;
                }
            } else {
                if (!$.moduleEnabled($.customCommandList[i - $.commandList.length][0])
                    || !(($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("admin") && $.isAdmin(sender))
                        || ($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("mod") && $.isMod(sender))
                        || ($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("caster") && $.isCaster(sender))
                        || $.customCommandList[i - $.commandList.length][2].equalsIgnoreCase(""))) {
                    start++;
                }
            }
        }
        
        for (i = start; num > 0; i++) {
            if (i < $.commandList.length) {
                if (!$.moduleEnabled($.commandList[i][0]) || !(($.commandList[i][2].equalsIgnoreCase("admin") && $.isAdmin(sender))
                    || ($.commandList[i][2].equalsIgnoreCase("mod") && $.isMod(sender))
                    || ($.commandList[i][2].equalsIgnoreCase("caster") && $.isCaster(sender)) || $.commandList[i][2].equalsIgnoreCase(""))) {
                    continue;
                }
            } else {
                if (!$.moduleEnabled($.customCommandList[i - $.commandList.length][0])
                    || !(($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("admin") && $.isAdmin(sender))
                        || ($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("mod") && $.isMod(sender))
                        || ($.customCommandList[i - $.commandList.length][2].equalsIgnoreCase("caster") && $.isCaster(sender))
                        || $.customCommandList[i - $.commandList.length][2].equalsIgnoreCase(""))) {
                    continue;
                }
            }
            
            if (cmdList.length > 0) {
                cmdList = cmdList + " - ";
            }
            
            if (i < $.commandList.length) {
                cmdList = cmdList + "!" + $.commandList[i][1];
            } else {
                cmdList = cmdList + "!" + $.customCommandList[i - $.commandList.length][1];
            }
            
            num--;
        }
        
        if (length == 0) {
            $.say("There are currently no commands available to you");
        } else {
            $.say("Commands" + page + ": " + cmdList + more);
        }
    }
    
    if (command.equalsIgnoreCase("commandsperpage")) {
        if (args.length > 0 && !isNaN(parseInt(args[0])) && parseInt(args[0]) >= 10 && $.isAdmin(sender)) {
            $.logEvent("commandList.js", 259, username + " changed the commands per page to " + args[0]);
            
            $.commandsPerPage = parseInt(args[0]);
            $.inidb.set("commands", "_commandsPerPage", args[0]);
            
            $.say("There will now be " + args[0] + " commands per page when using !commands");
        } else if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
        } else {
            $.say("Usage: !commandsperpage <number no less than 10>");
        }
    }
});

$.registerChatCommand("./util/commandList.js", "commandsperpage", "admin");

var commandsPerPage = $.inidb.get("command", "_commandsPerPage");

if (commandsPerPage != null && !isNaN(parseInt(commandsPerPage)) && parseInt(commandsPerPage) >= 10) {
    $.commandsPerPage = commandsPerPage;
}