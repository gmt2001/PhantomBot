
$.getTimeString = function (time) {
    var minutes = parseInt((time / 60) % 60);
    var hours = parseInt((time / 3600) % 24);
    var days = parseInt((time / 86400) % 7);
    var weeks = parseInt(time / 604800);

    var timeString = "";

    if (time > 0) {
        if (weeks > 0) {
            timeString += weeks.toString();
            timeString += "w "
        }
        if (days > 0) {
            timeString += days.toString();
            timeString += "d "
        }
        if (hours > 0) {
            timeString += hours.toString();
            timeString += "h "
        }
        if (minutes > 0) {
            timeString += minutes.toString();
            timeString += "m "
        }
        if (weeks == 0 && days == 0 && hours == 0 && minutes == 0) {
            return "0s";
        }

        timeString = timeString.trim();
    } else {
        return "0s";
    }

    return timeString;
}

$.sortNumber = function (a,b) {
    return a[1] - b[1];
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags()).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("top10")) {
        if (!$.moduleEnabled("./systems/pointSystem.js")) {
        	$.say($.getWhisperString(sender) + $.lang.get("net.phantombot.top10.points-disabled"));
            return;
        }
        
        var keys = $.inidb.GetKeyList("points", "");
        var topComplete = [];
        var topTen = [];
        var topTenString = "";

        for (var i = keys.length - 1; i >= 0; i--) {
        	if (keys[i] != $.botowner && keys[i] != $.botname && keys[i] != "moobot"  && keys[i] != "wizebot" && keys[i] != "nightbot") {
        	    topComplete.push([keys[i], $.inidb.get("points", keys[i])]);
        	}
        };

        topComplete.sort($.sortNumber);

        for (var i = topComplete.length - 1; i >= topComplete.length - 10; i--) {
        	if (topComplete[i] != undefined) {
        		topTen.push([topComplete[i][0], topComplete[i][1]]);
        	}
        };

        for (i = 0; i < topTen.length; i++) {
            if (i > 0) {
                topTenString += " - ";
            }
            
            topTenString += (i + 1) + ". " + $.username.resolve(topTen[i][0]) + " (" + $.getPointsString(topTen[i][1]) + ")";
        };

        if (topTenString.trim() == "") {
        	$.say($.getWhisperString(sender) + $.lang.get("net.phantombot.top10.points-error-noresults", $.inidb.get('settings', 'pointNameMultiple')));
        	return;
        } else {
        	if (!$.isModv3(sender, event.getTags())) {
        		$.say($.getWhisperStringStatic(sender) + $.lang.get("net.phantombot.top10.points-success-whisper", $.inidb.get('settings', 'pointNameMultiple'), topTenString.trim()));
        	    return;
        	}

        	$.say($.lang.get("net.phantombot.top10.points-success", $.inidb.get('settings', 'pointNameMultiple'), topTenString.trim()));
        	return;
        }
    }
    
    if (command.equalsIgnoreCase("top10time")) {
        if (!$.moduleEnabled("./systems/timeSystem.js")) {
        	$.say($.getWhisperString(sender) + $.lang.get("net.phantombot.top10.time-disabled"));
            return;
        }
        
        var keys = $.inidb.GetKeyList("time", "");
        var topComplete = [];
        var topTen = [];
        var topTenString = "";

        for (var i = keys.length - 1; i >= 0; i--) {
        	if (keys[i] != $.botowner && keys[i] != $.botname && keys[i] != "moobot"  && keys[i] != "wizebot" && keys[i] != "nightbot") {
        	    topComplete.push([keys[i], $.inidb.get("time", keys[i])]);
        	}
        };

        topComplete.sort($.sortNumber);

        for (var i = topComplete.length - 1; i >= topComplete.length - 10; i--) {
        	if (topComplete[i] != undefined) {
        		topTen.push([topComplete[i][0], topComplete[i][1]]);
        	}
        };

        for (i = 0; i < topTen.length; i++) {
            if (i > 0) {
                topTenString += " - ";
            }
            
            topTenString += (i + 1) + ". " + $.username.resolve(topTen[i][0]) + " (" + $.getTimeString(topTen[i][1]) + ")";
        };

        if (topTenString.trim() == "") {
        	$.say($.getWhisperString(sender) + $.lang.get("net.phantombot.top10.time-error-noresults"));
        	return;
        } else {
        	if (!$.isModv3(sender, event.getTags())) {
        		$.say($.getWhisperStringStatic(sender) + $.lang.get("net.phantombot.top10.time-success-whisper", topTenString.trim()));
        	    return;
        	}

        	$.say($.lang.get("net.phantombot.top10.time-success", topTenString.trim()));
        	return;
        }
    }
});
setTimeout(function(){ 
    if ($.moduleEnabled('./commands/top10Command.js')) {
        $.registerChatCommand("./commands/top10Command.js", "top10");
        $.registerChatCommand("./commands/top10Command.js", "top10time");
    }
},10*1000);
