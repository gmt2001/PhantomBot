var arrballlimiter = new Array();

if ($.ballcooldown === undefined || $.ballcooldown === null || isNaN($.ballcooldown) || $.ballcooldown < 0) {
    $.ballcooldown = 30;
}

if ($.ballcost === undefined || $.ballcost === null || isNaN($.ballcost) || $.ballcost < 0) {
    $.ballcost = 0;
}

$.on('command', function(event) {
var sender = event.getSender();
var username = $.username.resolve(sender);
var command = event.getCommand();
var argsString = event.getArguments().trim();
var args = event.getArgs();
var ballcost = $.inidb.get('settings', 'ballcost');
var points = $.inidb.get('points', sender);


        var found = false;
        var i;

        if (command.equalsIgnoreCase("8ball")) {
            for (i = 0; i < arrballlimiter.length; i++) {           
                if (arrballlimiter[i][1] < System.currentTimeMillis()) {
                    arrballlimiter[i][1] = System.currentTimeMillis() + ($.ballcooldown * 1000);
                    break;
                    } else {
                    return;
                }

                    found = true;
                    return;
                }
            
            if (found === false) {
                arrballlimiter.push(new Array(username, System.currentTimeMillis() + ($.ballcooldown * 1000)));
            }

            if (args.length == 0 || args.length == null) { 
		        $.say ($.getWhisperString(sender) + $.lang.get("net.phantombot.8ballCommand.proper-usage")); 
		        return; 
		    }
	
	var ball = new Array();

	ball.push("Reply hazy try again.");
	ball.push("Ask again later.");
	ball.push("Better not tell you now.");
	ball.push("Cannot predict now.");
	ball.push("Outlook not so good.");
	ball.push("Yes, in due time.");
	ball.push("You will have to wait.");
	ball.push("Ask again later.");
	ball.push("Better not tell you now. OpieOP");
	ball.push("Concentrate and ask again.");
	ball.push("Reply hazy, try again.");
	ball.push("Never going to happen!");
	ball.push("The odds of that happening are pretty slim.");
	ball.push("My reply is no.");
	ball.push("My sources say no.");
	ball.push("Very doubtful.");
	ball.push("No.");
	ball.push("I have no response for that question...");
	ball.push("Why would I tell you? OMGScoots");	
	ball.push("Forget about it.");
	ball.push("Don't bet on it.");
	ball.push("Who knows?");
	ball.push("Signs point to yes.");
	ball.push("It is certain.");
	ball.push("Without a doubt.");
	ball.push("Yes definitely.");
	ball.push("You may rely on it.");
	ball.push("As I see it, yes.");
	ball.push("Most likely.");
	ball.push("Outlook good.");
	ball.push("Yes.");
	ball.push("Signs point to yes.");
	ball.push("This is not the Bot you're looking for ༼ﾉ۞⌂۞༽ﾉ");
	
	
	do {
		b = $.randElement(ball);
	} while (b.equalsIgnoreCase($var.lastRandom) && ball.length > 1);
	if (points < ballcost) {
		$.say($.getWhisperString(sender) + $.lang.get("net.phantombot.8ballCommand.not-enough-points"));
		return;
	} else {
	    $.say($.getWhisperString(sender) + b);
            return;
    }
}

	if (command.equalsIgnoreCase("8ballcooldown")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
    }

        $.inidb.set('settings', 'ballcooldown', args[0]);
        $.ballcooldown = $.inidb.get('settings', 'ballcooldown');
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.8ballCommand.new-cooldown"));
    }

    if (command.equalsIgnoreCase("8ballcost")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender)+ $.adminmsg);
            return;
    }

        $.inidb.set('settings', 'ballcost', args[0]);
        $.ballcost = $.inidb.get('settings', 'ballcost');
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.8ballCommand.new-cost"));
    }
});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/8ballCommand.js')) {
$.registerChatCommand("./commands/8ballCommand.js", "8ball");
$.registerChatCommand("./commands/8ballCommand.js", "8ballcooldown", "admin");
$.registerChatCommand("./commands/8ballCommand.js", "8ballcost", "admin");
}
},10*1000);
