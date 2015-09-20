$.getWhisperString = function(sender) {
    var whispermode = $.inidb.get("settings", "whisper_commands");
    // Just put this logic in here. The odds that an entire string is different are slim.
    if (whispermode == "true") {
        return "/w " + sender + " ";
    } else {
        return "";
    }
}

$.getWhisperStringStatic = function(sender) {
    var whispermode = $.inidb.get("settings", "whisper_commands");
        return "/w " + sender + " ";
}

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
    var whispermode = $.inidb.get("settings", "whisper_commands");

    if (whispermode == undefined || whispermode == null) {
        whispermode = "false";
    }

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
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.addcom-error", username));
                return;
            }
            
            $.logEvent("addCommand.js", 50, username + " added the command !" + commandString + " with message: " + message);
            
            $.inidb.set('command', commandString, message);
            
            $.registerCustomChatCommand("./commands/addCommand.js", commandString);
            
            if (sender == $.botname) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.addcom-success", username, commandString));
                return;
            }
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.addcom-success", username, commandString));
            return;
        }
    }
    
    if (command.equalsIgnoreCase("delalias")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        
        if (args.length < 1) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.delalias-error-usage"));
        } else {
            if (args[0].substring(0, 1) == '!') { 
                args[0] = args[0].substring(1);
            }
            
            if (!$.inidb.exists('aliases', args[0].toLowerCase())) {
                $.say($.lang.get("net.phantombot.addcommand.delalias-error-no-command", username));
                return;
            }
            
            $.logEvent("addCommand.js", 56, username + " deleted the alias !" + args[0].toLowerCase());
            
            $.inidb.del('aliases', args[0].toLowerCase());
            
            $.unregisterCustomChatCommand("./commands/addCommand.js", args[0].toLowerCase());
            
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.delalias-success", username, args[0]));
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
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.custom-commands", customcommands));
        return;
    }

    if (command.equalsIgnoreCase("whispercommands")) { // enable / disable whisper wen using command !botcommands and !commands
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        if (whispermode == "false") {
            $.inidb.set("settings", "whisper_commands", "true");
            whispermode = "true";

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.whisper-enabled", "Command List"));
        } else if (whispermode == "true") {
            $.inidb.set("settings", "whisper_commands", "false");
            whispermode = "false";

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.whisper-disabled", "Command List"));
        }
    }
    
    if (command.equalsIgnoreCase("aliascom")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        
        if (args.length < 2) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.aliascom-error-usage"));
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
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.aliascom-error-no-command", username));
                return;
            }
            
            if ($.commandExists(message) && !$.inidb.exists('aliases', message)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.aliascom-failed", username));
                return;
            }
            
            $.logEvent("addCommand.js", 59, username + " aliased the command !" + commandString + " to !" + message);
            
            $.inidb.set('aliases', message, commandString);
            
            $.registerCustomChatCommand("./commands/addCommand.js", message);
                        
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.aliascom-success", username, commandString, message));
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
                println($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.delcom-success", username, commandString));
                return;
            }
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.delcom-success", username, commandString));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.delcom-error-usage"));
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
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.editcom-error", username));
                return;
            }

            if (message.isEmpty()) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.editcom-error-usage"));
                return;
            }
	
        
            $.inidb.set('command', commandString, message);
            if (sender == $.botname) {
                println($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.editcom-success", username, commandString));
                return;
            }
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.editcom-success", username, commandString));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.editcom-error-usage"));
        return;
    }
	
    
    if (command.equalsIgnoreCase("permcom")) {
        if (!isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-error-usage"));
            return;
        }
          
        if (args.length >= 2) {
            if (!$.commandExists(args[0].toLowerCase())) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-error-no-command", args[0]));
                return;
            }
            
            var newgroup = args[1].toLowerCase();
            var permcommArray = $.inidb.GetKeyList("permcom", "");
            
            
            var alias = "";
            var sourceCommand = "";
            
            if(!parseInt(args[2])) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-syntax-error"));
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
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-removed-success", args[0]));
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-removed-success", args[0]));
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
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-success", args[0], args[1]));
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.permcom-success", args[0], args[1]));
            }
        }
    }
    
    if (command.equalsIgnoreCase("helpcom")) {
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.helpcom-error-usage"));
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.helpcom-command-tags"));
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.helpcom-command-tags2"));
        
        setTimeout(function(){$.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.helpcom-command-tags3"));}, 1000); //added timeout because twitch only allows 3whisper per 1 sec.
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
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.pricecom-error-usage"));
            return;
        }
		
        if (args.length == 1) {
            var commandname = args[0].toLowerCase();
            
            if ($.inidb.exists("aliases", commandname) && $.inidb.get("aliases", commandname)!=""){
                commandname = $.inidb.get("aliases", commandname);
            }
            
            if ($.inidb.exists("pricecom", commandname) && parseInt($.inidb.get("pricecom", commandname)) > 0) {
                var retrieveprice = $.inidb.get("pricecom", commandname);
		
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.pricecom-current-set-price", args[0], retrieveprice, $.pointname));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.pricecom-current-set-price2", args[0], $.pointname));
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
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.pricecom-error1"));
                return;
            } else if (isNaN(commandprice) || commandprice < 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.pricecom-error2"));
                return;
            } else {
                $.inidb.set("pricecom", sourceCommand, commandprice);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.addcommand.pricecom-success", args[0], commandprice, $.pointname));
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
        $.registerChatCommand("./commands/addCommand.js", "commands");
        $.registerChatCommand("./commands/addCommand.js", "whispercommands", "admin");
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
