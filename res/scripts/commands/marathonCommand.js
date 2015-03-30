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
    
    $.say("Current Caster's Time: " + timestamp + " " + $.timezone);
    $.say("List of Scheduled Marathons:");
    
    lines.sort();
    
    if (prev != null) {
        $.say("[Prev] >>" + prevS);
    }
    
    if (cur != null) {
        $.say("[LIVE!] >>" + curS);
    }
    
    for (i = 0; i < lines.length; i++) {
        spl = lines[i].split(";");
    
        cal.setTimeInMillis(java.lang.Long.parseLong(spl[0]));
        cal.set(java.util.Calendar.SECOND, 0);
        cal.set(java.util.Calendar.MILLISECOND, 0);
        date = cal.getTime();
   
        if ((cur == null || date.after(cur)) && count < $.schedulelimit) {
            $.say("[Next] >>" + datefmt.format(date) + " " + spl[1]);
            
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
                $.say("There is currently no marathon schedule");
                return;
            } 
            announceSchedule();
        } else {
            if (!isMod(sender)) {
                $.say($.modmsg);
                return;
            }
            
            var data = "";
            
            if ($.strlen(argsString) > argsString.indexOf(args[0]) + $.strlen(args[0]) + 1) {
                data = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
            }
			
            
            if (args[0].equalsIgnoreCase("clear")) {
                $.inidb.RemoveFile("marathon");
                $.say("The marathon schedule has been cleared!");
            } else if (args[0].equalsIgnoreCase("name")) {
                if (data.length == 0) {
                    if ($.inidb.exists("marathon", "name")) {
                        $.say("The current marathon name is '" + $.inidb.get("marathon", "name") + "'! To change it use '!marathon name <name>'");
                    } else {
                        $.say("There currently is no marathon name set");
                    }
                    
                    return;
                }
                
                $.inidb.set("marathon", "name", data); 
                $.say("Marathon name set!");
            } else if (args[0].equalsIgnoreCase("nameclear")) {
                $.inidb.del("marathon", "name");
                
                $.say("Marathon name cleared!");
            } else if (args[0].equalsIgnoreCase("link")) {
                if (data.length == 0) {
                    if ($.inidb.exists("marathon", "link")) {
                        $.say("The current marathon link is '" + $.inidb.get("marathon", "link") + "'! To change it use '!marathon link <link>'");
                    } else {
                        $.say("There currently is no marathon link set");
                    }
                    
                    return;
                }
                
                $.inidb.set("marathon", "link", data);
                
                $.say("Marathon link set!");
            } else if (args[0].equalsIgnoreCase("linkclear")) {
                $.inidb.del("marathon", "link");
                
                $.say("Marathon link cleared!");
            } else if (args[0].equalsIgnoreCase("schedule")) {
                if (data.indexOf(" ") == -1 || $.strlen(data) < data.indexOf(" ") + 1) {
                    $.say("Usage: '!marathon schedule add <customname> <MM/DD> <HH:MM>', '!marathon schedule delete <MM/DD> <HH:MM>'");
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
                            $.say("Invalid date or time, type '!marathon schedule' for the format");
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
                                    
                                    $.say("Deleted specified timeslot from marathon schedule");
                                    return;
                                }
                            }
                        }
                        
                        $.say("Specified timeslot does not exist");
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
                                    $.say("Invalid date or time, type '!marathon schedule' for the format");
                                }
                            } else {
                                cal.set(cal.get(java.util.Calendar.YEAR), month, day, hour, minute, 0);
                                cal.set(java.util.Calendar.MILLISECOND, 0);
                                
                                $.inidb.set("marathon", "schedule_" + month + "-" + day + "_" + hour + "-" + minute, cal.getTimeInMillis() + ";" + name);
                                
                                count++;
                            }
                        } while($.strlen(data) > 0);
                        
                        $.say("Added " + count + " valid schedule items");
                    } else {
                        $.say("Invalid subcommand '" + subcommand + "'");
                    }
                }
            } else {
                $.say("Usage: !marathon clear, !marathon name <name>, !marathon nameclear, !marathon link <link>, !marathon linkclear, !marathon schedule");
            }
        }
    }
});

$.registerChatCommand("./commands/marathonCommand.js", "marathon");

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