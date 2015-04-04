$.noticeinterval = parseInt($.inidb.get('notices', 'interval'));
$.noticemessages = parseInt($.inidb.get('notices', 'reqmessages'));

if ($.noticeinterval == undefined || $.noticeinterval == null || isNaN($.noticeinterval) || $.noticeinterval < 2) {
    $.noticeinterval = 10;
}

if ($.noticemessages == undefined || $.noticemessages == null || isNaN($.noticemessages) || $.noticemessages < 5) {
    $.noticemessages = 25;
}


$.on('command', function (event) {
    var sender = event.getSender()
    var username = $.username.resolve(sender)
    var command = event.getCommand()
    var num_messages = $.inidb.get('notices', 'num_messages')
    var argsString = event.getArguments().trim()
    var args = event.getArgs();
    var action;
    var message;

    if (num_messages == null) {
        num_messages = 0;
    }

    if (command.equalsIgnoreCase("notice")) {
        if (args.length >= 1) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }

            action = args[0]
            message = args[1]

            if (args.length >= 2) {
                message = argsString.substring(argsString.indexOf(action) + action.length() + 1)
            }


            if (action.equalsIgnoreCase("get")) {
                if (args.length < 2) {
                    $.say("There are " + num_messages + " notices. Say '!notice get <id>' to get a messages content. Message IDs go from 0 to " + (num_messages));
                } else {
                    if ($.inidb.get('notices', 'message_' + message) == null) {
                        $.say("There are " + num_messages + " notices. Message IDs go from 0 to " + (num_messages) + " and " + args[1] + " isn't one of them");
                    } else {
                        $.say($.inidb.get('notices', 'message_' + message));
                    }
                }
            }

            if (action.equalsIgnoreCase("insert")) {
                if (args.length < 3) {
                    $.say("Insert an event into a specific slot, pushing the event currently in that slot and all others after it forward by one slot. !notice insert <id> <message>")
                } else {
                    var id = args[1]
                    message = argsString.substring(argsString.indexOf(id) + id.length() + action.length() + 2)

                    if (id < num_messages) {
                        for (var i = (num_messages - 1); i >= 0; i--) {
                            if (i > parseInt(id)) {
                                $.inidb.set('notices', 'message_' + (i + 1), $.inidb.get('notices', 'message_' + i))
                            }
                        }
                        $.inidb.set('notices', 'message_' + parseInt(id), message)
                    } else {
                        $.inidb.set('notices', 'message_' + num_messages, message)
                    }

                    $.inidb.incr('notices', 'num_messages', 1)

                    num_messages = $.inidb.get('notices', 'num_messages')

                    $.say("Notice added! '" + message + "' There are now " + num_messages + " notices!")
                }
            }

            if (action.equalsIgnoreCase("timer") || action.equalsIgnoreCase("interval")) {
                if (args.length < 2) {
                    $.say("The current interval is " + $.noticeinterval + " minutes. Set it with !notice timer <minutes> (Minimum is 2 minutes)");
                } else {
                    if (!isNaN(message) && parseInt(message) >= 2) {
                        $.inidb.set('notices', 'interval', message);
                        $.noticeinterval = parseInt(message);

                        $.say("The interval between notices has been set to " + $.noticeinterval + " minutes!")
                    }
                }
            }


            if ($.inidb.get('settings', 'notices_toggle') == 1) {
                $.notices_toggle = true;
            } else if ($.inidb.get('settings', 'notices_toggle') == 2) {
                $.notices_toggle = false;
            }

            if (action.equalsIgnoreCase("config")) {
                if ($.notices_toggle == true) {
                    var notices = "Enabled"
                } else {
                    notices = "Disabled"
                }

                $.say("[Notice Settings] - [Notices: " + notices + "] - [Interval: " + $.noticeinterval + " minutes] - [Msg Trigger: " + $.noticemessages + " messages] - [Amount: " + num_messages + " notices]")
            }

            if (action.equalsIgnoreCase("toggle")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }

                if ($.notices_toggle == false) {

                    $.notices_toggle = true;
                    $.inidb.set('settings', 'notices_toggle', 1);
                    $.say("Notices have been turned on!");

                } else if ($.notices_toggle == true) {

                    $.notices_toggle = false;
                    $.inidb.set('settings', 'notices_toggle', 2);
                    $.say("Notices have been turned off!");
                }

            }


            if (action.equalsIgnoreCase("req")) {
                if (args.length < 2) {
                    $.say("The current amount is " + $.noticemessages + " messages. Set it with !notice req <amount> (Minimum is 5 messages)")
                } else {
                    if (!isNaN(message) && parseInt(message) >= 5) {
                        $.inidb.set('notices', 'reqmessages', message);
                        $.noticemessages = parseInt(message);

                        $.say("The minumum number messages to trigger a notice has been set to " + $.noticemessages + " messages!");
                    }
                }
            } 

        } else {
                
            if (!args[0] == ("timer") ||!args[0] == ("interval") || !args[0] == ("insert") || !args[0] == ("get") || !args[0] == ("toggle") || argsString.isEmpty()) {
                $.say("Usage: !addnotice <message>, !delnotice <id>, !notice insert <id> <message>, !notice get [id], !notice timer <minutes>, !notice req <amount>, !notice config")
            }

        }
    }
    if (command.equalsIgnoreCase("addnotice")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }

        message = argsString;

        if (message == null) {
            $.say("Insert an notice at the end of the rotation. !notice add <message>");
        } else {
            $.inidb.incr('notices', 'num_messages', 1);

            num_messages = $.inidb.get('notices', 'num_messages');

            $.inidb.set('notices', 'message_' + (num_messages - 1), message);
            $.say("Notice added! '" + message + "' There are now " + num_messages + " notices!");
        }
    }



    if (command.equalsIgnoreCase("delnotice")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        if (num_messages == null) {
            $.say("Delete the notice at the specified slot. !notice del <id>");
        } else {
            if (isNaN(num_messages) || num_messages == 0) {
                $.say("There are no notices at this time");
                return;
            }

            if (num_messages > 1) {
                for (i = 0; i < num_messages; i++) {
                    if (i > parseInt(message)) {
                        $.inidb.set('notices', 'message_' + (i - 1), $.inidb.get('notices', 'message_' + i))
                    }
                }
            }

            $.inidb.del('notices', 'message_' + (num_messages - 1))

            $.inidb.decr('notices', 'num_messages', 1);

            num_messages = $.inidb.get('notices', 'num_messages');

            $.say("Notice removed! There are now " + num_messages + " notices!");
        }
    }




})

$.registerChatCommand("./notice.js", "notice");

var messageCount = 0
var messageTime = 0
var messageIndex = 0
$.notices_toggle = true;

function sendMessage() {

    var num_messages = $.inidb.get('notices', 'num_messages');

    if (isNaN(parseInt(num_messages)) || parseInt(num_messages) == 0) {
        return;
    }
	
	if ($.inidb.get('notices', 'message_' + messageIndex) ==  null) {
		return;
	}

    var message = $.inidb.get('notices', 'message_' + messageIndex);

    messageIndex++;

    if (messageIndex >= num_messages) {
        messageIndex = 0;
    }
    $.say(message);
}

$.on('ircChannelMessage', function (event) {
    messageCount++;
});

$.setInterval(function() {
    if (!$.moduleEnabled("./notices.js") || ($.notices_toggle != undefined && $.notices_toggle != null && !$.notices_toggle)) {
        return;
    }

    if (messageCount >= $.noticemessages && messageTime + ($.noticeinterval * 60 * 1000) < System.currentTimeMillis()) {
        messageCount = 0;

        sendMessage();

        messageTime = System.currentTimeMillis();
    }
}, 10000);