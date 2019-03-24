var inCpPod = {
    statusls: [
        {
            phase: "Running",
            title: "Running"
        },
        {
            phase: "Stopped",
            title: "Stopped"
        },
    ],
    statussetls: [
        {
            phase: "Running",
            title: "Running"
        },
        {
            phase: "Stopped",
            title: "Stopped"
        },
        {
            phase: "Destroy",
            title: "Destroy"
        },
    ],
    def: {
        meta: {
            id: "",
            name: "",
        },
        operate: {
            action: 1 << 1,
        },
        spec: {
            meta: {
                id: "",
            },
            ref_plan: "",
            zone: "",
            cell: "",
        },
    },
    syszones: null,
    specs: null,
    plans: null,
    plan: null,
    planSelected: null,
    clusters: null,
    clusterSelected: null,
    itemNewOptions: {},
    itemActive: null,
    itemActivePast: 3600,
    itemStatusActive: null,
    itemOperateAccessDef: {
        ssh_on: false,
        ssh_key: "",
        ssh_pwd: "",
    },
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
    opSysStates: [{
        title: "Stateful",
        value: 1,
    }, {
        title: "Stateless",
        value: 2,
    }],
    opSysStateful: 1,
    opSysStateless: 2,
    OpRepMin: 1,
    OpRepMax: 32,
    VolSizeMax: 2 * 1024, // GB
}

inCpPod.Index = function() {
    inCpPod.List(null, {
        // destroy_enable: true,
    });
}

inCpPod.list_nav_menus = [{
    name: "Pod Instances",
    uri: "pod/instance",
    icon_fa: "cubes",
}];

inCpPod.list_options = {};

inCpPod.ListRefresh = function(options) {
    if (!options || !options.callback) {
        return;
    }

    var uri = "?";
    if (options.zone_id && options.zone_id.length > 1) {
        uri += "&zone_id=" + options.zone_id;
    } else {
        options.zone_id = null;
    }

    uri += "&fields=meta/id|name|user,operate/action|replicas,spec/ref/id|name,spec/zone|cell,apps/meta/name";
    if (options.fields) {
        for (var i in options.fields) {
            uri += "," + options.fields[i];
        }
    }

    if (options.destroy_enable) {
        uri += "&destroy_enable=1";
    }
    if (options.operate_action) {
        uri += "&operate_action=" + options.operate_action;
    }
    if (options.exp_filter_app_notin) {
        uri += "&exp_filter_app_notin=" + options.exp_filter_app_notin;
    }
    if (options.exp_filter_app_spec_id) {
        uri += "&exp_filter_app_spec_id=" + options.exp_filter_app_spec_id;
    }
    if (options.exp_filter_host_id) {
        uri += "&exp_filter_host_id=" + options.exp_filter_host_id;
    }

    if (options.exp_filter_meta_user_all) {
        uri += "&filter_meta_user=all";
    }

    inCp.ApiCmd("pod/list" + uri, {
        api_zone_id: options.zone_id,
        callback: function(err, data) {

            if (err) {
                return options.callback(err, null);
            }

            if (!data || !data.kind || data.kind != "PodList") {
                if (!data.error) {
                    data.error = {
                        "code": "ItemNotFound",
                        "message": "No Item Found Yet ...",
                    };
                }
                return options.callback(null, data);
            }

            if (!data.items) {
                data.items = [];
            }

            for (var i in data.items) {
                if (!data.items[i].apps) {
                    data.items[i].apps = [];
                }
                if (!data.items[i].operate.replicas) {
                    data.items[i].operate.replicas = [];
                }
                for (var j in data.items[i].operate.replicas) {
                    if (!data.items[i].operate.replicas[j].rep_id) {
                        data.items[i].operate.replicas[j].rep_id = 0;
                    }
                    if (!data.items[i].operate.replicas[j].ports) {
                        data.items[i].operate.replicas[j].ports = [];
                    }
                    for (var k in data.items[i].operate.replicas[j].ports) {
                        if (!data.items[i].operate.replicas[j].ports[k].host_port) {
                            data.items[i].operate.replicas[j].ports[k].host_port = 0;
                        }
                        if (!data.items[i].operate.replicas[j].ports[k].lan_addr) {
                            data.items[i].operate.replicas[j].ports[k].lan_addr = "127.0.0.1";
                        }
                        if (!data.items[i].operate.replicas[j].ports[k].wan_addr) {
                            data.items[i].operate.replicas[j].ports[k].wan_addr = data.items[i].operate.replicas[j].ports[k].lan_addr;
                        }
                    }
                }
                data.items[i].operate._action = inCp.OpActionTitle(data.items[i].operate.action);
            }

            data._actions = inCp.OpActions;
            data._options = options;

            options.callback(null, data);
        }
    });
}

inCpPod.List = function(tplid, options) {
    if (!tplid || tplid.indexOf("/") >= 0) {
        tplid = "incp-podls";
    }
    var alert_id = "#" + tplid + "-alert";
    var uri = "?";
    if (options) {
        inCpPod.list_options = options;
    } else {
        options = inCpPod.list_options;
    }

    if (!options.ops_mode) {
        inCp.ModuleNavbarMenu("cp/pod/list", inCpPod.list_nav_menus, "pod/instance");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (tpl) {
                $("#work-content").html(tpl);
            }

            inCp.OpToolActive = null;
            if (options.ops_mode) {
                inCp.OpToolsClean();
            } else {
                inCp.OpToolsRefresh("#" + tplid + "-optools");
            }

            if (data.error) {
                return l4i.InnerAlert(alert_id, 'error', data.error.message);
            }

            // $("#incp-podls-alert").hide();
            if (!data.items) {
                data.items = [];
            }
            if (data.items.length < 1) {
                return l4i.InnerAlert(alert_id, 'alert-info', "No Item Found Yet ...");
            }

            inCpPod.list = data.items;

            l4iTemplate.Render({
                dstid: tplid,
                tplid: tplid + "-tpl",
                data: data,
            });
        });

        ep.fail(function(err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        // template
        var el = document.getElementById(tplid);
        if (!el || el.length < 1) {
            inCp.TplFetch("pod/list", {
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

        options.callback = ep.done("data");
        options.fields = ["spec/box", "operate/replica_cap", "operate/status"];
        inCpPod.ListRefresh(options);
    });
}

/*
inCpPod.ListOpActionChange = function(pod_id, obj, tplid) {
    if (!pod_id) {
        return;
    }
    var op_action = parseInt($(obj).val());
    if (op_action < 1) {
        return;
    }

    if (!tplid) {
        tplid = "incp-podls";
    }
    var alert_id = "#" + tplid + "-alert";

    var uri = "?pod_id=" + pod_id + "&op_action=" + op_action;

    inCp.ApiCmd("pod/op-action-set" + uri, {
        method: "GET",
        timeout: 10000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'error', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "PodInstance") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'error', msg);
            }

            if (op_action == 2) {
                $(obj).addClass("button-success");
            } else {
                $(obj).removeClass("button-success");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successful updated");
        }
    });
}
*/


inCpPod.New = function(options) {
    if (options) {
        inCpPod.itemNewOptions = options;
    } else {
        options = inCpPod.itemNewOptions;
    }
    var alert_id = "#incp-podnew-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "plans", function(tpl, zones, plans) {

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }
            inCpPod.syszones = zones;

            if (!plans || !plans.kind || plans.kind != "PodSpecPlanList") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            var pod = l4i.Clone(inCpPod.def);
            for (var i in plans.items) {
                for (var j in plans.items[i].res_computes) {
                    plans.items[i].res_computes[j]._cpu_limit = (plans.items[i].res_computes[j].cpu_limit / 10).toFixed(1);
                    if (plans.items[i].res_computes[j].mem_limit >= 1024) {
                        plans.items[i].res_computes[j]._mem_limit = (plans.items[i].res_computes[j].mem_limit / 1024) + " GB";
                    } else {
                        plans.items[i].res_computes[j]._mem_limit = plans.items[i].res_computes[j].mem_limit + " MB";
                    }
                }
            }

            pod._plans = plans;
            pod._plan_selected = null;

            for (var i in pod._plans.items) {
                pod._plan_selected = pod._plans.items[i].meta.id;
                break;
            }

            if (!pod._plan_selected) {
                return l4i.InnerAlert(alert_id, 'error', "No SpecPodPlan Found");
            }

            inCpPod.plans = plans;
            inCpPod.planSelected = pod._plan_selected;
            // inCpPod.zones = zones;

            var fnfre = function() {
                l4iTemplate.Render({
                    dstid: "incp-podnew-plans",
                    tplid: "incp-podnew-plans-tpl",
                    data: {
                        items: inCpPod.plans.items,
                        _plan_selected: inCpPod.planSelected,
                    },
                });
                inCpPod.NewRefreshPlan();
            }
            inCpPod.itemNewOptions = options;
            if (options.open_modal) {

                l4iModal.Open({
                    id: "pod-new",
                    tplsrc: tpl,
                    title: "Create new Pod Instance",
                    width: "max",
                    height: "max",
                    callback: function() {
                        l4iTemplate.Render({
                            dstid: "incp-podnew-form",
                            tplid: "incp-podnew-modal",
                            data: {
                                items: inCpPod.plans.items,
                                _plan_selected: inCpPod.planSelected,
                                _options: options,
                            },
                            callback: fnfre,
                        });
                    },
                    buttons: [{
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    }, {
                        onclick: "inCpPod.NewCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    }],
                });

            } else {
                l4iTemplate.Render({
                    dstid: "work-content",
                    tplsrc: tpl,
                    callback: function() {
                        l4iTemplate.Render({
                            dstid: "incp-podnew-form",
                            tplid: "incp-podnew-inner",
                            data: {
                                items: inCpPod.plans.items,
                                _plan_selected: inCpPod.planSelected,
                                _options: options,
                            },
                            callback: fnfre,
                        });
                    },
                });
            }
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        // template
        inCp.TplFetch("pod/new", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("pod-spec/plan-list", {
            callback: ep.done("plans"),
        });

        inCp.ApiCmd("host/zone-list?fields=cells", {
            callback: ep.done("zones"),
        })
    });
}

inCpPod.NewOptionResFit = function(v) {
    if (inCpPod.itemNewOptions.app_cpu_min &&
        inCpPod.itemNewOptions.app_cpu_min > 0 &&
        v.cpu_limit < inCpPod.itemNewOptions.app_cpu_min) {
        return false;
    }

    if (inCpPod.itemNewOptions.app_mem_min &&
        inCpPod.itemNewOptions.app_mem_min > 0 &&
        v.mem_limit < inCpPod.itemNewOptions.app_mem_min) {
        return false;
    }

    return true;
}

inCpPod.NewPlanChange = function(plan_id) {
    if (inCpPod.planSelected == plan_id) {
        return;
    }

    inCpPod.planSelected = plan_id;
    inCpPod.NewRefreshPlan();

    $("#incp-podnew-plans").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-plan-id-" + plan_id).addClass("selected");
}


inCpPod.NewRefreshPlan = function() {
    var alert_id = "#incp-podnew-alert";

    var vol_min = 0,
        cpu_min = 0,
        mem_min = 0;
    if (inCpPod.itemNewOptions.app_vol_min &&
        inCpPod.itemNewOptions.app_vol_min > 0) {
        vol_min = inCpPod.itemNewOptions.app_vol_min;
    }
    if (inCpPod.itemNewOptions.app_cpu_min &&
        inCpPod.itemNewOptions.app_cpu_min > 0) {
        cpu_min = inCpPod.itemNewOptions.app_cpu_min;
    }
    if (inCpPod.itemNewOptions.app_mem_min &&
        inCpPod.itemNewOptions.app_mem_min > 0) {
        mem_min = inCpPod.itemNewOptions.app_mem_min;
    }

    for (var i in inCpPod.plans.items) {

        if (inCpPod.plans.items[i].meta.id != inCpPod.planSelected) {
            continue;
        }

        inCpPod.plan = inCpPod.plans.items[i];

        //
        for (var i in inCpPod.plan.res_volumes) {

            var vol = inCpPod.plan.res_volumes[i];

            if (vol_min > 0 && vol_min <= vol.limit) {
                if (vol.default < vol_min) {
                    vol.default = vol_min;
                }
            }
            vol._valued = vol.default;

            inCpPod.plan._res_volume = vol;

            break; // TODO
        }

        if (!inCpPod.plan._res_volume) {
            return l4i.InnerAlert(alert_id, 'error', "No SpecPodPlan/Volume Found");
        }

        //
        inCpPod.plan._zones = [];
        inCpPod.plan._zone_selected = null;

        for (var i in inCpPod.plan.zones) {

            for (var j in inCpPod.syszones.items) {

                if (inCpPod.plan.zones[i].name != inCpPod.syszones.items[j].meta.id) {
                    continue;
                }

                for (var k in inCpPod.plan.zones[i].cells) {

                    for (var m in inCpPod.syszones.items[j].cells) {

                        if (inCpPod.plan.zones[i].cells[k] != inCpPod.syszones.items[j].cells[m].meta.id) {
                            continue;
                        }

                        var name = inCpPod.plan.zones[i].name + "/" + inCpPod.plan.zones[i].cells[k];
                        var zone_title = inCpPod.plan.zones[i].name;
                        if (inCpPod.syszones.items[j].meta.name) {
                            zone_title = inCpPod.syszones.items[j].meta.name;
                        }
                        var cell_title = inCpPod.plan.zones[i].cells[k];
                        if (inCpPod.syszones.items[j].cells[m].meta.name) {
                            cell_title = inCpPod.syszones.items[j].cells[m].meta.name;
                        }

                        inCpPod.plan._zones.push({
                            id: l4iString.CryptoMd5(name),
                            name: name,
                            zone: inCpPod.plan.zones[i].name,
                            cell: inCpPod.plan.zones[i].cells[k],
                            zone_title: zone_title,
                            cell_title: cell_title,
                        });

                        if (!inCpPod.plan._zone_selected) {
                            inCpPod.plan._zone_selected = name;
                        }

                        break
                    }
                }

                break
            }
        }

        //
        if (!inCpPod.plan._zone_selected) {
            return l4i.InnerAlert(alert_id, 'error', "No SpecZone Found");
        }

        //
        if (!inCpPod.plan.image_selected) {
            inCpPod.plan.image_selected = inCpPod.plan.image_default;
        }

        //
        inCpPod.plan.res_compute_selected = null;
        if (cpu_min > 0 && mem_min > 0) {
            for (var i in inCpPod.plan.res_computes) {
                if (inCpPod.plan.res_computes[i].cpu_limit < cpu_min ||
                    inCpPod.plan.res_computes[i].mem_limit < mem_min) {
                    continue;
                }
                if (!inCpPod.plan.res_compute_selected) {
                    inCpPod.plan.res_compute_selected = inCpPod.plan.res_computes[i].ref_id;
                }
            }
        } else if (!inCpPod.plan.res_compute_selected) {
            inCpPod.plan.res_compute_selected = inCpPod.plan.res_compute_default;
        }

        $(".incp-podnew-resource-selector-row").remove();

        l4iTemplate.Render({
            dstid: "incp-podnew-plan-row",
            tplid: "incp-podnew-resource-selector-tpl",
            data: inCpPod.plan,
            afterAppend: true,
            callback: inCpPod.HookAccountChargeRefresh,
        });

        break;
    }
}


inCpPod.NewPlanClusterChange = function(zn) {
    if (inCpPod.plan._zone_selected == zn) {
        return;
    }

    $("#incp-podnew-zones").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-zone-id-" + l4iString.CryptoMd5(zn)).addClass("selected");

    inCpPod.plan._zone_selected = zn;
    inCpPod.HookAccountChargeRefresh();
}

inCpPod.NewPlanResComputeChange = function(res_compute_id) {
    if (!inCpPod.plan || inCpPod.plan.res_compute_selected == res_compute_id) {
        return;
    }

    for (var i in inCpPod.plan.res_computes) {
        if (inCpPod.plan.res_computes[i].ref_id != res_compute_id) {
            continue;
        }
        if (!inCpPod.NewOptionResFit(inCpPod.plan.res_computes[i])) {
            return l4i.InnerAlert("#incp-podnew-alert", "error", "this Resource Spec can not fit the Application Resource Requirements, please try another Spec or change the Pod Plan");
        }
        break;
    }


    $("#incp-podnew-res-computes").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-res-compute-id-" + res_compute_id).addClass("selected");

    inCpPod.plan.res_compute_selected = res_compute_id;
    inCpPod.HookAccountChargeRefresh();
}

inCpPod.NewPlanImageChange = function(image_id) {
    var image_id_enc = l4iString.CryptoMd5(image_id);
    if (!inCpPod.plan || inCpPod.plan.image_selected == image_id) {
        return;
    }

    $("#incp-podnew-images").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-image-id-" + image_id_enc).addClass("selected");

    inCpPod.plan.image_selected = image_id;
}

inCpPod.NewPlanVolChange = function(ref_id) {
    if (!inCpPod.plan || inCpPod.plan._res_volume.ref_id == ref_id) {
        return;
    }
    for (var i in inCpPod.plan.res_volumes) {
        if (inCpPod.plan.res_volumes[i].ref_id == ref_id) {
            inCpPod.plan._res_volume = inCpPod.plan.res_volumes[i];
            break;
        }
    }

    $("#incp-podnew-vols").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-vol-id-" + ref_id).addClass("selected");

    var v = parseInt($("#incp-podnew-resource-value").val());
    if (v < inCpPod.plan._res_volume.request) {
        v = inCpPod.plan._res_volume.request;
    } else if (v > inCpPod.plan._res_volume.limit) {
        v = inCpPod.plan._res_volume.limit;
    }

    $("#incp-podnew-resource-value").val(v);
    $("#incp-podnew-resource-hint").text(l4i.T("Range: %d ~ %d GB",
        inCpPod.plan._res_volume.request, inCpPod.plan._res_volume.limit));

    inCpPod.HookAccountChargeRefresh();
}

inCpPod.HookAccountChargeRefreshCache = 0.0;

inCpPod.HookAccountChargeRefresh = function() {
    var alert_id = "#incp-podnew-alert",
        vol_size = parseInt($("#incp-podnew-resource-value").val());

    // GB
    if (vol_size < 1) {
        vol_size = 1;
    } else if (vol_size > inCpPod.VolSizeMax) {
        vol_size = inCpPod.VolSizeMax;
    }

    var set = {
        kind: "SpecPodPlanSetup",
        name: "pod-estimate",
        plan: inCpPod.planSelected,
        zone: inCpPod.plan._zone_selected.split("/")[0],
        cell: inCpPod.plan._zone_selected.split("/")[1],
        res_volume: inCpPod.plan._res_volume.ref_id,
        res_volume_size: parseInt(vol_size),
        box: {
            name: "main",
            image: inCpPod.plan.image_selected,
            res_compute: inCpPod.plan.res_compute_selected,
        },
    };


    inCp.ApiCmd("charge/pod-estimate?fields=pod&cycles=3600", {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, data) {
            if (err || !data || data.error || data.kind != "PodEstimate") {
                return;
            }
            var cas = [];
            for (var i in data.items) {
                if (data.items[i].cycle_time == 3600) {
                    cas.push(l4i.T("%0.2f / Hour", data.items[i].cycle_amount));
                    inCpPod.HookAccountChargeRefreshCache = data.items[i].cycle_amount;
                } else if (data.items[i].cycle_time == 86400) {
                    cas.push(l4i.T("%0.2f / Day", data.items[i].cycle_amount));
                }
            }
            if (cas.length > 0) {
                var el = document.getElementById("incp-podnew-charge-estimate-value");
                if (el) {
                    el.innerHTML = cas.join(" or ");
                }
            }
        }
    });
}

inCpPod.NewCommit = function() {
    var alert_id = "#incp-podnew-alert",
        url = "",
        vol_size = parseInt($("#incp-podnew-resource-value").val());
    if (vol_size <= 1) {
        vol_size = 1;
    }

    if (!inCpPod.plan.res_compute_selected) {
        return l4i.InnerAlert(alert_id, "error", "Resource Option Not Set");
    }

    if (inCpPod.itemNewOptions.app_vol_min &&
        inCpPod.itemNewOptions.app_vol_min > 0) {
        if (vol_size < inCpPod.itemNewOptions.app_vol_min) {
            return l4i.InnerAlert(alert_id, "error", "this System Storage requires at least " + inCpPod.itemNewOptions.app_vol_min + " GB of space to fit the Application Resource Requirements");
        }
    }

    if (inCpPod.itemNewOptions.app_spec_id) {
        url = "?exp_filter_app_spec_id=" + inCpPod.itemNewOptions.app_spec_id;
    }

    var set = {
        name: $("#incp-podnew-meta-name").val(),
        plan: inCpPod.planSelected,
        zone: inCpPod.plan._zone_selected.split("/")[0],
        cell: inCpPod.plan._zone_selected.split("/")[1],
        res_volume: inCpPod.plan._res_volume.ref_id,
        res_volume_size: vol_size,
        box: {
            name: "main",
            image: inCpPod.plan.image_selected,
            res_compute: inCpPod.plan.res_compute_selected,
        },
    };

    if (!set.name || set.name == "") {
        return l4i.InnerAlert(alert_id, 'error', "Name Not Found");
    }

    $(alert_id).hide();

    inCp.ApiCmd("pod/new" + url, {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {
            if (inCpPod.itemNewOptions.open_modal) {
                l4iModal.ScrollTop();
            }
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");
            window.setTimeout(function() {
                if (inCpPod.itemNewOptions.app_new_callback) {
                    inCpPod.itemNewOptions.app_new_callback(null, rsj.pod);
                } else {
                    l4iModal.Close();
                    if (inCpPod.itemNewOptions.callback) {
                        inCpPod.itemNewOptions.callback(null);
                    } else if (!inCpPod.itemNewOptions.open_modal) {
                        if (rsj.pod && rsj.pod.length > 8) {
                            inCpPod.EntryIndex(rsj.pod);
                        } else {
                            inCpPod.List(null, null);
                        }
                    }
                }
            }, 1000);
        }
    });
}

inCpPod.Info = function(pod_id, options) {
    options = options || {};
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            if (!pod.operate.replicas) {
                pod.operate.replicas = [];
            }
            for (var i in pod.operate.replicas) {
                if (!pod.operate.replicas[i].ports) {
                    pod.operate.replicas[i].ports = [];
                }
                if (!pod.operate.replicas[i].rep_id) {
                    pod.operate.replicas[i].rep_id = 0;
                }
                for (var j in pod.operate.replicas[i].ports) {
                    if (!pod.operate.replicas[i].ports[j].host_port) {
                        pod.operate.replicas[i].ports[j].host_port = 0;
                    }
                    if (!pod.operate.replicas[i].ports[j].lan_addr) {
                        pod.operate.replicas[i].ports[j].lan_addr = "127.0.0.1";
                    }
                    if (!pod.operate.replicas[i].ports[j].wan_addr) {
                        pod.operate.replicas[i].ports[j].wan_addr = pod.operate.replicas[i].ports[j].lan_addr;
                    }
                }
            }
            pod.spec._box_image_driver = pod.spec.box.image.driver;
            pod.spec._cpu_limit = pod.spec.box.resources.cpu_limit;
            pod.spec._mem_limit = pod.spec.box.resources.mem_limit;

            var btns = [{
                onclick: "l4iModal.Close()",
                title: "Close",
            }];
            if (options.buttons) {
                for (var i in options.buttons) {
                    btns.push(options.buttons[i]);
                }
            }

            l4iModal.Open({
                id: "incp-pod-item-info",
                title: "Pod Instance Information",
                tplsrc: tpl,
                width: 1200,
                height: 800,
                data: pod,
                buttons: btns,
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + pod_id, {
            callback: ep.done("pod"),
        });

        inCp.TplFetch("pod/info", {
            callback: ep.done("tpl"),
        });
    });
}



inCpPod.SetInfo = function(pod_id) {
    if (!pod_id && inCpPod.itemActiveId) {
        pod_id = inCpPod.itemActiveId;
    }
    if (!pod_id) {
        return alert("No Pod Found");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            var actions = [];
            for (var i in inCp.OpActions) {
                actions.push({
                    action: inCp.OpActions[i].action,
                    title: inCp.OpActions[i].title,
                    active: inCp.OpActionAllow(pod.operate.action, inCp.OpActions[i].action),
                });
            }

            pod.spec._cpu_limit = 0;
            pod.spec._mem_limit = 0;
            pod.spec._cpu_limit += pod.spec.box.resources.cpu_limit;
            pod.spec._mem_limit += pod.spec.box.resources.mem_limit;


            if (!pod.operate.exp_sys_state) {
                pod.operate.exp_sys_state = inCpPod.opSysStateful;
            }

            var rep_min = inCpPod.OpRepMin,
                rep_max = inCpPod.OpRepMax;
            for (var i in pod.apps) {
                if (rep_min < pod.apps[i].spec.exp_deploy.rep_min) {
                    rep_min = pod.apps[i].spec.exp_deploy.rep_min;
                }
                if (rep_max > pod.apps[i].spec.exp_deploy.rep_max) {
                    rep_max = pod.apps[i].spec.exp_deploy.rep_max;
                }
            }

            pod.spec._cpu_limit = (pod.spec.box.resources.cpu_limit / 10).toFixed(1);

            var spec_summary = "ID: " + pod.spec.ref.id;
            spec_summary += ", CPU: " + pod.spec._cpu_limit;
            spec_summary += ", RAM: " + pod.spec._mem_limit + " MB";
            spec_summary += ", Storage: " + pod.spec.vol_sys.size + " GB";


            l4iModal.Open({
                title: "Pod Instance Setup",
                tplsrc: tpl,
                width: 900,
                height: 450,
                data: {
                    pod: pod,
                    _op_actions: actions,
                    _op_sys_states: l4i.Clone(inCpPod.opSysStates),
                    _spec_summary: spec_summary,
                    _op_rep_min: rep_min,
                    _op_rep_max: rep_max,
                },
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpPod.SetInfoCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + pod_id, {
            callback: ep.done("pod"),
        });

        inCp.TplFetch("pod/set-info", {
            callback: ep.done("tpl"),
        });
    });
}


inCpPod.SetInfoCommit = function() {
    var alert_id = "#incp-podsetinfo-alert";
    var form = $("#incp-podsetinfo");

    var set = {
        meta: {
            id: form.find("input[name=meta_id]").val(),
            name: form.find("input[name=meta_name]").val(),
        },
        operate: {
            action: parseInt(form.find("input[name=operate_action]:checked").val()),
            exp_sys_state: parseInt(form.find("select[name=operate_exp_sys_state]").val()),
            replica_cap: parseInt(form.find("input[name=operate_replica_cap]").val()),
        },
    };
    var pod_id = set.meta.id;

    if (inCp.OpActionAllow(set.operate.action, inCp.OpActionDestroy)) {
        return l4iModal.Close(function() {
            inCpPod.EntryDel(pod_id);
        });
    }

    $(alert_id).hide();

    inCp.ApiCmd("pod/set-info", {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4iModal.FootAlert('ok', "Successfully Updated");

            if (set.operate.replica_cap > 0 &&
                inCpPod.itemActive && inCpPod.itemActive.operate) {
                inCpPod.itemActive.operate.replica_cap = set.operate.replica_cap;
            }

            window.setTimeout(function() {
                l4iModal.Close();
                var el = document.getElementById("incp-podls");
                if (el) {
                    inCpPod.List(null, null);
                }
            }, 2000);
        }
    });
}


inCpPod.EntryDel = function(pod_id) {
    if (!pod_id && inCpPod.itemActiveId) {
        pod_id = inCpPod.itemActiveId;
    }
    if (!pod_id) {
        return alert("No Pod Found");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            if (!pod.apps) {
                pod.apps = [];
            }

            l4iModal.Open({
                title: "Pod Destroy",
                tplsrc: tpl,
                width: 800,
                height: 300,
                data: pod,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpPod.EntryDelCommit()",
                    title: "Confirm to Destroy",
                    style: "btn btn-danger",
                }],
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + pod_id, {
            callback: ep.done("pod"),
        });

        inCp.TplFetch("pod/entry-del", {
            callback: ep.done("tpl"),
        });
    });
}

inCpPod.EntryDelCommit = function() {
    var alert_id = "#incp-podentry-del-alert";
    var form = $("#incp-podentry-del");
    var pod_id = form.find("input[name=meta_id]").val()

    inCp.ApiCmd("pod/delete?pod_id=" + pod_id, {
        method: "GET",
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                var el = document.getElementById("incp-podls");
                if (el) {
                    inCpPod.List(null, null);
                }
            }, 500);
        }
    });
}

inCpPod.Set = function(pod_id) {
    var alert_id = "#incp-podset-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "specs", "pod", function(tpl, zones, specs, pod) {

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (!specs || !specs.kind || specs.kind != "PodSpecList") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (!pod.kind || pod.kind != "Pod") {
                return l4i.InnerAlert(alert_id, 'error', "Pod Not Found");
            }

            pod._zones = zones;
            pod._specs = specs;
            pod._statusls = inCpPod.statussetls;

            inCpPod.specs = specs;

            l4iModal.Open({
                title: "Pod Instance Setting",
                tplsrc: tpl,
                width: 900,
                height: 600,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpPod.SetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
                success: function() {

                    l4iTemplate.Render({
                        dstid: "incp-podset",
                        tplid: "incp-podset-tpl",
                        data: pod,
                        success: function() {

                            if (pod.spec.meta.id != "") {

                                inCpPod.SetSpecRefresh(pod.spec.meta.id);

                            } else {

                                for (var i in inCpPod.specs.items) {

                                    inCpPod.SetSpecRefresh(inCpPod.specs.items[i].meta.id);

                                    break;
                                }
                            }
                        },
                    });
                },
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        // template
        inCp.TplFetch("pod/set", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("spec/pod-list", {
            callback: ep.done("specs"),
        });

        inCpHost.ZoneRefresh(ep.done("zones"));

        inCp.ApiCmd("pod/entry?id=" + pod_id, {
            callback: ep.done("pod"),
        });
    });
}

inCpPod.SetCommit = function() {
    var form = $("#incp-podset");

    var req = {
        meta: {
            id: form.find("input[name=meta_id]").val(),
            name: form.find("input[name=meta_name]").val(),
        },
        status: {
            desiredPhase: form.find("input[name=status_desiredPhase]:checked").val(),
            placement: {
                zoneid: form.find("input[name=status_placement_zoneid]:checked").val(),
                cellid: form.find("input[name=status_placement_cellid]:checked").val(),
            }
        },
        spec: {
            meta: {
                id: form.find("select[name=spec_pod_id]").val(),
            }
        },
    };

    var alert_id = "#incp-podset-alert";

    $(alert_id).hide();

    inCp.ApiCmd("pod/set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Pod") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpPod.List(null, null);
            }, 500);
        }
    });
}

inCpPod.entry_nav_menus = [{
    name: "Back",
    onclick: "inCpPod.EntryBack()",
    uri: "",
    style: "primary",
    icon_fa: "chevron-circle-left",
}, {
    name: "Overview",
    uri: "pod/entry/overview",
    icon_fa: "tachometer-alt",
}, {
    name: "Graphs",
    uri: "pod/entry/stats",
    icon_fa: "chart-line",
}, {
    name: "Remote Access",
    uri: "pod/entry/setup",
    onclick: "inCpPod.EntryAccess()",
    icon_fa: "key",
/**
}, {
    name: "Settings",
    uri: "pod/entry/setup",
    onclick: "inCpPod.SetInfo()",
*/
}];

inCpPod.EntryBack = function() {
    if (inCpPod.list_options.entry_back) {
        inCpPod.list_options.entry_back();
    } else {
        inCpPod.List();
    }
}

inCpPod.EntryIndex = function(pod_id, nav_target) {

    if (pod_id) {
        inCpPod.itemActiveId = pod_id;
    }
    l4i.UrlEventActive("pod/index");

    inCp.ModuleNavbarMenu("cp/pod/entry", inCpPod.entry_nav_menus);

    l4i.UrlEventClean("incp-module-navbar-menus");
    l4i.UrlEventRegister("pod/entry/overview", inCpPod.EntryOverview, "incp-module-navbar-menus");
    l4i.UrlEventRegister("pod/entry/stats", inCpPod.EntryStats, "incp-module-navbar-menus");

    switch (nav_target) {
        case "stats":
            l4i.UrlEventHandler("pod/entry/stats", false);
            break;

        default:
            l4i.UrlEventHandler("pod/entry/overview", false);
            break;
    }
}

inCpPod.EntryOverview = function() {

    var pod_zone_id = null;
    for (var i in inCpPod.list) {
        if (inCpPod.list[i].meta.id == inCpPod.itemActiveId) {
            pod_zone_id = inCpPod.list[i].spec.zone;
            break;
        }
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            if (!pod.operate.replicas) {
                pod.operate.replicas = [];
            }
            for (var i in pod.operate.replicas) {
                if (!pod.operate.replicas[i].ports) {
                    pod.operate.replicas[i].ports = [];
                }
                if (!pod.operate.replicas[i].rep_id) {
                    pod.operate.replicas[i].rep_id = 0;
                }
                for (var j in pod.operate.replicas[i].ports) {
                    if (!pod.operate.replicas[i].ports[j].host_port) {
                        pod.operate.replicas[i].ports[j].host_port = 0;
                    }
                    if (!pod.operate.replicas[i].ports[j].lan_addr) {
                        pod.operate.replicas[i].ports[j].lan_addr = "127.0.0.1";
                    }
                    if (!pod.operate.replicas[i].ports[j].wan_addr) {
                        pod.operate.replicas[i].ports[j].wan_addr = pod.operate.replicas[i].ports[j].lan_addr;
                    }
                }
            }
            pod.spec._box_image_driver = pod.spec.box.image.driver;
            pod.spec._cpu_limit = pod.spec.box.resources.cpu_limit;
            pod.spec._mem_limit = pod.spec.box.resources.mem_limit;

            if (pod.payment && pod.payment.cycle_amount && pod.operate.replica_cap) {
                pod.payment._cycle_amount = l4i.T("%.2f / Hour", pod.payment.cycle_amount * pod.operate.replica_cap);
            } else if (inCpPod.HookAccountChargeRefreshCache > 0) {
                if (!pod.payment) {
                    pod.payment = {};
                }
                pod.payment._cycle_amount = l4i.T("%.2f / Hour", inCpPod.HookAccountChargeRefreshCache * pod.operate.replica_cap);
            }

            for (var i in inCpPod.opSysStates) {
                if (inCpPod.opSysStates[i].value == pod.operate.exp_sys_state) {
                    pod.operate._exp_sys_state_title = l4i.T(inCpPod.opSysStates[i].title);
                    break;
                }
            }
            if (!pod.operate._exp_sys_state_title) {
                pod.operate._exp_sys_state_title = l4i.T("Stateful");
            }

            inCp.OpToolsClean();
            $("#work-content").html(tpl);

            inCpPod.itemActive = pod;

            l4iTemplate.Render({
                dstid: "incp-podentry-overview",
                tplid: "incp-podentry-overview-info-tpl",
                data: pod,
            });

            setTimeout(inCpPod.entryAutoRefresh, 500);
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + inCpPod.itemActiveId, {
            api_zone_id: pod_zone_id,
            callback: ep.done("pod"),
        });

        /**
        inCp.ApiCmd("pod/status?id=" + inCpPod.itemActiveId, {
            api_zone_id: pod_zone_id,
            callback: ep.done("podStatus"),
        });
        */

        inCp.TplFetch("pod/entry-overview", {
            callback: ep.done("tpl"),
        });
    });
}

inCpPod.EntryRepOpLogActive = function(rep_id) {
    inCpPod.itemActive._rep_oplog_active_id = rep_id;
    $("#incp-podentry-rep-oplog-nav").find("a.active").removeClass("active");
    $("#incp-podentry-rep-oplog-nav-item-" + rep_id).addClass("active");
    // $(this).addClass("active");
    if (inCpPod.itemStatusActive) {
        inCpPod.itemStatusActive._rep_oplog_active_id = rep_id;
        l4iTemplate.Render({
            dstid: "incp-podentry-sidebar",
            tplid: "incp-podentry-overview-oplog-tpl",
            data: inCpPod.itemStatusActive,
        });
    }
}

inCpPod.entryAutoRefresh = function() {
    var el = document.getElementById("incp-podentry-status-value");
    if (!el || !inCpPod.itemActiveId) {
        return;
    }
    inCp.ApiCmd("pod/status?id=" + inCpPod.itemActiveId, {
        api_zone_id: inCpPod.itemActive.spec.zone,
        callback: function(err, data) {

            if (err || !data || data.error || !data.kind) {
                setTimeout(inCpPod.entryAutoRefresh, 5000);
                return;
            }

            if (!data.action_running) {
                data.action_running = 0;
            }
            el.innerHTML = data.action_running + ' / ' + inCpPod.itemActive.operate.replica_cap;

            if (!data.replicas) {
                data.replicas = [];
            }
            if (data.replicas.length > inCpPod.itemActive.operate.replicas.length) {
                inCpPod.itemActive.operate.replicas = [];
                for (var i in data.replicas) {
                    inCpPod.itemActive.operate.replicas.push({
                        rep_id: i,
                        node: data.replicas[i].node,
                        action: data.replicas[i].action,
                        box: {},
                    });
                }
                l4iTemplate.Render({
                    dstid: "incp-podentry-overview",
                    tplid: "incp-podentry-overview-info-tpl",
                    data: inCpPod.itemActive,
                });
            }

            if (data.replicas.length != inCpPod.itemActive.operate.replicas.length) {
                return setTimeout(inCpPod.EntryOverview, 3000);
            }

            for (var i in data.replicas) {

                if (!data.replicas[i].rep_id) {
                    data.replicas[i].rep_id = 0;
                }
                //
                var item = inCp.OpActionStatusItem(data.replicas[i].action);
                if (item) {
                    var elrep = document.getElementById("incp-podentry-box-action-status-value-" + i);
                    if (elrep) {
                        elrep.innerHTML = '<span class="badge badge-' + item.style + '">' + l4i.T(item.title) + '</span>';
                    }
                }

                if (inCp.syscfg.zone_master.multi_replica_enable) {
                    if (data.replicas[i].node && data.replicas[i].node.length > 10) {
                        var elrep = document.getElementById("incp-podentry-rep-host-value-" + i);
                        if (elrep) {
                            elrep.innerHTML = data.replicas[i].node;
                        }
                    }
                }

                if (!inCp.OpActionAllow(data.replicas[i].action, inCp.OpActionRunning)) {
                    var elrep = document.getElementById("incp-podentry-box-uptime-value-" + i);
                    if (elrep) {
                        elrep.innerHTML = "00:00:00"
                    }

                } else if (data.replicas[i].updated &&
                    data.replicas[i].started) {

                    if (!inCpPod.itemActive.operate.replicas[i].ports) {
                        inCpPod.itemActive.operate.replicas[i].ports = [];
                    }

                    if (data.replicas[i].ports &&
                        data.replicas[i].ports.length != inCpPod.itemActive.operate.replicas[i].ports.length) {
                        return setTimeout(inCpPod.EntryOverview, 3000);
                    }

                    var elrep = document.getElementById("incp-podentry-box-uptime-value-" + i);
                    if (elrep) {
                        var sec = data.replicas[i].updated - data.replicas[i].started;
                        if (sec > 0) {
                            elrep.innerHTML = inCp.TimeUptime(sec);
                        }
                    }
                }

                for (var k in data.replicas[i].volumes) {
                    if (data.replicas[i].volumes[k].mount_path == "/home/action") {
                        if (!data.replicas[i].volumes[k].used) {
                            data.replicas[i].volumes[k].used = 0;
                        }
                        data.replicas[i]._volume_system_used = inCp.UtilResSizeFormat(data.replicas[i].volumes[k].used);
                        //
                        var elrep = document.getElementById("incp-podentry-box-volume-status-value-" + i);
                        if (elrep) {
                            elrep.innerHTML = data.replicas[i]._volume_system_used;
                        }
                    }
                }
            }

            if (!inCpPod.itemActive._rep_oplog_active_id) {
                inCpPod.itemActive._rep_oplog_active_id = 0;
            }
            data._rep_oplog_active_id = inCpPod.itemActive._rep_oplog_active_id;

            inCpPod.itemStatusActive = l4i.Clone(data);

            l4iTemplate.Render({
                dstid: "incp-podentry-sidebar",
                tplid: "incp-podentry-overview-oplog-tpl",
                data: inCpPod.itemStatusActive,
            });

            setTimeout(inCpPod.entryAutoRefresh, 5000);
        },
    });
}


inCpPod.EntryStatsButton = function(obj) {
    $("#incp-module-navbar-optools").find(".hover").removeClass("hover");
    obj.setAttribute("class", 'hover');
    inCpPod.EntryStats(parseInt(obj.getAttribute('value')));
}


inCpPod.entryStatsFeedMaxValue = function(feed, names) {
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

inCpPod.EntryStats = function(time_past, rep_id) {

    if (time_past) {
        inCpPod.itemActivePast = parseInt(time_past);
        if (!inCpPod.itemActivePast) {
            inCpPod.itemActivePast = 3600;
        }
    }
    if (inCpPod.itemActivePast < 600) {
        inCpPod.itemActivePast = 600;
    }
    if (inCpPod.itemActivePast > (30 * 86400)) {
        inCpPod.itemActivePast = 30 * 86400;
    }
    if (rep_id == undefined) {
        rep_id = -1;
    }
    var pod_zone_id = null;
    if (inCpPod.itemActive && inCpPod.itemActive.spec.zone) {
        pod_zone_id = inCpPod.itemActive.spec.zone;
    } else {
        for (var i in inCpPod.list) {
            if (inCpPod.list[i].meta.id == inCpPod.itemActiveId) {
                pod_zone_id = inCpPod.list[i].spec.zone;
                break;
            }
        }
    }

    var stats_url = "id=" + inCpPod.itemActiveId;
    stats_url += "&rep_id=" + rep_id;
    var stats_query = {
        tc: 180,
        tp: inCpPod.itemActivePast,
        is: [
            {
                n: "cpu/us",
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
                n: "fs/rs",
                d: true
            },
            {
                n: "fs/rn",
                d: true
            },
            {
                n: "fs/ws",
                d: true
            },
            {
                n: "fs/wn",
                d: true
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
        inCpPod.hchart_def.options.height = "150px";
    } else {
        inCpPod.hchart_def.options.height = "190px";
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

        var ep = EventProxy.create("tpl", "pod", "stats", function(tpl, pod, stats) {

            if (tpl) {
                $("#work-content").html(tpl);
                $(".incp-podentry-stats-item").css({
                    "flex-basis": ww + "px"
                });
                inCp.OpToolsRefresh("#incp-podentry-optools-stats");
            }

            var max = 0;
            var tc_title = stats.cycle + " seconds";
            var tc_ns = stats.cycle * 1000000000;
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
            var stats_cpu = l4i.Clone(inCpPod.hchart_def);
            stats_cpu.options.title = l4i.T("CPU Usage (Percentage / %s)", tc_title);
            /**
                max = inCpPod.entryStatsFeedMaxValue(stats, "cpu/us");
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
            var stats_ram = l4i.Clone(inCpPod.hchart_def);
            stats_ram.options.title = l4i.T("Memory Usage (MB)");
            stats_ram._fix = 1024 * 1024;

            //
            var stats_net = l4i.Clone(inCpPod.hchart_def);
            max = inCpPod.entryStatsFeedMaxValue(stats, "net/rs,net/ws");
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
            var stats_fsn = l4i.Clone(inCpPod.hchart_def);
            stats_fsn.options.title = l4i.T("Storage IO (Number / %s)", tc_title);

            //
            var stats_fss = l4i.Clone(inCpPod.hchart_def);
            max = inCpPod.entryStatsFeedMaxValue(stats, "fs/rs,fs/ws");
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
                    case "cpu/us":
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

                    case "fs/rs":
                    case "fs/ws":
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
                    case "cpu/us":
                        stats_cpu.data.labels = labels;
                        dataset.label = "Usage";
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

                    case "fs/rs":
                        stats_fss.data.labels = labels;
                        dataset.label = "Read";
                        stats_fss.data.datasets.push(dataset);
                        break

                    case "fs/ws":
                        stats_fss.data.labels = labels;
                        dataset.label = "Write";
                        stats_fss.data.datasets.push(dataset);
                        break

                    case "fs/rn":
                        stats_fsn.data.labels = labels;
                        dataset.label = "Read";
                        stats_fsn.data.datasets.push(dataset);
                        break

                    case "fs/wn":
                        stats_fsn.data.labels = labels;
                        dataset.label = "Write";
                        stats_fsn.data.datasets.push(dataset);
                        break
                }
            }

            var statses = [{
                data: stats_cpu,
                target: "cpu",
            }, {
                data: stats_ram,
                target: "ram",
            }, {
                data: stats_net,
                target: "net",
            }, {
                data: stats_fss,
                target: "fss",
            }, {
                data: stats_fsn,
                target: "fsn",
            }];


            l4iTemplate.Render({
                dstid: "incp-podentry-stats-list",
                tplid: "incp-podentry-stats-item-tpl",
                data: {
                    items: statses,
                    pod: inCpPod.itemActive,
                    _pod_rep_id: rep_id,
                },
                callback: function() {

                    for (var i in statses) {
                        statses[i].data.options.title = "";
                        hooto_chart.RenderElement(statses[i].data, "incp-podentry-stats-" + statses[i].target);
                    }
                },
            });

        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + inCpPod.itemActiveId, {
            callback: ep.done("pod"),
        });

        inCp.ApiCmd("pod-stats/feed?" + stats_url, {
            api_zone_id: pod_zone_id,
            callback: ep.done("stats"),
        });

        inCp.TplFetch("pod/entry-stats", {
            callback: ep.done("tpl"),
        });
    });
}

inCpPod.EntryAccess = function(pod_id) {
    if (!pod_id && inCpPod.itemActiveId) {
        pod_id = inCpPod.itemActiveId;
    }
    if (!pod_id) {
        return alert("No Pod Found");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            var actions = [];
            if (!pod.operate.access) {
                pod.operate.access = l4i.Clone(inCpPod.itemOperateAccessDef);
            }
            if (!pod.operate.access.ssh_key) {
                pod.operate.access.ssh_key = "";
            }
            if (!pod.operate.access.ssh_pwd) {
                pod.operate.access.ssh_pwd = "";
            } else if (pod.operate.access.ssh_pwd.length > 0) {
                pod.operate.access.ssh_pwd = "********";
            }
            l4iModal.Open({
                title: "Remote Access",
                tplsrc: tpl,
                width: 900,
                height: 500,
                data: pod,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpPod.EntryAccessSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
                callback: function() {
                    inCpPod.EntryAccessSshRefresh();
                },
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + pod_id, {
            callback: ep.done("pod"),
        });

        inCp.TplFetch("pod/entry-access", {
            callback: ep.done("tpl"),
        });
    });
}

inCpPod.EntryAccessSshRefresh = function() {

    var form = $("#incp-podentry-access");
    if (!form) {
        return;
    }

    var ssh_on = parseInt(form.find("input[name=operate_access_ssh_on]:checked").val());
    if (ssh_on == 1) {
        $("#operate_access_ssh_enable").css({
            "display": "table-row"
        });
    } else {
        $("#operate_access_ssh_enable").css({
            "display": "none"
        });
    }
}

inCpPod.EntryAccessSetCommit = function() {
    var alert_id = "#incp-podentry-access-alert";
    var form = $("#incp-podentry-access");

    var ssh_on = form.find("input[name=operate_access_ssh_on]:checked").val();
    if (ssh_on == "1") {
        ssh_on = true;
    } else {
        ssh_on = false;
    }
    var set = {
        meta: {
            id: form.find("input[name=meta_id]").val(),
        },
        operate: {
            access: {
                ssh_on: ssh_on,
                ssh_key: form.find("textarea[name=operate_access_ssh_key]").val(),
                ssh_pwd: form.find("input[name=operate_access_ssh_pwd]").val(),
            },
        },
    };

    $(alert_id).hide();

    inCp.ApiCmd("pod/access-set", {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                var el = document.getElementById("incp-podls");
                if (el) {
                    inCpPod.List(null, {
                        destroy_enable: true
                    });
                }
            }, 500);
        }
    });
}

inCpPod.specSetActive = null;
inCpPod.SpecSet = function(pod_id) {

    if (!pod_id && inCpPod.itemActiveId) {
        pod_id = inCpPod.itemActiveId;
    }

    if (!pod_id) {
        return;
    }

    var alert_id = "#incp-podnew-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", "zones", "plans", function(tpl, pod, zones, plans) {

            if (!pod || !pod.kind || pod.kind != "Pod" || !pod.spec.box) {
                return l4iAlert.Open("error", "No Pod Found");
            }

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }
            inCpPod.syszones = zones;

            if (!plans || !plans.kind || plans.kind != "PodSpecPlanList") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (!pod.spec.vol_sys) {
                return l4iAlert.Open("error", "Invalid Pod Spec");
            }


            var spec_res_id = pod.spec.box.resources.ref.id,
                spec_vol_id = pod.spec.vol_sys.ref_id,
                spec_vol_size = pod.spec.vol_sys.size,
                spec_image_id = pod.spec.box.image.ref.id;

            var _plans = [];
            for (var i in plans.items) {

                for (var j in plans.items[i].zones) {
                    if (pod.spec.ref.id == plans.items[i].meta.id) {
                        plans.items[i].res_compute_default = spec_res_id;
                        plans.items[i].image_default = spec_image_id;
                        plans.items[i].res_volume_default = spec_vol_id;
                        for (var k in plans.items[i].res_volumes) {
                            if (plans.items[i].res_volumes[k].ref_id == spec_vol_id) {
                                plans.items[i].res_volumes[k].default = spec_vol_size;
                                break;
                            }
                        }
                    }
                    if (pod.spec.zone == plans.items[i].zones[j].name &&
                        plans.items[i].zones[j].cells &&
                        plans.items[i].zones[j].cells.indexOf(pod.spec.cell) > -1) {
                        plans.items[i].zones = [{
                            name: pod.spec.zone,
                            cells: [pod.spec.cell],
                        }];
                        _plans.push(plans.items[i]);
                        break;
                    }
                }
            }
            if (_plans.length < 1) {
                return l4iAlert.Open("error", "no available spec found");
            }
            plans.items = _plans;

            pod._plans = plans;
            pod._plan_selected = pod.spec.ref.id;

            pod._image_selected = spec_image_id;


            inCpPod.specSetActive = pod;

            inCpPod.plans = plans;
            inCpPod.planSelected = pod._plan_selected;

            var fnfre = function() {
                l4iTemplate.Render({
                    dstid: "incp-podnew-plans",
                    tplid: "incp-podnew-plans-tpl",
                    data: {
                        items: inCpPod.plans.items,
                        _plan_selected: inCpPod.planSelected,
                    },
                });
                inCpPod.NewRefreshPlan();
            }

            l4iModal.Open({
                id: "podset-planset",
                tplsrc: tpl,
                title: "Setting Pod Spec",
                width: 1200,
                min_width: 900,
                height: 900,
                callback: function() {
                    l4iTemplate.Render({
                        dstid: "incp-podnew-form",
                        tplid: "incp-podnew-modal",
                        data: {
                            items: inCpPod.plans.items,
                            _plan_selected: inCpPod.planSelected,
                        },
                        callback: fnfre,
                    });
                },
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpPod.SpecSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        // template
        inCp.TplFetch("pod/plan-set", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("pod/entry?id=" + pod_id, {
            callback: ep.done("pod"),
        });

        inCp.ApiCmd("pod-spec/plan-list", {
            callback: ep.done("plans"),
        });

        inCp.ApiCmd("host/zone-list?fields=cells", {
            callback: ep.done("zones"),
        })
    });
}

inCpPod.SpecSetCommit = function() {
    var alert_id = "#incp-podnew-alert",
        url = "",
        vol_size = parseInt($("#incp-podnew-resource-value").val());
    if (vol_size <= 0) {
        return l4i.InnerAlert(alert_id, "error", "System Storage Not Set");
    }

    if (!inCpPod.plan.res_compute_selected) {
        return l4i.InnerAlert(alert_id, "error", "Resource Option Not Set");
    }

    if (vol_size < 1) {
        vol_size = 1;
    } else if (vol_size > inCpPod.VolSizeMax) {
        vol_size = inCpPod.VolSizeMax;
    }

    var set = {
        pod: inCpPod.specSetActive.meta.id,
        name: inCpPod.specSetActive.meta.id,
        plan: inCpPod.planSelected,
        zone: inCpPod.specSetActive.spec.zone,
        cell: inCpPod.specSetActive.spec.cell,
        res_volume: inCpPod.plan._res_volume.ref_id,
        res_volume_size: vol_size,
        box: {
            name: "main",
            // image: inCpPod.plan.image_selected,
            image: inCpPod.specSetActive._image_selected,
            res_compute: inCpPod.plan.res_compute_selected,
        },
    };

    $(alert_id).hide();

    inCp.ApiCmd("pod/spec-set" + url, {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {
            l4iModal.ScrollTop();
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");
            window.setTimeout(function() {
                l4iModal.Close();
                if (rsj.pod && rsj.pod.length > 8) {
                    inCpPod.EntryIndex(rsj.pod);
                } else {
                    inCpPod.List(null, null);
                }
            }, 1500);
        }
    });
}
