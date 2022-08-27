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
            action: 1 << 1,
            title: "Start",
        },
        {
            action: 1 << 3,
            title: "Stop",
        },
        {
            action: 1 << 5,
            title: "Destroy",
        },
        {
            action: (1 << 5) | (1 << 27),
            title: "Force Destroy",
        },
    ],
    actionForce: 1 << 27,
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
        driver: {
            name: "private_cloud",
        },
        groups: [],
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
    ZoneGroupSetupIn: 1 << 1,
    ZoneGroupSetupOut: 1 << 2,
    zoneGroupDefault: {
        id: "g1",
        name: "General v1",
        description:
            "General purpose instances provide a balance of compute, memory and networking resources",
        action: 1 << 1,
    },
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
    // valueui.url.eventRegister("host/index", inOpsHost.Index);
};

inOpsHost.Index = function () {
    var activeZone = false;
    if (inOpsHost._nodeActiveZoneId) {
        for (var i in inCp.Zones.items) {
            if (inCp.Zones.items[i].meta.id == inOpsHost._nodeActiveZoneId) {
                activeZone = true;
            }
        }
    }
    if (!activeZone && inCp.Zones.items.length > 0) {
        inOpsHost._nodeActiveZoneId = inCp.Zones.items[0].meta.id;
        valueui.storage.set("inops_cluster_zone_id", inOpsHost._nodeActiveZoneId);
    }

    var ep = valueui.newEventProxy("zones", "tpl", function (zones, tpl) {
        if (!zones || !zones.items) {
            return valueui.alert.open("error", "Zone Not Found");
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
                    inOpsHost.zone_active = valueui.utilx.objectClone(inOpsHost.zones.items[i]);
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
                    inOpsHost.cell_active = valueui.utilx.objectClone(
                        inOpsHost.zone_active.cells[i]
                    );
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

inOpsHost._nodeEntryReset = function (nodeEntry) {
    var tn = Date.now() / 1000;

    if (!nodeEntry.meta.name || nodeEntry.meta.name.length < 1) {
        nodeEntry.meta.name = "localhost";
    }

    if (!nodeEntry.spec.platform) {
        nodeEntry.spec.platform = {};
    }

    if (nodeEntry.spec.platform.kernel) {
        nodeEntry.spec.platform.kernel = nodeEntry.spec.platform.kernel.replace(/.x86_64$/g, "");
    }

    nodeEntry.spec.capacity = nodeEntry.spec.capacity || {};
    nodeEntry.spec.capacity.cpu = nodeEntry.spec.capacity.cpu || 1000;
    nodeEntry.spec.capacity.mem = nodeEntry.spec.capacity.mem || 0;

    if (!nodeEntry.operate.pr) {
        nodeEntry.operate.pr = inOpsHost.PriorityDefault;
    }

    if (!nodeEntry.operate.cpu_used) {
        nodeEntry.operate.cpu_used = 0;
    }
    if (!nodeEntry.operate.mem_used) {
        nodeEntry.operate.mem_used = 0;
    }

    if (!nodeEntry.operate.port_used) {
        nodeEntry.operate.port_used = [];
    }
    if (!nodeEntry.operate.box_num) {
        nodeEntry.operate.box_num = 0;
    }

    nodeEntry.status = nodeEntry.status || {};

    if (!nodeEntry.status.volumes) {
        nodeEntry.status.volumes = [];
    }
    for (var i in nodeEntry.status.volumes) {
        if (!nodeEntry.status.volumes[i].total) {
            nodeEntry.status.volumes[i].total = 1;
        }
        if (!nodeEntry.status.volumes[i].used) {
            nodeEntry.status.volumes[i].used = 1;
        }
        nodeEntry.status.volumes[i]._percent = parseInt(
            (100 * nodeEntry.status.volumes[i].used) / nodeEntry.status.volumes[i].total
        );
    }

    if (nodeEntry.status.uptime) {
        nodeEntry.status._uptime = parseInt(new Date() / 1e3) - nodeEntry.status.uptime;
    }

    if (!nodeEntry.status || !nodeEntry.status.updated || tn - nodeEntry.status.updated > 3600) {
        nodeEntry._status = "Offline";
    } else {
        nodeEntry._status = "Online";
    }

    if (nodeEntry.operate.action) {
        for (var j in inOpsHost.actions) {
            if (inOpsHost.actions[j].action == nodeEntry.operate.action) {
                nodeEntry._action_display = inOpsHost.actions[j].title;
                break;
            }
        }
    }

    if (!nodeEntry.spec.exp_docker_version) {
        nodeEntry.spec.exp_docker_version = "disable";
    }
    if (!nodeEntry.spec.exp_pouch_version) {
        nodeEntry.spec.exp_pouch_version = "disable";
    }

    return nodeEntry;
};

inOpsHost.NodeList = function (zoneid, cellid) {
    if (!inOpsHost.cell_active_fix(zoneid, cellid)) {
        return;
    }

    valueui.storage.set("inops_cluster_cell_id", inOpsHost.cell_active.meta.id);

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

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
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

        for (var i in data.items) {
            data.items[i] = inOpsHost._nodeEntryReset(data.items[i]);
        }

        valueui.template.render({
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
};

inOpsHost.NodeOpPortUsedInfo = function (z, c, node_id) {
    for (var i in inOpsHost._nodeListActive.items) {
        if (node_id != inOpsHost._nodeListActive.items[i].meta.id) {
            continue;
        }

        var s = "no port assigned yet...";
        if (
            inOpsHost._nodeListActive.items[i].operate.port_used &&
            inOpsHost._nodeListActive.items[i].operate.port_used.length > 0
        ) {
            s = inOpsHost._nodeListActive.items[i].operate.port_used.join(", ");
        }

        return valueui.modal.open({
            title: "Network Port already assigned",
            tplsrc: s,
            width: 700,
            height: 350,
            buttons: [
                {
                    onclick: "valueui.modal.close()",
                    title: "Close",
                },
            ],
        });
    }
};

inOpsHost.NodePodList = function (z, c, node_id) {
    var node = null;

    for (var i in inOpsHost._nodeListActive.items) {
        if (node_id != inOpsHost._nodeListActive.items[i].meta.id) {
            continue;
        }
        node = inOpsHost._nodeListActive.items[i];
        break;
    }
    if (!node) {
        return;
    }

    var alert_id = "#inops-host-podls-selector-alert";

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        valueui.modal.open({
            id: "inops-host-pod-list",
            title: "Pod List",
            tplsrc: tpl,
            width: 1200,
            height: 800,
            callback: function () {
                if (data.error) {
                    return valueui.alert.innerShow(alert_id, "error", data.error.message);
                }
                if (data.items.length < 1) {
                    return valueui.alert.innerShow(alert_id, "info", "No Item Found Yet ...");
                }
                valueui.template.render({
                    dstid: "inops-host-podls-selector",
                    tplid: "inops-host-podls-selector-tpl",
                    data: data,
                });
            },
            buttons: [
                {
                    onclick: "valueui.modal.close()",
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
};

inOpsHost.NodePodInfo = function (pod_id) {
    inCpPod.Info(pod_id);
};

inOpsHost.NodeSet = function (zoneid, cellid, nodeid) {
    if (!zoneid) {
        zoneid = valueui.storage.get("inops_cluster_zone_id");
    }

    if (!cellid) {
        cellid = valueui.storage.get("inops_cluster_cell_id");
    }

    if (!nodeid) {
        nodeid = inOpsHost.node_active_id;
        if (!nodeid) {
            return;
        }
    }

    var alert_id = "#inops-host-nodeset-alert";

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, rsj) {
        var errMsg = valueui.utilx.errorKindCheck(null, rsj, "HostNode");
        if (errMsg) {
            return valueui.alert.innerShow(alert_id, "error", errMsg);
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
        if (!rsj.operate.network_vpc_instance) {
            rsj.operate.network_vpc_instance = "";
        }
        if (!rsj.operate.network_vpc_bridge) {
            rsj.operate.network_vpc_bridge = "";
        }
        var zone = inOps.zone(rsj.operate.zone_id);
        if (zone) {
            if (zone.network_vpc_instance && zone.network_vpc_bridge) {
                rsj.operate._network_vpc_enable = true;
            }
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

        valueui.modal.open({
            title: "Host Setting",
            tplsrc: tpl,
            data: rsj,
            width: 1200,
            height: 500,
            buttons: [
                {
                    onclick: "valueui.modal.close()",
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
    inOps.ApiCmd("host/node-entry?zoneid=" + zoneid + "&cellid=" + cellid + "&nodeid=" + nodeid, {
        // api_zone_id: zoneid,
        callback: ep.done("data"),
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
            network_vpc_instance: form.find("input[name=operate_network_vpc_instance]").val(),
            network_vpc_bridge: form.find("input[name=operate_network_vpc_bridge]").val(),
        },
        spec: {},
    };

    var opts = {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "HostNode");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.close();
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
    };

    if (inCp.OpActionAllow(req.operate.action, inOps.actionForce)) {
        opts.api_zone_id = req.operate.zone_id;
    }

    inOps.ApiCmd("host/node-set", opts);
};

inOpsHost.NodeSecretKeySet = function (zoneid, cellid, nodeid) {
    if (!zoneid) {
        zoneid = valueui.storage.get("inops_cluster_zone_id");
    }

    if (!cellid) {
        cellid = valueui.storage.get("inops_cluster_cell_id");
    }

    if (!nodeid) {
        nodeid = inOpsHost.node_active_id;
        if (!nodeid) {
            return;
        }
    }

    var alert_id = "#inops-host-node-secretkey-set-alert";

    var ep = valueui.newEventProxy("tpl", function (tpl) {
        valueui.modal.open({
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
                    onclick: "valueui.modal.close()",
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
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "HostNode");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.close();
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
        zoneid = valueui.storage.get("inops_cluster_zone_id");
    }

    if (!cellid) {
        cellid = valueui.storage.get("inops_cluster_cell_id");
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

            valueui.modal.open({
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
                        onclick: "valueui.modal.close()",
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
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "HostNode");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.close();
                inOpsHost.NodeList();
            }, 500);
        },
    });
};

inOpsHost.entry_nav_menus = [
    {
        name: "Back",
        // onclick: "inOpsHost.NodeList()",
        onclick: "inOpsHost.ZoneEntryIndex()",
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
        zone_id = valueui.storage.get("inops_cluster_zone_id");
    }

    if (!host_id) {
        return;
    }

    inOpsHost._nodeActiveZoneId = zone_id;
    inOpsHost.node_active_id = host_id;

    inCp.ModuleNavbarMenu("ops/host/entry", inOpsHost.entry_nav_menus);

    valueui.url.eventRegister(
        "host/node/overview",
        inOpsHost.NodeOverview,
        "incp-module-navbar-menus"
    );
    valueui.url.eventRegister("host/node/stats", inOpsHost.NodeStats, "incp-module-navbar-menus");

    switch (nav_target) {
        case "stats":
            valueui.url.eventHandler("host/node/stats", false);
            break;

        default:
            valueui.url.eventHandler("host/node/overview", false);
            break;
    }
};

inOpsHost.NodeOverview = function () {
    var ep = valueui.newEventProxy("tpl", "node", function (tpl, node) {
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

        valueui.template.render({
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
            inOpsHost._nodeActiveZoneId +
            "&nodeid=" +
            inOpsHost.node_active_id,
        {
            api_zone_id: inOpsHost._nodeActiveZoneId,
            callback: ep.done("node"),
        }
    );

    // inCp.ApiCmd("pod/status?id=" + inOpsHost.node_active_id, {
    //     callback: ep.done("pstatus"),
    // });

    inOps.TplFetch("host/node-overview", {
        callback: ep.done("tpl"),
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

    var zoneid = valueui.storage.get("inops_cluster_zone_id");

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
    var ep = valueui.newEventProxy("tpl", "node", "stats", function (tpl, node, stats) {
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
        var stats_cpu = valueui.utilx.objectClone(inOpsHost.hchart_def);
        stats_cpu.options.title = valueui.lang.T("CPU Usage (Percentage / %s)", tc_title);
        /**
                max = inOpsHost.nodeStatsFeedMaxValue(stats, "cpu/user");
                if (max > 1000000000) {
                    stats_cpu.options.title = valueui.lang.T("CPU (Seconds / %s)", tc_title);
                    stats_cpu._fix = 1000000000;
                } else if (max > 1000000) {
                    stats_cpu.options.title = valueui.lang.T("CPU (Millisecond / %s)", tc_title);
                    stats_cpu._fix = 1000000;
                } else if (max > 1000) {
                    stats_cpu.options.title = valueui.lang.T("CPU (Microsecond / %s)", tc_title);
                    stats_cpu._fix = 1000;
                } else {
                    stats_cpu.options.title = valueui.lang.T("CPU (Nanosecond / %s)", tc_title);
                }
            */

        //
        var stats_ram = valueui.utilx.objectClone(inOpsHost.hchart_def);
        stats_ram.options.title = valueui.lang.T("Memory Usage (MB)");
        stats_ram._fix = 1024 * 1024;

        //
        var stats_net = valueui.utilx.objectClone(inOpsHost.hchart_def);
        max = inOpsHost.nodeStatsFeedMaxValue(stats, "net/rs,net/ws");
        if (max > 1024 * 1024) {
            stats_net.options.title = valueui.lang.T("Network Bytes (MB / %s)", tc_title);
            stats_net._fix = 1024 * 1024;
        } else if (max > 1024) {
            stats_net.options.title = valueui.lang.T("Network Bytes (KB / %s)", tc_title);
            stats_net._fix = 1024;
        } else {
            stats_net.options.title = valueui.lang.T("Network Bytes (Bytes / %s)", tc_title);
        }

        //
        var stats_fsn = valueui.utilx.objectClone(inOpsHost.hchart_def);
        stats_fsn.options.title = valueui.lang.T("Storage IO / %s", tc_title);

        //
        var stats_fss = valueui.utilx.objectClone(inOpsHost.hchart_def);
        max = inOpsHost.nodeStatsFeedMaxValue(stats, "fs/sp/rs,fs/sp/ws");
        if (max > 1024 * 1024) {
            stats_fss.options.title = valueui.lang.T("Storage IO Bytes (MB / %s)", tc_title);
            stats_fss._fix = 1024 * 1024;
        } else if (max > 1024) {
            stats_fss.options.title = valueui.lang.T("Storage IO Bytes (KB / %s)", tc_title);
            stats_fss._fix = 1024;
        } else {
            stats_fss.options.title = valueui.lang.T("Storage IO Bytes (Bytes / %s)", tc_title);
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

                // var t = new Date(v2.time * 1000);
                // labels.push(t.l4iTimeFormat(tfmt));
                labels.push(valueui.utilx.unixTimeFormat(v2.time));

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

        valueui.template.render({
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
                    inOpsHost.zone_active = valueui.utilx.objectClone(zones.items[i]);
                }
            }

            inOpsHost.zones = zones;
            cb(null, inOpsHost.zones);
        },
    });
};

inOpsHost.node_list_refresh = function (zoneid, cellid, cb) {
    inOps.ApiCmd("host/node-list?zoneid=" + zoneid + "&cellid=" + cellid, {
        // api_zone_id: zoneid,
        callback: function (err, nodes) {
            var errMsg = valueui.utilx.errorKindCheck(err, nodes, "HostNodeList");
            if (errMsg) {
                return cb(errMsg);
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

            inOpsHost._nodeListActive = nodes;
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

    valueui.storage.set("inops_cluster_zone_id", inOpsHost.zone_active.meta.id);
    var cell_active_id = valueui.storage.get("inops_cluster_cell_id");
    inOpsHost.cell_active = null;

    if (!inOps.nav_cluster_cell && !cell_active_id && inOpsHost.zone_active.cells.length > 0) {
        inOpsHost.cell_active = valueui.utilx.objectClone(inOpsHost.zone_active.cells[0]);
        cell_active_id = inOpsHost.cell_active.meta.id;
        valueui.storage.set("inops_cluster_cell_id", cell_active_id);
    }

    if (
        cell_active_id &&
        (!inOpsHost.cell_active || inOpsHost.cell_active.meta.id != cell_active_id)
    ) {
        for (var i in inOpsHost.zone_active.cells) {
            if (cell_active_id == inOpsHost.zone_active.cells[i].meta.id) {
                inOpsHost.cell_active = valueui.utilx.objectClone(inOpsHost.zone_active.cells[i]);
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

    valueui.storage.del("inops_cluster_cell_id");

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

    valueui.storage.set("inops_cluster_zone_id", inOpsHost.zone_active.meta.id);
    inOpsHost.cell_active = null;

    var ep = valueui.newEventProxy("tpl", function (tpl) {
        if (tpl) {
            $("#work-content").html(tpl);
        }
        if (inOps.nav_cluster_cell) {
            inCp.OpToolsRefresh("#inops-cluster-cells-optools");
        } else {
            inCp.OpToolsClean();
        }

        valueui.template.render({
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
};

inOpsHost.CellSet = function (zoneid, cellid) {
    if (!inOpsHost.zone_active) {
        return;
    }
    zoneid = inOpsHost.zone_active.meta.id;
    var ep = valueui.newEventProxy("tpl", "cell", function (tpl, cell) {
        if (!cell) {
            cell = valueui.utilx.objectClone(inOpsHost.cell_def);
        }

        if (!cell.kind || cell.kind != "HostCell") {
            cell = valueui.utilx.objectClone(inOpsHost.cell_def);
        }

        cell.zone_id = zoneid;

        cell._actions = inOpsHost.actions;

        if (!cell.description) {
            cell.description = "";
        }

        valueui.modal.open({
            title: "Cell Setting",
            tplsrc: tpl,
            data: cell,
            width: 900,
            height: 400,
            buttons: [
                {
                    onclick: "valueui.modal.close()",
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
            var errMsg = valueui.utilx.errorKindCheck(err, cell, "HostCell");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            inOpsHost.ZoneRefresh(function () {
                window.setTimeout(function () {
                    valueui.modal.close();
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

    inCp.ModuleNavbarMenuRefresh("inops-host-zone-nav-tpl");
    var activeZoneId = valueui.storage.get("inops_cluster_zone_id");
    if (activeZoneId && activeZoneId.length > 0) {
        return inOpsHost.ZoneEntryIndex(activeZoneId);
    }
    return inOpsHost.ZoneList();

    inCp.ModuleNavbarMenuRefresh("inops-host-nav-tpl");
    if (inOps.nav_cluster_zone) {
        $("#inops-cluster-nav-zone").css({
            display: "block",
        });
    }

    if (!inOps.nav_cluster_zone && !activeZoneId && inOpsHost.zones.items.length > 0) {
        activeZoneId = inOpsHost.zones.items[0].meta.id;
        inOpsHost.zone_active = valueui.utilx.objectClone(inOpsHost.zones.items[0]);
        valueui.storage.set("inops_cluster_zone_id", activeZoneId);
    }

    if (activeZoneId && (!inOpsHost.zone_active || inOpsHost.zone_active.meta.id != activeZoneId)) {
        for (var i in inOpsHost.zones.items) {
            if (activeZoneId == inOpsHost.zones.items[i].meta.id) {
                inOpsHost.zone_active = valueui.utilx.objectClone(inOpsHost.zones.items[i]);
                break;
            }
        }
    }

    if (activeZoneId && inOpsHost.zone_active && activeZoneId == inOpsHost.zone_active.meta.id) {
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

    valueui.storage.del("inops_cluster_zone_id");
    inOpsHost.zone_active = null;

    inCp.ModuleNavbarMenuRefresh("inops-host-zone-nav-tpl");

    //  $("#inops-cluster-nav-host").css({
    //      display: "none",
    //  });
    //  $("#inops-cluster-nav-cell").css({
    //      display: "none",
    //  });
    //  if (true || inOps.nav_cluster_zone) {
    //      $("#inops-cluster-nav-zone").css({
    //          display: "block",
    //      });
    //      $("#inops-cluster-nav-zone-value").text("Zones");
    //  }

    var ep = valueui.newEventProxy("tpl", function (tpl) {
        if (tpl) {
            $("#work-content").html(tpl);
        }
        if (inOps.nav_cluster_zone) {
            inCp.OpToolsRefresh("#inops-cluster-zones-optools");
        } else {
            inCp.OpToolsClean();
        }

        valueui.template.render({
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

    // var alert_id = "#inops-host-zones-alert";
    // valueui.use(["ep"], function(EventProxy) {

    //     var ep = valueui.newEventProxy("tpl", "data", function(tpl, rsj) {

    //         if (tpl) {
    //             $("#work-content").html(tpl);
    //         }

    //         if (!rsj || !rsj.kind || rsj.kind != "HostZoneList") {
    //             return valueui.alert.innerShow(alert_id, 'error', "Item Not Found");
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

    //         valueui.template.render({
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

inOpsHost._zoneEntryReset = function (zoneEntry) {
    if (!zoneEntry) {
        zoneEntry = valueui.utilx.objectClone(inOpsHost.zone_def);
    }

    if (!zoneEntry.wan_addrs) {
        zoneEntry.wan_addrs = [];
    }

    if (!zoneEntry.lan_addrs) {
        zoneEntry.lan_addrs = [];
    }

    if (!zoneEntry.summary) {
        zoneEntry.summary = "";
    }

    if (!zoneEntry.wan_api) {
        zoneEntry.wan_api = "";
    }

    if (!zoneEntry.image_services) {
        zoneEntry.image_services = [];
    }

    if (!zoneEntry.network_vpc_instance) {
        zoneEntry.network_vpc_instance = "";
    }

    if (!zoneEntry.network_vpc_bridge) {
        zoneEntry.network_vpc_bridge = "";
    }

    if (!zoneEntry.network_domain_name) {
        zoneEntry.network_domain_name = "";
    }

    zoneEntry.driver = zoneEntry.driver || {};
    zoneEntry.driver.name = zoneEntry.driver.name || "private_cloud";

    if (!zoneEntry.groups) {
        zoneEntry.groups = [];
    }

    return zoneEntry;
};

inOpsHost.ZoneEntryIndex = function (zoneid) {
    if (zoneid) {
        inOpsHost._nodeActiveZoneId = zoneid;
        valueui.storage.set("inops_cluster_zone_id", zoneid);
    }

    var ep = valueui.newEventProxy("tpl", "data", "nodeList", function (tpl, rsj, nodeList) {
        if (!rsj || !rsj.kind || rsj.kind != "HostZone") {
            return valueui.alert.open("error", "zone not setup");
        }

        if (tpl) {
            $("#work-content").html(tpl);
        }

        inCp.ModuleNavbarMenuRefresh("inops-cluster-zone-entry-menu");
        inCp.OpToolsRefresh("#inops-cluster-zone-entry-optools");

        var zoneEntry = inOpsHost._zoneEntryReset(rsj);

        if (zoneEntry.meta.id == "") {
            return valueui.alert.open("error", "zone not setup");
        }

        zoneEntry._actions = inOpsHost.actions;

        inOpsHost.zoneSetActiveEntry = zoneEntry;

        valueui.template.render({
            dstid: "inops-host-zone-entry-overview",
            tplid: "inops-host-zone-entry-overview-info-tpl",
            data: zoneEntry,
        });

        nodeList.items = nodeList.items || [];
        for (var i in nodeList.items) {
            nodeList.items[i] = inOpsHost._nodeEntryReset(nodeList.items[i]);
        }

        nodeList._zone = zoneEntry;

        valueui.template.render({
            dstid: "inops-host-zone-entry-node-list",
            tplid: "inops-host-zone-entry-node-list-tpl",
            data: nodeList,
        });

        inOpsHost._nodeListActive = nodeList;
    });

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
    });

    // template
    inOps.TplFetch("host/zone-overview", {
        callback: ep.done("tpl"),
    });

    // data
    if (!inOpsHost._nodeActiveZoneId) {
        ep.emit("data", null);
    } else {
        inOps.ApiCmd("host/zone-entry?id=" + inOpsHost._nodeActiveZoneId, {
            callback: ep.done("data"),
        });
        inOps.ApiCmd("host/node-list?zoneid=" + inOpsHost._nodeActiveZoneId, {
            callback: ep.done("nodeList"),
        });
    }
};

inOpsHost.ZoneNew = function () {
    inOpsHost._nodeActiveZoneId = null;
    inOpsHost.ZoneSet();
};

inOpsHost.ZoneSet = function (zoneid) {
    if (!zoneid) {
        zoneid = inOpsHost._nodeActiveZoneId;
    }
    var ep = valueui.newEventProxy(
        "tpl",
        "data",
        "driverSpecList",
        function (tpl, rsj, driverSpecList) {
            if (!rsj) {
                rsj = valueui.utilx.objectClone(inOpsHost.zone_def);
            }

            if (!rsj.kind || rsj.kind != "HostZone") {
                rsj = valueui.utilx.objectClone(inOpsHost.zone_def);
            }

            var errMsg = valueui.utilx.errorKindCheck(null, driverSpecList, "ZoneDriverSpecList");
            if (errMsg) {
                return valueui.alert.open("error", errMsg);
            }
            driverSpecList.items = driverSpecList.items || [];

            var zoneEntry = inOpsHost._zoneEntryReset(rsj);

            var title = "Zone Setting";
            if (zoneEntry.meta.id == "") {
                title = "Create new Zone";
            }

            zoneEntry._actions = inOpsHost.actions;
            zoneEntry._driver_spec_list = driverSpecList.items;

            inOpsHost.zoneDriverSpecList = driverSpecList.items;
            inOpsHost.zoneSetActiveEntry = zoneEntry;

            valueui.modal.open({
                title: title,
                tplsrc: tpl,
                width: "max",
                height: "max",
                buttons: [
                    {
                        onclick: "valueui.modal.close()",
                        title: "Close",
                    },
                    {
                        onclick: "inOpsHost.ZoneSetNext()",
                        title: "Next",
                        style: "btn btn-primary",
                    },
                ],
                callback: function () {
                    valueui.template.render({
                        dstid: "inops-host-zoneset",
                        tplid: "inops-host-zoneset-tpl",
                        data: zoneEntry,
                        callback: function () {
                            if (zoneEntry.lan_addrs.length < 1) {
                                inOpsHost.ZoneLanAddressAppend();
                            }
                            if (!zoneEntry.wan_addrs || zoneEntry.wan_addrs.length < 1) {
                                inOpsHost.ZoneWanAddressAppend();
                            }
                            if (zoneEntry.image_services.length < 1) {
                                inOpsHost.ZoneImageServiceAppend();
                            }
                            if (!zoneEntry.groups || zoneEntry.groups.length < 1) {
                                inOpsHost.ZoneGroupAppend(inOpsHost.zoneGroupDefault);
                            } else {
                                for (var i in zoneEntry.groups) {
                                    inOpsHost.ZoneGroupAppend(zoneEntry.groups[i]);
                                }
                            }
                        },
                    });
                },
            });
        }
    );

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
    });

    // template
    inOps.TplFetch("host/zone-set", {
        callback: ep.done("tpl"),
    });

    inOps.ApiCmd("host/zone-driver-spec-list", {
        callback: ep.done("driverSpecList"),
    });

    // data
    if (!zoneid) {
        ep.emit("data", null);
    } else {
        inOps.ApiCmd("host/zone-entry?id=" + zoneid, {
            callback: ep.done("data"),
        });
    }
};

inOpsHost.ZoneWanAddressAppend = function () {
    valueui.template.render({
        append: true,
        dstid: "inops-host-zoneset-wanaddrs",
        tplid: "inops-host-zoneset-wanaddr-tpl",
    });
};

inOpsHost.ZoneWanAddressDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneLanAddressAppend = function () {
    valueui.template.render({
        append: true,
        dstid: "inops-host-zoneset-lanaddrs",
        tplid: "inops-host-zoneset-lanaddr-tpl",
    });
};

inOpsHost.ZoneLanAddressDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneImageServiceAppend = function () {
    valueui.template.render({
        append: true,
        dstid: "inops-host-zoneset-imageservice",
        tplid: "inops-host-zoneset-imageservice-tpl",
    });
};

inOpsHost.ZoneImageServiceDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneGroupAppend = function (data) {
    valueui.template.render({
        append: true,
        dstid: "inops-host-zoneset-groups",
        tplid: "inops-host-zoneset-group-tpl",
        data: data,
    });
};

inOpsHost.ZoneGroupDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsHost.ZoneSetNext = function () {
    var form = $("#inops-host-zone-form"),
        alert_id = "#inops-host-zoneset-alert";

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
        network_vpc_instance: form.find("input[name=network_vpc_instance]").val(),
        network_vpc_bridge: form.find("input[name=network_vpc_bridge]").val(),
        network_domain_name: form.find("input[name=network_domain_name]").val(),
        driver: {
            name: form.find("select[name=driver_name]").val(),
        },
        groups: [],
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

        form.find(".inops-host-zoneset-group-item").each(function () {
            var id = $(this).find("input[name=id]").val(),
                name = $(this).find("input[name=name]").val(),
                description = $(this).find("input[name=description]").val(),
                action = 0;

            if (!id || id.length < 1) {
                return;
            }

            if (!name || name.length < 1) {
                throw "group name can not be null";
            }

            if (!description) {
                description = "";
            }

            if ($(this).find("input[name=action]").prop("checked") == true) {
                action = inOpsHost.ZoneGroupSetupIn;
            } else {
                action = inOpsHost.ZoneGroupSetupOut;
            }

            req.groups.push({
                id: id,
                name: name,
                description: description,
                action: action,
            });
        });

        if (req.lan_addrs.length < 1) {
            throw "No LAN Address Found";
        }
    } catch (err) {
        return valueui.alert.innerShow("#inops-host-zoneset-alert", "error", err);
    }

    if (
        req.driver.name == inOpsHost.zoneSetActiveEntry.driver.name &&
        inOpsHost.zoneSetActiveEntry.driver.fields &&
        inOpsHost.zoneSetActiveEntry.driver.fields.length > 0
    ) {
        req.driver.fields = inOpsHost.zoneSetActiveEntry.driver.fields;
    } else {
        req.driver.fields = [];
    }

    inOpsHost.zoneSetActiveEntry = req;

    for (var i in inOpsHost.zoneDriverSpecList) {
        if (inOpsHost.zoneDriverSpecList[i].name == req.driver.name) {
            return inCpConfig.ConfigInstanceEntry(
                inOpsHost.zoneDriverSpecList[i],
                inOpsHost.zoneSetActiveEntry.driver,
                {
                    callback: inOpsHost.ZoneSetDriver,
                }
            );
        }
    }

    return valueui.alert.innerShow("#inops-host-zoneset-alert", "error", "driver name not found");
};

inOpsHost.ZoneSetDriver = function (configInstance) {
    if (!configInstance || !configInstance.fields || configInstance.fields.length == 0) {
        return valueui.modal.footAlert("error", "driver config not found", 2000);
    }
    inOpsHost._zoneSetCommit(configInstance);
};

inOpsHost._zoneSetCommit = function (configInstance) {
    inOpsHost.zoneSetActiveEntry.driver = configInstance;

    console.log(inOpsHost.zoneSetActiveEntry);

    inOps.ApiCmd("host/zone-set", {
        method: "POST",
        data: JSON.stringify(inOpsHost.zoneSetActiveEntry),
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "HostZone");
            if (errMsg) {
                return valueui.modal.footAlert("error", errMsg, 2000);
            }

            valueui.modal.footAlert("ok", "Successfully Updated");

            inOpsHost.ZoneRefresh(function () {
                window.setTimeout(function () {
                    valueui.modal.close();
                    inOpsHost.ZoneList();
                }, 500);
            }, true);
        },
    });
};

inOpsHost.ResHostCloudProviderSyncBound = 1 << 1;
inOpsHost.ResHostCloudProviderSyncCreate = 1 << 2;
inOpsHost.ResHostCloudProviderSyncBind = 1 << 3;

inOpsHost.CloudProviderSyncActionName = function (action) {
    if (action == inOpsHost.ResHostCloudProviderSyncBound) {
        return "bound";
    } else if (action == inOpsHost.ResHostCloudProviderSyncBind) {
        return "bind";
    }
    return "created";
};

inOpsHost.ZoneNodeListSyncPull = function (zoneid) {
    if (!zoneid) {
        zoneid = inOpsHost._nodeActiveZoneId;
    } else {
        inOpsHost._nodeActiveZoneId = zoneid;
    }

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        data.items = data.items || [];

        inOpsHost._zoneNodeListSyncPullActive = data.items;

        valueui.modal.open({
            title: "Sync host list from the cloud service provider",
            tplsrc: tpl,
            width: 1000,
            height: 900,
            callback: function () {
                valueui.template.render({
                    dstid: "inops-host-node-sync-pull-list",
                    tplid: "inops-host-node-sync-pull-list-tpl",
                    data: data,
                });
            },
            buttons: [
                {
                    onclick: "valueui.modal.close()",
                    title: "Close",
                },
                {
                    onclick: "inOpsHost.ZoneNodeListSyncCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                },
            ],
        });
    });

    ep.fail(function (err) {
        if (err == "AccessDenied") {
            return inCp.AlertAccessDenied();
        }
        alert("Error: " + err);
    });

    inOps.TplFetch("host/node-sync-pull-list", {
        callback: ep.done("tpl"),
    });

    inOps.ApiCmd("host/node-sync-pull-list?zone_id=" + zoneid, {
        callback: ep.done("data"),
    });
};

inOpsHost.ZoneNodeListSyncCommit = function () {
    var zoneid = inOpsHost._nodeActiveZoneId,
        form = $("#inops-host-node-sync-pull-list"),
        alert_id = "#inops-host-node-sync-pull-list-alert",
        err = null;

    form.find(".inops-host-node-sync-pull-item").each(function () {
        if (err) {
            return;
        }

        var req = {
            cloud_provider: {
                instance_id: $(this).find("input[name=cloud_instance_id]").val(),
            },
            action: parseInt($(this).find("input[name=action]").val()),
            zone_id: zoneid,
        };

        var itemAlertId = "#id-" + req.cloud_provider.instance_id + "-alert";

        if (!req.cloud_provider.instance_id || !req.action) {
            err = "invalid request (local form)";
            return valueui.alert.innerShow(alert_id, "error", err);
        }

        if ($(this).find("input[name=action]").prop("checked") != true) {
            return;
        }

        for (var i in inOpsHost._zoneNodeListSyncPullActive) {
            var n = inOpsHost._zoneNodeListSyncPullActive[i];
            if (n.cloud_provider.instance_id == req.cloud_provider.instance_id) {
                req.cloud_provider = n.cloud_provider;
                req.instance_id = n.instance_id;
                req.instance_name = n.instance_name;
                break;
            }
        }

        inOps.ApiCmd("host/node-sync-pull-set", {
            // api_zone_id: zoneid,
            method: "POST",
            data: JSON.stringify(req),
            callback: function (err, data) {
                var errMsg = valueui.utilx.errorKindCheck(err, data, "NodeEntry");
                if (errMsg) {
                    err = errMsg;
                    return valueui.alert.innerShow(alert_id, "error", errMsg);
                }
                $(itemAlertId)
                    .addClass("badge rounded-pill bg-success")
                    .text("Successfully Updated");
            },
        });
    });

    if (err) {
        return valueui.modal.footAlert("error", err, 2000);
    }

    setTimeout(function () {
        valueui.modal.close();
        inOpsHost.ZoneIndex();
    }, 2000);

    return valueui.modal.footAlert("ok", "Successfully Updated", 2000);
};
