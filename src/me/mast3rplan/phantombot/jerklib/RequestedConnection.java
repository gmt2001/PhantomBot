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

import me.mast3rplan.phantombot.jerklib.Profile;

public class RequestedConnection {
    private final String hostName;
    private final int port;
    private final String pass;
    private Profile profile;
    private final long requestedTime = System.currentTimeMillis();

    public RequestedConnection(String hostName, int port, Profile profile) {
        this.hostName = hostName;
        this.port = port;
        this.profile = profile;
        this.pass = null;
    }

    public RequestedConnection(String hostName, int port, String pass, Profile profile) {
        this.hostName = hostName;
        this.port = port;
        this.pass = pass;
        this.profile = profile;
    }

    public String getHostName() {
        return this.hostName;
    }

    public int getPort() {
        return this.port;
    }

    public Profile getProfile() {
        return this.profile;
    }

    public long getTimeRequested() {
        return this.requestedTime;
    }

    public int hashCode() {
        return this.hostName.hashCode() + this.port + this.profile.hashCode();
    }

    public boolean equals(Object o) {
        if (o instanceof RequestedConnection && o.hashCode() == this.hashCode()) {
            RequestedConnection rCon = (RequestedConnection)o;
            return rCon.getHostName().equals(this.hostName) && rCon.getPort() == this.port && rCon.getProfile().equals(this.profile);
        }
        return false;
    }

    void setProfile(Profile profile) {
        this.profile = profile;
    }

    public String getPass() {
        return this.pass;
    }
}

