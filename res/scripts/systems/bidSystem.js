
$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }

    if (command.equalsIgnoreCase("bid") || command.equalsIgnoreCase("auction")) {
        if (!$.moduleEnabled("./systems/pointSystem.js")) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.points-disabled"));
            return;
        }

        if (args.length >= 1) {
            var action = args[0];

            if (action.equalsIgnoreCase("start")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                if ($.auctionRunning == 1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.start-error-running"));
                    return;
                } else {
                    $.auctionMinimum = 1;
                    $.auctionIncrement = 1;
                    $.auctionRunning = 0;

                    $.auctionTopUser = "";
                    $.auctionTopPoints = 0;

                    if (args[1] != null && args[1] != undefined && !isNaN(args[1])) {
                        $.auctionMinimum = parseInt(args[1]);
                    }
                    if (args[2] != null && args[2] != undefined && !isNaN(args[2])) {
                        $.auctionIncrement = parseInt(args[2]);
                    }

                    $.auctionRunning = 1;

                    $.say($.lang.get("net.phantombot.bidsystem.start-success", $.getPointsString($.auctionMinimum), $.getPointsString($.auctionIncrement)));
                    return;
                }
            } else if (action.equalsIgnoreCase("warn") || action.equalsIgnoreCase("warning")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                if ($.auctionRunning == 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.warning-error-notrunning"));
                    return;
                } else {
                    if ($.auctionTopPoints == 0) {
                        $.say($.lang.get("net.phantombot.bidsystem.warning-success-noentries", $.getPointsString($.auctionMinimum)));
                        return;
                    } else {
                        $.say($.lang.get("net.phantombot.bidsystem.warning-success-entries", $.getPointsString($.auctionTopPoints), $.username.resolve($.auctionTopUser), $.getPointsString($.auctionTopPoints + $.auctionIncrement)));
                        return;
                    }
                }
            } else if (action.equalsIgnoreCase("end") || action.equalsIgnoreCase("close")) {
                if (!$.isModv3(sender, event.getTags())) {
                    $.say($.getWhisperString(sender) + $.modmsg);
                    return;
                }

                if ($.auctionRunning == 0) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.close-error-notrunning"));
                    return;
                } else {
                    if ($.auctionTopUser == "" || $.auctionTopUser == null) {
                        $.auctionRunning = 0;

                        $.say($.lang.get("net.phantombot.bidsystem.close-success-noentries"));
                        return;
                    } else {
                        $.auctionRunning = 0;

                        $.inidb.decr('points', $.auctionTopUser.toLowerCase(), $.auctionTopPoints);

                        $.say($.lang.get("net.phantombot.bidsystem.close-success", $.username.resolve($.auctionTopUser), $.getPointsString($.auctionTopPoints)));
                        return;
                    }
                }
            } else {
                if (isNaN(action)) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.usage"));
                    return;
                } else {
                    if ($.auctionRunning == 0) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-error-notrunning"));
                        return;
                    } else {
                        var userBid = parseInt(action);
                        var userPoints = $.inidb.get('points', sender);

                        if ($.auctionTopPoints == 0) {
                            if (userBid > $.inidb.get('points', sender)) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-error-notenough", $.inidb.get('settings', 'pointNameMultiple'), $.getPointsString(action)));
                                return;
                            }
                            if (userBid < $.auctionMinimum) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-error-belowminimum", $.getPointsString($.auctionMinimum)));
                                return;
                            }

                            $.auctionTopPoints = userBid;
                            $.auctionTopUser = sender;

                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-success", $.username.resolve($.auctionTopUser), $.getPointsString($.auctionTopPoints), $.getPointsString($.auctionTopPoints + $.auctionIncrement)));
                            return;
                        } else {
                            if (userBid > $.inidb.get('points', sender)) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-error-notenough", $.inidb.get('settings', 'pointNameMultiple'), $.getPointsString(action)));
                                return;
                            }
                            if (userBid < ($.auctionTopPoints + $.auctionIncrement)) {
                                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-error-belowminimum", $.getPointsString($.auctionTopPoints + $.auctionIncrement)));
                                return;
                            }

                            $.auctionTopPoints = userBid;
                            $.auctionTopUser = sender;

                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.enter-success", $.username.resolve($.auctionTopUser), $.getPointsString($.auctionTopPoints), $.getPointsString($.auctionTopPoints + $.auctionIncrement)));
                            return;
                        }
                    }
                }
            }
        } else {
            if ($.auctionRunning == 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.bidsystem.get-error-notrunning", "Moderator"));
                return;
            } else {
                if ($.auctionTopPoints == 0) {
                    $.say($.lang.get($.getWhisperString(sender) + "net.phantombot.bidsystem.get-running-noentries", $.getPointsString($.auctionMinimum)));
                    return;
                } else {
                    $.say($.lang.get($.getWhisperString(sender) + "net.phantombot.bidsystem.get-running-entries", $.getPointsString($.auctionTopPoints), $.username.resolve($.auctionTopUser), $.getPointsString($.auctionTopPoints + $.auctionIncrement)));
                    return;
                }
            }
        }
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/bidSystem.js')) {
        $.registerChatCommand("./systems/bidSystem.js", "bid");
    }
}, 10 * 1000);
