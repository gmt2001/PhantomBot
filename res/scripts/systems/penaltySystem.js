$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
	
    if (command.equalsIgnoreCase("penalty")) {
        args[0] = $.username.resolve(args[0]);
        var penalty = parseInt($.inidb.get('penalty', args[0] + "_points"));
    	var m = "";
	if (!isNaN(parseInt(args[1]))) {
		m = args[0] + " has been penalized by " + username + " for " + args[1] + " " + $.pointname + "!";
	} else {
		m = args[0] + " has been penalized by " + username + " until further notice!";
	}
		
        if (args.length < 0) {
            $.say("Usage: !penalty <name> or !penalty <name> <amount>- Penalizes a viewer.");
            return;
        } else {
            if ($.inidb.get('penalty', args[0]) == null || $.inidb.get('penalty', args[0]) == "false") {
                $.inidb.set('penalty', args[0], "true");
		$.inidb.set('penalty', args[0] + "_threshold", args[1]);
                $.say(m);

            } else if ($.inidb.get('penalty', args[0]) == "true") {

            $.say(username + " has been un-penalized by " + username + "!");
            $.inidb.set('penalty', args[0], "false");
            $.inidb.incr('points', args[0], penalty);
	    if (!$.inidb.get('penalty', args[0] + "_points") <= 0) {
		$.inidb.decr('penalty', args[0] + "_points", penalty);
            } 

        }
    }
}

});

$.setInterval(function() {
    var amount;
    if (!$.moduleEnabled("./systems/pointSystem.js")) {
        return;
    }

    if ($.lastpointinterval == null || $.lastpointinterval == undefined) {
        $.lastpointinterval = System.currentTimeMillis();
        return;
    }

    if (!$.isOnline($.channelName)) {
        amount = $.offlinegain;
        if ($.lastpointinterval + ($.offlineinterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    } else {
        amount = $.pointgain;
        if ($.lastpointinterval + ($.pointinterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.username.resolve($.users[i][0]);
        amount = amount + ($.pointbonus * $.getUserGroupId(nick));
        if ($.inidb.get('penalty', nick) == "true") {
            $.inidb.incr('penalty', nick + "_points", amount);
            $.inidb.decr('points', nick, amount);

        }
		
	var points = parseInt($.inidb.get('points', nick));
        var penalty = parseInt($.inidb.get('penalty', nick + "_points"));
	
	if ($.inidb.get('penalty', nick + "_points") == $.inidb.get('penalty', nick + "_threshold")) {
            //$.say(nick + " has reached his penalty sentence! All points that were been penalized have been returned.");
            $.inidb.set('penalty', nick, "false");
            $.inidb.incr('points', nick, penalty);
            $.inidb.set('penalty', nick + "_points", 0);
	}
		
    }
    $.lastpointinterval = System.currentTimeMillis();
}, 1000);

$.registerChatCommand("./systems/penaltySystem.js", "penalty");