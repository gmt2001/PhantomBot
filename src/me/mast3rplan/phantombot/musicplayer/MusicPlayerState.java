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
package me.mast3rplan.phantombot.musicplayer;

public enum MusicPlayerState
{

    NEW(-2),
    UNSTARTED(-1),
    ENDED(0),
    PLAYING(1),
    PAUSED(2),
    BUFFERING(3),
    CUED(5);
    public int i;

    private MusicPlayerState(int i)
    {
        this.i = i;
    }

    public static MusicPlayerState getStateFromId(int i)
    {
        for (MusicPlayerState mps : MusicPlayerState.values())
        {
            if (mps.i == i)
            {
                return mps;
            }
        }
        return null;
    }
}
