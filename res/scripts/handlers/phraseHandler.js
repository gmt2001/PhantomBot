$.on('ircChannelMessage', function(event) { 
    var message = new String(event.getMessage().toLowerCase().trim());
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());

    message = message.replace(/[^a-zA-Z0-9\s]+/g,'');
    var emoteKey = $.inidb.GetKeyList("phrases", "");
    if(emoteKey == null || emoteKey[0] == "" || emoteKey[0] == null) {
        return;
    }

    for (i = 0; i < emoteKey.length; i++) {
        if (message.indexOf(emoteKey[i].toLowerCase()) != -1) {
            var messageKEY = $.inidb.get('phrases', emoteKey[i]);
            while (messageKEY.contains("(sender)")) {
                messageKEY = messageKEY.replace("(sender)", username);
            }
			
            $.say(messageKEY);
            return;
        }
    }    
});

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
	var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();
    var triggerphrase = "";
    var response = "";
	
	
    if (command.equalsIgnoreCase("addphrase")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        triggerphrase = args[0].toLowerCase();
        triggerphrase = new String(triggerphrase);
        triggerphrase = triggerphrase.replace(/[^a-zA-Z0-9\s]+/g,'');
        
        response = argsString2;
         
        $.inidb.set('phrases', triggerphrase, response);
		 $.say($.getWhisperString(sender) + " Phrase trigger: " + triggerphrase + ", Message: \"" + response + "\" was added!");
    }
    
    if (command.equalsIgnoreCase("delphrase")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }
        triggerphrase = args[0];

        $.inidb.del('phrases', triggerphrase);
        $.say($.getWhisperString(sender) + " Phrase trigger: " + triggerphrase + " was removed!");
    }

});
setTimeout(function(){ 
    if ($.moduleEnabled('./handlers/phraseHandler.js')) {
        $.registerChatCommand("./handlers/phraseHandler.js", "addphrase", "mod");
        $.registerChatCommand("./handlers/phraseHandler.js", "delphrase", "mod");
    }
},10*1000);
