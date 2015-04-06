$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("top10")) {
        if (!$.moduleEnabled("./systems/pointSystem.js")) {
            return;
        }
        
        var keys = $.inidb.GetKeyList("points", "");
        var top10 = new Array(new Array("Nobody", -1), new Array("Nobody", -2), new Array("Nobody", -3),
            new Array("Nobody", -4), new Array("Nobody", -5), new Array("Nobody", -6),
            new Array("Nobody", -7), new Array("Nobody", -8), new Array("Nobody", -9), new Array("Nobody", -10));
        var i;
        var b;
        var k;
        var points;
        var s = "Top 10 " + $.pointname + " -> ";
        
        for (i = 0; i < keys.length; i++) {
            if (!keys[i].equalsIgnoreCase($.botname) && !keys[i].equalsIgnoreCase($.botowner)) {
                points = parseInt($.inidb.get("points", keys[i]));
            
                for (b = 0; b < top10.length; b++) {
                    if (top10[b][1] < points) {
                        for (k = top10.length - 2; k >= b; k--) {
                            top10[k + 1] = top10[k];
                        }
                    
                        top10[b] = new Array($.username.resolve(keys[i]), points);
                        break;
                    }
                }
            }
        }
        
        for (i = 0; i < top10.length; i++) {
            if (i > 0) {
                s += "  -  ";
            }
            
            s += (i + 1) + ". " + top10[i][0] + " (" + top10[i][1] + ")";
        }
        
        $.say(s);
    }
if (command.equalsIgnoreCase("top10time")) {
        if (!$.moduleEnabled("./systems/timeSystem.js")) {
            return;
        }
        
        var keys = $.inidb.GetKeyList("time", "");
        var top10time = new Array(new Array("Nobody", -1), new Array("Nobody", -2), new Array("Nobody", -3),
            new Array("Nobody", -4), new Array("Nobody", -5), new Array("Nobody", -6),
            new Array("Nobody", -7), new Array("Nobody", -8), new Array("Nobody", -9), new Array("Nobody", -10));
        var i;
        var b;
        var k;
        var times;
        var s = "Top10 Time >> ";
        
        for (i = 0; i < keys.length; i++) {
            if (!keys[i].equalsIgnoreCase($.botname) && !keys[i].equalsIgnoreCase($.botowner)) {
                times = parseInt($.inidb.get("time", keys[i]));
            
                for (b = 0; b < top10time.length; b++) {
                    if (top10time[b][1] < times) {
                        for (k = top10time.length - 2; k >= b; k--) {
                            top10time[k + 1] = top10time[k];
                        }
                    
                        top10time[b] = new Array($.username.resolve(keys[i]), times);
                        break;
                    }
                }
            }
        }
        
        for (i = 0; i < top10time.length; i++) {
            if (i > 0) {
                s += "  -  ";
            }
            
            s += (i + 1) + ". " + top10time[i][0] + " [" + Math.round(top10time[i][1] / 3600)+ " Hrs]";
        }
        
        $.say(s);
    }
});

$.registerChatCommand("./commands/top10Command.js", "top10");
$.registerChatCommand("./commands/top10Command.js", "top10time");
;

