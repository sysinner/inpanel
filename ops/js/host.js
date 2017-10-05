var inOpsHost = {
    statusls : [
        {status: 0, title: "Unknown"},
        {status: 1, title: "Active"},
        {status: 2, title: "Suspend"},
    ],
    node_statusls : [
        {phase: "Running", title: "Running"},
        {phase: "Suspended", title: "Suspended"},
        {phase: "Terminated", title: "Terminated"},
    ],
    actions : [
        // {action: 0, title: "Unknown"},
        {action: 1, title: "Active"},
        {action: 2, title: "Suspended"},
    ],
    zone_def : {
        kind: "HostZone",
        meta: {
            id: "",
            name: ""
        },
        status : 1,
        desc   : "",
        wan_addrs: [],
        lan_addrs: [],
    },
    cell_def : {
        kind: "HostCell",
        meta: {
            id: "",
            name: ""
        },
        zoneid : "",
        status : 1,
        desc   : "",
    },
    zones : null,
    cells : null,
    nodes : null,
    single_node: false,
}

inOpsHost.NavInit = function()
{
    // l4i.UrlEventRegister("host/index", inOpsHost.Index);
}

inOpsHost.Index = function()
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "zones", function (tpl, zones) {

            $("#comp-content").html(tpl);

            if (!zones || !zones.items) {
                return alert("Zone Not Found");
            }
            
            if (zones.items[0].meta.id == "local") {
                inOpsHost.single_node = true;
                $("#inops-host-nav-menus").css({"display": "none"});
                inOpsHost.NodeList("local", "general");
            }
            
            // TODO
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:inops-host-zoneset)");
        });

        // template
        inOps.TplFetch("host/index", {
            callback: ep.done("tpl"),
        });

        // zones
        inOpsHost.ZoneRefresh(ep.done("zones"));
    });

    return;
    inOps.TplFetch("host/index", {callback: function(err, data) {
        if (err) {
            return;
        }
        $("#comp-content").html(data);

        l4i.UrlEventRegister("host/node-list", inOpsHost.NodeList, "inops-host-nav-items");
        l4i.UrlEventRegister("host/cell-list", inOpsHost.CellList, "inops-host-nav-items");
        l4i.UrlEventRegister("host/zone-list", inOpsHost.ZoneList, "inops-host-nav-items");
        l4i.UrlEventHandler("host/node-list");
    }});
}

inOpsHost.NodeList = function(zoneid, cellid)
{
    if (zoneid && zoneid.indexOf("/") >= 0) {
        zoneid = null;
        cellid = null;
    }

    var uri = "";
    if (document.getElementById("inops_hostls_qry")) {
        uri = "qry_text="+ $("#inops_hostls_qry").val();
    }

    if (zoneid) {
        l4iSession.Set("inops_host_zoneid", zoneid);
    }

    if (cellid) {
        l4iSession.Set("inops_host_cellid", cellid);
    }

    inOps.TplFetch("host/node-list", {
        callback: function(err, tpl) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            
            if (inOpsHost.single_node) {
                // $("#inops-host-nodes-zones").css({"display": "none"});   
                // $("#inops-host-nodes-cells").css({"display": "none"});
                $("#inops-host-nodes-navbar").css({"display": "none"});
            }

            inOpsHost.ZoneRefresh(function(err, zones) {

                if (err) {
                    return alert(err);
                }

                l4iTemplate.Render({
                    dstid : "inops-host-nodes-zones",
                    tplid : "inops-host-nodes-zones-tpl",
                    data  : zones,
                });

                inOpsHost.CellRefresh(zones._zoneid, function(err, cells) {

                    if (err) {
                        return alert(err);
                    }

                    l4iTemplate.Render({
                        dstid : "inops-host-nodes-cells",
                        tplid : "inops-host-nodes-cells-tpl",
                        data  : cells,
                    });

                    inOpsHost.nodeRefresh(zones._zoneid, cells._cellid, function(err, nodes) {

                        if (err) {
                            return alert(err);
                        }

                        l4iTemplate.Render({
                            dstid : "inops-host-nodes",
                            tplid : "inops-host-nodes-tpl",
                            data  : nodes,
                        });
                    });
                });
            });
        },
    });
}

inOpsHost.NodeSetForm = function(zoneid, cellid, nodeid)
{
    if (!zoneid) {
        zoneid = l4iSession.Get("inops_host_zoneid");
    }

    if (!cellid) {
        cellid = l4iSession.Get("inops_host_cellid");
    }

    var alert_id = "#inops-host-nodeset-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

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
                title  : "Host Setting",
                tplsrc : tpl,
                data   : rsj,
                height : 400,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "inOpsHost.NodeSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }]
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
        inOps.ApiSysCmd("host/node-entry?zoneid="+ zoneid +"&cellid="+ cellid +"&nodeid="+ nodeid, {
            callback: ep.done("data"),
        });
    });
}

inOpsHost.NodeSetCommit = function()
{
    var form = $("#inops-host-node-form"),
        alert_id = "#inops-host-nodeset-alert";

    var req = {
        meta: {
            id   : form.find("input[name=id]").val(),
            name : form.find("input[name=name]").val(),
        },
		operate : {
            action  : parseInt(form.find("input[name=operate_action]:checked").val()),
            zone_id : form.find("input[name=operate_zone_id]").val(),
            cell_id : form.find("input[name=operate_cell_id]").val(),
		},
        spec: {
        },
    };

    inOps.ApiSysCmd("host/node-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

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

            window.setTimeout(function(){
                l4iModal.Close();
                inOpsHost.NodeList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}


inOpsHost.NodeNewForm = function(zoneid, cellid)
{
    if (!zoneid) {
        zoneid = l4iSession.Get("inops_host_zoneid");
    }

    if (!cellid) {
        cellid = l4iSession.Get("inops_host_cellid");
    }

    inOps.TplFetch("host/node-new", {
        callback: function(err, tpl) {

            l4iModal.Open({
                title  : "New Node",
                tplsrc : tpl,
                data   : {
                    zoneid    : zoneid,
                    cellid    : cellid,
                    _phase    : "Running",
                    _statusls : inOpsHost.node_statusls,
                },
                height : 400,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "inOpsHost.NodeNewCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
            });
        },
    });
}

inOpsHost.NodeNewCommit = function()
{
    var form = $("#inops-host-node-form"),
        alert_id ="#inops-host-nodenew-alert";

    var req = {
        meta : {
            name : form.find("input[name=name]").val(),
        },
		operate : {
            action  : parseInt(form.find("input[name=operate_action]").val()),
            zone_id : form.find("input[name=operate_zone_id]").val(),
            cell_id : form.find("input[name=operate_cell_id]").val(),
		},
        spec: {
            peer_lan_addr: form.find("input[name=peer_lan_addr]").val(),
        },
    };

    inOps.ApiSysCmd("host/node-new", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

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

            window.setTimeout(function(){
                l4iModal.Close();
                inOpsHost.NodeList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus+' '+xhr.responseText);
        },
    });
}

inOpsHost.ZoneRefresh = function(cb)
{
    var zoneid = l4iSession.Get("inops_host_zoneid");
    if (!zoneid) {
        zoneid = l4iStorage.Get("inops_host_zoneid");
    }

    if (inOpsHost.zones) {

        if (!zoneid || zoneid.indexOf("/") >= 0) {

            for (var i in inOpsHost.zones.items) {
                zoneid = inOpsHost.zones.items[i].meta.id;
                break
            }

            l4iSession.Set("inops_host_zoneid", zoneid);
            l4iStorage.Set("inops_host_zoneid", zoneid);
        }

        inOpsHost.zones._zoneid = zoneid;

        return cb(null, inOpsHost.zones);
    }

    inOps.ApiSysCmd("host/zone-list", {
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

            if (!zoneid || zoneid.indexOf("/") >= 0) {

                for (var i in inOpsHost.zones.items) {
                    zoneid = inOpsHost.zones.items[i].meta.id;
                    break
                }

                l4iSession.Set("inops_host_zoneid", zoneid);
                l4iStorage.Set("inops_host_zoneid", zoneid);
            }

            inOpsHost.zones._zoneid = zoneid;

            cb(null, inOpsHost.zones);
        },
    });
}

inOpsHost.CellRefresh = function(zoneid, cb)
{
    if (!zoneid || zoneid.indexOf("/") >= 0) {
        return;
    }

    inOps.ApiSysCmd("host/cell-list?zoneid="+ zoneid, {
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

inOpsHost.nodeRefresh = function(zoneid, cellid, cb)
{
    inOps.ApiSysCmd("host/node-list?zoneid="+ zoneid +"&cellid="+ cellid, {
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
                if (!nodes.items[i].spec.capacity.memory) {
                    nodes.items[i].spec.capacity.memory = 0;
                }

                if (!nodes.items[i].operate.ports) {
                    nodes.items[i].operate.ports = [];
                }
            }

            cb(null, nodes);
        },
    });
}

inOpsHost.CellList = function(zoneid)
{
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
                    dstid : "inops-host-cells-zones",
                    tplid : "inops-host-cells-zones-tpl",
                    data  : zones,
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
                        dstid : "inops-host-cells",
                        tplid : "inops-host-cells-tpl",
                        data  : cells,
                    });
                });
            });
        },
    });
}


inOpsHost.CellSetForm = function(zoneid, cellid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "cell", "zones", function (tpl, cell, zones) {

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
                title  : "Cell Setting",
                tplsrc : tpl,
                data   : cell,
                height : 400,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "inOpsHost.CellSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }]
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
            inOps.ApiSysCmd("host/cell-entry?zoneid="+ zoneid +"&cellid="+ cellid, {
                callback: ep.done("cell"),
            });
        }

        // zones
        inOps.ApiSysCmd("host/zone-list", {
            callback: ep.done("zones"),
        });
    });
}

inOpsHost.CellSetCommit = function()
{
    var form = $("#inops-host-cell-form"),
        alert_id = "#inops-host-cellset-alert";

    var req = {
        meta : {
            id : form.find("input[name=id]").val(),
        },
        zone_id : form.find("input[name=zone_id]:checked").val(),
        phase : parseInt(form.find("input[name=phase]:checked").val()),
        description : form.find("input[name=description]").val(),
    };

    inOps.ApiSysCmd("host/cell-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(cell) {

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

            window.setTimeout(function(){
                l4iModal.Close();
                inOpsHost.CellList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}


inOpsHost.ZoneList = function()
{
    var alert_id = "#inops-host-zones-alert";
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

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
                dstid : "inops-host-zones",
                tplid : "inops-host-zones-tpl",
                data  : rsj,
            });
        });

        ep.fail(function (err) {
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

inOpsHost.ZoneSetForm = function(zoneid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

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
                title  : title,
                tplsrc : tpl,
                data   : rsj,
                width  : 800,
                height : 600,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "inOpsHost.ZoneSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
                success: function() {
                    // console.log(rsj.lan_addrs.length);
                    if (rsj.lan_addrs.length < 1) {
                        inOpsHost.ZoneLanAddressAppend();
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
            inOps.ApiSysCmd("host/zone-entry?id="+ zoneid, {
                callback: ep.done("data"),
            });
        }
    });
}

inOpsHost.ZoneWanAddressAppend = function()
{
    l4iTemplate.Render({
        append : true,
        dstid  : "inops-host-zoneset-wanaddrs",
        tplid  : "inops-host-zoneset-wanaddr-tpl",
    });
}

inOpsHost.ZoneWanAddressDel = function(field)
{
    $(field).parent().parent().remove();
}

inOpsHost.ZoneLanAddressAppend = function()
{
    l4iTemplate.Render({
        append : true,
        dstid  : "inops-host-zoneset-lanaddrs",
        tplid  : "inops-host-zoneset-lanaddr-tpl",
    });
}

inOpsHost.ZoneLanAddressDel = function(field)
{
    $(field).parent().parent().remove();
}

inOpsHost.ZoneSetCommit = function()
{
    var form = $("#inops-host-zone-form");

    var req = {
        meta : {
            id : form.find("input[name=id]").val(),
        },
        phase : parseInt(form.find("input[name=phase]:checked").val()),
        summary : form.find("input[name=summary]").val(),
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
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

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

            window.setTimeout(function(){
                l4iModal.Close();
                inOpsHost.ZoneList();
                inOpsHost.zones = null;
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert("#inops-host-zoneset-alert", 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}
