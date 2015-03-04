package me.mast3rplan.phantombot.store;

import java.util.Iterator;
import java.util.Set;
import redis.clients.jedis.Jedis;

public class DataStore
{

    private static final String PREFIX = "pb";
    private static final Jedis jedis = new Jedis("localhost");
    private static final DataStore instance = new DataStore();

    public static DataStore instance()
    {
        return instance;
    }
    
    public String[] getKeys(String type, String pattern)
    {
        Set<String> o = jedis.keys(PREFIX + "_" + type + "_" + pattern);
        
        String[] s = new String[o.size()];
        
        Iterator it = o.iterator();
        int i = 0;
        
        while (it.hasNext())
        {
            s[i++] = (String)it.next();
        }
        
        return s;
    }
    
    public String[] getKeys(String pattern)
    {
        Set<String> o = jedis.keys(PREFIX + "_" + pattern);
        
        String[] s = new String[o.size()];
        
        Iterator it = o.iterator();
        int i = 0;
        
        while (it.hasNext())
        {
            s[i++] = (String)it.next();
        }
        
        return s;
    }
    
    public boolean exists(String type, String key)
    {
        return jedis.exists(PREFIX + "_" + type + "_" + key);
    }

    public String get(String type, String key)
    {
        return jedis.get(PREFIX + "_" + type + "_" + key);
    }

    public void set(String type, String key, String value)
    {
        jedis.set(PREFIX + "_" + type + "_" + key, value);
    }

    public void del(String type, String key)
    {
        jedis.del(PREFIX + "_" + type + "_" + key);
    }

    public void incr(String type, String key, int amount)
    {
        jedis.incrBy(PREFIX + "_" + type + "_" + key, amount);
    }

    public void decr(String type, String key, int amount)
    {
        jedis.decrBy(PREFIX + "_" + type + "_" + key, amount);
    }
}
