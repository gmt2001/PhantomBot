package me.mast3rplan.phantombot.youtube;

import com.google.gdata.client.youtube.YouTubeQuery;
import com.google.gdata.client.youtube.YouTubeQuery.SafeSearch;
import com.google.gdata.client.youtube.YouTubeService;
import com.google.gdata.data.youtube.VideoEntry;
import com.google.gdata.data.youtube.VideoFeed;
import java.net.URL;

public class YoutubeAPI
{

    public static YoutubeAPI instance = new YoutubeAPI("PhantomBot", "AI39si7mhvEV3Tr1UF8OoWY3gMFAy0i25FVI6TGNEnJTtLpJNG4SH1TkWcz0SkeoCeHLIu9a2ZEVANNRyZYhigMCBshjWlZTfA");
    YouTubeService service;

    public YoutubeAPI(String clientID, String developer_key)
    {
        service = new YouTubeService(clientID, developer_key);
        
        Thread.setDefaultUncaughtExceptionHandler(com.gmt2001.UncaughtExceptionHandler.instance());
    }

    public double getVideoLength(String id)
    {
        String entryUrl = "http://gdata.youtube.com/feeds/api/videos/" + id;
        try
        {
            VideoEntry videoEntry = service.getEntry(new URL(entryUrl), VideoEntry.class);
            return videoEntry.getMediaGroup().getDuration() / 60.0;
        } catch (Exception e)
        {
        }
        return 0.0;
    }

    private SafeSearch getSafeSearch(String safeSearch)
    {
        safeSearch = safeSearch.toLowerCase();
        if (safeSearch.equals("none"))
        {
            return YouTubeQuery.SafeSearch.NONE;
        } else if (safeSearch.equals("moderate"))
        {
            return YouTubeQuery.SafeSearch.MODERATE;
        }
        return YouTubeQuery.SafeSearch.STRICT;
    }

    public String getVideoTitle(String id)
    {
        String entryUrl = "http://gdata.youtube.com/feeds/api/videos/" + id;
        try
        {
            VideoEntry videoEntry = service.getEntry(new URL(entryUrl), VideoEntry.class);
            return videoEntry.getTitle().getPlainText();
        } catch (Exception e)
        {
        }
        return null;
    }

    public String searchVideo(String keywords, String safeSearch)
    {
        try
        {
            if (keywords == null)
            {
                return null;
            }
            YouTubeQuery query = new YouTubeQuery(new URL("http://gdata.youtube.com/feeds/api/videos"));
            query.setOrderBy(YouTubeQuery.OrderBy.RELEVANCE);
            query.setFullTextQuery(keywords);
            query.setSafeSearch(getSafeSearch(safeSearch));
            VideoFeed videoFeed = service.query(query, VideoFeed.class);
            for (VideoEntry entry : videoFeed.getEntries())
            {
                String[] id = entry.getId().split(":");
                return id[id.length - 1];
            }
        } catch (Exception e)
        {
        }
        return null;
    }

    public class VideoInfo
    {

        public String id, name;
        public double length;
    }

    public VideoInfo getVideoInfo(String keywords, String safeSearch)
    {
        try
        {
            if (keywords == null)
            {
                return null;
            }
            
            keywords = keywords.trim();
            
            YouTubeQuery query = new YouTubeQuery(new URL("http://gdata.youtube.com/feeds/api/videos"));
            query.setOrderBy(YouTubeQuery.OrderBy.RELEVANCE);
            query.setFullTextQuery(keywords);
            query.setSafeSearch(getSafeSearch(safeSearch));
            VideoFeed videoFeed = service.query(query, VideoFeed.class);
            for (VideoEntry entry : videoFeed.getEntries())
            {
                VideoInfo videoInfo = new VideoInfo();
                videoInfo.name = entry.getTitle().getPlainText();
                String[] id = entry.getId().split(":");
                videoInfo.id = id[id.length - 1];
                videoInfo.length = entry.getMediaGroup().getDuration() / 60.0;
                
                return videoInfo;
            }
        } catch (Exception e)
        {
        }
        return null;
    }
}
