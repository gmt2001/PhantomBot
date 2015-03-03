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
package me.mast3rplan.phantombot.jerklib;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class ServerInformation {
    private String caseMapping = "";
    private String ircd = "";
    private String serverName = "";
    private String[] channelPrefixes = new String[]{"#", "&", "!", "+"};
    private String[] statusPrefixes;
    private String[] channelModes;
    private int maxChanNameLen;
    private int maxModesPerCommand;
    private int maxNickLen;
    private int maxSilenceListSize;
    private int maxTopicLen;
    private int maxAwayLen;
    private int maxKickLen;
    private int maxKeyLen;
    private int maxHostLen;
    private int maxUserLen;
    private boolean supportsCNotice;
    private boolean supportsCPrivMsg;
    private boolean supportsBanExceptions;
    private boolean supportsInviteExceptions;
    private boolean supportsSafeList;
    private boolean supportsStatusNotice;
    private boolean supportsCAPAB;
    private boolean supportsNickPrefixes;
    private boolean supportsSilenceList;
    private boolean supportsKnock;
    private boolean supportsWhox;
    private boolean supportsWallchops;
    private boolean supportsWallVoices;
    private boolean supportsUserIP;
    private boolean supportsEtrace;
    private Map<String, Integer> joinLimits = new HashMap<String, Integer>();
    private Map<String, String> nickPrefixMap = new LinkedHashMap<String, String>();
    private Map<String, ModeType> modeMap = new HashMap<String, ModeType>();

    public ServerInformation() {
        this.nickPrefixMap.put("@", "o");
        this.nickPrefixMap.put("%", "h");
        this.nickPrefixMap.put("+", "v");
        this.modeMap.put("o", ModeType.GROUP_A);
    }

    public void parseServerInfo(String rawData) {
        String[] tokens = rawData.split("\\s+");
        this.serverName = tokens[0].substring(1);
        for (int i = 3; i < tokens.length; ++i) {
            String[] subTokens = tokens[i].split("=");
            if (subTokens[0].equals("IRCD")) {
                this.ircd = subTokens[1];
                continue;
            }
            if (subTokens[0].equals("\t")) {
                this.supportsCAPAB = true;
                continue;
            }
            if (subTokens[0].equals("CHANTYPES") && subTokens.length == 2) {
                String[] data = subTokens[1].split("");
                this.channelPrefixes = new String[data.length - 1];
                System.arraycopy(data, 1, this.channelPrefixes, 0, data.length - 1);
                continue;
            }
            if (subTokens[0].equals("EXCEPTS")) {
                this.supportsBanExceptions = true;
                continue;
            }
            if (subTokens[0].equals("INVEX")) {
                this.supportsInviteExceptions = true;
                continue;
            }
            if (subTokens[0].equals("SAFELIST")) {
                this.supportsSafeList = true;
                continue;
            }
            if (subTokens[0].equals("CASEMAPPING")) {
                this.caseMapping = subTokens[1];
                continue;
            }
            if (subTokens[0].equals("CHANNELLEN")) {
                this.maxChanNameLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("MAXCHANNELLEN")) {
                this.maxChanNameLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("TOPICLEN")) {
                this.maxTopicLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("AWAYLEN")) {
                this.maxAwayLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("NICKLEN")) {
                this.maxNickLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("MAXNICKLEN")) {
                this.maxNickLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("KICKLEN")) {
                this.maxKickLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("KEYLEN")) {
                this.maxKeyLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("HOSTLEN")) {
                this.maxHostLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("USERLEN")) {
                this.maxUserLen = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("CNOTICE")) {
                this.supportsCNotice = true;
                continue;
            }
            if (subTokens[0].equals("CPRIVMSG")) {
                this.supportsCPrivMsg = true;
                continue;
            }
            if (subTokens[0].equals("KNOCK")) {
                this.supportsKnock = true;
                continue;
            }
            if (subTokens[0].equals("WHOX")) {
                this.supportsWhox = true;
                continue;
            }
            if (subTokens[0].equals("WALLCHOPS")) {
                this.supportsWallchops = true;
                continue;
            }
            if (subTokens[0].equals("WALLVOICES")) {
                this.supportsWallVoices = true;
                continue;
            }
            if (subTokens[0].equals("USERIP")) {
                this.supportsUserIP = true;
                continue;
            }
            if (subTokens[0].equals("ETRACE")) {
                this.supportsEtrace = true;
                continue;
            }
            if (subTokens[0].equals("SILENCE")) {
                if (subTokens.length == 2) {
                    this.supportsSilenceList = true;
                    this.maxSilenceListSize = Integer.parseInt(subTokens[1]);
                    continue;
                }
                this.supportsSilenceList = false;
                continue;
            }
            if (subTokens[0].equals("CHANLIMIT")) {
                String[] keyVals;
                for (String keyVal : keyVals = subTokens[1].split(",")) {
                    String[] limits = keyVal.split(":");
                    String[] chanPrefixes = limits[0].split("");
                    int limit = -1;
                    if (limits.length == 2) {
                        limit = Integer.parseInt(limits[1]);
                    }
                    for (String chanPrefix : chanPrefixes) {
                        if (chanPrefix.matches("")) continue;
                        this.joinLimits.put(chanPrefix, limit);
                    }
                }
                continue;
            }
            if (subTokens[0].equals("PREFIX")) {
                this.nickPrefixMap.clear();
                if (subTokens.length != 2) continue;
                this.supportsNickPrefixes = true;
                String[] modesAndPrefixes = subTokens[1].split("\\)");
                modesAndPrefixes[0] = modesAndPrefixes[0].substring(1);
                String[] modes = modesAndPrefixes[0].split("");
                String[] prefixes = modesAndPrefixes[1].split("");
                for (int x = 0; x < prefixes.length; ++x) {
                    if (prefixes[x].matches("")) continue;
                    this.nickPrefixMap.put(prefixes[x], modes[x]);
                    this.modeMap.put(modes[x], ModeType.GROUP_B);
                }
                continue;
            }
            if (subTokens[0].equals("MODES")) {
                if (subTokens.length != 2) continue;
                this.maxModesPerCommand = Integer.parseInt(subTokens[1]);
                continue;
            }
            if (subTokens[0].equals("STATUSMSG")) {
                this.supportsStatusNotice = true;
                String[] tmp = subTokens[1].split("");
                this.statusPrefixes = new String[tmp.length - 1];
                System.arraycopy(tmp, 1, this.statusPrefixes, 0, tmp.length - 1);
                continue;
            }
            if (!subTokens[0].equals("CHANMODES")) continue;
            String[] modeGroups = subTokens[1].split(",");
            for (int x = 0; x < modeGroups.length; ++x) {
                String[] modes;
                ModeType mt = ModeType.CUSTOM;
                switch (x) {
                    case 0: {
                        mt = ModeType.GROUP_A;
                        break;
                    }
                    case 1: {
                        mt = ModeType.GROUP_B;
                        break;
                    }
                    case 2: {
                        mt = ModeType.GROUP_C;
                        break;
                    }
                    case 3: {
                        mt = ModeType.GROUP_D;
                    }
                }
                for (String mode : modes = modeGroups[x].split("")) {
                    if (mode.equals("")) continue;
                    this.modeMap.put(mode, mt);
                }
            }
            this.channelModes = this.modeMap.keySet().toArray(new String[this.modeMap.size()]);
        }
    }

    public String[] getModes(ModeType type) {
        ArrayList<String> modesList = new ArrayList<String>();
        for (String key : this.modeMap.keySet()) {
            if (this.modeMap.get(key) != type && type != ModeType.ALL) continue;
            modesList.add(key);
        }
        return modesList.toArray(new String[modesList.size()]);
    }

    public ModeType getTypeForMode(String mode) {
        return this.modeMap.get(mode);
    }

    public String getServerName() {
        return this.serverName;
    }

    public String getIrcdString() {
        return this.ircd;
    }

    public String getCaseMapping() {
        return this.caseMapping;
    }

    public int getChannelJoinLimitForPrefix(String prefix) {
        return this.joinLimits.get(prefix);
    }

    public String[] getSupportedChannelModes() {
        return this.channelModes;
    }

    public boolean supportsCAPAB() {
        return this.supportsCAPAB;
    }

    public boolean supportsCNotice() {
        return this.supportsCNotice;
    }

    public boolean supportsCPrivMsg() {
        return this.supportsCPrivMsg;
    }

    public boolean supportsWhox() {
        return this.supportsWhox;
    }

    public boolean supportsWallChops() {
        return this.supportsWallchops;
    }

    public boolean supportsWallVoices() {
        return this.supportsWallVoices;
    }

    public boolean supportsBanExceptions() {
        return this.supportsBanExceptions;
    }

    public boolean supportsInviteExceptions() {
        return this.supportsInviteExceptions;
    }

    public boolean supportsKnock() {
        return this.supportsKnock;
    }

    public boolean supportsUserIp() {
        return this.supportsUserIP;
    }

    public boolean supportsEtrace() {
        return this.supportsEtrace;
    }

    public boolean supportsSafeList() {
        return this.supportsSafeList;
    }

    public boolean supportsSilenceList() {
        return this.supportsSilenceList;
    }

    public boolean supportsNickPrefixes() {
        return this.supportsNickPrefixes;
    }

    public boolean supportsStatusNotices() {
        return this.supportsStatusNotice;
    }

    public int getMaxModesPerCommnad() {
        return this.maxModesPerCommand;
    }

    public int getMaxAwayLength() {
        return this.maxAwayLen;
    }

    public int getMaxKickLength() {
        return this.maxKickLen;
    }

    public int getMaxNickLength() {
        return this.maxNickLen;
    }

    public int getMaxSilenceListSize() {
        return this.maxSilenceListSize;
    }

    public int getMaxTopicLength() {
        return this.maxTopicLen;
    }

    public int getMaxChannelNameLength() {
        return this.maxChanNameLen;
    }

    public int getMaxKeyLength() {
        return this.maxKeyLen;
    }

    public int getMaxHostLength() {
        return this.maxHostLen;
    }

    public int getMaxUserLength() {
        return this.maxUserLen;
    }

    public List<String> getNickPrefixes() {
        return new ArrayList<String>(this.nickPrefixMap.values());
    }

    public Map<String, String> getNickPrefixMap() {
        return this.nickPrefixMap;
    }

    public String[] getStatusPrefixes() {
        return this.statusPrefixes;
    }

    public String[] getChannelPrefixes() {
        return this.channelPrefixes;
    }

    public static enum ModeType {
        GROUP_A,
        GROUP_B,
        GROUP_C,
        GROUP_D,
        CUSTOM,
        ALL;
        

        private ModeType() {
        }
    }

}

