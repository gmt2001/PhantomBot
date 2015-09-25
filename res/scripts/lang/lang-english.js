//lang.js
$.lang.data["net.phantombot.lang.not-exists"] = "!!! Missing string in lang file !!!";
$.lang.data["net.phantombot.lang.lang-not-exists"] = "That language file does not exist!";
$.lang.data["net.phantombot.lang.lang-changed"] = "Changed language to $1!";
$.lang.data["net.phantombot.lang.curlang"] = "The current language is $1!";

//common
$.lang.data["net.phantombot.common.enabled"] = "enabled";
$.lang.data["net.phantombot.common.disabled"] = "disabled";
$.lang.data["net.phantombot.common.err-user"] = "You must specify a user to target with this command";

//command perm/price
$.lang.data["net.phantombot.cmd.noperm"] = "Your user group, $1, does not have permission to use the command $2.";
$.lang.data["net.phantombot.cmd.needpoints"] = "That command costs $1 $2, which you don't have.";
$.lang.data["net.phantombot.cmd.paid"] = "[Paid] $1's balance is now: $2 $3";
$.lang.data["net.phantombot.cmd.casteronly"] = "Only a Caster has access to that command!";
$.lang.data["net.phantombot.cmd.adminonly"] = "Only an Administrator has access to that command!";
$.lang.data["net.phantombot.cmd.modonly"] = "Only a Moderator has access to that command!";

//init.js
$.lang.data["net.phantombot.init.cmsgset"] = "Connected message set!";
$.lang.data["net.phantombot.init.reconn"] = "Reconnect scheduled!";
$.lang.data["net.phantombot.init.module-not-exists"] = "That module does not exist or is not loaded!";
$.lang.data["net.phantombot.init.module-usage"] = "Usage: !module list, !module enable <module name>, !module disable <module name>, !module status <module name>";
$.lang.data["net.phantombot.init.module-enable"] = "Module enabled!";
$.lang.data["net.phantombot.init.module-disable"] = "Module disabled!";
$.lang.data["net.phantombot.init.module-enabled"] = "The module $1 is currently enabled!";
$.lang.data["net.phantombot.init.module-disabled"] = "The module $1 is currently disabled!";
$.lang.data["net.phantombot.init.module-list"] = "Modules: ";

//misc.js
$.lang.data["net.phantombot.misc.log-status"] = "Logging is currently $1! Logs are kept for $2 days! To change this use '!log <enable or disable>' or '!log days <number of days>'";
$.lang.data["net.phantombot.misc.log-enable"] = "Logging enabled!";
$.lang.data["net.phantombot.misc.log-disable"] = "Logging disabled!";
$.lang.data["net.phantombot.misc.log-err-bad-days"] = "Please enter a valid number of days greater than 0. Usage: '!log days <number of days>'";
$.lang.data["net.phantombot.misc.log-days"] = "Logs are now kept for $1 days!";
$.lang.data["net.phantombot.misc.response-enabled"] = "Bot responses are enabled for everyone. To turn them off, say: !response disable";
$.lang.data["net.phantombot.misc.response-disabled"] = "Bot responses are disabled for everyone. To turn them on,  say: !response enable";
$.lang.data["net.phantombot.misc.response-enable"] = "Responses are now enabled! To disable them, say: !response disable";
$.lang.data["net.phantombot.misc.response-disable"] = "Responses are now disabled! To enable them, say: !response enable";

//permissions.js
$.lang.data["net.phantombot.permissions.group-not-exists"] = "That group does not exist! To view a list of groups, use !group list.";
$.lang.data["net.phantombot.permissions.group-remove"] = "Group $1 has been successfully removed. All users in that group have been moved to the Viewers group.";
$.lang.data["net.phantombot.permissions.group-create"] = "Group $1 created!";
$.lang.data["net.phantombot.permissions.group-set"] = "Group for $1 changed to $2!";
$.lang.data["net.phantombot.permissions.group-set-err-same"] = "You cannot promote others to the same rank as you.";
$.lang.data["net.phantombot.permissions.group-set-err-above"] = "You must be a higher rank than the person you are trying to promote!";
$.lang.data["net.phantombot.permissions.group-points-set"] = "$1 point multiplier set to $2!";
$.lang.data["net.phantombot.permissions.group-points-err-zero"] = "Group point multiplier must be a number greater than 0!";
$.lang.data["net.phantombot.permissions.group-current-self"] = "$1, you're in the $2 group.";
$.lang.data["net.phantombot.permissions.group-current-other"] = "$1 is currently in the $2 group.";
$.lang.data["net.phantombot.permissions.group-list"] = "Groups: $1";
$.lang.data["net.phantombot.permissions.group-usage"] = "Usage: !group, !group <name>, !group set <name> <group>, !group list, !group name <id> <new name>";
$.lang.data["net.phantombot.permissions.group-name-err-default"] = "Default group names cannot be changed!";
$.lang.data["net.phantombot.permissions.group-name"] = "Changed group '$1' to '$2'!";
$.lang.data["net.phantombot.permissions.users"] = "Users in channel: ";
$.lang.data["net.phantombot.permissions.mods"] = "Mods in channel: ";
$.lang.data["net.phantombot.permissions.admins"] = "Admins in channel: ";

//commandList.js
$.lang.data["net.phantombot.commandlist.commands"] = "Commands";
$.lang.data["net.phantombot.commandlist.page"] = " page $1 of $2 ";
$.lang.data["net.phantombot.commandlist.more"] = " >> Type '!commands 2, 3 etc... for more";
$.lang.data["net.phantombot.commandlist.nocommands"] = "There are currently no commands available to you";
$.lang.data["net.phantombot.commandlist.commands-per-page"] = "There will now be $1 commands per page when using !commands";
$.lang.data["net.phantombot.commandlist.commands-per-page-usage"] = "Usage: !commandsperpage <number no less than 10>";

//chatModerator.js
$.lang.data["net.phantombot.chatmoderator.purged"] = " [Purged]";
$.lang.data["net.phantombot.chatmoderator.banned"] = " [Banned]";
$.lang.data["net.phantombot.chatmoderator.timedout"] = " [Timed Out ($1)]";
$.lang.data["net.phantombot.chatmoderator.whitelist-add"] = "The URL $1 has been added to the whitelist!";
$.lang.data["net.phantombot.chatmoderator.whitelist-usage"] = "Usage: !whitelist <link>";
$.lang.data["net.phantombot.chatmoderator.forgive"] = "Reduced $1 to $2 strike(s)!";
$.lang.data["net.phantombot.chatmoderator.increase"] = "Increased $1 to $2 strike(s)!";
$.lang.data["net.phantombot.chatmoderator.permit"] = "$1 is permitted to post a link during the next $2 seconds!";
$.lang.data["net.phantombot.chatmoderator.ban-err-time"] = "$1 is not a valid amount of time";
$.lang.data["net.phantombot.chatmoderator.ban"] = "$1 banned for $2 hour(s)";
$.lang.data["net.phantombot.chatmoderator.ban-indef"] = "$1 banned indefinitely";
$.lang.data["net.phantombot.chatmoderator.unban"] = "$1 is no longer banned";
$.lang.data["net.phantombot.chatmoderator.clearchat"] = "$1 cleared chat!";
$.lang.data["net.phantombot.chatmoderator.autoban"] = "Added a phrase to the autoban list! This can only be undone manually!";
$.lang.data["net.phantombot.chatmoderator.autopurge"] = "Added a phrase to the autopurge list! This can only be undone manually!";
$.lang.data["net.phantombot.chatmoderator.chatmod-help-1"] = "Usage: !chatmod <option> [new value]";
$.lang.data["net.phantombot.chatmoderator.chatmod-help-2"] = "-Options: ";
$.lang.data["net.phantombot.chatmoderator.chatmod-warn-reset-time"] = "The current amount of time, in seconds, after which a users link/caps warning count is reset is $1 seconds. To change it use: !chatmod warningcountresettime <-1 for never, time>";
$.lang.data["net.phantombot.chatmoderator.chatmod-warn-reset-time-never"] = "Changed warning count reset time to never!";
$.lang.data["net.phantombot.chatmoderator.chatmod-warn-reset-time-set"] = "Changed warning count reset time to $1 seconds!";

//pointSystem.js
$.lang.data["net.phantombot.common.user-404"] = "The user \"$1\" has not visited this channel yet.";
$.lang.data["net.phantombot.common.whisper-disabled"] = "[Whisper Mode] for $1 has been disabled.";
$.lang.data["net.phantombot.common.whisper-enabled"] = "[Whisper Mode] for $1 has been enabled.";
$.lang.data["net.phantombot.pointsystem.bonus-error-negative"] = "You can not set the bonus per group level to negative $1.";
$.lang.data["net.phantombot.pointsystem.bonus-success"] = "Set the $1 bonus to $2 per group level.";
$.lang.data["net.phantombot.pointsystem.bonus-usage"] = "Usage: \"!points bonus <amount>\"";
$.lang.data["net.phantombot.pointsystem.config"] = "[Point Settings] - [Name (single): $1] - [Name (multiple): $2] - [Gain: $3] - [Gain (offline): $4] - [Interval: $5 minute(s)] - [Interval (offline): $6 minute(s)] - [Bonus: $7 per group level] - [Gifting Minimum: $8]";
$.lang.data["net.phantombot.pointsystem.gain-offline-error-negative"] = "You can not set the amount of $1 gained to a negative number.";
$.lang.data["net.phantombot.pointsystem.interval-offline-success"] = "Set the $1 payout interval to $2 minute(s) when the stream is offline.";
$.lang.data["net.phantombot.pointsystem.gain-offline-usage"] = "Usage: \"!points offlinegain <amount>\"";
$.lang.data["net.phantombot.pointsystem.gain-error-negative"] = "You can not set the amount of $1 gained to a negative number.";
$.lang.data["net.phantombot.pointsystem.gain-success"] = "Set the $1 earnings to $2 every $3 minute(s) while the stream is online.";
$.lang.data["net.phantombot.pointsystem.gain-usage"] = "Usage: \"!points gain <amount>\"";
$.lang.data["net.phantombot.pointsystem.get-other"] = "$1 currently has $2.";
$.lang.data["net.phantombot.pointsystem.get-other-nopoints"] = "$1 currently has no $2.";
$.lang.data["net.phantombot.pointsystem.get-other-time"] = "$1 currently has $2, and has been in the chat for $3.";
$.lang.data["net.phantombot.pointsystem.get-self"] = "You currently have $1.";
$.lang.data["net.phantombot.pointsystem.get-self-nopoints"] = "You currently have no $1. Stay in the chat to start gaining $1!";
$.lang.data["net.phantombot.pointsystem.get-self-time"] = "You currently have $1, and you have been in the chat for $2.";
$.lang.data["net.phantombot.pointsystem.gift-error-negative"] = "You can not gift negative $1.";
$.lang.data["net.phantombot.pointsystem.gift-error-notenough"] = "You can not afford to transfer $1 to $2.";
$.lang.data["net.phantombot.pointsystem.gift-error-notminimum"] = "You have to transfer at least $1.";
$.lang.data["net.phantombot.pointsystem.gift-error-toself"] = "Oops! Something went wrong! Maybe you shouldn't try gifting yourself $1... OMGScoots";
$.lang.data["net.phantombot.pointsystem.gift-success"] = "Ka-tching! You successfully transfered $1 to $2. $2 now has $3, and you now have $4.";
$.lang.data["net.phantombot.pointsystem.gift-received"] = "Ka-tching! You were gifted $1 by $2.";
$.lang.data["net.phantombot.pointsystem.gift-usage"] = "Usage: \"!gift <name> <amount>\"";
$.lang.data["net.phantombot.pointsystem.give-all-error-negative"] = "You can not give everybody negative $1.";
$.lang.data["net.phantombot.pointsystem.give-all-success"] = "$1 have been sent to everybody in the channel!";
$.lang.data["net.phantombot.pointsystem.give-all-usage"] = "Usage: \"!points all <amount>\"";
$.lang.data["net.phantombot.pointsystem.give-error-negative"] = "You can not give negative $1.";
$.lang.data["net.phantombot.pointsystem.give-success"] = "Sent $1 to $2. New balance is $3.";
$.lang.data["net.phantombot.pointsystem.give-usage"] = "Usage: \"!points give <name> <amount>\"";
$.lang.data["net.phantombot.pointsystem.help"] = "Usage: '!points give <name> <amount>' -- '!points take <name> <amount>' -- '!points set <name> <amount>' -- '!points gift <name> <amount>' -- '!points gain <amount>' -- '!points bonus <amount>' -- '!points name <amount>'";
$.lang.data["net.phantombot.pointsystem.interval-offline-error-negative"] = "You can not set the $1 payout interval to negative minutes.";
$.lang.data["net.phantombot.pointsystem.interval-offline-success"] = "Set the $1 payout interval to $2 minute(s) when the stream is online.";
$.lang.data["net.phantombot.pointsystem.interval-offline-usage"] = "Usage: \"!points offlineinterval <amount>\"";
$.lang.data["net.phantombot.pointsystem.interval-error-negative"] = "You can not set the $1 payout interval to negative minutes.";
$.lang.data["net.phantombot.pointsystem.interval-success"] = "Set the $1 payout interval to $2 minute(s) when the stream is online.";
$.lang.data["net.phantombot.pointsystem.interval-usage"] = "Usage: \"!points interval <amount>\"";
$.lang.data["net.phantombot.pointsystem.makeitrain-error-invalid"] = "Sorry, but it's not possible to rain $1 at the moment.";
$.lang.data["net.phantombot.pointsystem.makeitrain-error-negative"] = "You can not make it rain negative $1.";
$.lang.data["net.phantombot.pointsystem.makeitrain-error-notenough"] = "You can not afford to make it rain $1.";
$.lang.data["net.phantombot.pointsystem.makeitrain-success"] = "A rain storm's incoming! $1 is throwing $2 in the air, resulting in everybody getting $3!";
$.lang.data["net.phantombot.pointsystem.makeitrain-usage"] = "Usage: \"!makeitrain <amount>\"";
$.lang.data["net.phantombot.pointsystem.mingift-error-negative"] = "You can not set the minumum amount of $1 that can be gifted to a negative number.";
$.lang.data["net.phantombot.pointsystem.mingift-success"] = "Set the minimum amount of $1 that can be gifted to $2.";
$.lang.data["net.phantombot.pointsystem.mingift-usage"] = "Usage: \"!points mingift <amount>\"";
$.lang.data["net.phantombot.pointsystem.name-success-both"] = "Set the name of $1 from \"$2\" to \"$3\". Set the name for a single $4 using \"!points name single <name>\".";
$.lang.data["net.phantombot.pointsystem.name-success-multiple"] = "Set the name of multiple $1 from \"3 $2\" to \"3 $3\". Set the name for a single $4 using \"!points name single <name>\".";
$.lang.data["net.phantombot.pointsystem.name-success-single"] = "Set the name of a single $1 from \"1 $2\" to \"1 $3\". Set the name for multiple $4 using \"!points name multiple <name>\".";
$.lang.data["net.phantombot.pointsystem.name-usage"] = "To change the name of a single point, use \"!points name single <name>\". To change the name of multiple points, use \"!points name <\"multi\" or \"multiple\"> <name>\".";
$.lang.data["net.phantombot.pointsystem.reset-success"] = "All $1 from all users were reset to 0.";
$.lang.data["net.phantombot.pointsystem.set-error-negative"] = "You can not set a balance to negative $1.";
$.lang.data["net.phantombot.pointsystem.set-success"] = "Set the $1 balance of $2 to $3.";
$.lang.data["net.phantombot.pointsystem.set-usage"] = "Usage: \"!points set <name> <amount>\"";
$.lang.data["net.phantombot.pointsystem.take-error-toomuch"] = "You can not take more than what $1 has in $2.";
$.lang.data["net.phantombot.pointsystem.take-success"] = "Taken $1 from $2. New balance is $3.";
$.lang.data["net.phantombot.pointsystem.take-usage"] = "Usage: \"!points take <name> <amount>\"";
$.lang.data["net.phantombot.pointsystem.timetoggle-disabled"] = "Set the time to not be displayed when viewing $1 count.";
$.lang.data["net.phantombot.pointsystem.timetoggle-enabled"] = "Set the time to be displayed when viewing $1 count.";
$.lang.data["net.phantombot.pointsystem.toggle-success"] = "Users in the group $1 or higher are now able to use point management commands.";

// timeSystem.js
$.lang.data["net.phantombot.timesystem.autolevel-disabled"] = "Users will no longer be promoted to $1 when they have been in the chat for $2 hour(s).";
$.lang.data["net.phantombot.timesystem.autolevel-enabled"] = "Users will now be promoted to $1 when they have been in the chat for $2 hour(s).";
$.lang.data["net.phantombot.timesystem.autolevel-promote"] = "$1 has been promoted to $2 by being in the chat for $3 hour(s). Congratulations!";
$.lang.data["net.phantombot.timesystem.get-other"] = "$1 currently spent $2 in the chat.";
$.lang.data["net.phantombot.timesystem.get-self"] = "You currently spent $1 in the chat.";
$.lang.data["net.phantombot.timesystem.give-error-negative"] = "You can not give negative time.";
$.lang.data["net.phantombot.timesystem.give-success"] = "Sent $1 to $2. New balance is $3.";
$.lang.data["net.phantombot.timesystem.give-usage"] = "Usage: \"!time give <name> <amount>\"";
$.lang.data["net.phantombot.timesystem.help"] = "Usage: '!time give <name> <amount>' -- '!time take <name> <amount>' -- '!time set <name> <amount>'";
$.lang.data["net.phantombot.timesystem.offlinetime-disabled"] = "Offline time will not longer be counted towards the time.";
$.lang.data["net.phantombot.timesystem.offlinetime-enabled"] = "Offline time will now be counted towards the time.";
$.lang.data["net.phantombot.timesystem.promotehours-error-negative"] = "You can not set the time in hours to promote a user to $1 to a negative number.";
$.lang.data["net.phantombot.timesystem.promotehours-success"] = "Set the time in hours to promote a user to $1 to $2.";
$.lang.data["net.phantombot.timesystem.promotehours-usage"] = "Usage: \"!time promotehours <amount>\"";
$.lang.data["net.phantombot.timesystem.reset-success"] = "The time balance of all users is reset to $1.";
$.lang.data["net.phantombot.timesystem.set-error-negative"] = "You can not set a balance to negative time.";
$.lang.data["net.phantombot.timesystem.set-success"] = "Set the time balance of $1 to $2.";
$.lang.data["net.phantombot.timesystem.set-usage"] = "Usage: \"!time set <name> <amount>\"";
$.lang.data["net.phantombot.timesystem.take-error-toomuch"] = "You can not take more than what $1 has in time.";
$.lang.data["net.phantombot.timesystem.take-success"] = "Taken $1 from $2. New balance is $3.";
$.lang.data["net.phantombot.timesystem.take-usage"] = "Usage: \"!time take <name> <amount>\"";
$.lang.data["net.phantombot.timesystem.toggle-success"] = "Users in the group $1 or higher are now able to use time management commands.";
$.lang.data["net.phantombot.streamertime"] = "It is currently $1 where $2 is located.";
$.lang.data["net.phantombot.timezone.error-invalid"] = "\"$1\" is not a valid time zone. A list of time zones can be found on \"http://en.wikipedia.org/wiki/List_of_tz_database_time_zones\".";
$.lang.data["net.phantombot.timezone.get"] = "The streamer's time zone is currently set to \"$1\".";
$.lang.data["net.phantombot.timezone.success"] = "The time zone has been set to \"$1\".";
$.lang.data["net.phantombot.timezone.usage"] = "Usage: \"!timezone <name>\"";

// raidSystem.js
$.lang.data["net.phantombot.raidsystem.success"] = "Thank you for the raid, $1! This is the $2 time $1 has raided! Please give them a follow at \"http://twitch.tv/$3\"!";
$.lang.data["net.phantombot.raidsystem.usage"] = "Usage: \"!raider <name>\"";

//addCommand.js
$.lang.data["net.phantombot.addcommand.addcom-success"] = "$1, has successfully created the command: !$2";
$.lang.data["net.phantombot.addcommand.addcom-error"] = "That command already exists, $1";
$.lang.data["net.phantombot.addcommand.addcom-error-usage"] = "Usage: \"!addcom (command) (message)\"";
$.lang.data["net.phantombot.addcommand.delcom-success"] = "$1, has successfully removed the command: !$2";
$.lang.data["net.phantombot.addcommand.delcom-error-usage"] = "Usage: \"!delcom (command)\"";
$.lang.data["net.phantombot.addcommand.editcom-success"] = "$1, has modified the command: !$2";
$.lang.data["net.phantombot.addcommand.editcom-error"] = "There is no such command, $1";
$.lang.data["net.phantombot.addcommand.editcom-error-usage"] = "Usage: \"!editcom (command) (message)\"";
$.lang.data["net.phantombot.addcommand.pricecom-current-set-price"] = "The command !$1 costs $2 $3!";
$.lang.data["net.phantombot.addcommand.pricecom-current-set-price2"] = "The command !$1 currently costs 0 $2!";
$.lang.data["net.phantombot.addcommand.pricecom-success"] = "The price for !$1 has been set to $2 $3.";
$.lang.data["net.phantombot.addcommand.pricecom-error1"] = "Please select a command that exists and is available to non-mods.";
$.lang.data["net.phantombot.addcommand.pricecom-error2"] = "Please enter a valid price, 0 or greater.";
$.lang.data["net.phantombot.addcommand.pricecom-error-usage"] = "Usage: \"!pricecom (command) (price)\"";
$.lang.data["net.phantombot.addcommand.helpcom-error-usage"] = "Usage: \"!addcom (command) (message) / !delcom (command) / !editcom (command) (message / !permcom (command) (group) / !pricecom (command) (amount))\"";
$.lang.data["net.phantombot.addcommand.helpcom-command-tags"] = "When using !addcom, you can put the text '(sender)' to have the name of any user who says the new command inserted into it. ex. '!addcom hello Hello there (sender)!'";
$.lang.data["net.phantombot.addcommand.helpcom-command-tags2"] = "When using !addcom, you can also put '(1)', '(2)', and so on to allow arguments. ex. '!addcom kill (sender) just killed (1) with a (2)!'";
$.lang.data["net.phantombot.addcommand.helpcom-command-tags3"] = "Additional special tags: '(count)' will add the number of times the command was used (including the current usage)";
$.lang.data["net.phantombot.addcommand.aliascom-success"] = "$1, the command !$2 was successfully aliased to !$3";
$.lang.data["net.phantombot.addcommand.aliascom-error-no-command"] = "The target command does not exist $1!";
$.lang.data["net.phantombot.addcommand.aliascom-failed"] = "You can only overwrite an alias $1!";
$.lang.data["net.phantombot.addcommand.aliascom-error-usage"] = "Usage: \"!aliascom (existing command) (alias name)\"";
$.lang.data["net.phantombot.addcommand.custom-commands"] = "Current custom commands: $1";
$.lang.data["net.phantombot.addcommand.delalias-success"] = "$1, the alias !$2 was successfully deleted!";
$.lang.data["net.phantombot.addcommand.delalias-error-no-command"] = "That alias does not exist $1!";
$.lang.data["net.phantombot.addcommand.delalias-error-usage"] = "Usage: \"!delalias (alias name)\"";
$.lang.data["net.phantombot.addcommand.permcom-success"] = "Permissions for command: $1 set for group: $2 and higher.";
$.lang.data["net.phantombot.addcommand.permcom-removed-success"] = "All recursive permissions for the command: $1 and any of its aliases have been removed.";
$.lang.data["net.phantombot.addcommand.permcom-syntax-error"] = "You must specify a permission mode of 1 or 2! 1 specifies only a single group, multiple single groups can be added for the same command. 2 specifies recursive (all groups higher than the group specified).";
$.lang.data["net.phantombot.addcommand.permcom-error-no-command"] = "The command !$1 does not exist!";
$.lang.data["net.phantombot.addcommand.permcom-error-usage"] = "Usage: \"!permcom (command name) (group name) (1/2). Restricts usage of a command to viewers with a certain permission level. 1 specifies only a single group, multiple single groups can be added for the same command. 2 specifies recursive (all groups higher than the group specified).\"";

//raffleSystem.js
$.lang.data["net.phantombot.rafflesystem.start-success-followers-price"] = "/me [Raffle Started] Enter now for a chance to win [$1]! You need to be following to enter, and the fee to enter is $2. Enter the raffle by typing \"$3\".";
$.lang.data["net.phantombot.rafflesystem.start-success-followers"] = "/me [Raffle Started] Enter now for a chance to win [$1]! You need to be following to enter. Enter the raffle by typing \"$2\".";
$.lang.data["net.phantombot.rafflesystem.start-success-price"] = "/me [Raffle Started] Enter now for a chance to win [$1]! The fee to enter is $2. Enter the raffle by typing \"$3\".";
$.lang.data["net.phantombot.rafflesystem.start-success-default"] = "/me [Raffle Started] Enter now for a chance to win [$1]! Enter the raffle by typing \"$2\".";
$.lang.data["net.phantombot.rafflesystem.start-usage-points"] = "Invalid format. Usage: \"!raffle start [-followers] <reward> [<price>] [<keyword>]\".";
$.lang.data["net.phantombot.rafflesystem.start-usage-default"] = "Invalid format. Usage: \"!raffle start [-followers] <reward> [<keyword>]\".";
$.lang.data["net.phantombot.rafflesystem.start-error-invalid-points"] = "The keyword can be either \"!raffle\" or a word without \"!\". Usage: \"!raffle start [-followers] <reward> [<price>] [<keyword>]\"."
$.lang.data["net.phantombot.rafflesystem.start-error-invalid-default"] = "The keyword can be either \"!raffle\" or a word without \"!\". Usage: \"!raffle start [-followers] <reward> [<keyword>]\"."
$.lang.data["net.phantombot.rafflesystem.start-error-running"] = "You can not start a new raffle while another raffle is active.";
$.lang.data["net.phantombot.rafflesystem.close-error-notrunning"] = "You can not close a raffle while no raffle is active.";
$.lang.data["net.phantombot.rafflesystem.close-success-noentries"] = "/me [Raffle Ended] The raffle is now closed. Nobody entered, thus there is no winner.";
$.lang.data["net.phantombot.rafflesystem.close-success-nofollow"] = "/me [Raffle Ended] The raffle is now closed. Everybody that entered isn't following, thus there is no winner.";
$.lang.data["net.phantombot.rafflesystem.close-success-points"] = "/me [Raffle Ended] The raffle is now closed. The winner is $1, congratulations! Added $2 to your balance!";
$.lang.data["net.phantombot.rafflesystem.close-success-default"] = "/me [Raffle Ended] The raffle is now closed. The winner is $1, congratulations! You won $2, contact the broadcaster for your prize!";
$.lang.data["net.phantombot.rafflesystem.enter-notcommand-followers-price"] = "A raffle is active for a chance to win [$1]! You need to be following to enter, and the fee to enter is $2. Enter the raffle by typing \"$3\".";
$.lang.data["net.phantombot.rafflesystem.enter-notcommand-followers"] = "A raffle is active for a chance to win [$1]! You need to be following to enter. Enter the raffle by typing \"$2\".";
$.lang.data["net.phantombot.rafflesystem.enter-notcommand-price"] = "A raffle is active for a chance to win [$1]! The fee to enter is $2. Enter the raffle by typing \"$3\".";
$.lang.data["net.phantombot.rafflesystem.enter-notcommand-default"] = "A raffle is active for a chance to win [$1]! Enter the raffle by typing \"$2\".";
$.lang.data["net.phantombot.rafflesystem.enter-error-notrunning"] = "There are no raffles active at the moment. If you are a $1, start a new raffle by using \"!raffle start\".";
$.lang.data["net.phantombot.rafflesystem.enter-error-entered"] = "You have already entered the raffle.";
$.lang.data["net.phantombot.rafflesystem.enter-error-notenough"] = "You do not have enough $1 to enter the raffle."
$.lang.data["net.phantombot.rafflesystem.enter-error-iscaster"] = "The channel broadcaster can't enter the raffle."
$.lang.data["net.phantombot.rafflesystem.enter-error-nofollow"] = "You are not following. For this raffle, you need to be following."
$.lang.data["net.phantombot.rafflesystem.enter-success"] = "You have entered the raffle."
$.lang.data["net.phantombot.rafflesystem.redraw-success-nofollow"] = "/me [Raffle Redraw] Everybody that entered isn't following, thus there is no winner.";
$.lang.data["net.phantombot.rafflesystem.redraw-success-default"] = "/me [Raffle Redraw] The winner is $1, congratulations! You won $2, contact the broadcaster for your prize!";
$.lang.data["net.phantombot.rafflesystem.redraw-error-running"] = "You can not pick another winner of a raffle that is still running.";
$.lang.data["net.phantombot.rafflesystem.redraw-error-noentries"] = "You can not pick another winner of a raffle that has no entries.";
$.lang.data["net.phantombot.rafflesystem.redraw-error-pointraffle"] = "You can not pick another winner of a raffle that rewards $1 to users.";
$.lang.data["net.phantombot.rafflesystem.result-success-running"] = "The stats of the active raffle are: [Reward: $1] - [Entry Fee: $2] - [Prize Mode: $3] - [Follow Mode: $4] - [Keyword: $5] - [Entries: $6]";
$.lang.data["net.phantombot.rafflesystem.result-success-norunning"] = "The stats of the previous raffle are: [Reward: $1] - [Entry Fee: $2] - [Prize Mode: $3] - [Follow Mode: $4] - [Keyword: $5] - [Entries: $6] - [Winner: $7] - [Date: $8]";
$.lang.data["net.phantombot.rafflesystem.result-error-notfound"] = "Could not find any valid raffle stats."
$.lang.data["net.phantombot.rafflesystem.toggle-enabled"] = "Users will now be notified of their entry into the raffle.";
$.lang.data["net.phantombot.rafflesystem.toggle-disabled"] = "Users will no longer be notified of their entry into the raffle.";
$.lang.data["net.phantombot.rafflesystem.entries-error-noresults"] = "Could not find any raffle entries to display.";
$.lang.data["net.phantombot.rafflesystem.entries-success"] = "[Raffle Entrants] Page $1 of $2: $3.";
$.lang.data["net.phantombot.rafflesystem.usage"] = "Usage: \"!raffle entries <page>\"";

// bidSystem.js
$.lang.data["net.phantombot.bidsystem.close-error-notrunning"] = "You can not close a auction while no auction is active.";
$.lang.data["net.phantombot.bidsystem.close-success"] = "/me [Auction Ended] The auction is now closed. The highest bidder is $1 with $2.";
$.lang.data["net.phantombot.bidsystem.close-success-noentries"] = "/me [Auction Ended] The auction is now closed. Nobody entered, thus there is no winner.";
$.lang.data["net.phantombot.bidsystem.enter-error-belowminimum"] = "You need to bid at least $1 to enter the auction.";
$.lang.data["net.phantombot.bidsystem.enter-error-notenough"] = "You do not have enough $1 to bid $2.";
$.lang.data["net.phantombot.bidsystem.enter-error-notrunning"] = "You can not make a new bid while no auction is running.";
$.lang.data["net.phantombot.bidsystem.enter-success"] = "/me [Auction Updated] $1 bid $2. To top this, you need to bid at least $3.";
$.lang.data["net.phantombot.bidsystem.get-error-notrunning"] = "There are no auctions active at the moment. If you are a $1, start a new auction by using \"!auction start\".";
$.lang.data["net.phantombot.bidsystem.get-running-entries"] = "An auction is currently running! The top bid is $1 by $2. Top top this, you need to bid at least $3.";
$.lang.data["net.phantombot.bidsystem.get-running-noentries"] = "An auction is currently running! To enter the auction, you need to bid at least $1.";
$.lang.data["net.phantombot.bidsystem.points-disabled"] = "You can not use this command while the points module is disabled.";
$.lang.data["net.phantombot.bidsystem.start-error-running"] = "You can not start a new auction while another auction is active.";
$.lang.data["net.phantombot.bidsystem.start-success"] = "/me [Auction Started] A new auction has started. The minimum bid is $1 and will increase with $2 for every new bid. Make a bid by typing \"!bid <amount>\".";
$.lang.data["net.phantombot.bidsystem.usage"] = "Usage: \"!bid <amount>\"";
$.lang.data["net.phantombot.bidsystem.warning-error-notrunning"] = "You can not issue a final warning while no auction is active.";
$.lang.data["net.phantombot.bidsystem.warning-success-entries"] = "/me [Auction Warning] The auction is about to close. The current top bid is $1 by $2. The next minimum bid has to be $3 or more.";
$.lang.data["net.phantombot.bidsystem.warning-success-noentries"] = "/me [Auction Warning] The auction is about to close. There currently are no bids. To enter, bid $1 or more.";

// penaltySystem.js
$.lang.data["net.phantombot.penaltysystem.get-nopenalty"] = "You currently have no active penalty. Keep it this way! :-)";
$.lang.data["net.phantombot.penaltysystem.get-other-nopenalty"] = "$1 currently has no active penalty.";
$.lang.data["net.phantombot.penaltysystem.get-other-penalty"] = "$1 currently can not earn any $2. This will last untill they gained $3.";
$.lang.data["net.phantombot.penaltysystem.get-other-penalty-indefinitely"] = "$1 currently can not earn any $2. Untill a $3 disables it, this is permanent.";
$.lang.data["net.phantombot.penaltysystem.get-penalty"] = "You currently can not earn any $1. This will last untill you gained $2.";
$.lang.data["net.phantombot.penaltysystem.get-penalty-indefinitely"] = "You currently can not earn any $1. Untill a $2 disables it, this is permanent.";
$.lang.data["net.phantombot.penaltysystem.lifted"] = "$1 no longer has an active penalty. Increased their balance by $2.";
$.lang.data["net.phantombot.penaltysystem.points-disabled"] = " You can not use this command while the points module is disabled.";
$.lang.data["net.phantombot.penaltysystem.set-disabled"] = "$1 no longer has an active penalty.";
$.lang.data["net.phantombot.penaltysystem.set-enabled-indefinitely"] = "$1 now has an active penalty and can not gain any more $2. Untill a $3 disables it, this is permanent.";
$.lang.data["net.phantombot.penaltysystem.set-enabled-threshold"] = "$1 now has an active penalty and can not gain any more $2. This will last untill they gained $3.";
$.lang.data["net.phantombot.penaltysystem.usage"] = "Usage: \"!penalty [<name>, <amount>]\"";
