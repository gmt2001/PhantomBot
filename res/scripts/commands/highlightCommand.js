var seconds = 0; 
$.timer.addTimer("./commands/highlightCommand.js", "highlightcommand", true, function() {
    if (!$.isOnline($.channelName)) {
        seconds = 0;
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
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.highlightcommand.usage"));
        } else if (!$.isOnline($.channelName)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.highlightcommand.error-stream-offline"));
        } else {
            var timestamp = $.getHighlight($.channelName);
            $.inidb.set("highlights", timestamp, argsString);
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.highlightcommand.highlight-saved", argsString, timestamp));
            return;
        }
    }
	
    if (command.equalsIgnoreCase("clearhighlights")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }
		
        $.inidb.RemoveFile("highlights");
        $.inidb.ReloadFile("highlights");
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.highlightcommand.highlight-cleared"));
        return;
    }
});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/highlightCommand.js')) {
        $.registerChatCommand("./commands/highlightCommand.js", "highlight", "mod");
        $.registerChatCommand("./commands/highlightCommand.js", "clearhighlights", "mod");
    }
}, 10 * 1000);
