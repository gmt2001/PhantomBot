$.on('ircChannelMessage', function(event) {
    
    var message = event.getMessage();
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var emoteKey = $.inidb.GetKeyList("phrases", "");


    for (i = 0; i < emoteKey.length; i++) {
        if (message.indexOf(emoteKey[i]) != -1) {
        
            $.say($.inidb.get('phrases', emoteKey[i]));
            return;
        }
    }

    
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var message = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();

    if (command.equalsIgnoreCase("addphrase")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        emote = args[0];

        $.inidb.set('phrases', emote, message);
        $.say("Phrase trigger: " + emote + ", Message: \"" + message + "\" was added!");
    }
    if (command.equalsIgnoreCase("delphrase")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        emote = args[0];

        $.inidb.del('phrases', emote);
        $.say("Phrase trigger: " + emote + " was removed!");
    }

});

$.registerChatCommand("./commands/phraseTrigger.js", "addphrase");
$.registerChatCommand("./commands/phraseTrigger.js", "delphrase");