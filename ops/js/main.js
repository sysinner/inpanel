var losOps = {
    base    : "/los/ops/",
    basetpl : "/los/ops/-/",
    api     : "/los/ops/",
    apisys  : "/los/ops/",
    debug   : true,
    UserSession: null,
}

losOps.debug_uri = function()
{
    if (!losOps.debug) {
        return "";
    }
    return "?_="+ Math.random(); 
}

losOps.Boot = function()
{
    seajs.config({
        base: losOps.base,
        alias: {
            ep: "~/lessui/js/eventproxy.js"
        },
    });

    seajs.use([
        "~/twbs/3.3/css/bootstrap.css",
        "~/cp/js/jquery.js",
        "~/cp/js/main.js"+ losOps.debug_uri(),
        "~/cp/css/main.css"+ losOps.debug_uri(),
        "~/lessui/js/browser-detect.js",
    ], function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS      = BrowserDetect.OS;

        if (!((browser == 'Chrome' && version >= 22)
            || (browser == 'Firefox' && version >= 31.0)
            || (browser == 'Safari' && version >= 5.0 && OS == 'Mac'))) {
            $('body').load(losOps.base +"~/cp/tpl/error/browser.tpl");
            return;
        }

        seajs.use([
            "~/lessui/css/lessui.css",
            "~/twbs/3.3/js/bootstrap.js",
            "~/lessui/js/lessui.js",
            "~/purecss/css/pure.css",
            "~/ops/css/main.css"+ losOps.debug_uri(),
            "~/ops/js/host.js"+ losOps.debug_uri(),
        ], losOps.load_index);
    });
}


losOps.load_index = function()
{
    l4i.debug = losOps.debug;

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "session", function (tpl, session) {

            if (!session || session.username == "") {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            losOps.UserSession = session;

            $("#body-content").html(tpl);
 
            l4i.UrlEventRegister("host/index", losOpsHost.Index, "losops-topbar-menus");
            l4i.UrlEventHandler("host/index");
        });

        ep.fail(function (err) {
            if (err && err == "AuthSession") {
                losCp.AlertUserLogin();
            } else {
                alert("Network Exception, Please try again later (EC:zone-list)");
            }
        });

        l4i.Ajax(losCp.base + "auth/session", {
            callback: function(err, data) {
                if (!data || data.kind != "AuthSession") {
                    return ep.emit('error', "AuthSession");
                }
                ep.emit("session", data);
            },
        });

        losOps.TplFetch("index/index", {
            callback: ep.done("tpl"),
        });
    });

}

losOps.ApiCmd = function(url, options)
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

    l4i.Ajax(losOps.api + url, options);
}

losOps.ApiSysCmd = function(url, options)
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

    l4i.Ajax(losOps.apisys + url, options);
}

losOps.TplFetch = function(url, options)
{
    l4i.Ajax(losOps.basetpl + url +".tpl", options);
}

losOps.Loader = function(target, uri)
{
    l4i.Ajax(losOps.basetpl + uri +".tpl", {callback: function(err, data) {
        $("#"+ target).html(data);
    }});
}

losOps.CompLoader = function(uri)
{
    losOps.Loader("comp-content", uri);
}

losOps.WorkLoader = function(uri)
{
    losOps.Loader("work-content", uri);
}
