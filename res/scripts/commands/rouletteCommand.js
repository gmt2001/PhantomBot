$.roulettetimeout = $.inidb.get('settings', 'roulettetimeout');
if ($.roulettetimeout === undefined || $.roulettetimeout === null || isNaN($.roulettetimeout) || $.roulettetimeout < 1) {
    $.roulettetimeout = 600;
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var args = event.getArgs();

    if (command.equalsIgnoreCase("roulette")) {
        if (args.length == 0) {
            var d1 = $.randRange(1, 2);
            var d2 = $.randRange(1, 2);

    	 	var Win = new Array();
    	 	
    	    Win.push($.lang.get("net.phantombot.roulettecommand-Win1", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win2", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win3", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win4", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win5", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win1", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win2", username));
            Win.push($.lang.get("net.phantombot.roulettecommand-Win3", username));
	    Win.push($.lang.get("net.phantombot.roulettecommand-Win4", username));
	    Win.push($.lang.get("net.phantombot.roulettecommand-Win5", username));
	    Win.push($.lang.get("net.phantombot.roulettecommand-Win1", username));
    	 	
    	 	var lost = new Array();

    	    lost.push($.lang.get("net.phantombot.roulettecommand-lost1", username));
            lost.push($.lang.get("net.phantombot.roulettecommand-lost2", username));
	    lost.push($.lang.get("net.phantombot.roulettecommand-lost3", username));
	    lost.push($.lang.get("net.phantombot.roulettecommand-lost4", username));
	    lost.push($.lang.get("net.phantombot.roulettecommand-lost5", username));
	    lost.push($.lang.get("net.phantombot.roulettecommand-lost6", username));
	    lost.push($.lang.get("net.phantombot.roulettecommand-lost7", username));

            var lostmod = new Array();

            lostmod.push($.lang.get("net.phantombot.roulettecommand-lostmod1", username));
            lostmod.push($.lang.get("net.phantombot.roulettecommand-lostmod2", username));
            lostmod.push($.lang.get("net.phantombot.roulettecommand-lostmod3", username));
            lostmod.push($.lang.get("net.phantombot.roulettecommand-lostmod4", username));
            lostmod.push($.lang.get("net.phantombot.roulettecommand-lostmod5", username));
                 
    	 	if (d1 == d2) {
    	 		do {
    	 			var s = $.randElement(Win);
    	 		} while (s.equalsIgnoreCase($.lastRandomWin) && Win.length > 1);
    	 		$.say(s);
                return;	
    	 	} else {
    	 		do {
    	 			var s = $.randElement(lost);  
    	 		} while (s.equalsIgnoreCase($.lastRandomlost) && lost.length > 1);
                if (!$.isModv3(sender, event.getTags())) {
                    $.say(s);
                    setTimeout(function() {$.say(".timeout "+ username +" "+ roulettetimeout);},2000);
                    setTimeout(function() {$.say(".timeout "+ username +" "+ roulettetimeout);},2000);
                    return;
                }
                var m = $.randElement(lostmod);
                while (m.equalsIgnoreCase($.lastRandomlostmod) && lostmod.length > 1);
                $.say(m);
                return;
            }
        }
    }

    if (command.equalsIgnoreCase("roulettetimeouttime")) {
        if (!$.isAdmin(sender)) {
            $.say($.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }

    $.inidb.set('settings', 'roulettetimeout', parseInt(args[0]));
    $.roulettetimeout = parseInt(args[0]);
    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.roulettecommand-timeout-time", $.roulettetimeout));
    
    }
});
$.registerChatCommand("./commands/rouletteCommand.js", "roulette");
$.registerChatCommand("./commands/rouletteCommand.js", "roulettecooldown");
$.registerChatCommand("./commands/rouletteCommand.js", "roulettetimeouttime");
