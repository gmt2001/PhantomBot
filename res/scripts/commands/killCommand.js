$var.lastRandom = "";
 
$.on('command', function (event) {
    var sender = event.getSender()
    var username = $.username.resolve(sender)
    var command = event.getCommand();
    var argsString = event.getArguments().trim();
    var args;
    var s = "";
 
 
    if (argsString.isEmpty()) {
        args = [];
    } else {
        args = argsString.split(" ");
    }
 
    if (command.equalsIgnoreCase("kill")) {
        if (args.length == 1) {
            username = args[0].toLowerCase();
 
            var user = new Array(0)
            if (username.equalsIgnoreCase("phantomindex")) {
                username = $.username.resolve(username);
                sender = $.username.resolve(sender);
                
               self.push(sender + " has somehow managed to kill himself.");
               self.push(sender + " exploded.");
               self.push(sender + " imploded.");
               self.push(sender + " figured out how to divide by 0!");
            }
 
            if (username.equalsIgnoreCase($.botname)) {
                username = $.username.resolve(username);
                sender = $.username.resolve(sender);
 
                user.push(username + " counters " + sender + "'s attempt to kill it with a flamethrower");
                user.push(username + " kicked " + sender + " in the balls in self defense");
                user.push(username + " throws a shuriken at " + sender);
            } else {
                username = $.username.resolve(username);
                sender = $.username.resolve(sender);
 
                user.push(sender + " murdered " + username + " with a unicorn's horn!");
                user.push(username + " was killed by a " + sender + "!");
                user.push(username + " was mauled by " + sender + " dressed up as a chicken.");
                user.push(username + " was ripped apart by " + sender + ", Daaaaaaamn!");
                user.push(username + " was brutally murdered by " + sender + " with a car!");
                user.push(sender + " covered " + username + " in meat sauce and threw them in a cage with a starved tiger.");
                user.push(sender + " genetically modified a Venus flytrap so it grows really big and trapped " + username + " in a room with it.");
                user.push(sender + " shanked " + username + "'s butt, over and over again.");
                user.push(sender + " just wrote " + username + "'s name in their Death Note.");
                user.push(sender + " put " + username + " out of their misery.");
                user.push(sender + " destroyed " + username + "!");
                user.push(sender + " atacó a " + username + " con un consolador grande!");
                user.push(username + " was poked a bit too hard by " + sender + " with a spoon!");
                user.push(sender + " got his hands on a steamroller and steamrolled " + username + " flat! So, yeah " + username + " did die from that.")
                user.push(sender + " attacked " + username + " with a rusty spoon as the weapon...and managed to " + username + " with very little effort.");
                user.push(sender + " used anal beads on " + username + " incorrectly and thus killing " + username + " almost instantly.");
                user.push(sender + " tickled " + username + " to death!");
                user.push(username + "'s skull was crushed by " + sender + "!");
                user.push(username + " is in several pieces after a tragic accident involving " + sender + " and spoons.");
                user.push(sender + " licked " + username + " until " + sender + " was squishy, yeah.. squishy.");
                user.push(sender + " catapulted a huge load of rusty spoons on to " + username + ". " + username + " died.");
                user.push(sender + " ran out of rusty spoons and unicorn horns to kill " + username + " with and so instead used a rusty hanger.");
            }
 
            do {
                s = $.randElement(user);
            } while (s.replace(sender, "").replace(username, "").equalsIgnoreCase($var.lastRandom) && user.length > 1);
 
            $var.lastRandom = s.replace(sender, "").replace(username, "");
 
            $.say(s);
 
        } else {
            var self = new Array(0)
            sender = $.username.resolve(sender);
 
            self.push(sender + " has somehow managed to kill himself.");
            self.push(sender + " died from unknown causes.");
            self.push("PhantomIndex came in like a mystical being of awesomeness and destroyed " + sender + "!")
            self.push(sender + " was sliced in half by Boulder (or something along those lines).");
            self.push(sender + " exploded.");
            self.push(sender + " forgot how to breathe.");
            self.push(sender + " learned that cellular respiration uses oxygen, not sand.")
            self.push(sender + " died.");
            self.push(sender + " tried to befriend a wild grizzly bear.");
            self.push(sender + " suffocated.");
            self.push(sender + " tested the bounds of time and space and lost.");
            self.push(sender + " imploded.");
            self.push(sender + " drowned.");
            self.push(sender + " ceased to be.");
            self.push(sender + " went kablewy!");
            self.push(sender + " figured out how to divide by 0!");
            self.push(sender + " took a long walk off a short pier.");
 
            do {
                s = $.randElement(self);
            } while (s.replace(sender, "").equalsIgnoreCase($var.lastRandom) && self.length > 1);
 
            $var.lastRandom = s.replace(sender, "");
 
            $.say(s);
        }
    }
});
 
$.registerChatCommand("kill");