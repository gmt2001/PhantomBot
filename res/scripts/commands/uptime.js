var seconds = 0; // uptime in seconds
$.setInterval(function() {
    seconds++;
}, 1000);

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender).toLowerCase();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();
    var action = args[0]
    var message = ("Bot Up Time: " + seconds + " seconds.");
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(seconds / 3600);
    var days = Math.floor(minutes / 86400);
	
    if (command.equalsIgnoreCase("uptime") && argsString.isEmpty()) {
        if (seconds >= 60) {
            message = ("Bot Up Time: " + minutes + " minutes.");
        }
        if (minutes >= 60) {
            message = ("Bot Up Time: " + hours + " hours.");
        }
        if (hours >= 24) {
            message = ("Bot Up Time: " + days + " days.");
        }
       
        $.say(message);
        return;
    } 

});