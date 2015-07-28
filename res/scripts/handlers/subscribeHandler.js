$.subscribemode = $.inidb.get('settings', 'subscribemode');
$.sub_silentmode = $.inidb.get('settings', 'sub_silentmode');

if ($.sub_silentmode == null || $.sub_silentmode == undefined) {
    $.inidb.set('settings', 'sub_silentmode', '1');
    $.sub_silentmode = $.inidb.get('settings', 'sub_silentmode');
}

if ($.subscribemode == null || $.subscribemode == undefined) {
    $.inidb.set('settings', 'subscribemode', 'auto');
    $.subscribemode = $.inidb.get('settings', 'subscribemode');
}

if ($.subscribemode.equalsIgnoreCase("twitchnotify")) {
    $.announceSubscribes = true;
}

$.on('twitchSubscribe', function(event) {
    var subscriber = event.getSubscriber().toLowerCase();
    var username = $.username.resolve(subscriber);
    var subscribed = $.inidb.get('subscribed', subscriber);
    
    if (subscribed == null || subscribed == undefined || subscribed.isEmpty()) {
        $.inidb.set('subscribed', subscriber, 1);      
    } 
    
    if (subscribed.equalsIgnoreCase("0")) {
        $.inidb.set('subscribed', subscriber, 1);
    }
    
    if($.isAdmin(subscriber)==false || $.isModv3(subscriber, event.getTags())==false) {
        $.inidb.set("tempsubgroup", subscriber, $.inidb.get("group",subscriber));
        $.inidb.set("group", subscriber, 3);
    }
    
    if ($.announceSubscribes) {
        var s = $.inidb.get('settings', 'subscribemessage');
        var p = parseInt($.inidb.get('settings', 'subscribereward'));
            
        if (s == null || s == undefined || $.strlen(s) == 0) {
            if ($.moduleEnabled("./systems/pointSystem.js")) {
                s = "Thanks for the subscription (name)! +(reward) (pointname)!";
            } else {
                s = "Thanks for the subscription (name)!";
            }
        }
            
        if (isNaN(p)) {
            p = 100;
        }
            
        while (s.indexOf('(name)') != -1) {
            s = s.replace('(name)', username);
        }
            
        if ($.moduleEnabled("./systems/pointSystem.js")) {
            while (s.indexOf('(pointname)') != -1) {
                s = s.replace('(pointname)', $.pointname);
            }
                
            while (s.indexOf('(reward)') != -1) {
                s = s.replace('(reward)', p);
            }
        }
        if($.sub_silentmode==0) {
            $.say(s);
        }
    }
        
    if ($.moduleEnabled("./systems/pointSystem.js") && p > 0) {
        $.inidb.incr('points', subscriber, p);
    }
 
});

$.on('twitchUnsubscribe', function(event) {
    var subscriber = event.getSubscriber().toLowerCase();
    var username = $.username.resolve(subscriber);

    var subscribed = $.inidb.get('subscribed', subscriber);
    
    if (subscribed == null || subscribed == undefined || subscribed.isEmpty()) {
        return;
    }
    
    if (subscribed.equalsIgnoreCase("1")) {
        $.inidb.set('subscribed', subscriber, 0);
    }
    if($.isAdmin(subscriber)==false || $.isModv3(subscriber, event.getTags())==false) {
        $.inidb.set("group", subscriber, $.inidb.get("tempsubgroup", subscriber));
    }
    

});

$.on('twitchSubscribesInitialized', function(event) {
    println(">>Enabling new subscriber announcements");
    if($.sub_silentmode==0) {
        $.announceSubscribes = true;
    }
});

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    
    if (command.equalsIgnoreCase("subscribemessage")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            $.say("The current new subscriber message is: " + $.inidb.get('settings', 'subscribemessage'));
            
            var s = "To change it use '!subscribemessage <message>'. You can also add the string '(name)' to put the subscribers name";
            
            if ($.moduleEnabled("./systems/pointSystem.js")) {
                s += ", '(reward)' to put the number of points received for subscribing, and '(pointname)' to put the name of your points";
            }
            
            $.say(s);
        } else {
            $.logEvent("subscribeHandler.js", 107, username + " changed the new subscriber message to: " + argsString);
            
            $.inidb.set('settings', 'subscribemessage', argsString);
            
            $.say("New subscriber message set to!");
        }
    }
    
    if (command.equalsIgnoreCase("subsilentmode")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if($.sub_silentmode==1) {
            $.inidb.set("settings", 'sub_silentmode', 0);
            $.say('Subscribe handler now set to silent mode');
            $.sub_silentmode=0;
            return;
        } else if($.sub_silentmode==0) {
            $.inidb.set("settings", 'sub_silentmode', 1);
            $.say('Subscribe handler now set to verbose mode');
            $.sub_silentmode=1;
            return;
        }
    }
    
    if (command.equalsIgnoreCase("subscribereward")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'subscribereward')) {
                $.say("The current new subscriber reward is " + $.inidb.get('settings', 'subscribereward') + " points! To change it use '!subscribereward <reward>'");
            } else {
                $.say("The current new subscriber reward is 100 points! To change it use '!subscribereward <reward>'");
            }
        } else {
            if (parseInt(argsString) < 0) {
                $.say("Please put a valid reward greater than or equal to 0!");
                return;
            }
            
            $.logEvent("subscribeHandler.js", 133, username + " changed the new subscriber points reward to: " + argsString);
            
            $.inidb.set('settings', 'subscribereward', argsString);
            
            $.say("New subscriber reward set to " + argsString + " " + $.pointname + "!");
        }
    }
    
    if (command.equalsIgnoreCase("subscribecount")) {
        var keys = $.inidb.GetKeyList("subscribed", "");
        var count = 0;
        if(!$.isAdmin(sender)) {
            $.say("You must be an Administrator to use this command");
            return;
        }
        
        for (i = 0; i < keys.length; i++) {
            if ($.inidb.get("subscribed", keys[i]).equalsIgnoreCase("1")) {
                count++;
            }
        }
        $.println("There are currently " + count + " subscribers!");
    }
    
    if (command.equalsIgnoreCase("subscribemode")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            $.say("Currently using " + $.subscribemode + " subscription detection. twitchnotify mode does not save to the database. To change it use '!subscribemode <auto or twitchnotify>'");
            
            return;
        }
        
        if (argsString.equalsIgnoreCase("twitchnotify")) {
            $.logEvent("subscribeHandler.js", 167, username + " changed the new subscriber detection method to twitchnotify");
            
            $.announceSubscribes = true;
            
            $.inidb.set('settings', 'subscribemode', 'twitchnotify');
            
            $.say("Switched to twitchnotify subscription detection!");
        } else {
            $.logEvent("subscribeHandler.js", 175, username + " changed the new subscriber detection method to auto");
            
            $.inidb.set('settings', 'subscribemode', 'auto');
            
            $.say("Switched to auto subscription detection!");
        }
        
        $.subscribemode = $.inidb.get('settings', 'subscribemode');
    }
});

$.on('ircPrivateMessage', function(event) {
    if (event.getSender().equalsIgnoreCase("twitchnotify")) {
        var message = event.getMessage().toLowerCase();

        if (message.indexOf("just subscribed!") != -1 && message.indexOf("months in a row!") == -1) {
            var spl = message.split(" ");
            var EventBus = Packages.me.mast3rplan.phantombot.event.EventBus;
            var TwitchSubscribeEvent = Packages.me.mast3rplan.phantombot.event.twitch.subscriber.TwitchSubscribeEvent;
            
            EventBus.instance().post(new TwitchSubscribeEvent(spl[0]));
        }
    } 
});

setTimeout(function(){ 
    if ($.moduleEnabled('./handlers/subscribeHandler.js')) {
        $.registerChatCommand("./handlers/subscribeHandler.js", "subscribemessage", "admin");
        $.registerChatCommand("./handlers/subscribeHandler.js", "subsilentmode", "admin");
        $.registerChatCommand("./handlers/subscribeHandler.js", "subscribereward", "admin");
        $.registerChatCommand("./handlers/subscribeHandler.js", "subscribecount");
        $.registerChatCommand("./handlers/subscribeHandler.js", "subscribemode", "admin");
    }
},10*1000);


$.timer.addTimer("./handlers/subscribeHandler.js", "subscribehandler", true, function() {
    if (!$.moduleEnabled("./handlers/subscribeHandler.js")) {
        $.subscribers.doRun(false);
    } else {
        if ($.subscribemode.equalsIgnoreCase("twitchnotify")) {
            $.subscribers.doRun(false);
        } else {
            $.subscribers.doRun(true);
        }
    }
}, 60 * 1000);

var keys = $.inidb.GetKeyList("subscribed", "");

for (var i = 0; i < keys.length; i++) {
    if ($.inidb.get("subscribed", keys[i]).equalsIgnoreCase("1")) {
        $.subscribers.addSubscriber(keys[i]);
    }
}