$.bankheistIsOn = false;
$.pointsId = 0;
$.entrySeconds = 0;
$.senderId = "";
$.senderBet = "";
$.userPoints = "";
$.userPointsId = "";
$.bankheistToggle = false;

function processBankheist() {
    if($.pointsId+1 == 1) {
        $.bankheistIsOn = false;
        $.say("No one joined the bankheist! The banks are safe for now.");
        $.entrySeconds = 0;
        $.pointsId = 0;
        return;
    } else {
        $.bankheistIsOn = false;
        $.say("The bankheist is starting! Good luck folks!");
        var people = $.pointsId;
        var chances = 0;
        var winningsRatio = 1;
        
        if(people >=31) {
            chances = 66;
        } else if(people < 31 && people >= 20) {
            chances = people + 35;
        } else {
            chances = people + 35;
            if(people <20 && people >=10){
                winningsRatio = 2;
            } else if(people<10) {
                winningsRatio = 3;
            }
        }
        $.say("The current chances of surviving are " + chances + " percent. Good luck.");
        var winnersList = "The survivors of the bankheist are: ";
        var winnersListEmpty = true;
        var i = 1;
        $.say("The number of people involved in the bankheist is: " + people);
        while( i <= people ) {
            var name = $.inidb.get("bankheist_roster", i);
            var bet = $.inidb.get("bankheist_bets", i);
            var username = $.username.resolve(name);
            var randomNum = rand(1,100);
            $.userPoints = parseInt($.inidb.get("points", name));
            
            if(randomNum<=chances) {
                $.inidb.incr("points",name,((winningsRatio*bet)));
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
            $.say("No one survived the bankheist, everyone died!");
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
        if(args[0]!="toggle1"){
        
            if ($.bankheistIsOn==false) {
                $.say("The banks are currently closed!");
                return;
            } else {
                    $.userPoints = parseInt($.inidb.get("points", sender));
                    $.userPointsId = parseInt($.pointsId + 1);
            
                    if(!parseInt(betAmount) || !parseInt($.userPointsId)){
                        $.say("You must enter a bet! For example !bankheist (amount)");
                        return;
                    } else if( parseInt(betAmount) > $.userPoints  || parseInt(betAmount)==0 ){
                        $.say("You must enter a bet you can afford and is not 0 [Points available: " + $.userPoints.toString());
                        return;
                    } else {
                        if($.inidb.exists("bankheist_roster", sender))
                        {
                            $.senderId = $.inidb.get("bankheist_roster", sender);
                            $.senderBet = $.inidb.get("bankheist_bets", $.senderId);
                        }
                        if ( $.senderId!=null && parseInt($.senderId)==$.userPointsId ) {
                            $.say(username + " you have already placed a bet of " + $.senderBet.toString());
                            return;
                        } else {
                            $.inidb.set("bankheist_roster", $.userPointsId.toString(), sender);
                            $.inidb.set("bankheist_roster", sender, $.userPointsId.toString());
                            $.pointsId++;
                            $.inidb.set("bankheist_bets", $.userPointsId, betAmount);
                            if($.userPointsId==1) {
                                $.say(username + " has started a bankheist! To join in type !bankheist (amount)");
                            } else {
                                $.say(username + " has joined in on the bank heist! To tag along type !bankheist (amount)");
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
                            $.say("The banks are now open for the taking! Use !bankheist (amount) to bet. 60 seconds are remaining to join!");
                        } else {
                            $.timer.clearTimer("./systems/bankheistSystem.js", "enterbankheist", true);
                            $.say("Entry time for bankheists now closed!");
                            $.processBankheist();
                        }
                        return;
                    }, 60*1000); //60 second entry window
                }, 180* 1000); //30 minute interval

                $.say("Bankheists are now enabled!");
            } else {
                $.bankheistToggle = false;
                $.timer.clearTimer("./systems/bankheistSystem.js", "bankheist", true);
                $.say("Bankheists are now disabled!");
            }
        }    
    }
});

$.registerChatCommand("./systems/bankheistSystem.js", "bankheist");
