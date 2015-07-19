$var.defaultplaylist = $.readFile("./addons/youtubePlayer/playlist.txt");
$var.defaultplaylistpos = 0;
$var.songqueue = [];
$var.requestusers = {};
$.song_limit = parseInt($.inidb.get('settings','song_limit'));
$.song_toggle = parseInt($.inidb.get('settings','song_toggle'));
$.storepath = $.inidb.get('settings','song_storepath');
$.storing = parseInt($.inidb.get('settings','song_storing'));
$.titles = parseInt($.inidb.get('settings','song_titles'));
$.song = null;
$.songrequester = null;
$.songname = null;
$.songid = null;
$.songurl = null;
$.songprefix = null;
$.song_shuffle = $.inidb.get('settings','song_shuffle');
$var.playChoice = false;


if ($.song_limit === null || isNaN($.song_limit) || $.song_limit < 0) {
    $.song_limit = 3;
}

if($.song_toggle===null || $.song_toggle==="") {
    $.song_toggle = 1;
}

if($.storepath===null || $.storepath==="" || $.strlen($.storepath) === 0) {
    $.storepath = "web/";
}

if($.storing===null || $.storing==="") {
    $.storing = 1;
}

if($.titles===null || $.titles==="") {
    $.titles = 2;
}

if ($.song_shuffle === null || $.song_shuffle === "" || $.song_shuffle === 0) {
    $.song_shuffle = false;
}

reloadPlaylist = function() {
    $var.defaultplaylist = $.readFile("./addons/youtubePlayer/playlist.txt");
    $.parseDefault();
}
notSearchable = function() {
                    this.id = null;
                    this.name = "";
                    this.length = 0;
                    $.say("Song not searchable due to API error. Please try again.");
                    if ($.inidb.exists("pricecom", "addsong") && parseInt($.inidb.get("pricecom", "addsong"))> 0 ){
                        if(!$.isMod(user)){
                            var cost = $.inidb.get("pricecom", "addsong");
                            $.say("The command cost of " + cost + " " + $.pointname + " has been returned to " + $.username.resolve(user));
                            $.inidb.incr("points", user.toLowerCase(), cost);
                            $.inidb.SaveAll();
                        }
                    }
                    return;
};

function Song(name, user) {
    this.user = user;
    if (name===null || name==="") return;
        var data = $.youtube.SearchForVideo(name);
        while(data[0]===""){
            data = $.youtube.SearchForVideo(name);
            if (data[0]!=="") {
                break;
            }
        }
        this.id = data[0];
        this.name = data[1];
        this.length = 1;
        if(data[0]==="") {
            notSearchable();
        }
                    
    this.getId = function () {
        return this.id;
    };
    
    this.getLength = function () {
        var ldata = $.youtube.GetVideoLength(this.id);
        while(ldata[0]===0 && ldata[1]===0 && ldata[2]===0) {
            ldata = $.youtube.GetVideoLength(this.id);
            if (ldata[2]!==0) {
                break;
            }
        }
        if(ldata[0]===0 && ldata[1]===0 && ldata[2]===0) {
            notSearchable();
        }
        return ldata[2];
    };

    this.cue = function () {
        $.musicplayer.cue(this.id);
    };

    this.getName = function () {
        return this.name;
    };
    
    this.getUser = function () {
        return this.user;
    };
}

function RequestedSong(song, user) {
    this.song = song;
    this.user = user;

    this.request = function () {
        if (!this.canRequest()) return;

        $var.songqueue.push(this);

        if ($var.requestusers[user] !== null) {
            $var.requestusers[user]++;
        } else {
            $var.requestusers[user] = 0;
        }
    };

    this.canRequest = function () {
        if ($var.requestusers[user] === null) return true;

        var requestlimit = $.song_limit;

        if (($var.requestusers[user] < requestlimit) || isModv3(user)) return true;
    };

    this.canRequest2 = function () {
        if ($var.requestusers[user] === null) return true;

        for (var i in $var.songqueue) {
            if (this.song.id === $var.songqueue[i].song.id && !isModv3(user)) return false;
        }
        return true;
    };

    this.play = function () {
        song.cue();
        $var.requestusers[user]--;
    };
}



$.parseDefault = function parseDefault() {
    
    if($var.defaultplaylist.length > 0  && $.storing===1) {
        $.println("Parsing default playlist, please wait...");
        $.writeToFile("",$.storepath + "default.html", false);
        $.writeToFile("",$.storepath + "default.txt", false);

        for(var i=0; i< $var.defaultplaylist.length; i++){
            $.song = new Song($var.defaultplaylist[i],"");
            $.songname = $.song.getName();
            $.songid = $.song.getId();
                
            if ($.titles===1){
                $.songurl = '<a href="https://www.youtube.com/watch?v=' + $.songid + '" target="new"><div style="width: 150px; float: left;" class="playlistid">' + $.songid + '</div></a><div style="float: left;" class="playlistname"> ' + i.toString() + ". " + $.songname + "</div></br>";
                $.writeToFile($.songurl, $.storepath + "default.html", true);
            }
            else {
                $.songprefix = $.songid + " " + i.toString() + ". " + $.songname;
                $.writeToFile($.songprefix, $.storepath + "default.txt", true);
            }
        }
        $.println("Parsing playlist complete.");
    }
}

$.parseSongQueue = function parseSongQueue() {
 
    if($.storing===1 && $var.currSong!=null) {
    $.println("Parsing song request playlist, please wait...");
    $.writeToFile("",$.storepath + "requests.html", false);
    $.writeToFile("",$.storepath + "requests.txt", false);
    
    $.songrequester = $var.currSong.song.getUser();
    $.songname = $var.currSong.song.getName();
    $.songid = $var.currSong.song.getId();
        
    if ($.titles===1){
        $.songurl = '<a href="https://www.youtube.com/watch?v=' + $.songid + '" target="new"><div style="width: 150px;float: left;"  class="playlistid">' + $.songid + '</div></a><div style="float: left;" class="playlistname">' + $.songname + " - " + $.songrequester + "</div></br>";
        $.writeToFile($.songurl, $.storepath + "requests.html", true);
    } else {
        $.songprefix = $.songid + " " + $.songname + " - " + $.songrequester + "\n";
        $.writeToFile($.songprefix, $.storepath + "requests.txt", true);  
    }
        
    if($var.songqueue.length > 0) {
        
        for(var i=0; i< $var.songqueue.length; i++){
            $.songrequester = $var.songqueue[i].song.getUser();
            $.songname = $var.songqueue[i].song.getName();
            $.songid = $var.songqueue[i].song.getId();
                
            if ($.titles===1){
                $.songurl = '<a href="https://www.youtube.com/watch?v=' + $.songid + '" target="new"><div style="width: 150px;float: left;"  class="playlistid">' + $.songid + '</div></a><div style="float: left;"  class="playlistname"> ' + i.toString() + ". " + $.songname + " - " + $.songrequester + "</div></br>";
                $.writeToFile($.songurl, $.storepath + "requests.html", true);
            } else {
                $.songprefix = $.songid + " " + i.toString() + ". " + $.songname + " - " + $.songrequester + "\n";
                $.writeToFile($.songprefix, $.storepath + "requests.txt", true);
            }
        }
        
    }
    $.println("Parsing playlist complete.");
    }
}

function nextDefault() {
    var name = "";
    var user = "";
    //var s = new Song(null, "");

    if ($var.currSong !== null) {
        return;
    }

    if ($var.defaultplaylist === null || $var.defaultplaylist === undefined) {
        if ($var.defaultplaylistretry === null || $var.defaultplaylistretry === undefined) {
            $var.defaultplaylistretry = 0;
        }

        if ($var.defaultplaylistretry < 3) {
            $var.defaultplaylistretry++;

            setTimeout(function () {
                if ($.fileExists("./addons/youtubePlayer/playlist.txt")) {
                    $var.defaultplaylist = $.readFile("./addons/youtubePlayer/playlist.txt");
                } else if ($.fileExists("../addons/youtubePlayer/playlist.txt")) {
                    $var.defaultplaylist = $.readFile("../addons/youtubePlayer/playlist.txt");
                }

                $var.defaultplaylistpos = 0;
            }, 1);

            setTimeout(function () {
                nextDefault();
            }, 3000);
        }

        return;
    }

    if ($var.defaultplaylist.length > 0) {
        var playlistpos;
        if($.song_shuffle===true && ($var.playChoice===false || $var.playChoice===null)) {
            playlistpos = $.randRange(0, $var.defaultplaylist.length);
            $var.defaultplaylistpos = playlistpos;
        } else {
           playlistpos = $var.defaultplaylistpos;
        }
        var s = new RequestedSong(new Song($var.defaultplaylist[playlistpos],""), "DJ " + $.username.resolve($.botname));
        
        $var.defaultplaylistpos++;

        if ($var.defaultplaylistpos >= $var.defaultplaylist.length) {
            $var.defaultplaylistpos = 0;
        }
        s.play();
        name = s.song.getName();
        user = s.user;

        $var.prevSong = $.currSong;
        $var.currSong = s;
        $var.playChoice = false;

    } else {
        $var.currSong = null;
    }

    if ($var.currSong === null) {
        return;
    }
    
    if ($.song_toggle === 1) {
        $.say("[\u266B] Now Playing -- " + name + " -- requested by @" + user);
    } else if ($.song_toggle === 2) {
        println("[\u266B] Now Playing -- " + name + " -- requested by @" + user);
    }
    
    if (user.equalsIgnoreCase("DJ " + $.username.resolve($.botname))) {
        $.writeToFile(name + " ", "./addons/youtubePlayer/currentsong.txt", false);
    } else if (!user.equalsIgnoreCase("DJ " + $.username.resolve($.botname))){
        $.writeToFile(name + " requested by: " + user + " ", "./addons/youtubePlayer/currentsong.txt", false);
    }
}


function next() {
    var name = "";
    var user = "";
    var s = new Song(null, "");

    if ($var.songqueue.length > 0) {
        s = $var.songqueue.shift();
        s.play();
        name = s.song.getName();
        user = s.user;

        $var.prevSong = $.currSong;
        $var.currSong = s;
        $.println("Loading request list...");
        parseSongQueue();
        $.println("Request list loaded.");
          
    } else {
        $var.currSong = null;
    }

    if ($var.currSong === null) {
        println("The song request queue is empty! Request a new song with !addsong or !songrequest <youtube link>");
        nextDefault();
        return;
    }

    if ($.song_toggle === 1) {
        $.say("[\u266B] Now Playing -- " + name + " -- requested by @" + user);

    } else if ($.song_toggle === 2) {
        println("[\u266B] Now Playing -- " + name + " -- requested by @" + user);
    }
    
    var nextMsg = "The song request queue is empty! Request a new song with !addsong or !songrequest <youtube link>";
            
    if ($var.songqueue.length > 0) {
        nextMsg = "[\u266B] Next song >> " + $var.songqueue[0].song.getName() + " requested by " + $var.songqueue[0].user;
        println(nextMsg);
    }
    if (user.equalsIgnoreCase("DJ " + $.username.resolve($.botname))) {
        $.writeToFile(name + " ", "./addons/youtubePlayer/currentsong.txt", false);
    } else if (!user.equalsIgnoreCase("DJ " + $.username.resolve($.botname))){
        $.writeToFile(name + " requested by: " + user + " ", "./addons/youtubePlayer/currentsong.txt", false);
    }
}

$.on('musicPlayerState', function (event) {
    if (event.getStateId() === -2) {
        $var.songqueue = [];
        $var.requestusers = {};

        next();
    }

    if (event.getStateId() === 0) {
        next();
    }

    if (event.getStateId() === 5) {
        $.musicplayer.play();
        $.musicplayer.currentId();
    }
});

var musicPlayerConnected = false;

$.on('musicPlayerConnect', function (event) {
    if($.song_toggle===1)
    {

        $.say("[\u266B] Song requests have been enabled!");
    } else {
        println("[\u266B] MusicClient connected!");
    }
    musicPlayerConnected = true;
});

$.on('musicPlayerDisconnect', function (event) {
    if($.song_toggle===1)
    {

        $.say("[\u266B] Song requests have been disabled.");
    } else {
        println("[\u266B] MusicClient disconnected!");
    }
    musicPlayerConnected = false;
});

$.on('command', function (event) {
    var sender = event.getSender();
    var username = $.username.resolve(sender, event.getTags());
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args;
    var song;
    var id;
    var i;

    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }


    if (command.equalsIgnoreCase("song")) {
        action = args[0];
        if (action.equalsIgnoreCase("toggle")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }

            if ($.song_toggle === 2) {

                $.song_toggle = 1;
                $.inidb.set('settings', 'song_toggle', $.song_toggle.toString());
                $.say("[\u266B] Song messages have been turned on!");

            } else {
                $.song_toggle = 2;
                $.inidb.set('settings', 'song_toggle', $.song_toggle.toString());
                $.say("[\u266B] Song messages have been turned off!");
            }
        }
        
        if (action.equalsIgnoreCase("deny")) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }
            $.inidb.set('blacklist', args[1].toLowerCase(), "true");
            $.say(username + " has denied " + $.username.resolve(args[1].toLowerCase()) + " access to song request features.");
            return;
        } 
            
        if (action.equalsIgnoreCase("allow")) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }
            $.inidb.del('blacklist', args[1].toLowerCase());
            $.say(username + " released " + $.username.resolve(args[1]) + " from the blacklist for song request features.");
            return;   
        } 
            
        if (action.equalsIgnoreCase("limit")) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }

            if (args[1] === null) {
                $.say("Current song request limit is: " + $.song_limit);
                return;
            }

            $.inidb.set('settings', 'song_limit', args[1]);
            $.song_limit = parseInt(args[1]);
            $.say("Song request limit has been changed to: " + args[1] + " songs");
        }

        if (action.equalsIgnoreCase("storing")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }

            if ($.storing === 2) {

                $.storing = 1;
                $.inidb.set('settings', 'song_storing', $.storing.toString());
                $.defaultplaylist = $.readFile("./addons/youtubePlayer/playlist.txt");
                $.say("Playlists' positions and titles will now be exported to a readable file.");

            } else {
                $.storing = 2;
                $.inidb.set('settings', 'song_storing', $.storing.toString());
                $.say("Playlist storage has been disabled.");
            }
        }
        
        if (action.equalsIgnoreCase("shuffle")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }

            if ($.song_shuffle === false) {

                $.song_shuffle = true;
                $.inidb.set('settings', 'song_shuffle', "true");
                $.say("Default playlist will now randomly choose songs to be played.");

            } else {
                $.song_shuffle = false;
                $.inidb.set('settings', 'song_shuffle', "false");
                $.say("Playlist shuffling has been disabled.");
            }
        }
        
        if (action.equalsIgnoreCase("storepath")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }
            
            if (args[1].equalsIgnoreCase('viewstorepath')) {
                $.say("Current song storage path: " + $.storepath);
                return;
            }
            
            while (args[1].indexOf('\\') !== -1 && !args[1].equalsIgnoreCase('viewstorepath') && args[1]!=="" && args[1]!==null) {
                args[1] = args[1].replace('\\', '/');
            }
            
            if($.strlen(args[1]) === 0 || args[1].substring($.strlen(args[1]) - 1) !== "/" || !args[1].substring($.strlen(args[1]) - 1).equalsIgnoreCase("/")) {
                args[1] = args[1] + "/";
            }
            
            $.inidb.set('settings','song_storepath', args[1]);
            $.storepath = args[1];
            $.say("Playlist storage path has been set!");
        }
        
        if (action.equalsIgnoreCase("titles")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }

            if ($.titles === 2) {

                $.titles = 1;
                $.inidb.set('settings', 'song_titles', $.titles.toString());
                $.say("Playlist storage has been set to export as html file.");
                $.parseDefault();
                $.parseSongQueue();
            } else {
                $.titles = 2;
                $.inidb.set('settings', 'song_titles', $.titles.toString());
                $.say("Playlist storage has been set to export as text file.");
                $.parseDefault();
                $.parseSongQueue();
            }
        }
        
        if (action.equalsIgnoreCase("reloadplaylist")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }

            reloadPlaylist();
            $.parseSongQueue();
        }

        if (action.equalsIgnoreCase("config")) {
            if ($.song_toggle === 1) {
                $.song_t = "On";
            } else {
                $.song_t = "Off";
            }

            if (musicPlayerConnected === true) {
                $.song_status = "Enabled";
            } else {
                $.song_status = "Disabled";
            }
            
            $.say("[Music Settings] - [Limit: " + $.song_limit + " songs] - [Msgs: " + $.song_t + "] - [Music Player: " + $.song_status + "]");
        }
        if (action.equalsIgnoreCase("steal")) {
            if (!$.isAdmin(sender)) {
                $.say($.adminmsg);
                return;
            }
            if ($var.currSong !== null) {
                var songurl = "https://www.youtube.com/watch?v=" + $var.currSong.song.getId();
                $.musicplayer.stealSong(songurl);
                $var.defaultplaylist = $.readFile("./addons/youtubePlayer/playlist.txt");
                $.say("[\u266B]" + $var.currSong.song.getName() + " -- requested by @" + $var.currSong.user + " has been stolen and added to the default playlist!");
                $.parseDefault();
                return;
            }
        }
			
    }

    if (command.equalsIgnoreCase("addsong")) {

        if ($.inidb.get('blacklist', sender) === "true") {
            //blacklisted, deny
            $.say("You are denied access to song request features!");
            return;
        }
        //start arguments check
        if (args.length === 0) {
            $.say("Type >> '!addsong or !songrequest <youtube link>' to add a song to the playlist.");
            return;
        }

        if (args.length >= 1) {
            if (!musicPlayerConnected) {
                if ($.inidb.exists("pricecom", "addsong") && parseInt($.inidb.get("pricecom", "addsong"))> 0 ){
                    $.say("Music player disabled.");
                    if(!$.isModv3(sender, event.getTags())){

                        var cost = $.inidb.get("pricecom", "addsong");
                        $.say("The command cost of " + cost + " " + $.pointname + " has been returned to " + $.username.resolve(sender, event.getTags()));
                        $.inidb.incr("points", sender.toLowerCase(), cost);
                        $.inidb.SaveAll();
                    }
                }
                return;
            }

            var video = new Song(argsString, sender);

            if (video.id === null) {
                $.say("Song doesn't exist or you typed something wrong.");
                return;
            }
            
            var vlength = parseInt(video.getLength());
            if ( (vlength > 480.0)) {
                $.say("Song >> " + video.getName() + " is over " + parseInt(vlength/60) + " minutes long, maximum length is 8 minutes.");
                return;
            }

            song = new RequestedSong(video, username);

            if (!song.canRequest()) {
                $.say("You've hit your song request limit, " + username + "!");
                return;
            }

            if (!song.canRequest2()) {
                $.say("That song is already in the queue or the default playlist, " + username + "!");
                return;
            }

            $.say("[\u266B] Song -- " + video.name + " was added to the queue by @" + username + ".");
            song.request();

            if ($var.currSong === null) {
                next();
            }
        }
    }
    if (command.equalsIgnoreCase("delsong")) {
        if (!musicPlayerConnected) {
            $.say("Songrequests is currently disabled!");
            return;
        }
        var name = argsString;
                
        if (name === null) {
            $.say("Song doesn't exist or you typed something wrong.");
            return;
        }

        for (i in $var.songqueue) {
            if (name === $var.songqueue[i].song.getId() || $var.songqueue[i].song.getName().toLowerCase().contains(name.toLowerCase())) {
                if ($var.songqueue[i].user === username || $.isModv3(sender, event.getTags())) {
                    $.say("[\u266B] Song -- " + $var.songqueue[i].song.getName() + " has been removed from the queue!");
                    $var.songqueue.splice(i, 1);
                    return;
                } else {
                    $.say($.modmsg);
                    return;
                }
            }
        }

        $.say(sender + ", that song isn't in the list.");
        
    }

    if (command.equalsIgnoreCase("volume")) {
        if (!$.isModv3(sender, event.getTags())) {

            $.say($.modmsg);
            return;
        }

        if (args.length > 0) {
            $.musicplayer.setVolume(parseInt(args[0]));
            $.say("[\u266B] Music volume set to: " + args[0] + "%");
        } else {
            $.musicplayer.currentVolume();
        }
    }

    if (command.equalsIgnoreCase("skipsong")) {
        song = $.musicplayer.currentId();

        if ($.isModv3(sender, event.getTags())) {

            next();
            return;
        }

        if ($var.skipSong) {
            if ($.pollVoters.contains(sender)) {
                $.say(username + ", you have already voted!");
            } else if (makeVote('yes')) {
                $.pollVoters.add(sender);
            }
            return;
        }

        if ($.runPoll(function (result) {
            $var.skipSong = false;
            $.pollResults.get('yes').intValue();

            if (song !== $.musicplayer.currentId()) {
                $.say("The poll failed due to the song ending.");
            }
            if ($.pollResults.get('yes').intValue() === 1) {
                $.say("Skipping song!");
                next();
            } else {
                $.say("Failed to skip the song.");
            }

        }, ['yes', 'nope'], 20 * 3000, $.botname)) {
            $.say("2 more votes are required to skip this song, to vote use '!vote yes'");

            if (makeVote('yes')) {
                $.pollVoters.add(sender);
            }
            $var.skipSong = true;
        } else {
            $.say("A poll to skip a song is already open and running! " + username);
        }
    }
    
    
    if (command.equalsIgnoreCase("vetosong")) {
        $.say(username + ", paid to skip the current song!");

        next();
    }
    if (command.equalsIgnoreCase("currentsong")) {

        if ($.readFile("./addons/youtubePlayer/currentsong.txt")==="") {
            $.say("There is no song playing! Request one with !addsong or !songrequest <youtube link>");
            return;
        }

        $.say("[\u266B] Currently playing -- " + $.readFile("./addons/youtubePlayer/currentsong.txt"));

    }

    if (command.equalsIgnoreCase("nextsong")) {
        if ($var.songqueue.length > 0) {
            $.say("[\u266B] Next song >> \u266B~" + $var.songqueue[0].song.getName() + "~\u266B requested by " + $var.songqueue[0].user);
        } else {
            $.say("There are no more songs in the queue! Request one with !addsong or !songrequest <youtube link>");
        }
    }

    if (command.equalsIgnoreCase("stealsong")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        if ($var.currSong !== null) {
            var currsongurl = "https://www.youtube.com/watch?v=" + $var.currSong.song.getId();
            $.musicplayer.stealSong(currsongurl);
            $var.defaultplaylist = $.readFile("./addons/youtubePlayer/playlist.txt");
            $.say($var.currSong.song.getName() + "~\u266B requested by " + $var.currSong.user + " has been stolen and added to the default playlist!");
            $.parseDefault();
            return;
        }
    }

    if (command.equalsIgnoreCase("playsong")) {
        if (!$.isAdmin(sender)) {
            $.say($.adminmsg);
            return;
        }
        if(parseInt(argsString) <= $var.defaultplaylist.length) {
                $var.defaultplaylistpos = parseInt(argsString);
                $var.playChoice=true;
                next();
                return;
        }

        for(var pos=0;pos<$var.defaultplaylist.length;pos++) {
            if($var.defaultplaylist[pos].toLowerCase().contains(argsString.toLowerCase())) {
                $var.defaultplaylistpos = pos;
                $var.playChoice=true;
                next();
                return;
            }
            song = new Song($var.defaultplaylist[pos],"");
            if(song.getName().toLowerCase().contains(argsString.toLowerCase())) {
                $var.defaultplaylistpos = pos;
                $var.playChoice=true;
                next();
                return;
            }
        }
        $.say("Song not found in current playlist.");
        return;
    }

});

//Q: why is there a timeout delay here before a timer? seems redundant no?
//A: the timeout sets a delay to start the timer, otherwise the timer won't detect if a module is disabled (because it hasnt loaded in yet)
setTimeout(function(){
    if ($.moduleEnabled('./addonscripts/youtubePlayer.js')) {

        $.timer.addTimer("./addonscripts/youtubePlayer.js", "currsongyt", true, function() {
            $var.ytcurrSong = $.readFile("./addons/youtubePlayer/currentsong.txt");
            if (!$var.ytcurrSong.toString().equalsIgnoreCase($.inidb.get("settings", "lastsong")) && !musicPlayerConnected) {
                if ($var.ytcurrSong.toString()!==null || $var.ytcurrSong.toString()!=="") {
                    $.inidb.set("settings", "lastsong", $var.ytcurrSong.toString());
                    if ($.song_toggle === 1) {
                        $.say("[\u266B] Now Playing -- " + $var.ytcurrSong.toString());
                    } else {
                        println("[\u266B] Now Playing -- " + $var.ytcurrSong.toString());
                    }
                }
            }

        }, 10* 1000);
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "playsong", "mod");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "addsong");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "skipsong");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "vetosong");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "currentsong");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "nextsong");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "stealsong", "admin");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "delsong", "mod");
        $.registerChatCommand("./addonscripts/youtubePlayer.js", "volume", "mod");
    }
    
}, 10* 1000);

if($.storing===1) {
    $.parseDefault();
}

$.on('musicPlayerCurrentVolume', function (event) {
    $.say("[\u266B] Music volume is currently: " + parseInt(event.getVolume()) + "%");
});