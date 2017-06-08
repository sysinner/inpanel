var losCpPod = {
    statusls : [
        {phase: "Running", title: "Running"},
        {phase: "Stopped", title: "Stopped"},
    ],
    statussetls : [
        {phase: "Running", title: "Running"},
        {phase: "Stopped", title: "Stopped"},
        {phase: "Destroy", title: "Destroy"},
    ],
    def : {
        meta : {
            id : "",
            name : "",
        },
        operate: {
            action : 1 << 1,
        },
        spec : {
            meta : {
                id : "",
            },
            ref_plan : "",
            zone: "",
            cell: "",
        },
    },
    syszones : null,
    specs : null,
    plans : null,
    plan  : null,
    plan_selected : null,
    clusters : null,
    cluster_selected : null,
    zone_active : null,
    new_options : {},
}

losCpPod.Index = function()
{
    $("#comp-content").html('<div id="work-content"></div>');
    losCpPod.List();
}

losCpPod.List = function(tplid)
{
    if (!tplid || tplid.indexOf("/") >= 0) {
        tplid = "loscp-podls";
    }
    var alert_id = "#"+ tplid +"-alert";
    var uri = "?";

    if (losCp.Zones.items && losCp.Zones.items.length == 1) {
        losCpPod.zone_active = losCp.Zones.items[0].meta.id;
        uri += "zone_id="+ losCpPod.zone_active;
    }
    uri += "&fields=meta/id|name,operate/action|ports,spec/ref/name,spec/zone|cell"

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            losCp.OpToolActive = null;
            losCp.OpToolsRefresh("#"+ tplid +"-optools");

            if (!data || data.error || !data.kind || data.kind != "PodList") {

                if (data.error) {
                    return l4i.InnerAlert(alert_id, 'alert-danger', data.error.message);
                }

                return l4i.InnerAlert(alert_id, 'alert-danger', "Items Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            for (var i in data.items) {
                if (!data.items[i].apps) {
                    data.items[i].apps = [];
                }
                if (!data.items[i].operate.ports) {
                    data.items[i].operate.ports = [];
                }
                for (var j in data.items[i].operate.ports) {
                    if (!data.items[i].operate.ports[j].host_port) {
                        data.items[i].operate.ports[j].host_port = 0;
                    }
                }
                data.items[i].operate._action = losCp.OpActionTitle(data.items[i].operate.action);
            }

            if (losCpPod.zone_active) {
                data._zone_active = losCpPod.zone_active;
            }

            // $("#loscp-podls-alert").hide();
            if (data.items.length < 1) {
                return l4i.InnerAlert(alert_id, 'alert-info', "No Item Found Yet ...");
            }
            data._actions = losCp.OpActions;

            l4iTemplate.Render({
                dstid   : tplid,
                tplid   : tplid +"-tpl",
                data    : data,
                callback: function(err) {
                    //
                },
            });
        });

        ep.fail(function (err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        // template
        var el = document.getElementById(tplid);
        if (!el || el.length < 1) {
            losCp.TplFetch("pod/list", {
                callback: function(err, tpl) {

                    if (err) {
                        return ep.emit('error', err);
                    }

                    ep.emit("tpl", tpl);
                }
            });
        } else {
            ep.emit("tpl", null);
        }

        losCp.ApiCmd("pod/list"+ uri, {
            callback: ep.done("data"),
        });
    });
}


losCpPod.ListOpActionChange = function(pod_id, obj, tplid)
{
    if (!pod_id) {
        return;
    }
    var op_action = parseInt($(obj).val());
    if (op_action < 1) {
        return;
    }

    if (!tplid) {
        tplid = "loscp-podls";
    }
    var alert_id = "#"+ tplid +"-alert";

    var uri = "?pod_id="+ pod_id +"&op_action="+ op_action;

    losCp.ApiCmd("pod/op-action-set"+ uri, {
        method  : "GET",
        timeout : 10000,
        callback : function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: "+ err);
            }

            if (!rsj || rsj.kind != "PodInstance") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                l4i.InnerAlert(alert_id, 'alert-danger', msg);
                return;
            }

            if (op_action == 2) {
                $(obj).addClass("button-success");
            } else {
                $(obj).removeClass("button-success");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successful updated");
        }
    });
}


losCpPod.New = function(options)
{
    options = options || {};
    var alert_id = "#loscp-podnew-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "plans", function (tpl, zones, plans) {

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }
            losCpPod.syszones = zones;

            if (!plans || !plans.kind || plans.kind != "PodSpecPlanList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            var pod = l4i.Clone(losCpPod.def);

            pod._plans = plans;
            pod._plan_selected = null;

            for (var i in pod._plans.items) {
                pod._plan_selected = pod._plans.items[i].meta.id;
                break;
            }

            if (!pod._plan_selected) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "No SpecPodPlan Found");
            }


            losCpPod.plans = plans;
            losCpPod.plan_selected = pod._plan_selected;
            // losCpPod.zones = zones;

            // console.log(losCpPod)

            var fnfre = function() {
                l4iTemplate.Render({
                    dstid: "loscp-podnew-plans",
                    tplid: "loscp-podnew-plans-tpl",
                    data : {
                        items:          losCpPod.plans.items,
                        _plan_selected: losCpPod.plan_selected,
                    },
                });
                losCpPod.NewRefreshPlan();
            }
            losCpPod.new_options = options;
            if (options.open_modal) {
                l4iModal.Open({
                    tplsrc : tpl,
                    title  : "Create new Pod Instance",
                    width  : 900,
                    height : 600,
                    callback: function() {
                        l4iTemplate.Render({
                            dstid: "loscp-podnew-form",
                            tplid: "loscp-podnew-modal",
                            data : {
                                items:          losCpPod.plans.items,
                                _plan_selected: losCpPod.plan_selected,
                            },
                            callback: fnfre,
                        });
                    },
                    buttons: [{
                        onclick : "l4iModal.Close()",
                        title   : "Close",
                    }, {
                        onclick : "losCpPod.NewCommit()",
                        title   : "Save",
                        style   : "btn btn-primary",
                    }],
                });

            } else {
                l4iTemplate.Render({
                    dstid:    "work-content",
                    tplsrc:   tpl,
                    callback: function() {
                        l4iTemplate.Render({
                            dstid: "loscp-podnew-form",
                            tplid: "loscp-podnew-inner",
                            data : {
                                items:          losCpPod.plans.items,
                                _plan_selected: losCpPod.plan_selected,
                            },
                            callback: fnfre,
                        });
                    },
                });
            }
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:loscp-pod)");
        });

        // template
        losCp.TplFetch("pod/new", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("pod-spec/plan-list", {
            callback: ep.done("plans"),
        });

        losCp.ApiCmd("host/zone-list?fields=cells", {
            callback: ep.done("zones"),
        })
    });
}

losCpPod.NewPlanChange = function(plan_id)
{
    if (losCpPod.plan_selected == plan_id) {
        return;
    }

    losCpPod.plan_selected = plan_id;
    losCpPod.NewRefreshPlan();

    $("#loscp-podnew-plans").find(".loscp-form-box-selector-item.selected").removeClass("selected");
    $("#loscp-podnew-plan-id-"+ plan_id).addClass("selected");
}


losCpPod.NewRefreshPlan = function()
{
    var alert_id = "#loscp-podnew-alert";

    // console.log(losCpPod.plans);
    // console.log(losCpPod.syszones);
    for (var i in losCpPod.plans.items) {

        if (losCpPod.plans.items[i].meta.id != losCpPod.plan_selected) {
            continue;
        }

        losCpPod.plan = losCpPod.plans.items[i];

        //
        for (var i in losCpPod.plan.res_volumes) {

            var vol = losCpPod.plan.res_volumes[i];

            if (vol.default <  1073741824) {
                vol._valued = (vol.default / 1073741824).toFixed(1);
            } else {
                vol._valued = (vol.default / 1048576).toFixed(0);
            }

            losCpPod.plan._res_volume = vol;

            break; // TODO
        }

        if (!losCpPod.plan._res_volume) {
            return l4i.InnerAlert(alert_id, 'alert-danger', "No SpecPodPlan/Volume Found");
        }

        //
        losCpPod.plan._zones = [];
        losCpPod.plan._zone_selected = null;

        // console.log(losCpPod.plan);

        for (var i in losCpPod.plan.zones) {

            for (var j in losCpPod.syszones.items) {

                if (losCpPod.plan.zones[i].name != losCpPod.syszones.items[j].meta.id) {
                    continue;
                }

                for (var k in losCpPod.plan.zones[i].cells) {

                    for (var m in losCpPod.syszones.items[j].cells) {

                        if (losCpPod.plan.zones[i].cells[k] != losCpPod.syszones.items[j].cells[m].meta.id) {
                            continue;
                        }

                        var name = losCpPod.plan.zones[i].name +"/"+  losCpPod.plan.zones[i].cells[k];
                        var zone_title = losCpPod.plan.zones[i].name;
                        if (losCpPod.syszones.items[j].meta.name) {
                            zone_title = losCpPod.syszones.items[j].meta.name;
                        }
                        var cell_title = losCpPod.plan.zones[i].cells[k];
                        if (losCpPod.syszones.items[j].cells[m].meta.name) {
                            cell_title = losCpPod.syszones.items[j].cells[m].meta.name;
                        }

                        losCpPod.plan._zones.push({
                            id  :       l4iString.CryptoMd5(name),
                            name:       name,
                            zone:       losCpPod.plan.zones[i].name,
                            cell:       losCpPod.plan.zones[i].cells[k],
                            zone_title: zone_title,
                            cell_title: cell_title,
                        });

                        if (!losCpPod.plan._zone_selected) {
                            losCpPod.plan._zone_selected = name;
                        }

                        break
                    }
                }

                break
            }
        }

        //
        if (!losCpPod.plan._zone_selected) {
            return l4i.InnerAlert(alert_id, 'alert-danger', "No SpecZone Found");
        }

        //
        if (!losCpPod.plan.image_selected) {
            losCpPod.plan.image_selected = losCpPod.plan.image_default;
        }

        // //
        if (!losCpPod.plan.res_compute_selected) {
            losCpPod.plan.res_compute_selected = losCpPod.plan.res_compute_default;
        }

        l4iTemplate.Render({
            dstid: "loscp-podnew-resource-selector",
            tplid: "loscp-podnew-resource-selector-tpl",
            data : losCpPod.plan,
        });

        break;
    }
}


losCpPod.NewPlanClusterChange = function(zn)
{
    if (losCpPod.plan._zone_selected == zn) {
        return;
    }

    $("#loscp-podnew-zones").find(".loscp-form-box-selector-item.selected").removeClass("selected");
    $("#loscp-podnew-zone-id-"+ l4iString.CryptoMd5(zn)).addClass("selected");

    losCpPod.plan._zone_selected = zn;
}

losCpPod.NewPlanResComputeChange = function(res_compute_id)
{
    if (!losCpPod.plan || losCpPod.plan.res_compute_selected == res_compute_id) {
        return;
    }

    $("#loscp-podnew-resource-computes").find(".loscp-form-box-selector-item.selected").removeClass("selected");
    $("#loscp-podnew-resource-compute-id-"+ res_compute_id).addClass("selected");

    losCpPod.plan.res_compute_selected = res_compute_id;
}

losCpPod.NewPlanImageChange = function(image_id)
{
    if (!losCpPod.plan || losCpPod.plan.image_selected == image_id) {
        return;
    }

    $("#loscp-podnew-images").find(".loscp-form-box-selector-item.selected").removeClass("selected");
    $("#loscp-podnew-image-id-"+ image_id).addClass("selected");

    losCpPod.plan.image_selected = image_id;
}


losCpPod.NewCommit = function()
{
    var alert_id = "#loscp-podnew-alert",
        vol_size = $("#loscp-podnew-resource-value").val();
    if (vol_size <= 0) {
        return;
    }

    if (vol_size >= 1) {
        vol_size = vol_size * 1073741824; // GB
    } else {
        vol_size = vol_size * 1000 * 1048576; // MB
    }

    var set = {
        kind: "SpecPodPlanSetup",
        name: $("#loscp-podnew-meta-name").val(),
        plan: losCpPod.plan_selected,
        zone: losCpPod.plan._zone_selected.split("/")[0],
        cell: losCpPod.plan._zone_selected.split("/")[1],
        res_volume      : losCpPod.plan._res_volume.meta.id,
        res_volume_size : parseInt(vol_size),
        boxes: [{
            name        : "main",
            image       : losCpPod.plan.image_selected,
            res_compute : losCpPod.plan.res_compute_selected,
        }],
    };

    if (!set.name || set.name == "") {
        return l4i.InnerAlert(alert_id, 'alert-danger', "Name Not Found");
    }

    $(alert_id).hide();

    losCp.ApiCmd("pod/new", {
        method  : "POST",
        data    : JSON.stringify(set),
        callback : function(err, rsj) {
            if (losCpPod.new_options.open_modal) {
                l4iModal.ScrollTop();
            }
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                if (!losCpPod.new_options.open_modal) {
                    losCpPod.List();
                }
                if (losCpPod.new_options.callback) {
                    losCpPod.new_options.callback(null);
                }
            }, 1000);
        }
    });
}

losCpPod.Info = function(pod_id)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function (tpl, pod) {

            if (!pod.operate.ports) {
                pod.operate.ports = [];
            }
            for (var j in pod.operate.ports) {
                if (!pod.operate.ports[j].host_port) {
                    pod.operate.ports[j].host_port = 0;
                }
            }

            l4iModal.Open({
                title  : "Pod Instance Info",
                tplsrc : tpl,
                width  : 900,
                height : 600,
                data   : pod,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }],
            });
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:loscp-pod)");
        });

        losCp.ApiCmd("pod/entry?id="+ pod_id, {
            callback: ep.done("pod"),
        });

        losCp.TplFetch("pod/info", {
            callback: ep.done("tpl"),
        });
    });
}

losCpPod.SetInfo = function(pod_id)
{
    if (!pod_id) {
        return alert("No Pod Found");
    }

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function (tpl, pod) {

            l4iModal.Open({
                title  : "Pod Instance Info",
                tplsrc : tpl,
                width  : 800,
                height : 400,
                data   : {
                    pod : pod,
                    _op_actions : losCp.OpActions,
                },
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "losCpPod.SetInfoCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
            });
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:loscp-pod)");
        });

        losCp.ApiCmd("pod/entry?id="+ pod_id, {
            callback: ep.done("pod"),
        });

        losCp.TplFetch("pod/set-info", {
            callback: ep.done("tpl"),
        });
    });
}


losCpPod.SetInfoCommit = function()
{
    var alert_id = "#loscp-podsetinfo-alert";
    var form = $("#loscp-podsetinfo");

    var set = {
        meta : {
            id:   form.find("input[name=meta_id]").val(),
            name: form.find("input[name=meta_name]").val(),
        },
        operate: {
            action: parseInt(form.find("input[name=operate_action]:checked").val()),
        },
    };

    $(alert_id).hide();

    losCp.ApiCmd("pod/set-info", {
        method  : "POST",
        data    : JSON.stringify(set),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpPod.List();
            }, 500);
        }
    });
}

losCpPod.Set = function(pod_id)
{
    var alert_id = "#loscp-podset-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "specs", "pod", function (tpl, zones, specs, pod) {

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (!specs || !specs.kind || specs.kind != "PodSpecList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (!pod.kind || pod.kind != "Pod") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Pod Not Found");
            }

            pod._zones = zones;
            pod._specs = specs;
            pod._statusls = losCpPod.statussetls;

            losCpPod.specs = specs;

            l4iModal.Open({
                title  : "Pod Instance Setting",
                tplsrc : tpl,
                width  : 900,
                height : 600,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "losCpPod.SetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
                success : function() {

                    l4iTemplate.Render({
                        dstid  : "loscp-podset",
                        tplid  : "loscp-podset-tpl",
                        data   : pod,
                        success : function() {

                            if (pod.spec.meta.id != "") {

                                losCpPod.SetSpecRefresh(pod.spec.meta.id);

                            } else {

                                for (var i in losCpPod.specs.items) {

                                    losCpPod.SetSpecRefresh(losCpPod.specs.items[i].meta.id);

                                    break;
                                }
                            }
                        },
                    });
                },
            });
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:loscp-pod)");
        });

        // template
        losCp.TplFetch("pod/set", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("spec/pod-list", {
            callback: ep.done("specs"),
        });

        losCpHost.ZoneRefresh(ep.done("zones"));

        losCp.ApiCmd("pod/entry?id="+ pod_id, {
            callback: ep.done("pod"),
        });
    });
}

losCpPod.SetCommit = function()
{
    var form = $("#loscp-podset");

    var req = {
        meta : {
            id : form.find("input[name=meta_id]").val(),
            name : form.find("input[name=meta_name]").val(),
        },
        status : {
            desiredPhase : form.find("input[name=status_desiredPhase]:checked").val(),
            placement : {
                zoneid : form.find("input[name=status_placement_zoneid]:checked").val(),
                cellid : form.find("input[name=status_placement_cellid]:checked").val(),
            }
        },
        spec : {
            meta : {
                id : form.find("select[name=spec_pod_id]").val(),
            }
        },
    };

    var alert_id = "#loscp-podset-alert";

    $(alert_id).hide();

    losCp.ApiCmd("pod/set", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Pod") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpPod.List();
            }, 500);
        }
    });
}
