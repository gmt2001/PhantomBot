var arrballlimiter = new Array();

$.on('command', function(event) {
var sender = event.getSender();
var username = $.username.resolve(sender);
var command = event.getCommand();
var argsString = event.getArguments().trim();
var args = event.getArgs();
var ballcost = $.inidb.get('settings', 'ballcost');
var points = $.inidb.get('points', sender);


        if (command.equalsIgnoreCase("8ball")) {

            if (args.length == 0 || args.length == null) { 
		        $.say ($.getWhisperString(sender) + $.lang.get("net.phantombot.8ballCommand.proper-usage")); 
		        return; 
		    }
	
	var ball = new Array();

	ball.push($.lang.get("net.phantombot.8ballCommand.answer-1"));
    	ball.push($.lang.get("net.phantombot.8ballCommand.answer-2"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-3"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-4"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-5"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-6"));
    	ball.push($.lang.get("net.phantombot.8ballCommand.answer-7"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-8"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-9"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-10"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-11"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-12"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-13"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-14"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-15"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-16"));
    	ball.push($.lang.get("net.phantombot.8ballCommand.answer-17"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-18"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-19"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-20"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-21"));
    	ball.push($.lang.get("net.phantombot.8ballCommand.answer-22"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-23"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-24"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-25"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-26"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-27"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-28"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-29"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-30"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-31"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-32"));
	ball.push($.lang.get("net.phantombot.8ballCommand.answer-33"));
	
	do {
		b = $.randElement(ball);
	} while (b.equalsIgnoreCase($var.lastRandom) && ball.length > 1);

	$.say("Magic-8ball says... " + b);
        return;
}


});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/8ballCommand.js')) {
$.registerChatCommand("./commands/8ballCommand.js", "8ball");
}
},10 * 1000);
