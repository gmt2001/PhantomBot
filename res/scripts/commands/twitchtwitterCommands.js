$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var args = event.getArgs();
    var argsString = event.getArguments().trim();
    var list;
    var oldlist;
    var i;
    
    if (command.equalsIgnoreCase("twitch") || command.equalsIgnoreCase("twitter")) {
        if (args.length == 0) {
            return;
        }
        
        if ($.inidb.get("twitchtwitter", "perm").equalsIgnoreCase("mod")) {
            if (!$.isMod(sender)) {
                $.say($.modmsg);
                return;
            }
        } else if ($.inidb.get("twitchtwitter", "perm").equalsIgnoreCase("caster")) {
            if (!$.isCaster(sender)) {
                $.say($.castermsg);
                return;
            }
        } else if ($.inidb.get("twitchtwitter", "perm").equalsIgnoreCase("list")) {
            list = $.inidb.get("twitchtwitter", "list").split("&");
            
            if (!$.isAdmin(sender) && !$.array.contains(list, sender)) {
                $.say($.adminmsg);
                return;
            }
        } else {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }
        }
        
        var message;
        
        if (command.equalsIgnoreCase("twitch")) {
            message = $.inidb.get("twitchtwitter", "twitchmsg");
            
            while (message.contains('(name)')) {
                message = message.replace('(name)', args[0]);
            }
            
            $.say(message);
        }
        
        if (command.equalsIgnoreCase("twitter")) {
            message = $.inidb.get("twitchtwitter", "twittermsg");
            
            while (message.contains('(name)')) {
                message = message.replace('(name)', args[0]);
            }
            
            $.say(message);
        }
    }
    
    if (command.equalsIgnoreCase("twitchopt") || command.equalsIgnoreCase("twitteropt")) {
        if (!$.isAdmin(sender)) {
            $.say("Only Administrators can use this command, " + username + "!");
            return;
        }
        
        if (args.length == 0) {
            $.say("Usage: !twitchopt perm <caster, mod, admin, list>, !twitchopt twitchmsg <message>, !twitchopt twittermsg <message>, !twitchopt list, !twitchopt list add <name>, !twitchopt list rem <name>");
        } else {
            if (args[0].equalsIgnoreCase("perm")) {
                if (args.length == 1) {
                    if ($.inidb.get("twitchtwitter", "perm").equalsIgnoreCase("mod")) {
                        $.say("The !twitch and !twitter commands can be used by Moderators. To change, use: !twitchopt perm <caster, mod, admin, list>");
                    } else if ($.inidb.get("twitchtwitter", "perm").equalsIgnoreCase("caster")) {
                        $.say("The !twitch and !twitter commands can be used by Casters. To change, use: !twitchopt perm <caster, mod, admin, list>");
                    } else if ($.inidb.get("twitchtwitter", "perm").equalsIgnoreCase("list")) {
                        $.say("The !twitch and !twitter commands can only be used by Administrators and users in the List. To change, use: !twitchopt perm <caster, mod, admin, list>");
                    } else {
                        $.say("The !twitch and !twitter commands can only be used by Administrators. To change, use: !twitchopt perm <caster, mod, admin, list>");
                    }
                } else {
                    if (args[1].equalsIgnoreCase("mod") || args[1].equalsIgnoreCase("mods") || args[1].equalsIgnoreCase("moderators")) {
                        $.inidb.set("twitchtwitter", "perm", "mod");
                        
                        $.say("The !twitch and !twitter commands are now limited to Moderators");
                        
                        $.logEvent("twitchtwitterCommands.js", 89, username + " limited the !twitch and !twitter commands to Moderators");
                    } else if (args[1].equalsIgnoreCase("caster") || args[1].equalsIgnoreCase("casters")) {
                        $.inidb.set("twitchtwitter", "perm", "caster");
                        
                        $.say("The !twitch and !twitter commands are now limited to Casters");
                        
                        $.logEvent("twitchtwitterCommands.js", 95, username + " limited the !twitch and !twitter commands to asters");
                    } else if (args[1].equalsIgnoreCase("list")) {
                        $.inidb.set("twitchtwitter", "perm", "list");
                        
                        $.say("The !twitch and !twitter commands are now limited to Administrators and users on the List");
                        
                        $.logEvent("twitchtwitterCommands.js", 101, username + " limited the !twitch and !twitter commands to the List");
                    } else {
                        $.inidb.set("twitchtwitter", "perm", "admin");
                        
                        $.say("The !twitch and !twitter commands are now limited to Administrators");
                        
                        $.logEvent("twitchtwitterCommands.js", 107, username + " limited the !twitch and !twitter commands to Administrators");
                    }
                }
            }
            
            if (args[0].equalsIgnoreCase("twitchmsg")) {
                if (args.length == 1) {
                    $.say("The !twitch command message is: " + $.inidb.get("twitchtwitter", "twitchmsg"));
                    $.say("To change it, use: !twitchopt twitchmsg <message>, and include a (name) where you want the name to appear");
                } else {
                    argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
                    
                    $.inidb.set("twitchtwitter", "twitchmsg", argsString);
                    
                    $.say("Set the !twitch command message to: " + argsString);
                    
                    $.logEvent("twitchtwitterCommands.js", 123, username + " set the !twitch command message to: " + argsString);
                }
            }
            
            if (args[0].equalsIgnoreCase("twittermsg")) {
                if (args.length == 1) {
                    $.say("The !twitter command message is: " + $.inidb.get("twitchtwitter", "twittermsg"));
                    $.say("To change it, use: !twitchopt twittermsg <message>, and include a (name) where you want the name to appear");
                } else {
                    argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
                    
                    $.inidb.set("twitchtwitter", "twittermsg", argsString);
                    
                    $.say("Set the !twitter command message to: " + argsString);
                    
                    $.logEvent("twitchtwitterCommands.js", 138, username + " set the !twitter command message to: " + argsString);
                }
            }
            
            if (args[0].equalsIgnoreCase("list")) {
                if (args.length == 1) {
                    $.say("When set to list mode, only the following users and Administrators will be able to use !twitch or !twitter. To change the list, use !twitchopt list add <name> & !twitchopt list rem <name>");
                    
                    list = $.inidb.get("twitchtwitter", "list").split("&");
                    
                    var m = "";
                    
                    for (var b = 0; b < Math.ceil(list.length / 30); b++) {
                        m = "";
                        
                        for (i = (b * 30); i < Math.min(list.length, ((b + 1) * 30)); i++) {
                            if ($.strlen(m) > 0) {
                                m += ", ";
                            }
            
                            m += list[i];
                        }
                        
                        $.say(">>" + m);
                    }
                } else {
                    if (args[1].equalsIgnoreCase("add")) {
                        if (args.length == 2) {
                            $.say("Adds a user to the list, when using list permission mode. Usage: !twitchopt list add <name>");
                        } else {
                            oldlist = $.inidb.get("twitchtwitter", "list").split("&");
                            list = new Array();
                            
                            
                            for (i = 0; i < oldlist.length; i++) {
                                list.push(oldlist[i]);
                            }
                            
                            if (!$.array.contains(list, args[2].toLowerCase())) {
                                list.push(args[2].toLowerCase());
                            }
                            
                            $.inidb.set("twitchtwitter", "list", list.join("&"));
                            
                            $.say("Added " + args[2] + " to the permission list!");
                            
                            $.logEvent("twitchtwitterCommands.js", 184, username + " added " + args[2] + " to the list");
                        }
                    }
                    
                    if (args[1].equalsIgnoreCase("rem") || args[1].equalsIgnoreCase("del")) {
                        if (args.length == 2) {
                            $.say("Removes a user to the list, when using list permission mode. Usage: !twitchopt list rem <name>");
                        } else {
                            oldlist = $.inidb.get("twitchtwitter", "list").split("&");
                            list = new Array();
                            
                            
                            for (i = 0; i < oldlist.length; i++) {
                                if (!oldlist[i].equalsIgnoreCase(args[2].toLowerCase())) {
                                    list.push(oldlist[i]);
                                }
                            }
                            
                            $.inidb.set("twitchtwitter", "list", list.join("&"));
                            
                            $.say("Removed " + args[2] + " from the permission list!");
                            
                            $.logEvent("twitchtwitterCommands.js", 206, username + " removed " + args[2] + " from the list");
                        }
                    }
                }
            }
        }
    }
});

//$.registerChatCommand("./commands/twitchtwitterCommands.js", "twitch", "caster");
//$.registerChatCommand("./commands/twitchtwitterCommands.js", "twitter", "caster");
$.registerChatCommand("./commands/twitchtwitterCommands.js", "twitchopt", "admin");