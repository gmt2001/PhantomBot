var objRoll = new Object({
	limiter:new Array(),
	temp:null,
	timer:30000,
	bonus:2,
	wait:true,
	stream:false,
});

/* Default values are set in the objRoll variable,
 * values from database will be loaded to objRoll.temp,
 * validated, then set to the respective variable. */

objRoll.temp = parseInt($.inidb.get("roll", "roll_timer"));
if ((objRoll.temp == undefined) || (objRoll.temp == null) ||
	isNaN(objRoll.temp) || (objRoll.temp < 1000)) {
	$.inidb.set("roll", "roll_timer", objRoll.timer);
} else {
	objRoll.timer = objRoll.temp;
}

objRoll.temp = parseInt($.inidb.get("roll", "roll_bonus"));
if ((objRoll.temp == undefined) || (objRoll.temp == null) ||
	isNaN(objRoll.temp) || (objRoll.temp < 1000)) {
	$.inidb.set("roll", "roll_bonus", objRoll.bonus);
} else {
	objRoll.bonus = objRoll.temp;
}

objRoll.temp = $.inidb.get("roll", "roll_wait");
if ((objRoll.temp == undefined) || (objRoll.temp == null)) {
	$.inidb.set("roll", "roll_wait", objRoll.wait);
} else if (objRoll.temp.equalsIgnoreCase("true")) {
	objRoll.wait = true;
} else if (objRoll.temp.equalsIgnoreCase("false")) {
	objRoll.wait = false;
} else {
	$.inidb.set("roll", "roll_wait", objRoll.wait);
}

objRoll.temp = $.inidb.get("roll", "roll_stream");
if ((objRoll.temp == undefined) || (objRoll.temp == null)) {
	$.inidb.set("roll", "roll_stream", objRoll.stream);
} else if (objRoll.temp.equalsIgnoreCase("true")) {
	objRoll.stream = true;
} else if (objRoll.temp.equalsIgnoreCase("false")) {
	objRoll.stream = false;
} else {
	$.inidb.set("roll", "roll_stream", objRoll.stream);
}

$.on('command', function(event) {
	var sender = event.getSender().toLowerCase();
	var username = $.username.resolve(sender);
	var command = event.getCommand();
	var args = event.getArgs();
	var i = 0;
	var found = false;
	var curTime = 0;
			
	if (command.equalsIgnoreCase("roll")) {		
		if (args.length == 0) {
			var points = parseInt($.inidb.get('points', sender));
			
			if ((points == undefined) || (points == null) ||
				isNaN(points) || (points < 0)) {
				points = 0;
				$.inidb.set('points', sender, points);
			}
			
			if (objRoll.stream && !$.isOnline($.channelName)) {
				$.say($.getWhisperString(username) + username + ", you can only !roll while " +
					$.username.resolve($.channelName) + " is streaming!");
				return;
			}
			
			if (objRoll.wait) {
				for (i = 0; i < objRoll.limiter.length; i++) {
					if (!objRoll.limiter[i].user.equalsIgnoreCase(sender)) {
						continue;
					}
					curTime = System.currentTimeMillis();
					if (curTime < objRoll.limiter[i].time) {
						$.say($.getWhisperString(username) + username + ", you are waiting " +
							Math.ceil((objRoll.limiter[i].time - curTime) /
								1000) + " out of " +
								Math.ceil(objRoll.timer / 1000) +
								" seconds for next \u001F!roll\u001F!");
						return;
					}
					found = true;
					objRoll.limiter[i].time = curTime + objRoll.timer;
					break;
				}
		
				if (!found) {
					objRoll.limiter.push(new Object({
						user:sender,
						time:objRoll.timer + System.currentTimeMillis(),
					}));
				} 
			}
		
			var die1 = (1 + Math.floor(Math.random() * 6));
			var die2 = (1 + Math.floor(Math.random() * 6));
			var d1 = null;
			var d2 = null;
			var newpoints = 0;
			
			if (die1 == 1) { d1 = "1";	}
			else if (die1 == 2) { d1 = "2"; }
			else if (die1 == 3) { d1 = "3"; }
			else if (die1 == 4) { d1 = "4"; }
			else if (die1 == 5) { d1 = "5"; }
			else if (die1 == 6) { d1 = "6"; }
			else { d1 = num1.toString(); }
			
			if (die2 == 1) { d2 = "\1";	}
			else if (die2 == 2) { d2 = "2"; }
			else if (die2 == 3) { d2 = "3"; }
			else if (die2 == 4) { d2 = "4"; }
			else if (die2 == 5) { d2 = "5"; }
			else if (die2 == 6) { d2 = "6"; }
			else { d2 = num1.toString(); }
			
			if (die1 == die2) {
				if ($.moduleEnabled("./systems/pointSystem.js")) {
					newpoints = (die1 + die2) * objRoll.bonus;	
					$.say(username + " rolled double \u0002" +
						d1 + "\u0002s! You won " +  
						$.getPointsString(newpoints) + "!");
					$.inidb.set("points", sender, points + newpoints);
				} else {
					$.say(username + " rolled double \u0002" +
						d1 + "\u0002s!");
				}
			} else {
				$.say(username + " rolled \u0002" + d1 +
					"\u0002 & \u0002" + d2 + "\u0002!");
			}
		} else if (args[0].equalsIgnoreCase("wait")) {
			if (!$.isMod(username)) {
				$.say($.getWhisperString(username) + $.modmsg);
				return;
			} else if (args.length == 1) {
				objRoll.wait = !objRoll.wait;
			} else if (args[1].equalsIgnoreCase("on") || 
				args[1].equalsIgnoreCase("enable") ||
				args[1].equalsIgnoreCase("true")) {
				objRoll.wait = true;
			} else if (args[1].equalsIgnoreCase("off") || 
				args[1].equalsIgnoreCase("disable") ||
				args[1].equalsIgnoreCase("false")) {
				objRoll.wait = false;
			}
			$.say($.getWhisperString(username) + username + ", you" + ((objRoll.wait) ? " enabled" : " disabled") +
				" the wait timer.");
			$.inidb.set("roll", "roll_wait", objRoll.wait);
		} else if (args[0].equalsIgnoreCase("bonus")) {
			if (!$.isMod(username)) {
				$.say($.getWhisperString(username) + $.modmsg);
			} else if (args.length == 1) {
				$.say($.getWhisperString(username) + username + ", the roll bonus is " +
					objRoll.bonus + ".");
			} else {
				var newbonus = parseInt(args[1]);
				if ((newbonus == undefined) || (newbonus == null) ||
					isNaN(newbonus) || (newbonus < 1)) {
					$.say($.getWhisperString(username) + username + ", you tried to set an invalid roll bonus, " +
						"please enter a number 1 or greater.");
				} else {
					$.say($.getWhisperString(username) + username + ", you changed roll bonus from " +
						objRoll.bonus + " to " + newbonus + ".");
					objRoll.bonus = newbonus;
					$.inidb.set("roll", "roll_bonus", objRoll.bonus);
				}
			}
		} else if (args[0].equalsIgnoreCase("time")) {
			if (!$.isMod(username)) {
				$.say($.getWhisperString(username) + $.modmsg);
			} else if (args.length == 1) {
				$.say($.getWhisperString(username) + username + ", the roll wait time is " +
					((objRoll.wait) ? "on" : "off") + " and set to " +
					Math.ceil(objRoll.timer / 1000) + " seconds.");
			} else {
				var newtime = parseInt(args[1]);
				if ((newtime == undefined) || (newtime == null) ||
					isNaN(newtime) || (newtime < 1)) {
					$.say($.getWhisperString(username) + username + ", you tried to set an invalid roll timer, " +
						"please enter a number 1 or greater.");
				} else {
					$.say($.getWhisperString(username) + username + ", you changed roll timer from " +
						Math.ceil(objRoll.timer / 1000) + " to " +
						newtime + " seconds.");
					objRoll.timer = newtime * 1000;
					$.inidb.set("roll", "roll_timer", objRoll.timer);
				}
			}
		} else if (args[0].equalsIgnoreCase("stream")) {
			if (!$.isMod(username)) {
				$.say($.getWhisperString(username) + $.modmsg);
				return;
			} else if (args.length == 1) {
				objRoll.stream = !objRoll.stream;
			} else if (args[1].equalsIgnoreCase("on") || 
				args[1].equalsIgnoreCase("enable") ||
				args[1].equalsIgnoreCase("true")) {
				objRoll.stream = true;
			} else if (args[1].equalsIgnoreCase("off") || 
				args[1].equalsIgnoreCase("disable") ||
				args[1].equalsIgnoreCase("false")) {
				objRoll.stream = false;
			}
			$.say($.getWhisperString(username) + username + ", you" + ((objRoll.stream) ? " enabled" : " disabled") +
				" stream only rolling.");
			$.inidb.set("roll", "roll_stream", objRoll.stream);
		} else if (args[0].equalsIgnoreCase("config")) {
			if (!$.isMod(username)) {
				$.say($.getWhisperString(username) + $.modmsg);
			} else {
				$.say("/me \u208Droll\u208E \u2039stream: " +
					((objRoll.stream) ? "enabled" : "disabled") +
					"\u203A \u2039wait: " +
					((objRoll.wait) ? "enabled" : "disabled") +
					"\u203A \u2039time: " +
					Math.floor(objRoll.timer / 1000) +
					" seconds\u203A \u2039bonus: " + objRoll.bonus +
					"\u203A.");
			}
		} else if ((args.length > 0) && (args.length < 7)) {
			if (objRoll.stream && !$.isOnline($.channelName)) {
				$.say($.getWhisperString(username) + username + ", you can only !roll while " +
					$.username.resolve($.channelName) + "'s streaming!");
				return;
			}
			
			if (objRoll.wait) {
				for (i = 0; i < objRoll.limiter.length; i++) {
					if (!objRoll.limiter[i].user.equalsIgnoreCase(sender)) {
						continue;
					}
					curTime = System.currentTimeMillis();
					if (curTime < objRoll.limiter[i].time) {
						$.say($.getWhisperString(username) + username + ",you are waiting " +
							Math.ceil((objRoll.limiter[i].time - curTime) /
								1000) + " out of " +
								Math.ceil(objRoll.timer / 1000) +
								" seconds for next \u001F!roll\u001F!");
						return;
					}
					found = true;
					objRoll.limiter[i].time = curTime + objRoll.timer;
					break;
				}
		
				if (!found) {
					objRoll.limiter.push(new Object({
						user:sender,
						time:objRoll.timer + System.currentTimeMillis(),
					}));
				} 
			}
			
			var tempstr = null;
			var dpos = null;
			var diNum = null;
			var diType = null;
			var diRolls = null;
			var diFlavor = null;
			var diTotal = 0;
			var diMax = 0;
			var diMin = 0;
			var diTemp = 0;
			var j = 0;
			
			for (i = 0; i < args.length; i++) {
				tempstr = args[i].toLowerCase();
				dpos = tempstr.search("d");
				if (dpos == -1) {
					diNum = parseInt(tempstr);
					diType = 6;
				} else if (dpos == 0) {
					diNum = 1;
					diType = parseInt(tempstr.substring(1));
				} else {
					diNum = parseInt(tempstr.substring(0, dpos - 1));
					diType = parseInt(tempstr.substring(dpos + 1));
				}
				
				if ((diNum == undefined) || (diNum == null) ||
					isNaN(diNum) || (diNum < 1))
				{
					$.say($.getWhisperString(username) + username + ", your " + args[i].trim() + 
						" contains an invalid number of dice.");
					return;
				} else if (diNum > 30) {
					$.say($.getWhisperString(username) + username + ", your " + args[i].trim() +
						" wants too many dice rolled.");
					return;
				}
				
				if (diType == 4) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 4));
						diTotal += diTemp;
						diMax += 4;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u2074";
					}
				} else if (diType == 6) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 6));
						diTotal += diTemp;
						diMax += 6;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u2076";
					}
				} else if (diType == 8) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 8));
						diTotal += diTemp;
						diMax += 8;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u2078";
					}
				} else if (diType == 10) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 10));
						diTotal += diTemp;
						diMax += 10;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u00B9\u2070";
					}
				} else if (diType == 12) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 12));
						diTotal += diTemp;
						diMax += 12;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u00B9\u00B2";
					}
				} else if (diType == 20) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 20));
						diTotal += diTemp;
						diMax += 20;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u00B2\u2070";
					}
				} else if (diType == 100) {
					for (j = 0; j < diNum; j++) {
						diTemp = (1 + Math.floor(Math.random() * 100));
						diTotal += diTemp;
						diMax += 100;
						diMin += 1;
						diRolls = ((diRolls == null) ? "" : diRolls + " + ")
							+ diTemp + "\u25D8\u00B9\u2070\u2070";
					}
				} else {
					$.say($.getWhisperString(sender) + username + ", your " + args[i].trim() + 
						" contains an invalid sided dice.");
					return;
				}
			}
				
			if (diTotal >= diMax) {	diFlavor = " for a MASSIVE hit!"; }
			if (diTotal <= diMin) {	diFlavor = " FAILURE!";	}
			if (diFlavor == null) { diFlavor = "!"; }
				
			$.say(username + " rolled " + diRolls +	" = " +
				diTotal + diFlavor);
		}
		return;
	}
});

$.registerChatCommand("./commands/rollCommand.js", "roll");
