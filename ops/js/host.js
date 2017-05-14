var losOpsHost = {
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

losOpsHost.NavInit = function()
{
    // l4i.UrlEventRegister("host/index", losOpsHost.Index);
}

losOpsHost.Index = function()
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "zones", function (tpl, zones) {

            $("#comp-content").html(tpl);

            if (!zones || !zones.items) {
                return alert("Zone Not Found");
            }
            
            if (zones.items[0].meta.id == "local") {
                losOpsHost.single_node = true;
                $("#losops-host-nav-menus").css({"display": "none"});
                losOpsHost.NodeList("local", "general");
            }
            
            // TODO
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:losops-host-zoneset)");
        });

        // template
        losOps.TplFetch("host/index", {
            callback: ep.done("tpl"),
        });

        // zones
        losOpsHost.ZoneRefresh(ep.done("zones"));
    });

    return;
    losOps.TplFetch("host/index", {callback: function(err, data) {
        if (err) {
            return;
        }
        $("#comp-content").html(data);

        l4i.UrlEventRegister("host/node-list", losOpsHost.NodeList, "losops-host-nav-items");
        l4i.UrlEventRegister("host/cell-list", losOpsHost.CellList, "losops-host-nav-items");
        l4i.UrlEventRegister("host/zone-list", losOpsHost.ZoneList, "losops-host-nav-items");
        l4i.UrlEventHandler("host/node-list");
    }});
}

losOpsHost.NodeList = function(zoneid, cellid)
{
    if (zoneid && zoneid.indexOf("/") >= 0) {
        zoneid = null;
        cellid = null;
    }

    var uri = "";
    if (document.getElementById("losops_hostls_qry")) {
        uri = "qry_text="+ $("#losops_hostls_qry").val();
    }

    if (zoneid) {
        l4iSession.Set("losops_host_zoneid", zoneid);
    }

    if (cellid) {
        l4iSession.Set("losops_host_cellid", cellid);
    }

    losOps.TplFetch("host/node-list", {
        callback: function(err, tpl) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            
            if (losOpsHost.single_node) {
                // $("#losops-host-nodes-zones").css({"display": "none"});   
                // $("#losops-host-nodes-cells").css({"display": "none"});
                $("#losops-host-nodes-navbar").css({"display": "none"});
            }

            losOpsHost.ZoneRefresh(function(err, zones) {

                if (err) {
                    return alert(err);
                }

                l4iTemplate.Render({
                    dstid : "losops-host-nodes-zones",
                    tplid : "losops-host-nodes-zones-tpl",
                    data  : zones,
                });

                losOpsHost.CellRefresh(zones._zoneid, function(err, cells) {

                    if (err) {
                        return alert(err);
                    }

                    l4iTemplate.Render({
                        dstid : "losops-host-nodes-cells",
                        tplid : "losops-host-nodes-cells-tpl",
                        data  : cells,
                    });

                    losOpsHost.nodeRefresh(zones._zoneid, cells._cellid, function(err, nodes) {

                        if (err) {
                            return alert(err);
                        }

                        l4iTemplate.Render({
                            dstid : "losops-host-nodes",
                            tplid : "losops-host-nodes-tpl",
                            data  : nodes,
                        });
                    });
                });
            });
        },
    });
}

losOpsHost.NodeSetForm = function(zoneid, cellid, nodeid)
{
    if (!zoneid) {
        zoneid = l4iSession.Get("losops_host_zoneid");
    }

    if (!cellid) {
        cellid = l4iSession.Get("losops_host_cellid");
    }

    var alert_id = "#losops-host-nodeset-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

            if (!rsj || !rsj.kind || rsj.kind != "HostNode") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            rsj._actions = losOpsHost.actions;
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
                    onclick : "losOpsHost.NodeSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }]
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:losops-host-zoneset)");
        });

        // template
        losOps.TplFetch("host/node-set", {
            callback: ep.done("tpl"),
        });

        // data
        losOps.ApiSysCmd("host/node-entry?zoneid="+ zoneid +"&cellid="+ cellid +"&nodeid="+ nodeid, {
            callback: ep.done("data"),
        });
    });
}

losOpsHost.NodeSetCommit = function()
{
    var form = $("#losops-host-node-form"),
        alert_id = "#losops-host-nodeset-alert";

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

    losOps.ApiSysCmd("host/node-set", {
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
                losOpsHost.NodeList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}


losOpsHost.NodeNewForm = function(zoneid, cellid)
{
    if (!zoneid) {
        zoneid = l4iSession.Get("losops_host_zoneid");
    }

    if (!cellid) {
        cellid = l4iSession.Get("losops_host_cellid");
    }

    losOps.TplFetch("host/node-new", {
        callback: function(err, tpl) {

            l4iModal.Open({
                title  : "New Node",
                tplsrc : tpl,
                data   : {
                    zoneid    : zoneid,
                    cellid    : cellid,
                    _phase    : "Running",
                    _statusls : losOpsHost.node_statusls,
                },
                height : 400,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "losOpsHost.NodeNewCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
            });
        },
    });
}

losOpsHost.NodeNewCommit = function()
{
    var form = $("#losops-host-node-form"),
        alert_id ="#losops-host-nodenew-alert";

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

    losOps.ApiSysCmd("host/node-new", {
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
                losOpsHost.NodeList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus+' '+xhr.responseText);
        },
    });
}

losOpsHost.ZoneRefresh = function(cb)
{
    var zoneid = l4iSession.Get("losops_host_zoneid");
    if (!zoneid) {
        zoneid = l4iStorage.Get("losops_host_zoneid");
    }

    if (losOpsHost.zones) {

        if (!zoneid || zoneid.indexOf("/") >= 0) {

            for (var i in losOpsHost.zones.items) {
                zoneid = losOpsHost.zones.items[i].meta.id;
                break
            }

            l4iSession.Set("losops_host_zoneid", zoneid);
            l4iStorage.Set("losops_host_zoneid", zoneid);
        }

        losOpsHost.zones._zoneid = zoneid;

        return cb(null, losOpsHost.zones);
    }

    losOps.ApiSysCmd("host/zone-list", {
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

            losOpsHost.zones = zones;

            if (!zoneid || zoneid.indexOf("/") >= 0) {

                for (var i in losOpsHost.zones.items) {
                    zoneid = losOpsHost.zones.items[i].meta.id;
                    break
                }

                l4iSession.Set("losops_host_zoneid", zoneid);
                l4iStorage.Set("losops_host_zoneid", zoneid);
            }

            losOpsHost.zones._zoneid = zoneid;

            cb(null, losOpsHost.zones);
        },
    });
}

losOpsHost.CellRefresh = function(zoneid, cb)
{
    if (!zoneid || zoneid.indexOf("/") >= 0) {
        return;
    }

    losOps.ApiSysCmd("host/cell-list?zoneid="+ zoneid, {
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

            var cellid = l4iSession.Get("losops_host_cellid");
            if (!cellid) {
                cellid = l4iStorage.Get("losops_host_cellid");
            }

            if (!cellid) {

                for (var i in cells.items) {
                    cellid = cells.items[i].meta.id;
                    break
                }

                l4iSession.Set("losops_host_cellid", cellid);
                l4iStorage.Set("losops_host_cellid", cellid);
            }

            cells._cellid = cellid;

            cb(null, cells);
        },
    });
}

losOpsHost.nodeRefresh = function(zoneid, cellid, cb)
{
    losOps.ApiSysCmd("host/node-list?zoneid="+ zoneid +"&cellid="+ cellid, {
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

                for (var j in losOpsHost.actions) {

                    if (losOpsHost.actions[j].action == nodes.items[i].operate.action) {
                        nodes.items[i]._action_display = losOpsHost.actions[j].title;
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

losOpsHost.CellList = function(zoneid)
{
    if (zoneid && zoneid.indexOf("/") >= 0) {
        zoneid = null;
    }

    if (zoneid) {
        l4iSession.Set("losops_host_zoneid", zoneid);
    }

    losOps.TplFetch("host/cell-list", {
        callback: function(err, tpl) {

            if (err) {
                return alert(err);
            }

            if (tpl) {
                $("#work-content").html(tpl);
            }

            losOpsHost.ZoneRefresh(function(err, zones) {

                if (err) {
                    return alert(err);
                }

                l4iTemplate.Render({
                    dstid : "losops-host-cells-zones",
                    tplid : "losops-host-cells-zones-tpl",
                    data  : zones,
                });

                losOpsHost.CellRefresh(zones._zoneid, function(err, cells) {

                    if (err) {
                        return alert(err);
                    }

                    for (var i in cells.items) {

                        cells.items[i]._status_display = "Unknown";

                        for (var j in losOpsHost.statusls) {

                            if (losOpsHost.statusls[j].status == cells.items[i].phase) {
                                cells.items[i]._status_display = losOpsHost.statusls[j].title;
                                break
                            }
                        }

                        if (!cells.items[i].description) {
                            cells.items[i].description = "";
                        }
                    }

                    l4iTemplate.Render({
                        dstid : "losops-host-cells",
                        tplid : "losops-host-cells-tpl",
                        data  : cells,
                    });
                });
            });
        },
    });
}


losOpsHost.CellSetForm = function(zoneid, cellid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "cell", "zones", function (tpl, cell, zones) {

            if (!zones || !zones.items) {
                alert("Zone Not Found");
                return;
            }

            if (!cell) {
                cell = l4i.Clone(losOpsHost.cell_def);
            }

            if (!cell.kind || cell.kind != "HostCell") {
                cell = l4i.Clone(losOpsHost.cell_def);
            }

            if (!cell.zoneid && zoneid) {
                cell.zoneid = zoneid;
            }

            cell._zones = zones;
            cell._statusls = losOpsHost.statusls;

            if (!cell.description) {
                cell.description = "";
            }

            if (!cell.zone) {
                cell.zone = l4i.Clone(losOpsHost.zone_def);
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
                    onclick : "losOpsHost.CellSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }]
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:losops-host-zoneset)");
        });

        // template
        losOps.TplFetch("host/cell-set", {
            callback: ep.done("tpl"),
        });

        // cell
        if (!cellid) {
            ep.emit("cell", null);
        } else {
            losOps.ApiSysCmd("host/cell-entry?zoneid="+ zoneid +"&cellid="+ cellid, {
                callback: ep.done("cell"),
            });
        }

        // zones
        losOps.ApiSysCmd("host/zone-list", {
            callback: ep.done("zones"),
        });
    });
}

losOpsHost.CellSetCommit = function()
{
    var form = $("#losops-host-cell-form"),
        alert_id = "#losops-host-cellset-alert";

    var req = {
        meta : {
            id : form.find("input[name=id]").val(),
        },
        zone_id : form.find("input[name=zone_id]:checked").val(),
        phase : parseInt(form.find("input[name=phase]:checked").val()),
        description : form.find("input[name=description]").val(),
    };

    losOps.ApiSysCmd("host/cell-set", {
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
                losOpsHost.CellList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}


losOpsHost.ZoneList = function()
{
    var alert_id = "#losops-host-zones-alert";
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

                for (var j in losOpsHost.statusls) {

                    if (losOpsHost.statusls[j].status == rsj.items[i].phase) {
                        rsj.items[i]._status_display = losOpsHost.statusls[j].title;
                        break
                    }
                }

                if (!rsj.items[i].cells) {
                    rsj.items[i].cells = [];
                }
            }

            l4iTemplate.Render({
                dstid : "losops-host-zones",
                tplid : "losops-host-zones-tpl",
                data  : rsj,
            });
        });

        ep.fail(function (err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        losOps.TplFetch("host/zone-list", {
            callback: ep.done("tpl"),
        });

        losOps.ApiSysCmd("host/zone-list", {
            callback: ep.done("data"),
        });
    });
}

losOpsHost.ZoneSetForm = function(zoneid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(losOpsHost.zone_def)
            }

            if (!rsj.kind || rsj.kind != "HostZone") {
                rsj = l4i.Clone(losOpsHost.zone_def);
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

            rsj.statusls = losOpsHost.statusls;

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
                    onclick : "losOpsHost.ZoneSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
                success: function() {
                    // console.log(rsj.lan_addrs.length);
                    if (rsj.lan_addrs.length < 1) {
                        losOpsHost.ZoneLanAddressAppend();
                    }
                },
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:losops-host-zoneset)");
        });

        // template
        losOps.TplFetch("host/zone-set", {
            callback: ep.done("tpl"),
        });

        // data
        if (!zoneid) {
            ep.emit("data", null);
        } else {
            losOps.ApiSysCmd("host/zone-entry?id="+ zoneid, {
                callback: ep.done("data"),
            });
        }
    });
}

losOpsHost.ZoneWanAddressAppend = function()
{
    l4iTemplate.Render({
        append : true,
        dstid  : "losops-host-zoneset-wanaddrs",
        tplid  : "losops-host-zoneset-wanaddr-tpl",
    });
}

losOpsHost.ZoneWanAddressDel = function(field)
{
    $(field).parent().parent().remove();
}

losOpsHost.ZoneLanAddressAppend = function()
{
    l4iTemplate.Render({
        append : true,
        dstid  : "losops-host-zoneset-lanaddrs",
        tplid  : "losops-host-zoneset-lanaddr-tpl",
    });
}

losOpsHost.ZoneLanAddressDel = function(field)
{
    $(field).parent().parent().remove();
}

losOpsHost.ZoneSetCommit = function()
{
    var form = $("#losops-host-zone-form");

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

        form.find(".losops-host-zoneset-wanaddr-item").each(function() {

            var addr = $(this).find("input[name=wan_addr]").val();

            if (!addr || addr.length < 7) {
                return;
            }

            req.wan_addrs.push(addr);
        });

        form.find(".losops-host-zoneset-lanaddr-item").each(function() {

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
        return l4i.InnerAlert("#losops-host-zoneset-alert", 'alert-danger', err);
    }

    losOps.ApiSysCmd("host/zone-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert("#losops-host-zoneset-alert", 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert("#losops-host-zoneset-alert", 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "HostZone") {
                return l4i.InnerAlert("#losops-host-zoneset-alert", 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert("#losops-host-zoneset-alert", 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losOpsHost.ZoneList();
                losOpsHost.zones = null;
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert("#losops-host-zoneset-alert", 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}
