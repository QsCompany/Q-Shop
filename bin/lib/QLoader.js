var exports = {};
var __global = {};
var envirenment;
var clone;
var $;
var $defineProperty;
var $bench;
(function (window) {
    function detectmob() {
        return (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i));
    }
    function bench(f, timeSpan) {
        var t = performance.now();
        var i = 0;
        while ((performance.now() - t) < timeSpan) {
            i++;
            f();
        }
        return i;
    }
    $defineProperty = function (o, p, attributes, onError) {
        try {
            return Object.defineProperty(o, p, attributes);
        }
        catch (e) {
            onError && onError(o, p, attributes);
            return false;
        }
    };
    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    }
    __global = {
        supportTemplate: (function supportsTemplate() { return 'content' in document.createElement('template'); })(),
        useListenerOrMutation: true,
        GetApiAddress: function (url) {
            return __global.ApiServer ? __global.ApiServer.Combine(url).toString() : url;
        },
        CaseSensitive: false,
        https: false,
        ApiServer: undefined
    };
    var __extends1 = function (d, b) {
        $defineProperty(d, 'base', {
            value: b,
            writable: false,
            enumerable: true,
            configurable: false
        });
        for (var p in b) {
            if (p == 'base' || p.indexOf('_') === 0 || p == 'ctor')
                continue;
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        }
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    $defineProperty(window, '__extends', { get: function () { return __extends1; }, set: function () { }, configurable: false, enumerable: false }, function (o, p, a) { __extends = __extends1; });
    var isBrowser = isBrowser = (!!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document));
    envirenment = {
        isBrowser: isBrowser,
        isWebWorker: !isBrowser && typeof importScripts !== 'undefined',
        isOpera: typeof window.opera !== 'undefined' && window.opera.toString() === '[object Opera]',
        isChromeApp: document.location.protocol === 'chrome-extension:',
        isMobile: !!detectmob()
    };
    if (!__global.supportTemplate)
        $defineProperty(HTMLUnknownElement.prototype, 'content', { get: function () { return this; } });
    clone = function (obj) {
        if (!obj)
            return obj;
        if (typeof obj === 'object') {
            var copy = obj.constructor();
            for (var attr in obj)
                if (obj.hasOwnProperty(attr))
                    copy[attr] = obj[attr];
            return copy;
        }
        else if (obj instanceof Array)
            return obj.splice(0);
        return obj;
    };
    function getScrollArea(x) {
        var h = [];
        var t = x;
        while (t) {
            var oy = getComputedStyle(t).overflowY;
            if (oy == "auto")
                return t;
            t = t.parentElement;
        }
    }
    Element.prototype.getScrollArea = function () { return getScrollArea(this); };
    Object.clone = clone;
    if (Element.prototype.scrollIntoViewIfNeeded == void 0)
        Element.prototype.scrollIntoViewIfNeeded = function () {
            var r = this.getBoundingClientRect();
            var v = getScrollArea(this);
            if (!v) {
                this.scrollIntoView({ inline: 'center' });
                return;
            }
            var t = document.body;
            var prRect = (v || t).getBoundingClientRect();
            var chRect = this.getBoundingClientRect();
            var x = new IDBDatabase();
            if (prRect.top - r.top > 0)
                v.scrollTop -= prRect.top - r.top;
            else if (prRect.bottom < r.bottom)
                v.scrollTop -= prRect.bottom - r.bottom;
        };
    if (String.prototype.endsWith === void 0)
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    if (String.prototype.startsWith === void 0)
        String.prototype.startsWith = function (suffix) {
            return this.indexOf(suffix) === 0;
        };
    if (HTMLElement.prototype.remove === void 0) {
        HTMLElement.prototype.remove = function () {
            this.removeNode(true);
        };
    }
    if (HTMLElement.prototype.parent === void 0) {
        HTMLElement.prototype.parent = function () {
            return this.parentElement || this.parentNode;
        };
    }
    HTMLElement.prototype.insertChildAtIndex = function (v, i) {
        var c = this.children.length;
        if (i < c)
            this.insertBefore(v, this.children.item(i));
        else
            this.appendChild(v);
    };
    $ = function (selector, context) {
        var b = document.body;
        var d = document;
        context = context === d ? b : context || b;
        var o = context === b;
        var s = selector[0] || '';
        if (s === '#') {
            if (o)
                return document.getElementById(selector.substr(1));
            return getElementById(selector.substr(1), context);
        }
        if (s === '.') {
            if (o)
                return document.getElementsByClassName(selector.substr(1));
            return getElementByClassName(selector.substr(1), context);
        }
        if (s === '[')
            return getElementByAttribute(selector.substr(1, selector.length - 2), context);
        if (o)
            return document.getElementsByTagName(selector);
        return getElementByTagName(selector, context);
    };
    function getElementById(id, context) {
        if (context instanceof HTMLElement) {
            if (id === context.id)
                return context;
            return _getElementById(id, context);
        }
        if (context instanceof Element)
            return context.id == id ? context : undefined;
        return undefined;
    }
    function _getElementById(id, cntxt) {
        var t = new Array(1000);
        t[0] = cntxt;
        var it = 0;
        while (it >= 0) {
            var root = t[it--];
            for (var i = 0, l = root.children.length; i < l; i++) {
                var child = root.children[i];
                if (child.id === id)
                    return child;
                if (child instanceof HTMLElement)
                    t[++it] = child;
            }
        }
    }
    function getElementByTagName(tag, context) {
        tag = tag.toUpperCase();
        if (context instanceof HTMLElement)
            return _getElementByTagName(tag, context);
        if (context instanceof Element)
            return context.tagName === tag ? [context] : [];
        return [];
    }
    function _getElementByTagName(tag, cntxt) {
        var t = new Array(1000);
        if (tag === cntxt.tagName)
            var ret = [cntxt];
        else
            ret = [];
        t[0] = cntxt;
        var it = 0;
        while (it >= 0) {
            var root = t[it--];
            for (var i = 0, l = root.children.length; i < l; i++) {
                var child = root.children[i];
                if (child.tagName === tag)
                    ret.push(child);
                if (child instanceof HTMLElement)
                    t[++it] = child;
            }
        }
        return ret;
    }
    function getElementByClassName(tag, context) {
        if (context instanceof HTMLElement)
            return _getElementByClassName(tag, context);
        if (context instanceof Element)
            return context.classList.contains(tag) ? [context] : [];
        return [];
    }
    function _getElementByClassName(tag, cntxt) {
        var t = new Array(1000);
        t[0] = cntxt;
        var it = 0;
        if (cntxt.classList.contains(tag))
            var ret = [cntxt];
        else
            ret = [];
        while (it >= 0) {
            var root = t[it--];
            for (var i = 0, l = root.children.length; i < l; i++) {
                var child = root.children[i];
                if (child.classList.contains(tag))
                    ret.push(child);
                if (child instanceof HTMLElement)
                    t[++it] = child;
            }
        }
        return ret;
    }
    function getElementByAttribute(tag, context) {
        if (context instanceof HTMLElement)
            return _getElementByAttribute(tag, context);
        if (context instanceof Element)
            return context.hasAttribute(tag) ? [context] : [];
        return [];
    }
    function _getElementByAttribute(tag, cntxt) {
        var t = new Array(1000);
        if (cntxt.hasAttribute(tag))
            var ret = [cntxt];
        else
            ret = [];
        t[0] = cntxt;
        var it = 0;
        while (it >= 0) {
            var root = t[it--];
            for (var i = 0, l = root.children.length; i < l; i++) {
                var child = root.children[i];
                if (child.hasAttribute(tag))
                    ret.push(child);
                if (child instanceof HTMLElement)
                    t[++it] = child;
            }
        }
        return ret;
    }
    if (!DocumentFragment.prototype.hasOwnProperty('firstElementChild'))
        $defineProperty(DocumentFragment.prototype, 'firstElementChild', {
            get: function () {
                var c = this.children || this.childNodes;
                for (var i = 0; i < c.length; i++)
                    if (c[i] instanceof Element)
                        return c[i];
                return null;
            },
            configurable: false
        });
    function test(fn, iter) {
        var t = Date.now();
        iter = iter || 200000;
        for (var i = 0; i < iter; i++) {
            fn();
        }
        return Date.now() - t;
    }
    if (typeof DOMParser === 'undefined')
        window.DOMParser = function DOMParser() {
            this.parseFromString = function (markup, type) {
                if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
                    var doc = document.implementation.createHTMLDocument("");
                    if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                        doc.documentElement.innerHTML = markup;
                    }
                    else {
                        doc.body.innerHTML = markup;
                    }
                    return doc;
                }
                else {
                    return window.DOMParser.prototype.nativeParse.apply(this, arguments);
                }
            };
            (function (DOMParser) {
                "use strict";
                var proto = DOMParser.prototype, nativeParse = proto.parseFromString;
                try {
                    if ((new DOMParser()).parseFromString("", "text/html")) {
                        return;
                    }
                }
                catch (ex) { }
                proto.parseFromString = function (markup, type) {
                    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
                        var doc = document.implementation.createHTMLDocument("");
                        if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                            doc.documentElement.innerHTML = markup;
                        }
                        else {
                            doc.body.innerHTML = markup;
                        }
                        return doc;
                    }
                    else {
                        return nativeParse.apply(this, arguments);
                    }
                };
            })(DOMParser);
        };
    var s;
    window.stop = function stop() {
        if (s)
            debugger;
    };
    if (envirenment.isChromeApp) {
        var str = {};
        window.localStorage = {
            key: function (i) { return Object.keys(str)[i]; },
            clear: function (callback) {
                chrome.storage.local.clear(callback);
            },
            getItem: function (k, callback) {
                chrome.storage.local.get(k, callback);
                return str[k];
            },
            get length() { return Object.keys(str).length; },
            setItem: function (k, v, callback) {
                str[k] = v;
                var x = {};
                x[k] = v;
                chrome.storage.local.set(x, callback);
            },
            removeItem: function (k, callback) {
                delete str[k];
                str[k] = void 0;
                chrome.storage.local.remove(k, callback);
            }
        };
    }
    else if (typeof localStorage === 'undefined') {
        var str = {};
        window.localStorage = {
            setItem: function (a, b) { str[a] = b; },
            getItem: function (a) { return str[a]; },
            clear: function () { },
            key: function (i) { return str[i]; },
            length: 0,
            removeItem: function (a) { }
        };
    }
})(window);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var enumProperty = /\w*\[\w*\[\"([^\"]*)\"\]\s*=\s*([^\]]*)[^;]*;/gmi;
var enumPropertyEs6 = '$1=$2,';
var ModuleType;
(function (ModuleType) {
    ModuleType[ModuleType["folder"] = 9007199254740991] = "folder";
    ModuleType[ModuleType["uknown"] = -1] = "uknown";
    ModuleType[ModuleType["code"] = 0] = "code";
    ModuleType[ModuleType["json"] = 1] = "json";
    ModuleType[ModuleType["xml"] = 2] = "xml";
    ModuleType[ModuleType["html"] = 3] = "html";
    ModuleType[ModuleType["Image"] = 4] = "Image";
    ModuleType[ModuleType["template"] = 5] = "template";
    ModuleType[ModuleType["style"] = 6] = "style";
    ModuleType[ModuleType["none"] = 7] = "none";
})(ModuleType || (ModuleType = {}));
var ModuleExt;
(function (ModuleExt) {
    ModuleExt[ModuleExt["js"] = 0] = "js";
    ModuleExt[ModuleExt["json"] = 1] = "json";
    ModuleExt[ModuleExt["xml"] = 2] = "xml";
    ModuleExt[ModuleExt["html"] = 3] = "html";
    ModuleExt[ModuleExt["img"] = 4] = "img";
    ModuleExt[ModuleExt["template"] = 5] = "template";
    ModuleExt[ModuleExt["svg"] = 6] = "svg";
    ModuleExt[ModuleExt["ico"] = 6] = "ico";
    ModuleExt[ModuleExt["css"] = 6] = "css";
    ModuleExt[ModuleExt["none"] = 7] = "none";
})(ModuleExt || (ModuleExt = {}));
var ModuleStat;
(function (ModuleStat) {
    ModuleStat[ModuleStat["New"] = 0] = "New";
    ModuleStat[ModuleStat["Downloading"] = 1] = "Downloading";
    ModuleStat[ModuleStat["Downloaded"] = 2] = "Downloaded";
    ModuleStat[ModuleStat["Defining"] = 3] = "Defining";
    ModuleStat[ModuleStat["Defined"] = 4] = "Defined";
    ModuleStat[ModuleStat["Executing"] = 5] = "Executing";
    ModuleStat[ModuleStat["Executed"] = 6] = "Executed";
    ModuleStat[ModuleStat["Failed"] = 7] = "Failed";
    ModuleStat[ModuleStat["Forbidden"] = 111] = "Forbidden";
})(ModuleStat || (ModuleStat = {}));
var System;
(function (System) {
    var $clone = function (_this, from) {
        if (from == null)
            return _this;
        if (_this == null)
            _this = {};
        for (var i in from) {
            _this[i] = from[i];
        }
        return _this;
    };
    var stack = [];
    var args = [];
    var basics;
    (function (basics) {
        var Url = (function () {
            function Url(url) {
                this.init(url || "");
            }
            Url.prototype.IsEquals = function (url) {
                if (!this.SameHostAs(url))
                    return false;
                if (this._path.length !== url._path.length)
                    return false;
                if (this.moduleName != url.moduleName)
                    return false;
                if (this.ext != url.ext)
                    return false;
                if (this.moduleType != this.moduleType)
                    return false;
                for (var i = 0; i < this._path.length; i++)
                    if (this._path[i] != url._path[i])
                        return false;
                return true;
            };
            Object.defineProperty(Url.prototype, "Directory", {
                get: function () {
                    return this._directory || (this._directory = new Url(this.getDirectory()));
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "ParentDirectory", {
                get: function () {
                    if (this.IsFolder) {
                        var s;
                        if (this.IsExternal) {
                            s = this.host + "/";
                        }
                        else if (this.IsRooted)
                            s = "/";
                        else
                            s = "";
                        if (this.path.length > 1) {
                            s += this._path.slice(0, this._path.length - 1).join('/') + "/";
                        }
                        return new Url(s);
                    }
                    else
                        return this.Directory;
                },
                enumerable: true,
                configurable: true
            });
            Url.prototype.getmoduleType = function (_default) {
                if (this.IsFolder)
                    return ModuleType.folder;
                var e = this.ext;
                if (e == null || e == "")
                    return typeof _default === 'number' ? _default : ModuleType.none;
                var t = ModuleExt[e];
                if (t == null)
                    return ModuleType[this.PluginName] || ModuleType.uknown;
                return t;
            };
            Object.defineProperty(Url.prototype, "moduleType", {
                get: function () {
                    if (this.IsFolder)
                        return ModuleType.folder;
                    var e = this.ext;
                    if (e == null || e == "")
                        return ModuleType.none;
                    var t = ModuleExt[e];
                    if (t == null)
                        return ModuleType[this.PluginName] || ModuleType.uknown;
                    return t;
                },
                enumerable: true,
                configurable: true
            });
            Url.prototype.getEName = function (defaultExt) {
                if (this.IsFolder)
                    return "";
                var ext = this.ext;
                if (this.moduleType == ModuleType.none)
                    defaultExt = defaultExt;
                else
                    defaultExt = this.ext || ModuleExt[this.moduleType];
                var s = this.moduleName;
                if (defaultExt)
                    s += "." + defaultExt;
                if (this.params)
                    s += "?" + this.params;
                return s;
            };
            Url.prototype.setDefaultExt = function (ext) {
                if (this.ext == null || this.ext == "")
                    this.ext = ext;
                return this;
            };
            Url.prototype.setDefaultType = function (type) {
                if (this.ext == null || this.ext == "")
                    this.ext = ModuleExt[type];
                return this;
            };
            Object.defineProperty(Url.prototype, "IsPlugin", {
                get: function () { return this.PluginName != null && this.PluginName != ""; },
                enumerable: true,
                configurable: true
            });
            Url.prototype.toString = function () {
                return this.getDirectory() + this.getEName();
            };
            Url.prototype.getDirectory = function () {
                var s;
                if (this.IsExternal) {
                    s = this.host + "/";
                }
                else if (this.IsRooted)
                    s = "/";
                else
                    s = "";
                if (this.path.length > 0)
                    s += this.path.join('/') + '/';
                return s;
            };
            Object.defineProperty(Url.prototype, "IsContextual", {
                get: function () {
                    return !this.IsPlugin && this._isContextual;
                },
                enumerable: true,
                configurable: true
            });
            Url.prototype.getUrl = function (url) {
                var qi = url.indexOf('?');
                var di = url.indexOf('#', qi);
                if (di !== -1) {
                    this.fragment = url.substr(di);
                    url = url.substr(0, di);
                }
                if (qi !== -1) {
                    this.params = url.substr(qi + 1);
                    url = url.substr(0, qi);
                }
                if (!__global.CaseSensitive)
                    url = url.toLowerCase();
                return url;
            };
            Url.prototype.init = function (url) {
                url = this.getUrl(url.trim());
                this._directory = null;
                var path;
                var i = url.indexOf('|');
                if (i !== -1) {
                    this.PluginName = url.substr(0, i);
                    url = url.substr(i + 1);
                }
                if (url.indexOf('//') === 0)
                    this.getHost(url = url.substr(2));
                else
                    this.getFullHost(url);
                var lp = this.path.pop();
                if (lp) {
                    this.IsFolder = false;
                    var ename = lp;
                    var iext = ename.lastIndexOf('.');
                    if (iext !== -1) {
                        this.ext = ename.substr(iext + 1);
                        this.moduleName = ename.substr(0, iext);
                    }
                    else
                        this.moduleName = ename;
                }
                else
                    this.IsFolder = true;
                return this;
            };
            Object.defineProperty(Url.prototype, "IsRooted", {
                get: function () { return this.host === '/'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "IsRelative", {
                get: function () { return !!this.IsExternal; },
                enumerable: true,
                configurable: true
            });
            Url.prototype.getHost = function (url) {
                this._isContextual = false;
                if (url === "") {
                    this.host = "//";
                    this.path = [];
                    return;
                }
                var i = url.indexOf('://');
                var pi = url.indexOf('/');
                if (pi < i) {
                    this.path = url.split('/');
                    if (pi === 0)
                        this.path.shift(), this.host = '/';
                    return;
                }
                if (i === -1)
                    throw " Invalid Url ";
                var s = url.indexOf('/', i + 3);
                this.host = s === -1 ? url : url.substr(0, s);
                this.path = s === -1 ? [""] : url.substr(s + 1).split('/');
            };
            Url.prototype.getFullHost = function (url) {
                var i = url.indexOf('://');
                var pi = url.indexOf('/');
                this._isContextual = i == -1 && pi != 0 && url[0] != '.';
                if (i === -1 || pi < i) {
                    this.path = url.split('/');
                    if (pi === 0)
                        this.path.shift(),
                            this.host = '/';
                }
                else {
                    var s = url.indexOf('/', i + 3);
                    this.host = s === -1 ? url : url.substr(0, s);
                    this.path = s === -1 ? [""] : url.substr(s + 1).split('/');
                }
            };
            Url.prototype.Combine = function (path) {
                var t = typeof path === 'string' ? new Url(path) : path;
                if (t.IsExternal)
                    return t;
                var c = new Url();
                c.host = this.host;
                c.path = this.path == null ? t.path : t.path == null ? null : this.path.concat(t.path);
                c.moduleName = t.moduleName;
                c.ext = t.ext;
                c.params = t.params;
                c.PluginName = t.PluginName;
                c.IsFolder = t.IsFolder;
                c.fragment = t.fragment;
                c.params = t.params;
                c.isAsset;
                return c;
            };
            Object.defineProperty(Url.prototype, "IsExternal", {
                get: function () { return this.host != null && this.host != "" && this.host != '/'; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "isAsset", {
                get: function () { return this.moduleType !== ModuleType.code; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "path", {
                get: function () { return this._path; },
                set: function (v) { Url.RevalidatePath(v, this.IsExternal); this._path = v; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Url.prototype, "FullPath", {
                get: function () { return this.toString(); },
                enumerable: true,
                configurable: true
            });
            Url.prototype.SameHostAs = function (url) {
                var h1 = this.IsExternal ? this.host : Url.rootUrl.host;
                var h2 = url.IsExternal ? url.host : Url.rootUrl.host;
                return h1 === h2;
            };
            Url.RevalidatePath = function (ary, isFullPath) {
                if (!ary)
                    return;
                var i;
                var part;
                for (i = 0; i < ary.length; i++) {
                    part = ary[i];
                    if (part === '.') {
                        ary.splice(i, 1);
                        i -= 1;
                    }
                    else if (part === '..') {
                        if (isFullPath) {
                            if (i == 0) {
                                ary.splice(i, 1);
                                i -= 1;
                            }
                            else {
                                ary.splice(i - 1, 2);
                                i -= 2;
                            }
                        }
                        else if (i === 0 || (i === 1 && ary[2] === '..') || ary[i - 1] === '..') {
                            continue;
                        }
                        else if (i > 0) {
                            ary.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
            };
            Url.prototype.intersect = function (url) {
                if (!this.SameHostAs(url))
                    return null;
                var c = new Url();
                c.host = this.host;
                var p1 = this.path;
                var p2 = url.path;
                var p = [];
                var pl = Math.min(p1.length, p2.length);
                return c;
            };
            Url.getUrl = function (path, name, rooted) {
                if (rooted)
                    path.unshift('.');
                return new Url(path.join('/') + '/' + (name ? name : ""));
            };
            Url.prototype.getRelativePath = function () {
                if (!this.IsExternal)
                    return this;
                var root = new Url(document.URL);
                if (!this.SameHostAs(this))
                    return this;
                if (this.IsRooted)
                    if (root._path.length === 0)
                        return Url.getUrl(this._path, this.getEName(), true);
                var min_l = Math.min(this._path.length, root._path.length);
                for (var i = 0; i < min_l; i++) {
                    if (root._path[i] === this.path[i])
                        continue;
                    var points = repeat1("..", root._path.length - i);
                    return Url.getUrl(points.concat(this.path.slice(i)), this.getEName(), true);
                }
                return Url.getUrl(this.path.slice(min_l), this.getEName(), true);
                function repeat1(s, count) {
                    var r = [];
                    for (var i = 0; i < count; i++)
                        r.push(s);
                    return r;
                }
            };
            Object.defineProperty(Url.prototype, "IsInternal", {
                get: function () {
                    return this.IsExternal ? Url.rootUrl.SameHostAs(this) : true;
                },
                enumerable: true,
                configurable: true
            });
            Url.rootUrl = new Url(document.location.href);
            return Url;
        }());
        basics.Url = Url;
    })(basics = System.basics || (System.basics = {}));
    var net;
    (function (net) {
        var Header = (function () {
            function Header(_key, _value) {
                this._key = _key;
                this._value = String(_value || "");
            }
            Object.defineProperty(Header.prototype, "key", {
                get: function () {
                    return this._key;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Header.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            return Header;
        }());
        net.Header = Header;
        var EventListener = (function () {
            function EventListener(key) {
                this.key = key;
                this._deleagtes = [];
            }
            Object.defineProperty(EventListener.prototype, "On", {
                set: function (delegate) {
                    this._deleagtes.push(delegate);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EventListener.prototype, "Off", {
                set: function (delegate) {
                    var i = this._deleagtes.indexOf(delegate);
                    if (i == -1)
                        return;
                    this._deleagtes.splice(i, 1);
                },
                enumerable: true,
                configurable: true
            });
            EventListener.prototype.call = function (_this, array, curs, l) {
                try {
                    for (curs++; curs < l; curs++)
                        this._deleagtes[curs].apply(_this, array);
                }
                catch (e) {
                }
                return curs;
            };
            EventListener.prototype.PInvoke = function (key, _this, array) {
                var curs = -1;
                var l = this._deleagtes.length;
                if (key == this.key && l > 0)
                    while (curs < l)
                        curs = this.call(_this, array, curs, l);
            };
            EventListener.prototype.Invok = function (key, callBack) {
                var l = this._deleagtes.length;
                if (key == this.key && l > 0)
                    for (var i = 0; i < l; i++)
                        try {
                            callBack(this._deleagtes[i]);
                        }
                        catch (e) {
                        }
            };
            EventListener.prototype.Add = function (delegate, key) {
                if (this._store == null)
                    this._store = [];
                if (key)
                    this._store.push({ k: key, d: delegate });
                this._deleagtes.push(delegate);
            };
            EventListener.prototype.Remove = function (key) {
                if (this._store)
                    for (var i = 0; i < this._store.length; i++) {
                        var p = this._store[i];
                        if (p.k == key) {
                            this._store.splice(i, 1);
                            i--;
                        }
                    }
            };
            return EventListener;
        }());
        net.EventListener = EventListener;
        var ResponseType;
        (function (ResponseType) {
            ResponseType[ResponseType["json"] = 0] = "json";
            ResponseType[ResponseType["Document"] = 1] = "Document";
            ResponseType[ResponseType["Text"] = 2] = "Text";
            ResponseType[ResponseType["ArrayBuffer"] = 3] = "ArrayBuffer";
            ResponseType[ResponseType["Blob"] = 4] = "Blob";
            ResponseType[ResponseType[""] = 8] = "";
        })(ResponseType = net.ResponseType || (net.ResponseType = {}));
        var WebRequestMethod;
        (function (WebRequestMethod) {
            WebRequestMethod[WebRequestMethod["Get"] = 0] = "Get";
            WebRequestMethod[WebRequestMethod["Post"] = 1] = "Post";
            WebRequestMethod[WebRequestMethod["Head"] = 2] = "Head";
            WebRequestMethod[WebRequestMethod["Put"] = 3] = "Put";
            WebRequestMethod[WebRequestMethod["Delete"] = 4] = "Delete";
            WebRequestMethod[WebRequestMethod["Options"] = 5] = "Options";
            WebRequestMethod[WebRequestMethod["Connect"] = 6] = "Connect";
        })(WebRequestMethod = net.WebRequestMethod || (net.WebRequestMethod = {}));
        var WebRequest = (function () {
            function WebRequest() {
                this.http = new XMLHttpRequest();
                this._responseType = null;
                this.key = new Object();
                this.OnComplete = new EventListener(this.key);
                this._onprogress = this._onprogress.bind(this);
                this.http.onload = this._onprogress;
                this.http.onerror = this._onprogress;
            }
            Object.defineProperty(WebRequest.prototype, "method", {
                get: function () {
                    return this._method == null ? 0 : this._method;
                },
                set: function (v) {
                    if (WebRequestMethod[v] == null)
                        return;
                    this._method = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(WebRequest.prototype, "ResponseType", {
                get: function () {
                    return this._responseType || ResponseType.Text;
                },
                set: function (v) {
                    this._responseType = v;
                },
                enumerable: true,
                configurable: true
            });
            WebRequest.prototype._onprogress = function (e) {
                if (this.http.readyState == 4) {
                    var cur = this.OnComplete;
                    if (cur) {
                        cur.PInvoke(this.key, null, [this]);
                    }
                }
                else
                    throw "";
            };
            Object.defineProperty(WebRequest.prototype, "IsSuccess", {
                get: function () { return this.http.status == 200 && this.http.readyState == 4; },
                enumerable: true,
                configurable: true
            });
            WebRequest.prototype.Download = function (url, data) {
                this.http.open(WebRequestMethod[this.method], url.toString(), true);
                this.http.setRequestHeader('allow-cross-origin', '*');
                var httpReq = this.http;
                httpReq.setRequestHeader('Access-Control-Allow-Headers', '*');
                httpReq.setRequestHeader('Content-type', '*');
                httpReq.setRequestHeader('Access-Control-Allow-Origin', '*');
                this.http.responseType = ResponseType[this.ResponseType].toLowerCase();
                if (this.method == WebRequestMethod.Get)
                    this.http.send();
                else
                    this.http.send(data.data);
            };
            Object.defineProperty(WebRequest.prototype, "Response", {
                get: function () {
                    return this.http.response;
                },
                enumerable: true,
                configurable: true
            });
            return WebRequest;
        }());
        net.WebRequest = WebRequest;
        var downloadCallback = (function () {
            function downloadCallback(callback, data, isPrivate) {
                this.callback = callback;
                this.data = data;
                this.isPrivate = isPrivate;
                this.callback = callback;
                this.data = data;
                this.isPrivate = isPrivate;
                this.IsSuccess = null;
                if (isPrivate == void 0)
                    isPrivate = false;
            }
            return downloadCallback;
        }());
        net.downloadCallback = downloadCallback;
        var __data = (function () {
            function __data(url, data) {
                this.url = url;
                this.data = data;
            }
            return __data;
        }());
        net.__data = __data;
        var Downloader = (function () {
            function Downloader() {
                this.quee = [];
                this.isRunning = false;
                this.isDownloading = false;
                this.success = [];
                this.fails = [];
                this.OnSuccess = new EventListener(1);
                this.OnFail = new EventListener(1);
                this.OnFinish = new EventListener(1);
                this.webr = new net.WebRequest();
                this.quee = [];
                this.isRunning = false;
                this.isDownloading = false;
                this.success = [];
                this.fails = [];
                this.OnSuccess = new EventListener(1);
                this.OnFail = new EventListener(1);
                this.OnFinish = new EventListener(1);
                this.webr.method = net.WebRequestMethod.Get;
                this.webr.ResponseType = net.ResponseType.Text;
                this.webr.OnComplete.Add(this.DownloadComplete.bind(this), "DCT");
            }
            Object.defineProperty(Downloader.prototype, "Request", {
                get: function () { return this.webr; },
                enumerable: true,
                configurable: true
            });
            Downloader.prototype.DownloadComplete = function (xmlRequest) {
                var x;
                this.isDownloading = false;
                if (this.webr.IsSuccess) {
                    x = this.OnSuccess;
                    this.success.push(this.current);
                }
                else {
                    x = this.OnFail;
                    this.fails.push(this.current);
                }
                try {
                    var ip = true;
                    var th = this;
                    if (th.current.data instanceof downloadCallback) {
                        try {
                            var c = th.current.data;
                            c.IsSuccess = th.webr.IsSuccess;
                            if (c.callback instanceof Function)
                                c.callback(this, c);
                        }
                        catch (e) { }
                        ip = !(c.isPrivate);
                    }
                    if (ip)
                        x.PInvoke(1, null, [th, th.current.data]);
                }
                catch (error) {
                }
                this.Next();
            };
            Downloader.prototype.Push = function (url, data) {
                this.quee.push(new __data(url, data));
                if (!this.isRunning)
                    this.Start();
            };
            Downloader.prototype.Start = function () {
                if (this.isDownloading)
                    return;
                this.isRunning = true;
                this.Next();
            };
            Downloader.prototype.Next = function () {
                if (0 == this.quee.length) {
                    this.isRunning = false;
                    this.isDownloading = false;
                    var ___this = this;
                    this.OnFinish.PInvoke(1, null, [___this, ___this.current.data]);
                    return;
                }
                var c = this.current = this.quee.shift();
                this.webr.Download(c.url, c.data);
                this.isDownloading = true;
            };
            Downloader.prototype.Restart = function () {
                this.isDownloading = false;
                this.Start();
            };
            return Downloader;
        }());
        net.Downloader = Downloader;
    })(net = System.net || (System.net = {}));
    var core;
    (function (core) {
        var counter = 0;
        var _store = {};
        var _listeners = [];
        var dic = (function () {
            function dic() {
            }
            dic.set = function (key, obj) {
                var l = this.keys.length;
                this.keys.push(key);
                this.values[l] = obj;
            };
            dic.get = function (key) {
                var i = this.keys.indexOf(key);
                if (i === -1)
                    return undefined;
                return this.values[i];
            };
            dic.getkey = function (val) {
                var i = this.values.indexOf(val);
                if (i === -1)
                    return undefined;
                return this.keys[i];
            };
            dic.registerNativeTypes = function () {
                var r = Object.getOwnPropertyNames(window);
                for (var i = 0; i < r.length; i++) {
                    var p = r[i];
                    var v = Object.getOwnPropertyDescriptor(window, p);
                    v = v.value;
                    if (v && v.prototype && v.prototype.constructor === v) {
                        this.keys.push(v);
                        this.values.push(p);
                    }
                }
                delete this.registerNativeTypes;
            };
            dic.keys = [];
            dic.values = [];
            return dic;
        }());
        core.dic = dic;
        dic.registerNativeTypes();
        var _garbage = {};
        var count = 0;
        var $freeze = Object.freeze;
        var SecureValue = (function () {
            function SecureValue(_v, count) {
                this._id = count++;
                _garbage[this._id] = { count: typeof count !== 'number' ? 1 : count, vaue: _v };
                $freeze(this);
            }
            Object.defineProperty(SecureValue.prototype, "Value", {
                get: function () {
                    var l = _garbage[this._id];
                    if (!l)
                        return undefined;
                    if (--l.count <= 0)
                        delete _garbage[this._id];
                    return l.vaue;
                },
                enumerable: true,
                configurable: true
            });
            return SecureValue;
        }());
        core.SecureValue = SecureValue;
        var Context = (function () {
            function Context(module) {
                this.context = this;
                var id = ++counter;
                $defineProperty(this, 'Id', { value: id, writable: false, configurable: false });
                _store[id] = { Module: module };
                Object.freeze(this);
                Object.preventExtensions(this);
                Object.seal(this);
            }
            Object.defineProperty(Context.prototype, "CanAccessToMe", {
                set: function (m) {
                    if (!(m instanceof Function))
                        return;
                    var config = _store[this['Id']];
                    $defineProperty(config, 'CanAccessToMe', { value: m, writable: false, configurable: false });
                },
                enumerable: true,
                configurable: true
            });
            Context.prototype.canAccessToMe = function (type, folder, name) {
                var config = _store[this['Id']];
                if (config.CanAccessToMe)
                    return config.CanAccessToMe(type, folder, name);
                return true;
            };
            Context.prototype.GetPath = function (url) {
                var config = _store[this['Id']];
                return config.Module.Folder.FullName + (url.startsWith('/') ? url.substring(1) : url);
            };
            Context.prototype.NameOf = function (type) {
                var config = _store[this['Id']];
                return config.Module.NameOf(type);
            };
            Context.prototype.GetType = function (path) {
                if (path == null)
                    return null;
                var config = _store[this['Id']];
                return config.Module.GGetType(path);
            };
            Context.prototype.GetEnum = function (path) {
                if (path == null)
                    return null;
                var config = _store[this['Id']];
                return config.Module.GGetEnum(path);
            };
            Context.prototype.GetStat = function (path) {
                if (path == null)
                    return null;
                var config = _store[this['Id']];
                return config.Module.GetStat();
            };
            Context.prototype.OnStat = function (module, stat, callback) {
                var config = _store[this['Id']];
                return config.Module.OnStatChanged(module, stat, callback);
            };
            Context.prototype.OnGStat = function (stat, callback) {
                var config = _store[this['Id']];
                return config.Module.OnGStatChanged(stat, callback);
            };
            Context.prototype.GetTemplateRoot = function (s) {
                var config = _store[this['Id']];
                var f = config.Module.Folder;
                if (typeof s === 'string') {
                    var p = new basics.Url(s);
                    f = Folder.NavigateTo(p.path, f);
                    s = p.getEName();
                    if (!f)
                        return undefined;
                }
                if (f instanceof Module)
                    return f.getRooteOfTemplate(s);
            };
            Context.prototype.SetSuperVisor = function (callback) {
                var config = _store[this['Id']];
                config.Module.RootFolder.SuperVisor = callback;
            };
            return Context;
        }());
        core.Context = Context;
        $defineProperty(Context.prototype, '__extends', { value: window['__extends'], writable: false, configurable: false, enumerable: false });
        var Module = (function () {
            function Module(folder, Url, _folderContext) {
                this.folder = folder;
                this.Url = Url;
                this._folderContext = _folderContext;
                this._stat = ModuleStat.New;
                this.Script = "";
                this._onExecuted = [];
                stack.push(this);
                Url.setDefaultType(ModuleType.code);
                this.exports = new Exports();
                this._stat = ModuleStat.New;
                this.Script = "";
                this._thisContext = new Context(this);
                this.loadLib = this.loadLib.bind(this);
                if (folder == null)
                    throw "Context errro";
                this.require = this.require.bind(this);
                this._listeners = [];
            }
            Object.defineProperty(Module.prototype, "Folder", {
                get: function () { return this.folder; },
                set: function (v) {
                    this.folder = v;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Module.prototype, "ResourceUrl", {
                get: function () {
                    return new basics.Url(this.FullName).setDefaultType(ModuleType.code);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Module.prototype, "FolderContext", {
                get: function () {
                    return this._folderContext || this.Folder;
                },
                enumerable: true,
                configurable: true
            });
            Module.prototype.call = function (toGet, callback, onerror, context) {
                if (!toGet._thisContext.canAccessToMe(this.Url.moduleType, this.Folder.FullName, this.EName))
                    return onerror ? (context == null ? onerror("access denied") : onerror.call(context, "access denied")) : null;
                return callback ? (context == null ? callback(toGet.exports) : callback.call(context, toGet.exports)) : toGet.exports;
            };
            Module.prototype.require = function (modulePath, callback, onerror, context) {
                var u = new basics.Url(modulePath);
                return (u.IsPlugin ? this.Folder : this.FolderContext)._require(modulePath, callback, onerror, context);
            };
            Module.prototype.loadLib = function (d, isOtional) {
                var c = d.indexOf('|');
                var alias = d.substr(0, c);
                var path = d.substr(c + 1);
                if ((isOtional(path.indexOf('*') == 0)))
                    path = path.substr(1);
                return this.RootFolder.LoadAssembly(this.Folder, path, alias);
            };
            Object.defineProperty(Module.prototype, "OnExecuted", {
                set: function (v) {
                    if (typeof v === 'function')
                        v = { callback: v, Owner: this };
                    if (this._stat >= ModuleStat.Executed)
                        v.callback.call(v.Owner, this, v);
                    else
                        this._onExecuted.push(v);
                },
                enumerable: true,
                configurable: true
            });
            Module.prototype.checkOverflow = function () {
                var r = [];
                Module.checkOverflow(this, this, r, []);
                if (r.length != 0) {
                    console.log(this.FullName);
                }
                return r;
            };
            Module.checkOverflow = function (find, start, rslt, checked) {
                if (checked.indexOf(start) !== -1)
                    return;
                checked.push(start);
                if (!start.args)
                    return;
                var d = start.args.Dependencies;
                if (!d)
                    return;
                for (var i = 0; i < d.length; i++) {
                    var x = d[i].module;
                    if (x === find) {
                        rslt.push({ module: find, arg: d[i] });
                    }
                    else if (x instanceof Module)
                        Module.checkOverflow(find, x, rslt, checked);
                }
            };
            Module.prototype.onModuleExecuted = function () {
                var i = stack.indexOf(this);
                if (i !== -1)
                    stack.splice(i, 1);
                var l = this._onExecuted.splice(0);
                for (var i = 0; i < l.length; i++) {
                    var c = l[i];
                    c.callback && c.callback.call(c.Owner, this, c);
                }
            };
            Module.prototype.NameOf = function (type) {
                return root.NameOf(type);
            };
            Module.prototype.GGetType = function (path) {
                var c = dic.getkey(path);
                if (c != null)
                    return c;
                c = root.GetType(path.split('.'));
                if (c === undefined)
                    return undefined;
                dic.set(c, path);
                return c;
            };
            Module.getNativeTypes = function () {
                var r = Object.getOwnPropertyNames(window);
                for (var i = 0; i < r.length; i++) {
                    var p = r[i];
                    var v = window[i];
                    if (v && v.prototype && v.prototype.constructor === v)
                        dic.set(v, p);
                }
            };
            Module.isConstructor = function (v) {
                return v && v.prototype && v.prototype.constructor === v;
            };
            Module.prototype.GGetEnum = function (path, global) {
                if (!global) {
                    var c = dic.getkey(path);
                    if (c != null)
                        return c;
                    c = root.getRadical().GetEnum(path.split('.'));
                    if (c === undefined)
                        return undefined;
                    dic.set(c, path);
                    return c;
                }
                else {
                    var ds = this.args.Dependencies;
                    for (var i = 0; i < ds.length; i++) {
                        var d = ds[i].module;
                        if (d instanceof Module && d.Url.moduleType === ModuleType.code) {
                            var x = d.GetEnum(path.split('.'));
                            if (x)
                                return x;
                        }
                    }
                }
            };
            Module.prototype.GetStat = function () {
                return this._stat;
            };
            Module.prototype.OnStatChanged = function (module, stat, callback) {
                var m = module ? this.GetModule(module) : this;
                var s = m.Stat;
                if (s >= stat) {
                    var ns = callback(this, module, s, stat);
                    if (typeof ns === 'number') {
                        if (ns <= s)
                            return;
                        else
                            stat = ns;
                    }
                    else
                        return;
                }
                m._listeners.push({ t: this, m: module, s: stat, c: callback });
            };
            Module.prototype.OnGStatChanged = function (stat, callback) {
                _listeners.push({ t: this, m: this, s: stat, c: callback });
            };
            Module.prototype.GetType = function (path) {
                var c = this.exports;
                for (var i = 0; i < path.length; i++) {
                    c = c[path[i]];
                    if (c === undefined)
                        return undefined;
                }
                return c instanceof Function ? c : undefined;
            };
            Module.prototype.GetEnum = function (path) {
                var c = this.exports;
                for (var i = 0; i < path.length; i++) {
                    c = c[path[i]];
                    if (c === undefined)
                        return undefined;
                }
                return typeof c === 'object' ? c : undefined;
            };
            Module.prototype.onStatChanged = function (_old, _new) {
                for (var i = 0; i < this._listeners.length; i++) {
                    var l = this._listeners[i];
                    if (l.s > _old && l.s <= _new) {
                        try {
                            var ns = l.c(l.t.FullName, this.FullName, _new, l.s);
                            if (typeof ns === 'number') {
                                if (ns > l.s) {
                                    l.s = ns;
                                    continue;
                                }
                            }
                        }
                        catch (e) {
                        }
                        this._listeners.splice(i, 1);
                        i--;
                    }
                }
            };
            Module.prototype.onGStatChanged = function (_old, _new) {
                for (var _i = 0, _listeners_1 = _listeners; _i < _listeners_1.length; _i++) {
                    var l = _listeners_1[_i];
                    if (l.s > _old && l.s <= _new) {
                        try {
                            var ns = l.c(l.t.FullName, this.FullName, _new, l.s);
                            if (typeof ns === 'number' && ns > l.s)
                                l.s = ns;
                        }
                        catch (e) {
                        }
                    }
                }
            };
            Object.defineProperty(Module.prototype, "Stat", {
                get: function () {
                    return this._stat;
                },
                set: function (v) {
                    if (v == this._stat)
                        return;
                    if (v < this._stat)
                        return;
                    var lv = this._stat;
                    this._stat = v;
                    if (v >= ModuleStat.Executed)
                        this.onModuleExecuted();
                    this.onStatChanged(lv, v);
                    this.onGStatChanged(lv, v);
                    if (v == 7) {
                        this._stat = 0;
                        this._fn = null;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Module.prototype, "Name", {
                get: function () { return this.Url.moduleName; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Module.prototype, "EName", {
                get: function () { return this.Url.getEName(this.Url.isAsset ? undefined : 'js'); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Module.prototype, "FullName", {
                get: function () {
                    if (this._fn == null)
                        this._fn = this.Folder.FullName + this.EName;
                    return this._fn;
                },
                enumerable: true,
                configurable: true
            });
            Module.loadEntryPoint = function (src) {
                var scr = src || document.currentScript;
                var app = scr.getAttribute('entry-point');
                if (app != undefined) {
                    scr.removeAttribute('entry-point');
                    var url = new System.basics.Url(app);
                    if (url.IsPlugin) {
                        if (app.indexOf('lib:') === 0) {
                            root._stat = AssemblyStat.Executed;
                            var lib = root.LoadAssemblyByUrl(url);
                            lib.OnExecuted = function (ass, e) {
                                if (ass.EntryPoint) {
                                    lib.EntryPoint.OnExecuted = function (m, e) {
                                        var o = m.exports;
                                        if (m.Stat === 6)
                                            o.Start && o.Start();
                                        else
                                            alert('we cannot find app');
                                    };
                                }
                            };
                        }
                        else
                            throw "";
                    }
                    else
                        root.LoadEntryPoint(url);
                    return true;
                }
                return false;
            };
            Module.Init = function () {
                if (document.currentScript && this.loadEntryPoint())
                    return;
                var scrs = Array.prototype.slice.call(document.getElementsByTagName('script'), 0);
                for (var i = 0; i < scrs.length; i++) {
                    var scr = scrs[i];
                    if (this.loadEntryPoint(scr))
                        return;
                }
            };
            Object.defineProperty(Module.prototype, "RootFolder", {
                get: function () {
                    return this.Folder.Root;
                },
                enumerable: true,
                configurable: true
            });
            Module.prototype.GetModule = function (url) {
                if (typeof url === 'string')
                    url = new basics.Url(url);
                return (!url.IsContextual || this.Url.isAsset ? this.Folder : this.FolderContext).GetModule(url);
            };
            Module.id = 0;
            return Module;
        }());
        core.Module = Module;
        var Folder = (function () {
            function Folder(Parent, Name) {
                this.Parent = Parent;
                this.Name = Name;
                if (Parent === Folder.Me)
                    this.Parent = this;
                this.Modules = new Modules();
                this.Assets = new Modules();
                this.subFolders = new SubsFolder(this);
                this.require = this.require.bind(this);
                this.define = this.define.bind(this);
                this.define.amd = {};
                if (Parent == null)
                    throw "Parent is null";
            }
            Folder.prototype.LoadAssemblyByUrl = function (url) {
                if (!url.IsPlugin)
                    throw "";
                var alias = url.PluginName.substr(4, url.PluginName.length - 4);
                var path = url.FullPath;
                if (path.indexOf('*') == 0)
                    path = path.substr(1);
                return this.Root.LoadAssembly(this, path, alias);
            };
            Object.defineProperty(Folder.prototype, "ResourceUrl", {
                get: function () {
                    return new basics.Url(this.FullName);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Folder.prototype, "IsAssemby", {
                get: function () {
                    return this instanceof Assembly;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Folder.prototype, "Root", {
                get: function () {
                    var t = this;
                    while (!(t instanceof Assembly))
                        t = t.Parent;
                    return t;
                },
                enumerable: true,
                configurable: true
            });
            Folder.prototype.GetFolder = function (url, see) {
                if (!url)
                    return this;
                var path = url.path;
                var f;
                if (url.IsExternal)
                    if (url.IsInternal)
                        f = this.Root;
                    else {
                        f = global.createPath([url.host], see);
                    }
                else if (url.IsRooted)
                    f = this.Root;
                else
                    f = this;
                return f.createPath(url.path, see);
            };
            Folder.prototype.GetModule = function (url) {
                if (typeof url === 'string')
                    url = new basics.Url(url);
                if (url.IsFolder)
                    throw "Invalid FileName Path :" + url.FullPath;
                url.setDefaultType(ModuleType.code);
                var folder = this.GetFolder(url);
                var ressource = url.isAsset === true ? folder.Assets : folder.Modules;
                var module = ressource.getModule(url);
                if (module == null) {
                    ressource.setModule(module = new Module(folder, url, this));
                    this.Root.OnModuleExecuting(module);
                }
                return module;
            };
            Object.defineProperty(Folder.prototype, "FullName", {
                get: function () {
                    if (!this._fn) {
                        if (this == this.Parent)
                            return this._fn = this.Name + '/';
                        var p = this.Parent;
                        this._fn = (p == null ? "" : p.FullName) + this.Name + '/';
                    }
                    return this._fn;
                },
                enumerable: true,
                configurable: true
            });
            Folder.prototype.createPath = function (modulePath, see) {
                return Folder.CreatePath(modulePath, this, see);
            };
            Folder.prototype.NafigateTo = function (pathString) {
                var path = new basics.Url(pathString);
                var f = Folder.NavigateTo(path.path, this);
                if (f && path.moduleName)
                    return f.GetModule(path.getEName());
                return f;
            };
            Folder.NavigateTo = function (urlPath, cf) {
                for (var i = 0, l = urlPath.length; i < l; i++) {
                    var folderName = urlPath[i];
                    folderName = folderName.trim();
                    switch (folderName) {
                        case '~':
                            cf = root;
                            break;
                        case '':
                        case '.':
                            continue;
                        case '..':
                            cf = cf && cf.Parent;
                            continue;
                        default:
                            if (!cf)
                                return undefined;
                            else {
                                var f = cf.subFolders.GetFolder(folderName);
                                if (!f)
                                    return undefined;
                                continue;
                            }
                    }
                }
                return cf;
            };
            Folder.CreatePath = function (urlPath, cf, see) {
                if (!urlPath)
                    return cf;
                for (var i = 0, l = urlPath.length; i < l; i++) {
                    if (see && !cf)
                        return undefined;
                    var folderName = urlPath[i];
                    folderName = folderName.trim();
                    switch (folderName) {
                        case '~':
                            cf = root;
                            break;
                        case '':
                        case '.':
                            continue;
                        case '..':
                            cf = cf && cf.Parent;
                            continue;
                        default:
                            if (!cf)
                                cf = see ? null : new Folder(null, folderName);
                            else {
                                var f = cf.subFolders.GetFolder(folderName);
                                cf = f ? f : (see ? null : cf.subFolders.createFolder(folderName));
                                continue;
                            }
                    }
                }
                return cf;
            };
            Folder.prototype._nameOf = function (type) {
                var s = this.Modules._store;
                for (var i in s) {
                    var m = s[i];
                    var fn = Type.GetType(type, m.exports);
                    if (fn != null)
                        return fn;
                }
                var s1 = this.subFolders._store;
                for (var i in s1) {
                    var f = s1[i];
                    var fn = f._nameOf(type);
                    if (fn != null)
                        return fn;
                }
            };
            Folder.prototype.NameOf = function (type) {
                var fn = dic.get(type);
                if (fn != undefined)
                    return fn;
                fn = this._nameOf(type);
                if (fn != null)
                    dic.set(type, fn);
                return fn;
            };
            Folder.prototype.GetType = function (path) {
                var s = this.Modules._store;
                for (var i in s) {
                    var m = s[i];
                    var fn = m.GetType(path);
                    if (fn !== undefined)
                        return fn;
                }
                var s1 = this.subFolders._store;
                for (var i in s1) {
                    var f = s1[i];
                    var fn = f.GetType(path);
                    if (fn !== undefined)
                        return fn;
                }
                return undefined;
            };
            Folder.prototype.GetEnum = function (path) {
                var s = this.Modules._store;
                for (var i in s) {
                    var m = s[i];
                    var fn = m.GetEnum(path);
                    if (fn !== undefined)
                        return fn;
                }
                var s1 = this.subFolders._store;
                for (var i in s1) {
                    var f = s1[i];
                    fn = f.GetEnum(path);
                    if (fn !== undefined)
                        return fn;
                }
                return undefined;
            };
            Folder.prototype.getRadical = function () {
                var folder = this;
                var child = null;
                parent = folder;
                do {
                    var parent = folder.Parent;
                    if (!parent || folder == parent)
                        return folder;
                    folder = parent;
                } while (true);
            };
            Folder.prototype.define = function () {
                var moduleName = arguments[0];
                var s = 0;
                var module;
                if (typeof arguments[0] === 'string') {
                    module = this.GetModule(arguments[0]);
                    if (module.Stat > 2)
                        throw 'module ' + module.FullName + ' exist';
                    module._folderContext = this;
                    module.Stat = ModuleStat.Downloaded;
                }
                else {
                    s = -1;
                    module = new Module(this, new basics.Url('code|@anonymouse' + (++this.anonymouseCounter) + '.js'), this);
                }
                if (this.Root.CheckIfToSkip(module))
                    module.Stat = ModuleStat.Failed;
                else
                    managers.CodeManager.asyncLoadDependencies(module, arguments[1 + s], arguments[2 + s]);
            };
            Folder.prototype.require = function () {
                if (typeof arguments[1] !== 'string')
                    return this._require.apply(this, arguments);
                return Assembly.prototype.LoadAssembly.call(this.Root, this, arguments[0], arguments[1], arguments[2]);
            };
            Folder.prototype._require = function (modulePath, callback, onerror, context) {
                if (typeof modulePath == 'string') {
                    var module = this.GetModule(modulePath);
                    if (module.Stat == ModuleStat.Executed)
                        return this.call(module, callback, onerror, context);
                    else if (module.Stat == ModuleStat.Failed)
                        return onerror && onerror.call(context, 'module failed to execute');
                    else if (module.Stat >= ModuleStat.Downloading) {
                        var fid = Date.now();
                        module.OnExecuted = { callback: function (d) { this.call(d, callback, onerror, context); }, Owner: this };
                    }
                    else if (module.Stat == ModuleStat.New) {
                        module.OnExecuted = { callback: function (d) { this.call(d, callback, onerror, context); }, Owner: this };
                        moduleDownloader.Download(module);
                    }
                    return null;
                }
            };
            Folder.prototype.call = function (toGet, callback, onerror, context) {
                if (!toGet._thisContext.canAccessToMe(-1, this.FullName, this.Name))
                    return onerror ? (context == null ? onerror("access denied") : onerror.call(context, "access denied")) : null;
                return callback ? (context == null ? callback(toGet.exports) : callback.call(context, toGet.exports)) : toGet.exports;
            };
            Folder.prototype.getRooteOfTemplate = function (s, parsed) {
                if (!parsed)
                    parsed = [];
                else if (parsed.indexOf(this) !== -1 || this == null)
                    return;
                parsed.push(this);
                for (var i in this.Assets._store) {
                    var m = this.Assets._store[i];
                    if (m.Url.moduleType === ModuleType.template) {
                        var x = m.exports;
                        var c = x.template.get(s);
                        if (c)
                            return c;
                    }
                }
                for (var i in this.subFolders._store) {
                    var f = this.subFolders._store[i];
                    var xm = f.getRooteOfTemplate(s, parsed);
                    if (xm)
                        return xm;
                }
                if (this.Parent)
                    return this.Parent.getRooteOfTemplate(s, parsed);
            };
            Folder.prototype.ConvertToAssembly = function (alias, url) {
                if (this instanceof Assembly)
                    return this;
                var c = new Assembly(alias, url);
                return c.Replace(this, null);
            };
            Folder.prototype.Replace = function (f, parentAssembly) {
                if (!f)
                    if (!parentAssembly)
                        throw "unvalid arguments";
                    else
                        p = parentAssembly;
                else {
                    this.subFolders._store = f.subFolders._store;
                    this.Modules._store = f.Modules._store;
                    this.Assets._store = f.Assets._store;
                    for (var fn in f.subFolders._store) {
                        var fx_1 = this.subFolders._store[fn];
                        if (!(fx_1 instanceof Assembly))
                            fx_1.Parent = this;
                    }
                    for (var fn in f.Modules._store) {
                        var fx = f.Modules._store[fn];
                        fx.Folder = this;
                    }
                    for (var fn in f.Assets._store) {
                        var fx = f.Assets._store[fn];
                        fx.Folder = this;
                    }
                    p.subFolders.deleteFolder(f);
                    var p = parentAssembly || f.Parent;
                }
                if (!(this instanceof Assembly))
                    this.Parent = p;
                var prnt = root.GetFolder(this.ResourceUrl.ParentDirectory);
                p.subFolders.register(this);
                if (prnt != p)
                    prnt.subFolders.register(this);
                return this;
            };
            Folder.prototype.collectAssets = function (t, c) {
                if (c.indexOf(this) != -1)
                    return true;
                for (var i in this.subFolders._store)
                    this.subFolders._store[i].collectAssets(t, c);
                for (var i in this.Assets._store)
                    t.push(this.Assets._store[i]);
            };
            Folder.Me = new Object();
            return Folder;
        }());
        var AssemblyStat;
        (function (AssemblyStat) {
            AssemblyStat[AssemblyStat["New"] = 0] = "New";
            AssemblyStat[AssemblyStat["Executing"] = 1] = "Executing";
            AssemblyStat[AssemblyStat["Executed"] = 2] = "Executed";
        })(AssemblyStat = core.AssemblyStat || (core.AssemblyStat = {}));
        var Process;
        (function (Process) {
            var _store = {};
            function setAssembly(absoluteUrl, ass) {
                var n = absoluteUrl.FullPath.toLowerCase();
                if (!n)
                    _store[absoluteUrl.FullPath.toLowerCase()] = ass;
                else if (ass != _store[n])
                    throw "Conflit assembly";
            }
            Process.setAssembly = setAssembly;
            function getAssembly(url) {
                return _store[url.FullPath.toLowerCase()];
            }
            Process.getAssembly = getAssembly;
        })(Process || (Process = {}));
        var Assembly = (function (_super) {
            __extends(Assembly, _super);
            function Assembly(alias, url) {
                var _this = _super.call(this, Folder.Me, alias) || this;
                _this.Assemblies = new Assemblies();
                _this._stat = 0;
                _this.pendingAssemblies = 0;
                _this.pending = 0;
                _this.NModulesFail = 0;
                _this.modules = [];
                _this._onExecuted = [];
                _this.modulePrototypes = [];
                _this.onModuleExecuted = _this.onModuleExecuted.bind(_this);
                _this.OnAssemblyDependencyExecuted = _this.OnAssemblyDependencyExecuted.bind(_this);
                if (!url.IsFolder)
                    throw "Invalid assembly Path";
                _this.resourceUrl = url;
                return _this;
            }
            Object.defineProperty(Assembly.prototype, "SuperVisor", {
                set: function (v) { this._superVisor = v; },
                enumerable: true,
                configurable: true
            });
            Assembly.prototype.CheckIfToSkip = function (module) {
                return this._superVisor && this._superVisor(module.Url);
            };
            Assembly.prototype.LoadEntryPoint = function (modulePath) {
                var module = this.CreateEntryPoint(modulePath);
                this.EntryPoint = module;
            };
            Assembly.prototype.collectAssets = function (t, c) {
                if (_super.prototype.collectAssets.call(this, t, c))
                    return;
                for (var i in this.Assemblies._store) {
                    var x = this.Assemblies._store[i];
                    x.collectAssets(t, c);
                }
            };
            Object.defineProperty(Assembly.prototype, "Stat", {
                get: function () { return this._stat; },
                enumerable: true,
                configurable: true
            });
            Assembly.prototype.GetModuleOnStat = function (stat) {
                if (stat === void 0) { stat = 7; }
                var t = [];
                for (var i = 0; i < this.modules.length; i++) {
                    if (this.modules[i]._stat == stat)
                        t.push(this.modules[i]);
                }
                return t;
            };
            Object.defineProperty(Assembly.prototype, "EntryPoint", {
                get: function () { return this.entryPoint; },
                set: function (v) {
                    if (this.entryPoint != null)
                        throw "Invalide stat";
                    this.entryPoint = v;
                    v.OnExecuted = this.OnEntryPointExecuted.bind(this);
                    moduleDownloader.Download(v);
                },
                enumerable: true,
                configurable: true
            });
            Assembly.prototype.OnEntryPointExecuted = function (m, e) {
                if (this.pendingAssemblies == 0) {
                    if (this.pending == 0 && this._stat < AssemblyStat.Executed)
                        this.OnAssemblyExecuted();
                }
                this.startDownloadModules();
            };
            Object.defineProperty(Assembly.prototype, "IsEntryPointExecuted", {
                get: function () { return this.entryPoint._stat > 5; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Assembly.prototype, "FullName", {
                get: function () {
                    return this.resourceUrl.FullPath;
                },
                enumerable: true,
                configurable: true
            });
            Assembly.prototype.Register = function (assemby) {
                var f = this.subFolders._store[assemby.Name];
                if (f instanceof Assembly)
                    if (f !== assemby)
                        throw "unvalid stat";
                    else
                        return;
                else {
                    var c = assemby.Replace(f, this);
                    this.Assemblies.setAssembly(assemby);
                    return c;
                }
            };
            Assembly.prototype.GetAssembly = function (alias) {
                return this.Assemblies.getAssembly(alias);
            };
            Assembly.prototype.OnModuleExecuting = function (module) {
                this.modules.push(module);
                if (this._stat < AssemblyStat.Executed) {
                    this.pending++;
                    module.OnExecuted = this.onModuleExecuted;
                }
            };
            Assembly.prototype.OnAssemblyExecuted = function () {
                this._stat = AssemblyStat.Executed;
                var l = this._onExecuted.splice(0);
                for (var i = 0; i < l.length; i++) {
                    var c = l[i];
                    c.callback && c.callback.call(c.Owner, this, c);
                }
            };
            Assembly.prototype.onModuleExecuted = function (m, e) {
                this.pending--;
                if (this.pending == 0)
                    this.OnAssemblyExecuted();
            };
            Object.defineProperty(Assembly.prototype, "OnExecuted", {
                set: function (v) {
                    if (typeof v === 'function')
                        v = { callback: v, Owner: this };
                    if (this._stat >= AssemblyStat.Executed)
                        v.callback.call(v.Owner, this, v);
                    else
                        this._onExecuted.push(v);
                },
                enumerable: true,
                configurable: true
            });
            Assembly.prototype.OnAssemblyDependencyExecuted = function (m, e) {
                this.pendingAssemblies--;
                if (this.pendingAssemblies == 0)
                    this.startDownloadModules();
            };
            Assembly.prototype.startDownloadModules = function () {
                var p;
                while (p = this.modulePrototypes.shift())
                    managers.CodeManager.loadDependencies(p.module, p.dependencies, p.callback);
                this.CheckIfAssemblyExecuted();
            };
            Assembly.prototype.PushModule = function (m, depen, callback) {
                m.Stat = ModuleStat.Defining;
                if (m == this.entryPoint || !this.deferedNonGlobalAssemblies)
                    this.loadLibs(m, depen, callback);
                if (this.IsEntryPointExecuted) {
                    thread.Dispatcher.call(null, managers.CodeManager.loadDependencies, m, depen, callback);
                }
                else if (this.Stat < AssemblyStat.Executed)
                    this.modulePrototypes.push({ module: m, dependencies: depen, callback: callback });
                else
                    managers.CodeManager.loadDependencies(m, depen, callback);
            };
            Assembly.prototype.loadLibs = function (m, dependencies, callback) {
                var ass = m.RootFolder;
                var isOptional;
                for (var i = 0, l = dependencies.length; i < l; i++) {
                    var d = dependencies[i];
                    if (d.indexOf('lib:') == 0) {
                        var c = d.indexOf('|');
                        var alias = d.substr(4, c - 4);
                        var path = d.substr(c + 1);
                        if ((isOptional = path.indexOf('*') == 0))
                            path = path.substr(1);
                        var x = this.LoadAssembly(m.Folder, path, alias);
                    }
                }
            };
            Assembly.prototype.CheckIfAssemblyExecuted = function () {
                if (this.pendingAssemblies != 0)
                    return;
                if (this.pending != 0)
                    return;
                this.OnAssemblyExecuted();
            };
            Assembly.prototype.CreateEntryPoint = function (url) {
                var folder = this.GetFolder(url.Directory, false);
                var module;
                folder.Modules.setModule(module = new Module(folder, url, this));
                return module;
            };
            Assembly.prototype.LoadAssembly = function ($this, absolutePath, alias) {
                if (typeof absolutePath === 'string' && absolutePath.indexOf('<') == 0) {
                    absolutePath = absolutePath.substr(1);
                    absolutePath = root.ResourceUrl.Combine(absolutePath);
                }
                else
                    absolutePath = $this.ResourceUrl.Combine(absolutePath);
                if (absolutePath.IsFolder) {
                    var assemblyPath = absolutePath;
                    var entryPointPath = absolutePath.Combine('index.js');
                }
                else {
                    entryPointPath = absolutePath;
                    assemblyPath = absolutePath.Directory;
                }
                entryPointPath.setDefaultType(ModuleType.code);
                var assembly = this.GetAssembly(alias);
                if (!assembly) {
                    var folder = root.GetFolder(assemblyPath, true);
                    if (folder instanceof Assembly)
                        assembly = folder;
                    else if (!(assembly = Process.getAssembly(assemblyPath))) {
                        assembly = new Assembly(alias, assemblyPath);
                        assembly.LoadEntryPoint(new basics.Url(entryPointPath.getEName('js')));
                    }
                    this.Register(assembly);
                }
                else if (assembly.Stat >= AssemblyStat.Executed)
                    return assembly;
                this.pendingAssemblies++;
                assembly.OnExecuted = this.OnAssemblyDependencyExecuted;
                return assembly;
            };
            return Assembly;
        }(Folder));
        core.Assembly = Assembly;
        var SubsFolder = (function () {
            function SubsFolder(folder) {
                this.folder = folder;
                this._store = {};
            }
            SubsFolder.prototype.register = function (folder) {
                this._store[folder.Name.toLowerCase().trim()] = folder;
            };
            SubsFolder.prototype.GetFolder = function (folderName) {
                return this._store[folderName.toLowerCase().trim()];
            };
            SubsFolder.prototype.createFolder = function (foldername) {
                var t = new Folder(this.folder, foldername);
                this._store[foldername.toLowerCase().trim()] = t;
                return t;
            };
            SubsFolder.prototype.deleteFolder = function (folder) {
                if (folder.Parent !== this.folder)
                    throw "unvalid operation";
                if (!(folder instanceof Assembly))
                    folder.Parent = null;
                delete this._store[folder.Name.toLowerCase().trim()];
            };
            return SubsFolder;
        }());
        var Modules = (function () {
            function Modules() {
                this._store = {};
                this.OnExecuted = new net.EventListener(1);
                this._store = {};
                this.OnExecuted = new net.EventListener(1);
            }
            Modules.prototype.getModule = function (url) {
                return this._store[url.getEName(url.isAsset ? undefined : 'js')];
            };
            Modules.prototype.setModule = function (_module) {
                this._store[_module.EName] = _module;
            };
            return Modules;
        }());
        var Assemblies = (function () {
            function Assemblies() {
                this._store = {};
            }
            Assemblies.prototype.getAssembly = function (alias) {
                return this._store[alias];
            };
            Assemblies.prototype.setAssembly = function (_module) {
                this._store[_module.Name] = _module;
            };
            return Assemblies;
        }());
        var Type = (function () {
            function Type() {
            }
            Type._getPath = function (root) {
                if (root.constructor === Object || root.constructor === Exports)
                    for (var i in root) {
                        var v = root[i];
                        if (v == null)
                            continue;
                        if (this.passed.indexOf(v) !== -1)
                            continue;
                        this.passed.push(v);
                        switch (typeof v) {
                            case 'string':
                            case 'number':
                            case 'boolean':
                            case 'undefined': continue;
                            default:
                                if (v === this.type) {
                                    return i;
                                }
                                if (v instanceof Function)
                                    continue;
                                var x = this._getPath(v);
                                if (x != null)
                                    return i + "." + x;
                                break;
                        }
                    }
                return null;
            };
            Type.GetType = function (type, root) {
                this.type = type;
                this.passed.length = 0;
                return this._getPath(root);
            };
            Type.passed = [];
            return Type;
        }());
        var Dependency = (function () {
            function Dependency(Args, module, Index) {
                this.Args = Args;
                this.module = module;
                this.Index = Index;
            }
            return Dependency;
        }());
        var Exports = (function () {
            function Exports(x) {
                if (x)
                    for (var c in x)
                        this[c] = x[c];
                else
                    return;
                Object.freeze(this);
                Object.seal(this);
            }
            return Exports;
        }());
        core.Exports = Exports;
        var Args = (function () {
            function Args(Module, callback) {
                this.Module = Module;
                this.callback = callback;
                this.Dependencies = [];
                this.nsuccess = 0;
                this.onModuleExecuted = this.onModuleExecuted.bind(this);
                Module.args = this;
                args.push(this);
            }
            Args.prototype.createDependency = function (module, index, isOptional) {
                var t = new Dependency(this, module, index);
                this.Dependencies[index] = t;
                if (module instanceof Assembly) {
                    if (!isOptional)
                        if (module.Stat < AssemblyStat.Executed)
                            module.OnExecuted = this.onAssemblyExecuted.bind(this);
                        else
                            this.nsuccess++;
                    else
                        this.nsuccess++;
                }
                else if (!(module instanceof Module)) {
                    this.nsuccess++;
                }
                else {
                    if (isOptional)
                        this.nsuccess++;
                    if (module.Stat >= ModuleStat.Executed)
                        this.nsuccess++;
                    else {
                        if (!isOptional)
                            module.OnExecuted = this.onModuleExecuted;
                        if (module.Stat === ModuleStat.New)
                            moduleDownloader.Download(module);
                    }
                }
                return t;
            };
            Args.prototype.onAssemblyExecuted = function (assembly, e) {
                this.nsuccess++;
                this.checkNSuccess();
            };
            Args.prototype.onModuleExecuted = function (module) {
                this.nsuccess++;
                this.checkNSuccess();
            };
            Args.prototype.checkNSuccess = function () {
                if (this.nsuccess >= this.Dependencies.length) {
                    this.nsuccess = Number.NEGATIVE_INFINITY;
                    this.Execute();
                }
            };
            Args.prototype.populateArgs = function () {
                var _ = new Array(this.Dependencies.length);
                var $ = this.Dependencies;
                for (var i = 0, l = $.length; i < l; i++) {
                    var m = $[i].module;
                    if (m instanceof Module)
                        _[i] = this.Module.call(m);
                    else if (m instanceof Assembly)
                        _[i] = {
                            require: m.require,
                            define: m.define,
                            entryPoint: m.EntryPoint.call(m.EntryPoint)
                        };
                    else
                        _[i] = m;
                }
                this._args = _;
            };
            Args.prototype.Execute = function () {
                this.populateArgs();
                var mod = this.Module;
                try {
                    mod.Stat = ModuleStat.Executing;
                    if (mod.Stat >= ModuleStat.Executed)
                        return;
                    if (mod.RootFolder.CheckIfToSkip(mod))
                        return;
                    var exp = this.callback.apply(mod._thisContext, this._args);
                    if (exp) {
                        var e = mod.exports;
                        if (typeof exp === 'function') {
                            mod.exports = exp;
                            exp.__export__ = e;
                        }
                        else if (typeof exp !== 'object') {
                            if (!e.Default)
                                e.Default = exp;
                            else if (e.Default instanceof Array)
                                e.Default.push(exp);
                            else
                                e.Default = [e.Default, exp];
                        }
                        else
                            $clone(mod.exports, exp);
                    }
                    mod.Stat = ModuleStat.Executed;
                }
                catch (e) {
                    mod.Stat = ModuleStat.Failed;
                }
            };
            Args.prototype.Invoke = function () {
                if (this.nsuccess >= this.Dependencies.length)
                    this.Execute();
            };
            Args.prototype.getUnExecuted = function () {
                var t = [];
                this.Dependencies.forEach(function (v, i, a) { if (v.module instanceof Module)
                    if (v.module.Stat < 6)
                        this.push(v.module); }, t);
                return t;
            };
            Args.prototype.getUnSuccessed = function () {
                var t = [];
                this.Dependencies.forEach(function (v, i, a) {
                    if (v.module instanceof Module)
                        if (v.module.Stat > 6)
                            this.push(v.module);
                }, t);
                return t;
            };
            Args.getUnExecuted = function () {
                var t = [];
                args.every(function (v, i, a) {
                    var r = v.getUnExecuted();
                    if (r.length !== 0)
                        t.push({ m: v.Module, r: r });
                    return true;
                }, t);
                return t;
            };
            Args.getUnSuccessed = function () {
                var t = [];
                args.every(function (v, i, a) {
                    var r = v.getUnSuccessed();
                    if (r.length !== 0)
                        t.push({ m: v.Module, r: r });
                    return true;
                }, t);
                return t;
            };
            return Args;
        }());
        core.Args = Args;
        function initialize() {
            http = new net.Downloader();
            moduleDownloader = new ModuleDownoader();
            global = new Assembly("/", new basics.Url("//"));
            var x = basics.Url.rootUrl.path.slice();
            x.unshift(basics.Url.rootUrl.host);
            var rt = basics.Url.rootUrl;
            if (!rt.IsFolder)
                rt = rt.Directory;
            root = new Assembly(x.join('/'), rt);
            global.Stat = AssemblyStat.Executed;
            OnModuleCreated = [];
            _listeners = [];
            Module.Init();
            window['global'] = {
                root: root,
                global: global
            };
        }
        core.initialize = initialize;
        var OperationPhase;
        (function (OperationPhase) {
            OperationPhase[OperationPhase["Initializer"] = 0] = "Initializer";
            OperationPhase[OperationPhase["Downloader"] = 1] = "Downloader";
            OperationPhase[OperationPhase["Definer"] = 2] = "Definer";
            OperationPhase[OperationPhase["Executer"] = 3] = "Executer";
        })(OperationPhase = core.OperationPhase || (core.OperationPhase = {}));
        var thread;
        (function (thread) {
            var jobs = {};
            var isRunning = false;
            var id = -1;
            var stack = [];
            var djobs = [];
            var cj = 0;
            ;
            var JobParam = (function () {
                function JobParam(id, params) {
                    this.id = id;
                    this.params = params || [];
                }
                JobParam.prototype.Set = function () {
                    var params = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        params[_i] = arguments[_i];
                    }
                    var p;
                    for (var i = params.length - 1; i >= 0; i--)
                        if ((p = params[i]) === undefined)
                            continue;
                        else
                            this.params[i] = p;
                    return this;
                };
                JobParam.prototype.Set1 = function (params) {
                    var p;
                    for (var i = params.length - 1; i >= 0; i--)
                        if ((p = params[i]) === undefined)
                            continue;
                        else
                            this.params[i] = p;
                    return this;
                };
                JobParam.prototype.Clone = function () {
                    var t = new JobParam(this.id);
                    t.Set1(this.params);
                    return t;
                };
                return JobParam;
            }());
            thread.JobParam = JobParam;
            var OnIdle = [];
            var isIdle;
            function asIdle() {
                isIdle = true;
                var idls = OnIdle.slice();
                for (var i = 0; i < idls.length; i++) {
                    try {
                        var t = idls[i];
                        t.callback.call(t.owner);
                    }
                    catch (e) {
                    }
                }
                isIdle = false;
                if (stack.length != 0) {
                    clearTimeout(id);
                    id = setTimeout(Dispatcher.start, 0);
                    isRunning = true;
                }
            }
            var Dispatcher = (function () {
                function Dispatcher() {
                }
                Dispatcher.OnIdle = function (owner, callback) {
                    if (isIdle || !isRunning)
                        try {
                            callback.call(owner);
                        }
                        catch (e) {
                        }
                    else
                        OnIdle.push({ owner: owner, callback: callback });
                };
                Dispatcher.InIdle = function () { return isIdle; };
                Dispatcher.GC = function () {
                    for (var i = 0, l = djobs.length; i < l; i++) {
                        var c = djobs[i];
                        c.children.length = 0;
                        c.ce = 0;
                    }
                    stack.length = 0;
                    cj = 0;
                    asIdle();
                };
                Dispatcher.clone = function (ojob, params, __this) {
                    var l = {
                        callback: ojob.callback,
                        _this: __this === undefined ? ojob._this : __this,
                        id: ojob.id,
                        isWaiting: true,
                        optimizable: false,
                        params: new JobParam(ojob.id).Set1(params || ojob.params.params)
                    };
                    ojob.children.push(l);
                    return l;
                };
                Dispatcher.cretaeJob = function (delegate, param, _this, optimizable) {
                    var t = {
                        callback: delegate,
                        params: new JobParam(djobs.length, param),
                        _this: _this,
                        optimizable: optimizable,
                        isWaiting: false,
                        id: djobs.length, children: [], ce: 0
                    };
                    djobs.push(t);
                    return t.params;
                };
                Dispatcher.Clear = function (o) {
                    var k = djobs[o.id];
                    var pj = k.children;
                    var ce = k.ce;
                    var l = pj.length;
                    for (var i = l - 1; i > ce; i--) {
                        var c = pj[i];
                        c.isWaiting = false;
                        c.optimizable = true;
                    }
                    pj.length = 0;
                    k.ce = 0;
                };
                Object.defineProperty(Dispatcher, "CurrentJob", {
                    get: function () {
                        return stack[cj];
                    },
                    enumerable: true,
                    configurable: true
                });
                Dispatcher.start = function () {
                    isRunning = true;
                    if (stack.length === 0) {
                        isRunning = false;
                        asIdle();
                        return;
                    }
                    var to = cj + Math.min(3, stack.length - cj);
                    for (; cj < to; cj++) {
                        var c = stack[cj];
                        if (c.isWaiting)
                            try {
                                var p = c.params.params;
                                c.callback.call(c._this, p[0], p[1], p[2]);
                            }
                            catch (e) {
                            }
                        if (!c.optimizable) {
                            var pj = djobs[c.id];
                            pj.ce++;
                        }
                        c.isWaiting = false;
                        stack[cj] = null;
                    }
                    isRunning = cj < stack.length;
                    if (isRunning)
                        id = setTimeout(Dispatcher.start, 0);
                    else
                        Dispatcher.GC();
                };
                Dispatcher.Push = function (ojob, params, _this) {
                    var job = djobs[ojob.id];
                    if (!job.optimizable)
                        job = this.clone(job, params, _this);
                    else {
                        if (params)
                            job.params.Set(params);
                        job._this = _this === undefined ? job._this : _this;
                        if (job.isWaiting) {
                            return;
                        }
                    }
                    job.isWaiting = true;
                    stack.push(job);
                    if (!isRunning)
                        if (stack.length > 0) {
                            clearTimeout(id);
                            id = setTimeout(Dispatcher.start, 0);
                            isRunning = true;
                            isIdle = false;
                        }
                    return job;
                };
                Dispatcher.call = function (_this, fn) {
                    var args = [];
                    for (var _i = 2; _i < arguments.length; _i++) {
                        args[_i - 2] = arguments[_i];
                    }
                    this.Push(delayedJob, [_this, fn, args]);
                };
                Dispatcher.icall = function (_this, fn, args) {
                    this.Push(delayedJob, [_this, fn, args]);
                };
                return Dispatcher;
            }());
            thread.Dispatcher = Dispatcher;
            var delayedJob = thread.Dispatcher.cretaeJob(function (context, fun, args) {
                fun.apply(context, args);
            }, [], null, false);
        })(thread = core.thread || (core.thread = {}));
        var ModuleDownoader = (function () {
            function ModuleDownoader() {
                this._store = {};
                this.http = new net.Downloader();
                this.register(new managers.StyleManager());
                this.register(new managers.CodeManager());
                this.register(new managers.TemplateManager());
                this.register(new managers.JsonManager());
            }
            ModuleDownoader.prototype.register = function (manager) {
                this._store[manager.moduleType] = manager;
            };
            ModuleDownoader.prototype.Download = function (module, OnOperationDone, dataStat) {
                if (module.Stat >= ModuleStat.Downloading)
                    throw "Modul Stat Corrupted";
                if (module.Url.IsPlugin) {
                    manager = this._store[ModuleType[module.Url.PluginName]];
                }
                else
                    var manager = this._store[module.Url.moduleType];
                if (!manager) {
                    module.Stat = ModuleStat.Failed;
                    return;
                }
                module.Stat = ModuleStat.Downloading;
                var e = { module: module, dataStat: dataStat, OnOperationDone: OnOperationDone };
                manager.Download(e);
                return e;
            };
            ModuleDownoader.prototype.Execute = function (e) {
                if (e.module.Stat >= ModuleStat.Executing)
                    throw "Modul Stat Corrupted";
                var manager = this._store[e.module.Url.moduleType];
                if (!manager) {
                    e.module.Stat = ModuleStat.Failed;
                    return;
                }
                e.module.Stat = ModuleStat.Executing;
                manager.Download(e);
            };
            ModuleDownoader.prototype.get = function (s) {
                if (typeof s === 'number')
                    var v = s;
                else {
                    v = ModuleType[s = s.toLowerCase()];
                    if (v === undefined)
                        return this._store[s];
                }
                return this._store[v];
            };
            return ModuleDownoader;
        }());
        core.ModuleDownoader = ModuleDownoader;
        var managers;
        (function (managers) {
            $defineProperty(window, 'define', { get: function () { return CodeManager.define; }, set: function (v) { }, configurable: false, enumerable: false });
            $defineProperty(window, 'require', { get: function () { return CodeManager._current && CodeManager._current.module.require || root.require; }, set: function (v) { }, configurable: false, enumerable: false });
            var Plugins = (function () {
                function Plugins() {
                    this._eventsStore = {};
                }
                Plugins.prototype.Define = function (e) { };
                Plugins.prototype.Execute = function (e) { };
                Plugins.prototype.addEventListener = function (stat, callback, data) {
                    var c = this._eventsStore[stat];
                    if (!c)
                        this._eventsStore[stat] = c = [];
                    c.push({ data: data, callback: callback });
                };
                Plugins.prototype.removeEventlistenr = function (stat, callback) {
                    var c = this._eventsStore[stat];
                    if (!c)
                        return;
                    for (var i = 0; i < c.length; i++)
                        if (c[i].callback === callback)
                            return c.splice(i, 1);
                };
                Object.defineProperty(Plugins.prototype, "avaibleEvents", {
                    get: function () {
                        return this._avaibleEvents;
                    },
                    enumerable: true,
                    configurable: true
                });
                Plugins.prototype.detacheEvent = function (event, url, exports, data) {
                    var c = this._eventsStore[event];
                    if (!c)
                        return;
                    var plg = { data: data, exports: exports, url: url };
                    for (var i = 0; i < c.length; i++) {
                        var x = c[i];
                        try {
                            x.callback(plg);
                        }
                        catch (e) {
                        }
                    }
                };
                return Plugins;
            }());
            var CodeManager = (function (_super) {
                __extends(CodeManager, _super);
                function CodeManager() {
                    var _this = _super.call(this) || this;
                    _this.moduleType = ModuleType.code;
                    if (CodeManager.instance)
                        throw "this is Singliton class";
                    CodeManager.instance = _this;
                    return _this;
                }
                CodeManager.eventHandler = function (e) {
                    return CodeManager.instance.handleEvent(e, this);
                };
                CodeManager.Next = function () {
                    if (this._isDownloading)
                        return;
                    this.Download();
                };
                CodeManager.Push = function (e) {
                    if (e)
                        this._store.push(e);
                    this.Next();
                };
                CodeManager.prototype.handleEvent = function (evnt, data) {
                    var c = CodeManager._current;
                    var m = c.module;
                    CodeManager._current = undefined;
                    CodeManager._isDownloading = false;
                    if (!c)
                        return;
                    var s = c.dData;
                    this.detacheEvent(ModuleStat.Downloaded, m.Url, m.exports);
                    s.removeEventListener('load', data);
                    s.removeEventListener('error', data);
                    s.remove();
                    c.error = evnt.type === 'error';
                    if (c.error)
                        debugger;
                    var _isesmodue = m.Stat == ModuleStat.Defining;
                    m.Stat = ModuleStat.Downloaded;
                    if (!_isesmodue)
                        m.Stat = ModuleStat.Defined;
                    $clone(m.exports, window['exports']);
                    window['exports'] = {};
                    if (c.error)
                        m.Stat = ModuleStat.Failed;
                    if (!_isesmodue)
                        m.Stat = c.error ? ModuleStat.Failed : ModuleStat.Executed;
                    try {
                        c.OnOperationDone && c.OnOperationDone(c, OperationPhase.Downloader);
                    }
                    catch (e) {
                    }
                    this.detacheEvent(m.Stat, m.Url, m.exports);
                    CodeManager.Next();
                };
                CodeManager.define = function () {
                    var c = CodeManager._current;
                    if (!c)
                        if (arguments.length != 0)
                            return root.define.apply(root, arguments);
                        else
                            throw "UnExpected Error";
                    else {
                        CodeManager.beginDefine(c.module, arguments);
                    }
                };
                CodeManager.beginDefine = function (module, args) {
                    var name;
                    var deps;
                    var callback;
                    if (module.RootFolder.CheckIfToSkip(module)) {
                        module.Stat = ModuleStat.Failed;
                        return;
                    }
                    if (typeof args[0] === 'string')
                        Folder.prototype.define.apply(module.Folder, args);
                    else if (args[0] instanceof Array) {
                        module._folderContext = module.Folder;
                        CodeManager.asyncLoadDependencies(module, args[0], args[1]);
                    }
                    else if (args[0] instanceof Function) {
                        CodeManager.loadDependencies(module, [], args[0]);
                    }
                    else {
                        throw 'Code not implimented';
                    }
                };
                CodeManager.Download = function () {
                    if (this._store.length === 0) {
                        this._isDownloading = false;
                        this._current = undefined;
                        return;
                    }
                    var e = this._current = this._store.shift();
                    var s = document.createElement('script');
                    var c = e.module;
                    s.src = c.ResourceUrl.FullPath;
                    e.dData = s;
                    c.Stat = ModuleStat.Downloading;
                    var y = { _this: this, handleEvent: this.eventHandler };
                    s.addEventListener('load', y);
                    s.addEventListener('error', y);
                    this._isDownloading = true;
                    window['exports'] = {};
                    document.head.appendChild(s);
                };
                CodeManager.prototype.Download = function (e) {
                    CodeManager.Push(e);
                };
                CodeManager.prototype.Define = function (e) {
                };
                CodeManager.prototype.Execute = function (e) {
                };
                CodeManager.getUrls = function () {
                    var ret = [];
                    var c = document.head.firstChild;
                    do {
                        if (c instanceof HTMLScriptElement && (c.src || "").trim() != "") {
                            ret.push(c.src);
                        }
                    } while (c = c.nextSibling);
                    return ret;
                };
                CodeManager.asyncLoadDependencies = function (m, dependencies, callback) {
                    m.RootFolder.PushModule(m, dependencies, callback);
                };
                CodeManager.loadDependencies = function (m, dependencies, callback) {
                    if (m.RootFolder.CheckIfToSkip(m)) {
                        m.Stat = ModuleStat.Failed;
                        return;
                    }
                    if (m.Stat > ModuleStat.Defining)
                        return;
                    if (m.args != null)
                        return;
                    m.Stat = ModuleStat.Defining;
                    var args = new Args(m, callback);
                    for (var i = 0, l = dependencies.length; i < l; i++) {
                        var d = dependencies[i];
                        var mdl;
                        var isOptional = false;
                        switch (d) {
                            case 'exports':
                                mdl = m.exports;
                                break;
                            case 'define':
                                mdl = { define: m.Folder.define };
                                break;
                            case 'require':
                                mdl = m.require;
                                break;
                            case 'context':
                                mdl = m._thisContext;
                                break;
                            case 'loadLib':
                                isOptional = true;
                                mdl = m.loadLib;
                                break;
                            default:
                                if (d.indexOf('plugin|') === 0) {
                                    var x = moduleDownloader.get(d.substr(7));
                                    if (x)
                                        mdl = x;
                                    else
                                        mdl = null;
                                }
                                else if (d.indexOf('lib:') == 0) {
                                    var c = d.indexOf('|');
                                    var alias = d.substr(4, c - 4);
                                    var path = d.substr(c + 1);
                                    if ((isOptional = path.indexOf('*') == 0))
                                        path = path.substr(1);
                                    mdl = m.RootFolder.LoadAssembly(m.Folder, path, alias);
                                }
                                else {
                                    if ((isOptional = d.indexOf('*') == 0))
                                        d = d.substr(1);
                                    mdl = m.GetModule(d);
                                }
                                break;
                        }
                        args.createDependency(mdl, i, isOptional);
                    }
                    m.Stat = ModuleStat.Defined;
                    args.Invoke();
                };
                CodeManager._store = [];
                CodeManager._isDownloading = false;
                return CodeManager;
            }(Plugins));
            managers.CodeManager = CodeManager;
            CodeManager.define.amd = {};
            var StyleManager = (function (_super) {
                __extends(StyleManager, _super);
                function StyleManager() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.moduleType = ModuleType.style;
                    return _this;
                }
                StyleManager.handleEvent = function (evnt) {
                    var t = this;
                    t.t.onDownloaded(t.e, this, evnt);
                };
                StyleManager.prototype.Download = function (e) {
                    var s = document.createElement('link');
                    s.rel = "stylesheet";
                    var m = e.module;
                    s.href = m.ResourceUrl.FullPath;
                    e.dData = s;
                    m.Stat = ModuleStat.Downloading;
                    var t = { handleEvent: StyleManager.handleEvent, e: e, t: this };
                    s.addEventListener('load', t);
                    s.addEventListener('error', t);
                    document.head.appendChild(s);
                };
                StyleManager.prototype.Define = function (e) {
                };
                StyleManager.prototype.Execute = function (e) {
                };
                StyleManager.prototype.onDownloaded = function (e, data, evnt) {
                    e.dData.removeEventListener('load', data);
                    e.dData.removeEventListener('error', data);
                    var m = e.module;
                    var s = e.dData;
                    this.detacheEvent(ModuleStat.Downloaded, m.Url, m.exports);
                    e.error = evnt.type === 'error';
                    m.Stat = ModuleStat.Defined;
                    try {
                        e.eData = s.sheet;
                        $clone(m.exports, {
                            sheet: s.sheet,
                            dom: s
                        });
                        m.Stat = e.error ? ModuleStat.Failed : ModuleStat.Executed;
                        e.OnOperationDone && e.OnOperationDone(e, OperationPhase.Downloader);
                    }
                    catch (e) {
                    }
                    this.detacheEvent(m.Stat, m.Url, m.exports);
                };
                return StyleManager;
            }(Plugins));
            managers.StyleManager = StyleManager;
            var Templates = (function () {
                function Templates() {
                }
                Templates.split = function (s) {
                    var t = [];
                    var path = s.split('.');
                    for (var i = 0; i < path.length; i++) {
                        var f = path[i];
                        if (f === '')
                            continue;
                        var p = f.split(/[\]\[]/);
                        if (p.length === 1)
                            t.push(f);
                        else {
                            for (var j = 0; j < p.length; j++) {
                                var indice;
                                var isIndice = isNaN(indice = parseInt(p[i]));
                                if (isIndice)
                                    t.push(indice);
                                else
                                    t.push(p[i]);
                            }
                        }
                    }
                    return t;
                };
                Templates.get = function (s, context) {
                    var path = this.split(s);
                    var root = context.GetTemplateRoot(path[0]);
                    var t = root;
                    for (var i = 1; i < path.length; i++) {
                        var fld = path[i];
                        if (t instanceof Element)
                            return undefined;
                        t = t.get(fld);
                    }
                    return t;
                };
                return Templates;
            }());
            managers.Templates = Templates;
            var TemplateManager = (function (_super) {
                __extends(TemplateManager, _super);
                function TemplateManager() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.moduleType = ModuleType.template;
                    _this.templates = [];
                    _this.OnNewTemplateExecuted = new net.EventListener(managers);
                    return _this;
                }
                TemplateManager.prototype.Download = function (e) {
                    var rp = e.module.ResourceUrl.getRelativePath();
                    http.Push(e.module.ResourceUrl, new net.downloadCallback(TemplateManager._execute, { key: this, value: e }, true));
                };
                TemplateManager._execute = function (http, pr) {
                    var _this = pr.data.key;
                    var e = pr.data.value;
                    var m = e.module;
                    m.Stat = ModuleStat.Downloaded;
                    _this.detacheEvent(ModuleStat.Downloaded, m.Url, m.exports);
                    try {
                        var t = document.createElement('div');
                        t.innerHTML = http.webr.Response;
                        var requires = [];
                        var x = TemplateManager.BuildTree(t.firstElementChild, requires);
                        $clone(m.exports, {
                            require: m.require,
                            template: TemplateManager.reduce(x),
                            html: t.firstElementChild,
                            context: m._thisContext
                        });
                    }
                    catch (ex) {
                        pr.IsSuccess = false;
                    }
                    if (pr.IsSuccess && requires.length != 0) {
                        CodeManager.asyncLoadDependencies(m, requires, function (a) {
                            m.Stat = pr.IsSuccess ? ModuleStat.Executed : ModuleStat.Failed;
                            _this.detacheEvent(m.Stat, m.Url, m.exports);
                        });
                    }
                    else {
                        m.Stat = pr.IsSuccess ? ModuleStat.Executed : ModuleStat.Failed;
                        _this.detacheEvent(m.Stat, m.Url, m.exports);
                    }
                };
                TemplateManager.prototype.Execute = function (e) {
                };
                TemplateManager.reduce = function (x) {
                    if (Object.getOwnPropertyNames(x).length === 2 && x['#'].length === 1)
                        return TemplateManager.reduce(x['#'][0]);
                    return x;
                };
                TemplateManager.get = function (s) {
                    if (typeof s === 'string')
                        return this[s];
                    return this['#'][s];
                };
                TemplateManager.BuildTree = function (html, requires) {
                    var _tree = { get: this.get }, _ind = [];
                    _tree['#'] = _ind;
                    return TemplateManager.reduce(this.buildTree(html, _tree, _ind, requires));
                };
                TemplateManager.buildTree = function (html, tree, ind, requires) {
                    var name = html.getAttribute('name');
                    switch (html.tagName) {
                        case 'REQUIRE':
                            requires.push(html.getAttribute('module') || html.getAttribute('url') || html.innerText || html.innerHTML);
                            break;
                        case 'TEMPLATES':
                        case 'DESCRIPTOR':
                            var _tree = { get: this.get }, _ind = [];
                            _tree['#'] = _ind;
                            if (name)
                                tree[name] = _tree;
                            else
                                ind.push(_tree);
                            var t = html.firstElementChild;
                            while (t) {
                                this.buildTree(t, _tree, _ind, requires);
                                t = t.nextElementSibling;
                            }
                            break;
                        default:
                        case 'TEMPLATE':
                            if (name)
                                tree[name] = html;
                            else
                                ind.push(name);
                            break;
                    }
                    return tree;
                };
                return TemplateManager;
            }(Plugins));
            managers.TemplateManager = TemplateManager;
            var JsonManager = (function (_super) {
                __extends(JsonManager, _super);
                function JsonManager() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.moduleType = ModuleType.json;
                    return _this;
                }
                JsonManager.prototype.Download = function (e) {
                    http.Push(e.module.ResourceUrl, new net.downloadCallback(JsonManager._execute, { key: this, value: e }, true));
                };
                JsonManager._execute = function (http, pr) {
                    var _this = pr.data.key;
                    var e = pr.data.value;
                    var m = e.module;
                    _this.detacheEvent(ModuleStat.Downloaded, m.Url, m.exports);
                    if (pr.IsSuccess)
                        try {
                            $clone(m.exports, {
                                require: m.require,
                                value: JSON.parse(http.webr.Response)
                            });
                        }
                        catch (e) {
                            pr.IsSuccess = false;
                        }
                    m.Stat = pr.IsSuccess ? ModuleStat.Executed : ModuleStat.Failed;
                    _this.detacheEvent(m.Stat, m.Url, m.exports);
                };
                return JsonManager;
            }(Plugins));
            managers.JsonManager = JsonManager;
        })(managers || (managers = {}));
    })(core || (core = {}));
    var global;
    var root;
    var Qrc;
    var http;
    var OnModuleCreated;
    var _listeners;
    var moduleDownloader;
    core.initialize();
    function checkOverFlow() {
        var t = [];
        for (var i = 0; i < stack.length; i++) {
            var r = stack[i].checkOverflow();
            if (r.length != 0)
                t.push([stack[i], r]);
        }
        return t;
    }
    System.checkOverFlow = checkOverFlow;
    function checkStat() {
        var t = [];
        for (var i = 0; i < stack.length; i++) {
            var r = stack[i];
            if (r.Stat < 6)
                t.push(r);
        }
        return t;
    }
    System.checkStat = checkStat;
    function getUnExecuted() {
        return core.Args.getUnExecuted();
    }
    System.getUnExecuted = getUnExecuted;
    function getUnUnSuccessed() {
        return core.Args.getUnSuccessed();
    }
    System.getUnUnSuccessed = getUnUnSuccessed;
    function getUExecuted() {
        var map = [];
        function getM(m) {
            for (var i = 0; i < ts.length; i++) {
                var r = ts[i];
                if (r.m === m)
                    return r;
            }
            ts.push(r = {
                a: m.FullName,
                m: m, r: [],
                push: function (m) {
                    if (this.r.indexOf(m) === -1) {
                        this.r.push(m);
                        var i = map.indexOf(m);
                        if (i !== -1)
                            map.splice(i, 1);
                    }
                }
            });
            map.push(r);
            return r;
        }
        var ts = [];
        var t = [];
        getUnExecuted().forEach(function (v, i, a) {
            var tx = getM(v.m);
            v.r.forEach(function (av, ai, aa) {
                getM(av).push(tx);
            });
        }, t);
        return ts;
    }
    System.getUExecuted = getUExecuted;
    function collectAssets() {
        var t = [];
        root.collectAssets(t, []);
        return t;
    }
    System.collectAssets = collectAssets;
    function getCmdCopy(dest) {
        var t = root.FullName;
        var fldrs = [];
        return collectAssets().map(function (m) {
            if (fldrs.indexOf(m.Folder) == -1) {
                var folderName = (m.Folder.FullName).replace(t, '');
                var s = "mkdir " + dest + folderName;
                fldrs.push(m.Folder);
            }
            else
                s = "";
            var fileName = m.FullName.replace(t, '');
            return s + "\r\n copy " + fileName + " " + dest + fileName;
        });
    }
    System.getCmdCopy = getCmdCopy;
})(System || (System = {}));
function ValidateImport() {
    var styles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        styles[_i] = arguments[_i];
    }
    for (var i = 0; i < styles.length; i++)
        if (styles[i] == undefined)
            styles.splice(i, 1);
        else
            continue;
}
