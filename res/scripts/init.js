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


$api.on($script, 'ircJoinComplete', function (event) {
    $.tempdb.SetBoolean('t_state', event.getChannel().getName(), 'connected', true);
    $.firstrun = false;

    if ($.inidb.GetBoolean("init", event.getChannel().getName(), "initialsettings") == false) {
        $.firstrun = true;
        $.logEvent("init.js", 420, event.getChannel(), "Loading initial settings ...");
        $.loadScript('./util/initialsettings.js');
        $.initialsettings(event.getChannel());
    }

    if ($.firstrun) {
        $.inidb.SetInteger("init", event.getChannel().getName(), "version", parseInt($.upgrade_version));
        $.inidb.SaveAll(true);
    }

    if ($.inidb.GetInteger("init", event.getChannel().getName(), "version") < $.upgrade_version) {
        $.logEvent("init.js", 426, event.getChannel(), "Running upgrade from v" + $.inidb.GetInteger("init", event.getChannel().getName(), "version") + " to v" + $.upgrade_version + "...");
        $.loadScript('./util/upgrade.js');
        $.upgrade(event.getChannel());
    }
});

$api.on($script, 'ircChannelUserMode', function (event) {
    if ($.tempdb.GetBoolean('t_state', event.getChannel().getName(), 'connected')) {
        if ($.phantombot.getChannel(event.getChannel().getName()) != null) {
            if (event.getUser().equalsIgnoreCase($.botname) && event.getMode().equalsIgnoreCase("o")) {
                if (event.getAdd() == true) {
                    if (!$.tempdb.GetBoolean('t_state', event.getChannel().getName(), 'modeo')) {
                        var connectedMessage = $.inidb.GetString('settings', event.getChannel().getName(), 'connectedMessage');

                        if (connectedMessage != null && !connectedMessage.isEmpty()) {
                            $.say(connectedMessage, event.getChannel());
                        } else {
                            println("[" + event.getChannel().getName() + "] ready");
                        }
                    }

                    $.tempdb.SetBoolean('t_state', event.getChannel().getName(), 'modeo', true);
                } else {
                    $.tempdb.SetBoolean('t_state', event.getChannel().getName(), 'modeo', false);
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

$.moduleEnabled = function (scriptFile, channel) {
    var i = $.getModuleIndex(scriptFile);

    if (i == -1) {
        return false;
    }

    if (channel != null && $.inidb.Exists('modules', channel.getName(), scriptFile + '_enabled')) {
        return $.inidb.GetBoolean('modules', channel.getName(), scriptFile + '_enabled');
    }

    return modules[i][1];
}

$.setDefaultModuleEnabled = function (scriptFile, enabled) {
    var i = $.getModuleIndex(scriptFile);

    if (i >= 0) {
        modules[i][1] = enabled;
    }
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
        var enabled = true;

        modules.push(new Array(scriptFile, enabled, script));
    } catch (e) {
        if ($.isModuleLoaded("./util/misc.js")) {
            $.logError("init.js", 132, null, "(loadScriptForce, " + scriptFile + ") " + e);
        }
    }
}

$.loadScript = function (scriptFile) {
    if (!$.isModuleLoaded(scriptFile)) {
        try {
            var script = $api.loadScriptR($script, scriptFile);
            var enabled = true;

            modules.push(new Array(scriptFile, enabled, script));
        } catch (e) {
            if ($.isModuleLoaded("./util/misc.js")) {
                $.logError("init.js", 132, null, "(loadScript, " + scriptFile + ") " + e);
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

$.timer.addTimer = function (scriptFile, name, isInterval, handler, interval, param) {
    var i = $.timer.getTimerIndex(scriptFile, name, isInterval);

    if (i == -1) {
        timers.push(new Array(scriptFile, name, isInterval, null, null, null, null));
        i = $.timer.getTimerIndex(scriptFile, name, isInterval);
    }

    timers[i][3] = 0;
    timers[i][4] = handler;
    timers[i][5] = interval;
    timers[i][6] = param;
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
                    timers[i][4](timers[i][6]);
                } catch (e) {
                    $.logError("init.js", 279, null, "(timer.interval.exec, " + timers[i][1] + ", " + timers[i][0] + ") " + e);
                }

                try {
                    if (timers[i] != undefined && !timers[i][2]) {
                        toremove.push(timers[i]);
                    }
                } catch (e) {
                    if (e.indexOf("TypeError: Cannot read property \"2\" from undefined") == -1) {
                        $.logError("init.js", 288, null, "(timer.interval.markremove) " + e);
                    }
                }
            }
        }
    } catch (e) {
        $.logError("init.js", 294, null, "(timer.interval.loop) " + e);
    }

    try {
        for (var b = 0; b < toremove.length; b++) {
            $.timer.clearTimer(toremove[b][0], toremove[b][1], toremove[b][2]);
        }
    } catch (e) {
        $.logError("init.js", 302, null, "(timer.interval.remove) " + e);
    }
}, 1000);


$.hook.call = function (hook, event, alwaysrun) {
    for (var i = 0; i < hooks.length; i++) {
        if (hooks[i][1].equalsIgnoreCase(hook) && ($.moduleEnabled(hooks[i][0], event.getChannel()) || alwaysrun)) {
            try {
                hooks[i][2](event);
            } catch (e) {
                $.logError("init.js", 211, event.getChannel(), "(hook.call, " + hook + ", " + hooks[i][0] + ") " + e);
            }
        }
    }
}

$.permCom = function (user, command, channel) {
    command = command.toLowerCase();
    var keys = $.inidb.GetKeyList("permcom", channel.getName());
    var permGroupName = "";
    var userGroup = $.getUserGroupName(user.toLowerCase(), channel);
    var noPermission = $.lang.get("net.phantombot.cmd.noperm", event.getChannel(), userGroup, command);

    if ($.isAdmin(user, channel)) {
        return true;
    }

    if (keys == null || keys[0] == "" || keys[0] == null) {
        return true;
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].contains(command + "_recursive")) {
            permGroupName = $.inidb.GetString("permcom", channel.getName(), keys[i]);
            if (($.getGroupIdByName(userGroup.toLowerCase(), channel) <= $.getGroupIdByName(permGroupName, channel))) {
                return true;
            }
        }
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].equalsIgnoreCase(command)) {
            permGroupName = $.inidb.GetString("permcom", channel.getName(), keys[i]);
            if (permGroupName.contains(userGroup.toLowerCase())) {
                return true;
            }
        }
    }

    for (var i = 0; i < keys.length; i++) {
        if (keys[i].contains(command)) {
            $.say($.getWhisperString(user, channel) + noPermission, channel);
            return false;
        }
        if (!keys[i].contains(command) && (i == keys.length - 1)) {
            return true;
        }
    }


    $.say($.getWhisperString(user, channel) + noPermission, channel);
    return false;

};

$api.on($script, 'command', function (event) {
    var sender = event.getSender().toLowerCase();
    var origcommand = event.getCommand();

    if ($.strlen(origcommand) == 0) {
        return;
    }

    if ($.inidb.Exists('aliases', event.getChannel().getName(), event.getCommand().toLowerCase())) {
        event.setCommand($.inidb.GetString('aliases', event.getChannel().getName(), event.getCommand().toLowerCase()));
    }

    var command = event.getCommand();
    if ($.permCom(sender, command, event.getChannel()) == false) {
        return;
    }

    if ($.inidb.GetInteger("settings", event.getChannel().getName(), "coolcom") > 0
            || ($.inidb.Exists("coolcom", event.getChannel().getName(), command)
                    && $.inidb.GetInteger("coolcom", event.getChannel().getName(), command) > 0)) {
        var tgt = command;

        if ($.inidb.GetBoolean("settings", event.getChannel().getName(), "coolcomuser")) {
            tgt = sender;
        }

        if ($.tempdb.Exists('t_coolcom', event.getChannel().getName(), tgt)) {
            if ($.tempdb.GetInteger('t_coolcom', event.getChannel().getName(), tgt) >= System.currentTimeMillis() && !$.isMod(sender, event.getTags(), event.getChannel())) {
                $.println($.lang.get("net.phantombot.init.coolcom-cooldown", event.getChannel(), origcommand, sender));
                return;
            }
        }
    }

    if ($.moduleEnabled("./systems/pointSystem.js", event.getChannel()) && $.inidb.Exists("pricecom", event.getChannel().getName(), command.toLowerCase())) {
        if (!$.isMod(sender, event.getTags(), event.getChannel()) || $.inidb.GetBoolean("settings", event.getChannel().getName(), "pricecommod")) {
            if ($.inidb.GetInteger("points", event.getChannel().getName(), sender) < $.inidb.GetInteger("pricecom", event.getChannel().getName(), command.toLowerCase())) {
                $.say($.getWhisperString(sender, event.getChannel()) + $.lang.get("net.phantombot.cmd.needpoints", event.getChannel(), $.getPointsString($.inidb.GetInteger("pricecom", event.getChannel().getName(), command.toLowerCase()), event.getChannel())), event.getChannel());
                return;
            } else {
                if ($.inidb.GetInteget("pricecom", event.getChannel().getName(), command.toLowerCase()) > 0)
                {
                    $.inidb.SetInteger("points", event.getChannel().getName(), sender, $.inidb.GetInteger("points", event.getChannel().getName(), sender) - $.inidb.GetInteger("pricecom", event.getChannel().getName(), command.toLowerCase()));
                    $.println($.lang.get("net.phantombot.cmd.paid", event.getChannel(), sender, $.getPointsString($.inidb.GetInteger("pricecom", event.getChannel().getName(), command.toLowerCase()))));
                }
            }
        }
    }


    var cd = $.inidb.GetInteger("settings", event.getChannel().getName(), "coolcom");
    if ($.inidb.Exists("coolcom", event.getChannel().getName(), command)) {
        if ($.inidb.GetInteger("coolcom", event.getChannel().getName(), command) > 0) {
            cd = $.inidb.GetInteger("coolcom", event.getChannel().getName(), command);
        }
    }

    if (cd > 0) {
        var tgt = command;

        if ($.inidb.GetBoolean("settings", event.getChannel().getName(), "coolcomuser")) {
            tgt = sender;
        }

        $.tempdb.SetInteger('t_coolcom', event.getChannel().getName(), tgt, System.currentTimeMillis() + (cd * 1000));
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

$api.on($script, 'musicPlayerConnect', function (event) {
    $.hook.call('musicPlayerConnect', event, false);
});

$api.on($script, 'musicPlayerCurrentId', function (event) {
    $.hook.call('musicPlayerCurrentId', event, false);
});

$api.on($script, 'musicPlayerCurrentVolume', function (event) {
    $.hook.call('musicPlayerCurrentVolume', event, false);
});

$api.on($script, 'musicPlayerDisconnect', function (event) {
    $.hook.call('musicPlayerDisconnect', event, false);
});

$api.on($script, 'musicPlayerState', function (event) {
    $.hook.call('musicPlayerState', event, false);
});

$.loadScript('./util/misc.js');
$.loadScript('./util/commandList.js');
$.loadScript('./util/patternDetector.js');
$.loadScript('./util/fileSystem.js');
$.loadScript('./util/lang.js');

$.logEvent("init.js", 410, null, "Initializing...");

$.upgrade_version = 17;

$.loadScript('./util/whisperSystem.js');
$.loadScript('./util/permissions.js');
$.loadScript('./util/chatModerator.js');

$.loadScriptsRecursive(".");

$api.on(initscript, 'ircChannelMessage', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var message = event.getMessage();

    println("[" + event.getChannel().getName() + "] " + username + ": " + message);
});

$api.on(initscript, 'command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var channel = event.getChannel();
    var index;

    if (command.equalsIgnoreCase("setconnectedmessage")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        $.logEvent("init.js", 457, channel, username + " changed the connected message to: " + argsString);

        $.inidb.SetString('settings', channel.getName(), 'connectedMessage', argsString);
        $.say($.lang.get("net.phantombot.init.cmsgset", channel), channel);
    }

    if (command.equalsIgnoreCase("helpcoolcom")) {
        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom-help", channel), channel);
    }

    if (command.equalsIgnoreCase("coolcomuser")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }
        if ($.inidb.GetBoolean("settings", channel.getName(), "coolcomuser")) {
            $.inidb.SetBoolean("settings", channel.getName(), "coolcomuser", false);
            $.say($.lang.get("net.phantombot.init.coolcom-usermode-disable", channel), channel);
        } else {
            $.inidb.SetBoolean("settings", channel.getName(), "coolcomuser", true);
            $.say($.lang.get("net.phantombot.init.coolcom-usermode-enable", channel), channel);
        }
    }

    if (command.equalsIgnoreCase("coolcom")) {
        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom", channel, $.inidb.GetInteger("settings", channel.getName(), "coolcom")), channel);
        } else if (args.length > 1 && args[1].equalsIgnoreCase("get")) {
            if (!$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            if ($.inidb.Exists("coolcom", channel.getName(), args[0].toLowerCase())) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom-individual", channel, args[0], $.inidb.GetInteger("coolcom", channel.getName(), args[0].toLowerCase())), channel);
            } else {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom-individual-notset", channel, args[0], $.inidb.GetInteger("settings", channel.getName(), "coolcom")), channel);
            }
        } else if (args.length > 1 && !isNaN(args[1]) && parseInt(args[1]) >= -1) {
            if (!$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            if (!$.commandExists(args[0].toLowerCase(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.common.command-not-exists", channel, args[0]), channel);
                return;
            }

            if (parseInt(args[1]) == -1) {
                $.logEvent("init.js", 454, channel, username + " set the command cooldown for " + args[0] + " to use the global value");

                $.inidb.RemoveKey("coolcom", channel.getName(), args[0].toLowerCase());

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom-del-individual", channel, args[0], $.inidb.GetInteger("settings", channel.getName(), "coolcom")), channel);
            } else {
                $.logEvent("init.js", 455, channel, username + " changed the command cooldown for " + args[0] + " to " + args[1] + " seconds");

                $.inidb.SetInteger("coolcom", channel.getName(), args[0].toLowerCase(), args[1]);
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom-set-individual", channel, args[0], args[1]), channel);
            }
        } else if (!isNaN(args[0]) && parseInt(args[0]) >= 0) {
            if (!$.isMod(sender, event.getTags(), channel)) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.modonly", channel), channel);
                return;
            }

            $.logEvent("init.js", 460, channel, username + " changed the global command cooldown to " + args[0] + " seconds");

            $.inidb.SetInteger("settings", channel.getName(), "coolcom", args[0]);
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.coolcom-set", channel, args[0]), channel);
        }
    }

    if (command.equalsIgnoreCase("reconnect")) {
        if (!$.isCaster(sender, event.getTags(), channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.casteronly", channel), channel);
            return;
        }

        $.logEvent("init.js", 469, channel, username + " requested a reconnect");

        $.connmgr.reconnectSession($.hostname);

        var channels = $.phantombot.getChannels();
        for (var i = 0; i < channels.size(); i++) {
            $.say($.lang.get("net.phantombot.init.reconn", channels.get(i)), channels.get(i));
        }
    }

    if (command.equalsIgnoreCase("module")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);
            return;
        }

        if (args.length == 0) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-usage", channel), channel);
        } else {
            if (args[0].equalsIgnoreCase("list")) {
                var lstr = $.lang.get("net.phantombot.init.module-list", channel);
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

                        if ($.moduleEnabled(modules[i][0], channel)) {
                            lstr += $.lang.get("net.phantombot.common.enabled", channel);
                        } else {
                            lstr += $.lang.get("net.phantombot.common.disabled", channel);
                        }

                        lstr += ")";
                        first = false;
                    }

                    $.say($.getWhisperString(sender, channel) + lstr, channel);

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
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-not-exists", channel), channel);
                } else {
                    $.logEvent("init.js", 545, channel, username + " enabled module " + args[1]);

                    $.inidb.SetBoolean('modules', channel.getName(), modules[index][0] + '_enabled', true);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-enable", channel), channel);
                }
            }

            if (args[0].equalsIgnoreCase("disable")) {
                if (args[1].indexOf("./util/") != -1 || args[1].indexOf("./lang/") != -1) {
                    return;
                }

                index = $.getModuleIndex(args[1]);

                if (index == -1) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-not-exists", channel), channel);
                } else {
                    $.logEvent("init.js", 565, channel, username + " disabled module " + args[1]);

                    $.inidb.SetBoolean('modules', channel.getName(), modules[index][0] + '_enabled', false);

                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-disable", channel), channel);
                }
            }

            if (args[0].equalsIgnoreCase("status") || args[0].equalsIgnoreCase("check")) {
                if (args[1].indexOf("./util/") != -1 || args[1].indexOf("./lang/") != -1) {
                    return;
                }

                index = $.getModuleIndex(args[1]);

                if (index == -1) {
                    $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-not-exists", channel), channel);
                } else {
                    if ($.moduleEnabled(modules[index][0], channel)) {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-enabled", channel, modules[index][0]), channel);
                    } else {
                        $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.init.module-disabled", channel, modules[index][0]), channel);
                    }
                }
            }
        }
    }
});

$.logEvent("init.js", 596, null, "Bot Online");

$.registerChatCommand('./init.js', 'setconnectedmessage', 'admin');
$.registerChatCommand('./init.js', 'reconnect', 'caster');
$.registerChatCommand('./init.js', 'module', 'admin');
$.registerChatCommand('./init.js', 'coolcom', 'mod');
$.registerChatCommand('./init.js', 'helpcoolcom', 'mod');
