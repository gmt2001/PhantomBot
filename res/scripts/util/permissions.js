var usergonetime = 10 * 60 * 1000;
var usercheckinterval = 3 * 60 * 1000;
var modcheckinterval = 10 * 60 * 1000;

$.isBot = function (user) {
    return user.equalsIgnoreCase($.botname);
}

$.isOwner = function (user) {
    return user.equalsIgnoreCase($.botowner);
}

$.isCaster = function (user, channel) {
    return user.equalsIgnoreCase(channel.getName()) || $.isOwner(user) || $.isBot(user);
}

$.isAdmin = function (user, channel) {
    return $.getUserGroupId(user, channel) <= 1 || $.isCaster(user, channel);
}

$.isMod = function (user, tags, channel) {
    return $.getUserGroupId(user, channel) <= 2 || (tags != null && tags != "{}" && tags.get("user-type").equalsIgnoreCase("mod"))
            || $.hasModeO(user, channel) || $.hasModList(user, channel) || $.isAdmin(user, channel);
}

$.isSub = function (user, tags, channel) {
    return $.getUserGroupId(user, channel) <= 3 || (tags != null && tags != "{}" && tags.get("subscriber").equalsIgnoreCase("1"))
            || $.tempdb.GetBoolean("t_subs", channel.getName(), user);
}

$.isTurbo = function (user, tags) {
    return (tags != null && tags != "{}" && tags.get("turbo").equalsIgnoreCase("1")) || false;
}

$.isDonator = function (user, channel) {
    return $.getUserGroupId(user, channel) == 4;
}

$.isHoster = function (user, channel) {
    return $.getUserGroupId(user, channel) == 5 || $.isHostUser(user, channel);
}

$.isReg = function (user, channel) {
    return $.getUserGroupId(user, channel) <= 6 || $.isMod(user, null, channel);
}

$.hasModeO = function (user, channel) {
    return $.tempdb.GetBoolean("t_modeo", channel.getName(), user);
}

$.hasModList = function (user, channel) {
    return $.tempdb.GetBoolean("t_modlist", channel.getName(), user);
}

$.hasGroupById = function (user, channel, id) {
    return $.getUserGroupId(user, channel) >= id;
}

$.hasGroupByName = function (user, channel, name) {
    return $.hasGroupById(user, channel, $.getGroupIdByName(name, channel));
}

$.getUserGroupId = function (user, channel) {
    if (!$.inidb.Exists('group', channel.getName(), user.toLowerCase())) {
        return 7;
    }

    return $.inidb.GetInteger('group', channel.getName(), user.toLowerCase());
}

$.getUserGroupName = function (user, channel) {
    return $.getGroupNameById($.getUserGroupId(user, channel), channel);
}

$.setUserGroupById = function (user, channel, id) {
    $.inidb.SetInteger('group', channel.getName(), user.toLowerCase(), id);
}

$.setUserGroupByName = function (user, channel, name) {
    $.setUserGroupById(user, channel, $.getGroupIdByName(name, channel));
}

$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();

    if (!$.inidb.Exists("groups", channel.getName(), "0")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Caster", "0");
        $.inidb.SetString("groups", channel.getName(), "0", "Caster");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "1")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Administrator", "0");
        $.inidb.SetString("groups", channel.getName(), "1", "Administrator");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "2")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Moderator", "0");
        $.inidb.SetString("groups", channel.getName(), "0", "Moderator");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "3")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Subscriber", "0");
        $.inidb.SetString("groups", channel.getName(), "3", "Subscriber");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "4")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Donator", "0");
        $.inidb.SetString("groups", channel.getName(), "4", "Donator");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "5")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Hoster", "0");
        $.inidb.SetString("groups", channel.getName(), "5", "Hoster");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "6")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Regular", "0");
        $.inidb.SetString("groups", channel.getName(), "6", "Regular");
    }

    if (!$.inidb.Exists("groups", channel.getName(), "7")) {
        $.inidb.SetInteger("grouppoints", channel.getName(), "Viewer", "0");
        $.inidb.SetString("groups", channel.getName(), "7", "Viewer");
    }
});

$.getGroupNameById = function (id, channel) {
    return $.inidb.GetString('groups', channel.getName(), id);
}

$.getGroupIdByName = function (name, channel) {
    var keys = $.inidb.GetKeyList("groups", channel.getName());

    for (var i = 0; i < keys.length; i++) {
        if ($.inidb.GetString("groups", channel.getName(), keys[i]).equalsIgnoreCase(name)) {
            return i;
        }
    }

    return 7;
}

$.getGroupPointMultiplier = function (playername, channel) {
    return $.inidb.GetInteger("grouppoints", channel.getName(), $.getUserGroupName(playername, channel));
}

$.on('command', function (event) {
    var sender = event.getSender().toLowerCase();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var channel = event.getChannel();

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
            var groupid = $.getGroupIdByName(name, channel);
            var groupname = $.getGroupNameById(groupid, channel);

            if (!$.isMod(sender, channel, event.getTags())) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            if (action.equalsIgnoreCase("remove") || action.equalsIgnoreCase("delete")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }

                var keys = $.inidb.GetKeyList("group", channel.getName());
                for (var i = 0; i < keys.length; i++) {
                    if ($.inidb.GetString("group", channel.getName(), keys[i]) == $.getGroupIdByName(args[1].toLowerCase(), channel)) {
                        $.inidb.SetInteger("group", channel.getName(), keys[i], 7);
                    }
                }

                var keys2 = $.inidb.GetKeyList("grouppoints", channel.getName());
                for (var i = 0; i < keys2.length; i++) {
                    if (keys2[i].equalsIgnoreCase(args[1])) {
                        $.inidb.RemoveKey("grouppoints", channel.getName(), keys2[i]);
                    }
                }

                if ($.getGroupIdByName(args[1].toLowerCase(), channel) != null) {
                    $.inidb.RemoveKey("groups", channel.getName(), $.getGroupIdByName(args[1].toLowerCase(), channel));
                }

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-remove", channel, args[1]), channel);
                return;
            }

            if (action.equalsIgnoreCase("create")) {
                if (!$.isAdmin(sender, channel)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
                    return;
                }
                $.inidb.SetString("groups", channel.getName(), $.inidb.GetKeyList("groups", channel.getName()).length, args[1].toString());
                $.inidb.SetInteger("grouppoints", channel.getName(), args[1].toString(), 0);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-create", channel, args[1].toString()), channel);
                return;
            }

            if (action.equalsIgnoreCase("set") || action.equalsIgnoreCase("add") || action.equalsIgnoreCase("change")) {
                if (!name.equalsIgnoreCase(groupname)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-not-exists", channel), channel);
                }
                else {
                    if (($.getUserGroupId(sender, channel) < $.getUserGroupId(args[1], channel)) || sender.equalsIgnoreCase(args[1]))
                    {
                        if (($.getUserGroupId(sender, channel) < $.getGroupIdByName(name, channel)) || sender.equalsIgnoreCase(args[1]))
                        {
                            $.setUserGroupByName(args[1], channel, name);
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-set", channel, $.username.resolve(args[1]), $.getUserGroupName(args[1], channel)), channel);
                            $.logEvent("permissions.js", 200, channel, username + " changed " + args[1] + "'s group to " + $.getUserGroupName(args[1], channel));
                            return;
                        } else {
                            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-set-err-same", channel), channel);
                            return;
                        }
                    } else {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-set-err-above", channel), channel);
                        return;
                    }
                }
            }
            if (action.equalsIgnoreCase("points")) {
                name = args[1];
                groupid = $.getGroupIdByName(name, channel);
                groupname = $.getGroupNameById(groupid, channel);

                if (!name.equalsIgnoreCase(groupname)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-not-exists", channel), channel);
                    return;
                }
                if (parseInt(args[2]) <= -1) { // modified to accept !group points <group> 0 to default to !points gain <amount> - Kojitsari
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-points-err-less-than-zero", channel), channel);
                    return;
                } else {
                    $.inidb.SetInteger("grouppoints", channel.getName(), groupname, args[2]);
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-points-set", channel, groupname, args[2]), channel);
                }
            } else if (action.equalsIgnoreCase("qset")) {
                if (!name.equalsIgnoreCase(groupname)) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-not-exists", channel), channel);
                    return;
                }
                else {
                    $.setUserGroupByName(args[1], channel, name);
                    $.logEvent("permissions.js", 200, channel, username + " silently changed " + args[1] + "'s group to " + $.getUserGroupName(args[1], channel));
                    return;
                }
            }
        }
    }

    if (command.equalsIgnoreCase("group")) {
        if (args.length == 1) {
            username = args[0];

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-current-other", channel, $.username.resolve(username), $.getUserGroupName(username, channel)), channel);
            return;
        } else {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-current-self", channel, $.username.resolve(sender, event.getTags()), $.getUserGroupName(username, channel)), channel);
            return;
        }
    }

    if (command.equalsIgnoreCase("group") && !argsString.isEmpty()) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length < 2) {
            if (args.length == 1 && args[0].equalsIgnoreCase("list")) {
                var ranks = "";

                for (i = 0; i < $.inidb.GetKeyList("groups", channel.getName()).length; i++) {
                    if (ranks.length > 0) {
                        ranks = ranks + " - ";
                    }
                    ranks = ranks + i + " = " + $.getGroupNameById(i, channel);
                }

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-list", channel, ranks), channel);
            } else {
                if (!argsString.isEmpty() && action.equalsIgnoreCase("list")) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-usage", channel), channel);
                }
            }
        }
        if (args.length >= 2 && action.equalsIgnoreCase("name")) {
            if (parseInt(args[1]) >= $.inidb.GetKeyList("groups", channel.getName()).length || parseInt(args[1]) < 0) {
                args[1] = $.inidb.GetKeyList("groups", channel.getName()).length - 1;
            }

            if ($.getGroupNameById(parseInt(args[1]), channel).equals("Administrator")) {
                allowed = false;

                for (i = 0; i < $.inidb.GetKeyList("groups", channel.getName()).length; i++) {
                    if ($.inidb.GetString("groups", channel.getName(), i).equals("Administrator") && i != parseInt(args[1])) {
                        allowed = true;
                    }
                }

                if (!allowed) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-name-err-default", channel), channel);
                    return;
                }
            }

            if ($.getGroupNameById(parseInt(args[1]), channel).equals("Moderator")) {
                allowed = false;

                for (i = 0; i < $.inidb.GetKeyList("groups", channel.getName()).length; i++) {
                    if ($.inidb.GetString("groups", channel.getName(), i).equals("Moderator") && i != parseInt(args[1])) {
                        allowed = true;
                    }
                }

                if (!allowed) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-name-err-default", channel), channel);
                    return;
                }
            }

            if ($.getGroupNameById(parseInt(args[1]), channel).equals("Caster")) {
                allowed = false;

                for (i = 0; i < $.inidb.GetKeyList("groups", channel.getName()).length; i++) {
                    if ($.inidb.GetString("groups", channel.getName(), i).equals("Caster") && i != parseInt(args[1])) {
                        allowed = true;
                    }
                }

                if (!allowed) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-name-err-default", channel), channel);
                    return;
                }
            }

            if (parseInt(args[1]) <= 7) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-name-err-default", channel), channel);
                return;
            }


            var groupid;
            for (var i = 0; i < $.inidb.GetKeyList("groups", channel.getName()).length; i++) {
                if (args[1].equalsIgnoreCase($.getGroupNameById(args[i], channel))) {
                    groupid = $.getGroupIdByName(args[1], channel);
                } else {
                    groupid = args[1];
                }
            }

            name = args[2];

            if ($.strlen(name) > 0 && allowed) {
                var oldname = $.inidb.GetString("groups", channel.getName(), groupid);
                $.inidb.SetString("groups", channel.getName(), groupid, name);

                $.logEvent("permissions.js", 282, channel, username + " changed the name of the " + oldname + " group to " + name);

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.permissions.group-name", channel, oldname, name), channel);
                return;
            }
        }
    }

    if (command.equalsIgnoreCase("users")) {
        if (!$.isMod(sender, channel, event.getTags())) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
            return;
        }
        s = $.lang.get("net.phantombot.permissions.users", channel);

        var keys = $.tempdb.GetKeyList("t_users", channel.getName());
        for (i = 0; i < keys.length; i++) {
            name = keys[i];

            if (s.length > 18) {
                s += ", ";
            }

            s += name.toLowerCase();
        }

        $.say($.getWhisperString(sender, channel) + s, channel);
    }

    if (command.equalsIgnoreCase("mods")) {
        s = $.lang.get("net.phantombot.permissions.mods", channel);

        var keys = $.tempdb.GetKeyList("t_users", channel.getName());
        for (i = 0; i < keys.length; i++) {
            name = keys[i];

            if ($.isMod(name.toLowerCase(), null, channel)) {
                if (s.length > 17) {
                    s += ", ";
                }

                s += name.toLowerCase();
            }
        }

        $.say($.getWhisperString(sender, channel) + s, channel);
    }

    if (command.equalsIgnoreCase("admins")) {
        s = $.lang.get("net.phantombot.permissions.admins", channel);

        var keys = $.tempdb.GetKeyList("t_users", channel.getName());
        for (i = 0; i < keys.length; i++) {
            name = keys[i];

            if ($.isAdmin(name.toLowerCase(), channel)) {
                if (s.length > 19) {
                    s += ", ";
                }

                s += name.toLowerCase();
            }
        }

        $.say($.getWhisperString(sender, channel) + s, channel);
    }
});

$.on('ircChannelMessage', function (event) {
    var sender = event.getSender().toLowerCase();
    var channel = event.getChannel();

    $.tempdb.SetInteger("t_users", channel.getName(), sender, System.currentTimeMillis());
    if ($.isSub(event.getSender(), event.getTags(), channel)) {
        $.tempdb.SetInteger("t_subs", channel.getName(), sender, System.currentTimeMillis() + 10000);
    }
});

$.on('ircJoinComplete', function (event) {
    var channel = event.getChannel();
    var it = channel.getNicks().iterator();
    var name;

    while (it.hasNext()) {
        name = it.next();

        $.tempdb.SetInteger("t_users", channel.getName(), name, System.currentTimeMillis());
    }
});

$.on('ircChannelJoin', function (event) {
    var username = event.getUser().toLowerCase();
    var channel = event.getChannel();

    $.tempdb.SetInteger("t_users", channel.getName(), username, System.currentTimeMillis());
});

$.on('ircChannelLeave', function (event) {
    var username = event.getUser().toLowerCase();
    var channel = event.getChannel();

    $.tempdb.RemoveKey("t_users", channel.getName(), username);
    $.tempdb.RemoveKey("t_modeo", channel.getName(), username);
});

$.on('ircChannelUserMode', function (event) {
    var username = event.getUser().toLowerCase();
    var channel = event.getChannel();

    $.inidb.SetString('visited', channel, username, "visited");

    if (event.getMode().equalsIgnoreCase("o")) {
        if (event.getAdd() == true) {
            $.tempdb.SetBoolean("t_modeo", channel.getName(), username, true);
        } else {
            $.tempdb.RemoveKey("t_modeo", channel.getName(), username);
        }
    }
});

$.on('ircPrivateMessage', function (event) {
    if (event.getSender().equalsIgnoreCase("jtv")) {
        var message = event.getMessage().toLowerCase();
        var channel = event.getChannel();
        var spl;

        if (channel == null) {
            return;
        }

        if (message.startsWith("the moderators of this channel are: ")) {
            spl = message.substring(33).split(", ");

            $.tempdb.RemoveSection("t_modlist", channel.getName());

            for (i = 0; i < spl.length; i++) {
                $.tempdb.SetBoolean("t_modlist", channel.getName(), spl[i].toLowerCase(), true);
            }

            $.saveArray(spl, "mods.txt", false);
        } else if (message.startsWith("specialuser")) {
            spl = message.split(" ");

            if (spl[2].equalsIgnoreCase("subscriber")) {
                $.tempdb.SetInteger("t_subs", channel.getName(), spl[1].toLowerCase(), System.currentTimeMillis() + 10000);
            }
        }
    }
});

$.timer.addTimer("./util/permissions.js", "modcheck", true, function () {
    var channels = $.phantombot.getChannels();
    for (var i = 0; i < channels.size(); i++) {
        $.say(".mods", channels.get(i));
    }
}, modcheckinterval);

$.timer.addTimer("./util/permissions.js", "usercheck", true, function () {
    var curtime = System.currentTimeMillis();

    var channels = $.phantombot.getChannels();
    for (var i = 0; i < channels.size(); i++) {
        var keys = $.tempdb.GetKeyList("t_subs", channels.get(i).getName());
        for (var b = 0; b < keys.length; b++) {
            if ($.tempdb.GetInteger("t_subs", channels.get(i).getName(), keys[i]) < curtime) {
                $.tempdb.RemoveKey("t_subs", channels.get(i).getName(), keys[i]);
            }
        }
    }
}, usercheckinterval);

$.registerChatCommand("./util/permissions.js", "group");
$.registerChatCommand("./util/permissions.js", "users");
$.registerChatCommand("./util/permissions.js", "mods");
$.registerChatCommand("./util/permissions.js", "admins");
