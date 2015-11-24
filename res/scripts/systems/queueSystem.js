$.playerqueue = [];
$.playrequestusers = {};

$.play_limit = $.inidb.get("settings", "play_limit");
if ($.play_limit == "" || $.play_limit == null) {
    $.play_limit = 5; //amount of times a player can queue
    $.inidb.set("settings","play_limit","");
}

$.play_cost = $.inidb.get("pricecom", "letmeplay");
if ($.play_cost == "" || $.play_cost == null) {
    $.play_cost = 5; //amount of times a player can queue
    $.inidb.set("pricecom", "letmeplay", "");
}

function PlayRequest(user, gametag) {
    this.user = user;
    this.gametag = gametag;

    this.request = function () {
        if (!this.canRequest()) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.request-limit-hit", $.play_limit));
            return;
        }
        if ($.playrequestusers[user] != null) {
            $.playrequestusers[user]++;
        } else {
            $.playrequestusers[user] = 1;
        }
        $.playerqueue.push(this);
    }

    this.canRequest = function () {
        var requestLimit = $.play_limit;
        if ($.playrequestusers[user] == null) {
            return true;
        }
        return $.playrequestusers[user] < parseInt(requestLimit);
    }

    this.play = function () {
        $.playrequestusers[user]--;
    }

    this.decreaseRequestAmount = function (amount,user) {
        if (($.playrequestusers[user] - amount) >= 1) {
            $.playrequestusers[user] = $.playrequestusers[user] - amount;            
        }
    }
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var points = $.inidb.get('points', sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("letmeplay")) {
        if (args[0] != null) {
            if ($.play_cost != null) {
                if (points < parseInt($.play_cost)) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.error-need-more-points", $.pointname));
                    return;
                }                  
            }

            var gametag = args[0];
            $.playrequest = new PlayRequest(username, gametag);
            $.playrequest.request();
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.added-to-waiting-list"));
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.error-adding-to-waiting-list"));
            return;
        }   
    }
    
    if (command.equalsIgnoreCase("currentplayer")) {
        if ($.playerqueue[0] == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.no-current-players"));
            return;
        }
        $.say($.lang.get("net.phantombot.queueSystem.current-player", $.playerqueue[0].user, $.playerqueue[0].gametag));
        return;
    }
    
    if (command.equalsIgnoreCase("waitinglist")) {
        if (args[0] != null) {
            if (!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
                return;
            }
            
            if (args[0] == "limit"){
                if(args[1]!=null) {
                    $.play_limit = args[1];
                    $.inidb.set("settings","play_limit",$.play_limit);
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.request-limit-set", $.play_limit));
                    return;
                } else {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.request-limit-error-usage"));
                    return;
                }
            }   
        }
        
        var list = $.playerqueue;
        $.queuelist = "";
        
        if (list == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.no-player-in-q"));
            return;
        }
        
        for (var i = 1; i < list.length; i++) {
            $.playrequester = list[i].user;
            $.queuelist +=$.playrequester;
            $.queuelist += " ";
        
        //unfinished: optional export queue list to external file
        /*if ($.titles==1){
                $.songurl = '<a href="https://www.youtube.com/watch?v=' + $.songid + '" target="new">' + $.songid + "</a> " + $.songname + " - " + $.songrequester + "</br>";
                $.writeToFile($.songurl, $.storepath + "queue.php", true);
            } else {
                $.songprefix = $.songid + " " + $.songname + " - " + $.songrequester;
                $.writeToFile($.songprefix, $.storepath + "queue.txt", true);
            }*/
        }
        
        if ($.queuelist == "" || $.queuelist == null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.no-player-in-q"));
            return;
        }
        
        if ($.queuelist.substr($.queuelist.length - 1) == " ") {
            $.queuelist = $.queuelist.substring(0, $.queuelist.length - 1);
        }
        
        $.say($.lang.get("net.phantombot.queueSystem.current-players", $.queuelist));
        return;
    }
    
    if (command.equalsIgnoreCase("nextround")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
            return;
        }

        if ($.playrequest != null) {
            $.playrequest.decreaseRequestAmount(1, $.playrequest.user);            
        }

        $.playerqueue.shift();
        if ($.playerqueue[0] != null) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.senders-trun-to-player"));
            return;
        } else {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.queueSystem.no-players-waiting"));
            return;
        }
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./systems/queueSystem.js')) {
        $.registerChatCommand("./systems/queueSystem.js", "letmeplay");
        $.registerChatCommand("./systems/queueSystem.js", "currentplayer");
        $.registerChatCommand("./systems/queueSystem.js", "waitinglist");
        $.registerChatCommand("./systems/queueSystem.js", "nextround");
    }
},10 * 1000);
