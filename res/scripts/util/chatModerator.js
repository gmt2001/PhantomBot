var ircPrefix = ".";
var autoBanPhrases = new Array();
var permitList = new Array();
var sinbin = new Array();
var warningcountresettime = parseInt($.inidb.get("settings", "warningcountresettime")) * 1000;
var timeouttype = $.inidb.get("settings", "timeouttype");
var autopurgemessage = $.inidb.get("settings", "autopurgemessage");
var capsallowed = $.inidb.get("settings", "capsallowed").equalsIgnoreCase("1");
var capstriggerratio = parseFloat($.inidb.get("settings", "capstriggerratio"));
var capstriggerlength = parseInt($.inidb.get("settings", "capstriggerlength"));
var capsmessage = $.inidb.get("settings", "capsmessage");
var linksallowed = $.inidb.get("settings", "linksallowed").equalsIgnoreCase("1");
var permittime = parseInt($.inidb.get("settings", "permittime"));
var youtubeallowed = $.inidb.get("settings", "youtubeallowed").equalsIgnoreCase("1");
var subsallowed = $.inidb.get("settings", "subsallowed").equalsIgnoreCase("1");
var linksmessage = $.inidb.get("settings", "linksmessage");
var spamallowed = $.inidb.get("settings", "spamallowed").equalsIgnoreCase("1");
var spamlimit = parseInt($.inidb.get("settings", "spamlimit"));
var spammessage = $.inidb.get("settings", "spammessage");
var symbolsallowed = $.inidb.get("settings", "symbolsallowed").equalsIgnoreCase("1");
var symbolslimit = parseInt($.inidb.get("settings", "symbolslimit"));
var symbolsrepeatlimit = parseInt($.inidb.get("settings", "symbolsrepeatlimit"));
var symbolsmessage = $.inidb.get("settings", "symbolsmessage");
var repeatallowed = $.inidb.get("settings", "repeatallowed").equalsIgnoreCase("1");
var repeatlimit = parseInt($.inidb.get("settings", "repeatlimit"));
var repeatmessage = $.inidb.get("settings", "repeatmessage");
var graphemeallowed = $.inidb.get("settings", "graphemeallowed").equalsIgnoreCase("1");
var graphemelimit = parseInt($.inidb.get("settings", "graphemelimit"));
var graphememessage = $.inidb.get("settings", "graphememessage");
var warningtypes = new Array($.inidb.get("settings", "warning1type"), $.inidb.get("settings", "warning2type"), $.inidb.get("settings", "warning3type"));
var warningmessages = new Array($.inidb.get("settings", "warning1message"), $.inidb.get("settings", "warning2message"), $.inidb.get("settings", "warning3message"));
$.bancache.loadFromFile ("bannedUsers.bin");

if ($.spamtracker == null || $.spamtracker == undefined) {
    $.spamtracker = new Array();
}

var lines = $.readFile("sinbin");
var i;
var spl;

for (i = 0; i < lines.length; i++) {
    spl = lines[i].split("=");
    
    sinbin.push(new Array(spl[0], parseInt(spl[1]), parseInt(spl[2])));
}

function issueCommand(command) {
    $.say(command);
    $.say(command);
}

function banUserFor (user, time) {
    $.bancache.addUser (user, time);
    $.bancache.syncToFile ("bannedUsers.bin");
    
    banUser(user);
}

function banUser (user) {
    issueCommand(ircPrefix + "ban " + user);
    timeoutUser(user, 1);
}

function unbanUser (user) {
    issueCommand(ircPrefix + "unban " + user);
    $.bancache.removeUser (user);
}
 
function clearChat () {
    issueCommand(ircPrefix + "clear");
}

function timeoutUserFor (user, fortime) {
    if (timeouttype.equalsIgnoreCase("ban")) {
        banUserFor(user, fortime);
    } else {
        timeoutUser(user, fortime);
    }
}

function timeoutUser (user, fortime) {
    issueCommand(ircPrefix + "timeout " + user + " " + fortime);
}

function autoPurgeUser(user, warnmessage) {
    var ban = false;
    var idx = -1;
    var count;
    var lastincrease;
    var warning;
    
    for (var i = 0; i < sinbin.length; i++) {
        if (user.equalsIgnoreCase(sinbin[i][0])) {
            idx = i;
        }
    }
    
    if (idx == -1) {
        count = 0;
        lastincrease = System.currentTimeMillis();
    } else {
        count = sinbin[idx][1];
        lastincrease = sinbin[idx][2];
        
        if (warningcountresettime >= 0 && lastincrease + warningcountresettime < System.currentTimeMillis()) {
            count = 0;
        }
        
        lastincrease = System.currentTimeMillis();
    }
    
    count++;
    
    warning = user + " -> " + warnmessage;
    
    if (count == 1) {
        if ($.strlen(warningmessages[0]) > 0) {
            warning += " >> " + warningmessages[0];
        }
        
        if (warningtypes[0].equalsIgnoreCase("purge")) {
            $.logEvent("chatModerator.js", 124, ">> Strike 1 >> Purged");
            
            timeoutUser(user, 1);
            
            warning += " [Purged]";
        } else if (warningtypes[0].equalsIgnoreCase("ban")) {
            $.logEvent("chatModerator.js", 130, ">> Strike 1 >> Banned");
            
            banUser(user);
            
            warning += " [Banned]";
        } else {
            $.logEvent("chatModerator.js", 136, ">> Strike 1 >> Timed out (" + warningtypes[0] + ")");
            
            timeoutUserFor(user, parseInt(warningtypes[0]));
            
            warning += " [Timed Out (" + warningtypes[0] + ")]";
        }
    } else if (count == 2) {
        if ($.strlen(warningmessages[1]) > 0) {
            warning += " >> " + warningmessages[1];
        }
        
        if (warningtypes[1].equalsIgnoreCase("purge")) {
            $.logEvent("chatModerator.js", 148, ">> Strike 2 >> Purged");
            
            timeoutUser(user, 1);
            
            warning += " [Purged]";
        } else if (warningtypes[1].equalsIgnoreCase("ban")) {
            $.logEvent("chatModerator.js", 154, ">> Strike 2 >> Banned");
            
            banUser(user);
            
            warning += " [Banned]";
        } else {
            $.logEvent("chatModerator.js", 160, ">> Strike 2 >> Timed out (" + warningtypes[1] + ")");
            
            timeoutUserFor(user, parseInt(warningtypes[1]));
            
            warning += " [Timed Out (" + warningtypes[1] + ")]";
        }
    } else {
        if ($.strlen(warningmessages[2]) > 0) {
            warning += " >> " + warningmessages[2];
        }
        
        if (warningtypes[2].equalsIgnoreCase("purge")) {
            $.logEvent("chatModerator.js", 172, ">> Strike 3 >> Purged");
            
            timeoutUser(user, 1);
            
            warning += " [Purged]";
        } else if (warningtypes[2].equalsIgnoreCase("ban")) {
            $.logEvent("chatModerator.js", 178, ">> Strike 3 >> Banned");
            
            banUser(user);
            
            warning += " [Banned]";
        } else {
            $.logEvent("chatModerator.js", 184, ">> Strike 3 >> Timed out (" + warningtypes[2] + ")");
            
            timeoutUserFor(user, parseInt(warningtypes[2]));
            
            warning += " [Timed Out (" + warningtypes[2] + ")]";
        }
    }
    
    $.say(warning);
    
    if (idx == -1) {
        sinbin.push(new Array(user.toLowerCase(), count, lastincrease));
    } else {
        sinbin[idx][1] = count;
        sinbin[idx][2] = lastincrease;
    }
    
    var lines = new Array();
    
    for (i = 0; i < sinbin.length; i++) {
        lines.push(sinbin[i][0] + "=" + sinbin[i][1] + "=" + sinbin[i][2]);
    }
    
    $.saveArray(lines, "sinbin", false);
}

$.on('command', function(event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender);
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args = event.getArgs ();
    var i;
    var lines;
    var found;
	
    if (command.equalsIgnoreCase("chat") && username.equalsIgnoreCase($.botname)) {
        $.say (argsString);
    } else if (command.equalsIgnoreCase("purge")) {
        if ($.isMod(sender)) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 225, username + " purged " + args[0]);
                
                timeoutUser (args[0], 1);
            } else {
                $.say ("You must specify a user to purge")
            }
        } else {
            $.say ($.modmsg);
        }		
    } else if (command.equalsIgnoreCase("forgive")) {
        if ($.isAdmin(sender)) {
            if (args.length == 1) {
                for (i = 0; i < sinbin.length; i++) {
                    if (args[0].equalsIgnoreCase(sinbin[i][0])) {

                        sinbin[i][1]--;
                        
                        $.logEvent("chatModerator.js", 242, username + " forgave " + args[0] + ". Now at " + sinbin[i][1] + " strike(s)");
                        
                        $.say("Reduced " + args[0] + " to " + sinbin[i][1] + " strike(s)!");
                    }
                }
     
                lines = new Array();
    
                for (i = 0; i < sinbin.length; i++) {
                    if (i < sinbin.length && sinbin[i][1] <= 0) {
                        sinbin.splice(i, 1);
                        i--;
                    }
                }
                
                for (i = 0; i < sinbin.length; i++) {
                    if (sinbin[i][1] > 0) {
                        lines.push(sinbin[i][0] + "=" + sinbin[i][1] + "=" + sinbin[i][2]);
                    }
                }
    
                $.saveArray(lines, "sinbin", false);
            } else {
                $.say ("You must specify a user to forgive");
            }
        } else {
            $.say ($.adminmsg);
        }
    } else if (command.equalsIgnoreCase("increase")) {
        if ($.isAdmin(sender)) {
            if (args.length == 1) {
                found = false;
                
                for (i = 0; i < sinbin.length; i++) {
                    if (args[0].equalsIgnoreCase(sinbin[i][0])) {

                        sinbin[i][1]++;
                        
                        $.logEvent("chatModerator.js", 280, username + " gave a strike to " + args[0] + ". Now at " + sinbin[i][1] + " strike(s)");
                        
                        $.say("Increased " + args[0] + " to " + sinbin[i][1] + " strike(s)!");
                        
                        found = true;
                    }
                }
                
                if (found == false) {
                    sinbin.push(new Array(args[0].toLowerCase(), 1, System.currentTimeMillis()));
                    
                    $.logEvent("chatModerator.js", 291, username + " gave a strike to " + args[0] + ". Now at 1 strike(s)");
                    
                    $.say("Increased " + args[0] + " to 1 strike(s)!");
                }
     
                lines = new Array();
                
                for (i = 0; i < sinbin.length; i++) {
                    if (sinbin[i][1] > 0) {
                        lines.push(sinbin[i][0] + "=" + sinbin[i][1] + "=" + sinbin[i][2]);
                    }
                }
    
                $.saveArray(lines, "sinbin", false);
            } else {
                $.say ("You must specify a user to increase");
            }
        } else {
            $.say ($.adminmsg);
        }
    } else if (command.equalsIgnoreCase("autopurge")) {
        if ($.isMod(sender)) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 314, username + " issued an auto punishment to " + args[0]);
                
                autoPurgeUser(args[0], autopurgemessage);
            } else {
                $.say ("You must specify a user to autopurge");
            }
        } else {
            $.say ($.adminmsg);
        }
    } else if (command.equalsIgnoreCase("timeout")) {
        if ($.isMod(sender)) {
            if (args.length == 1) {
                $.logEvent("chatModerator.js", 326, username + " timed out " + args[0] + " for 600 second(s)");
                
                timeoutUserFor (args[0], 600);
            } else if (args.length == 2 && !isNaN(args[1])) {
                $.logEvent("chatModerator.js", 330, username + " timed out " + args[0] + " for " + args[1] + " second(s)");
                
                timeoutUserFor (args[0], args[1]);
            } else {
                $.say ("You must specify a user to timeout")
            }
        } else {
            $.say ($.adminmsg);
        }
    } else if (command.equalsIgnoreCase("permit")) {
        if ($.isMod(sender)) {
            if ($.strlen(argsString) > 0 && linksallowed == false) {
                permitList.push(new Array(argsString, System.currentTimeMillis() + (permittime * 1000)));
                
                $.logEvent("chatModerator.js", 344, username + " permitted " + args[0]);
                
                $.say (argsString + " is permitted to post a link during the next " + permittime + " seconds!");
            }
        } else {
            $.say ($.modmsg);
        }	
    } else if (command.equalsIgnoreCase("ban")) {
        if ($.isMod(sender)) {
            if (args.length == 2) {
                var time = parseInt(args[1]);
                
                if (time <= 0) {
                    $.say (time + " is not a valid amount of time");
                }
                
                $.logEvent("chatModerator.js", 360, username + " banned " + args[0] + " for " + time + " hour(s)");
                
                banUserFor (args[0], time * 60 * 60);
                
                if (time != 1) {
                    $.say (args[0] + " banned for " + time + " hours");
                } else {
                    $.say (args[0] + " banned for 1 hour");
                }
            } else {
                $.logEvent("chatModerator.js", 370, username + " banned " + args[0] + " indefinitely");
                
                banUser (args[0]);
                
                $.say (args[0] + " banned indefinitely");
            }
        } else {
            $.say ($.modmsg);
        }
    } else if (command.equalsIgnoreCase("unban")) {
        if ($.isMod(sender)) {
            $.logEvent("chatModerator.js", 381, username + " unbanned " + args[0]);
			
            unbanUser (args[0]);
            
            $.say (args[0] + " is no longer banned");
        } else {
            $.say ($.modmsg);
        }
    } else if (command.equalsIgnoreCase("clear")) {
        if ($.isMod(sender)) {
            $.logEvent("chatModerator.js", 391, username + " cleared chat");
            
            clearChat();
            
            setTimeout(function() {
                $.say(username + " cleared chat!");
            }, 1000);
        } else {
            $.say ("Only a Moderator can use this command! " + username);
        }	
    } else if (command.equalsIgnoreCase("autoban")) {
        if ($.isMod(sender)) {
            if ($.strlen(argsString) > 0) {
                $.logEvent("chatModerator.js", 404, username + " added a phrase to the autoban list: " + argsString);
                
                autoBanPhrases.push(argsString);
            
                var num_phrases = $.inidb.get("autobanphrases", "num_phrases");
                
                if (isNaN(num_phrases)) {
                    num_phrases = 0;
                }
                
                $.inidb.set("autobanphrases", "phrase_" + num_phrases, argsString);
                $.inidb.incr("autobanphrases", "num_phrases", 1);
            
                $.say("Added a phrase to the autoban list! This can only be undone manually!");
            }
        } else {
            $.say ($.modmsg);
        }	
    } else if (command.equalsIgnoreCase("chatmod")) {
        if ($.isMod(sender)) {
            if (args.length < 1 || args[0].equalsIgnoreCase("help")) {
                $.say("Usage: !chatmod <option> [new value]");
                $.say("-Options: warningcountresettime, timeouttype, autopurgemessage, capsallowed, capstriggerratio, capstriggerlength, "
                    + "capsmessage, linksallowed, permittime, youtubeallowed, subsallowed, linksmessage, spamallowed, spamlimit, spammessage");
                $.say(">>symbolsallowed, symbolslimit, symbolsrepeatlimit, symbolsmessage, repeatallowed, repeatlimit, repeatmessage, graphemeallowed, "
                    + "graphemelimit, graphememessage, "
                    + "warning1type, warning2type, warning3type, warning1message, warning2message, warning3message");
            } else {
                var val;
                
                if (args.length > 1) {
                    argsString = argsString.substring(argsString.indexOf(args[0]) + $.strlen(args[0]) + 1);
                    
                    $.logEvent("chatModerator.js", 437, username + " attempted to change chat moderation setting " + args[0] + " to " + argsString);
                }
                
                if (args[0].equalsIgnoreCase("warningcountresettime")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current amount of time, in seconds, after which a users link/caps warning count is reset is " + warningcountresettime + " seconds. To change it use: !chatmod warningcountresettime <-1 for never, time>");
                    } else {
                        if (val < 0) {
                            val = -1;
                        }
                        
                        $.inidb.set("settings", "warningcountresettime", argsString);
                        
                        warningcountresettime = val;
                        
                        if (val < 0) {
                            $.say("Changed warning count reset time to never!");
                        } else {
                            $.say("Changed warning count reset time to " + val + " seconds!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("timeouttype")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("ban") && !val.equalsIgnoreCase("timeout"))) {
                        $.say("Timeouts are currently issued using " + timeouttype + "s. To change it use: !chatmod timeouttype <'ban' or 'timeout'>");
                    } else {
                        $.inidb.set("settings", "timeouttype", val);
                        
                        timeouttype = val;
                        
                        $.say("Timeouts are now issues using " + val + "s!");
                    }
                } else if (args[0].equalsIgnoreCase("autopurgemessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current manual autopurge message is '" + autopurgemessage + "'. To change it use: !chatmod autopurgemessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "autopurgemessage", val);
                        
                        autopurgemessage = val;
                        
                        $.say("Changed manual autopurge message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("capsallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (capsallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Caps are currently " + val + ". To change it use: !chatmod capsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "capsallowed", val);
                        
                        capsallowed = val.equalsIgnoreCase("1");
                        
                        if (capsallowed) {
                            $.say("Caps are now allowed!");
                        } else {
                            $.say("Caps are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("capstriggerratio")) {
                    val = parseFloat(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current percentage of caps required to trigger a caps warning is " + capstriggerratio + ". To change it use: !chatmod capstriggerratio <number between 0.2 and 1.0>");
                    } else {
                        if (val > 1.0) {
                            val = val / 100;
                        }
                        
                        if (val > 1.0) {
                            val = 1.0;
                        }
                        
                        if (val < 0.2) {
                            val = 0.2;
                        }
                        
                        $.inidb.set("settings", "capstriggerratio", val);
                        
                        capstriggerratio = val;
                        
                        $.say("Changed caps warning trigger percentage to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("capstriggerlength")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current message length required to check for caps is " + capstriggerlength + ". To change it use: !chatmod capstriggerlength <number greater than 0>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }
                        
                        $.inidb.set("settings", "capstriggerlength", val);
                        
                        capstriggerlength = val;
                        
                        $.say("Changed caps warning minimum message length to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("capsmessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current caps warning message is '" + capsmessage + "'. To change it use: !chatmod capsmessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "capsmessage", val);
                        
                        capsmessage = val;
                        
                        $.say("Changed caps warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("linksallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (linksallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Links are currently " + val + ". To change it use: !chatmod linksallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "linksallowed", val);
                        
                        linksallowed = val.equalsIgnoreCase("1");
                        
                        if (linksallowed) {
                            $.say("Links are now allowed!");
                        } else {
                            $.say("Links are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("permittime")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current permit time is " + permittime + " seconds. To change it use: !chatmod permittime <number that is at least 60>");
                    } else {
                        if (val < 60) {
                            val = 60;
                        }
                        
                        $.inidb.set("settings", "permittime", val);
                        
                        permittime = val;
                        
                        $.say("Changed permit time to " + val + " seconds!");
                    }
                } else if (args[0].equalsIgnoreCase("youtubeallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (youtubeallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Youtube links are currently " + val + ". To change it use: !chatmod youtubeallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "youtubeallowed", val);
                        
                        youtubeallowed = val.equalsIgnoreCase("1");
                        
                        if (youtubeallowed) {
                            $.say("Youtube links are now allowed!");
                        }
                        else {
                            $.say("Youtube links are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("subsallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (subsallowed) {
                            val = "allowed";
                        } else {
                            val = "NOT allowed";
                        }
                        
                        $.say("Subscribers are currently " + val + " to post links. To change it use: !chatmod subsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        } else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "subsallowed", val);
                        
                        subsallowed = val.equalsIgnoreCase("1");
                        
                        if (subsallowed) {
                            $.say("Subscribers are now allowed to post links!");
                        } else {
                            $.say("Subscribers are no longer allowed to post links!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("linksmessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current link warning message is '" + linksmessage + "'. To change it use: !chatmod linksmessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "linksmessage", val);
                        
                        linksmessage = val;
                        
                        $.say("Changed link warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("spamallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (spamallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Chat spam is currently " + val + ". To change it use: !chatmod spamallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "spamallowed", val);
                        
                        spamallowed = val.equalsIgnoreCase("1");
                        
                        if (spamallowed) {
                            $.say("Chat spam is now allowed!");
                        } else {
                            $.say("Chat spam is now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("spamlimit")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current number of messages allowed per 30 seconds is " + spamlimit + ". To change it use: !chatmod spamlimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }
                        
                        $.inidb.set("settings", "spamlimit", val);
                        
                        spamlimit = val;
                        
                        $.say("Changed number of messages allowed per 30 seconds to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("spammessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current spam warning message is '" + spammessage + "'. To change it use: !chatmod spammessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "spammessage", val);
                        
                        spammessage = val;
                        
                        $.say("Changed spam warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("symbolsallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (symbolsallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Symbol spam is currently " + val + ". To change it use: !chatmod symbolsallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "symbolsallowed", val);
                        
                        symbolsallowed = val.equalsIgnoreCase("1");
                        
                        if (symbolsallowed) {
                            $.say("Symbol spam is now allowed!");
                        } else {
                            $.say("Symbol spam is now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("symbolslimit")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current maximum number of symbols allowed in a message is " + symbolslimit + ". To change it use: !chatmod symbolslimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }
                        
                        $.inidb.set("settings", "symbolslimit", val);
                        
                        symbolslimit = val;
                        
                        $.say("Changed number of symbols allowed per message to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("symbolsrepeatlimit")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The current maximum repeating symbols sequence allowed in a message is " + symbolsrepeatlimit + ". To change it use: !chatmod symbolsrepeatlimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }
                        
                        $.inidb.set("settings", "symbolsrepeatlimit", val);
                        
                        symbolsrepeatlimit = val;
                        
                        $.say("Changed maximum repeating symbols sequence allowed in a message to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("symbolsmessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current symbols warning message is '" + symbolsmessage + "'. To change it use: !chatmod symbolsmessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "symbolsmessage", val);
                        
                        symbolsmessage = val;
                        
                        $.say("Changed symbols warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("repeatallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (repeatallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Repeating character spam is currently " + val + ". To change it use: !chatmod repeatallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "repeatallowed", val);
                        
                        repeatallowed = val.equalsIgnoreCase("1");
                        
                        if (repeatallowed) {
                            $.say("Repeating character spam is now allowed!");
                        } else {
                            $.say("Repeating character spam is now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("repeatlimit")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The maximum number of repeating sequences/repeating sequence length is " + repeatlimit + ". To change it use: !chatmod repeatlimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }
                        
                        $.inidb.set("settings", "repeatlimit", val);
                        
                        repeatlimit = val;
                        
                        $.say("Changed maximum number of repeating sequences/repeating sequence length to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("repeatmessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current repeating character warning message is '" + repeatmessage + "'. To change it use: !chatmod repeatmessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "repeatmessage", val);
                        
                        repeatmessage = val;
                        
                        $.say("Changed repeating character warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("graphemeallowed")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("false") && !val.equalsIgnoreCase("true"))) {
                        if (graphemeallowed) {
                            val = "allowed";
                        } else {
                            val = "moderated";
                        }
                        
                        $.say("Long grapheme clusters are currently " + val + ". To change it use: !chatmod graphemeallowed <'true' or 'false'>");
                    } else {
                        if (val.equalsIgnoreCase("true")) {
                            val = "1";
                        }
                        else {
                            val = "0";
                        }
                        
                        $.inidb.set("settings", "graphemeallowed", val);
                        
                        graphemeallowed = val.equalsIgnoreCase("1");
                        
                        if (graphemeallowed) {
                            $.say("Long grapheme clusters are now allowed!");
                        } else {
                            $.say("Long grapheme clusters are now moderated!");
                        }
                    }
                } else if (args[0].equalsIgnoreCase("graphemelimit")) {
                    val = parseInt(argsString);
                    
                    if (args.length == 1 || isNaN(val)) {
                        $.say("The maximum allowed grapheme cluster length is " + graphemelimit + ". To change it use: !chatmod graphemelimit <number, at least 1>");
                    } else {
                        if (val < 1) {
                            val = 1;
                        }
                        
                        $.inidb.set("settings", "graphemelimit", val);
                        
                        graphemelimit = val;
                        
                        $.say("Changed maximum allowed grapheme cluster length to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("graphememessage")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current long grapheme cluster are warning message is '" + graphememessage + "'. To change it use: !chatmod graphememessage <any text>");
                    } else {
                        
                        $.inidb.set("settings", "graphememessage", val);
                        
                        graphememessage = val;
                        
                        $.say("Changed long grapheme cluster warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("warning1type")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("purge") && !val.equalsIgnoreCase("ban") && !isNaN(val))) {
                        if (warningtypes[0].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[0].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[0] + " seconds";
                        }
                        
                        $.say("The current action taken upon first warning is " + val + ". To change it use: !chatmod warning1type <'purge', 'ban', or the number of seconds to timeout for>");
                    } else {
                        
                        $.inidb.set("settings", "warning1type", val);
                        
                        warningtypes[0] = val;
                        
                        if (warningtypes[0].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[0].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[0] + " seconds";
                        }
                        
                        $.say("Changed first warning action to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("warning2type")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("purge") && !val.equalsIgnoreCase("ban") && !isNaN(val))) {
                        if (warningtypes[1].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[1].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[1] + " seconds";
                        }
                        
                        $.say("The current action taken upon second warning is " + val + ". To change it use: !chatmod warning2type <'purge', 'ban', or the number of seconds to timeout for>");
                    } else {
                        
                        $.inidb.set("settings", "warning2type", val);
                        
                        warningtypes[1] = val;
                        
                        if (warningtypes[1].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[1].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[1] + " seconds";
                        }
                        
                        $.say("Changed second warning action to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("warning3type")) {
                    val = argsString;
                    
                    if (args.length == 1 || (!val.equalsIgnoreCase("purge") && !val.equalsIgnoreCase("ban") && !isNaN(val))) {
                        if (warningtypes[2].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[2].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[2] + " seconds";
                        }
                        
                        $.say("The current action taken upon third/final warning is " + val + ". To change it use: !chatmod warning3type <'purge', 'ban', or the number of seconds to timeout for>");
                    } else {
                        
                        $.inidb.set("settings", "warning3type", val);
                        
                        warningtypes[2] = val;
                        
                        if (warningtypes[2].equalsIgnoreCase("purge")) {
                            val = "purge";
                        } else if (warningtypes[2].equalsIgnoreCase("ban")) {
                            val = "permanent ban";
                        } else {
                            val = "timeout for " + warningtypes[2] + " seconds";
                        }
                        
                        $.say("Changed third/final warning action to " + val + "!");
                    }
                } else if (args[0].equalsIgnoreCase("warning1message")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current first warning message is '" + warningmessages[0] + "'. To change it use: !chatmod warning1message <any text>");
                    } else {
                        
                        $.inidb.set("settings", "warning1message", val);
                        
                        warningmessages[0] = val;
                        
                        $.say("Changed first warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("warning2message")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current second warning message is '" + warningmessages[1] + "'. To change it use: !chatmod warning2message <any text>");
                    } else {
                        
                        $.inidb.set("settings", "warning2message", val);
                        
                        warningmessages[1] = val;
                        
                        $.say("Changed second warning message to '" + val + "'!");
                    }
                } else if (args[0].equalsIgnoreCase("warning3message")) {
                    val = argsString;
                    
                    if (args.length == 1) {
                        $.say("The current third/final warning message is '" + warningmessages[2] + "'. To change it use: !chatmod warning3message <any text>");
                    } else {
                        
                        $.inidb.set("settings", "warning3message", val);
                        
                        warningmessages[2] = val;
                        
                        $.say("Changed third/final warning message to '" + val + "'!");
                    }
                }
            }
        } else {
            $.say ($.modmsg);
        }	
    }
});

$.on('ircChannelMessage', function(event) {
    var sender = event.getSender().toLowerCase();
    var chatName = $.username.resolve(sender);
    var username = chatName.toLowerCase();
    var message = event.getMessage();
    var omessage = message;
    
    var msglen = -1;
    var phlen = -1;

    msglen = $.strlen(message);
    
    var caps = event.getCapsCount();
    var capsRatio = (caps * 1.0) / msglen;
    var i;
    
    var numsymbols = $.getNumberOfNonLetters(event);
    var rptsymbols = $.getLongestNonLetterSequence(event);
    var numrepeat = $.getNumberOfRepeatSequences(event);
    var rptrepeat = $.getLongestRepeatedSequence(event);
    var grapheme = $.getLongestUnicodeGraphemeCluster(event);
    
    
    if (message != null && message != undefined) {
        message = message.toLowerCase();
    }

    for (i = 0; i < autoBanPhrases.length; i++) {
        phlen = $.strlen(autoBanPhrases[i]);

        if (autoBanPhrases[i] != null && autoBanPhrases[i] != undefined && message.indexOf(autoBanPhrases[i].toLowerCase()) != -1
            && !$.isMod(sender) && phlen > 0) {
            $.logEvent("chatModerator.js", 1123, "Autoban triggered by " + username + ". Message: " + omessage);
            
            banUser(username);
            
            $.say (username + " auto-banned indefinitely for using banned phrase #" + i);
            return;
        }
    }
	
    if (linksallowed == false && $.hasLinks(event, false) && !$.isMod(sender) && (!$.isSub(sender) || !subsallowed)) {
        //Change the second parameter to true to fallback to the Java version instead
        var permitted = false;
            
        for (i = 0; i < permitList.length; i++) {
            if (i < permitList.length) {
                if (permitList[i][0] != null && permitList[i][0] != undefined && permitList[i][0].toLowerCase().equalsIgnoreCase(sender)) {
                    if (permitList[i][1] >= System.currentTimeMillis()) {
                        permitted = true;
                    }
                    
                    permitList.splice(i, 1);
                    i--;
                }
            }
        }
            
        if (youtubeallowed == true && (message.indexOf("youtube.com") != -1 || message.indexOf("youtu.be") != -1)) {
            permitted = true;
        }
            
        if (permitted == false) {
            $.logEvent("chatModerator.js", 1154, "Automatic link punishment triggered by " + username + ". Link: " + $.getLastLink() + "      Message: " + omessage);
                
            autoPurgeUser(username, linksmessage);
        }
    } else if (capsallowed == false && capsRatio > capstriggerratio && msglen > capstriggerlength && !$.isMod(sender)) {
        timeoutUser(sender, 1);
        
        $.say(username + " -> " + capsmessage + " [Purged]");
        
        $.logEvent("chatModerator.js", 1163, "Automatic caps punishment triggered by " + username + ". Message Length: " + $.strlen(message) + "    Caps Ratio: " + capsRatio + "    Message: " + omessage);
    } else if (!symbolsallowed && !$.isMod(sender) && (numsymbols > symbolslimit || rptsymbols > symbolsrepeatlimit)) {
        timeoutUser(sender, 1);
        
        $.say(username + " -> " + symbolsmessage + " [Purged]");
        
        $.logEvent("chatModerator.js", 1193, "Automatic symbols punishment triggered by " + username + ". Longest symbol sequence: " + rptsymbols + ". Total symbols: " + numsymbols + ". Message: " + omessage);
    } else if (!repeatallowed && !$.isMod(sender) && (numrepeat > repeatlimit || rptrepeat > repeatlimit) && rptrepeat > 6) {
        timeoutUser(sender, 1);
        
        $.say(username + " -> " + repeatmessage + " [Purged]");
        
        $.logEvent("chatModerator.js", 1199, "Automatic repeat punishment triggered by " + username + ". Longest repeat sequence: " + rptrepeat + ". Total repeat sequences: " + numrepeat + ". Message: " + omessage);
    } else if (!graphemeallowed && !$.isMod(sender) && grapheme > graphemelimit) {
        timeoutUser(sender, 1);
        
        $.say(username + " -> " + graphememessage + " [Purged]");
        
        $.logEvent("chatModerator.js", 1205, "Automatic grapheme punishment triggered by " + username + ". Longest grapheme sequence: " + grapheme + ". Message: " + omessage);
    } else if (!spamallowed && !$.isMod(sender)) {
        var idx = -1;
        
        for (i = 0; i < $.spamtracker.length; i++) {
            if ($.spamtracker[i][0].equalsIgnoreCase(sender)) {
                idx = i;
            }
        }
        
        if (idx == -1) {
            $.spamtracker.push(new Array(sender, 0, new Array()));
            idx = $.spamtracker.length -1;
        }
        
        $.spamtracker[idx][1]++;
        $.spamtracker[idx][2].push(System.currentTimeMillis() + (30 * 1000));
        
        if ($.spamtracker[idx][1] >= spamlimit) {
            timeoutUserFor(sender, 30);
            
            $.say(username + " -> " + spammessage + " [Timed Out (30)]");
            
            $.logEvent("chatModerator.js", 1186, "Automatic spam punishment triggered by " + username + ". Messages in the last 30 seconds: " + $.spamtracker[idx][1]);
        }
    }
});

$.registerChatCommand("./util/chatModerator.js", "purge", "mod");
$.registerChatCommand("./util/chatModerator.js", "timeout", "mod");
$.registerChatCommand("./util/chatModerator.js", "ban", "mod");
$.registerChatCommand("./util/chatModerator.js", "unban", "mod");
$.registerChatCommand("./util/chatModerator.js", "clear", "mod");
$.registerChatCommand("./util/chatModerator.js", "autopurge", "mod");
$.registerChatCommand("./util/chatModerator.js", "autoban", "mod");
$.registerChatCommand("./util/chatModerator.js", "permit", "mod");
$.registerChatCommand("./util/chatModerator.js", "chatmod", "mod");

$.timer.addTimer("./util/chatModerator.js", "maintainlists", true, function() {
    var reformed = $.bancache.getReformedUsers();
    var l = reformed.length;
    var i;
    
    for (i = 0; i < l; ++i) {
        unbanUser (reformed[i]);
    }
    
    $.bancache.syncToFile ("bannedUsers.bin");
    
    for (i = 0; i < permitList.length; i++) {
        if (i < permitList.length) {
            if (permitList[i][1] < System.currentTimeMillis()) {
                permitList.splice(i, 1);
                i--;
            }
        }
    }
    
    for (i = 0; i < $.spamtracker.length; i++) {
        if (i < $.spamtracker.length) {
            for (var b = 0; b < $.spamtracker[i][2].length; b++){
                if (b < $.spamtracker[i][2].length) {
                    if ($.spamtracker[i][2][b] < System.currentTimeMillis()) {
                        $.spamtracker[i][2].splice(b, 1);
                        $.spamtracker[i][1]--;
                        b--;
                    }
                }
            }
            
            if ($.spamtracker[i][1] <= 0 || $.spamtracker[i][2].length == 0) {
                $.spamtracker.splice(i, 1);
                i--;
            }
        }
    }
}, 1000);

var num_phrases = parseInt($.inidb.get("autobanphrases", "num_phrases"));

for (i = 0; i < num_phrases; i++) {
    autoBanPhrases.push($.inidb.get("autobanphrases", "phrase_" + i));
}
