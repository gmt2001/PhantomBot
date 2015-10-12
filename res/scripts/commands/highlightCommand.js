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

		
    if (command.equalsIgnoreCase("highlight")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
        } else if (argsString.isEmpty()) { 
            $.say($.getWhisperString(sender) + "Usage: !highlight (note)");
        } else if (!$.isOnline($.channelName)) {
            $.say($.getWhisperString(sender) + "Stream is Offline!");
        } else {
            var timestamp = $.getHighlight($.channelName);
            $.inidb.set("highlights", timestamp, argsString);
            $.say($.getWhisperString(sender) + "Highlight saved! \"" + 
                argsString + "\" @ " + timestamp + ".");
        }
        return;
    }
	
    if (command.equalsIgnoreCase("clearhighlights")) {
		
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }
		
        // TODO: Delete Highlights
        $.inidb.RemoveFile("highlights");
        $.inidb.ReloadFile("highlights");
        $.say($.getWhisperString(sender) + "All Highlights have been erased!");
    }
	
    return;
});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/highlightCommand.js')) {
        $.registerChatCommand("./commands/highlightCommand.js", "highlight", "mod");
        $.registerChatCommand("./commands/highlightCommand.js", "clearhighlights", "mod");
    }
}, 10*1000);