$.subscribemode = $.inidb.get('settings', 'subscribemode');

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
        if (!$.subscribemode.equalsIgnoreCase("twitchnotify")) {
            $.inidb.set('subscribed', subscriber, 1);
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

            $.say(s);
        }
        
        if ($.moduleEnabled("./systems/pointSystem.js") && p > 0) {
            $.inidb.incr('points', subscriber, p);
        }
    } else if (subscribed.equalsIgnoreCase("0") && !$.subscribemode.equalsIgnoreCase("twitchnotify")) {
        $.inidb.set('subscribed', subscriber, 1);
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
});

$.on('twitchSubscribesInitialized', function(event) {
    println(">>Enabling new subscriber announcements");
    
    $.announceSubscribes = true;
});

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
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
            
            $.say("New subscriber reward set to " + argsString + " " + $.pointsname + "!");
        }
    }
    
    if (command.equalsIgnoreCase("subscribecount")) {
        var keys = $.inidb.GetKeyList("subscribed", "");
        var count = 0;
        
        for (i = 0; i < keys.length; i++) {
            if ($.inidb.get("subscribed", keys[i]).equalsIgnoreCase("1")) {
                count++;
            }
        }
        
        $.say("There are currently " + count + " subscribers!");
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

$.registerChatCommand("./subscribeHandler.js", "subscribemessage", "admin");
$.registerChatCommand("./subscribeHandler.js", "subscribereward", "admin");
$.registerChatCommand("./subscribeHandler.js", "subscribecount");
$.registerChatCommand("./subscribeHandler.js", "subscribemode", "admin");


$.setInterval(function() {
    if (!$.moduleEnabled("./subscribeHandler.js")) {
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