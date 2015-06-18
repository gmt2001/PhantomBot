$.bankheistIsOn = false;
$.pointsId = 0;
$.entrySeconds = 0;
$.senderId = "";
$.senderBet = "";
$.userPoints = "";
$.userPointsId = "";
$.bankheistToggle = false;

$.stringNoJoin = $.inidb.get("bankheist_strings", "stringNoJoin");
if($.stringNoJoin == "" || $.stringNoJoin == null){
    $.stringNoJoin = "No one joined the bankheist! The banks are safe for now.";
    $.inidb.set("bankheist_strings","stringNoJoin",$.stringNoJoin);
}

$.stringStarting = $.inidb.get("bankheist_strings", "stringStarting");
if($.stringStarting == "" || $.stringStarting == null){
    $.stringStarting = "The bankheist is starting! Good luck folks!";
    $.inidb.set("bankheist_strings","stringStarting",$.stringStarting);
}

$.stringChancesAre = $.inidb.get("bankheist_strings", "stringChancesAre");
if($.stringChancesAre == "" || $.stringChancesAre == null){
    $.stringChancesAre = "The current chances of surviving are ";
    $.inidb.set("bankheist_strings","stringChancesAre",$.stringChancesAre);
}

$.stringSurvivorsAre = $.inidb.get("bankheist_strings", "stringSurvivorsAre");
if($.stringSurvivorsAre == "" || $.stringSurvivorsAre == null){
    $.stringSurvivorsAre = "The survivors of the bankheist are: ";
    $.inidb.set("bankheist_strings","stringSurvivorsAre",$.stringSurvivorsAre);
}

$.stringNumberInvolved = $.inidb.get("bankheist_strings", "stringNumberInvolved");
if($.stringNumberInvolved == "" || $.stringNumberInvolved == null){
    $.stringNumberInvolved = "The number of people involved in the bankheist is: ";
    $.inidb.set("bankheist_strings","stringNumberInvolved",$.stringNumberInvolved);
}

$.stringAllDead = $.inidb.get("bankheist_strings", "stringAllDead");
if($.stringAllDead == "" || $.stringAllDead == null){
    $.stringAllDead = "No one survived the bankheist, everyone died!";
    $.inidb.set("bankheist_strings","stringAllDead",$.stringAllDead);
}

$.banksClosed = $.inidb.get("bankheist_strings", "banksClosed");
if($.banksClosed == "" || $.banksClosed == null){
    $.banksClosed = "The banks are currently closed!";
    $.inidb.set("bankheist_strings","banksClosed",$.banksClosed);
}

$.enterABet = $.inidb.get("bankheist_strings", "enterABet");
if($.enterABet == "" || $.enterABet == null){
    $.enterABet = "You must enter a bet! For example !bankheist (amount)";
    $.inidb.set("bankheist_strings","enterABet",$.enterABet);
}

$.affordBet = $.inidb.get("bankheist_strings", "affordBet");
if($.affordBet == "" || $.affordBet == null){
    $.affordBet = "You must enter a bet you can afford and is not 0 ";
    $.inidb.set("bankheist_strings","affordBet",$.affordBet);
}

$.alreadyBet = $.inidb.get("bankheist_strings", "alreadyBet");
if($.alreadyBet == "" || $.alreadyBet == null){
    $.alreadyBet = " you have already placed a bet of ";
    $.inidb.set("bankheist_strings","alreadyBet",$.alreadyBet);
}

$.startedHeist = $.inidb.get("bankheist_strings", "startedHeist");
if($.startedHeist == "" || $.startedHeist == null){
    $.startedHeist = " has started a bankheist! To join in type !bankheist (amount)";
    $.inidb.set("bankheist_strings","startedHeist",$.startedHeist);
}

$.joinedHeist = $.inidb.get("bankheist_strings", "joinedHeist");
if($.joinedHeist == "" || $.joinedHeist == null){
    $.joinedHeist = " has joined in on the bank heist! To tag along type !bankheist (amount)";
    $.inidb.set("bankheist_strings","joinedHeist",$.joinedHeist);
}

$.banksOpen = $.inidb.get("bankheist_strings", "banksOpen");
if($.banksOpen == "" || $.banksOpen == null){
    $.banksOpen = "The banks are now open for the taking! Use !bankheist (amount) to bet. 60 seconds are remaining to join!";
    $.inidb.set("bankheist_strings","banksOpen",$.banksOpen);
}

$.entryTimeEnd = $.inidb.get("bankheist_strings", "entryTimeEnd");
if($.entryTimeEnd == "" || $.entryTimeEnd == null){
    $.entryTimeEnd = "Entry time for bankheists now closed!";
    $.inidb.set("bankheist_strings","entryTimeEnd",$.entryTimeEnd);
}

function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
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
    $.inidb.set("bankheist_ratios","ratio50",$.ratio50.toString());
}

$.ratio40 = $.inidb.get("bankheist_ratios", "ratio40");
if($.ratio40 == "" || $.ratio40 == null){
    $.ratio40 = 2.25;
    $.inidb.set("bankheist_ratios","ratio40",$.ratio40.toString());
}

$.ratio30 = $.inidb.get("bankheist_ratios", "ratio30");
if($.ratio30 == "" || $.ratio30 == null){
    $.ratio30 = 2;
    $.inidb.set("bankheist_ratios","ratio30",$.ratio30.toString());
}

$.ratio20 = $.inidb.get("bankheist_ratios", "ratio20");
if($.ratio20 == "" || $.ratio20 == null){
    $.ratio20 = 1.7;
    $.inidb.set("bankheist_ratios","ratio20",$.ratio20.toString());
}

$.ratio10 = $.inidb.get("bankheist_ratios", "ratio10");
if($.ratio10 == "" || $.ratio10 == null){
    $.ratio10 = 1.5;
    $.inidb.set("bankheist_ratios","ratio10",$.ratio10.toString());
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
                $.say(betWin.toString());
                winnersList += username;
                winnersList += " ";
                winnersList += "(+" + (winningsRatio*bet).toString() + ")";
                if(i<people) {
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
            $.say(winnersList);
        }    
    }
};


$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    //var argsString = event.getArguments().trim();
    //var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();
    var betAmount = args[0];

    if (command.equalsIgnoreCase("bankheist")) {
        if(args[0]!="toggle"){
        
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
                    } else {
                        if($.inidb.exists("bankheist_roster", sender))
                        {
                            $.senderId = $.inidb.get("bankheist_roster", sender);
                            $.senderBet = $.inidb.get("bankheist_bets", $.senderId);
                        }
                        if ( $.senderId!=null && parseInt($.senderId)==$.userPointsId ) {
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
            if(!$.isAdmin(sender) || !$.isMod(sender)){
                $.say("You must be a moderator to use this command.");
                return;
            }
            if($.bankheistToggle==false){
                $.bankheistToggle = true;
                $.starBankHeist = $.timer.addTimer("./systems/bankheistSystem.js", "bankheist", true, function() {
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
                    }, 60*1000); //60 second entry window
                }, 1800* 1000); //30 minute interval

                $.say("Bankheists are now enabled!");
            } else {
                $.bankheistToggle = false;
                $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
                $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                $.say("Bankheists are now disabled!");
            }
        }    
    }
});

$.registerChatCommand("./systems/bankheistSystem.js", "bankheist");
