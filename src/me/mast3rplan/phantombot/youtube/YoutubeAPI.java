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
package me.mast3rplan.phantombot.youtube;

import com.google.gdata.client.youtube.YouTubeQuery;
import com.google.gdata.client.youtube.YouTubeQuery.OrderBy;
import com.google.gdata.client.youtube.YouTubeQuery.SafeSearch;
import com.google.gdata.client.youtube.YouTubeService;
import com.google.gdata.data.TextConstruct;
import com.google.gdata.data.youtube.VideoEntry;
import com.google.gdata.data.youtube.VideoFeed;
import com.google.gdata.data.youtube.YouTubeMediaGroup;
import java.net.URL;
import java.util.Iterator;
import java.util.List;

public class YoutubeAPI
{
  public static YoutubeAPI instance = new YoutubeAPI("PhantomBot", "AI39si7mhvEV3Tr1UF8OoWY3gMFAy0i25FVI6TGNEnJTtLpJNG4SH1TkWcz0SkeoCeHLIu9a2ZEVANNRyZYhigMCBshjWlZTfA");
  YouTubeService service;
  
  public YoutubeAPI(String clientID, String developer_key)
  {
    this.service = new YouTubeService(clientID, developer_key);
  }
  
  public double getVideoLength(String id)
  {
    String entryUrl = "http://gdata.youtube.com/feeds/api/videos/" + id;
    try
    {
      VideoEntry videoEntry = (VideoEntry)this.service.getEntry(new URL(entryUrl), VideoEntry.class);
      return videoEntry.getMediaGroup().getDuration().longValue() / 60.0D;
    }
    catch (Exception e) {}
    return 0.0D;
  }
  
  private YouTubeQuery.SafeSearch getSafeSearch(String safeSearch)
  {
    safeSearch = safeSearch.toLowerCase();
    if (safeSearch.equals("none")) {
      return YouTubeQuery.SafeSearch.NONE;
    }
    if (safeSearch.equals("moderate")) {
      return YouTubeQuery.SafeSearch.MODERATE;
    }
    return YouTubeQuery.SafeSearch.STRICT;
  }
  
  public String getVideoTitle(String id)
  {
    String entryUrl = "http://gdata.youtube.com/feeds/api/videos/" + id;
    try
    {
      VideoEntry videoEntry = (VideoEntry)this.service.getEntry(new URL(entryUrl), VideoEntry.class);
      return videoEntry.getTitle().getPlainText();
    }
    catch (Exception e) {}
    return null;
  }
  
  public String searchVideo(String keywords, String safeSearch)
  {
    try
    {
      if (keywords == null) {
        return null;
      }
      YouTubeQuery query = new YouTubeQuery(new URL("http://gdata.youtube.com/feeds/api/videos"));
      query.setOrderBy(YouTubeQuery.OrderBy.RELEVANCE);
      query.setFullTextQuery(keywords);
      query.setSafeSearch(getSafeSearch(safeSearch));
      VideoFeed videoFeed = (VideoFeed)this.service.query(query, VideoFeed.class);
      Iterator i$ = videoFeed.getEntries().iterator();
      if (i$.hasNext())
      {
        VideoEntry entry = (VideoEntry)i$.next();
        
        String[] id = entry.getId().split(":");
        return id[(id.length - 1)];
      }
    }
    catch (Exception e) {}
    return null;
  }
  
  public VideoInfo getVideoInfo(String keywords, String safeSearch)
  {
    try
    {
      if (keywords == null) {
        return null;
      }
      keywords = keywords.trim();
      
      YouTubeQuery query = new YouTubeQuery(new URL("http://gdata.youtube.com/feeds/api/videos"));
      query.setOrderBy(YouTubeQuery.OrderBy.RELEVANCE);
      query.setFullTextQuery(keywords);
      query.setSafeSearch(getSafeSearch(safeSearch));
      VideoFeed videoFeed = (VideoFeed)this.service.query(query, VideoFeed.class);
      Iterator i$ = videoFeed.getEntries().iterator();
      if (i$.hasNext())
      {
        VideoEntry entry = (VideoEntry)i$.next();
        
        VideoInfo videoInfo = new VideoInfo();
        videoInfo.name = entry.getTitle().getPlainText();
        String[] id = entry.getId().split(":");
        videoInfo.id = id[(id.length - 1)];
        videoInfo.length = (entry.getMediaGroup().getDuration().longValue() / 60.0D);
        
        return videoInfo;
      }
    }
    catch (Exception e) {}
    return null;
  }
  
  public class VideoInfo
  {
    public String id;
    public String name;
    public double length;
    
    public VideoInfo() {}
  }
}
