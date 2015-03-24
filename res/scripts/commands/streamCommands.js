$.isOnline = function(channel) {
    var stream = $.twitch.GetStream(channel);
    
    if (!stream.isNull("stream")) {
        return true;
    }

    return false;
}

$.getStatus = function(channel) {
    var channelData = $.twitch.GetChannel(channel);
    
    return channelData.getString("status");
}

$.getGame = function(channel) {
    var channelData = $.twitch.GetChannel(channel);
    
    return channelData.getString("game");
}

$.getViewers = function(channel) {
    var stream = $.twitch.GetStream(channel);

    try {
        return stream.getJSONObject("stream").getInt("viewers");
    } catch(e) {
        return 0;
    }
}

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var res;

    if (command.equalsIgnoreCase("online")) {
        if (!$.isOnline($.channelName)) {
            $.say("Stream is offline.");
        }
        else {
            $.say("Stream is online!");
        }
    }
	
    if (command.equalsIgnoreCase("viewers")) {
        $.say("There are currently " + $.getViewers($.channelName) + " viewers!");
    }

    if (command.equalsIgnoreCase("game")) {
        if ($.strlen(argsString) == 0) {
            $.say("Current Game: " + $.getGame($.channelName));
            return;
        }
        else if (!isCaster(sender)) {
            $.say($.castermsg);
            return;	
        }
        
        res = $.twitch.UpdateChannel($.channelName, "", argsString);
        
        if (res.getBoolean("_success")) {
            if (res.getInt("_http") == 200) {
                $.say("Changed the game to '" + res.getString("game") + "'!");
                $.logEvent("streamCommands.js", 25, username + " changed the current game to " + res.getString("game"));
            } else {
                $.say("Failed to change the game. TwitchAPI must be having issues");
                println(res.getString("message"));
                $.logError("streamCommands.js", 29, res.getString("message"));
            }
        } else {
            $.say("Failed to change the game. TwitchAPI must be having issues");
            println(res.getString("_exception") + " " + res.getString("_exceptionMessage"));
            $.logError("streamCommands.js", 34, res.getString("_exception") + " " + res.getString("_exceptionMessage"));
        }
    }
    

    if (command.equalsIgnoreCase("status")) {
        if ($.strlen(argsString) == 0) {
            $.say("Current Status: " + $.getStatus($.channelName));
            return;
        }
        else if (!isCaster(sender)) {
            $.say($.castermsg);
            return;	
        }
        
        res = $.twitch.UpdateChannel($.channelName, argsString, "");
        
        if (res.getBoolean("_success")) {
            if (res.getInt("_http") == 200) {
                $.say("Changed the title to '" + res.getString("status") + "'!");
                $.logEvent("streamCommands.js", 54, username + " changed the current status to " + res.getString("status"));
            } else {
                $.say("Failed to change the status. TwitchAPI must be having issues");
                println(res.getString("message"));
                $.logError("streamCommands.js", 58, res.getString("message"));
            }
        } else {
            $.say("Failed to change the status. TwitchAPI must be having issues");
            println(res.getString("_exception") + " " + res.getString("_exceptionMessage"));
            $.logError("streamCommands.js", 63, res.getString("_exception") + " " + res.getString("_exceptionMessage"));
        }
    }
    
    if (command.equalsIgnoreCase("commercial")) {
        if (!isCaster(sender)) {
            $.say($.castermsg);
            return;
        }
        
        if (args.length > 0) {
            if (args[0].equalsIgnoreCase("disablecommand")) {
                if (!isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }
                
                $.logEvent("streamCommands.js", 80, username + " disabled manual triggering of commercials");
            
                $.inidb.set("settings", "commercialcommandenabled", "0");
                
                $.say("Manual commercials disabled!");
                return;
            }
        
            if (args[0].equalsIgnoreCase("enablecommand")) {
                if (!isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }
            
                $.logEvent("streamCommands.js", 94, username + " enabled manual triggering of commercials");
            
                $.inidb.set("settings", "commercialcommandenabled", "1");
                
                $.say("Manual commercials enabled!");
                return;
            }
        
            if (args[0].equalsIgnoreCase("autotimer")) {
                if (!isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }
                
                if (args.length >= 2 && parseInt(args[1]) == 0) {
                    $.logEvent("streamCommands.js", 109, username + " disabled the automatic commercial timer");
                    
                    $.inidb.set("settings", "commercialtimer", args[1]);
                    
                    $.say("Automatic commercial timer disabled!");
                    return;
                }
                
                if (args.length < 3 || isNaN(args[1]) || parseInt(args[1]) < 0
                    || (!args[2].equalsIgnoreCase("30") && !args[2].equalsIgnoreCase("60") && !args[2].equalsIgnoreCase("90")
                        && !args[2].equalsIgnoreCase("120") && !args[2].equalsIgnoreCase("150") && !args[2].equalsIgnoreCase("180"))) {
                    if (args.length == 1) {
                        if (!$.inidb.exists("settings", "commercialtimer") || $.inidb.get("settings", "commercialtimer").equalsIgnoreCase("0")) {
                            $.say("Automatic commercials are disabled! To enable them, say '!commercial autotimer <interval in minutes (at least 9)> <commercial length 30, 60, 90, 120, 150, or 180> [optional message]'");
                        } else {
                            var a = $.inidb.get("settings", "commercialtimer");
                            var b = $.inidb.get("settings", "commercialtimerlength");
                            var c = $.inidb.get("settings", "commercialtimermessage");
                            
                            $.say("Automatic commercials are enabled! They are running " + b + " seconds of ads every " + a + " minutes. To disable, say '!commercial autotimer 0'");
                            
                            if (!c.isEmpty()) {
                                $.say("The message sent with every automatic commercial is: " + c);
                            }
                        }
                    } else {
                        $.say("Usage: !commercial autotimer <interval in minutes (at least 9) or 0 to disable> <commercial length 30, 60, 90, 120, 150, or 180> [optional message]");
                    }
                    
                    return;
                }
                
                if (parseInt(args[1]) < 9) {
                    args[1] = 9;
                }
            
                $.inidb.set("settings", "commercialtimer", args[1]);
                $.inidb.set("settings", "commercialtimerlength", args[2]);
                
                if (args.length > 2) {
                    $.logEvent("streamCommands.js", 149, username + " set the auto commercial timer to interval " + args[1] + " minutes, length " + args[2] + " seconds, message " + argsString.substring(argsString.indexOf(args[2], argsString.indexOf(args[1]) + 1) + $.strlen(args[2]) + 1));
                    $.inidb.set("settings", "commercialtimermessage", argsString.substring(argsString.indexOf(args[2], argsString.indexOf(args[1]) + 1) + $.strlen(args[2]) + 1));
                } else {
                    $.logEvent("streamCommands.js", 152, username + " set the auto commercial timer to interval " + args[1] + " minutes, length " + args[2] + " seconds, with no message");
                    $.inidb.set("settings", "commercialtimermessage", "");
                }
                
                $.say("Automatic commercial timer set!");
                return;
            }
            
            if (args[0].equalsIgnoreCase("help")) {
                $.say("Usage: !commercial <commercial length 30, 60, 90, 120, 150, or 180>, !commercial enablecommand, !comemrcial disablecommand, !commercial autotimer");
                return;
            }
        }
        
        if ($.inidb.exists("settings", "commercialcommandenabled")
            && $.inidb.get("settings", "commercialcommandenabled").equalsIgnoreCase("0") && !isAdmin(sender)) {
            $.say("Manual triggering of commercials is disabled!");
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            argsString = "30";
        }
        
        res = $.twitch.RunCommercial($.channelName, parseInt(argsString));
        
        if (res.getBoolean("_success")) {
            if (res.getInt("_http") == 204) {
                $.say("Running a " + argsString + " second commercial!");
                $.logEvent("streamCommands.js", 181, username + " ran a " + argsString + " second commercial");
            } else if (res.getInt("_http") == 422) {
                $.say("You must enter a valid commercial length, wait 8 minutes between commercials, and can only run commercials when the stream is online! Valid lengths are 30, 60, 90, 120, 150, and 180 seconds");
                
                if (!res.getString("message").equalsIgnoreCase("Commercials breaks are allowed every 8 min and only when you are online.")) {
                    $.logError("streamCommands.js", 186, res.getString("message"));
                }
            } else {
                $.say("Failed to run a commercial. TwitchAPI must be having issues");
                println(res.getString("_content"));
                $.logError("streamCommands.js", 191, res.getString("_content"));
            }
        } else {
            $.say("Failed to run a commercial. TwitchAPI must be having issues");
            println(res.getString("_exception") + " " + res.getString("_exceptionMessage"));
            $.logError("streamCommands.js", 196, res.getString("_exception") + " " + res.getString("_exceptionMessage"));
        }
    }
});
$.registerChatCommand("./commands/streamCommands.js", "online");
$.registerChatCommand("./commands/streamCommands.js", "game");
$.registerChatCommand("./commands/streamCommands.js", "status");
$.registerChatCommand("./commands/streamCommands.js", "commercial", "caster");
$.registerChatCommand("./commands/streamCommands.js", "commercial help", "caster");
$.registerChatCommand("./commands/streamCommands.js", "viewers");

var lastCommercial = $.inidb.get("settings", "lastCommercial");

if (lastCommercial == undefined || lastCommercial == null || lastCommercial < 0) {
    lastCommercial = System.currentTimeMillis() - (parseInt($.inidb.get("settings", "commercialtimer")) * 60 * 1000) + (2 * 60 * 1000);
}

$.timer.addTimer("./commands/streamCommands.js", "autocommercial", true, function() {
    if (!$.moduleEnabled("./commands/streamCommands.js")) {
        return;
    }
    
    if (!$.inidb.exists("settings", "commercialtimer") || $.inidb.get("settings", "commercialtimer").equalsIgnoreCase("0")) {
        return;
    }
    
    var res;
    
    if (lastCommercial + (parseInt($.inidb.get("settings", "commercialtimer")) * 60 * 1000) < System.currentTimeMillis()){
        res = $.twitch.RunCommercial($.channelName, parseInt($.inidb.get("settings", "commercialtimerlength")));
        
        if (res.getBoolean("_success")) {
            if (res.getInt("_http") == 204) {
                if ($.strlen($.inidb.get("settings", "commercialtimermessage")) > 0) {
                    $.say($.inidb.get("settings", "commercialtimermessage"));
                }
                
                $.logEvent("streamCommands.js", 228, "Ran a " + $.inidb.get("settings", "commercialtimerlength") + " second automatic commercial");
            } else if (res.getInt("_http") == 422) {
                println(res.getString("_content"));
                
                if (!res.getString("message").equalsIgnoreCase("Commercials breaks are allowed every 8 min and only when you are online.")) {
                    $.say("Failed to run a commercial. " + res.getString("message"));
                    $.logError("streamCommands.js", 234, res.getString("message"));
                }
            } else {
                println(res.getString("_content"));
                $.say("Failed to run a commercial. TwitchAPI must be having issues");
                $.logError("streamCommands.js", 239, res.getString("message"));
            }
        } else {
            $.say("Failed to run a commercial. TwitchAPI must be having issues");
            println(res.getString("_exception") + " " + res.getString("_exceptionMessage"));
            $.logError("streamCommands.js", 244, res.getString("_exception") + " " + res.getString("_exceptionMessage"));
        }
        
        lastCommercial = System.currentTimeMillis();
        $.inidb.set("settings", "lastCommercial", lastCommercial);
    }
}, 60 * 1000);