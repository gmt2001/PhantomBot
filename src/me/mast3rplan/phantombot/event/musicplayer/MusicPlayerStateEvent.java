package me.mast3rplan.phantombot.event.musicplayer;

import me.mast3rplan.phantombot.musicplayer.MusicPlayerState;

public class MusicPlayerStateEvent extends MusicPlayerEvent {

    private MusicPlayerState state;

    public MusicPlayerStateEvent(MusicPlayerState state) {
        this.state = state;
    }

    public MusicPlayerState getState() {
        return state;
    }

    public int getStateId() {
        return state.i;
    }
}
