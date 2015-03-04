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


/**
 * A Class to represent a mode adjustment to a user or a channel.
 *
 * @author mohadib
 */
public class ModeAdjustment {
    private final Action action;
    private final char mode;
    private final String argument;

    /**
     * Enum of mode action types. Modes can only be applied or removed.
     */
    public enum Action {
        PLUS,
        MINUS
    }

    public ModeAdjustment(Action action, char mode, String argument) {
        this.action = action;
        this.mode = mode;
        this.argument = argument;
    }

    /**
     * Indicates if the mode is being applied or removed
     *
     * @return PLUS if applying MINUS if removing
     */
    public Action getAction() {
        return action;
    }

    /**
     * Get the mode for this adjustment
     *
     * @return the mode
     */
    public char getMode() {
        return mode;
    }

    /**
     * This will return the argument for
     * this mode if any.
     *
     * @return the argument for the mode or an empty string is no argument
     */
    public String getArgument() {
        return argument;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        return (action == Action.PLUS ? "+" : "-") + mode + " " + argument;
    }
}
