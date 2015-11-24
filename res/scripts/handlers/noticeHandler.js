$.noticeinterval = parseInt($.inidb.get('notice', 'interval'));
$.noticemessages = parseInt($.inidb.get('notice', 'reqmessages'));
$.notices_toggle = $.inidb.get('notice', 'notices_toggle');

if ($.noticeinterval == undefined || $.noticeinterval == null || isNaN($.noticeinterval) || $.noticeinterval < 2) {
    $.noticeinterval = 10;
}

if ($.noticemessages == undefined || $.noticemessages == null || isNaN($.noticemessages)) {
    $.noticemessages = 25;
}

if ($.notices_toggle == undefined || $.notices_toggle == null) {
    $.notices_toggle = true;
}

$.messageCount = 0;

$.on('ircChannelMessage', function (event) {
    $.messageCount++;
});

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var num_messages = $.inidb.get('notice', 'num_messages');
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var action;
    var message;

    if (num_messages == null) {
        num_messages = 0;
    }

    if (command.equalsIgnoreCase("notice")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }

        action = args[0];
        message = args[1];

        if (action == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-usage"));
            return;
        }

        if (args.length >= 2) {
            message = argsString.substring(argsString.indexOf(action) + action.length() + 1)
        }

        if (action.equalsIgnoreCase("get")) {
            if (args.length < 2) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-get-usage", num_messages, (num_messages)));
                return;
            } else if ($.inidb.get('notices', 'message_' + message) == null) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-get-error", num_messages, (num_messages), args[1]));
                return;
            } else {
                $.say($.inidb.get('notices', 'message_' + message)); // no need for lang here because who set's the notice will have it in his lang.
                return;
            }
        }

        if (action.equalsIgnoreCase("insert")) {
            if (args.length < 3) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-insert-usage"));
                return;
            } else {
                var id = args[1];
                message = argsString.substring(argsString.indexOf(id) + id.length() + action.length() + 2);

                if (id < num_messages) {
                    for (var i = (num_messages - 1); i >= 0; i--) {
                        if (i > parseInt(id)) {
                            $.inidb.set('notices', 'message_' + (i + 1), $.inidb.get('notices', 'message_' + i));
                        }
                    }
                $.inidb.set('notices', 'message_' + parseInt(id), message);
            } else {
                $.inidb.set('notices', 'message_' + num_messages, message);
            }
                $.inidb.incr('notice', 'num_messages', 1);
                num_messages = $.inidb.get('notice', 'num_messages');

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-added-success", message, num_messages));
                return;
            }
        }

        if (action.equalsIgnoreCase("timer") || action.equalsIgnoreCase("interval")) {
            if (args.length < 2) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-current-interval", $.noticeinterval));
                return;
            } else {
                if (!isNaN(message) && parseInt(message) >= 2) {
                    $.inidb.set('notice', 'interval', message);
                    $.noticeinterval = parseInt(message);

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-interval-set-success", $.noticeinterval));
                    return;
                }
            }
        }
        
        if ($.inidb.get('notice', 'notices_toggle') == "true") {
            $.notices_toggle = true;
        } else if ($.inidb.get('notice', 'notices_toggle') == "false") {
            $.notices_toggle = false;
        }

        if (action.equalsIgnoreCase("config")) {
            if ($.notices_toggle == true) {
                var notices = $.lang.get("net.phantombot.noticehandler.notice-enabled");
            } else {
                notices = $.lang.get("net.phantombot.noticehandler.notice-disabled");
            }

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-config", notices, $.noticeinterval, $.noticemessages, num_messages));
            return;
        }

        if (action.equalsIgnoreCase("toggle")) {
            if (!$.isAdmin(sender)) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
                return;
            }

            if ($.notices_toggle == false) {
                $.notices_toggle = true;
                $.inidb.set('notice', 'notices_toggle', "true");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-toggle-on"));
                return;
                } else if ($.notices_toggle == true) {
                $.notices_toggle = false;
                $.inidb.set('notice', 'notices_toggle', "false");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-toggle-off"));
                return;
            }
        }

        if (action.equalsIgnoreCase("req")) {
            if (args.length < 2) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-req-message-usage", $.noticemessages));
                return;
            } else {
                if (!isNaN(message) && parseInt(message) >= 0) {
                    $.inidb.set('notice', 'reqmessages', message);
                    $.noticemessages = parseInt(message);

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.norice-req-message-set-success", $.noticemessages));
                    return;
                }
            }
        } else {  
            if (!args[0] == ("timer") || !args[0] == ("interval") || !args[0] == ("insert") || !args[0] == ("get") || !args[0] == ("toggle") || argsString.isEmpty()) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-usage"));
                return;
            }
        }
    }

    if (command.equalsIgnoreCase("addnotice")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }

        message = argsString;

        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-add-usage"));
            return;
        } 

        $.inidb.incr('notice', 'num_messages', 1);

        num_messages = $.inidb.get('notice', 'num_messages');

        $.inidb.set('notices', 'message_' + (num_messages - 1), message);
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-added-success", message, num_messages));
        return;
    }

    if (command.equalsIgnoreCase("delnotice")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        
        num_messages = $.inidb.get('notice', 'num_messages');

        if (args[0] == null) { // added check for if notice id is empty or it will delete a random notice.
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-remove-usage"));
            return;
        } else if ($.inidb.get('notices', 'message_' + args[0]) == null) { // added check for if notice id is wrong or does not exist.
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-remove-error2"));
            return;
        } else if (num_messages == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-remove-error"));
            return;
        }

        if (num_messages > 1) {
            for (i = 0; i < num_messages; i++) {
                if (i > parseInt(message)) {
                    $.inidb.set('notices', 'message_' + (i - 1), $.inidb.get('notices', 'message_' + i));
                }
            }
        }

        $.inidb.del('notices', 'message_' + args[0]);
        $.inidb.decr('notice', 'num_messages', 1);

        num_messages = $.inidb.get('notice', 'num_messages');

        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.noticehandler.notice-remove-success", num_messages));
        return;
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./handlers/noticeHandler.js')) {
        $.registerChatCommand("./handlers/noticeHandler.js", "notice");
        $.registerChatCommand("./handlers/noticeHandler.js", "delnotice");
        $.registerChatCommand("./handlers/noticeHandler.js", "addnotice");
    }
},10 * 1000);

$.messageTime = 0;
$.messageIndex = 0;

function sendMessage() {

    var num_messages = $.inidb.get('notice', 'num_messages');

    if (isNaN(parseInt(num_messages)) || parseInt(num_messages) == 0) {
        return;
    }
	
    if ($.inidb.get('notices', 'message_' + $.messageIndex) == null || $.inidb.get('notices', 'message_' + $.messageIndex) == " ") {
        return;
    }

    var message = $.inidb.get('notices', 'message_' + $.messageIndex);
    var cmds = "";
    
    if (message.toLowerCase().startsWith("(runcommand:") && message.indexOf(")") > 12) {
        message = message.substring(12);
        cmds = message.substring(0, message.indexOf(")"));
        message = message.substring(message.indexOf(")") + 1);
    }

    $.messageIndex++;

    if ($.messageIndex >= num_messages) {
        $.messageIndex = 0;
    }
    
    if ($.strlen(cmds) > 0) {
       var cmd = cmds;
       var prm = "";
       
       if (cmd.indexOf(" ") > 0) {
           cmd = cmd.substring(0, cmd.indexOf(" "));
           prm = cmd.substring(cmd.indexOf(" "));
       }
       
       var EventBus = Packages.me.mast3rplan.phantombot.event.EventBus;
       var CommandEvent = Packages.me.mast3rplan.phantombot.event.command.CommandEvent;
       
       EventBus.instance().post(new CommandEvent($.botname, cmd, prm));
    }
    
    if ($.strlen(message) > 0) {
       $.say(message);
       return;
    }
}

$.timer.addTimer("./handlers/noticeHandler.js", "notices", true, function() {
    if (!$.moduleEnabled("./handlers/noticeHandler.js")) {
        return;
    }
        
    if (($.messageTime + ($.noticeinterval * 60 * 1000)) < System.currentTimeMillis()) {
        if (($.messageCount >= $.noticemessages)) {

            if ($.notices_toggle == true) {
                sendMessage();
                $.messageCount = 0;
            }

            $.messageTime = System.currentTimeMillis();   
        }  
    }
}, 10000);
