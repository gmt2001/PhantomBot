$.ticketCost = parseInt($.inidb.get("settings", "ticketcost"));

if ($.ticketCost == null || $.ticketCost == undefined || isNaN($.ticketCost)) {
    $.ticketCost = 10;
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var command = event.getCommand();
    var args = event.getArgs();
   
    if (command.equalsIgnoreCase("tickets")) {
        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.usage", $.ticketCost));
            return;
        } else if ($.TicketRaffleRunning == false) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.no-raffle-opened"));
            return;
        } else if ($.ticketCost > parseInt($.inidb.get("points", sender))) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.need-more-points"));
            return;
        } else if ($.TicketRaffleMaxEntries < args[0]) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.max-tickets-allowed", $.TicketRaffleMaxEntries));
            return;
        } else if ($.inidb.get("traffleplayer", sender) == "true") {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.error-already-in-raffle"));
            return;
        }

        for (var i = 0; i < parseInt(args[0]); i++) {
            $.TicketRaffleEntries.push(sender);
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.buy-success", parseInt(args[0])));
        $.inidb.set("traffleplayer", sender, "true");
        return;
    }

    if (command.equalsIgnoreCase("ticket")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.cost-usage"));
            return;
        }

        if (args[0].equalsIgnoreCase("cost")) {
            $.inidb.set("settings", "ticketcost", parseInt(args[1]));
            $.say($.lang.get("net.phantombot.ticketsystem.new-cost", parseInt(args[1]), $.pointname));
            return;
        }
    }
});

$.registerChatCommand("./systems/ticketSystem.js", "ticket");
