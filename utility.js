//======================================================================================
// utility.js (should be inherited from "shared.ntf")
//   18-APR-2006 Mark Carson
//   02-JUN-2006 Mark Carson (added embedded cookie functions)
//   05-JUN-2006 Mark Carson (debugged embedded cookie functions)
//   14-JUL-2006 Mark Carson (added extractNumber function)
//   13-NOV-2006 Mark Carson (added and debugged embedded cookie functions)
//   01-AUG-2007 Mark Carson (fixed attribute with no value issue in paramReplace())
//   16-APR-2008 Mark Carson (added paramRemove and login functions)
//   24-JUN-2008 Mark Carson (updated getMSXMLVersion() to report 5.0 and 6.0)
//   18-JUN-2009 Mark Carson (copied currently in use clipboard related functions from bookmark.js
//   03-AUG-2009 Mark Carson (added bookmark '#' detection in getParam() and getParams() )
//   03-AUG-2009 Mark Carson (added getBookmark() function)
//   23-DEC-2009 Mark Carson (added error logic to getWindowWidth() and getWindowHeight())
//                           (added removeParam() and replaceParam() alias/wrapper functions)
//                           (added _getWindowWidth(win) and _getWindowHeight(win) functions)
//   07-APR-2010 Mark Carson (added getBrowser() and isChrome() functions)
//--------------------------------------------------------------------------------------
// 
// absoluteLinkInfo()
// centerWindow()
// clearCookie(name, prompt)
// clearCookiesByPrefix(prefix, prompt)
// clearEmbeddedCookie(realCookie, virtualCookie, prompt) 
// clearEmbeddedCookiesByPrefix(realCookie, prefix, prompt)  
// clipboardCopy(link, desc)
// clipboardSupported()
// embedCookie(realCookieName, virtualCookieName, virtualCookieValue) : returns nbr embedded cookies
// embeddedCookie(realCookie) : pops up a javascript alert with stats (diagnostic)
// extractCookie(realCookie, virtualCookie) : returns embedded value, blank string or null
// extractNumber(source) : return a number, default is 0
// getBookmark(url) 
// getBrowser()
// getCookie(name)
// getCookiesByPrefix(prefixList) 
// getEmbeddedCookie(realCookie, showAlert) 
// getEventElement (event) 
// getEventX (event)
// getEventY (event) 
// getMSXMLVersion() 
// getParam(url, param)
// getParams(url, param)
// getPath(url)
// getProtocol(url)
// getProtocolAndServer (url)
// getQueryString(url)
// getResource(url)
// getServer(url)
// getSmartLink(link)
// getUserAgent()
// getWindowHeight()
// _getWindowHeight(win)
// getWindowWidth()
// _getWindowWidth(win)
// htmlEncode (decoded)
// isChrome()
// isIE()
// isSafari()
// isWebkit()
// jsEncode (decoded)
// linkInfo()
// login() : uses Domino computed text
// paramRemove (url, attr)
// paramReplace (url, attr, value)
// relativeLinkInfo()
// relativeURL (url)
// removeParam (url, attr) - alias/wrapper to paramRemove()
// removeSuffix (str, suffix)
// replaceParam (url, attr, value) - alias/wrapper to paramReplace()
// _setBrowser() - internal function
// setCookie(name, value)
// setSelected (id, value)
// showCookiesByPrefix(prefix)
// submitOnEnter(e)
// thisLinkToClipboard (obj, desc)
// trim (source)
// urlGetServer (url)
// 
//------------------------------------------------------------------------
//
// var strAbsLink
// var strRelLink
//
//========================================================================
 
var strAbsLink = 'An ABSOLUTE LINK is a fully qualified URL which includes the protocol (http:// or https://),\n';
strAbsLink +=    'the domain name or IP Address of the server, and the full path (directories/folders) of the resource.\n\n';
strAbsLink +=    'Relative Links/URLs are prefered when linking one document to another on the same website.\n\n';
strAbsLink +=    'Because Absolute Links/URLs identify a server by name/address directly, links to documents\n';
strAbsLink +=    'which replicate to other servers will cause users to surf back to the original server when\n';
strAbsLink +=    'following a link.\n\n';
strAbsLink +=    'When a website replicates, Absolute Links will become off-site/off-ship links and will result in links that\n';
strAbsLink +=    'load slower (higher latency) and often consume satellite bandwidth. If connectivity is not available to\n';
strAbsLink +=    'the original server, the document will not load if an Absolute Link/URL was specified.\n';
 
var strRelLink = 'A RELATIVE LINK is a partial URL which indicates where a resource is located relative to the current resource.\n\n';
strRelLink +=    'Typically, Relative Links/URLs do not include the protocol identifier (http:// or https://) nor the server\n';
strRelLink +=    'domain name or IP Address. The path (directories/folders) to the resource may be abbreviated as well.\n\n';
strRelLink +=    'A same directory/folder resource won\'t have any path information prepended to it.\n\n';
strRelLink +=    'A resource located in a sub-directory below the current resource will have the sub-directory name,\n';
strRelLink +=    'a slash character, and then the resource name.\n\n'
strRelLink +=    'A resource located in a sub-directory above the current resource will have \"../\" followed by the\n';
strRelLink +=    'the resource name.\n\n';
strRelLink +=    'Relative Links/URLs are prefered when linking one document to another on the same website.\n';
strRelLink +=    'Relative Links/URLs (which do not have a server name/address) will replicate to other servers\n';
strRelLink +=    'while maintaining the intra-server document to document linkage.\n';
 
//------------------------------------------------------------------------
 
function absoluteLinkInfo() {
  alert(strAbsLink);
}
  
//------------------------------------------------------------------------
 
function relativeLinkInfo() {
  alert(strRelLink);
}
 
//------------------------------------------------------------------------
 
function linkInfo() {
  alert(strRelLink + "\n\n" + strAbsLink);
}
//------------------------------------------------------------------------
 
var __uri;
var __protocol = "";
var __server = "";
var __path = "";
var __resource = "";
var __queryString = "";
 
function getProtocol(url) {
  __parseURL(url);
  return __protocol;
}
 
function getServer(url) {
  __parseURL(url);
  return __server;
}
 
function getPath(url) {
  __parseURL(url);
  return __path;
}
 
function getResource(url) {
  __parseURL(url);
  return __resource;
}
 
function getQueryString(url) {
  __parseURL(url);
  return __queryString;
}
//------------------------------------------------------------------------
 
function __parseURL(uri) {
  if (uri == __uri) //previously parsed
    return;
 
  __uri = uri;
  __protocol = "";
  __server = "";
  __path = "";
  __resource = "";
  __queryString = "";
 
  var str = uri; // temp string for parsing
 
  if (!str || !str.indexOf) 
    return;
 
  //--- Split URI into URL and QueryString ---
  var qm = str.indexOf("?");
  if (qm >= 0) {
    __queryString = str.substring(qm+1);
    str = str.substring(0,qm);
  }
 
  //--- Split out protocolor using ":" ---
  var colon = str.indexOf(":");
  if (colon > 0) {
    __protocol = str.substring(0,colon);
    if (str.length > colon)
      str = str.substring(colon + 1);
    else
      str = "";
  }
  
  //--- Split out server using from "//" to "/" ---
  var doubleSlash = str.indexOf("//");
  if (doubleSlash == 0) {
    str = str.substring(2);
    var slash = str.indexOf("/");
    if (slash >= 0) {
      __server = str.substring(0,slash);
      if (str.length > slash)
        str = str.substring(slash + 1);
      else
        str = "";
    }
    else {
      __server = str;
      str = "";
    }
  }
  
  //--- Remove leading slash ---
  if (str.charAt(0) == "/")
    str = str.substring(1);
  //--- Remove trailing slash(s) ---
  while (str.charAt(str.length - 1) == "/")
    str = str.substring(0,str.length - 1);
 
  //--- Split path and resource using last separating slash ---
  var lastSlash = str.lastIndexOf("/");
  if (lastSlash >= 0) {
    __path = str.substring(0,lastSlash);
    __resource = str.substring(lastSlash + 1);
  }
  else {
    __resource = str;
  }
  
  /*
  alert("__parseURL()\nurl=" + uri + "\n\nprotocol=" + __protocol + "\n\nserver=" + __server +
        "\n\npath=" + __path + "\n\nresource=" + __resource + "\n\nqueryString=" + __queryString);
  */
}
//------------------------------------------------------------------------
 
function getSmartLink(link) {
  if (link == null || link == '') {
    return link;
  }
  var docServer  = getServer(document.location.href);
  var linkServer = getServer(link);
  if (linkServer == "" || linkServer.toUpperCase() == docServer.toUpperCase()) {
    var linkPath = getPath(link);
    var linkResource = getResource(link);
    var linkQueryString = getQueryString(link);
    link = "";
    if (linkPath != "")
      link = "/" + linkPath + "/";
    link += linkResource;
    if (linkQueryString != "")
      link += "?" + linkQueryString;
  }
  return link;
}
//------------------------------------------------------- 
 
function thisLinkToClipboard (obj, desc) {
  if (!obj)
    return true;
  var link = obj.href;
  if (link && link != "") {
    clipboardCopy(link, desc);
    return false; // do not allow click to propagate
  }
  return true;
}
//------------------------------------------------------------------------
 
function clipboardCopy(link, desc) {
  if (link == null || link == '') {
    if (desc != null)
      alert ("ERROR - Link was not specified.");
    return false;
  }
  var linkType;
  var docServer  = getServer(document.location.href);
  var linkServer = getServer(link);
  if (linkServer == "" || linkServer.toUpperCase() == docServer.toUpperCase()) {
    linkType = "relative";
    var linkPath = getPath(link);
    var linkResource = getResource(link);
    var linkQueryString = getQueryString(link);
    link = "";
    if (linkPath != "")
      link = "/" + linkPath + "/";
    link += linkResource;
    if (linkQueryString != "")
      link += "?" + linkQueryString;
  }
  else {
    linkType = "absolute";
  }
  if (window.clipboardData) {
    //window.clipboardData.clearData("Text");
    window.clipboardData.setData("Text", link); 
    if (desc != null) {
      var str = "The following " + desc + " " + linkType + " link has been copied onto the clipboard:\n\n" + link;
      if (linkType.toLowerCase() == "relative")
        str += "\n\nYou may also right-click the link and select 'Copy Shortcut' to copy the absolute link to the clipboard";
      alert (str);
    }
  } 
 
  else if (window.netscape) { // Netscape/Mozilla
    //alert ("Netscape/Mozilla Clipboard Code - begin\ndesc=" + desc);
    try {
      netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
      //alert("netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect'); OK"); 
    } catch (everything) { 
      alert("netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect'); FAILED"); 
      return false;
    }
    try {
      var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
      //alert ("Netscape/Mozilla Clipboard Object created OK");
    } catch (everything) {
      alert ("ERROR - Netscape/Mozilla Clipboard Object could not be created.");
      return false;
    }
    try {
      var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
      //alert ("Netscape/Mozilla Transfer Object created OK");
    } catch (everything) {
      alert ("ERROR - Netscape/Mozilla Transfer Object could not be created.");
      return false;
    }
    try {
      trans.addDataFlavor('text/unicode');
      //alert ("trans.addDataFlavor('text/unicode') OK");
      var str = new Object();
      var len = new Object();
      var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
      //alert ("createInstance(Components.interfaces.nsISupportsString) OK");
    } catch (everything) {
      alert ("ERROR - trans.addDataFlavor('text/unicode') or createInstance(Components.interfaces.nsISupportsString) FAILED");
      return false;
    }
    var copytext=link;
    str.data=copytext;
    try {
      trans.setTransferData("text/unicode",str,copytext.length*2);
      //alert ("setTransferData() OK");
    } catch (everything) {
      alert ("ERROR - setTransferData() FAILED");
      return false;
    }
    try {
      var clipid=Components.interfaces.nsIClipboard;
      //alert ("Netscape/Mozilla Clipboard Object created OK");
    } catch (everything) {
      alert ("ERROR - Netscape/Mozilla Clipboard Object could not be created.");
      return false;
    }
    try {
      clip.setData(trans,null,clipid.kGlobalClipboard);
      //alert ("setData () OK);
    } catch (everything) {
      alert ("ERROR - setData() FAILED");
      return false;
    }
    if (desc != null) {
      var str = "The following " + desc + " " + linkType + " link has been copied onto the clipboard:\n\n" + link;
      if (linkType.toLowerCase() == "relative")
        str += "\n\nYou may also right-click the link and select 'Copy Link Location' to copy the absolute link to the clipboard";
      alert (str);
    }
  }
  return false;
} 
//------------------------------------------------------------------------
 
function clipboardSupported() {
  if (window.clipboardData)
    return true;
  else if (window.netscape) 
    return true; //false;
  else 
    return false;
}
//------------------------------------------------------------------------
 
function getProtocolAndServer (url) { 
  var protocol = getProtocol(url);
  var server   = getServer(url);
  if (protocol != "")
    protocol += ":";
  if (server != "")
    server = "//" + server;
  return (protocol + server);
}
//------------------------------------------------------------------------
 
function htmlEncode (decoded) {
  reQuote  = /\"/g;
  reSQuote = /\'/g;
  reGt     = />/g;
  reLt     = /</g;
  var encoded = decoded.replace(reQuote, "&quot;");
  encoded = encoded.replace(reSQuote, "&rsquo;");
  encoded = encoded.replace(reGt, "&gt;");
  encoded = encoded.replace(reLt, "&lt;");
  return encoded;  
}
//------------------------------------------------------------------------
 
function jsEncode (decoded) {
  reQuote  = /\"/g;
  reSQuote = /\'/g;
  var encoded = decoded.replace(reQuote, "\\\"");
  encoded = encoded.replace(reSQuote, "\\\'");
  return encoded;  
}
//------------------------------------------------------------------------
 
function login() {
  var userName = "CN=Mark Carson/O=FSET";
  var url = document.location.href;
  if (userName == "") {
    url = paramRemove(url, "logout");
    url = paramReplace(url, "login", "");
  }
  else {
    url = paramRemove(url, "login");
    url = paramRemove(url, "logout");
    var qm = url.indexOf("?");
    if (qm >= 0)
      url = url.substring(0,qm) + "?logout&redirectto=" + url;
    else
      url += "?logout&redirectto=" + url;
  }
  //alert("login()\nurl=" + url);
  document.location.href = url;
}
//--------------------------------------------------------------------------------------
 
function setSelected (id, value) {
  //alert("setSelected('" + id + "','" + value + "');");
  var obj = document.getElementById(id);
  if (!obj || !obj.options) {
    //alert("setSelected('" + id + "','" + value + "')\nobject not found.");
    return;
  }		 
  for (var i = 0; i < obj.options.length; i++) {
    if (obj.options[i].value == value) {
		   obj.options[i].selected = true;
      //alert("setSelected('" + id + "','" + value + "');\nset item #" + i);
		   return;
		 }  
  }		 
  //alert("setSelected('" + id + "','" + value + "');\nNothing set");
}
//--------------------------------------------------------------------------------------
 
function extractNumber(source) { // useful for getting pixel values from DOM style attrs
  var target = "";
  for (var i = 0; i < source.length; i++) {
     switch (source.charAt(i)) {
	   case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
	   case '-': case '.':
	     target += source.charAt(i);
		 break;
	 } // end switch
  } // end for
  var value = 0;
  if (target != "") {
    try { value =  new Number (target); }
	catch (err) { value = 0; }
  }
  return value;	
}	
 
//======================================================================================
// Embedded cookie sub-system
//   Requires: functions getCookie() and setCookie(); 
//   DOM and Embedded Cookie format (Backus-Naur Form):
//     <cookie> ::= <cookieName> "=" <embeddedCookie> ";"
//     <embeddedCookie> ::= <cookieName> ":" <cookieValue> | "," <embeddedCookie>
//     Example:
//       bullet=bulletOne:won/bulletTwo:too;animal=Aardvark:Artie/Bee:Beatrice/Cow:Clara;
//   Notes: Cookie names & value can not contain "=" or ";" characters
//          Embedded cookie names & value should not contain ":" or "," or "=" or ";" 
//          however these characters will be escaped and they will appear as hex values
//   Functions: 
//     embedCookie(realCookie, virtualCookie, value) : returns nbr embedded cookies
//     extractCookie(realCookie, virtualCookie) : returns embedded value, blank string or null
//     embeddedCookie(realCookie) : pops up a javascript alert with stats (diagnostic)
//
//--------------------------------------------------------------------------------------
 
var embeddedCookieSep  = ",";
var embeddedAttrValSep = ":";
 
//--------------------------------------------------------------------------------------
// embedCookie()
//   realCookie: actual browser cookie in which embedded cookied are stored
//   virtualCookie: name of embedded cookie
//   value: value to be associated with the virtualCookie name
//
//   If value is null, the embedded cookie name/value will be removed
//
//--------------------------------------------------------------------------------------
 
function embedCookie(realCookieName, virtualCookieName, virtualCookieValue) { // returns nbr embedded cookies
  
  //alert("embedCookie(" + realCookieName + ", " + virtualCookieName + ", " + virtualCookieValue + "')");
  virtualCookieName = escape(virtualCookieName);
  if (virtualCookieValue && virtualCookieValue != "")
    virtualCookieValue = escape(virtualCookieValue);
  
  var realCookie = getCookie(realCookieName);
  if (!realCookie) {
    if (virtualCookieValue) {
      var realCookieValue = virtualCookieName + embeddedAttrValSep + virtualCookieValue;
      //alert("No realCookie\nCalling setCookie() with realCookieValue:\n" + realCookieValue);
      setCookie(realCookieName, realCookieValue);
      //alert("embedCookie()\nAfter setCookie()\ngetCookie()=" + getCookie(realCookieName));
      return 1;
    }
    else {
      //alert("embedCookie()\nrealCookie is null and virtualCookieValue is null.\nReturning 0");
      return 0;
    }
  }
  /*
  if (!virtualCookieValue)
    alert("embedCookie()\nrealCookie=" + realCookie);
  */
  var embeddedCookies = realCookie.split(embeddedCookieSep);
  /*
  str = "embeddedCookies:\n";
  for (var i = 0; i < embeddedCookies.length; i++) 
    str += embeddedCookies[i] + "\n";
  alert(str);
  */
 
  var newCookie = "";
  if (virtualCookieValue)
    newCookie = virtualCookieName + embeddedAttrValSep + virtualCookieValue; // updated virtual cookie - head of list
  for (var i = 0; i < embeddedCookies.length; i++) {
    var attrValue = embeddedCookies[i].split(embeddedAttrValSep);
    //alert("realCookieName=" + realCookieName + "\n\nembeddedCookies[" + i + "]=" + embeddedCookies[i]);
    if (attrValue[0] != "" && attrValue[0] != virtualCookieName) {
      if (!virtualCookieValue)
        ; //alert("attrValue[0]=" + attrValue[0] + "\nvirtualCookieName=" + virtualCookieName);
      if (realCookie.length + newCookie.length + embeddedCookies[i].length < 4090) { // 4K max cookie size
        if (newCookie != "")
          newCookie += embeddedCookieSep + embeddedCookies[i];
        else
          newCookie = embeddedCookies[i];
        //alert("attrValue[0]=" + attrValue[0] + "\nnewCookie=" + newCookie);
      }
    }
    else {
      if (!virtualCookieValue)
        ; //alert("Skipping\nattrValue[0]=" + attrValue[0] + "\nvirtualCookieName=" + virtualCookieName + "\nnewCookie=" + newCookie);
    }
  }
  if (newCookie != "")
    setCookie(realCookieName, newCookie);
  else
    clearCookie(realCookieName, false);
  //alert("embedCokie()\nAfter setCookie()\ngetCookie()=" + getCookie(realCookie));
  return embeddedCookie.length;
}
//------------------------------------------------------------------------------
 
function extractCookie(realCookie, virtualCookie) { // returns embedded value
  virtualCookie = escape(virtualCookie);
  var cookie = getCookie(realCookie);
  if (!cookie) {
    //alert("extractCookie(" + realCookie + ", " + virtualCookie + ")\ngetCookie() returned null");
    return null;
  }
  if (cookie.indexOf(virtualCookie + embeddedAttrValSep) >= 0) { // exists
    var embeddedCookie = cookie.split(embeddedCookieSep);
    //var embeddedCookie = cookie.split(escape(embeddedCookieSep));
    for (var i = 0; i < embeddedCookie.length; i++) {
      var attrValue = embeddedCookie[i].split(embeddedAttrValSep);
      //alert("extractCookie(" + realCookie + ", " + virtualCookie + ")\nembeddedCookie.length=" + embeddedCookie.length + "\ni=" + i + "\nattrValue=" + attrValue);
      //var attrValue = embeddedCookie[i].split(escape(embeddedAttrValSep));
      if (attrValue[0] == virtualCookie) {
        if (attrValue[1])
          return unescape(attrValue[1]);
        else
          return "";
      }
    } // end for
  } // end if
  return null;
}
//------------------------------------------------------------------------------
 
function getEmbeddedCookie(realCookie, showAlert) { 
  var cookie = getCookie(realCookie);
  if (!cookie) {
    if (showAlert)
      alert("Cookie: " + realCookie + "\n\nDoes not exist."); 
    return "";
  }
  var embeddedCookie = cookie.split(embeddedCookieSep);
  var str = "";
  for (var i = 0 ; i < embeddedCookie.length; i++)
    str += "\n" + embeddedCookie[i];
  var result = "Browser Cookie: " + realCookie + "\nBrowser Cookie Size: " + cookie.length + "\nEmbedded Cookies: " + embeddedCookie.length + "\n" + str; 
  if (showAlert)
    alert(result);
  return result;
}
//------------------------------------------------------------------------------
 
function embeddedCookie(realCookie) { 
  getEmbeddedCookie(realCookie, true); 
}
//------------------------------------------------------------------------------
 
function clearEmbeddedCookie(realCookie, virtualCookie, prompt) { 
  if (prompt) {
    if (!confirm("Confirm you want to clear your '" + realCookie + " embedded browser cookie named '" + virtualCookie + "'."))
      return;
  }
  embedCookie(realCookie, virtualCookie, null);
}
//------------------------------------------------------------------------------
 
function clearEmbeddedCookiesByPrefix(realCookie, prefix, prompt) { 
  if (prompt) {
    if (!confirm("Confirm you want to clear your '" + realCookie + "' embedded browser cookies which begin with '" + prefix + "'."))
      return;
  }
  prefix = escape(prefix);
  var cookie = getCookie(realCookie);
  if (!cookie) {
    if (prompt)
      alert("Cookie: " + realCookie + "\n\nDoes not exist."); 
    return;
  }
  //alert("realCookie=" + realCookie + "\ncookie=" + cookie); 
  var embeddedCookie = cookie.split(embeddedCookieSep);
  var str = "";
  var aDelete = new Array();
  //alert("clearEmbeddedCookiesByPrefix('" + realCookie + ", '" + prefix + "', " + prompt + ")\nembeddedCookie.length=" + embeddedCookie.length);
  for (var i = 0 ; i < embeddedCookie.length; i++) {
    var attrValue = embeddedCookie[i].split(embeddedAttrValSep);
    //alert("clearEmbeddedCookiesByPrefix('" + realCookie + "', '" + prefix + "', " + prompt + ")\n[" + i + "]\nattrValue=" + attrValue + "\nattrValue[0]=" + attrValue[0] + "\nattrValue[1]=" + attrValue[1]);
    if (attrValue[0].substring(0,prefix.length) == prefix) {
      aDelete[aDelete.length] = unescape(attrValue[0]); // mark for deletion
    }
  }
  for (var i = 0; i < aDelete.length; i++) {
    clearEmbeddedCookie(realCookie, aDelete[i], false);
  }
}
//------------------------------------------------------------------------------
 
function clearCookiesByPrefix(prefix, prompt) { 
  if (isIE()) {
    alert("Cookie clearing is not supported in Internet Explorer.");
    return;
  }
  if (prompt) {
    if (!confirm("Confirm you want to clear your browser cookies which begin with '" + prefix + "'."))
      return;
  }
  //alert("clearCookiesByPrefix('" + prefix +")");
  var cookies;
  if (document.cookie.indexOf("&") >= 0)
    cookies = document.cookie.split("&");
  else
    cookies = document.cookie.split(";");
  //alert("document.cookie=" + document.cookie + "\n\ncookies.length=" + cookies.length);
  if (!cookies) {
    var attrValue = document.cookie.split("=");
    //alert("Sole cookie=" + document.cookie);
    if (trim(attrValue[0]).indexOf(prefix) == 0) {
      //alert("Clearing sole cookie: " + attrValue[0]);
      clearCookie(attrValue[0], false);
    }
    return;
  }
  var arrayPrefix = prefix.split(",");
  for (var i = 0 ; i < cookies.length; i++) {
   // alert("cookies[" + i + "]=" + cookies[i]);
    var attrValue = cookies[i].split("=");
    for (var p = 0 ; p < arrayPrefix.length; p++) {
      //alert("arrayPrefix[" + p + "]=" + arrayPrefix[p]);
      if (trim(attrValue[0]).indexOf(arrayPrefix[p]) == 0) {
        //alert("Clearing cookie: ]" + trim(attrValue[0]) + "[");
        clearCookie(trim(attrValue[0]), false);
      }
    }
  }
}
//--------------------------------------------------------------------------------------
 
function showCookiesByPrefix(prefix) { 
  var allCookies = "";
  var arrayPrefix = prefix.split(",");
  for (var i = 0 ; i < arrayPrefix.length; i++) {
    var theseCookies = getCookiesByPrefix(arrayPrefix[i]);
    //alert("showCookiesByPrefix('" + prefix + "')\narrayPrefix[" + i + "]=" + arrayPrefix[i] + "\n\ntheseCookies=" + theseCookies);
    if (theseCookies && theseCookies != "") {
      if (allCookies!= "")
        allCookies += ", ";
      allCookies += theseCookies;
    }
  }
  alert("Document Cookies:" + allCookies);
}
//--------------------------------------------------------------------------------------
 
function getCookiesByPrefix(prefixList) { 
  prefixes = prefixList.split(",");
  var result = "";
  var cookies = document.cookie.split(";");
  var skipped = "" ;
  for (var i = 0 ; i < cookies.length; i++) {
    var attrValue = cookies[i].split("=");
    var attr = trim(attrValue[0]);
    for (var p = 0 ; p < prefixes.length; p++) {
      var prefix = prefixes[p];
      if (attr.substring(0,prefix.length) == prefix) {
        //alert("getCookiesByPrefix('" + prefix + "')\nFound a match\nAppending:" + unescape(attrValue[1]));
        //result += cookies[i] + " [i=" + i + "][p=" + p + "]\n";
        result += cookies[i] + "\n";
      }
      else {
        //skipped += cookies[i] + " (attr.length=" + attr.length + ", prefix.length=" + prefix.length + ")\n";
      }
    }
  }
  /*
  if (skipped != "")
    alert("getCookiesByPrefix('" + prefix + "')\nSkipped:\n" + skipped);
  */
  return result;
}
//--------------------------------------------------------------------------------------
 
function getCookie(name) { 
  name = trim(name);
  var cookies = document.cookie.split(";");
  for (var i = 0 ; i < cookies.length; i++) {
    var attrValue = cookies[i].split("=");
    var attr = trim(attrValue[0]);
    if (attr == name) {
      //alert("getCookie('" + name + "')\nFound a match\nReturning:" + unescape(attrValue[1]));
      return unescape(attrValue[1]);
    }
    else {
      ; //alert("getCookie('" + name + "')\nSkipping [" + i + "]:\nattrValue[0]:" + attrValue[0] + "\nattrValue[1]:" + attrValue[1]);
    }
  }
  return "";
}
//--------------------------------------------------------------------------------------
 
function setCookie(name, value) { 
  //alert("setCookie('" + name + "', '" + value + "');");
  if (!name || name == "")
    return;
  var zero = 0;
  if (value == zero) 
    value = "0";
  var now = new Date();
  var expires = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // expires in 90 days
  if (value != null && value != "")
    document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + " path=/";
}
//--------------------------------------------------------------------------------------
 
function clearCookie(name, prompt) { 
  if (prompt) {
    if (!confirm("Confirm you want to clear browser cookies named '" + prefix + "'."))
      return;
  }
  var cookieDate = new Date();
  cookieDate.setTime (cookieDate.getTime() - 1);
  document.cookie = name += "=; expires=" + cookieDate.toGMTString();
  /*
  var newCookie = "";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    attrValue = cookies[i].split("=");
    if (attrValue[0] != name) {
      if (newCookie != "")
        newCookie += ";"
      newCookie += cookies[i];
    }
  }
  alert("clearCookie(" + name + ", " + prompt + ")\document.cookie=" + document.cookie + "\n\nnewCookie=" + newCookie);
  document.cookie = newCookie;
  */
}
//--------------------------------------------------------------------------------------
 
 
//======================================================================================
 
function submitOnEnter(e) {  // Submits the first form ([0]) on Enter/Return keypress.
                             // e is event object passed from function invocation.
  var characterCode;
  if (e && e.which)            // Netscape 4 test
    characterCode = e.which;   // character code is contained in NN4's which property
  else 
    characterCode = e.keyCode; //character code is contained in IE's keyCode property
  switch (characterCode) {
    case 13: //if generated character code is equal to ascii 13 (Carriage Return key)
      if (submitChecks(document.forms[0])) 
        document.forms[0].submit(); //submit the first form
      return false;
    default:
      return true;
  }
} 
//--------------------------------------------------------------------------------------
 
function urlGetServer (url) {
  var server;
  var idx = url.indexOf("://");
  if (idx >= 0)  // protocol (such as "http://" or "https://") detected, server name implied
    server = url.substring(idx + 3);
  else
    server = url;
  idx = server.indexOf("/");
  if (idx == 0)
    return "";
  idx = server.indexOf(".");
  if (idx == 0)
    return "";
  if (idx > 0)
    server = server.substring (0,idx);
  return server;
}
//--------------------------------------------------------------------------------------
 
function relativeURL (url) {
  var urlServer = urlGetServer(url);
  if (urlServer == "") 
    return url;
  var docServer = urlGetServer(document.location.href);
  var relURL = url;
  if (docServer.toUpperCase() == urlServer.toUpperCase()) 
    relURL = url.substring(url.indexOf(urlServer) + urlServer.length);
  /*
  alert("relativeURL()\nurl=" + url + 
       "\ndocument.location.href=" + document.location.href + 
       "\nurlServer=" + urlServer + 
       "\ndocServer=" + docServer +
       "\nrelURL=" + relURL);
  */
  return relURL;
}
//--------------------------------------------------------------------------------------
// paramReplace()  Replaces existing query string attribute's value with a specified
//                 value, or adds the attribute/value to the query string if the 
//                 attribute is not part of the existing query string.
//   Inputs: url - typically document.location.href
//           attr - attribute name
//           value - replacement value
//   Return: string (url with replaced/appended new query string value)
//--------------------------------------------------------------------------------------
 
function replaceParam(url, attr, value) { // Wrapper function (has verb/noun naming)
  return paramReplace(url, attr, value);
}
//--------------------------------------------------------------------------------------
 
function paramReplace (url, attr, value) {
  //alert("paramReplace()\nurl=" + url + "\nattr=" + attr + "\nvalue=" + value);
  var qm = url.indexOf("?");                //document.location.href.indexOf("?");
  var eq;
  if (qm >= 0) {
    queryString = url.substring(qm + 1);    //document.location.href.substring(qm + 1);
    resource = url.substring(0, qm);        //document.location.href.substring(0, qm);
  }
  else {
    queryString = "";
    resource = document.location.href;
  }
  //alert("paramReplace(" + attr + ", " + value + ") - Before\n\nresource = " + resource + "\n\nqueryString = " + queryString);
 
  var newQueryString = "";
  var replaced = false;
  var paramArray = queryString.split("&");
  var attrArray  = new Array();
  var valueArray = new Array();
 
  //--- Parsing pass ---
  for (var i = 0 ; i < paramArray.length; i++) {
    eq = paramArray[i].indexOf("=");
    if (eq > 0) {
      attrArray[i]  = paramArray[i].substring(0,eq);
      valueArray[i] = paramArray[i].substring(eq + 1);
    }
    else {
      attrArray[i]  = paramArray[i];
      valueArray[i] = "";
    }
  }
 
  //--- Rebuilding pass ---
  var qmAmp;
  var replaced = false;
  for (var i = 0 ; i < paramArray.length; i++) {
    if (i == 0)
      qmAmp = "?";
    else
      qmAmp = "&";
    if (attrArray[i].toLowerCase() == attr.toLowerCase()) {
      newQueryString += qmAmp + attr;
      if (value && value != "")
        newQueryString += "=" + value;
      else
        newQueryString += "=";
      replaced = true;
    }
    else {
      newQueryString += qmAmp + attrArray[i];
      if (valueArray[i] != "")
        newQueryString += "=" + valueArray[i];
      else
        newQueryString += "=";
    }
  }
    
  if (!replaced) {
    if (newQueryString == "" || newQueryString == "?")
      newQueryString = "?" + attr;
    else
      newQueryString += "&" + attr;
    if (value && value != "")
      newQueryString += "=" + value;
  }
  var returnValue = resource + newQueryString;
  //alert("paramReplace()\nreturnValue=" + returnValue);
  return returnValue;
}
//--------------------------------------------------------------------------------------
// paramRemove()  Removes existing query string attribute and it's value
//   Inputs: source - typically document.location.href
//           attr - attribute name
//   Return: string (url with removed attribute and it's value)
//--------------------------------------------------------------------------------------
 
function removeParam(url, attr) { // Wrapper function (has verb/noun naming)
  return paramRemove(url, attr);
}
//--------------------------------------------------------------------------------------
 
function paramRemove(url, attr) {
  //alert("paramRemove()\nurl=" + url + "\nattr=" + attr);
  var qm = url.indexOf("?");                //document.location.href.indexOf("?");
  var eq;
  if (qm >= 0) {
    queryString = url.substring(qm + 1);    //document.location.href.substring(qm + 1);
    resource = url.substring(0, qm);        //document.location.href.substring(0, qm);
  }
  else {
    queryString = "";
    resource = document.location.href;
  }
  //alert("paramReplace(" + attr + ", " + value + ") - Before\n\nresource = " + resource + "\n\nqueryString = " + queryString);
 
  var newQueryString = "";
  var removed = false;
  var paramArray = queryString.split("&");
  var attrArray  = new Array();
  var valueArray = new Array();
 
  //--- Parsing pass ---
  for (var i = 0 ; i < paramArray.length; i++) {
    eq = paramArray[i].indexOf("=");
    if (eq > 0) {
      attrArray[i]  = paramArray[i].substring(0,eq);
      valueArray[i] = paramArray[i].substring(eq + 1);
    }
    else {
      attrArray[i]  = paramArray[i];
      valueArray[i] = "";
    }
  }
 
  //--- Rebuilding pass ---
  var qmAmp;
  var removed = false;
  for (var i = 0 ; i < paramArray.length; i++) {
    if (i == 0)
      qmAmp = "?";
    else
      qmAmp = "&";
    if (attrArray[i].toLowerCase() != attr.toLowerCase()) {
      newQueryString += qmAmp + attrArray[i];
      if (valueArray[i] != "")
        newQueryString += "=" + valueArray[i];
      else
        newQueryString += "=";
    }
  }
    
  var returnValue = resource + newQueryString;
  //alert("paramRemove()\nreturnValue=" + returnValue);
  return returnValue;
}
//-----------------------------------------------------------------------------
 
function trim (source) {
  if (!source || source == "")
    return source;
  var target = "";
  var first = -1 ;
  var last  = -1;
  for (var i = 0; i < source.length; i++) {
    switch (source.charCodeAt(i)) {
      case   7: // Tab
      case  10: // Line Feed
      case  13: // Carriage Return
      case  32: // Space
        break;
      default:
        if (first < 0)
          first = i;
        last = i;
    }
  }
  if (first >= 0)
    target = source.substring(first, last + 1);
  //alert("trim(" + source + ")\nfirst=" + first + "\nlast=" + last + "\nsource.length=" + source.length + "\ntarget=[" + target + "]\ntarget.length=" + target.length);
  return target;
}
//-----------------------------------------------------------------------------
 
function removeSuffix (str, suffix) {
  var pos = str.lastIndexOf(suffix);
  if (pos < 0)
    return str;
  else
    return str.substring(0,pos);
}
//-----------------------------------------------------------------------------
 
function getWindowWidth() { // Assumes current window to be used
  return _getWindowWidth(window);
}
//-----------------------------------------------------------------------------
 
function _getWindowWidth(win) {
  if (parseInt(navigator.appVersion) > 3) {
    if (navigator.appName=="Netscape") 
      return win.innerWidth;
  }
  if (navigator.appName.indexOf("Microsoft")!= -1) {
    //--- NOTE: IE may not have a document and document.body object before the onLoad event ---
    if (win.document && win.document.body)
      return win.document.body.offsetWidth;
  }
  return 1024; // default width
}
//-----------------------------------------------------------------------------
 
function getWindowHeight() { // Assumes current window to be used
  return _getWindowHeight(window);
}
//-----------------------------------------------------------------------------
 
function _getWindowHeight(win) {
  /*
  if (parseInt(navigator.appVersion) > 3) {
    if (navigator.appName=="Netscape") 
      return win.innerHeight;
  }
  if (navigator.appName.indexOf("Microsoft")!= -1) {
    //--- NOTE: IE may not have a document and document.body object before the onLoad event ---
    if (win.document && win.document.body)
      return win.document.documentElement.clientHeight;
  }
  */
  
  if (window.innerHeight) {
	return window.innerHeight;
  }
  else if (document.documentElement && document.documentElement.clientHeight) {
	return document.documentElement.clientHeight;
  }
  else if (document.body) {
	return document.body.clientHeight;
  }
  
  return 768; // default height
}
//--------------------------------------------------------------------------------------
// getBookmark(url) 
//   Returns the bookmark name from a URL if it exists, otherwise a blank string
//--------------------------------------------------------------------------------------
 
function getBookmark(url) { 
  var hash = url.lastIndexOf('#');
  if (hash >= 0 && hash < url.length - 1)
    return url.substring(hash + 1);
  else
    return "";
}
//--------------------------------------------------------------------------------------
// getParam(url, param) 
//   Generic attribute/value query string decoder
//   Returns a string value of the first/only named attribute
//--------------------------------------------------------------------------------------
 
function getParam(url, param) { //--- Generic attribute/value query string decoder
  urlArray = url.split("?")
  if (urlArray.length > 1) {
    var queryString = urlArray[1]; 
    var hash = queryString.lastIndexOf('#');
    if (hash >= 0) // remove boomark reference
      queryString = queryString.substring(0, hash);
    var qsArray = queryString.split("&");
    for (var i = 0 ; i < qsArray.length; i++) {
      attrValue = qsArray[i];
      avArray = attrValue.split("=");
      if (avArray[0].toLowerCase() == param.toLowerCase()) {       
        return avArray[1];
      }  
    }
  }
  return "";
}  
//--------------------------------------------------------------------------------------
// getParams(url, param)
//   Multiple attribute/value query string decoder
//   Returns an array of values of the named attribute
//   Eaxmple "fubar?snafu=big&snafu=total" would return an array of 2 values for "snafu"
//--------------------------------------------------------------------------------------
 
function getParams(url, param) { 
  var valueArray = new Array();
  urlArray = url.split("?")
  if (urlArray.length > 1) {
    var queryString = urlArray[1]; 
    var hash = queryString.lastIndexOf('#');
    if (hash >= 0) // remove boomark reference
      queryString = queryString.substring(0, hash);
    var qsArray = queryString.split("&");
    for (var i = 0 ; i < qsArray.length; i++) {
      attrValue = qsArray[i];
      avArray = attrValue.split("=");
      if (avArray[0].toLowerCase() == param.toLowerCase()) {       
        valueArray[valueArray.length] = avArray[1];
      }  
    }
  }
  return valueArray;
}  
//-----------------------------------------------------------------------------
 
function getEventX (event) {
  if (isIE()) {
    if (window.event)
      return window.event.x;
  }
  else {
    if (event)
      return event.clientX;
  }
  return null;
}     
//-----------------------------------------------------------------------------
 
function getEventY (event) {
  if (isIE()) {
    if (window.event)
      return window.event.y;
  }
  else {
    if (event)
      return event.clientY;
  }
  return null;
}     
//-----------------------------------------------------------------------------
 
function getEventElement (event) {
  if (isIE()) {
    if (window.event)
      return window.event.srcElement;
  }
  else {
    if (event && event.target)
      return (event.target.tagName ? event.target : event.target.parentNode);
  }
  return null;
}     
//------------------------------------------------------------------------------
 
var _browser = null;
 
function _setBrowser() {
  if (document.all)
    _browser = "IE";
  else {
    var lcUserAgent = navigator.userAgent.toLowerCase();
    if (lcUserAgent.indexOf("chrome") >= 0)
      _browser = "CHROME";
    else if (lcUserAgent.indexOf("webkit") >= 0)
      _browser = "WEBKIT";
    else
      _browser = "W3C";
  } // end else (not IE)
}
//------------------------------------------------------------------------------
 
function getBrowser() {
  if (!_browser) 
    _setBrowser();
  if (_browser != null)
    return _browser;
  else 
    return "";
} 
//------------------------------------------------------------------------------
 
function isIE() {
  if (!_browser) 
    _setBrowser();
  if (_browser == "IE")
    return true;
  else
    return false;
}        
//------------------------------------------------------------------------------
 
function isChrome() {
  var lcUserAgent = navigator.userAgent.toLowerCase();
  if (lcUserAgent.indexOf("chrome") >= 0)
    return true;
  else
    return false;
}
//------------------------------------------------------------------------------
 
function isSafari() {
  var lcUserAgent = navigator.userAgent.toLowerCase();
  if (lcUserAgent.indexOf("chrome") >= 0) // Chrome also reports itself as Safari
    return false;
  else if (lcUserAgent.indexOf("safari") >= 0)
    return true;
  else
    return false;
}
//------------------------------------------------------------------------------
 
function isWebkit() {
  var lcUserAgent = navigator.userAgent.toLowerCase();
  if (lcUserAgent.indexOf("webkit") >= 0)
    return true;
  else
    return false;
}
//-----------------------------------------------------------------------------
 
function centerWindow() {
  var left = (screen.width - getWindowWidth()) / 2;
  if (left < 0)
    left = 0;
  var top  = (screen.height - getWindowHeight()) / 2;
  if (top < 0)
    top = 0;
  window.moveTo(left, top);
}
//-----------------------------------------------------------------------------
 
function getMSXMLVersion() {
  var msxml = null;
  if (!isIE())
    return -1;
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument.6.0");
    return 6.0;
  }
  catch(msxmlError) {
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument.5.0");
    return 5.0;
  }
  catch(msxmlError) {
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument.4.0");
    return 4.0;
  }
  catch(msxmlError) {
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument.3.0");
    return 3.0;
  }
  catch(msxmlError) {
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument.2.6");
    return 2.6;
  }
  catch(msxmlError) {
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument.2.5");
    return 2.5;
  }
  catch(msxmlError) {
  try {
    msxml = new ActiveXObject("MSXML2.DOMDocument");
    return 2.0;
  }
  catch(msxmlError) {
   return 0.0;
  } // catch 2.0
  } // catch 2.5
  } // catch 2.6
  } // catch 3.0
  } // catch 4.0
  } // catch 5.0
  } // catch 6.0
  return -1;
}
//-----------------------------------------------------------------------------
 
function getUserAgent() {
  alert("UserAgent=" + navigator.userAgent);
}
//-----------------------------------------------------------------------------
 
