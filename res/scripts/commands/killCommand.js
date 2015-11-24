$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var num2 = $.users.length;
    var rnd = $.rand(num2);
    var killPerson = $.users[rnd][0];
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();
    var num_kills = parseInt($.inidb.get("kills", "num_kills"));
    var killNum = $.randRange(1, 100);
    var num;

    if (command.equalsIgnoreCase("kill") && args.length > 0) {

        num = $.rand(num_kills);

        if (isNaN(num_kills) || num_kills == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.error-no-kills"));
            return;
        }

        if ($.inidb.get("kills", "kill_" + num) == " ") {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.num-kills", num_kills, (num_kills - 1)));
            return;
        }
    } else if (command.equalsIgnoreCase("kill") && args.length == " ") {
        var self = new Array(0)
        sender = $.username.resolve(sender, event.getTags());

        self.push($.lang.get("net.phantombot.killcommand.self-kill-1", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-2", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-3", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-4", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-5", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-6", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-7", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-8", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-9", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-10", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-11", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-12", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-13", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-14", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-15", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-16", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-17", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-18", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-19", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-20", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-21", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-22", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-23", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-24", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-25", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-26", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-27", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-28", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-29", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-30", sender));
        self.push($.lang.get("net.phantombot.killcommand.self-kill-30", sender));

        do {
            s = $.randElement(self);
        } while (s.replace(sender, "").equalsIgnoreCase($var.lastRandom) && self.length > 1);

        $var.lastRandom = s.replace(sender, "");

        $.say(s);
        return;
    }

    if (command.equalsIgnoreCase("addkill")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if (num_kills == null || isNaN(num_kills)) {
            num_kills = 0;
        }

        if (argsString.isEmpty()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.addkill-usage"));
            return;
        }

        $.inidb.incr("kills", "num_kills", 1);
        $.inidb.set("kills", "kill_" + num_kills, argsString);

        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.kill-added", (num_kills + 1)));
        return;
    }

    if (command.equalsIgnoreCase("getkill")) {
        if (!$.inidb.get("kills", "kill_" + parseInt(args[0])) == " ") {
            $.say($.inidb.get("kills", "kill_" + parseInt(args[0])));
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.error-wrong-id", num_kills, num_kills, args[0]));
            return;
        }
    }

    if (command.equalsIgnoreCase("editkill")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        num = parseInt(args[0]);

        if (num > num_kills) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.error-wrong-id", num_kills, num_kills, args[0]));
            return;
        }

        if (argsString2.isEmpty() || argsString.isEmpty() || args[1] == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.edit-kill-usage"));
            return;
        }

        $.inidb.set("kills", "kill_" + num, argsString2);

        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.kill-edited", num, $.inidb.get("kills", "kill_" + num)));
        return;
    }

    if (command.equalsIgnoreCase("delkill")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        if (num_kills == null || isNaN(num_kills) || num_kills == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.error-no-kills"));
            return;
        }

        if (argsString.isEmpty()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.del-kill-usage"));
            return;
        }

        if (num_kills > 1) {
            for (i = 0; i < num_kills; i++) {
                if (i > parseInt(argsString)) {
                    $.inidb.set('kills', 'kill_' + (i - 1), $.inidb.get('kills', 'kill_' + i))
                }
            }
        }

        $.inidb.del('kills', 'kill_' + (num_kills - 1));

        $.inidb.decr("kills", "num_kills", 1);

        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.killcommand.del-kill-success", (num_kills - 1)));
        return;
    }

    var messageCommand = $.inidb.get('kills', 'kill_' + num);

    if (messageCommand) {
        for (var i = 0; i < args.length; i++) {
            messageCommand = $.replaceAll(messageCommand, '(' + (i + 1) + ')', args[i]);
        }
        if (messageCommand.contains('(sender)')) {
            messageCommand = $.replaceAll(messageCommand, '(sender)', sender);
        }
        if (messageCommand.contains('(count)')) {
            $.inidb.incr('commandcount', command.toLowerCase(), 1);
        } 
        if (messageCommand.contains('(touser)') >= 0 && args.length > 0) {
            messageCommand = $.replaceAll(messageCommand, '(touser)', $.username.resolve(args[0]));
        }
        if (messageCommand.contains('(random)')) {
            messageCommand = $.replaceAll(messageCommand, '(random)', $.users[$.rand($.users.length)][0]);
        }
        if (messageCommand.contains('(#)')) {
            messageCommand = $.replaceAll(messageCommand, '(#)', $.randRange(1, 100));
        } 
        if (messageCommand.contains('(count)')) {
            messageCommand = $.replaceAll(messageCommand, '(count)', $.inidb.get('commandcount', command.toLowerCase()));
        }

        $.say(messageCommand);
    }
});

var ar = new Array(0);
ar.push($.lang.get("net.phantombot.killcommand.kill-1"));
ar.push($.lang.get("net.phantombot.killcommand.kill-2"));
ar.push($.lang.get("net.phantombot.killcommand.kill-3"));
ar.push($.lang.get("net.phantombot.killcommand.kill-4"));
ar.push($.lang.get("net.phantombot.killcommand.kill-5"));
ar.push($.lang.get("net.phantombot.killcommand.kill-6"));
ar.push($.lang.get("net.phantombot.killcommand.kill-7"));
ar.push($.lang.get("net.phantombot.killcommand.kill-8"));
ar.push($.lang.get("net.phantombot.killcommand.kill-9"));
ar.push($.lang.get("net.phantombot.killcommand.kill-10"));
ar.push($.lang.get("net.phantombot.killcommand.kill-11"));
ar.push($.lang.get("net.phantombot.killcommand.kill-12"));
ar.push($.lang.get("net.phantombot.killcommand.kill-13"));
ar.push($.lang.get("net.phantombot.killcommand.kill-14"));
ar.push($.lang.get("net.phantombot.killcommand.kill-15"));
ar.push($.lang.get("net.phantombot.killcommand.kill-16"));
ar.push($.lang.get("net.phantombot.killcommand.kill-17"));
ar.push($.lang.get("net.phantombot.killcommand.kill-18"));
ar.push($.lang.get("net.phantombot.killcommand.kill-19"));
ar.push($.lang.get("net.phantombot.killcommand.kill-20"));
ar.push($.lang.get("net.phantombot.killcommand.kill-21"));
ar.push($.lang.get("net.phantombot.killcommand.kill-22"));
ar.push($.lang.get("net.phantombot.killcommand.kill-23"));
ar.push($.lang.get("net.phantombot.killcommand.kill-24"));
ar.push($.lang.get("net.phantombot.killcommand.kill-25"));
ar.push($.lang.get("net.phantombot.killcommand.kill-26"));
ar.push($.lang.get("net.phantombot.killcommand.kill-27"));


if ($.inidb.get("kills", "num_kills") == null || $.inidb.get("kills", "num_kills") == 0) {

    $.inidb.set("kills", "num_kills", ar.length);
    for (var i = 0; i < ar.length; ++i) {
        $.inidb.set('kills', 'kill_' + i, ar[i]);
    }
}

setTimeout(function () {
    if ($.moduleEnabled('./commands/killCommand.js')) {
        $.registerChatCommand("./commands/killCommand.js", "kill");
    }
}, 10 * 1000);
