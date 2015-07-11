$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();

    if(command.equalsIgnoreCase("bid") || command.equalsIgnoreCase("auction")) {

        $var.bid_highest_amount;
        $var.bid_highest_username;
        if (args.length == 0){ // Check for command arguments being 0;
            if($var.bid_running){ // Check if bid is started!\
                if ($var.bid_highest_username || $var.bid_highest_username === null){
                    $.say("Current highest bider is: " + $var.bid_highest_username + " with " + $var.bid_highest_amount + " of " + $.pointname + ".");
                    return;
                }
                $.say(username + " There is no bids opened!");
                return;
            }else{
                $.say(username + " There is no bids opened!");
                return;
            }
        }

        var subCommand = args[0]; // Check subcomand arguments!

        if(subCommand.equalsIgnoreCase("start")){ // !bid start command
			
            //Check if point module is enabled
            if(!$.moduleEnabled("./systems/pointSystem.js")){
                $.say("Point module is disabled!!!");
                return;
            }
            if (!$.isModv3(sender, event.getTags())) {
                return;
            }

            var amount = "";
            var increment = "";
            i = 1;

            if (args[i] != null && args[i] != undefined && !args[i].isEmpty()) {
                amount = parseInt(args[i]);
                i++;
            }else{
                $.say("[INVALID FORMAT] Usage: !bid start < start amount> < increment amount>");
                return;
            }
            if (args[i] != null && args[i] != undefined && !args[i].isEmpty()) {
                increment = parseInt(args[i]);
                i++;
            }else{
                $.say("[INVALID FORMAT] Usage: !bid start < start amount> < increment amount>");
                return;
            }

            $var.bid_amount = amount;
            $var.bid_increment = increment;

            $var.bid_running = true;
            $.say("/me Auction started!");
            $.say("/me Starting amount of  " + $var.bid_amount + " " + $.pointname + " || Bids accepted in " + $var.bid_increment + " " + $.pointname + " increments.");
            return;
        }else if(subCommand.equalsIgnoreCase("warn")){ // !bid warn command

            if (!$.isModv3(sender, event.getTags())) {
                return;
            }
            $var.highestincr = (parseInt($var.bid_highest_amount) + parseInt($var.bid_increment));
            $.say("/me [Final notice] Current highest bidder is: " + $var.bid_highest_username + " with " + $var.bid_highest_amount + " " + $.pointname + " || Do we have " + $var.highestincr + "?")

        }else if(subCommand.equalsIgnoreCase("end")){ // !bid end command
            if (!$.isModv3(sender, event.getTags())) {
                return;
            }

            $.say("/me Auction is ending, new bids will no longer be accepted!");
			
            if ($var.bid_highest_username == "undefined") {
                $.say("/me There were no winners!");
                $var.bid_running = false;
                return;
            } else {
                $.say("/me Winner is " + $var.bid_highest_username + "!");	
                $var.bid_running = false;
                $.inidb.decr('points', $var.bid_highest_username.toLowerCase(), parseInt($var.bid_highest_amount));
                $.say($var.bid_highest_amount + " " + $.pointname + " was withdrawn from " + $var.bid_highest_username + " account! Your new balance is: " + $.inidb.get('points', $var.bid_highest_username.toLowerCase()) + " " + $.pointname + ".");
                return;
            }

        }else{
            if(isNumeric(subCommand)){

                // Check if bid is running!!!
                if($var.bid_running){

                    $var.user_points = $.inidb.get('points', sender);
                    $var.amountincr = ($var.bid_amount + $var.bid_increment);
                    $var.highestincr = (parseInt($var.bid_highest_amount) + parseInt($var.bid_increment));
                    $var.user_bid = parseInt(subCommand);

                    //If this is the first bid!!!
                    if($var.bid_highest_amount == "" || $var.bid_highest_amount == undefined || $var.bid_highest_amount == null){
                        if($var.user_bid > $.inidb.get('points', sender)){
                            $.say(username + " You don't have enough " + $.pointname + " to participate");
                            return;
                        }
                        if($var.user_bid < $var.bid_amount){
                            $.say(username + " The smallest amount you can bid is " + $var.bid_amount + " " + $.pointname);
                            return;
                        }
                        if($var.user_bid > $.inidb.get('points', sender)){
                            $.say(username + " You don't have that many " + $.pointname + "!");
                            return;
                        }

                        $var.bid_highest_amount = $var.user_bid;
                        $var.bid_highest_username = username;
                        $.say("New bid from " + $var.bid_highest_username + " bidding with " + $var.bid_highest_amount + " " + $.pointname + ".");
                        return;
                    // IF this is not the first Bid!!!
                    }else{
                        //If bid is higher than user points!!
                        if($var.user_bid > $.inidb.get('points', sender)){
                            $.say(username + " You don't have enough " + $.pointname + " to participate.");
                            return;
                        }
                        //If bid is lower than highest increment + current bid!!!
                        if($var.user_bid < $var.highestincr){
                            $.say("");
                            return;
                        }
                        if($var.user_bid > $.inidb.get('points', sender)){
                            $.say(username + " You don't have that much " + $.pointname);
                            return;
                        }
                        $var.bid_highest_amount = $var.user_bid;
                        $var.bid_highest_username = username;
                        $.say("New highest bid is: " + $var.bid_highest_username + " tops the bid with " + $var.bid_highest_amount + " " + $.pointname + "!");
                        return;
                    }

                }else {
                    $.say(username + " There is no auction open at the moment!");
                    return;
                }

            }else{
                $.say("");
            }
        }
    }

});
setTimeout(function(){ 
    if ($.moduleEnabled('./systems/bidSystem.js')) {
        $.registerChatCommand("./systems/bidSystem.js", "bid");
    }
},10*1000);