var Pattern = java.util.regex.Pattern;

//Did I miss a top level domain? (The part after the last dot, such as [com, org, net])
//Place it inside this otherTlds variable, with a pipe| character before each one
//Example for .tv: var otherTlds = "|tv";
//Example for .domain and .us: var otherTlds = "|domain|us";
var otherTlds = "";
var tldPattern = "(";
tldPattern += "a(c|ac(ademy|tor)|d|e|ero|f|g|gency|i|l|m|n|o|q|r|rpa|s|sia|t|u|w|x|z)|";
tldPattern += "b(a|ar|argains|b|d|e|erlin|est|f|g|h|i|id|ike|iz|j|lue|m|n|o|outique|r|s|t|uil(d|ers)|uzz|v|w|y|z)|";
tldPattern += "c(a|ab|amera|amp|ar(ds|eers)|at|atering|c|d|enter|eo|f|g|h|heap|hristmas|i|k|";
tldPattern += "l|leaning|lothing|lub|m|n|o|odes|offee|o(m|m(munity|pany|puter))|on(dos|";
tldPattern += "struction|tractors)|oo(l|p)|r|ruises|u|v|w|x|y|z)|";
tldPattern += "d(ance|ating|e|emocrat|iamonds|irectory|j|k|m|o|omains|z)|";
tldPattern += "e(c|du|ducation|e|g|mail|nterprises|quipment|r|s|state|t|u|vents|xp(ert|osed))|";
tldPattern += "f(arm|i|ish|j|k|lights|lorist|m|o|oundation|r|utbol)|";
tldPattern += "g(a|allery|b|d|e|f|g|h|i|ift|l|lass|m|n|ov|p|q|r|raphics|s|t|u|uitars|uru|w|y)|";
tldPattern += "h(k|m|n|ol(dings|iday)|ouse|r|t|u)|";
tldPattern += "i(d|e|l|m|mmobilien|n|ndustries|nfo|nstitute|nt|nternational|o|q|r|s|t)|";
tldPattern += "j(e|m|o|obs|p)|";
tldPattern += "k(aufen|e|g|h|i|im|itchen|iwi|m|n|p|r|red|w|y|z)|";
tldPattern += "l(a|and|b|c|i|ighting|imo|ink|k|r|s|t|u|uxury|v|y)|";
tldPattern += "m(a|aison|an(agement|go)|arketing|c|d|e|enu|g|h|il|k|l|m|n|o|obi|oda|onash|p|q|r|s|t|u|useum|v|w|x|y|z)|";
tldPattern += "n(a|agoya|ame|c|e|et|eustar|f|g|i|inja|l|o|p|r|u|z)|";
tldPattern += "o(kinawa|m|nl|rg)|";
tldPattern += "p(a|art(ners|s)|e|f|g|h|hot(o|ography|os)|ics|ink|k|l|lumbing|m|n|ost|r|ro|ro(ductions|perties)|s|t|ub|w|y)|";
tldPattern += "q(a|pon)|";
tldPattern += "r(e|ecipes|ed|entals|ep(air|ort)|eviews|ich|o|s|u|uhr|w)|";
tldPattern += "s(a|b|c|d|e|exy|g|h|hiksha|hoes|i|ingles|j|k|l|m|n|o|ocial|ol(ar|utions)|r|t|u|upp(lies|ly|ort)|v|x|y|ystems|z)|";
tldPattern += "t(attoo|c|d|echnology|el|f|g|h|ienda|ips|j|k|l|m|n|o|oday|okyo|ools|p|r|ra(ining|vel)|t|v|w|z)|";
tldPattern += "u(a|g|k|no|s|y|z)|";
tldPattern += "v(a|acations|c|e|entures|g|i|i(ajes|llas|sion)|n|ot(e|ing|o)|oyage|u)|";
tldPattern += "w(ang|atch|ed|f|ien|iki|orks|s)|";
tldPattern += "x(xx|yz)|";
tldPattern += "y(e|t)|";
tldPattern += "z(a|m|one|w)";
tldPattern += otherTlds + ")";
var linkPattern = "(http://|https://|ftp://)?(www\\.)?([\\w\\-]+\\.)+" + tldPattern + "(\\.[\\w\\-]{1,4})?";
var emailPattern = "(mailto:)?[\\w\\-\\.]+\\x40([\\w\\-]+\\.)+" + tldPattern + "(\\.[\\w\\-]{1,4})?";
var otherPattern = "(magnet:|mailto:|ed2k://|irc://|ircs://|skype:|ymsgr:|xfire:|steam:|aim:|spotify:)";
var specialTldPattern = "((h|\\|-\\|)(t|7){2}p(s|5|$)?://|(m|\\|\\\\/\\|)(a|@|/-\\\\)(i|1)(l|1)(t|7)(o|0|\\(\\)):)?([\\w\\-]+\\.)+";
specialTldPattern += "(\\.|\\,)(\\s)*((c|\\()(o|0|\\(\\))(m|\\|\\\\/\\|)|(n|\\|/\\||\\|\\\\\\|)(e|3)(t|7)|(o|0|\\(\\))rg|(i|1)(n|\\|/\\||\\|\\\\\\|)f";
specialTldPattern += "(o|0|\\(\\))|r(u|\\|_\\|))";
var lastlink = "";

$.hasLinks = function(event, aggressive) {
    var message = event.getMessage();
        
    if (message != null && message != undefined) {
        message = message.toLowerCase();
    } else {
        return false;
    }
        
    message = $.deobfuscateLinks(message, aggressive);
        
    var m1 = Pattern.compile(linkPattern).matcher(message);
    var m2 = Pattern.compile(emailPattern).matcher(message);
    var m3 = Pattern.compile(otherPattern).matcher(message);
    var s;

    if (m1.find() == true) {
        s = m1.group();
            
        lastlink = s;

        println(">>>>Matched link on linkPattern from " + event.getSender() + ": " + s);
        $.logLink(event.getSender(), "Matched link on linkPattern: " + s)

        return true;
    }
        
    if (m2.find() == true) {
        s = m2.group();
            
        lastlink = s;
            
        println(">>>>Matched link on emailPattern from " + event.getSender() + ": " + s);
        $.logLink(event.getSender(), "Matched link on emailPattern: " + s)

        return true;
    }

    if (m3.find() == true) {
        s = m3.group();
            
        lastlink = s;
            
        println(">>>>Matched link on otherPattern from " + event.getSender() + ": " + s);
        $.logLink(event.getSender(), "Matched link on otherPattern: " + s)

        return true;
    }
    
    return false;
}

$.getLastLink = function() {
    return lastlink;
}

$.deobfuscateLinks = function(message, aggressive) {
    var i;
    var s1;
    var s2;
    
    for (i = 0; i < $.strlen(message); i++) {
        if (message.charCodeAt(i) < 32 || message.charCodeAt(i) > 126) {
            s1 = "";
            s2 = "";
            
            if (i > 0) {
                s1 = message.substring(0, i);
            }
            
            if (i < $.strlen(message)) {
                s2 = message.substring(i + 1);
            }
            
            message = s1 + " " + s2;
        }
    }
    
    message = $.replaceAll(message, "\"", "");
    
    message = $.replaceAll(message, "--", "(dot)");
    
    message = $.replaceAll(message, "[dot]", "(dot)");
    
    message = $.replaceAll(message, "<dot>", "(dot)");
    
    message = $.replaceAll(message, "{dot}", "(dot)");
    
    message = $.replaceAll(message, "(dot)", ".");
    
    if (aggressive) {
        var ms = Pattern.compile(specialTldPattern).matcher(message);
    
        if (ms.find() == true) {
            message = $.replaceAll(message, " dot ", ".");
    
            message = $.replaceAll(message, ",", ".");
    
            message = $.replaceAll(message, "|-|", "h");
    
            message = $.replaceAll(message, "|_|", "u");
    
            message = $.replaceAll(message, "\\/", "v");
    
            message = $.replaceAll(message, "7", "t");
    
            message = $.replaceAll(message, "8", "b");
    
            message = $.replaceAll(message, "|)", "d");
    
            message = $.replaceAll(message, "3", "e");
    
            message = $.replaceAll(message, "1", "i");
    
            message = $.replaceAll(message, "0", "o");
    
            message = $.replaceAll(message, "()", "o");
    
            message = $.replaceAll(message, "(", "c");
    
            message = $.replaceAll(message, "5", "s");
    
            message = $.replaceAll(message, "$", "s");
    
            message = $.replaceAll(message, "/-\\", "a");
    
            message = $.replaceAll(message, "@", "a");
    
            message = $.replaceAll(message, "|\\/|", "m");
    
            message = $.replaceAll(message, "|/|", "n");
    
            message = $.replaceAll(message, "|\\|", "n");
    
            message = $.replaceAll(message, " .", ".");
    
            message = $.replaceAll(message, ". ", ".");
    
            message = $.replaceAll(message, "..", ".");
        }
    }
    
    return message;
}

$.getLongestRepeatedSequence = function (event) {
    var message = event.getMessage();
    
    var m = Pattern.compile("(.+?)\\1+").matcher(message);
    var s1;
    var s2;
    var ret = 0;
    
    while (m.find() == true) {
        s1 = m.group(0);
        s2 = m.group(1);
        
        if ($.strlen(s1) > 0 && $.strlen(s2) > 0) {
            if ($.strlen(s1) > $.strlen(s2)) {
                if (($.strlen(s1) / $.strlen(s2)) > 1) {
                    ret = Math.max(ret, ($.strlen(s1) / $.strlen(s2)));
                }
            } else {
                if (($.strlen(s2) / $.strlen(s1)) > 1) {
                    ret = Math.max(ret, ($.strlen(s2) / $.strlen(s1)));
                }
            }
        }
    }

    return ret;
}

$.getNumberOfRepeatSequences = function (event) {
    var message = event.getMessage();
    
    var m = Pattern.compile("(.+?)\\1+").matcher(message);
    var s1;
    var s2;
    var ret = 0;
    
    while (m.find() == true) {
        s1 = m.group(0);
        s2 = m.group(1);
        
        if ($.strlen(s1) > 0 && $.strlen(s2) > 0) {
            if ($.strlen(s1) > $.strlen(s2)) {
                if (($.strlen(s1) / $.strlen(s2)) > 1) {
                    ret = ret + ($.strlen(s1) / $.strlen(s2));
                }
            } else {
                if (($.strlen(s2) / $.strlen(s1)) > 1) {
                    ret = ret + ($.strlen(s2) / $.strlen(s1));
                }
            }
        }
    }
    
    return ret;
}

$.getLongestUnicodeGraphemeCluster = function(event) {
    var message = event.getMessage();
    
    var m = Pattern.compile("(?>\\P{M}\\p{M}+)+").matcher(message);
    var s1;
    var ret = 0;
    
    while (m.find() == true) {
        s1 = m.group(0);
        
        ret = Math.max(ret, $.strlen(s1));
    }

    return ret;
}

$.getNumberOfNonLetters = function(event) {
    var message = event.getMessage();
    
    var m = Pattern.compile("(\\p{InPhonetic_Extensions}|\\p{InLetterlikeSymbols}|\\p{InDingbats}|\\p{InBoxDrawing}|\\p{InBlockElements}|\\p{InGeometricShapes}|\\p{InHalfwidth_and_Fullwidth_Forms}|[!-/:-@\\[-`{-~])").matcher(message);
    var s1;
    var s2;
    var ret = 0;
    
    while (m.find() == true) {
        s1 = m.group(0);
        
        if ($.strlen(s1) > 0) {
            ret++;
        }
    }
    
    return ret;
}

$.getLongestNonLetterSequence = function(event) {
    var message = event.getMessage();
    
    var m = Pattern.compile("(\\p{InPhonetic_Extensions}|\\p{InLetterlikeSymbols}|\\p{InDingbats}|\\p{InBoxDrawing}|\\p{InBlockElements}|\\p{InGeometricShapes}|\\p{InHalfwidth_and_Fullwidth_Forms}|[!-/:-@\\[-`{-~])*").matcher(message);
    var s1;
    var s2;
    var ret = 0;
    
    while (m.find() == true) {
        s1 = m.group(0);
        
        while (m.find() == true) {
            s1 = m.group(0);
        
            ret = Math.max(ret, $.strlen(s1));
        }
    }

    return ret;
}