var inOpsHost = {
    statusls: [
        {
            status: 0,
            title: "Unknown",
        },
        {
            status: 1,
            title: "Active",
        },
        {
            status: 2,
            title: "Suspend",
        },
    ],
    node_statusls: [
        {
            phase: "Running",
            title: "Running",
        },
        {
            phase: "Suspended",
            title: "Suspended",
        },
        {
            phase: "Terminated",
            title: "Terminated",
        },
    ],
    actions: [
        // {action: 0, title: "Unknown"},
        {
            action: 1,
            title: "Active",
        },
        {
            action: 2,
            title: "Suspended",
        },
    ],
    zone_def: {
        kind: "HostZone",
        meta: {
            id: "",
            name: "",
        },
        status: 1,
        desc: "",
        wan_addrs: [],
        lan_addrs: [],
    },
    cell_def: {
        kind: "HostCell",
        meta: {
            id: "",
            name: "",
        },
        zone_id: "",
        phase: 1,
        desc: "",
    },
    zones: null,
    cells: null,
    nodes: null,
    nav_zone: null,
    nav_cell: null,
    nav_node: null,
    hchart_def: {
        type: "line",
        options: {
            height: "200px",
            title: "",
        },
        data: {
            labels: [],
            datasets: [],
        },
    },
    list_nav_menus: [
        {
            name: "Hosts",
            uri: "node/list",
        },
    ],
    PriorityDefault: 2,
    PriorityLength: 6,
};

inOpsHost.ActionTitle = function (action) {
    for (var i in inOpsHost.actions) {
        if (action == inOpsHost.actions[i].action) {
            return inOpsHost.actions[i].title;
        }
    }
    return "Unknown";
};

inOpsHost.NavInit = function () {
    // l4i.UrlEventRegister("host/index", inOpsHost.Index);
};

inOpsHost.Index = function () {
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("zones", "tpl", function (zones, tpl) {
            if (!zones || !zones.items) {
                return l4iAlert.Open("error", "Zone Not Found");
            }
            $("#comp-content").html(tpl);
            // inCp.ModuleNavbarMenuRefresh("inops-host-nav-tpl");

            inOpsHost.ZoneIndex();
        });

        ep.fail(function (err) {
            if (err == "AccessDenied") {
                return inCp.AlertAccessDenied();
            }
            alert("Error: " + err);
        });

        inOps.TplFetch("host/index", {
            callback: ep.done("tpl"),
        });

        // zones
        inOpsHost.ZoneRefresh(ep.done("zones"));
    });
};

inOpsHost.zone_active_fix = function (zoneid) {
    if (!inOpsHost.zones) {
        return false;
    }

    if (zoneid) {
        if (
            !inOpsHost.zone_active ||
            (inOpsHost.zone_active && inOpsHost.zone_active.meta.id != zoneid)
        ) {
            for (var i in inOpsHost.zones.items) {
                if (zoneid == inOpsHost.zones.items[i].meta.id) {
                    inOpsHost.zone_active = l4i.Clone(inOpsHost.zones.items[i]);
                    break;
                }
            }
        }
    }
    if (!inOpsHost.zone_active) {
        return false;
    }
    return true;
};

inOpsHost.cell_active_fix = function (zoneid, cellid) {
    if (!inOpsHost.zone_active_fix(zoneid)) {
        return false;
    }

    if (cellid) {
        if (
            !inOpsHost.cell_active ||
            (inOpsHost.cell_active && inOpsHost.cell_active.meta.id != cellid)
        ) {
            for (var i in inOpsHost.zone_active.cells) {
                if (cellid == inOpsHost.zone_active.cells[i].meta.id) {
                    inOpsHost.cell_active = l4i.Clone(inOpsHost.zone_active.cells[i]);
                    break;
                }
            }
        }
    }
    if (!inOpsHost.cell_active) {
        return false;
    }
    if (inOpsHost.cell_active.zone_id != inOpsHost.zone_active.meta.id) {
        inOpsHost.cell_active = null;
        return false;
    }

    return true;
};

inOpsHost.NodeList = function (zoneid, cellid) {
    if (!inOpsHost.cell_active_fix(zoneid, cellid)) {
        return;
    }

    l4iStorage.Set("inops_cluster_cell_id", inOpsHost.cell_active.meta.id);

    var uri = "";
    if (document.getElementById("inops_hostls_qry")) {
        uri = "qry_text=" + $("#inops_hostls_qry").val();
    }

    inCp.ModuleNavbarMenuRefresh("inops-host-nav-tpl");
    if (inOps.nav_cluster_zone) {
        $("#inops-cluster-nav-zone").css({
            display: "block",
        });
        $("#inops-cluster-nav-zone-value").text("Zone: " + inOpsHost.zone_active.meta.id);
    }

    if (inOps.nav_cluster_cell) {
        $("#inops-cluster-nav-cell").css({
            display: "block",
        });
        $("#inops-cluster-nav-cell-value").text("Cell: " + inOpsHost.cell_active.meta.id);
    }

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "data", function (tpl, data) {
            if (tpl) {
                $("#work-content").html(tpl);
            }
            $("#inops-cluster-nav-host").css({
                display: "block",
            });

            if (inOps.nav_cluster_host) {
                inCp.OpToolsRefresh("#inops-host-nodels-optools");
            } else {
                inCp.OpToolsClean();
            }

            var tn = Date.now() / 1000;

            for (var i in data.items) {
                if (data.items[i].status && tn - data.items[i].status.updated > 3600) {
                    data.items[i]._status = "Offline";
                }
                if (!data.items[i].meta.name || data.items[i].meta.name.length < 1) {
                    data.items[i].meta.name = "localhost";
                }
                if (!data.items[i].operate.pr) {
                    data.items[i].operate.pr = inOpsHost.PriorityDefault;
                }
                if (!data.items[i].operate.cpu_used) {
                    data.items[i].operate.cpu_used = 0;
                }
                if (!data.items[i].operate.mem_used) {
                    data.items[i].operate.mem_used = 0;
                }
            }

            l4iTemplate.Render({
                dstid: "inops-host-nodes",
                tplid: "inops-host-nodes-tpl",
                data: data,
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        inOps.TplFetch("host/node-list", {
            callback: ep.done("tpl"),
        });

        inOpsHost.node_list_refresh(
            inOpsHost.zone_active.meta.id,
            inOpsHost.cell_active.meta.id,
            ep.done("data")
        );
    });
};

inOpsHost.NodeOpPortUsedInfo = function (z, c, node_id) {
    for (var i in inOpsHost.nodes.items) {
        if (node_id != inOpsHost.nodes.items[i].meta.id) {
            continue;
        }

        var s = "no port assigned yet...";
        if (
            inOpsHost.nodes.items[i].operate.port_used &&
            inOpsHost.nodes.items[i].operate.port_used.length > 0
        ) {
            s = inOpsHost.nodes.items[i].operate.port_used.join(", ");
        }

        return l4iModal.Open({
            title: "Network Port already assigned",
            tplsrc: s,
            width: 700,
            height: 350,
            buttons: [
                {
                    onclick: "l4iModal.Close()",
                    title: "Close",
                },
            ],
        });
    }
};

inOpsHost.NodePodList = function (z, c, node_id) {
    var node = null;

    for (var i in inOpsHost.nodes.items) {
        if (node_id != inOpsHost.nodes.items[i].meta.id) {
            continue;
        }
        node = inOpsHost.nodes.items[i];
        break;
    }
    if (!node) {
        return;
    }

    var alert_id = "#inops-host-podls-selector-alert";

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "data", function (tpl, data) {
            l4iModal.Open({
                id: "inops-host-pod-list",
                title: "Pod List",
                tplsrc: tpl,
                width: 1200,
                height: 800,
                callback: function () {
                    if (data.error) {
                        return l4i.InnerAlert(alert_id, "error", data.error.message);
                    }
                    if (data.items.length < 1) {
                        return l4i.InnerAlert(alert_id, "alert-info", "No Item Found Yet ...");
                    }
                    l4iTemplate.Render({
                        dstid: "inops-host-podls-selector",
                        tplid: "inops-host-podls-selector-tpl",
                        data: data,
                    });
                },
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                ],
            });
        });

        ep.fail(function (err) {
            //
        });

        inCpPod.ListRefresh({
            zone_id: node.operate.zone_id,
            exp_filter_host_id: node.meta.id,
            exp_filter_meta_user_all: true,
            callback: ep.done("data"),
            fields: ["spec/vol_sys", "spec/box"],
        });

        inOps.TplFetch("host/node-pod-selector", {
            callback: ep.done("tpl"),
        });
    });
};

inOpsHost.NodePodInfo = function (pod_id) {
    inCpPod.Info(pod_id);
};

inOpsHost.NodeSet = function (zoneid, cellid, nodeid) {
    if (!zoneid) {
        zoneid = l4iStorage.Get("inops_cluster_zone_id");
    }

    if (!cellid) {
        cellid = l4iStorage.Get("inops_cluster_cell_id");
    }

    if (!nodeid) {
        nodeid = inOpsHost.node_active_id;
        if (!nodeid) {
            return;
        }
    }

    var alert_id = "#inops-host-nodeset-alert";

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {
            if (!rsj || !rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            rsj._actions = inOpsHost.actions;
            if (!rsj.status) {
                rsj.status = {};
            }
            if (!rsj.status.phase) {
                rsj.status.phase = 0;
            }
            if (!rsj.meta.name) {
                rsj.meta.name = "";
            }
            if (!rsj.operate.pr) {
                rsj.operate.pr = inOpsHost.PriorityDefault;
            }
            rsj._priorities = [];
            for (var i = 1; i < inOpsHost.PriorityLength - 1; i++) {
                var v = "";
                if (i == 1) {
                    v = " First allocation";
                } else if (i + 2 == inOpsHost.PriorityLength) {
                    v = " Final allocation";
                }
                rsj._priorities.push({
                    pr: i,
                    name: i + v,
                });
            }

            l4iModal.Open({
                title: "Host Setting",
                tplsrc: tpl,
                data: rsj,
                width: 900,
                height: 350,
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                    {
                        onclick: "inOpsHost.NodeSetCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    },
                ],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        // template
        inOps.TplFetch("host/node-set", {
            callback: ep.done("tpl"),
        });

        // data
        inOps.ApiCmd(
            "host/node-entry?zoneid=" + zoneid + "&cellid=" + cellid + "&nodeid=" + nodeid,
            {
                api_zone_id: zoneid,
                callback: ep.done("data"),
            }
        );
    });
};

inOpsHost.NodeSetCommit = function () {
    var form = $("#inops-host-node-form"),
        alert_id = "#inops-host-nodeset-alert";

    var req = {
        meta: {
            id: form.find("input[name=id]").val(),
            name: form.find("input[name=name]").val(),
        },
        operate: {
            action: parseInt(form.find("input[name=operate_action]:checked").val()),
            zone_id: form.find("input[name=operate_zone_id]").val(),
            cell_id: form.find("input[name=operate_cell_id]").val(),
            pr: parseInt(form.find("select[name=operate_pr]").val()),
        },
        spec: {},
    };

    inOps.ApiCmd("host/node-set", {
        api_zone_id: req.operate.zone_id,
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err) {
                return l4i.InnerAlert(alert_id, "alert-danger", err);
            }

            if (!rsj) {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "alert-danger", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "alert-success", "Successfully Updated");

            window.setTimeout(function () {
                l4iModal.Close();
                var el = document.getElementById("inops-host-nodes");
                if (el) {
                    inOpsHost.NodeList();
                }
                el = document.getElementById("inops-host-node-overview-action");
                if (el) {
                    el.innerHTML = inOpsHost.ActionTitle(req.operate.action);
                }
            }, 500);
        },
    });
};

inOpsHost.NodeSecretKeySet = function (zoneid, cellid, nodeid) {
    if (!zoneid) {
        zoneid = l4iStorage.Get("inops_cluster_zone_id");
    }

    if (!cellid) {
        cellid = l4iStorage.Get("inops_cluster_cell_id");
    }

    if (!nodeid) {
        nodeid = inOpsHost.node_active_id;
        if (!nodeid) {
            return;
        }
    }

    var alert_id = "#inops-host-node-secretkey-set-alert";

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", function (tpl) {
            l4iModal.Open({
                title: "Reset Secret Key",
                tplsrc: tpl,
                data: {
                    zone_id: zoneid,
                    node_id: nodeid,
                },
                width: 700,
                height: 300,
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                    {
                        onclick: "inOpsHost.NodeSecretKeySetCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    },
                ],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        inOps.TplFetch("host/node-secretkey-set", {
            callback: ep.done("tpl"),
        });
    });
};

inOpsHost.NodeSecretKeySetCommit = function () {
    var form = $("#inops-host-node-secretkey-form"),
        alert_id = "#inops-host-node-secretkey-set-alert";

    var req = {
        zone_id: form.find("input[name=zone_id]").val(),
        node_id: form.find("input[name=node_id]").val(),
        secret_key: form.find("input[name=secret_key]").val(),
    };

    inOps.ApiCmd("host/node-secret-key-set", {
        api_zone_id: req.zone_id,
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err) {
                return l4i.InnerAlert(alert_id, "alert-danger", err);
            }

            if (!rsj) {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "alert-danger", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "alert-success", "Successfully Updated");

            window.setTimeout(function () {
                l4iModal.Close();
                var el = document.getElementById("inops-host-nodes");
                if (el) {
                    inOpsHost.NodeList();
                }
            }, 500);
        },
    });
};

inOpsHost.NodeNew = function (zoneid, cellid) {
    if (!zoneid) {
        zoneid = l4iStorage.Get("inops_cluster_zone_id");
    }

    if (!cellid) {
        cellid = l4iStorage.Get("inops_cluster_cell_id");
    }

    inOps.TplFetch("host/node-new", {
        callback: function (err, tpl) {
            var priorities = [];
            for (var i = 1; i < inOpsHost.PriorityLength - 1; i++) {
                var v = "";
                if (i == 1) {
                    v = " First allocation";
                } else if (i + 2 == inOpsHost.PriorityLength) {
                    v = " Final allocation";
                }
                priorities.push({
                    pr: i,
                    name: i + v,
                });
            }

            l4iModal.Open({
                title: "New Host",
                tplsrc: tpl,
                width: 900,
                height: 500,
                data: {
                    operate: {
                        zone_id: zoneid,
                        cell_id: cellid,
                        action: 1,
                        pr: inOpsHost.PriorityDefault,
                    },
                    _phase: "Running",
                    _actions: inOpsHost.actions,
                    _priorities: priorities,
                },
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                    {
                        onclick: "inOpsHost.NodeNewCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    },
                ],
            });
        },
    });
};

inOpsHost.NodeNewCommit = function () {
    var form = $("#inops-host-node-form"),
        alert_id = "#inops-host-nodenew-alert";

    var req = {
        name: form.find("input[name=name]").val(),
        action: parseInt(form.find("input[name=operate_action]").val()),
        zone_id: form.find("input[name=operate_zone_id]").val(),
        cell_id: form.find("input[name=operate_cell_id]").val(),
        peer_lan_addr: form.find("input[name=peer_lan_addr]").val(),
        secret_key: form.find("input[name=secret_key]").val(),
    };

    inOps.ApiCmd("host/node-new", {
        api_zone_id: req.zone_id,
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "alert-danger", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "alert-success", "Successfully Updated");

            window.setTimeout(function () {
                l4iModal.Close();
                inOpsHost.NodeList();
            }, 500);
        },
    });
};

inOpsHost.entry_nav_menus = [
    {
        name: "Back",
        onclick: "inOpsHost.NodeList()",
        uri: "",
        style: "primary",
    },
    {
        name: "Overview",
        uri: "host/node/overview",
    },
    {
        name: "Graphs",
        uri: "host/node/stats",
    },
    {
        //    name: "Settings",
        //    uri: "host/node/setup",
        //    onclick: "inOpsHost.NodeSet()",
        // }, {
        name: "ReSet SecretKey",
        uri: "host/node/setretkey",
        onclick: "inOpsHost.NodeSecretKeySet()",
    },
];

inOpsHost.Node = function (zone_id, host_id, nav_target) {
    if (!zone_id) {
        zone_id = l4iStorage.Get("inops_cluster_zone_id");
    }

    if (!host_id) {
        return;
    }

    inOpsHost.node_active_zone_id = zone_id;
    inOpsHost.node_active_id = host_id;

    inCp.ModuleNavbarMenu("ops/host/entry", inOpsHost.entry_nav_menus);

    l4i.UrlEventRegister("host/node/overview", inOpsHost.NodeOverview, "incp-module-navbar-menus");
    l4i.UrlEventRegister("host/node/stats", inOpsHost.NodeStats, "incp-module-navbar-menus");

    switch (nav_target) {
        case "stats":
            l4i.UrlEventHandler("host/node/stats", false);
            break;

        default:
            l4i.UrlEventHandler("host/node/overview", false);
            break;
    }
};

inOpsHost.NodeOverview = function () {
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "node", function (tpl, node) {
            if (!node.spec.platform) {
                node.spec.platform = {};
            }

            if (node.spec.platform.kernel) {
                node.spec.platform.kernel = node.spec.platform.kernel.replace(/.x86_64$/g, "");
            }

            if (!node.meta.name) {
                node.meta.name = node.meta.id;
            }

            node.spec.capacity = node.spec.capacity || {};
            node.spec.capacity.cpu = node.spec.capacity.cpu || 1000;
            node.spec.capacity.mem = node.spec.capacity.mem || 0;

            if (!node.operate.cpu_used) {
                node.operate.cpu_used = 0;
            }
            if (!node.operate.mem_used) {
                node.operate.mem_used = 0;
            }

            if (!node.operate.port_used) {
                node.operate.port_used = [];
            }
            if (!node.operate.box_num) {
                node.operate.box_num = 0;
            }

            node.status = node.status || {};

            if (!node.status.volumes) {
                node.status.volumes = [];
            }
            for (var i in node.status.volumes) {
                if (!node.status.volumes[i].total) {
                    node.status.volumes[i].total = 1;
                }
                if (!node.status.volumes[i].used) {
                    node.status.volumes[i].used = 1;
                }
                node.status.volumes[i]._percent = parseInt(
                    (100 * node.status.volumes[i].used) / node.status.volumes[i].total
                );
            }

            if (node.status.uptime) {
                node.status._uptime = parseInt(new Date() / 1e3) - node.status.uptime;
            }

            if (!node.spec.peer_wan_addr) {
                node.spec.peer_wan_addr = "not set";
            }
            if (!node.spec.exp_docker_version) {
                node.spec.exp_docker_version = "disable";
            }
            if (!node.spec.exp_pouch_version) {
                node.spec.exp_pouch_version = "disable";
            }

            inCp.OpToolsClean();
            $("#work-content").html(tpl);

            inOpsHost.node_active = node;

            node._actions = inOpsHost.actions;

            l4iTemplate.Render({
                dstid: "inops-host-node-overview",
                tplid: "inops-host-node-overview-info-tpl",
                data: node,
            });
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:incp-node)");
        });

        inOps.ApiCmd(
            "host/node-entry?zoneid=" +
                inOpsHost.node_active_zone_id +
                "&nodeid=" +
                inOpsHost.node_active_id,
            {
                api_zone_id: inOpsHost.node_active_zone_id,
                callback: ep.done("node"),
            }
        );

        // inCp.ApiCmd("pod/status?id=" + inOpsHost.node_active_id, {
        //     callback: ep.done("pstatus"),
        // });

        inOps.TplFetch("host/node-overview", {
            callback: ep.done("tpl"),
        });
    });
};

inOpsHost.NodeStatsButton = function (obj) {
    $("#incp-module-navbar-optools").find(".hover").removeClass("hover");
    obj.setAttribute("class", "hover");
    inOpsHost.NodeStats(parseInt(obj.getAttribute("value")));
};

inOpsHost.nodeStatsFeedMaxValue = function (feed, names) {
    var max = 0;
    var arr = names.split(",");
    for (var i in feed.items) {
        if (arr.indexOf(feed.items[i].name) < 0) {
            continue;
        }
        for (var j in feed.items[i].items) {
            if (feed.items[i].items[j].value > max) {
                max = feed.items[i].items[j].value;
            }
        }
    }
    return max;
};

inOpsHost.NodeStats = function (time_past) {
    if (time_past) {
        inOpsHost.node_active_past = parseInt(time_past);
        if (!inOpsHost.node_active_past) {
            inOpsHost.node_active_past = 86400;
        }
    }
    if (inOpsHost.node_active_past < 600) {
        inOpsHost.node_active_past = 600;
    }
    if (inOpsHost.node_active_past > 30 * 86400) {
        inOpsHost.node_active_past = 30 * 86400;
    }

    var zoneid = l4iStorage.Get("inops_cluster_zone_id");

    var stats_url = "id=" + inOpsHost.node_active_id;
    var stats_query = {
        tc: 180,
        tp: inOpsHost.node_active_past,
        is: [
            {
                n: "cpu/sys",
                d: true,
            },
            {
                n: "cpu/user",
                d: true,
            },
            {
                n: "ram/us",
            },
            {
                n: "ram/cc",
            },
            {
                n: "net/rs",
                d: true,
            },
            {
                n: "net/ws",
                d: true,
            },
            {
                n: "fs/sp/rs",
                d: true,
            },
            {
                n: "fs/sp/rn",
                d: true,
            },
            {
                n: "fs/sp/ws",
                d: true,
            },
            {
                n: "fs/sp/wn",
                d: true,
            },
        ],
    };

    var wlimit = 700;
    var tfmt = "";
    var ww = $(window).width();
    var hh = $(window).height();
    if (ww > wlimit) {
        ww = wlimit;
    }
    if (hh < 800) {
        inOpsHost.hchart_def.options.height = "180px";
    } else {
        inOpsHost.hchart_def.options.height = "220px";
    }
    if (stats_query.tp > 10 * 86400) {
        stats_query.tc = 6 * 3600;
        tfmt = "m-d H";
    } else if (stats_query.tp > 3 * 86400) {
        stats_query.tc = 3 * 3600;
        tfmt = "m-d H";
    } else if (stats_query.tp > 86400) {
        stats_query.tc = 3600;
        tfmt = "m-d H";
    } else if (stats_query.tp >= 3 * 3600) {
        stats_query.tc = 1800;
        tfmt = "H:i";
    } else if (stats_query.tp >= 3 * 600) {
        stats_query.tc = 120;
        tfmt = "H:i";
    } else {
        stats_query.tc = 60;
        tfmt = "i:s";
    }

    stats_url += "&qry=" + btoa(JSON.stringify(stats_query));
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "node", "stats", function (tpl, node, stats) {
            if (tpl) {
                $("#work-content").html(tpl);
                $(".incp-podentry-stats-item").css({
                    "flex-basis": ww + "px",
                });
                inCp.OpToolsRefresh("#inops-node-optools-stats");
            }

            var max = 0;
            var tc_title = stats.cycle + " seconds";
            var tc_ns = stats.cycle * 1000000000;
            if (stats.cycle >= 86400 && stats.cycle % 86400 == 0) {
                tc_title = stats.cycle / 86400 + " Day";
                if (stats.cycle > 86400) {
                    tc_title += "s";
                }
            } else if (stats.cycle >= 3600 && stats.cycle % 3600 == 0) {
                tc_title = stats.cycle / 3600 + " Hour";
                if (stats.cycle > 3600) {
                    tc_title += "s";
                }
            } else if (stats.cycle >= 60 && stats.cycle % 60 == 0) {
                tc_title = stats.cycle / 60 + " Minute";
                if (stats.cycle > 60) {
                    tc_title += "s";
                }
            }

            //
            var stats_cpu = l4i.Clone(inOpsHost.hchart_def);
            stats_cpu.options.title = l4i.T("CPU Usage (Percentage / %s)", tc_title);
            /**
                max = inOpsHost.nodeStatsFeedMaxValue(stats, "cpu/user");
                if (max > 1000000000) {
                    stats_cpu.options.title = l4i.T("CPU (Seconds / %s)", tc_title);
                    stats_cpu._fix = 1000000000;
                } else if (max > 1000000) {
                    stats_cpu.options.title = l4i.T("CPU (Millisecond / %s)", tc_title);
                    stats_cpu._fix = 1000000;
                } else if (max > 1000) {
                    stats_cpu.options.title = l4i.T("CPU (Microsecond / %s)", tc_title);
                    stats_cpu._fix = 1000;
                } else {
                    stats_cpu.options.title = l4i.T("CPU (Nanosecond / %s)", tc_title);
                }
            */

            //
            var stats_ram = l4i.Clone(inOpsHost.hchart_def);
            stats_ram.options.title = l4i.T("Memory Usage (MB)");
            stats_ram._fix = 1024 * 1024;

            //
            var stats_net = l4i.Clone(inOpsHost.hchart_def);
            max = inOpsHost.nodeStatsFeedMaxValue(stats, "net/rs,net/ws");
            if (max > 1024 * 1024) {
                stats_net.options.title = l4i.T("Network Bytes (MB / %s)", tc_title);
                stats_net._fix = 1024 * 1024;
            } else if (max > 1024) {
                stats_net.options.title = l4i.T("Network Bytes (KB / %s)", tc_title);
                stats_net._fix = 1024;
            } else {
                stats_net.options.title = l4i.T("Network Bytes (Bytes / %s)", tc_title);
            }

            //
            var stats_fsn = l4i.Clone(inOpsHost.hchart_def);
            stats_fsn.options.title = l4i.T("Storage IO / %s", tc_title);

            //
            var stats_fss = l4i.Clone(inOpsHost.hchart_def);
            max = inOpsHost.nodeStatsFeedMaxValue(stats, "fs/sp/rs,fs/sp/ws");
            if (max > 1024 * 1024) {
                stats_fss.options.title = l4i.T("Storage IO Bytes (MB / %s)", tc_title);
                stats_fss._fix = 1024 * 1024;
            } else if (max > 1024) {
                stats_fss.options.title = l4i.T("Storage IO Bytes (KB / %s)", tc_title);
                stats_fss._fix = 1024;
            } else {
                stats_fss.options.title = l4i.T("Storage IO Bytes (Bytes / %s)", tc_title);
            }

            for (var i in stats.items) {
                var v = stats.items[i];
                var dataset = {
                    data: [],
                };
                var labels = [];
                var fix = 1;
                switch (v.name) {
                    case "cpu/sys":
                    case "cpu/user":
                        /**
                                        if (stats_cpu._fix && stats_cpu._fix > 1) {
                                            fix = stats_cpu._fix;
                                        }
                        */
                        fix = tc_ns / 100;
                        break;

                    case "ram/us":
                    case "ram/cc":
                        if (stats_ram._fix && stats_ram._fix > 1) {
                            fix = stats_ram._fix;
                        }
                        break;

                    case "net/rs":
                    case "net/ws":
                        if (stats_net._fix && stats_net._fix > 1) {
                            fix = stats_net._fix;
                        }
                        break;

                    case "fs/sp/rs":
                    case "fs/sp/ws":
                        if (stats_fss._fix && stats_fss._fix > 1) {
                            fix = stats_fss._fix;
                        }
                        break;
                }

                for (var j in v.items) {
                    var v2 = v.items[j];

                    var t = new Date(v2.time * 1000);
                    labels.push(t.l4iTimeFormat(tfmt));

                    if (!v2.value) {
                        v2.value = 0;
                    }

                    if (fix > 1) {
                        v2.value = (v2.value / fix).toFixed(2);
                    }

                    dataset.data.push(v2.value);
                }

                switch (v.name) {
                    case "cpu/sys":
                        stats_cpu.data.labels = labels;
                        dataset.label = "System";
                        stats_cpu.data.datasets.push(dataset);
                        break;

                    case "cpu/user":
                        stats_cpu.data.labels = labels;
                        dataset.label = "User";
                        stats_cpu.data.datasets.push(dataset);
                        break;

                    case "ram/us":
                        stats_ram.data.labels = labels;
                        dataset.label = "Usage";
                        stats_ram.data.datasets.push(dataset);
                        break;

                    case "ram/cc":
                        stats_ram.data.labels = labels;
                        dataset.label = "Cache";
                        stats_ram.data.datasets.push(dataset);
                        break;

                    case "net/rs":
                        stats_net.data.labels = labels;
                        dataset.label = "Read";
                        stats_net.data.datasets.push(dataset);
                        break;

                    case "net/ws":
                        stats_net.data.labels = labels;
                        dataset.label = "Send";
                        stats_net.data.datasets.push(dataset);
                        break;

                    case "fs/sp/rs":
                        stats_fss.data.labels = labels;
                        dataset.label = "Read";
                        stats_fss.data.datasets.push(dataset);
                        break;

                    case "fs/sp/ws":
                        stats_fss.data.labels = labels;
                        dataset.label = "Write";
                        stats_fss.data.datasets.push(dataset);
                        break;

                    case "fs/sp/rn":
                        stats_fsn.data.labels = labels;
                        dataset.label = "Read";
                        stats_fsn.data.datasets.push(dataset);
                        break;

                    case "fs/sp/wn":
                        stats_fsn.data.labels = labels;
                        dataset.label = "Write";
                        stats_fsn.data.datasets.push(dataset);
                        break;
                }
            }

            var statses = [
                {
                    data: stats_cpu,
                    target: "cpu",
                },
                {
                    data: stats_ram,
                    target: "ram",
                },
                {
                    data: stats_net,
                    target: "net",
                },
                {
                    data: stats_fss,
                    target: "fss",
                },
                {
                    data: stats_fsn,
                    target: "fsn",
                },
            ];

            l4iTemplate.Render({
                dstid: "inops-node-stats-list",
                tplid: "inops-node-stats-item-tpl",
                data: {
                    items: statses,
                },
                callback: function () {
                    for (var i in statses) {
                        statses[i].data.options.title = "";
                        hooto_chart.RenderElement(
                            statses[i].data,
                            "inops-node-stats-" + statses[i].target
                        );
                    }
                },
            });
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:inops-node)");
        });

        inOps.ApiCmd("host/node-entry?zoneid=" + zoneid + "&nodeid=" + inOpsHost.node_active_id, {
            api_zone_id: zoneid,
            callback: ep.done("node"),
        });

        inOps.ApiCmd("host/node-stats-feed?" + stats_url, {
            api_zone_id: zoneid,
            callback: ep.done("stats"),
        });

        inOps.TplFetch("host/node-stats", {
            callback: ep.done("tpl"),
        });
    });
};

inOpsHost.ZoneRefresh = function (cb, force) {
    if (inOpsHost.zones && !force) {
        return cb(null, inOpsHost.zones);
    }

    inOps.ApiCmd("host/zone-list?fields=cells", {
        callback: function (err, zones) {
            if (err) {
                return cb(err, null);
            }

            if (!zones) {
                return cb("Network Connection Exception", null);
            }

            if (zones.error) {
                if (zones.error.code == "AccessDenied") {
                    return cb(zones.error.code, null);
                }
                return cb(zones.error.message, null);
            }

            if (!zones.kind || zones.kind != "HostZoneList") {
                return cb("Network Connection Exception", null);
            }

            for (var i in zones.items) {
                if (!zones.items[i].summary) {
                    zones.items[i].summary = "";
                }
                if (!zones.items[i].cells) {
                    zones.items[i].cells = [];
                }
                for (var j in zones.items[i].cells) {
                    if (!zones.items[i].cells[j].description) {
                        zones.items[i].cells[j].description = "";
                    }
                    if (!zones.items[i].cells[j].node_num) {
                        zones.items[i].cells[j].node_num = 0;
                    }
                }
                if (
                    inOpsHost.zone_active &&
                    inOpsHost.zone_active.meta.id == zones.items[i].meta.id
                ) {
                    inOpsHost.zone_active = l4i.Clone(zones.items[i]);
                }
            }

            inOpsHost.zones = zones;
            cb(null, inOpsHost.zones);
        },
    });
};

inOpsHost.node_list_refresh = function (zoneid, cellid, cb) {
    inOps.ApiCmd("host/node-list?zoneid=" + zoneid + "&cellid=" + cellid, {
        api_zone_id: zoneid,
        callback: function (err, nodes) {
            if (err) {
                return cb(err, null);
            }

            if (!nodes) {
                return cb("Network Connection Exception", null);
            }

            if (nodes.error) {
                return cb(nodes.error.message, null);
            }

            if (!nodes.kind || nodes.kind != "HostNodeList") {
                return cb("Network Connection Exception", null);
            }

            for (var i in nodes.items) {
                for (var j in inOpsHost.actions) {
                    if (inOpsHost.actions[j].action == nodes.items[i].operate.action) {
                        nodes.items[i]._action_display = inOpsHost.actions[j].title;
                        break;
                    }
                }

                if (!nodes.items[i].meta.name) {
                    nodes.items[i].meta.name = "";
                }

                if (!nodes.items[i].status) {
                    nodes.items[i].status = {};

                    if (!nodes.items[i].status.phase) {
                        nodes.items[i].status.phase = 0;
                    }
                }
                if (!nodes.items[i].spec) {
                    nodes.items[i].spec = {};
                }

                if (!nodes.items[i].spec.peer_wan_addr) {
                    nodes.items[i].spec.peer_wan_addr = "";
                }
                if (!nodes.items[i].spec.http_port) {
                    nodes.items[i].spec.http_port = "";
                }

                //
                if (!nodes.items[i].spec.platform) {
                    nodes.items[i].spec.platform = {};
                }
                if (!nodes.items[i].spec.platform.os) {
                    nodes.items[i].spec.platform.os = "";
                }
                if (!nodes.items[i].spec.platform.kernel) {
                    nodes.items[i].spec.platform.kernel = "";
                }
                // nodes.items[i].spec.platform.kernel = nodes.items[i].spec.platform.kernel.replace(/.el\d(.*?).x86_64$/g, '')
                nodes.items[i].spec.platform.kernel = nodes.items[i].spec.platform.kernel.replace(
                    /.x86_64$/g,
                    ""
                );
                if (!nodes.items[i].spec.platform.arch) {
                    nodes.items[i].spec.platform.arch = "";
                }

                //
                if (!nodes.items[i].spec.capacity) {
                    nodes.items[i].spec.capacity = {};
                }
                if (!nodes.items[i].spec.capacity.cpu) {
                    nodes.items[i].spec.capacity.cpu = 1000;
                }
                if (!nodes.items[i].spec.capacity.mem) {
                    nodes.items[i].spec.capacity.mem = 0;
                }

                if (!nodes.items[i].operate.ports) {
                    nodes.items[i].operate.ports = [];
                }
                if (!nodes.items[i].operate.port_used) {
                    nodes.items[i].operate.port_used = [];
                }
                if (!nodes.items[i].operate.box_num) {
                    nodes.items[i].operate.box_num = 0;
                }
                if (!nodes.items[i].operate.pr) {
                    nodes.items[i].operate.pr = inOpsHost.PriorityDefault;
                }
            }

            inOpsHost.nodes = nodes;
            cb(null, nodes);
        },
    });
};

inOpsHost.CellIndex = function () {
    if (!inOpsHost.zone_active) {
        return;
    }
    if (inOps.nav_cluster_cell) {
        $("#inops-cluster-nav-cell").css({
            display: "block",
        });
    }

    l4iStorage.Set("inops_cluster_zone_id", inOpsHost.zone_active.meta.id);
    var cell_active_id = l4iStorage.Get("inops_cluster_cell_id");
    inOpsHost.cell_active = null;

    if (!inOps.nav_cluster_cell && !cell_active_id && inOpsHost.zone_active.cells.length > 0) {
        inOpsHost.cell_active = l4i.Clone(inOpsHost.zone_active.cells[0]);
        cell_active_id = inOpsHost.cell_active.meta.id;
        l4iStorage.Set("inops_cluster_cell_id", cell_active_id);
    }

    if (
        cell_active_id &&
        (!inOpsHost.cell_active || inOpsHost.cell_active.meta.id != cell_active_id)
    ) {
        for (var i in inOpsHost.zone_active.cells) {
            if (cell_active_id == inOpsHost.zone_active.cells[i].meta.id) {
                inOpsHost.cell_active = l4i.Clone(inOpsHost.zone_active.cells[i]);
                break;
            }
        }
    }

    if (
        cell_active_id &&
        inOpsHost.cell_active &&
        cell_active_id == inOpsHost.cell_active.meta.id
    ) {
        if (inOps.nav_cluster_cell) {
            $("#inops-cluster-nav-cell-value").text("Cell: " + inOpsHost.cell_active.meta.id);
        }
        return inOpsHost.NodeList();
    }

    inOpsHost.CellList();
};

inOpsHost.CellList = function (zoneid) {
    if (!inOpsHost.zone_active_fix(zoneid)) {
        return;
    }

    l4iStorage.Del("inops_cluster_cell_id");

    $("#inops-cluster-nav-host").css({
        display: "none",
    });
    if (inOps.nav_cluster_zone) {
        $("#inops-cluster-nav-zone").css({
            display: "block",
        });
        $("#inops-cluster-nav-zone-value").text("Zone: " + inOpsHost.zone_active.meta.id);
    }

    if (inOps.nav_cluster_cell) {
        $("#inops-cluster-nav-cell").css({
            display: "block",
        });
        $("#inops-cluster-nav-cell-value").text("Cells");
    }

    l4iStorage.Set("inops_cluster_zone_id", inOpsHost.zone_active.meta.id);
    inOpsHost.cell_active = null;

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", function (tpl) {
            if (tpl) {
                $("#work-content").html(tpl);
            }
            if (inOps.nav_cluster_cell) {
                inCp.OpToolsRefresh("#inops-cluster-cells-optools");
            } else {
                inCp.OpToolsClean();
            }

            l4iTemplate.Render({
                dstid: "inops-host-cells",
                tplid: "inops-host-cells-tpl",
                data: {
                    zone: inOpsHost.zone_active,
                    items: inOpsHost.zone_active.cells,
                },
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        inOps.TplFetch("host/cell-list", {
            callback: ep.done("tpl"),
        });
    });
};

inOpsHost.CellSet = function (zoneid, cellid) {
    if (!inOpsHost.zone_active) {
        return;
    }
    zoneid = inOpsHost.zone_active.meta.id;
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "cell", function (tpl, cell) {
            if (!cell) {
                cell = l4i.Clone(inOpsHost.cell_def);
            }

            if (!cell.kind || cell.kind != "HostCell") {
                cell = l4i.Clone(inOpsHost.cell_def);
            }

            cell.zone_id = zoneid;

            cell._actions = inOpsHost.actions;

            if (!cell.description) {
                cell.description = "";
            }

            l4iModal.Open({
                title: "Cell Setting",
                tplsrc: tpl,
                data: cell,
                width: 900,
                height: 400,
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                    {
                        onclick: "inOpsHost.CellSetCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    },
                ],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        // template
        inOps.TplFetch("host/cell-set", {
            callback: ep.done("tpl"),
        });

        // cell
        if (!cellid) {
            ep.emit("cell", null);
        } else {
            inOps.ApiCmd("host/cell-entry?zoneid=" + zoneid + "&cellid=" + cellid, {
                callback: ep.done("cell"),
            });
        }
    });
};

inOpsHost.CellSetCommit = function () {
    var form = $("#inops-host-cell-form"),
        alert_id = "#inops-host-cellset-alert";

    var req = {
        meta: {
            id: form.find("input[name=id]").val(),
            name: form.find("input[name=name]").val(),
        },
        zone_id: form.find("input[name=zone_id]").val(),
        phase: parseInt(form.find("input[name=phase]:checked").val()),
        description: form.find("input[name=description]").val(),
    };

    inOps.ApiCmd("host/cell-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, cell) {
            if (err || !cell) {
                return l4i.InnerAlert(alert_id, "alert-danger", "Failed");
            }

            if (!cell) {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            if (cell.error) {
                return l4i.InnerAlert(alert_id, "alert-danger", cell.error.message);
            }

            if (!cell.kind || cell.kind != "HostCell") {
                return l4i.InnerAlert(alert_id, "alert-danger", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "alert-success", "Successfully Updated");

            inOpsHost.ZoneRefresh(function () {
                window.setTimeout(function () {
                    l4iModal.Close();
                    inOpsHost.CellList();
                }, 500);
            }, true);
        },
    });
};

inOpsHost.ZoneIndex = function () {
    if (!inOpsHost.zones) {
        return;
    }
    inCp.ModuleNavbarMenuRefresh("inops-host-nav-tpl");
    if (inOps.nav_cluster_zone) {
        $("#inops-cluster-nav-zone").css({
            display: "block",
        });
    }

    var zone_active_id = l4iStorage.Get("inops_cluster_zone_id");

    if (!inOps.nav_cluster_zone && !zone_active_id && inOpsHost.zones.items.length > 0) {
        zone_active_id = inOpsHost.zones.items[0].meta.id;
        inOpsHost.zone_active = l4i.Clone(inOpsHost.zones.items[0]);
        l4iStorage.Set("inops_cluster_zone_id", zone_active_id);
    }

    if (
        zone_active_id &&
        (!inOpsHost.zone_active || inOpsHost.zone_active.meta.id != zone_active_id)
    ) {
        for (var i in inOpsHost.zones.items) {
            if (zone_active_id == inOpsHost.zones.items[i].meta.id) {
                inOpsHost.zone_active = l4i.Clone(inOpsHost.zones.items[i]);
                break;
            }
        }
    }

    if (
        zone_active_id &&
        inOpsHost.zone_active &&
        zone_active_id == inOpsHost.zone_active.meta.id
    ) {
        if (inOps.nav_cluster_zone) {
            $("#inops-cluster-nav-zone-value").text("Zone: " + inOpsHost.zone_active.meta.id);
        }
        return inOpsHost.CellIndex();
    }

    inOpsHost.ZoneList();
};

inOpsHost.ZoneList = function () {
    if (!inOpsHost.zones) {
        return;
    }

    l4iStorage.Del("inops_cluster_zone_id");
    inOpsHost.zone_active = null;

    $("#inops-cluster-nav-host").css({
        display: "none",
    });
    $("#inops-cluster-nav-cell").css({
        display: "none",
    });
    if (inOps.nav_cluster_zone) {
        $("#inops-cluster-nav-zone").css({
            display: "block",
        });
        $("#inops-cluster-nav-zone-value").text("Zones");
    }

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", function (tpl) {
            if (tpl) {
                $("#work-content").html(tpl);
            }
            if (inOps.nav_cluster_zone) {
                inCp.OpToolsRefresh("#inops-cluster-zones-optools");
            } else {
                inCp.OpToolsClean();
            }

            l4iTemplate.Render({
                dstid: "inops-host-zones",
                tplid: "inops-host-zones-tpl",
                data: inOpsHost.zones,
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        inOps.TplFetch("host/zone-list", {
            callback: ep.done("tpl"),
        });
    });

    // var alert_id = "#inops-host-zones-alert";
    // seajs.use(["ep"], function(EventProxy) {

    //     var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

    //         if (tpl) {
    //             $("#work-content").html(tpl);
    //         }

    //         if (!rsj || !rsj.kind || rsj.kind != "HostZoneList") {
    //             return l4i.InnerAlert(alert_id, 'alert-danger', "Item Not Found");
    //         }

    //         if (!rsj.items) {
    //             rsj.items = [];
    //         }

    //         for (var i in rsj.items) {

    //             rsj.items[i]._status_display = "Unknown";

    //             for (var j in inOpsHost.statusls) {

    //                 if (inOpsHost.statusls[j].status == rsj.items[i].phase) {
    //                     rsj.items[i]._status_display = inOpsHost.statusls[j].title;
    //                     break
    //                 }
    //             }

    //             if (!rsj.items[i].cells) {
    //                 rsj.items[i].cells = [];
    //             }
    //         }

    //         l4iTemplate.Render({
    //             dstid: "inops-host-zones",
    //             tplid: "inops-host-zones-tpl",
    //             data: rsj,
    //         });
    //     });

    //     ep.fail(function(err) {
    //         alert("ListRefresh error, Please try again later (EC:001)");
    //     });

    //     inOps.TplFetch("host/zone-list", {
    //         callback: ep.done("tpl"),
    //     });

    //     inOps.ApiCmd("host/zone-list", {
    //         callback: ep.done("data"),
    //     });
    // });
};

inOpsHost.ZoneSet = function (zoneid) {
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {
            if (!rsj) {
                rsj = l4i.Clone(inOpsHost.zone_def);
            }

            if (!rsj.kind || rsj.kind != "HostZone") {
                rsj = l4i.Clone(inOpsHost.zone_def);
            }

            var title = "Zone Setting";
            if (rsj.meta.id == "") {
                title = "Create new Zone";
            }

            if (!rsj.wan_addrs) {
                rsj.wan_addrs = [];
            }

            if (!rsj.lan_addrs) {
                rsj.lan_addrs = [];
            }

            if (!rsj.summary) {
                rsj.summary = "";
            }

            if (!rsj.wan_api) {
                rsj.wan_api = "";
            }

            if (!rsj.image_services) {
                rsj.image_services = [];
            }

            rsj._actions = inOpsHost.actions;

            l4iModal.Open({
                title: title,
                tplsrc: tpl,
                data: rsj,
                width: 1200,
                height: 900,
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                    {
                        onclick: "inOpsHost.ZoneSetCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    },
                ],
                callback: function () {
                    if (rsj.lan_addrs.length < 1) {
                        inOpsHost.ZoneLanAddressAppend();
                    }
                    if (rsj.wan_addrs.length < 1) {
                        inOpsHost.ZoneWanAddressAppend();
                    }
                    if (rsj.image_services.length < 1) {
                        inOpsHost.ZoneImageServiceAppend();
                    }
                },
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        // template
        inOps.TplFetch("host/zone-set", {
            callback: ep.done("tpl"),
        });

        // data
        if (!zoneid) {
            ep.emit("data", null);
        } else {
            inOps.ApiCmd("host/zone-entry?id=" + zoneid, {
                callback: ep.done("data"),
            });
        }
    });
};

inOpsHost.ZoneWanAddressAppend = function () {
    l4iTemplate.Render({
        append: true,
        dstid: "inops-host-zoneset-wanaddrs",
        tplid: "inops-host-zoneset-wanaddr-tpl",
    });
};

inOpsHost.ZoneWanAddressDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneLanAddressAppend = function () {
    l4iTemplate.Render({
        append: true,
        dstid: "inops-host-zoneset-lanaddrs",
        tplid: "inops-host-zoneset-lanaddr-tpl",
    });
};

inOpsHost.ZoneLanAddressDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneImageServiceAppend = function () {
    l4iTemplate.Render({
        append: true,
        dstid: "inops-host-zoneset-imageservice",
        tplid: "inops-host-zoneset-imageservice-tpl",
    });
};

inOpsHost.ZoneImageServiceDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneSetCommit = function () {
    var form = $("#inops-host-zone-form"),
        alertid = "#inops-host-zoneset-alert";

    var req = {
        meta: {
            id: form.find("input[name=id]").val(),
            name: form.find("input[name=name]").val(),
        },
        phase: parseInt(form.find("input[name=phase]:checked").val()),
        summary: form.find("input[name=summary]").val(),
        wan_addrs: [],
        lan_addrs: [],
        image_services: [],
        wan_api: form.find("input[name=wan_api]").val(),
    };

    try {
        form.find(".inops-host-zoneset-wanaddr-item").each(function () {
            var addr = $(this).find("input[name=wan_addr]").val();

            if (!addr || addr.length < 7) {
                return;
            }

            req.wan_addrs.push(addr);
        });

        form.find(".inops-host-zoneset-lanaddr-item").each(function () {
            var addr = $(this).find("input[name=lan_addr]").val();

            if (!addr || addr.length < 7) {
                return;
            }

            req.lan_addrs.push(addr);
        });

        form.find(".inops-host-zoneset-imageservice-item").each(function () {
            var driver = $(this).find("input[name=image_service_driver]").val();
            var url = $(this).find("input[name=image_service_url]").val();

            if (!driver || (driver != "docker" && driver != "pouch")) {
                return;
            }

            req.image_services.push({
                driver: driver,
                url: url,
            });
        });

        if (req.lan_addrs.length < 1) {
            throw "No LAN Address Found";
        }
    } catch (err) {
        return l4i.InnerAlert("#inops-host-zoneset-alert", "alert-danger", err);
    }

    inOps.ApiCmd("host/zone-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alertid, "alert-danger", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alertid, "alert-danger", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostZone") {
                return l4i.InnerAlert(alertid, "alert-danger", "Network Connection Exception");
            }

            l4i.InnerAlert(alertid, "alert-success", "Successfully Updated");

            inOpsHost.ZoneRefresh(function () {
                window.setTimeout(function () {
                    l4iModal.Close();
                    inOpsHost.ZoneList();
                }, 500);
            }, true);
        },
    });
};
