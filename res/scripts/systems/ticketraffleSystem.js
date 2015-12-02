$.TicketRaffleRunning = false;

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var subCommand = args[0];
 
    if (command.equalsIgnoreCase("traffle"))  {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
            return;
        }
       
        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.usage"));
            return;
        }
 
        if (subCommand.equalsIgnoreCase("close") || subCommand.equalsIgnoreCase("end")) {
            if ($.TicketRaffleRunning == false) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.no-raffle-opened"));
                return;
            }
     
            $.TicketRaffleRunning = false;
     
            var Winner = $.TicketRaffleEntries[$.randRange(1, $.TicketRaffleEntries.length) - 1];
     
            if (Winner == null) {
                $.say($.lang.get("net.phantombot.ticketrafflesystem.no-winner"));
                $.inidb.RemoveFile("traffleplayer");
                return;
            } else {
                $.say($.lang.get("net.phantombot.ticketrafflesystem.winner", Winner));
                $.inidb.set("traffle", "lastwinner", Winner);
                $.inidb.RemoveFile("traffleplayer");
                return;
            }
        }
     
        if (subCommand.equalsIgnoreCase("repick")) {
            var NewWinner = $.TicketRaffleEntries[$.randRange(1, $.TicketRaffleEntries.length) - 1];
            if (NewWinner.toLowerCase() == $.inidb.get("traffle", "lastwinner").toLowerCase()) {
                NewWinner = $.TicketRaffleEntries[$.randRange(1, $.TicketRaffleEntries.length) - 1];
            }
     
            if (NewWinner == null) {
                $.say($.lang.get("net.phantombot.ticketrafflesystem.winner-repick"));
                return;
            } else {
                $.say($.lang.get("net.phantombot.ticketrafflesystem.no-winner-repick", NewWinner));
                $.inidb.set("traffle", "lastwinner", NewWinner);
                return;
            }
        }
     
        if (subCommand.equalsIgnoreCase("open") || subCommand.equalsIgnoreCase("start")) {
            if ($.TicketRaffleRunning == true) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.raffle-already-opened"));
                return;
            }
           
            var MaxEntries;
     
            if (args.length >= 2) {
                MaxEntries = args[1];
            } else {
                MaxEntries = null;
            }
    
            $.TicketRaffleMaxEntries = MaxEntries;
            $.TicketRaffleEntries = [];
    
            if (MaxEntries == null) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.user-error"));
                return;
            } else {
                $.say($.lang.get("net.phantombot.ticketrafflesystem.raffle-opened", MaxEntries));
                $.TicketRaffleRunning = true;
                return;
            }
        }
    }
});

$.registerChatCommand("./systems/ticketraffleSystem.js", "traffle");
