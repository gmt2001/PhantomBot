$.whispermode = $.inidb.get("settings", "whisper_mode");

if ($.whispermode == undefined || $.whispermode == null) {
    $.whispermode = "false";
}

$.getWhisperString = function(sender) {
    if ($.whispermode == "true") {
        return "/w " + sender + " ";
    } else {
        return $.username.resolve(sender) + ": ";
    }
}

$.getWhisperStringStatic = function(sender) {
    return "/w " + sender + " ";
}


$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("whispermode")) { // enable / disable whisper mode
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        
        if($.whispermode=="true") {
            $.inidb.set('settings','whisper_mode', "false");
            $.whispermode = "false";
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.whisper-disabled"));
            return;
        } else {
            $.inidb.set('settings','whisper_mode', "true");
            $.whispermode = "true";
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.whisper-enabled"));
            return;
        }
    }
});

$.timer.addTimer("./systems/whisperSystem.js", "whisperSystem", false, function() {
    $.registerChatCommand("./systems/whisperSystem.js", "whispermode", "admin");
}, 5000);
