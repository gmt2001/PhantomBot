$.on('command', function(event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var num_quotes = parseInt($.inidb.get("quotes", "num_quotes"));
    var args = event.getArgs();
    var quote;
    var num;
    
    if (command.equalsIgnoreCase("quote")) {
        if (argsString.length() > 0) {
            num = parseInt(argsString);
        } else {
            num = $.rand(num_quotes);
        }

        if (isNaN(num_quotes) || num_quotes == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.error-no-quotes"));
            return;
        }

        if ($.inidb.get("quotes", "quote_" + num) == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.quote-number", (num_quotes), (num_quotes - 1)));
            return;
        } else {
            $.say($.lang.get("net.phantombot.quotecommand.random-quote", num, $.inidb.get("quotes", "quote_" + num))); // I don't think the quote needs to be whispered.
            return;
        }
    }
    
    if (command.equalsIgnoreCase("addquote")) {
        if (!$.isMod(sender, event.getTags(), event.getChannel())) { 
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
            return;
        }
        
        if (num_quotes == null || isNaN(num_quotes)) {
            num_quotes = 0;
        }
        
        if (argsString.isEmpty()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.error-quote-usage"));
            return;
        }

        $.inidb.incr("quotes", "num_quotes", 1);
        $.inidb.set("quotes", "quote_" + num_quotes, argsString);
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.quote-add-success", (num_quotes + 1)));
        return;
    }

    if (command.equalsIgnoreCase("editquote")) {
        if (!$.isMod(sender, event.getTags(), event.getChannel())) { 
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
            return;
        }
        
        num = parseInt(args[0]);

        if (num > num_quotes) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.editquote-error"));
            return;
        }

        if (argsString2.isEmpty()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.editquote-error-usage"));
            return;
        }
        
        $.inidb.set("quotes", "quote_" + num, argsString2);
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.editquote-success", num, $.inidb.get("quotes", "quote_" + num)));
        return;
    }
    
    if (command.equalsIgnoreCase("delquote")) {
        if (!$.isMod(sender, event.getTags(), event.getChannel())) { 
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
            return;
        }

        if (num_quotes == null || isNaN(num_quotes) || num_quotes == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.delquote-error"));
            return;
        }
        
        if (argsString.isEmpty()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.delquote-error-usage"));
            return;
        }

        if ($.inidb.get('quotes', 'quote_' + parseInt(args[0])) == null) { // added this check to make sure that the quote ID is true.
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.delquote-error-wrong-id", $.inidb.get('quotes', 'num_quotes')));
            return;
        }
        
        if (num_quotes > 1) {
            for (i = 0; i < num_quotes; i++) {
                if (i > parseInt(argsString)) {
                    $.inidb.set('quotes', 'quote_' + (i - 1), $.inidb.get('quotes', 'quote_' + i));
                }
            }
        }

        $.inidb.del('quotes', 'quote_' + (num_quotes - 1));
        
        $.inidb.decr("quotes", "num_quotes", 1);
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.quotecommand.delquote-success", (num_quotes - 1)));
        return;
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./commands/quoteCommand.js')) {
        $.registerChatCommand("./commands/quoteCommand.js", "quote");
        $.registerChatCommand("./commands/quoteCommand.js", "addquote", "mod");
        $.registerChatCommand("./commands/quoteCommand.js", "editquote", "mod");
        $.registerChatCommand("./commands/quoteCommand.js", "delquote", "mod");
    }
},10 * 1000);
