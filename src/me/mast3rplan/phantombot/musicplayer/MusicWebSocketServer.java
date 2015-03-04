package me.mast3rplan.phantombot.musicplayer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Collection;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.musicplayer.*;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class MusicWebSocketServer extends WebSocketServer {
    public MusicWebSocketServer(int port) {
        super(new InetSocketAddress(port));
        
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        this.start();
        com.gmt2001.Console.out.println("MusicSockServer accepting connections on port " + port);
    }

    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        EventBus.instance().post(new MusicPlayerConnectEvent());
    }

    @Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b) {
        EventBus.instance().post(new MusicPlayerDisconnectEvent());
    }

    @Override
    public void onMessage(WebSocket webSocket, String s) {
        String[] m = s.split(Pattern.quote("|"));
        if (m[0].equals("state")) {
            MusicPlayerState mps = MusicPlayerState.getStateFromId(Integer.parseInt(m[1]));
            EventBus.instance().post(new MusicPlayerStateEvent(mps));
        }
        if (m[0].equals("ready")) {
            EventBus.instance().post(new MusicPlayerStateEvent(MusicPlayerState.NEW));
        }
        if (m[0].equals("currentid")) {
            EventBus.instance().post(new MusicPlayerCurrentIdEvent(m[1]));
        }
        if (m[0].equals("currentvolume")) {
            EventBus.instance().post(new MusicPlayerCurrentVolumeEvent(Double.parseDouble(m[1])));
        }
    }

    @Override
    public void onError(WebSocket webSocket, Exception e) {
        com.gmt2001.Console.err.printStackTrace(e);
    }
    
    public void dispose() {
        try
        {
            this.stop(2000);
        } catch (IOException | InterruptedException ex)
        {
            Logger.getLogger(MusicWebSocketServer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void sendToAll(String text) {
        Collection<WebSocket> con = connections();
        synchronized (con) {
            for (WebSocket c : con) {
                c.send(text);
            }
        }
    }

    public void cueNext() {
        sendToAll("next");
    }

    public void cuePrevious() {
        sendToAll("previous");
    }

    public void play() {
        sendToAll("play");
    }

    public void pause() {
        sendToAll("pause");
    }

    public void add(String video) {
        sendToAll("add|" + video);
    }

    public void reload() {
        sendToAll("reload");
    }

    public void cue(String video) {
        sendToAll("cue|" + video);
    }

    public void currentId() {
        sendToAll("currentid");
    }

    public void eval(String code) {
        sendToAll("eval|" + code);
    }

    public void setVolume(int volume) {
        if (!(volume > 100 || volume < 0)) {
            sendToAll("setvolume|" + volume);
        }
    }

    public void currentVolume() {
        sendToAll("currentvolume");
    }

    public void onWebsocketClosing(WebSocket ws, int code, String reason, boolean remote)
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public void onWebsocketCloseInitiated(WebSocket ws, int code, String reason)
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public InetSocketAddress getLocalSocketAddress(WebSocket conn)
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    public InetSocketAddress getRemoteSocketAddress(WebSocket conn)
    {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
