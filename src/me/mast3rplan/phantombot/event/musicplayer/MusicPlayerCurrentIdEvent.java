package me.mast3rplan.phantombot.event.musicplayer;

import me.mast3rplan.phantombot.musicplayer.MusicPlayerState;

public class MusicPlayerCurrentIdEvent extends MusicPlayerEvent {
    private String id;

    public MusicPlayerCurrentIdEvent(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

}
