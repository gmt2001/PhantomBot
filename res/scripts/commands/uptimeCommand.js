var streamSeconds = 0; // stream uptime in seconds
var botSeconds = 0;
$.timer.addTimer("./commands/uptimeCommand.js", "uptimecommand", true, function() {
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
	var command = event.getCommand();
	var argsString = event.getArguments().trim();
	
	// Only command that reads botSeconds, so check it first.
	if (command.equalsIgnoreCase("botuptime") && argsString.isEmpty()) {
		$.say("/me 's uptime: " + $.displayTime(botSeconds));
		return;
	}
	
	if (command.equalsIgnoreCase("uptime")) {
		if ($.isOnline($.channelName)) {
			$.say("Stream has been live since " + $.getUptime($.channelName) + ".");
		} else {
			$.say("Stream is Offline!");
		}
		return;
	}	
	return;
});

$.registerChatCommand("./commands/uptimeCommand.js", "uptime");
$.registerChatCommand("./commands/uptimeCommand.js", "botuptime");