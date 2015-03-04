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



package me.mast3rplan.phantombot.event.irc.message;

import java.util.regex.Pattern;
import me.mast3rplan.phantombot.event.irc.IrcEvent;
import me.mast3rplan.phantombot.jerklib.Session;
import org.apache.commons.lang3.CharUtils;

public abstract class IrcMessageEvent extends IrcEvent
{

    private String sender;
    private String message;
    public static Pattern addressPtn = Pattern.compile(
            "(http://)?(www\\.)?(\\w+\\.)+(a(c|ac(ademy|tor)|d|e|ero|f|g|gency|i|l|m|n|o|q|r|rpa|s|sia|t|u|w|x|z)"
            + "|b(a|ar|argains|b|d|e|erlin|est|f|g|h|i|id|ike|iz|j|lue|m|n|o|outique|r|s|t|uil(d|ers)|uzz|v|w|y|z)"
            + "|c(a|ab|amera|amp|ar(ds|eers)|at|atering|c|d|enter|eo|f|g|h|heap|hristmas|i|k|l|leaning|lothing|lub|"
            + "m|n|o|odes|offee|o(m|m(munity|pany|puter))|on(dos|struction|tractors)|ool|oop|r|ruises|u|v|w|x|y|z)|"
            + "d(ance|ating|e|emocrat|iamonds|irectory|j|k|m|o|omains|z)|e(c|du|ducation|e|g|mail|nterprises|quipment"
            + "|r|s|state|t|u|vents|xp(ert|osed))|f(arm|i|ish|j|k|lights|lorist|m|o|oundation|r|utbol)|g(a|allery|b|d"
            + "|e|f|g|h|i|ift|l|lass|m|n|ov|p|q|r|raphics|s|t|u|uitars|uru|w|y)|h(k|m|n|ol(dings|iday)|ouse|r|t|u)|i(d"
            + "|e|l|m|mmobilien|n|ndustries|nfo|nstitute|nt|nternational|o|q|r|s|t)|j(e|m|o|obs|p)|k(aufen|e|g|h|i|im|"
            + "itchen|iwi|m|n|p|r|red|w|y|z)|l(a|and|b|c|i|ighting|imo|ink|k|r|s|t|u|uxury|v|y)|m(a|aison|an(agement|go)"
            + "|arketing|c|d|e|enu|g|h|il|k|l|m|n|o|obi|oda|onash|p|q|r|s|t|u|useum|v|w|x|y|z)|n(a|agoya|ame|c|e|et|eustar"
            + "|f|g|i|inja|l|o|p|r|u|z)|o(kinawa|m|nl|rg)|p(a|art(ners|s)|e|f|g|h|hot(o|ography|os)|ics|ink|k|l|lumbing|m|n"
            + "|ost|r|ro|ro(ductions|perties)|s|t|ub|w|y)|q(a|pon)|r(e|ecipes|ed|entals|ep(air|ort)|eviews|ich|o|s|u|uhr|w)"
            + "|s(a|b|c|d|e|exy|g|h|hiksha|hoes|i|ingles|j|k|l|m|n|o|ocial|ol(ar|utions)|r|t|u|upp(lies|ly|ort)|v|x|y|ystems|"
            + "z)|t(attoo|c|d|echnology|el|f|g|h|ienda|ips|j|k|l|m|n|o|oday|okyo|ools|p|r|ra(ining|vel)|t|v|w|z)|u(a|g|k|no|s|"
            + "y|z)|v(a|acations|c|e|entures|g|i|i(ajes|llas|sion)|n|ot(e|ing|o)|oyage|u)|w(ang|atch|ed|f|ien|iki|orks|s)|x(xx|"
            + "yz)|y(e|t)|z(a|m|one|w))(\\.\\w{1,4})?(:[0-9])?[\\x20-\\x7E]*");

    protected IrcMessageEvent(Session session, String sender, String message)
    {
        super(session);
        this.sender = sender;
        this.message = message;
    }

    public String getSender()
    {
        return sender;
    }

    public String getMessage()
    {
        return message;
    }

    public int getCapsCount()
    {
        int count = 0;
        for (int i = 0, l = message.length(); i < l; ++i)
        {
            if (CharUtils.isAsciiAlphaUpper(message.charAt(i)))
            {
                ++count;
            }
        }
        return count;
    }

    public boolean isLink()
    {
        return IrcMessageEvent.addressPtn.matcher(message).find();
    }
}
