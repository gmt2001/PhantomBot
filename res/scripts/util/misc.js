$.say = function(s) {
    $.ssay(s);
}; 

$.ssay = function(s) {
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
    
    while (str.indexOf("<  ") >= 0) {
        str = str.replace('<  ', '< ');
    }
    
    $.println(str);
    
    if ($.connected) {
        $.logChat($.botname, str);
        
        if (!$.inidb.exists("settings", "response_@all") || $.inidb.get("settings", "response_@all").equalsIgnoreCase("1")
            || str.indexOf("Bot responses are disabled") != -1 || str.indexOf(".timeout ") != -1 || str.indexOf(".ban ") != -1
            || str.indexOf(".unban ") != -1 || str.equalsIgnoreCase(".clear") || str.equalsIgnoreCase(".mods")) {
            $.channel.say(str);
        }
    }
}

$.list = { };

$.list.forEach = function(list, callback) {
    for(var i = 0; i < list.size(); i++) {
        callback(i, list.get(i));
    }
}

$.randElement = function(arr) {
    if (arr == null) return null;
    return arr[$.randRange(0, arr.length - 1)];
}

$.randRange = function (min, max) {
    if (min == max) {
        return min;
    }
    
    return $.rand(max) + min;
}

$.rand = function (max) {
    if (max == 0) {
        return max;
    }
    
    $.random = new java.security.SecureRandom();
    return Math.abs($.random.nextInt()) % max;
}

$.array = { };
$.array.contains = function(arr, itm) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] == itm || (arr[i] instanceof java.lang.String && arr[i].equals(itm)) || (itm instanceof java.lang.String && itm.equals(arr[i]))) return true;
    }
    return false;
}

$.logChat = function(sender, message) {
    if (!$.moduleEnabled("./util/fileSystem.js") || !$.logEnable || (sender.equalsIgnoreCase($.botname) && message.equalsIgnoreCase(".mods"))) {
        return;
    }
    
    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var date = datefmt.format(new java.util.Date());
    
    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    var str = timestamp + "Z [" + sender + "] " + message;
    
    $.writeToFile(str, "chatlog_" + date + ".txt", true);
}

$.logLink = function(sender, message) {
    if (!$.moduleEnabled("./util/fileSystem.js") || !$.logEnable) {
        return;
    }
    
    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var date = datefmt.format(new java.util.Date());
    
    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    var str = timestamp + "Z [" + sender + "] " + message;
    
    $.writeToFile(str, "linklog_" + date + ".txt", true);
}

$.logEvent = function(file, line, message) {
    if (!$.moduleEnabled("./util/fileSystem.js") || !$.logEnable) {
        return;
    }
    
    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var date = datefmt.format(new java.util.Date());
    
    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    var str = timestamp + "Z [" + file + "#" + line + "] " + message;
    
    $.writeToFile(str, "eventlog_" + date + ".txt", true);
}

$.logError = function(file, line, message) {
    if (!$.moduleEnabled("./util/fileSystem.js") || !$.logEnable) {
        return;
    }
    
    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var date = datefmt.format(new java.util.Date());
    
    datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    var timestamp = datefmt.format(new java.util.Date());
    
    var str = timestamp + "Z [" + file + "#" + line + "] " + message;
    
    $.writeToFile(str, "errorlog_" + date + ".txt", true);
}

$.logRotate = function() {
    var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone("GMT"));
    var now = cal.getTimeInMillis();

    cal.set(java.util.Calendar.HOUR, 0);
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    cal.set(java.util.Calendar.MILLISECOND, 0);
    cal.add(java.util.Calendar.DAY_OF_MONTH, 1);

    var tomorrow = cal.getTimeInMillis();

    $.timer.addTimer("./util/misc.js", "logrotate", false, function() {
        $.logRotate();
    }, tomorrow - now + (60 * 1000));
    
    var chatlogs = $.findFiles(".", "chatlog_");
    var linklogs = $.findFiles(".", "linklog_");
    var eventlogs = $.findFiles(".", "eventlog_");
    var errorlogs = $.findFiles(".", "errorlog_");
    var datefmt = new java.text.SimpleDateFormat("yyyy-MM-dd");
    var date;
    var i;
    
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone("GMT"));
    
    for (i = 0; i < chatlogs.length; i++) {
        date = datefmt.parse(chatlogs[i].substring(8, 18));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, $.logRotateDays);
        
        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(chatlogs[i], true);
        }
    }
    
    for (i = 0; i < linklogs.length; i++) {
        date = datefmt.parse(linklogs[i].substring(8, 18));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, $.logRotateDays);
        
        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(linklogs[i], true);
        }
    }
    
    for (i = 0; i < eventlogs.length; i++) {
        date = datefmt.parse(eventlogs[i].substring(9, 19));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, $.logRotateDays);
        
        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(eventlogs[i], true);
        }
    }
    
    for (i = 0; i < errorlogs.length; i++) {
        date = datefmt.parse(errorlogs[i].substring(9, 19));
        cal.setTime(date);
        cal.add(java.util.Calendar.DAY_OF_MONTH, $.logRotateDays);
        
        if (cal.getTimeInMillis() <= now) {
            $.deleteFile(errorlogs[i], true);
        }
    }
}

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    
    if (command.equalsIgnoreCase("log")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            
            return;
        }
        
        if (args.length == 0) {
            var msg = "Logging is currently ";
            
            if ($.logEnable) {
                msg = msg + "enabled";
            } else {
                msg = msg + "disabled";
            }
            
            msg = msg + "! Logs are kept for " + $.logRotateDays + " days! To change this use '!log <enable or disable>' or '!log days <number of days>'";
            
            $.say(msg);
            
            return;
        }
        
        if (args[0].equalsIgnoreCase("enable")) {
            $.logEnable = true;
            
            $.logEvent("misc.js", 259, username + " enabled logging");
            
            $.inidb.set('settings', 'logenable', '1');
            
            $.say("Logging enabled!");
        }
        
        if (args[0].equalsIgnoreCase("disable")) {
            $.logEvent("misc.js", 267, username + " disabled logging");
            
            $.logEnable = false;
            
            $.inidb.set('settings', 'logenable', '0');
            
            $.say("Logging disabled!");
        }
        
        if (args[0].equalsIgnoreCase("days")) {
            if (args.length == 1 || isNaN(args[1]) || parseInt(args[1]) < 1) {
                $.say("Please enter a valid number of days greater than 0. Usage: '!log days <number of days>'");
                
                return;
            }
            
            $.logEvent("misc.js", 283, username + " changed the number of days logs are kept to " + args[1]);
            
            $.logRotateDays = parseInt(args[1]);
            
            $.inidb.set('settings', 'logrotatedays', args[1]);
            
            $.say("Logs are now kept for " + args[1] + " days!");
        }
    }
    
    if (command.equalsIgnoreCase("response")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            
            return;
        }
        
        if (args.length == 0) {
            if ($.inidb.exists("settings", "response_@all")
                && $.inidb.get("settings", "response_@all").equalsIgnoreCase("0")) {
                $.say("Bot responses are disabled for everyone. To turn them on,  say: !response enable");
            } else {
                $.say("Bot responses are enabled for everyone. To turn them off, say: !response disable");
            }
        } else {
            if (args[0].equalsIgnoreCase("enable")) {
                if ($.inidb.exists("settings", "response_@all")) {
                    $.inidb.del("settings", "response_@all");
                }
                
                $.logEvent("misc.js", 313, username + " enabled bot responses");
                
                $.say("Responses are now enabled! To disable them, say: !response disable");
            } else if (args[0].equalsIgnoreCase("disable")) {
                $.inidb.set("settings", "response_@all", "0");
                
                $.logEvent("misc.js", 319, username + " disabled bot responses");
                
                $.say("Responses are now disabled! To enable them, say: !response enable");
            }
        }
    }
});

$.on('ircPrivateMessage', function(event) {
    var sender = event.getSender().toLowerCase();
    var message = event.getMessage().toLowerCase();
    
    if (sender.equalsIgnoreCase("jtv")) {
        if (message.equalsIgnoreCase("clearchat")) {
            $.logEvent("misc.js", 333, "Received a clear chat notification from jtv");
        } else if (message.indexOf("clearchat") != -1) {
            $.logEvent("misc.js", 335, "Received a purge/timeout/ban notification on user " + message.substring(10) + " from jtv");
        }
        
        if (message.indexOf("now in slow mode") != -1) {
            $.logEvent("misc.js", 339, "Received a start slow mode (" + message.substring(message.indexOf("every") + 6) + ") notification from jtv");
        }
        
        if (message.indexOf("no longer in slow mode") != -1) {
            $.logEvent("misc.js", 343, "Received an end slow mode notification from jtv");
        }
        
        if (message.indexOf("now in subscribers-only") != -1) {
            $.logEvent("misc.js", 347, "Received a start subscribers-only mode notification from jtv");
        }
        
        if (message.indexOf("no longer in subscribers-only") != -1) {
            $.logEvent("misc.js", 351, "Received an end subscribers-only mode notification from jtv");
        }
        
        if (message.indexOf("now in r9k") != -1) {
            $.logEvent("misc.js", 355, "Received a start r9k mode notification from jtv");
        }
        
        if (message.indexOf("no longer in r9k") != -1) {
            $.logEvent("misc.js", 359, "Received an end r9k mode notification from jtv");
        }
        
        if (message.indexOf("hosttarget") != -1) {
            var target = message.substring(11, message.indexOf(" ", 12));
            
            if (target.equalsIgnoreCase("-")) {
                $.logEvent("misc.js", 366, "Received an end host mode notification from jtv");
            } else {
                $.logEvent("misc.js", 368, "Received a start host mode notification on user " + target + " from jtv");
            }
        }
    }
});

$.on('ircChannelMessage', function(event) {
    var sender = event.getSender();
    var message = event.getMessage();
    
    $.logChat(sender, message);
});

$.timer.addTimer("./util/misc.js", "registercommand", false, function() {
    $.registerChatCommand("./util/misc.js", "log", "admin");
    $.registerChatCommand("./util/misc.js", "response", "admin");
}, 5000);

var logEnable = $.inidb.get('settings', 'logenable');

if (logEnable == null || logEnable == undefined) {
    $.logEnable = false;
} else {
    $.logEnable = logEnable.equalsIgnoreCase("1");
}

var logRotateDays = $.inidb.get('settings', 'logrotatedays');

if (logRotateDays == null || logRotateDays == undefined || isNaN(logRotateDays)) {
    $.logRotateDays = 7;
} else {
    $.logRotateDays = parseInt(logRotateDays);
}

$.timer.addTimer("./util/misc.js", "logrotateinit", false, function() {
    $.logRotate();
}, 60 * 1000);

$.strlen = function(str) {
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

$.trueRandElement = function(arr) {
    if (arr == null) return null;
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
    
        if (r.success) {
            var d = new JSONObject(r.content);
            var result = d.getJSONObject("result");
            var random = result.getJSONObject("random");
            var data = random.getJSONArray("data");
        
            if (data.length() > 0) {
                return data.getInt(0);
            }
        } else {
            if (r.httpCode == 0) {
                $.logError("misc.js", 478, "Failed to use random.org: " + r.exception);
            } else {
                $.logError("misc.js", 480, "Failed to use random.org: HTTP" + r.httpCode + " " + r.content);
            }
        }
    } catch (e) {
        $.logError("misc.js", 484, "Failed to use random.org: " + e);
    }
    
    return $.randRange(min, max);
}