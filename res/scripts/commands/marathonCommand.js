$.schedulelimit = 3;

var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone));

var announceSchedule = function() {

    var hasitems = false;
    var keys = $.inidb.GetKeyList("marathon", "");

    for (i = 0; i < keys.length; i++) {
        if (!keys[i].equalsIgnoreCase("name") && !keys[i].equalsIgnoreCase("link")) {
            hasitems = false;
            return;
        }
    }
    
    var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone));
    var now = cal.getTime();
    var cur = null;
    var curS = "";
    var prev = null;
    var prevS = "";
    var earliest = null;
    var latest = null;
    var count = 0;
    var lines = new Array();
    
    var datefmt = new java.text.SimpleDateFormat("MM-dd-yyyy @ HH:mm:ss");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    
    var timestamp = datefmt.format(now);
    
    datefmt = new java.text.SimpleDateFormat("HH:mm");
    datefmt.setTimeZone(java.util.TimeZone.getTimeZone($.timezone));
    
    for (i = 0; i < keys.length; i++) {
        if (!keys[i].equalsIgnoreCase("name") && !keys[i].equalsIgnoreCase("link")) {
            spl = $.inidb.get("marathon", keys[i]).split(";");
            
            cal.setTimeInMillis(java.lang.Long.parseLong(spl[0]));
            cal.set(java.util.Calendar.SECOND, 0);
            cal.set(java.util.Calendar.MILLISECOND, 0);
            date = cal.getTime();
                                
            if (date.equals(now) || date.before(now)) {
                if (cur == null || date.after(cur)) {
                    prev = cur;
                    prevS = curS;
                    cur = date;
                    curS = spl[1];
                } else if (!cur.equals(date) && (prev == null || date.after(prev))) {
                    prev = date;
                    prevS = spl[1];
                }
            }
            
            lines.push($.inidb.get("marathon", keys[i]));
            
            if (earliest == null || date.before(earliest)) {
                earliest = date;
            }
            
            if (latest == null || date.after(latest)) {
                latest = date;
            }
        }
    }
    
    cal.setTime(earliest);
    cal.add(java.util.Calendar.HOUR, -2);
    
    if (cal.getTime().after(now)) {
        return;
    }
    
    cal.setTime(latest);
    cal.add(java.util.Calendar.HOUR, 8);
    
    if (cal.getTime().before(now)) {
        return;
    }
    
    if ($.inidb.exists("marathon", "name")) {
        $.say($.inidb.get("marathon", "name"));
    }
    
    if ($.inidb.exists("marathon", "link")) {
        $.say($.inidb.get("marathon", "link"));
    }
    
    $.say($.lang.get("net.phantombot.marathonCommand.current-caster-time", timestamp, $.timezone));
    $.say($.lang.get("net.phantombot.marathonCommand.current-sched"));
    
    lines.sort();
    
    if (prev != null) {
        $.say($.lang.get("net.phantombot.marathonCommand.prev", prevS));
        return;
    }
    
    if (cur != null) {
        $>say($.lang.get("net.phantombot.marathonCommand.live", curS));
        return;
    }
    
    for (i = 0; i < lines.length; i++) {
        spl = lines[i].split(";");
    
        cal.setTimeInMillis(java.lang.Long.parseLong(spl[0]));
        cal.set(java.util.Calendar.SECOND, 0);
        cal.set(java.util.Calendar.MILLISECOND, 0);
        date = cal.getTime();
   
        if ((cur == null || date.after(cur)) && count < $.schedulelimit) {
            $.say($.lang.get("net.phantombot.marathonCommand.next", datefmt.format(date), spl[1]));
            
            count++;
        }
            
        if (latest == null || date.after(latest)) {
            latest = date;
        }
    }
}

$.on('command', function(event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs();
    var groups = new Array();

    if (command.equalsIgnoreCase("marathon")) {
        if (args.length == 0) {
            if (!$.inidb.FileExists("marathon") || $.inidb.GetKeyList("marathon", "").length == 0) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.error-no-marathon"));
                return;
            } 
            announceSchedule();
        } else {
            if (!$.isModv3(sender, event.getTags())) {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.cmd.modonly"));
                return;
            }
            
            var data = "";
            
            if ($.strlen(argsString) > argsString.indexOf(args[0]) + $.strlen(args[0]) + 1) {
                data = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            }
            
            if (args[0].equalsIgnoreCase("clear")) {
                $.inidb.RemoveFile("marathon");
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-cleared"));
            } else if (args[0].equalsIgnoreCase("name")) {
                if (data.length == 0) {
                    if ($.inidb.exists("marathon", "name")) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.current-marathon-name", $.inidb.get("marathon", "name")));
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.error-no-marathon"));
                    }
                    return;
                }
                
                $.inidb.set("marathon", "name", data); 
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-name-set"));
            } else if (args[0].equalsIgnoreCase("nameclear")) {
                $.inidb.del("marathon", "name");
                
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-name-cleared"));
            } else if (args[0].equalsIgnoreCase("link")) {
                if (data.length == 0) {
                    if ($.inidb.exists("marathon", "link")) {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-link", $.inidb.get("marathon", "link")));
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-link-error"));
                        return;
                    }
                    return;
                }
                
                $.inidb.set("marathon", "link", data);
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-link-set"));
                return;
            } else if (args[0].equalsIgnoreCase("linkclear")) {
                $.inidb.del("marathon", "link"); 
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-link-cleared"));
                return;
            } else if (args[0].equalsIgnoreCase("schedule")) {
                if (data.indexOf(" ") == -1 || $.strlen(data) < data.indexOf(" ") + 1) {
                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-sched-usage"));
                    return;
                } else {
                    var subcommand = data.substring(0, data.indexOf(" "));
                    data = data.substring(data.indexOf(subcommand) + $.strlen(subcommand) + 1);
                    
                    var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone));
                    var date;
                    var date2;
                    var dateS;
                    var timeS;
                    var month = -1;
                    var day = -1;
                    var hour = -1;
                    var minute = -1;
                    var name;
                    var spl;
                    var i;
                    
                    if (subcommand.equalsIgnoreCase("delete") || subcommand.equalsIgnoreCase("remove")) {
                        var keys = $.inidb.GetKeyList("marathon", "");
                        
                        dateS = data.substring(0, data.indexOf(" "));
                        timeS = data.substring(data.indexOf(" ") + 1);
                    
                        if (!isNaN(dateS.substring(0, dateS.indexOf("/")))) {
                            month = java.lang.Integer.parseInt(dateS.substring(0, dateS.indexOf("/"))) - 1;
                        }
                
                        if (!isNaN(dateS.substring(dateS.indexOf("/") + 1))) {
                            day = java.lang.Integer.parseInt(dateS.substring(dateS.indexOf("/") + 1));
                        }
                    
                        if (!isNaN(timeS.substring(0, timeS.indexOf(":")))) {
                            hour = java.lang.Integer.parseInt(timeS.substring(0, timeS.indexOf(":")));
                        }
                
                        if (!isNaN(timeS.substring(timeS.indexOf(":") + 1))) {
                            minute = java.lang.Integer.parseInt(timeS.substring(timeS.indexOf(":") + 1));
                        }
                    
                        if (month == -1 || day == -1 || hour == -1 || minute == -1) {
                            $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.date-error-user-404"));
                            return;
                        }
                        
                        cal.set(cal.get(java.util.Calendar.YEAR), month, day, hour, minute, 0);
                        cal.set(java.util.Calendar.SECOND, 0);
                        cal.set(java.util.Calendar.MILLISECOND, 0);
                            
                        date = cal.getTime();
                        
                        for (i = 0; i < keys.length; i++) {
                            if (!keys[i].equalsIgnoreCase("name") && !keys[i].equalsIgnoreCase("link")) {
                                spl = $.inidb.get("marathon", keys[i]).split(";");
                                
                                cal.setTimeInMillis(java.lang.Long.parseLong(spl[0]));
                                cal.set(java.util.Calendar.SECOND, 0);
                                cal.set(java.util.Calendar.MILLISECOND, 0);
                                date2 = cal.getTime();
                                
                                if (date2.equals(date)) {
                                    $.inidb.del("marathon", keys[i]);
                                    
                                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.deleted-time-slot"));
                                    return;
                                }
                            }
                        }
                        
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.time-slot-error-404"));
                        return;
                    } else if (subcommand.equalsIgnoreCase("add")) {
                        var first = true;
                        var count = 0;
                        
                        do {
                            i = data.indexOf(" ");
                            name = data.substring(0, i);
                            
                            name = name.replace("(space)", " ");
                        
                            dateS = data.substring(i + 1, data.indexOf(" ", i + 1));
                            i = data.indexOf(" ", i + 1);
                        
                            if (data.indexOf(" ", i + 1) == -1) {
                                timeS = data.substring(i + 1);
                                
                                data = new java.lang.String();
                            } else {
                                timeS = data.substring(i + 1, data.indexOf(" ", i + 1));
                            
                                data = data.substring(data.indexOf(" ", i + 1) + 1);
                            }
                    
                            month = -1;
                            day = -1;
                            hour = -1;
                            minute = -1;

                            if (!isNaN(dateS.substring(0, dateS.indexOf("/")))) {
                                month = java.lang.Integer.parseInt(dateS.substring(0, dateS.indexOf("/"))) - 1;
                            }
                
                            if (!isNaN(dateS.substring(dateS.indexOf("/") + 1))) {
                                day = java.lang.Integer.parseInt(dateS.substring(dateS.indexOf("/") + 1));
                            }
                    
                            if (!isNaN(timeS.substring(0, timeS.indexOf(":")))) {
                                hour = java.lang.Integer.parseInt(timeS.substring(0, timeS.indexOf(":")));
                            }
                
                            if (!isNaN(timeS.substring(timeS.indexOf(":") + 1))) {
                                minute = java.lang.Integer.parseInt(timeS.substring(timeS.indexOf(":") + 1));
                            }
                    
                            if (month == -1 || day == -1 || hour == -1 || minute == -1) {
                                if (first) {
                                    first = false;
                                    $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.date-error-user-404"));
                                    return;
                                }
                            } else {
                                cal.set(cal.get(java.util.Calendar.YEAR), month, day, hour, minute, 0);
                                cal.set(java.util.Calendar.MILLISECOND, 0);
                                
                                $.inidb.set("marathon", "schedule_" + month + "-" + day + "_" + hour + "-" + minute, cal.getTimeInMillis() + ";" + name);
                                
                                count++;
                            }
                        } while ($.strlen(data) > 0);
                        
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.added-items", count));
                        return;
                    } else {
                        $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.wrong-subcommand", subcommand));
                        return;
                    }
                }
            } else {
                $.say($.getWhisperString(sender) + $.lang.get("net.phantombot.marathonCommand.marathon-command-usage"));
                return;
            }
        }
    }
});

setTimeout(function(){ 
    if ($.moduleEnabled('./commands/marathonCommand.js')) {
        $.registerChatCommand("./commands/marathonCommand.js", "marathon");
    }
},10 * 1000);

cal.set(java.util.Calendar.MINUTE, 0);
cal.set(java.util.Calendar.SECOND, 0);
cal.set(java.util.Calendar.MILLISECOND, 0);

var lastAnnounce = parseInt($.inidb.get('marathon', 'lastAnnounce'));

if (lastAnnounce == undefined || lastAnnounce == null || isNaN(lastAnnounce) || lastAnnounce < 0) {
    lastAnnounce = cal.getTimeInMillis();
} else {
    cal.setTimeInMillis(lastAnnounce);
}

$.timer.addTimer("./commands/marathonCommand.js", "announce", true, function() {
    if (!$.moduleEnabled("./commands/marathonCommand.js")) {
        return;
    }
    
    var cal = java.util.Calendar.getInstance(java.util.TimeZone.getTimeZone($.timezone));
    var now = cal.getTime();
    cal.set(java.util.Calendar.MINUTE, 0);
    cal.set(java.util.Calendar.SECOND, 0);
    cal.set(java.util.Calendar.MILLISECOND, 0);
    var nowH = cal.getTimeInMillis();
    cal.setTimeInMillis(lastAnnounce);
    cal.add(java.util.Calendar.HOUR, 1);
    var next = cal.getTime();
    
    if (next.equals(now) || next.before(now)) {
        lastAnnounce = nowH;
        $.inidb.set('marathon', 'lastAnnounce', lastAnnounce);
        
        announceSchedule();
    }
}, 60 * 1000);
