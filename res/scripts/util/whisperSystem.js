$.getWhisperString = function (sender, channel) {
    if ($.inidb.GetBoolean("settings", channel.getName(), "whisper_mode")) {
        return "/w " + sender + " ";
    } else {
        return $.username.resolve(sender) + ": ";
    }
}

$.getWhisperStringStatic = function (sender) {
    return "/w " + sender + " ";
}


$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var channel = event.getChannel();
    var args = event.getArgs();

    if (command.equalsIgnoreCase("whispermode")) { // enable / disable whisper mode
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if ($.inidb.GetBoolean("settings", channel.getName(), "whisper_mode")) {
            $.inidb.SetBoolean("settings", channel.getName(), "whisper_mode", false);
            
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.whisper-disabled", channel), channel);
            return;
        } else {
            $.inidb.SetBoolean("settings", channel.getName(), "whisper_mode", true);
            
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.whisper-enabled", channel), channel);
            return;
        }
    }
});

$.timer.addTimer("./util/whisperSystem.js", "whisperSystem", false, function () {
    $.registerChatCommand("./util/whisperSystem.js", "whispermode", "admin");
}, 5000);
