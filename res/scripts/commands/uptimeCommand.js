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

$.displayTime = function(time) {
    // Date object takes starting time in ms - multiply by 1000
    var DateFormatter = new Date(time * 1000);

    // Create a string to stuff the output into.
    var output = "";

    // If you've triggered, you want to trigger on every subsequent. 
    // Not quite a switch case, which won't work here, but close.
    var bFallThrough = false;

    // Date object is defined using the Unix Epoch (1/1/1970 00:00:00.000) - Trim off the 1970
    if (DateFormatter.getUTCFullYear() > 1970) {
        output += (DateFormatter.getUTCFullYear() - 1970) + " years, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCMonth() > 0 || bFallThrough) {
        output += DateFormatter.getUTCMonth() + " months, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCDate() > 1 || bFallThrough) {
        output += DateFormatter.getUTCDate() + " days, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCHours() > 0 || bFallThrough) {
        output += DateFormatter.getUTCHours() + " hours, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCMinutes() > 0 || bFallThrough) {
        output += DateFormatter.getUTCMinutes() + " minutes, ";
        bFallThrough = true;
    }
    if (DateFormatter.getUTCSeconds() > 0 || bFallThrough) {
        if (bFallThrough) {
            output += "and ";
        }
        output += DateFormatter.getUTCSeconds() + " seconds";
    }

    // Done with concatenation and the like, return the output.
    return output;
}


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
            $.say("/me " + $.username.resolve($.channelName) + " has been live for " + $.getUptime($.channelName) + ".");
        } else {
            $.say($.getWhisperString(event.getSender()) + "Stream is Offline!");
        }
        return;
    }	
    return;
});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/uptimeCommand.js')) {
        $.registerChatCommand("./commands/uptimeCommand.js", "uptime");
        $.registerChatCommand("./commands/uptimeCommand.js", "botuptime");
    }
},10*1000);