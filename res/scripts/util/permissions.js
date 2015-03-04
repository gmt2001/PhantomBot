var usergonetime = 10 * 60 * 1000;
var usercheckinterval = 3 * 60 * 1000;
var modcheckinterval = 10 * 60 * 1000;

if ($.modeOUsers == null || $.modeOUsers == undefined) {
    $.modeOUsers = new Array();
}

if ($.subUsers == null || $.subUsers == undefined) {
    $.subUsers = new Array();
}

if ($.modListUsers == null || $.modListUsers == undefined) {
    $.modListUsers = new Array();
}

if ($.users == null || $.users == undefined) {
    $.users = new Array();
}

if ($.lastjoinpart == null || $.lastjoinpart == undefined) {
    $.lastjoinpart = System.currentTimeMillis();
}

$.isBot = function (user) {
    return user.equalsIgnoreCase($.botname);
}

$.isOwner = function (user) {
    return user.equalsIgnoreCase($.botowner);
}

$.isAdmin = function (user) {
    return $.hasGroupByName(user, "Administrators") || $.isOwner(user) || $.isBot(user);
}

$.isMod = function (user) {
    return $.hasGroupByName(user, "Moderators") || $.hasModeO(user) || $.hasModList(user) || $.isAdmin(user);
}

$.isReg = function (user) {
    return $.hasGroupByName(user, "Regulars");
}
$.hasModeO = function (user) {
    return $.array.contains($.modeOUsers, user.toLowerCase());
}

$.hasModList = function (user) {
    return $.array.contains($.modListUsers, user.toLowerCase());
}

$.isSub = function (user) {
    for (var i = 0; i < $.subUsers.length; i++) {
        if ($.subUsers[i][0].equalsIgnoreCase(user)) {
            return true;
        }
    }
    
    return false;
}

$.isCaster = function (user) {
    return $.hasGroupByName(user, "Casters") || $.isMod(user);
}

$.hasGroupById = function(user, id) {
    return $.getUserGroupId(user) >= id;
}
 
$.hasGroupByName = function(user, name) {
    return $.hasGroupById(user, $.getGroupIdByName(name));    
}
 
$.getUserGroupId = function(user) {
    user = $.username.resolve(user);
    var group = $.inidb.get('group', user.toLowerCase());
    if(group == null) group = 0;
    else group = parseInt(group);
    return group;
}
 
$.getUserGroupName = function(user) {
    return $.getGroupNameById($.getUserGroupId(user));
}
 
$.setUserGroupById = function(user, id) {
    user = $.username.resolve(user);
    $.inidb.set('group', user.toLowerCase(), id);
}
 
$.setUserGroupByName = function(user, name) {
    $.setUserGroupById(user, $.getGroupIdByName(name));
}

var groups = new Array();
var keys = $.inidb.GetKeyList("groups", "");

for (var i = 0 ; i < keys.length; i++) {
    groups[parseInt(keys[i])] = $.inidb.get("groups", keys[i]);
}

if (groups[0] == undefined || groups[0] == null) {
    groups[0] = "Viewers";
}

if (groups[1] == undefined || groups[1] == null) {
    groups[1] = "Regulars";
}

if (groups[2] == undefined || groups[2] == null) {
    groups[2] = "Subscribers";
}

if (groups[3] == undefined || groups[3] == null) {
    groups[3] = "Donators";
}

if (groups[4] == undefined || groups[4] == null) {
    groups[4] = "Hosters";
}

if (groups[5] == undefined || groups[5] == null) {
    groups[5] = "Awesomes";
}

if (groups[6] == undefined || groups[6] == null) {
    groups[6] = "Moderators";
}

if (groups[7] == undefined || groups[7] == null) {
    groups[7] = "Administrators";
}

if (groups[8] == undefined || groups[8] == null) {
    groups[8] = "Casters";
}
 
$.getGroupNameById = function(id) {
    id = parseInt(id);
    
    if (id < groups.length) {
        return groups[id];
    }
    
    return groups[0];
}
 
$.getGroupIdByName = function(name) {
    name = name + "";
    
    for (var i = 0; i < groups.length; i++){
        if (groups[i].equalsIgnoreCase(name)) {
            return i;
        }
    }
    
    return 0;
}

$.on('command', function(event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
	
    var args = event.getArgs();
    var name;
    var i;
    var s;
    var allowed = true;
	if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
	
	if(args.length >=2) {
		if(command.equalsIgnoreCase("group")) {
            var action = args[0];
			
            if (!$.isAdmin(sender)) {
                $.say(username + ", " + $.getUserGroupName(username) + "s aren't allowed access to this command! Administrators only.");
				return;
            }
			
			if (action.equalsIgnoreCase("remove") || action.equalsIgnoreCase("delete") || action.equalsIgnoreCase("reset")) {
				$.setUserGroupById(args[1], $.getGroupIdByName("Viewers"));
				$.say("Group for " + $.username.resolve(args[1]) + " reset to " + $.getUserGroupName($.username.resolve(args[1])) + "!");
				$.logEvent("permissions.js", 183, username + " reset " + args[1] + "'s group to " + $.getUserGroupName($.username.resolve(args[1])));
				return;
			}
		}
	}
	
    if(args.length >= 3) {
        if(command.equalsIgnoreCase("group")) {
            var action = args[0];
			name = argsString.substring(argsString.indexOf(args[1]) + args[1].length() + 1);
			var groupid = $.getGroupIdByName(name);
			var groupname = $.getGroupNameById(groupid);
			
            if (!$.isAdmin(sender)) {
                $.say(username + ", " + $.getUserGroupName(username) + "s aren't allowed access to this command! Administrators only.");
                return;                
            }

            if (action.equalsIgnoreCase("set") || action.equalsIgnoreCase("add") || action.equalsIgnoreCase("change")) {                				
                if( name.toLowerCase() != groupname.toLowerCase() ) {
					 $.say("That group does not exist! To view a list of groups, use !group list.");
				}
				else {
                $.setUserGroupByName(args[1], name);
                $.say("Group for " + $.username.resolve(args[1]) + " changed to " + $.getUserGroupName($.username.resolve(args[1])) + "!");
                $.logEvent("permissions.js", 200, username + " changed " + args[1] + "'s group to " + $.getUserGroupName($.username.resolve(args[1])));                
				}
            }
			else if (action.equalsIgnoreCase("qset")) {
				if( name.toLowerCase() != groupname.toLowerCase() ) {
					 $.say("That group does not exist! To view a list of groups, use !group list.");
				}
				else {               
                $.setUserGroupByName(args[1], name);
                $.logEvent("permissions.js", 200, username + " silently changed " + args[1] + "'s group to " + $.getUserGroupName($.username.resolve(args[1])));
				}
            }
        }
    }
    
    if (command.equalsIgnoreCase("group")) {
		var action = args[0];
        if (args.length >= 1) {
            username = args[0];

            if (!argsString.isEmpty() && action.equalsIgnoreCase("list") || args.length >= 2) {

            } else {
                $.say($.username.resolve(username) + " is currently in the " + $.getUserGroupName(username) + " group.");
            }

        } else {

            $.say($.username.resolve(sender) + ", you're in the " + $.getUserGroupName(username) + " group.");
        }
    }
    
    if (command.equalsIgnoreCase("group") && !argsString.isEmpty()) {
        if (!$.isAdmin(sender)) {
            $.say(username + ", " + $.getUserGroupName(username) + "s aren't allowed access to this command! Administrators only.");
            return;


        }
        
        if (args.length < 2) {
            if (args.length == 1 && args[0].equalsIgnoreCase("list")) {
                var ranks = "";
                
                for (i = 0; i < groups.length; i++) {
                    if (ranks.length > 0) {
                        ranks = ranks + " - ";
                    }
                    
                    ranks = ranks + i + " = " + groups[i];
                }
                
                $.say("Groups: " + ranks);
            } else {
                if (!argsString.isEmpty() && action.equalsIgnoreCase("list")) {
                    $.say("Usage: !group, !group <name>, !group set <name> <group>, !group list, !group name <id> <new name>");
                }
			}
        } 
        if (args.length >= 2 && action.equalsIgnoreCase("name")) {
            if (parseInt(args[0]) >= groups.length || parseInt(args[0]) < 0) {
                args[0] = 0;
            }
            
            if ($.getGroupNameById(parseInt(args[0])).equals("Administrators")) {
                allowed = false;
                
                for (i = 0; i < groups.length; i++) {
                    if (groups[i].equals("Administrators") && i != parseInt(args[0])) {
                        allowed = true;
                    }
                }
                
                if (!allowed) {
                    $.say("You cant change the name of the 'Administrator' group without first changing another group to 'Administrator'!");
                }
            }
            
            if ($.getGroupNameById(parseInt(args[0])).equals("Moderators")) {
                allowed = false;
                
                for (i = 0; i < groups.length; i++) {
                    if (groups[i].equals("Moderators") && i != parseInt(args[0])) {
                        allowed = true;
                    }
                }
                
                if (!allowed) {
                    $.say("You cant change the name of the 'Moderator' group without first changing another group to 'Moderator'!");
                }
            }
            
            if ($.getGroupNameById(parseInt(args[0])).equals("Casters")) {
                allowed = false;
                
                for (i = 0; i < groups.length; i++) {
                    if (groups[i].equals("Casters") && i != parseInt(args[0])) {
                        allowed = true;
                    }
                }
                
                if (!allowed) {
                    $.say("You cant change the name of the 'Caster' group without first changing another group to 'Caster'!");
                }
            }
            
            name = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            
            if ($.strlen(name) > 0 && allowed) {
                $.inidb.set("groups", args[0], name);
                
                var oldname = groups[parseInt(args[0])];
                groups[parseInt(args[0])] = name;
                
                $.logEvent("permissions.js", 282, username + " changed the name of the " + oldname + " group to " + name);
                
                $.say("Changed group '" + oldname + "' to '" + name + "'!")
            }
        }
    }

    if (command.equalsIgnoreCase("users")) {
        s = "Users in channel: ";
        
        for (i = 0; i < $.users.length; i++) {
            name = users[i][0];
            
            if (s.length > 18) {
                s += ", ";
            }
                
            s += name.toLowerCase();
        }
        
        $.say(s);
    }
    
    if (command.equalsIgnoreCase("mods")) {
        s = "Mods in channel: ";
        
        for (i = 0; i < $.users.length; i++) {
            name = users[i][0];
            
            if ($.isMod(name.toLowerCase())) {
                if (s.length > 17) {
                    s += ", ";
                }
                
                s += name.toLowerCase();
            }
        }
        
        $.say(s);
    }
    
    if (command.equalsIgnoreCase("admins")) {
        s = "Admins in channel: ";
        
        for (i = 0; i < $.users.length; i++) {
            name = users[i][0];
            
            if ($.isAdmin(name.toLowerCase())) {
                if (s.length > 19) {
                    s += ", ";
                }
                
                s += name.toLowerCase();
            }
        }
        
        $.say(s);
    }
});

$.on('ircChannelMessage', function(event) {
    var sender = event.getSender().toLowerCase();
    var found = false;
    
    for (var i = 0; i < $.users.length; i++) {
        if ($.users[i][0].equalsIgnoreCase(sender)) {
            $.users[i][1] = System.currentTimeMillis();
            found = true;
            break;
        }
    }
        
    if (!found) {
        $.users.push(new Array(sender, System.currentTimeMillis()));
    }
});

$.on('ircJoinComplete', function(event) {
    var channel = event.getChannel();
    var it = channel.getNicks().iterator();
    var name;
    var found = false;
    
    $.lastjoinpart = System.currentTimeMillis();
    
    while(it.hasNext() == true) {
        name = it.next();
        
        for (var i = 0; i < $.users.length; i++) {
            if ($.users[i][0].equalsIgnoreCase(name)) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            $.users.push(new Array(name, System.currentTimeMillis()));
        }
    }
});

$.on('ircChannelJoin', function(event) {
    var username = event.getUser().toLowerCase();
    var found = false;
    
    $.lastjoinpart = System.currentTimeMillis();
    
    for (var i = 0; i < $.users.length; i++) {
        if ($.users[i][0].equalsIgnoreCase(username)) {
            found = true;
            break;
        }
    }
        
    if (!found) {
        $.users.push(new Array(username, System.currentTimeMillis()));
    }
});

$.on('ircChannelLeave', function(event) {
    var username = event.getUser().toLowerCase();
    var i;
    var found = false;
    
    $.lastjoinpart = System.currentTimeMillis();
    
    for (i = 0; i < $.modeOUsers.length; i++) {
        if ($.modeOUsers[i].equalsIgnoreCase(username)) {
            $.modeOUsers.splice(i, 1);
            break;
        }
    }
    
    for (i = 0; i < $.users.length; i++) {
        if ($.users[i][0].equalsIgnoreCase(username)) {
            $.users.splice(i, 1);
            break;
        }
    }
});

$.on('ircChannelUserMode', function(event) {
    if (event.getMode().equalsIgnoreCase("o")) {
        if (event.getAdd()) {
            if (!$.array.contains($.modeOUsers, event.getUser().toLowerCase())) {
                $.modeOUsers.push(event.getUser().toLowerCase());
                if ($.array.contains($.modeOUsers, event.getUser().toLowerCase())) {
                    $.inidb.set('group', event.getUser().toLowerCase(), 6);
                    println("Moderator: " + event.getUser().toLowerCase());
                }

                if ($.array.contains($.modeOUsers, $.botowner.toLowerCase())) {
                    $.inidb.set('group', $.botowner.toLowerCase(), 8);
                }
            }
        } else {
            for (var i = 0; i < $.modeOUsers.length; i++) {
                if ($.modeOUsers[i].equalsIgnoreCase(event.getUser().toLowerCase())) {
                    $.modeOUsers.splice(i, 1);
                    break;
                }
            }
        }
    }
});

$.on('ircPrivateMessage', function(event) {
    if (event.getSender().equalsIgnoreCase("jtv")) {
        var message = event.getMessage().toLowerCase();
        var spl;
        var i;

        if (message.startsWith("the moderators of this channel are: ")) {
            spl = message.substring(33).split(", ");
            
            $.modListUsers.splice(0, $.modListUsers.length);
            
            for (i = 0; i < spl.length; i++) {
                $.modListUsers.push(spl[i].toLowerCase());
            }

            $.saveArray(spl, "mods.txt", false);
        } else if (message.startsWith("specialuser")) {
            spl = message.split(" ");
            
            if (spl[2].equalsIgnoreCase("subscriber")) {
                for (i = 0; i < $.subUsers.length; i++) {
                    if ($.subUsers[i][0].equalsIgnoreCase(spl[1])) {
                        $.subUsers[i][1] = System.currentTimeMillis() + 10000;
                        return;
                    }
                }
                $.saveArray(spl, "mods.txt", false);
                $.subUsers.push(new Array(spl[1], System.currentTimeMillis() + 10000));
            }
        }
    }
});

$.timer.addTimer("./util/permissions.js", "modcheck", true, function() {
    $.say(".mods");
}, modcheckinterval);

$.timer.addTimer("./util/permissions.js", "usercheck", true, function() {
    var curtime = System.currentTimeMillis();
    
    if ($.lastjoinpart + usergonetime < curtime) {
        for (var i = 0; i < $.users.length; i++) {
            if ($.users[i][1] + usergonetime < curtime) {
                $.users.splice(i, 1);
                i--;
            }
        }
    }
    
    for (var b = 0; b < $.subUsers.length; b++) {
        if ($.subUsers[b][1] < curtime) {
            $.subUsers.splice(b, 1);
            b--;
        }
    }
}, usercheckinterval);

$.registerChatCommand("./util/permissions.js", "group");
$.registerChatCommand("./util/permissions.js", "users");
$.registerChatCommand("./util/permissions.js", "mods");
$.registerChatCommand("./util/permissions.js", "admins");

$.setInterval(function() {
    if (!$.moduleEnabled("./systems/timeSystem.js")) {
        return;
    }

    for (var i = 0; i < $.users.length; i++) {
        var nick = $.users[i][0].toLowerCase();

        $.inidb.incr('time', nick, 60);

        if ($.rankup_time > 0) {
            if ($.hasGroupById(nick, 0) && parseInt($.inidb.get('time', nick) && $.inidb.get('followed', nick) == 1) == $.rankup_time * 3600) {
                $.setUserGroupById(nick, 1);
                $.say($.username.resolve(nick) + " has been promoted to a " + $.getGroupNameById(1) + "! Congratulations!");
            }
        }

    }
}, 1000 * 60);