$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var action = args[0];
    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    var date = month + "/" + day + "/" + year;

 
    if(command.equalsIgnoreCase("raffle")) {
        var followers;
        var prices;
        var winner;
        var followed;
        var i;
        var userfollowschannel;
        var rMode;
        
        if (args.length == 0) {
            if ($var.raffle_running) {
                followers = "";
                prices = "";
                
                if ($var.raffle_followers) {
                    followers = " You must be following the channel to win!";
                }
                
                if ($.moduleEnabled("./systems/pointSystem.js") && $var.raffle_price > 0) {
                    prices = " Entering costs " + $var.raffle_price + " " + $.pointname + "!";
                }
                
                $.say("/me A Raffle is still in progress! Type '" + $var.raffle_keyword + "' to enter for a chance to win " + $var.raffle_win + "! " + followers + prices +" Type '!raffle end' to choose a winner");
            } else {
                prices = "";
                followers = "";
                
                if ($.moduleEnabled("./systems/pointSystem.js")) {
                    prices = "<price> ";
                }
                
                $.say("Usage: '!raffle start [-followers] " + prices + "<keyword> <reward>' -- '!raffle results' -- '!raffle repick' -- '!raffle end'");
            }
            return;
        }

        $var.raffle_toggle = true;
        if ($.inidb.get('settings', 'raffle_toggle') == 1) {
            $var.raffle_toggle = true;
        } else if ($.inidb.get('settings', 'raffle_toggle') == 2) {
            $var.raffle_toggle = false;
        }


        if (action.equalsIgnoreCase("toggle") && !argsString.isEmpty()) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }

            if ($var.raffle_toggle == false) {

                $var.raffle_toggle = true;
                $.inidb.set('settings', 'raffle_toggle', 1);
                $.say("Raffle messages have been turned on!");

            } else if ($var.raffle_toggle == true) {

                $var.raffle_toggle = false;
                $.inidb.set('settings', 'raffle_toggle', 2);
                $.say("Raffle messages have been turned off!");
            }



        }

        if (action.equalsIgnoreCase("results") && !argsString.isEmpty()) {
            if ($var.raffle_running) {

                rMode = $var.raffle_mode;
                if (rMode == 1) {

                    rMode = "Normal";

                } else if (rMode == 0) {
                    rMode = "Followers Only";
                }

                $.say("/me [Current Results] - [Reward: " + $var.raffle_win + "] - [Entry Price: " + $var.raffle_price + "] - [Raffle Mode: " + rMode + "] - [Keyword: " + $var.raffle_keyword + "] - [Entries: " + $var.raffle_entrants.length + "]");
            } else {
                var rReward = $.inidb.get('raffles', 'reward');
                var rPrice = $.inidb.get('raffles', 'price');
                rMode = $.inidb.get('raffles', 'mode');
                var rKey = $.inidb.get('raffles', 'keyword');
                var rWinner = $.inidb.get('raffles', 'winner');
                var rEntries = $.inidb.get('raffles', 'entries');
                var rDate = $.inidb.get('raffles', 'date');

                if (rWinner == null) {
                    $.say("No past raffles!");
                } else {

                    if (rPrice == null) {
                        rPrice = 0;
                    }

                    if (rMode == 0) {

                        rMode = "Normal";

                    } else if (rMode == 1) {
                        rMode = "Followers";
                    }

                    if (rKey == null) {

                        rKey = "None";
                    }

                    if (rWinner == null) {
                        rWinner = "None"
                    }

                    if (rEntries == null) {
                        rEntries = 0;
                    }

                    $.say("[" + rDate + "] - [Reward: " + rReward + "] - [Entry Price: " + rPrice + " " + $.pointname + "] - [Mode: " + rMode + "] - [Keyword: " + rKey + "] - [Winner: " + $.username.resolve(rWinner) + "] - [Entries: " + rEntries + "]");
                }
            }
        }

 
        if (action.equalsIgnoreCase("start")) {
            if (!$.isMod(sender)) {
                $.say(username + ", " + $.getUserGroupName(sender) + "s aren't allowed to start raffles! Moderators only.");
                return;
            }
 
            if ($var.raffle_running || (($.moduleEnabled("./systems/pointSystem.js") && args.length < 4)
                || (!$.moduleEnabled("./systems/pointSystem.js") && args.length < 3))) {
                return;
            }
            
            var followers_only = false;
            var price = -1;
            var keyword = "";
            var reward = "";
            i = 1;
            
            if (args[i] != null && args[i] != undefined && args[i].equalsIgnoreCase("-followers")) {
                followers_only = true;
                i++;
            }
            
            if ($.moduleEnabled("./systems/pointSystem.js") && args[i] != null && args[i] != undefined && !isNaN(args[i])) {
                price = parseInt(args[i]);
                i++;
            }
            
            if (args[i] != null && args[i] != undefined && !args[i].isEmpty()) {
                keyword = args[i];
                i++;
            }
            
            if (args[i] != null && args[i] != undefined && !args[i].isEmpty()) {
                reward = args[i];
                i++;
            }
            
            if (($.moduleEnabled("./systems/pointSystem.js") && price <= -1) || keyword.isEmpty() || reward.isEmpty()) {
                prices = "";
                
                if ($.moduleEnabled("./systems/pointSystem.js")) {
                    prices = "<price> ";
                }
                
                $.say("Invalid format. Usage: '!raffle start [-follower] " + prices + "<keyword> <reward>'");
                return;
            }
 
            $var.raffle_entrants = [];
            $var.raffle_price = Math.max(price, 0);
            $var.raffle_mode = 0;
            $var.raffle_keyword = keyword;
            $var.raffle_followers = followers_only;
            
            followers = "";
            prices = "";
            
            if (followers_only) {
                followers = " You must be following the channel to win!";
            }
                
            if (price > 0) {
                prices = " Entering costs " + $var.raffle_price;
            }
            
            if (!$.moduleEnabled("./systems/pointSystem.js") || isNaN(reward)) {
                $var.raffle_mode = 1;
                $var.raffle_win = reward;
                
                $.say("/me [Raffle] for -> [" + reward + "] <-" + followers + prices + " " + $.pointname + "! Enter to win by saying the keyword: " + keyword);
            } else {
                $var.raffle_win = Math.max(parseInt(reward), 0);
                
                $.say("/me [Raffle] for -> [" + reward + " " + $.pointname + "] <-" + followers + prices + " " + $.pointname + "! Enter to win by saying the keyword: " + keyword);

            }
            
            $var.raffle_running = true;
        } else if (action.equalsIgnoreCase("end")) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }
 
            if (!$var.raffle_running) {
                return;
            }
            
            $var.raffle_running = false;
 
            if ($var.raffle_entrants.length == 0) {
                $.say("/me The raffle has ended! No one entered the raffle.");
                return;
            }
 
            i = 0;
 
            do {
                if (i > ($var.raffle_entrants.length * 2)) {
                    winner = null;
                    break;
                }
                
                winner = $.randElement($var.raffle_entrants);
                followed = $.inidb.get('followed', winner.toLowerCase());
                
                if ($var.raffle_followers && (followed == null || followed == undefined || !followed.equalsIgnoreCase("1"))){
                    userfollowschannel = $.twitch.GetUserFollowsChannel(winner.toLowerCase(), $.channelName);
                    
                    if (userfollowschannel.getInt("_http") == 200) {
                        followed = "1";
                    }
                }
                
                i++;
            } while ($var.raffle_followers && (followed == null || followed == undefined || !followed.equalsIgnoreCase("1")));
            
            if (winner == null) {
                $.say("/me There is no winner!");
                return;
            }


            if ($var.raffle_mode == 0) {
                $.say("/me [Winner] -> " + $.username.resolve(winner) + "! Congratulations! " + $var.raffle_win + " " + $.pointname +  " has been credited to your account!");
                
                $.inidb.incr('points', winner.toLowerCase(), $var.raffle_win);
            } else {
                $.say("/me [Winner] for [" + $var.raffle_win + "] is " + winner + "! Congratulations!");
            }
            $.inidb.set('raffles', 'reward', $var.raffle_win);
            $.inidb.set('raffles', 'winner', winner);
            $.inidb.set('raffles', 'price', $var.raffle_price);
            $.inidb.set('raffles', 'mode', $var.raffle_mode);
            $.inidb.set('raffles', 'keyword', $var.raffle_keyword);
            $.inidb.set('raffles', 'entries', $var.raffle_entrants.length);
            $.inidb.set('raffles', 'date', date);

        } else if (action.equalsIgnoreCase("repick")) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }
 
            if ($var.raffle_running || $var.raffle_entrants.length == 0) {

                return;
            }
            
            if ($var.raffle_mode == 0) {
                $.say("You can not use re-pick on a points raffle!");
                return;
            }
 
            i = 0;
 
            do {
                if (i > ($var.raffle_entrants.length * 2)) {
                    winner = null;
                    break;
                }
                
                winner = $.randElement($var.raffle_entrants);
                followed = $.inidb.get('followed', winner.toLowerCase());
                
                if ($var.raffle_followers && (followed == null || followed == undefined || !followed.equalsIgnoreCase("1"))){
                    userfollowschannel = $.twitch.GetUserFollowsChannel(winner.toLowerCase(), $.channelName);
                    
                    if (userfollowschannel.getInt("_http") == 200) {
                        followed = "1";
                    }
                }
                
                i++;
            } while ($var.raffle_followers && (followed == null || followed == undefined || !followed.equalsIgnoreCase("1")));
            
            if (winner == null) {
                $.say("/me There is no winner!");
            } else {
                $.say("/me [Winner] for [" + $var.raffle_win + "] is " + winner + "! Congratulations!");
                $.inidb.set('raffles', 'reward', $var.raffle_win);
                $.inidb.set('raffles', 'winner', winner);
                $.inidb.set('raffles', 'price', $var.raffle_price);
                $.inidb.set('raffles', 'mode', $var.raffle_mode);
                $.inidb.set('raffles', 'keyword', $var.raffle_keyword);
                $.inidb.set('raffles', 'entries', $var.raffle_entrants.length);
                $.inidb.set('raffles', 'date', date);

            }
        }
    }
});

$.on('ircChannelMessage', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var message = event.getMessage();
    
    if ($var.raffle_running) {
        if (message.toLowerCase().indexOf($var.raffle_keyword.toLowerCase()) == -1 || $.array.contains($var.raffle_entrants, sender)) {
			if (message.toLowerCase().contains($var.raffle_keyword.toLowerCase())) {
				$.say("You have already entered the raffle!");
				return;
			}
            return;
        }
        
        if ($var.raffle_price > 0) {
            var points = $.inidb.get('points', sender);
            
            if (points == null) {
                points = 0;
            } else {
                points = parseInt(points);
            }
           
            if ($var.raffle_price > points) {
                $.say(username + ", " + " you don't have enough " + $.pointname + " to enter!");
                return;
            }
 
            $.inidb.decr('points', sender, $var.raffle_price);
        }
 
        $var.raffle_entrants.push(sender);
        if ($var.raffle_toggle == false) {
            println(username + " entered the raffle!");
        } else {
            $.say(username + " entered the raffle!");
        }
        
    }
});

$.registerChatCommand("./systems/raffleSystem.js", "raffle");