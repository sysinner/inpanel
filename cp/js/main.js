var inCp = {
    version: "",
    base: "/in/cp/",
    tplbase: "/in/cp/-/",
    api: "/in/v1/",
    debug: true,
    Zones: null,
    OpToolActive: null,
    UserSession: null,
    OpActions: [
        {
            action: 1 << 1,
            title: "Start",
        },
        {
            action: 1 << 3,
            title: "Stop",
        },
    /*
    {
        action: 1 << 5,
        title: "Destroy",
    },
    */
    ],
    OpActionStatus: [
        {
            action: 1 << 2,
            title: "Running",
        },
        {
            action: 1 << 4,
            title: "Stopped",
        },
        {
            action: 1 << 6,
            title: "Destroyed",
        },
        {
            action: 1 << 11,
            title: "Warning",
        },
    ],
    OpActionStart: 1 << 1,
    OpActionRunning: 1 << 2,
    OpActionStop: 1 << 3,
    OpActionStopped: 1 << 4,
    well_signin_html: '<div>You are not logged in, or your login session has expired. Please sign in.</div><div><a href="/in/cp/auth/login" class="button">SIGN IN</a></div>',
}

inCp.debug_uri = function() {
    if (!inCp.debug) {
        return "?_=" + inCp.version;
    }
    return "?_=" + Math.random();
}

inCp.Boot = function(login_first) {
    seajs.config({
        base: inCp.base,
        alias: {
            ep: "~/lessui/js/eventproxy.js"
        },
    });

    seajs.use([
        "~/twbs/3.3/css/bootstrap.css",
        "~/cp/js/jquery.js",
        "~/lessui/js/browser-detect.js",
        "~/purecss/css/pure.css",
    ], function() {

        var browser = BrowserDetect.browser;
        var version = BrowserDetect.version;
        var OS = BrowserDetect.OS;

        if (!((browser == 'Chrome' && version >= 22)
            || (browser == 'Firefox' && version >= 31.0)
            || (browser == 'Safari' && version >= 5.0 && OS == 'Mac'))) {
            $('body').load(inCp.tplbase + "error/browser.tpl");
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
            "~/twbs/3.3/js/bootstrap.js",
            "~/lessui/css/lessui.css",
            "~/lessui/js/lessui.js",
            "~/cp/css/main.css" + inCp.debug_uri(),
            "~/cp/js/host.js" + inCp.debug_uri(),
            "~/cp/js/spec.js" + inCp.debug_uri(),
            "~/cp/js/pod.js" + inCp.debug_uri(),
            "~/cp/js/app.js" + inCp.debug_uri(),
            "~/cp/js/app-spec.js" + inCp.debug_uri(),
            "~/cp/js/res.js" + inCp.debug_uri(),
            "~/cp/js/res-domain.js" + inCp.debug_uri(),
            "hchart/~/hchart.js" + inCp.debug_uri(),
            "ips/~/ips/js/main.js" + inCp.debug_uri(),
            "ips/~/ips/css/main.css" + inCp.debug_uri(),
        ], inCp.load_index);
    });
}

inCp.load_index = function() {
    l4i.debug = inCp.debug;
    l4i.app_version = inCp.version;

    inpack.base = inCp.base + "ips/~/ips/";
    inpack.option_navpf = "incp";
    hooto_chart.basepath = inCp.base + "/hchart/~/";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "session", function(tpl, zones, session) {

            if (!session || session.username == "") {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            inCp.UserSession = session;
            inpack.UserSession = session;

            if (!zones.items || zones.items.length == 0) {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            inCp.Zones = zones;

            $("#body-content").html(tpl);

            l4iTemplate.Render({
                dstid: "incp-topbar-userbar",
                tplid: "incp-topbar-user-signed-tpl",
                data: inCp.UserSession,
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

            l4i.UrlEventRegister("app/index", inCpApp.Index, "incp-topbar-nav-menus");
            l4i.UrlEventRegister("pod/index", inCpPod.Index, "incp-topbar-nav-menus");
            l4i.UrlEventRegister("res/index", inCpRes.Index, "incp-topbar-nav-menus");
            l4i.UrlEventRegister("ips/index", inpack.Index, "incp-topbar-nav-menus");

            l4i.UrlEventHandler("app/index", true);
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

        l4i.Ajax(inCp.base + "auth/session", {
            callback: function(err, data) {
                if (!data || data.kind != "AuthSession") {
                    return ep.emit('error', "AuthSession");
                }
                ep.emit("session", data);
            },
        });

        inCp.TplFetch("index/index", {
            callback: ep.done("tpl"),
        });
    });
}


inCp.AlertUserLogin = function() {
    l4iAlert.Open("warn", "You are not logged in, or your login session has expired. Please sign in again", {
        close: false,
        buttons: [{
            title: "SIGN IN",
            href: inCp.base + "auth/login",
        }],
    });
}

inCp.ApiCmd = function(url, options) {
    var appcb = null;
    if (options.callback) {
        appcb = options.callback;
    }
    options.callback = function(err, data) {
        if (err == "Unauthorized") {
            return inCp.AlertUserLogin();
        }
        if (appcb) {
            appcb(err, data);
        }
    }

    l4i.Ajax(inCp.api + url, options);
}

inCp.TplPath = function(url) {
    return inCp.tplbase + url + ".tpl";
}

inCp.TplFetch = function(url, options) {
    l4i.Ajax(inCp.TplPath(url), options);
}

inCp.Loader = function(target, uri) {
    l4i.Ajax(inCp.tplbase + uri + ".tpl", {
        callback: function(err, data) {
            if (!err) {
                $("#" + target).html(data);
            }
        }
    });
}

inCp.CompLoader = function(uri) {
    inCp.Loader("comp-content", uri);
}

inCp.WorkLoader = function(uri) {
    inCp.Loader("work-content", uri);
}

inCp.UtilResSizeFormat = function(size, tofix) {
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
            return (size / Math.pow(1024, ms[i][0])).toFixed(tofix) + " " + ms[i][1];
        }
    }

    if (size == 0) {
        return size;
    }

    return size + " B";
}


inCp.OpToolsRefresh = function(div_target, cb) {
    if (!div_target) {
        return;
    }

    if (!cb || typeof cb !== "function") {
        cb = function() {};
    }

    if (typeof div_target == "string" && div_target == inCp.OpToolActive) {
        return cb();
    }

    // if (!div_target) {
    //     div_target = "#incp-optools";
    // }

    // $("#incp-module-navbar-optools").empty();
    if (typeof div_target == "string") {

        var opt = $("#work-content").find(div_target);
        // console.log(opt.html());
        if (opt) {
            // $("#incp-module-navbar-optools").html(opt.html());
            l4iTemplate.Render({
                dstid: "incp-module-navbar-optools",
                tplsrc: opt.html(),
                data: {},
                callback: cb,
            });
            inCp.OpToolActive = div_target;
        }
    }
}

inCp.OpToolsClean = function() {
    $("#incp-module-navbar-optools").html("");
    inCp.OpToolActive = null;
}

inCp.CodeRender = function() {
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
                modes.push("~/cm/5/mode/" + lang + "/" + lang + ".js");
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
inCp.ArrayUint32MatchAny = function(ar, ar2)
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

inCp.OpActionTitle = function(op_action) {
    op_action = parseInt(op_action);
    for (var i in inCp.OpActions) {
        if (inCp.OpActionAllow(op_action, inCp.OpActions[i].action)) {
            return (inCp.OpActions[i].title);
        }
    }
    return "";
}

inCp.OpActionStatusTitle = function(action) {
    for (var i in inCp.OpActionStatus) {
        if (inCp.OpActionAllow(action, inCp.OpActionStatus[i].action)) {
            return inCp.OpActionStatus[i].title;
        }
    }
    return "";
}

inCp.OpActionAllow = function(opbase, action) {
    if ((opbase & action) == action) {
        return true;
    }
    return false;
}

inCp.About = function() {
    seajs.use(["ep"], function(EventProxy) {
        var ep = EventProxy.create("tpl", function(tpl) {

            l4iModal.Open({
                title: "System Info",
                tplsrc: tpl,
                width: 800,
                height: 400,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.TplFetch("index/about", {
            callback: ep.done("tpl"),
        });
    });
}

inCp.NavBack = function(fn) {

    if (fn && typeof fn === "function") {
        inCp.nav_back = fn;
        $("#incp-navbar-back").css({
            "display": "block"
        });
        return;
    }

    if (inCp.nav_back) {
        inCp.nav_back();
        inCp.nav_back = null;
        $("#incp-navbar-back").css({
            "display": "nono"
        });
    }
}

inCp.TimeUptime = function(sec) {
    var s = [];

    var d = parseInt(sec / 86400);
    if (d > 1) {
        s.push(d + " days");
    } else if (d == 1) {
        s.push(d + " day");
    }

    var s2 = [];
    sec = sec % 86400;
    var h = parseInt(sec / 3600);
    if (h < 10) {
        s2.push("0" + h);
    } else {
        s2.push(h);
    }

    sec = sec % 3600;
    var m = parseInt(sec / 60);
    if (m < 10) {
        s2.push("0" + m);
    } else {
        s2.push(m);
    }

    sec = sec % 60;
    if (sec < 10) {
        s2.push("0" + sec);
    } else {
        s2.push(sec);
    }
    s.push(s2.join(":"));

    return s.join(", ");
}
