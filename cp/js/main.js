var inCp = {
    version: "0.3",
    base: "/in/cp/",
    tplbase: "/in/cp/-/",
    api: "/in/v1/",
    debug: true,
    Zones: null,
    zone_id: null,
    OpToolActive: null,
    UserSession: null,
    syscfg: {
        zone_id: "local",
        zone_master: {},
        sys_configs: [],
    },
    OpActions: [
        {
            action: 1 << 1,
            title: "Start",
            style: "success",
        },
        {
            action: 1 << 3,
            title: "Stop",
            style: "warning",
        },
        {
            action: 1 << 5,
            title: "Destroy",
            style: "secondary",
        },
    ],
    OpActionStatus: [
        {
            action: 1 << 2,
            title: "Running",
            style: "success",
        },
        {
            action: 1 << 4,
            title: "Stopped",
            style: "warning",
        },
        {
            action: 1 << 6,
            title: "Destroyed",
            style: "secondary",
        },
        {
            action: 1 << 11,
            title: "Pending",
            style: "primary",
        },
        {
            action: 1 << 12,
            title: "Warning",
            style: "warning",
        },
    ],
    OpActionStart: 1 << 1,
    OpActionRunning: 1 << 2,
    OpActionStop: 1 << 3,
    OpActionStopped: 1 << 4,
    OpActionDestroy: 1 << 5,
    OpActionDestroyed: 1 << 6,
    OpActionMigrate: 1 << 7,
    OpActionMigrated: 1 << 8,
    OpActionFailover: 1 << 9,
    OpActionPending: 1 << 11,
    OpActionWarning: 1 << 12,
    ResVolValueAttrSSD: 1 << 5,
    ByteMB: 1024 * 1024,
    ByteGB: 1024 * 1024 * 1024,
    well_signin_html: '<div>You are not logged in, or your login session has expired. Please sign in.</div><div><a href="/in/cp/auth/login" class="btn btn-primary">SIGN IN</a></div>',
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
        "~/twbs/4/css/bootstrap.css",
        "~/jquery/jquery.js" + inCp.debug_uri(),
        "~/lessui/js/browser-detect.js",
        "~/fa/css/fa.css",
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
            "~/lessui/css/base.css" + inCp.debug_uri(),
            "~/lessui/js/lessui.js" + inCp.debug_uri(),
            "~/cp/css/main.css" + inCp.debug_uri(),
            "~/cp/js/host.js" + inCp.debug_uri(),
            "~/cp/js/spec.js" + inCp.debug_uri(),
            "~/cp/js/pod.js" + inCp.debug_uri(),
            "~/cp/js/pod-rep.js" + inCp.debug_uri(),
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

        var ep = EventProxy.create("tpl", "zones", "session", "syscfg", "lang", function(tpl, zones, session, syscfg, lang) {

            if (lang && lang.items) {
                l4i.LangSync(lang.items, lang.locale);
            }

            if (!session || session.username == "") {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            inCp.UserSession = session;
            inpack.UserSession = session;

            if (!zones.items || zones.items.length == 0) {
                return alert("Network Exception, Please try again later (EC:zone-list)");
            }
            inCp.Zones = zones;

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

                    if (inCp.UserSession.username == "sysadmin") {
                        $("#incp-nav-ops-entry").css({
                            "display": "block"
                        });
                    }
                },
            });

            l4i.UrlEventRegister("app/index", inCpApp.Index, "incp-topbar-nav-menus");
            l4i.UrlEventRegister("pod/index", inCpPod.Index, "incp-topbar-nav-menus");
            l4i.UrlEventRegister("res/index", inCpRes.Index, "incp-topbar-nav-menus");
            l4i.UrlEventRegister("ips/index", inpack.Index, "incp-topbar-nav-menus");

            l4i.UrlEventHandler("pod/index", true);
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

        l4i.Ajax(inCp.base + "langsrv/locale", {
            callback: ep.done("lang"),
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
            style: "btn-outline-secondary",
        }],
    });
}

inCp.AlertAccessDenied = function() {
    l4iAlert.Open("warn", "Access Denied", {
        close: false,
        buttons: [{
            title: "Close",
            onclick: "l4iAlert.Close()",
            style: "btn-outline-secondary",
        }],
    });
}

inCp.ApiCmd = function(url, options) {
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

inCp.ModuleNavbarMenu = function(name, items, active) {

    if (!items || items.length < 1) {
        // $("#incp-module-navbar").remove();
        return;
    }
    items = l4i.Clone(items);

    var elem = document.getElementById("incp-module-navbar-menus");
    if (!elem) {
        $("#comp-content").html("<div id='incp-module-navbar'>\
  <ul id='incp-module-navbar-menus' class='incp-module-nav'></ul>\
  <ul id='incp-module-navbar-optools' class='incp-module-nav incp-nav-right'></ul>\
</div>\
<div id='work-content'></div>");
        inCp.module_navbar_menu_active = null;
    }

    // if (inCp.module_navbar_menu_active && inCp.module_navbar_menu_active == name) {
    //     return;
    // }

    // if (!active && items.length > 0) {
    //     active = items[0].uri;
    // }

    var html = "";
    for (var i in items) {
        if (!items[i].style) {
            items[i].style = "";
        }
        if (items[i].uri == active) {
            items[i].style += " active";
        }
        if (items[i].onclick) {
            items[i]._onclick = "onclick=\"" + items[i].onclick + "\"";
        } else {
            items[i]._onclick = "";
        }
        var icon = "";
        if (items[i].icon_fa) {
            icon = "<span class=\"fa fa-" + items[i].icon_fa + "\"></span> ";
        }
        html += "<li><a class='l4i-nav-item " + items[i].style + "' href='#" + items[i].uri + "' " + items[i]._onclick + ">" + icon + items[i].name + "</a></li>";
    }
    $("#incp-module-navbar-menus").html(html);
    l4i.UrlEventClean("incp-module-navbar-menus");
}

inCp.ModuleNavbarMenuRefresh = function(div_target, cb) {
    if (!div_target) {
        return;
    }

    var elem = document.getElementById(div_target);
    if (!elem) {
        return;
    }
    $("#incp-module-navbar-menus").html(elem.innerHTML);

    if (cb && typeof cb === "function") {
        cb(null);
    }
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

        var opt = $("#comp-content").find(div_target);
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

inCp.codeEditorInstances = {};

inCp.CodeEditor = function(id, lang, lines) {

    var elem = document.getElementById(id);
    if (!elem) {
        return;
    }

    var modes = [
        "~/cm/5/addon/runmode/runmode.js",
        "~/cm/5/addon/selection/active-line.js",
        "~/cm/5/mode/clike/clike.js",
    ];


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
    ], function() {

        seajs.use(modes, function() {

            inCp.codeEditorInstances[id] = CodeMirror.fromTextArea(elem, {
                mode: lang,
                lineNumbers: true,
                theme: "monokai",
                lineWrapping: true,
                styleActiveLine: true,
            });
            var lh = inCp.codeEditorInstances[id].defaultTextHeight();
            inCp.codeEditorInstances[id].setSize("100%", lines * lh);
        });
    });
}

inCp.CodeEditorValue = function(id) {
    var editor = inCp.codeEditorInstances[id];
    if (!editor) {
        return null;
    }
    return editor.getValue();
}

inCp.ArrayStringHas = function(ar, v) {
    if (!ar || !v) {
        return false;
    }

    for (var i in ar) {
        if (ar[i] == v) {
            return true;
        }
    }

    return false;
}

inCp.ArrayLabelHas = function(ar, name, value) {
    if (!ar || !name) {
        return false;
    }

    for (var i in ar) {
        if (ar[i].name == name) {
            if (value) {
                if (ar[i].value && ar[i].value != value) {
                    return false;
                }
            }
            return true;
        }
    }

    return false;
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

inCp.OpActionStatusItem = function(action) {
    var action = parseInt(action);
    for (var i in inCp.OpActionStatus) {
        if (inCp.OpActionAllow(action, inCp.OpActionStatus[i].action)) {
            return inCp.OpActionStatus[i];
        }
    }
    return null;
}

inCp.OpActionItem = function(op_action) {
    op_action = parseInt(op_action);
    for (var i in inCp.OpActions) {
        if (inCp.OpActionAllow(op_action, inCp.OpActionDestroy)) {
            return inCp.OpActions[i];
        }
        if (inCp.OpActionAllow(op_action, inCp.OpActions[i].action)) {
            return inCp.OpActions[i];
        }
    }
    return null;
}

inCp.OpActionTitle = function(op_action) {
    var item = inCp.OpActionItem(op_action);
    if (item) {
        return item.title;
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
                width: 900,
                height: 500,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        l4i.Ajax("/in/~/about.tpl", {
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

inCp.SysConfigValue = function(group_name, item_name) {
    for (var i in inCp.syscfg.sys_configs) {
        if (inCp.syscfg.sys_configs[i].name != group_name) {
            continue;
        }
        for (var j in inCp.syscfg.sys_configs[i].items) {
            if (inCp.syscfg.sys_configs[i].items[j].name == item_name) {
                return inCp.syscfg.sys_configs[i].items[j].value;
            }
        }
        break;
    }
    return null;
}

inCp.SysConfigValueIf = function(group_name, item_name, if_str) {
    var v = inCp.SysConfigValue(group_name, item_name);
    if (v) {
        return v;
    }
    return if_str;
}

