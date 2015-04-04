$.on('command', function(event) {
    var sender = event.getSender();
    var command = event.getCommand();
    var num2 = $.users.length;    
    var rnd = $.rand(num2);
    var randomPerson = $.users[rnd][0];
    var argsString = event.getArguments().trim();
    var argsString2 = argsString.substring(argsString.indexOf(" ") + 1, argsString.length());
    var args = event.getArgs();
    var num_randoms = parseInt($.inidb.get("randoms", "num_randoms"));
    var randomNum = $.randRange(1, 100);
    var num;
    
    if(command.equalsIgnoreCase("random")) {
         if (!$.isMod(sender)) {
            num = $.rand(num_randoms);
        } else {
            if (argsString.length() > 0) {
                num = parseInt(argsString);
        } else {
                num = $.rand(num_randoms);
            }
        }


        if (isNaN(num_randoms) || num_randoms == 0) {
            $.say("There are no random messages at this time");
            return;
        }

        if ($.inidb.get("randoms", "random_" + num) == null) {
            $.say("There are only " + num_randoms + " randoms right now! Remember that random messages are numbered from 0 to " + (num_randoms - 1) + "!");

        } 
        
    }
    
    if (command.equalsIgnoreCase("addrandom")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        if (num_randoms == null || isNaN(num_randoms)) {
            num_randoms = 0;
        } 

        if (argsString.isEmpty()) {
            $.say("Usage: !addrandom <message>");
            return;
        }
        
      
        $.inidb.incr("randoms", "num_randoms", 1);
        $.inidb.set("randoms", "random_" + num_randoms, argsString);

        
        $.say("Random message added! There are now " + (num_randoms + 1) + " random messages!");
    }

     if (command.equalsIgnoreCase("editrandom")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        num = parseInt(args[0]);

        if (num > num_randoms) {
            $.say("There is no random message under that ID, " + sender + "!");
            return;
        }

        if (argsString2.isEmpty() || argsString.isEmpty() || args[1] == null) {
            $.say("Usage: !editrandom <ID> <message>");
            return;
        }


        
        $.inidb.set("randoms", "random_" + num, argsString2);
        
        $.say("Random message #" + num + " changed to: " + $.inidb.get("randoms", "random_" + num));
        return;
    }

    if (command.equalsIgnoreCase("delrandom")) {
        if (!$.isMod(sender)) {
            $.say($.modmsg);
            return;
        }
        
        if (num_randoms == null || isNaN(num_randoms) || num_randoms == 0) {
            $.say("There are no randoms at this time");
            return;
        }
        
        if (argsString.isEmpty()) {
            $.say("Usage: !delrandom <id>");
            return;
        }
        
        if (num_randoms > 1) {
            for (i = 0; i < num_randoms; i++) {
                if (i > parseInt(argsString)) {
                    $.inidb.set('randoms', 'random_' + (i - 1), $.inidb.get('randoms', 'random_' + i))
                }
            }
        }

        $.inidb.del('randoms', 'random_' + (num_randoms - 1));
        
        $.inidb.decr("randoms", "num_randoms", 1);
        
        $.say("random removed! There are now " + (num_randoms - 1) + " randoms!");
    }
    var commandCount = $.inidb.get('counter', 'random');
    var messageCommand = $.inidb.get('randoms', 'random_' + num);
    var a = 0;



    if (messageCommand) {
        for (var i = 0; i < args.length; i++) {
            while (messageCommand.contains('(' + (i + 1) + ')')) {
                messageCommand = messageCommand.replace('(' + (i + 1) + ')', args[i]);
            }
        }

        while (messageCommand.contains('(sender)')) {
            messageCommand = messageCommand.replace('(sender)', $.username.resolve(sender));
        }

        while (messageCommand.contains('(user)')) {
            messageCommand = messageCommand.replace('(user)', $.username.resolve(sender));
        }

        while (messageCommand.indexOf('(count)') != -1) {
            messageCommand = messageCommand.replace('(count)', $.inidb.get('counter', command));
        }

        while (messageCommand.indexOf('(random)') != -1) {
            messageCommand = messageCommand.replace('(random)', $.username.resolve(randomPerson));
        }
        while (messageCommand.indexOf('(#)') != -1) {
            messageCommand = messageCommand.replace('(#)', randomNum);
        }

        $.say(messageCommand);
    }
});
    var ar = new Array(0);
        ar.push("(sender) was welcomed to the JAM so now it's time for (sender) to get SLAMMED!");
        ar.push("(sender) was thrown into a large pit of PJSalt.");
        ar.push("Oh my, (sender) you make me just want to *SLURP SLURP SLURP*");
        ar.push("(sender) was thrown into a pit of tentacle pleasure.");
	ar.push("(sender) was thrown into a pit of genetically modified super lions.");
	ar.push("(sender) was thrown into a pit of explosive prinnys.");
        ar.push("I want you (sender).");
        ar.push("/me threw (sender) into a pit of PJSalt!" );
        ar.push("Dango, dango, dango, dango, big (sender) family~\u266B");
        ar.push("What are we gonna do on the bed (sender)?");
        ar.push("Your mother was a hamster and your father smelt of elderberries!");
        ar.push("When life gives you lemons (sender), make orange juice and leave the world wondering how the hell you did it.");
        ar.push("(sender) was violated by a tentacle monster on stream.");
        ar.push("/me licked (sender). . .");
        ar.push("This is the first time (sender) has noticed the scent of a woman.");
        ar.push("/me licking intensifies!");
        ar.push("I hope (sender)-senpai notices me..");
        ar.push("(sender) is so awesome because (sender) can trip over flat surfaces, fall up the stair and also fall up!!");
        ar.push("(sender) looks good enough to dress like the grim reaper and go to a retirement home and tap on the windows!");
        ar.push("Ok everyone shhhhh. The rice crispies are telling me what to do next.");
        ar.push("(sender) made eye contact with (random) while eating a banana!");
        ar.push("It's weird, (sender) just doesn't have enough sax appeal.");
        ar.push("(random) mysteriously died.");
		ar.push("(random) stopped existing.");
	    ar.push("All 7 of the Dragon Balls have been gathered! Now to wish (sender) to become a sloth!");
		ar.push("The ocean is so salty because everyone pees in it.");
		ar.push("Real men know when to run like a little bitch");
		ar.push("If I get reincarnated…. I wanna become a clam.");
		ar.push("Why don’t we drink to me and my reflection in your lovely eyes?");
		ar.push("I can show you what color your brain is.");
		ar.push("And while you’re waiting for us to kill you, we highly recommend p*ssing yourself, Followed by a course of praying to your impudent god. And cowarding in the corner and begging, always good. But if you act now, theres still time for an old-fashioned Suicide!! Thank you London! We love you! goodnight!!");
		ar.push("If you die, don’t come crying to me about it.");
		ar.push("From this point on, all you opinions will be rejected!");
		ar.push("Kakarot! Is That A Vegetable?! I Hate Vegetables.");
		ar.push("You have no effect on me because you are flast chested!");
		ar.push("I see. (sender) is the type of person who is thinking positively to the extent of being stupid.");
		ar.push("I know as much of games as hugs and puppies, and care for them even less.");
		ar.push("I’m not just a pervert…I’M A SUPER PERVERT");
		ar.push("When you meet with scary people, you must always protect your wallet and asshole!");
		ar.push("Women’s minds and Autumn Winds Change Often.");
		ar.push("I’m literally hemorrhage generosity.");
		ar.push("They were traps? I thought they were attractions.");
		ar.push("Okay, here’s the plan: We go in, start hitting people, and see where it takes us.");
		ar.push("The key in turning people on is a girl with a lolita face and big breasts.");
		ar.push("When a woman says something cute, a man just can’t trust it.");
		ar.push("A life without gambling is like sushi without wasabi.");
		ar.push("Stress makes you bald, but it’s stressful to avoid stress, so you end up stressed out anyway, so in the end there’s nothing you can do.");
		ar.push("Do evil, get caught, then claim demons were brainwashing you. A common way that human politicians evade responsibility.");
		ar.push("I have one last request. Please slap me in the face with that wad of cash.");
		ar.push("Why do people have to work? I just want to eat and sleep. I should have been born as a panda at the zoo.");
		ar.push("Right, I have something I have to apologize to (random) for. Sometimes, when we were playing, you’d suddenly start crying, and then you’d run home. You probably thought you’d fooled us, but everyone knew… that you had pooped your pants! Sorry.");
		ar.push("What I want to do most? Let’s see… Just once, I really want to let loose and pee in my pants.");
		ar.push("Dude! Christmas rocks! We know how to do it right, here! First, we X out the ‘Christ’ part to make it extreme! Then we shop and eat stuff ’til we’re sick! Wanna shovel down some X-Mas cake to get in the spirit?");
		ar.push("My name is Duck. Yes, like the bird. Take it up with my parents. They never loved me!");
		ar.push("Boobs that don’t shake, aren’t boobs at all.");
		ar.push("(sender), during your last physical it was discovered you have Athletes Foot, and we now believe it is affecting your brain.");
		ar.push("When you have a swimsuit tan. You could jump in the pool naked and no one would know you weren’t wearing anything.");
		ar.push("I came to laugh at you - Chars Aznabal (Gundam)");
		ar.push("You're thinking in Japanese! If you must think, do it in German!");
		ar.push("*bursts into tears* I can't talk about it! It's so horrible! They were-- they were-- the milk! Oh God, the milk!");
		ar.push("Man fears the darkness, and so he scrapes away at the edges of it with fire." );
		ar.push("Panties, Panties, Panties");
		ar.push("Now I understand the relieved, I feel very situation...");
		ar.push("Nothing amazing happens here" );
		ar.push("Come on, scribbles on the bathroom wall, please show me the path that I must follow!");
		ar.push("Please don't worry, Mister, I only came here to obliterate you- not rob you.");
		ar.push("... if you let the fly live, the spider is going to die. You can't save both without one suffering..");
		ar.push("Bansai, bathtoy, wise guy, waterboy, lights shine bright in the o-town tonight" );
		ar.push("Why don't we drink to me and my reflection in your lovely eyes?");
		ar.push("Faye faye smoke smoke, faye faye puff puff! Yay!");
		ar.push("Total slaughter, total slaughter. I won't leave a single man alive. La dee da dee dide, genocide. La dee da dee dud, an ocean of blood. Let's begin the killing time.");
		ar.push("Someone once told me...that watching the birds made them want to go on a journey...");
		ar.push("I wouldn't mind if you want to kill me, but I might struggle a bit");
		ar.push("I think I know, I don't think I know, I don't think I think I know, I don't think I think.");


    if ($.inidb.get("randoms", "num_randoms") == null || $.inidb.get("randoms", "num_randoms") == 0 ) {
        
		$.inidb.set("randoms", "num_randoms", ar.length);
                for (var i=0; i< ar.length; ++i) {
                    $.inidb.set('randoms', 'random_' + i, ar[i]);
                }
    }


$.registerChatCommand("./commands/randomCommand.js", "random");
