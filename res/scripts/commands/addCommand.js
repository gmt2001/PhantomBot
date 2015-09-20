$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
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
            if (!$.isModv3(sender, event.getTags())) {
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
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        
        if (args.length < 1) {
            $.say("Usage: !delalias (alias name)");
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
    if (command.equalsIgnoreCase("commands")) {

        var customcommands = "";
        var keys = $.inidb.GetKeyList("command", "");

        for (var i = 0 ; i < keys.length; i++) {
            customcommands +="!";
            customcommands +=keys[i];
            customcommands += " ";
            
        }
        
        if(customcommands.substr(customcommands.length - 1)==" ") {
            customcommands = customcommands.substring(0, customcommands.length - 1);
        }
        
        $.say("Current custom commands: " + customcommands);
    }
    
    if (command.equalsIgnoreCase("aliascom")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        
        if (args.length < 2) {
            $.say("Usage: !aliascom (existing command) (alias name)");
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
                        
            $.say(username + ", the command !" + commandString + " was successfully aliased to !" + message);
            return;
        }
    }
    
    if(command.equalsIgnoreCase("delcom")) {
        if(args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
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
            $.say($.username.resolve(sender, event.getTags()) + ", has successfully removed the command !" + commandString + "");
            return;
        }
        $.say("Usage: !delcom (command)");
        return;
    }
	
    if (command.equalsIgnoreCase("editcom")) {
        if(args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
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
                $.say("Usage: !editcom (command) (message)");
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
        $.say("Usage: !editcom (command) (message)");
        return;
    }
	
    
    if (command.equalsIgnoreCase("permcom")) {
        if (!isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if (args.length == 0) {
            $.say("Usage: !permcom (command name) (group name) (1/2). Restricts usage of a command to viewers with a certain permission level. 1 specifies only a single group, multiple single groups can be added for the same command. 2 specifies recursive (all groups higher than the group specified).");
            return;
        }
        
        
                
        if (args.length >= 2) {
            if (!$.commandExists(args[0].toLowerCase())) {
                $.say("The command !" + args[0].toString() + " does not exist!");
                return;
            }
            
            var newgroup = args[1].toLowerCase();
            var permcommArray = $.inidb.GetKeyList("permcom", "");
            
            
            var alias = "";
            var sourceCommand = "";
            
            if(!parseInt(args[2])) {
                $.say("You must specify a permission mode of 1 or 2! 1 specifies only a single group, multiple single groups can be added for the same command. 2 specifies recursive (all groups higher than the group specified).");
                return;
            }
            
            if(parseInt(args[2])>1) {
                var mode = "_recursive";
            } else {
                mode = "";
            }
            if(newgroup.equalsIgnoreCase("admin")) {
                newgroup = "administrator";
            }
            if(newgroup.equalsIgnoreCase("mod")) {
                newgroup = "moderator";
            }
            if(newgroup.equalsIgnoreCase("sub")) {
                newgroup = "subscriber";
            }
            if(newgroup.equalsIgnoreCase("delete")) {
                for (var i = 0; i < permcommArray.length; i++) {
                    if (permcommArray[i].equalsIgnoreCase(args[0] + mode)) {
                        $.inidb.del("permcom", permcommArray[i]);
                    }
                }

                if ($.inidb.exists('aliases', args[0].toLowerCase())) {
                    alias = $.inidb.get('aliases', args[0].toLowerCase());
                    $.inidb.del("permcom", alias + mode);
                }

                
                if(mode=="_recursive") {
                    $.say("All recursive permissions for the command: " + args[0] + " and any of its aliases have been removed.");
                } else {
                    $.say("All permissions for the command: " + args[0] + " and any of its aliases have been removed.");
                }
                return;
            }
            
            if ($.inidb.exists('aliases', args[0].toLowerCase())) {
                sourceCommand = $.inidb.get('aliases', args[0].toLowerCase());
            } else {
                sourceCommand = args[0].toLowerCase();
            }
            
            if(mode=="_recursive") {
                $.inidb.set("permcom", sourceCommand + mode, newgroup);
            } else {
                if($.inidb.exists("permcom",sourceCommand)) {
                    var oldgroup = $.inidb.get("permcom", sourceCommand);
                    $.inidb.set("permcom", sourceCommand, oldgroup + "_" + newgroup);
                } else {
                    $.inidb.set("permcom", sourceCommand, newgroup);
                }
            }   
            
            if(mode=="_recursive") {
                $.say('Permissions for command: ' + args[0] + ' set for group: ' + args[1] + ' and higher.');
            } else {
                $.say('Permissions for command: ' + args[0] + ' set for group: ' + args[1]);
            }
        }
    }
    
    if (command.equalsIgnoreCase("helpcom")) {
        $.say("Usage: !addcom (command name) (message to say), !delcom (command name), !permcom (command name) (group)");
        
        $.say("When using !addcom, you can put the text '(sender)' to have the name of any user who says the new command inserted into it. ex. '!addcom hello Hello there (sender)!'");
        
        $.say("When using !addcom, you can also put '(1)', '(2)', and so on to allow arguments. ex. '!addcom kill (sender) just killed (1) with a (2)!'");
        
        $.say("Additional special tags: '(count)' will add the number of times the command was used (including the current usage)");
    }
    
    if ($.inidb.exists('command', command.toLowerCase())) {

        var messageCommand = $.inidb.get('command', command.toLowerCase());
        
        for (var i = 0; i < args.length; i++) {
            while (messageCommand.contains('(' + (i + 1) + ')')) {
                messageCommand = messageCommand.replace('(' + (i + 1) + ')', $.username.resolve(args[i]));
            }
        }
        
        while (messageCommand.contains('(sender)')) {
            messageCommand = messageCommand.replace('(sender)', $.username.resolve(sender, event.getTags()));
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
            $.say("Usage: !pricecom (command name) (price). Sets the cost for using a command");
            return;
        }
		
        if (args.length == 1) {
            var commandname = args[0].toLowerCase();
            
            if ($.inidb.exists("aliases", commandname) && $.inidb.get("aliases", commandname)!=""){
                commandname = $.inidb.get("aliases", commandname);
            }
            
            if ($.inidb.exists("pricecom", commandname) && parseInt($.inidb.get("pricecom", commandname)) > 0) {
                var retrieveprice = $.inidb.get("pricecom", commandname);
		
                $.say("The command !" + args[0].toLowerCase() + " costs " + retrieveprice + " " + $.pointname + "!");
                return;
            } else {
                $.say("The command !" + args[0].toLowerCase() + " currently costs 0 " + $.pointname + "!");
            }
        }
	
        if (args.length == 2) {
            var commandname = args[0].toLowerCase();
            var commandprice = parseInt(args[1]);
            var sourceCommand = "";
            if ($.inidb.exists('aliases', commandname)) {
                sourceCommand = $.inidb.get('aliases', commandname);
            } else {
                sourceCommand = commandname;
            }

            if (!$.commandExists(sourceCommand)) {
                $.say("Please select a command that exists and is available to non-mods.");
                return;
            } else if (isNaN(commandprice) || commandprice < 0) {
                $.say("Please enter a valid price, 0 or greater.");
                return;
            } else {
                $.inidb.set("pricecom", sourceCommand, commandprice);
                $.say("The price for !" + args[0].toLowerCase() + " has been set to " + commandprice + " " + $.pointname + ".");
            }
        }		

    }
});


setTimeout(function(){ 
    if ($.moduleEnabled('./commands/addCommand.js')) {

        $.registerChatCommand("./commands/addCommand.js", "addcom", "mod");
        $.registerChatCommand("./commands/addCommand.js", "editcom", "mod");
        $.registerChatCommand("./commands/addCommand.js", "pricecom", "mod");
        $.registerChatCommand("./commands/addCommand.js", "aliascom", "mod");
        $.registerChatCommand("./commands/addCommand.js", "delalias", "mod");
        $.registerChatCommand("./commands/addCommand.js", "delcom", "mod");
        $.registerChatCommand("./commands/addCommand.js", "permcom", "admin");
        $.registerChatCommand("./commands/addCommand.js", "helpcom", "mod");
        $.registerChatCommand("./commands/addCommand.js", "customcommands");
    }
}, 10* 1000);

var commands = $.inidb.GetKeyList("command", "");

if ($.array.contains(commands, "commands")) {
    $.inidb.del("command", "commands");
    commands = $.inidb.GetKeyList("command", "");
}

for (var i = 0; i < commands.length; i++) {
    $.registerCustomChatCommand("./commands/addCommand.js", commands[i]);
}

$.timer.addTimer("./commands/addCommand.js", "registerAliases", false, function() {
    var acommands = $.inidb.GetKeyList("aliases", "");

    for (i = 0; i < acommands.length; i++) {
        $.registerCustomChatCommand("./commands/addCommand.js", acommands[i]);
    }
}, 2 * 1000);
