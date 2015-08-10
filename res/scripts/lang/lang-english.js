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
$.lang.data["net.phantombot.commandlist.more"] = " >> Type '!commands < #>' for more";
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