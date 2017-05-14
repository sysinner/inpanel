var losCp = {
    base    : "/los/cp/",
    tplbase : "/los/cp/-/",
    api     : "/los/v1/",
    debug   : true,
    Zones   : null,
    OpToolActive : null,
    UserSession: null,
}

losCp.debug_uri = function()
{
    if (!losCp.debug) {
        return "";
    }
    return "?_="+ Math.random(); 
}

losCp.Boot = function()
{
    seajs.config({
        base: losCp.base,
        alias: {
            ep: "~/lessui/js/eventproxy.js"
        },
    });

    seajs.use([
        "~/twbs/3.3/css/bootstrap.css",
        "~/cp/js/jquery.js",
        "~/lessui/js/browser-detect.js",
    ], function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS      = BrowserDetect.OS;

        if (!((browser == 'Chrome' && version >= 22)
            || (browser == 'Firefox' && version >= 31.0)
            || (browser == 'Safari' && version >= 5.0 && OS == 'Mac'))) {
            $('body').load(losCp.tplbase + "error/browser.tpl");
            return;
        }

        seajs.use([
            "~/twbs/3.3/js/bootstrap.js",
            "~/lessui/css/lessui.css",
            "~/lessui/js/lessui.js",
            "~/purecss/css/pure.css",
            "~/cp/css/main.css"+ losCp.debug_uri(),
            "~/cp/js/host.js"+ losCp.debug_uri(),
            "~/cp/js/spec.js"+ losCp.debug_uri(),
            "~/cp/js/pod.js"+ losCp.debug_uri(),
            "~/cp/js/app.js"+ losCp.debug_uri(),
            "~/cp/js/app-spec.js"+ losCp.debug_uri(),
            "~/cp/js/res.js",
            "~/cp/js/res-domain.js"+ losCp.debug_uri(),
        ], losCp.load_index);
    });
}

losCp.load_index = function()
{
    l4i.debug = losCp.debug;

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "session", function (tpl, zones, session) {

            if (!session || session.username == "") {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            losCp.UserSession = session;

            if (!zones.items || zones.items.length == 0) {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            losCp.Zones = zones;

            $("#body-content").html(tpl);

            l4iTemplate.Render({
                dstid:   "loscp-topbar-userbar",
                tplid:   "loscp-topbar-user-signed-tpl",
                data:    losCp.UserSession,
                success: function() {

                    $("#loscp-topbar-userbar").hover(
                        function() {
                            $("#loscp-topbar-user-signed-modal").fadeIn(200);
                        },
                        function() {
                        }
                    );
                    $("#loscp-topbar-user-signed-modal").hover(
                        function() {
                        },
                        function() {
                            $("#loscp-topbar-user-signed-modal").fadeOut(200);
                        }
                    );
                },
            });
 
            l4i.UrlEventRegister("app/index", losCpApp.Index, "loscp-topbar-nav-menus");
            l4i.UrlEventRegister("pod/index", losCpPod.Index, "loscp-topbar-nav-menus");
            l4i.UrlEventRegister("res/index", losCpRes.Index, "loscp-topbar-nav-menus");

            l4i.UrlEventHandler("app/index", true);
        });

        ep.fail(function (err) {
            if (err && err == "AuthSession") {
                losCp.AlertUserLogin();
            } else {
                alert("Network Exception, Please try again later (EC:zone-list)");
            }
        });

        losCp.ApiCmd("host/zone-list", {
            callback: ep.done("zones"),
        });

        l4i.Ajax(losCp.base + "auth/session", {
            callback: function(err, data) {
                if (!data || data.kind != "AuthSession") {
                    return ep.emit('error', "AuthSession");
                }
                ep.emit("session", data);
            },
        });

        losCp.TplFetch("index/index", {
            callback: ep.done("tpl"),
        });
    });
}


losCp.AlertUserLogin = function()
{
    l4iAlert.Open("warn", "You are not logged in, or your login session has expired. Please sign in again", {
        close: false,
        buttons: [{
            title: "SIGN IN",
            href: losCp.base +"auth/login",
        }],
    });
}

losCp.ApiCmd = function(url, options)
{
    var appcb = null;
    if (options.callback) {
        appcb = options.callback;
    }
    options.callback = function(err, data) {
        if (err == "Unauthorized") {
            return losCp.AlertUserLogin();
        }
        if (appcb) {
            appcb(err, data);
        }
    }

    l4i.Ajax(losCp.api + url, options);
}

losCp.TplPath = function(url)
{
    return losCp.tplbase + url +".tpl";
}

losCp.TplFetch = function(url, options)
{
    l4i.Ajax(losCp.TplPath(url), options);
}

losCp.Loader = function(target, uri)
{
    l4i.Ajax(losCp.tplbase + uri +".tpl", {
        callback: function(err, data) {
            if (!err) {
                $("#"+ target).html(data);
            }
        }
    });
}

losCp.CompLoader = function(uri)
{
    losCp.Loader("comp-content", uri);
}

losCp.WorkLoader = function(uri)
{
    losCp.Loader("work-content", uri);
}

losCp.UtilResSizeFormat = function(size, tofix)
{
    var ms = [
        [7, "ZB"],
        [6, "EB"],
        [5, "PB"],
        [4, "TB"],
        [3, "GB"],
        [2, "MB"],
        [1, "KB"],
    ];

    if (!tofix || tofix < 0) {
        tofix = 0;
    } else if (tofix > 3) {
        tofix = 3;
    }

    for (var i in ms) {
        if (size >= Math.pow(1024, ms[i][0])) {
            return (size / Math.pow(1024, ms[i][0])).toFixed(tofix) +" "+ ms[i][1];
        }
    }

    if (size == 0) {
        return size;
    }

    return size + " B";
}


losCp.OpToolsRefresh = function(div_target)
{
    if (!div_target || typeof div_target == "string" && div_target == losCp.OpToolActive) {
        return;
    }

    // if (!div_target) {
    //     div_target = "#loscp-optools";
    // }

    $("#loscp-module-navbar-optools").empty();

    if (typeof div_target == "string") {

        var opt = $("#work-content").find(div_target);
        if (opt) {
            $("#loscp-module-navbar-optools").html(opt.html());
            losCp.OpToolActive = div_target;
        }
    }
}


losCp.CodeRender = function()
{
    seajs.use([
        "~/hl/highlight.pack.js",
        "~/hl/styles/arta.css",
    ], function() {

        $("pre code").each(function(i, block) {
            hljs.highlightBlock(block);
        });
    });

    return;
    $("code[class^='language-']").each(function(i, el) {

        var lang = el.className.substr("language-".length);

        var modes = [];

        switch (lang) {

        case "shell":
            modes.push("~/cm/5/mode/"+ lang +"/"+ lang +".js");
            break;

        default:
            return;
        }

        seajs.use([
            "~/cm/5/lib/codemirror.css",
            "~/cm/5/lib/codemirror.js",
            "~/cm/5/theme/monokai.css",
        ],
        function() {

            modes.push("~/cm/5/addon/runmode/runmode.js");
            modes.push("~/cm/5/mode/clike/clike.js");

            seajs.use(modes, function() {

                // $(el).addClass('cm-s-monokai CodeMirror'); // apply a theme class
                CodeMirror.runMode($(el).text(), lang, $(el)[0], {
                    theme: "monokai",
                });
            });
        });
    });
}

/*
losCp.ArrayUint32MatchAny = function(ar, ar2)
{
    if (!ar || !ar2) {
        return false;
    }

    for (var i in ar2) {
        for (var j in ar) {
            if (ar2[i] == ar[j]) {
                return true;
            }
        }
    }

    return false;
}
*/
