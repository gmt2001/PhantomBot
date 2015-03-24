$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("raider")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        if ($.recentraider == null || $.recentraider == undefined) {
            $.recentraider = new Array();
        }
        
        if (args.length == 0) {
            $.say("Records an incoming raid. Usage: !raider <raider>");
        } else {
            var raider = args[0].toLowerCase();
            var raiderR = $.username.resolve(args[0]);
            
            for (var i = 0; i < $.recentraider.length; i++) {
                if (raider.equalsIgnoreCase($.recentraider[i][0]) && System.currentTimeMillis() - $.recentraider[i][1] < 5 * 60 * 1000) {
                    return;
                } else if (raider.equalsIgnoreCase($.recentraider[i][0])) {
                    $.recentraider.splice(i, 1);
                    break;
                }
            }
            
            $.recentraider.push(new Array(raider, System.currentTimeMillis()));
            
            $.inidb.incr("raiders", raider + "_count", 1);
                
            var num = $.inidb.get("raiders", raider + "_count");
                
            if (parseInt(num) % 10 == 1 && parseInt(num) % 100 != 11) {
                num = num + "st";
            } else if (parseInt(num) % 10 == 2 && parseInt(num) % 100 != 12) {
                num = num + "nd";
            } else if (parseInt(num) % 10 == 3 && parseInt(num) % 100 != 13) {
                num = num + "rd";
            } else {
                num = num + "th";
            }
                
            $.say("Thanks for the raid " + raiderR + "! This is the " + num + " time " + raiderR + " has raided! Please give them a follow at twitch.tv/" + raiderR);
        }
    }
});

$.registerChatCommand("./systems/raidSystem.js", "raider", "mod");