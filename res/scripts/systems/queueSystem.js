/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$var.playerqueue = [];
$var.playrequestusers = {};

$.play_limit = $.inidb.get("settings", "play_limit");
if($.play_limit == "" || $.play_limit == null){
    $.play_limit = 5; //amount of times a player can queue
    $.inidb.set("settings","play_limit","");
}

$.play_cost = $.inidb.get("pricecom", "letmeplay");
if($.play_cost == "" || $.play_cost == null){
    $.play_cost = 5; //amount of times a player can queue
    $.inidb.set("settings","play_cost","");
}

function occurrences(string, subString, allowOverlapping){

    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}

function PlayRequest(user, gametag) {
    this.user = user;
    this.gametag = gametag;

    this.request = function () {
        if (!this.canRequest()) {
            $.say("You can only queue up to " + $.play_limit + " times " + username + "!");
            return;
        }

        $var.playerqueue.push(this);

        if ($var.playrequestusers[user] != null) {
            $var.playrequestusers[user]++;

        } else {
            $var.playrequestusers[user] = 1;
        }
    }

    this.canRequest = function () {
        var requestLimit = $.play_limit;
        if ($var.playrequestusers[user] == null) return true;        
        return $var.playrequestusers[user] < parseInt(requestLimit);
    }

    this.play = function () {
        $var.playrequestusers[user]--;
    }
    this.decreaseRequestAmount = function (amount,user) {
        if(($var.playrequestusers[user] - amount) >= 1 ){
            $var.playrequestusers[user] = $var.playrequestusers[user] - amount;            
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
            if(!$.playrequest.canRequest()){
                $.say("You can only queue up to " + $.play_limit + " times " + username + "!");
                return;
            }
            $.playrequest.request();
            $.say("You have been added to the waiting list " + username + "!");
            return;
            
        } else {
            $.say("You must include your in-game name with your request such as: !letmeplay somegaminghandle");
            return;
        }
        
    }
    
    if(command.equalsIgnoreCase("currentplayer")) {
        if($var.playerqueue[0]==null){
           $.say("There are no viewers in game currently.");
           return;
        }
        $.say("Current player playing: " + $var.playerqueue[0].user + " [Gamertag: " + $var.playerqueue[0].gametag + "]");
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
        
        var list = $var.playerqueue;
        $.queuelist = "";
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
        
        if($.queuelist.substr($.queuelist.length - 1)==" ") {
            $.queuelist = $.queuelist.substring(0, $.queuelist.length - 1);
        }
        
        if($.queuelist=="" || $.queuelist==null)
        {
            $.say("There are currently no players in queue.");
            return;
        }
        
        $.say("Currently waiting to play: " + $.queuelist);
    }
    
    if(command.equalsIgnoreCase("nextround")) {
        if(!$.isAdmin(sender) || !$.isMod(sender)){
            $.say("You must be a moderator to use this command.");
            return;
        }
        $.playrequest.decreaseRequestAmount(1,$.playrequest.user);
        $var.playerqueue.shift();
        if($var.playerqueue[0]!=null){
            $.say($var.playerqueue[0].user + " it's your turn! [Gamertag: " + $var.playerqueue[0].gametag + "]");
        } else {
            $.say("There are no more viewers waiting to play.");
        }
    }

});
    
$.registerChatCommand("./systems/queueSystem.js", "letmeplay");
$.registerChatCommand("./systems/queueSystem.js", "currentplayer");
$.registerChatCommand("./systems/queueSystem.js", "waitinglist");
$.registerChatCommand("./systems/queueSystem.js", "nextround");

