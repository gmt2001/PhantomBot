var streamSeconds = 0; // stream uptime in seconds
var botSeconds = 0;
$.timer.addTimer("./commands/highlightCommand.js", "highlightcommand", true, function() {
        if (!$.isOnline($.channelName)) {
                        streamSeconds=0;
                        botSeconds++;
			return;
        }
        else {
			streamSeconds++;
                        botSeconds++;
			return;
        }

}, 1000);

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();
    var action = args[0];
    
    var botmessage = ("Bot Up Time: " + botSeconds + " seconds.");
    var botminutes = Math.floor(botSeconds / 60);
    var bothours = Math.floor(botSeconds / 3600);
    var botdays = Math.floor(botminutes / 86400);
    
    var streamhours = Math.floor(streamSeconds / 3600);
    var seconds = streamSeconds % 3600;
    var streamminutes = Math.floor(seconds / 60);
    seconds %= 60;
    var curSTime = streamhours + ":" + streamminutes + ":" + seconds;
	
    var message = ("Highlight saved! \"" + argsString + "\" @ " + curSTime);
	
    if (command.equalsIgnoreCase("highlight")) {
		if (!$.isMod(sender)) {
			$.say($.modmsg);
			return;
		}
		
		if (argsString.isEmpty())
		{
			$.say("Usage: !highlight <note>");
			return;
		} else {
			if (!$.isOnline($.channelName)) {
				$.say("Stream is Offline!");
				return;
			}
			else {
				$.inidb.set("highlights", curSTime, argsString);
				$.say(message);
				return;
			}
		}
    } else if (command.equalsIgnoreCase("uptime")) {
		if (!$.isOnline($.channelName)) {
			$.say("Stream if Offline!");
			return;
		}
		else {
			$.say("Stream has been live for " + curSTime);
			return;
		}
	} else if (command.equalsIgnoreCase("clearhighlights")) {
        if (!isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }		
		// TODO: Delete Highlights
		$.inidb.RemoveFile("highlights");
		$.inidb.ReloadFile("highlights");
		$.say("All Highlights have been erased!");
                
	} else if (command.equalsIgnoreCase("botuptime") && argsString.isEmpty()) {
            
            if (botSeconds >= 60) {
                botmessage = ("Bot Up Time: " + botminutes + " minutes.");
            }
            if (botminutes >= 60) {
                botmessage = ("Bot Up Time: " + bothours + " hours.");
            }
            if (bothours >= 24) {
                botmessage = ("Bot Up Time: " + botdays + " days.");
            }
       
            $.say(botmessage);
            return;
        } 

});

$.registerChatCommand("./commands/highlightCommand.js", "highlight");
$.registerChatCommand("./commands/highlightCommand.js", "uptime");
$.registerChatCommand("./commands/highlightCommand.js", "clearhighlights");
$.registerChatCommand("./commands/highlightCommand.js", "botuptime");