var whispermode = $.inidb.get("settings", "whisper_phrases");

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
			
	if (whispermode == "true") {
		$.say("/w " + sender + " " + messageKEY);
	} else {
		$.say(messageKEY);
	}
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
	
	if (command.equalsIgnoreCase("whisperphrases") && $.isModv3(sender, event.getTags())) {
				
				if (whispermode != "true") {
				$.inidb.set("settings", "whisper_phrases", "true");
				whispermode = "true";
				$.say("[Whisper Mode] has been activated for the Phrase Trigger!");			
				return;	
				} else if (whispermode == "true"){
				$.inidb.set("settings", "whisper_phrases", "false");
				whispermode = "false";
				$.say("[Whisper Mode] has been deactivated for the Phrase Trigger!");		
				}

				}
	
    if (command.equalsIgnoreCase("addphrase")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }

        triggerphrase = args[0].toLowerCase();
        triggerphrase = new String(triggerphrase);
        triggerphrase = triggerphrase.replace(/[^a-zA-Z0-9\s]+/g,'');
        
        response = argsString2;
         
        $.inidb.set('phrases', triggerphrase, response);
	if (whispermode == "true") {
		 $.say("/w " + sender + " Phrase trigger: " + triggerphrase + ", Message: \"" + response + "\" was added!");
	} else {
        $.say("Phrase trigger: " + triggerphrase + ", Message: \"" + response + "\" was added!");
	}
    }
    if (command.equalsIgnoreCase("delphrase")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        triggerphrase = args[0];

        $.inidb.del('phrases', triggerphrase);
		
	if (whispermode == "true") {
		 $.say("/w " + sender + " Phrase trigger: " + triggerphrase + " was removed!");
	} else {
        $.say("Phrase trigger: " + triggerphrase + " was removed!");
	}
    }

});
setTimeout(function(){ 
    if ($.moduleEnabled('./handlers/phraseHandler.js')) {
        $.registerChatCommand("./handlers/phraseHandler.js", "addphrase", "mod");
        $.registerChatCommand("./handlers/phraseHandler.js", "delphrase", "mod");
        $.registerChatCommand("./handlers/phraseHandler.js", "whisperphrase", "mod");
    }
},10*1000);
