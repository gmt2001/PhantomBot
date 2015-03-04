package me.mast3rplan.phantombot.musicplayer;

public enum MusicPlayerState {
    NEW(-2),
    UNSTARTED(-1),
    ENDED(0),
    PLAYING(1),
    PAUSED(2),
    BUFFERING(3),
    CUED(5);
    public int i;

    private MusicPlayerState(int i) {
        this.i = i;
    }

    public static MusicPlayerState getStateFromId(int i) {
        for (MusicPlayerState mps : MusicPlayerState.values()) {
            if (mps.i == i) return mps;
        }
        return null;
    }
}
