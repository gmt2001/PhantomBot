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

$.isCaster = function (user) {
    return $.getUserGroupId(user) == 0 || $.isOwner(user) || $.isBot(user);
}

$.isAdmin = function (user) {
    return $.getUserGroupId(user) <= 1 || $.isOwner(user) || $.isBot(user);
}

$.isMod = function (user) {
    return $.getUserGroupId(user) <= 2 || $.isOwner(user) || $.isBot(user);
}

$.isModv3 = function (user, tags) {
    return $.isAdmin(user) || (tags != null && tags != "{}" && tags.get("user-type").equalsIgnoreCase("mod")) || $.isMod(user);
}

$.isSub = function (user) {
    for (var i = 0; i < $.subUsers.length; i++) {
        if ($.subUsers[i][0].equalsIgnoreCase(user)) {
            return true;
        }
    }

    return false;
}

$.isSubv3 = function (user, tags) {
    return (tags != null && tags != "{}" && tags.get("subscriber").equalsIgnoreCase("1")) || $.isSub(user);
}

$.isTurbo = function (user, tags) {
    return (tags != null && tags != "{}" && tags.get("turbo").equalsIgnoreCase("1")) || false;
}

$.isDonator = function (user) {
    return $.getUserGroupId(user) == 4;
}

$.isHoster = function (user) {
    return $.getUserGroupId(user) == 5;
}

$.isReg = function (user) {
    return $.getUserGroupId(user) <= 6 || $.isOwner(user) || $.isBot(user);
}

$.hasModeO = function (user) {
    return $.array.contains($.modeOUsers, user.toLowerCase());
}

$.hasModList = function (user) {
    return $.array.contains($.modListUsers, user.toLowerCase());
}

$.hasGroupById = function (user, id) {
    return $.getUserGroupId(user) >= id;
}

$.hasGroupByName = function (user, name) {
    return $.hasGroupById(user, $.getGroupIdByName(name));
}

$.getUserGroupId = function (user) {
    user = $.username.resolve(user);
    var group = $.inidb.get('group', user.toLowerCase());
    if (group == null)
        group = 7;
    else
        group = parseInt(group);
    return group;
}

$.getUserGroupName = function (user) {
    return $.getGroupNameById($.getUserGroupId(user));
}

$.setUserGroupById = function (user, id) {
    id = id.toString();
    user = $.username.resolve(user);
    $.inidb.set('group', user.toLowerCase(), id);
}

$.setUserGroupByName = function (user, name) {
    $.setUserGroupById(user, $.getGroupIdByName(name));
}

$.usergroups = new Array();
var keys = $.inidb.GetKeyList("groups", "");

for (var i = 0; i < keys.length; i++) {
    $.usergroups[parseInt(keys[i])] = $.inidb.get("groups", keys[i]);
}

if ($.usergroups[0] == undefined || $.usergroups[0] == null || $.usergroups[0] != "Caster") {
    $.usergroups[0] = "Caster";
    $.inidb.set("grouppoints", "Caster", "7");
    $.inidb.set("groups", "0", "Caster");
}

if ($.usergroups[1] == undefined || $.usergroups[1] == null || $.usergroups[1] != "Administrator") {
    $.usergroups[1] = "Administrator";
    $.inidb.set("grouppoints", "Administrator", "6");
    $.inidb.set("groups", "1", "Administrator");
}

if ($.usergroups[2] == undefined || $.usergroups[2] == null || $.usergroups[2] != "Moderator") {
    $.usergroups[2] = "Moderator";
    $.inidb.set("grouppoints", "Moderator", "5");
    $.inidb.set("groups", "2", "Moderator");
}

if ($.usergroups[3] == undefined || $.usergroups[3] == null || $.usergroups[3] != "Subscriber") {
    $.usergroups[3] = "Subscriber";
    $.inidb.set("grouppoints", "Subscriber", "4");
    $.inidb.set("groups", "3", "Subscriber");
}

if ($.usergroups[4] == undefined || $.usergroups[4] == null || $.usergroups[4] != "Donator") {
    $.usergroups[4] = "Donator";
    $.inidb.set("grouppoints", "Donator", "3");
    $.inidb.set("groups", "4", "Donator");
}

if ($.usergroups[5] == undefined || $.usergroups[5] == null || $.usergroups[5] != "Hoster") {
    $.usergroups[5] = "Hoster";
    $.inidb.set("grouppoints", "Hoster", "2");
    $.inidb.set("groups", "5", "Hoster");
}

if ($.usergroups[6] == undefined || $.usergroups[6] == null || $.usergroups[6] != "Regular") {
    $.usergroups[6] = "Regular";
    $.inidb.set("grouppoints", "Regular", "1");
    $.inidb.set("groups", "6", "Regular");
}

if ($.usergroups[7] == undefined || $.usergroups[7] == null || $.usergroups[7] != "Viewer") {
    $.usergroups[7] = "Viewer";
    $.inidb.set("grouppoints", "Viewer", "0");
    $.inidb.set("groups", "7", "Viewer");
}


$.getGroupNameById = function (id) {
    id = parseInt(id);
    var id2str = id.toString();

    if ($.inidb.get('groups', id2str) != null && $.inidb.get('groups', id2str) != "") {
        return $.inidb.get('groups', id2str);
    }
    return $.usergroups[7];
}

$.getGroupIdByName = function (name) {

    for (var i = 0; i < $.usergroups.length; i++) {
        if ($.usergroups[i].equalsIgnoreCase(name)) {
            return i;
        }
    }

    return 7;
}

$.reloadGroups = function () {
    $.usergroups = new Array();
    keys = $.inidb.GetKeyList("groups", "");
    for (var i = 0; i < keys.length; i++) {
        $.usergroups[parseInt(keys[i])] = $.inidb.get("groups", keys[i]);
    }
}

$.getGroupPointMultiplier = function (playername) {
    return parseInt($.inidb.get("grouppoints", $.getUserGroupName(playername)));
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
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


    if (args.length >= 2) {
        if (command.equalsIgnoreCase("group")) {
            var action = args[0];
            name = args[2];
            var groupid = $.getGroupIdByName(name);
            var groupname = $.getGroupNameById(groupid);

            if (!$.isModv3(sender, event.getTags())) {
                $.say($.modmsg);
                return;
            }

            if (action.equalsIgnoreCase("remove") || action.equalsIgnoreCase("delete")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }
                var keys = $.inidb.GetKeyList("group", "");
                for (var i = 0; i < keys.length; i++) {
                    if ($.inidb.get("group", keys[i]) == $.getGroupIdByName(args[1].toLowerCase())) {
                        $.inidb.set("group", keys[i], "7");
                    }
                }

                var keys2 = $.inidb.GetKeyList("grouppoints", "");
                for (var i = 0; i < keys2.length; i++) {
                    if (keys2[i].equalsIgnoreCase((args[1]))) {
                        $.inidb.del("grouppoints", keys2[i]);
                    }
                }

                if ($.getGroupIdByName(args[1].toLowerCase() != null)) {
                    $.inidb.del("groups", $.getGroupIdByName(args[1].toLowerCase()));
                }

                $.say($.lang.get("net.phantombot.permissions.group-remove", args[1]));
                //$.setUserGroupById(args[1], $.getGroupIdByName("Viewers"));
                //$.say("Group for " + $.username.resolve(args[1]) + " reset to " + $.getUserGroupName($.username.resolve(args[1])) + "!");
                //$.logEvent("permissions.js", 183, username + " reset " + args[1] + "'s group to " + $.getUserGroupName($.username.resolve(args[1])));
                return;
            }
            if (action.equalsIgnoreCase("create")) {
                if (!$.isAdmin(sender)) {
                    $.say($.adminmsg);
                    return;
                }
                $.inidb.set("groups", $.usergroups.length.toString(), args[1].toString());
                $.inidb.set("grouppoints", args[1].toString(), "0");
                $.reloadGroups();
                $.say($.lang.get("net.phantombot.permissions.group-create", args[1].toString()));
                return;
            }

            if (action.equalsIgnoreCase("set") || action.equalsIgnoreCase("add") || action.equalsIgnoreCase("change")) {
                if (name.toLowerCase() != groupname.toLowerCase()) {
                    $.say($.lang.get("net.phantombot.permissions.group-not-exists"));
                }
                else {
                    if ((parseInt($.getUserGroupId(sender)) < $.parseInt($.getUserGroupId($.username.resolve(args[1])))))
                    {
                        if ((parseInt($.getUserGroupId(sender)) < parseInt($.getGroupIdByName(name))))
                        {
                            $.setUserGroupByName(args[1], name);
                            $.say($.lang.get("net.phantombot.permissions.group-set", $.username.resolve(args[1]), $.getUserGroupName($.username.resolve(args[1]))));
                            $.logEvent("permissions.js", 200, username + " changed " + args[1] + "'s group to " + $.getUserGroupName($.username.resolve(args[1])));
                            return;
                        } else {
                            $.say($.lang.get("net.phantombot.permissions.group-set-err-same"));
                            return;
                        }
                    }
                    else {
                        $.say($.lang.get("net.phantombot.permissions.group-set-err-above"));
                        return;
                    }
                }
            }
            if (action.equalsIgnoreCase("points")) {
                name = args[1].toString();
                groupid = $.getGroupIdByName(name);
                groupname = $.getGroupNameById(groupid);

                if (name.toLowerCase() != groupname.toLowerCase()) {
                    $.say($.lang.get("net.phantombot.permissions.group-not-exists"));
                    return;
                }
                if (!parseInt(args[2]) || parseInt(args[2] < 0)) {
                    $.say($.lang.get("net.phantombot.permissions.group-points-err-zero"));
                    return;
                } else {
                    $.inidb.set("grouppoints", groupname, args[2].toString());
                    $.say($.lang.get("net.phantombot.permissions.group-points-set", groupname, args[2].toString()));
                }
            } else if (action.equalsIgnoreCase("qset")) {
                if (name.toLowerCase() != groupname.toLowerCase()) {
                    $.say($.lang.get("net.phantombot.permissions.group-not-exists"));
                    return;
                }
                else {
                    $.setUserGroupByName(args[1], name);
                    $.logEvent("permissions.js", 200, username + " silently changed " + args[1] + "'s group to " + $.getUserGroupName($.username.resolve(args[1])));
                    return;
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
                $.say($.lang.get("net.phantombot.permissions.group-current-other", $.username.resolve(username), $.getUserGroupName(username)));
                return;
            }

        } else {
            $.say($.lang.get("net.phantombot.permissions.group-current-self", $.username.resolve(sender, event.getTags()), $.getUserGroupName(username)));
            return;
        }
    }

    if (command.equalsIgnoreCase("group") && !argsString.isEmpty()) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;


        }

        if (args.length < 2) {
            if (args.length == 1 && args[0].equalsIgnoreCase("list")) {
                var ranks = "";

                for (i = 0; i < $.usergroups.length; i++) {
                    if (ranks.length > 0) {
                        ranks = ranks + " - ";
                    }
                    ranks = ranks + i + " = " + $.getGroupNameById(i);
                }

                $.say($.lang.get("net.phantombot.permissions.group-list", ranks));
            } else {
                if (!argsString.isEmpty() && action.equalsIgnoreCase("list")) {
                    $.say($.lang.get("net.phantombot.permissions.group-usage"));
                }
            }
        }
        if (args.length >= 2 && action.equalsIgnoreCase("name")) {
            if (parseInt(args[1]) >= $.usergroups.length || parseInt(args[1]) < 0) {
                args[1] = $.usergroups.length - 1;
            }

            if ($.getGroupNameById(parseInt(args[1])).equals("Administrator")) {
                allowed = false;

                for (i = 0; i < $.usergroups.length; i++) {
                    if ($.usergroups[i].equals("Administrator") && i != parseInt(args[1])) {
                        allowed = true;
                    }
                }

                if (!allowed) {
                    $.say($.lang.get("net.phantombot.permissions.group-name-err-default"));
                    return;
                }
            }

            if ($.getGroupNameById(parseInt(args[1])).equals("Moderator")) {
                allowed = false;

                for (i = 0; i < $.usergroups.length; i++) {
                    if ($.usergroups[i].equals("Moderator") && i != parseInt(args[1])) {
                        allowed = true;
                    }
                }

                if (!allowed) {
                    $.say($.lang.get("net.phantombot.permissions.group-name-err-default"));
                    return;
                }
            }

            if ($.getGroupNameById(parseInt(args[1])).equals("Caster")) {
                allowed = false;

                for (i = 0; i < $.usergroups.length; i++) {
                    if ($.usergroups[i].equals("Caster") && i != parseInt(args[1])) {
                        allowed = true;
                    }
                }

                if (!allowed) {
                    $.say($.lang.get("net.phantombot.permissions.group-name-err-default"));
                    return;
                }
            }

            if (parseInt(args[1]) <= 7) {
                $.say($.lang.get("net.phantombot.permissions.group-name-err-default"));
                return;
            }


            var groupid;
            for (var i = 0; i < $.usergroups.length; i++) {
                if (args[1].equalsIgnoreCase($.getGroupNameById(args[i]))) {
                    groupid = $.getGroupIdByName(args[1]).toString();
                } else {
                    groupid = args[1];
                }
            }


            name = args[2];

            if ($.strlen(name) > 0 && allowed) {

                $.inidb.set("groups", groupid, name);

                var oldname = $.usergroups[parseInt(groupid)];
                $.usergroups[parseInt(groupid)] = name;

                $.logEvent("permissions.js", 282, username + " changed the name of the " + oldname + " group to " + name);

                $.say($.lang.get("net.phantombot.permissions.group-name", oldname, name));
                return;

            }
        }
    }

    if (command.equalsIgnoreCase("users")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.modmsg);
            return;
        }
        s = $.lang.get("net.phantombot.permissions.users");

        for (i = 0; i < $.users.length; i++) {
            name = $.users[i][0];

            if (s.length > 18) {
                s += ", ";
            }

            s += name.toLowerCase();
        }

        $.say(s);
    }

    if (command.equalsIgnoreCase("mods")) {
        s = $.lang.get("net.phantombot.permissions.mods");

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
        s = $.lang.get("net.phantombot.permissions.admins");

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

$.on('ircChannelMessage', function (event) {
    var sender = event.getSender().toLowerCase();
    var found = false;

    for (var i = 0; i < $.users.length; i++) {
        if ($.users[i][0].equalsIgnoreCase(sender)) {
            $.users[i][1] = System.currentTimeMillis();
            found = true;
            if ($.isSubv3(event.getSender(), event.getTags()) == true && $.isAdmin(event.getSender()) == false && $.isModv3(event.getSender(), event.getTags()) == false) {
                if ($.inidb.get("group", sender) != "3") {
                    if ($.inidb.exists("group", sender)) {
                        $.inidb.set("tempsubgroup", sender, $.inidb.get("group", sender));
                    }
                    $.inidb.set("group", sender, "3");
                    $.inidb.set("subscribed", sender, "1");
                }
            }
            break;
        }
    }

    if (!found) {
        $.users.push(new Array(sender, System.currentTimeMillis()));
    }
});

$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();
    var it = channel.getNicks().iterator();
    var name;
    var found = false;

    $.lastjoinpart = System.currentTimeMillis();

    while (it.hasNext() == true) {
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

$.on('ircChannelJoin', function (event) {
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

$.on('ircChannelLeave', function (event) {
    var username = event.getUser().toLowerCase();
    var i;
    var found = false;

    $.lastjoinpart = System.currentTimeMillis();


    for (i = 0; i < $.users.length; i++) {
        if ($.users[i][0].equalsIgnoreCase(username)) {
            $.users.splice(i, 1);

            if ($.inidb.exists("subscribed", username) && $.isSub(username) == false) {
                $.inidb.del("subscribed", username);
                if ($.inidb.exists("tempsubgroup", username) && $.isAdmin(username) == false) {
                    $.inidb.set("group", username, $.inidb.get("tempsubgroup", username));
                }
                if ($.inidb.exists("group", username) == false && $.isAdmin(username) == false) {
                    $.inidb.set("group", username, 7);
                }
            }
            break;
        }
    }

    for (i = 0; i < $.modeOUsers.length; i++) {
        if ($.modeOUsers[i].equalsIgnoreCase(event.getUser().toLowerCase())) {
            $.modeOUsers.splice(i, 1);
            if ($.inidb.exists("subscribed", username) && $.isSub(username) == false) {
                $.inidb.del("subscribed", username);
                if ($.inidb.exists("tempsubgroup", username) && $.isAdmin(username) == false) {
                    $.inidb.set("group", username, $.inidb.get("tempsubgroup", username));
                }
                if ($.inidb.exists("group", username) == false && $.isAdmin(username) == false) {
                    $.inidb.set("group", username, 7);
                }
            }
            println("-Moderator: " + username);
        }
    }
});

$.on('ircChannelUserMode', function (event) {
    var username = event.getUser().toLowerCase();
    if (event.getMode().equalsIgnoreCase("o")) {
        if (event.getAdd() == true) {
            if ($.array.contains($.modeOUsers, username) == false) {
                $.modeOUsers.push(username);
                if ($.isAdmin(username) == true) {
                    $.inidb.set('group', username, 1);
                    println("Admin: " + username);
                }
                if ($.isAdmin(event.getUser()) == false) {
                    $.inidb.set('group', username, 2);
                    println("Moderator: " + username);
                }

                if ($.array.contains($.modeOUsers, $.botowner.toLowerCase())) {
                    $.inidb.set('group', $.botowner.toLowerCase(), 0);
                }
            }
        } else {
            for (i = 0; i < $.modeOUsers.length; i++) {
                if ($.modeOUsers[i].equalsIgnoreCase(username)) {
                    $.modeOUsers.splice(i, 1);

                    if ($.inidb.exists("subscribed", username) && $.isSub(username) == false) {
                        $.inidb.del("subscribed", username);
                        if ($.inidb.exists("tempsubgroup", username) && $.isAdmin(username) == false) {
                            $.inidb.set("group", username, $.inidb.get("tempsubgroup", username));
                        }
                        if ($.inidb.exists("group", username) == false && $.isAdmin(username) == false) {
                            $.inidb.set("group", username, 7);
                        }
                    }

                    println("-Moderator: " + event.getUser().toLowerCase());
                }
            }
        }
    }
});

$.on('ircPrivateMessage', function (event) {
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

$.timer.addTimer("./util/permissions.js", "modcheck", true, function () {
    $.say(".mods");
}, modcheckinterval);

$.timer.addTimer("./util/permissions.js", "usercheck", true, function () {
    var curtime = System.currentTimeMillis();

    /*if ($.lastjoinpart + usergonetime < curtime) {
     for (var i = 0; i < $.users.length; i++) {
     if ($.users[i][1] + usergonetime < curtime) {
     $.users.splice(i, 1);
     i--;
     }
     }
     }*/

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