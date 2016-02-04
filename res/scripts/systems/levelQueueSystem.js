$.levelqueue = [];
$.levelrequestusers = {};

$.request_limit = $.inidb.get("settings", "request_limit");
if ($.request_limit == "" || $.request_limit == null) {
    $.request_limit = 5; //amount of times a user can queue levels
    $.inidb.set("settings", "request_limit", "");
}

function LevelRequest(user, levelId) {
    this.user = user;
    this.levelId = levelId;

    this.request = function () {
        if (!this.canRequest()) {
            $.say($.getWhisperString(user) + $.lang.get("net.phantombot.levelQueueSystem.error-wrong-level-to-request", $.request_limit));
            return;
        }
        if ($.levelrequestusers[user] != null) {
            $.levelrequestusers[user]++;
        } else {
            $.levelrequestusers[user] = 1;
        }
        $.levelqueue.push(this);
    }

    this.canRequest = function () {
        var requestLimit = $.request_limit;
        if ($.levelrequestusers[user] == null) {
            return true;
        }
        return $.levelrequestusers[user] < parseInt(requestLimit);
    }

    this.pop = function () {
        $.levelrequestusers[user]--;
    }

    this.decreaseRequestAmount = function (amount, user) {
        if (($.levelrequestusers[user] - amount) >= 1) {
            $.levelrequestusers[user] = $.levelrequestusers[user] - amount;
        }
    }
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();

    if (command.equalsIgnoreCase("request")) {
        if (args[0] != null) {

            var levelId = args[0];
            $.levelrequest = new LevelRequest(username, levelId);
            $.levelrequest.request();
            $.say($.lang.get("net.phantombot.levelQueueSystem.level-q-success", levelqueue, username));
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.level-q-error"));
            return;
        }
    }

    if (command.equalsIgnoreCase("currentlevel")) {
        if ($.levelqueue[0] == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.current-level-error"));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.current-level", $.levelqueue[0].levelId, $.levelqueue[0].user));
        return;
    }

    if (command.equalsIgnoreCase("requests")) {
        if (args[0] != null) {
            if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.adminmsg);
                return;
            }

            if (args[0] == "limit") {
                if (args[1] != null) {
                    $.request_limit = args[1];
                    $.inidb.set("settings", "request_limit", $.request_limit);
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.request-limit", $.request_limit));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.request-limit-error"));
                    return;
                }
            }
        }

        var list = $.levelqueue;
        $.queuelist = "";

        if (list == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.no-levels-in-q"));
            return;
        }

        for (var i = 1; i < list.length; i++) {
            $.playrequester = list[i].levelId;
            $.queuelist += $.playrequester;
            $.queuelist += " ";
        }

        if ($.queuelist == "" || $.queuelist == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.no-levels-in-q"));
            return;
        }

        if ($.queuelist.substr($.queuelist.length - 1) == " ") {
            $.queuelist = $.queuelist.substring(0, $.queuelist.length - 1);
        }

        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.next-level", $.queuelist));
        return;
    }

    if (command.equalsIgnoreCase("nextlevel")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if ($.levelrequest != null) {
            $.levelrequest.decreaseRequestAmount(1, $.levelrequest.user);
        }

        $.levelqueue.shift();
        if ($.levelqueue[0] != null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.level-coming", $.levelqueue[0].levelId));
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.levelQueueSystem.level-error"));
            return;
        }
    }
});
setTimeout(function () {
    if ($.moduleEnabled('./systems/queueSystem.js')) {
        $.registerChatCommand("./systems/queueSystem.js", "requests", "admin");
        $.registerChatCommand("./systems/queueSystem.js", "currentlevel");
        $.registerChatCommand("./systems/queueSystem.js", "request");
        $.registerChatCommand("./systems/queueSystem.js", "nextlevel", "mod");
    }
}, 10 * 1000);
