$.bankheistIsOn = false;
$.pointsId = 0;
$.entrySeconds = 0;
$.senderId = "";
$.senderBet = "";
$.userPoints = "";
$.userPointsId = "";
$.bankheistToggle = false;

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
    $.stringStarting = "The bankheist is starting! Good luck folks!";
    $.inidb.set("bankheist_strings","stringStarting","");
}

$.stringChancesAre = $.inidb.get("bankheist_strings", "stringChancesAre");
if($.stringChancesAre == "" || $.stringChancesAre == null){
    $.stringChancesAre = "The current chances of surviving are ";
    $.inidb.set("bankheist_strings","stringChancesAre","");
}

$.stringSurvivorsAre = $.inidb.get("bankheist_strings", "stringSurvivorsAre");
if($.stringSurvivorsAre == "" || $.stringSurvivorsAre == null){
    $.stringSurvivorsAre = "The survivors of the bankheist are: ";
    $.inidb.set("bankheist_strings","stringSurvivorsAre","");
}

$.stringNumberInvolved = $.inidb.get("bankheist_strings", "stringNumberInvolved");
if($.stringNumberInvolved == "" || $.stringNumberInvolved == null){
    $.stringNumberInvolved = "The number of people involved in the bankheist is: ";
    $.inidb.set("bankheist_strings","stringNumberInvolved","");
}

$.stringAllDead = $.inidb.get("bankheist_strings", "stringAllDead");
if($.stringAllDead == "" || $.stringAllDead == null){
    $.stringAllDead = "No one survived the bankheist, everyone died!";
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
    $.joinedHeist = " has joined in on the bank heist! To tag along type !bankheist (amount)";
    $.inidb.set("bankheist_strings","joinedHeist","");
}

$.banksOpen = $.inidb.get("bankheist_strings", "banksOpen");
if($.banksOpen == "" || $.banksOpen == null){
    $.banksOpen = "The banks are now open for the taking! Use !bankheist (amount) to bet. 60 seconds are remaining to join!";
    $.inidb.set("bankheist_strings","banksOpen","");
}

$.entryTimeEnd = $.inidb.get("bankheist_strings", "entryTimeEnd");
if($.entryTimeEnd == "" || $.entryTimeEnd == null){
    $.entryTimeEnd = "Entry time for bankheists now closed!";
    $.inidb.set("bankheist_strings","entryTimeEnd","");
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
        $.say($.stringChancesAre + chances + " percent. Good luck.");
        var winnersList = $.stringSurvivorsAre;
        var winnersListEmpty = true;
        var i = 1;
        $.say($.stringNumberInvolved + people);
        while( i <= people ) {
            var name = $.inidb.get("bankheist_roster", i);
            var bet = $.inidb.get("bankheist_bets", i);
            var username = $.username.resolve(name);
            var randomNum = $.randRange(1, 100);
            $.userPoints = parseInt($.inidb.get("points", name));
            if(randomNum<=chances) {
                var betWin = parseInt(Math.round(winningsRatio*bet));
                $.inidb.incr("points",name,betWin);
                winnersList += username;
                winnersList += " ";
                winnersList += "(+" + (winningsRatio*bet).toString() + ")";
                
                if(i < people) {
                    winnersList+= ", ";
                }
                
                winnersListEmpty = false;
            } else {
                if( ($.userPoints - bet) < 0 ) {
                    $.inidb.set("points",name, "0");
                } else {
                    $.inidb.decr("points",name, bet);
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
            if(winnersList.substr(winnersList.length - 1)==",") {
                    winnersList = winnersList.substring(0, winnersList.length - 1);
            }
            if(winnersList.substr(winnersList.length - 2)==", ") {
                    winnersList = winnersList.substring(0, winnersList.length - 2);
            }
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
                            $.say($.entryTimeEnd);
                            $.processBankheist();
                        }
                        return;
                    }, (parseInt($.signupMinutes)*60)*1000); //60 second entry window
                }, (parseInt($.heistMinutes)*60)* 1000); //30 minute interval                
};

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var args = event.getArgs();    
    var betAmount = args[0];
    

    if (command.equalsIgnoreCase("bankheist")) {
        if(args[0]=="toggle"){
        
            if(!$.isAdmin(sender) || !$.isMod(sender)){
                $.say("You must be a moderator to use this command.");
                return;
            }
            if($.bankheistToggle==false){
                $.bankheistToggle = true;
                startHeist();

                $.say("Bankheists are now enabled!");
                return;
                
            } else {
                $.bankheistToggle = false;
                $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                $.say("Bankheists are now disabled!");
                return;
            }
        } else if(args[0].equalsIgnoreCase("start")) {
            
            if(!$.isAdmin(sender) || !$.isMod(sender)){
                $.say("You must be a moderator to use this command.");
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
                            $.say($.entryTimeEnd);
                            $.processBankheist();
                            if($.bankheistToggle == true) {
                                startHeist();                                
                            }
                        }
                        return;
                    }, (parseInt($.signupMinutes)*60)*1000); //60 second entry window
                return;
            
        } else if(parseInt(args[0])){
        
            if ($.bankheistIsOn==false) {
                $.say($.banksClosed);
                return;
            } else {
                    $.userPoints = parseInt($.inidb.get("points", sender));
                    $.userPointsId = parseInt($.pointsId + 1);
            
                    if(!parseInt(betAmount) || !parseInt($.userPointsId)){
                        $.say($.enterABet);
                        return;
                    } else if( parseInt(betAmount) > $.userPoints  || parseInt(betAmount)==0 ){
                        $.say( $.affordBet + "[Points available: " + $.userPoints.toString());
                        return;
                    } else  if(parseInt(betAmount) > $.bankheistMaxBet){
                        $.say($.betTooLarge + $.bankheistMaxBet + ".");
                        return;
                    } else {
                        if($.inidb.exists("bankheist_roster", sender))
                        {
                            $.senderId = $.inidb.get("bankheist_roster", sender);
                            $.senderBet = $.inidb.get("bankheist_bets", $.senderId);
                            $.say(username + $.alreadyBet + $.senderBet.toString());
                            return;
                        } else {
                            $.inidb.set("bankheist_roster", $.userPointsId.toString(), sender);
                            $.inidb.set("bankheist_roster", sender, $.userPointsId.toString());
                            $.pointsId++;
                            $.inidb.set("bankheist_bets", $.userPointsId, betAmount);
                            if($.userPointsId==1) {
                                $.say(username + $.startedHeist);
                            } else {
                                $.say(username + $.joinedHeist);
                            }
                        }
                    }
            }
        } else {
            var argsString = event.getArguments().trim();
            var modValue = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            
            if(args[0].equalsIgnoreCase("signupMinutes")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.signupMinutes = modValue;
                    $.inidb.set("bankheist_timers","signupMinutes",modValue);
                    $.say("The value for signupMinutes has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("heistMinutes")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.heistMinutes = modValue;
                    $.inidb.set("bankheist_timers","heistMinutes",modValue);
                    $.say("The value for heistMinutes has been set to " + modValue);
                    return;
            }

            if(args[0].equalsIgnoreCase("stringChancesAre")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.stringChancesAre = modValue;
                    $.inidb.set("bankheist_strings","stringChancesAre",modValue);
                    $.say("The value for stringChancesAre has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("heistCancelled")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.heistCancelled = modValue;
                    $.inidb.set("bankheist_strings","heistCancelled",modValue);
                    $.say("The value for heistCancelled has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("banksOpen")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.banksOpen = modValue;
                    $.inidb.set("bankheist_strings","banksOpen",modValue);
                    $.say("The value for banksOpen has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("stringNumberInvolved")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.stringNumberInvolved = modValue;
                    $.inidb.set("bankheist_strings","stringNumberInvolved",modValue);
                    $.say("The value for stringNumberInvolved has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("startedHeist")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.startedHeist = modValue;
                    $.inidb.set("bankheist_strings","startedHeist",modValue);
                    $.say("The value for startedHeist has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("stringStarting")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.stringStarting = modValue;
                    $.inidb.set("bankheist_strings","stringStarting",modValue);
                    $.say("The value for stringStarting has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("stringNoJoin")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.stringNoJoin = modValue;
                    $.inidb.set("bankheist_strings","stringNoJoin",modValue);
                    $.say("The value for stringNoJoin has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("entryTimeEnd")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.entryTimeEnd = modValue;
                    $.inidb.set("bankheist_strings","entryTimeEnd",modValue);
                    $.say("The value for entryTimeEnd has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("banksClosed")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.banksClosed = modValue;
                    $.inidb.set("bankheist_strings","banksClosed",modValue);
                    $.say("The value for banksClosed has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("stringAllDead")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.stringAllDead = modValue;
                    $.inidb.set("bankheist_strings","stringAllDead",modValue);
                    $.say("The value for stringAllDead has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("affordBet")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.affordBet = modValue;
                    $.inidb.set("bankheist_strings","affordBet",modValue);
                    $.say("The value for affordBet has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("alreadyBet")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.alreadyBet = modValue;
                    $.inidb.set("bankheist_strings","alreadyBet",modValue);
                    $.say("The value for alreadyBet has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("joinedHeist")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.joinedHeist = modValue;
                    $.inidb.set("bankheist_strings","joinedHeist",modValue);
                    $.say("The value for joinedHeist has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("enterABet")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.enterABet = modValue;
                    $.inidb.set("bankheist_strings","enterABet",modValue);
                    $.say("The value for enterABet has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("stringSurvivorsAre")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.stringSurvivorsAre = modValue;
                    $.inidb.set("bankheist_strings","stringSurvivorsAre",modValue);
                    $.say("The value for stringSurvivorsAre has been set to " + modValue);
                    return;
            }
            if(args[0].equalsIgnoreCase("betTooLarge")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.betTooLarge = modValue;
                    $.inidb.set("bankheist_strings","betTooLarge",modValue);
                    $.say("The value for betTooLarge has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("chances50")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.chances50 = modValue;
                    $.inidb.set("bankheist_chances","chances50",modValue);
                    $.say("The value for chances50 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("chances40")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.chances40 = modValue;
                    $.inidb.set("bankheist_chances","chances40",modValue);
                    $.say("The value for chances40 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("chances30")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.chances30 = modValue;
                    $.inidb.set("bankheist_chances","chances30",modValue);
                    $.say("The value for chances30 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("chances20")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.chances20 = modValue;
                    $.inidb.set("bankheist_chances","chances20",modValue);
                    $.say("The value for chances20 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("chances10")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.chances10 = modValue;
                    $.inidb.set("bankheist_chances","chances10",modValue);
                    $.say("The value for chances10 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("ratio50")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.ratio50 = modValue;
                    $.inidb.set("bankheist_ratios","ratio50",modValue);
                    $.say("The value for ratio50 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("ratio40")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.ratio40 = modValue;
                    $.inidb.set("bankheist_ratios","ratio40",modValue);
                    $.say("The value for ratio40 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("ratio30")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.ratio30 = modValue;
                    $.inidb.set("bankheist_ratios","ratio30",modValue);
                    $.say("The value for ratio30 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("ratio20")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.ratio20 = modValue;
                    $.inidb.set("bankheist_ratios","ratio20",modValue);
                    $.say("The value for ratio20 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("ratio10")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.ratio10 = modValue;
                    $.inidb.set("bankheist_ratios","ratio10",modValue);
                    $.say("The value for ratio10 has been set to " + modValue);
                    return;
            }
            
            if(args[0].equalsIgnoreCase("maxbet")){
                    if(!$.isAdmin(sender) || !$.isMod(sender)){
                        $.say("You must be a moderator to use this command.");
                        return;
                    }
                    $.bankheistMaxBet = modValue;
                    $.inidb.set("settings","bankheistmaxbet",modValue);
                    $.say("The max bet amount has been set to " + modValue);
                    return;
            }
            
            $.say("Action not recognized");
            
        }
    }
});

$.registerChatCommand("./systems/bankheistSystem.js", "bankheist");
