$.on('command', function(event) {
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
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.error-no-kills"));
            return;
        }

        if ($.inidb.get("kills", "kill_" + num) == " ") {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.num-kills", num_kills, (num_kills - 1)));
            return;
        } 
    } else if (command.equalsIgnoreCase("kill") && args.length == " ") {
        var self = new Array(0)
        sender = $.username.resolve(sender, event.getTags());
 
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-1", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-2", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-3", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-4", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-5", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-6", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-7", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-8", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-9", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-10", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-11", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-12", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-13", sender));
	 	self.push($.lang.get("net.phantombot.kilcommand.self-kill-14", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-15", sender));
        	self.push($.lang.get("net.phantombot.kilcommand.self-kill-16", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-17", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-18", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-19", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-20", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-21", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-22", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-23", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-24", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-25", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-26", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-27", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-28", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-29", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-30", sender));
		self.push($.lang.get("net.phantombot.kilcommand.self-kill-30", sender));

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
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.addkill-usage"));
            return;
        }
        
        $.inidb.incr("kills", "num_kills", 1);
        $.inidb.set("kills", "kill_" + num_kills, argsString);

        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.kill-added", (num_kills + 1)));
        return;
    }

    if (command.equalsIgnoreCase("getkill")) {
        if (!$.inidb.get("kills", "kill_" + parseInt(args[0])) == " ") {
            $.say($.inidb.get("kills", "kill_" + parseInt(args[0])));
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.error-wrong-id", num_kills, num_kills, args[0]));
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
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.error-wrong-id", num_kills, num_kills, args[0]));
            return;
        }

        if (argsString2.isEmpty() || argsString.isEmpty() || args[1] == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.edit-kill-usage"));
            return;
        }
        
        $.inidb.set("kills", "kill_" + num, argsString2);
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.kill-edited", num, $.inidb.get("kills", "kill_" + num)));
        return;
    }

    if (command.equalsIgnoreCase("delkill")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }
        
        if (num_kills == null || isNaN(num_kills) || num_kills == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.error-no-kills"));
            return;
        }
        
        if (argsString.isEmpty()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.del-kill-usage"));
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
        
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.kilcommand.del-kill-success", (num_kills - 1)));
        return;
    }

    var commandCount = $.inidb.get('counter', 'kill');
    var messageCommand = $.inidb.get('kills', 'kill_' + num);
    var a = 0;

    if (messageCommand) {
        for (var i = 0; i < args.length; i++) {
            while (messageCommand.contains('(' + (i + 1) + ')')) {
                messageCommand = messageCommand.replace('(' + (i + 1) + ')', $.username.resolve(args[i]));
            }
        }

        while (messageCommand.contains('(sender)')) {
            messageCommand = messageCommand.replace('(sender)', $.username.resolve(sender, event.getTags()));
        }

        while (messageCommand.contains('(user)')) {
            messageCommand = messageCommand.replace('(user)', $.username.resolve(sender, event.getTags()));
        }

        while (messageCommand.indexOf('(count)') != -1) {
            messageCommand = messageCommand.replace('(count)', $.inidb.get('counter', command));
        }

        while (messageCommand.indexOf('(kill)') != -1) {
            messageCommand = messageCommand.replace('(kill)', $.username.resolve(killPerson));
        }
        while (messageCommand.indexOf('(#)') != -1) {
            messageCommand = messageCommand.replace('(#)', killNum);
        }

        $.say(messageCommand);
    }
});
var ar = new Array(0);
ar.push($.lang.get("net.phantombot.kilcommand.kill-1"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-2"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-3"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-4"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-5"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-6"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-7"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-8"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-9"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-10"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-11"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-12"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-13"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-14"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-15"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-16"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-17"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-18"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-19"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-20"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-21"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-22"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-23"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-24"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-25"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-26"));
ar.push($.lang.get("net.phantombot.kilcommand.kill-27"));


if ($.inidb.get("kills", "num_kills") == null || $.inidb.get("kills", "num_kills") == 0 ) {
        
    $.inidb.set("kills", "num_kills", ar.length);
    for (var i=0; i< ar.length; ++i) {
        $.inidb.set('kills', 'kill_' + i, ar[i]);
    }
}

setTimeout(function(){ 
    if ($.moduleEnabled('./commands/killCommand.js')) {
        $.registerChatCommand("./commands/killCommand.js", "kill");
    }
},10 * 1000);
