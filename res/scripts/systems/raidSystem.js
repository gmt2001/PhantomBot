$.getOrdinal = function (n) {
   var s = ["th","st","nd","rd"],
       v = n % 100;
   return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("raid") || command.equalsIgnoreCase("raider")) {
        if (args.length >= 1) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            $.inidb.incr('raiders', args[0].toLowerCase() + "_count", 1);

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.raidsystem.success", $.username.resolve(args[0]), getOrdinal($.inidb.get('raiders', args[0].toLowerCase()  + "_count")), args[0].toLowerCase()));  
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.raidsystem.usage"));       
            return;
        }
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/raidSystem.js')) {
        $.registerChatCommand("./systems/raidSystem.js", "raid", "mod");
        $.registerChatCommand("./systems/raidSystem.js", "raider", "mod");
    }
},10*1000);
