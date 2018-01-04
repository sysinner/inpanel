var inOpsHost = {
    statusls: [
        {
            status: 0,
            title: "Unknown"
        },
        {
            status: 1,
            title: "Active"
        },
        {
            status: 2,
            title: "Suspend"
        },
    ],
    node_statusls: [
        {
            phase: "Running",
            title: "Running"
        },
        {
            phase: "Suspended",
            title: "Suspended"
        },
        {
            phase: "Terminated",
            title: "Terminated"
        },
    ],
    actions: [
        // {action: 0, title: "Unknown"},
        {
            action: 1,
            title: "Active"
        },
        {
            action: 2,
            title: "Suspended"
        },
    ],
    zone_def: {
        kind: "HostZone",
        meta: {
            id: "",
            name: ""
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
            name: ""
        },
        zoneid: "",
        status: 1,
        desc: "",
    },
    zones: null,
    cells: null,
    nodes: null,
    single_node: false,
    nav_zone: null,
    nav_cell: null,
    nav_node: null,
    hchart_def: {
        "type": "line",
        "options": {
            "height": "200px",
            "title": "",
        },
        "data": {
            "labels": [],
            "datasets": [],
        },
    },
}

inOpsHost.ActionTitle = function(action) {
    for (var i in inOpsHost.actions) {
        if (action == inOpsHost.actions[i].action) {
            return inOpsHost.actions[i].title;
        }
    }
    return "Unknown";
}

inOpsHost.NavInit = function() {
    // l4i.UrlEventRegister("host/index", inOpsHost.Index);
}

inOpsHost.Index = function() {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("zones", function(zones) {

            $("#comp-content").html("<div id='work-content'></div>");

            if (!zones || !zones.items) {
                return alert("Zone Not Found");
            }

            if (zones.items[0].meta.id == "local") {
                inOpsHost.single_node = true;
                $("#inops-host-nav-menus").css({
                    "display": "none"
                });
                inOpsHost.NodeList("local", "general");
            }
        });

        ep.fail(function(err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        // zones
        inOpsHost.ZoneRefresh(ep.done("zones"));
    });

    return;
    inOps.TplFetch("host/index", {
        callback: function(err, data) {
            if (err) {
                return;
            }
            $("#comp-content").html(data);

            l4i.UrlEventRegister("host/node-list", inOpsHost.NodeList, "inops-host-nav-items");
            l4i.UrlEventRegister("host/cell-list", inOpsHost.CellList, "inops-host-nav-items");
            l4i.UrlEventRegister("host/zone-list", inOpsHost.ZoneList, "inops-host-nav-items");
            l4i.UrlEventHandler("host/node-list");
        }
    });
}

inOpsHost.NodeList = function(zoneid, cellid) {

    var uri = "";
    if (document.getElementById("inops_hostls_qry")) {
        uri = "qry_text=" + $("#inops_hostls_qry").val();
    }

    if (!zoneid) {
        zoneid = l4iSession.Get("inops_host_zoneid");
        if (!zoneid) {
            zoneid = l4iStorage.Get("inops_host_zoneid");
        }
    }

    if (!cellid) {
        cellid = l4iSession.Get("inops_host_cellid");
        if (!cellid) {
            cellid = l4iStorage.Get("inops_host_cellid");
        }
    }

    //
    var zone_active = null;
    for (var i in inOpsHost.zones.items) {
        if (!zoneid) {
            zoneid = inOpsHost.zones.items[i].meta.id;
        }
        if (zoneid == inOpsHost.zones.items[i].meta.id) {
            zone_active = inOpsHost.zones.items[i];
            break;
        }
    }
    if (!zone_active) {
        if (inOpsHost.zones.items.length < 1) {
            return; // TODO
        }
        zone_active = inOpsHost.zones.items[0];
    }

    //
    var cell_active = null;
    for (var j in zone_active.cells) {
        if (!cellid) {
            cellid = zone_active.cells[j].meta.id;
        }
        if (cellid == zone_active.cells[j].meta.id) {
            cell_active = zone_active.cells[j];
            break;
        }
    }
    if (!cell_active) {
        if (zone_active.cells.length < 1) {
            return; // TODO
        }
        cell_active = zone_active.cells[0];
    }

    l4iSession.Set("inops_host_zoneid", zone_active.meta.id);
    l4iStorage.Set("inops_host_zoneid", zone_active.meta.id);
    l4iSession.Set("inops_host_cellid", cell_active.meta.id);
    l4iStorage.Set("inops_host_cellid", cell_active.meta.id);

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (tpl) {
                $("#comp-content").html('<div id="work-content">' + tpl + '</div>');
            }
            if (inOpsHost.single_node) {
                $("#inops-host-nodes-navbar").css({
                    "display": "none"
                });
            }
            // inCp.OpToolsClean();
            inCp.OpToolsRefresh("#inops-host-nodels-optools");

            l4iTemplate.Render({
                dstid: "inops-host-nodes",
                tplid: "inops-host-nodes-tpl",
                data: data,
            });
        });

        ep.fail(function(err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        inOps.TplFetch("host/node-list", {
            callback: ep.done("tpl"),
        });

        inOpsHost.node_list_refresh(zone_active.meta.id, cell_active.meta.id, ep.done("data"));
    });
}

inOpsHost.NodeOpPortUsedInfo = function(z, c, node_id) {

    for (var i in inOpsHost.nodes.items) {

        if (node_id != inOpsHost.nodes.items[i].meta.id) {
            continue;
        }

        var s = "no port assigned yet...";
        if (inOpsHost.nodes.items[i].operate.port_used && inOpsHost.nodes.items[i].operate.port_used.length > 0) {
            s = inOpsHost.nodes.items[i].operate.port_used.join(", ");
        }

        return l4iModal.Open({
            title: "Network Port already assigned",
            tplsrc: s,
            width: 700,
            height: 350,
            buttons: [{
                onclick: "l4iModal.Close()",
                title: "Close",
            }]
        });
    }
}

inOpsHost.NodeSetForm = function(zoneid, cellid, nodeid) {
    if (!zoneid) {
        zoneid = l4iSession.Get("inops_host_zoneid");
    }

    if (!cellid) {
        cellid = l4iSession.Get("inops_host_cellid");
    }

    if (!nodeid) {
        nodeid = inOpsHost.node_active_id;
        if (!nodeid) {
            return;
        }
    }

    var alert_id = "#inops-host-nodeset-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (!rsj || !rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
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

            l4iModal.Open({
                title: "Host Setting",
                tplsrc: tpl,
                data: rsj,
                width: 700,
                height: 350,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inOpsHost.NodeSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }]
            });
        });

        ep.fail(function(err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        // template
        inOps.TplFetch("host/node-set", {
            callback: ep.done("tpl"),
        });

        // data
        inOps.ApiSysCmd("host/node-entry?zoneid=" + zoneid + "&cellid=" + cellid + "&nodeid=" + nodeid, {
            callback: ep.done("data"),
        });
    });
}

inOpsHost.NodeSetCommit = function() {
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
        },
        spec: {
        },
    };

    inOps.ApiSysCmd("host/node-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', err);
            }

            if (!rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function() {
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
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus + ' ' + xhr.responseText);
        }
    });
}


inOpsHost.NodeNewForm = function(zoneid, cellid) {
    if (!zoneid) {
        zoneid = l4iSession.Get("inops_host_zoneid");
    }

    if (!cellid) {
        cellid = l4iSession.Get("inops_host_cellid");
    }

    inOps.TplFetch("host/node-new", {
        callback: function(err, tpl) {

            l4iModal.Open({
                title: "New Node",
                tplsrc: tpl,
                data: {
                    zoneid: zoneid,
                    cellid: cellid,
                    _phase: "Running",
                    _statusls: inOpsHost.node_statusls,
                },
                height: 400,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inOpsHost.NodeNewCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
            });
        },
    });
}

inOpsHost.NodeNewCommit = function() {
    var form = $("#inops-host-node-form"),
        alert_id = "#inops-host-nodenew-alert";

    var req = {
        meta: {
            name: form.find("input[name=name]").val(),
        },
        operate: {
            action: parseInt(form.find("input[name=operate_action]").val()),
            zone_id: form.find("input[name=operate_zone_id]").val(),
            cell_id: form.find("input[name=operate_cell_id]").val(),
        },
        spec: {
            peer_lan_addr: form.find("input[name=peer_lan_addr]").val(),
        },
    };

    inOps.ApiSysCmd("host/node-new", {
        method: "POST",
        data: JSON.stringify(req),
        success: function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inOpsHost.NodeList();
            }, 500);
        },
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus + ' ' + xhr.responseText);
        },
    });
}



inOpsHost.Node = function(zone_id, host_id, nav_target) {

    if (!zone_id) {
        zone_id = l4iSession.Get("inops_host_zoneid");
        if (!zone_id) {
            zone_id = l4iStorage.Get("inops_host_zoneid");
        }
    }

    if (!host_id) {
        return
    }

    inOpsHost.node_active_zone_id = zone_id;
    inOpsHost.node_active_id = host_id;

    $("#comp-content").html("<div id='incp-module-navbar'>\
  <ul id='incp-module-navbar-menus' class='incp-module-nav'>\
    <li><a class='l4i-nav-item primary' href='#' onclick='inOpsHost.NodeList()'>\
      <span class='glyphicon glyphicon-menu-left' aria-hidden='true'></span> Back\
    </a></li>\
    <li><a class='l4i-nav-item' href='#host/node/overview'>Overview</a></li>\
    <li><a class='l4i-nav-item' href='#host/node/stats'>Graphs</a></li>\
    <li><a class='' href='#host/node/setup' onclick='inOpsHost.NodeSetForm()'>Setup</a></li>\
  </ul>\
  <ul id='incp-module-navbar-optools' class='incp-module-nav incp-nav-right'></ul>\
</div>\
<div id='work-content'></div>");

    l4i.UrlEventClean("incp-module-navbar-menus");
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
}


inOpsHost.NodeOverview = function() {

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "node", function(tpl, node) {

            if (node.spec.platform.kernel) {
                node.spec.platform.kernel = node.spec.platform.kernel.replace(/.el7.x86_64$/g, '');
            }

            if (!node.meta.name) {
                node.meta.name = node.meta.id;
            }

            if (!node.operate.cpu_used) {
                node.operate.cpu_used = 0;
            }
            if (!node.operate.mem_used) {
                node.operate.mem_used = 0;
            }

            if (!node.operate.port_used) {
                node.operate.port_used = [];
            }

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
                node.status.volumes[i]._percent = parseInt((100 * node.status.volumes[i].used) / node.status.volumes[i].total);
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

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-node)");
        });

        inOps.ApiCmd("host/node-entry?zoneid=" + inOpsHost.node_active_zone_id + "&nodeid=" + inOpsHost.node_active_id, {
            callback: ep.done("node"),
        });

        // inCp.ApiCmd("pod/status?id=" + inOpsHost.node_active_id, {
        //     callback: ep.done("pstatus"),
        // });

        inOps.TplFetch("host/node-overview", {
            callback: ep.done("tpl"),
        });
    });
}


inOpsHost.NodeStatsButton = function(obj) {
    $("#incp-module-navbar-optools").find(".hover").removeClass("hover");
    obj.setAttribute("class", 'hover');
    inOpsHost.NodeStats(parseInt(obj.getAttribute('value')));
}

inOpsHost.nodeStatsFeedMaxValue = function(feed, names) {
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
}

inOpsHost.NodeStats = function(time_past) {

    if (time_past) {
        inOpsHost.node_active_past = parseInt(time_past);
        if (!inOpsHost.node_active_past) {
            inOpsHost.node_active_past = 3600;
        }
    }
    if (inOpsHost.node_active_past < 600) {
        inOpsHost.node_active_past = 600;
    }
    if (inOpsHost.node_active_past > (30 * 86400)) {
        inOpsHost.node_active_past = 30 * 86400;
    }

    var zoneid = l4iSession.Get("inops_host_zoneid");


    var stats_url = "id=" + inOpsHost.node_active_id;
    var stats_query = {
        tc: 180,
        tp: inOpsHost.node_active_past,
        is: [
            {
                n: "cpu/sys",
                d: true
            },
            {
                n: "cpu/user",
                d: true
            },
            {
                n: "ram/us"
            },
            {
                n: "ram/cc"
            },
            {
                n: "net/rs",
                d: true
            },
            {
                n: "net/ws",
                d: true
            },
            {
                n: "fs/sp/rs",
                d: true
            },
            {
                n: "fs/sp/rn",
                d: true
            },
            {
                n: "fs/sp/ws",
                d: true
            },
            {
                n: "fs/sp/wn",
                d: true
            },
        ],
    };

    var wlimit = 610;
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
    if (stats_query.tp > (10 * 86400)) {
        stats_query.tc = 6 * 3600;
        tfmt = "m-d H";
    } else if (stats_query.tp > (3 * 86400)) {
        stats_query.tc = 3 * 3600;
        tfmt = "m-d H";
    } else if (stats_query.tp > 86400) {
        stats_query.tc = 3600;
        tfmt = "m-d H";
    } else if (stats_query.tp >= (3 * 3600)) {
        stats_query.tc = 1800;
        tfmt = "H:i";
    } else if (stats_query.tp >= (3 * 600)) {
        stats_query.tc = 120;
        tfmt = "H:i";
    } else {
        stats_query.tc = 60;
        tfmt = "i:s";
    }

    stats_url += "&qry=" + btoa(JSON.stringify(stats_query));
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "node", "stats", function(tpl, node, stats) {

            if (tpl) {
                $("#work-content").html(tpl);
                $(".incp-podentry-stats-item").css({
                    "flex-basis": ww + "px"
                });
                inCp.OpToolsRefresh("#inops-node-optools-stats");
            }

            var max = 0;
            var tc_title = stats.cycle + " seconds";
            if (stats.cycle >= 86400 && stats.cycle % 86400 == 0) {
                tc_title = (stats.cycle / 86400) + " Day";
                if (stats.cycle > 86400) {
                    tc_title += "s";
                }
            } else if (stats.cycle >= 3600 && stats.cycle % 3600 == 0) {
                tc_title = (stats.cycle / 3600) + " Hour";
                if (stats.cycle > 3600) {
                    tc_title += "s";
                }
            } else if (stats.cycle >= 60 && stats.cycle % 60 == 0) {
                tc_title = (stats.cycle / 60) + " Minute";
                if (stats.cycle > 60) {
                    tc_title += "s";
                }
            }

            //
            var stats_cpu = l4i.Clone(inOpsHost.hchart_def);
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


            //
            var stats_ram = l4i.Clone(inOpsHost.hchart_def);
            stats_ram.options.title = l4i.T("Memory Usage (MB)");
            stats_ram._fix = 1024 * 1024;

            //
            var stats_net = l4i.Clone(inOpsHost.hchart_def);
            max = inOpsHost.nodeStatsFeedMaxValue(stats, "net/rs,net/ws");
            if (max > (1024 * 1024)) {
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
            if (max > (1024 * 1024)) {
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
                    data: []
                };
                var labels = [];
                var fix = 1;
                switch (v.name) {
                    case "cpu/sys":
                    case "cpu/user":
                        if (stats_cpu._fix && stats_cpu._fix > 1) {
                            fix = stats_cpu._fix;
                        }
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
                        break

                    case "ram/cc":
                        stats_ram.data.labels = labels;
                        dataset.label = "Cache";
                        stats_ram.data.datasets.push(dataset);
                        break

                    case "net/rs":
                        stats_net.data.labels = labels;
                        dataset.label = "Read";
                        stats_net.data.datasets.push(dataset);
                        break

                    case "net/ws":
                        stats_net.data.labels = labels;
                        dataset.label = "Send";
                        stats_net.data.datasets.push(dataset);
                        break

                    case "fs/sp/rs":
                        stats_fss.data.labels = labels;
                        dataset.label = "Read";
                        stats_fss.data.datasets.push(dataset);
                        break

                    case "fs/sp/ws":
                        stats_fss.data.labels = labels;
                        dataset.label = "Write";
                        stats_fss.data.datasets.push(dataset);
                        break

                    case "fs/sp/rn":
                        stats_fsn.data.labels = labels;
                        dataset.label = "Read";
                        stats_fsn.data.datasets.push(dataset);
                        break

                    case "fs/sp/wn":
                        stats_fsn.data.labels = labels;
                        dataset.label = "Write";
                        stats_fsn.data.datasets.push(dataset);
                        break
                }
            }

            hooto_chart.RenderElement(stats_cpu, "inops-node-stats-cpu");
            hooto_chart.RenderElement(stats_ram, "inops-node-stats-ram");
            hooto_chart.RenderElement(stats_net, "inops-node-stats-net");
            hooto_chart.RenderElement(stats_fss, "inops-node-stats-fss");
            hooto_chart.RenderElement(stats_fsn, "inops-node-stats-fsn");
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:inops-node)");
        });

        inOps.ApiCmd("host/node-entry?zoneid=" + zoneid + "&nodeid=" + inOpsHost.node_active_id, {
            callback: ep.done("node"),
        });

        inOps.ApiCmd("host/node-stats-feed?" + stats_url, {
            callback: ep.done("stats"),
        });

        inOps.TplFetch("host/node-stats", {
            callback: ep.done("tpl"),
        });
    });
}




inOpsHost.ZoneRefresh = function(cb) {
    if (inOpsHost.zones) {
        return cb(null, inOpsHost.zones);
    }

    inOps.ApiSysCmd("host/zone-list?fields=cells", {
        callback: function(err, zones) {

            if (err) {
                return cb(err, null);
            }

            if (!zones) {
                return cb("Network Connection Exception", null);
            }

            if (zones.error) {
                return cb(zones.error.message, null);
            }

            if (!zones.kind || zones.kind != "HostZoneList") {
                return cb("Network Connection Exception", null);
            }

            inOpsHost.zones = zones;
            cb(null, inOpsHost.zones);
        },
    });
}

inOpsHost.CellRefresh = function(zoneid, cb) {
    if (!zoneid || zoneid.indexOf("/") >= 0) {
        return;
    }

    inOps.ApiSysCmd("host/cell-list?zoneid=" + zoneid, {
        callback: function(err, cells) {

            if (err) {
                return cb(err, null);
            }

            if (!cells) {
                return cb("Network Connection Exception", null);
            }

            if (cells.error) {
                return cb(cells.error.message, null);
            }

            if (!cells.kind || cells.kind != "HostCellList") {
                return cb("Network Connection Exception", null);
            }

            var cellid = l4iSession.Get("inops_host_cellid");
            if (!cellid) {
                cellid = l4iStorage.Get("inops_host_cellid");
            }

            if (!cellid) {

                for (var i in cells.items) {
                    cellid = cells.items[i].meta.id;
                    break
                }

                l4iSession.Set("inops_host_cellid", cellid);
                l4iStorage.Set("inops_host_cellid", cellid);
            }

            cells._cellid = cellid;

            cb(null, cells);
        },
    });
}

inOpsHost.node_list_refresh = function(zoneid, cellid, cb) {
    inOps.ApiSysCmd("host/node-list?zoneid=" + zoneid + "&cellid=" + cellid, {
        callback: function(err, nodes) {

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
                        break
                    }
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
                    nodes.items[i].spec.peer_wan_addr = "-";
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
                nodes.items[i].spec.platform.kernel = nodes.items[i].spec.platform.kernel.replace(/.el7.x86_64$/g, '')
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
            }

            inOpsHost.nodes = nodes;
            cb(null, nodes);
        },
    });
}

inOpsHost.CellList = function(zoneid) {
    if (zoneid && zoneid.indexOf("/") >= 0) {
        zoneid = null;
    }

    if (zoneid) {
        l4iSession.Set("inops_host_zoneid", zoneid);
    }

    inOps.TplFetch("host/cell-list", {
        callback: function(err, tpl) {

            if (err) {
                return alert(err);
            }

            if (tpl) {
                $("#work-content").html(tpl);
            }

            inOpsHost.ZoneRefresh(function(err, zones) {

                if (err) {
                    return alert(err);
                }

                l4iTemplate.Render({
                    dstid: "inops-host-cells-zones",
                    tplid: "inops-host-cells-zones-tpl",
                    data: zones,
                });

                inOpsHost.CellRefresh(zones._zoneid, function(err, cells) {

                    if (err) {
                        return alert(err);
                    }

                    for (var i in cells.items) {

                        cells.items[i]._status_display = "Unknown";

                        for (var j in inOpsHost.statusls) {

                            if (inOpsHost.statusls[j].status == cells.items[i].phase) {
                                cells.items[i]._status_display = inOpsHost.statusls[j].title;
                                break
                            }
                        }

                        if (!cells.items[i].description) {
                            cells.items[i].description = "";
                        }
                    }

                    l4iTemplate.Render({
                        dstid: "inops-host-cells",
                        tplid: "inops-host-cells-tpl",
                        data: cells,
                    });
                });
            });
        },
    });
}


inOpsHost.CellSetForm = function(zoneid, cellid) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "cell", "zones", function(tpl, cell, zones) {

            if (!zones || !zones.items) {
                alert("Zone Not Found");
                return;
            }

            if (!cell) {
                cell = l4i.Clone(inOpsHost.cell_def);
            }

            if (!cell.kind || cell.kind != "HostCell") {
                cell = l4i.Clone(inOpsHost.cell_def);
            }

            if (!cell.zoneid && zoneid) {
                cell.zoneid = zoneid;
            }

            cell._zones = zones;
            cell._statusls = inOpsHost.statusls;

            if (!cell.description) {
                cell.description = "";
            }

            if (!cell.zone) {
                cell.zone = l4i.Clone(inOpsHost.zone_def);
            }

            l4iModal.Open({
                title: "Cell Setting",
                tplsrc: tpl,
                data: cell,
                height: 400,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inOpsHost.CellSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }]
            });
        });

        ep.fail(function(err) {
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
            inOps.ApiSysCmd("host/cell-entry?zoneid=" + zoneid + "&cellid=" + cellid, {
                callback: ep.done("cell"),
            });
        }

        // zones
        inOps.ApiSysCmd("host/zone-list", {
            callback: ep.done("zones"),
        });
    });
}

inOpsHost.CellSetCommit = function() {
    var form = $("#inops-host-cell-form"),
        alert_id = "#inops-host-cellset-alert";

    var req = {
        meta: {
            id: form.find("input[name=id]").val(),
        },
        zone_id: form.find("input[name=zone_id]:checked").val(),
        phase: parseInt(form.find("input[name=phase]:checked").val()),
        description: form.find("input[name=description]").val(),
    };

    inOps.ApiSysCmd("host/cell-set", {
        method: "POST",
        data: JSON.stringify(req),
        success: function(cell) {

            if (!cell) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (cell.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', cell.error.message);
            }

            if (!cell.kind || cell.kind != "HostCell") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inOpsHost.CellList();
            }, 500);
        },
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus + ' ' + xhr.responseText);
        }
    });
}


inOpsHost.ZoneList = function() {
    var alert_id = "#inops-host-zones-alert";
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (tpl) {
                $("#work-content").html(tpl);
            }

            if (!rsj || !rsj.kind || rsj.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Item Not Found");
            }

            if (!rsj.items) {
                rsj.items = [];
            }

            for (var i in rsj.items) {

                rsj.items[i]._status_display = "Unknown";

                for (var j in inOpsHost.statusls) {

                    if (inOpsHost.statusls[j].status == rsj.items[i].phase) {
                        rsj.items[i]._status_display = inOpsHost.statusls[j].title;
                        break
                    }
                }

                if (!rsj.items[i].cells) {
                    rsj.items[i].cells = [];
                }
            }

            l4iTemplate.Render({
                dstid: "inops-host-zones",
                tplid: "inops-host-zones-tpl",
                data: rsj,
            });
        });

        ep.fail(function(err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        inOps.TplFetch("host/zone-list", {
            callback: ep.done("tpl"),
        });

        inOps.ApiSysCmd("host/zone-list", {
            callback: ep.done("data"),
        });
    });
}

inOpsHost.ZoneSetForm = function(zoneid) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(inOpsHost.zone_def)
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

            rsj.statusls = inOpsHost.statusls;

            l4iModal.Open({
                title: title,
                tplsrc: tpl,
                data: rsj,
                width: 800,
                height: 600,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inOpsHost.ZoneSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
                success: function() {
                    // console.log(rsj.lan_addrs.length);
                    if (rsj.lan_addrs.length < 1) {
                        inOpsHost.ZoneLanAddressAppend();
                    }
                },
            });
        });

        ep.fail(function(err) {
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
            inOps.ApiSysCmd("host/zone-entry?id=" + zoneid, {
                callback: ep.done("data"),
            });
        }
    });
}

inOpsHost.ZoneWanAddressAppend = function() {
    l4iTemplate.Render({
        append: true,
        dstid: "inops-host-zoneset-wanaddrs",
        tplid: "inops-host-zoneset-wanaddr-tpl",
    });
}

inOpsHost.ZoneWanAddressDel = function(field) {
    $(field).parent().parent().remove();
}

inOpsHost.ZoneLanAddressAppend = function() {
    l4iTemplate.Render({
        append: true,
        dstid: "inops-host-zoneset-lanaddrs",
        tplid: "inops-host-zoneset-lanaddr-tpl",
    });
}

inOpsHost.ZoneLanAddressDel = function(field) {
    $(field).parent().parent().remove();
}

inOpsHost.ZoneSetCommit = function() {
    var form = $("#inops-host-zone-form");

    var req = {
        meta: {
            id: form.find("input[name=id]").val(),
        },
        phase: parseInt(form.find("input[name=phase]:checked").val()),
        summary: form.find("input[name=summary]").val(),
        wan_addrs: [],
        lan_addrs: [],
    };

    try {

        form.find(".inops-host-zoneset-wanaddr-item").each(function() {

            var addr = $(this).find("input[name=wan_addr]").val();

            if (!addr || addr.length < 7) {
                return;
            }

            req.wan_addrs.push(addr);
        });

        form.find(".inops-host-zoneset-lanaddr-item").each(function() {

            var addr = $(this).find("input[name=lan_addr]").val();

            if (!addr || addr.length < 7) {
                return;
            }

            req.lan_addrs.push(addr);
        });

        if (req.lan_addrs.length < 1) {
            throw "No LAN Address Found";
        }

    } catch (err) {
        return l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-danger', err);
    }

    inOps.ApiSysCmd("host/zone-set", {
        method: "POST",
        data: JSON.stringify(req),
        success: function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostZone") {
                return l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-success', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inOpsHost.ZoneList();
                inOpsHost.zones = null;
            }, 500);
        },
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-danger', textStatus + ' ' + xhr.responseText);
        }
    });
}
