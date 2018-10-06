/**
 * mOxie - multi-runtime File API & XMLHttpRequest L2 Polyfill
 * v1.5.3
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2017-02-02
 */
!function(e,t){var i=function(){var e={};return t.apply(e,arguments),e.moxie};"function"==typeof define&&define.amd?define("moxie",[],i):"object"==typeof module&&module.exports?module.exports=i():e.moxie=i()}(this||window,function(){!function(e,t){"use strict";function i(e,t){for(var i,n=[],r=0;r<e.length;++r){if(i=s[e[r]]||o(e[r]),!i)throw"module definition dependecy not found: "+e[r];n.push(i)}t.apply(null,n)}function n(e,n,r){if("string"!=typeof e)throw"invalid module definition, module id must be defined and be a string";if(n===t)throw"invalid module definition, dependencies must be specified";if(r===t)throw"invalid module definition, definition function must be specified";i(n,function(){s[e]=r.apply(null,arguments)})}function r(e){return!!s[e]}function o(t){for(var i=e,n=t.split(/[.\/]/),r=0;r<n.length;++r){if(!i[n[r]])return;i=i[n[r]]}return i}function a(i){for(var n=0;n<i.length;n++){for(var r=e,o=i[n],a=o.split(/[.\/]/),u=0;u<a.length-1;++u)r[a[u]]===t&&(r[a[u]]={}),r=r[a[u]];r[a[a.length-1]]=s[o]}}var s={};n("moxie/core/utils/Basic",[],function(){function e(e){var t;return e===t?"undefined":null===e?"null":e.nodeType?"node":{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()}function t(){return a(!1,!1,arguments)}function i(){return a(!0,!1,arguments)}function n(){return a(!1,!0,arguments)}function r(){return a(!0,!0,arguments)}function o(i){switch(e(i)){case"array":return Array.prototype.slice.call(i);case"object":return t({},i)}return i}function a(t,i,n){var r,s=n[0];return u(n,function(n,c){c>0&&u(n,function(n,u){var c=-1!==m(e(n),["array","object"]);return n===r||t&&s[u]===r?!0:(c&&i&&(n=o(n)),e(s[u])===e(n)&&c?a(t,i,[s[u],n]):s[u]=n,void 0)})}),s}function s(e,t){function i(){this.constructor=e}for(var n in t)({}).hasOwnProperty.call(t,n)&&(e[n]=t[n]);return i.prototype=t.prototype,e.prototype=new i,e.__parent__=t.prototype,e}function u(e,t){var i,n,r,o;if(e){try{i=e.length}catch(a){i=o}if(i===o||"number"!=typeof i){for(n in e)if(e.hasOwnProperty(n)&&t(e[n],n)===!1)return}else for(r=0;i>r;r++)if(t(e[r],r)===!1)return}}function c(t){var i;if(!t||"object"!==e(t))return!0;for(i in t)return!1;return!0}function l(t,i){function n(r){"function"===e(t[r])&&t[r](function(e){++r<o&&!e?n(r):i(e)})}var r=0,o=t.length;"function"!==e(i)&&(i=function(){}),t&&t.length||i(),n(r)}function d(e,t){var i=0,n=e.length,r=new Array(n);u(e,function(e,o){e(function(e){if(e)return t(e);var a=[].slice.call(arguments);a.shift(),r[o]=a,i++,i===n&&(r.unshift(null),t.apply(this,r))})})}function m(e,t){if(t){if(Array.prototype.indexOf)return Array.prototype.indexOf.call(t,e);for(var i=0,n=t.length;n>i;i++)if(t[i]===e)return i}return-1}function h(t,i){var n=[];"array"!==e(t)&&(t=[t]),"array"!==e(i)&&(i=[i]);for(var r in t)-1===m(t[r],i)&&n.push(t[r]);return n.length?n:!1}function f(e,t){var i=[];return u(e,function(e){-1!==m(e,t)&&i.push(e)}),i.length?i:null}function p(e){var t,i=[];for(t=0;t<e.length;t++)i[t]=e[t];return i}function g(e){return e?String.prototype.trim?String.prototype.trim.call(e):e.toString().replace(/^\s*/,"").replace(/\s*$/,""):e}function x(e){if("string"!=typeof e)return e;var t,i={t:1099511627776,g:1073741824,m:1048576,k:1024};return e=/^([0-9\.]+)([tmgk]?)$/.exec(e.toLowerCase().replace(/[^0-9\.tmkg]/g,"")),t=e[2],e=+e[1],i.hasOwnProperty(t)&&(e*=i[t]),Math.floor(e)}function v(t){var i=[].slice.call(arguments,1);return t.replace(/%[a-z]/g,function(){var t=i.shift();return"undefined"!==e(t)?t:""})}function w(e,t){var i=this;setTimeout(function(){e.call(i)},t||1)}var y=function(){var e=0;return function(t){var i,n=(new Date).getTime().toString(32);for(i=0;5>i;i++)n+=Math.floor(65535*Math.random()).toString(32);return(t||"o_")+n+(e++).toString(32)}}();return{guid:y,typeOf:e,extend:t,extendIf:i,extendImmutable:n,extendImmutableIf:r,inherit:s,each:u,isEmptyObj:c,inSeries:l,inParallel:d,inArray:m,arrayDiff:h,arrayIntersect:f,toArray:p,trim:g,sprintf:v,parseSizeStr:x,delay:w}}),n("moxie/core/utils/Encode",[],function(){var e=function(e){return unescape(encodeURIComponent(e))},t=function(e){return decodeURIComponent(escape(e))},i=function(e,i){if("function"==typeof window.atob)return i?t(window.atob(e)):window.atob(e);var n,r,o,a,s,u,c,l,d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",m=0,h=0,f="",p=[];if(!e)return e;e+="";do a=d.indexOf(e.charAt(m++)),s=d.indexOf(e.charAt(m++)),u=d.indexOf(e.charAt(m++)),c=d.indexOf(e.charAt(m++)),l=a<<18|s<<12|u<<6|c,n=255&l>>16,r=255&l>>8,o=255&l,p[h++]=64==u?String.fromCharCode(n):64==c?String.fromCharCode(n,r):String.fromCharCode(n,r,o);while(m<e.length);return f=p.join(""),i?t(f):f},n=function(t,i){if(i&&(t=e(t)),"function"==typeof window.btoa)return window.btoa(t);var n,r,o,a,s,u,c,l,d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",m=0,h=0,f="",p=[];if(!t)return t;do n=t.charCodeAt(m++),r=t.charCodeAt(m++),o=t.charCodeAt(m++),l=n<<16|r<<8|o,a=63&l>>18,s=63&l>>12,u=63&l>>6,c=63&l,p[h++]=d.charAt(a)+d.charAt(s)+d.charAt(u)+d.charAt(c);while(m<t.length);f=p.join("");var g=t.length%3;return(g?f.slice(0,g-3):f)+"===".slice(g||3)};return{utf8_encode:e,utf8_decode:t,atob:i,btoa:n}}),n("moxie/core/utils/Env",["moxie/core/utils/Basic"],function(e){function t(e,t,i){var n=0,r=0,o=0,a={dev:-6,alpha:-5,a:-5,beta:-4,b:-4,RC:-3,rc:-3,"#":-2,p:1,pl:1},s=function(e){return e=(""+e).replace(/[_\-+]/g,"."),e=e.replace(/([^.\d]+)/g,".$1.").replace(/\.{2,}/g,"."),e.length?e.split("."):[-8]},u=function(e){return e?isNaN(e)?a[e]||-7:parseInt(e,10):0};for(e=s(e),t=s(t),r=Math.max(e.length,t.length),n=0;r>n;n++)if(e[n]!=t[n]){if(e[n]=u(e[n]),t[n]=u(t[n]),e[n]<t[n]){o=-1;break}if(e[n]>t[n]){o=1;break}}if(!i)return o;switch(i){case">":case"gt":return o>0;case">=":case"ge":return o>=0;case"<=":case"le":return 0>=o;case"==":case"=":case"eq":return 0===o;case"<>":case"!=":case"ne":return 0!==o;case"":case"<":case"lt":return 0>o;default:return null}}var i=function(e){var t="",i="?",n="function",r="undefined",o="object",a="name",s="version",u={has:function(e,t){return-1!==t.toLowerCase().indexOf(e.toLowerCase())},lowerize:function(e){return e.toLowerCase()}},c={rgx:function(){for(var t,i,a,s,u,c,l,d=0,m=arguments;d<m.length;d+=2){var h=m[d],f=m[d+1];if(typeof t===r){t={};for(s in f)u=f[s],typeof u===o?t[u[0]]=e:t[u]=e}for(i=a=0;i<h.length;i++)if(c=h[i].exec(this.getUA())){for(s=0;s<f.length;s++)l=c[++a],u=f[s],typeof u===o&&u.length>0?2==u.length?t[u[0]]=typeof u[1]==n?u[1].call(this,l):u[1]:3==u.length?t[u[0]]=typeof u[1]!==n||u[1].exec&&u[1].test?l?l.replace(u[1],u[2]):e:l?u[1].call(this,l,u[2]):e:4==u.length&&(t[u[0]]=l?u[3].call(this,l.replace(u[1],u[2])):e):t[u]=l?l:e;break}if(c)break}return t},str:function(t,n){for(var r in n)if(typeof n[r]===o&&n[r].length>0){for(var a=0;a<n[r].length;a++)if(u.has(n[r][a],t))return r===i?e:r}else if(u.has(n[r],t))return r===i?e:r;return t}},l={browser:{oldsafari:{major:{1:["/8","/1","/3"],2:"/4","?":"/"},version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2000:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",RT:"ARM"}}}},d={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[a,s],[/\s(opr)\/([\w\.]+)/i],[[a,"Opera"],s],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi)\/([\w\.-]+)/i],[a,s],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[a,"IE"],s],[/(edge)\/((\d+)?[\w\.]+)/i],[a,s],[/(yabrowser)\/([\w\.]+)/i],[[a,"Yandex"],s],[/(comodo_dragon)\/([\w\.]+)/i],[[a,/_/g," "],s],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(uc\s?browser|qqbrowser)[\/\s]?([\w\.]+)/i],[a,s],[/(dolfin)\/([\w\.]+)/i],[[a,"Dolphin"],s],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[a,"Chrome"],s],[/XiaoMi\/MiuiBrowser\/([\w\.]+)/i],[s,[a,"MIUI Browser"]],[/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)/i],[s,[a,"Android Browser"]],[/FBAV\/([\w\.]+);/i],[s,[a,"Facebook"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[s,[a,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[s,a],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[a,[s,c.str,l.browser.oldsafari.version]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],[a,s],[/(navigator|netscape)\/([\w\.-]+)/i],[[a,"Netscape"],s],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[a,s]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[s,[a,"EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[a,s],[/rv\:([\w\.]+).*(gecko)/i],[s,a]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[a,s],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[a,[s,c.str,l.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[a,"Windows"],[s,c.str,l.os.windows.version]],[/\((bb)(10);/i],[[a,"BlackBerry"],s],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],[a,s],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],[[a,"Symbian"],s],[/\((series40);/i],[a],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[a,"Firefox OS"],s],[/(nintendo|playstation)\s([wids3portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],[a,s],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[a,"Chromium OS"],s],[/(sunos)\s?([\w\.]+\d)*/i],[[a,"Solaris"],s],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],[a,s],[/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],[[a,"iOS"],[s,/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[[a,"Mac OS"],[s,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,/(haiku)\s(\w+)/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,/(unix)\s?([\w\.]+)*/i],[a,s]]},m=function(e){var i=e||(window&&window.navigator&&window.navigator.userAgent?window.navigator.userAgent:t);this.getBrowser=function(){return c.rgx.apply(this,d.browser)},this.getEngine=function(){return c.rgx.apply(this,d.engine)},this.getOS=function(){return c.rgx.apply(this,d.os)},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS()}},this.getUA=function(){return i},this.setUA=function(e){return i=e,this},this.setUA(i)};return m}(),n=function(){var t={define_property:function(){return!1}(),create_canvas:function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))}(),return_response_type:function(t){try{if(-1!==e.inArray(t,["","text","document"]))return!0;if(window.XMLHttpRequest){var i=new XMLHttpRequest;if(i.open("get","/"),"responseType"in i)return i.responseType=t,i.responseType!==t?!1:!0}}catch(n){}return!1},use_data_uri:function(){var e=new Image;return e.onload=function(){t.use_data_uri=1===e.width&&1===e.height},setTimeout(function(){e.src="data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="},1),!1}(),use_data_uri_over32kb:function(){return t.use_data_uri&&("IE"!==o.browser||o.version>=9)},use_data_uri_of:function(e){return t.use_data_uri&&33e3>e||t.use_data_uri_over32kb()},use_fileinput:function(){if(navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/))return!1;var e=document.createElement("input");return e.setAttribute("type","file"),!e.disabled}};return function(i){var n=[].slice.call(arguments);return n.shift(),"function"===e.typeOf(t[i])?t[i].apply(this,n):!!t[i]}}(),r=(new i).getResult(),o={can:n,uaParser:i,browser:r.browser.name,version:r.browser.version,os:r.os.name,osVersion:r.os.version,verComp:t,swf_url:"../flash/Moxie.swf",xap_url:"../silverlight/Moxie.xap",global_event_dispatcher:"moxie.core.EventTarget.instance.dispatchEvent"};return o.OS=o.os,o}),n("moxie/core/Exceptions",["moxie/core/utils/Basic"],function(e){function t(e,t){var i;for(i in e)if(e[i]===t)return i;return null}return{RuntimeError:function(){function i(e,i){this.code=e,this.name=t(n,e),this.message=this.name+(i||": RuntimeError "+this.code)}var n={NOT_INIT_ERR:1,EXCEPTION_ERR:3,NOT_SUPPORTED_ERR:9,JS_ERR:4};return e.extend(i,n),i.prototype=Error.prototype,i}(),OperationNotAllowedException:function(){function t(e){this.code=e,this.name="OperationNotAllowedException"}return e.extend(t,{NOT_ALLOWED_ERR:1}),t.prototype=Error.prototype,t}(),ImageError:function(){function i(e){this.code=e,this.name=t(n,e),this.message=this.name+": ImageError "+this.code}var n={WRONG_FORMAT:1,MAX_RESOLUTION_ERR:2,INVALID_META_ERR:3};return e.extend(i,n),i.prototype=Error.prototype,i}(),FileException:function(){function i(e){this.code=e,this.name=t(n,e),this.message=this.name+": FileException "+this.code}var n={NOT_FOUND_ERR:1,SECURITY_ERR:2,ABORT_ERR:3,NOT_READABLE_ERR:4,ENCODING_ERR:5,NO_MODIFICATION_ALLOWED_ERR:6,INVALID_STATE_ERR:7,SYNTAX_ERR:8};return e.extend(i,n),i.prototype=Error.prototype,i}(),DOMException:function(){function i(e){this.code=e,this.name=t(n,e),this.message=this.name+": DOMException "+this.code}var n={INDEX_SIZE_ERR:1,DOMSTRING_SIZE_ERR:2,HIERARCHY_REQUEST_ERR:3,WRONG_DOCUMENT_ERR:4,INVALID_CHARACTER_ERR:5,NO_DATA_ALLOWED_ERR:6,NO_MODIFICATION_ALLOWED_ERR:7,NOT_FOUND_ERR:8,NOT_SUPPORTED_ERR:9,INUSE_ATTRIBUTE_ERR:10,INVALID_STATE_ERR:11,SYNTAX_ERR:12,INVALID_MODIFICATION_ERR:13,NAMESPACE_ERR:14,INVALID_ACCESS_ERR:15,VALIDATION_ERR:16,TYPE_MISMATCH_ERR:17,SECURITY_ERR:18,NETWORK_ERR:19,ABORT_ERR:20,URL_MISMATCH_ERR:21,QUOTA_EXCEEDED_ERR:22,TIMEOUT_ERR:23,INVALID_NODE_TYPE_ERR:24,DATA_CLONE_ERR:25};return e.extend(i,n),i.prototype=Error.prototype,i}(),EventException:function(){function t(e){this.code=e,this.name="EventException"}return e.extend(t,{UNSPECIFIED_EVENT_TYPE_ERR:0}),t.prototype=Error.prototype,t}()}}),n("moxie/core/utils/Dom",["moxie/core/utils/Env"],function(e){var t=function(e){return"string"!=typeof e?e:document.getElementById(e)},i=function(e,t){if(!e.className)return!1;var i=new RegExp("(^|\\s+)"+t+"(\\s+|$)");return i.test(e.className)},n=function(e,t){i(e,t)||(e.className=e.className?e.className.replace(/\s+$/,"")+" "+t:t)},r=function(e,t){if(e.className){var i=new RegExp("(^|\\s+)"+t+"(\\s+|$)");e.className=e.className.replace(i,function(e,t,i){return" "===t&&" "===i?" ":""})}},o=function(e,t){return e.currentStyle?e.currentStyle[t]:window.getComputedStyle?window.getComputedStyle(e,null)[t]:void 0},a=function(t,i){function n(e){var t,i,n=0,r=0;return e&&(i=e.getBoundingClientRect(),t="CSS1Compat"===c.compatMode?c.documentElement:c.body,n=i.left+t.scrollLeft,r=i.top+t.scrollTop),{x:n,y:r}}var r,o,a,s=0,u=0,c=document;if(t=t,i=i||c.body,t&&t.getBoundingClientRect&&"IE"===e.browser&&(!c.documentMode||c.documentMode<8))return o=n(t),a=n(i),{x:o.x-a.x,y:o.y-a.y};for(r=t;r&&r!=i&&r.nodeType;)s+=r.offsetLeft||0,u+=r.offsetTop||0,r=r.offsetParent;for(r=t.parentNode;r&&r!=i&&r.nodeType;)s-=r.scrollLeft||0,u-=r.scrollTop||0,r=r.parentNode;return{x:s,y:u}},s=function(e){return{w:e.offsetWidth||e.clientWidth,h:e.offsetHeight||e.clientHeight}};return{get:t,hasClass:i,addClass:n,removeClass:r,getStyle:o,getPos:a,getSize:s}}),n("moxie/core/EventTarget",["moxie/core/utils/Env","moxie/core/Exceptions","moxie/core/utils/Basic"],function(e,t,i){function n(){this.uid=i.guid()}var r={};return i.extend(n.prototype,{init:function(){this.uid||(this.uid=i.guid("uid_"))},addEventListener:function(e,t,n,o){var a,s=this;return this.hasOwnProperty("uid")||(this.uid=i.guid("uid_")),e=i.trim(e),/\s/.test(e)?(i.each(e.split(/\s+/),function(e){s.addEventListener(e,t,n,o)}),void 0):(e=e.toLowerCase(),n=parseInt(n,10)||0,a=r[this.uid]&&r[this.uid][e]||[],a.push({fn:t,priority:n,scope:o||this}),r[this.uid]||(r[this.uid]={}),r[this.uid][e]=a,void 0)},hasEventListener:function(e){var t;return e?(e=e.toLowerCase(),t=r[this.uid]&&r[this.uid][e]):t=r[this.uid],t?t:!1},removeEventListener:function(e,t){var n,o,a=this;if(e=e.toLowerCase(),/\s/.test(e))return i.each(e.split(/\s+/),function(e){a.removeEventListener(e,t)}),void 0;if(n=r[this.uid]&&r[this.uid][e]){if(t){for(o=n.length-1;o>=0;o--)if(n[o].fn===t){n.splice(o,1);break}}else n=[];n.length||(delete r[this.uid][e],i.isEmptyObj(r[this.uid])&&delete r[this.uid])}},removeAllEventListeners:function(){r[this.uid]&&delete r[this.uid]},dispatchEvent:function(e){var n,o,a,s,u,c={},l=!0;if("string"!==i.typeOf(e)){if(s=e,"string"!==i.typeOf(s.type))throw new t.EventException(t.EventException.UNSPECIFIED_EVENT_TYPE_ERR);e=s.type,s.total!==u&&s.loaded!==u&&(c.total=s.total,c.loaded=s.loaded),c.async=s.async||!1}if(-1!==e.indexOf("::")?function(t){n=t[0],e=t[1]}(e.split("::")):n=this.uid,e=e.toLowerCase(),o=r[n]&&r[n][e]){o.sort(function(e,t){return t.priority-e.priority}),a=[].slice.call(arguments),a.shift(),c.type=e,a.unshift(c);var d=[];i.each(o,function(e){a[0].target=e.scope,c.async?d.push(function(t){setTimeout(function(){t(e.fn.apply(e.scope,a)===!1)},1)}):d.push(function(t){t(e.fn.apply(e.scope,a)===!1)})}),d.length&&i.inSeries(d,function(e){l=!e})}return l},bindOnce:function(e,t,i,n){var r=this;r.bind.call(this,e,function o(){return r.unbind(e,o),t.apply(this,arguments)},i,n)},bind:function(){this.addEventListener.apply(this,arguments)},unbind:function(){this.removeEventListener.apply(this,arguments)},unbindAll:function(){this.removeAllEventListeners.apply(this,arguments)},trigger:function(){return this.dispatchEvent.apply(this,arguments)},handleEventProps:function(e){var t=this;this.bind(e.join(" "),function(e){var t="on"+e.type.toLowerCase();"function"===i.typeOf(this[t])&&this[t].apply(this,arguments)}),i.each(e,function(e){e="on"+e.toLowerCase(e),"undefined"===i.typeOf(t[e])&&(t[e]=null)})}}),n.instance=new n,n}),n("moxie/runtime/Runtime",["moxie/core/utils/Env","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/EventTarget"],function(e,t,i,n){function r(e,n,o,s,u){var c,l=this,d=t.guid(n+"_"),m=u||"browser";e=e||{},a[d]=this,o=t.extend({access_binary:!1,access_image_binary:!1,display_media:!1,do_cors:!1,drag_and_drop:!1,filter_by_extension:!0,resize_image:!1,report_upload_progress:!1,return_response_headers:!1,return_response_type:!1,return_status_code:!0,send_custom_headers:!1,select_file:!1,select_folder:!1,select_multiple:!0,send_binary_string:!1,send_browser_cookies:!0,send_multipart:!0,slice_blob:!1,stream_upload:!1,summon_file_dialog:!1,upload_filesize:!0,use_http_method:!0},o),e.preferred_caps&&(m=r.getMode(s,e.preferred_caps,m)),c=function(){var e={};return{exec:function(t,i,n,r){return c[i]&&(e[t]||(e[t]={context:this,instance:new c[i]}),e[t].instance[n])?e[t].instance[n].apply(this,r):void 0},removeInstance:function(t){delete e[t]},removeAllInstances:function(){var i=this;t.each(e,function(e,n){"function"===t.typeOf(e.instance.destroy)&&e.instance.destroy.call(e.context),i.removeInstance(n)})}}}(),t.extend(this,{initialized:!1,uid:d,type:n,mode:r.getMode(s,e.required_caps,m),shimid:d+"_container",clients:0,options:e,can:function(e,i){var n=arguments[2]||o;if("string"===t.typeOf(e)&&"undefined"===t.typeOf(i)&&(e=r.parseCaps(e)),"object"===t.typeOf(e)){for(var a in e)if(!this.can(a,e[a],n))return!1;return!0}return"function"===t.typeOf(n[e])?n[e].call(this,i):i===n[e]},getShimContainer:function(){var e,n=i.get(this.shimid);return n||(e=i.get(this.options.container)||document.body,n=document.createElement("div"),n.id=this.shimid,n.className="moxie-shim moxie-shim-"+this.type,t.extend(n.style,{position:"absolute",top:"0px",left:"0px",width:"1px",height:"1px",overflow:"hidden"}),e.appendChild(n),e=null),n},getShim:function(){return c},shimExec:function(e,t){var i=[].slice.call(arguments,2);return l.getShim().exec.call(this,this.uid,e,t,i)},exec:function(e,t){var i=[].slice.call(arguments,2);return l[e]&&l[e][t]?l[e][t].apply(this,i):l.shimExec.apply(this,arguments)},destroy:function(){if(l){var e=i.get(this.shimid);e&&e.parentNode.removeChild(e),c&&c.removeAllInstances(),this.unbindAll(),delete a[this.uid],this.uid=null,d=l=c=e=null}}}),this.mode&&e.required_caps&&!this.can(e.required_caps)&&(this.mode=!1)}var o={},a={};return r.order="html5,flash,silverlight,html4",r.getRuntime=function(e){return a[e]?a[e]:!1},r.addConstructor=function(e,t){t.prototype=n.instance,o[e]=t},r.getConstructor=function(e){return o[e]||null},r.getInfo=function(e){var t=r.getRuntime(e);return t?{uid:t.uid,type:t.type,mode:t.mode,can:function(){return t.can.apply(t,arguments)}}:null},r.parseCaps=function(e){var i={};return"string"!==t.typeOf(e)?e||{}:(t.each(e.split(","),function(e){i[e]=!0}),i)},r.can=function(e,t){var i,n,o=r.getConstructor(e);return o?(i=new o({required_caps:t}),n=i.mode,i.destroy(),!!n):!1},r.thatCan=function(e,t){var i=(t||r.order).split(/\s*,\s*/);for(var n in i)if(r.can(i[n],e))return i[n];return null},r.getMode=function(e,i,n){var r=null;if("undefined"===t.typeOf(n)&&(n="browser"),i&&!t.isEmptyObj(e)){if(t.each(i,function(i,n){if(e.hasOwnProperty(n)){var o=e[n](i);if("string"==typeof o&&(o=[o]),r){if(!(r=t.arrayIntersect(r,o)))return r=!1}else r=o}}),r)return-1!==t.inArray(n,r)?n:r[0];if(r===!1)return!1}return n},r.capTrue=function(){return!0},r.capFalse=function(){return!1},r.capTest=function(e){return function(){return!!e}},r}),n("moxie/runtime/RuntimeClient",["moxie/core/utils/Env","moxie/core/Exceptions","moxie/core/utils/Basic","moxie/runtime/Runtime"],function(e,t,i,n){return function(){var e;i.extend(this,{connectRuntime:function(r){function o(i){var a,u;return i.length?(a=i.shift().toLowerCase(),(u=n.getConstructor(a))?(e=new u(r),e.bind("Init",function(){e.initialized=!0,setTimeout(function(){e.clients++,s.ruid=e.uid,s.trigger("RuntimeInit",e)},1)}),e.bind("Error",function(){e.destroy(),o(i)}),e.bind("Exception",function(e,i){var n=i.name+"(#"+i.code+")"+(i.message?", from: "+i.message:"");s.trigger("RuntimeError",new t.RuntimeError(t.RuntimeError.EXCEPTION_ERR,n))}),e.mode?(e.init(),void 0):(e.trigger("Error"),void 0)):(o(i),void 0)):(s.trigger("RuntimeError",new t.RuntimeError(t.RuntimeError.NOT_INIT_ERR)),e=null,void 0)}var a,s=this;if("string"===i.typeOf(r)?a=r:"string"===i.typeOf(r.ruid)&&(a=r.ruid),a){if(e=n.getRuntime(a))return s.ruid=a,e.clients++,e;throw new t.RuntimeError(t.RuntimeError.NOT_INIT_ERR)}o((r.runtime_order||n.order).split(/\s*,\s*/))},disconnectRuntime:function(){e&&--e.clients<=0&&e.destroy(),e=null},getRuntime:function(){return e&&e.uid?e:e=null},exec:function(){return e?e.exec.apply(this,arguments):null},can:function(t){return e?e.can(t):!1}})}}),n("moxie/file/Blob",["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/runtime/RuntimeClient"],function(e,t,i){function n(o,a){function s(t,i,o){var a,s=r[this.uid];return"string"===e.typeOf(s)&&s.length?(a=new n(null,{type:o,size:i-t}),a.detach(s.substr(t,a.size)),a):null}i.call(this),o&&this.connectRuntime(o),a?"string"===e.typeOf(a)&&(a={data:a}):a={},e.extend(this,{uid:a.uid||e.guid("uid_"),ruid:o,size:a.size||0,type:a.type||"",slice:function(e,t,i){return this.isDetached()?s.apply(this,arguments):this.getRuntime().exec.call(this,"Blob","slice",this.getSource(),e,t,i)},getSource:function(){return r[this.uid]?r[this.uid]:null},detach:function(e){if(this.ruid&&(this.getRuntime().exec.call(this,"Blob","destroy"),this.disconnectRuntime(),this.ruid=null),e=e||"","data:"==e.substr(0,5)){var i=e.indexOf(";base64,");this.type=e.substring(5,i),e=t.atob(e.substring(i+8))}this.size=e.length,r[this.uid]=e},isDetached:function(){return!this.ruid&&"string"===e.typeOf(r[this.uid])},destroy:function(){this.detach(),delete r[this.uid]}}),a.data?this.detach(a.data):r[this.uid]=a}var r={};return n}),n("moxie/core/I18n",["moxie/core/utils/Basic"],function(e){var t={};return{addI18n:function(i){return e.extend(t,i)},translate:function(e){return t[e]||e},_:function(e){return this.translate(e)},sprintf:function(t){var i=[].slice.call(arguments,1);return t.replace(/%[a-z]/g,function(){var t=i.shift();return"undefined"!==e.typeOf(t)?t:""})}}}),n("moxie/core/utils/Mime",["moxie/core/utils/Basic","moxie/core/I18n"],function(e,t){var i="application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mp3 mpga mpega mp2,audio/x-wav,wav,audio/x-m4a,m4a,audio/ogg,oga ogg,audio/aiff,aiff aif,audio/flac,flac,audio/aac,aac,audio/ac3,ac3,audio/x-ms-wma,wma,image/bmp,bmp,image/gif,gif,image/jpeg,jpg jpeg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gpp 3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,video/ogg,ogv,video/x-matroska,mkv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe",n={mimes:{},extensions:{},addMimeType:function(e){var t,i,n,r=e.split(/,/);for(t=0;t<r.length;t+=2){for(n=r[t+1].split(/ /),i=0;i<n.length;i++)this.mimes[n[i]]=r[t];this.extensions[r[t]]=n}},extList2mimes:function(t,i){var n,r,o,a,s=this,u=[];for(r=0;r<t.length;r++)for(n=t[r].extensions.toLowerCase().split(/\s*,\s*/),o=0;o<n.length;o++){if("*"===n[o])return[];if(a=s.mimes[n[o]],i&&/^\w+$/.test(n[o]))u.push("."+n[o]);else if(a&&-1===e.inArray(a,u))u.push(a);else if(!a)return[]}return u},mimes2exts:function(t){var i=this,n=[];return e.each(t,function(t){if(t=t.toLowerCase(),"*"===t)return n=[],!1;var r=t.match(/^(\w+)\/(\*|\w+)$/);r&&("*"===r[2]?e.each(i.extensions,function(e,t){new RegExp("^"+r[1]+"/").test(t)&&[].push.apply(n,i.extensions[t])}):i.extensions[t]&&[].push.apply(n,i.extensions[t]))}),n},mimes2extList:function(i){var n=[],r=[];return"string"===e.typeOf(i)&&(i=e.trim(i).split(/\s*,\s*/)),r=this.mimes2exts(i),n.push({title:t.translate("Files"),extensions:r.length?r.join(","):"*"}),n.mimes=i,n},getFileExtension:function(e){var t=e&&e.match(/\.([^.]+)$/);return t?t[1].toLowerCase():""},getFileMime:function(e){return this.mimes[this.getFileExtension(e)]||""}};return n.addMimeType(i),n}),n("moxie/file/FileInput",["moxie/core/utils/Basic","moxie/core/utils/Env","moxie/core/utils/Mime","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/core/EventTarget","moxie/core/I18n","moxie/runtime/Runtime","moxie/runtime/RuntimeClient"],function(e,t,i,n,r,o,a,s,u){function c(t){var o,c,d;if(-1!==e.inArray(e.typeOf(t),["string","node"])&&(t={browse_button:t}),c=n.get(t.browse_button),!c)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR);d={accept:[{title:a.translate("All Files"),extensions:"*"}],multiple:!1,required_caps:!1,container:c.parentNode||document.body},t=e.extend({},d,t),"string"==typeof t.required_caps&&(t.required_caps=s.parseCaps(t.required_caps)),"string"==typeof t.accept&&(t.accept=i.mimes2extList(t.accept)),o=n.get(t.container),o||(o=document.body),"static"===n.getStyle(o,"position")&&(o.style.position="relative"),o=c=null,u.call(this),e.extend(this,{uid:e.guid("uid_"),ruid:null,shimid:null,files:null,init:function(){var i=this;i.bind("RuntimeInit",function(r,o){i.ruid=o.uid,i.shimid=o.shimid,i.bind("Ready",function(){i.trigger("Refresh")},999),i.bind("Refresh",function(){var i,r,a,s,u;a=n.get(t.browse_button),s=n.get(o.shimid),a&&(i=n.getPos(a,n.get(t.container)),r=n.getSize(a),u=parseInt(n.getStyle(a,"z-index"),10)||0,s&&e.extend(s.style,{top:i.y+"px",left:i.x+"px",width:r.w+"px",height:r.h+"px",zIndex:u+1})),s=a=null}),o.exec.call(i,"FileInput","init",t)}),i.connectRuntime(e.extend({},t,{required_caps:{select_file:!0}}))},getOption:function(e){return t[e]},setOption:function(e,n){if(t.hasOwnProperty(e)){var o=t[e];switch(e){case"accept":"string"==typeof n&&(n=i.mimes2extList(n));break;case"container":case"required_caps":throw new r.FileException(r.FileException.NO_MODIFICATION_ALLOWED_ERR)}t[e]=n,this.exec("FileInput","setOption",e,n),this.trigger("OptionChanged",e,n,o)}},disable:function(t){var i=this.getRuntime();i&&this.exec("FileInput","disable","undefined"===e.typeOf(t)?!0:t)},refresh:function(){this.trigger("Refresh")},destroy:function(){var t=this.getRuntime();t&&(t.exec.call(this,"FileInput","destroy"),this.disconnectRuntime()),"array"===e.typeOf(this.files)&&e.each(this.files,function(e){e.destroy()}),this.files=null,this.unbindAll()}}),this.handleEventProps(l)}var l=["ready","change","cancel","mouseenter","mouseleave","mousedown","mouseup"];return c.prototype=o.instance,c}),n("moxie/file/File",["moxie/core/utils/Basic","moxie/core/utils/Mime","moxie/file/Blob"],function(e,t,i){function n(n,r){r||(r={}),i.apply(this,arguments),this.type||(this.type=t.getFileMime(r.name));var o;if(r.name)o=r.name.replace(/\\/g,"/"),o=o.substr(o.lastIndexOf("/")+1);else if(this.type){var a=this.type.split("/")[0];o=e.guid((""!==a?a:"file")+"_"),t.extensions[this.type]&&(o+="."+t.extensions[this.type][0])}e.extend(this,{name:o||e.guid("file_"),relativePath:"",lastModifiedDate:r.lastModifiedDate||(new Date).toLocaleString()})}return n.prototype=i.prototype,n}),n("moxie/file/FileDrop",["moxie/core/I18n","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/core/utils/Basic","moxie/core/utils/Env","moxie/file/File","moxie/runtime/RuntimeClient","moxie/core/EventTarget","moxie/core/utils/Mime"],function(e,t,i,n,r,o,a,s,u){function c(i){var r,o=this;"string"==typeof i&&(i={drop_zone:i}),r={accept:[{title:e.translate("All Files"),extensions:"*"}],required_caps:{drag_and_drop:!0}},i="object"==typeof i?n.extend({},r,i):r,i.container=t.get(i.drop_zone)||document.body,"static"===t.getStyle(i.container,"position")&&(i.container.style.position="relative"),"string"==typeof i.accept&&(i.accept=u.mimes2extList(i.accept)),a.call(o),n.extend(o,{uid:n.guid("uid_"),ruid:null,files:null,init:function(){o.bind("RuntimeInit",function(e,t){o.ruid=t.uid,t.exec.call(o,"FileDrop","init",i),o.dispatchEvent("ready")}),o.connectRuntime(i)},destroy:function(){var e=this.getRuntime();e&&(e.exec.call(this,"FileDrop","destroy"),this.disconnectRuntime()),this.files=null,this.unbindAll()}}),this.handleEventProps(l)}var l=["ready","dragenter","dragleave","drop","error"];return c.prototype=s.instance,c}),n("moxie/file/FileReader",["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/core/Exceptions","moxie/core/EventTarget","moxie/file/Blob","moxie/runtime/RuntimeClient"],function(e,t,i,n,r,o){function a(){function n(e,n){if(this.trigger("loadstart"),this.readyState===a.LOADING)return this.trigger("error",new i.DOMException(i.DOMException.INVALID_STATE_ERR)),this.trigger("loadend"),void 0;
if(!(n instanceof r))return this.trigger("error",new i.DOMException(i.DOMException.NOT_FOUND_ERR)),this.trigger("loadend"),void 0;if(this.result=null,this.readyState=a.LOADING,n.isDetached()){var o=n.getSource();switch(e){case"readAsText":case"readAsBinaryString":this.result=o;break;case"readAsDataURL":this.result="data:"+n.type+";base64,"+t.btoa(o)}this.readyState=a.DONE,this.trigger("load"),this.trigger("loadend")}else this.connectRuntime(n.ruid),this.exec("FileReader","read",e,n)}o.call(this),e.extend(this,{uid:e.guid("uid_"),readyState:a.EMPTY,result:null,error:null,readAsBinaryString:function(e){n.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){n.call(this,"readAsDataURL",e)},readAsText:function(e){n.call(this,"readAsText",e)},abort:function(){this.result=null,-1===e.inArray(this.readyState,[a.EMPTY,a.DONE])&&(this.readyState===a.LOADING&&(this.readyState=a.DONE),this.exec("FileReader","abort"),this.trigger("abort"),this.trigger("loadend"))},destroy:function(){this.abort(),this.exec("FileReader","destroy"),this.disconnectRuntime(),this.unbindAll()}}),this.handleEventProps(s),this.bind("Error",function(e,t){this.readyState=a.DONE,this.error=t},999),this.bind("Load",function(){this.readyState=a.DONE},999)}var s=["loadstart","progress","load","abort","error","loadend"];return a.EMPTY=0,a.LOADING=1,a.DONE=2,a.prototype=n.instance,a}),n("moxie/core/utils/Url",["moxie/core/utils/Basic"],function(e){var t=function(i,n){var r,o=["source","scheme","authority","userInfo","user","pass","host","port","relative","path","directory","file","query","fragment"],a=o.length,s={http:80,https:443},u={},c=/^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@\/]*):?([^:@\/]*))?@)?(\[[\da-fA-F:]+\]|[^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/,l=c.exec(i||""),d=/^\/\/\w/.test(i);switch(e.typeOf(n)){case"undefined":n=t(document.location.href,!1);break;case"string":n=t(n,!1)}for(;a--;)l[a]&&(u[o[a]]=l[a]);if(r=!d&&!u.scheme,(d||r)&&(u.scheme=n.scheme),r){u.host=n.host,u.port=n.port;var m="";/^[^\/]/.test(u.path)&&(m=n.path,m=/\/[^\/]*\.[^\/]*$/.test(m)?m.replace(/\/[^\/]+$/,"/"):m.replace(/\/?$/,"/")),u.path=m+(u.path||"")}return u.port||(u.port=s[u.scheme]||80),u.port=parseInt(u.port,10),u.path||(u.path="/"),delete u.source,u},i=function(e){var i={http:80,https:443},n="object"==typeof e?e:t(e);return n.scheme+"://"+n.host+(n.port!==i[n.scheme]?":"+n.port:"")+n.path+(n.query?n.query:"")},n=function(e){function i(e){return[e.scheme,e.host,e.port].join("/")}return"string"==typeof e&&(e=t(e)),i(t())===i(e)};return{parseUrl:t,resolveUrl:i,hasSameOrigin:n}}),n("moxie/runtime/RuntimeTarget",["moxie/core/utils/Basic","moxie/runtime/RuntimeClient","moxie/core/EventTarget"],function(e,t,i){function n(){this.uid=e.guid("uid_"),t.call(this),this.destroy=function(){this.disconnectRuntime(),this.unbindAll()}}return n.prototype=i.instance,n}),n("moxie/file/FileReaderSync",["moxie/core/utils/Basic","moxie/runtime/RuntimeClient","moxie/core/utils/Encode"],function(e,t,i){return function(){function n(e,t){if(!t.isDetached()){var n=this.connectRuntime(t.ruid).exec.call(this,"FileReaderSync","read",e,t);return this.disconnectRuntime(),n}var r=t.getSource();switch(e){case"readAsBinaryString":return r;case"readAsDataURL":return"data:"+t.type+";base64,"+i.btoa(r);case"readAsText":for(var o="",a=0,s=r.length;s>a;a++)o+=String.fromCharCode(r[a]);return o}}t.call(this),e.extend(this,{uid:e.guid("uid_"),readAsBinaryString:function(e){return n.call(this,"readAsBinaryString",e)},readAsDataURL:function(e){return n.call(this,"readAsDataURL",e)},readAsText:function(e){return n.call(this,"readAsText",e)}})}}),n("moxie/xhr/FormData",["moxie/core/Exceptions","moxie/core/utils/Basic","moxie/file/Blob"],function(e,t,i){function n(){var e,n=[];t.extend(this,{append:function(r,o){var a=this,s=t.typeOf(o);o instanceof i?e={name:r,value:o}:"array"===s?(r+="[]",t.each(o,function(e){a.append(r,e)})):"object"===s?t.each(o,function(e,t){a.append(r+"["+t+"]",e)}):"null"===s||"undefined"===s||"number"===s&&isNaN(o)?a.append(r,"false"):n.push({name:r,value:o.toString()})},hasBlob:function(){return!!this.getBlob()},getBlob:function(){return e&&e.value||null},getBlobName:function(){return e&&e.name||null},each:function(i){t.each(n,function(e){i(e.value,e.name)}),e&&i(e.value,e.name)},destroy:function(){e=null,n=[]}})}return n}),n("moxie/xhr/XMLHttpRequest",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/core/EventTarget","moxie/core/utils/Encode","moxie/core/utils/Url","moxie/runtime/Runtime","moxie/runtime/RuntimeTarget","moxie/file/Blob","moxie/file/FileReaderSync","moxie/xhr/FormData","moxie/core/utils/Env","moxie/core/utils/Mime"],function(e,t,i,n,r,o,a,s,u,c,l,d){function m(){this.uid=e.guid("uid_")}function h(){function i(e,t){return I.hasOwnProperty(e)?1===arguments.length?l.can("define_property")?I[e]:A[e]:(l.can("define_property")?I[e]=t:A[e]=t,void 0):void 0}function u(t){function n(){R&&(R.destroy(),R=null),s.dispatchEvent("loadend"),s=null}function r(r){R.bind("LoadStart",function(e){i("readyState",h.LOADING),s.dispatchEvent("readystatechange"),s.dispatchEvent(e),L&&s.upload.dispatchEvent(e)}),R.bind("Progress",function(e){i("readyState")!==h.LOADING&&(i("readyState",h.LOADING),s.dispatchEvent("readystatechange")),s.dispatchEvent(e)}),R.bind("UploadProgress",function(e){L&&s.upload.dispatchEvent({type:"progress",lengthComputable:!1,total:e.total,loaded:e.loaded})}),R.bind("Load",function(t){i("readyState",h.DONE),i("status",Number(r.exec.call(R,"XMLHttpRequest","getStatus")||0)),i("statusText",f[i("status")]||""),i("response",r.exec.call(R,"XMLHttpRequest","getResponse",i("responseType"))),~e.inArray(i("responseType"),["text",""])?i("responseText",i("response")):"document"===i("responseType")&&i("responseXML",i("response")),U=r.exec.call(R,"XMLHttpRequest","getAllResponseHeaders"),s.dispatchEvent("readystatechange"),i("status")>0?(L&&s.upload.dispatchEvent(t),s.dispatchEvent(t)):(F=!0,s.dispatchEvent("error")),n()}),R.bind("Abort",function(e){s.dispatchEvent(e),n()}),R.bind("Error",function(e){F=!0,i("readyState",h.DONE),s.dispatchEvent("readystatechange"),M=!0,s.dispatchEvent(e),n()}),r.exec.call(R,"XMLHttpRequest","send",{url:x,method:v,async:T,user:w,password:y,headers:S,mimeType:D,encoding:O,responseType:s.responseType,withCredentials:s.withCredentials,options:k},t)}var s=this;E=(new Date).getTime(),R=new a,"string"==typeof k.required_caps&&(k.required_caps=o.parseCaps(k.required_caps)),k.required_caps=e.extend({},k.required_caps,{return_response_type:s.responseType}),t instanceof c&&(k.required_caps.send_multipart=!0),e.isEmptyObj(S)||(k.required_caps.send_custom_headers=!0),B||(k.required_caps.do_cors=!0),k.ruid?r(R.connectRuntime(k)):(R.bind("RuntimeInit",function(e,t){r(t)}),R.bind("RuntimeError",function(e,t){s.dispatchEvent("RuntimeError",t)}),R.connectRuntime(k))}function g(){i("responseText",""),i("responseXML",null),i("response",null),i("status",0),i("statusText",""),E=b=null}var x,v,w,y,E,b,R,_,A=this,I={timeout:0,readyState:h.UNSENT,withCredentials:!1,status:0,statusText:"",responseType:"",responseXML:null,responseText:null,response:null},T=!0,S={},O=null,D=null,N=!1,C=!1,L=!1,M=!1,F=!1,B=!1,P=null,H=null,k={},U="";e.extend(this,I,{uid:e.guid("uid_"),upload:new m,open:function(o,a,s,u,c){var l;if(!o||!a)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(/[\u0100-\uffff]/.test(o)||n.utf8_encode(o)!==o)throw new t.DOMException(t.DOMException.SYNTAX_ERR);if(~e.inArray(o.toUpperCase(),["CONNECT","DELETE","GET","HEAD","OPTIONS","POST","PUT","TRACE","TRACK"])&&(v=o.toUpperCase()),~e.inArray(v,["CONNECT","TRACE","TRACK"]))throw new t.DOMException(t.DOMException.SECURITY_ERR);if(a=n.utf8_encode(a),l=r.parseUrl(a),B=r.hasSameOrigin(l),x=r.resolveUrl(a),(u||c)&&!B)throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);if(w=u||l.user,y=c||l.pass,T=s||!0,T===!1&&(i("timeout")||i("withCredentials")||""!==i("responseType")))throw new t.DOMException(t.DOMException.INVALID_ACCESS_ERR);N=!T,C=!1,S={},g.call(this),i("readyState",h.OPENED),this.dispatchEvent("readystatechange")},setRequestHeader:function(r,o){var a=["accept-charset","accept-encoding","access-control-request-headers","access-control-request-method","connection","content-length","cookie","cookie2","content-transfer-encoding","date","expect","host","keep-alive","origin","referer","te","trailer","transfer-encoding","upgrade","user-agent","via"];if(i("readyState")!==h.OPENED||C)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(/[\u0100-\uffff]/.test(r)||n.utf8_encode(r)!==r)throw new t.DOMException(t.DOMException.SYNTAX_ERR);return r=e.trim(r).toLowerCase(),~e.inArray(r,a)||/^(proxy\-|sec\-)/.test(r)?!1:(S[r]?S[r]+=", "+o:S[r]=o,!0)},hasRequestHeader:function(e){return e&&S[e.toLowerCase()]||!1},getAllResponseHeaders:function(){return U||""},getResponseHeader:function(t){return t=t.toLowerCase(),F||~e.inArray(t,["set-cookie","set-cookie2"])?null:U&&""!==U&&(_||(_={},e.each(U.split(/\r\n/),function(t){var i=t.split(/:\s+/);2===i.length&&(i[0]=e.trim(i[0]),_[i[0].toLowerCase()]={header:i[0],value:e.trim(i[1])})})),_.hasOwnProperty(t))?_[t].header+": "+_[t].value:null},overrideMimeType:function(n){var r,o;if(~e.inArray(i("readyState"),[h.LOADING,h.DONE]))throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(n=e.trim(n.toLowerCase()),/;/.test(n)&&(r=n.match(/^([^;]+)(?:;\scharset\=)?(.*)$/))&&(n=r[1],r[2]&&(o=r[2])),!d.mimes[n])throw new t.DOMException(t.DOMException.SYNTAX_ERR);P=n,H=o},send:function(i,r){if(k="string"===e.typeOf(r)?{ruid:r}:r?r:{},this.readyState!==h.OPENED||C)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);if(i instanceof s)k.ruid=i.ruid,D=i.type||"application/octet-stream";else if(i instanceof c){if(i.hasBlob()){var o=i.getBlob();k.ruid=o.ruid,D=o.type||"application/octet-stream"}}else"string"==typeof i&&(O="UTF-8",D="text/plain;charset=UTF-8",i=n.utf8_encode(i));this.withCredentials||(this.withCredentials=k.required_caps&&k.required_caps.send_browser_cookies&&!B),L=!N&&this.upload.hasEventListener(),F=!1,M=!i,N||(C=!0),u.call(this,i)},abort:function(){if(F=!0,N=!1,~e.inArray(i("readyState"),[h.UNSENT,h.OPENED,h.DONE]))i("readyState",h.UNSENT);else{if(i("readyState",h.DONE),C=!1,!R)throw new t.DOMException(t.DOMException.INVALID_STATE_ERR);R.getRuntime().exec.call(R,"XMLHttpRequest","abort",M),M=!0}},destroy:function(){R&&("function"===e.typeOf(R.destroy)&&R.destroy(),R=null),this.unbindAll(),this.upload&&(this.upload.unbindAll(),this.upload=null)}}),this.handleEventProps(p.concat(["readystatechange"])),this.upload.handleEventProps(p)}var f={100:"Continue",101:"Switching Protocols",102:"Processing",200:"OK",201:"Created",202:"Accepted",203:"Non-Authoritative Information",204:"No Content",205:"Reset Content",206:"Partial Content",207:"Multi-Status",226:"IM Used",300:"Multiple Choices",301:"Moved Permanently",302:"Found",303:"See Other",304:"Not Modified",305:"Use Proxy",306:"Reserved",307:"Temporary Redirect",400:"Bad Request",401:"Unauthorized",402:"Payment Required",403:"Forbidden",404:"Not Found",405:"Method Not Allowed",406:"Not Acceptable",407:"Proxy Authentication Required",408:"Request Timeout",409:"Conflict",410:"Gone",411:"Length Required",412:"Precondition Failed",413:"Request Entity Too Large",414:"Request-URI Too Long",415:"Unsupported Media Type",416:"Requested Range Not Satisfiable",417:"Expectation Failed",422:"Unprocessable Entity",423:"Locked",424:"Failed Dependency",426:"Upgrade Required",500:"Internal Server Error",501:"Not Implemented",502:"Bad Gateway",503:"Service Unavailable",504:"Gateway Timeout",505:"HTTP Version Not Supported",506:"Variant Also Negotiates",507:"Insufficient Storage",510:"Not Extended"};m.prototype=i.instance;var p=["loadstart","progress","abort","error","load","timeout","loadend"];return h.UNSENT=0,h.OPENED=1,h.HEADERS_RECEIVED=2,h.LOADING=3,h.DONE=4,h.prototype=i.instance,h}),n("moxie/runtime/Transporter",["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/runtime/RuntimeClient","moxie/core/EventTarget"],function(e,t,i,n){function r(){function n(){l=d=0,c=this.result=null}function o(t,i){var n=this;u=i,n.bind("TransportingProgress",function(t){d=t.loaded,l>d&&-1===e.inArray(n.state,[r.IDLE,r.DONE])&&a.call(n)},999),n.bind("TransportingComplete",function(){d=l,n.state=r.DONE,c=null,n.result=u.exec.call(n,"Transporter","getAsBlob",t||"")},999),n.state=r.BUSY,n.trigger("TransportingStarted"),a.call(n)}function a(){var e,i=this,n=l-d;m>n&&(m=n),e=t.btoa(c.substr(d,m)),u.exec.call(i,"Transporter","receive",e,l)}var s,u,c,l,d,m;i.call(this),e.extend(this,{uid:e.guid("uid_"),state:r.IDLE,result:null,transport:function(t,i,r){var a=this;if(r=e.extend({chunk_size:204798},r),(s=r.chunk_size%3)&&(r.chunk_size+=3-s),m=r.chunk_size,n.call(this),c=t,l=t.length,"string"===e.typeOf(r)||r.ruid)o.call(a,i,this.connectRuntime(r));else{var u=function(e,t){a.unbind("RuntimeInit",u),o.call(a,i,t)};this.bind("RuntimeInit",u),this.connectRuntime(r)}},abort:function(){var e=this;e.state=r.IDLE,u&&(u.exec.call(e,"Transporter","clear"),e.trigger("TransportingAborted")),n.call(e)},destroy:function(){this.unbindAll(),u=null,this.disconnectRuntime(),n.call(this)}})}return r.IDLE=0,r.BUSY=1,r.DONE=2,r.prototype=n.instance,r}),n("moxie/image/Image",["moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/file/FileReaderSync","moxie/xhr/XMLHttpRequest","moxie/runtime/Runtime","moxie/runtime/RuntimeClient","moxie/runtime/Transporter","moxie/core/utils/Env","moxie/core/EventTarget","moxie/file/Blob","moxie/file/File","moxie/core/utils/Encode"],function(e,t,i,n,r,o,a,s,u,c,l,d,m){function h(){function n(e){try{return e||(e=this.exec("Image","getInfo")),this.size=e.size,this.width=e.width,this.height=e.height,this.type=e.type,this.meta=e.meta,""===this.name&&(this.name=e.name),!0}catch(t){return this.trigger("error",t.code),!1}}function c(t){var n=e.typeOf(t);try{if(t instanceof h){if(!t.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);p.apply(this,arguments)}else if(t instanceof l){if(!~e.inArray(t.type,["image/jpeg","image/png"]))throw new i.ImageError(i.ImageError.WRONG_FORMAT);g.apply(this,arguments)}else if(-1!==e.inArray(n,["blob","file"]))c.call(this,new d(null,t),arguments[1]);else if("string"===n)"data:"===t.substr(0,5)?c.call(this,new l(null,{data:t}),arguments[1]):x.apply(this,arguments);else{if("node"!==n||"img"!==t.nodeName.toLowerCase())throw new i.DOMException(i.DOMException.TYPE_MISMATCH_ERR);c.call(this,t.src,arguments[1])}}catch(r){this.trigger("error",r.code)}}function p(t,i){var n=this.connectRuntime(t.ruid);this.ruid=n.uid,n.exec.call(this,"Image","loadFromImage",t,"undefined"===e.typeOf(i)?!0:i)}function g(t,i){function n(e){r.ruid=e.uid,e.exec.call(r,"Image","loadFromBlob",t)}var r=this;r.name=t.name||"",t.isDetached()?(this.bind("RuntimeInit",function(e,t){n(t)}),i&&"string"==typeof i.required_caps&&(i.required_caps=o.parseCaps(i.required_caps)),this.connectRuntime(e.extend({required_caps:{access_image_binary:!0,resize_image:!0}},i))):n(this.connectRuntime(t.ruid))}function x(e,t){var i,n=this;i=new r,i.open("get",e),i.responseType="blob",i.onprogress=function(e){n.trigger(e)},i.onload=function(){g.call(n,i.response,!0)},i.onerror=function(e){n.trigger(e)},i.onloadend=function(){i.destroy()},i.bind("RuntimeError",function(e,t){n.trigger("RuntimeError",t)}),i.send(null,t)}a.call(this),e.extend(this,{uid:e.guid("uid_"),ruid:null,name:"",size:0,width:0,height:0,type:"",meta:{},clone:function(){this.load.apply(this,arguments)},load:function(){c.apply(this,arguments)},resize:function(t){var n,r,o=this,a={x:0,y:0,width:o.width,height:o.height},s=e.extendIf({width:o.width,height:o.height,type:o.type||"image/jpeg",quality:90,crop:!1,fit:!0,preserveHeaders:!0,resample:"default",multipass:!0},t);try{if(!o.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);if(o.width>h.MAX_RESIZE_WIDTH||o.height>h.MAX_RESIZE_HEIGHT)throw new i.ImageError(i.ImageError.MAX_RESOLUTION_ERR);if(n=o.meta&&o.meta.tiff&&o.meta.tiff.Orientation||1,-1!==e.inArray(n,[5,6,7,8])){var u=s.width;s.width=s.height,s.height=u}if(s.crop){switch(r=Math.max(s.width/o.width,s.height/o.height),t.fit?(a.width=Math.min(Math.ceil(s.width/r),o.width),a.height=Math.min(Math.ceil(s.height/r),o.height),r=s.width/a.width):(a.width=Math.min(s.width,o.width),a.height=Math.min(s.height,o.height),r=1),"boolean"==typeof s.crop&&(s.crop="cc"),s.crop.toLowerCase().replace(/_/,"-")){case"rb":case"right-bottom":a.x=o.width-a.width,a.y=o.height-a.height;break;case"cb":case"center-bottom":a.x=Math.floor((o.width-a.width)/2),a.y=o.height-a.height;break;case"lb":case"left-bottom":a.x=0,a.y=o.height-a.height;break;case"lt":case"left-top":a.x=0,a.y=0;break;case"ct":case"center-top":a.x=Math.floor((o.width-a.width)/2),a.y=0;break;case"rt":case"right-top":a.x=o.width-a.width,a.y=0;break;case"rc":case"right-center":case"right-middle":a.x=o.width-a.width,a.y=Math.floor((o.height-a.height)/2);break;case"lc":case"left-center":case"left-middle":a.x=0,a.y=Math.floor((o.height-a.height)/2);break;case"cc":case"center-center":case"center-middle":default:a.x=Math.floor((o.width-a.width)/2),a.y=Math.floor((o.height-a.height)/2)}a.x=Math.max(a.x,0),a.y=Math.max(a.y,0)}else r=Math.min(s.width/o.width,s.height/o.height);this.exec("Image","resize",a,r,s)}catch(c){o.trigger("error",c.code)}},downsize:function(t){var i,n={width:this.width,height:this.height,type:this.type||"image/jpeg",quality:90,crop:!1,preserveHeaders:!0,resample:"default"};i="object"==typeof t?e.extend(n,t):e.extend(n,{width:arguments[0],height:arguments[1],crop:arguments[2],preserveHeaders:arguments[3]}),this.resize(i)},crop:function(e,t,i){this.downsize(e,t,!0,i)},getAsCanvas:function(){if(!u.can("create_canvas"))throw new i.RuntimeError(i.RuntimeError.NOT_SUPPORTED_ERR);return this.exec("Image","getAsCanvas")},getAsBlob:function(e,t){if(!this.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);return this.exec("Image","getAsBlob",e||"image/jpeg",t||90)},getAsDataURL:function(e,t){if(!this.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);return this.exec("Image","getAsDataURL",e||"image/jpeg",t||90)},getAsBinaryString:function(e,t){var i=this.getAsDataURL(e,t);return m.atob(i.substring(i.indexOf("base64,")+7))},embed:function(n,r){function o(t,r){var o=this;if(u.can("create_canvas")){var l=o.getAsCanvas();if(l)return n.appendChild(l),l=null,o.destroy(),c.trigger("embedded"),void 0}var d=o.getAsDataURL(t,r);if(!d)throw new i.ImageError(i.ImageError.WRONG_FORMAT);if(u.can("use_data_uri_of",d.length))n.innerHTML='<img src="'+d+'" width="'+o.width+'" height="'+o.height+'" />',o.destroy(),c.trigger("embedded");else{var h=new s;h.bind("TransportingComplete",function(){a=c.connectRuntime(this.result.ruid),c.bind("Embedded",function(){e.extend(a.getShimContainer().style,{top:"0px",left:"0px",width:o.width+"px",height:o.height+"px"}),a=null},999),a.exec.call(c,"ImageView","display",this.result.uid,width,height),o.destroy()}),h.transport(m.atob(d.substring(d.indexOf("base64,")+7)),t,{required_caps:{display_media:!0},runtime_order:"flash,silverlight",container:n})}}var a,c=this,l=e.extend({width:this.width,height:this.height,type:this.type||"image/jpeg",quality:90},r);try{if(!(n=t.get(n)))throw new i.DOMException(i.DOMException.INVALID_NODE_TYPE_ERR);if(!this.size)throw new i.DOMException(i.DOMException.INVALID_STATE_ERR);this.width>h.MAX_RESIZE_WIDTH||this.height>h.MAX_RESIZE_HEIGHT;var d=new h;return d.bind("Resize",function(){o.call(this,l.type,l.quality)}),d.bind("Load",function(){this.downsize(l)}),this.meta.thumb&&this.meta.thumb.width>=l.width&&this.meta.thumb.height>=l.height?d.load(this.meta.thumb.data):d.clone(this,!1),d}catch(f){this.trigger("error",f.code)}},destroy:function(){this.ruid&&(this.getRuntime().exec.call(this,"Image","destroy"),this.disconnectRuntime()),this.meta&&this.meta.thumb&&this.meta.thumb.data.destroy(),this.unbindAll()}}),this.handleEventProps(f),this.bind("Load Resize",function(){return n.call(this)},999)}var f=["progress","load","error","resize","embedded"];return h.MAX_RESIZE_WIDTH=8192,h.MAX_RESIZE_HEIGHT=8192,h.prototype=c.instance,h}),n("moxie/runtime/html5/Runtime",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/Runtime","moxie/core/utils/Env"],function(e,t,i,n){function o(t){var o=this,u=i.capTest,c=i.capTrue,l=e.extend({access_binary:u(window.FileReader||window.File&&window.File.getAsDataURL),access_image_binary:function(){return o.can("access_binary")&&!!s.Image},display_media:u((n.can("create_canvas")||n.can("use_data_uri_over32kb"))&&r("moxie/image/Image")),do_cors:u(window.XMLHttpRequest&&"withCredentials"in new XMLHttpRequest),drag_and_drop:u(function(){var e=document.createElement("div");return("draggable"in e||"ondragstart"in e&&"ondrop"in e)&&("IE"!==n.browser||n.verComp(n.version,9,">"))}()),filter_by_extension:u(function(){return!("Chrome"===n.browser&&n.verComp(n.version,28,"<")||"IE"===n.browser&&n.verComp(n.version,10,"<")||"Safari"===n.browser&&n.verComp(n.version,7,"<")||"Firefox"===n.browser&&n.verComp(n.version,37,"<"))}()),return_response_headers:c,return_response_type:function(e){return"json"===e&&window.JSON?!0:n.can("return_response_type",e)},return_status_code:c,report_upload_progress:u(window.XMLHttpRequest&&(new XMLHttpRequest).upload),resize_image:function(){return o.can("access_binary")&&n.can("create_canvas")},select_file:function(){return n.can("use_fileinput")&&window.File},select_folder:function(){return o.can("select_file")&&("Chrome"===n.browser&&n.verComp(n.version,21,">=")||"Firefox"===n.browser&&n.verComp(n.version,42,">="))},select_multiple:function(){return!(!o.can("select_file")||"Safari"===n.browser&&"Windows"===n.os||"iOS"===n.os&&n.verComp(n.osVersion,"7.0.0",">")&&n.verComp(n.osVersion,"8.0.0","<"))},send_binary_string:u(window.XMLHttpRequest&&((new XMLHttpRequest).sendAsBinary||window.Uint8Array&&window.ArrayBuffer)),send_custom_headers:u(window.XMLHttpRequest),send_multipart:function(){return!!(window.XMLHttpRequest&&(new XMLHttpRequest).upload&&window.FormData)||o.can("send_binary_string")},slice_blob:u(window.File&&(File.prototype.mozSlice||File.prototype.webkitSlice||File.prototype.slice)),stream_upload:function(){return o.can("slice_blob")&&o.can("send_multipart")},summon_file_dialog:function(){return o.can("select_file")&&("Firefox"===n.browser&&n.verComp(n.version,4,">=")||"Opera"===n.browser&&n.verComp(n.version,12,">=")||"IE"===n.browser&&n.verComp(n.version,10,">=")||!!~e.inArray(n.browser,["Chrome","Safari","Edge"]))},upload_filesize:c,use_http_method:c},arguments[2]);i.call(this,t,arguments[1]||a,l),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(o),e=o=null}}(this.destroy)}),e.extend(this.getShim(),s)}var a="html5",s={};return i.addConstructor(a,o),s}),n("moxie/runtime/html5/file/Blob",["moxie/runtime/html5/Runtime","moxie/file/Blob"],function(e,t){function i(){function e(e,t,i){var n;if(!window.File.prototype.slice)return(n=window.File.prototype.webkitSlice||window.File.prototype.mozSlice)?n.call(e,t,i):null;try{return e.slice(),e.slice(t,i)}catch(r){return e.slice(t,i-t)}}this.slice=function(){return new t(this.getRuntime().uid,e.apply(this,arguments))}}return e.Blob=i}),n("moxie/core/utils/Events",["moxie/core/utils/Basic"],function(e){function t(){this.returnValue=!1}function i(){this.cancelBubble=!0}var n={},r="moxie_"+e.guid(),o=function(o,a,s,u){var c,l;a=a.toLowerCase(),o.addEventListener?(c=s,o.addEventListener(a,c,!1)):o.attachEvent&&(c=function(){var e=window.event;e.target||(e.target=e.srcElement),e.preventDefault=t,e.stopPropagation=i,s(e)},o.attachEvent("on"+a,c)),o[r]||(o[r]=e.guid()),n.hasOwnProperty(o[r])||(n[o[r]]={}),l=n[o[r]],l.hasOwnProperty(a)||(l[a]=[]),l[a].push({func:c,orig:s,key:u})},a=function(t,i,o){var a,s;if(i=i.toLowerCase(),t[r]&&n[t[r]]&&n[t[r]][i]){a=n[t[r]][i];for(var u=a.length-1;u>=0&&(a[u].orig!==o&&a[u].key!==o||(t.removeEventListener?t.removeEventListener(i,a[u].func,!1):t.detachEvent&&t.detachEvent("on"+i,a[u].func),a[u].orig=null,a[u].func=null,a.splice(u,1),o===s));u--);if(a.length||delete n[t[r]][i],e.isEmptyObj(n[t[r]])){delete n[t[r]];try{delete t[r]}catch(c){t[r]=s}}}},s=function(t,i){t&&t[r]&&e.each(n[t[r]],function(e,n){a(t,n,i)})};return{addEvent:o,removeEvent:a,removeAllEvents:s}}),n("moxie/runtime/html5/file/FileInput",["moxie/runtime/html5/Runtime","moxie/file/File","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Events","moxie/core/utils/Mime","moxie/core/utils/Env"],function(e,t,i,n,r,o,a){function s(){var e,s;i.extend(this,{init:function(u){var c,l,d,m,h,f,p=this,g=p.getRuntime();e=u,d=e.accept.mimes||o.extList2mimes(e.accept,g.can("filter_by_extension")),l=g.getShimContainer(),l.innerHTML='<input id="'+g.uid+'" type="file" style="font-size:999px;opacity:0;"'+(e.multiple&&g.can("select_multiple")?"multiple":"")+(e.directory&&g.can("select_folder")?"webkitdirectory directory":"")+(d?' accept="'+d.join(",")+'"':"")+" />",c=n.get(g.uid),i.extend(c.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),m=n.get(e.browse_button),s=n.getStyle(m,"z-index")||"auto",g.can("summon_file_dialog")&&("static"===n.getStyle(m,"position")&&(m.style.position="relative"),r.addEvent(m,"click",function(e){var t=n.get(g.uid);t&&!t.disabled&&t.click(),e.preventDefault()},p.uid),p.bind("Refresh",function(){h=parseInt(s,10)||1,n.get(e.browse_button).style.zIndex=h,this.getRuntime().getShimContainer().style.zIndex=h-1})),f=g.can("summon_file_dialog")?m:l,r.addEvent(f,"mouseover",function(){p.trigger("mouseenter")},p.uid),r.addEvent(f,"mouseout",function(){p.trigger("mouseleave")},p.uid),r.addEvent(f,"mousedown",function(){p.trigger("mousedown")},p.uid),r.addEvent(n.get(e.container),"mouseup",function(){p.trigger("mouseup")},p.uid),c.onchange=function x(){if(p.files=[],i.each(this.files,function(i){var n="";return e.directory&&"."==i.name?!0:(i.webkitRelativePath&&(n="/"+i.webkitRelativePath.replace(/^\//,"")),i=new t(g.uid,i),i.relativePath=n,p.files.push(i),void 0)}),"IE"!==a.browser&&"IEMobile"!==a.browser)this.value="";else{var n=this.cloneNode(!0);this.parentNode.replaceChild(n,this),n.onchange=x}p.files.length&&p.trigger("change")},p.trigger({type:"ready",async:!0}),l=null},setOption:function(e,t){var i=this.getRuntime(),r=n.get(i.uid);switch(e){case"accept":if(t){var a=t.mimes||o.extList2mimes(t,i.can("filter_by_extension"));r.setAttribute("accept",a.join(","))}else r.removeAttribute("accept");break;case"directory":t&&i.can("select_folder")?(r.setAttribute("directory",""),r.setAttribute("webkitdirectory","")):(r.removeAttribute("directory"),r.removeAttribute("webkitdirectory"));break;case"multiple":t&&i.can("select_multiple")?r.setAttribute("multiple",""):r.removeAttribute("multiple")}},disable:function(e){var t,i=this.getRuntime();(t=n.get(i.uid))&&(t.disabled=!!e)},destroy:function(){var t=this.getRuntime(),i=t.getShim(),o=t.getShimContainer(),a=e&&n.get(e.container),u=e&&n.get(e.browse_button);a&&r.removeAllEvents(a,this.uid),u&&(r.removeAllEvents(u,this.uid),u.style.zIndex=s),o&&(r.removeAllEvents(o,this.uid),o.innerHTML=""),i.removeInstance(this.uid),e=o=a=u=i=null}})}return e.FileInput=s}),n("moxie/runtime/html5/file/FileDrop",["moxie/runtime/html5/Runtime","moxie/file/File","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Events","moxie/core/utils/Mime"],function(e,t,i,n,r,o){function a(){function e(e){if(!e.dataTransfer||!e.dataTransfer.types)return!1;var t=i.toArray(e.dataTransfer.types||[]);return-1!==i.inArray("Files",t)||-1!==i.inArray("public.file-url",t)||-1!==i.inArray("application/x-moz-file",t)}function a(e,i){if(u(e)){var n=new t(f,e);n.relativePath=i||"",p.push(n)}}function s(e){for(var t=[],n=0;n<e.length;n++)[].push.apply(t,e[n].extensions.split(/\s*,\s*/));return-1===i.inArray("*",t)?t:[]}function u(e){if(!g.length)return!0;var t=o.getFileExtension(e.name);return!t||-1!==i.inArray(t,g)}function c(e,t){var n=[];i.each(e,function(e){var t=e.webkitGetAsEntry();t&&(t.isFile?a(e.getAsFile(),t.fullPath):n.push(t))}),n.length?l(n,t):t()}function l(e,t){var n=[];i.each(e,function(e){n.push(function(t){d(e,t)})}),i.inSeries(n,function(){t()})}function d(e,t){e.isFile?e.file(function(i){a(i,e.fullPath),t()},function(){t()}):e.isDirectory?m(e,t):t()}function m(e,t){function i(e){r.readEntries(function(t){t.length?([].push.apply(n,t),i(e)):e()},e)}var n=[],r=e.createReader();i(function(){l(n,t)})}var h,f,p=[],g=[];i.extend(this,{init:function(t){var n,o=this;h=t,f=o.ruid,g=s(h.accept),n=h.container,r.addEvent(n,"dragover",function(t){e(t)&&(t.preventDefault(),t.dataTransfer.dropEffect="copy")},o.uid),r.addEvent(n,"drop",function(t){e(t)&&(t.preventDefault(),p=[],t.dataTransfer.items&&t.dataTransfer.items[0].webkitGetAsEntry?c(t.dataTransfer.items,function(){o.files=p,o.trigger("drop")}):(i.each(t.dataTransfer.files,function(e){a(e)}),o.files=p,o.trigger("drop")))},o.uid),r.addEvent(n,"dragenter",function(){o.trigger("dragenter")},o.uid),r.addEvent(n,"dragleave",function(){o.trigger("dragleave")},o.uid)},destroy:function(){r.removeAllEvents(h&&n.get(h.container),this.uid),f=p=g=h=null}})}return e.FileDrop=a}),n("moxie/runtime/html5/file/FileReader",["moxie/runtime/html5/Runtime","moxie/core/utils/Encode","moxie/core/utils/Basic"],function(e,t,i){function n(){function e(e){return t.atob(e.substring(e.indexOf("base64,")+7))}var n,r=!1;i.extend(this,{read:function(t,o){var a=this;a.result="",n=new window.FileReader,n.addEventListener("progress",function(e){a.trigger(e)}),n.addEventListener("load",function(t){a.result=r?e(n.result):n.result,a.trigger(t)}),n.addEventListener("error",function(e){a.trigger(e,n.error)}),n.addEventListener("loadend",function(e){n=null,a.trigger(e)}),"function"===i.typeOf(n[t])?(r=!1,n[t](o.getSource())):"readAsBinaryString"===t&&(r=!0,n.readAsDataURL(o.getSource()))},abort:function(){n&&n.abort()},destroy:function(){n=null}})}return e.FileReader=n}),n("moxie/runtime/html5/xhr/XMLHttpRequest",["moxie/runtime/html5/Runtime","moxie/core/utils/Basic","moxie/core/utils/Mime","moxie/core/utils/Url","moxie/file/File","moxie/file/Blob","moxie/xhr/FormData","moxie/core/Exceptions","moxie/core/utils/Env"],function(e,t,i,n,r,o,a,s,u){function c(){function e(e,t){var i,n,r=this;i=t.getBlob().getSource(),n=new window.FileReader,n.onload=function(){t.append(t.getBlobName(),new o(null,{type:i.type,data:n.result})),f.send.call(r,e,t)},n.readAsBinaryString(i)}function c(){return!window.XMLHttpRequest||"IE"===u.browser&&u.verComp(u.version,8,"<")?function(){for(var e=["Msxml2.XMLHTTP.6.0","Microsoft.XMLHTTP"],t=0;t<e.length;t++)try{return new ActiveXObject(e[t])}catch(i){}}():new window.XMLHttpRequest}function l(e){var t=e.responseXML,i=e.responseText;return"IE"===u.browser&&i&&t&&!t.documentElement&&/[^\/]+\/[^\+]+\+xml/.test(e.getResponseHeader("Content-Type"))&&(t=new window.ActiveXObject("Microsoft.XMLDOM"),t.async=!1,t.validateOnParse=!1,t.loadXML(i)),t&&("IE"===u.browser&&0!==t.parseError||!t.documentElement||"parsererror"===t.documentElement.tagName)?null:t}function d(e){var t="----moxieboundary"+(new Date).getTime(),i="--",n="\r\n",r="",a=this.getRuntime();if(!a.can("send_binary_string"))throw new s.RuntimeError(s.RuntimeError.NOT_SUPPORTED_ERR);return m.setRequestHeader("Content-Type","multipart/form-data; boundary="+t),e.each(function(e,a){r+=e instanceof o?i+t+n+'Content-Disposition: form-data; name="'+a+'"; filename="'+unescape(encodeURIComponent(e.name||"blob"))+'"'+n+"Content-Type: "+(e.type||"application/octet-stream")+n+n+e.getSource()+n:i+t+n+'Content-Disposition: form-data; name="'+a+'"'+n+n+unescape(encodeURIComponent(e))+n}),r+=i+t+i+n}var m,h,f=this;t.extend(this,{send:function(i,r){var s=this,l="Mozilla"===u.browser&&u.verComp(u.version,4,">=")&&u.verComp(u.version,7,"<"),f="Android Browser"===u.browser,p=!1;
if(h=i.url.replace(/^.+?\/([\w\-\.]+)$/,"$1").toLowerCase(),m=c(),m.open(i.method,i.url,i.async,i.user,i.password),r instanceof o)r.isDetached()&&(p=!0),r=r.getSource();else if(r instanceof a){if(r.hasBlob())if(r.getBlob().isDetached())r=d.call(s,r),p=!0;else if((l||f)&&"blob"===t.typeOf(r.getBlob().getSource())&&window.FileReader)return e.call(s,i,r),void 0;if(r instanceof a){var g=new window.FormData;r.each(function(e,t){e instanceof o?g.append(t,e.getSource()):g.append(t,e)}),r=g}}m.upload?(i.withCredentials&&(m.withCredentials=!0),m.addEventListener("load",function(e){s.trigger(e)}),m.addEventListener("error",function(e){s.trigger(e)}),m.addEventListener("progress",function(e){s.trigger(e)}),m.upload.addEventListener("progress",function(e){s.trigger({type:"UploadProgress",loaded:e.loaded,total:e.total})})):m.onreadystatechange=function(){switch(m.readyState){case 1:break;case 2:break;case 3:var e,t;try{n.hasSameOrigin(i.url)&&(e=m.getResponseHeader("Content-Length")||0),m.responseText&&(t=m.responseText.length)}catch(r){e=t=0}s.trigger({type:"progress",lengthComputable:!!e,total:parseInt(e,10),loaded:t});break;case 4:m.onreadystatechange=function(){},0===m.status?s.trigger("error"):s.trigger("load")}},t.isEmptyObj(i.headers)||t.each(i.headers,function(e,t){m.setRequestHeader(t,e)}),""!==i.responseType&&"responseType"in m&&(m.responseType="json"!==i.responseType||u.can("return_response_type","json")?i.responseType:"text"),p?m.sendAsBinary?m.sendAsBinary(r):function(){for(var e=new Uint8Array(r.length),t=0;t<r.length;t++)e[t]=255&r.charCodeAt(t);m.send(e.buffer)}():m.send(r),s.trigger("loadstart")},getStatus:function(){try{if(m)return m.status}catch(e){}return 0},getResponse:function(e){var t=this.getRuntime();try{switch(e){case"blob":var n=new r(t.uid,m.response),o=m.getResponseHeader("Content-Disposition");if(o){var a=o.match(/filename=([\'\"'])([^\1]+)\1/);a&&(h=a[2])}return n.name=h,n.type||(n.type=i.getFileMime(h)),n;case"json":return u.can("return_response_type","json")?m.response:200===m.status&&window.JSON?JSON.parse(m.responseText):null;case"document":return l(m);default:return""!==m.responseText?m.responseText:null}}catch(s){return null}},getAllResponseHeaders:function(){try{return m.getAllResponseHeaders()}catch(e){}return""},abort:function(){m&&m.abort()},destroy:function(){f=h=null}})}return e.XMLHttpRequest=c}),n("moxie/runtime/html5/utils/BinaryReader",["moxie/core/utils/Basic"],function(e){function t(e){e instanceof ArrayBuffer?i.apply(this,arguments):n.apply(this,arguments)}function i(t){var i=new DataView(t);e.extend(this,{readByteAt:function(e){return i.getUint8(e)},writeByteAt:function(e,t){i.setUint8(e,t)},SEGMENT:function(e,n,r){switch(arguments.length){case 2:return t.slice(e,e+n);case 1:return t.slice(e);case 3:if(null===r&&(r=new ArrayBuffer),r instanceof ArrayBuffer){var o=new Uint8Array(this.length()-n+r.byteLength);e>0&&o.set(new Uint8Array(t.slice(0,e)),0),o.set(new Uint8Array(r),e),o.set(new Uint8Array(t.slice(e+n)),e+r.byteLength),this.clear(),t=o.buffer,i=new DataView(t);break}default:return t}},length:function(){return t?t.byteLength:0},clear:function(){i=t=null}})}function n(t){function i(e,i,n){n=3===arguments.length?n:t.length-i-1,t=t.substr(0,i)+e+t.substr(n+i)}e.extend(this,{readByteAt:function(e){return t.charCodeAt(e)},writeByteAt:function(e,t){i(String.fromCharCode(t),e,1)},SEGMENT:function(e,n,r){switch(arguments.length){case 1:return t.substr(e);case 2:return t.substr(e,n);case 3:i(null!==r?r:"",e,n);break;default:return t}},length:function(){return t?t.length:0},clear:function(){t=null}})}return e.extend(t.prototype,{littleEndian:!1,read:function(e,t){var i,n,r;if(e+t>this.length())throw new Error("You are trying to read outside the source boundaries.");for(n=this.littleEndian?0:-8*(t-1),r=0,i=0;t>r;r++)i|=this.readByteAt(e+r)<<Math.abs(n+8*r);return i},write:function(e,t,i){var n,r;if(e>this.length())throw new Error("You are trying to write outside the source boundaries.");for(n=this.littleEndian?0:-8*(i-1),r=0;i>r;r++)this.writeByteAt(e+r,255&t>>Math.abs(n+8*r))},BYTE:function(e){return this.read(e,1)},SHORT:function(e){return this.read(e,2)},LONG:function(e){return this.read(e,4)},SLONG:function(e){var t=this.read(e,4);return t>2147483647?t-4294967296:t},CHAR:function(e){return String.fromCharCode(this.read(e,1))},STRING:function(e,t){return this.asArray("CHAR",e,t).join("")},asArray:function(e,t,i){for(var n=[],r=0;i>r;r++)n[r]=this[e](t+r);return n}}),t}),n("moxie/runtime/html5/image/JPEGHeaders",["moxie/runtime/html5/utils/BinaryReader","moxie/core/Exceptions"],function(e,t){return function i(n){var r,o,a,s=[],u=0;if(r=new e(n),65496!==r.SHORT(0))throw r.clear(),new t.ImageError(t.ImageError.WRONG_FORMAT);for(o=2;o<=r.length();)if(a=r.SHORT(o),a>=65488&&65495>=a)o+=2;else{if(65498===a||65497===a)break;u=r.SHORT(o+2)+2,a>=65505&&65519>=a&&s.push({hex:a,name:"APP"+(15&a),start:o,length:u,segment:r.SEGMENT(o,u)}),o+=u}return r.clear(),{headers:s,restore:function(t){var i,n,r;for(r=new e(t),o=65504==r.SHORT(2)?4+r.SHORT(4):2,n=0,i=s.length;i>n;n++)r.SEGMENT(o,0,s[n].segment),o+=s[n].length;return t=r.SEGMENT(),r.clear(),t},strip:function(t){var n,r,o,a;for(o=new i(t),r=o.headers,o.purge(),n=new e(t),a=r.length;a--;)n.SEGMENT(r[a].start,r[a].length,"");return t=n.SEGMENT(),n.clear(),t},get:function(e){for(var t=[],i=0,n=s.length;n>i;i++)s[i].name===e.toUpperCase()&&t.push(s[i].segment);return t},set:function(e,t){var i,n,r,o=[];for("string"==typeof t?o.push(t):o=t,i=n=0,r=s.length;r>i&&(s[i].name===e.toUpperCase()&&(s[i].segment=o[n],s[i].length=o[n].length,n++),!(n>=o.length));i++);},purge:function(){this.headers=s=[]}}}}),n("moxie/runtime/html5/image/ExifParser",["moxie/core/utils/Basic","moxie/runtime/html5/utils/BinaryReader","moxie/core/Exceptions"],function(e,i,n){function r(o){function a(i,r){var o,a,s,u,c,m,h,f,p=this,g=[],x={},v={1:"BYTE",7:"UNDEFINED",2:"ASCII",3:"SHORT",4:"LONG",5:"RATIONAL",9:"SLONG",10:"SRATIONAL"},w={BYTE:1,UNDEFINED:1,ASCII:1,SHORT:2,LONG:4,RATIONAL:8,SLONG:4,SRATIONAL:8};for(o=p.SHORT(i),a=0;o>a;a++)if(g=[],h=i+2+12*a,s=r[p.SHORT(h)],s!==t){if(u=v[p.SHORT(h+=2)],c=p.LONG(h+=2),m=w[u],!m)throw new n.ImageError(n.ImageError.INVALID_META_ERR);if(h+=4,m*c>4&&(h=p.LONG(h)+d.tiffHeader),h+m*c>=this.length())throw new n.ImageError(n.ImageError.INVALID_META_ERR);"ASCII"!==u?(g=p.asArray(u,h,c),f=1==c?g[0]:g,x[s]=l.hasOwnProperty(s)&&"object"!=typeof f?l[s][f]:f):x[s]=e.trim(p.STRING(h,c).replace(/\0$/,""))}return x}function s(e,t,i){var n,r,o,a=0;if("string"==typeof t){var s=c[e.toLowerCase()];for(var u in s)if(s[u]===t){t=u;break}}n=d[e.toLowerCase()+"IFD"],r=this.SHORT(n);for(var l=0;r>l;l++)if(o=n+12*l+2,this.SHORT(o)==t){a=o+8;break}if(!a)return!1;try{this.write(a,i,4)}catch(m){return!1}return!0}var u,c,l,d,m,h;if(i.call(this,o),c={tiff:{274:"Orientation",270:"ImageDescription",271:"Make",272:"Model",305:"Software",34665:"ExifIFDPointer",34853:"GPSInfoIFDPointer"},exif:{36864:"ExifVersion",40961:"ColorSpace",40962:"PixelXDimension",40963:"PixelYDimension",36867:"DateTimeOriginal",33434:"ExposureTime",33437:"FNumber",34855:"ISOSpeedRatings",37377:"ShutterSpeedValue",37378:"ApertureValue",37383:"MeteringMode",37384:"LightSource",37385:"Flash",37386:"FocalLength",41986:"ExposureMode",41987:"WhiteBalance",41990:"SceneCaptureType",41988:"DigitalZoomRatio",41992:"Contrast",41993:"Saturation",41994:"Sharpness"},gps:{0:"GPSVersionID",1:"GPSLatitudeRef",2:"GPSLatitude",3:"GPSLongitudeRef",4:"GPSLongitude"},thumb:{513:"JPEGInterchangeFormat",514:"JPEGInterchangeFormatLength"}},l={ColorSpace:{1:"sRGB",0:"Uncalibrated"},MeteringMode:{0:"Unknown",1:"Average",2:"CenterWeightedAverage",3:"Spot",4:"MultiSpot",5:"Pattern",6:"Partial",255:"Other"},LightSource:{1:"Daylight",2:"Fliorescent",3:"Tungsten",4:"Flash",9:"Fine weather",10:"Cloudy weather",11:"Shade",12:"Daylight fluorescent (D 5700 - 7100K)",13:"Day white fluorescent (N 4600 -5400K)",14:"Cool white fluorescent (W 3900 - 4500K)",15:"White fluorescent (WW 3200 - 3700K)",17:"Standard light A",18:"Standard light B",19:"Standard light C",20:"D55",21:"D65",22:"D75",23:"D50",24:"ISO studio tungsten",255:"Other"},Flash:{0:"Flash did not fire",1:"Flash fired",5:"Strobe return light not detected",7:"Strobe return light detected",9:"Flash fired, compulsory flash mode",13:"Flash fired, compulsory flash mode, return light not detected",15:"Flash fired, compulsory flash mode, return light detected",16:"Flash did not fire, compulsory flash mode",24:"Flash did not fire, auto mode",25:"Flash fired, auto mode",29:"Flash fired, auto mode, return light not detected",31:"Flash fired, auto mode, return light detected",32:"No flash function",65:"Flash fired, red-eye reduction mode",69:"Flash fired, red-eye reduction mode, return light not detected",71:"Flash fired, red-eye reduction mode, return light detected",73:"Flash fired, compulsory flash mode, red-eye reduction mode",77:"Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",79:"Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",89:"Flash fired, auto mode, red-eye reduction mode",93:"Flash fired, auto mode, return light not detected, red-eye reduction mode",95:"Flash fired, auto mode, return light detected, red-eye reduction mode"},ExposureMode:{0:"Auto exposure",1:"Manual exposure",2:"Auto bracket"},WhiteBalance:{0:"Auto white balance",1:"Manual white balance"},SceneCaptureType:{0:"Standard",1:"Landscape",2:"Portrait",3:"Night scene"},Contrast:{0:"Normal",1:"Soft",2:"Hard"},Saturation:{0:"Normal",1:"Low saturation",2:"High saturation"},Sharpness:{0:"Normal",1:"Soft",2:"Hard"},GPSLatitudeRef:{N:"North latitude",S:"South latitude"},GPSLongitudeRef:{E:"East longitude",W:"West longitude"}},d={tiffHeader:10},m=d.tiffHeader,u={clear:this.clear},e.extend(this,{read:function(){try{return r.prototype.read.apply(this,arguments)}catch(e){throw new n.ImageError(n.ImageError.INVALID_META_ERR)}},write:function(){try{return r.prototype.write.apply(this,arguments)}catch(e){throw new n.ImageError(n.ImageError.INVALID_META_ERR)}},UNDEFINED:function(){return this.BYTE.apply(this,arguments)},RATIONAL:function(e){return this.LONG(e)/this.LONG(e+4)},SRATIONAL:function(e){return this.SLONG(e)/this.SLONG(e+4)},ASCII:function(e){return this.CHAR(e)},TIFF:function(){return h||null},EXIF:function(){var t=null;if(d.exifIFD){try{t=a.call(this,d.exifIFD,c.exif)}catch(i){return null}if(t.ExifVersion&&"array"===e.typeOf(t.ExifVersion)){for(var n=0,r="";n<t.ExifVersion.length;n++)r+=String.fromCharCode(t.ExifVersion[n]);t.ExifVersion=r}}return t},GPS:function(){var t=null;if(d.gpsIFD){try{t=a.call(this,d.gpsIFD,c.gps)}catch(i){return null}t.GPSVersionID&&"array"===e.typeOf(t.GPSVersionID)&&(t.GPSVersionID=t.GPSVersionID.join("."))}return t},thumb:function(){if(d.IFD1)try{var e=a.call(this,d.IFD1,c.thumb);if("JPEGInterchangeFormat"in e)return this.SEGMENT(d.tiffHeader+e.JPEGInterchangeFormat,e.JPEGInterchangeFormatLength)}catch(t){}return null},setExif:function(e,t){return"PixelXDimension"!==e&&"PixelYDimension"!==e?!1:s.call(this,"exif",e,t)},clear:function(){u.clear(),o=c=l=h=d=u=null}}),65505!==this.SHORT(0)||"EXIF\0"!==this.STRING(4,5).toUpperCase())throw new n.ImageError(n.ImageError.INVALID_META_ERR);if(this.littleEndian=18761==this.SHORT(m),42!==this.SHORT(m+=2))throw new n.ImageError(n.ImageError.INVALID_META_ERR);d.IFD0=d.tiffHeader+this.LONG(m+=2),h=a.call(this,d.IFD0,c.tiff),"ExifIFDPointer"in h&&(d.exifIFD=d.tiffHeader+h.ExifIFDPointer,delete h.ExifIFDPointer),"GPSInfoIFDPointer"in h&&(d.gpsIFD=d.tiffHeader+h.GPSInfoIFDPointer,delete h.GPSInfoIFDPointer),e.isEmptyObj(h)&&(h=null);var f=this.LONG(d.IFD0+12*this.SHORT(d.IFD0)+2);f&&(d.IFD1=d.tiffHeader+f)}return r.prototype=i.prototype,r}),n("moxie/runtime/html5/image/JPEG",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/html5/image/JPEGHeaders","moxie/runtime/html5/utils/BinaryReader","moxie/runtime/html5/image/ExifParser"],function(e,t,i,n,r){function o(o){function a(e){var t,i,n=0;for(e||(e=c);n<=e.length();){if(t=e.SHORT(n+=2),t>=65472&&65475>=t)return n+=5,{height:e.SHORT(n),width:e.SHORT(n+=2)};i=e.SHORT(n+=2),n+=i-2}return null}function s(){var e,t,i=d.thumb();return i&&(e=new n(i),t=a(e),e.clear(),t)?(t.data=i,t):null}function u(){d&&l&&c&&(d.clear(),l.purge(),c.clear(),m=l=d=c=null)}var c,l,d,m;if(c=new n(o),65496!==c.SHORT(0))throw new t.ImageError(t.ImageError.WRONG_FORMAT);l=new i(o);try{d=new r(l.get("app1")[0])}catch(h){}m=a.call(this),e.extend(this,{type:"image/jpeg",size:c.length(),width:m&&m.width||0,height:m&&m.height||0,setExif:function(t,i){return d?("object"===e.typeOf(t)?e.each(t,function(e,t){d.setExif(t,e)}):d.setExif(t,i),l.set("app1",d.SEGMENT()),void 0):!1},writeHeaders:function(){return arguments.length?l.restore(arguments[0]):l.restore(o)},stripHeaders:function(e){return l.strip(e)},purge:function(){u.call(this)}}),d&&(this.meta={tiff:d.TIFF(),exif:d.EXIF(),gps:d.GPS(),thumb:s()})}return o}),n("moxie/runtime/html5/image/PNG",["moxie/core/Exceptions","moxie/core/utils/Basic","moxie/runtime/html5/utils/BinaryReader"],function(e,t,i){function n(n){function r(){var e,t;return e=a.call(this,8),"IHDR"==e.type?(t=e.start,{width:s.LONG(t),height:s.LONG(t+=4)}):null}function o(){s&&(s.clear(),n=l=u=c=s=null)}function a(e){var t,i,n,r;return t=s.LONG(e),i=s.STRING(e+=4,4),n=e+=4,r=s.LONG(e+t),{length:t,type:i,start:n,CRC:r}}var s,u,c,l;s=new i(n),function(){var t=0,i=0,n=[35152,20039,3338,6666];for(i=0;i<n.length;i++,t+=2)if(n[i]!=s.SHORT(t))throw new e.ImageError(e.ImageError.WRONG_FORMAT)}(),l=r.call(this),t.extend(this,{type:"image/png",size:s.length(),width:l.width,height:l.height,purge:function(){o.call(this)}}),o.call(this)}return n}),n("moxie/runtime/html5/image/ImageInfo",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/html5/image/JPEG","moxie/runtime/html5/image/PNG"],function(e,t,i,n){return function(r){var o,a=[i,n];o=function(){for(var e=0;e<a.length;e++)try{return new a[e](r)}catch(i){}throw new t.ImageError(t.ImageError.WRONG_FORMAT)}(),e.extend(this,{type:"",size:0,width:0,height:0,setExif:function(){},writeHeaders:function(e){return e},stripHeaders:function(e){return e},purge:function(){r=null}}),e.extend(this,o),this.purge=function(){o.purge(),o=null}}}),n("moxie/runtime/html5/image/ResizerCanvas",[],function(){function e(i,n){var r=i.width,o=Math.floor(r*n),a=!1;(.5>n||n>2)&&(n=.5>n?.5:2,a=!0);var s=t(i,n);return a?e(s,o/s.width):s}function t(e,t){var i=e.width,n=e.height,r=Math.floor(i*t),o=Math.floor(n*t),a=document.createElement("canvas");return a.width=r,a.height=o,a.getContext("2d").drawImage(e,0,0,i,n,0,0,r,o),e=null,a}return{scale:e}}),n("moxie/runtime/html5/image/Image",["moxie/runtime/html5/Runtime","moxie/core/utils/Basic","moxie/core/Exceptions","moxie/core/utils/Encode","moxie/file/Blob","moxie/file/File","moxie/runtime/html5/image/ImageInfo","moxie/runtime/html5/image/ResizerCanvas","moxie/core/utils/Mime","moxie/core/utils/Env"],function(e,t,i,n,r,o,a,s,u){function c(){function e(){if(!v&&!g)throw new i.ImageError(i.DOMException.INVALID_STATE_ERR);return v||g}function c(){var t=e();return"canvas"==t.nodeName.toLowerCase()?t:(v=document.createElement("canvas"),v.width=t.width,v.height=t.height,v.getContext("2d").drawImage(t,0,0),v)}function l(e){return n.atob(e.substring(e.indexOf("base64,")+7))}function d(e,t){return"data:"+(t||"")+";base64,"+n.btoa(e)}function m(e){var t=this;g=new Image,g.onerror=function(){p.call(this),t.trigger("error",i.ImageError.WRONG_FORMAT)},g.onload=function(){t.trigger("load")},g.src="data:"==e.substr(0,5)?e:d(e,y.type)}function h(e,t){var n,r=this;return window.FileReader?(n=new FileReader,n.onload=function(){t.call(r,this.result)},n.onerror=function(){r.trigger("error",i.ImageError.WRONG_FORMAT)},n.readAsDataURL(e),void 0):t.call(this,e.getAsDataURL())}function f(e,i){var n=Math.PI/180,r=document.createElement("canvas"),o=r.getContext("2d"),a=e.width,s=e.height;switch(t.inArray(i,[5,6,7,8])>-1?(r.width=s,r.height=a):(r.width=a,r.height=s),i){case 2:o.translate(a,0),o.scale(-1,1);break;case 3:o.translate(a,s),o.rotate(180*n);break;case 4:o.translate(0,s),o.scale(1,-1);break;case 5:o.rotate(90*n),o.scale(1,-1);break;case 6:o.rotate(90*n),o.translate(0,-s);break;case 7:o.rotate(90*n),o.translate(a,-s),o.scale(-1,1);break;case 8:o.rotate(-90*n),o.translate(-a,0)}return o.drawImage(e,0,0,a,s),r}function p(){x&&(x.purge(),x=null),w=g=v=y=null,b=!1}var g,x,v,w,y,E=this,b=!1,R=!0;t.extend(this,{loadFromBlob:function(e){var t=this.getRuntime(),n=arguments.length>1?arguments[1]:!0;if(!t.can("access_binary"))throw new i.RuntimeError(i.RuntimeError.NOT_SUPPORTED_ERR);return y=e,e.isDetached()?(w=e.getSource(),m.call(this,w),void 0):(h.call(this,e.getSource(),function(e){n&&(w=l(e)),m.call(this,e)}),void 0)},loadFromImage:function(e,t){this.meta=e.meta,y=new o(null,{name:e.name,size:e.size,type:e.type}),m.call(this,t?w=e.getAsBinaryString():e.getAsDataURL())},getInfo:function(){var t,i=this.getRuntime();return!x&&w&&i.can("access_image_binary")&&(x=new a(w)),t={width:e().width||0,height:e().height||0,type:y.type||u.getFileMime(y.name),size:w&&w.length||y.size||0,name:y.name||"",meta:null},R&&(t.meta=x&&x.meta||this.meta||{},!t.meta||!t.meta.thumb||t.meta.thumb.data instanceof r||(t.meta.thumb.data=new r(null,{type:"image/jpeg",data:t.meta.thumb.data}))),t},resize:function(t,i,n){var r=document.createElement("canvas");if(r.width=t.width,r.height=t.height,r.getContext("2d").drawImage(e(),t.x,t.y,t.width,t.height,0,0,r.width,r.height),v=s.scale(r,i),R=n.preserveHeaders,!R){var o=this.meta&&this.meta.tiff&&this.meta.tiff.Orientation||1;v=f(v,o)}this.width=v.width,this.height=v.height,b=!0,this.trigger("Resize")},getAsCanvas:function(){return v||(v=c()),v.id=this.uid+"_canvas",v},getAsBlob:function(e,t){return e!==this.type?(b=!0,new o(null,{name:y.name||"",type:e,data:E.getAsDataURL(e,t)})):new o(null,{name:y.name||"",type:e,data:E.getAsBinaryString(e,t)})},getAsDataURL:function(e){var t=arguments[1]||90;if(!b)return g.src;if(c(),"image/jpeg"!==e)return v.toDataURL("image/png");try{return v.toDataURL("image/jpeg",t/100)}catch(i){return v.toDataURL("image/jpeg")}},getAsBinaryString:function(e,t){if(!b)return w||(w=l(E.getAsDataURL(e,t))),w;if("image/jpeg"!==e)w=l(E.getAsDataURL(e,t));else{var i;t||(t=90),c();try{i=v.toDataURL("image/jpeg",t/100)}catch(n){i=v.toDataURL("image/jpeg")}w=l(i),x&&(w=x.stripHeaders(w),R&&(x.meta&&x.meta.exif&&x.setExif({PixelXDimension:this.width,PixelYDimension:this.height}),w=x.writeHeaders(w)),x.purge(),x=null)}return b=!1,w},destroy:function(){E=null,p.call(this),this.getRuntime().getShim().removeInstance(this.uid)}})}return e.Image=c}),n("moxie/runtime/flash/Runtime",["moxie/core/utils/Basic","moxie/core/utils/Env","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/runtime/Runtime"],function(e,t,i,n,o){function a(){var e;try{e=navigator.plugins["Shockwave Flash"],e=e.description}catch(t){try{e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")}catch(i){e="0.0"}}return e=e.match(/\d+/g),parseFloat(e[0]+"."+e[1])}function s(e){var n=i.get(e);n&&"OBJECT"==n.nodeName&&("IE"===t.browser?(n.style.display="none",function r(){4==n.readyState?u(e):setTimeout(r,10)}()):n.parentNode.removeChild(n))}function u(e){var t=i.get(e);if(t){for(var n in t)"function"==typeof t[n]&&(t[n]=null);t.parentNode.removeChild(t)}}function c(u){var c,m=this;u=e.extend({swf_url:t.swf_url},u),o.call(this,u,l,{access_binary:function(e){return e&&"browser"===m.mode},access_image_binary:function(e){return e&&"browser"===m.mode},display_media:o.capTest(r("moxie/image/Image")),do_cors:o.capTrue,drag_and_drop:!1,report_upload_progress:function(){return"client"===m.mode},resize_image:o.capTrue,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!e.arrayDiff(t,["","text","document"])||"browser"===m.mode},return_status_code:function(t){return"browser"===m.mode||!e.arrayDiff(t,[200,404])},select_file:o.capTrue,select_multiple:o.capTrue,send_binary_string:function(e){return e&&"browser"===m.mode},send_browser_cookies:function(e){return e&&"browser"===m.mode},send_custom_headers:function(e){return e&&"browser"===m.mode},send_multipart:o.capTrue,slice_blob:function(e){return e&&"browser"===m.mode},stream_upload:function(e){return e&&"browser"===m.mode},summon_file_dialog:!1,upload_filesize:function(t){return e.parseSizeStr(t)<=2097152||"client"===m.mode},use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}},{access_binary:function(e){return e?"browser":"client"},access_image_binary:function(e){return e?"browser":"client"},report_upload_progress:function(e){return e?"browser":"client"},return_response_type:function(t){return e.arrayDiff(t,["","text","json","document"])?"browser":["client","browser"]},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"browser":["client","browser"]},send_binary_string:function(e){return e?"browser":"client"},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"browser":"client"},slice_blob:function(e){return e?"browser":"client"},stream_upload:function(e){return e?"client":"browser"},upload_filesize:function(t){return e.parseSizeStr(t)>=2097152?"client":"browser"}},"client"),a()<11.3&&(this.mode=!1),e.extend(this,{getShim:function(){return i.get(this.uid)},shimExec:function(e,t){var i=[].slice.call(arguments,2);return m.getShim().exec(this.uid,e,t,i)},init:function(){var i,r,o;o=this.getShimContainer(),e.extend(o.style,{position:"absolute",top:"-8px",left:"-8px",width:"9px",height:"9px",overflow:"hidden"}),i='<object id="'+this.uid+'" type="application/x-shockwave-flash" data="'+u.swf_url+'" ',"IE"===t.browser&&(i+='classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '),i+='width="100%" height="100%" style="outline:0"><param name="movie" value="'+u.swf_url+'" />'+'<param name="flashvars" value="uid='+escape(this.uid)+"&target="+t.global_event_dispatcher+'" />'+'<param name="wmode" value="transparent" />'+'<param name="allowscriptaccess" value="always" />'+"</object>","IE"===t.browser?(r=document.createElement("div"),o.appendChild(r),r.outerHTML=i,r=o=null):o.innerHTML=i,c=setTimeout(function(){m&&!m.initialized&&m.trigger("Error",new n.RuntimeError(n.RuntimeError.NOT_INIT_ERR))},5e3)},destroy:function(e){return function(){s(m.uid),e.call(m),clearTimeout(c),u=c=e=m=null}}(this.destroy)},d)}var l="flash",d={};return o.addConstructor(l,c),d}),n("moxie/runtime/flash/file/Blob",["moxie/runtime/flash/Runtime","moxie/file/Blob"],function(e,t){var i={slice:function(e,i,n,r){var o=this.getRuntime();return 0>i?i=Math.max(e.size+i,0):i>0&&(i=Math.min(i,e.size)),0>n?n=Math.max(e.size+n,0):n>0&&(n=Math.min(n,e.size)),e=o.shimExec.call(this,"Blob","slice",i,n,r||""),e&&(e=new t(o.uid,e)),e}};return e.Blob=i}),n("moxie/runtime/flash/file/FileInput",["moxie/runtime/flash/Runtime","moxie/file/File","moxie/core/utils/Basic"],function(e,t,i){var n={init:function(e){var n=this,r=this.getRuntime();this.bind("Change",function(){var e=r.shimExec.call(n,"FileInput","getFiles");n.files=[],i.each(e,function(e){n.files.push(new t(r.uid,e))})},999),this.getRuntime().shimExec.call(this,"FileInput","init",{accept:e.accept,multiple:e.multiple}),this.trigger("ready")}};return e.FileInput=n}),n("moxie/runtime/flash/file/FileReader",["moxie/runtime/flash/Runtime","moxie/core/utils/Encode"],function(e,t){function i(e,i){switch(i){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var n={read:function(e,t){var n=this;return n.result="","readAsDataURL"===e&&(n.result="data:"+(t.type||"")+";base64,"),n.bind("Progress",function(t,r){r&&(n.result+=i(r,e))},999),n.getRuntime().shimExec.call(this,"FileReader","readAsBase64",t.uid)}};return e.FileReader=n}),n("moxie/runtime/flash/file/FileReaderSync",["moxie/runtime/flash/Runtime","moxie/core/utils/Encode"],function(e,t){function i(e,i){switch(i){case"readAsText":return t.atob(e,"utf8");case"readAsBinaryString":return t.atob(e);case"readAsDataURL":return e}return null}var n={read:function(e,t){var n,r=this.getRuntime();return(n=r.shimExec.call(this,"FileReaderSync","readAsBase64",t.uid))?("readAsDataURL"===e&&(n="data:"+(t.type||"")+";base64,"+n),i(n,e,t.type)):null}};return e.FileReaderSync=n}),n("moxie/runtime/flash/runtime/Transporter",["moxie/runtime/flash/Runtime","moxie/file/Blob"],function(e,t){var i={getAsBlob:function(e){var i=this.getRuntime(),n=i.shimExec.call(this,"Transporter","getAsBlob",e);return n?new t(i.uid,n):null}};return e.Transporter=i}),n("moxie/runtime/flash/xhr/XMLHttpRequest",["moxie/runtime/flash/Runtime","moxie/core/utils/Basic","moxie/file/Blob","moxie/file/File","moxie/file/FileReaderSync","moxie/runtime/flash/file/FileReaderSync","moxie/xhr/FormData","moxie/runtime/Transporter","moxie/runtime/flash/runtime/Transporter"],function(e,t,i,n,r,o,a,s){var u={send:function(e,n){function r(){e.transport=l.mode,l.shimExec.call(c,"XMLHttpRequest","send",e,n)}function o(e,t){l.shimExec.call(c,"XMLHttpRequest","appendBlob",e,t.uid),n=null,r()}function u(e,t){var i=new s;i.bind("TransportingComplete",function(){t(this.result)}),i.transport(e.getSource(),e.type,{ruid:l.uid})}var c=this,l=c.getRuntime();if(t.isEmptyObj(e.headers)||t.each(e.headers,function(e,t){l.shimExec.call(c,"XMLHttpRequest","setRequestHeader",t,e.toString())}),n instanceof a){var d;if(n.each(function(e,t){e instanceof i?d=t:l.shimExec.call(c,"XMLHttpRequest","append",t,e)}),n.hasBlob()){var m=n.getBlob();m.isDetached()?u(m,function(e){m.destroy(),o(d,e)}):o(d,m)}else n=null,r()}else n instanceof i?n.isDetached()?u(n,function(e){n.destroy(),n=e.uid,r()}):(n=n.uid,r()):r()},getResponse:function(e){var i,o,a=this.getRuntime();if(o=a.shimExec.call(this,"XMLHttpRequest","getResponseAsBlob")){if(o=new n(a.uid,o),"blob"===e)return o;try{if(i=new r,~t.inArray(e,["","text"]))return i.readAsText(o);if("json"===e&&window.JSON)return JSON.parse(i.readAsText(o))}finally{o.destroy()}}return null},abort:function(){var e=this.getRuntime();e.shimExec.call(this,"XMLHttpRequest","abort"),this.dispatchEvent("readystatechange"),this.dispatchEvent("abort")}};return e.XMLHttpRequest=u}),n("moxie/runtime/flash/image/Image",["moxie/runtime/flash/Runtime","moxie/core/utils/Basic","moxie/runtime/Transporter","moxie/file/Blob","moxie/file/FileReaderSync"],function(e,t,i,n,r){var o={loadFromBlob:function(e){function t(e){r.shimExec.call(n,"Image","loadFromBlob",e.uid),n=r=null}var n=this,r=n.getRuntime();if(e.isDetached()){var o=new i;o.bind("TransportingComplete",function(){t(o.result.getSource())}),o.transport(e.getSource(),e.type,{ruid:r.uid})}else t(e.getSource())},loadFromImage:function(e){var t=this.getRuntime();return t.shimExec.call(this,"Image","loadFromImage",e.uid)},getInfo:function(){var e=this.getRuntime(),t=e.shimExec.call(this,"Image","getInfo");return t.meta&&t.meta.thumb&&t.meta.thumb.data&&!(e.meta.thumb.data instanceof n)&&(t.meta.thumb.data=new n(e.uid,t.meta.thumb.data)),t},getAsBlob:function(e,t){var i=this.getRuntime(),r=i.shimExec.call(this,"Image","getAsBlob",e,t);return r?new n(i.uid,r):null},getAsDataURL:function(){var e,t=this.getRuntime(),i=t.Image.getAsBlob.apply(this,arguments);return i?(e=new r,e.readAsDataURL(i)):null}};return e.Image=o}),n("moxie/runtime/silverlight/Runtime",["moxie/core/utils/Basic","moxie/core/utils/Env","moxie/core/utils/Dom","moxie/core/Exceptions","moxie/runtime/Runtime"],function(e,t,i,n,o){function a(e){var t,i,n,r,o,a=!1,s=null,u=0;try{try{s=new ActiveXObject("AgControl.AgControl"),s.IsVersionSupported(e)&&(a=!0),s=null}catch(c){var l=navigator.plugins["Silverlight Plug-In"];if(l){for(t=l.description,"1.0.30226.2"===t&&(t="2.0.30226.2"),i=t.split(".");i.length>3;)i.pop();for(;i.length<4;)i.push(0);for(n=e.split(".");n.length>4;)n.pop();do r=parseInt(n[u],10),o=parseInt(i[u],10),u++;while(u<n.length&&r===o);o>=r&&!isNaN(r)&&(a=!0)}}}catch(d){a=!1}return a}function s(s){var l,d=this;s=e.extend({xap_url:t.xap_url},s),o.call(this,s,u,{access_binary:o.capTrue,access_image_binary:o.capTrue,display_media:o.capTest(r("moxie/image/Image")),do_cors:o.capTrue,drag_and_drop:!1,report_upload_progress:o.capTrue,resize_image:o.capTrue,return_response_headers:function(e){return e&&"client"===d.mode},return_response_type:function(e){return"json"!==e?!0:!!window.JSON},return_status_code:function(t){return"client"===d.mode||!e.arrayDiff(t,[200,404])},select_file:o.capTrue,select_multiple:o.capTrue,send_binary_string:o.capTrue,send_browser_cookies:function(e){return e&&"browser"===d.mode},send_custom_headers:function(e){return e&&"client"===d.mode},send_multipart:o.capTrue,slice_blob:o.capTrue,stream_upload:!0,summon_file_dialog:!1,upload_filesize:o.capTrue,use_http_method:function(t){return"client"===d.mode||!e.arrayDiff(t,["GET","POST"])}},{return_response_headers:function(e){return e?"client":"browser"},return_status_code:function(t){return e.arrayDiff(t,[200,404])?"client":["client","browser"]},send_browser_cookies:function(e){return e?"browser":"client"},send_custom_headers:function(e){return e?"client":"browser"},use_http_method:function(t){return e.arrayDiff(t,["GET","POST"])?"client":["client","browser"]}}),a("2.0.31005.0")&&"Opera"!==t.browser||(this.mode=!1),e.extend(this,{getShim:function(){return i.get(this.uid).content.Moxie},shimExec:function(e,t){var i=[].slice.call(arguments,2);return d.getShim().exec(this.uid,e,t,i)},init:function(){var e;e=this.getShimContainer(),e.innerHTML='<object id="'+this.uid+'" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;">'+'<param name="source" value="'+s.xap_url+'"/>'+'<param name="background" value="Transparent"/>'+'<param name="windowless" value="true"/>'+'<param name="enablehtmlaccess" value="true"/>'+'<param name="initParams" value="uid='+this.uid+",target="+t.global_event_dispatcher+'"/>'+"</object>",l=setTimeout(function(){d&&!d.initialized&&d.trigger("Error",new n.RuntimeError(n.RuntimeError.NOT_INIT_ERR))},"Windows"!==t.OS?1e4:5e3)},destroy:function(e){return function(){e.call(d),clearTimeout(l),s=l=e=d=null}}(this.destroy)},c)}var u="silverlight",c={};return o.addConstructor(u,s),c}),n("moxie/runtime/silverlight/file/Blob",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/file/Blob"],function(e,t,i){return e.Blob=t.extend({},i)}),n("moxie/runtime/silverlight/file/FileInput",["moxie/runtime/silverlight/Runtime","moxie/file/File","moxie/core/utils/Basic"],function(e,t,i){function n(e){for(var t="",i=0;i<e.length;i++)t+=(""!==t?"|":"")+e[i].title+" | *."+e[i].extensions.replace(/,/g,";*.");return t}var r={init:function(e){var r=this,o=this.getRuntime();this.bind("Change",function(){var e=o.shimExec.call(r,"FileInput","getFiles");r.files=[],i.each(e,function(e){r.files.push(new t(o.uid,e))})},999),o.shimExec.call(this,"FileInput","init",n(e.accept),e.multiple),this.trigger("ready")},setOption:function(e,t){"accept"==e&&(t=n(t)),this.getRuntime().shimExec.call(this,"FileInput","setOption",e,t)}};return e.FileInput=r}),n("moxie/runtime/silverlight/file/FileDrop",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Dom","moxie/core/utils/Events"],function(e,t,i){var n={init:function(){var e,n=this,r=n.getRuntime();return e=r.getShimContainer(),i.addEvent(e,"dragover",function(e){e.preventDefault(),e.stopPropagation(),e.dataTransfer.dropEffect="copy"},n.uid),i.addEvent(e,"dragenter",function(e){e.preventDefault();var i=t.get(r.uid).dragEnter(e);i&&e.stopPropagation()},n.uid),i.addEvent(e,"drop",function(e){e.preventDefault();var i=t.get(r.uid).dragDrop(e);i&&e.stopPropagation()},n.uid),r.shimExec.call(this,"FileDrop","init")}};return e.FileDrop=n}),n("moxie/runtime/silverlight/file/FileReader",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/file/FileReader"],function(e,t,i){return e.FileReader=t.extend({},i)
}),n("moxie/runtime/silverlight/file/FileReaderSync",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/file/FileReaderSync"],function(e,t,i){return e.FileReaderSync=t.extend({},i)}),n("moxie/runtime/silverlight/runtime/Transporter",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/runtime/Transporter"],function(e,t,i){return e.Transporter=t.extend({},i)}),n("moxie/runtime/silverlight/xhr/XMLHttpRequest",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/runtime/flash/xhr/XMLHttpRequest","moxie/runtime/silverlight/file/FileReaderSync","moxie/runtime/silverlight/runtime/Transporter"],function(e,t,i){return e.XMLHttpRequest=t.extend({},i)}),n("moxie/runtime/silverlight/image/Image",["moxie/runtime/silverlight/Runtime","moxie/core/utils/Basic","moxie/file/Blob","moxie/runtime/flash/image/Image"],function(e,t,i,n){return e.Image=t.extend({},n,{getInfo:function(){var e=this.getRuntime(),n=["tiff","exif","gps","thumb"],r={meta:{}},o=e.shimExec.call(this,"Image","getInfo");return o.meta&&(t.each(n,function(e){var t,i,n,a,s=o.meta[e];if(s&&s.keys)for(r.meta[e]={},i=0,n=s.keys.length;n>i;i++)t=s.keys[i],a=s[t],a&&(/^(\d|[1-9]\d+)$/.test(a)?a=parseInt(a,10):/^\d*\.\d+$/.test(a)&&(a=parseFloat(a)),r.meta[e][t]=a)}),r.meta&&r.meta.thumb&&r.meta.thumb.data&&!(e.meta.thumb.data instanceof i)&&(r.meta.thumb.data=new i(e.uid,r.meta.thumb.data))),r.width=parseInt(o.width,10),r.height=parseInt(o.height,10),r.size=parseInt(o.size,10),r.type=o.type,r.name=o.name,r},resize:function(e,t,i){this.getRuntime().shimExec.call(this,"Image","resize",e.x,e.y,e.width,e.height,t,i.preserveHeaders,i.resample)}})}),n("moxie/runtime/html4/Runtime",["moxie/core/utils/Basic","moxie/core/Exceptions","moxie/runtime/Runtime","moxie/core/utils/Env"],function(e,t,i,n){function o(t){var o=this,u=i.capTest,c=i.capTrue;i.call(this,t,a,{access_binary:u(window.FileReader||window.File&&File.getAsDataURL),access_image_binary:!1,display_media:u((n.can("create_canvas")||n.can("use_data_uri_over32kb"))&&r("moxie/image/Image")),do_cors:!1,drag_and_drop:!1,filter_by_extension:u(function(){return!("Chrome"===n.browser&&n.verComp(n.version,28,"<")||"IE"===n.browser&&n.verComp(n.version,10,"<")||"Safari"===n.browser&&n.verComp(n.version,7,"<")||"Firefox"===n.browser&&n.verComp(n.version,37,"<"))}()),resize_image:function(){return s.Image&&o.can("access_binary")&&n.can("create_canvas")},report_upload_progress:!1,return_response_headers:!1,return_response_type:function(t){return"json"===t&&window.JSON?!0:!!~e.inArray(t,["text","document",""])},return_status_code:function(t){return!e.arrayDiff(t,[200,404])},select_file:function(){return n.can("use_fileinput")},select_multiple:!1,send_binary_string:!1,send_custom_headers:!1,send_multipart:!0,slice_blob:!1,stream_upload:function(){return o.can("select_file")},summon_file_dialog:function(){return o.can("select_file")&&("Firefox"===n.browser&&n.verComp(n.version,4,">=")||"Opera"===n.browser&&n.verComp(n.version,12,">=")||"IE"===n.browser&&n.verComp(n.version,10,">=")||!!~e.inArray(n.browser,["Chrome","Safari"]))},upload_filesize:c,use_http_method:function(t){return!e.arrayDiff(t,["GET","POST"])}}),e.extend(this,{init:function(){this.trigger("Init")},destroy:function(e){return function(){e.call(o),e=o=null}}(this.destroy)}),e.extend(this.getShim(),s)}var a="html4",s={};return i.addConstructor(a,o),s}),n("moxie/runtime/html4/file/FileInput",["moxie/runtime/html4/Runtime","moxie/file/File","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Events","moxie/core/utils/Mime","moxie/core/utils/Env"],function(e,t,i,n,r,o,a){function s(){function e(){var o,c,d,m,h,f,p=this,g=p.getRuntime();f=i.guid("uid_"),o=g.getShimContainer(),s&&(d=n.get(s+"_form"),d&&i.extend(d.style,{top:"100%"})),m=document.createElement("form"),m.setAttribute("id",f+"_form"),m.setAttribute("method","post"),m.setAttribute("enctype","multipart/form-data"),m.setAttribute("encoding","multipart/form-data"),i.extend(m.style,{overflow:"hidden",position:"absolute",top:0,left:0,width:"100%",height:"100%"}),h=document.createElement("input"),h.setAttribute("id",f),h.setAttribute("type","file"),h.setAttribute("accept",l.join(",")),i.extend(h.style,{fontSize:"999px",opacity:0}),m.appendChild(h),o.appendChild(m),i.extend(h.style,{position:"absolute",top:0,left:0,width:"100%",height:"100%"}),"IE"===a.browser&&a.verComp(a.version,10,"<")&&i.extend(h.style,{filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}),h.onchange=function(){var i;if(this.value){if(this.files){if(i=this.files[0],0===i.size)return m.parentNode.removeChild(m),void 0}else i={name:this.value};i=new t(g.uid,i),this.onchange=function(){},e.call(p),p.files=[i],h.setAttribute("id",i.uid),m.setAttribute("id",i.uid+"_form"),p.trigger("change"),h=m=null}},g.can("summon_file_dialog")&&(c=n.get(u.browse_button),r.removeEvent(c,"click",p.uid),r.addEvent(c,"click",function(e){h&&!h.disabled&&h.click(),e.preventDefault()},p.uid)),s=f,o=d=c=null}var s,u,c,l=[];i.extend(this,{init:function(t){var i,a=this,s=a.getRuntime();u=t,l=t.accept.mimes||o.extList2mimes(t.accept,s.can("filter_by_extension")),i=s.getShimContainer(),function(){var e,o,l;e=n.get(t.browse_button),c=n.getStyle(e,"z-index")||"auto",s.can("summon_file_dialog")&&("static"===n.getStyle(e,"position")&&(e.style.position="relative"),a.bind("Refresh",function(){o=parseInt(c,10)||1,n.get(u.browse_button).style.zIndex=o,this.getRuntime().getShimContainer().style.zIndex=o-1})),l=s.can("summon_file_dialog")?e:i,r.addEvent(l,"mouseover",function(){a.trigger("mouseenter")},a.uid),r.addEvent(l,"mouseout",function(){a.trigger("mouseleave")},a.uid),r.addEvent(l,"mousedown",function(){a.trigger("mousedown")},a.uid),r.addEvent(n.get(t.container),"mouseup",function(){a.trigger("mouseup")},a.uid),e=null}(),e.call(this),i=null,a.trigger({type:"ready",async:!0})},setOption:function(e,t){var i,r=this.getRuntime();"accept"==e&&(l=t.mimes||o.extList2mimes(t,r.can("filter_by_extension"))),i=n.get(s),i&&i.setAttribute("accept",l.join(","))},disable:function(e){var t;(t=n.get(s))&&(t.disabled=!!e)},destroy:function(){var e=this.getRuntime(),t=e.getShim(),i=e.getShimContainer(),o=u&&n.get(u.container),a=u&&n.get(u.browse_button);o&&r.removeAllEvents(o,this.uid),a&&(r.removeAllEvents(a,this.uid),a.style.zIndex=c),i&&(r.removeAllEvents(i,this.uid),i.innerHTML=""),t.removeInstance(this.uid),s=l=u=i=o=a=t=null}})}return e.FileInput=s}),n("moxie/runtime/html4/file/FileReader",["moxie/runtime/html4/Runtime","moxie/runtime/html5/file/FileReader"],function(e,t){return e.FileReader=t}),n("moxie/runtime/html4/xhr/XMLHttpRequest",["moxie/runtime/html4/Runtime","moxie/core/utils/Basic","moxie/core/utils/Dom","moxie/core/utils/Url","moxie/core/Exceptions","moxie/core/utils/Events","moxie/file/Blob","moxie/xhr/FormData"],function(e,t,i,n,r,o,a,s){function u(){function e(e){var t,n,r,a,s=this,u=!1;if(l){if(t=l.id.replace(/_iframe$/,""),n=i.get(t+"_form")){for(r=n.getElementsByTagName("input"),a=r.length;a--;)switch(r[a].getAttribute("type")){case"hidden":r[a].parentNode.removeChild(r[a]);break;case"file":u=!0}r=[],u||n.parentNode.removeChild(n),n=null}setTimeout(function(){o.removeEvent(l,"load",s.uid),l.parentNode&&l.parentNode.removeChild(l);var t=s.getRuntime().getShimContainer();t.children.length||t.parentNode.removeChild(t),t=l=null,e()},1)}}var u,c,l;t.extend(this,{send:function(d,m){function h(){var i=w.getShimContainer()||document.body,r=document.createElement("div");r.innerHTML='<iframe id="'+f+'_iframe" name="'+f+'_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>',l=r.firstChild,i.appendChild(l),o.addEvent(l,"load",function(){var i;try{i=l.contentWindow.document||l.contentDocument||window.frames[l.id].document,/^4(0[0-9]|1[0-7]|2[2346])\s/.test(i.title)?u=i.title.replace(/^(\d+).*$/,"$1"):(u=200,c=t.trim(i.body.innerHTML),v.trigger({type:"progress",loaded:c.length,total:c.length}),x&&v.trigger({type:"uploadprogress",loaded:x.size||1025,total:x.size||1025}))}catch(r){if(!n.hasSameOrigin(d.url))return e.call(v,function(){v.trigger("error")}),void 0;u=404}e.call(v,function(){v.trigger("load")})},v.uid)}var f,p,g,x,v=this,w=v.getRuntime();if(u=c=null,m instanceof s&&m.hasBlob()){if(x=m.getBlob(),f=x.uid,g=i.get(f),p=i.get(f+"_form"),!p)throw new r.DOMException(r.DOMException.NOT_FOUND_ERR)}else f=t.guid("uid_"),p=document.createElement("form"),p.setAttribute("id",f+"_form"),p.setAttribute("method",d.method),p.setAttribute("enctype","multipart/form-data"),p.setAttribute("encoding","multipart/form-data"),w.getShimContainer().appendChild(p);p.setAttribute("target",f+"_iframe"),m instanceof s&&m.each(function(e,i){if(e instanceof a)g&&g.setAttribute("name",i);else{var n=document.createElement("input");t.extend(n,{type:"hidden",name:i,value:e}),g?p.insertBefore(n,g):p.appendChild(n)}}),p.setAttribute("action",d.url),h(),p.submit(),v.trigger("loadstart")},getStatus:function(){return u},getResponse:function(e){if("json"===e&&"string"===t.typeOf(c)&&window.JSON)try{return JSON.parse(c.replace(/^\s*<pre[^>]*>/,"").replace(/<\/pre>\s*$/,""))}catch(i){return null}return c},abort:function(){var t=this;l&&l.contentWindow&&(l.contentWindow.stop?l.contentWindow.stop():l.contentWindow.document.execCommand?l.contentWindow.document.execCommand("Stop"):l.src="about:blank"),e.call(this,function(){t.dispatchEvent("abort")})}})}return e.XMLHttpRequest=u}),n("moxie/runtime/html4/image/Image",["moxie/runtime/html4/Runtime","moxie/runtime/html5/image/Image"],function(e,t){return e.Image=t}),a(["moxie/core/utils/Basic","moxie/core/utils/Encode","moxie/core/utils/Env","moxie/core/Exceptions","moxie/core/utils/Dom","moxie/core/EventTarget","moxie/runtime/Runtime","moxie/runtime/RuntimeClient","moxie/file/Blob","moxie/core/I18n","moxie/core/utils/Mime","moxie/file/FileInput","moxie/file/File","moxie/file/FileDrop","moxie/file/FileReader","moxie/core/utils/Url","moxie/runtime/RuntimeTarget","moxie/xhr/FormData","moxie/xhr/XMLHttpRequest","moxie/runtime/Transporter","moxie/image/Image","moxie/core/utils/Events","moxie/runtime/html5/image/ResizerCanvas"])}(this)});
/**
 * Plupload - multi-runtime File Uploader
 * v2.3.1
 *
 * Copyright 2013, Moxiecode Systems AB
 * Released under GPL License.
 *
 * License: http://www.plupload.com/license
 * Contributing: http://www.plupload.com/contributing
 *
 * Date: 2017-02-06
 */
!function(e,t){var i=function(){var e={};return t.apply(e,arguments),e.plupload};"function"==typeof define&&define.amd?define("plupload",["./moxie"],i):"object"==typeof module&&module.exports?module.exports=i(require("./moxie")):e.plupload=i(e.moxie)}(this||window,function(e){!function(e,t,i){function n(e){function t(e,t,i){var r={chunks:"slice_blob",jpgresize:"send_binary_string",pngresize:"send_binary_string",progress:"report_upload_progress",multi_selection:"select_multiple",dragdrop:"drag_and_drop",drop_element:"drag_and_drop",headers:"send_custom_headers",urlstream_upload:"send_binary_string",canSendBinary:"send_binary",triggerDialog:"summon_file_dialog"};r[e]?n[r[e]]=t:i||(n[e]=t)}var i=e.required_features,n={};return"string"==typeof i?l.each(i.split(/\s*,\s*/),function(e){t(e,!0)}):"object"==typeof i?l.each(i,function(e,i){t(i,e)}):i===!0&&(e.chunk_size&&e.chunk_size>0&&(n.slice_blob=!0),l.isEmptyObj(e.resize)&&e.multipart!==!1||(n.send_binary_string=!0),e.http_method&&(n.use_http_method=e.http_method),l.each(e,function(e,i){t(i,!!e,!0)})),n}var r=window.setTimeout,s={},a=t.core.utils,o=t.runtime.Runtime,l={VERSION:"2.3.1",STOPPED:1,STARTED:2,QUEUED:1,UPLOADING:2,FAILED:4,DONE:5,GENERIC_ERROR:-100,HTTP_ERROR:-200,IO_ERROR:-300,SECURITY_ERROR:-400,INIT_ERROR:-500,FILE_SIZE_ERROR:-600,FILE_EXTENSION_ERROR:-601,FILE_DUPLICATE_ERROR:-602,IMAGE_FORMAT_ERROR:-700,MEMORY_ERROR:-701,IMAGE_DIMENSIONS_ERROR:-702,mimeTypes:a.Mime.mimes,ua:a.Env,typeOf:a.Basic.typeOf,extend:a.Basic.extend,guid:a.Basic.guid,getAll:function(e){var t,i=[];"array"!==l.typeOf(e)&&(e=[e]);for(var n=e.length;n--;)t=l.get(e[n]),t&&i.push(t);return i.length?i:null},get:a.Dom.get,each:a.Basic.each,getPos:a.Dom.getPos,getSize:a.Dom.getSize,xmlEncode:function(e){var t={"<":"lt",">":"gt","&":"amp",'"':"quot","'":"#39"},i=/[<>&\"\']/g;return e?(""+e).replace(i,function(e){return t[e]?"&"+t[e]+";":e}):e},toArray:a.Basic.toArray,inArray:a.Basic.inArray,inSeries:a.Basic.inSeries,addI18n:t.core.I18n.addI18n,translate:t.core.I18n.translate,sprintf:a.Basic.sprintf,isEmptyObj:a.Basic.isEmptyObj,hasClass:a.Dom.hasClass,addClass:a.Dom.addClass,removeClass:a.Dom.removeClass,getStyle:a.Dom.getStyle,addEvent:a.Events.addEvent,removeEvent:a.Events.removeEvent,removeAllEvents:a.Events.removeAllEvents,cleanName:function(e){var t,i;for(i=[/[\300-\306]/g,"A",/[\340-\346]/g,"a",/\307/g,"C",/\347/g,"c",/[\310-\313]/g,"E",/[\350-\353]/g,"e",/[\314-\317]/g,"I",/[\354-\357]/g,"i",/\321/g,"N",/\361/g,"n",/[\322-\330]/g,"O",/[\362-\370]/g,"o",/[\331-\334]/g,"U",/[\371-\374]/g,"u"],t=0;t<i.length;t+=2)e=e.replace(i[t],i[t+1]);return e=e.replace(/\s+/g,"_"),e=e.replace(/[^a-z0-9_\-\.]+/gi,"")},buildUrl:function(e,t){var i="";return l.each(t,function(e,t){i+=(i?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(e)}),i&&(e+=(e.indexOf("?")>0?"&":"?")+i),e},formatSize:function(e){function t(e,t){return Math.round(e*Math.pow(10,t))/Math.pow(10,t)}if(e===i||/\D/.test(e))return l.translate("N/A");var n=Math.pow(1024,4);return e>n?t(e/n,1)+" "+l.translate("tb"):e>(n/=1024)?t(e/n,1)+" "+l.translate("gb"):e>(n/=1024)?t(e/n,1)+" "+l.translate("mb"):e>1024?Math.round(e/1024)+" "+l.translate("kb"):e+" "+l.translate("b")},parseSize:a.Basic.parseSizeStr,predictRuntime:function(e,t){var i,n;return i=new l.Uploader(e),n=o.thatCan(i.getOption().required_features,t||e.runtimes),i.destroy(),n},addFileFilter:function(e,t){s[e]=t}};l.addFileFilter("mime_types",function(e,t,i){e.length&&!e.regexp.test(t.name)?(this.trigger("Error",{code:l.FILE_EXTENSION_ERROR,message:l.translate("File extension error."),file:t}),i(!1)):i(!0)}),l.addFileFilter("max_file_size",function(e,t,i){var n;e=l.parseSize(e),t.size!==n&&e&&t.size>e?(this.trigger("Error",{code:l.FILE_SIZE_ERROR,message:l.translate("File size error."),file:t}),i(!1)):i(!0)}),l.addFileFilter("prevent_duplicates",function(e,t,i){if(e)for(var n=this.files.length;n--;)if(t.name===this.files[n].name&&t.size===this.files[n].size)return this.trigger("Error",{code:l.FILE_DUPLICATE_ERROR,message:l.translate("Duplicate file error."),file:t}),i(!1),void 0;i(!0)}),l.Uploader=function(e){function a(){var e,t,i=0;if(this.state==l.STARTED){for(t=0;t<x.length;t++)e||x[t].status!=l.QUEUED?i++:(e=x[t],this.trigger("BeforeUpload",e)&&(e.status=l.UPLOADING,this.trigger("UploadFile",e)));i==x.length&&(this.state!==l.STOPPED&&(this.state=l.STOPPED,this.trigger("StateChanged")),this.trigger("UploadComplete",x))}}function u(e){e.percent=e.size>0?Math.ceil(100*(e.loaded/e.size)):100,d()}function d(){var e,t,n,r=0;for(w.reset(),e=0;e<x.length;e++)t=x[e],t.size!==i?(w.size+=t.origSize,n=t.loaded*t.origSize/t.size,(!t.completeTimestamp||t.completeTimestamp>I)&&(r+=n),w.loaded+=n):w.size=i,t.status==l.DONE?w.uploaded++:t.status==l.FAILED?w.failed++:w.queued++;w.size===i?w.percent=x.length>0?Math.ceil(100*(w.uploaded/x.length)):0:(w.bytesPerSec=Math.ceil(r/((+new Date-I||1)/1e3)),w.percent=w.size>0?Math.ceil(100*(w.loaded/w.size)):0)}function c(){var e=U[0]||F[0];return e?e.getRuntime().uid:!1}function f(e,t){if(e.ruid){var i=o.getInfo(e.ruid);if(i)return i.can(t)}return!1}function p(){this.bind("FilesAdded FilesRemoved",function(e){e.trigger("QueueChanged"),e.refresh()}),this.bind("CancelUpload",y),this.bind("BeforeUpload",_),this.bind("UploadFile",E),this.bind("UploadProgress",v),this.bind("StateChanged",b),this.bind("QueueChanged",d),this.bind("Error",z),this.bind("FileUploaded",R),this.bind("Destroy",O)}function g(e,i){var n=this,r=0,s=[],a={runtime_order:e.runtimes,required_caps:e.required_features,preferred_caps:P,swf_url:e.flash_swf_url,xap_url:e.silverlight_xap_url};l.each(e.runtimes.split(/\s*,\s*/),function(t){e[t]&&(a[t]=e[t])}),e.browse_button&&l.each(e.browse_button,function(i){s.push(function(s){var u=new t.file.FileInput(l.extend({},a,{accept:e.filters.mime_types,name:e.file_data_name,multiple:e.multi_selection,container:e.container,browse_button:i}));u.onready=function(){var e=o.getInfo(this.ruid);l.extend(n.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),multi_selection:e.can("select_multiple")}),r++,U.push(this),s()},u.onchange=function(){n.addFile(this.files)},u.bind("mouseenter mouseleave mousedown mouseup",function(t){A||(e.browse_button_hover&&("mouseenter"===t.type?l.addClass(i,e.browse_button_hover):"mouseleave"===t.type&&l.removeClass(i,e.browse_button_hover)),e.browse_button_active&&("mousedown"===t.type?l.addClass(i,e.browse_button_active):"mouseup"===t.type&&l.removeClass(i,e.browse_button_active)))}),u.bind("mousedown",function(){n.trigger("Browse")}),u.bind("error runtimeerror",function(){u=null,s()}),u.init()})}),e.drop_element&&l.each(e.drop_element,function(e){s.push(function(i){var s=new t.file.FileDrop(l.extend({},a,{drop_zone:e}));s.onready=function(){var e=o.getInfo(this.ruid);l.extend(n.features,{chunks:e.can("slice_blob"),multipart:e.can("send_multipart"),dragdrop:e.can("drag_and_drop")}),r++,F.push(this),i()},s.ondrop=function(){n.addFile(this.files)},s.bind("error runtimeerror",function(){s=null,i()}),s.init()})}),l.inSeries(s,function(){"function"==typeof i&&i(r)})}function h(e,n,r){var s=new t.image.Image;try{s.onload=function(){return n.width>this.width&&n.height>this.height&&n.quality===i&&n.preserve_headers&&!n.crop?(this.destroy(),r(e)):(s.downsize(n.width,n.height,n.crop,n.preserve_headers),void 0)},s.onresize=function(){r(this.getAsBlob(e.type,n.quality)),this.destroy()},s.onerror=function(){r(e)},s.load(e)}catch(a){r(e)}}function m(e,i,r){function s(e,i,n){var r=S[e];switch(e){case"max_file_size":"max_file_size"===e&&(S.max_file_size=S.filters.max_file_size=i);break;case"chunk_size":(i=l.parseSize(i))&&(S[e]=i,S.send_file_name=!0);break;case"multipart":S[e]=i,i||(S.send_file_name=!0);break;case"http_method":S[e]="PUT"===i.toUpperCase()?"PUT":"POST";break;case"unique_names":S[e]=i,i&&(S.send_file_name=!0);break;case"filters":"array"===l.typeOf(i)&&(i={mime_types:i}),n?l.extend(S.filters,i):S.filters=i,i.mime_types&&("string"===l.typeOf(i.mime_types)&&(i.mime_types=t.core.utils.Mime.mimes2extList(i.mime_types)),i.mime_types.regexp=function(e){var t=[];return l.each(e,function(e){l.each(e.extensions.split(/,/),function(e){/^\s*\*\s*$/.test(e)?t.push("\\.*"):t.push("\\."+e.replace(new RegExp("["+"/^$.*+?|()[]{}\\".replace(/./g,"\\$&")+"]","g"),"\\$&"))})}),new RegExp("("+t.join("|")+")$","i")}(i.mime_types),S.filters.mime_types=i.mime_types);break;case"resize":S.resize=i?l.extend({preserve_headers:!0,crop:!1},i):!1;break;case"prevent_duplicates":S.prevent_duplicates=S.filters.prevent_duplicates=!!i;break;case"container":case"browse_button":case"drop_element":i="container"===e?l.get(i):l.getAll(i);case"runtimes":case"multi_selection":case"flash_swf_url":case"silverlight_xap_url":S[e]=i,n||(u=!0);break;default:S[e]=i}n||a.trigger("OptionChanged",e,i,r)}var a=this,u=!1;"object"==typeof e?l.each(e,function(e,t){s(t,e,r)}):s(e,i,r),r?(S.required_features=n(l.extend({},S)),P=n(l.extend({},S,{required_features:!0}))):u&&(a.trigger("Destroy"),g.call(a,S,function(e){e?(a.runtime=o.getInfo(c()).type,a.trigger("Init",{runtime:a.runtime}),a.trigger("PostInit")):a.trigger("Error",{code:l.INIT_ERROR,message:l.translate("Init error.")})}))}function _(e,t){if(e.settings.unique_names){var i=t.name.match(/\.([^.]+)$/),n="part";i&&(n=i[1]),t.target_name=t.id+"."+n}}function E(e,i){function n(){c-->0?r(s,1e3):(i.loaded=g,e.trigger("Error",{code:l.HTTP_ERROR,message:l.translate("HTTP Error."),file:i,response:T.responseText,status:T.status,responseHeaders:T.getAllResponseHeaders()}))}function s(){var t,n,r={};i.status===l.UPLOADING&&e.state!==l.STOPPED&&(e.settings.send_file_name&&(r.name=i.target_name||i.name),d&&p.chunks&&o.size>d?(n=Math.min(d,o.size-g),t=o.slice(g,g+n)):(n=o.size,t=o),d&&p.chunks&&(e.settings.send_chunk_number?(r.chunk=Math.ceil(g/d),r.chunks=Math.ceil(o.size/d)):(r.offset=g,r.total=o.size)),e.trigger("BeforeChunkUpload",i,r,t,g)&&a(r,t,n))}function a(a,d,f){var h;T=new t.xhr.XMLHttpRequest,T.upload&&(T.upload.onprogress=function(t){i.loaded=Math.min(i.size,g+t.loaded),e.trigger("UploadProgress",i)}),T.onload=function(){return T.status>=400?(n(),void 0):(c=e.settings.max_retries,f<o.size?(d.destroy(),g+=f,i.loaded=Math.min(g,o.size),e.trigger("ChunkUploaded",i,{offset:i.loaded,total:o.size,response:T.responseText,status:T.status,responseHeaders:T.getAllResponseHeaders()}),"Android Browser"===l.ua.browser&&e.trigger("UploadProgress",i)):i.loaded=i.size,d=h=null,!g||g>=o.size?(i.size!=i.origSize&&(o.destroy(),o=null),e.trigger("UploadProgress",i),i.status=l.DONE,i.completeTimestamp=+new Date,e.trigger("FileUploaded",i,{response:T.responseText,status:T.status,responseHeaders:T.getAllResponseHeaders()})):r(s,1),void 0)},T.onerror=function(){n()},T.onloadend=function(){this.destroy(),T=null},e.settings.multipart&&p.multipart?(T.open(e.settings.http_method,u,!0),l.each(e.settings.headers,function(e,t){T.setRequestHeader(t,e)}),h=new t.xhr.FormData,l.each(l.extend(a,e.settings.multipart_params),function(e,t){h.append(t,e)}),h.append(e.settings.file_data_name,d),T.send(h,{runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:P,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url})):(u=l.buildUrl(e.settings.url,l.extend(a,e.settings.multipart_params)),T.open(e.settings.http_method,u,!0),l.each(e.settings.headers,function(e,t){T.setRequestHeader(t,e)}),T.hasRequestHeader("Content-Type")||T.setRequestHeader("Content-Type","application/octet-stream"),T.send(d,{runtime_order:e.settings.runtimes,required_caps:e.settings.required_features,preferred_caps:P,swf_url:e.settings.flash_swf_url,xap_url:e.settings.silverlight_xap_url}))}var o,u=e.settings.url,d=e.settings.chunk_size,c=e.settings.max_retries,p=e.features,g=0;i.loaded&&(g=i.loaded=d?d*Math.floor(i.loaded/d):0),o=i.getSource(),!l.isEmptyObj(e.settings.resize)&&f(o,"send_binary_string")&&-1!==l.inArray(o.type,["image/jpeg","image/png"])?h.call(this,o,e.settings.resize,function(e){o=e,i.size=e.size,s()}):s()}function v(e,t){u(t)}function b(e){if(e.state==l.STARTED)I=+new Date;else if(e.state==l.STOPPED)for(var t=e.files.length-1;t>=0;t--)e.files[t].status==l.UPLOADING&&(e.files[t].status=l.QUEUED,d())}function y(){T&&T.abort()}function R(e){d(),r(function(){a.call(e)},1)}function z(e,t){t.code===l.INIT_ERROR?e.destroy():t.code===l.HTTP_ERROR&&(t.file.status=l.FAILED,t.file.completeTimestamp=+new Date,u(t.file),e.state==l.STARTED&&(e.trigger("CancelUpload"),r(function(){a.call(e)},1)))}function O(e){e.stop(),l.each(x,function(e){e.destroy()}),x=[],U.length&&(l.each(U,function(e){e.destroy()}),U=[]),F.length&&(l.each(F,function(e){e.destroy()}),F=[]),P={},A=!1,I=T=null,w.reset()}var S,I,w,T,D=l.guid(),x=[],P={},U=[],F=[],A=!1;S={chunk_size:0,file_data_name:"file",filters:{mime_types:[],prevent_duplicates:!1,max_file_size:0},flash_swf_url:"js/Moxie.swf",http_method:"POST",max_retries:0,multipart:!0,multi_selection:!0,resize:!1,runtimes:o.order,send_file_name:!0,send_chunk_number:!0,silverlight_xap_url:"js/Moxie.xap"},m.call(this,e,null,!0),w=new l.QueueProgress,l.extend(this,{id:D,uid:D,state:l.STOPPED,features:{},runtime:null,files:x,settings:S,total:w,init:function(){var e,t,i=this;return e=i.getOption("preinit"),"function"==typeof e?e(i):l.each(e,function(e,t){i.bind(t,e)}),p.call(i),l.each(["container","browse_button","drop_element"],function(e){return null===i.getOption(e)?(t={code:l.INIT_ERROR,message:l.sprintf(l.translate("%s specified, but cannot be found."),e)},!1):void 0}),t?i.trigger("Error",t):S.browse_button||S.drop_element?(g.call(i,S,function(e){var t=i.getOption("init");"function"==typeof t?t(i):l.each(t,function(e,t){i.bind(t,e)}),e?(i.runtime=o.getInfo(c()).type,i.trigger("Init",{runtime:i.runtime}),i.trigger("PostInit")):i.trigger("Error",{code:l.INIT_ERROR,message:l.translate("Init error.")})}),void 0):i.trigger("Error",{code:l.INIT_ERROR,message:l.translate("You must specify either browse_button or drop_element.")})},setOption:function(e,t){m.call(this,e,t,!this.runtime)},getOption:function(e){return e?S[e]:S},refresh:function(){U.length&&l.each(U,function(e){e.trigger("Refresh")}),this.trigger("Refresh")},start:function(){this.state!=l.STARTED&&(this.state=l.STARTED,this.trigger("StateChanged"),a.call(this))},stop:function(){this.state!=l.STOPPED&&(this.state=l.STOPPED,this.trigger("StateChanged"),this.trigger("CancelUpload"))},disableBrowse:function(){A=arguments[0]!==i?arguments[0]:!0,U.length&&l.each(U,function(e){e.disable(A)}),this.trigger("DisableBrowse",A)},getFile:function(e){var t;for(t=x.length-1;t>=0;t--)if(x[t].id===e)return x[t]},addFile:function(e,i){function n(e,t){var i=[];l.each(u.settings.filters,function(t,n){s[n]&&i.push(function(i){s[n].call(u,t,e,function(e){i(!e)})})}),l.inSeries(i,t)}function a(e){var s=l.typeOf(e);if(e instanceof t.file.File){if(!e.ruid&&!e.isDetached()){if(!o)return!1;e.ruid=o,e.connectRuntime(o)}a(new l.File(e))}else e instanceof t.file.Blob?(a(e.getSource()),e.destroy()):e instanceof l.File?(i&&(e.name=i),d.push(function(t){n(e,function(i){i||(x.push(e),f.push(e),u.trigger("FileFiltered",e)),r(t,1)})})):-1!==l.inArray(s,["file","blob"])?a(new t.file.File(null,e)):"node"===s&&"filelist"===l.typeOf(e.files)?l.each(e.files,a):"array"===s&&(i=null,l.each(e,a))}var o,u=this,d=[],f=[];o=c(),a(e),d.length&&l.inSeries(d,function(){f.length&&u.trigger("FilesAdded",f)})},removeFile:function(e){for(var t="string"==typeof e?e:e.id,i=x.length-1;i>=0;i--)if(x[i].id===t)return this.splice(i,1)[0]},splice:function(e,t){var n=x.splice(e===i?0:e,t===i?x.length:t),r=!1;return this.state==l.STARTED&&(l.each(n,function(e){return e.status===l.UPLOADING?(r=!0,!1):void 0}),r&&this.stop()),this.trigger("FilesRemoved",n),l.each(n,function(e){e.destroy()}),r&&this.start(),n},dispatchEvent:function(e){var t,i;if(e=e.toLowerCase(),t=this.hasEventListener(e)){t.sort(function(e,t){return t.priority-e.priority}),i=[].slice.call(arguments),i.shift(),i.unshift(this);for(var n=0;n<t.length;n++)if(t[n].fn.apply(t[n].scope,i)===!1)return!1}return!0},bind:function(e,t,i,n){l.Uploader.prototype.bind.call(this,e,t,n,i)},destroy:function(){this.trigger("Destroy"),S=w=null,this.unbindAll()}})},l.Uploader.prototype=t.core.EventTarget.instance,l.File=function(){function e(e){l.extend(this,{id:l.guid(),name:e.name||e.fileName,type:e.type||"",size:e.size||e.fileSize,origSize:e.size||e.fileSize,loaded:0,percent:0,status:l.QUEUED,lastModifiedDate:e.lastModifiedDate||(new Date).toLocaleString(),completeTimestamp:0,getNative:function(){var e=this.getSource().getSource();return-1!==l.inArray(l.typeOf(e),["blob","file"])?e:null},getSource:function(){return t[this.id]?t[this.id]:null},destroy:function(){var e=this.getSource();e&&(e.destroy(),delete t[this.id])}}),t[this.id]=e}var t={};return e}(),l.QueueProgress=function(){var e=this;e.size=0,e.loaded=0,e.uploaded=0,e.failed=0,e.queued=0,e.percent=0,e.bytesPerSec=0,e.reset=function(){e.size=e.loaded=e.uploaded=e.failed=e.queued=e.percent=e.bytesPerSec=0}},e.plupload=l}(this,e)});
/*!
 * Bootstrap-select v1.12.2 (http://silviomoreto.github.io/bootstrap-select)
 *
 * Copyright 2013-2017 bootstrap-select
 * Licensed under MIT (https://github.com/silviomoreto/bootstrap-select/blob/master/LICENSE)
 */
!function(a,b){"function"==typeof define&&define.amd?define(["jquery"],function(a){return b(a)}):"object"==typeof module&&module.exports?module.exports=b(require("jquery")):b(a.jQuery)}(this,function(a){!function(a){"use strict";function b(b){var c=[{re:/[\xC0-\xC6]/g,ch:"A"},{re:/[\xE0-\xE6]/g,ch:"a"},{re:/[\xC8-\xCB]/g,ch:"E"},{re:/[\xE8-\xEB]/g,ch:"e"},{re:/[\xCC-\xCF]/g,ch:"I"},{re:/[\xEC-\xEF]/g,ch:"i"},{re:/[\xD2-\xD6]/g,ch:"O"},{re:/[\xF2-\xF6]/g,ch:"o"},{re:/[\xD9-\xDC]/g,ch:"U"},{re:/[\xF9-\xFC]/g,ch:"u"},{re:/[\xC7-\xE7]/g,ch:"c"},{re:/[\xD1]/g,ch:"N"},{re:/[\xF1]/g,ch:"n"}];return a.each(c,function(){b=b?b.replace(this.re,this.ch):""}),b}function c(b){var c=arguments,d=b;[].shift.apply(c);var e,f=this.each(function(){var b=a(this);if(b.is("select")){var f=b.data("selectpicker"),g="object"==typeof d&&d;if(f){if(g)for(var h in g)g.hasOwnProperty(h)&&(f.options[h]=g[h])}else{var i=a.extend({},k.DEFAULTS,a.fn.selectpicker.defaults||{},b.data(),g);i.template=a.extend({},k.DEFAULTS.template,a.fn.selectpicker.defaults?a.fn.selectpicker.defaults.template:{},b.data().template,g.template),b.data("selectpicker",f=new k(this,i))}"string"==typeof d&&(e=f[d]instanceof Function?f[d].apply(f,c):f.options[d])}});return"undefined"!=typeof e?e:f}String.prototype.includes||!function(){var a={}.toString,b=function(){try{var a={},b=Object.defineProperty,c=b(a,a,a)&&b}catch(a){}return c}(),c="".indexOf,d=function(b){if(null==this)throw new TypeError;var d=String(this);if(b&&"[object RegExp]"==a.call(b))throw new TypeError;var e=d.length,f=String(b),g=f.length,h=arguments.length>1?arguments[1]:void 0,i=h?Number(h):0;i!=i&&(i=0);var j=Math.min(Math.max(i,0),e);return!(g+j>e)&&c.call(d,f,i)!=-1};b?b(String.prototype,"includes",{value:d,configurable:!0,writable:!0}):String.prototype.includes=d}(),String.prototype.startsWith||!function(){var a=function(){try{var a={},b=Object.defineProperty,c=b(a,a,a)&&b}catch(a){}return c}(),b={}.toString,c=function(a){if(null==this)throw new TypeError;var c=String(this);if(a&&"[object RegExp]"==b.call(a))throw new TypeError;var d=c.length,e=String(a),f=e.length,g=arguments.length>1?arguments[1]:void 0,h=g?Number(g):0;h!=h&&(h=0);var i=Math.min(Math.max(h,0),d);if(f+i>d)return!1;for(var j=-1;++j<f;)if(c.charCodeAt(i+j)!=e.charCodeAt(j))return!1;return!0};a?a(String.prototype,"startsWith",{value:c,configurable:!0,writable:!0}):String.prototype.startsWith=c}(),Object.keys||(Object.keys=function(a,b,c){c=[];for(b in a)c.hasOwnProperty.call(a,b)&&c.push(b);return c});var d={useDefault:!1,_set:a.valHooks.select.set};a.valHooks.select.set=function(b,c){return c&&!d.useDefault&&a(b).data("selected",!0),d._set.apply(this,arguments)};var e=null;a.fn.triggerNative=function(a){var b,c=this[0];c.dispatchEvent?("function"==typeof Event?b=new Event(a,{bubbles:!0}):(b=document.createEvent("Event"),b.initEvent(a,!0,!1)),c.dispatchEvent(b)):c.fireEvent?(b=document.createEventObject(),b.eventType=a,c.fireEvent("on"+a,b)):this.trigger(a)},a.expr.pseudos.icontains=function(b,c,d){var e=a(b),f=(e.data("tokens")||e.text()).toString().toUpperCase();return f.includes(d[3].toUpperCase())},a.expr.pseudos.ibegins=function(b,c,d){var e=a(b),f=(e.data("tokens")||e.text()).toString().toUpperCase();return f.startsWith(d[3].toUpperCase())},a.expr.pseudos.aicontains=function(b,c,d){var e=a(b),f=(e.data("tokens")||e.data("normalizedText")||e.text()).toString().toUpperCase();return f.includes(d[3].toUpperCase())},a.expr.pseudos.aibegins=function(b,c,d){var e=a(b),f=(e.data("tokens")||e.data("normalizedText")||e.text()).toString().toUpperCase();return f.startsWith(d[3].toUpperCase())};var f={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},g={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"',"&#x27;":"'","&#x60;":"`"},h=function(a){var b=function(b){return a[b]},c="(?:"+Object.keys(a).join("|")+")",d=RegExp(c),e=RegExp(c,"g");return function(a){return a=null==a?"":""+a,d.test(a)?a.replace(e,b):a}},i=h(f),j=h(g),k=function(b,c){d.useDefault||(a.valHooks.select.set=d._set,d.useDefault=!0),this.$element=a(b),this.$newElement=null,this.$button=null,this.$menu=null,this.$lis=null,this.options=c,null===this.options.title&&(this.options.title=this.$element.attr("title"));var e=this.options.windowPadding;"number"==typeof e&&(this.options.windowPadding=[e,e,e,e]),this.val=k.prototype.val,this.render=k.prototype.render,this.refresh=k.prototype.refresh,this.setStyle=k.prototype.setStyle,this.selectAll=k.prototype.selectAll,this.deselectAll=k.prototype.deselectAll,this.destroy=k.prototype.destroy,this.remove=k.prototype.remove,this.show=k.prototype.show,this.hide=k.prototype.hide,this.init()};k.VERSION="1.12.2",k.DEFAULTS={noneSelectedText:"Nothing selected",noneResultsText:"No results matched {0}",countSelectedText:function(a,b){return 1==a?"{0} item selected":"{0} items selected"},maxOptionsText:function(a,b){return[1==a?"Limit reached ({n} item max)":"Limit reached ({n} items max)",1==b?"Group limit reached ({n} item max)":"Group limit reached ({n} items max)"]},selectAllText:"Select All",deselectAllText:"Deselect All",doneButton:!1,doneButtonText:"Close",multipleSeparator:", ",styleBase:"btn",style:"btn-default",size:"auto",title:null,selectedTextFormat:"values",width:!1,container:!1,hideDisabled:!1,showSubtext:!1,showIcon:!0,showContent:!0,dropupAuto:!0,header:!1,liveSearch:!1,liveSearchPlaceholder:null,liveSearchNormalize:!1,liveSearchStyle:"contains",actionsBox:!1,iconBase:"glyphicon",tickIcon:"glyphicon-ok",showTick:!1,template:{caret:'<span class="caret"></span>'},maxOptions:!1,mobile:!1,selectOnTab:!1,dropdownAlignRight:!1,windowPadding:0},k.prototype={constructor:k,init:function(){var b=this,c=this.$element.attr("id");this.$element.addClass("bs-select-hidden"),this.liObj={},this.multiple=this.$element.prop("multiple"),this.autofocus=this.$element.prop("autofocus"),this.$newElement=this.createView(),this.$element.after(this.$newElement).appendTo(this.$newElement),this.$button=this.$newElement.children("button"),this.$menu=this.$newElement.children(".dropdown-menu"),this.$menuInner=this.$menu.children(".inner"),this.$searchbox=this.$menu.find("input"),this.$element.removeClass("bs-select-hidden"),this.options.dropdownAlignRight===!0&&this.$menu.addClass("dropdown-menu-right"),"undefined"!=typeof c&&(this.$button.attr("data-id",c),a('label[for="'+c+'"]').click(function(a){a.preventDefault(),b.$button.focus()})),this.checkDisabled(),this.clickListener(),this.options.liveSearch&&this.liveSearchListener(),this.render(),this.setStyle(),this.setWidth(),this.options.container&&this.selectPosition(),this.$menu.data("this",this),this.$newElement.data("this",this),this.options.mobile&&this.mobile(),this.$newElement.on({"hide.bs.dropdown":function(a){b.$menuInner.attr("aria-expanded",!1),b.$element.trigger("hide.bs.select",a)},"hidden.bs.dropdown":function(a){b.$element.trigger("hidden.bs.select",a)},"show.bs.dropdown":function(a){b.$menuInner.attr("aria-expanded",!0),b.$element.trigger("show.bs.select",a)},"shown.bs.dropdown":function(a){b.$element.trigger("shown.bs.select",a)}}),b.$element[0].hasAttribute("required")&&this.$element.on("invalid",function(){b.$button.addClass("bs-invalid").focus(),b.$element.on({"focus.bs.select":function(){b.$button.focus(),b.$element.off("focus.bs.select")},"shown.bs.select":function(){b.$element.val(b.$element.val()).off("shown.bs.select")},"rendered.bs.select":function(){this.validity.valid&&b.$button.removeClass("bs-invalid"),b.$element.off("rendered.bs.select")}})}),setTimeout(function(){b.$element.trigger("loaded.bs.select")})},createDropdown:function(){var b=this.multiple||this.options.showTick?" show-tick":"",c=this.$element.parent().hasClass("input-group")?" input-group-btn":"",d=this.autofocus?" autofocus":"",e=this.options.header?'<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>'+this.options.header+"</div>":"",f=this.options.liveSearch?'<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"'+(null===this.options.liveSearchPlaceholder?"":' placeholder="'+i(this.options.liveSearchPlaceholder)+'"')+' role="textbox" aria-label="Search"></div>':"",g=this.multiple&&this.options.actionsBox?'<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">'+this.options.selectAllText+'</button><button type="button" class="actions-btn bs-deselect-all btn btn-default">'+this.options.deselectAllText+"</button></div></div>":"",h=this.multiple&&this.options.doneButton?'<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">'+this.options.doneButtonText+"</button></div></div>":"",j='<div class="btn-group bootstrap-select'+b+c+'"><button type="button" class="'+this.options.styleBase+' dropdown-toggle" data-toggle="dropdown"'+d+' role="button"><span class="filter-option"></span><span class="bs-caret">'+this.options.template.caret+'</span></button><div class="dropdown-menu open" role="combobox">'+e+f+g+'<ul class="dropdown-menu inner" role="listbox" aria-expanded="false"></ul>'+h+"</div></div>";return a(j)},createView:function(){var a=this.createDropdown(),b=this.createLi();return a.find("ul")[0].innerHTML=b,a},reloadLi:function(){var a=this.createLi();this.$menuInner[0].innerHTML=a},createLi:function(){var c=this,d=[],e=0,f=document.createElement("option"),g=-1,h=function(a,b,c,d){return"<li"+("undefined"!=typeof c&""!==c?' class="'+c+'"':"")+("undefined"!=typeof b&null!==b?' data-original-index="'+b+'"':"")+("undefined"!=typeof d&null!==d?'data-optgroup="'+d+'"':"")+">"+a+"</li>"},j=function(d,e,f,g){return'<a tabindex="0"'+("undefined"!=typeof e?' class="'+e+'"':"")+(f?' style="'+f+'"':"")+(c.options.liveSearchNormalize?' data-normalized-text="'+b(i(a(d).html()))+'"':"")+("undefined"!=typeof g||null!==g?' data-tokens="'+g+'"':"")+' role="option">'+d+'<span class="'+c.options.iconBase+" "+c.options.tickIcon+' check-mark"></span></a>'};if(this.options.title&&!this.multiple&&(g--,!this.$element.find(".bs-title-option").length)){var k=this.$element[0];f.className="bs-title-option",f.innerHTML=this.options.title,f.value="",k.insertBefore(f,k.firstChild);var l=a(k.options[k.selectedIndex]);void 0===l.attr("selected")&&void 0===this.$element.data("selected")&&(f.selected=!0)}return this.$element.find("option").each(function(b){var f=a(this);if(g++,!f.hasClass("bs-title-option")){var k=this.className||"",l=this.style.cssText,m=f.data("content")?f.data("content"):f.html(),n=f.data("tokens")?f.data("tokens"):null,o="undefined"!=typeof f.data("subtext")?'<small class="text-muted">'+f.data("subtext")+"</small>":"",p="undefined"!=typeof f.data("icon")?'<span class="'+c.options.iconBase+" "+f.data("icon")+'"></span> ':"",q=f.parent(),r="OPTGROUP"===q[0].tagName,s=r&&q[0].disabled,t=this.disabled||s;if(""!==p&&t&&(p="<span>"+p+"</span>"),c.options.hideDisabled&&(t&&!r||s))return void g--;if(f.data("content")||(m=p+'<span class="text">'+m+o+"</span>"),r&&f.data("divider")!==!0){if(c.options.hideDisabled&&t){if(void 0===q.data("allOptionsDisabled")){var u=q.children();q.data("allOptionsDisabled",u.filter(":disabled").length===u.length)}if(q.data("allOptionsDisabled"))return void g--}var v=" "+q[0].className||"";if(0===f.index()){e+=1;var w=q[0].label,x="undefined"!=typeof q.data("subtext")?'<small class="text-muted">'+q.data("subtext")+"</small>":"",y=q.data("icon")?'<span class="'+c.options.iconBase+" "+q.data("icon")+'"></span> ':"";w=y+'<span class="text">'+i(w)+x+"</span>",0!==b&&d.length>0&&(g++,d.push(h("",null,"divider",e+"div"))),g++,d.push(h(w,null,"dropdown-header"+v,e))}if(c.options.hideDisabled&&t)return void g--;d.push(h(j(m,"opt "+k+v,l,n),b,"",e))}else if(f.data("divider")===!0)d.push(h("",b,"divider"));else if(f.data("hidden")===!0)d.push(h(j(m,k,l,n),b,"hidden is-hidden"));else{var z=this.previousElementSibling&&"OPTGROUP"===this.previousElementSibling.tagName;if(!z&&c.options.hideDisabled)for(var A=a(this).prevAll(),B=0;B<A.length;B++)if("OPTGROUP"===A[B].tagName){for(var C=0,D=0;D<B;D++){var E=A[D];(E.disabled||a(E).data("hidden")===!0)&&C++}C===B&&(z=!0);break}z&&(g++,d.push(h("",null,"divider",e+"div"))),d.push(h(j(m,k,l,n),b))}c.liObj[b]=g}}),this.multiple||0!==this.$element.find("option:selected").length||this.options.title||this.$element.find("option").eq(0).prop("selected",!0).attr("selected","selected"),d.join("")},findLis:function(){return null==this.$lis&&(this.$lis=this.$menu.find("li")),this.$lis},render:function(b){var c,d=this;b!==!1&&this.$element.find("option").each(function(a){var b=d.findLis().eq(d.liObj[a]);d.setDisabled(a,this.disabled||"OPTGROUP"===this.parentNode.tagName&&this.parentNode.disabled,b),d.setSelected(a,this.selected,b)}),this.togglePlaceholder(),this.tabIndex();var e=this.$element.find("option").map(function(){if(this.selected){if(d.options.hideDisabled&&(this.disabled||"OPTGROUP"===this.parentNode.tagName&&this.parentNode.disabled))return;var b,c=a(this),e=c.data("icon")&&d.options.showIcon?'<i class="'+d.options.iconBase+" "+c.data("icon")+'"></i> ':"";return b=d.options.showSubtext&&c.data("subtext")&&!d.multiple?' <small class="text-muted">'+c.data("subtext")+"</small>":"","undefined"!=typeof c.attr("title")?c.attr("title"):c.data("content")&&d.options.showContent?c.data("content").toString():e+c.html()+b}}).toArray(),f=this.multiple?e.join(this.options.multipleSeparator):e[0];if(this.multiple&&this.options.selectedTextFormat.indexOf("count")>-1){var g=this.options.selectedTextFormat.split(">");if(g.length>1&&e.length>g[1]||1==g.length&&e.length>=2){c=this.options.hideDisabled?", [disabled]":"";var h=this.$element.find("option").not('[data-divider="true"], [data-hidden="true"]'+c).length,i="function"==typeof this.options.countSelectedText?this.options.countSelectedText(e.length,h):this.options.countSelectedText;f=i.replace("{0}",e.length.toString()).replace("{1}",h.toString())}}void 0==this.options.title&&(this.options.title=this.$element.attr("title")),"static"==this.options.selectedTextFormat&&(f=this.options.title),f||(f="undefined"!=typeof this.options.title?this.options.title:this.options.noneSelectedText),this.$button.attr("title",j(a.trim(f.replace(/<[^>]*>?/g,"")))),this.$button.children(".filter-option").html(f),this.$element.trigger("rendered.bs.select")},setStyle:function(a,b){this.$element.attr("class")&&this.$newElement.addClass(this.$element.attr("class").replace(/selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi,""));var c=a?a:this.options.style;"add"==b?this.$button.addClass(c):"remove"==b?this.$button.removeClass(c):(this.$button.removeClass(this.options.style),this.$button.addClass(c))},liHeight:function(b){if(b||this.options.size!==!1&&!this.sizeInfo){var c=document.createElement("div"),d=document.createElement("div"),e=document.createElement("ul"),f=document.createElement("li"),g=document.createElement("li"),h=document.createElement("a"),i=document.createElement("span"),j=this.options.header&&this.$menu.find(".popover-title").length>0?this.$menu.find(".popover-title")[0].cloneNode(!0):null,k=this.options.liveSearch?document.createElement("div"):null,l=this.options.actionsBox&&this.multiple&&this.$menu.find(".bs-actionsbox").length>0?this.$menu.find(".bs-actionsbox")[0].cloneNode(!0):null,m=this.options.doneButton&&this.multiple&&this.$menu.find(".bs-donebutton").length>0?this.$menu.find(".bs-donebutton")[0].cloneNode(!0):null;if(i.className="text",c.className=this.$menu[0].parentNode.className+" open",d.className="dropdown-menu open",e.className="dropdown-menu inner",f.className="divider",i.appendChild(document.createTextNode("Inner text")),h.appendChild(i),g.appendChild(h),e.appendChild(g),e.appendChild(f),j&&d.appendChild(j),k){var n=document.createElement("input");k.className="bs-searchbox",n.className="form-control",k.appendChild(n),d.appendChild(k)}l&&d.appendChild(l),d.appendChild(e),m&&d.appendChild(m),c.appendChild(d),document.body.appendChild(c);var o=h.offsetHeight,p=j?j.offsetHeight:0,q=k?k.offsetHeight:0,r=l?l.offsetHeight:0,s=m?m.offsetHeight:0,t=a(f).outerHeight(!0),u="function"==typeof getComputedStyle&&getComputedStyle(d),v=u?null:a(d),w={vert:parseInt(u?u.paddingTop:v.css("paddingTop"))+parseInt(u?u.paddingBottom:v.css("paddingBottom"))+parseInt(u?u.borderTopWidth:v.css("borderTopWidth"))+parseInt(u?u.borderBottomWidth:v.css("borderBottomWidth")),horiz:parseInt(u?u.paddingLeft:v.css("paddingLeft"))+parseInt(u?u.paddingRight:v.css("paddingRight"))+parseInt(u?u.borderLeftWidth:v.css("borderLeftWidth"))+parseInt(u?u.borderRightWidth:v.css("borderRightWidth"))},x={vert:w.vert+parseInt(u?u.marginTop:v.css("marginTop"))+parseInt(u?u.marginBottom:v.css("marginBottom"))+2,horiz:w.horiz+parseInt(u?u.marginLeft:v.css("marginLeft"))+parseInt(u?u.marginRight:v.css("marginRight"))+2};document.body.removeChild(c),this.sizeInfo={liHeight:o,headerHeight:p,searchHeight:q,actionsHeight:r,doneButtonHeight:s,dividerHeight:t,menuPadding:w,menuExtras:x}}},setSize:function(){if(this.findLis(),this.liHeight(),this.options.header&&this.$menu.css("padding-top",0),this.options.size!==!1){var b,c,d,e,f,g,h,i,j=this,k=this.$menu,l=this.$menuInner,m=a(window),n=this.$newElement[0].offsetHeight,o=this.$newElement[0].offsetWidth,p=this.sizeInfo.liHeight,q=this.sizeInfo.headerHeight,r=this.sizeInfo.searchHeight,s=this.sizeInfo.actionsHeight,t=this.sizeInfo.doneButtonHeight,u=this.sizeInfo.dividerHeight,v=this.sizeInfo.menuPadding,w=this.sizeInfo.menuExtras,x=this.options.hideDisabled?".disabled":"",y=function(){var b,c=j.$newElement.offset(),d=a(j.options.container);j.options.container&&!d.is("body")?(b=d.offset(),b.top+=parseInt(d.css("borderTopWidth")),b.left+=parseInt(d.css("borderLeftWidth"))):b={top:0,left:0};var e=j.options.windowPadding;f=c.top-b.top-m.scrollTop(),g=m.height()-f-n-b.top-e[2],h=c.left-b.left-m.scrollLeft(),i=m.width()-h-o-b.left-e[1],f-=e[0],h-=e[3]};if(y(),"auto"===this.options.size){var z=function(){var m,n=function(b,c){return function(d){return c?d.classList?d.classList.contains(b):a(d).hasClass(b):!(d.classList?d.classList.contains(b):a(d).hasClass(b))}},u=j.$menuInner[0].getElementsByTagName("li"),x=Array.prototype.filter?Array.prototype.filter.call(u,n("hidden",!1)):j.$lis.not(".hidden"),z=Array.prototype.filter?Array.prototype.filter.call(x,n("dropdown-header",!0)):x.filter(".dropdown-header");y(),b=g-w.vert,c=i-w.horiz,j.options.container?(k.data("height")||k.data("height",k.height()),d=k.data("height"),k.data("width")||k.data("width",k.width()),e=k.data("width")):(d=k.height(),e=k.width()),j.options.dropupAuto&&j.$newElement.toggleClass("dropup",f>g&&b-w.vert<d),j.$newElement.hasClass("dropup")&&(b=f-w.vert),"auto"===j.options.dropdownAlignRight&&k.toggleClass("dropdown-menu-right",h>i&&c-w.horiz<e-o),m=x.length+z.length>3?3*p+w.vert-2:0,k.css({"max-height":b+"px",overflow:"hidden","min-height":m+q+r+s+t+"px"}),l.css({"max-height":b-q-r-s-t-v.vert+"px","overflow-y":"auto","min-height":Math.max(m-v.vert,0)+"px"})};z(),this.$searchbox.off("input.getSize propertychange.getSize").on("input.getSize propertychange.getSize",z),m.off("resize.getSize scroll.getSize").on("resize.getSize scroll.getSize",z)}else if(this.options.size&&"auto"!=this.options.size&&this.$lis.not(x).length>this.options.size){var A=this.$lis.not(".divider").not(x).children().slice(0,this.options.size).last().parent().index(),B=this.$lis.slice(0,A+1).filter(".divider").length;b=p*this.options.size+B*u+v.vert,j.options.container?(k.data("height")||k.data("height",k.height()),d=k.data("height")):d=k.height(),j.options.dropupAuto&&this.$newElement.toggleClass("dropup",f>g&&b-w.vert<d),k.css({"max-height":b+q+r+s+t+"px",overflow:"hidden","min-height":""}),l.css({"max-height":b-v.vert+"px","overflow-y":"auto","min-height":""})}}},setWidth:function(){if("auto"===this.options.width){this.$menu.css("min-width","0");var a=this.$menu.parent().clone().appendTo("body"),b=this.options.container?this.$newElement.clone().appendTo("body"):a,c=a.children(".dropdown-menu").outerWidth(),d=b.css("width","auto").children("button").outerWidth();a.remove(),b.remove(),this.$newElement.css("width",Math.max(c,d)+"px")}else"fit"===this.options.width?(this.$menu.css("min-width",""),this.$newElement.css("width","").addClass("fit-width")):this.options.width?(this.$menu.css("min-width",""),this.$newElement.css("width",this.options.width)):(this.$menu.css("min-width",""),this.$newElement.css("width",""));this.$newElement.hasClass("fit-width")&&"fit"!==this.options.width&&this.$newElement.removeClass("fit-width")},selectPosition:function(){this.$bsContainer=a('<div class="bs-container" />');var b,c,d,e=this,f=a(this.options.container),g=function(a){e.$bsContainer.addClass(a.attr("class").replace(/form-control|fit-width/gi,"")).toggleClass("dropup",a.hasClass("dropup")),b=a.offset(),f.is("body")?c={top:0,left:0}:(c=f.offset(),c.top+=parseInt(f.css("borderTopWidth"))-f.scrollTop(),c.left+=parseInt(f.css("borderLeftWidth"))-f.scrollLeft()),d=a.hasClass("dropup")?0:a[0].offsetHeight,e.$bsContainer.css({top:b.top-c.top+d,left:b.left-c.left,width:a[0].offsetWidth})};this.$button.on("click",function(){var b=a(this);e.isDisabled()||(g(e.$newElement),e.$bsContainer.appendTo(e.options.container).toggleClass("open",!b.hasClass("open")).append(e.$menu))}),a(window).on("resize scroll",function(){g(e.$newElement)}),this.$element.on("hide.bs.select",function(){e.$menu.data("height",e.$menu.height()),e.$bsContainer.detach()})},setSelected:function(a,b,c){c||(this.togglePlaceholder(),c=this.findLis().eq(this.liObj[a])),c.toggleClass("selected",b).find("a").attr("aria-selected",b)},setDisabled:function(a,b,c){c||(c=this.findLis().eq(this.liObj[a])),b?c.addClass("disabled").children("a").attr("href","#").attr("tabindex",-1).attr("aria-disabled",!0):c.removeClass("disabled").children("a").removeAttr("href").attr("tabindex",0).attr("aria-disabled",!1)},isDisabled:function(){return this.$element[0].disabled},checkDisabled:function(){var a=this;this.isDisabled()?(this.$newElement.addClass("disabled"),this.$button.addClass("disabled").attr("tabindex",-1).attr("aria-disabled",!0)):(this.$button.hasClass("disabled")&&(this.$newElement.removeClass("disabled"),this.$button.removeClass("disabled").attr("aria-disabled",!1)),this.$button.attr("tabindex")!=-1||this.$element.data("tabindex")||this.$button.removeAttr("tabindex")),this.$button.click(function(){return!a.isDisabled()})},togglePlaceholder:function(){var a=this.$element.val();this.$button.toggleClass("bs-placeholder",null===a||""===a||a.constructor===Array&&0===a.length)},tabIndex:function(){this.$element.data("tabindex")!==this.$element.attr("tabindex")&&this.$element.attr("tabindex")!==-98&&"-98"!==this.$element.attr("tabindex")&&(this.$element.data("tabindex",this.$element.attr("tabindex")),this.$button.attr("tabindex",this.$element.data("tabindex"))),this.$element.attr("tabindex",-98)},clickListener:function(){var b=this,c=a(document);c.data("spaceSelect",!1),this.$button.on("keyup",function(a){/(32)/.test(a.keyCode.toString(10))&&c.data("spaceSelect")&&(a.preventDefault(),c.data("spaceSelect",!1))}),this.$button.on("click",function(){b.setSize()}),this.$element.on("shown.bs.select",function(){if(b.options.liveSearch||b.multiple){if(!b.multiple){var a=b.liObj[b.$element[0].selectedIndex];if("number"!=typeof a||b.options.size===!1)return;var c=b.$lis.eq(a)[0].offsetTop-b.$menuInner[0].offsetTop;c=c-b.$menuInner[0].offsetHeight/2+b.sizeInfo.liHeight/2,b.$menuInner[0].scrollTop=c}}else b.$menuInner.find(".selected a").focus()}),this.$menuInner.on("click","li a",function(c){var d=a(this),f=d.parent().data("originalIndex"),g=b.$element.val(),h=b.$element.prop("selectedIndex"),i=!0;if(b.multiple&&1!==b.options.maxOptions&&c.stopPropagation(),c.preventDefault(),!b.isDisabled()&&!d.parent().hasClass("disabled")){var j=b.$element.find("option"),k=j.eq(f),l=k.prop("selected"),m=k.parent("optgroup"),n=b.options.maxOptions,o=m.data("maxOptions")||!1;if(b.multiple){if(k.prop("selected",!l),b.setSelected(f,!l),d.blur(),n!==!1||o!==!1){var p=n<j.filter(":selected").length,q=o<m.find("option:selected").length;if(n&&p||o&&q)if(n&&1==n)j.prop("selected",!1),k.prop("selected",!0),b.$menuInner.find(".selected").removeClass("selected"),b.setSelected(f,!0);else if(o&&1==o){m.find("option:selected").prop("selected",!1),k.prop("selected",!0);var r=d.parent().data("optgroup");b.$menuInner.find('[data-optgroup="'+r+'"]').removeClass("selected"),b.setSelected(f,!0)}else{var s="string"==typeof b.options.maxOptionsText?[b.options.maxOptionsText,b.options.maxOptionsText]:b.options.maxOptionsText,t="function"==typeof s?s(n,o):s,u=t[0].replace("{n}",n),v=t[1].replace("{n}",o),w=a('<div class="notify"></div>');t[2]&&(u=u.replace("{var}",t[2][n>1?0:1]),v=v.replace("{var}",t[2][o>1?0:1])),k.prop("selected",!1),b.$menu.append(w),n&&p&&(w.append(a("<div>"+u+"</div>")),i=!1,b.$element.trigger("maxReached.bs.select")),o&&q&&(w.append(a("<div>"+v+"</div>")),i=!1,b.$element.trigger("maxReachedGrp.bs.select")),setTimeout(function(){b.setSelected(f,!1)},10),w.delay(750).fadeOut(300,function(){a(this).remove()})}}}else j.prop("selected",!1),k.prop("selected",!0),b.$menuInner.find(".selected").removeClass("selected").find("a").attr("aria-selected",!1),b.setSelected(f,!0);!b.multiple||b.multiple&&1===b.options.maxOptions?b.$button.focus():b.options.liveSearch&&b.$searchbox.focus(),i&&(g!=b.$element.val()&&b.multiple||h!=b.$element.prop("selectedIndex")&&!b.multiple)&&(e=[f,k.prop("selected"),l],b.$element.triggerNative("change"))}}),this.$menu.on("click","li.disabled a, .popover-title, .popover-title :not(.close)",function(c){c.currentTarget==this&&(c.preventDefault(),c.stopPropagation(),b.options.liveSearch&&!a(c.target).hasClass("close")?b.$searchbox.focus():b.$button.focus())}),this.$menuInner.on("click",".divider, .dropdown-header",function(a){a.preventDefault(),a.stopPropagation(),b.options.liveSearch?b.$searchbox.focus():b.$button.focus()}),this.$menu.on("click",".popover-title .close",function(){b.$button.click()}),this.$searchbox.on("click",function(a){a.stopPropagation()}),this.$menu.on("click",".actions-btn",function(c){b.options.liveSearch?b.$searchbox.focus():b.$button.focus(),c.preventDefault(),c.stopPropagation(),a(this).hasClass("bs-select-all")?b.selectAll():b.deselectAll()}),this.$element.change(function(){b.render(!1),b.$element.trigger("changed.bs.select",e),e=null})},liveSearchListener:function(){var c=this,d=a('<li class="no-results"></li>');this.$button.on("click.dropdown.data-api",function(){c.$menuInner.find(".active").removeClass("active"),c.$searchbox.val()&&(c.$searchbox.val(""),c.$lis.not(".is-hidden").removeClass("hidden"),d.parent().length&&d.remove()),c.multiple||c.$menuInner.find(".selected").addClass("active"),setTimeout(function(){c.$searchbox.focus()},10)}),this.$searchbox.on("click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api",function(a){a.stopPropagation()}),this.$searchbox.on("input propertychange",function(){if(c.$lis.not(".is-hidden").removeClass("hidden"),c.$lis.filter(".active").removeClass("active"),d.remove(),c.$searchbox.val()){var e,f=c.$lis.not(".is-hidden, .divider, .dropdown-header");if(e=c.options.liveSearchNormalize?f.find("a").not(":a"+c._searchStyle()+'("'+b(c.$searchbox.val())+'")'):f.find("a").not(":"+c._searchStyle()+'("'+c.$searchbox.val()+'")'),e.length===f.length)d.html(c.options.noneResultsText.replace("{0}",'"'+i(c.$searchbox.val())+'"')),c.$menuInner.append(d),c.$lis.addClass("hidden");else{e.parent().addClass("hidden");var g,h=c.$lis.not(".hidden");h.each(function(b){var c=a(this);c.hasClass("divider")?void 0===g?c.addClass("hidden"):(g&&g.addClass("hidden"),g=c):c.hasClass("dropdown-header")&&h.eq(b+1).data("optgroup")!==c.data("optgroup")?c.addClass("hidden"):g=null}),g&&g.addClass("hidden"),f.not(".hidden").first().addClass("active")}}})},_searchStyle:function(){var a={begins:"ibegins",startsWith:"ibegins"};return a[this.options.liveSearchStyle]||"icontains"},val:function(a){return"undefined"!=typeof a?(this.$element.val(a),this.render(),this.$element):this.$element.val()},changeAll:function(b){if(this.multiple){"undefined"==typeof b&&(b=!0),this.findLis();var c=this.$element.find("option"),d=this.$lis.not(".divider, .dropdown-header, .disabled, .hidden"),e=d.length,f=[];if(b){if(d.filter(".selected").length===d.length)return}else if(0===d.filter(".selected").length)return;d.toggleClass("selected",b);for(var g=0;g<e;g++){var h=d[g].getAttribute("data-original-index");f[f.length]=c.eq(h)[0]}a(f).prop("selected",b),this.render(!1),this.togglePlaceholder(),this.$element.triggerNative("change")}},selectAll:function(){return this.changeAll(!0)},deselectAll:function(){return this.changeAll(!1)},toggle:function(a){a=a||window.event,a&&a.stopPropagation(),this.$button.trigger("click")},keydown:function(c){var d,e,f,g,h,i,j,k,l,m=a(this),n=m.is("input")?m.parent().parent():m.parent(),o=n.data("this"),p=":not(.disabled, .hidden, .dropdown-header, .divider)",q={32:" ",48:"0",49:"1",50:"2",51:"3",52:"4",53:"5",54:"6",55:"7",56:"8",57:"9",59:";",65:"a",66:"b",67:"c",68:"d",69:"e",70:"f",71:"g",72:"h",73:"i",74:"j",75:"k",76:"l",77:"m",78:"n",79:"o",80:"p",81:"q",82:"r",83:"s",84:"t",85:"u",86:"v",87:"w",88:"x",89:"y",90:"z",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9"};if(o.options.liveSearch&&(n=m.parent().parent()),o.options.container&&(n=o.$menu),d=a('[role="listbox"] li',n),l=o.$newElement.hasClass("open"),!l&&(c.keyCode>=48&&c.keyCode<=57||c.keyCode>=96&&c.keyCode<=105||c.keyCode>=65&&c.keyCode<=90))return o.options.container?o.$button.trigger("click"):(o.setSize(),o.$menu.parent().addClass("open"),l=!0),void o.$searchbox.focus();if(o.options.liveSearch&&(/(^9$|27)/.test(c.keyCode.toString(10))&&l&&(c.preventDefault(),c.stopPropagation(),o.$menuInner.click(),o.$button.focus()),d=a('[role="listbox"] li'+p,n),m.val()||/(38|40)/.test(c.keyCode.toString(10))||0===d.filter(".active").length&&(d=o.$menuInner.find("li"),d=o.options.liveSearchNormalize?d.filter(":a"+o._searchStyle()+"("+b(q[c.keyCode])+")"):d.filter(":"+o._searchStyle()+"("+q[c.keyCode]+")"))),d.length){if(/(38|40)/.test(c.keyCode.toString(10)))e=d.index(d.find("a").filter(":focus").parent()),g=d.filter(p).first().index(),h=d.filter(p).last().index(),f=d.eq(e).nextAll(p).eq(0).index(),i=d.eq(e).prevAll(p).eq(0).index(),j=d.eq(f).prevAll(p).eq(0).index(),o.options.liveSearch&&(d.each(function(b){a(this).hasClass("disabled")||a(this).data("index",b)}),e=d.index(d.filter(".active")),g=d.first().data("index"),h=d.last().data("index"),f=d.eq(e).nextAll().eq(0).data("index"),i=d.eq(e).prevAll().eq(0).data("index"),j=d.eq(f).prevAll().eq(0).data("index")),k=m.data("prevIndex"),38==c.keyCode?(o.options.liveSearch&&e--,e!=j&&e>i&&(e=i),e<g&&(e=g),e==k&&(e=h)):40==c.keyCode&&(o.options.liveSearch&&e++,e==-1&&(e=0),e!=j&&e<f&&(e=f),e>h&&(e=h),e==k&&(e=g)),m.data("prevIndex",e),o.options.liveSearch?(c.preventDefault(),m.hasClass("dropdown-toggle")||(d.removeClass("active").eq(e).addClass("active").children("a").focus(),m.focus())):d.eq(e).children("a").focus();else if(!m.is("input")){var r,s,t=[];d.each(function(){a(this).hasClass("disabled")||a.trim(a(this).children("a").text().toLowerCase()).substring(0,1)==q[c.keyCode]&&t.push(a(this).index())}),r=a(document).data("keycount"),r++,a(document).data("keycount",r),s=a.trim(a(":focus").text().toLowerCase()).substring(0,1),s!=q[c.keyCode]?(r=1,a(document).data("keycount",r)):r>=t.length&&(a(document).data("keycount",0),r>t.length&&(r=1)),d.eq(t[r-1]).children("a").focus()}if((/(13|32)/.test(c.keyCode.toString(10))||/(^9$)/.test(c.keyCode.toString(10))&&o.options.selectOnTab)&&l){if(/(32)/.test(c.keyCode.toString(10))||c.preventDefault(),o.options.liveSearch)/(32)/.test(c.keyCode.toString(10))||(o.$menuInner.find(".active a").click(),
m.focus());else{var u=a(":focus");u.click(),u.focus(),c.preventDefault(),a(document).data("spaceSelect",!0)}a(document).data("keycount",0)}(/(^9$|27)/.test(c.keyCode.toString(10))&&l&&(o.multiple||o.options.liveSearch)||/(27)/.test(c.keyCode.toString(10))&&!l)&&(o.$menu.parent().removeClass("open"),o.options.container&&o.$newElement.removeClass("open"),o.$button.focus())}},mobile:function(){this.$element.addClass("mobile-device")},refresh:function(){this.$lis=null,this.liObj={},this.reloadLi(),this.render(),this.checkDisabled(),this.liHeight(!0),this.setStyle(),this.setWidth(),this.$lis&&this.$searchbox.trigger("propertychange"),this.$element.trigger("refreshed.bs.select")},hide:function(){this.$newElement.hide()},show:function(){this.$newElement.show()},remove:function(){this.$newElement.remove(),this.$element.remove()},destroy:function(){this.$newElement.before(this.$element).remove(),this.$bsContainer?this.$bsContainer.remove():this.$menu.remove(),this.$element.off(".bs.select").removeData("selectpicker").removeClass("bs-select-hidden selectpicker")}};var l=a.fn.selectpicker;a.fn.selectpicker=c,a.fn.selectpicker.Constructor=k,a.fn.selectpicker.noConflict=function(){return a.fn.selectpicker=l,this},a(document).data("keycount",0).on("keydown.bs.select",'.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input',k.prototype.keydown).on("focusin.modal",'.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="listbox"], .bs-searchbox input',function(a){a.stopPropagation()}),a(window).on("load.bs.select.data-api",function(){a(".selectpicker").each(function(){var b=a(this);c.call(b,b.data())})})}(a)});
//# sourceMappingURL=bootstrap-select.js.map
/** Trumbowyg v2.5.0 - A lightweight WYSIWYG editor - alex-d.github.io/Trumbowyg - License MIT - Author : Alexandre Demode (Alex-D) / alex-d.fr */
jQuery.trumbowyg={langs:{en:{viewHTML:"View HTML",undo:"Undo",redo:"Redo",formatting:"Formatting",p:"Paragraph",blockquote:"Quote",code:"Code",header:"Header",bold:"Bold",italic:"Italic",strikethrough:"Stroke",underline:"Underline",strong:"Strong",em:"Emphasis",del:"Deleted",superscript:"Superscript",subscript:"Subscript",unorderedList:"Unordered list",orderedList:"Ordered list",insertImage:"Insert Image",link:"Link",createLink:"Insert link",unlink:"Remove link",justifyLeft:"Align Left",justifyCenter:"Align Center",justifyRight:"Align Right",justifyFull:"Align Justify",horizontalRule:"Insert horizontal rule",removeformat:"Remove format",fullscreen:"Fullscreen",close:"Close",submit:"Confirm",reset:"Cancel",required:"Required",description:"Description",title:"Title",text:"Text",target:"Target"}},plugins:{},svgPath:null,hideButtonTexts:null},function(e,t,n,a){"use strict";a.fn.trumbowyg=function(e,t){var n="trumbowyg";if(e===Object(e)||!e)return this.each(function(){a(this).data(n)||a(this).data(n,new o(this,e))});if(1===this.length)try{var r=a(this).data(n);switch(e){case"execCmd":return r.execCmd(t.cmd,t.param,t.forceCss);case"openModal":return r.openModal(t.title,t.content);case"closeModal":return r.closeModal();case"openModalInsert":return r.openModalInsert(t.title,t.fields,t.callback);case"saveRange":return r.saveRange();case"getRange":return r.range;case"getRangeText":return r.getRangeText();case"restoreRange":return r.restoreRange();case"enable":return r.toggleDisable(!1);case"disable":return r.toggleDisable(!0);case"destroy":return r.destroy();case"empty":return r.empty();case"html":return r.html(t)}}catch(i){}return!1};var o=function(e,o){var r=this,i="trumbowyg-icons";r.doc=e.ownerDocument||n,r.$ta=a(e),r.$c=a(e),o=o||{},null!=o.lang||null!=a.trumbowyg.langs[o.lang]?r.lang=a.extend(!0,{},a.trumbowyg.langs.en,a.trumbowyg.langs[o.lang]):r.lang=a.trumbowyg.langs.en,r.hideButtonTexts=null!=a.trumbowyg.hideButtonTexts?a.trumbowyg.hideButtonTexts:o.hideButtonTexts;var s=null!=a.trumbowyg.svgPath?a.trumbowyg.svgPath:o.svgPath;if(r.hasSvg=s!==!1,r.svgPath=r.doc.querySelector("base")?t.location.href.split("#")[0]:"",0===a("#"+i,r.doc).length&&s!==!1){if(null==s)try{throw new Error}catch(l){var d=l.stack.split("\n");for(var c in d)if(d[c].match(/http[s]?:\/\//)){s=d[Number(c)].match(/((http[s]?:\/\/.+\/)([^\/]+\.js))(\?.*)?:/)[1].split("/"),s.pop(),s=s.join("/")+"/ui/icons.svg";break}}var u=r.doc.createElement("div");u.id=i,r.doc.body.insertBefore(u,r.doc.body.childNodes[0]),a.ajax({async:!0,type:"GET",contentType:"application/x-www-form-urlencoded; charset=UTF-8",dataType:"xml",url:s,data:null,beforeSend:null,complete:null,success:function(e){u.innerHTML=(new XMLSerializer).serializeToString(e.documentElement)}})}var g=r.lang.header,f=function(){return(t.chrome||t.Intl&&Intl.v8BreakIterator)&&"CSS"in t};r.btnsDef={viewHTML:{fn:"toggle"},undo:{isSupported:f,key:"Z"},redo:{isSupported:f,key:"Y"},p:{fn:"formatBlock"},blockquote:{fn:"formatBlock"},h1:{fn:"formatBlock",title:g+" 1"},h2:{fn:"formatBlock",title:g+" 2"},h3:{fn:"formatBlock",title:g+" 3"},h4:{fn:"formatBlock",title:g+" 4"},subscript:{tag:"sub"},superscript:{tag:"sup"},bold:{key:"B",tag:"b"},italic:{key:"I",tag:"i"},underline:{tag:"u"},strikethrough:{tag:"strike"},strong:{fn:"bold",key:"B"},em:{fn:"italic",key:"I"},del:{fn:"strikethrough"},createLink:{key:"K",tag:"a"},unlink:{},insertImage:{},justifyLeft:{tag:"left",forceCss:!0},justifyCenter:{tag:"center",forceCss:!0},justifyRight:{tag:"right",forceCss:!0},justifyFull:{tag:"justify",forceCss:!0},unorderedList:{fn:"insertUnorderedList",tag:"ul"},orderedList:{fn:"insertOrderedList",tag:"ol"},horizontalRule:{fn:"insertHorizontalRule"},removeformat:{},fullscreen:{"class":"trumbowyg-not-disable"},close:{fn:"destroy","class":"trumbowyg-not-disable"},formatting:{dropdown:["p","blockquote","h1","h2","h3","h4"],ico:"p"},link:{dropdown:["createLink","unlink"]}},r.o=a.extend(!0,{},{lang:"en",useComposition:!0,fixedBtnPane:!1,fixedFullWidth:!1,autogrow:!1,prefix:"trumbowyg-",semantic:!0,resetCss:!1,removeformatPasted:!1,tagsToRemove:[],btnsGrps:{design:["bold","italic","underline","strikethrough"],semantic:["strong","em","del"],justify:["justifyLeft","justifyCenter","justifyRight","justifyFull"],lists:["unorderedList","orderedList"]},btns:[["viewHTML"],["undo","redo"],["formatting"],"btnGrp-semantic",["superscript","subscript"],["link"],["insertImage"],"btnGrp-justify","btnGrp-lists",["horizontalRule"],["removeformat"],["fullscreen"]],btnsDef:{},inlineElementsSelector:"a,abbr,acronym,b,caption,cite,code,col,dfn,dir,dt,dd,em,font,hr,i,kbd,li,q,span,strikeout,strong,sub,sup,u",pasteHandlers:[],imgDblClickHandler:function(){var e=a(this),t=e.attr("src"),n="(Base64)";return 0===t.indexOf("data:image")&&(t=n),r.openModalInsert(r.lang.insertImage,{url:{label:"URL",value:t,required:!0},alt:{label:r.lang.description,value:e.attr("alt")}},function(t){return t.src!==n&&e.attr({src:t.src}),e.attr({alt:t.alt}),!0}),!1},plugins:{}},o),r.disabled=r.o.disabled||"TEXTAREA"===e.nodeName&&e.disabled,o.btns?r.o.btns=o.btns:r.o.semantic||(r.o.btns[4]="btnGrp-design"),a.each(r.o.btnsDef,function(e,t){r.addBtnDef(e,t)}),r.eventNamespace="trumbowyg-event",r.keys=[],r.tagToButton={},r.tagHandlers=[],r.pasteHandlers=[].concat(r.o.pasteHandlers),r.init()};o.prototype={init:function(){var e=this;e.height=e.$ta.height(),e.initPlugins();try{e.doc.execCommand("enableObjectResizing",!1,!1),e.doc.execCommand("defaultParagraphSeparator",!1,"p")}catch(t){}e.buildEditor(),e.buildBtnPane(),e.fixedBtnPaneEvents(),e.buildOverlay(),setTimeout(function(){e.disabled&&e.toggleDisable(!0),e.$c.trigger("tbwinit")})},addBtnDef:function(e,t){this.btnsDef[e]=t},buildEditor:function(){var n=this,o=n.o.prefix,r="";n.$box=a("<div/>",{"class":o+"box "+o+"editor-visible "+o+n.o.lang+" trumbowyg"}),n.isTextarea=n.$ta.is("textarea"),n.isTextarea?(r=n.$ta.val(),n.$ed=a("<div/>"),n.$box.insertAfter(n.$ta).append(n.$ed,n.$ta)):(n.$ed=n.$ta,r=n.$ed.html(),n.$ta=a("<textarea/>",{name:n.$ta.attr("id"),height:n.height}).val(r),n.$box.insertAfter(n.$ed).append(n.$ta,n.$ed),n.syncCode()),n.$ta.addClass(o+"textarea").attr("tabindex",-1),n.$ed.addClass(o+"editor").attr({contenteditable:!0,dir:n.lang._dir||"ltr"}).html(r),n.o.tabindex&&n.$ed.attr("tabindex",n.o.tabindex),n.$c.is("[placeholder]")&&n.$ed.attr("placeholder",n.$c.attr("placeholder")),n.o.resetCss&&n.$ed.addClass(o+"reset-css"),n.o.autogrow||n.$ta.add(n.$ed).css({height:n.height}),n.semanticCode();var i,s=!1,l=!1,d=!!e.userAgent.match(/Android/i);n.$ed.on("dblclick","img",n.o.imgDblClickHandler).on("keydown",function(e){if(l=n.o.useComposition&&!d&&229===e.which,e.ctrlKey){s=!0;var t=n.keys[String.fromCharCode(e.which).toUpperCase()];try{return n.execCmd(t.fn,t.param),!1}catch(a){}}}).on("input",function(e){n.semanticCode(!1,!0),n.$c.trigger("tbwchange")}).on("keyup",function(e){var t=e.which;!d||t&&229!==t||(t=this.textContent.charCodeAt(this.textContent.length-1)),t>=37&&40>=t||(!e.ctrlKey||89!==t&&90!==t?s||17===t||l?"undefined"==typeof e.which&&l&&n.semanticCode(!1,!1,!0):(n.semanticCode(!1,13===t),n.$c.trigger("tbwchange")):n.$c.trigger("tbwchange"),setTimeout(function(){s=!1},200))}).on("mouseup keydown keyup",function(){clearTimeout(i),i=setTimeout(function(){n.updateButtonPaneStatus()},50)}).on("focus blur",function(e){n.$c.trigger("tbw"+e.type),"blur"===e.type&&a("."+o+"active-button",n.$btnPane).removeClass(o+"active-button "+o+"active")}).on("cut",function(){setTimeout(function(){n.semanticCode(!1,!0),n.$c.trigger("tbwchange")},0)}).on("paste",function(e){if(n.o.removeformatPasted){e.preventDefault();try{var o=t.clipboardData.getData("Text");try{n.doc.selection.createRange().pasteHTML(o)}catch(r){n.doc.getSelection().getRangeAt(0).insertNode(n.doc.createTextNode(o))}}catch(i){n.execCmd("insertText",(e.originalEvent||e).clipboardData.getData("text/plain"))}}a.each(n.pasteHandlers,function(t,n){n(e)}),setTimeout(function(){n.semanticCode(!1,!0),n.$c.trigger("tbwpaste",e)},0)}),n.$ta.on("keyup paste",function(){n.$c.trigger("tbwchange")}),n.$box.on("keydown",function(e){return 27===e.which&&1===a("."+o+"modal-box",n.$box).length?(n.closeModal(),!1):void 0})},buildBtnPane:function(){var e=this,t=e.o.prefix,n=e.$btnPane=a("<div/>",{"class":t+"button-pane"});a.each(e.o.btns,function(o,r){try{var i=r.split("btnGrp-");null!=i[1]&&(r=e.o.btnsGrps[i[1]])}catch(s){}a.isArray(r)||(r=[r]);var l=a("<div/>",{"class":t+"button-group "+(r.indexOf("fullscreen")>=0?t+"right":"")});a.each(r,function(t,n){try{var a;e.isSupportedBtn(n)&&(a=e.buildBtn(n)),l.append(a)}catch(o){}}),n.append(l)}),e.$box.prepend(n)},buildBtn:function(e){var t=this,n=t.o.prefix,o=t.btnsDef[e],r=o.dropdown,i=null!=o.hasIcon?o.hasIcon:!0,s=t.lang[e]||e,l=a("<button/>",{type:"button","class":n+e+"-button "+(o["class"]||"")+(i?"":" "+n+"textual-button"),html:t.hasSvg&&i?'<svg><use xlink:href="'+t.svgPath+"#"+n+(o.ico||e).replace(/([A-Z]+)/g,"-$1").toLowerCase()+'"/></svg>':t.hideButtonTexts?"":o.text||o.title||t.lang[e]||e,title:(o.title||o.text||s)+(o.key?" (Ctrl + "+o.key+")":""),tabindex:-1,mousedown:function(){return(!r||a("."+e+"-"+n+"dropdown",t.$box).is(":hidden"))&&a("body",t.doc).trigger("mousedown"),!t.$btnPane.hasClass(n+"disable")||a(this).hasClass(n+"active")||a(this).hasClass(n+"not-disable")?(t.execCmd((r?"dropdown":!1)||o.fn||e,o.param||e,o.forceCss||!1),!1):!1}});if(r){l.addClass(n+"open-dropdown");var d=n+"dropdown",c=a("<div/>",{"class":d+"-"+e+" "+d+" "+n+"fixed-top","data-dropdown":e});a.each(r,function(e,n){t.btnsDef[n]&&t.isSupportedBtn(n)&&c.append(t.buildSubBtn(n))}),t.$box.append(c.hide())}else o.key&&(t.keys[o.key]={fn:o.fn||e,param:o.param||e});return r||(t.tagToButton[(o.tag||e).toLowerCase()]=e),l},buildSubBtn:function(e){var t=this,n=t.o.prefix,o=t.btnsDef[e],r=null!=o.hasIcon?o.hasIcon:!0;return o.key&&(t.keys[o.key]={fn:o.fn||e,param:o.param||e}),t.tagToButton[(o.tag||e).toLowerCase()]=e,a("<button/>",{type:"button","class":n+e+"-dropdown-button"+(o.ico?" "+n+o.ico+"-button":""),html:t.hasSvg&&r?'<svg><use xlink:href="'+t.svgPath+"#"+n+(o.ico||e).replace(/([A-Z]+)/g,"-$1").toLowerCase()+'"/></svg>'+(o.text||o.title||t.lang[e]||e):o.text||o.title||t.lang[e]||e,title:o.key?" (Ctrl + "+o.key+")":null,style:o.style||null,mousedown:function(){return a("body",t.doc).trigger("mousedown"),t.execCmd(o.fn||e,o.param||e,o.forceCss||!1),!1}})},isSupportedBtn:function(e){try{return this.btnsDef[e].isSupported()}catch(t){}return!0},buildOverlay:function(){var e=this;return e.$overlay=a("<div/>",{"class":e.o.prefix+"overlay"}).css({top:e.$btnPane.outerHeight(),height:e.$ed.outerHeight()+1+"px"}).appendTo(e.$box),e.$overlay},showOverlay:function(){var e=this;a(t).trigger("scroll"),e.$overlay.fadeIn(200),e.$box.addClass(e.o.prefix+"box-blur")},hideOverlay:function(){var e=this;e.$overlay.fadeOut(50),e.$box.removeClass(e.o.prefix+"box-blur")},fixedBtnPaneEvents:function(){var e=this,n=e.o.fixedFullWidth,o=e.$box;e.o.fixedBtnPane&&(e.isFixed=!1,a(t).on("scroll."+e.eventNamespace+" resize."+e.eventNamespace,function(){if(o){e.syncCode();var r=a(t).scrollTop(),i=o.offset().top+1,s=e.$btnPane,l=s.outerHeight()-2;r-i>0&&r-i-e.height<0?(e.isFixed||(e.isFixed=!0,s.css({position:"fixed",top:0,left:n?"0":"auto",zIndex:7}),a([e.$ta,e.$ed]).css({marginTop:s.height()})),s.css({width:n?"100%":o.width()-1+"px"}),a("."+e.o.prefix+"fixed-top",o).css({position:n?"fixed":"absolute",top:n?l:l+(r-i)+"px",zIndex:15})):e.isFixed&&(e.isFixed=!1,s.removeAttr("style"),a([e.$ta,e.$ed]).css({marginTop:0}),a("."+e.o.prefix+"fixed-top",o).css({position:"absolute",top:l}))}}))},toggleDisable:function(e){var t=this,n=t.o.prefix;t.disabled=e,e?t.$ta.attr("disabled",!0):t.$ta.removeAttr("disabled"),t.$box.toggleClass(n+"disabled",e),t.$ed.attr("contenteditable",!e)},destroy:function(){var e=this,n=e.o.prefix,o=e.height;e.isTextarea?e.$box.after(e.$ta.css({height:o}).val(e.html()).removeClass(n+"textarea").show()):e.$box.after(e.$ed.css({height:o}).removeClass(n+"editor").removeAttr("contenteditable").html(e.html()).show()),e.$ed.off("dblclick","img"),e.destroyPlugins(),e.$box.remove(),e.$c.removeData("trumbowyg"),a("body").removeClass(n+"body-fullscreen"),e.$c.trigger("tbwclose"),a(t).off("scroll."+e.eventNamespace+" resize."+e.eventNamespace)},empty:function(){this.$ta.val(""),this.syncCode(!0)},toggle:function(){var e=this,t=e.o.prefix;e.semanticCode(!1,!0),setTimeout(function(){e.doc.activeElement.blur(),e.$box.toggleClass(t+"editor-hidden "+t+"editor-visible"),e.$btnPane.toggleClass(t+"disable"),a("."+t+"viewHTML-button",e.$btnPane).toggleClass(t+"active"),e.$box.hasClass(t+"editor-visible")?e.$ta.attr("tabindex",-1):e.$ta.removeAttr("tabindex")},0)},dropdown:function(e){var n=this,o=n.doc,r=n.o.prefix,i=a("[data-dropdown="+e+"]",n.$box),s=a("."+r+e+"-button",n.$btnPane),l=i.is(":hidden");if(a("body",o).trigger("mousedown"),l){var d=s.offset().left;s.addClass(r+"active"),i.css({position:"absolute",top:s.offset().top-n.$btnPane.offset().top+s.outerHeight(),left:n.o.fixedFullWidth&&n.isFixed?d+"px":d-n.$btnPane.offset().left+"px"}).show(),a(t).trigger("scroll"),a("body",o).on("mousedown."+n.eventNamespace,function(e){i.is(e.target)||(a("."+r+"dropdown",o).hide(),a("."+r+"active",o).removeClass(r+"active"),a("body",o).off("mousedown."+n.eventNamespace))})}},html:function(e){var t=this;return null!=e?(t.$ta.val(e),t.syncCode(!0),t):t.$ta.val()},syncTextarea:function(){var e=this;e.$ta.val(e.$ed.text().trim().length>0||e.$ed.find("hr,img,embed,iframe,input").length>0?e.$ed.html():"")},syncCode:function(e){var t=this;!e&&t.$ed.is(":visible")?t.syncTextarea():t.$ed.html(t.$ta.val()),t.o.autogrow&&(t.height=t.$ed.height(),t.height!==t.$ta.css("height")&&(t.$ta.css({height:t.height}),t.$c.trigger("tbwresize")))},semanticCode:function(e,t,n){var o=this;if(o.saveRange(),o.syncCode(e),a(o.o.tagsToRemove.join(","),o.$ed).remove(),o.o.semantic){if(o.semanticTag("b","strong"),o.semanticTag("i","em"),t){var r=o.o.inlineElementsSelector,i=":not("+r+")";o.$ed.contents().filter(function(){return 3===this.nodeType&&this.nodeValue.trim().length>0}).wrap("<span data-tbw/>");var s=function(e){if(0!==e.length){var t=e.nextUntil(i).addBack().wrapAll("<p/>").parent(),n=t.nextAll(r).first();t.next("br").remove(),s(n)}};s(o.$ed.children(r).first()),o.semanticTag("div","p",!0),o.$ed.find("p").filter(function(){return o.range&&this===o.range.startContainer?!1:0===a(this).text().trim().length&&0===a(this).children().not("br,span").length}).contents().unwrap(),a("[data-tbw]",o.$ed).contents().unwrap(),o.$ed.find("p:empty").remove()}n||o.restoreRange(),o.syncTextarea()}},semanticTag:function(e,t,n){a(e,this.$ed).each(function(){var e=a(this);e.wrap("<"+t+"/>"),n&&a.each(e.prop("attributes"),function(){e.parent().attr(this.name,this.value)}),e.contents().unwrap()})},createLink:function(){for(var e,t,n,o=this,r=o.doc.getSelection(),i=r.focusNode;["A","DIV"].indexOf(i.nodeName)<0;)i=i.parentNode;if(i&&"A"===i.nodeName){var s=a(i);e=s.attr("href"),t=s.attr("title"),n=s.attr("target");var l=o.doc.createRange();l.selectNode(i),r.addRange(l)}o.saveRange(),o.openModalInsert(o.lang.createLink,{url:{label:"URL",required:!0,value:e},title:{label:o.lang.title,value:t},text:{label:o.lang.text,value:o.getRangeText()},target:{label:o.lang.target,value:n}},function(e){var t=a(['<a href="',e.url,'">',e.text,"</a>"].join(""));return e.title.length>0&&t.attr("title",e.title),e.target.length>0&&t.attr("target",e.target),o.range.deleteContents(),o.range.insertNode(t[0]),!0})},unlink:function(){var e=this,t=e.doc.getSelection(),n=t.focusNode;if(t.isCollapsed){for(;["A","DIV"].indexOf(n.nodeName)<0;)n=n.parentNode;if(n&&"A"===n.nodeName){var a=e.doc.createRange();a.selectNode(n),t.addRange(a)}}e.execCmd("unlink",void 0,void 0,!0)},insertImage:function(){var e=this;e.saveRange(),e.openModalInsert(e.lang.insertImage,{url:{label:"URL",required:!0},alt:{label:e.lang.description,value:e.getRangeText()}},function(t){return e.execCmd("insertImage",t.url),a('img[src="'+t.url+'"]:not([alt])',e.$box).attr("alt",t.alt),!0})},fullscreen:function(){var e,n=this,o=n.o.prefix,r=o+"fullscreen";n.$box.toggleClass(r),e=n.$box.hasClass(r),a("body").toggleClass(o+"body-fullscreen",e),a(t).trigger("scroll"),n.$c.trigger("tbw"+(e?"open":"close")+"fullscreen")},execCmd:function(t,n,a,o){var r=this;o=!!o||"","dropdown"!==t&&r.$ed.focus();try{r.doc.execCommand("styleWithCSS",!1,a||!1)}catch(i){}try{r[t+o](n)}catch(i){try{t(n)}catch(s){"insertHorizontalRule"===t?n=void 0:"formatBlock"!==t||-1===e.userAgent.indexOf("MSIE")&&-1===e.appVersion.indexOf("Trident/")||(n="<"+n+">"),r.doc.execCommand(t,!1,n),r.syncCode(),r.semanticCode(!1,!0)}"dropdown"!==t&&(r.updateButtonPaneStatus(),r.$c.trigger("tbwchange"))}},openModal:function(e,n){var o=this,r=o.o.prefix;if(a("."+r+"modal-box",o.$box).length>0)return!1;o.saveRange(),o.showOverlay(),o.$btnPane.addClass(r+"disable");var i=a("<div/>",{"class":r+"modal "+r+"fixed-top"}).css({top:o.$btnPane.height()}).appendTo(o.$box);o.$overlay.one("click",function(){return i.trigger("tbwcancel"),!1});var s=a("<form/>",{action:"",html:n}).on("submit",function(){return i.trigger("tbwconfirm"),!1}).on("reset",function(){return i.trigger("tbwcancel"),!1}),l=a("<div/>",{"class":r+"modal-box",html:s}).css({top:"-"+o.$btnPane.outerHeight()+"px",opacity:0}).appendTo(i).animate({top:0,opacity:1},100);return a("<span/>",{text:e,"class":r+"modal-title"}).prependTo(l),i.height(l.outerHeight()+10),a("input:first",l).focus(),o.buildModalBtn("submit",l),o.buildModalBtn("reset",l),a(t).trigger("scroll"),i},buildModalBtn:function(e,t){var n=this,o=n.o.prefix;return a("<button/>",{"class":o+"modal-button "+o+"modal-"+e,type:e,text:n.lang[e]||e}).appendTo(a("form",t))},closeModal:function(){var e=this,t=e.o.prefix;e.$btnPane.removeClass(t+"disable"),e.$overlay.off();var n=a("."+t+"modal-box",e.$box);n.animate({top:"-"+n.height()},100,function(){n.parent().remove(),e.hideOverlay()}),e.restoreRange()},openModalInsert:function(e,t,n){var o=this,r=o.o.prefix,i=o.lang,s="",l="tbwconfirm";return a.each(t,function(e,t){var n=t.label,a=t.name||e,o=t.attributes||{},l=Object.keys(o).map(function(e){return e+'="'+o[e]+'"'}).join(" ");s+='<label><input type="'+(t.type||"text")+'" name="'+a+'" value="'+(t.value||"").replace(/"/g,"&quot;")+'"'+l+'><span class="'+r+'input-infos"><span>'+(n?i[n]?i[n]:n:i[e]?i[e]:e)+"</span></span></label>"}),o.openModal(e,s).on(l,function(){var e=a("form",a(this)),r=!0,i={};a.each(t,function(t,n){var s=a('input[name="'+t+'"]',e),l=s.attr("type");"checkbox"===l.toLowerCase()?i[t]=s.is(":checked"):i[t]=a.trim(s.val()),n.required&&""===i[t]?(r=!1,o.addErrorOnModalField(s,o.lang.required)):n.pattern&&!n.pattern.test(i[t])&&(r=!1,o.addErrorOnModalField(s,n.patternError))}),r&&(o.restoreRange(),n(i,t)&&(o.syncCode(),o.$c.trigger("tbwchange"),o.closeModal(),a(this).off(l)))}).one("tbwcancel",function(){a(this).off(l),o.closeModal()})},addErrorOnModalField:function(e,t){var n=this.o.prefix,o=e.parent();e.on("change keyup",function(){o.removeClass(n+"input-error")}),o.addClass(n+"input-error").find("input+span").append(a("<span/>",{"class":n+"msg-error",text:t}))},saveRange:function(){var e=this,t=e.doc.getSelection();if(e.range=null,t.rangeCount){var n,a=e.range=t.getRangeAt(0),o=e.doc.createRange();o.selectNodeContents(e.$ed[0]),o.setEnd(a.startContainer,a.startOffset),n=(o+"").length,e.metaRange={start:n,end:n+(a+"").length}}},restoreRange:function(){var e,t=this,n=t.metaRange,a=t.range,o=t.doc.getSelection();if(a){if(n&&n.start!==n.end){var r,i=0,s=[t.$ed[0]],l=!1,d=!1;for(e=t.doc.createRange();!d&&(r=s.pop());)if(3===r.nodeType){var c=i+r.length;!l&&n.start>=i&&n.start<=c&&(e.setStart(r,n.start-i),l=!0),l&&n.end>=i&&n.end<=c&&(e.setEnd(r,n.end-i),d=!0),i=c}else for(var u=r.childNodes,g=u.length;g>0;)g-=1,s.push(u[g])}o.removeAllRanges(),o.addRange(e||a)}},getRangeText:function(){return this.range+""},updateButtonPaneStatus:function(){var e=this,t=e.o.prefix,n=e.getTagsRecursive(e.doc.getSelection().focusNode),o=t+"active-button "+t+"active";a("."+t+"active-button",e.$btnPane).removeClass(o),a.each(n,function(n,r){var i=e.tagToButton[r.toLowerCase()],s=a("."+t+i+"-button",e.$btnPane);if(s.length>0)s.addClass(o);else try{s=a("."+t+"dropdown ."+t+i+"-dropdown-button",e.$box);var l=s.parent().data("dropdown");a("."+t+l+"-button",e.$box).addClass(o)}catch(d){}})},getTagsRecursive:function(e,t){var n=this;if(t=t||[],!e||!e.parentNode)return t;e=e.parentNode;var o=e.tagName;return"DIV"===o?t:("P"===o&&""!==e.style.textAlign&&t.push(e.style.textAlign),a.each(n.tagHandlers,function(a,o){t=t.concat(o(e,n))}),t.push(o),n.getTagsRecursive(e,t))},initPlugins:function(){var e=this;e.loadedPlugins=[],a.each(a.trumbowyg.plugins,function(t,n){(!n.shouldInit||n.shouldInit(e))&&(n.init(e),n.tagHandler&&e.tagHandlers.push(n.tagHandler),e.loadedPlugins.push(n))})},destroyPlugins:function(){a.each(this.loadedPlugins,function(e,t){t.destroy&&t.destroy()})}}}(navigator,window,document,jQuery);
var BootstrapModalAlerts = (function($){
	this.ops = {
		title: "Alert"
	};

	this.$modal = 
	$('<div class="modal fade" id="bsModalAlert" tabindex="-1" role="dialog" aria-labelledby="bsModalAlertLabel" aria-hidden="true">' +
	'  <div class="modal-dialog" role="document">' +
	'    <div class="modal-content">' +
	'      <div class="modal-header">' +
	'        <h5 class="modal-title" id="bsModalAlertLabel"></h5>' +
	'        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
	'          <span aria-hidden="true">&times;</span>' +
	'        </button>' +
	'      </div>' +
	'      <div class="modal-body">' +
	'      </div>' +
	'      <div class="modal-footer">' +
	'        <button type="button" class="btn btn-secondary" data-dismiss="modal" data-fn_value="0">Cancel</button>' +
	'        <button type="button" class="btn btn-primary alert-confirm" data-dismiss="modal" data-fn_value="1">OK</button>' +
	'     </div>' +
	'    </div>' +
	'  </div>' +
	'</div>');
	
	this.alert = function(message, ops, fn)
	{
		return this.confirm(message, ops, fn, true);
	};

	this.confirm = function(message, ops, fn, okOnly)
	{
		var _self = this,
		localOps = $.extend({}, this.ops, ops),
		$localModal = this.$modal.clone();

		$(".modal-body", $localModal).html(message);
		$(".modal-title", $localModal).html(localOps.title);
		if(okOnly)
		{
			$(".btn-secondary", $localModal).remove();
		}

		$localModal.appendTo("body");

		if('function' == typeof fn)
		{
			$(".btn", $localModal).on("click", function(e){
				fn.call(this, e, $(this).attr("data-fn_value")/1, _self);
			});
		}
		$localModal.modal('show');
		return true;
	};
	return this;
})(jQuery);
$(function () {
  var $logout =   $('#logout');

  $logout.popover({
    title: 'Are you sure?',
    content: '<div class="btn-group btn-group-sm" role="group" aria-label="Confirm logout">' +
    '<a class="btn btn-secondary btn-success logout-confirm" href="/logout">Yes</a>' +
    '<a class="btn btn-secondary btn-warning" href="#">No</a>' +
    '</div>',
    html: true,
    placement: 'bottom',
    trigger: 'click'
  });

  var hidePopoverFn = function () {
    $logout.popover('hide');
  };
  $logout.on('hide.bs.popover', function () {
    $(document).off("click", hidePopoverFn);
  }).on('shown.bs.popover', function () {
    $(document).on("click", hidePopoverFn);
    $(".logout-confirm").on("click", function (e) {
      e.stopPropagation();
    });
  });
});

function AjaxInput($input, id, entity)
{
	var _self = this;
	this.$input = $input;
	this.id = id;
	this.lastValue = {
		submitted: this.getInputValue(),
		saved: this.getInputValue()
	};
	this.error = {
		current: false,
		message: null
	};
	if(!entity)
	{
		entity = 'node';
	}
	this.entity = entity;

	var inputChangeFn = function(e){
		if(!_self.$input.is(":disabled"))
		{
			_self.update(e.type);
		}
	};
	if(typeof this.$input.attr("data-update_events") != 'undefined')
	{
		this.$input.on(this.$input.attr("data-update_events"), inputChangeFn);
		this.$input.on("keypress", function()
		{
			setNotSaved();
		});
	}
	else
	{
		if(this.$input.is("select") || this.$input.is("[type=checkbox]"))
		{
			this.$input.on("change", inputChangeFn);
		}
		else
		{
			this.$input.on("keyup blur", inputChangeFn);
		}
	}
}
AjaxInput.prototype.getColumn = function()
{
	return this.$input.attr("data-column");
};
AjaxInput.prototype.loadEntity = function(id, nodeID)
{
	this.id = id;
	var nodeData = NodeManager.get(nodeID).nodeData;
	switch(this.entity)
	{
		case "node":
			this.setInputValue(nodeData[this.getColumn()]);
			this.bindUpdatedData();
		break;

		case "question":
			if(nodeData.questions.length > 0)
				this.setInputValue(nodeData.questions[0][this.getColumn()]);
		break;

		// does not need to load data dynamically, we create new inputs for new data - we don't load it in again and overwrite
		case "answer":
		break;
	}
	this.lastValue = {
		submitted: this.getInputValue(),
		saved: this.getInputValue()
	};
};
AjaxInput.prototype.update = function(etype){
	var _self = this,
	data = {};
	// only update changed values
	var currentValue = this.getInputValue();
	if(currentValue!==this.lastValue.submitted)
	{
		if(currentValue == this.lastValue.saved)
		{
			// last saved value means it must have validated properly before, just remove error notices - do not submit
			this.error.current = false;
			this.setError(false);
			//setSaved();
			//return;
		}

		this.lastValue.submitted = currentValue;
		var column = this.getColumn();
		data[column] = this.lastValue.submitted;

		var successFn = function(entityData){
			var Node;
			switch(_self.entity)
			{
				case "node":
					Node = NodeManager.get(_self.id);
					Node.nodeData = entityData;
					_self.bindUpdatedData.call(_self);
					if(column === 'videoUrl' && SidePanel.selectedNodeID === _self.id)
					{
						SidePanel.updateMedia();
					}
					if(column === 'live')
					{
						Node.updatePageStatus();
					}
				break;

				case "question":
					var questionData = entityData;
					Node = NodeManager.get(questionData.page.id);
					Node.nodeData.questions[0] = questionData;
				break;

				case "answer":
					var answerData = entityData;
					Node = NodeManager.get(answerData.question.page.id);
					$.each(Node.nodeData.questions[0].answerOptions, function(key)
					{
						if(this.id === answerData.id)
						{
							Node.nodeData.questions[0].answerOptions[key] = answerData;
							return false;
						}
					});
				break;
			}
			_self.lastValue.saved = currentValue;
		};
		//console.log("UPDATE: ", data);
		var ms = etype==='blur' || etype==='change' ? 1 : null,
		baseURL = (this.entity==='node' ? ajax.updateNode.url : (this.entity=='question' ? ajax.updateQuestion.url : ajax.updateAnswer.url));
		ajax.updateNode.submit(data, baseURL + this.id, ms, { 
			input: _self,
			successFn: successFn
		});
	}
};
AjaxInput.prototype.bindUpdatedData = function()
{
	var _self = this,
	col = this.getColumn(),
	newInputValue = _self.getInputValue();
	$.each(AjaxManager.findInputs(this.id, col), function()
	{
		var foundAI = this;
		if(_self.$input[0]!==foundAI.$input[0])
		{
			// input that matches and is not this one, bind the data
			foundAI.setInputValue(newInputValue);
		}
	});

	// bind to goto links if name column
	if(col==='name')
	{
		$("[data-gotoid="+_self.id+"][data-column='name']").val(newInputValue);
	}
};
AjaxInput.prototype.setInputValue = function(value)
{
	if(this.$input.attr("type")==='checkbox')
	{
		this.$input.prop("checked", value).trigger("change");
	}
	else if(this.$input.is("div"))
	{
		this.$input.trumbowyg('html', value === null ? '' : value);
	}
	else if(this.$input.is("select")){
		this.$input.selectpicker('val', value);
		this.$input.trigger("change");
	}
	else
	{
		this.$input.val(value === null ? '' : value);
	}
};
AjaxInput.prototype.getInputValue = function()
{
	if(this.$input.attr("type")==='checkbox')
	{
		return this.$input.prop("checked");
	}
	else if(this.$input.is("div"))
	{
		return this.$input.trumbowyg('html');
	}
	else
	{
		return this.$input.val();
	}
};
AjaxInput.prototype.setError = function(isError, message)
{
	if(isError)
	{
		if(!this.$input.hasClass("error"))
		{
			this.$input.addClass("error");
		}
	}
	else
	{
		if(this.$input.hasClass("error"))
		{
			this.$input.removeClass("error");
		}
	}
	this.error.current = isError;
	this.error.message = message;
};
// Ajax Object
function AjaxRequest(url, ops)
{
	// private - localised to the request
	var currentRequests = {},
	prv = {
		defaultOps: {
			method: 'GET',
			dataType: null,
			contentType: null,
			initFn: null,
			submitFn: null,
			successFn: null,
			errorFn: null,
			data: null,
			uniqueRequest: {
				data: false,
				url: false
			},
			abortable: false,
			debug: false,
			load: false,
			input: null
		}
	};

	// Public vars as AjaxRequest obect is returned by AjaxManager
	this.url = url;
	this.ops = {};
	this.debounceTimer = {};
	$.extend(this.ops, prv.defaultOps, ops);

	// Protected getters and setters
	this.setRequest = function(hash, $a)
	{
		currentRequests[hash] = $a;
	};
	this.getRequest = function(hash)
	{
		return currentRequests[hash];
	};
}
AjaxRequest.prototype.submit = function(data, url, ms, ops){
	var _self = this;

	if(!ops)
	{
		ops = {};
	}

	// Localise set options to this submission
	var localOps = $.extend({}, this.ops, ops);

	// initFn function can be set and can override url and ops
	if(localOps.initFn)
	{
		var initResponse = localOps.initFn.call(this);
		if(typeof initResponse=='object')
		{
			if(initResponse.url)
			{
				url = initResponse.url;
			}
			if(initResponse.ops)
			{
				$.extend(localOps, initResponse.ops);
			}
		}
		else if(false === initResponse)
		{
			if(localOps.debug)
			{
				console.log("initFn cancelled an ajax request", localOps);
			}
			return;
		}
	}

	// data does not need to be submitted, but if contentType json, we will automatically stringify objects
	if(!data)
	{
		data = null;
	}
	else if(typeof data=='object' && localOps.contentType && localOps.contentType.indexOf('application/json')!==-1)
	{
		data = JSON.stringify(data);
	}
	// set private url var to what has been set for this request if exists, or main url if not
	url = url || this.url;
	// now we have final data and url vars, we can create a hash based on what makes the request unique (unique requests cannot cancel each other out)
	var requestHash = hashObj({
		input_id: localOps.input ? localOps.input.$input.attr("id") : null,
		data: localOps.uniqueRequest.data ? data : null,
		url: localOps.uniqueRequest.url ? url : null
	});

	// If this request is not unique to another in process
	var existingRequest = this.getRequest(requestHash);
	if(existingRequest)
	{
		// we will abort the old request if we are able to, or simply not send this request again if not
		if(localOps.abortable)
		{
			existingRequest.abort();
      if(localOps.debug)
      {
        console.log('aborted existing request');
      }
		}
		else
		{
			if(localOps.debug)
			{
				console.warn("Request already in progress and is not abortable");
			}
			// return;
		}
	}

	// setup ajax options
	var ajaxOps = {
		type: localOps.method,
		url: url,
		dataType: localOps.dataType,
		contentType: localOps.contentType,
		data: data || localOps.data,
		success: function(response){
			_self.setRequest(requestHash, undefined);
			_self.ajaxSuccess(localOps, response, this);
		},
		error: function(error, textStatus, errorThrown){
			_self.setRequest(requestHash, undefined);
			_self.ajaxError(localOps, error, textStatus, errorThrown, this);
		}
	};

	// If there has been a function set to be called just before submission
	if(localOps.submitFn)
	{
		var submitFnResponse = localOps.submitFn.call(this);
		if(false === submitFnResponse)
		{
			if(localOps.debug)
			{
				console.log("submitFn cancelled posting the data:", ajaxOps);
			}
			return;
		}
	}

	if(localOps.debug)
	{
		console.log("AjaxRequest $.ajax options:", ajaxOps);
	}
	// Set the saving notice (depending on if this request is loading or saving data)
	setSaving(localOps.load);

	clearTimeout(_self.debounceTimer[requestHash]);

  if(localOps.debug) {
    console.log('timeout', ajaxOps);
  }
  _self.debounceTimer[requestHash] = setTimeout(function(){
    // Do Ajax call
    if(localOps.debug) {
      console.log('send', ajaxOps);
    }
		_self.setRequest(requestHash, $.ajax(ajaxOps));
  }, ms || 250);
};
AjaxRequest.prototype.ajaxError = function (localOps, error, textStatus, errorThrown, jqueryAjaxScope){
	submitComplete();
	var errors = [];
	setError();
	if(typeof error.responseJSON == 'object')
	{
		if(error.responseJSON.errors)
		{
			$(error.responseJSON.errors).each(function(){
				alert(this.message);
				errors.push(this.message);
			});
		}else{
			alert("An unknown error occured. Sorry for the inconvenience.");
		}
	}
	else if(error.statusText!=='abort')
	{
		alert("Error processing your request: "+error.responseText);
		errors.push(error.responseText);
	}
	if(localOps.input)
	{
		localOps.input.setError(true, errors.join("\n"));
	}
	if(localOps.errorFn)
	{
		localOps.errorFn(error, textStatus, errorThrown, this, jqueryAjaxScope);
	}
};
AjaxRequest.prototype.ajaxSuccess = function(localOps, response, jqueryAjaxScope){
	submitComplete();
	setSaved(localOps);

	// make sure no errors on the input now
	if(localOps.input)
	{
		localOps.input.setError(false, null);
	}

	// custom success function
	if(localOps.successFn)
	{
		localOps.successFn(response, this, jqueryAjaxScope);
	}
};
var AjaxManager = (function($, alert){
	// Private
	var prv = {
		submittingTotal: 0,
		erronious: 0,
		inputs: [],
		saveNotice: {
			enabled: true,
			$el: $("#saveNotice"),
			savedText: $("#saveNotice").html()
		}
	};

	// Protected - available to all objects called from within AjaxManager
	this.setSaved = function()
	{
		if(prv.saveNotice.enabled)
		{
			var inputErrors = false;
			$.each(prv.inputs, function(){
				if(this.error.current)
				{
					inputErrors = true;
					return false;
				}
			});
			if(inputErrors)
			{
				setError();
				return;
			}
			prv.saveNotice.$el.html(prv.saveNotice.savedText).removeClass("saving text-warning text-danger");
		}
	};
	this.setError = function()
	{
		if(prv.saveNotice.enabled)
		{
			prv.saveNotice.$el.html("Some changes not saved.").removeClass("saving text-warning").addClass("text-danger");
		}
	};
	this.setSaving = function(loading)
	{
		// Increase total of ajax calls in progress
		prv.submittingTotal++;

		if(prv.saveNotice.enabled)
		{
			prv.saveNotice.$el.html(loading ? "Loading..." : "...Saving").addClass("saving").removeClass("text-danger text-warning");
		}
	};
	this.setNotSaved = function()
	{
		if(prv.saveNotice.enabled)
		{
			prv.saveNotice.$el.html("Waiting for user").removeClass("saving text-danger").addClass("text-warning");
		}
	};
	this.submitComplete = function()
	{
		prv.submittingTotal--;
	};
	
	// public
	var self = {
		newRequest: function(url, ops)
		{
			if(!url)
			{
				console.warn("First argument 'url' is required for AjaxManager.newRequest");
				return;
			}
			if(!ops)
			{
				ops = {};
			}
			var newAjaxRequest = new AjaxRequest(url, ops);
			return newAjaxRequest;
		},
		newInput: function($input, nodeID, entity)
		{
			if(!$input)
			{
				console.warn("First argument '$input' is required for AjaxManager.newInput");
				return;
			}
			var newInput = new AjaxInput($input, nodeID, entity);
			prv.inputs.push(newInput);
			return newInput;
		},
		findInputs: function(nodeID, column)
		{
			var matchingInputs = [];
			$.each(prv.inputs, function()
			{
				var AI = this;
				if(AI.id===nodeID && AI.getColumn()===column)
				{
					//matching input
					matchingInputs.push(AI);
				}
			});
			return matchingInputs;
		}
	};

	return self;
})(jQuery, BootstrapModalAlerts.alert);
var SidePanel = (function($){
	var LocalSidePanel = function()
	{
		var _self = this;
		this.$panel = $(".right-bar");
		this.selectedNodeID = null;
		this.$draftToggle = $("#liveToggle");
		this.$draftToggleText = $("#liveToggleText");
		this.$previewButton = $("#previewButton");
		this.$mediaSelect = $("#mediaSelect");
		this.$dataInputs = $("[data-column]", this.$panel);
		this.$fieldset = $("fieldset", this.$panel);
		this.$selects = $("select", this.$panel);
		this.$wysiwyg = $('#pageTextEdit');
		this.inputs = [];
		this.$conditions = $(".conditions", this.$panel);
		this.$conditionAdd = $(".condition-add", this.$panel);
		this.$conditionInput = $("#conditionPanelInput", this.$panel);
		this.$progressBar = $("#uploadProgressBar");
		this.$uploadProgress = $("#uploadProgress");
		this.$nodeImage = $("#nodeImage");
		this.$vimeoFrame = $("#vimeoFrame");

		this.questionDom = {
			$type: $("#questionType"),
			$text: $("#questionText"),
			$var: $("#variableText"),
			$answersPanel: $("#answersPanel"),
			$answers: $("#answers"),
			$addAnswer: $("#addAnswer")
		};

		this.fixedVars = {
			date_quit: 'quit_date',
			float_spend_weekly: 'weekly_spend'
		};

		// close the panel
		$(".close-sidebar").on("click", function(e){
			e.preventDefault();
			_self.hide();
		});

		// disable preview button for now
		this.$previewButton.on("click", function(e){
			e.preventDefault();
			//alert("Sorry, this feature is not currently available. There is no user front-end yet.", { title: 'Not available yet' });
			window.open("/admin/preview/"+_self.selectedNodeID, "PagePreview", "fullscreen=1");
		});

		// change text (draft/live) for the toggle
		this.$draftToggle.on("change", function(){
			_self.$draftToggleText.html(_self.$draftToggle.is(":checked") ? "Live" : "Draft");
		}).trigger("change");

		this.$mediaSelect.on("change", function(){
			$(".media-tab-type:not(.hidden)").addClass("hidden");
			$("#media-tab-"+$(this).val()).removeClass("hidden");
		}).trigger("change");

		// Page text editor
		$.trumbowyg.svgPath = '/bundles/app/svg/icons.svg';
		this.$wysiwyg.trumbowyg({
		    btns: [['viewHTML'], ['strong', 'em'], ['link']],
		    autogrow: true
		});

		// ajax inputs
		this.$dataInputs.each(function(){
			var inputEntity = typeof $(this).attr("data-entity")!='undefined' ? $(this).attr("data-entity") : "node",
			newInput = AjaxManager.newInput($(this), null, inputEntity);
			_self.inputs.push(newInput);
		});

		// condition add functionality
		this.$conditionAdd.on("click", function(e)
		{
			e.preventDefault();
			var Node = NodeManager.get(_self.selectedNodeID);

			ajax.addCondition.ops.successFn = function(response){
				Node.addCondition(response);
			};
			ajax.addCondition.submit({
				page: Node.nodeData.id,
				condition: _self.$conditionInput.val()
			});
		});

		// setup uploader
		this.uploader = new plupload.Uploader({
			browse_button: 'uploadButton',
			drop_element: 'uploadButton',
			url: null,
			filters: {
				mime_types : [
					{ title : "Images", extensions : "jpg,jpeg,gif,png" }
				],
				max_file_size: "5mb"
			},
			multi_selection: false,
			flash_swf_url: '/bundles/plupload/Moxie.swf',
			silverlight_xap_url: '/bundles/plupload/Moxie.xap'
		});
		this.uploader.init();
		// when we add a file we want to start an upload immediately as we are not handling lots of files
		this.uploader.bind('FilesAdded', function(up, files) {
			_self.uploader.start();
		});
		this.uploader.bind('BeforeUpload', function(up, file) {
			up.settings.url = '/admin/page/upload/'+_self.selectedNodeID;
			up.settings.nodeID = _self.selectedNodeID;
		});
		this.uploader.bind('UploadFile', function(up, file) {
			_self.$uploadProgress.show();
			_self.$progressBar.removeClass("bg-danger bg-success");
		});
		this.uploader.bind('UploadProgress', function(up, file) {
			_self.$progressBar.css({width: file.percent+"%"});
		});
		this.uploader.bind('FileUploaded', function(up, file, result) {
			_self.$progressBar.addClass("bg-success");
			_self.$uploadProgress.hide();
			var Node = NodeManager.get(up.settings.nodeID),
			NodeData = JSON.parse(result.response);
			Node.nodeData = NodeData;
			_self.updateMedia();
		});
		this.uploader.bind('Error', function(up, err) {
			console.log(err);
			alert(err.message, {title: "Upload error #"+err.code});
			_self.$progressBar.addClass("bg-danger");
		});

		this.questionDom.$type.on("change", function(){
			var $type = $(this),
			selVal = $type.val();
			if(selVal==='choice' || selVal==='choice_multi')
			{
				_self.questionDom.$answersPanel.show();
			}
			else
			{
				_self.questionDom.$answersPanel.hide();
			}

			_self.questionDom.$var.prop('disabled', false);

			if(Object.keys(_self.fixedVars).indexOf(selVal)!==-1)
			{
				// Need to set the variable fixed
				_self.questionDom.$var.val(_self.fixedVars[selVal]).trigger("blur").prop('disabled', true);
			}
		});

		this.questionDom.$addAnswer.on("click", function(){
			ajax.addAnswer.ops.successFn = function(answerData){
				_self.addAnswer(answerData);
				// add the answer to Node's data
				var Node = NodeManager.get(answerData.question.page.id);
				Node.nodeData.questions[0].answerOptions.push(answerData);
			};

			var Node = NodeManager.get(_self.selectedNodeID);
			ajax.addAnswer.submit({
				question: Node.nodeData.questions[0].id
			});
		});
	};

	LocalSidePanel.prototype.show = function(nodeID)
	{
		var _self = this;

		if(this.selectedNodeID)
		{
			this.hide();
		}

		this.$panel.addClass("show");
		this.selectedNodeID = nodeID;
		var Node = NodeManager.get(this.selectedNodeID);
		Node.setEditing(true);
		// load in cache and disable inputs while we refresh the data
		this.$conditions.empty();
		this.disableInputs();
		this.load();
		ajax.getPage.ops.successFn = function(nodeData){
			Node.nodeData = nodeData;
			_self.load();
			_self.enableInputs();
		};
		ajax.getPage.submit({}, ajax.getPage.url + this.selectedNodeID);
	};
	LocalSidePanel.prototype.hide = function()
	{
		if(this.selectedNodeID)
		{
			this.$panel.removeClass("show");
			var Node = NodeManager.get(this.selectedNodeID);
			Node.setEditing(false);
			this.selectedNodeID = null;
		}
	};
	LocalSidePanel.prototype.disableInputs = function()
	{
		this.$fieldset.add(this.$selects).prop("disabled", true);
		this.$selects.selectpicker('refresh');
		this.$wysiwyg.trumbowyg('disable');
	};
	LocalSidePanel.prototype.enableInputs = function()
	{
		this.$fieldset.add(this.$selects).prop("disabled", false);
		this.$selects.selectpicker('refresh');
		this.$wysiwyg.trumbowyg('enable');
		this.questionDom.$type.trigger("change");
	};
	LocalSidePanel.prototype.load = function()
	{
		var _self = this,
		nodeID = this.selectedNodeID;
		var Node = NodeManager.get(nodeID);

		var questionID = Node.nodeData.questions.length>0 ? Node.nodeData.questions[0].id : null;

		$.each(this.inputs, function()
		{
			var AjaxInput = this,
			id = AjaxInput.entity === 'node' ? nodeID : (AjaxInput.entity==='question' ? questionID : null);
			AjaxInput.loadEntity(id, nodeID);
		});
		
		$.each(Node.conditions, function()
		{
			_self.addCondition(this);
		});
		this.$conditionInput.val("");

		_self.updateMedia();

		this.questionDom.$answers.empty();
		if(Node.nodeData.questions.length > 0)
		{
			$.each(Node.nodeData.questions[0].answerOptions, function()
			{
				_self.addAnswer(this);
			});
		}
	};
	LocalSidePanel.prototype.addCondition = function(Condition)
	{
		this.$conditions.append(Condition.$conditionSidePanel);
		this.$conditionInput.val("");
	};
	LocalSidePanel.prototype.removeCondition = function(Condition)
	{
		Condition.$conditionSidePanel.remove();
	};
	LocalSidePanel.prototype.updateMedia = function()
	{
		var Node = NodeManager.get(this.selectedNodeID),
		vimeoSetTimeout = null,
		_self = this;
		if(null !== Node.nodeData.imagePath)
		{
			this.$nodeImage.attr("src", "/"+Node.nodeData.imagePath).show();
		}
		else
		{
			this.$nodeImage.attr("src", "#").hide();
		}
		_self.$vimeoFrame.empty();
		if('' !== Node.nodeData.videoUrl && null !== Node.nodeData.videoUrl)
		{
			//https://vimeo.com/73101630
	        //BECOMES
	        //https://player.vimeo.com/video/73101630?title=0&byline=0&portrait=0
			var $iframe = $("<iframe></iframe>",{
				id: 'vimeoVideo',
				src: "https://player.vimeo.com/video/" + Node.nodeData.videoUrl.split("/").pop() + "?title=0&byline=0&portrait=0",
				width: 450,
				height: 253,
				frameborder: 0,
				webkitallowfullscreen: true,
				mozallowfullscreen: true,
				allowfullscreen: true
			});
			if(vimeoSetTimeout)
			{
				clearTimeout(vimeoSetTimeout);
			}
			vimeoSetTimeout = setTimeout(function(){
				_self.$vimeoFrame.empty();
				$iframe.appendTo(_self.$vimeoFrame);
			},350);
		}
	};
	LocalSidePanel.prototype.addAnswer = function(answerData)
	{
		var newAnswer = new Answer(answerData);
		newAnswer.$answer.appendTo(this.questionDom.$answers);
	};

	return new LocalSidePanel();
})(jQuery);


// Answer object - created by SidePanel
function Answer(data)
{
	this.data = data;

	var _self = this,
	els = {
		$displayInput: $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Enter answer option',
			id: 'answerText' + this.data.id,
			"data-column": "answer"
		})
		.val(data.answer),
		$valueInput: $("<input />",{
			type: 'text',
			class: 'form-control',
			placeholder: 'Enter value to save',
			id: 'answerValue' + this.data.id,
			"data-column": "saveValue"
		})
		.val(data.saveValue),
		$close: $("<button />",{
			type: 'button',
			class: 'close delete-answer text-danger'
		}).append(
			$("<span />",{
				"aria-hidden": true,
				html: '&times;&nbsp;'
			})
		).on("click", function(e){
			e.preventDefault();
			confirm("Are you sure you want to delete this answer?", {
				title: 'Are you sure?'
			}, function(e, confirmed, bsma){ 
				if(confirmed)
				{
					ajax.deleteAnswer.ops.successFn = function(){
						_self.remove();
					};
					ajax.deleteAnswer.submit({}, ajax.deleteAnswer.url + _self.data.id);
				} 
			});
		})
	};

	this.inputs = [
		AjaxManager.newInput(els.$displayInput, this.data.id, 'answer'),
		AjaxManager.newInput(els.$valueInput, this.data.id, 'answer')
	];

	this.$answer = $("<div />",{
		class: 'answer-group'
	})
	.append(
		$("<hr />")
	)
	.append(
		els.$close
	)
	.append(
		$("<br />")
	)
	.append(
		$("<div />",{
			class: 'form-group'
		})
		.append(
			$("<label />",{
				for: 'answerText' + this.data.id,
				html: 'Answer Option (Displayed)'
			})
		).append(
			$("<div />",{
				class: 'input-group'
			}).append(
				els.$displayInput
			)
		)
	)
	.append(
		$("<div />",{
			class: 'form-group'
		})
		.append(
			$("<label />",{
				for: 'AnswerValue' + this.data.id,
				html: 'Answer Option (Saved value)'
			})
		).append(
			$("<div />",{
				class: 'input-group'
			}).append(
				els.$valueInput
			)
		)
	);

	return this;
}
Answer.prototype.remove = function()
{
	var Node = NodeManager.get(this.data.question.page.id),
	_self = this;
	$.each(Node.nodeData.questions[0].answerOptions, function(index)
	{
		if(this.id === _self.data.id)
		{
			Node.nodeData.questions[0].answerOptions.splice(index, 1);
			return false;
		}
	});
	this.$answer.remove();
};
// Condition object and protos
function Condition(conditionData, nodeID)
{
	var _self = this,
	removeCondition = function(e){
		e.preventDefault();
		ajax.deleteCondition.ops.successFn = function(response){
			var Node = NodeManager.get(_self.nodeID);
			Node.removeCondition(_self.conditionData.id);	
		};
		ajax.deleteCondition.submit({}, ajax.deleteCondition.url + _self.conditionData.id);
	};
	
	this.nodeID = nodeID;
	this.conditionData = conditionData;
	this.$condition = $("<a />",{
		class: 'btn btn-secondary btn-sm',
		href: '#',
		html: conditionData.condition+'&nbsp;&nbsp;',
		id: 'condition_'+conditionData.id
	}).append(
		$("<span />",{
			class: 'text-danger',
			html: '&times;'
		})
	).on("click", removeCondition);

	this.$conditionSidePanel = this.$condition.clone(true).removeClass("btn-sm").attr("id", 'panel_condition_'+conditionData.id);
	return this;
}
// Node Object and proto
function Node(nodeData, tree)
{
	var _self = this,
	nodeParent = this.getParentId(nodeData);

	this.debounceTimer = null;
	this.nodeData = nodeData;
	this.tree = tree;
	this.childBranch = null;
	this.conditions = {};
	this.request = null;
	this.inputs = [];
	this.opened = false;

	this.$nameInput = $("<input />",{
		type: 'text',
		class: 'form-control',
		placeholder: 'Page name'
	});
	this.$pageStatus = $("<div />", {
		class: 'page-status'
	});
	this.updatePageStatus();

	if(nodeData.type=='link')
	{
		this.$nameInput.attr({
			"data-column": "name"
		});
		this.$nameInput.on("keyup", function(e){
			_self.debounce(_self.searchName);
		});
	}
	else
	{
		this.$nameInput.attr({
			"data-column": "name"
		});
		this.inputs.push(AjaxManager.newInput(this.$nameInput, this.nodeData.id));
	}

	var $inputGroup = $("<div />",{
			class: 'input-group'
		}),
		$nameInputGroup = $inputGroup.clone().append(
			this.$nameInput
		);
	if(nodeData.type!=='link')
	{
		this.$nameInput.attr("value", nodeData.name);
	}
	else
	{
		this.LocalSearchMenu = new SearchMenu(this);
		$nameInputGroup.append(
			this.LocalSearchMenu.$dropdownMenu
		);
	}		

	this.$conditionInput = $("<input />",{
		type: 'text',
		class: 'form-control',
		placeholder: 'Condition'
	});
	this.$addConditionButton = $("<a />",{
		href: '#',
		class: 'btn btn-primary condition-add',
		html: '&nbsp;'
	}).on("click", function(){
		ajax.addCondition.ops.successFn = function(response){
			_self.addCondition(response);
		};
		ajax.addCondition.submit({
			page: _self.nodeData.id,
			condition: _self.$conditionInput.val()
		});
	});
	this.$conditions = $("<div />",{
		class: 'conditions'
	});
	this.$treeNode = $("<div />",{
		class: 'tree-node',
		id: 'node_'+nodeData.id
	});

	var $nodeAddPage = $("<a />",{
			href: '#',
			class: 'node-add page',
			html: 'Add Page'
		}),
		$nodeAddLink = $("<a />",{
			href: '#',
			class: 'node-add link',
			html: 'Add Link'
		}),
		$nodeTargetLink = $("<a />",{
			href: '#',
			class: 'node-target',
			html: 'select target location'
		}),
		$dropupDivider = $("<div />",{
			class: 'dropdown-divider'
		}),
		$nodeInner = $("<div />",{
			class: 'node-inner'
		}).append(
			$nameInputGroup
		).append(
			$inputGroup.clone().append(
				this.$conditionInput
			).append(
				$("<span />",{
					class: 'input-group-addon'
				}).append(
					this.$addConditionButton
				)
			)
		).append(
			this.$conditions
		),
		$nodeBarRight = $("<div />",{
			class: 'node-bar right'
		}).append(
			$("<div />",{
				class: 'btn-group dropup'
			}).append(
				$("<div />",{
					class: 'dropdown-menu node'
				}).append(
					$("<a />",{
						href: '#',
						class: 'dropdown-item',
						html: 'Move'
					}).on("click", function(){
						showTreeTargets(_self, 'move');
					})
				).append(
					$dropupDivider.clone()
				).append(
					$("<a />",{
						href: '#',
						class: 'dropdown-item',
						html: 'Copy'
					}).on("click", function(){
						showTreeTargets(_self, 'copy');
					})
				).append(
					$dropupDivider.clone()
				).append(
					$("<a />",{
						href: '#',
						class: 'dropdown-item',
						html: 'Delete'
					}).on("click", function(e){
						e.preventDefault();
						confirm("Are you sure you want to delete this node and all of its children?", {
							title: 'Are you sure?'
						}, function(e, confirmed, bsma){ 
							if(confirmed)
							{
								ajax.deleteNode.ops.successFn = function(){
									_self.remove();
								};
								ajax.deleteNode.submit({}, ajax.deleteNode.url + nodeData.id);
							} 
						});
					})
				)
			).append(
				$("<a />",{
					href: '#',
					class: 'node-menu',
					'data-toggle': 'dropdown'
				}).append(
					$("<div />",{
						class: 'icon',
						html: 'Menu'
					})
				)
			)
		);

	if(nodeData.type!=='link')
	{
		$nodeInner.append(
			$("<a />",{
				href: '#',
				class: 'btn btn-primary',
				html: 'Open'
			}).on("click", function(e){
				e.preventDefault();
				SidePanel.show(_self.nodeData.id);
			})
		);
		$nodeBarRight.append(
			$("<span />",{
				class: 'node-add-group'
			}).append(
				$nodeAddPage.clone()
				.on("click", function(e){
					e.preventDefault();

					ajax.addNode.ops.successFn = function(response){
						_self.addNodeByData(true, response);
					};
					ajax.addNode.submit({
						session: sessionNumber,
						parent: nodeData.id,
						sort: 1,
						type: 'page'
					});
				})
			).append(
				$nodeAddLink.clone()
				.on("click", function(e){
					e.preventDefault();

					ajax.addNode.ops.successFn = function(response){
						_self.addNodeByData(true, response);
					};
					ajax.addNode.submit({
						session: sessionNumber,
						parent: nodeData.id,
						sort: 1,
						type: 'link'
					});
				})
			).append(
				$nodeTargetLink.clone()
				.on("click", function(e){
					e.preventDefault();
					_self.setCopyMoveAjax(true);
				})
			)
		);
	}
	else
	{
		$nodeInner.prepend(
			$("<span />",{
				class: 'node-goto-header',
				html: 'Go to'
			})
		);
	}

	$(nodeData.conditions).each(function(){
		_self.addCondition(this);
	});
	this.$node = $("<li />",{
		class: "tree-li"
	}).append(
		this.$treeNode.append(
			$("<div />",{
				class: 'item-node'
			}).append(
				$nodeInner
			).append(
				$("<div />",{
					class: 'node-bar bottom'
				}).append(
					$nodeAddPage.clone()
					.on("click", function(e){
						e.preventDefault();
						ajax.addNode.ops.successFn = function(response){
							_self.addNodeByData(false, response);
						};
						ajax.addNode.submit({
							session: sessionNumber,
							parent: nodeParent,
							sort: nodeData.sort+1,
							type: 'page'
						});
					})
				).append(
					$nodeAddLink.clone()
					.on("click", function(e){
						e.preventDefault();
						ajax.addNode.ops.successFn = function(response){
							_self.addNodeByData(false, response);
						};
						ajax.addNode.submit({
							session: sessionNumber,
							parent: nodeParent,
							sort: nodeData.sort+1,
							type: 'link'
						});
					})
				)
				.append(
					$nodeTargetLink.clone()
					.on("click", function(e){
						e.preventDefault();
						_self.setCopyMoveAjax(false);
					})
				)
				.append(
					this.$pageStatus
				)
			)
			.append(
				$nodeBarRight
			)
		)
	).append(
		$("<div />",{
			class: 'tree-icon-question-answer'
		})
	);

}
Node.prototype.debounce = function(fn, ms)
{
	var _self = this;
	clearTimeout(_self.debounceTimer);
    _self.debounceTimer = setTimeout(function(){
        fn.call(_self);
    }, ms || 250);
};
Node.prototype.searchName = function()
{
	var _self = this;
	this.LocalSearchMenu.setLoading();

	ajax.searchSession.ops.successFn = function(response){
		_self.LocalSearchMenu.setResults(response);
	};
	ajax.searchSession.submit({
		search: this.$nameInput.val()
	});		
};
Node.prototype.updatePageStatus = function()
{
	this.$pageStatus.removeClass("text-success text-muted");
	if(this.nodeData.live)
	{
		this.$pageStatus.html("Live").addClass("text-success");
	}
	else
	{
		this.$pageStatus.html("Draft").addClass("text-muted");
	}
};
Node.prototype.getParentId = function(nodeData){
	if(!nodeData)
	{
		nodeData = this.nodeData;
	}
	return (null === nodeData.parent ? null : (nodeData.parent.id ? nodeData.parent.id : nodeData.parent));
};
Node.prototype.addNodeByData = function(child, nodeData){
	if(child)
	{
		if(this.childBranch)
		{
			this.childBranch.appendNode(nodeData);
		}
		else
		{
			//we have to add the child tree
			createBranch([nodeData], this);
		}
	}
	else
	{
		this.tree.appendNode(nodeData);
	}
};
Node.prototype.setCopyMoveAjax = function(child){
	var sourceNode = selectedNode,
	type = sourceNode.request,
	targetNode = this;
	var data = {
		parent: child ? targetNode.nodeData.id : targetNode.getParentId(),
		sort: child ? 1 : targetNode.nodeData.sort+1,
		session: targetNode.nodeData.session
	};
	// change the sort if we are moving to the same tree/branch just later in the list
	// e.g. if we are at sort position 1, and we want to move it to beneath sort position 2
	// then position 2 will become position 1, so this sort actually needs to be 2, not 3 - reduce by 1
	if(type==='move' &&
		!child &&
		sourceNode.tree.$ul[0] === targetNode.tree.$ul[0] &&
		targetNode.nodeData.sort > sourceNode.nodeData.sort)
	{
		data.sort--;
	}
	ajax.copyMoveNode.ops.successFn = function(nodeData){
		sourceNode[type](targetNode, child, nodeData);
	};
	ajax.copyMoveNode.submit(data, ajax.copyMoveNode.url + type + '/' + sourceNode.nodeData.id);
};
Node.prototype.copy = function(targetNode, child, nodeData){
	targetNode.addNodeByData(child, nodeData);
	hideTreeTargets();
};
Node.prototype.remove = function(){
	if(this.childBranch)
	{
		$(this.childBranch.nodes).each(function(){
			this.remove();
		});
		this.childBranch = undefined;
	}
	this.tree.removeNodeIndex(this.nodeData.sort-1);
	
	$(".goto-pagename[data-gotoid="+this.nodeData.id+"]").val("");

	this.$node.remove();
};
Node.prototype.move = function(targetNode, child, nodeData){
	this.remove();
	this.copy(targetNode, child, nodeData);
};
Node.prototype.setEditing = function(set)
{
	var editingCls = "editing";
	this.opened = set;
	if(set)
	{
		if(!this.$treeNode.hasClass("editing"))
		{
			this.$treeNode.addClass("editing");
		}
	}
	else
	{
		if(this.$treeNode.hasClass("editing"))
		{
			this.$treeNode.removeClass("editing");
		}
	}
};
Node.prototype.addCondition = function(conditionData){
	var newCondition = new Condition(conditionData, this.nodeData.id);
	this.conditions[conditionData.id] = newCondition;
	this.$conditions.append(
		newCondition.$condition
	);
	this.$conditionInput.val("");

	if(this.opened)
	{
		SidePanel.addCondition(newCondition);
	}
};
Node.prototype.removeCondition = function(conditionID){
	this.conditions[conditionID].$condition.remove();
	if(this.opened)
	{
		SidePanel.removeCondition(this.conditions[conditionID]);
	}
	this.conditions[conditionID] = undefined;
};

function SearchMenu(parentNode)
{
	var _self = this;

	// Create DOM Elements
	this.$dropdownMenu = $("<div />",{
		class: 'dropdown-menu'
	});
	this.$searchResultLink = $("<a />",{
		href: '#',
		class: 'dropdown-item'
	});
	this.$noSearchResults = this.$searchResultLink
		.clone()
		.html('No results');
	this.$loadingSearchResults = this.$searchResultLink
		.clone()
		.html('Loading...')
		.appendTo(this.$dropdownMenu);
	

	this.parentNode = parentNode;

	// Setup page node is currently forwading to
	this.currentPage = {
		name: (null === this.parentNode.nodeData.forwardToPage ? '' : this.parentNode.nodeData.forwardToPage.name),
		id: (null === this.parentNode.nodeData.forwardToPage ? '' : this.parentNode.nodeData.forwardToPage.id)
	};

	// Modify the Node's input and parent to create a dropdown
	this.$dropdown = this.parentNode
		.$nameInput
			.addClass("dropdown-toggle goto-pagename")
			.attr({
				"data-toggle": "dropdown",
				"data-gotoid": this.currentPage.id,
				"value": this.currentPage.name
			})
			.on("focus", function(){
				_self.parentNode.$nameInput.trigger("click");
				_self.parentNode.searchName.call(_self.parentNode);
			})
		.parent()
			.addClass("dropdown");
	
	// Link allowing the menu to show and hide with whether the field is in focus
	var dropdownFn = {
		hide: function(){
			if(_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		},
		hidden: function(){
			_self.updateSaved();
		},
		show: function(){
			if(!_self.parentNode.$nameInput.is(":focus"))
			{
				return false;
			}
		}
	};
	this.$dropdown.on("hide.bs.dropdown", dropdownFn.hide);
	this.$dropdown.on("hidden.bs.dropdown", dropdownFn.hidden );
	this.$dropdown.on("show.bs.dropdown", dropdownFn.show );
	return this;
}
SearchMenu.prototype.updateSaved = function(){
	this.parentNode.$nameInput
		.val(this.currentPage.name)
		.attr("data-gotoid", this.currentPage.id);
};
SearchMenu.prototype.hide = function(){
	this.parentNode.$nameInput.trigger("click");
};
SearchMenu.prototype.setLoading = function(){
	this.$dropdownMenu.empty();
	this.$dropdownMenu.append(this.$loadingSearchResults);
};
SearchMenu.prototype.setResults = function(results){
	this.$dropdownMenu.empty();
	if(results.length<1)
	{
		this.$dropdownMenu.append(this.$noSearchResults);
	}
	else
	{
		var _self = this;

		var clickFn = function(e){
			e.preventDefault();
			e.stopPropagation();

			var data = $(this).data("searchResult");
			_self.parentNode.$nameInput.val(data.name);

			ajax.updateNode.ops.successFn = function(newNodeData){
				// update current page
				_self.currentPage = {
					name: data.name,
					id: data.id
				};

				// update saved in case has been hidden in the mean-time
				_self.updateSaved();
				// hide the menu if showing
				_self.hide();

				_self.parentNode.$nameInput.attr("data-gotoid", newNodeData.forwardToPage.id);
				
				// Update NodeData
				_self.parentNode.nodeData = newNodeData;
			};

			ajax.updateNode.submit({
				forwardToPage: data.id
			}, ajax.updateNode.url + _self.parentNode.nodeData.id);
		};

		var $selectableLink = this.$searchResultLink
			.clone()
			.on("click", clickFn);

		$(results).each(function(){
			_self.$dropdownMenu.append(
				$selectableLink
					.clone(true)
					.attr("href", "#"+this.id)
					.html(this.name)
					.data("searchResult", this)
			);
		});
	}
};
var NodeManager = (function($, alert, confirm){
	var nodes = {};

	var public = {
		new: function(nodeData, treeBranch){
			var newNode = new Node(nodeData, treeBranch);
			nodes[newNode.nodeData.id] = newNode;
			return newNode;
		},
		get: function(nodeID)
		{
			return nodes[nodeID];
		},
		clear: function(){
			nodes = {};
		}
	};
	return public;
})(jQuery, BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm);
// Tree Object and proto
function Tree(parentNode)
{
	this.$ul = $("<ul />",{
		class: "node-tree"
	});

	if(!parentNode)
	{
		$("<span />",{
			class: 'session-starts',
			html: 'Session starts'
		})
		.appendTo($treeContainer)
		.after(this.$ul);
	}
	else
	{
		this.$ul.appendTo(parentNode.$node);
		parentNode.childBranch = this;
	}

	this.nodes = [];
	this.parentNode = parentNode;
}
Tree.prototype.appendNode = function(nodeData){
	var newNode = NodeManager.new(nodeData, this);
	if(nodeData.sort===1)
	{
		newNode.$node.prependTo(this.$ul);
		this.nodes.unshift(newNode);
	}
	else
	{
		var sortToIndex = nodeData.sort-1;
		newNode.$node.insertAfter(this.nodes[sortToIndex-1].$node);
		this.nodes.splice(sortToIndex, 0, newNode);
	}
	this.updateSortValues();

	if(nodeData.children.length>0)
	{
		createBranch(nodeData.children, newNode);
	}
	return newNode;
};
Tree.prototype.getNodes = function(){
	return this.nodes;
};
Tree.prototype.updateSortValues = function(){
	$(this.nodes).each(function(index){
		this.nodeData.sort = index+1;
	});
};
Tree.prototype.removeNodeIndex = function(nodeIndex){
	this.nodes.splice(nodeIndex, 1);
	this.updateSortValues();
};
var TreeManager = (function($, alert, confirm){
	// References only for in this object
	var tm = this,
	$sessionSelect = $("#sessionSelect"),
	$pageContainer = $("#pageContainer"),
	rootTree;

	// Referenced and updatable vars from Entities
	this.$treeContainer = $("#treeContainer");
	this.selectedNode = null;
	this.sessionNumber = $sessionSelect.val();

	// All ajax
	this.ajax = {
		getSession: AjaxManager.newRequest('/admin/pages/get/', {
			dataType: 'json',
			submitFn: function(){
				$treeContainer.empty();
				SidePanel.hide();
				NodeManager.clear();
			},
			successFn: function(response){
				tm.createBranch(response);
			},
			abortable: true,
			load: true
		}),
		getPage: AjaxManager.newRequest('/admin/page/get/', {
			dataType: 'json',
			submitFn: function(){
				SidePanel.disableInputs();
			},
			abortable: true,
			load: true
		}),
		searchSession: AjaxManager.newRequest('/admin/pages/search/', {
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json',
			abortable: true,
			uniqueRequest: {
				url: true
			},
			initFn: function(){
				return {
					url: this.url + sessionNumber,
					ops: {}
				};
			},
			load: true,
			status: {
				enabled: false
			}
		}),
		addNode: AjaxManager.newRequest('/admin/page/add', {
			method: 'POST',
			dataType: 'json',
			contentType: 'application/json'
		}),
		deleteNode: AjaxManager.newRequest('/admin/page/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateNode: AjaxManager.newRequest('/admin/page/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: false
			}
		}),
		copyMoveNode: AjaxManager.newRequest('/admin/page/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true
			}
		}),
		addCondition: AjaxManager.newRequest('/admin/condition/add', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				data: true
			}
		}),
		deleteCondition: AjaxManager.newRequest('/admin/condition/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateQuestion: AjaxManager.newRequest('/admin/question/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: true
			}
		}),
		addAnswer: AjaxManager.newRequest('/admin/answer/add', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				data: true
			}
		}),
		deleteAnswer: AjaxManager.newRequest('/admin/answer/delete/', {
			dataType: 'json',
			uniqueRequest: {
				url: true
			}
		}),
		updateAnswer: AjaxManager.newRequest('/admin/answer/update/', {
			method: 'POST',
			dataType: 'json',
			contentType: "application/json",
			uniqueRequest: {
				url: true,
				data: true
			}
		})
	};

	// Protected functions accessible from shild objects
	this.createBranch = function(nodeData, parentNode){
		var newTree = new Tree(parentNode);
		if(!parentNode)
		{
			rootTree = newTree;
		}
		$(nodeData).each(function(){
			var newNode = newTree.appendNode(this);
		});
	};
	this.showTreeTargets = function(sNode, request){
		if(this.selectedNode)
		{
			this.hideTreeTargets();
		}

		// set globally the selected node
		this.selectedNode = sNode;
		this.selectedNode.$treeNode.addClass("selected action-"+request);
		this.selectedNode.request = request;

		// display we are copying / moving
		$("#targetAction").text(request);
		$pageContainer.addClass("show-targets");
	};
	this.hideTreeTargets = function(){
		// clear the selected node
		this.selectedNode.$treeNode.removeClass("selected action-"+this.selectedNode.request);
		this.selectedNode.request = null;
		this.selectedNode = null;

		//hide target display
		$pageContainer.removeClass("show-targets");
	};

	//Select/dropdown in header and trigger to load currently selected session
	$sessionSelect.on("change", function(){
		tm.sessionNumber = $(this).val();
		tm.ajax.getSession.submit(null, ajax.getSession.url + tm.sessionNumber);
	}).trigger("change");

	// Cancel button when moving/copying nodes
	$("#targetCancel").on("click",function(e){
		e.preventDefault();
		hideTreeTargets();
	});

	return null;
})(jQuery, BootstrapModalAlerts.alert, BootstrapModalAlerts.confirm);