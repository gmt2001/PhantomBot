$.econNameFormat = function (name, singular) {
    regex = /.\w[^aeiou]+y$/i;
    
    if (name === undefined) {
        name = "";
    }

    if (!singular) {
        if (regex.test(name)) {
            name = name.substring(0, $.strlen(name) - 1) + "ies";
        } else {
            name = name + "s";
        }
    }

    return name;
}

$.formatNumbers = function (n) {
    return n.toFixed().replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
}

$.say = function (s, channel) {
    var str = String(s);
    var i = str.indexOf("<");

    while (i >= 0) {
        var s1 = "";
        var s2 = "";

        if (!str.substring(i, i + 2).equalsIgnoreCase("<3")) {
            if (i > 0) {
                s1 = str.substring(0, i);
            }

            if (i < $.strlen(str)) {
                s2 = str.substring(i + 1);
            }

            str = s1 + "< " + s2;
        }

        i = str.indexOf("<", i + 1);
    }

    str = $.replaceAll(str, '<  ', '< ');

    $.println("[" + channel.getName() + "] " + str);

    if ($.tempdb.GetBoolean('t_state', channel.getName(), 'connected')) {
        $.logChat($.botName, channel, str);

        if ($.inidb.GetBoolean("settings", channel.getName(), "response_@all") || str.equals($.lang.get("net.phantombot.misc.response-disable", channel))
                || str.indexOf(".timeout ") != -1 || str.indexOf(".ban ") != -1 || str.indexOf(".unban ") != -1 || str.equalsIgnoreCase(".clear")
                || str.equalsIgnoreCase(".mods")) {
            channel.say(str);
        }
    }
}

$.replaceAll = function (string, find, replace) {
    if (find.equals(replace)) {
        return string;
    }

    while (string.indexOf(find) >= 0) {
        string = string.replace(find, replace);
    }

    return string;
}

$.list = {};

$.list.forEach = function (list, callback) {
    for (var i = 0; i < list.size(); i++) {
        callback(i, list.get(i));
    }
}

$.randElement = function (arr) {
    if (arr == null)
        return null;
    return arr[$.randRange(0, arr.length - 1)];
}

$.randRange = function (min, max) {
    if (min == max) {
        return min;
    }

    return $.rand(max) + min;
}

$.randInterval = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

$.rand = function (max) {
    if (max == 0) {
        return max;
    }

    $.random = new java.security.SecureRandom();
    return Math.abs($.random.nextInt()) % max;
}

$.array = {};
$.array.contains = function (arr, itm) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == itm || (arr[i] instanceof java.lang.String && arr[i].equals(itm)) || (itm instanceof java.lang.String && itm.equals(arr[i])))
            return true;
    }
    return false;
}

$.logChat = function (sender, channel, message) {
    if (!$.moduleEnabled("./util/fileSystem.js", channel) || (sender.equalsIgnoreCase($.botName) && message.equalsIgnoreCase(".mods"))) {
        return;
    }

    var channelname = "";
    if (channel != null) {
        channelname = "_" + channel.getName();

        if (!$.inidb.GetBoolean('settings', channel.getName(), 'logenable')
                || !$.inidb.GetBoolean('settings', channel.getName(), 'logchat')) {
            return;
        }
    }

    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var date = datefmt.format(new java.util.Date());

    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var timestamp = datefmt.format(new java.util.Date());

    var str = timestamp + " [" + sender + "] " + message;

    $.writeToFile(str, "./logs/chatlog" + channelname + "_" + date + ".txt", true);
}

$.logLink = function (sender, channel, message) {
    if (!$.moduleEnabled("./util/fileSystem.js", channel)) {
        return;
    }

    var channelname = "";
    if (channel != null) {
        channelname = "_" + channel.getName();

        if (!$.inidb.GetBoolean('settings', channel.getName(), 'logenable')) {
            return;
        }
    }

    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var date = datefmt.format(new java.util.Date());

    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var timestamp = datefmt.format(new java.util.Date());

    var str = timestamp + " [" + sender + "] " + message;

    $.writeToFile(str, "./logs/linklog" + channelname + "_" + date + ".txt", true);
}

$.logEvent = function (file, line, channel, message) {
    if (!$.moduleEnabled("./util/fileSystem.js", channel)) {
        return;
    }

    var channelname = "";
    if (channel != null) {
        channelname = "_" + channel.getName();

        if (!$.inidb.GetBoolean('settings', channel.getName(), 'logenable')) {
            return;
        }
    }

    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var date = datefmt.format(new java.util.Date());

    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var timestamp = datefmt.format(new java.util.Date());

    var str = timestamp + " [" + file + "#" + line + "] " + message;

    $.writeToFile(str, "./logs/eventlog" + channelname + "_" + date + ".txt", true);
}

$.logError = function (file, line, channel, message) {
    if (!$.moduleEnabled("./util/fileSystem.js", channel)) {
        return;
    }

    var channelname = "";
    if (channel != null) {
        channelname = "_" + channel.getName();

        if (!$.inidb.GetBoolean('settings', channel.getName(), 'logenable')) {
            return;
        }
    }

    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var date = datefmt.format(new java.util.Date());

    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss Z");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    var timestamp = datefmt.format(new java.util.Date());

    var str = timestamp + " [" + file + "#" + line + "] " + message;

    $.writeToFile(str, "./logs/errorlog" + channelname + "_" + date + ".txt", true);
}

$.logRotate = function (channel) {
    var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));
    var now = cal.getTimeInMillis();

    cal.set(java.util.Calendar.HOUR, 0);
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    cal.set(java.util.Calendar.MILLISECOND, 0);
    cal.add(java.util.Calendar.DAY_OF_MONTH, 1);

    var tomorrow = cal.getTimeInMillis();

    $.timer.addTimer("./util/misc.js", "logrotate", false, function (channel) {
        $.logRotate(channel);
    }, tomorrow - now + (60 * 1000), channel);

    var channelname = "";
    if (channel != null) {
        channelname = "_" + channel.getName();
    }

    var chatlogs = $.findFiles(".", "chatlog" + channelname + "_");
    var linklogs = $.findFiles(".", "linklog" + channelname + "_");
    var eventlogs = $.findFiles(".", "eventlog" + channelname + "_");
    var errorlogs = $.findFiles(".", "errorlog" + channelname + "_");
    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var date;
    var i;

    var logRotateDays = 7;

    if (channel != null) {
        logRotateDays = $.inidb.GetInteger('settings', channel.getName(), 'logrotatedays');
    }

    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.inidb.GetString("timezone", channel.getName(), "timezone")));

    for (i = 0; i < chatlogs.length; i++) {
        date = datefmt.parse(chatlogs[i].substring(8, 18));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, logRotateDays);

        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(chatlogs[i], true);
        }
    }

    for (i = 0; i < linklogs.length; i++) {
        date = datefmt.parse(linklogs[i].substring(8, 18));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, logRotateDays);

        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(linklogs[i], true);
        }
    }

    for (i = 0; i < eventlogs.length; i++) {
        date = datefmt.parse(eventlogs[i].substring(9, 19));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, logRotateDays);

        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(eventlogs[i], true);
        }
    }

    for (i = 0; i < errorlogs.length; i++) {
        date = datefmt.parse(errorlogs[i].substring(9, 19));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, logRotateDays);

        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(errorlogs[i], true);
        }
    }
}


$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var channel = event.getChannel();
    var args = event.getArgs();

    if (command.equalsIgnoreCase("log")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);

            return;
        }

        if (args.length == 0) {
            var msg;

            if ($.inidb.GetBoolean('settings', channel.getName(), 'logenable')) {
                msg = $.lang.get("net.phantombot.common.enabled", channel);
            } else {
                msg = $.lang.get("net.phantombot.common.disabled", channel);
            }

            msg = $.lang.get("net.phantombot.misc.log-status", channel, msg, $.inidb.GetInteger('settings', channel.getName(), 'logrotatedays'));

            $.say($.getWhisperString(sender, channel) + msg, channel);

            return;
        }

        if (args[0].equalsIgnoreCase("enable")) {
            $.logEvent("misc.js", 259, channel, username + " enabled logging");

            $.inidb.SetBoolean('settings', channel.getName(), 'logenable', true);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.log-enable", channel), channel);
        }

        if (args[0].equalsIgnoreCase("disable")) {
            $.logEvent("misc.js", 267, channel, username + " disabled logging");

            $.inidb.SetBoolean('settings', channel.getName(), 'logenable', false);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.log-disable", channel), channel);
        }

        if (args[0].equalsIgnoreCase("days")) {
            if (args.length == 1 || isNaN(args[1]) || parseInt(args[1]) < 1) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.log-err-bad-days", channel), channel);

                return;
            }

            $.logEvent("misc.js", 283, channel, username + " changed the number of days logs are kept to " + args[1]);

            $.inidb.SetInteger('settings', channel.getName(), 'logrotatedays', args[1]);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.log-days", channel, args[1]), channel);
        }
    }

    if (command.equalsIgnoreCase("logchat")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);

            return;
        }
        if (args[0].equalsIgnoreCase("enable")) {
            $.logEvent("misc.js", 259, channel, username + " enabled chat logging");

            $.inidb.SetBoolean('settings', channel.getName(), 'logchat', true);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.logchat-enable", channel), channel);
        }

        if (args[0].equalsIgnoreCase("disable")) {
            $.logEvent("misc.js", 267, channel, username + " disabled chat logging");

            $.inidb.SetBoolean('settings', channel.getName(), 'logchat', false);

            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.logchat-disable", channel), channel);
        }
    }

    if (command.equalsIgnoreCase("response")) {
        if (!$.isAdmin(sender, channel)) {
            $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.cmd.adminonly", channel), channel);

            return;
        }

        if (args.length == 0) {
            if (!$.inidb.GetBoolean("settings", channel.getName(), "response_@all")) {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.response-disabled", channel), channel);
            } else {
                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.response-enabled", channel), channel);
            }
        } else {
            if (args[0].equalsIgnoreCase("enable")) {
                $.inidb.RemoveKey("settings", channel.getName(), "response_@all");

                $.logEvent("misc.js", 313, channel, username + " enabled bot responses");

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.response-enable", channel), channel);
            } else if (args[0].equalsIgnoreCase("disable")) {
                $.inidb.SetBoolean("settings", channel.getName(), "response_@all", false);

                $.logEvent("misc.js", 319, channel, username + " disabled bot responses");

                $.say($.getWhisperString(sender, channel) + $.lang.get("net.phantombot.misc.response-disable", channel), channel);
            }
        }
    }
});

$.on('ircPrivateMessage', function (event) {
    var sender = event.getSender();
    var message = event.getMessage().toLowerCase();
    var channel = event.getChannel();

    if (sender.equalsIgnoreCase("jtv")) {
        if (message.equalsIgnoreCase("clearchat")) {
            $.logEvent("misc.js", 333, channel, "Received a clear chat notification from jtv");
        } else if (message.indexOf("clearchat") != -1) {
            $.logEvent("misc.js", 335, channel, "Received a purge/timeout/ban notification on user " + message.substring(10) + " from jtv");
        }

        if (message.indexOf("now in slow mode") != -1) {
            $.logEvent("misc.js", 339, channel, "Received a start slow mode (" + message.substring(message.indexOf("every") + 6) + ") notification from jtv");
        }

        if (message.indexOf("no longer in slow mode") != -1) {
            $.logEvent("misc.js", 343, channel, "Received an end slow mode notification from jtv");
        }

        if (message.indexOf("now in subscribers-only") != -1) {
            $.logEvent("misc.js", 347, channel, "Received a start subscribers-only mode notification from jtv");
        }

        if (message.indexOf("no longer in subscribers-only") != -1) {
            $.logEvent("misc.js", 351, channel, "Received an end subscribers-only mode notification from jtv");
        }

        if (message.indexOf("now in r9k") != -1) {
            $.logEvent("misc.js", 355, channel, "Received a start r9k mode notification from jtv");
        }

        if (message.indexOf("no longer in r9k") != -1) {
            $.logEvent("misc.js", 359, channel, "Received an end r9k mode notification from jtv");
        }

        if (message.indexOf("hosttarget") != -1) {
            var target = message.substring(11, message.indexOf(" ", 12));

            if (target.equalsIgnoreCase("-")) {
                $.logEvent("misc.js", 366, channel, "Received an end host mode notification from jtv");
            } else {
                $.logEvent("misc.js", 368, channel, "Received a start host mode notification on user " + target + " from jtv");
            }
        }
    }
});

$.on('ircChannelMessage', function (event) {
    var sender = event.getSender();
    var message = event.getMessage();
    var channel = event.getChannel();

    $.logChat(sender, channel, message);
});

$.timer.addTimer("./util/misc.js", "registercommand", false, function () {
    $.registerChatCommand("./util/misc.js", "log", "admin");
    $.registerChatCommand("./util/misc.js", "logchat", "admin");
    $.registerChatCommand("./util/misc.js", "response", "admin");
}, 5000);

$.timer.addTimer("./util/misc.js", "logrotateinit", false, function () {
    $.logRotate();

    var channels = $.phantombot.getChannels();
    for (var i = 0; i < channels.size(); i++) {
        $.logRotate(channels.get(i));
    }
}, 60 * 1000);

$.strlen = function (str) {
    if (str == null || str == undefined) {
        return 0;
    }

    if ((typeof str.length) instanceof java.lang.String) {
        if ((typeof str.length).equalsIgnoreCase("number")) {
            return str.length;
        } else {
            return str.length();
        }
    } else {
        if ((typeof str.length) == "number") {
            return str.length;
        } else {
            return str.length();
        }
    }
};

$.trueRandElement = function (arr) {
    if (arr == null)
        return null;
    return arr[$.trueRand(arr.length - 1)];
}

$.trueRand = function (max) {
    return $.trueRandRange(0, max);
}

$.trueRandRange = function (min, max) {
    if (min == max) {
        return min;
    }

    try {
        var HttpRequest = Packages.com.gmt2001.HttpRequest;
        var HashMap = Packages.java.util.HashMap;
        var JSONObject = Packages.org.json.JSONObject;

        var j = new JSONObject("{}");
        var p = new JSONObject("{}");
        var h = new HashMap(1);

        var id = $.rand(65535);

        h.put("Content-Type", "application/json-rpc");

        p.put("apiKey", "0d710311-5840-45dd-be83-82904de87c5d");
        p.put("n", 1);
        p.put("min", min);
        p.put("max", max);
        p.put("replacement", true);
        p.put("base", 10);

        j.put("jsonrpc", "2.0");
        j.put("method", "generateIntegers");
        j.put("params", p);
        j.put("id", id);

        var r = HttpRequest.getData(HttpRequest.RequestType.GET, "https://api.random.org/json-rpc/1/invoke", j.toString(), h);

        if (r.success && r.httpCode == 200) {
            var d = new JSONObject(r.content);
            var result = d.getJSONObject("result");
            var random = result.getJSONObject("random");
            var data = random.getJSONArray("data");

            if (data.length() > 0) {
                return data.getInt(0);
            }
        } else {
            if (r.httpCode == 0) {
                $.logError("misc.js", 478, null, "Failed to use random.org: " + r.exception);
            } else {
                $.logError("misc.js", 480, null, "Failed to use random.org: HTTP" + r.httpCode + " " + r.content);
            }
        }
    } catch (e) {
        $.logError("misc.js", 484, null, "Failed to use random.org: " + e);
    }

    return $.randRange(min, max);
}
