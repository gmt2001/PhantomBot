var Objects = java.util.Objects;
var System = java.lang.System;
var out = Packages.com.gmt2001.Console.out;

var initscript = $script;

$.tostring = Objects.toString;
$.println = function(o) {
    out.println(tostring(o));
};

function isNumeric(num){
    return !isNaN(num);
}

var blackList = ["getClass", "equals", "notify", "class", "hashCode", "toString", "wait", "notifyAll"];
function isJavaProperty(property) {
    for(var i in blackList) {
        if(blackList[i] == property) {
            return true;
        }
    }
    
    return false;
}

function generateTrampoline(obj, name) {
    return function() {
        var args = [$script];
        for(var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        obj[name].apply(obj, args);
    };
}

for(var name in $api) {
    if(isJavaProperty(name)) continue;
    if(typeof $api[name] == "function") {
        $[name] = generateTrampoline($api, name);
    } else {
        $[name] = $api[name];
    }
}

$.connected = false;
$.modeo = false;

$api.on($script, 'ircJoinComplete', function(event) {
    $.connected = true;
    $.channel = event.getChannel();
});

$api.on($script, 'ircChannelUserMode', function(event) {
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

$.getModuleIndex = function(scriptFile) {
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

$.isModuleLoaded = function(scriptFile) {
    return $.getModuleIndex(scriptFile) != -1;
}

$.moduleEnabled = function(scriptFile) {
    var i = $.getModuleIndex(scriptFile);
    
    if (i == -1) {
        return false;
    }
    
    return modules[i][1];
}

$.getModule = function(scriptFile) {
    var i = $.getModuleIndex(scriptFile);
    
    if (i != -1) {
        return modules[i];
    }
    
    return null;
}

$.loadScript = function(scriptFile) {
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

$.loadScriptsRecursive = function(path) {
    if (path.substring($.strlen(path) - 1).equalsIgnoreCase("/")) {
        path = path.substring(0, $.strlen(path) - 1);
    }
    
    var list = $.findFiles("./scripts/" + path, "");
    var dirs = new Array();
    var i;
    
    for (i = 0; i < list.length; i++) {
        if (path.equalsIgnoreCase(".")) {
            if (list[i].equalsIgnoreCase("util") || list[i].equalsIgnoreCase("init.js")) {
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

$.timer.getTimerIndex = function(scriptFile, name, isInterval) {
    for (var i = 0; i < timers.length; i++) {
        if (timers[i][0].equalsIgnoreCase(scriptFile) && timers[i][1].equalsIgnoreCase(name) && timers[i][2] == isInterval) {
            return i;
        }
    }
    
    return -1;
}

$.timer.hasTimer = function(scriptFile, name, isInterval) {
    return $.timer.getTimerIndex(scriptFile, name, isInterval) != -1;
}

$.timer.addTimer = function(scriptFile, name, isInterval, handler, interval) {
    var i = $.timer.getTimerIndex(scriptFile, name, isInterval);
    
    if (i == -1) {
        timers.push(new Array(scriptFile, name, isInterval, null, null, null));
        i = $.timer.getTimerIndex(scriptFile, name, isInterval);
    }
    
    timers[i][3] = 0;
    timers[i][4] = handler;
    timers[i][5] = interval;
}

$.timer.clearTimer = function(scriptFile, name, isInterval) {
    var i = $.timer.getTimerIndex(scriptFile, name, isInterval);
    
    if (i != -1) {
        timers.splice(i, 1);
    }
}
$.setInterval = function(handler, interval) {
    var scriptFile = $script.getPath().replace("\\", "/").replace("./scripts/", "");
    
    $.timer.addTimer(scriptFile, "default", true, handler, interval);
}

$api.setInterval($script, function() {
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
    } catch(e) {
        $.logError("init.js", 302, "(timer.interval.remove) " + e);
    }
}, 1000);


$.hook.call = function(hook, arg, alwaysrun) {
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

$api.on($script, 'command', function(event) {
    var sender = event.getSender();
    if ($.inidb.exists('aliases', event.getCommand().toLowerCase())) {
        event.setCommand($.inidb.get('aliases', event.getCommand().toLowerCase()));
    }
    
    var command = event.getCommand();
    
    if ($.moduleEnabled("./systems/pointSystem.js") && !$.isMod(sender) && $.inidb.exists("pricecom", command.toLowerCase())) {
            if (parseInt($.inidb.get("points", sender)) < parseInt($.inidb.get("pricecom", command.toLowerCase()))) {
                $.say("That command costs " + $.inidb.get("pricecom", command.toLowerCase()) + " " + $.pointname + ", which you don't have.");
                return;
            } else {
                $.inidb.decr("points", sender, parseInt($.inidb.get("pricecom", command.toLowerCase())));
				$.println("[Paid]" + username + "s balance is now: " + $.inidb.get('points', sender) + " " + $.pointname + "");
            }
        }
    
    $.hook.call('command', event, false);
});

$api.on($script, 'consoleInput', function(event) {
    $.hook.call('consoleInput', event, true);
});

$api.on($script, 'twitchFollow', function(event) {
    $.hook.call('twitchFollow', event, true);
});

$api.on($script, 'twitchUnfollow', function(event) {
    $.hook.call('twitchUnfollow', event, true);
});

$api.on($script, 'twitchFollowsInitialized', function(event) {
    $.hook.call('twitchFollowsInitialized', event, true);
});

$api.on($script, 'twitchHosted', function(event) {
    $.hook.call('twitchHosted', event, true);
});

$api.on($script, 'twitchUnhosted', function(event) {
    $.hook.call('twitchUnhosted', event, true);
});

$api.on($script, 'twitchHostsInitialized', function(event) {
    $.hook.call('twitchHostsInitialized', event, true);
});

$api.on($script, 'twitchSubscribe', function(event) {
    $.hook.call('twitchSubscribe', event, true);
});

$api.on($script, 'twitchUnsubscribe', function(event) {
    $.hook.call('twitchUnsubscribe', event, true);
});

$api.on($script, 'twitchSubscribesInitialized', function(event) {
    $.hook.call('twitchSubscribesInitialized', event, true);
});

$api.on($script, 'ircChannelJoin', function(event) {
    $.hook.call('ircChannelJoin', event, true);
});

$api.on($script, 'ircChannelLeave', function(event) {
    $.hook.call('ircChannelLeave', event, true);
});

$api.on($script, 'ircChannelUserMode', function(event) {
    $.hook.call('ircChannelUserMode', event, true);
});

$api.on($script, 'ircConnectComplete', function(event) {
    $.hook.call('ircConnectComplete', event, true);
});

$api.on($script, 'ircJoinComplete', function(event) {
    $.hook.call('ircJoinComplete', event, true);
});

$api.on($script, 'ircPrivateMessage', function(event) {
    $.hook.call('ircPrivateMessage', event, false);
});

$api.on($script, 'ircChannelMessage', function(event) {
    if (event.getSender().equalsIgnoreCase("jtv") || event.getSender().equalsIgnoreCase("twitchnotify")) {
        $.hook.call('ircPrivateMessage', event, false);
    } else {
        $.hook.call('ircChannelMessage', event, false);
    }
});

$api.on($script, 'musicPlayerConnect', function(event) {
    $.hook.call('musicPlayerConnect', event, false);
});

$api.on($script, 'musicPlayerCurrentId', function(event) {
    $.hook.call('musicPlayerCurrentId', event, false);
});

$api.on($script, 'musicPlayerCurrentVolume', function(event) {
    $.hook.call('musicPlayerCurrentVolume', event, false);
});

$api.on($script, 'musicPlayerDisconnect', function(event) {
    $.hook.call('musicPlayerDisconnect', event, false);
});

$api.on($script, 'musicPlayerState', function(event) {
    $.hook.call('musicPlayerState', event, false);
});

$.botname = $.botName;
$.botowner = $.ownerName;

$.castermsg = "Only a Caster has access to that command!";
$.adminmsg = "Only a Administrator has access to that command!";
$.modmsg = "Only a Moderator has access to that command!";

$.loadScript('./util/misc.js');
$.loadScript('./util/commandList.js');
$.loadScript('./util/patternDetector.js');
$.loadScript('./util/fileSystem.js');

$.logEvent("init.js", 410, "Initializing...");

$.initialsettings_update = 1;
if ($.inidb.GetBoolean("init", "initialsettings", "loaded") == false
    || $.inidb.GetInteger("init", "initialsettings", "update") < $.initialsettings_update) {
    $.logEvent("init.js", 420, "Loading initial settings...");
    $.loadScript('./util/initialsettings.js');
}

$.upgrade_version = 7;
if ($.inidb.GetInteger("init", "upgrade", "version") < $.upgrade_version) {
    $.logEvent("init.js", 426, "Running upgrade from v" + $.inidb.GetInteger("init", "upgrade", "version") + " to v" + $.upgrade_version + "...");
    $.loadScript('./util/upgrade.js');
}

$.loadScript('./util/permissions.js');
$.loadScript('./util/chatModerator.js');

$.loadScriptsRecursive(".");

$api.on(initscript, 'ircChannelMessage', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var message = event.getMessage();

    println(username + ": " + message);
});

$api.on(initscript, 'command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var index;
    
    if (command.equalsIgnoreCase("setconnectedmessage")) {
        if (!$.isAdmin(sender)) {
            $.say("You must be an Administrator to use that command.");
            return;
        }
        
        $.logEvent("init.js", 457, username + " changed the connected message to: " + argsString);
        
        $.inidb.set('settings', 'connectedMessage', argsString);
        $.say("Connected message set!");
    }
    
    if (command.equalsIgnoreCase("reconnect")) {
        if (!$.isMod(sender)) {
            $.say("You must be a Moderator to use that command.");
            return;
        }
        
        $.logEvent("init.js", 469, username + " requested a reconnect");
        
        $.connmgr.reconnectSession($.hostname);
        $.say("Reconnect scheduled!");
    }
    
    if (command.equalsIgnoreCase("module")) {
        if (!$.isAdmin(sender)) {
            $.say("You must be an Administrator to use that command.");
            return;
        }
        
        if (args.length == 0) {
            $.say("Usage: !module list, !module enable <module name>, !module disable <module name>, !module status <module name>");
        } else {
            if (args[0].equalsIgnoreCase("list")) {
                var lstr = "Modules: ";
                var first = true;
                var utils = 0;
                
                for (var n = 0; n < modules.length; n++) {
                    if (modules[n][0].indexOf("./util/") != -1) {
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
                        } else if (modules[i][0].indexOf("./util/") != -1) {
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
                            lstr += "enabled";
                        } else {
                            lstr += "disabled";
                        }
                    
                        lstr += ")";
                        first = false;
                    }
                
                    $.say(lstr);
                    
                    lstr = "> ";
                    first = true;
                }
            }
            
            if (args[0].equalsIgnoreCase("enable")) {
                if (args[1].indexOf("./util/") != -1) {
                    return;
                }
                
                index = $.getModuleIndex(args[1]);
                
                if (index == -1) {
                    $.say("That module does not exist or is not loaded!");
                } else {
                    $.logEvent("init.js", 545, username + " enabled module " + args[1]);
                    
                    modules[index][1] = true;
                    
                    $.inidb.set('modules', modules[index][0] + '_enabled', "1");
                    
                    $.say("Module enabled!");
                }
            }
            
            if (args[0].equalsIgnoreCase("disable")) {
                if (args[1].indexOf("./util/") != -1) {
                    return;
                }
                
                index = $.getModuleIndex(args[1]);
                
                if (index == -1) {
                    $.say("That module does not exist or is not loaded!");
                } else {
                    $.logEvent("init.js", 565, username + " disabled module " + args[1]);
                    
                    modules[index][1] = false;
                    
                    $.inidb.set('modules', modules[index][0] + '_enabled', "0");
                    
                    $.say("Module disabled!");
                }
            }
            
            if (args[0].equalsIgnoreCase("status") || args[0].equalsIgnoreCase("check")) {
                if (args[1].indexOf("./util/") != -1) {
                    return;
                }
                
                index = $.getModuleIndex(args[1]);
                
                if (index == -1) {
                    $.say("That module does not exist or is not loaded!");
                } else {
                    if (modules[index][1]) {
                        $.say("The module " + modules[index][0] + " is currently enabled!");
                    } else {
                        $.say("The module " + modules[index][0] + " is currently disabled!");
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