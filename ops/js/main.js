var inOps = {
    version: "0.3",
    dist: "",
    base: "/in/ops/",
    basetpl: "/in/ops/-/",
    api: "/in/ops/",
    debug: true,
    UserSession: null,
    ooActions: [
        {
            action: 1 << 1,
            title: "Enable",
        },
        {
            action: 1 << 3,
            title: "Disable",
        },
    ],
};

inOps.debug_uri = function() {
    if (!inOps.debug) {
        return "?_=" + inOps.version;
    }
    return "?_=" + Math.random();
};

inOps.Boot = function(login_first) {
    if (
        !(
        ($.browser.chrome === true &&
        valueui.utilx.versionCompare($.browser.version, "22.0") > 0) ||
        ($.browser.firefox === true &&
        valueui.utilx.versionCompare($.browser.version, "31.0") > 0) ||
        ($.browser.safari === true &&
        valueui.utilx.versionCompare($.browser.version, "5.0") > 0)
        )
    ) {
        $("body").load(inCp.tplbase + "error/browser.tpl");
        return;
    }

    if (login_first && login_first === true) {
        var elem = $("#incp-well-status");
        elem.removeClass("status_dark");
        elem.addClass("info");
        elem.html(inCp.well_signin_html);
        return;
    }

    valueui.use(
        [
            "in/cp/js/main.js",
            "in/cp/css/main.css",
            "in/fa/css/fa.css",
            "in/cp/js/pod.js",
            "in/cp/js/pod-rep.js",
            "in/cp/js/app.js",
            "in/cp/js/app-spec.js",
            "in/ops/css/base.css",
            "in/ops/js/host.js",
            "in/ops/js/pod.js",
            "in/ops/js/app.js",
            "in/ops/js/sys.js",
            "in/ops/css/base.css",
            "hchart/hchart.js",
        ],
        inOps.load_index
    );
};

inOps.zone = function(zone_id) {
    for (var i in inCp.Zones.items) {
        if (inCp.Zones.items[i].meta.id === zone_id) {
            return inCp.Zones.items[i];
        }
    }
    return null;
}

inOps.load_index = function() {
    // l4i.debug = inOps.debug;
    // l4i.app_version = inOps.version;

    hooto_chart.basepath = inCp.base + "~/hchart/";

    var ep = valueui.newEventProxy(
        "tpl",
        "zones",
        "session",
        "syscfg",
        function(tpl, zones, session, syscfg) {
            if (!session || session.username == "") {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            inOps.UserSession = session;
            inCp.UserSession = session;

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

            $("#valueui-body").html(tpl);

            valueui.template.render({
                dstid: "incp-topbar",
                tplid: "incp-topbar-tpl",
                data: {},
            });

            valueui.template.render({
                dstid: "incp-footer",
                tplid: "incp-footer-tpl",
                data: {},
            });

            valueui.template.render({
                dstid: "incp-topbar-userbar",
                tplid: "incp-topbar-user-signed-tpl",
                data: inOps.UserSession,
                callback: function() {
                    $("#incp-topbar-userbar").on("mouseenter", function() {
                        $("#incp-topbar-user-signed-modal").fadeIn(200);
                    });
                    $("#incp-topbar-user-signed-modal").on("mouseleave", function() {
                        $("#incp-topbar-user-signed-modal").fadeOut(200);
                    });
                },
            });

            valueui.url.eventRegister("host/index", inOpsHost.Index, "inops-topbar-nav-menus");
            valueui.url.eventRegister("pod/index", inOpsPod.Index, "inops-topbar-nav-menus");
            valueui.url.eventRegister("app/index", inOpsApp.Index, "inops-topbar-nav-menus");
            valueui.url.eventRegister("sys/index", inOpsSys.Index, "inops-topbar-nav-menus");
            valueui.url.eventHandler("host/index", true);
        }
    );

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

    valueui.utilx.ajax(inCp.base + "auth/session", {
        callback: function(err, data) {
            if (!data || data.kind != "AuthSession") {
                return ep.emit("error", "AuthSession");
            }
            ep.emit("session", data);
        },
    });

    inOps.TplFetch("index/index", {
        callback: ep.done("tpl"),
    });
};

inOps.ApiCmd = function(url, options) {
    var appcb = null;
    if (options.callback) {
        appcb = options.callback;
    }

    if (inCp.Zones && options.api_zone_id && inCp.zone_id && options.api_zone_id != inCp.zone_id) {
        for (var i in inCp.Zones.items) {
            if (
                inCp.Zones.items[i].meta.id == options.api_zone_id &&
                inCp.Zones.items[i].wan_api &&
                inCp.Zones.items[i].wan_api.length > 10
            ) {
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
    };
    url = url.replace(/^\/|\s+$/g, "");

    valueui.utilx.ajax(inOps.api + url, options);
};

inOps.TplFetch = function(url, options) {
    valueui.utilx.ajax(inOps.basetpl + url + ".tpl", options);
};

inOps.Loader = function(target, uri) {
    valueui.utilx.ajax(inOps.basetpl + uri + ".tpl", {
        callback: function(err, data) {
            $("#" + target).html(data);
        },
    });
};

inOps.CompLoader = function(uri) {
    inOps.Loader("comp-content", uri);
};

inOps.WorkLoader = function(uri) {
    inOps.Loader("work-content", uri);
};
