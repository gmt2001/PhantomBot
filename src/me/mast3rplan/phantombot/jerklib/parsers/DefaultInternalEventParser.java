/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * Credits: mast3rplan, gmt2001, PhantomIndex, GloriousEggroll
 * gloriouseggroll@gmail.com, phantomindex@gmail.com
 * 
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
package me.mast3rplan.phantombot.jerklib.parsers;

import java.util.HashMap;
import java.util.Map;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.parsers.AwayParser;
import me.mast3rplan.phantombot.jerklib.parsers.ChanListParser;
import me.mast3rplan.phantombot.jerklib.parsers.CommandParser;
import me.mast3rplan.phantombot.jerklib.parsers.ConnectionCompleteParser;
import me.mast3rplan.phantombot.jerklib.parsers.InternalEventParser;
import me.mast3rplan.phantombot.jerklib.parsers.InviteParser;
import me.mast3rplan.phantombot.jerklib.parsers.JoinParser;
import me.mast3rplan.phantombot.jerklib.parsers.KickParser;
import me.mast3rplan.phantombot.jerklib.parsers.ModeParser;
import me.mast3rplan.phantombot.jerklib.parsers.MotdParser;
import me.mast3rplan.phantombot.jerklib.parsers.NamesParser;
import me.mast3rplan.phantombot.jerklib.parsers.NickInUseParser;
import me.mast3rplan.phantombot.jerklib.parsers.NickParser;
import me.mast3rplan.phantombot.jerklib.parsers.NoticeParser;
import me.mast3rplan.phantombot.jerklib.parsers.NumericErrorParser;
import me.mast3rplan.phantombot.jerklib.parsers.PartParser;
import me.mast3rplan.phantombot.jerklib.parsers.PrivMsgParser;
import me.mast3rplan.phantombot.jerklib.parsers.QuitParser;
import me.mast3rplan.phantombot.jerklib.parsers.ServerInformationParser;
import me.mast3rplan.phantombot.jerklib.parsers.ServerVersionParser;
import me.mast3rplan.phantombot.jerklib.parsers.TopicParser;
import me.mast3rplan.phantombot.jerklib.parsers.TopicUpdatedParser;
import me.mast3rplan.phantombot.jerklib.parsers.WhoParser;
import me.mast3rplan.phantombot.jerklib.parsers.WhoWasParser;
import me.mast3rplan.phantombot.jerklib.parsers.WhoisParser;

public class DefaultInternalEventParser
implements InternalEventParser {
    private final Map<String, CommandParser> parsers = new HashMap<String, CommandParser>();
    private CommandParser defaultParser;

    public DefaultInternalEventParser() {
        this.initDefaultParsers();
    }

    @Override
    public IRCEvent receiveEvent(IRCEvent e) {
        CommandParser parser = this.parsers.get(e.command());
        parser = parser == null ? this.defaultParser : parser;
        return parser == null ? e : parser.createEvent(e);
    }

    public void removeAllParsers() {
        this.parsers.clear();
    }

    public void addParser(String command, CommandParser parser) {
        this.parsers.put(command, parser);
    }

    public CommandParser getParser(String command) {
        return this.parsers.get(command);
    }

    public boolean removeParser(String command) {
        return this.parsers.remove(command) != null;
    }

    public void setDefaultParser(CommandParser parser) {
        this.defaultParser = parser;
    }

    public CommandParser getDefaultParser() {
        return this.defaultParser;
    }

    public void initDefaultParsers() {
        this.parsers.put("001", new ConnectionCompleteParser());
        this.parsers.put("002", new ServerVersionParser());
        this.parsers.put("005", new ServerInformationParser());
        AwayParser awayParser = new AwayParser();
        this.parsers.put("301", awayParser);
        this.parsers.put("305", awayParser);
        this.parsers.put("306", awayParser);
        this.parsers.put("314", new WhoWasParser());
        WhoisParser whoisParser = new WhoisParser();
        this.parsers.put("311", whoisParser);
        this.parsers.put("312", whoisParser);
        this.parsers.put("317", whoisParser);
        this.parsers.put("318", whoisParser);
        this.parsers.put("319", whoisParser);
        this.parsers.put("320", whoisParser);
        ChanListParser chanListParser = new ChanListParser();
        this.parsers.put("321", chanListParser);
        this.parsers.put("322", chanListParser);
        this.parsers.put("324", new ModeParser());
        TopicParser topicParser = new TopicParser();
        this.parsers.put("332", topicParser);
        this.parsers.put("333", topicParser);
        this.parsers.put("351", new ServerVersionParser());
        this.parsers.put("352", new WhoParser());
        NamesParser namesParser = new NamesParser();
        this.parsers.put("353", namesParser);
        this.parsers.put("366", namesParser);
        MotdParser motdParser = new MotdParser();
        this.parsers.put("372", motdParser);
        this.parsers.put("375", motdParser);
        this.parsers.put("376", motdParser);
        this.parsers.put("PRIVMSG", new PrivMsgParser());
        this.parsers.put("QUIT", new QuitParser());
        this.parsers.put("JOIN", new JoinParser());
        this.parsers.put("PART", new PartParser());
        this.parsers.put("NOTICE", new NoticeParser());
        this.parsers.put("TOPIC", new TopicUpdatedParser());
        this.parsers.put("INVITE", new InviteParser());
        this.parsers.put("NICK", new NickParser());
        this.parsers.put("MODE", new ModeParser());
        this.parsers.put("KICK", new KickParser());
        NumericErrorParser errorParser = new NumericErrorParser();
        for (int i = 400; i < 553; ++i) {
            this.parsers.put(String.valueOf(i), errorParser);
        }
        this.parsers.put("433", new NickInUseParser());
    }
}

