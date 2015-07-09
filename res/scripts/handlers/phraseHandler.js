$.on('ircChannelMessage', function(event) {
    
    var message = new String(event.getMessage().toLowerCase().trim());
    message = message.replace(/[^a-zA-Z0-9\s]+/g,'');
    var sender = event.getSender().toLowerCase();
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
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var message = argsString.substring(argsString.indexOf(" \"") + 2, argsString.length() - 1);
    var args = event.getArgs();
    var emote = "";
    
    if (command.equalsIgnoreCase("addphrase")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        emote = new String(args[0].toLowerCase().trim());
        emote = emote.replace(/[^a-zA-Z0-9\s]+/g,'');

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

$.registerChatCommand("./handlers/phraseHandler.js", "addphrase");
$.registerChatCommand("./handlers/phraseHandler.js", "delphrase");