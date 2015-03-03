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

public class Profile {
    private String name;
    private String realName;
    private String actualNick;
    private String firstNick;
    private String secondNick;
    private String thirdNick;

    public Profile(String name, String realName, String nick, String secondNick, String thirdNick) {
        this.realName = realName == null ? name : realName;
        this.name = name == null ? "" : name;
        this.firstNick = nick == null ? "" : nick;
        this.secondNick = secondNick == null ? "" : secondNick;
        this.thirdNick = thirdNick == null ? "" : thirdNick;
        this.actualNick = this.firstNick;
    }

    public Profile(String name, String nick, String secondNick, String thirdNick) {
        this.realName = name;
        this.name = name == null ? "" : name;
        this.firstNick = nick == null ? "" : nick;
        this.secondNick = secondNick == null ? "" : secondNick;
        this.thirdNick = thirdNick == null ? "" : thirdNick;
        this.actualNick = this.firstNick;
    }

    public Profile(String name, String realName, String nick) {
        this(name, realName, nick, nick + "1", nick + "2");
    }

    public Profile(String nick) {
        this(nick, nick, nick, nick + "1", nick + "2");
    }

    public String getName() {
        return this.name;
    }

    public String getFirstNick() {
        return this.firstNick;
    }

    public String getSecondNick() {
        return this.secondNick;
    }

    public String getThirdNick() {
        return this.thirdNick;
    }

    public String getActualNick() {
        return this.actualNick;
    }

    void setActualNick(String aNick) {
        this.actualNick = aNick;
    }

    void setFirstNick(String nick) {
        this.firstNick = nick;
    }

    public String getRealName() {
        return this.realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || this.getClass() != o.getClass()) {
            return false;
        }
        Profile profile = (Profile)o;
        if (this.actualNick != null ? !this.actualNick.equals(profile.getActualNick()) : profile.getActualNick() != null) {
            return false;
        }
        if (this.name != null ? !this.name.equals(profile.getName()) : profile.getName() != null) {
            return false;
        }
        return true;
    }

    public int hashCode() {
        int result = this.name != null ? this.name.hashCode() : 0;
        result = 31 * result + (this.actualNick != null ? this.actualNick.hashCode() : 0);
        return result;
    }

    public Profile clone() {
        Profile impl = new Profile(this.name, this.realName, this.firstNick, this.secondNick, this.thirdNick);
        impl.setActualNick(this.actualNick);
        return impl;
    }
}

