var seconds = 0; // stream uptime in seconds
$.timer.addTimer("./commands/highlightCommand.js", "highlightcommand", true, function() {
        if (!$.isOnline($.channelName)) {
                        seconds=0;
			return;
        }
        else {
			seconds++;
			return;
        }

}, 1000);

$.on('command', function (event) {
	var sender = event.getSender();
	var command = event.getCommand();
	var argsString = event.getArguments().trim();
        var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone));
        var now = cal.getTime();
        var datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy");
        datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
        var timestamp = datefmt.format(now);
	
	var hlSec  = null; // Stream Current Seconds
	var hlMin  = null; // Stream Current Minutes
	var hlHour = null; // Stream Current Hours
	var hlDay = null; // Stream Current Hours
	var hlTxt  = null; // Stream Current Time
		
	hlSec  = seconds % 60;
	hlMin  = seconds / 60;
	hlHour = hlMin / 60;
        hlDay  = hlHour / 24;
				
	hlMin  = Math.floor(hlMin) % 60;
	hlHour = Math.floor(hlHour);
        hlDay  = Math.floor(hlDay);
	
	if (hlSec  < 10) { hlSec  = "0" + hlSec;  }
	if (hlMin  < 10) { hlMin  = "0" + hlMin;  }
	if (hlHour < 10) { hlHour = "0" + hlHour; }
        
        hlTxt = hlDay  + "D:" + hlHour + "H:" + hlMin  + "M:" + hlSec  + "S";
	
	//hlTxt = hlHour + ":" + hlMin  + ":" + hlSec;
		
	if (command.equalsIgnoreCase("highlight")) {
		if (!$.isMod(sender)) {
			$.say($.modmsg);
		} else if (argsString.isEmpty()) { 
			$.say("Usage: !highlight (note)");
		} else if (!$.isOnline($.channelName)) {
			$.say("Stream is Offline!");
		} else {
                        timestamp+=" - ";
                        timestamp+=hlTxt;
			$.inidb.set("highlights", timestamp, argsString);
			$.say("Highlight saved! \"" + 
				argsString + "\" @ " + timestamp + ".");
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
$.registerChatCommand("./commands/highlightCommand.js", "clearhighlights");
