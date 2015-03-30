$.peninterval = parseInt($.inidb.get('settings', 'pointinterval'));
$.penofflineinterval = parseInt($.inidb.get('settings', 'offlineinterval'));

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var args = event.getArgs();

	
    if (command.equalsIgnoreCase("penalty")) {

        if ($.isMod(sender)) {
            var amount = parseInt($.inidb.get('penalty', args[0] + "_points")); 
       
            if (!args.length > 0) {
                $.say("Usage: !penalty <name>, !penalty <name> <amount>");
            } else if (args.length == 1) {
                if ($.inidb.get('penalty', args[0]) == null || $.inidb.get('penalty', args[0]) == "false") {
                    $.say($.username.resolve(args[0]) + " has been penalized by " + username);
                    $.inidb.set('penalty', args[0], "true");
                    $.inidb.set('penalty', args[0] + "_points", 0);
                } else {
                    $.say(username + " has lifted the penalty on " + $.username.resolve(args[0]) + " thus returning " + amount + " " + $.pointname + ".");
                    $.inidb.set('penalty', args[0], "false");
                    $.inidb.incr('points', args[0], parseInt(amount));
                    $.inidb.set('penalty', args[0] + "_threshold", 0);
                } 
            }
        
            if (args.length > 1) {
        
                if ($.inidb.get('penalty', args[0]) == null || $.inidb.get('penalty', args[0]) == "false") {
                    $.say($.username.resolve(args[0]) + " has been penalized by " + username + " for " + args[1] + " " + $.pointname + ".");
                    $.inidb.set('penalty', args[0], "true");
                    $.inidb.set('penalty', args[0] + "_points", 0);
                    $.inidb.set('penalty', args[0] + "_threshold", args[1]);
                } else {
                    $.say(username + " has lifted the penalty on " + $.username.resolve(args[0]) + " thus returning " + amount + " " + $.pointname + ".");
                    $.inidb.set('penalty', args[0], "false");
                    $.inidb.incr('points', args[0], parseInt(amount));
                    $.inidb.set('penalty', args[0] + "_threshold", 0);
                } 
            }
        /* Viewer else statement */
        } else {
            
            if (!args.length > 0) {
                $.say("Usage: !penalty <name>, !penalty <name> <amount>");
            } else if (args.length == 1) {
                if ($.inidb.get('penalty', args[0]) == null || $.inidb.get('penalty', args[0]) == "false") {
                    $.say( $.username.resolve(args[0]) + " hasn't been penalized for anything.");
                } else {
                    var penaltythreshold = $.inidb.get('penalty', args[0] + "_threshold");
                    if (penaltythreshold == null) {
                        penaltythreshold = 0;
                    }
                    $.say ($.username.resolve(args[0]) + " was penalized for: " + penaltythreshold + " " + $.pointname + ".");  
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

    if ($.penlastpointinterval == null || $.penlastpointinterval == undefined) {
        $.penlastpointinterval = System.currentTimeMillis();
        return;
    }

    if (!$.isOnline($.channelName)) {
        amount = $.offlinegain;
        if ($.penlastpointinterval + ($.penofflineinterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    } else {
        amount = $.pointgain;
        if ($.penlastpointinterval + ($.peninterval * 60 * 1000) >= System.currentTimeMillis()) {
            return;
        }
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();
        if ($.inidb.get('penalty', nick) == "true") {
            $.inidb.decr('points', nick, parseInt(amount));
            $.inidb.incr('penalty', nick + "_points", parseInt(amount));
        }
        var penaltypoints = parseInt($.inidb.get('penalty', nick + "_points"));
        var penaltythreshold = parseInt($.inidb.get('penalty', nick + "_threshold"));
        
        if (penaltypoints >= penaltythreshold && $.inidb.get('penalty', nick) == "true") {
            $.say($.username.resolve(nick) + "'s penalty has been lifted thus returning " + penaltypoints + " " + $.pointname + ".");
            $.inidb.set('penalty', nick, "false");
            $.inidb.incr('points', nick, parseInt(penaltypoints));
            $.inidb.set('penalty', nick + "_threshold", 0);
        }
    }

    $.penlastpointinterval = System.currentTimeMillis();
}, 1000);

$.registerChatCommand("./systems/penaltySystem.js", "penalty");