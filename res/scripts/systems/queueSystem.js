/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.playerqueue = [];
$.playrequestusers = {};

$.play_limit = $.inidb.get("settings", "play_limit");
if($.play_limit == "" || $.play_limit == null){
    $.play_limit = 5; //amount of times a player can queue
    $.inidb.set("settings","play_limit","");
}

$.play_cost = $.inidb.get("pricecom", "letmeplay");
if($.play_cost == "" || $.play_cost == null){
    $.play_cost = 5; //amount of times a player can queue
    $.inidb.set("pricecom","letmeplay","");
}

function PlayRequest(user, gametag) {
    this.user = user;
    this.gametag = gametag;

    this.request = function () {
        if (!this.canRequest()) {
            $.say("You can only queue up to " + $.play_limit + " times " + user + "!");
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
        if(($.playrequestusers[user] - amount) >= 1 ){
            $.playrequestusers[user] = $.playrequestusers[user] - amount;            
        }

    }
}



$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var points = $.inidb.get('points', sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if(command.equalsIgnoreCase("letmeplay")) {
        if(args[0]!=null)
        {
            if($.play_cost!=null ) {
                if(points < parseInt($.play_cost)) {
                    $.say("You don't have enough " + $.pointname + " to do that! Current cost to play: " + $.play_cost);
                    return;
                }                  
            }
            var gametag = args[0];
            $.playrequest = new PlayRequest(username, gametag);
            $.playrequest.request();
            $.say("You have been added to the waiting list " + username + "!");
            return;
            
        } else {
            $.say("You must include your in-game name with your request such as: !letmeplay somegaminghandle");
            return;
        }
        
    }
    
    if(command.equalsIgnoreCase("currentplayer")) {
        if($.playerqueue[0]==null){
           $.say("There are no viewers in game currently.");
           return;
        }
        $.say("Current player playing: " + $.playerqueue[0].user + " [Gamertag: " + $.playerqueue[0].gametag + "]");
    }
    
    if (command.equalsIgnoreCase("waitinglist")) {
        if(args[0]!=null)
        {
            if(!$.isAdmin(sender) || !$.isMod(sender)){
                $.say("You must be a moderator to use this command.");
                return;
            }
            
            if(args[0] == "limit"){
                if(args[1]!=null) {
                    $.play_limit = args[1];
                    $.inidb.set("settings","play_limit",$.play_limit);
                    $.say("The player queue request limit has been set to: " + $.play_limit);
                    return;
                } else {
                    $.say("You must specify a limit number greater than 0");
                    return;
                }
            }
            
        }
        
        var list = $.playerqueue;
        $.queuelist = "";
        
        if(list==null )
        {
            $.say("There are currently no players in queue.");
            return;
        }
        
        for(var i=1; i< list.length; i++){
            $.playrequester = list[i].user;
            $.queuelist +=$.playrequester;
            $.queuelist += " ";
            
        
            //unfinished: optional export queue list to external file
            /*if ($.titles==1){
                $.songurl = '<a href="https://www.youtube.com/watch?v=' + $.songid + '" target="new">' + $.songid + "</a> " + $.songname + " - " + $.songrequester + "</br>";
                $.writeToFile($.songurl, $.storepath + "queue.php", true);
            }
            else {
                $.songprefix = $.songid + " " + $.songname + " - " + $.songrequester;
                $.writeToFile($.songprefix, $.storepath + "queue.txt", true);
            }*/
        }
        
        if($.queuelist=="" || $.queuelist==null )
        {
            $.say("There are currently no players in queue.");
            return;
        }
        
        if($.queuelist.substr($.queuelist.length - 1)==" ") {
            $.queuelist = $.queuelist.substring(0, $.queuelist.length - 1);
        }
        
        $.say("Currently waiting to play: " + $.queuelist);
    }
    
    if(command.equalsIgnoreCase("nextround")) {
        if(!$.isMod(sender)){
            $.say("You must be a moderator to use this command.");
            return;
        }
        if($.playrequest!=null) {
            $.playrequest.decreaseRequestAmount(1,$.playrequest.user);            
        }
        $.playerqueue.shift();
        if($.playerqueue[0]!=null){
            $.say($.playerqueue[0].user + " it's your turn! [Gamertag: " + $.playerqueue[0].gametag + "]");
        } else {
            $.say("There are no more viewers waiting to play.");
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
},10*1000);