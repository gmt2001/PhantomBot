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
package me.mast3rplan.phantombot.jerklib;

import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.Connection;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.WriteRequest;

class RequestGenerator {
    private Session session;

    RequestGenerator() {
    }

    void setSession(Session session) {
        this.session = session;
    }

    public void who(String who) {
        this.write(new WriteRequest("WHO " + who, this.session));
    }

    public void whois(String nick) {
        this.write(new WriteRequest("WHOIS " + nick, this.session));
    }

    public void whoWas(String nick) {
        this.write(new WriteRequest("WHOWAS " + nick, this.session));
    }

    public void invite(String nick, Channel chan) {
        this.write(new WriteRequest("INVITE " + nick + " " + chan.getName(), this.session));
    }

    public void chanList() {
        this.write(new WriteRequest("LIST", this.session));
    }

    public void chanList(String channel) {
        this.write(new WriteRequest("LIST " + channel, this.session));
    }

    public void join(String channel) {
        this.write(new WriteRequest("JOIN " + channel, this.session));
    }

    public void join(String channel, String pass) {
        this.write(new WriteRequest("JOIN " + channel + " " + pass, this.session));
    }

    public void ctcp(String target, String request) {
        this.write(new WriteRequest("\u0001" + request.toUpperCase() + "\u0001", this.session, target));
    }

    public void notice(String target, String msg) {
        this.write(new WriteRequest("NOTICE " + target + " :" + msg, this.session));
    }

    public void setAway(String message) {
        this.write(new WriteRequest("AWAY :" + message, this.session));
    }

    public void unSetAway() {
        this.write(new WriteRequest("AWAY", this.session));
    }

    public void getServerVersion() {
        this.write(new WriteRequest("VERSION " + this.session.getConnection().getHostName(), this.session));
    }

    public void getServerVersion(String hostPattern) {
        this.write(new WriteRequest("VERSION " + hostPattern, this.session));
    }

    public void changeNick(String nick) {
        this.write(new WriteRequest("NICK " + nick, this.session));
    }

    public void mode(String target, String mode) {
        this.write(new WriteRequest("MODE " + target + " " + mode, this.session));
    }

    public void action(String target, String actionText) {
        this.ctcp(target, actionText);
    }

    public void sayChannel(String msg, Channel channel) {
        this.write(new WriteRequest(msg, channel, this.session));
    }

    public void sayPrivate(String nick, String msg) {
        this.write(new WriteRequest(msg, this.session, nick));
    }

    public void sayRaw(String data) {
        this.write(new WriteRequest(data, this.session));
    }

    private void write(WriteRequest req) {
        Connection con = this.session.getConnection();
        if (con != null) {
            con.addWriteRequest(req);
        }
    }
}

