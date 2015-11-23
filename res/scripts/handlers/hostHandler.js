$.hostreward = parseInt($.inidb.get('settings', 'hostreward'));
$.hosttimeout = parseInt($.inidb.get('settings', 'hosttimeout'));
$.hostMessage = $.inidb.get('settings', 'hostmessage');

if ($.hostlist == null || $.hostlist == undefined) {
    $.hostlist = new Array();
}

if ($.hosttimeout == null || $.hosttimeout == undefined || isNaN($.hosttimeout)) {
    $.hosttimeout = 60 * 60 * 1000;
} else {
    $.hosttimeout = $.hosttimeout * 60 * 1000;
}

if ($.hostreward == null || $.hostreward == undefined || isNaN($.hostreward)) {
    $.hostreward = 0;
}

if ($.hostMessage == null || $.hostMessage == undefined || $.strlen($.hostMessage) == 0) {
    if ($.moduleEnabled("./systems/pointSystem.js")) {
        if ($.hostreward < 1) {
            $.hostMessage = $.lang.get("net.phantombot.hosthandler.default-host-welcome-message");
        } else if ($.hostreward > 0 && $.moduleEnabled('./systems/pointSystem.js')) {
            $.hostMessage = $.lang.get("net.phantombot.hosthandler.default-host-welcome-message-and-reward", $.getPointsString($.hostreward));
        }
    } else {
        $.hostMessage = $.lang.get("net.phantombot.hosthandler.default-host-welcome-message");
    }
}

$.isHostUser = function (user) {
    return $.array.contains($.hostlist, user.toLowerCase());
}

$.on('twitchHosted', function (event) {
    var username = $.username.resolve(event.getHoster());
    var group = $.inidb.get('group', username.toLowerCase());
    var s = $.hostMessage;

    if (group == null) {
        group = 'Viewer';
    }

    if ($.announceHosts && $.moduleEnabled("./handlers/hostHandler.js") && ($.hostlist[username.toLowerCase()] == null || $.hostlist[username.toLowerCase()] == undefined || $.hostlist[username.toLowerCase()] < System.currentTimeMillis())) {
        if ($.hostreward > 0) {
            $.inidb.incr('points', username.toLowerCase(), $.hostreward);
        }
        
        s = $.replaceAll(s, '(name)', username);
        $.say(s);
    }

    $.hostlist[username.toLowerCase()] = System.currentTimeMillis() + $.hosttimeout;

    $.hostlist.push(username.toLowerCase());
});

$.on('twitchUnhosted', function (event) {
    var username = $.username.resolve(event.getHoster());

    $.hostlist[event.getHoster()] = System.currentTimeMillis() + $.hosttimeout;

    for (var i = 0; i < $.hostlist.length; i++) {
        if ($.hostlist[i].equalsIgnoreCase(username)) {
            $.hostlist.splice(i, 1);
            break;
        }
    }
});

$.on('twitchHostsInitialized', function (event) {
    println(">>Enabling new hoster announcements");

    $.announceHosts = true;
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();

    if (command.equalsIgnoreCase("hostreward")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if ($.strlen(argsString) == 0) {
            if ($.inidb.exists('settings', 'hostreward')) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-reward-current-and-usage", $.getPointsString($.hostreward)));
                return;
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-reward-current-and-usage", $.getPointsString($.hostreward)));
                return;
            }
        } else {
            if (!parseInt(argsString) < 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-reward-error"));
                return;
            }

            $.logEvent("hostHandler.js", 134, username + " changed the host points reward to: " + argsString);

            $.inidb.set('settings', 'hostreward', argsString);
            $.hostreward = parseInt(argsString);
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-reward-set-success"));
            return;
        }
    }
    
    if (command.equalsIgnoreCase("hostmessage")) {		
        if (!$.isAdmin(sender)) {		
            $.say($.getWhisperString(sender) + $.adminmsg);		
            return;		
        }		
				
        if ($.strlen(argsString) == 0) {		
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.current-host-message", $.hostMessage));		
		
            var s = $.lang.get("net.phantombot.hosthandler.host-message-usage");		
		
            $.say($.getWhisperString(sender) + s);		
            return;		
        } else {		
            $.logEvent("hostHandler.js", 73, username + " changed the new hoster message to: " + argsString);		
		
            $.inidb.set('settings', 'hostmessage', argsString);
            $.hostMessage = $.inidb.get('settings', 'hostmessage');
		
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-message-set-success"));		
            return;		
        }		
    }

    if (command.equalsIgnoreCase("hostcount")) {
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-count", $.hostlist.length));
        return;
    }

    if (command.equalsIgnoreCase("hosttime")) {
        if (args.length < 1) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-timeout-time", $.hosttimeout));
            return;
        } else if (args.length >= 1) {
            if (!$.isAdmin(sender)) {
                $.say($.getWhisperString(sender) + $.adminmsg);
                return;
            }
            if (parseInt(args[0]) < 30) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-timeout-time-error"));
                return;
            } else {
                $.inidb.set('settings', 'hosttimeout', parseInt(args[0]));
                $.hosttimeout = parseInt(args[0]);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-timeout-time-set", parseInt(args[0])));
                return;
            }
        }
    }

    if (command.equalsIgnoreCase("hostlist")) {
        var m = "";

        for (var b = 0; b < Math.ceil($.hostlist.length / 30); b++) {
            m = "";

            for (var i = (b * 30); i < Math.min($.hostlist.length, ((b + 1) * 30)); i++) {
                if ($.strlen(m) > 0) {
                    m += ", ";
                }

                m += $.hostlist[i];
            }

            if (b == 0) {
                $.say($.lang.get("net.phantombot.hosthandler.host-list", $.hostlist.length, m));
                return;
            } else {
                $.say(">>" + m);
                return;
            }
        }

        if ($.hostlist.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.hosthandler.host-list-error"));
            return;
        }
    }
});
setTimeout(function () {
    if ($.moduleEnabled('./handlers/hostHandler.js')) {
        $.registerChatCommand("./handlers/hostHandler.js", "hostmessage", "admin");
        $.registerChatCommand("./handlers/hostHandler.js", "hostreward");
        $.registerChatCommand("./handlers/hostHandler.js", "hosttime");
        $.registerChatCommand("./handlers/hostHandler.js", "hostcount");
        $.registerChatCommand("./handlers/hostHandler.js", "hostlist");
    }
}, 10 * 1000);
