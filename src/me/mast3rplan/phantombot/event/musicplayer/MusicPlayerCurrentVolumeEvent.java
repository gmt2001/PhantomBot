package me.mast3rplan.phantombot.event.musicplayer;

public class MusicPlayerCurrentVolumeEvent extends MusicPlayerEvent {

    private double volume;

    public MusicPlayerCurrentVolumeEvent(double volume) {
        this.volume = volume;
    }

    public double getVolume() {
        return volume;
    }
}
