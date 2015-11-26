$.subscribemode = $.inidb.get('settings', 'subscribemode');
$.sub_silentmode = $.inidb.get('settings', 'sub_silentmode');
$.subscribeMessage = $.inidb.get('settings', 'subscribemessage');
        
if ($.subscribemode == null || $.subscribemode == undefined) {
    $.inidb.set('settings', 'subscribemode', 'auto');
    $.subscribemode = $.inidb.get('settings', 'subscribemode');
}

if ($.sub_silentmode == null || $.sub_silentmode == undefined) {
    $.inidb.set('settings', 'sub_silentmode', '1');
    $.sub_silentmode = $.inidb.get('settings', 'sub_silentmode');
}

if ($.subscribeMessage == null || $.subscribeMessage == undefined || $.strlen($.subscribeMessage) == 0 || $.subscribeMessage == "") {
    if ($.moduleEnabled("./systems/pointSystem.js")) {
        if ($.subscribereward < 1) {
            $.subscribeMessage = $.lang.get("net.phantombot.subscribeHandler.default-sub-message-with-points");
        } else if ($.subscribereward > 0 && $.moduleEnabled('./systems/pointSystem.js')) {
            $.subscribeMessage = $.lang.get("net.phantombot.subscribeHandler.default-sub-message-with-points");
        }
    } else {
        $.subscribeMessage = $.lang.get("net.phantombot.subscribeHandler.default-sub-message");
    }
}

if ($.subscribemode.equalsIgnoreCase("twitchnotify")) {
    $.announceSubscribes = true;
}

$.on('twitchSubscribe', function(event) {

    var subscriber = event.getSubscriber().toLowerCase();
    var username = $.username.resolve(subscriber);
    var subscribed = $.inidb.get('subscribed', subscriber);
    
    if (subscribed == null || subscribed == undefined || subscribed.isEmpty() || parseInt(subscribed) == 0) {
        $.inidb.set('subscribed', subscriber, 1);      
    } 
    
    if ($.isAdmin(subscriber, event.getChannel()) == false || !$.isMod(subscriber, event.getTags(), event.getChannel()) == false) {
        $.inidb.set("tempsubgroup", subscriber, $.inidb.get("group",subscriber));
        $.inidb.set("group", subscriber, 3);
    }
    
    if ($.announceSubscribes) {

        var p = parseInt($.inidb.get('settings', 'subscribereward'));
        var s = $.subscribeMessage;


        if (isNaN(p)) {
            p = 100;
        }

        s = $.replaceAll(s, '(name)', username);

        if ($.moduleEnabled("./systems/pointSystem.js")) {
            s = $.replaceAll(s, '(pointname)', $.getPointsString(p));
            s = $.replaceAll(s, '(reward)', p.toString());
        }
        
        if ($.sub_silentmode == 0) {
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

    if ($.isAdmin(subscriber, event.getChannel()) == false || !$.isMod(subscriber, event.getTags(), event.getChannel()) == false) {
        $.inidb.set("group", subscriber, $.inidb.get("tempsubgroup", subscriber));
    }
});

$.on('twitchSubscribesInitialized', function(event) {
    println(">>Enabling new subscriber announcements");

    $.announceSubscribes = true;
});

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    
    if (command.equalsIgnoreCase("subsilentmode")) {
        if (!$.isAdmin(sender, event.getChannel())) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        
        if ($.sub_silentmode == 1) {
            $.inidb.set("settings", 'sub_silentmode', 0);
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.sub-silent-mode-on"));
            $.sub_silentmode = 0;
            return;
        } else if($.sub_silentmode == 0) {
            $.inidb.set("settings", 'sub_silentmode', 1);
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.sub-silent-mode-off"));
            $.sub_silentmode = 1;
            return;
        }
    }
    
    if (command.equalsIgnoreCase("subscribereward")) {
        if (!$.isAdmin(sender, event.getChannel())) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }

        var reward = $.inidb.get('settings', 'subscribereward');
        if (reward == null) {
            reward = 0;
        }
        
        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'subscribereward')) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.new-sub-current-reward", reward, $.pointname));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.new-sub-current-reward", reward, $.pointname));
                return;
            }
        } else {
            if (parseInt(argsString) < 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.sub-reward-error"));
                return;
            }
            
            $.logEvent("subscribeHandler.js", 133, username + " changed the new subscriber points reward to: " + argsString);
            
            $.inidb.set('settings', 'subscribereward', argsString);
            
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.new-sub-reward-set", argsString, $.getPointsString($.argsString)));
            return;
        }
    }
    
    if (command.equalsIgnoreCase("subscribecount")) {
        var keys = $.inidb.GetKeyList("subscribed", "");
        var count = 0;
        if (!$.isAdmin(sender, event.getChannel())) {   
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        
        for (i = 0; i < keys.length; i++) {
            if ($.inidb.get("subscribed", keys[i]).equalsIgnoreCase("1")) {
                count++;
            }
        }
        $.println($.lang.get("net.phantombot.subscribeHandler.current-subs", count));
        return;
    }
    
    if (command.equalsIgnoreCase("subscribemessage")) {		
        if (!$.isAdmin(sender, event.getChannel())) {		
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));		
            return;		
        }		
        		
        if ($.strlen(argsString) == 0) {
            
            
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.current.sub-message", $.subscribeMessage));		
            		
            var s = $.lang.get("net.phantombot.subscribeHandler.sub-message-usage");		
            		
            if ($.moduleEnabled("./systems/pointSystem.js")) {		
                s += $.lang.get("net.phantombot.subscribeHandler.sub-message-points-usage");		
                return;		
            }		
            		
            $.say($.getWhisperString(sender) + s);		
            return;		
        } else {		
            $.logEvent("subscribeHandler.js", 107, username + " changed the new subscriber message to: " + argsString);		
            		
            $.inidb.set('settings', 'subscribemessage', argsString);
            $.subscribeMessage = $.inidb.get('settings', 'subscribemessage');
            		
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.new-sub-message-set"));		
            return;		
        }		
    }
    
    if (command.equalsIgnoreCase("subscribemode")) {
        if (!$.isAdmin(sender, event.getChannel())) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        
        if ($.strlen(argsString) == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.current-sub-mode", $.subscribemode));
            return;
        }
        
        if (argsString.equalsIgnoreCase("twitchnotify")) {
            $.logEvent("subscribeHandler.js", 167, username + " changed the new subscriber detection method to twitchnotify");
            
            $.announceSubscribes = true;
            
            $.inidb.set('settings', 'subscribemode', 'twitchnotify');
            
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.changed-sub-mode-twitchnotify"));
            return;
        } else {
            $.logEvent("subscribeHandler.js", 175, username + " changed the new subscriber detection method to auto");
            
            $.inidb.set('settings', 'subscribemode', 'auto');
            
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.subscribeHandler.changed-sub-mode-auto"));
            return;
        }
        
        $.subscribemode = $.inidb.get('settings', 'subscribemode');
    }
});

$.on('ircPrivateMessage', function(event) {
    if (event.getSender().equalsIgnoreCase("twitchnotify")) {
        var message = event.getMessage().toLowerCase();
        if (message.indexOf("just subscribed") != -1 || message.indexOf("subscribed for") != -1) {
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
},10 * 1000);

$.timer.addTimer("./handlers/subscribeHandler.js", "subscribehandler", true, function() {
    if (!$.moduleEnabled("./handlers/subscribeHandler.js")) {
        Packages.me.mast3rplan.phantombot.cache.SubscribersCache.instance($.channelName).doRun(false);
    } else {
        if ($.subscribemode.equalsIgnoreCase("twitchnotify")) {
            Packages.me.mast3rplan.phantombot.cache.SubscribersCache.instance($.channelName).doRun(false);
        } else {
            Packages.me.mast3rplan.phantombot.cache.SubscribersCache.instance($.channelName).doRun(true);
        }
    }
}, 60 * 1000);

var keys = $.inidb.GetKeyList("subscribed", "");

for (var i = 0; i < keys.length; i++) {
    if ($.inidb.get("subscribed", keys[i]).equalsIgnoreCase("1")) {
        Packages.me.mast3rplan.phantombot.cache.SubscribersCache.instance($.channelName).addSubscriber(keys[i]);
    }
}
