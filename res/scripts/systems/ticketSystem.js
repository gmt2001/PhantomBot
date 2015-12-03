$.ticketCost = parseInt($.inidb.get("settings", "ticketcost"));

if ($.ticketCost == null || $.ticketCost == undefined || isNaN($.ticketCost)) {
    $.ticketCost = 10;
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var command = event.getCommand();
    var args = event.getArgs();
   
    if (command.equalsIgnoreCase("tickets")) {
        if ($.TicketRaffleRunning == false) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.no-raffle-opened"));
            return;
        } else if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.usage", $.ticketCost));
            return;
        } else if ($.ticketCost > $.inidb.get("points", sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.need-more-points"));
            return;
        } else if ($.TicketRaffleMaxEntries < parseInt(args[0])) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.max-tickets-allowed", $.TicketRaffleMaxEntries));
            return;
        } else if ($.inidb.get("traffleplayer", sender) == "true") {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.error-already-in-raffle"));
            return;
        }
        if ($.Followers == true) {
            if ($.inidb.get("followed", sender) == null) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.following"));
                return;
            }
        } else if ($.Subscribers == true) {
            if ($.inidb.get("subscribed", sender) == null) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketrafflesystem.no-sub"));
                return;
            }
        }
        var tickets = parseInt(args[0]);
        if ($.inidb.get("subscribed", sender) == true) {
            for (var i = 0; i < tickets * $.SubscriberLuck; i++) {
                $.TicketRaffleEntries.push(sender);
            }
        } else {
            for (var i = 0; i < tickets; i++) {
                $.TicketRaffleEntries.push(sender);
            }
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.buy-success", tickets));
        $.inidb.set("traffleplayer", sender, "true");
        $.inidb.decr("points", sender, (tickets * $.ticketCost));
        return;
    }

    if (command.equalsIgnoreCase("entries")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.adminonly"));
            return;
        }
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.ticketsystem.total-entries", $.TicketRaffleEntries.length));
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
            $.say($.lang.get("net.phantombot.ticketsystem.new-cost", parseInt(args[1]), "point(s)"));
            return;
        }
    }
});

$.registerChatCommand("./systems/ticketSystem.js", "ticket");
