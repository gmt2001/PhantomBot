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

import java.util.ArrayList;
import java.util.List;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ModeAdjustment;
import me.mast3rplan.phantombot.jerklib.ServerInformation;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.events.IRCEvent;
import me.mast3rplan.phantombot.jerklib.events.ModeEvent;
import me.mast3rplan.phantombot.jerklib.parsers.CommandParser;

public class ModeParser
implements CommandParser {
    @Override
    public IRCEvent createEvent(IRCEvent event) {
        boolean userMode = event.numeric() != 324 && !event.getSession().isChannelToken(event.arg(0));
        char[] modeTokens = new char[]{};
        String[] arguments = new String[]{};
        int modeOffs = event.numeric() == 324 ? 2 : 1;
        modeTokens = event.arg(modeOffs).toCharArray();
        int size = event.args().size();
        if (modeOffs + 1 < size) {
            arguments = event.args().subList(modeOffs + 1, event.args().size()).toArray(arguments);
        }
        int argumntOffset = 0;
        char action = '+';
        ArrayList<ModeAdjustment> modeAdjustments = new ArrayList<ModeAdjustment>();
        for (char mode : modeTokens) {
            if (mode == '+' || mode == '-') {
                action = mode;
                continue;
            }
            if (userMode) {
                String argument = argumntOffset >= arguments.length ? "" : arguments[argumntOffset];
                modeAdjustments.add(new ModeAdjustment(action == '+' ? ModeAdjustment.Action.PLUS : ModeAdjustment.Action.MINUS, mode, argument));
                ++argumntOffset;
                continue;
            }
            ServerInformation info = event.getSession().getServerInformation();
            ServerInformation.ModeType type = info.getTypeForMode(String.valueOf(mode));
            if (type == ServerInformation.ModeType.GROUP_A || type == ServerInformation.ModeType.GROUP_B) {
                modeAdjustments.add(new ModeAdjustment(action == '+' ? ModeAdjustment.Action.PLUS : ModeAdjustment.Action.MINUS, mode, arguments[argumntOffset]));
                ++argumntOffset;
                continue;
            }
            if (type == ServerInformation.ModeType.GROUP_C) {
                if (action == '-') {
                    modeAdjustments.add(new ModeAdjustment(ModeAdjustment.Action.MINUS, mode, ""));
                    continue;
                }
                modeAdjustments.add(new ModeAdjustment(ModeAdjustment.Action.PLUS, mode, arguments[argumntOffset]));
                ++argumntOffset;
                continue;
            }
            if (type != ServerInformation.ModeType.GROUP_D) continue;
            modeAdjustments.add(new ModeAdjustment(action == '+' ? ModeAdjustment.Action.PLUS : ModeAdjustment.Action.MINUS, mode, ""));
        }
        if (userMode) {
            return new ModeEvent(ModeEvent.ModeType.USER, event.getRawEventData(), event.getSession(), modeAdjustments, event.getSession().getConnectedHostName(), null);
        }
        return new ModeEvent(ModeEvent.ModeType.CHANNEL, event.getRawEventData(), event.getSession(), modeAdjustments, event.numeric() == 324 ? "" : event.getNick(), event.getSession().getChannel(event.numeric() == 324 ? event.arg(1) : event.arg(0)));
    }
}

