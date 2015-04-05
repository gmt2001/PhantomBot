$.on('command', function(event) {
	var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();

	if(command.equalsIgnoreCase("bid")) {

		$var.bid_highest_amount;
		$var.bid_highest_username;
		if (args.length == 0){ // Check for command arguments being 0;
			if($var.bid_running){ // Check if bid is started!\
				if ($var.bid_highest_username || $var.bid_highest_username === null){
					$.say("Current highest bider is: " + $var.bid_highest_username + " with " + $var.bid_highest_amount + " of " + $.pointname);
					return;
				}
					$.say(username + " There is no bids opended!");
					return;
			}else{
				$.say(username + " There is no bids opended!");
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
			if (!$.isMod(sender)) {
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
			$.say("Bid is now starting!");
			$.say("Starting amount of  " + $var.bid_amount + " " + $.pointname + " || Bids accepted in " + $var.bid_increment + " " + $.pointname + " increments");
			return;
		}else if(subCommand.equalsIgnoreCase("warn")){ // !bid warn command

			if (!$.isMod(sender)) {
                return;
            }
			$var.highestincr = (parseInt($var.bid_highest_amount) + parseInt($var.bid_increment));
			$.say("/me [Final notice] Current highest bidder is: " + $var.bid_highest_username + " with " + $var.bid_highest_amount + " " + $.pointname + " || Do we have " + $var.highestincr + "?")

		}else if(subCommand.equalsIgnoreCase("end")){ // !bid end command
			if (!$.isMod(sender)) {
                return;
            }

            $.say("/me Bid is now ending, no more bid's will be added!");
            $.say("/me Winner is " + $var.bid_highest_username + "!");

            $var.bid_running = false;
            $.inidb.decr('points', $var.bid_highest_username.toLowerCase(), parseInt($var.bid_highest_amount));
            $.say($var.bid_highest_amount + " " + $.pointname + " was withdrawn from " + $var.bid_highest_username + " account!");
            return;
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
						$.say("New bid " + $var.bid_highest_username + " starts the bid with " + $var.bid_highest_amount + " " + $.pointname);
						return;
					// IF this is not the first Bid!!!
					}else{
						//If bid is higher than user points!!
						if($var.user_bid > $.inidb.get('points', sender)){
							$.say(username + " You don't have enough " + $.pointname + " to participate");
							return;
						}
						//If bid is lower than highest increment + current bid!!!
						if($var.user_bid < $var.highestincr){
							$.say("");
							return;
						}
						if($var.user_bid > $.inidb.get('points', sender)){
							$.say(username + " You don't have that many " + $.pointname);
							return;
						}
						$var.bid_highest_amount = $var.user_bid;
						$var.bid_highest_username = username;
						$.say("New highest bid is: " + $var.bid_highest_username + " tops the bid with " + $var.bid_highest_amount + " " + $.pointname);
						return;
					}

				}else {
					$.say(username + " There is no bid open at the moment!");
					return;
				}

			}else{
				$.say("");
			}
		}
	}

});

$.registerChatCommand("./systems/bidSystem.js", "bid");