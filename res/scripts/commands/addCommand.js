$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var randomPerson = $.randElement($.users);
    var randomNum = $.randRange(1, 100);
    var points;
    var commandString;
    var message;
    var cmd;

    if(args.length >= 2 && !command.equalsIgnoreCase("pricecom")) {
        if(command.equalsIgnoreCase("addcom") ) {
            if (!$.isMod(sender)) {
                $.say("You must be a Moderator to use that command!");
                return;
            }
            
            commandString = args[0].toLowerCase();
            message = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            
            if ($.commandExists(commandString) && !$.isCustomCommand(commandString)) {
                $.say("You can not overwrite a built in command, " + username + "!");
                return;
            }
            
            $.logEvent("addCommand.js", 50, username + " added the command !" + commandString + " with message: " + message);
            
            $.inidb.set('command', commandString, message);
            
            $.registerCustomChatCommand("./commands/addCommand.js", commandString);
            
            $.say(username + ", the command !" + commandString + " was successfully created!");
            return;
        }

    }
    
    if(command.equalsIgnoreCase("delcom")) {
		if(args.length >= 1) {
            if (!$.isMod(sender)) {
                $.say("You must be a Moderator to use that command!");
                return;
            }
            
            $.logEvent("addCommand.js", 69, username + " deleted the command !" + commandString);
            
            commandString = args[0].toLowerCase();
            $.inidb.del('command', commandString);
            $.inidb.del('commandperm', commandString);
            $.inidb.del('commandcount', commandString);
            
            $.unregisterCustomChatCommand(commandString);
            
            $.say($.username.resolve(sender) + ", the command !" + commandString + " was successfully removed!");
            return;
        }
		$.say("Usage: !delcom <command>");
		return;
    }
	
	if (command.equalsIgnoreCase("editcom")) {
		if(args.length >= 1) {
			if (!$.isMod(sender)) {
				$.say("You must be a Moderator to use that command!");
				return;
			}
			
            commandString = args[0].toLowerCase();
			message = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);


			if ($.inidb.get('command', commandString) == null) {
				$.say("There is no such command, " + sender + "!");
				return;
			}

			if (message.isEmpty()) {
				$.say("Usage: !editcom <command> <message>");
				return;
			}
	
        
			$.inidb.set('command', commandString, message);
			$.say("Command !" + commandString + " has been modified!");
			return;
		}
		$.say("Usage: !editcom <command> <message>");
		return;
	}
	
    
    if (command.equalsIgnoreCase("permcom")) {
        if (!isAdmin(sender)) {
            $.say("You must be an Administrator to use that command!");
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
            
            if (args[1].equalsIgnoreCase("caster") || args[1].equalsIgnoreCase("casters")) {
                $.logEvent("addCommand.js", 142, username + " set the command !" + args[0] + " to casters only");
                $.setCustomChatCommandGroup(args[0].toLowerCase(), "caster");
                $.inidb.set("commandperm", args[0].toLowerCase(), "caster");
                $.say("The command !" + args[0] + " can now only be used by Casters");
            } else if (args[1].equalsIgnoreCase("mod") || args[1].equalsIgnoreCase("mods")
                || args[1].equalsIgnoreCase("moderator") || args[1].equalsIgnoreCase("moderators")) {
                $.logEvent("addCommand.js", 148, username + " set the command !" + args[0] + " to mods only");
                $.setCustomChatCommandGroup(args[0].toLowerCase(), "mod");
                $.inidb.set("commandperm", args[0].toLowerCase(), "mod");
                $.say("The command !" + args[0] + " can now only be used by Moderators");
            } else if (args[1].equalsIgnoreCase("admin") || args[1].equalsIgnoreCase("admins")
                || args[1].equalsIgnoreCase("administrator") || args[1].equalsIgnoreCase("administrators")) {
                $.logEvent("addCommand.js", 154, username + " set the command !" + args[0] + " to admins only");
                $.setCustomChatCommandGroup(args[0].toLowerCase(), "admin");
                $.inidb.set("commandperm", args[0].toLowerCase(), "admin");
                $.say("The command !" + args[0] + " can now only be used by Administrators");
            } else {
                $.logEvent("addCommand.js", 159, username + " set the command !" + args[0] + " to allow all");
                $.setCustomChatCommandGroup(args[0].toLowerCase(), "");
                $.inidb.del("commandperm", args[0].toLowerCase());
                $.say("The command !" + args[0] + " can now be used by all viewers");
            }
        }
    }
    
    if (command.equalsIgnoreCase("helpcom")) {
        $.say("Usage: !addcom <command name> <message to say>, !delcom <command name>, !modcom, !permcom <command name> [user, caster, mod, admin]");
        
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
		
		if ($.inidb.exists("pricecom", command.toLowerCase())) {
			if ( parseInt($.inidb.get("points", sender)) < parseInt($.inidb.get("pricecom", command.toLowerCase()))) {
				$.say("That command costs " + $.inidb.get("pricecom", command.toLowerCase()) + " " + $.pointname + ", which you don't have.");
				return;
			} else {
				$.inidb.decr("points", sender, parseInt($.inidb.get("pricecom", command.toLowerCase())));
			}
		}	
	



        var messageCommand = $.inidb.get('command', command.toLowerCase());
        
        for (var i = 0; i < args.length; i++) {
            while (messageCommand.contains('(' + (i + 1) + ')')) {
                messageCommand = messageCommand.replace('(' + (i + 1) + ')', args[i]);
            }
        }
        
        while (messageCommand.contains('(sender)')) {
            messageCommand = messageCommand.replace('(sender)', sender);
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
            messageCommand = messageCommand.replace('(random)', $.username.resolve(randomPerson[0]));
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
		if (!isAdmin(sender)) {
				$.say("You must be an Administrator to use that command!");
				return;
			}
        
        if (args.length == 0) {
            $.say("Usage: !pricecom <command name> <price>. Set's a cost for use the custom command");
            return;
        }
		
		if (args.length == 1) {
			
			var commandname = args[0].toLowerCase();
			
            if (!$.inidb.exists("command", commandname)) {
                $.say("The command !" + commandname + " does not exist!");
                return;
			} 
			
			if ($.inidb.exists("pricecom", commandname) && ($.inidb.get("pricecom", commandname) >= 0)) {
				
					var retrieveprice = $.inidb.get("pricecom", commandname);
					
					$.say("The command !" + commandname + " costs " + retrieveprice + " " + $.pointname + ".");
					return;
			} else {
					$.say("The command !" + commandname + " currently costs 0!");
			}
		}
		
		if (args.length == 2) {
				var commandname = args[0].toLowerCase();
				var commandprice = parseInt(args[1]);
				if (commandprice < 0) {
					$.say(commandprice + " is less than 0. Price must be more than 0.")
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