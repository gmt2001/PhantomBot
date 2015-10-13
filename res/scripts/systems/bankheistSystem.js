$.bankheistIsOn = false;
$.pointsId = 0;
$.entrySeconds = 0;
$.senderId = "";
$.senderBet = "";
$.heistUserPoints = "";
$.userPointsId = "";
$.winningPot = 0;

$.bankheistToggle = $.inidb.get("settings", "bankheistToggle");
if($.bankheistToggle == "" || $.bankheistToggle == null){
    $.bankheistToggle = false; //in minute
    $.inidb.set("settings","bankheistToggle","false");
}

$.bankheistMaxBet = $.inidb.get("settings", "bankheistmaxbet");
if($.bankheistMaxBet == "" || $.bankheistMaxBet == null){
    $.bankheistMaxBet = 100; //in minute
    $.inidb.set("settings","bankheistmaxbet","");
}

$.signupMinutes = $.inidb.get("bankheist_timers", "signupMinutes");
if($.signupMinutes == "" || $.signupMinutes == null){
    $.signupMinutes = 1; //in minute
    $.inidb.set("bankheist_timers","signupMinutes","");
}

$.heistMinutes = $.inidb.get("bankheist_timers", "heistMinutes");
if($.heistMinutes == "" || $.heistMinutes == null){
    $.heistMinutes = 30; //in minutes
    $.inidb.set("bankheist_timers","heistMinutes","");
}

$.stringNoJoin = $.inidb.get("bankheist_strings", "stringNoJoin");
if($.stringNoJoin == "" || $.stringNoJoin == null){
    $.stringNoJoin = "No one joined the bankheist! The banks are safe for now.";
    $.inidb.set("bankheist_strings","stringNoJoin","");
}

$.stringStarting = $.inidb.get("bankheist_strings", "stringStarting");
if($.stringStarting == "" || $.stringStarting == null){
    $.stringStarting = "Alright guys, check your guns. We are storming into the Bank through all entrances. Let's get the cash and get out before the cops get here.";
    $.inidb.set("bankheist_strings","stringStarting","");
}

$.stringFlawless = $.inidb.get("bankheist_strings", "stringFlawless");
if($.stringFlawless == "" || $.stringFlawless == null){
    $.stringFlawless = "The crew executed the heist flawlessly and scored (points) (pointname) from the vault without leaving a trace!";
    $.inidb.set("bankheist_strings","stringFlawless","");
}

$.stringCasualties = $.inidb.get("bankheist_strings", "stringCasualties");
if($.stringCasualties == "" || $.stringCasualties == null){
    $.stringCasualties = "The crew suffered a few losses engaging the local security team. The remaining crew got away scoring (points) (pointname) from the vault before backup arrived.";
    $.inidb.set("bankheist_strings","stringCasualties","");
}

$.stringPayouts = $.inidb.get("bankheist_strings", "stringPayouts");
if($.stringPayouts == "" || $.stringPayouts == null){
    $.stringPayouts = "The heist payouts are: ";
    $.inidb.set("bankheist_strings","stringPayouts","");
}

$.stringAllDead = $.inidb.get("bankheist_strings", "stringAllDead");
if($.stringAllDead == "" || $.stringAllDead == null){
    $.stringAllDead = "The security team killed everyone in the heist!";
    $.inidb.set("bankheist_strings","stringAllDead","");
}

$.banksClosed = $.inidb.get("bankheist_strings", "banksClosed");
if($.banksClosed == "" || $.banksClosed == null){
    $.banksClosed = "The banks are currently closed!";
    $.inidb.set("bankheist_strings","banksClosed","");
}

$.enterABet = $.inidb.get("bankheist_strings", "enterABet");
if($.enterABet == "" || $.enterABet == null){
    $.enterABet = "You must enter a bet! For example !bankheist (amount)";
    $.inidb.set("bankheist_strings","enterABet","");
}

$.affordBet = $.inidb.get("bankheist_strings", "affordBet");
if($.affordBet == "" || $.affordBet == null){
    $.affordBet = "You must enter a bet you can afford and is not 0 ";
    $.inidb.set("bankheist_strings","affordBet","");
}

$.alreadyBet = $.inidb.get("bankheist_strings", "alreadyBet");
if($.alreadyBet == "" || $.alreadyBet == null){
    $.alreadyBet = " you have already placed a bet of ";
    $.inidb.set("bankheist_strings","alreadyBet","");
}

$.startedHeist = $.inidb.get("bankheist_strings", "startedHeist");
if($.startedHeist == "" || $.startedHeist == null){
    $.startedHeist = " has started a bankheist! To join in type !bankheist (amount)";
    $.inidb.set("bankheist_strings","startedHeist","");
}

$.joinedHeist = $.inidb.get("bankheist_strings", "joinedHeist");
if($.joinedHeist == "" || $.joinedHeist == null){
    $.joinedHeist = ", you have joined in on the bank heist!";
    $.inidb.set("bankheist_strings","joinedHeist","");
}

$.banksOpen = $.inidb.get("bankheist_strings", "banksOpen");
if($.banksOpen == "" || $.banksOpen == null){
    $.banksOpen = "The banks are now open for the taking! Use !bankheist (amount) to bet. " + $.signupMinutes + " minute(s) remaining to join!";
    $.inidb.set("bankheist_strings","banksOpen","");
}

$.heistCancelled = $.inidb.get("bankheist_strings", "heistCancelled");
if($.heistCancelled == "" || $.heistCancelled == null){
    $.heistCancelled  = " has cleared all previous bankheists. A new bankheist will start in " + $.signupMinutes + " minute(s)";
    $.inidb.set("bankheist_strings","heistCancelled","");
}

$.betTooLarge = $.inidb.get("bankheist_strings", "betTooLarge");
if($.betTooLarge == "" || $.betTooLarge == null){
    $.betTooLarge = "The maximum amount allowed is ";
    $.inidb.set("bankheist_strings","stringNoJoin","");
}

$.chances50 = $.inidb.get("bankheist_chances", "chances50");
if($.chances50 == "" || $.chances50 == null){
    $.chances50 = $.randInterval(33, 36);
    $.inidb.set("bankheist_chances","chances50","");
}

$.chances40 = $.inidb.get("bankheist_chances", "chances40");
if($.chances40 == "" || $.chances40 == null){
    $.chances40 = $.randInterval(39, 44);
    $.inidb.set("bankheist_chances","chances40","");
}

$.chances30 = $.inidb.get("bankheist_chances", "chances30");
if($.chances30 == "" || $.chances30 == null){
    $.chances30 = $.randInterval(43, 50);
    $.inidb.set("bankheist_chances","chances30","");
}

$.chances20 = $.inidb.get("bankheist_chances", "chances20");
if($.chances20 == "" || $.chances20 == null){
    $.chances20 = $.randInterval(48, 58);
    $.inidb.set("bankheist_chances","chances20","");
}

$.chances10 = $.inidb.get("bankheist_chances", "chances10");
if($.chances10 == "" || $.chances10 == null){
    $.chances10 = $.randInterval(55, 65);
    $.inidb.set("bankheist_chances","chances10","");
}

$.ratio50 = $.inidb.get("bankheist_ratios", "ratio50");
if($.ratio50 == "" || $.ratio50 == null){
    $.ratio50 = 2.75;
    $.inidb.set("bankheist_ratios","ratio50","");
}

$.ratio40 = $.inidb.get("bankheist_ratios", "ratio40");
if($.ratio40 == "" || $.ratio40 == null){
    $.ratio40 = 2.25;
    $.inidb.set("bankheist_ratios","ratio40","");
}

$.ratio30 = $.inidb.get("bankheist_ratios", "ratio30");
if($.ratio30 == "" || $.ratio30 == null){
    $.ratio30 = 2;
    $.inidb.set("bankheist_ratios","ratio30","");
}

$.ratio20 = $.inidb.get("bankheist_ratios", "ratio20");
if($.ratio20 == "" || $.ratio20 == null){
    $.ratio20 = 1.7;
    $.inidb.set("bankheist_ratios","ratio20","");
}

$.ratio10 = $.inidb.get("bankheist_ratios", "ratio10");
if($.ratio10 == "" || $.ratio10 == null){
    $.ratio10 = 1.5;
    $.inidb.set("bankheist_ratios","ratio10","");
}

function processBankheist() {
    $.winningPot = 0;
    if($.pointsId+1 == 1) {
        $.bankheistIsOn = false;
        $.say($.stringNoJoin);
        $.entrySeconds = 0;
        $.pointsId = 0;
        return;
    } else {
        $.bankheistIsOn = false;
        $.say($.stringStarting);
        var people = $.pointsId;
        var chances = 0;
        var winningsRatio = 1;
        
        if(people >= 40) {
            chances = parseInt($.chances50);
            winningsRatio = parseInt($.ratio50);
        } else if(people <= 39 && people >= 30) {
            chances = parseInt($.chances40);
            winningsRatio = parseInt($.ratio40);
        } else if (people <= 29 && people >= 20){
            chances = parseInt($.chances30);
            winningsRatio = parseInt($.ratio30);
        } else {
            if(people < 20 && people >=10){
                chances = parseInt($.chances20);
                winningsRatio = parseInt($.ratio20);
            } else if(people < 10) {
                chances = parseInt($.chances10);
                winningsRatio = parseInt($.ratio10);
            }
        }
        var winnersList = $.stringPayouts;
        var winnersListEmpty = true;
        $.flawless = 1;
        var i = 1;
        while( i <= people ) {
            var name = $.inidb.get("bankheist_roster", i);
            var bet = $.inidb.get("bankheist_bets", i);
            var username = $.username.resolve(name);
            var randomNum = $.randRange(1, 100);
            $.heistUserPoints = parseInt($.inidb.get("points", name));
            if(randomNum<=chances) {
                var betWin = parseInt(Math.round(winningsRatio*bet));
                $.winningPot+=betWin;
                $.inidb.incr("points",name,betWin);
                winnersList += username;
                winnersList += " ";
                winnersList += "(+" + (winningsRatio*bet).toString() + ")";
                
                if(i < people) {
                    winnersList+= ", ";
                }
                
                winnersListEmpty = false;
            } else {
                if( ($.heistUserPoints - bet) < 0 ) {
                    $.inidb.set("points",name, "0");
                } else {
                    $.inidb.decr("points",name, bet);
                    $.flawless = 0;
                }
            }
            i++;
        }
        if(winnersListEmpty==true) {
            $.entrySeconds = 0;
            $.pointsId = 0;
            $.say($.stringAllDead);
        } else {
            $.entrySeconds = 0;
            $.pointsId = 0;
            $.inidb.SaveAll(true);
            var string = "";
            if(winnersList.substr(winnersList.length - 1)==",") {
                winnersList = winnersList.substring(0, winnersList.length - 1);
            }
            if(winnersList.substr(winnersList.length - 2)==", ") {
                winnersList = winnersList.substring(0, winnersList.length - 2);
            }
            if($.flawless = 1) {
                string = $.stringFlawless;
            } else {
                string = $.stringCasualties;
            }
            string = string.replace('(pointname)', $.pointNameMultiple);
            string = string.replace('(points)', $.winningPot);
            
            $.say(string);
            $.say(winnersList);
        }    
    }
};
function startHeist() {
    $.startBankHeist = $.timer.addTimer("./systems/bankheistSystem.js", "bankheist", true, function() {
        $.enterBankheist = $.timer.addTimer("./systems/bankheistSystem.js", "enterbankheist", true, function() {
            $.entrySeconds++;
            if($.entrySeconds == 1){
                $.bankheistIsOn = true;
                $.writeToFile("", "inistore/bankheist_roster.ini", false);
                $.writeToFile("", "inistore/bankheist_bets.ini", false);
                $.inidb.ReloadFile("bankheist_roster");
                $.inidb.ReloadFile("bankheist_bets");
                $.senderId = "";
                $.senderBet = "";
                $.say($.banksOpen);
            } else {
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                $.processBankheist();
            }
            return;
        }, (parseInt($.signupMinutes)*60)*1000); //signup time
    }, (parseInt($.heistMinutes)*60)* 1000); //bankheist run time                
};

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var args = event.getArgs();    
    var betAmount = args[0];
    

    if (command.equalsIgnoreCase("bankheist")) {
        if(args[0]==null || !$.isOnline($.botowner)) {
            $.say($.getWhisperString(event.getSender()) + $.banksClosed);
            return;
        }
        if(args[0]=="toggle"){
        
            if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                return;
            }
            if($.bankheistToggle==false){
                $.bankheistToggle = true;
                $.inidb.set("settings","bankheistToggle","true");

                startHeist();

                $.say($.getWhisperString(event.getSender()) + "Bankheists are now enabled!");
                return;
                
            } else {
                $.bankheistToggle = false;
                $.inidb.set("settings","bankheistToggle","false");
                $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                $.say($.getWhisperString(event.getSender()) + "Bankheists are now disabled!");
                return;
            }
        } else if(args[0].equalsIgnoreCase("start")) {
            
            if(!$.isModv3(sender, event.getTags())){
                $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                return;
            }          
            $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
            $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
            $.say(username + $.heistCancelled);
            $.timer.addTimer("./systems/bankheistSystem.js", "enterbankheist", true, function() {
                $.entrySeconds++;
                if($.entrySeconds == 1){
                    $.bankheistIsOn = true;
                    $.writeToFile("", "inistore/bankheist_roster.ini", false);
                    $.writeToFile("", "inistore/bankheist_bets.ini", false);
                    $.inidb.ReloadFile("bankheist_roster");
                    $.inidb.ReloadFile("bankheist_bets");
                    $.senderId = "";
                    $.senderBet = "";
                    $.say($.banksOpen);
                } else {
                    $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                    $.processBankheist();
                    if($.bankheistToggle == true && $.isOnline($.botowner)) {
                        startHeist();                                
                    }
                }
                return;
            }, (parseInt($.signupMinutes)*60)*1000); //60 second entry window
            return;
            
        } else if(parseInt(args[0])){
        
            if ($.bankheistIsOn==false) {
                $.say($.getWhisperString(event.getSender()) + $.banksClosed);
                return;
            } else {
                $.heistUserPoints = parseInt($.inidb.get("points", sender));
                $.userPointsId = parseInt($.pointsId + 1);
            
                if(!parseInt(betAmount) || !parseInt($.userPointsId)){
                    $.say($.getWhisperString(event.getSender()) + $.enterABet);
                    return;
                } else if( parseInt(betAmount) > $.heistUserPoints  || parseInt(betAmount)==0 ){
                    $.say($.getWhisperString(event.getSender()) +  $.affordBet + "[Points available: " + $.heistUserPoints.toString());
                    return;
                } else  if(parseInt(betAmount) > $.bankheistMaxBet){
                    $.say($.getWhisperString(event.getSender()) + $.betTooLarge + $.bankheistMaxBet + ".");
                    return;
                } else {
                    if($.inidb.exists("bankheist_roster", sender))
                    {
                        $.senderId = $.inidb.get("bankheist_roster", sender);
                        $.senderBet = $.inidb.get("bankheist_bets", $.senderId);
                        $.say($.getWhisperString(event.getSender()) + username + $.alreadyBet + $.senderBet.toString());
                        return;
                    } else {
                        $.inidb.set("bankheist_roster", $.userPointsId.toString(), sender);
                        $.inidb.set("bankheist_roster", sender, $.userPointsId.toString());
                        $.pointsId++;
                        $.inidb.set("bankheist_bets", $.userPointsId, betAmount);
                        if($.userPointsId==1) {
                            $.say(username + $.startedHeist);
                        } else {
                            $.say($.getWhisperString(event.getSender()) + username + $.joinedHeist);
                        }
                    }
                }
            }
        } else {
            var argsString = event.getArguments().trim();
            var modValue = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            
            if(args[0].equalsIgnoreCase("signupMinutes")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.signupMinutes = modValue;
                $.inidb.set("bankheist_timers","signupMinutes",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for signupMinutes has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("heistMinutes")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.heistMinutes = modValue;
                $.inidb.set("bankheist_timers","heistMinutes",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for heistMinutes has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("heistCancelled")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.heistCancelled = modValue;
                $.inidb.set("bankheist_strings","heistCancelled",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for heistCancelled has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("banksOpen")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.banksOpen = modValue;
                $.inidb.set("bankheist_strings","banksOpen",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for banksOpen has been set to " + modValue);
                return;
            }
                        
            if(args[0].equalsIgnoreCase("startedHeist")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.startedHeist = modValue;
                $.inidb.set("bankheist_strings","startedHeist",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for startedHeist has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("stringStarting")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.stringStarting = modValue;
                $.inidb.set("bankheist_strings","stringStarting",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for stringStarting has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("stringNoJoin")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.stringNoJoin = modValue;
                $.inidb.set("bankheist_strings","stringNoJoin",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for stringNoJoin has been set to " + modValue);
                return;
            }
                        
            if(args[0].equalsIgnoreCase("banksClosed")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.banksClosed = modValue;
                $.inidb.set("bankheist_strings","banksClosed",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for banksClosed has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("stringAllDead")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.stringAllDead = modValue;
                $.inidb.set("bankheist_strings","stringAllDead",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for stringAllDead has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("affordBet")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.affordBet = modValue;
                $.inidb.set("bankheist_strings","affordBet",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for affordBet has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("alreadyBet")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.alreadyBet = modValue;
                $.inidb.set("bankheist_strings","alreadyBet",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for alreadyBet has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("joinedHeist")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.joinedHeist = modValue;
                $.inidb.set("bankheist_strings","joinedHeist",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for joinedHeist has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("enterABet")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.enterABet = modValue;
                $.inidb.set("bankheist_strings","enterABet",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for enterABet has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("stringPayouts")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.stringPayouts = modValue;
                $.inidb.set("bankheist_strings","stringPayouts",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for stringPayouts has been set to " + modValue);
                return;
            }
            if(args[0].equalsIgnoreCase("stringFlawless")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.stringFlawless = modValue;
                $.inidb.set("bankheist_strings","stringFlawless",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for stringFlawless has been set to " + modValue);
                return;
            }
            if(args[0].equalsIgnoreCase("stringCasualties")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.stringCasualties = modValue;
                $.inidb.set("bankheist_strings","stringCasualties",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for stringCasualties has been set to " + modValue);
                return;
            }
            if(args[0].equalsIgnoreCase("betTooLarge")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.betTooLarge = modValue;
                $.inidb.set("bankheist_strings","betTooLarge",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for betTooLarge has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("chances50")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.chances50 = modValue;
                $.inidb.set("bankheist_chances","chances50",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for chances50 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("chances40")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.chances40 = modValue;
                $.inidb.set("bankheist_chances","chances40",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for chances40 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("chances30")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.chances30 = modValue;
                $.inidb.set("bankheist_chances","chances30",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for chances30 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("chances20")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.chances20 = modValue;
                $.inidb.set("bankheist_chances","chances20",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for chances20 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("chances10")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.chances10 = modValue;
                $.inidb.set("bankheist_chances","chances10",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for chances10 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("ratio50")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.ratio50 = modValue;
                $.inidb.set("bankheist_ratios","ratio50",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for ratio50 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("ratio40")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.ratio40 = modValue;
                $.inidb.set("bankheist_ratios","ratio40",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for ratio40 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("ratio30")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.ratio30 = modValue;
                $.inidb.set("bankheist_ratios","ratio30",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for ratio30 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("ratio20")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.ratio20 = modValue;
                $.inidb.set("bankheist_ratios","ratio20",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for ratio20 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("ratio10")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.ratio10 = modValue;
                $.inidb.set("bankheist_ratios","ratio10",modValue);
                $.say($.getWhisperString(event.getSender()) + "The value for ratio10 has been set to " + modValue);
                return;
            }
            
            if(args[0].equalsIgnoreCase("maxbet")){
                if(!$.isAdmin(sender) || !$.isModv3(sender, event.getTags())){
                    $.say($.getWhisperString(event.getSender()) + "You must be a moderator to use this command.");
                    return;
                }
                $.bankheistMaxBet = modValue;
                $.inidb.set("settings","bankheistmaxbet",modValue);
                $.say($.getWhisperString(event.getSender()) + "The max bet amount has been set to " + modValue);
                return;
            }
            
            $.say($.getWhisperString(event.getSender()) + "Action not recognized");
            
        }
    }
});
setTimeout(function(){ 
    if ($.moduleEnabled('./systems/bankheistSystem.js')) {
        $.registerChatCommand("./systems/bankheistSystem.js", "bankheist");
    }
},10*1000);