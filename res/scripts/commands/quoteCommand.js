$.on('command', function(event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var num_quotes = parseInt($.inidb.get("quotes", "num_quotes"));
    var args = event.getArgs();
    var quote;
    var num;
    
    if(command.equalsIgnoreCase("quote")) {
        if (argsString.length() > 0) {
            num = parseInt(argsString);
        } else {
            num = $.rand(num_quotes);
        }

        if (isNaN(num_quotes) || num_quotes == 0) {
            $.say("There are no quotes at this time");
            return;
        }

        if ($.inidb.get("quotes", "quote_" + num) == null) {
            $.say("There are only " + num_quotes + " quotes right now! Remember that quotes are numbered from 0 to " + (num_quotes - 1 )+ "!");

        } else {
            $.say("#" + num + ": " + $.inidb.get("quotes", "quote_" + num));
        }
    }
    
    if (command.equalsIgnoreCase("addquote")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        if (num_quotes == null || isNaN(num_quotes)) {
            num_quotes = 0;
        }
        
        if (argsString.isEmpty()) {
            $.say("Usage: !addquote \"This is a quote!\"");
            return;
        }

        $.inidb.incr("quotes", "num_quotes", 1);
        $.inidb.set("quotes", "quote_" + num_quotes, argsString);
        
        $.say("Quote added! There are now " + (num_quotes + 1) + " quotes!");
    }

    if (command.equalsIgnoreCase("editquote")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        num = parseInt(args[0]);

        if (num > num_quotes) {
            $.say("There is no quote under that ID, " + sender + "!");
            return;
        }

        if (argsString2.isEmpty()) {
            $.say("Usage: !editquote <ID> \"This is a quote!\"");
            return;
        }

        
        $.inidb.set("quotes", "quote_" + num, argsString2);
        
        $.say("Quote #" + num + " changed to: " + $.inidb.get("quotes", "quote_" + num));
    }
    
    if (command.equalsIgnoreCase("delquote")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }

        if (num_quotes == null || isNaN(num_quotes) || num_quotes == 0) {
            $.say("There are no quotes at this time");
            return;
        }
        
        if (argsString.isEmpty()) {
            $.say("Usage: !delquote <id>");
            return;
        }
        
        if (num_quotes > 1) {
            for (i = 0; i < num_quotes; i++) {
                if (i > parseInt(argsString)) {
                    $.inidb.set('quotes', 'quote_' + (i - 1), $.inidb.get('quotes', 'quote_' + i))
                }
            }
        }

        $.inidb.del('quotes', 'quote_' + (num_quotes - 1));
        
        $.inidb.decr("quotes", "num_quotes", 1);
        
        $.say("Quote removed! There are now " + (num_quotes - 1) + " quotes!");
    }
});

$.registerChatCommand("./commands/quoteCommand.js", "quote");
$.registerChatCommand("./commands/quoteCommand.js", "addquote", "mod");
$.registerChatCommand("./commands/quoteCommand.js", "editquote", "mod");
$.registerChatCommand("./commands/quoteCommand.js", "delquote", "mod");
