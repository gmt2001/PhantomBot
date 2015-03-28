if ($.lastfollow == undefined || $.lastfollow == null) {
    $.lastfollow = 0;
    $.followtrain = 0;
}



$.on('twitchFollow', function(event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);
    var followed = $.inidb.get('followed', follower);
    
    if (followed == null || followed == undefined || followed.isEmpty()) {
        $.inidb.set('followed', follower, 1);
        var p = parseInt($.inidb.get('settings', 'followreward'));
        
        if (isNaN(p)) {
            p = 100;
        }
        
        if ($.announceFollows && $.moduleEnabled("./followHandler.js")) {
            var s = $.inidb.get('settings', 'followmessage');
            
            if (s == null || s == undefined || $.strlen(s) == 0) {
                if ($.moduleEnabled("./systems/pointSystem.js")) {
                    s = "Thanks for the follow (name)! +(reward) (pointname)!";
                } else {
                    s = "Thanks for the follow (name)!";
                }
            }
            
            while (s.indexOf('(name)') != -1) {
                s = s.replace('(name)', username);
            }
            
            if ($.moduleEnabled("./systems/pointSystem.js")) {
                while (s.indexOf('(pointname)') != -1) {
                    s = s.replace('(pointname)', $.pointname);
                }
                
                while (s.indexOf('(reward)') != -1) {
                    s = s.replace('(reward)', p.toString());
                }
            }
            
            $.followtrain++;
            $.lastfollow = System.currentTimeMillis();
            
            if (!$.timer.hasTimer("./followHandler.js", "followtrain", true)) {
                $.timer.addTimer("./followHandler.js", "followtrain", true, function() {
                    $.checkFollowTrain();
                }, 1000);
            }

            $.say(s);
        }
        
        if ($.moduleEnabled("./systems/pointSystem.js") && p > 0) {
            $.inidb.incr('points', follower, p);
        }
    } else if (followed.equalsIgnoreCase("0")) {
        $.inidb.set('followed', follower, 1);
    }
});

$.on('twitchUnfollow', function(event) {
    var follower = event.getFollower().toLowerCase();
    var username = $.username.resolve(follower);

    var followed = $.inidb.get('followed', follower);
    
    if (followed == null || followed == undefined || followed.isEmpty()) {
        return;
    }
    
    if (followed.equalsIgnoreCase("1")) {
        $.inidb.set('followed', follower, 0);
    }
});

$.on('twitchFollowsInitialized', function(event) {
    println(">>Enabling new follower announcements");
    
    $.announceFollows = true;
});

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
	
    if (command.equalsIgnoreCase("follow")) {
        $.say("!followmessage <message>, !followreward <amount>");
    }
	
    if (command.equalsIgnoreCase("followmessage")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            $.say("The current new follower message is: " + $.inidb.get('settings', 'followmessage'));
            
            var s = "To change it use '!followmessage <message>'. You can also add the string '(name)' to put the followers name";
            
            if ($.moduleEnabled("./systems/pointSystem.js")) {
                s += ", '(reward)' to put the number of points received for following, and '(pointname)' to put the name of your points";
            }
            
            $.say(s);
        } else {
            $.logEvent("followHandler.js", 108, username + " changed the new follower message to: " + argsString);
            
            $.inidb.set('settings', 'followmessage', argsString);
            
            $.say("New follower message set!");
        }
    }
    
    if (command.equalsIgnoreCase("followreward")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'followreward')) {
                $.say("The current new follower reward is " + $.inidb.get('settings', 'followreward') + " points! To change it use '!followreward <reward>'");
            } else {
                $.say("The current new follower reward is 100 points! To change it use '!followreward <reward>'");
            }
        } else {
            if (!parseInt(argsString) < 0) {
                $.say("Please put a valid reward greater than or equal to 0!");
                return;
            }
            
            $.logEvent("followHandler.js", 134, username + " changed the new follower points reward to: " + argsString);
            
            $.inidb.set('settings', 'followreward', argsString);
            
            $.say("New follower reward set!");
        }
    }
    
});

$.registerChatCommand("./followHandler.js", "followmessage", "admin");
$.registerChatCommand("./followHandler.js", "followreward", "admin");
$.registerChatCommand("./followHandler.js", "followcount");

$.checkFollowTrain = function() {
    if (System.currentTimeMillis() - $.lastfollow > 65 * 1000) {
        $.timer.clearTimer("./followHandler.js", "followtrain", true);
        $.followtimer = null;
        
        if ($.followtrain > 1) {
            if ($.followtrain == 3) {
                $.say("Triple follow!!");
            } else if ($.followtrain == 4) {
                $.say("Quadra follow!!");
            } else if ($.followtrain == 5) {
                $.say("Penta follow!!");
            } else if ($.followtrain > 5 && $.followtrain <= 10) {
                $.say("Mega follow train!! (" + $.followtrain + ")");
            } else if ($.followtrain > 10 && $.followtrain <= 20) {
                $.say("Ultra follow train!! (" + $.followtrain + ")");
            } else if ($.followtrain > 20) {
                $.say("Unbelievable follow train!! (" + $.followtrain + ")");
            }
        }
        
        $.followtrain = 0;
    }
};

var keys = $.inidb.GetKeyList("followed", "");

for (var i = 0; i < keys.length; i++) {
    if ($.inidb.get("followed", keys[i]).equalsIgnoreCase("1")) {
        $.followers.addFollower(keys[i]);
    }
}