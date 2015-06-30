
$.checkerstorepath = $.inidb.get('settings','checker_storepath');
if($.checkerstorepath==null || $.checkerstorepath=="" || $.strlen($.checkerstorepath) == 0) {
    $.checkerstorepath = "addons/donationchecker/latestdonation.txt";
}

$.on('command', function (event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var args;
    var argsString = event.getArguments().trim();
    
    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
    
    if (command.equalsIgnoreCase("donationalert")) {
        var action = args[0];
        
        if (action.equalsIgnoreCase("filepath")) {
            if (!$.isCaster(sender)) {
                $.say($.adminmsg);
                return;
            }
            
            if (args[1].equalsIgnoreCase('viewfilepath')) {
                $.say("Current donation alert file path: " + $.checkerstorepath);
                return;
            }
            
            while (args[1].indexOf('\\') != -1 && !args[1].equalsIgnoreCase('viewfilepath') && args[1]!="" && args[1]!=null) {
                args[1] = args[1].replace('\\', '/');
            }
            
            $.inidb.set('settings','checker_storepath', args[1]);
            $.checkerstorepath = args[1];
            $.say("File path for donation alert has been set!");
        }
    }
    
});

$var.storedDonation = $.findSize($.checkerstorepath);

$.timer.addTimer("./donationChecker.js", "currdonation", true, function() {
$var.currDonation = $.findSize($.checkerstorepath);
if ($var.storedDonation!=$var.currDonation) {
  $var.storedDonation = $var.currDonation;
  if ($.song_toggle == 1) {
  $.say($.username.resolve($.ownerName) + " has received a donation from: " + $.readFile($.checkerstorepath));
  } else if ($.song_toggle == 2) {
  println($.username.resolve($.ownerName) + " has received a donation from: " + $.readFile($.checkerstorepath));
  }
}
}, 10* 1000);

$.registerChatCommand("./donationChecker.js", "donationalert", "mod");