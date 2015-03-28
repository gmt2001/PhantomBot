$.on('ircChannelJoin', function(event) {
    var sender = event.getUser().toLowerCase();
    var username = $.username.resolve(sender);
    var s = $.inidb.get("greeting", sender);
    
    if ($.inidb.get("greeting", sender + "_enabled") == "1") {

        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "<name> has entered the channel!";
            }
        }
        
        $.say(s.replace("<name>", username));
        
    } else if ($.inidb.get("greeting", "autogreet") == "true") {
        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "<name> has entered the channel!";
            }
        }
        
        $.say(s.replace("<name>", username));
           
    } else if ($.inidb.get("greeting", "autogreet") == null || $.inidb.get("greeting", "autogreet") == "false") {
        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "<name> has entered the channel.";
            }
        }
        if ($.inidb.get("greeting", sender + "_enabled") == "0" ) {
            println(s.replace("[Join] <name>", username));
        }
    } 
});

$.on('ircChannelLeave', function(event) {
    var sender = event.getUser().toLowerCase();
    var username = $.username.resolve(sender);
    
    println("[Leave] " + username + " has left the channel.");
});

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var subCommand;
    
    if(command.equalsIgnoreCase("greeting")) {
        if (argsString.isEmpty()){
            subCommand = "";
        } else {
            subCommand = args[0];
        }
        
        var message = "";
            
        if (args.length > 1) {
            message = argsString.substring(argsString.indexOf(subCommand) + $.strlen(subCommand) + 1);
        }
        
        if (subCommand.equalsIgnoreCase("toggle")) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }
            if ($.inidb.get("greeting", "autogreet")== null || $.inidb.get("greeting", "autogreet")== "false") {
                $.inidb.set("greeting", "autogreet", "true");
                $.say ("Auto Greeting enabled! " + $.username.resolve($.botname) + " will greet everyone from now on.");
            } else if ($.inidb.get("greeting", "autogreet")== "true") {
                $.inidb.set("greeting", "autogreet", "false");
                $.say ("Auto Greeting disabled! " + $.username.resolve($.botname) + " will no longer greet viewers.");
            }
        }

        if (subCommand.equalsIgnoreCase("enable")) {
            $.inidb.set("greeting", sender + "_enabled", "1");
         
            $.say ("Greeting enabled! " + $.username.resolve($.botname) + " will greet you from now on " + username + ".");
        } else if (subCommand.equalsIgnoreCase("disable")) {
            $.inidb.set("greeting", sender + "_enabled", "0");
            
            $.say ("Greeting disabled for " + username);
        } else if (subCommand.equalsIgnoreCase("set")) {
            if ($.strlen(message) == 0) {
                $.inidb.set("greeting", sender, "");
                $.say("Greeting deleted");
            }
            
            if (message.indexOf("<name>") == -1) {
                $.say("You must include '<name>' in your new greeting so I know where to insert your name, " + username + ". Example: !greeting set <name> sneaks into the channel!");
                return;
            }
            
            $.inidb.set("greeting", sender, message);
            
            $.say("Greeting changed");
        } else if (subCommand.equalsIgnoreCase("setdefault")) {
            if (!$.isMod(sender)) {
                $.say($modmsg);
                return;
            }
            
            if (message.indexOf("<name>") == -1) {
                $.say("You must include '<name>' in the new greeting so I know where to insert the viewers name, " + username + ". Example: !greeting setdefault <name> sneaks into the channel!");
                return;
            }
            
            $.logEvent("greetingSystem.js", 75, username + " changed the default greeting to " + message);
            
            $.inidb.set("greeting", "_default", message);
            
            $.say("Default greeting changed");
        } else if (args[0].isEmpty()){
            $.say('Usage: !greeting enable, !greeting disable, !greeting set <message>, !greeting setdefault <message>');
        }
    }
    
    if (command.equalsIgnoreCase("greet")) {
        var s = $.inidb.get("greeting", sender);
        
        if (s == null || s == undefined || s.isEmpty()) {
            s = $.inidb.get("greeting", "_default");
            
            if (s == null || s == undefined || s.isEmpty()) {
                s = "<name> has entered the channel!";
            }
        }
        
        $.say(s.replace("<name>", username));
    } 
});

$.registerChatCommand("./systems/greetingSystem.js", "greeting");
$.registerChatCommand("./systems/greetingSystem.js", "greet");