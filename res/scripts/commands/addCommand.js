$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var num2 = $.users.length;    
    var rnd = $.rand(num2);
    var randomPerson = $.users[rnd][0];
    var randomNum = $.randRange(1, 100);
    var commandString;
    var message;

    if(args.length >= 2 && !command.equalsIgnoreCase("pricecom")) {
        if(command.equalsIgnoreCase("addcom") ) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }

            commandString = args[0].toLowerCase();
            message = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
			
            if (commandString.substring(0, 1) == '!') { 
                commandString = commandString.substring(1);
            }
            
            if ($.commandExists(commandString)) {
                $.say("That command already exists, " + username + "!");
                return;
            }
            
            $.logEvent("addCommand.js", 50, username + " added the command !" + commandString + " with message: " + message);
            
            $.inidb.set('command', commandString, message);
            
            $.registerCustomChatCommand("./commands/addCommand.js", commandString);
            
			if (sender == $.botname) {
				println("You have successfully created the command: !" + commandString + "");
				return;
			}
            $.say(username + ", has successfully created the command: !" + commandString + "");
            return;
			
			
        }

    }
    
    if (command.equalsIgnoreCase("delalias")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        if (args.length < 1) {
            $.say("Usage: !delalias <alias name>");
        } else {
            if (args[0].substring(0, 1) == '!') { 
                args[0] = args[0].substring(1);
            }
            
            if (!$.inidb.exists('aliases', args[0].toLowerCase())) {
                $.say("That alias does not exist!");
                return;
            }
            
            $.logEvent("addCommand.js", 56, username + " deleted the alias !" + args[0].toLowerCase());
            
            $.inidb.del('aliases', args[0].toLowerCase());
            
            $.unregisterCustomChatCommand("./commands/addCommand.js", args[0].toLowerCase());
            
            $.say(username + ", the alias !" + args[0].toLowerCase() + " was successfully deleted!");
            return;
        }
    }
    
    if (command.equalsIgnoreCase("aliascom")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        if (args.length < 2) {
            $.say("Usage: !aliascom <existing command> <alias name>");
        } else {
            commandString = args[0].toLowerCase();
            message = args[1].toLowerCase();
            
            if (commandString.substring(0, 1) == '!') { 
                commandString = commandString.substring(1);
            }
            
            if (message.substring(0, 1) == '!') { 
                message = message.substring(1);
            }
            
            if (!$.commandExists(commandString)) {
                $.say("The target command does not exist!");
                return;
            }
            
            if ($.commandExists(message) && !$.inidb.exists('aliases', message)) {
                $.say("You can only overwrite an alias!");
                return;
            }
            
            $.logEvent("addCommand.js", 59, username + " aliased the command !" + commandString + " to !" + message);
            
            $.inidb.set('aliases', message, commandString);
            
            $.registerCustomChatCommand("./commands/addCommand.js", message);
            
            $.setCustomChatCommandGroup(message, $.getCommandGroup(commandString));
            
            $.say(username + ", the command !" + commandString + " was successfully aliased to !" + message);
            return;
        }
    }
    
    if(command.equalsIgnoreCase("delcom")) {
        if(args.length >= 1) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }
            
            $.logEvent("addCommand.js", 69, username + " deleted the command !" + commandString);
            
            commandString = args[0].toLowerCase();
            
            if (commandString.substring(0, 1) == '!') { 
                commandString = commandString.substring(1);
            }
            
            var acommands = $.inidb.GetKeyList("aliases", "");

            for (var i = 0; i < acommands.length; i++) {
                if ($.inidb.get("aliases", acommands[i]).equalsIgnoreCase(commandString)) {
                    $.unregisterCustomChatCommand(acommands[i]);
                    $.inidb.del("aliases", acommands[i]);
                }
            }
            
            $.inidb.del('command', commandString);
            $.inidb.del('commandperm', commandString);
            $.inidb.del('commandcount', commandString);
            
            $.unregisterCustomChatCommand(commandString);
			if (sender == $.botname) {
				println("You have successfully removed the command: !" + commandString + "");
				return;
			}
            $.say($.username.resolve(sender) + ", has successfully removed the command !" + commandString + "");
            return;
        }
        $.say("Usage: !delcom <command>");
        return;
    }
	
    if (command.equalsIgnoreCase("editcom")) {
        if(args.length >= 1) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }
			
            commandString = args[0].toLowerCase();
            message = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);

            if (commandString.substring(0, 1) == '!') { 
                commandString = commandString.substring(1);
            }

            if ($.inidb.get('command', commandString) == null) {
                $.say("There is no such command, " + sender + "!");
                return;
            }

            if (message.isEmpty()) {
                $.say("Usage: !editcom <command> <message>");
                return;
            }
	
        
            $.inidb.set('command', commandString, message);
			if (sender == $.botname) {
				println("You have modified the command: !" + commandString + "");
				return;
			}
            $.say(username + " has modified the command: !" + commandString + "");
            return;
        }
        $.say("Usage: !editcom <command> <message>");
        return;
    }
	
    
    if (command.equalsIgnoreCase("permcom")) {
        if (!isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if (args.length == 0) {
            $.say("Usage: !permcom <command name> [user, caster, mod, admin]. Restricts usage of a custom command to viewers with a certain permission level");
            return;
        }
        
        if (args.length == 1) {
            if (!$.inidb.exists("command", args[0].toLowerCase())) {
                $.say("The command !" + args[0] + " does not exist!");
                return;
            }
            
            if (!$.inidb.exists("commandperm", args[0].toLowerCase())) {
                $.say("The command !" + args[0] + " can be used by all viewers");
            } else if ($.inidb.get("commandperm", args[0].toLowerCase()).equalsIgnoreCase("caster")) {
                $.say("The command !" + args[0] + " can only be used by Casters");
            } else if ($.inidb.get("commandperm", args[0].toLowerCase()).equalsIgnoreCase("mod")) {
                $.say("The command !" + args[0] + " can only be used by Moderators");
            } else if ($.inidb.get("commandperm", args[0].toLowerCase()).equalsIgnoreCase("admin")) {
                $.say("The command !" + args[0] + " can only be used by Administrators");
            }
        }
        
        if (args.length >= 2) {
            if (!$.inidb.exists("command", args[0].toLowerCase())) {
                $.say("The command !" + args[0] + " does not exist!");
                return;
            }
            
            var newgroup = "";
            
            if (args[1].equalsIgnoreCase("caster") || args[1].equalsIgnoreCase("casters")) {
                $.logEvent("addCommand.js", 142, username + " set the command !" + args[0] + " to casters only");
                newgroup = "caster";
                $.inidb.set("commandperm", args[0].toLowerCase(), "caster");
                $.say("The command !" + args[0] + " can now only be used by Casters");
            } else if (args[1].equalsIgnoreCase("mod") || args[1].equalsIgnoreCase("mods")
                || args[1].equalsIgnoreCase("moderator") || args[1].equalsIgnoreCase("moderators")) {
                $.logEvent("addCommand.js", 148, username + " set the command !" + args[0] + " to mods only");
                newgroup = "mod";
                $.inidb.set("commandperm", args[0].toLowerCase(), "mod");
                $.say("The command !" + args[0] + " can now only be used by Moderators");
            } else if (args[1].equalsIgnoreCase("admin") || args[1].equalsIgnoreCase("admins")
                || args[1].equalsIgnoreCase("administrator") || args[1].equalsIgnoreCase("administrators")) {
                $.logEvent("addCommand.js", 154, username + " set the command !" + args[0] + " to admins only");
                newgroup = "admin";
                $.inidb.set("commandperm", args[0].toLowerCase(), "admin");
                $.say("The command !" + args[0] + " can now only be used by Administrators");
            } else {
                $.logEvent("addCommand.js", 159, username + " set the command !" + args[0] + " to allow all");
                $.inidb.del("commandperm", args[0].toLowerCase());
                $.say("The command !" + args[0] + " can now be used by all viewers");
            }
            
            $.setCustomChatCommandGroup(args[0].toLowerCase(), newgroup);
            
            var acommands = $.inidb.GetKeyList("aliases", "");

            for (var i = 0; i < acommands.length; i++) {
                if ($.inidb.get("aliases", acommands[i]).equalsIgnoreCase(args[0].toLowerCase())) {
                    $.setCustomChatCommandGroup(acommands[i], newgroup);
                }
            }
        }
    }
    
    if (command.equalsIgnoreCase("helpcom")) {
        $.say("Usage: !addcom <command name> <message to say>, !delcom <command name>, !permcom <command name> <group>");
        
        $.say("When using !addcom, you can put the text '(sender)' to have the name of any user who says the new command inserted into it. ex. '!addcom hello Hello there (sender)!'");
        
        $.say("When using !addcom, you can also put '(1)', '(2)', and so on to allow arguments. ex. '!addcom kill (sender) just killed (1) with a (2)!'");
        
        $.say("Additional special tags: '(count)' will add the number of times the command was used (including the current usage)");
    }
    
    if ($.inidb.exists('command', command.toLowerCase())) {
        if ($.inidb.exists("commandperm", command.toLowerCase())) {
            if ($.inidb.get("commandperm", command.toLowerCase()).equalsIgnoreCase("caster") && !isCaster(sender)) {
                return;
            } else if ($.inidb.get("commandperm", command.toLowerCase()).equalsIgnoreCase("mod") && !isMod(sender)) {
                return;
            } else if ($.inidb.get("commandperm", command.toLowerCase()).equalsIgnoreCase("admin") && !isAdmin(sender)) {
                return;
            }
        }

        var messageCommand = $.inidb.get('command', command.toLowerCase());
        
        for (var i = 0; i < args.length; i++) {
            while (messageCommand.contains('(' + (i + 1) + ')')) {
                messageCommand = messageCommand.replace('(' + (i + 1) + ')', $.username.resolve(args[i]));
            }
        }
        
        while (messageCommand.contains('(sender)')) {
            messageCommand = messageCommand.replace('(sender)', $.username.resolve(sender));
        }
        
        if (messageCommand.contains('(count)')) {
            $.inidb.incr('commandcount', command.toLowerCase(), 1);
        }
        
        while (messageCommand.contains('(count)')) {
            messageCommand = messageCommand.replace('(count)', $.inidb.get('commandcount', command.toLowerCase()));
        }
        
        while (messageCommand.contains('(z_stroke)')) {
            messageCommand = messageCommand.replace('(z_stroke)', java.lang.Character.toString(java.lang.Character.toChars(0x01B6)[0]));
        }
        while (messageCommand.indexOf('(random)') != -1) {
            messageCommand = messageCommand.replace('(random)', $.username.resolve(randomPerson));
        }
        while (messageCommand.indexOf('(#)') != -1) {
            messageCommand = messageCommand.replace('(#)', $.username.resolve(randomNum));
        }
        while (messageCommand.indexOf('(points)') != -1) {
            messageCommand = messageCommand.replace('(points)', $.pointname);
        }
        if (messageCommand.contains('(code)')) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for( var i=0; i < 8; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        while (messageCommand.indexOf('(code)') != -1) {
            messageCommand = messageCommand.replace('(code)', text);
        }
   
        $.say(messageCommand);
    }
	
    if (command.equalsIgnoreCase("pricecom")) {
        if (!$.isAdmin(sender) && args.length != 1) {
            $.say($.adminmsg);
            return;
        }
        
        if (args.length == 0) {
            $.say("Usage: !pricecom <command name> <price>. Sets the cost for using a command");
            return;
        }
		
        if (args.length == 1) {
            var commandname = args[0].toLowerCase();
				
            if ($.inidb.exists("pricecom", commandname) && parseInt($.inidb.get("pricecom", commandname)) >= 0) {
                var retrieveprice = $.inidb.get("pricecom", commandname);
		
                $.say("The command !" + commandname + " costs " + retrieveprice + " " + $.pointname + "!");
                return;
            } else {
                $.say("The command !" + commandname + " currently costs 0 " + $.pointname + "!");
            }
        }
	
        if (args.length == 2) {
            var commandname = args[0].toLowerCase();
            var commandprice = parseInt(args[1]);
            
            if (!$.commandExists(commandname)) {
                $.say("Please select a command that exists and is available to non-mods.");
                return;
            } else if (isNaN(commandprice) || commandprice < 0) {
                $.say("Please enter a valid price, 0 or greater.");
                return;
            } else {
                $.inidb.set("pricecom", commandname, commandprice);
                $.say("The price for !" + commandname + " has been set to " + commandprice + " " + $.pointname + ".");
            }
        }		

    }
});

$.registerChatCommand("./commands/addCommand.js", "addcom", "mod");
$.registerChatCommand("./commands/addCommand.js", "editcom", "mod");
$.registerChatCommand("./commands/addCommand.js", "pricecom", "mod");
$.registerChatCommand("./commands/addCommand.js", "aliascom", "mod");
$.registerChatCommand("./commands/addCommand.js", "delalias", "mod");
$.registerChatCommand("./commands/addCommand.js", "delcom", "mod");
$.registerChatCommand("./commands/addCommand.js", "permcom", "admin");
$.registerChatCommand("./commands/addCommand.js", "helpcom", "mod");

var commands = $.inidb.GetKeyList("command", "");

if ($.array.contains(commands, "commands")) {
    $.inidb.del("command", "commands");
    commands = $.inidb.GetKeyList("command", "");
}

for (var i = 0; i < commands.length; i++) {
    $.registerCustomChatCommand("./commands/addCommand.js", commands[i]);
    
    if ($.inidb.exists("commandperm", commands[i])) {
        $.setCustomChatCommandGroup(commands[i], $.inidb.get("commandperm", commands[i]));
    }
}

$.timer.addTimer("./commands/addCommand.js", "registerAliases", false, function() {
    var acommands = $.inidb.GetKeyList("aliases", "");

    for (i = 0; i < acommands.length; i++) {
        $.registerCustomChatCommand("./commands/addCommand.js", acommands[i]);
        $.setCustomChatCommandGroup(acommands[i], $.getCommandGroup($.inidb.get("aliases", acommands[i])));
    }
}, 2 * 1000);