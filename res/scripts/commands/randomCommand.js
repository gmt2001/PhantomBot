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
		ar.push("To write with a broken pencil is pointless.");
		ar.push("A bicycle can't stand on its own because it is two-tired.");
		ar.push("Those who get too big for their britches will be exposed in the end.");
		ar.push("When a clock is hungry it goes back four seconds.");
		ar.push("A chicken crossing the road is poultry in motion.");
		ar.push("If you don't pay your exorcist you get repossessed.");
		ar.push("What's the definition of a will? It's a dead giveaway.");
		ar.push("The man who fell into an upholstery machine is fully recovered.");
		ar.push("Every calendar's days are numbered.");
		ar.push("Bakers trade bread recipes on a knead to know basis.");
		ar.push("When the electricity went off during a storm at a school the students were de-lighted.");
		ar.push("I used to be a tap dancer until I fell in the sink.");
		ar.push("He wears glasses during math because it improves division.");
		ar.push("She was only a whisky maker but he loved her still.");
		ar.push("She had a boyfriend with a wooden leg, but broke it off.");
		ar.push("Those who jump off a Paris bridge are in Seine.");
		ar.push("It wasn't school John disliked it was just the principal of it.");
		ar.push("It's better to love a short girl than not a tall.");
		ar.push("There was once a cross-eyed teacher who couldn't control his  pupils.");
		ar.push("A grenade thrown into a kitchen in France would result in Linoleum Blownapart.");
		ar.push("A boiled egg in the morning is hard to beat.");
		ar.push("The one who invented the door knocker got a No-bell prize.");
		ar.push("Old power plant workers never die they just de-generate.");
		ar.push("There was a ghost at the hotel, so they called for an inn spectre.");
		ar.push("With her marriage she got a new name and a dress.");
		ar.push("The short fortune-teller who escaped from prison was a small medium at large");
		ar.push("Some Spanish government employees are Seville servants.");
		ar.push("He drove his expensive car into a tree and found out how the Mercedes bends.");
		ar.push("Show me someone in denial and I'll show you a person in Egypt up to their ankles.");
		ar.push("Two peanuts were walking in a tough neighborhood and one of them was a-salted.");
		ar.push("When cannibals ate a missionary they got a taste of religion.");
		ar.push("When an actress saw her first strands of gray hair she thought she'd dye.");
		ar.push("He often broke into song because he couldn't find the key.");
		ar.push("Marathon runners with bad footwear suffer the agony of defeat.");
		ar.push("Driving on so many turnpikes was taking its toll.");
		ar.push("To some - marriage is a word ... to others - a sentence.");
		ar.push("Old lawyers never die they just lose their appeal.");
		ar.push("In democracy its your vote that counts. In feudalism its your count that votes.");
		ar.push("Atheism is a non-prophet organization");
		ar.push("It was an emotional wedding. Even the cake was in tiers.");
		ar.push("Old skiers never die -- they just go down hill.");
		ar.push("A cardboard belt would be a waist of paper.");
		ar.push("Local Area Network in Australia: the LAN down under.");
		ar.push("When the TV repairman got married the reception was excellent.");
		ar.push("An office with many people and few electrical outlets could be in for a power struggle.");
		ar.push("How do you make antifreeze? Steal her blanket.");
		ar.push("A small boy swallowed some coins and was taken to a hospital. When his grandmother telephoned to ask how he was a nurse said 'No change yet'.");
		ar.push("A pediatrician is a doctor of little patients.");
		ar.push("Nylons give women a run for their money.");
		ar.push("Talking to her about computer hardware I make my mother board.");
		ar.push("Ancient orators tended to Babylon.");
		ar.push("The best way to stop a charging bull is to take away his credit card.");
		ar.push("If you give some managers an inch they think they're a ruler.");
		ar.push("Two silk worms had a race. They ended up in a tie.");
		ar.push("He had a photographic memory that was never developed.");
		ar.push("Old burglars never die they just steal away.");
		ar.push("A lawyer for a church did some cross-examining.");
		ar.push("Chronic illegal parkers suffer from parking zones disease.");
		ar.push("Some people don't like food going to waist..");
		ar.push("A cannibal's favourite game is 'swallow the leader'.");
		ar.push("You feel stuck with your debt if you can't budge it.");
		ar.push("Girls who don't get asked out as often as their friends could feel out-dated.");
		ar.push("We were so poor when I was growing up we couldn't even afford to pay attention. ");
		ar.push("A pet store had a bird contest with no perches necessary.");
		ar.push("A backwards poet writes inverse.");
		ar.push("If a lawyer can be disbarred can a musician be denoted or a model deposed?");
		ar.push("Once you've seen one shopping center you've seen a mall.");
		ar.push("When the smog lifts in Los Angeles, U C L A.");
		ar.push("A plateau is a high form of flattery.");
		ar.push("When chemists die, we barium.");
		ar.push("A long knife has been invented that cuts four loaves of bread at a time called a four loaf cleaver.");
		ar.push("When the wheel was invented, it caused a revolution.");
		ar.push("Two robbers with clubs went golfing, but they didn't play the fairway.");
		ar.push("Seven days without a pun makes one weak.");
		ar.push("A circus lion won't eat clowns because they taste funny.");
		ar.push("A toothless termite walked into a tavern and said, \"Is the bar tender here?\"");
		ar.push("Did you hear about the fire at the circus? The heat was intense.");
		ar.push("A tattoo artist has designs on his clients.");
		ar.push("Santa's helpers are subordinate clauses.");
		ar.push("A lot of money is tainted. It taint yours and it taint mine.");
		ar.push("When they bought a water bed, the couple started to drift apart.");
		ar.push("What you seize is what you get.");
		ar.push("Gardeners always know the ground rules.");
		ar.push("Some people's noses and feet are build backwards: their feet smell and their noses run.");
		ar.push("Two banks with different rates have a conflict of interest.");
		ar.push("A successful diet is the triumph of mind over platter.");
		ar.push("What do you call cheese that is not yours? Nacho Cheese.");
		ar.push("When a new hive is done bees have a house swarming party.");
		ar.push("Looting a drugstore is called Pillaging");
		ar.push("Never lie to an x-ray technician. They can see right through you.");
		ar.push("Old programmers never die, they just can't C as well.");
		ar.push("A music store had a small sign which read: Bach in a Minuet.");
		ar.push("Long fairy tales have a tendency to dragon.");
		ar.push("Visitors to Cuba are usually Havana good time.");
		ar.push("A bachelor is a guy who is footloose and fianc�e-free.");
		ar.push("A ditch digger was entrenched in his career.");
		ar.push("A girl and her boyfriend went to a party as a barcode.");
		ar.push("They were an item.A criminal's best asset is his lie ability.");
		ar.push("I love to stand in line at ATM machines, and when people put in their PIN, I yell GOT IT then run away ");
		ar.push("Like a weird neighbor, stalkers are there!");
		ar.push("OK think of a number. Add 12 to the number. Subtract 2. Divide that number by 5. Add 20. Did you get 12? Neither did I. I just wanted to see if you would do it! ");
		ar.push("I'm going to get a job at walmart as a greeter and my words of welcome will be \"Welcome to freaking walmart! Get ur sh*t and get the hell out!!\" ");
		ar.push("If somebody throws skittles at me and yells \"TASTE THE RAINBOW\", I'm gonna throw a 2 liter bottle of Dr.Pepper and yell \"TRUST ME I'M THE DOCTOR.\" ");
		ar.push("A few days ago I very sternly told the voices in my head to stop talking to Me. Now they are sending me txt mgs say that they r sorry and want to get back2gethr.");
		ar.push("Things to do at Walmart: hide behind teddy bears and make evil laughing noises when little kids come by.");
		ar.push("Ever feel like beating someone with a baseball bat to the point of almost unconsciousness, then setting them on fire? No? Just me? ");
		ar.push("I'm not crazy.. don't you judge me! Your just jealous cause I get texts from the flying gummy bears and you don't! ");
		ar.push("I saw a flying cow yesterday. It was purple and I named him Phillip...I wish the dancing unicorn had seen him but she was too busy laughing at Steve the snake ");
		ar.push("I was sitting there when I got attacked by the purple hedgehogs, neon dragons, and glow-in-the-dark leprechauns that kid-napped the unicorn and strawberry king ");
		ar.push("I have decided to stop pretending and just be that ninja with the magical penguins and dinosaurs and unicorns that everyone KNOWS I am. ");
		ar.push("Have you ever tried walking into Walmart and yelling red robin! and seeing how many people say YUM red robin, red robin, come on just say yum! ");
		ar.push("Things to do at Walmart #365: bring or take a tent, set it up in a camping supplies corner, and camp out for the weekend until they kick you out! ");
		ar.push("After watching CSI, Cold case, Law & Order, and all those other educational shows, I'm 99% sure I can make sure nobody notices you missing. Just saying... ");
		ar.push("I like to call it doing the world a favor. Homicide is just the technical term.");
		ar.push("I think there's something wrong with my guardian angel. Her wings are black and she's sitting with the devil and laughing hysterically at everything and everyone.");
		ar.push("I got a special care pkg. in the mail. It had duct tape, a meat tenderizer, a hole punch and a note saying \"Don't get caught\"! (sigh) I love my friends! ");
		ar.push("Backwards this read you making am I why exactly is that, never? you to nice been ever I have when since (now read it backwards).");
		ar.push("What happens in an exam : Tik tok, Mind block, Pen stop, Eye pop, Full shock, Jaw drop, Time up, No Luck");
		ar.push("I dare you to walk up to any officer and say: I didnt do it I didnt kill her, the assassination wasnt part of the plan.' Then run fast! I bet they'll chase you. ");
		ar.push("I'm bored & in need of some adventure. I say we get drunk, get stupid, get a stick, go poke something with teeth and see if we can outrun it.");
		ar.push("Why do people always think my friends and I are high? WE'RE NOT ON DRUGS! We're just crazy, and loud, and random, and scooby doo (but that's a different story).");
		ar.push("Smile and people will wonder what your up to. But grin like crazy and they will want to know what the hell you just did.");
		ar.push("Isn't it funny how everyone thinks they are the normal one in their family? ");
		ar.push("For Sale! One used alarm clock. damn thing rings when I am trying to sleep. ");
		ar.push("I'm on my way to Walmart to take the \"try me\" stickers off the noise making toys and stick them on condom boxes.");
		ar.push("A woman gets on a bus with her baby. The bus driver says: ''Ugh, that's the ugliest baby I've ever seen!'' The woman walks to the rear of the bus and sits down, fuming. She says to a man next to her: ''The driver just insulted me!'' The man says: ''You go up there and tell him off. Go on, I'll hold your monkey for you.''");
		ar.push("''I went to the zoo the other day, there was only one dog in it, it was a shitzu.''");
		ar.push("''Dyslexic man walks into a bra''");
		ar.push("A young blonde woman is distraught because she fears her husband is having an affair, so she goes to a gun shop and buys a handgun. The next day she comes home to find her husband in bed with a beautiful redhead. She grabs the gun and holds it to her own head. The husband jumps out of bed, begging and pleading with her not to shoot herself. Hysterically the blonde responds to the husband, ''Shut up...you're next!''");
		ar.push("A classic Tommy Cooper gag ''I said to the Gym instructor \"Can you teach me to do the splits?\" He said, \"How flexible are you?\" I said, \"I can't make Tuesdays\", was fifth.");
		ar.push("Police arrested two kids yesterday, one was drinking battery acid, the other was eating fireworks. They charged one - and let the other one off.           ");
		ar.push("Two aerials meet on a roof - fall in love - get married.  The ceremony was rubbish - but the reception was brilliant.            ");
		ar.push("Another one was:  Doc, I can't stop singing the 'Green Green Grass of Home'. He said: 'That sounds like Tom Jones syndrome'. 'Is it common?'I asked.  'It's not unusual' he replied.     ");
		ar.push("I'm on a whiskey diet. I've lost three days already.        ");
		ar.push("A man walks into a bar with a roll of tarmac under his arm and says: ''Pint please, and one for the road.''           ");
		ar.push("I went to the doctors the other day and I said, 'Have you got anything for wind?' So he gave me a kite.   ");
		ar.push("My mother-in-law fell down a wishing well, I was amazed, I never knew they worked.    ");
		ar.push("I saw this bloke chatting up a cheetah; I thought, ''He's trying to pull a fast one''.          ");
		ar.push("A woman has twins, and gives them up for adoption. One of them goes to a family in Egypt and is named 'Amal.' The other goes to a family in Spain, they name him Juan'. Years later; Juan sends a picture of himself to his mum. Upon receiving the picture, she tells her husband that she wished she also had a picture of Amal. Her husband responds, ''But they are twins. If you've seen Juan, you've seen Amal.''     ");
		ar.push("There's two fish in a tank, and one says ''How do you drive this thing?''            ");
		ar.push("I went to buy some camouflage trousers the other day but I couldn't find any.  ");
		ar.push("When Susan's boyfriend proposed marriage to her she said: ''I love the simple things in life, but I don't want one of them for my husband''.   ");
		ar.push("''My therapist says I have a preoccupation with vengeance. We'll see about that.''         ");
		ar.push("I rang up British Telecom, I said, ''I want to report a nuisance caller'', he said ''Not you again''.  ");
		ar.push("I met a Dutch girl with inflatable shoes last week, phoned her up to arrange a date but unfortunately she'd popped her clogs.            ");
		ar.push("A jump-lead walks into a bar. The barman says ''I'll serve you, but don't start anything''");
		ar.push("Slept like a log last night........ Woke up in the fireplace.        ");
		ar.push("A priest, a rabbi and a vicar walk into a bar. The barman says, ''Is this some kind of joke?''");
		ar.push("A sandwich walks into a bar. The barman says ''Sorry we don't serve food in here''       ");
		ar.push("The other day I sent my girlfriend a huge pile of snow. I rang her up, I said ''Did you get my drift?''.");
		ar.push("I cleaned the attic with the wife the other day. Now I can't get the cobwebs out of her hair.       ");
		ar.push("Went to the paper shop - it had blown away.");
		ar.push("A group of chess enthusiasts checked into a hotel and were standing in the lobby discussing their recent tournament victories. After about an hour, the manager came out of the office and asked them to disperse. ''But why?'' they asked, as they moved off. ''because,'' he said ''I can't stand chess nuts boasting in an open foyer.''");
		ar.push("I was in Tesco's and I saw this man and woman wrapped in a barcode. I said, ''Are you two an item?''   ");
		ar.push("I'm in great mood tonight because the other day I entered a competition and I won a years supply of Marmite......... one jar.            ");
		ar.push("So I went to the Chinese restaurant and this duck came up to me with a red rose and says ''Your eyes sparkle like diamonds''. I said, ''Waiter, I asked for a-ROMATIC duck''.");
		ar.push("Four fonts walk into a bar the barman says ''Oi - get out! We don't want your type in here''        ");
		ar.push("I was having dinner with Garry Kasporov (world chess champion) and there was a check tablecloth. It took him two hours to pass me the salt.");
		ar.push("There was a man who entered a local paper's pun contest.. He sent in ten different puns, in the hope that at least one of the puns would win. Unfortunately, no pun in ten did.");
		ar.push("I went down the local supermarket, I said, ''I want to make a complaint, this vinegar's got lumps in it'', he said, \"Those are pickled onions\".            ");
		ar.push("I backed a horse last week at ten to one.  It came in at quarter past four.        ");
		ar.push("I swear, the other day I bought a packet of peanuts, and on the packet it said ''may contain nuts.'' Well, YES! That's what I bought the buggers for! You'd be annoyed if you opened it and a socket set fell out!''           ");
		ar.push("A lorry-load of tortoises crashed into a trainload of terrapins, What a turtle disaster     ");
		ar.push("My phone will ring at 2 in the morning, and my wife'll look at me and go, ''Who's that calling at this time?' ''I don't know! If I knew that we wouldn't need the bloody phone!''    ");
		ar.push("I said to this train driver ''I want to go to Paris\". He said \"Eurostar?\" I said, \"I've been on telly but I'm no Dean Martin\".");
		ar.push("Two Eskimos sitting in a kayak were chilly. But when they lit a fire in the craft, it sank, proving once and for all that you can't have your kayak and heat it.      ");
		ar.push("I've got a friend who's fallen in love with two school bags, he's bisatchel.          ");
		ar.push("You see my next-door neighbour worships exhaust pipes, he's a catholic converter.     ");
		ar.push("A three-legged dog walks into a saloon in the Old West. He slides up to the bar and announces: ''I'm looking for the man who shot my paw.''   ");
		ar.push("I tried water polo but my horse drowned.      ");
		ar.push("I'll tell you what I love doing more than anything: trying to pack myself in a small suitcase. I can hardly contain myself.  ");
		ar.push("So I met this gangster who pulls up the back of people's pants, it was Wedgie Kray.   ");
		ar.push("Went to the corner shop - bought 4 corners.            ");
		ar.push("A seal walks into a club...    ");
		ar.push("I went to the Doctors the other day, and he said, 'Go to Bournemouth, it's great for flu'. So I went  -  and I got it.");
		ar.push("Fun at Walmart #1. Take shopping carts for the express purpose of filling them and stranding them at strategic locations. ");
		ar.push("Fun at Walmart #2. Ride those little electronic cars at the front of the store. ");
		ar.push("Fun at Walmart #3. Set all the alarm clocks to go off at ten-minute intervals throughout the day ");
		ar.push("Fun at Walmart #4. Start playing Calvinball; see how many people you can get to join");
		ar.push("Fun at Walmart #5. Contaminate the entire auto department by sampling all the spray air fresheners. ");
		ar.push("Fun at Walmart #6. Challenge other customers to duels with tubes of gift-wrap. ");
		ar.push("Fun at Walmart #7. Leave cryptic messages on the typewriters.");
		ar.push("Fun at Walmart #8. Re-dress the mannequins as you see fit.");
		ar.push("Fun at Walmart #9. When there are people behind you, walk really slowly, especially in thin aisles. ");
		ar.push("Fun at Walmart #10. Walk up to an employee and tell him in an official tone, \"I think we've got a code 3 in housewares,\" and see what happens. ");
		ar.push("Fun at Walmart #11. Turn all the radios to polka stations; then turn them off and turn the volume up to full blast. ");
		ar.push("Fun at Walmart #12. Play with the automatic doors. ");
		ar.push("Fun at Walmart #13. Walk up to complete strangers and say, \"Hi. I haven't seen you in so long.\" etc. See if they play along. ");
		ar.push("Fun at Walmart #14. While walking through the clothing department, ask yourself loud enough for all to hear, \"Who buys this crap anyway?!\" ");
		ar.push("Fun at Walmart #15. Repeat #14 in the jewelry department. ");
		ar.push("Fun at Walmart #16. Ride a display bicycle through the store; claim you are taking it for a test drive. ");
		ar.push("Fun at Walmart #17. Follow people through the aisles, staying about 5 feet behind them. Do this until they leave the store. ");
		ar.push("Fun at Walmart #18. Play soccer with a group of friends, using the entire store as your playing field. ");
		ar.push("Fun at Walmart #19. As the cashier runs your purchase over the scanner, look mesmerized and say, \"Wow, magic!\" ");
		ar.push("Fun at Walmart #20. Put M&M's on layaway. ");
		ar.push("Fun at Walmart #21. Move \"Caution : Wet Floor\" signs to carpeted areas. ");
		ar.push("Fun at Walmart #22. Set up a tent in the camping department; tell others you will only invite them in if they bring pillows from Bed and Bath. ");
		ar.push("Fun at Walmart #23. Test the fishing rods and see what you can catch from other aisles. ");
		ar.push("Fun at Walmart #24. Ask other customers if they have any Grey Poupon. ");
		ar.push("Fun at Walmart #25. Drape a blanket around your shoulders and run around saying, \"I'm Batman. Come Robin, to the Batcave.\" ");
		ar.push("Fun at Walmart #26. TP as much of the store as possible. ");
		ar.push("Fun at Walmart #27. Randomly throw things over into neighboring aisles.");
		ar.push("Fun at Walmart #28. Play with the calculators so that they all spell \"hello\" upside down. ");
		ar.push("Fun at Walmart #29. When someone asks you if you need help, begin to cry and say, \"Why won't you people just leave me alone?\" ");
		ar.push("Fun at Walmart #30. When 2 or 3 people are walking ahead of you, run between them yelling \"Red Rover.\" ");
		ar.push("Fun at Walmart #31. Make up nonsense products and ask employees if there are any in stock. (i.e.: Shnerples) ");
		ar.push("Fun at Walmart #32. Take up an entire aisle in toys by setting up a full-scale battle with G.I. Joe vs. X-men. ");
		ar.push("Fun at Walmart #33. Take bets on the battle from above. ");
		ar.push("Fun at Walmart #34. Test the brushes and combs in cosmetics. ");
		ar.push("Fun at Walmart #35. While handling guns in the hunting department, suddenly ask the clerk where the anti-depressants are. Act as spastic as possible. ");
		ar.push("Fun at Walmart #36. Hold indoor shopping cart races.");
		ar.push("Fun at Walmart #37. Dart around suspiciously while humming the theme from Mission Impossible. ");
		ar.push("Fun at Walmart #38. Attempt to fit into very large gym bags. ");
		ar.push("Fun at Walmart #39. Attempt to fit others into very large gym bags. ");
		ar.push("Fun at Walmart #40. Say things like, \"Would you be so kind as to direct me to your Twinkies.\" ");
		ar.push("Fun at Walmart #41. Set up a \"Valet Parking\" sign in front of the store.");
		ar.push("Fun at Walmart #42. Two words: Marco Polo");
		ar.push("Fun at Walmart #43. Leave Cheerios in lawn and garden, pillows in the pet section, etc.");
		ar.push("Fun at Walmart #44. \"Re-alphabetize\" the CD's. ");
		ar.push("Fun at Walmart #45. In the auto department, practice your Madonna look with various funnels. ");
		ar.push("Fun at Walmart #46. When someone steps away from his or her cart to look at something, quickly make off with it without saying a word. ");
		ar.push("Fun at Walmart #47. Relax in the patio furniture until you get kicked out. ");
		ar.push("Fun at Walmart #48. When an announcement comes over the loudspeaker, drop to your knees and scream, \"No, no, its those voices again.\" ");
		ar.push("Fun at Walmart #49. Pay off layaways 50 cents at a time. ");
		ar.push("Fun at Walmart #50. Drag a lounge chair over to the magazines and relax. Go to the food court, buy a drink, and explain that you don't get out much and ask if they can put a little umbrella in it. ");
		ar.push("Fun at a Drive thru #1. Drive through the drive thru in reverse and let your passenger order.");
		ar.push("Fun at a Drive thru #2. Ask prices of everything on the menu then order something that you did not ask the price for.");
		ar.push("Fun at a Drive thru #3. Pretend like your window is broken. Tell the employee this. Order with your door open, pay with your door open. Roll down window and take food through the window.");
		ar.push("Fun at a Drive thru #4. Go to McDonalds and demand a big breakfast at 11:30 at night. Put up a fight.");
		ar.push("Fun at a Drive thru #5. Pay for a large order in pennies and nickels unwrapped.");
		ar.push("Fun at a Drive thru #6. Order in another language. Be careful what neighborhood you are in.");
		ar.push("Fun at a Drive thru #7. When asked if they can take your order, tell them you are just window shopping and drive on.");
		ar.push("Fun at a Drive thru #8. Laugh sadistically when asked if you would like ketchup.");
		ar.push("Fun at a Drive thru #9. Ask how they fit into that little box.");
		ar.push("Fun at a Drive thru #10. If they make you wait, make them wait when they come back on.");
		ar.push("Fun at a Drive thru #11. Demand to speak to the manager. When he comes on, complain that you did not like the way the employee said \"May I take your order?\"");
		ar.push("Fun at a Drive thru #12. When asked if they can take your order say \"No, why can I take yours?\"");
		ar.push("Fun at a Drive thru #13. If they ask you to wait, order anyway and keep doing it till they yell at you.");
		ar.push("Fun at a Drive thru #14. Pretend like your car broke down. Ask for assistance in moving it. When they come out, drive away.");
		ar.push("Fun at a Drive thru #15. Tell them you have to use the bathroom.");
		ar.push("Fun at a Drive thru #16. Order a cup of water and two napkins. That's it.");
		ar.push("Fun at a Drive thru #17. Don't order when they come on. Just sit there. If a line forms behind you, get out of the car and cause a scene.");
		ar.push("Fun at a Drive thru #18. When they hand you your food, hand them a bag back with all the trash from your car in it.");
		ar.push("Fun at a Drive thru #19. Just stare at them when you pay and get your food. Don't break your stare.");
		ar.push("Fun at a Drive thru #20. Honk your horn the whole way through the line.");
		ar.push("If a pig loses its voice, is it disgruntled?");
		ar.push("Why do women wear evening gowns to nightclubs? Shouldn't they be wearing night gowns?");
		ar.push("If love is blind, why is lingerie so popular?");
		ar.push("When someone asks you, \"A penny for your thoughts,\" and you put your two cents in, what happens to the other penny?");
		ar.push("Why is the man who invests all your money called a broker?");
		ar.push("Why do croutons come in airtight packages? It's just stale bread to begin with.");
		ar.push("When cheese gets it's picture taken, what does it say?");
		ar.push("Why is a person who plays the piano called a pianist, but a person who drives a race car not called a racist?");
		ar.push("Why are a wise man and a wise guy opposites?");
		ar.push("Why do overlook and oversee mean opposite things?");
		ar.push("If horrific means to make horrible, does terrific mean to make terrible?");
		ar.push("Why isn't 11 pronounced onety one?");
		ar.push("\"I am.\" is reportedly the shortest sentence in the English language. Could it be that \"I Do.\" is the longest sentence?");
		ar.push("If lawyers are disbarred and clergymen defrocked, doesn't it follow that electricians can be delighted, musicians denoted, cowboys deranged, models deposed, tree surgeons debarked and drycleaners depressed?");
		ar.push("Do Roman paramedics refer to IV's as \"4's\"?");
		ar.push("Why is it that if someone tells you that there are 1 billion stars in the universe you will believe them, but if they tell you a wall has wet paint you will have to touch it to be sure?");
		ar.push("If people from Poland are called \"Poles,\" why aren't people from Holland called 'Holes?");

    if ($.inidb.get("randoms", "num_randoms") == null || $.inidb.get("randoms", "num_randoms") == 0 ) {
        
		$.inidb.set("randoms", "num_randoms", ar.length);
                for (var i=0; i< ar.length; ++i) {
                    $.inidb.set('randoms', 'random_' + i, ar[i]);
                }
    }

setTimeout(function(){ 
if ($.moduleEnabled('./commands/randomCommand.js')) {
    $.registerChatCommand("./commands/randomCommand.js", "random");
}
}, 10* 1000);