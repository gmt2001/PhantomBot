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
		        $.say (username + ", ask the magic-8ball a question with !8ball"); 
		        return; 
		    }
	
	var ball = new Array();

    ball.push("It is certain.");
	ball.push("It is decidedly so.");
	ball.push("Without a doubt.");
	ball.push("Yes definitely.");
	ball.push("You may rely on it.");
	ball.push("As I see it, yes.");
	ball.push("Most likely.");
	ball.push("Outlook good.");
	ball.push("Yes.");
	ball.push("Signs point to yes.");
	ball.push("Reply hazy try again.");
	ball.push("Ask again later.");
	ball.push("Better not tell you now.");
	ball.push("Cannot predict now.");
	ball.push("Concentrate and ask again.");
	ball.push("Don't count on it.");
	ball.push("My reply is no.");
	ball.push("My sources say no.");
	ball.push("Outlook not so good.");
	ball.push("Very doubtful.");
	ball.push("Yes, in due time.");
	ball.push("You will have to wait.");
	ball.push("Ask again later.");
	ball.push("Better not tell you now. OpieOP");
	ball.push("Concentrate and ask again.");
	ball.push("Reply hazy, try again.");
	ball.push("What do you think?");
	ball.push("Never going to happen!");
	ball.push("The odds of that happening are pretty slim.");
	ball.push("The end of the world as we know it shall occur before that happens...");
	ball.push("No, just no DansGame");
	ball.push("You cannot ask me that without buying me dinner first!");
	ball.push("404: response not found.");
	ball.push("Oh dear I appear to be broken!");
	ball.push("My magic fluid is in need of a change!");
	ball.push("凸( •̀_•́ )凸");
	ball.push("The odds are over 9000!");
	ball.push("I believe this answers your question? ᕕ╏ ͡ᵔ ‸ ͡ᵔ ╏凸");
	ball.push("You're too young to hear my response Kappa !");
	ball.push("I'm on my union break!");
	ball.push("Where is my incentive to answer?");
	ball.push("I have no response for that question...");
	ball.push("I can't believe you asked that FailFish");
	ball.push("May the odds be forever in your favour!");
	ball.push("Please OpieOP");
	ball.push("Don't ask me that DansGame");
	ball.push("Nah.");
	ball.push("Why would you ask me that? OMGScoots");
	ball.push("No.");
	ball.push("Why would I tell you? OMGScoots");
	ball.push("Forget about it.");
	ball.push("Don't bet on it.");
	ball.push("Go for it!");
	ball.push("Probably.");
	ball.push("Who knows?");
	ball.push("It is certain.");
	ball.push("Signs point to yes.");
	ball.push("As I see it, yes.");
	ball.push("Master gave me a sock! I'M FREEEEEEEEEEE!");
	ball.push("/me Accio Answer!");
	ball.push("/me gotta find the answer....gotta find the answer....shit they're on to me! WutFace ");
	ball.push("You need a higher clearance to access this information!");
	ball.push("You're on the blacklist aren't you?");
	ball.push("You failed the intelligence check for an answer");
	ball.push("I'd give you an answer, but I took an arrow to the knee! Or was it the head OMGScoots ?");
	ball.push("This is not the Bot you're looking for ༼ﾉ۞⌂۞༽ﾉ");
	ball.push("Do you like to work on your lunch break?! Because I won't /╲/\╭༼ಥДಥ༽╮/\╱﻿\ ");
	ball.push("Doot doot, do do doot! Your Pokémon are healed and ready to go! Oh wait....");
	
	do {
		b = $.randElement(ball);
	} while (b.equalsIgnoreCase($var.lastRandom) && ball.length > 1);
	if (points < ballcost) {
		$.say("You need more points to use this command " + username);
		return;
	} else {
	    $.say("/me @"+ username +", "+ b);
            return;
    }
}

	if (command.equalsIgnoreCase("8ballcooldown")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
    }

        $.inidb.set('settings', 'ballcooldown', args[0]);
        $.ballcooldown = $.inidb.get('settings', 'ballcooldown');
        $.say(username +", new cooldown set!");
    }

    if (command.equalsIgnoreCase("8ballcost")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
    }

        $.inidb.set('settings', 'ballcost', args[0]);
        $.ballcost = $.inidb.get('settings', 'ballcost');
        $.say(username +", new cost set!");
    }
});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/8ballCommand.js')) {
$.registerChatCommand("./commands/8ballCommand.js", "8ball");
$.registerChatCommand("./commands/8ballCommand.js", "8ballcooldown", "admin");
$.registerChatCommand("./commands/8ballCommand.js", "8ballcost", "admin");
}
},10*1000);