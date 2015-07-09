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
    var message = argsString.substring(argsString.indexOf(" "), argsString.length());
    var args = event.getArgs();
    var triggerphrase = "";
    var response = "";

    if (command.equalsIgnoreCase("addphrase")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        if((argsString.indexOf('"')==1))
        {
            triggerphrase = argsString.substring(2, argsString.indexOf('" '));
        } else {
            triggerphrase = args[0].toString();
        }
        triggerphrase = new String(triggerphrase.trim());
        triggerphrase = triggerphrase.replace(/[^a-zA-Z0-9\s]+/g,'');
        
        if(argsString.indexOf('" "')!=-1)
        {
            response = argsString.substring(argsString.indexOf('" "') + 3, argsString.length() - 1);
        } else {
            response = args[1].toString();
        }
         

        $.inidb.set('phrases', triggerphrase, response);
        $.say("Phrase trigger: " + triggerphrase + ", Message: \"" + response + "\" was added!");
    }
    if (command.equalsIgnoreCase("delphrase")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        triggerphrase = args[0];

        $.inidb.del('phrases', triggerphrase);
        $.say("Phrase trigger: " + triggerphrase + " was removed!");
    }

});
setTimeout(function(){ 
if ($.moduleEnabled('./handlers/phraseHandler.js')) {
$.registerChatCommand("./handlers/phraseHandler.js", "addphrase");
$.registerChatCommand("./handlers/phraseHandler.js", "delphrase");
}
},10*1000);