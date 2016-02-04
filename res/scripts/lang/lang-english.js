//lang.js
$.lang.data["net.phantombot.lang.not-exists"] = "!!! Missing string in lang file !!!";
$.lang.data["net.phantombot.lang.lang-not-exists"] = "That language file does not exist!";
$.lang.data["net.phantombot.lang.lang-changed"] = "Changed language to $1!";
$.lang.data["net.phantombot.lang.curlang"] = "The current language is $1!";

//common
$.lang.data["net.phantombot.common.enabled"] = "enabled";
$.lang.data["net.phantombot.common.disabled"] = "disabled";
$.lang.data["net.phantombot.common.err-user"] = "You must specify a user to target with this command";
$.lang.data["net.phantombot.common.user-404"] = "The user \"$1\" has not visited this channel yet.";
$.lang.data["net.phantombot.common.whisper-disabled"] = "[Whisper Mode] has been disabled.";
$.lang.data["net.phantombot.common.whisper-enabled"] = "[Whisper Mode] has been enabled.";
$.lang.data["net.phantombot.common.command-not-exists"] = "The command !$1 does not exist.";

// To translate the ordinal number prefixes or suffixes, edit the lines below.
// Warning: Make sure each line contains 10 items total; 0 through 9.
// Order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].
$.lang.data["net.phantombot.common.ordinal-prefixes"] = ["", "", "", "", "", "", "", "", "", ""];
$.lang.data["net.phantombot.common.ordinal-suffixes"] = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];

// To translate the time prefixes or suffixes, edit the lines below. This is used for both a single w/d/h/m and multiple w/d/h/m.
// Warning: Make sure each line contains 4 items total; w, d, h, m.
// Order: [w, d, h, m].
$.lang.data["net.phantombot.common.time-prefixes"] = ["", "", "", ""];
$.lang.data["net.phantombot.common.time-suffixes"] = ["w", "d", "h", "m"];

//command perm/price
$.lang.data["net.phantombot.cmd.noperm"] = "Your user group, $1, does not have permission to use the command $2.";
$.lang.data["net.phantombot.cmd.needpoints"] = "That command costs $1, which you don't have.";
$.lang.data["net.phantombot.cmd.paid"] = "[Paid] $1's balance is now: $2";
$.lang.data["net.phantombot.cmd.casteronly"] = "Only a Caster has access to that command!";
$.lang.data["net.phantombot.cmd.adminonly"] = "Only an Administrator has access to that command!";
$.lang.data["net.phantombot.cmd.modonly"] = "Only a Moderator has access to that command!";

//init.js
$.lang.data["net.phantombot.init.cmsgset"] = "Connected message set!";
$.lang.data["net.phantombot.init.coolcom"] = "The global command cooldown is $1 second(s). Type \"!helpcoolcom\" for usage information";
$.lang.data["net.phantombot.init.coolcom-individual"] = "The command cooldown for !$1 is $2 second(s)";
$.lang.data["net.phantombot.init.coolcom-individual-notset"] = "The command !$1 is using the global cooldown value, which is $2 second(s)";
$.lang.data["net.phantombot.init.coolcom-set"] = "The global command cooldown is now $1 second(s)!";
$.lang.data["net.phantombot.init.coolcom-set-individual"] = "The command cooldown for !$1 is now $2 second(s)!";
$.lang.data["net.phantombot.init.coolcom-del-individual"] = "The command !$1 will now use the global cooldown, which is $2 second(s)!";
$.lang.data["net.phantombot.init.coolcom-cooldown"] = "The command $1 sent by $2 was not processed because it is still on cooldown.";
$.lang.data["net.phantombot.init.coolcom-help"] = "Usage: \"!coolcom seconds\" sets the global cooldown, set to 0 to disable. \"!coolcom command seconds\" overrides global coolcom on the named command, 0 to disable on that command or -1 to use the global value. \"!coolcom command get\" to get a commands coolcom";
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
$.lang.data["net.phantombot.misc.logchat-enable"] = "Chat logging enabled!";
$.lang.data["net.phantombot.misc.logchat-disable"] = "Chat logging disabled!";
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
$.lang.data["net.phantombot.permissions.group-points-set"] = "$1 point gain set to $2!";
$.lang.data["net.phantombot.permissions.group-points-err-less-than-zero"] = "Group point gain must be a number equal to, or greater than zero!";
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
$.lang.data["net.phantombot.commandlist.more"] = " >> Type '!botcommands 2, 3 etc... for more";
$.lang.data["net.phantombot.commandlist.nocommands"] = "There are currently no commands available to you";
$.lang.data["net.phantombot.commandlist.commands-per-page"] = "There will now be $1 commands per page when using !botcommands";
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
$.lang.data["net.phantombot.pointsystem.config"] = "[Point Settings] - [Name (single): $1] - [Name (multiple): $2] - [Gain: $3] - [Gain (offline): $4] - [Interval: $5 minute(s)] - [Interval (offline): $6 minute(s)] - [Bonus: $7 per group level] - [Gifting Minimum: $8]";
$.lang.data["net.phantombot.pointsystem.gain-offline-error-negative"] = "You can not set the amount of $1 gained to a negative number.";
$.lang.data["net.phantombot.pointsystem.gain-offline-success"] = "Set the $1 earnings to $2 every $3 minute(s) while the stream is offline, to set point gains for groups individually use !group points.";
$.lang.data["net.phantombot.pointsystem.gain-offline-usage"] = "Usage: \"!points offlinegain <amount>\"";
$.lang.data["net.phantombot.pointsystem.gain-error-negative"] = "You can not set the amount of $1 gained to a negative number.";
$.lang.data["net.phantombot.pointsystem.gain-success"] = "Set the $1 earnings to $2 every $3 minute(s) while the stream is online, to set point gains for groups individually use !group points.";
$.lang.data["net.phantombot.pointsystem.gain-usage"] = "Usage: \"!points gain <amount>\"";
$.lang.data["net.phantombot.pointsystem.get-other"] = "$1's balance is: $2.";
$.lang.data["net.phantombot.pointsystem.get-other-nopoints"] = "$1 has no $2.";
$.lang.data["net.phantombot.pointsystem.get-other-time"] = "$1's balance is: $2, and has been in chat for $3.";
$.lang.data["net.phantombot.pointsystem.get-self"] = "Your remaining balance is: $1.";
$.lang.data["net.phantombot.pointsystem.get-self-nopoints"] = "You have no $1. Stay in chat to earn $1!";
$.lang.data["net.phantombot.pointsystem.get-self-time"] = "Your current balance is: $1, and you have been in chat for $2.";
$.lang.data["net.phantombot.pointsystem.gift-error-negative"] = "You can not gift negative $1.";
$.lang.data["net.phantombot.pointsystem.gift-error-notenough"] = "You can not afford to transfer $1 to $2.";
$.lang.data["net.phantombot.pointsystem.gift-error-notminimum"] = "You have to transfer at least $1.";
$.lang.data["net.phantombot.pointsystem.gift-error-toself"] = "Oops! Something went wrong! Maybe you shouldn't try gifting yourself $1... OMGScoots";
$.lang.data["net.phantombot.pointsystem.gift-success"] = "Ka-tching! You successfully transfered $1 to $2. $2 now has $3, and you now have $4.";
$.lang.data["net.phantombot.pointsystem.gift-received"] = "Ka-tching! You were gifted $1 by $2.";
$.lang.data["net.phantombot.pointsystem.gift-usage"] = "Usage: \"!gift <name> <amount>\"";
$.lang.data["net.phantombot.pointsystem.give-all-error-negative"] = "You can not give everyone negative $1.";
$.lang.data["net.phantombot.pointsystem.give-all-success"] = "$1 have been sent to everyone in the channel!";
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
$.lang.data["net.phantombot.pointsystem.makeitrain-success"] = "A rain storm's incoming! $1 is throwing $2 in the air, resulting in everyone getting $3!";
$.lang.data["net.phantombot.pointsystem.makeitrain-usage"] = "Usage: \"!makeitrain <amount>\"";
$.lang.data["net.phantombot.pointsystem.mingift-error-negative"] = "You can not set the minumum amount of $1 that can be gifted to a negative number.";
$.lang.data["net.phantombot.pointsystem.mingift-success"] = "Set the minimum amount of $1 that can be gifted to $2.";
$.lang.data["net.phantombot.pointsystem.mingift-usage"] = "Usage: \"!points mingift <amount>\"";
$.lang.data["net.phantombot.pointsystem.name-success-both"] = "Your channel's points has been renamed to \"$3\". Set the name for a single $4 using \"!points name single <name>\".";
$.lang.data["net.phantombot.pointsystem.name-success-multiple"] = "Name of multiple $1 successfully changed from \"3 $2\" to \"3 $3\". To set the name for a single $4 use \"!points name single <name>\".";
$.lang.data["net.phantombot.pointsystem.name-success-single"] = "Name of a single $1 successfully changed from \"1 $2\" to \"1 $3\". To set the name for multiple $4 use \"!points name multiple <name>\".";
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
$.lang.data["net.phantombot.timesystem.get-self"] = "You have spent $1 in the chat.";
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
$.lang.data["net.phantombot.uptime.success-online"] = "/me [Stream Uptime] $1 has been online for $2.";
$.lang.data["net.phantombot.uptime.success-offline"] = "$1 is currently not streaming.";
$.lang.data["net.phantombot.botuptime.success"] = "/me [Bot Uptime] $1 has been online for $2.";

// raidSystem.js
$.lang.data["net.phantombot.raidsystem.raid-error-toomuch"] = "To prevent a global ban from Twitch, the maximum has been set to $1.";
$.lang.data["net.phantombot.raidsystem.raid-success"] = "/me http://www.twitch.tv/$1 $2";
$.lang.data["net.phantombot.raidsystem.raid-usage"] = "Usage: \"!raid (name) | !raid (name) (message) | !raid (name) (amount) | !raid (name) (amount) (message)\"";
$.lang.data["net.phantombot.raidsystem.raider-success"] = "Thank you for the raid, $1! This is the $2 time $1 has raided! Please give them a follow at http://twitch.tv/$3 !";
$.lang.data["net.phantombot.raidsystem.raider-usage"] = "Usage: \"!raider <name>\"";

//addCommand.js
$.lang.data["net.phantombot.addcommand.addcom-success"] = "You have successfully created the command: !$1";
$.lang.data["net.phantombot.addcommand.addcom-error"] = "That command already exists";
$.lang.data["net.phantombot.addcommand.addcom-error-usage"] = "Usage: \"!addcom (command) (message)\", type !helpcom for more info";
$.lang.data["net.phantombot.addcommand.delcom-success"] = "You have successfully removed the command: !$1";
$.lang.data["net.phantombot.addcommand.delcom-error-usage"] = "Usage: \"!delcom (command)\"";
$.lang.data["net.phantombot.addcommand.editcom-success"] = "You have modified the command: !$1";
$.lang.data["net.phantombot.addcommand.editcom-error"] = "There is no such command";
$.lang.data["net.phantombot.addcommand.editcom-error-usage"] = "Usage: \"!editcom (command) (message)\", type !helpcom for more info";
$.lang.data["net.phantombot.addcommand.pricecommod-enable"] = "Moderators must now pay to use commands which have been !pricecom. Use !pricecommod again to toggle this";
$.lang.data["net.phantombot.addcommand.pricecommod-disable"] = "Moderators can now use commands which have been !pricecom for free. Use !pricecommod again to toggle this";
$.lang.data["net.phantombot.addcommand.pricecom-current-set-price"] = "The command !$1 costs $2!";
$.lang.data["net.phantombot.addcommand.pricecom-current-set-price2"] = "The command !$1 currently costs 0 $2!";
$.lang.data["net.phantombot.addcommand.pricecom-success"] = "The price for !$1 has been set to $2.";
$.lang.data["net.phantombot.addcommand.pricecom-error1"] = "Please select a command that exists and is available to non-mods.";
$.lang.data["net.phantombot.addcommand.pricecom-error2"] = "Please enter a valid price, 0 or greater.";
$.lang.data["net.phantombot.addcommand.pricecom-error-usage"] = "Usage: \"!pricecom (command) (price)\"";
$.lang.data["net.phantombot.addcommand.helpcom-error-usage"] = "Usage: \"!addcom (command) (message) / !delcom (command) / !editcom (command) (message / !permcom (command) (group) / !pricecom (command) (amount))\"";
$.lang.data["net.phantombot.addcommand.helpcom-command-tags"] = "When using !addcom, you can put the text '(sender)' to have the name of any user who says the new command inserted into it. ex. '!addcom hello Hello there (sender)!'";
$.lang.data["net.phantombot.addcommand.helpcom-command-tags2"] = "When using !addcom, you can also put '(1)', '(2)', and so on to allow arguments. ex. '!addcom kill (sender) just killed (1) with a (2)!'";
$.lang.data["net.phantombot.addcommand.helpcom-command-tags3"] = "Additional special tags: '(count)' will add the number of times the command was used (including the current usage)";
$.lang.data["net.phantombot.addcommand.aliascom-success"] = "the command !$1 was successfully aliased to !$2";
$.lang.data["net.phantombot.addcommand.aliascom-error-no-command"] = "The target command does not exist!";
$.lang.data["net.phantombot.addcommand.aliascom-failed"] = "You can only overwrite an alias!";
$.lang.data["net.phantombot.addcommand.aliascom-error-usage"] = "Usage: \"!aliascom (existing command) (alias name)\"";
$.lang.data["net.phantombot.addcommand.custom-commands"] = "Current custom commands: $1";
$.lang.data["net.phantombot.addcommand.delalias-success"] = "$1, the alias !$2 was successfully deleted!";
$.lang.data["net.phantombot.addcommand.delalias-error-no-command"] = "That alias does not exist!";
$.lang.data["net.phantombot.addcommand.delalias-error-usage"] = "Usage: \"!delalias (alias name)\"";
$.lang.data["net.phantombot.addcommand.permcom-success"] = "Permissions for command: $1 set for group: $2 and higher.";
$.lang.data["net.phantombot.addcommand.permcom-removed-success"] = "All recursive permissions for the command: $1 and any of its aliases have been removed.";
$.lang.data["net.phantombot.addcommand.permcom-syntax-error"] = "You must specify a permission mode of 1 or 2! 1 specifies only a single group, multiple single groups can be added for the same command. 2 specifies recursive (all groups higher than the group specified).";
$.lang.data["net.phantombot.addcommand.permcom-error-no-command"] = "The command !$1 does not exist!";
$.lang.data["net.phantombot.addcommand.permcom-error-usage"] = "Usage: \"!permcom (command name) (group name) (1/2). Restricts usage of a command to viewers with a certain permission level. 1 specifies only a single group, multiple single groups can be added for the same command. 2 specifies recursive (all groups higher than the group specified).\"";
$.lang.data["net.phantombot.addcommand.error-no-custom-commands"] = "There are no custom commands!";
$.lang.data["net.phantombot.addcommand.filetag-error"] = "The File path may not contain any Slashes. The file has to be in addons/txt/ folder!";

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
$.lang.data["net.phantombot.rafflesystem.enter-error-notrunning"] = "There are no raffles active at the moment. If you are a $1, start a new raffle by using \"!raffle start\" (raffle item) (keyword).";
$.lang.data["net.phantombot.rafflesystem.enter-error-entered"] = "You have already entered the raffle.";
$.lang.data["net.phantombot.rafflesystem.enter-error-notenough"] = "You do not have enough $1 to enter the raffle."
$.lang.data["net.phantombot.rafflesystem.enter-error-iscaster"] = "The channel broadcaster can't enter the raffle."
$.lang.data["net.phantombot.rafflesystem.enter-error-nofollow"] = "You are not following. For this raffle, you need to be following."
$.lang.data["net.phantombot.rafflesystem.enter-success"] = "You have entered the raffle."
$.lang.data["net.phantombot.rafflesystem.redraw-success-nofollow"] = "/me [Raffle Redraw] Everyone that entered isn't following, thus there is no winner.";
$.lang.data["net.phantombot.rafflesystem.redraw-success-default"] = "/me [Raffle Redraw] The winner is $1, congratulations! You won $2, contact the broadcaster for your prize!";
$.lang.data["net.phantombot.rafflesystem.redraw-error-running"] = "You can not pick another winner of a raffle that is still running.";
$.lang.data["net.phantombot.rafflesystem.redraw-error-noentries"] = "You can not pick another winner of a raffle that has no entries.";
$.lang.data["net.phantombot.rafflesystem.redraw-error-pointraffle"] = "You can not pick another winner of a raffle that rewards $1 to users.";
$.lang.data["net.phantombot.rafflesystem.result-success-running"] = "The stats of the active raffle are: [Reward: $1] - [Entry Fee: $2] - [Prize Mode: $3] - [Follow Mode: $4] - [Keyword: $5] - [Entries: $6]";
$.lang.data["net.phantombot.rafflesystem.result-success-norunning"] = "The stats of the previous raffle are: [Reward: $1] - [Entry Fee: $2] - [Prize Mode: $3] - [Follow Mode: $4] - [Keyword: $5] - [Entries: $6] - [Winner: $7] - [Date: $8]";
$.lang.data["net.phantombot.rafflesystem.result-error-notfound"] = "Could not find any valid raffle stats.";
$.lang.data["net.phantombot.rafflesystem.toggle-enabled"] = "Users will now be notified of their entry into the raffle.";
$.lang.data["net.phantombot.rafflesystem.toggle-disabled"] = "Users will no longer be notified of their entry into the raffle.";
$.lang.data["net.phantombot.rafflesystem.entries-error-noresults"] = "Could not find any raffle entries to display.";
$.lang.data["net.phantombot.rafflesystem.entries-success"] = "[Raffle Entries] Page $1 of $2: $3.";
$.lang.data["net.phantombot.rafflesystem.entries-usage"] = "Usage: \"!raffle entries <page>\"";

// bidSystem.js
$.lang.data["net.phantombot.bidsystem.close-error-notrunning"] = "You can not close a auction while no auction is active.";
$.lang.data["net.phantombot.bidsystem.close-success"] = "/me [Auction Ended] The auction is now closed. The highest bidder is $1 with $2.";
$.lang.data["net.phantombot.bidsystem.close-success-noentries"] = "/me [Auction Ended] The auction is now closed. Nobody entered, thus there is no winner.";
$.lang.data["net.phantombot.bidsystem.enter-error-belowminimum"] = "You need to bid at least $1 to enter the auction.";
$.lang.data["net.phantombot.bidsystem.enter-error-notenough"] = "You do not have enough $1 to bid $2.";
$.lang.data["net.phantombot.bidsystem.enter-error-notrunning"] = "You can not make a new bid while no auction is running.";
$.lang.data["net.phantombot.bidsystem.enter-success"] = "[Auction Updated] $1 bid $2. To top this, you need to bid at least $3.";
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

// betSystem.js
$.lang.data["net.phantombot.betsystem.autoclose-success"] = "/me [Bet Closing] The current bet is about to close. The current betting pot is $1.";
$.lang.data["net.phantombot.betsystem.betmax-error-negative"] = "You can not set the maximum amount of $1 for bets to a negative number.";
$.lang.data["net.phantombot.betsystem.betmax-success"] = "Set the maximum amount of $1 for bets to $2.";
$.lang.data["net.phantombot.betsystem.betmax-usage"] = "Usage: \"!bet max <amount>\"";
$.lang.data["net.phantombot.betsystem.betmin-error-negative"] = "You can not set the minimum amount of $1 for bets to a negative number.";
$.lang.data["net.phantombot.betsystem.betmin-success"] = "Set the minimum amount of $1 for bets to $2.";
$.lang.data["net.phantombot.betsystem.betmin-usage"] = "Usage: \"!bet min <amount>\"";
$.lang.data["net.phantombot.betsystem.close-error-nooption"] = "You can not close a bet without declaring the winning option.";
$.lang.data["net.phantombot.betsystem.close-error-notfound"] = "You can not close a bet using this option as it is not included in the active bet.";
$.lang.data["net.phantombot.betsystem.close-error-notowner"] = "You can not close a bet if you did not start the active bet.";
$.lang.data["net.phantombot.betsystem.close-error-notrunning"] = "You can not close a bet while no bet is active.";
$.lang.data["net.phantombot.betsystem.close-success"] = "/me [Bet Close] The bet has closed! Every user that voted on \"$1\" won $2!";
$.lang.data["net.phantombot.betsystem.close-success-notenough"] = "/me [Bet Closed] The bet is now closed. Not enough people entered, and $1 have been refunded.";
$.lang.data["net.phantombot.betsystem.close-success-nowinners"] = "/me [Bet Closed] The bet is now closed. Nobody won, better luck next time!";
$.lang.data["net.phantombot.betsystem.close-success-sameoption"] = "/me [Bet Closed] The bet is now closed. Everybody wagered on the same option, and $1 have been refunded.";
$.lang.data["net.phantombot.betsystem.enter-error-abovemax"] = "You can not wager more than $1.";
$.lang.data["net.phantombot.betsystem.enter-error-belowmin"] = "You can not wager less than $1.";
$.lang.data["net.phantombot.betsystem.enter-error-entered"] = "You have already entered the bet.";
$.lang.data["net.phantombot.betsystem.enter-error-negative"] = "You can not wager negative $1.";
$.lang.data["net.phantombot.betsystem.enter-error-notenough"] = "You do not have enough $1 to wager $2.";
$.lang.data["net.phantombot.betsystem.enter-error-notvalid"] = "You can not vote for an option not included in the active bet.";
$.lang.data["net.phantombot.betsystem.enter-success"] = "/me [Bet Update] $1 wagers $2 on \"$3\"! New pot: $4!";
$.lang.data["net.phantombot.betsystem.result-norunning-error-notfound"] = "Could not find any valid bet stats.";
$.lang.data["net.phantombot.betsystem.result-norunning-success"] = "The stats of the previous bet are: [Pot: $1] - [Entries: $2] - [Options: $3] - [Winning Option: \"$4\"] - [Date: $5]";
$.lang.data["net.phantombot.betsystem.result-running-error-notfound"] = "There currently are no entries. To enter and wager your $1, use \"!bet <amount> <option>\" with one of these options: $2.";
$.lang.data["net.phantombot.betsystem.result-running-success"] = "The stats of the active bet are: [Pot: $1] - [Entries: $2] - [Options: $3]";
$.lang.data["net.phantombot.betsystem.start-error-notenough"] = "You can not start a new bet because you didn't specify enough options.";
$.lang.data["net.phantombot.betsystem.start-error-running"] = "You can not start a new bet when another bet is already running.";
$.lang.data["net.phantombot.betsystem.start-success"] = "/me [Bet Started] A new bet has started. You can vote for $1. You have $2 second(s) to bet for a chance to win $3.";
$.lang.data["net.phantombot.betsystem.status-notrunning"] = "There are no bets active at the moment. If you are a $1, start a new bet by using \"!bet start\".";
$.lang.data["net.phantombot.betsystem.status-running"] = "To enter the active bet and wager your $1, use \"!bet <amount> <option>\" with one of these options: $2.";
$.lang.data["net.phantombot.betsystem.time-error-negative"] = "You can not set the maximum time between each wager to a negative number.";
$.lang.data["net.phantombot.betsystem.time-success"] = "Set the maximum time between each wager to $1 second(s).";
$.lang.data["net.phantombot.betsystem.time-usage"] = "Usage: \"!bet time <amount>\"";
$.lang.data["net.phantombot.betsystem.entries-error-noresults"] = "Could not find any bet entries to display.";
$.lang.data["net.phantombot.betsystem.entries-success"] = "[Bet Entries] Page $1 of $2: $3.";
$.lang.data["net.phantombot.betsystem.entries-usage"] = "Usage: \"!bet entries <page>\"";

// top10Command.js
$.lang.data["net.phantombot.top10.points-disabled"] = "You can not use this command while the points module is disabled.";
$.lang.data["net.phantombot.top10.points-error-noresults"] = "Could not find any users with $1.";
$.lang.data["net.phantombot.top10.points-success"] = "/me [Top 10 $1] $2";
$.lang.data["net.phantombot.top10.points-success-whisper"] = "[Top 10 $1] $2";
$.lang.data["net.phantombot.top10.time-disabled"] = "You can not use this command while the time module is disabled.";
$.lang.data["net.phantombot.top10.time-error-noresults"] = "Could not find any users with time spent in the chat.";
$.lang.data["net.phantombot.top10.time-success"] = "/me [Top 10 Time] $1";
$.lang.data["net.phantombot.top10.time-success-whisper"] = "[Top 10 Time] $1";

// greetingSystem.js
$.lang.data["net.phantombot.greetingsystem.maxchars-error-negative"] = "You can not set the maximum greeting character amount to a negative number.";
$.lang.data["net.phantombot.greetingsystem.maxchars-success"] = "Set the maximum greeting character amount to $1.";
$.lang.data["net.phantombot.greetingsystem.maxchars-usage"] = "Usage: \"!greet max <amount>\"";
$.lang.data["net.phantombot.greetingsystem.set-cleared"] = "Your greeting message has been reset.";
$.lang.data["net.phantombot.greetingsystem.set-cleared-global"] = "The default greeting message has been reset.";
$.lang.data["net.phantombot.greetingsystem.set-cleared-other"] = "The greeting message of $1 has been reset.";
$.lang.data["net.phantombot.greetingsystem.set-error-noname"] = "Your greeting message must contain \"(name)\" to display your name.";
$.lang.data["net.phantombot.greetingsystem.set-error-noname-global"] = "The default greeting message must contain \"(name)\" to display someone's name.";
$.lang.data["net.phantombot.greetingsystem.set-error-noname-other"] = "The greeting message of $1 must contain \"(name)\" to display their name.";
$.lang.data["net.phantombot.greetingsystem.set-error-toolong"] = "Your greeting message can not be longer than $1 characters. It is now $2 characters long.";
$.lang.data["net.phantombot.greetingsystem.set-error-toolong-global"] = "The default greeting message can not be longer than $1 characters. It is now $2 characters long.";
$.lang.data["net.phantombot.greetingsystem.set-error-toolong-other"] = "The greeting message of $1 can not be longer than $2 characters. It is now $3 characters long.";
$.lang.data["net.phantombot.greetingsystem.set-success"] = "Your greeting message has been set to \"$1\".";
$.lang.data["net.phantombot.greetingsystem.set-success-global"] = "The default greeting message has been set to \"$1\".";
$.lang.data["net.phantombot.greetingsystem.set-success-other"] = "The greeting message of $1 has been set to \"$2\".";
$.lang.data["net.phantombot.greetingsystem.toggle-disabled"] = "A greeting message will no longer be displayed when you join.";
$.lang.data["net.phantombot.greetingsystem.toggle-disabled-global"] = "A greeting message will no longer be displayed when anyone joins.";
$.lang.data["net.phantombot.greetingsystem.toggle-disabled-other"] = "A greeting message will no longer be displayed when $1 joins.";
$.lang.data["net.phantombot.greetingsystem.toggle-enabled"] = "A greeting message will now be displayed when you join.";
$.lang.data["net.phantombot.greetingsystem.toggle-enabled-global"] = "A greeting message will now be displayed when anyone joins.";
$.lang.data["net.phantombot.greetingsystem.toggle-enabled-other"] = "A greeting message will now be displayed when $1 joins.";
$.lang.data["net.phantombot.greetingsystem.usage"] = "Usage: \"!greet max <amount>\", \"!greet set [global OR user <name>] <message>\", \"!greet toggle [global OR user <name>]\"";

//followHandler.js
$.lang.data["net.phantombot.followHandler.shoutout-offline"] = "Hey go give $1 a follow over at twitch.tv/$1! They were last seen playing: $2!";
$.lang.data["net.phantombot.followHandler.shoutout-online"] = "Hey go give $1 a follow over at twitch.tv/$1! They are currently playing: $2!";
$.lang.data["net.phantombot.followHandler.shoutout-usage"] = "Usage: !shoutout (streamer)";
$.lang.data["net.phantombot.followHandler.error-not-following"] = "$1 is not following channel $2.";
$.lang.data["net.phantombot.followHandler.followtime"] = "$1 has been following channel $2 for $3";
$.lang.data["net.phantombot.followHandler.followtime-usage"] = "Followage Commands: !followage / !followage (user) / !followage (user) (channel)";
$.lang.data["net.phantombot.followHandler.new-follow-message-and-reward"] = "Thanks for the follow (name)! +(pointname)!";
$.lang.data["net.phantombot.followHandler.new-follow-message-no-reward"] = "Thanks for the follow (name)!";
$.lang.data["net.phantombot.followHandler.not-following"] = "$1 is not following the channel.";
$.lang.data["net.phantombot.followHandler.is-following"] = "$1 is following the channel";
$.lang.data["net.phantombot.followHandler.follow-ads-on"] = "Follow announcements are now turned on.";
$.lang.data["net.phantombot.followHandler.follow-ads-off"] = "Follow announcements are now turned off.";
$.lang.data["net.phantombot.followHandler.current-follow-reward"] = "The current new follower reward is $1 points! To change it use '!followreward <reward>'";
$.lang.data["net.phantombot.followHandler.current-follow-reward-usage"] = "The current new follower reward is 100 points! To change it use '!followreward <reward>'";
$.lang.data["net.phantombot.followHandler.follow-reward-error"] = "Please put a valid reward greater than or equal to 0!";
$.lang.data["net.phantombot.followHandler.follow-reward-set"] = "New follower reward set!";
$.lang.data["net.phantombot.followHandler.triple-follow-train"] = "Triple follow!!";
$.lang.data["net.phantombot.followHandler.Quadra-follow-train"] = "Quadra follow!!";
$.lang.data["net.phantombot.followHandler.penta-follow-train"] = "Penta follow!!";
$.lang.data["net.phantombot.followHandler.mega-follow-train"] = "M-M-M-Mega follow train!! ($1)";
$.lang.data["net.phantombot.followHandler.ultra-follow-train"] = "Ultra follow train!! ($1) *Explosions*";
$.lang.data["net.phantombot.followHandler.massive-follow-train"] = "MASSIVE FOLLOW TRAAAAIIIN!! ($1)";
$.lang.data["net.phantombot.followHandler.followed-command-usage"] = "Usage: !follow (username), !followed (username), !followmessage (message), !followreward (reward)";
$.lang.data["net.phantombot.followHandler.current-follow-message"] = "The current new follower message is: $1";
$.lang.data["net.phantombot.followHandler.follow-message-usage"] = "To change it use '!followmessage <message>'. You can also add the string '(name)' to put the followers name and '(pointname) for the reward.";
$.lang.data["net.phantombot.followHandler.follow-message-usage-points"] = ", '(reward)' to put the number of points received for following.";
$.lang.data["net.phantombot.followHandler.follow-message-set"] = "New follower message set!";


// noticeHandler.js
$.lang.data["net.phantombot.noticehandler.notice-get-usage"] = "There are $1 notices. Say '!notice get <id>' to get a messages content. Message IDs go from 0 to $2";
$.lang.data["net.phantombot.noticehandler.notice-get-error"] = "There are $1 notices. Message IDs go from 0 to $2 and $3 isn't one of them";
$.lang.data["net.phantombot.noticehandler.notice-insert-usage"] = "Insert an event into a specific slot, pushing the event currently in that slot and all others after it forward by one slot. !notice insert <id> <message>";
$.lang.data["net.phantombot.noticehandler.notice-added-success"] = "Notice added! '$1' There are now $2 notices!";
$.lang.data["net.phantombot.noticehandler.notice-current-interval"] = "The current interval is $1 minutes. Set it with !notice timer <minutes> (Minimum is 2 minutes)";
$.lang.data["net.phantombot.noticehandler.notice-interval-set-success"] = "The interval between notices has been set to $1 minutes!";
$.lang.data["net.phantombot.noticehandler.notice-config"] = "[Notice Settings] - [Notices: $1] - [Interval: $2 minutes] - [Msg Trigger: $3 messages] - [Amount: $4 notices]";
$.lang.data["net.phantombot.noticehandler.notice-toggle-on"] = "Notices have been turned on!";
$.lang.data["net.phantombot.noticehandler.notice-toggle-off"] = "Notices have been turned off!";
$.lang.data["net.phantombot.noticehandler.notice-req-message-usage"] = "The current amount is $1 messages. Set it with !notice req <amount> (Minimum is 5 messages)";
$.lang.data["net.phantombot.noticehandler.norice-req-message-set-success"] = "The minimum number messages to trigger a notice has been set to $1 messages!";
$.lang.data["net.phantombot.noticehandler.notice-usage"] = "Usage: !addnotice <message>, !delnotice <id>, !notice insert <id> <message>, !notice get <id>, !notice timer <minutes>, !notice req <amount>, !notice config";
$.lang.data["net.phantombot.noticehandler.notice-add-usage"] = "Insert an notice at the end of the rotation. !addnotice <message>";
$.lang.data["net.phantombot.noticehandler.notice-remove-usage"] = "Delete the notice at the specified slot. !delnotice <id>";
$.lang.data["net.phantombot.noticehandler.notice-remove-error"] = "There are no notices at this time";
$.lang.data["net.phantombot.noticehandler.notice-remove-success"] = "Notice removed! There are now $1 notices!";
$.lang.data["net.phantombot.noticehandler.notice-enabled"] = "Enabled";
$.lang.data["net.phantombot.noticehandler.notice-disabled"] = "Disabled";
$.lang.data["net.phantombot.noticehandler.notice-remove-error2"] = "That notice does not exist, get the notice id with the command !notice get (id)";

//phraseHandler.js
$.lang.data["net.phantombot.phrasehandler.trigger-error-add-usage"] = "Usage: !addphrase \"trigger\" \"message\" - (sender) can be used in the message to display the username.";
$.lang.data["net.phantombot.phrasehandler.trigger-add-success"] = "Phrase trigger: $1, Message: '$2' was added!";
$.lang.data["net.phantombot.phrasehandler.trigger-remove-usage"] = "Usage: !delphrase (trigger)";
$.lang.data["net.phantombot.phrasehandler.trigger-remove-success"] = "Phrase trigger: '$1' was removed!";
$.lang.data["net.phantombot.phrasehandler.trigger-not-found"] = "That phrase trigger does not exist!";

//hostHandler.js 
$.lang.data["net.phantombot.hosthandler.default-host-welcome-message"] = "Thanks for the host (name)!";
$.lang.data["net.phantombot.hosthandler.default-host-welcome-message-and-reward"] = "Thanks for the host (name)! you're rewarded $1!";
$.lang.data["net.phantombot.hosthandler.host-reward-current-and-usage"] = "The current host reward is $1! To change it use '!hostreward <amount>";
$.lang.data["net.phantombot.hosthandler.host-reward-error"] = "Please put a valid reward greater than or equal to 0!";
$.lang.data["net.phantombot.hosthandler.host-reward-set-success"] = "New hoster reward set!";
$.lang.data["net.phantombot.hosthandler.host-count"] = "This channel is currently being hosted by $1 channels!";
$.lang.data["net.phantombot.hosthandler.host-timeout-time"] = "Host timeout duration is currently set to: $1 minutes!";
$.lang.data["net.phantombot.hosthandler.host-timeout-time-error"] = "Host timeout duration can't be less than 30 minutes!";
$.lang.data["net.phantombot.hosthandler.host-timeout-time-set"] = "Host timeout duration is now set to: $1 minutes!";
$.lang.data["net.phantombot.hosthandler.host-list"] = "This channel is currently being hosted by the hosting $1 channels: $2";
$.lang.data["net.phantombot.hosthandler.host-list-error"] = "No one is currently hosting this channel.";
$.lang.data["net.phantombot.hosthandler.current-host-message"] = "The current new hoster message is: $1";
$.lang.data["net.phantombot.hosthandler.host-message-usage"] = "To change it use '!hostmessage (message)'. You can also add the string '(name)' to put the hosters name";
$.lang.data["net.phantombot.hosthandler.host-message-set-success"] = "New host message set!";

//donationHandler.js 
$.lang.data["net.phantombot.donationhandler.current-file-path"] = "Current donation alert file path is: $1";
$.lang.data["net.phantombot.donationhandler.new-file-path-set"] = "File path for donation alert has been set!";
$.lang.data["net.phantombot.donationhandler.donation-toggle-on"] = "Donation alerts have been enabled.";
$.lang.data["net.phantombot.donationhandler.donation-toggle-off"] = "Donation alerts have been disabled.";
$.lang.data["net.phantombot.donationhandler.new-donation"] = "$1 has received a donation from: $2";
$.lang.data["net.phantombot.donationhandler.donationalert-usage"] = "!donationalert filepath | vieufilepath | toggle";

//subscribeHandler.js 
$.lang.data["net.phantombot.subscribeHandler.default-sub-message-with-points"] = "Thanks for the subscription (name)! +(pointname)!";
$.lang.data["net.phantombot.subscribeHandler.default-sub-message"] = "Thanks for the subscription (name)!";
$.lang.data["net.phantombot.subscribeHandler.sub-silent-mode-on"] = "Subscribe handler now set to silent mode";
$.lang.data["net.phantombot.subscribeHandler.sub-silent-mode-off"] = "Subscribe handler now set to verbose mode";
$.lang.data["net.phantombot.subscribeHandler.current.sub-message"] = "The current subscriber message is: $1";
$.lang.data["net.phantombot.subscribeHandler.new-sub-message-set"] = "New subscriber message set!";
$.lang.data["net.phantombot.subscribeHandler.new-sub-current-reward"] = "The current new subscriber reward is $1 points! To change it use '!subscribereward <reward>";
$.lang.data["net.phantombot.subscribeHandler.sub-reward-error"] = "Please put a valid reward greater than or equal to 0!";
$.lang.data["net.phantombot.subscribeHandler.new-sub-reward-set"] = "New subscriber reward set to $1 $2";
$.lang.data["net.phantombot.subscribeHandler.current-subs"] = "There are currently $1 subscribers!";
$.lang.data["net.phantombot.subscribeHandler.current-sub-mode"] = "Currently using $1 subscription detection. twitchnotify mode does not save to the database. To change it use '!subscribemode <auto or twitchnotify>";
$.lang.data["net.phantombot.subscribeHandler.changed-sub-mode-twitchnotify"] = "Switched to twitchnotify subscription detection!";
$.lang.data["net.phantombot.subscribeHandler.changed-sub-mode-auto"] = "Switched to auto subscription detection!";

//8ballCommand.js
$.lang.data["net.phantombot.8ballCommand.proper-usage"] = "ask the magic-8ball a question with !8ball";
$.lang.data["net.phantombot.8ballCommand.answer-1"] = "Reply hazy try again.";
$.lang.data["net.phantombot.8ballCommand.answer-2"] = "Ask again later.";
$.lang.data["net.phantombot.8ballCommand.answer-3"] = "Better not tell you now.";
$.lang.data["net.phantombot.8ballCommand.answer-4"] = "Cannot predict now.";
$.lang.data["net.phantombot.8ballCommand.answer-5"] = "Outlook not so good.";
$.lang.data["net.phantombot.8ballCommand.answer-6"] = "Yes, in due time.";
$.lang.data["net.phantombot.8ballCommand.answer-7"] = "You will have to wait.";
$.lang.data["net.phantombot.8ballCommand.answer-8"] = "Ask again later.";
$.lang.data["net.phantombot.8ballCommand.answer-9"] = "Better not tell you now. OpieOP";
$.lang.data["net.phantombot.8ballCommand.answer-10"] = "Concentrate and ask again.";
$.lang.data["net.phantombot.8ballCommand.answer-11"] = "Reply hazy, try again.";
$.lang.data["net.phantombot.8ballCommand.answer-12"] = "Never going to happen!";
$.lang.data["net.phantombot.8ballCommand.answer-13"] = "The odds of that happening are pretty slim.";
$.lang.data["net.phantombot.8ballCommand.answer-14"] = "My reply is no.";
$.lang.data["net.phantombot.8ballCommand.answer-15"] = "My sources say no.";
$.lang.data["net.phantombot.8ballCommand.answer-16"] = "Very doubtful.";
$.lang.data["net.phantombot.8ballCommand.answer-17"] = "No.";
$.lang.data["net.phantombot.8ballCommand.answer-18"] = "I have no response for that question...";
$.lang.data["net.phantombot.8ballCommand.answer-19"] = "Why would I tell you? OMGScoots";
$.lang.data["net.phantombot.8ballCommand.answer-20"] = "Forget about it.";
$.lang.data["net.phantombot.8ballCommand.answer-21"] = "Don't bet on it.";
$.lang.data["net.phantombot.8ballCommand.answer-22"] = "Who knows?";
$.lang.data["net.phantombot.8ballCommand.answer-23"] = "Signs point to yes.";
$.lang.data["net.phantombot.8ballCommand.answer-24"] = "It is certain.";
$.lang.data["net.phantombot.8ballCommand.answer-25"] = "Without a doubt.";
$.lang.data["net.phantombot.8ballCommand.answer-26"] = "Yes definitely.";
$.lang.data["net.phantombot.8ballCommand.answer-27"] = "You may rely on it.";
$.lang.data["net.phantombot.8ballCommand.answer-28"] = "As I see it, yes.";
$.lang.data["net.phantombot.8ballCommand.answer-29"] = "Most likely.";
$.lang.data["net.phantombot.8ballCommand.answer-30"] = "Outlook good.";
$.lang.data["net.phantombot.8ballCommand.answer-31"] = "Yes.";
$.lang.data["net.phantombot.8ballCommand.answer-32"] = "Signs point to yes.";
$.lang.data["net.phantombot.8ballCommand.answer-33"] = "This is not the Bot you're looking for ༼ﾉ۞⌂۞༽ﾉ";

//quoteCommand.js
$.lang.data["net.phantombot.quotecommand.error-no-quotes"] = "There are no quotes at this time!";
$.lang.data["net.phantombot.quotecommand.quote-number"] = "There are only $1 quotes right now! Remember that quotes are numbered from 0 to $2!";
$.lang.data["net.phantombot.quotecommand.random-quote"] = "#$1: $2";
$.lang.data["net.phantombot.quotecommand.error-quote-usage"] = "Usage: !addquote (quote)";
$.lang.data["net.phantombot.quotecommand.quote-add-success"] = "Quote added! There are now $1 quotes!";
$.lang.data["net.phantombot.quotecommand.editquote-error"] = "There is no quote under that ID!";
$.lang.data["net.phantombot.quotecommand.editquote-error-usage"] = "Usage: !editquote (ID) (quote)";
$.lang.data["net.phantombot.quotecommand.editquote-success"] = "Quote #$1 changed to: $2";
$.lang.data["net.phantombot.quotecommand.delquote-error"] = "There are no quotes at this time!";
$.lang.data["net.phantombot.quotecommand.delquote-error-usage"] = "Usage: !delquote (ID)";
$.lang.data["net.phantombot.quotecommand.delquote-success"] = "Quote removed! There are now $1 quotes!";
$.lang.data["net.phantombot.quotecommand.delquote-error-wrong-id"] = "That quote does not exist, Remember quotes are marked from 0 to $1";

//highlightCommand.js 
$.lang.data["net.phantombot.highlightcommand.usage"] = "Usage: !highlight (note)";
$.lang.data["net.phantombot.highlightcommand.error-stream-offline"] = "Stream is Offline!";
$.lang.data["net.phantombot.highlightcommand.highlight-saved"] = "Highlight saved! '$1' @ $2";
$.lang.data["net.phantombot.highlightcommand.highlight-cleared"] = "All Highlights have been erased!";

//lastseenCommand.js 
$.lang.data["net.phantombot.lastseencommand.usage"] = "Usage: !lastseen (username)";
$.lang.data["net.phantombot.lastseencommand.say"] = "$1 was last seen at: $2";
$.lang.data["net.phantombot.lastseencommand.error-no-data"] = "No data.";

//killCommand.js 
$.lang.data["net.phantombot.killcommand.error-no-kills"] = "There are no kill messages at this time";
$.lang.data["net.phantombot.killcommand.num-kills"] = "There are only $1 kills right now! Remember that kill messages are numbered from 0 to $2!";
$.lang.data["net.phantombot.killcommand.addkill-usage"] = "Usage: !addkill (message)";
$.lang.data["net.phantombot.killcommand.kill-added"] = "kill message added! There are now $1 kill messages!";
$.lang.data["net.phantombot.killcommand.error-wrong-id"] = "There are $1 kill messages. Message IDs go from 0 to $2 and $3 isn't one of them";
$.lang.data["net.phantombot.killcommand.edit-kill-usage"] = "Usage: !editkill (id) (message)";
$.lang.data["net.phantombot.killcommand.kill-edited"] = "kill message #$1 changed to: $2";
$.lang.data["net.phantombot.killcommand.del-kill-usage"] = "Usage: !delkill (ID)";
$.lang.data["net.phantombot.killcommand.del-kill-success"] = "kill removed! There are now $1 kills!";
$.lang.data["net.phantombot.killcommand.self-kill-1"] = "$1 has somehow managed to kill himself. ";
$.lang.data["net.phantombot.killcommand.self-kill-2"] = "$1 died from unknown causes.";
$.lang.data["net.phantombot.killcommand.self-kill-3"] = "$1 was sliced in half by Boulder (or something along those lines).";
$.lang.data["net.phantombot.killcommand.self-kill-4"] = "$1 exploded.";
$.lang.data["net.phantombot.killcommand.self-kill-5"] = "$1 forgot how to breathe.";
$.lang.data["net.phantombot.killcommand.self-kill-6"] = "$1 learned that cellular respiration uses oxygen, not sand.";
$.lang.data["net.phantombot.killcommand.self-kill-7"] = "$1 died.";
$.lang.data["net.phantombot.killcommand.self-kill-8"] = "$1 tried to befriend a wild grizzly bear.";
$.lang.data["net.phantombot.killcommand.self-kill-9"] = "$1 suffocated.";
$.lang.data["net.phantombot.killcommand.self-kill-10"] = "$1 tested the bounds of time and space and lost.";
$.lang.data["net.phantombot.killcommand.self-kill-11"] = "$1 ixploded.";
$.lang.data["net.phantombot.killcommand.self-kill-12"] = "$1 drowned.";
$.lang.data["net.phantombot.killcommand.self-kill-13"] = "$1 ceased to be.";
$.lang.data["net.phantombot.killcommand.self-kill-14"] = "$1 went kablewy!";
$.lang.data["net.phantombot.killcommand.self-kill-15"] = "$1 figured out how to divide by 0!";
$.lang.data["net.phantombot.killcommand.self-kill-16"] = "$1 took a long walk off a short pier.";
$.lang.data["net.phantombot.killcommand.self-kill-17"] = "$1 fell off a ladder.";
$.lang.data["net.phantombot.killcommand.self-kill-18"] = "$1 fell off a tree.";
$.lang.data["net.phantombot.killcommand.self-kill-19"] = "$1 fell off himself.";
$.lang.data["net.phantombot.killcommand.self-kill-20"] = "$1 bursts into flames.";
$.lang.data["net.phantombot.killcommand.self-kill-21"] = "$1 was struck by lightening.";
$.lang.data["net.phantombot.killcommand.self-kill-22"] = "$1 starved to death.";
$.lang.data["net.phantombot.killcommand.self-kill-23"] = "$1 was stabbed to death by (random).";
$.lang.data["net.phantombot.killcommand.self-kill-24"] = "$1 fell victim to gravity.";
$.lang.data["net.phantombot.killcommand.self-kill-25"] = "$1 's plead for death was answered.";
$.lang.data["net.phantombot.killcommand.self-kill-26"] = "$1 's vital organs were ruptured.";
$.lang.data["net.phantombot.killcommand.self-kill-27"] = "$1 's innards were made outwards.";
$.lang.data["net.phantombot.killcommand.self-kill-28"] = "$1 was licked to death. Don't ask.";
$.lang.data["net.phantombot.killcommand.self-kill-29"] = "$1 was deleted.";
$.lang.data["net.phantombot.killcommand.self-kill-30"] = "$1 had to split.";
$.lang.data["net.phantombot.killcommand.self-kill-31"] = "$1 Food is a gift from God. Spices are a gift from the devil. I guess it was a little too spicy for you.";
$.lang.data["net.phantombot.killcommand.kill-1"] = "(sender) murdered (1) with a unicorn's horn!";
$.lang.data["net.phantombot.killcommand.kill-2"] = "(1) was killed by a (sender)!";
$.lang.data["net.phantombot.killcommand.kill-3"] = "(1) was mauled by (sender) dressed up as a chicken.";
$.lang.data["net.phantombot.killcommand.kill-4"] = "(1) was ripped apart by (sender), Daaaaaaamn!";
$.lang.data["net.phantombot.killcommand.kill-5"] = "(1) was brutally murdered by (sender) with a car!";
$.lang.data["net.phantombot.killcommand.kill-6"] = "(sender) covered (1) in meat sauce and threw them in a cage with a starved tiger.";
$.lang.data["net.phantombot.killcommand.kill-7"] = "(sender) genetically modified a Venus flytrap so it grows really big and trapped (1) in a room with it.";
$.lang.data["net.phantombot.killcommand.kill-8"] = "(sender) shanked (1)'s butt, over and over again.";
$.lang.data["net.phantombot.killcommand.kill-9"] = "(sender) just wrote (1)'s name in their Death Note.";
$.lang.data["net.phantombot.killcommand.kill-10"] = "(sender) put (1) out of their misery.";
$.lang.data["net.phantombot.killcommand.kill-11"] = "(sender) destroyed (1)!";
$.lang.data["net.phantombot.killcommand.kill-12"] = "(sender) atacó a (1) con un consolador grande!";
$.lang.data["net.phantombot.killcommand.kill-13"] = "(1) was poked a bit too hard by (sender) with a spoon!";
$.lang.data["net.phantombot.killcommand.kill-14"] = "(sender) got his hands on a steamroller and steam rolled (1) flat! So, yeah (1) did die from that.";
$.lang.data["net.phantombot.killcommand.kill-15"] = "(sender) attacked (1) with a rusty spoon as the weapon...and managed to (1) with very little effort.";
$.lang.data["net.phantombot.killcommand.kill-16"] = "(sender) stole a car known as 'KITT' and ran over (1).";
$.lang.data["net.phantombot.killcommand.kill-17"] = "(sender) tickled (1) to death!";
$.lang.data["net.phantombot.killcommand.kill-18"] = "(1)'s skull was crushed by (sender)!";
$.lang.data["net.phantombot.killcommand.kill-19"] = "(1) is in several pieces after a tragic accident involving (sender) and spoons.";
$.lang.data["net.phantombot.killcommand.kill-20"] = "(sender) licked (1) until (sender) was squishy, yeah.. squishy.";
$.lang.data["net.phantombot.killcommand.kill-21"] = "(sender) catapulted a huge load of rusty spoons on to (1). (1) died.";
$.lang.data["net.phantombot.killcommand.kill-22"] = "(sender) ran out of rusty spoons and unicorn horns to kill (1) with and so instead used a rusty hanger.";
$.lang.data["net.phantombot.killcommand.kill-23"] = "(sender) came in like a mystical being of awesomeness and destroyed (1)!";
$.lang.data["net.phantombot.killcommand.kill-24"] = "(1) drowned whilst trying to escape from (sender)";
$.lang.data["net.phantombot.killcommand.kill-25"] = "(1) walked into a cactus while trying to escape from (sender)";
$.lang.data["net.phantombot.killcommand.kill-26"] = "(1) was attacked by (sender) behind a Taco Bell restaurant.";
$.lang.data["net.phantombot.killcommand.kill-27"] = "(sender) went back in time to prevent himself from killing (1), apparently the time machine landed (1) when (sender) jumped back in time.";

//levelQueueSystem.js 
$.lang.data["net.phantombot.levelQueueSystem.error-wrong-level-to-request"] = "You can only request up to $1 levels.";
$.lang.data["net.phantombot.levelQueueSystem.level-q-success"] = "Level $1 has been queued by $2!";
$.lang.data["net.phantombot.levelQueueSystem.level-q-error"] = "Please include a level name/checksum in your request: !request 0123-4567-8910";
$.lang.data["net.phantombot.levelQueueSystem.current-level-error"] = "Current level is unknown / not requested by users.";
$.lang.data["net.phantombot.levelQueueSystem.current-level"] = "Current level: $1 [Requested by: $2]";
$.lang.data["net.phantombot.levelQueueSystem.request-limit"] = "The queue request limit has been set to: $1";
$.lang.data["net.phantombot.levelQueueSystem.request-limit-error"] = "You must specify a limit number greater than 0";
$.lang.data["net.phantombot.levelQueueSystem.no-levels-in-q"] = "No levels are queued.";
$.lang.data["net.phantombot.levelQueueSystem.next-level"] = "Next level: $1";
$.lang.data["net.phantombot.levelQueueSystem.level-coming"] = "your level is coming up! $1";
$.lang.data["net.phantombot.levelQueueSystem.level-error"] = "All levels from queue have been played!";

//queueSystem.js 
$.lang.data["net.phantombot.queueSystem.request-limit-hit"] = "You can only queue up to $1 times";
$.lang.data["net.phantombot.queueSystem.error-need-more-points"] = "You don't have enough $1 to do that!";
$.lang.data["net.phantombot.queueSystem.added-to-waiting-list"] = "You have been added to the waiting list!";
$.lang.data["net.phantombot.queueSystem.error-adding-to-waiting-list"] = "You must include your in-game name with your request such as: !letmeplay somegaminghandle";
$.lang.data["net.phantombot.queueSystem.no-current-players"] = "There are no viewers in game currently";
$.lang.data["net.phantombot.queueSystem.current-player"] = "Current player playing: $1 [GamerTag: $1]";
$.lang.data["net.phantombot.queueSystem.request-limit-set"] = "The player queue request limit has been set to: $1";
$.lang.data["net.phantombot.queueSystem.request-limit-error-usage"] = "You must specify a limit number greater than 0";
$.lang.data["net.phantombot.queueSystem.no-player-in-q"] = "There are currently no players in queue.";
$.lang.data["net.phantombot.queueSystem.current-players"] = "Currently waiting to play: $1";
$.lang.data["net.phantombot.queueSystem.senders-trun-to-player"] = "it's your turn!";
$.lang.data["net.phantombot.queueSystem.no-players-waiting"] = "There are no more viewers waiting to play.";

//bankheistSystem.js
$.lang.data["net.phantombot.bankheistsystem.starting"] = "Alright guys, check your guns. We are storming into the Bank through all entrances. Let's get the cash and get out before the cops get here.";
$.lang.data["net.phantombot.bankheistsystem.stringFlawless"] = "The crew executed the heist flawlessly and scored (pointname) from the vault without leaving a trace!";
$.lang.data["net.phantombot.bankheistsystem.stringCasualties"] = "The crew suffered a few losses engaging the local security team. The remaining crew got away scoring (pointname) from the vault before backup arrived.";
$.lang.data["net.phantombot.bankheistsystem.payouts"] = "The heist payouts are: ";
$.lang.data["net.phantombot.bankheistsystem.all-dead"] = "The security team killed everyone in the heist!";
$.lang.data["net.phantombot.bankheistsystem.bank-closed"] = "The banks are currently closed!";
$.lang.data["net.phantombot.bankheistsystem.enter-bet-usage"] = "You must enter a bet! For example !bankheist (amount)";
$.lang.data["net.phantombot.bankheistsystem.afford-bet"] = "You must enter a bet you can afford and is not 0";
$.lang.data["net.phantombot.bankheistsystem.already-beted"] = "you have already placed a bet of $1";
$.lang.data["net.phantombot.bankheistsystem.heist-started"] = "has started a bankheist! To join in type !bankheist (amount)";
$.lang.data["net.phantombot.bankheistsystem.joined-heist"] = ", you have joined in on the bank heist!";
$.lang.data["net.phantombot.bankheistsystem.bank-open"] = "The banks are now open for the taking! Use !bankheist (amount) to bet.";
$.lang.data["net.phantombot.bankheistsystem.heist-canceled"] = "has cleared all previous bankheists. A new bankheist will start in ";
$.lang.data["net.phantombot.bankheistsystem.max-allowed"] = "The maximum amount allowed is $1";
$.lang.data["net.phantombot.bankheistsystem.bank-is-safe"] = "No one joined the bankheist! The banks are safe for now.";
$.lang.data["net.phantombot.bankheistsystem.bankheist-enabled"] = "Bankheists are now enabled!";
$.lang.data["net.phantombot.bankheistsystem.bankheist-disabled"] = "Bankheists are now disabled!";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-signupMinutes"] = "The value for signupMinutes has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-heistMinutes"] = "The value for heistMinutes has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-heistCancelled"] = "The value for heistCancelled has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-banksOpen"] = "The value for banksOpen has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-startedHeist"] = "The value for startedHeist has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-stringStarting"] = "The value for stringStarting has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-stringNoJoin"] = "The value for stringNoJoin has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-banksClosed"] = "The value for banksClosed has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-stringAllDead"] = "The value for stringAllDead has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-affordBet"] = "The value for affordBet has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-alreadyBet"] = "The value for alreadyBet has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-joinedHeist"] = "The value for joinedHeist has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-enterABet"] = "The value for enterABet has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-stringPayouts"] = "The value for stringPayouts has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-stringFlawless"] = "The value for stringFlawless has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-stringCasualties"] = "The value for stringCasualties has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-betTooLarge"] = "The value for betTooLarge has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-chances50"] = "The value for chances50 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-chances40"] = "The value for chances40 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-chances30"] = "The value for chances30 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-chances20"] = "The value for chances20 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-chances10"] = "The value for chances10 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-ratio50"] = "The value for ratio50 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-ratio40"] = "The value for ratio40 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-ratio30"] = "The value for ratio30 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-ratio20"] = "The value for ratio20 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-ratio10"] = "The value for ratio10 has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-maxbet"] = "The max bet amount has been set to $1";
$.lang.data["net.phantombot.bankheistsystem.new-value-for-user-error-404"] = "Action not recognized";
$.lang.data["net.phantombot.bankheistsystem.min-to-join"] = " minute(s) remaining to join!";

//streamCommand.js 
$.lang.data["net.phantombot.streamcommand.stream-offline"] = "Stream is offline.";
$.lang.data["net.phantombot.streamcommand.stream-online"] = "Stream is online!";
$.lang.data["net.phantombot.streamcommand.total-viewers"] = "There are currently $1 viewers!";
$.lang.data["net.phantombot.streamcommand.current-game"] = "Current game: $1";
$.lang.data["net.phantombot.streamcommand.game-changed-success"] = "Changed game to $1";
$.lang.data["net.phantombot.streamcommand.game-change-error-api"] = "Failed to change the game. TwitchAPI must be having issues";
$.lang.data["net.phantombot.streamcommand.current-title"] = "Current Title: $1";
$.lang.data["net.phantombot.streamcommand.title-changed-success"] = "Changed the title to: $1";
$.lang.data["net.phantombot.streamcommand.title-change-error-api"] = "Failed to change the status. TwitchAPI must be having issues";
$.lang.data["net.phantombot.streamcommand.disable-commercial"] = "Manual commercials disabled!";
$.lang.data["net.phantombot.streamcommand.enable-commercial"] = "Manual commercials enabled!";
$.lang.data["net.phantombot.streamcommand.auto-commercial-disable"] = "Automatic commercial timer disabled!";
$.lang.data["net.phantombot.streamcommand.auto-commercial-info"] = "Automatic commercials are disabled! To enable them, say '!commercial autotimer <interval in minutes (at least 9)> <commercial length 30, 60, 90, 120, 150, or 180> [optional message]";
$.lang.data["net.phantombot.streamcommand.auto-commercial-enabled"] = "Automatic commercials are enabled! They are running $1 seconds of ads every $2 minutes. To disable, say '!commercial autotimer 0'";
$.lang.data["net.phantombot.streamcommand.auto-commercial-message-op"] = "The message sent with every automatic commercial is: $1";
$.lang.data["net.phantombot.streamcommand.auto-commercial-usage"] = "Usage: !commercial autotimer <interval in minutes (at least 9) or 0 to disable> <commercial length 30, 60, 90, 120, 150, or 180> [optional message]";
$.lang.data["net.phantombot.streamcommand.manual-commercial-disabled"] = "Manual triggering of commercials is disabled!";
$.lang.data["net.phantombot.streamcommand.running-commercial"] = "Running a $1 second commercial!";
$.lang.data["net.phantombot.streamcommand.commercial-user-error"] = "You must enter a valid commercial length, wait 8 minutes between commercials, and can only run commercials when the stream is online! Valid lengths are 30, 60, 90, 120, 150, and 180 seconds";
$.lang.data["net.phantombot.streamcommand.commercial-api-error"] = "Failed to run a commercial. TwitchAPI must be having issues";

//rouletteCommand.js 
$.lang.data["net.phantombot.roulettecommand-Win1"] = "The trigger is pulled, and the revolver clicks. $1 has lived to survive roulette!";
$.lang.data["net.phantombot.roulettecommand-Win2"] = "The trigger is pulled, but the revolver malfunctions! $1 is lucky, and live's another day!";
$.lang.data["net.phantombot.roulettecommand-Win3"] = "The trigger is pulled, and the revolver clicks. $1 has lived to survive roulette!";
$.lang.data["net.phantombot.roulettecommand-Win4"] = "The trigger is pulled, but the revolver malfunctions! $1 is lucky, and live's another day!";
$.lang.data["net.phantombot.roulettecommand-Win5"] = "The trigger is pulled, and the revolver clicks. $1 has lived to survive roulette!";
$.lang.data["net.phantombot.roulettecommand-lost1"] = "The trigger is pulled, and the revolver fires! $1 lies dead in the chat.";
$.lang.data["net.phantombot.roulettecommand-lost2"] = "The trigger is pulled, and $1 loses their head!";
$.lang.data["net.phantombot.roulettecommand-lost3"] = "$1's finger slides over the trigger, $1 crashes to the floor like a sack of flour!";
$.lang.data["net.phantombot.roulettecommand-lost4"] = "The trigger is pulled, and the hand-cannon goes off with a roar! $1 lies dead in the chat.";
$.lang.data["net.phantombot.roulettecommand-lost5"] = "The hammer drops, and the .44 fires! $1 is now dead in the chat.";
$.lang.data["net.phantombot.roulettecommand-lost6"] = "The trigger is pulled, and the revolver fires! $1 is now just a blood splatter on the wall.";
$.lang.data["net.phantombot.roulettecommand-lost7"] = "The trigger is pulled, and the revolver fires! $1 ended their miserable life.";
$.lang.data["net.phantombot.roulettecommand-lostmod1"] = "The trigger is pulled, but $1 has been saved by magic!";
$.lang.data["net.phantombot.roulettecommand-lostmod2"] = "The trigger is pulled, but $1 has lived due to not having anything in his skull to begin with.";
$.lang.data["net.phantombot.roulettecommand-lostmod3"] = "The trigger is pulled, but $1's skull was so thick the bullet could not penetrate it.";
$.lang.data["net.phantombot.roulettecommand-lostmod4"] = "The trigger is pulled, but $1 stopped space and time and dodged the bullet!";
$.lang.data["net.phantombot.roulettecommand-lostmod5"] = "The trigger is pulled, but $1 did not die from the bullet, the bullet died from him.";
$.lang.data["net.phantombot.roulettecommand-timeout-time"] = "the !roulette timeout has been set to $1 seconds!";

//marathonCommand.js 
$.lang.data["net.phantombot.marathonCommand.current-caster-time"] = "Current Caster's Time: $1 $2";
$.lang.data["net.phantombot.marathonCommand.current-sched"] = "List of Scheduled Marathons:";
$.lang.data["net.phantombot.marathonCommand.prev"] = "[Prev] >>";
$.lang.data["net.phantombot.marathonCommand.live"] = "[Live] >>";
$.lang.data["net.phantombot.marathonCommand.next"] = "[Next] >>";
$.lang.data["net.phantombot.marathonCommand.error-no-marathon"] = "There is currently no marathon schedule";
$.lang.data["net.phantombot.marathonCommand.marathon-cleared"] = "The marathon schedule has been cleared!";
$.lang.data["net.phantombot.marathonCommand.current-marathon-name"] = "The current marathon name is '$1'! To change it use '!marathon name <name>'";
$.lang.data["net.phantombot.marathonCommand.marathon-name-set"] = "Marathon name set!";
$.lang.data["net.phantombot.marathonCommand.marathon-name-cleared"] = "Marathon name cleared!";
$.lang.data["net.phantombot.marathonCommand.marathon-link"] = "The current marathon link is '$1'! To change it use '!marathon link <link>'";
$.lang.data["net.phantombot.marathonCommand.marathon-link-error"] = "There currently is no marathon link set";
$.lang.data["net.phantombot.marathonCommand.marathon-link-set"] = "Marathon link set!";
$.lang.data["net.phantombot.marathonCommand.marathon-link-cleared"] = "Marathon link cleared!";
$.lang.data["net.phantombot.marathonCommand.marathon-sched-usage"] = "Usage: '!marathon schedule add <customname> <MM/DD> <HH:MM>', '!marathon schedule delete <MM/DD> <HH:MM>'";
$.lang.data["net.phantombot.marathonCommand.date-error-user-404"] = "Invalid date or time, type '!marathon schedule' for the format";
$.lang.data["net.phantombot.marathonCommand.deleted-time-slot"] = "Deleted specified timeslot from marathon schedule";
$.lang.data["net.phantombot.marathonCommand.time-slot-error-404"] = "Specified timeslot does not exist";
$.lang.data["net.phantombot.marathonCommand.added-items"] = "Added $1 valid schedule items";
$.lang.data["net.phantombot.marathonCommand.wrong-subcommand"] = "Invalid subcommand '$1'";
$.lang.data["net.phantombot.marathonCommand.marathon-command-usage"] = "Usage: !marathon clear, !marathon name <name>, !marathon nameclear, !marathon link <link>, !marathon linkclear, !marathon schedule";

//musicPlayer.js
$.lang.data["net.phantombot.musicplayer.now-playing"] = "[\u266B] Now Playing Song ~ $1 ~ Requested by @$2";
$.lang.data["net.phantombot.musicplayer.next-song-up"] = "[\u266B] Next Song ~ $1 ~ Requested by @$2";
$.lang.data["net.phantombot.musicplayer.queue-is-empty"] = "The song request queue is empty! Request a song by using !songrequest (youtube URL)";
$.lang.data["net.phantombot.musicplayer.song-request-error"] = "That song does not exist, or is marked private! ID: $1";
$.lang.data["net.phantombot.musicplayer.dj"] = " DJ ";
$.lang.data["net.phantombot.musicplayer.songrequest-enabled"] = "[\u266B] Song requests have been enabled!";
$.lang.data["net.phantombot.musicplayer.songrequest-disabled"] = "[\u266B] Song requests have been disabled.";
$.lang.data["net.phantombot.musicplayer.musicplayer-commands-usage"] = "Usage: !musicplayer [toggle / deny / allow / limit / storing / shuffle / storepath / titles / reloadplaylist / config / steal]";
$.lang.data["net.phantombot.musicplayer.song-msg-enabled"] = "[\u266B] Song messages have been turned on!";
$.lang.data["net.phantombot.musicplayer.song-msg-disabled"] = "[\u266B] Song messages have been turned off!";
$.lang.data["net.phantombot.musicplayer.song-blacklist-user"] = "You have removed $1's access to the song request feature!";
$.lang.data["net.phantombot.musicplayer.song-un-blacklist-user"] = "You have removed $1 from the song request blacklist!";
$.lang.data["net.phantombot.musicplayer.current-song-limit"] = "Current song reuqest limit is: $1 songs";
$.lang.data["net.phantombot.musicplayer.new-song-request-limit"] = "You have changed the song request limit to: $1 songs";
$.lang.data["net.phantombot.musicplayer.song-storing"] = "Playlists positions and titles will now be exported to a readable file.";
$.lang.data["net.phantombot.musicplayer.song-storing-disabled"] = "Playlist storage has been disabled.";
$.lang.data["net.phantombot.musicplayer.song-shuffle-enabled"] = "The default playlist songs will now be shuffled!";
$.lang.data["net.phantombot.musicplayer.song-shuffle-disabled"] = "The default playlist songs will no longer be shuffled.";
$.lang.data["net.phantombot.musicplayer.current-store-path"] = "The current store path is set to: $1";
$.lang.data["net.phantombot.musicplayer.new-store-path"] = "The playlist storeage path has been set to: $1";
$.lang.data["net.phantombot.musicplayer.titles-html"] = "Playlist storage has been set to export as html file.";
$.lang.data["net.phantombot.musicplayer.titles-text"] = "Playlist storage has been set to export as text file.";
$.lang.data["net.phantombot.musicplayer.musicplayer-config"] = "[MusicPlayer Settings] [Limit: $1 songs] [Messages: $2] [Player Status: $1]";
$.lang.data["net.phantombot.musicplayer.steal-song"] = "Song '$1' requested by $2 has been stolen, and added to the default playlist!";
$.lang.data["net.phantombot.musicplayer.user-blacklisted"] = "You are blacklisted from using the song request feature!";
$.lang.data["net.phantombot.musicplayer.song-request-usage"] = "To add a song to the queue type: !songrequest (youtube URL)";
$.lang.data["net.phantombot.musicplayer.command-cost"] = "The command cost of $1 has been returned to $2";
$.lang.data["net.phantombot.musicplayer.error-songrequest-off"] = "You can not request songs, because song request is disabled.";
$.lang.data["net.phantombot.musicplayer.error-songrequest-off2"] = "You can not delete songs, because song request is disabled.";
$.lang.data["net.phantombot.musicplayer.song-is-too-long"] = "That song is to long, maximum minutes allowed to request is 8 minutes!";
$.lang.data["net.phantombot.musicplayer.songrequest-limit-hit"] = "You have hit your song request limit of $1 songs!";
$.lang.data["net.phantombot.musicplayer.song-already-in-q"] = "That song is already in the queue, or the default playlist!";
$.lang.data["net.phantombot.musicplayer.song-requested-success"] = "[\u266B] Song ~ $1 ~ has been added to the queue, by @$2";
$.lang.data["net.phantombot.musicplayer.del-song-error"] = "That song is not in the queue, or you typed something wrong.";
$.lang.data["net.phantombot.musicplayer.del-song-success"] = "Song '$1' has been removed from the queue by @$2";
$.lang.data["net.phantombot.musicplayer.volume-set"] = "Music volume has been set to $1%";
$.lang.data["net.phantombot.musicplayer.poll-already-voted"] = "You already voted!";
$.lang.data["net.phantombot.musicplayer.poll-fail"] = "Failed to skip the song...";
$.lang.data["net.phantombot.musicplayer.poll-success"] = "Now skiping this song!";
$.lang.data["net.phantombot.musicplayer.2-vores-to-skip"] = "2 more votes are required to skip this song, to vote use '!vote yes'";
$.lang.data["net.phantombot.musicplayer.current-song"] = "Currently playing song ~ @$1";
$.lang.data["net.phantombot.musicplayer.404-error"] = "Song not found in current playlist.";
$.lang.data["net.phantombot.musicplayer.current-volume"] = "Music volume is currently: $1%";
$.lang.data["net.phantombot.musicplayer.start-search"] = "start search";
$.lang.data["net.phantombot.musicplayer.search-end"] = "search complete";
$.lang.data["net.phantombot.musicplayer.veto-song"] = "You paid to skip the current song.";
$.lang.data["net.phantombot.musicplayer.error-poll-opened"] = "A poll to skip a song is already open and running!";

// ticketraffleSystem.js
$.lang.data["net.phantombot.ticketrafflesystem.usage"] = "Ticket Raffle Commands: !traffle [open / close / repick / subscriberluck]";
$.lang.data["net.phantombot.ticketrafflesystem.no-raffle-opened"] = "There is no ticket raffle opened.";
$.lang.data["net.phantombot.ticketrafflesystem.winner"] = "/me Ticket Raffle ended, winner is $1!";
$.lang.data["net.phantombot.ticketrafflesystem.no-winner"] = "/me Ticket Raffle ended, no one entered.";
$.lang.data["net.phantombot.ticketrafflesystem.winner-repick"] = "/me [Ticket Raffle] there is no winner.";
$.lang.data["net.phantombot.ticketrafflesystem.no-winner-repick"] = "/me Ticket Raffle winner is, $1!";
$.lang.data["net.phantombot.ticketrafflesystem.raffle-already-opened"] = "A ticket raffle is already opened.";
$.lang.data["net.phantombot.ticketrafflesystem.user-error"] = "Syntax Error. \"!traffle open (max tickets)\" \"!traffle open (max tickets) (followers)\" \"!traffle open (max tickets) (subscribers)\"";
$.lang.data["net.phantombot.ticketrafflesystem.raffle-opened"] = "/me Ticket Raffle Opened! You can only buy a max of $1 tickets!";
$.lang.data["net.phantombot.ticketrafflesystem.raffle-opened2"] = "/me Ticket Raffle Opened! You must be following to enter! You can only buy a max of $1 tickets!";
$.lang.data["net.phantombot.ticketrafflesystem.raffle-opened3"] = "/me Ticket Raffle Opened! You must be subscribed to enter! You can only buy a max of $1 tickets!";
$.lang.data["net.phantombot.ticketrafflesystem.following"] = "you need to be following to enter.";
$.lang.data["net.phantombot.ticketrafflesystem.no-sub"] = "you need to be subscribed to enter.";
$.lang.data["net.phantombot.ticketrafflesystem.sub-luck-usage"] = "usage: !subscriberluck (1 to 10)";
$.lang.data["net.phantombot.ticketrafflesystem.sub-luck-set"] = "Subscriber luck set to $1. Subscribers will now have $1 time(s) better chance to win.";

// ticketsystem.js
$.lang.data["net.phantombot.ticketsystem.usage"] = "usage: !tickets (amount) - Tickets currently cost $1 points.";
$.lang.data["net.phantombot.ticketsystem.need-more-points"] = "you don't have enough points to buy that many tickets.";
$.lang.data["net.phantombot.ticketsystem.max-tickets-allowed"] = "you can only buy up to $1 ticket(s) in this ticket raffle.";
$.lang.data["net.phantombot.ticketsystem.error-already-in-raffle"] = "you already entered this ticket raffle.";
$.lang.data["net.phantombot.ticketsystem.buy-success"] = "you bought $1 ticket(s)";
$.lang.data["net.phantombot.ticketsystem.cost-usage"] = "!ticket cost (amount)";
$.lang.data["net.phantombot.ticketsystem.new-cost"] = "Tickets now will cost $1 $2";
$.lang.data["net.phantombot.ticketsystem.total-entries"] = "There are currently $1 total entrie(s).";
