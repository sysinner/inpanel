var inOps = {
    version: "0.3",
    dist: "",
    base: "/in/ops/",
    basetpl: "/in/ops/-/",
    api: "/in/ops/",
    debug: true,
    UserSession: null,
}

inOps.debug_uri = function() {
    if (!inOps.debug) {
        return "?_=" + inOps.version;
    }
    return "?_=" + Math.random();
}

inOps.Boot = function(login_first) {
    seajs.config({
        base: inOps.base,
        alias: {
            ep: "~/lessui/js/eventproxy.js"
        },
    });

    seajs.use([
        "~/twbs/4/css/bootstrap.css",
        "~/jquery/jquery.js" + inOps.debug_uri(),
        "~/cp/js/main.js" + inOps.debug_uri(),
        "~/lessui/js/browser-detect.js",
        "~/fa/css/fa.css",
    ], function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS = BrowserDetect.OS;

        if (!((browser == 'Chrome' && version >= 22)
            || (browser == 'Firefox' && version >= 31.0)
            || (browser == 'Safari' && version >= 5.0 && OS == 'Mac'))) {
            $('body').load(inOps.base + "~/cp/tpl/error/browser.tpl");
            return;
        }

        if (login_first && login_first === true) {
            var elem = $("#incp-well-status");
            elem.removeClass("status_dark");
            elem.addClass("info");
            elem.html(inCp.well_signin_html);
            return;
        }

        seajs.use([
            "~/lessui/css/base.css" + inOps.debug_uri(),
            "~/lessui/js/lessui.js" + inOps.debug_uri(),
            "~/cp/css/main.css" + inOps.debug_uri(),
            "~/cp/js/pod.js" + inOps.debug_uri(),
            "~/cp/js/app.js" + inOps.debug_uri(),
            "~/cp/js/app-spec.js" + inOps.debug_uri(),
            "~/ops/css/base.css" + inOps.debug_uri(),
            "~/ops/js/host.js" + inOps.debug_uri(),
            "~/ops/js/pod.js" + inOps.debug_uri(),
            "~/ops/js/app.js" + inOps.debug_uri(),
            "~/ops/js/sys.js" + inOps.debug_uri(),
            "hchart/~/hchart.js" + inCp.debug_uri(),
        ], inOps.load_index);
    });
}


inOps.load_index = function() {
    l4i.debug = inOps.debug;
    l4i.app_version = inOps.version;

    hooto_chart.basepath = inOps.base + "/hchart/~/";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "session", "syscfg", function(tpl, zones, session, syscfg) {

            if (!session || session.username == "") {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            inOps.UserSession = session;

            if (zones.error && zones.error.code == "AccessDenied") {
                return inCp.AlertAccessDenied();
            }

            if (!zones.items || zones.items.length == 0) {
                zones.items = [];
            }
            inCp.Zones = zones;
            inCp.zone_id = inOps.zone_id;

            //
            inCp.syscfg.zone_id = syscfg.zone_id;
            if (syscfg.zone_master) {
                inCp.syscfg.zone_master = syscfg.zone_master;
            }
            if (syscfg.sys_configs) {
                inCp.syscfg.sys_configs = syscfg.sys_configs;
            }

            $("#body-content").html(tpl);

            l4iTemplate.Render({
                dstid: "incp-topbar",
                tplid: "incp-topbar-tpl",
                data: {},
            });

            l4iTemplate.Render({
                dstid: "incp-footer",
                tplid: "incp-footer-tpl",
                data: {},
            });


            l4iTemplate.Render({
                dstid: "incp-topbar-userbar",
                tplid: "incp-topbar-user-signed-tpl",
                data: inOps.UserSession,
                success: function() {

                    $("#incp-topbar-userbar").hover(
                        function() {
                            $("#incp-topbar-user-signed-modal").fadeIn(200);
                        },
                        function() {}
                    );
                    $("#incp-topbar-user-signed-modal").hover(
                        function() {},
                        function() {
                            $("#incp-topbar-user-signed-modal").fadeOut(200);
                        }
                    );
                },
            });

            l4i.UrlEventRegister("host/index", inOpsHost.Index, "inops-topbar-nav-menus");
            l4i.UrlEventRegister("pod/index", inOpsPod.Index, "inops-topbar-nav-menus");
            l4i.UrlEventRegister("app/index", inOpsApp.Index, "inops-topbar-nav-menus");
            l4i.UrlEventRegister("sys/index", inOpsSys.Index, "inops-topbar-nav-menus");
            l4i.UrlEventHandler("host/index", true);
        });

        ep.fail(function(err) {
            if (err && err == "AuthSession") {
                inCp.AlertUserLogin();
            } else {
                alert("Network Exception, Please try again later (EC:zone-list)");
            }
        });

        inCp.ApiCmd("host/zone-list", {
            callback: ep.done("zones"),
        });

        inCp.ApiCmd("sys/cfg", {
            callback: ep.done("syscfg"),
        });

        l4i.Ajax(inCp.base + "auth/session", {
            callback: function(err, data) {
                if (!data || data.kind != "AuthSession") {
                    return ep.emit('error', "AuthSession");
                }
                ep.emit("session", data);
            },
        });

        inOps.TplFetch("index/index", {
            callback: ep.done("tpl"),
        });
    });

}

inOps.ApiCmd = function(url, options) {
    var appcb = null;
    if (options.callback) {
        appcb = options.callback;
    }

    if (inCp.Zones && options.api_zone_id && inCp.zone_id && options.api_zone_id != inCp.zone_id) {
        for (var i in inCp.Zones.items) {
            if (inCp.Zones.items[i].meta.id == options.api_zone_id &&
                inCp.Zones.items[i].wan_api && inCp.Zones.items[i].wan_api.length > 10) {
                url = "zonebound/" + options.api_zone_id + "/" + url;
                break;
            }
        }
    }

    options.callback = function(err, data) {
        if (err == "Unauthorized") {
            return inCp.AlertUserLogin();
        }
        if (appcb) {
            appcb(err, data);
        }
    }
    url = url.replace(/^\/|\s+$/g, '');

    l4i.Ajax(inOps.api + url, options);
}

inOps.TplFetch = function(url, options) {
    l4i.Ajax(inOps.basetpl + url + ".tpl", options);
}

inOps.Loader = function(target, uri) {
    l4i.Ajax(inOps.basetpl + uri + ".tpl", {
        callback: function(err, data) {
            $("#" + target).html(data);
        }
    });
}

inOps.CompLoader = function(uri) {
    inOps.Loader("comp-content", uri);
}

inOps.WorkLoader = function(uri) {
    inOps.Loader("work-content", uri);
}
