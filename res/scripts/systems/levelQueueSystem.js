/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.levelqueue = [];
$.levelrequestusers = {};

$.request_limit = $.inidb.get("settings", "request_limit");
if($.request_limit == "" || $.request_limit == null){
    $.request_limit = 5; //amount of times a user can queue levels
    $.inidb.set("settings","request_limit","");
}

function LevelRequest(user, levelId) {
    this.user = user;
    this.levelId = levelId;

    this.request = function () {
        if (!this.canRequest()) {
            $.say("You can only request up to " + $.request_limit + " levels, " + user + "!");
            return;
        }
        if ($.levelrequestusers[user] != null) {
            $.levelrequestusers[user]++;


        } else {
            $.levelrequestusers[user] = 1;

        }
        $.levelqueue.push(this);

    }

    this.canRequest = function () {
        var requestLimit = $.request_limit;
        if ($.levelrequestusers[user] == null) {
            return true;
        }
        return $.levelrequestusers[user] < parseInt(requestLimit);
    }

    this.pop = function () {
        $.levelrequestusers[user]--;
    }
    this.decreaseRequestAmount = function (amount, user) {
        if(($.levelrequestusers[user] - amount) >= 1 ){
            $.levelrequestusers[user] = $.levelrequestusers[user] - amount;            
        }

    }
}



$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if(command.equalsIgnoreCase("request")) {
        if(args[0]!=null)
        {
            var levelId = args[0];
            $.levelrequest = new LevelRequest(username, levelId);
            $.levelrequest.request();
            $.say("Level " + levelId + " has been queued by " + username + "!");
            return;
            
        } else {
            $.say("Please include a level name/checksum in your request: !request 0123-4567-8910");
            return;
        }
        
    }
    
    if(command.equalsIgnoreCase("currentlevel")) {
        if($.levelqueue[0]==null){
            $.say("Current level is unknown / not requested by users.");
            return;
        }
        $.say("Current level: " + $.levelqueue[0].levelId + " [Requested by: " + $.levelqueue[0].user + "]");
    }
    
    if (command.equalsIgnoreCase("requests")) {
        if(args[0]!=null)
        {
            if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                $.say("You must be a moderator to use this command.");
                return;
            }
            
            if(args[0] == "limit"){
                if(args[1]!=null) {
                    $.request_limit = args[1];
                    $.inidb.set("settings","request_limit",$.request_limit);
                    $.say("The queue request limit has been set to: " + $.request_limit);
                    return;
                } else {
                    $.say("You must specify a limit number greater than 0");
                    return;
                }
            }
            
        }
        
        var list = $.levelqueue;
        $.queuelist = "";
        
        if(list==null )
        {
            $.say("No levels are queued.");
            return;
        }
        
        for(var i=1; i< list.length; i++){
            $.playrequester = list[i].levelId;
            $.queuelist +=$.playrequester;
            $.queuelist += " ";
        }
        
        if($.queuelist=="" || $.queuelist==null )
        {
            $.say("No levels are queued.");
            return;
        }
        
        if($.queuelist.substr($.queuelist.length - 1)==" ") {
            $.queuelist = $.queuelist.substring(0, $.queuelist.length - 1);
        }
        
        $.say("Next level: " + $.queuelist);
    }
    
    if(command.equalsIgnoreCase("nextlevel")) {
        if(!$.isModv3(sender, event.getTags())){
            $.say("You must be a moderator to use this command.");
            return;
        }
        if($.levelrequest!=null) {
            $.levelrequest.decreaseRequestAmount(1,$.levelrequest.user);            
        }
        $.levelqueue.shift();
        if($.levelqueue[0]!=null){
            $.say($.levelqueue[0].user + " your level is coming up! [Level ID: " + $.levelqueue[0].levelId + "]");
        } else {
            $.say("All levels from queue have been played!");
        }
    }

});
setTimeout(function(){ 
    if ($.moduleEnabled('./systems/queueSystem.js')) {
        $.registerChatCommand("./systems/queueSystem.js", "request");
        $.registerChatCommand("./systems/queueSystem.js", "currentlevel");
        $.registerChatCommand("./systems/queueSystem.js", "requests");
        $.registerChatCommand("./systems/queueSystem.js", "nextlevel");
    }
},10*1000);
