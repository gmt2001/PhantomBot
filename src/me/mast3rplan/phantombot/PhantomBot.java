/* 
 * Copyright (C) 2015 www.phantombot.net
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package me.mast3rplan.phantombot;

import com.gmt2001.DataStore;
import com.gmt2001.IniStore;
import com.gmt2001.SqliteStore;
import com.gmt2001.TempStore;
import com.gmt2001.TwitchAPIv3;
import com.gmt2001.YouTubeAPIv3;
import com.google.common.eventbus.Subscribe;
import de.simeonf.EventWebSocketServer;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map.Entry;
import me.mast3rplan.phantombot.cache.ChannelHostCache;
import me.mast3rplan.phantombot.cache.ChannelUsersCache;
import me.mast3rplan.phantombot.cache.FollowersCache;
import me.mast3rplan.phantombot.cache.SubscribersCache;
import me.mast3rplan.phantombot.cache.UsernameCache;
import me.mast3rplan.phantombot.console.ConsoleInputListener;
import me.mast3rplan.phantombot.event.EventBus;
import me.mast3rplan.phantombot.event.Listener;
import me.mast3rplan.phantombot.event.command.CommandEvent;
import me.mast3rplan.phantombot.event.console.ConsoleInputEvent;
import me.mast3rplan.phantombot.event.irc.channel.IrcChannelUserModeEvent;
import me.mast3rplan.phantombot.event.irc.complete.IrcConnectCompleteEvent;
import me.mast3rplan.phantombot.event.irc.complete.IrcJoinCompleteEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcChannelMessageEvent;
import me.mast3rplan.phantombot.event.irc.message.IrcPrivateMessageEvent;
import me.mast3rplan.phantombot.jerklib.Channel;
import me.mast3rplan.phantombot.jerklib.ConnectionManager;
import me.mast3rplan.phantombot.jerklib.Profile;
import me.mast3rplan.phantombot.jerklib.Session;
import me.mast3rplan.phantombot.script.Script;
import me.mast3rplan.phantombot.script.ScriptApi;
import me.mast3rplan.phantombot.script.ScriptEventManager;
import me.mast3rplan.phantombot.script.ScriptManager;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.SystemUtils;

public class PhantomBot implements Listener
{

    public final String username;
    private final String oauth;
    private String apioauth;
    private String clientid;
    private final String channelName;
    private final String ownerName;
    private final String hostname;
    private int port;
    private int baseport;
    private double msglimit30;
    private String datastore;
    private String datastoreconfig;
    private DataStore dataStoreObj;
    private SecureRandom rng;
    private Profile profile;
    private ConnectionManager connectionManager;
    private final Session session;
    private final HashMap<String, Channel> channels;
    private FollowersCache followersCache;
    private ChannelHostCache hostCache;
    private SubscribersCache subscribersCache;
    private ChannelUsersCache channelUsersCache;
    private HTTPServer httpserver;
    private EventWebSocketServer eventsocketserver;
    private ConsoleInputListener cil;
    private static final boolean debugD = false;
    public static boolean enableDebugging = false;
    public static boolean interactive;
    private boolean exiting = false;
    private Thread t;
    private static PhantomBot instance;

    public static PhantomBot instance()
    {
        return instance;
    }

    public PhantomBot(String username, String oauth, String apioauth, String clientid, String channel, String owner, int baseport,
            String hostname, int port, double msglimit30, String datastore, String datastoreconfig)
    {
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());

        com.gmt2001.Console.out.println();
        com.gmt2001.Console.out.println("PhantomBot Core - gmt2001's edition");
        com.gmt2001.Console.err.println("Build revision " + RepoVersion.getRepoVersion());
        com.gmt2001.Console.out.println("Creator: mast3rplan");
        com.gmt2001.Console.out.println("Developers: gmt2001, GloriousEggroll, PhantomIndex");
        com.gmt2001.Console.out.println();

        interactive = System.getProperty("interactive") != null;

        this.username = username;
        this.oauth = oauth;
        this.apioauth = apioauth;
        this.channelName = channel;
        this.ownerName = owner;
        this.baseport = baseport;
        this.datastore = datastore;
        this.datastoreconfig = datastoreconfig;

        com.gmt2001.Console.out.println("[INIT] Initializing connection manager...");
        this.profile = new Profile(username.toLowerCase());
        this.connectionManager = new ConnectionManager(profile);

        com.gmt2001.Console.out.println("[INIT] Initializing random number generator...");
        rng = new SecureRandom();

        if (hostname.isEmpty())
        {
            this.hostname = "irc.twitch.tv";
            this.port = 6667;
        } else
        {
            this.hostname = hostname;
            this.port = port;
        }

        if (msglimit30 > 0)
        {
            this.msglimit30 = msglimit30;
        } else
        {
            this.msglimit30 = 18.75;
        }

        com.gmt2001.Console.out.println("[INIT] Initializing datastore...");
        if (datastore.equalsIgnoreCase("TempStore"))
        {
            dataStoreObj = TempStore.instance();
        } else if (datastore.equalsIgnoreCase("IniStore"))
        {
            dataStoreObj = IniStore.instance();
        } else
        {
            dataStoreObj = SqliteStore.instance();
        }

        if (datastore.isEmpty() && IniStore.instance().GetFileList().length > 0 && SqliteStore.instance().GetFileList().length == 0)
        {
            com.gmt2001.Console.out.println("[INIT] Converting IniStore data to SqliteStore...");
            ini2sqlite(true);
        }

        this.init();

        /*
         * try { Thread.sleep(3000); } catch (InterruptedException ex) { }
         */
        if (SystemUtils.IS_OS_LINUX && !interactive)
        {
            try
            {
                com.gmt2001.Console.out.println("[INIT] Creating pid file...");
                java.lang.management.RuntimeMXBean runtime = java.lang.management.ManagementFactory.getRuntimeMXBean();
                /*
                 * java.lang.reflect.Field jvm =
                 * runtime.getClass().getDeclaredField("jvm");
                 * jvm.setAccessible(true); sun.management.VMManagement mgmt =
                 * (sun.management.VMManagement) jvm.get(runtime);
                 * java.lang.reflect.Method pid_method =
                 * mgmt.getClass().getDeclaredMethod("getProcessId");
                 * pid_method.setAccessible(true);
                 *
                 * int pid = (Integer) pid_method.invoke(mgmt);
                 */
                int pid = Integer.parseInt(runtime.getName().split("@")[0]);

                //int pid = Integer.parseInt( ( new File("/proc/self")).getCanonicalFile().getName() ); 
                File f = new File("/var/run/PhantomBot." + this.username.toLowerCase() + ".pid");

                try (FileOutputStream fs = new FileOutputStream(f, false))
                {
                    PrintStream ps = new PrintStream(fs);

                    ps.print(pid);
                }

                f.deleteOnExit();
            } catch (/*
                     * NoSuchFieldException | IllegalAccessException |
                     * NoSuchMethodException |
                     * java.lang.reflect.InvocationTargetException |
                     */SecurityException | IllegalArgumentException | IOException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        channels = new HashMap<>();

        com.gmt2001.Console.out.println("[INIT] Requesting irc connection...");
        this.session = connectionManager.requestConnection(this.hostname, this.port, oauth);

        if (clientid.length() == 0)
        {
            this.clientid = "fno0eqq3t8ivzr2c9vnwveu8nxgwh27";
        } else
        {
            this.clientid = clientid;
        }

        com.gmt2001.Console.out.println("[INIT] Initializing twitch api...");
        TwitchAPIv3.instance().SetClientID(this.clientid);
        TwitchAPIv3.instance().SetOAuth(apioauth);

        this.session.addIRCEventListener(new IrcEventHandler());

        com.gmt2001.Console.out.println("[INIT] Core initialization complete...");
    }

    public static void setDebugging(boolean debug)
    {
        PhantomBot.enableDebugging = debug;
    }

    public DataStore getDataStore()
    {
        return dataStoreObj;
    }

    public Session getSession()
    {
        return session;
    }

    public boolean isExiting()
    {
        return exiting;
    }

    public long getMessageInterval()
    {
        return (long) ((30.0 / this.msglimit30) * 1000);
    }

    public Channel getChannel(String channelName)
    {
        return channels.get(channelName);
    }

    public HashMap<String, Channel> getChannels()
    {
        return channels;
    }

    public final void init()
    {
        com.gmt2001.Console.out.println("[INIT] Initializing http server...");
        httpserver = new HTTPServer(baseport, oauth);
        httpserver.start();

        com.gmt2001.Console.out.println("[INIT] Initializing websocket server...");
        eventsocketserver = new EventWebSocketServer(baseport + 1);
        EventBus.instance().register(eventsocketserver);

        if (interactive)
        {
            com.gmt2001.Console.out.println("[INIT] Initializing console input...");
            cil = new ConsoleInputListener();
            cil.start();
        }

        com.gmt2001.Console.out.println("[INIT] Initializing event bus...");
        EventBus.instance().register(this);
        EventBus.instance().register(ScriptEventManager.instance());

        com.gmt2001.Console.out.println("[INIT] Loading datastore parameters...");
        dataStoreObj.LoadConfig(datastoreconfig);

        com.gmt2001.Console.out.println("[INIT] Initializing global script scope...");
        Script.global.defineProperty("inidb", dataStoreObj, 0);
        Script.global.defineProperty("tempdb", TempStore.instance(), 0);
        Script.global.defineProperty("username", UsernameCache.instance(), 0);
        Script.global.defineProperty("twitch", TwitchAPIv3.instance(), 0);
        Script.global.defineProperty("followers", followersCache, 0);
        Script.global.defineProperty("hosts", hostCache, 0);
        Script.global.defineProperty("subscribers", subscribersCache, 0);
        Script.global.defineProperty("channelUsers", channelUsersCache, 0);
        Script.global.defineProperty("botName", username, 0);
        Script.global.defineProperty("channelName", channelName, 0);
        Script.global.defineProperty("channels", channels, 0);
        Script.global.defineProperty("ownerName", ownerName, 0);
        Script.global.defineProperty("random", rng, 0);
        Script.global.defineProperty("connmgr", connectionManager, 0);
        Script.global.defineProperty("hostname", hostname, 0);

        t = new Thread(new Runnable()
        {
            @Override
            public void run()
            {
                onExit();
            }
        });

        Runtime.getRuntime().addShutdownHook(t);

        try
        {
            com.gmt2001.Console.out.println("[INIT] Starting init script...");
            ScriptManager.loadScript(new File("./scripts/init.js"));
        } catch (IOException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }
    }

    @SuppressWarnings("SleepWhileInLoop")
    public void onExit()
    {
        com.gmt2001.Console.out.println("[SHUTDOWN] Bot shutting down...");

        com.gmt2001.Console.out.println("[SHUTDOWN] Stopping event & message dispatching...");
        exiting = true;

        com.gmt2001.Console.out.println("[SHUTDOWN] Terminating web and websocket servers...");
        httpserver.dispose();
        eventsocketserver.dispose();

        com.gmt2001.Console.out.print("[SHUTDOWN] Waiting for running scripts to finish...");
        try
        {
            for (int i = 30; i > 0; i--)
            {
                com.gmt2001.Console.out.print("\r[SHUTDOWN] Waiting for running scripts to finish..." + i + " ");
                Thread.sleep(1000);
            }
        } catch (InterruptedException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

        com.gmt2001.Console.out.println("\r[SHUTDOWN] Waiting for running scripts to finish...  ");

        com.gmt2001.Console.out.println("[SHUTDOWN] Terminating TwitchAPI caches...");
        ChannelHostCache.killall();
        ChannelUsersCache.killall();
        FollowersCache.killall();
        SubscribersCache.killall();

        com.gmt2001.Console.out.println("[SHUTDOWN] Terminating pending timers...");
        ScriptApi.instance().kill();

        com.gmt2001.Console.out.println("[SHUTDOWN] Terminating scripts...");
        HashMap<String, Script> scripts = ScriptManager.getScripts();

        for (Entry<String, Script> script : scripts.entrySet())
        {
            script.getValue().kill();
        }

        com.gmt2001.Console.out.println("[SHUTDOWN] Saving data...");
        dataStoreObj.SaveAll(true);

        com.gmt2001.Console.out.println("[SHUTDOWN] Disconnecting from Twitch IRC...");
        connectionManager.quit();

        com.gmt2001.Console.out.println("[SHUTDOWN] Waiting for JVM to exit...");
    }

    @Subscribe
    public void onIRCConnectComplete(IrcConnectCompleteEvent event)
    {
        if (event.getSession().equals(this.session))
        {
            com.gmt2001.Console.out.println("[IRC] Connection established, requesting ircv3 capability activation...");
            this.session.sayRaw("CAP REQ :twitch.tv/tags");
            this.session.sayRaw("CAP REQ :twitch.tv/commands");
            this.session.sayRaw("CAP REQ :twitch.tv/membership");

            if (channelName.toLowerCase().contains(","))
            {
                String[] c = channelName.toLowerCase().split(",");

                for (String ch : c)
                {
                    com.gmt2001.Console.out.println("[IRC] Requesting join on channel #" + ch + "...");
                    this.session.join("#" + ch);
                }
            } else
            {
                com.gmt2001.Console.out.println("[IRC] Requesting join on channel #" + channelName.toLowerCase() + "...");
                this.session.join("#" + channelName.toLowerCase());
            }
        }
    }

    @Subscribe
    public void onIRCJoinComplete(IrcJoinCompleteEvent event)
    {
        channels.put(event.getChannel().getName(), event.getChannel());

        com.gmt2001.Console.out.println("[IRC] Joined channel " + event.getChannel() + ". Requesting mod list...");

        session.sayChannel(event.getChannel(), ".mods");

        com.gmt2001.Console.out.println("[IRC] Initializing caches for channel " + event.getChannel() + "...");
        this.followersCache = FollowersCache.instance(event.getChannel().getName().toLowerCase());
        this.hostCache = ChannelHostCache.instance(event.getChannel().getName().toLowerCase());
        this.subscribersCache = SubscribersCache.instance(event.getChannel().getName().toLowerCase());
        //this.channelUsersCache = ChannelUsersCache.instance(event.getChannel().getName().toLowerCase());
    }

    @Subscribe
    public void onIRCPrivateMessage(IrcPrivateMessageEvent event)
    {
        if (event.getSender().equalsIgnoreCase("jtv"))
        {
            String message = event.getMessage().toLowerCase();

            if (message.startsWith("the moderators of this room are: "))
            {
                String[] spl = message.substring(33).split(", ");

                for (String spl1 : spl)
                {
                    if (spl1.equalsIgnoreCase(username))
                    {
                        channels.get(event.getChannel().getName()).setAllowSendMessages(true);
                    }
                }
            }
        }
    }

    @Subscribe
    public void onIRCChannelMessage(IrcChannelMessageEvent event)
    {
        String message = event.getMessage();
        String sender = event.getSender();

        if (message.startsWith("!"))
        {
            String commandString = message.substring(1);
            handleCommand(sender, commandString);
        }

        if (sender.equalsIgnoreCase("jtv"))
        {
            message = message.toLowerCase();

            if (message.startsWith("the moderators of this room are: "))
            {
                String[] spl = message.substring(33).split(", ");

                for (String spl1 : spl)
                {
                    if (spl1.equalsIgnoreCase(username))
                    {
                        channels.get(event.getChannel().getName()).setAllowSendMessages(true);
                    }
                }
            }
        }
    }

    @Subscribe
    public void onIRCChannelUserMode(IrcChannelUserModeEvent event)
    {
        if (event.getUser().equalsIgnoreCase(username) && event.getMode().equalsIgnoreCase("o")
                && channels.containsKey(event.getChannel().getName()))
        {
            if (!event.getAdd())
            {
                session.sayChannel(event.getChannel(), ".mods");
            }

            channels.get(event.getChannel().getName()).setAllowSendMessages(event.getAdd());
        }
    }

    @Subscribe
    public void onConsoleMessage(ConsoleInputEvent msg)
    {
        String message = msg.getMsg();
        boolean changed = false;

        if (message.equals("debugon"))
        {
            PhantomBot.setDebugging(true);
        }

        if (message.equals("debugoff"))
        {
            PhantomBot.setDebugging(false);
        }

        if (message.startsWith("inidb.get"))
        {
            String spl[] = message.split(" ", 4);

            com.gmt2001.Console.out.println(dataStoreObj.GetString(spl[1], spl[2], spl[3]));
        }

        if (message.startsWith("inidb.set"))
        {
            String spl[] = message.split(" ", 5);

            dataStoreObj.SetString(spl[1], spl[2], spl[3], spl[4]);
            com.gmt2001.Console.out.println(dataStoreObj.GetString(spl[1], spl[2], spl[3]));
        }

        if (message.equals("apioauth"))
        {
            com.gmt2001.Console.out.print("Please enter the bot owner's api oauth string: ");
            String newoauth = System.console().readLine().trim();

            TwitchAPIv3.instance().SetOAuth(newoauth);
            apioauth = newoauth;

            changed = true;
        }

        if (message.equals("clientid"))
        {
            com.gmt2001.Console.out.print("Please enter the bot api clientid string: ");
            String newclientid = System.console().readLine().trim();

            TwitchAPIv3.instance().SetClientID(newclientid);
            clientid = newclientid;

            changed = true;
        }

        if (message.equals("baseport"))
        {
            com.gmt2001.Console.out.print("Please enter a new base port: ");
            String newbaseport = System.console().readLine().trim();

            baseport = Integer.parseInt(newbaseport);

            changed = true;
        }

        if (changed)
        {
            try
            {
                String data = "";
                data += "user=" + username + "\r\n";
                data += "oauth=" + oauth + "\r\n";
                data += "apioauth=" + apioauth + "\r\n";
                data += "clientid=" + clientid + "\r\n";
                data += "channel=" + channelName.replace("#", "") + "\r\n";
                data += "owner=" + ownerName + "\r\n";
                data += "baseport=" + baseport + "\r\n";
                data += "hostname=" + hostname + "\r\n";
                data += "port=" + port + "\r\n";
                data += "msglimit30=" + msglimit30 + "\r\n";
                data += "datastore=" + datastore;

                Files.write(Paths.get("./botlogin.txt"), data.getBytes(StandardCharsets.UTF_8),
                        StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
                com.gmt2001.Console.out.println("Changes have been saved");
            } catch (IOException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        if (message.equals("save"))
        {
            dataStoreObj.SaveAll(true);
        }

        if (message.equals("quicksave"))
        {
            dataStoreObj.SaveChangedNow();
        }

        if (message.equals("exit"))
        {
            System.exit(0);
        }

        handleCommand(username, message);
    }

    public void handleCommand(String sender, String commandString)
    {
        String command, arguments;
        int split = commandString.indexOf(' ');

        if (split == -1)
        {
            command = commandString;
            arguments = "";
        } else
        {
            command = commandString.substring(0, split);
            arguments = commandString.substring(split + 1);
        }

        if (command.equalsIgnoreCase("save"))
        {
            dataStoreObj.SaveAll(true);
        }

        if (command.equalsIgnoreCase("d"))
        {
            if (debugD)
            {
                com.gmt2001.Console.out.println("Got !d");
            }

            String d = sender.toLowerCase();
            String validityCheck = this.ownerName.toLowerCase();

            if (debugD)
            {
                com.gmt2001.Console.out.println("d=" + d);
                com.gmt2001.Console.out.println("t=" + validityCheck);
            }

            if (d.equalsIgnoreCase(validityCheck) && arguments.startsWith("!"))
            {
                com.gmt2001.Console.out.println("!d command accepted");

                split = arguments.indexOf(' ');

                if (split == -1)
                {
                    command = arguments.substring(1);
                    arguments = "";
                } else
                {
                    command = arguments.substring(1, split);
                    arguments = arguments.substring(split + 1);
                }

                sender = username;

                com.gmt2001.Console.out.println("Issuing command as " + username + " [" + command + "] " + arguments);

                if (command.equalsIgnoreCase("exit"))
                {
                    dataStoreObj.SaveAll(true);
                    System.exit(0);
                }
            }
        }

        EventBus.instance().post(new CommandEvent(sender, command, arguments));
    }

    private static void ini2sqlite(boolean delete)
    {
        com.gmt2001.Console.out.print(">>Initializing...");
        IniStore ini = IniStore.instance();
        SqliteStore sqlite = SqliteStore.instance();
        com.gmt2001.Console.out.println("done");

        com.gmt2001.Console.out.print(">>Wiping existing SqliteStore...");
        String[] deltables = sqlite.GetFileList();
        for (String table : deltables)
        {
            sqlite.RemoveFile(table);
        }
        com.gmt2001.Console.out.println("done");

        com.gmt2001.Console.out.print(">>Copying IniStore to SqliteStore...");
        String[] files = ini.GetFileList();
        int i = 0;
        String str;
        int maxlen = 0;
        int num;
        for (String file : files)
        {
            str = " " + i + " / " + files.length;
            num = maxlen - str.length();
            for (int n = 0; n < num; n++)
            {
                str += " ";
            }
            maxlen = Math.max(maxlen, str.length());
            com.gmt2001.Console.out.print("\r>>Copying IniStore to SqliteStore..." + str);
            sqlite.AddFile(file);

            String[] sections = ini.GetCategoryList(file);
            int b = 0;
            for (String section : sections)
            {
                str = " " + i + " / " + files.length
                        + " [" + b + " / " + sections.length + "]";
                num = maxlen - str.length();
                for (int n = 0; n < num; n++)
                {
                    str += " ";
                }
                maxlen = Math.max(maxlen, str.length());
                com.gmt2001.Console.out.print("\r>>Copying IniStore to SqliteStore..." + str);

                String[] keys = ini.GetKeyList(file, section);
                int k = 0;
                for (String key : keys)
                {
                    str = " " + i + " / " + files.length
                            + " [" + b + " / " + sections.length + "] <" + k + " / " + keys.length + ">";
                    num = maxlen - str.length();
                    for (int n = 0; n < num; n++)
                    {
                        str += " ";
                    }
                    maxlen = Math.max(maxlen, str.length());
                    com.gmt2001.Console.out.print("\r>>Copying IniStore to SqliteStore..." + str);

                    String value = ini.GetString(file, section, key);
                    sqlite.SetString(file, section, key, value);

                    k++;
                }

                b++;
            }

            i++;
        }

        str = "";
        for (i = 0; i < maxlen - 4; i++)
        {
            str += " ";
        }
        com.gmt2001.Console.out.println("\r>>Copying IniStore to SqliteStore...done" + str);

        if (delete)
        {
            com.gmt2001.Console.out.print(">>Deleting IniStore folder...");
            for (String file : files)
            {
                ini.RemoveFile(file);
            }

            File f = new File("./inistore");
            f.delete();
            f.deleteOnExit();
            com.gmt2001.Console.out.println("done");
        }
    }

    public static void main(String[] args) throws IOException
    {
        String user = "";
        String oauth = "";
        String apioauth = "";
        String clientid = "";
        String channel = "";
        String owner = "";
        String hostname = "";
        int baseport = 25000;
        int port = 0;
        double msglimit30 = 0;
        String datastore = "";
        String datastoreconfig = "";

        boolean changed = false;

        com.gmt2001.Console.out.println("The working directory is: " + System.getProperty("user.dir"));

        try
        {
            if (new File("./botlogin.txt").exists())
            {
                String data = FileUtils.readFileToString(new File("./botlogin.txt"));
                String[] lines = data.replaceAll("\\r", "").split("\\n");

                for (String line : lines)
                {
                    if (line.startsWith("user=") && line.length() > 8)
                    {
                        user = line.substring(5);
                    }
                    if (line.startsWith("oauth=") && line.length() > 9)
                    {
                        oauth = line.substring(6);
                    }
                    if (line.startsWith("apioauth=") && line.length() > 12)
                    {
                        apioauth = line.substring(9);
                    }
                    if (line.startsWith("clientid=") && line.length() > 12)
                    {
                        clientid = line.substring(9);
                    }
                    if (line.startsWith("channel=") && line.length() > 11)
                    {
                        channel = line.substring(8);
                    }
                    if (line.startsWith("owner=") && line.length() > 9)
                    {
                        owner = line.substring(6);
                    }
                    if (line.startsWith("baseport=") && line.length() > 10)
                    {
                        baseport = Integer.parseInt(line.substring(9));
                    }
                    if (line.startsWith("hostname=") && line.length() > 10)
                    {
                        hostname = line.substring(9);
                    }
                    if (line.startsWith("port=") && line.length() > 6)
                    {
                        port = Integer.parseInt(line.substring(5));
                    }
                    if (line.startsWith("msglimit30=") && line.length() > 12)
                    {
                        msglimit30 = Double.parseDouble(line.substring(11));
                    }
                    if (line.startsWith("datastore=") && line.length() > 11)
                    {
                        datastore = line.substring(10);
                    }
                }
            }
        } catch (IOException ex)
        {
            com.gmt2001.Console.err.printStackTrace(ex);
        }

        if (user.isEmpty() || oauth.isEmpty() || channel.isEmpty())
        {
            try
            {
                com.gmt2001.Console.out.println("Login details for bot not found");

                com.gmt2001.Console.out.print("Please enter the bot's twitch username: ");
                user = System.console().readLine().trim();

                com.gmt2001.Console.out.println("Visit https://twitchapps.com/tmi/ to generate an oAuth token (including 'oauth:') & type it below.");
                com.gmt2001.Console.out.println("IMPORTANT: This MUST be done while logged in as the bot account!" + "\n");
                com.gmt2001.Console.out.println("Please enter the bot's tmi oauth token: ");
                oauth = System.console().readLine().trim();

                com.gmt2001.Console.out.print("Please enter the name of the twitch channel the bot should join (not the link, just the name): ");
                channel = System.console().readLine().trim();

                changed = true;
            } catch (NullPointerException ex)
            {
                com.gmt2001.Console.err.printStackTrace(ex);
            }
        }

        if (owner.isEmpty())
        {
            owner = channel;

            changed = true;
        }

        if (args.length > 0)
        {
            for (String arg : args)
            {
                if (arg.equalsIgnoreCase("printlogin"))
                {
                    com.gmt2001.Console.out.println("user='" + user + "'");
                    com.gmt2001.Console.out.println("oauth='" + oauth + "'");
                    com.gmt2001.Console.out.println("apioauth='" + apioauth + "'");
                    com.gmt2001.Console.out.println("clientid='" + clientid + "'");
                    com.gmt2001.Console.out.println("channel='" + channel + "'");
                    com.gmt2001.Console.out.println("owner='" + owner + "'");
                    com.gmt2001.Console.out.println("baseport='" + baseport + "'");
                    com.gmt2001.Console.out.println("hostname='" + hostname + "'");
                    com.gmt2001.Console.out.println("port='" + port + "'");
                    com.gmt2001.Console.out.println("msglimit30='" + msglimit30 + "'");
                    com.gmt2001.Console.out.println("datastore='" + datastore + "'");
                }
                if (arg.equalsIgnoreCase("debugon"))
                {
                    PhantomBot.enableDebugging = true;
                }
                if (arg.equalsIgnoreCase("ini2sqlite"))
                {
                    com.gmt2001.Console.out.println("Converting default IniStore to default SqliteStore...");
                    ini2sqlite(false);
                    com.gmt2001.Console.out.println("Operation complete. The bot will now exit");
                    System.exit(0);
                    return;
                }
                if (arg.toLowerCase().startsWith("user=") && arg.length() > 8)
                {
                    if (!user.equals(arg.substring(5)))
                    {
                        user = arg.substring(5);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("oauth=") && arg.length() > 9)
                {
                    if (!oauth.equals(arg.substring(6)))
                    {
                        oauth = arg.substring(6);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("apioauth=") && arg.length() > 12)
                {
                    if (!apioauth.equals(arg.substring(9)))
                    {
                        apioauth = arg.substring(9);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("clientid=") && arg.length() > 12)
                {
                    if (!clientid.equals(arg.substring(9)))
                    {
                        clientid = arg.substring(9);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("channel=") && arg.length() > 11)
                {
                    if (!channel.equals(arg.substring(8)))
                    {
                        channel = arg.substring(8);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("owner=") && arg.length() > 9)
                {
                    if (!owner.equals(arg.substring(6)))
                    {
                        owner = arg.substring(6);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("baseport=") && arg.length() > 10)
                {
                    if (baseport != Integer.parseInt(arg.substring(9)))
                    {
                        baseport = Integer.parseInt(arg.substring(9));
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("hostname=") && arg.length() > 10)
                {
                    if (!hostname.equals(arg.substring(9)))
                    {
                        hostname = arg.substring(9);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("port=") && arg.length() > 6)
                {
                    if (port != Integer.parseInt(arg.substring(5)))
                    {
                        port = Integer.parseInt(arg.substring(5));
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("msglimit30=") && arg.length() > 12)
                {
                    if (msglimit30 != Double.parseDouble(arg.substring(11)))
                    {
                        msglimit30 = Double.parseDouble(arg.substring(11));
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("datastore=") && arg.length() > 11)
                {
                    if (!datastore.equals(arg.substring(10)))
                    {
                        datastore = arg.substring(10);
                        changed = true;
                    }
                }
                if (arg.toLowerCase().startsWith("datastoreconfig=") && arg.length() > 17)
                {
                    datastoreconfig = arg.substring(16);
                }
                if (arg.equalsIgnoreCase("help") || arg.equalsIgnoreCase("--help") || arg.equalsIgnoreCase("-h") || arg.equalsIgnoreCase("-?"))
                {
                    com.gmt2001.Console.out.println("Usage: java -Dfile.encoding=UTF-8 -jar PhantomBot.jar [printlogin] [user=<bot username>] "
                            + "[oauth=<bot irc oauth>] [apioauth=<editor oauth>] [clientid=<oauth clientid>] [channel=<channel to join>] "
                            + "[owner=<bot owner username>] [baseport=<bot webserver port, music server will be +1>] [hostname=<custom irc server>] "
                            + "[port=<custom irc port>] [msglimit30=<message limit per 30 seconds>] "
                            + "[datastore=<DataStore type, for a list, run java -jar PhantomBot.jar storetypes>] "
                            + "[datastoreconfig=<Optional DataStore config option, different for each DataStore type>]");
                    return;
                }
                if (arg.equalsIgnoreCase("storetypes"))
                {
                    com.gmt2001.Console.out.println("DataStore types: IniStore (datastoreconfig parameter is folder name, stores in .ini files), "
                            + "TempStore (Stores in memory, lost on shutdown), "
                            + "SqliteStore (Default, Stores in a SQLite3 database, datastoreconfig parameter is a config file");
                    return;
                }
            }
        }

        if (changed)
        {
            String data = "";
            data += "user=" + user + "\r\n";
            data += "oauth=" + oauth + "\r\n";
            data += "apioauth=" + apioauth + "\r\n";
            data += "clientid=" + clientid + "\r\n";
            data += "channel=" + channel + "\r\n";
            data += "owner=" + owner + "\r\n";
            data += "baseport=" + baseport + "\r\n";
            data += "hostname=" + hostname + "\r\n";
            data += "port=" + port + "\r\n";
            data += "msglimit30=" + msglimit30 + "\r\n";
            data += "datastore=" + datastore;

            Files.write(Paths.get("./botlogin.txt"), data.getBytes(StandardCharsets.UTF_8),
                    StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
        }

        PhantomBot.instance = new PhantomBot(user, oauth, apioauth, clientid, channel, owner, baseport, hostname, port, msglimit30, datastore, datastoreconfig);
    }
}
