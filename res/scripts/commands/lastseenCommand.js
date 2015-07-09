$.on('command', function (event) {
    var command = event.getCommand();
    var args = event.getArgs();
    var lastTarget = $.inidb.get('lastseen', args[0]);
    
    if (command.equalsIgnoreCase("lastseen")) {

        
        if (lastTarget == null ) {
            lastTarget = "No data.";
        }
        
        if (args.length >= 1) {
            $.say ( $.username.resolve(args[0]) + " was last seen at: " + lastTarget);
        } else {
            $.say("Usage: !lastseen <name>");
        }
        
    }
});

$.on('ircChannelJoin', function(event) {
    var username = event.getUser().toLowerCase();
    
    var datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    $.inidb.set("lastseen", username, timestamp);
});

$.on('ircChannelMessage', function(event) {
    var sender = event.getSender().toLowerCase();
    
    var datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    $.inidb.set("lastseen", sender, timestamp);
});

setTimeout(function(){ 
if ($.moduleEnabled('./commands/lastseenCommand.js')) {
$.registerChatCommand("./commands/lastseenCommand.js", "lastseen");
}
},10*1000);