var arrrouletteLimiter = new Array();
var arrroulettetimeout = new Array();

if ($.roulettetimer === undefined || $.roulettetimer === null || isNaN($.roulettetimer) || $.roulettetimer < 0) {
    $.roulettetimer = 30;
}
if ($.roulettetimeout === undefined || $.roulettetimeout === null || isNaN($.roulettetimeout) || $.roulettetimeout < 0) {
    $.roulettetimeout = 600;
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var points = $.inidb.get('points', sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var s;
    var m;

    if (command.equalsIgnoreCase("roulette")) {
        if (args.length == 0) {
            var d1 = $.randRange(1, 2);
            var d2 = $.randRange(1, 2);

        var found = false;
        var i;

        if (command.equalsIgnoreCase("roulette")) {
            if (args.length == 0) {
            var d1 = $.randRange(1, 2);
            var d2 = $.randRange(1, 2);
    
            if (!$.isAdmin(sender)) {
                for (i = 0; i < arrrouletteLimiter.length; i++) {           
                    if (arrrouletteLimiter[i][1] < System.currentTimeMillis()) {
                        arrrouletteLimiter[i][1] = System.currentTimeMillis() + ($.roulettetimer * 1000);
                        break;
                    } else {
                        return;
                    }

                    found = true;
                    return;
                }
            }
            
            if (found === false) {
                arrrouletteLimiter.push(new Array(username, System.currentTimeMillis() + ($.roulettetimer * 1000)));
            }

    	 	var Win = new Array();
    	 	
    	 	Win.push("The trigger is pulled, and the revolver clicks. "+ username +" has lived to survive roulette!");
    	 	Win.push("The trigger is pulled, but the revolver malfunctions! "+ username +" is lucky, and live's another day!");
                Win.push("The trigger is pulled, and the revolver clicks. "+ username +" has lived to survive roulette!");
                Win.push("The trigger is pulled, but the revolver malfunctions! "+ username +" is lucky, and live's another day!");
                Win.push("The trigger is pulled, and the revolver clicks. "+ username +" has lived to survive roulette!");
                Win.push("The trigger is pulled, but the revolver malfunctions! "+ username +" is lucky, and live's another day!");
                Win.push("The trigger is pulled, and the revolver clicks. "+ username +" has lived to survive roulette!");
                Win.push("The trigger is pulled, but the revolver malfunctions! "+ username +" is lucky, and live's another day!");
		Win.push("The trigger is pulled, but this isn't a revolver! "+ username +" is lucky, and live's another day!");
		Win.push("The trigger is pulled, but the bullets were loaded backwards! "+ username +" is lucky, and live's another day!");
		Win.push("The trigger is pulled, but the power went out! "+ username +" is lucky, and bluffed their way to another day!");
		Win.push("The trigger is pulled, but the bullet was rubber! "+ username +" is lucky, and live's another day!");
    	 	
    	 	var lost = new Array();

    	 	lost.push("The trigger is pulled, and the revolver fires! "+ username +" lies dead in the chat.");
                lost.push("The trigger is pulled, and "+ username +" loses their head!");
		lost.push(username +"'s finger slides over the trigger, "+ username +" crashes to the floor like a sack of flour!");
		lost.push("The trigger is pulled, and the hand-cannon goes off with a roar! "+ username +" lies dead in the chat.");
		lost.push("The hammer drops, and the .44 fires! "+ username +" is now dead in the chat.");
		lost.push("The trigger is pulled, and the revolver fires! "+ username +" is now just a blood splatter on the wall.");
		lost.push("The trigger is pulled, and the revolver fires! "+ username +" ended their miserable life.");

                var lostmod = new Array();

                lostmod.push("The trigger is pulled, but "+ username +" has been saved by magic!");
                lostmod.push("The trigger is pulled, but "+ username +" has lived due to not having anything in his skull to begin with.");
                lostmod.push("The trigger is pulled, but "+ username +"'s skull was so thick the bullet could not penetrate it.");
                lostmod.push("The trigger is pulled, but "+ username +" stopped space and time and dodged the bullet!");
                lostmod.push("The trigger is pulled, but "+ username +" did not die from the bullet, the bullet died from him.");
                
                
    	 	if (d1 == d2) {
    	 		do {
    	 			s = $.randElement(Win);
    	 		} while (s.equalsIgnoreCase($var.lastRandomWin) && Win.length > 1);
    	 		$.say(s);	
    	 	} else {
    	 		do {
    	 			s = $.randElement(lost);  
    	 		} while (s.equalsIgnoreCase($var.lastRandomlost) && lost.length > 1);
                if (!$.isModv3(sender, event.getTags())) {
                    $.say(s);
                    setTimeout(function() {$.say(".timeout "+ username +" "+ roulettetimeout);},2000);
                    setTimeout(function() {$.say(".timeout "+ username +" "+ roulettetimeout);},2000);
                    return;
                }
                m = $.randElement(lostmod);
                while (m.equalsIgnoreCase($var.lastRandomlostmod) && lostmod.length > 1);
                $.say(m);
                }
            }
        }
    }
}

    if (command.equalsIgnoreCase("roulettecooldown")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
    }

    $.inidb.set('settings', 'roulette_timer', parseInt(args[0]));
    $.roulettetimer = parseInt(args[0]);
    $.say(username +", the !roulette command cooldown has been set to "+ $.roulettetimer +" seconds!");
    
    }

    if (command.equalsIgnoreCase("roulettetimeouttime")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
    }

    $.inidb.set('settings', 'roulettetimeout', parseInt(args[0]));
    $.roulettetimeout = parseInt(args[0]);
    $.say(username +", the !roulette timeout has been set to "+ $.roulettetimeout +" seconds!");
    
    }
});
$.registerChatCommand("./commands/rouletteCommand.js", "roulette");
$.registerChatCommand("./commands/rouletteCommand.js", "roulettecooldown");
$.registerChatCommand("./commands/rouletteCommand.js", "roulettetimeouttime");