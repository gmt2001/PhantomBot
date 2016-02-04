var Objects = java.util.Objects;
var System = java.lang.System;
var out = Packages.com.gmt2001.Console.out;

var initscript = $script;

$.tostring = Objects.toString;
$.println = function (o) {
    out.println(tostring(o));
};

function isNumeric(num) {
    return !isNaN(num);
}

var blackList = ["getClass", "equals", "notify", "class", "hashCode", "toString", "wait", "notifyAll"];
function isJavaProperty(property) {
    for (var i in blackList) {
        if (blackList[i] == property) {
            return true;
        }
    }

    return false;
}

function generateTrampoline(obj, name) {
    return function () {
        var args = [$script];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        obj[name].apply(obj, args);
    };
}

for (var name in $api) {
    if (isJavaProperty(name))
        continue;
    if (typeof $api[name] == "function") {
        $[name] = generateTrampoline($api, name);
    } else {
        $[name] = $api[name];
    }
}

$.connected = false;
$.modeo = false;

$api.on($script, 'ircJoinComplete', function (event) {
    $.connected = true;
    $.channel = event.getChannel();
});

$api.on($script, 'ircChannelUserMode', function (event) {
    if ($.connected) {
        if (event.getChannel().getName().equalsIgnoreCase($.channel.getName())) {
            if (event.getUser().equalsIgnoreCase($.botname) && event.getMode().equalsIgnoreCase("o")) {
                if (event.getAdd() == true) {
                    if (!$.modeo) {
                        var connectedMessage = $.inidb.get('settings', 'connectedMessage');

                        if (connectedMessage != null && !connectedMessage.isEmpty()) {
                            $.say(connectedMessage);
                        } else {
                            println("ready");
                        }
                    }

                    $.modeo = true;
                } else {
                    $.modeo = false;
                }
            }
        }
    }
});

var modules = new Array();
var hooks = new Array();
var timers = new Array();

$.getModuleIndex = function (scriptFile) {
    for (var i = 0; i < modules.length; i++) {
        if (modules[i][0].equalsIgnoreCase(scriptFile)) {
            if (scriptFile.indexOf("./util/") != -1) {
                modules[i][1] = true;
            }

            return i;
        }
    }

    return -1;
}

$.isModuleLoaded = function (scriptFile) {
    return $.getModuleIndex(scriptFile) != -1;
}

$.moduleEnabled = function (scriptFile) {
    var i = $.getModuleIndex(scriptFile);

    if (i == -1) {
        return false;
    }

    return modules[i][1];
}

$.getModule = function (scriptFile) {
    var i = $.getModuleIndex(scriptFile);

    if (i != -1) {
        return modules[i];
    }

    return null;
}

$.loadScriptForce = function (scriptFile) {
    try {
        var script = $api.loadScriptR($script, scriptFile);
        var senabled = $.inidb.get('modules', scriptFile + '_enabled');
        var enabled = true;

        if (senabled) {
            enabled = senabled.equalsIgnoreCase("1");
        }

        modules.push(new Array(scriptFile, enabled, script));
    } catch (e) {
        if ($.isModuleLoaded("./util/misc.js")) {
            $.logError("init.js", 132, "(loadScriptForce, " + scriptFile + ") " + e);
        }
    }
}

$.loadScript = function (scriptFile) {
    if (!$.isModuleLoaded(scriptFile)) {
        try {
            var script = $api.loadScriptR($script, scriptFile);
            var senabled = $.inidb.get('modules', scriptFile + '_enabled');
            var enabled = true;

            if (senabled) {
                enabled = senabled.equalsIgnoreCase("1");
            }

            modules.push(new Array(scriptFile, enabled, script));
        } catch (e) {
            if ($.isModuleLoaded("./util/misc.js")) {
                $.logError("init.js", 132, "(loadScript, " + scriptFile + ") " + e);
            }
        }
    }
}

$.loadScriptsRecursive = function (path) {
    if (path.substring($.strlen(path) - 1).equalsIgnoreCase("/")) {
        path = path.substring(0, $.strlen(path) - 1);
    }

    var list = $.findFiles("./scripts/" + path, "");
    var dirs = new Array();
    var i;

    for (i = 0; i < list.length; i++) {
        if (path.equalsIgnoreCase(".")) {
            if (list[i].equalsIgnoreCase("util") || list[i].equalsIgnoreCase("lang") || list[i].equalsIgnoreCase("init.js")) {
                continue;
            }
        }

        if ($.isDirectory("./scripts/" + path + "/" + list[i])) {
            dirs.push(list[i]);
        } else {
            $.loadScript(path + "/" + list[i]);
        }
    }

    for (i = 0; i < dirs.length; i++) {
        $.loadScriptsRecursive(path + "/" + dirs[i]);
    }
}

$.hook = new Array();

$.hook.getHookIndex = function (scriptFile, hook) {
    for (var i = 0; i < hooks.length; i++) {
        if (hooks[i][0].equalsIgnoreCase(scriptFile) && hooks[i][1].equalsIgnoreCase(hook)) {
            return i;
        }
    }

    return -1;
}

$.hook.hasHook = function (scriptFile, hook) {
    return $.hook.getHookIndex(scriptFile, hook) != -1;
}

$.hook.add = function (hook, handler) {
    var scriptFile = $script.getPath().replace("\\", "/").replace("./scripts/", "");
    var i = $.hook.getHookIndex(scriptFile, hook);

    if (i == -1) {
        hooks.push(new Array(scriptFile, hook, null));
        i = $.hook.getHookIndex(scriptFile, hook);
    }

    hooks[i][2] = handler;
}

$.on = $.hook.add;

$.hook.remove = function (hook) {
    var scriptFile = $script.getPath().replace("\\", "/").replace("./scripts/", "");
    var i = $.hook.getHookIndex(scriptFile, hook);

    if (i != -1) {
        hooks.splice(i, 1);
    }
}

$.hook.call = function (hook, arg) {
    for (var i = 0; i < hooks.length; i++) {
        if (hooks[i][1].equalsIgnoreCase(hook) && $.moduleEnabled(hooks[i][0])) {
            hooks[i][2](arg);
        }
    }
}

$.timer = new Array();

$.timer.getTimerIndex = function (scriptFile, name, isInterval) {
    for (var i = 0; i < timers.length; i++) {
        if (timers[i][0].equalsIgnoreCase(scriptFile) && timers[i][1].equalsIgnoreCase(name) && timers[i][2] == isInterval) {
            return i;
        }
    }

    return -1;
}

$.timer.hasTimer = function (scriptFile, name, isInterval) {
    return $.timer.getTimerIndex(scriptFile, name, isInterval) != -1;
}

$.timer.addTimer = function (scriptFile, name, isInterval, handler, interval) {
    var i = $.timer.getTimerIndex(scriptFile, name, isInterval);

    if (i == -1) {
        timers.push(new Array(scriptFile, name, isInterval, null, null, null));
        i = $.timer.getTimerIndex(scriptFile, name, isInterval);
    }

    timers[i][3] = 0;
    timers[i][4] = handler;
    timers[i][5] = interval;
}

$.timer.clearTimer = function (scriptFile, name, isInterval) {
    var i = $.timer.getTimerIndex(scriptFile, name, isInterval);

    if (i != -1) {
        timers.splice(i, 1);
    }
}
$.setInterval = function (handler, interval) {
    var scriptFile = $script.getPath().replace("\\", "/").replace("./scripts/", "");

    $.timer.addTimer(scriptFile, "default", true, handler, interval);
}

$api.setInterval($script, function () {
    var toremove = new Array();

    try {
        for (var i = 0; i < timers.length; i++) {
            timers[i][3]++;

            if (timers[i][3] * 1000 >= timers[i][5]) {
                timers[i][3] = 0;

                try {
                    timers[i][4]();
                } catch (e) {
                    $.logError("init.js", 279, "(timer.interval.exec, " + timers[i][1] + ", " + timers[i][0] + ") " + e);
                }

                try {
                    if (timers[i] != undefined && !timers[i][2]) {
                        toremove.push(timers[i]);
                    }
                } catch (e) {
                    if (e.indexOf("TypeError: Cannot read property \"2\" from undefined") == -1) {
                        $.logError("init.js", 288, "(timer.interval.markremove) " + e);
                    }
                }
            }
        }
    } catch (e) {
        $.logError("init.js", 294, "(timer.interval.loop) " + e);
    }

    try {
        for (var b = 0; b < toremove.length; b++) {
            $.timer.clearTimer(toremove[b][0], toremove[b][1], toremove[b][2]);
        }
    } catch (e) {
        $.logError("init.js", 302, "(timer.interval.remove) " + e);
    }
}, 1000);


$.hook.call = function (hook, arg, alwaysrun) {
    for (var i = 0; i < hooks.length; i++) {
        if (hooks[i][1].equalsIgnoreCase(hook) && ($.moduleEnabled(hooks[i][0]) || alwaysrun)) {
            try {
                hooks[i][2](arg);
            } catch (e) {
                $.logError("init.js", 211, "(hook.call, " + hook + ", " + hooks[i][0] + ") " + e);
            }
        }
    }
}

$.permCom = function (user, command) {
    command = command.toLowerCase();
    var keys = $.inidb.GetKeyList("permcom", "");
    var permGroupName = "";
    var userGroup = $.getUserGroupName(user.toLowerCase());
    var noPermission = $.lang.get("net.phantombot.cmd.noperm", userGroup, command);

    if ($.isAdmin(user)) {
        return true;
    }

    if (keys == null || keys[0] == "" || keys[0] == null) {
        return true;
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].contains(command + "_recursive")) {
            permGroupName = $.inidb.get("permcom", keys[i]);
            if (($.getGroupIdByName(userGroup.toLowerCase()) <= $.getGroupIdByName(permGroupName))) {
                return true;
            }
        }
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].equalsIgnoreCase(command)) {
            permGroupName = $.inidb.get("permcom", keys[i]);
            if (permGroupName.contains(userGroup.toLowerCase())) {
                return true;
            }
        }
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].contains(command)) {
            $.say($.getWhisperString(user) + noPermission);
            return false;
        }
        if (!keys[i].contains(command) && (i == keys.length - 1)) {
            return true;
        }
    }


    $.say($.getWhisperString(user) + noPermission);
    return false;

};

var coolcom = new Array();

$api.on($script, 'command', function (event) {
    var sender = event.getSender().toLowerCase();
    var origcommand = event.getCommand();

    if ($.strlen(origcommand) == 0) {
        return;
    }

    if ($.inidb.exists('aliases', event.getCommand().toLowerCase())) {
        event.setCommand($.inidb.get('aliases', event.getCommand().toLowerCase()));
    }

    var command = event.getCommand();
    if ($.permCom(sender, command) == false) {
        return;
    }

    var idx = -1;
    if ($.inidb.exists("settings", "coolcomuser") && $.inidb.get("settings", "coolcomuser").equalsIgnoreCase("true")) {
        if ((!isNaN($.inidb.get("settings", "coolcom")) && parseInt($.inidb.get("settings", "coolcom")) > 0)
                || ($.inidb.exists("coolcom", command) && !isNaN($.inidb.get("coolcom", command)) && parseInt($.inidb.get("coolcom", command)) > 0)) {
            for (var i = 0; i < coolcom.length; i++) {
                if (coolcom[i][0].equalsIgnoreCase(sender)) {
                    idx = i;
                    if (coolcom[i][1] >= System.currentTimeMillis() && !$.isModv3(sender, event.getTags())) {
                        $.println($.lang.get("net.phantombot.init.coolcom-cooldown", origcommand, sender));
                        return;
                    }
                    break;
                }
            }
        }
    } else {
        if ((!isNaN($.inidb.get("settings", "coolcom")) && parseInt($.inidb.get("settings", "coolcom")) > 0)
                || ($.inidb.exists("coolcom", command) && !isNaN($.inidb.get("coolcom", command)) && parseInt($.inidb.get("coolcom", command)) > 0)) {
            for (var i = 0; i < coolcom.length; i++) {
                if (coolcom[i][0].equalsIgnoreCase(command)) {
                    idx = i;
                    if (coolcom[i][1] >= System.currentTimeMillis() && !$.isModv3(sender, event.getTags())) {
                        $.println($.lang.get("net.phantombot.init.coolcom-cooldown", origcommand, sender));
                        return;
                    }
                    break;
                }
            }
        }
    }

    if ($.moduleEnabled("./systems/pointSystem.js") && $.inidb.exists("pricecom", command.toLowerCase())) {
        if (!$.isModv3(sender, event.getTags()) || ($.inidb.exists("settings", "pricecommod") && $.inidb.get("settings", "pricecommod").equalsIgnoreCase("true"))) {
            if (parseInt($.inidb.get("points", sender)) < parseInt($.inidb.get("pricecom", command.toLowerCase()))) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.needpoints", $.getPointsString(parseInt($.inidb.get("pricecom", command.toLowerCase())))));
                return;
            } else {
                if (parseInt($.inidb.get("pricecom", command.toLowerCase())) > 0)
                {
                    $.inidb.decr("points", sender, parseInt($.inidb.get("pricecom", command.toLowerCase())));
                    $.println($.lang.get("net.phantombot.cmd.paid", sender, $.getPointsString(parseInt($.inidb.get("pricecom", command.toLowerCase())))));
                }
            }
        }
    }

    if ($.inidb.exists("coolcom", command) && !isNaN($.inidb.get("coolcom", command))) {
        if (parseInt($.inidb.get("coolcom", command)) > 0) {
            if (idx >= 0) {
                coolcom[idx][1] = System.currentTimeMillis() + (parseInt($.inidb.get("coolcom", command)) * 1000);
            } else if ($.inidb.exists("settings", "coolcomuser") && $.inidb.get("settings", "coolcomuser").equalsIgnoreCase("true")) {
                coolcom.push(new Array(sender, System.currentTimeMillis() + (parseInt($.inidb.get("coolcom", command)) * 1000)));
            } else {
                coolcom.push(new Array(command, System.currentTimeMillis() + (parseInt($.inidb.get("coolcom", command)) * 1000)));
            }
        }
    } else if (!isNaN($.inidb.get("settings", "coolcom")) && parseInt($.inidb.get("settings", "coolcom")) > 0) {
        if (idx >= 0) {
            coolcom[idx][1] = System.currentTimeMillis() + (parseInt($.inidb.get("settings", "coolcom")) * 1000);
        } else if ($.inidb.exists("settings", "coolcomuser") && $.inidb.get("settings", "coolcomuser").equalsIgnoreCase("true")) {
            coolcom.push(new Array(sender, System.currentTimeMillis() + (parseInt($.inidb.get("settings", "coolcom")) * 1000)));
        } else {
            coolcom.push(new Array(command, System.currentTimeMillis() + (parseInt($.inidb.get("settings", "coolcom")) * 1000)));
        }
    }

    $.hook.call('command', event, false);
});

$api.on($script, 'consoleInput', function (event) {
    $.hook.call('consoleInput', event, true);
});

$api.on($script, 'twitchFollow', function (event) {
    $.hook.call('twitchFollow', event, true);
});

$api.on($script, 'twitchUnfollow', function (event) {
    $.hook.call('twitchUnfollow', event, true);
});

$api.on($script, 'twitchFollowsInitialized', function (event) {
    $.hook.call('twitchFollowsInitialized', event, true);
});

$api.on($script, 'twitchHosted', function (event) {
    $.hook.call('twitchHosted', event, true);
});

$api.on($script, 'twitchUnhosted', function (event) {
    $.hook.call('twitchUnhosted', event, true);
});

$api.on($script, 'twitchHostsInitialized', function (event) {
    $.hook.call('twitchHostsInitialized', event, true);
});

$api.on($script, 'twitchSubscribe', function (event) {
    $.hook.call('twitchSubscribe', event, true);
});

$api.on($script, 'twitchUnsubscribe', function (event) {
    $.hook.call('twitchUnsubscribe', event, true);
});

$api.on($script, 'twitchSubscribesInitialized', function (event) {
    $.hook.call('twitchSubscribesInitialized', event, true);
});

$api.on($script, 'ircChannelJoin', function (event) {
    $.hook.call('ircChannelJoin', event, true);
});

$api.on($script, 'ircChannelLeave', function (event) {
    $.hook.call('ircChannelLeave', event, true);
});

$api.on($script, 'ircChannelUserMode', function (event) {
    $.hook.call('ircChannelUserMode', event, true);
});

$api.on($script, 'ircConnectComplete', function (event) {
    $.hook.call('ircConnectComplete', event, true);
});

$api.on($script, 'ircJoinComplete', function (event) {
    $.hook.call('ircJoinComplete', event, true);
});

$api.on($script, 'ircPrivateMessage', function (event) {
    $.hook.call('ircPrivateMessage', event, false);
});

$api.on($script, 'ircChannelMessage', function (event) {
    if (event.getSender().equalsIgnoreCase("jtv") || event.getSender().equalsIgnoreCase("twitchnotify")) {
        $.hook.call('ircPrivateMessage', event, false);
    } else {
        $.hook.call('ircChannelMessage', event, false);
    }
});

$.botname = $.botName;
$.botowner = $.ownerName;

$.castermsg = "Only a Caster has access to that command!";
$.adminmsg = "Only an Administrator has access to that command!";
$.modmsg = "Only a Moderator has access to that command!";


if ($.inidb.FileExists("timezone") && $.inidb.get("timezone", "timezone") != undefined
        && $.inidb.get("timezone", "timezone") != null) {
    $.timezone = $.inidb.get("timezone", "timezone");
} else {
    $.inidb.set("timezone", "timezone", "America/New_York");
    $.timezone = $.inidb.get("timezone", "timezone");
}

$.loadScript('./util/misc.js');
$.loadScript('./util/commandList.js');
$.loadScript('./util/patternDetector.js');
$.loadScript('./util/fileSystem.js');
$.loadScript('./util/lang.js');

$.castermsg = $.lang.get("net.phantombot.cmd.casteronly");
$.adminmsg = $.lang.get("net.phantombot.cmd.adminonly");
$.modmsg = $.lang.get("net.phantombot.cmd.modonly");

$.logEvent("init.js", 410, "Initializing...");

$.firstrun = false;

if ($.inidb.GetBoolean("init", "initialsettings", "loaded") == false) {
    $.firstrun = true;
    $.logEvent("init.js", 420, "Loading initial settings...");
    $.loadScript('./util/initialsettings.js');
}

$.upgrade_version = 17;

if ($.firstrun) {
    $.inidb.SetInteger("init", "upgrade", "version", parseInt($.upgrade_version));
    $.inidb.SaveAll(true);
}

if ($.inidb.GetInteger("init", "upgrade", "version") < $.upgrade_version) {
    $.logEvent("init.js", 426, "Running upgrade from v" + $.inidb.GetInteger("init", "upgrade", "version") + " to v" + $.upgrade_version + "...");
    $.loadScript('./util/upgrade.js');
}

$.loadScript('./util/whisperSystem.js');
$.loadScript('./util/permissions.js');
$.loadScript('./util/chatModerator.js');

$.loadScriptsRecursive(".");

$api.on(initscript, 'ircChannelMessage', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var message = event.getMessage();

    println(username + ": " + message);
});

$api.on(initscript, 'command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var index;

    if (command.equalsIgnoreCase("setconnectedmessage")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        $.logEvent("init.js", 457, username + " changed the connected message to: " + argsString);

        $.inidb.set('settings', 'connectedMessage', argsString);
        $.say($.lang.get("net.phantombot.init.cmsgset"));
    }

    if (command.equalsIgnoreCase("helpcoolcom")) {
        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom-help"));
    }

    if (command.equalsIgnoreCase("coolcomuser")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }
        if ($.inidb.exists("settings", "coolcomuser") && $.inidb.get("settings", "coolcomuser").equalsIgnoreCase("true")) {
            $.inidb.set("settings", "coolcomuser", "false");
            $.say("cooldown will no longer be only on users, it will be on everyone.");
        } else {
            $.inidb.set("settings", "coolcomuser", "true");
            $.say("cooldown will now be on users, and not everyone.");
        }
    }

    if (command.equalsIgnoreCase("coolcom")) {
        if (args.length == 0) {
            var coolcomtime = 0;

            if ($.inidb.exists("settings", "coolcom") && !isNaN($.inidb.get("settings", "coolcom"))) {
                coolcomtime = $.inidb.get("settings", "coolcom");
            }

            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom", coolcomtime));
        } else if (args.length > 1 && args[1].equalsIgnoreCase("get")) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            var coolcomtime = 0;

            if ($.inidb.exists("settings", "coolcom") && !isNaN($.inidb.get("settings", "coolcom"))) {
                coolcomtime = $.inidb.get("settings", "coolcom");
            }

            if ($.inidb.exists("coolcom", args[0].toLowerCase()) && !isNaN("coolcom", args[0].toLowerCase())) {
                coolcomtime = $.inidb.get("coolcom", args[0].toLowerCase());

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom-individual", args[0], coolcomtime));
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom-individual-notset", args[0], coolcomtime));
            }
        } else if (args.length > 1 && !isNaN(args[1]) && parseInt(args[1]) >= -1) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            if (!$.commandExists(args[0].toLowerCase())) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.common.command-not-exists", args[0]));
                return;
            }

            if (parseInt(args[1]) == -1) {
                $.logEvent("init.js", 454, username + " set the command cooldown for " + args[0] + " to use the global value");

                $.inidb.del("coolcom", args[0].toLowerCase());

                var coolcomtime = 0;

                if ($.inidb.exists("settings", "coolcom") && !isNaN($.inidb.get("settings", "coolcom"))) {
                    coolcomtime = $.inidb.get("settings", "coolcom");
                }

                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom-del-individual", args[0], coolcomtime));
            } else {
                $.logEvent("init.js", 455, username + " changed the command cooldown for " + args[0] + " to " + args[1] + " seconds");

                $.inidb.set("coolcom", args[0].toLowerCase(), args[1]);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom-set-individual", args[0], args[1]));
            }
        } else if (!isNaN(args[0]) && parseInt(args[0]) >= 0) {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.modmsg);
                return;
            }

            $.logEvent("init.js", 460, username + " changed the global command cooldown to " + args[0] + " seconds");

            $.inidb.set("settings", "coolcom", args[0]);
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.coolcom-set", args[0]));
        }
    }

    if (command.equalsIgnoreCase("reconnect")) {
        if (!$.isModv3(sender, event.getTags())) {
            $.say($.getWhisperString(sender) + $.modmsg);
            return;
        }

        $.logEvent("init.js", 469, username + " requested a reconnect");

        $.connmgr.reconnectSession($.hostname);
        $.say($.lang.get("net.phantombot.init.reconn"));
    }

    if (command.equalsIgnoreCase("module")) {
        if (!$.isAdmin(sender)) {
            $.say($.getWhisperString(sender) + $.adminmsg);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-usage"));
        } else {
            if (args[0].equalsIgnoreCase("list")) {
                var lstr = $.lang.get("net.phantombot.init.module-list");
                var first = true;
                var utils = 0;

                for (var n = 0; n < modules.length; n++) {
                    if (modules[n][0].indexOf("./util/") != -1 || modules[n][0].indexOf("./lang/") != -1) {
                        utils++;
                    }
                }

                var num = Math.ceil((modules.length - utils) / 10.0);

                var offset = 0;

                for (var b = 0; b < num; b++) {
                    n = 0;

                    for (var i = (b * 10) + offset; n < 10; i++) {
                        if (i >= modules.length) {
                            break;
                        } else if (modules[i][0].indexOf("./util/") != -1 || modules[i][0].indexOf("./lang/") != -1) {
                            offset++;
                            continue;
                        } else {
                            n++;
                        }

                        if (!first) {
                            lstr += " - ";
                        }

                        lstr += modules[i][0] + " (";

                        if (modules[i][1]) {
                            lstr += $.lang.get("net.phantombot.common.enabled");
                        } else {
                            lstr += $.lang.get("net.phantombot.common.disabled");
                        }

                        lstr += ")";
                        first = false;
                    }

                    $.say($.getWhisperString(sender) + lstr);

                    lstr = "> ";
                    first = true;
                }
            }

            if (args[0].equalsIgnoreCase("enable")) {
                if (args[1].indexOf("./util/") != -1 || args[1].indexOf("./lang/") != -1) {
                    return;
                }

                index = $.getModuleIndex(args[1]);

                if (index == -1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-not-exists"));
                } else {
                    $.logEvent("init.js", 545, username + " enabled module " + args[1]);

                    modules[index][1] = true;

                    $.inidb.set('modules', modules[index][0] + '_enabled', "1");

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-enable"));
                }
            }

            if (args[0].equalsIgnoreCase("disable")) {
                if (args[1].indexOf("./util/") != -1 || args[1].indexOf("./lang/") != -1) {
                    return;
                }

                index = $.getModuleIndex(args[1]);

                if (index == -1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-not-exists"));
                } else {
                    $.logEvent("init.js", 565, username + " disabled module " + args[1]);

                    modules[index][1] = false;

                    $.inidb.set('modules', modules[index][0] + '_enabled', "0");

                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-disable"));
                }
            }

            if (args[0].equalsIgnoreCase("status") || args[0].equalsIgnoreCase("check")) {
                if (args[1].indexOf("./util/") != -1 || args[1].indexOf("./lang/") != -1) {
                    return;
                }

                index = $.getModuleIndex(args[1]);

                if (index == -1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-not-exists"));
                } else {
                    if (modules[index][1]) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-enabled", modules[index][0]));
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.init.module-disabled", modules[index][0]));
                    }
                }
            }
        }
    }
});

$.logEvent("init.js", 596, "Bot Online");

$.registerChatCommand('./init.js', 'setconnectedmessage', 'admin');
$.registerChatCommand('./init.js', 'reconnect', 'mod');
$.registerChatCommand('./init.js', 'module', 'admin');
$.registerChatCommand('./init.js', 'coolcom', 'mod');
$.registerChatCommand('./init.js', 'helpcoolcom', 'mod');
