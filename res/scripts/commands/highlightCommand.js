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
	var sender = event.getSender();
	var username = $.username.resolve(sender).toLowerCase();
	var command = event.getCommand();
	var argsString = event.getArguments().trim();
	
	var hlSec  = null; // Bot or Stream Current Seconds
	var hlMin  = null; // Bot or Stream Current Minutes
	var hlHour = null; // Bot or Stream Current Hours
	var hlDay  = null; // Bot Current Days
	var hlTxt  = null; // Bot Up Time or Stream Current Time
	
	// Only command that reads botSeconds, so check it first.
	if (command.equalsIgnoreCase("botuptime") && argsString.isEmpty()) {
		botSec  = botSeconds % 60;
		botMin  = botSeconds / 60;
		botHour = botMin / 60;
		botDay  = botHour / 24;
				
		botMin  = Math.floor(botMin) % 60;
		botHour = Math.floor(botHour) % 24;
		botDay  = Math.floor(botDay);
		
		if (botSec  < 10) { botSec  = "0" + botSec;  }
		if (botMin  < 10) { botMin  = "0" + botMin;  }
		if (botHour < 10) { botHour = "0" + botHour; }
				
		botTxt = "/me Time: " + 
				botDay  + "D " + botHour + "H " +
				botMin  + "M " + botSec  + "S.";
		
		$.say(botTxt);
		return;
	}
	
	// The rest of the commands in this script read streamSeconds,
	// so do that Math, then check for the commands.
	
	hlSec  = streamSeconds % 60;
	hlMin  = streamSeconds / 60;
	hlHour = hlMin / 60;
				
	hlMin  = Math.floor(hlMin) % 60;
	hlHour = Math.floor(hlHour);
	
	if (hlSec  < 10) { hlSec  = "0" + hlSec;  }
	if (hlMin  < 10) { hlMin  = "0" + hlMin;  }
	if (hlHour < 10) { hlHour = "0" + hlHour; }
	
	hlTxt = hlHour + ":" + hlMin  + ":" + hlSec;
	
	if (command.equalsIgnoreCase("uptime")) {
		if ($.isOnline($.channelName)) {
			$.say("Stream has been live for " + hlTxt + ".");
		} else {
			$.say("Stream is Offline!");
		}
		return;
	}
	
	if (command.equalsIgnoreCase("highlight")) {
		if (!$.isMod(sender)) {
			$.say($.modmsg);
		} else if (argsString.isEmpty()) { 
			$.say("Usage: !highlight <note>");
		} else if (!$.isOnline($.channelName)) {
			$.say("Stream is Offline!");
		} else {
			$.inidb.set("highlights", hlTxt, argsString);
			$.say("Highlight saved! \"" + 
				argsString + "\" @ " + hlTxt + ".");
		}
		return;
	}
	
	if (command.equalsIgnoreCase("clearhighlights")) {
		
		if (!$.isMod(sender)) {
			$.say($.modmsg);
			return;
		}
		
		// TODO: Delete Highlights
		$.inidb.RemoveFile("highlights");
		$.inidb.ReloadFile("highlights");
		$.say("All Highlights have been erased!");
	}
	
	return;
});

$.registerChatCommand("./commands/highlightCommand.js", "highlight");
$.registerChatCommand("./commands/highlightCommand.js", "uptime");
$.registerChatCommand("./commands/highlightCommand.js", "clearhighlights");
$.registerChatCommand("./commands/highlightCommand.js", "botuptime");