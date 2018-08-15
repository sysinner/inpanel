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
    plan_selected: null,
    clusters: null,
    cluster_selected: null,
    zone_active: null,
    new_options: {},
    entry_active: null,
    entry_active_past: 3600,
    entry_operate_access_def: {
        ssh_on: false,
        ssh_key: "",
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
}

inCpPod.Index = function() {
    inCpPod.List(null, {
        // destroy_enable: true,
    });
}

inCpPod.list_nav_menus = [{
    name: "Pod Instances",
    uri: "pod/instance",
}];

inCpPod.list_options = {};

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

    if (inCp.Zones.items && inCp.Zones.items.length == 1) {
        inCpPod.zone_active = inCp.Zones.items[0].meta.id;
        uri += "zone_id=" + inCpPod.zone_active;
    }
    uri += "&fields=meta/id|name|user,operate/action|replicas,spec/ref/id|name,spec/zone|cell,apps/meta/name";
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

    if (!options.ops_mode) {
        inCp.ModuleNavbarMenu("cp/pod/list", inCpPod.list_nav_menus, "pod/instance");
    } else {
        uri += "&filter_meta_user=all";
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
                if (!data.items[i].operate.replicas) {
                    data.items[i].operate.replicas = [];
                }
                for (var j in data.items[i].operate.replicas) {
                    if (!data.items[i].operate.replicas[j].ports) {
                        data.items[i].operate.replicas[j].ports = [];
                    }
                    for (var k in data.items[i].operate.replicas[j].ports) {
                        if (!data.items[i].operate.replicas[j].ports[k].host_port) {
                            data.items[i].operate.replicas[j].ports[k].host_port = 0;
                        }
                    }
                }
                data.items[i].operate._action = inCp.OpActionTitle(data.items[i].operate.action);
            }

            if (inCpPod.zone_active) {
                data._zone_active = inCpPod.zone_active;
            }

            // $("#incp-podls-alert").hide();
            if (data.items.length < 1) {
                return l4i.InnerAlert(alert_id, 'alert-info', "No Item Found Yet ...");
            }
            data._actions = inCp.OpActions;
            data._options = options;
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

        inCp.ApiCmd("pod/list" + uri, {
            callback: ep.done("data"),
        });
    });
}


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
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "PodInstance") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
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


inCpPod.New = function(options) {
    if (options) {
        inCpPod.new_options = options;
    } else {
        options = inCpPod.new_options;
    }
    var alert_id = "#incp-podnew-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "zones", "plans", function(tpl, zones, plans) {

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }
            inCpPod.syszones = zones;

            if (!plans || !plans.kind || plans.kind != "PodSpecPlanList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            var pod = l4i.Clone(inCpPod.def);

            pod._plans = plans;
            pod._plan_selected = null;

            for (var i in pod._plans.items) {
                pod._plan_selected = pod._plans.items[i].meta.id;
                break;
            }

            if (!pod._plan_selected) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "No SpecPodPlan Found");
            }

            inCpPod.plans = plans;
            inCpPod.plan_selected = pod._plan_selected;
            // inCpPod.zones = zones;

            var fnfre = function() {
                l4iTemplate.Render({
                    dstid: "incp-podnew-plans",
                    tplid: "incp-podnew-plans-tpl",
                    data: {
                        items: inCpPod.plans.items,
                        _plan_selected: inCpPod.plan_selected,
                    },
                });
                inCpPod.NewRefreshPlan();
            }
            inCpPod.new_options = options;
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
                                _plan_selected: inCpPod.plan_selected,
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
                                _plan_selected: inCpPod.plan_selected,
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
    if (inCpPod.new_options.app_cpu_min &&
        inCpPod.new_options.app_cpu_min > 0 &&
        v.cpu_limit < inCpPod.new_options.app_cpu_min) {
        return false;
    }

    if (inCpPod.new_options.app_mem_min &&
        inCpPod.new_options.app_mem_min > 0 &&
        v.mem_limit < inCpPod.new_options.app_mem_min) {
        return false;
    }

    return true;
}

inCpPod.NewPlanChange = function(plan_id) {
    if (inCpPod.plan_selected == plan_id) {
        return;
    }

    inCpPod.plan_selected = plan_id;
    inCpPod.NewRefreshPlan();

    $("#incp-podnew-plans").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-plan-id-" + plan_id).addClass("selected");
}


inCpPod.NewRefreshPlan = function() {
    var alert_id = "#incp-podnew-alert";

    var vol_min = 0,
        cpu_min = 0,
        mem_min = 0;
    if (inCpPod.new_options.app_vol_min &&
        inCpPod.new_options.app_vol_min > 0) {
        vol_min = inCpPod.new_options.app_vol_min;
    }
    if (inCpPod.new_options.app_cpu_min &&
        inCpPod.new_options.app_cpu_min > 0) {
        cpu_min = inCpPod.new_options.app_cpu_min;
    }
    if (inCpPod.new_options.app_mem_min &&
        inCpPod.new_options.app_mem_min > 0) {
        mem_min = inCpPod.new_options.app_mem_min;
    }

    for (var i in inCpPod.plans.items) {

        if (inCpPod.plans.items[i].meta.id != inCpPod.plan_selected) {
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

            if (vol.default < 1073741824) {
                vol._valued = (vol.default / 1073741824).toFixed(1);
            } else {
                vol._valued = (vol.default / 1073741824).toFixed(0);
            }

            inCpPod.plan._res_volume = vol;

            break; // TODO
        }

        if (!inCpPod.plan._res_volume) {
            return l4i.InnerAlert(alert_id, 'alert-danger', "No SpecPodPlan/Volume Found");
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
            return l4i.InnerAlert(alert_id, 'alert-danger', "No SpecZone Found");
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

        l4iTemplate.Render({
            dstid: "incp-podnew-resource-selector",
            tplid: "incp-podnew-resource-selector-tpl",
            data: inCpPod.plan,
            callback: inCpPod.newAccountChargeRefresh,
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
    inCpPod.newAccountChargeRefresh();
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
            return l4i.InnerAlert("#incp-podnew-alert", "alert-danger", "this Resource Spec can not fit the Application Resource Requirements, please try another Spec or change the Pod Plan");
        }
        break;
    }


    $("#incp-podnew-res-computes").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-res-compute-id-" + res_compute_id).addClass("selected");

    inCpPod.plan.res_compute_selected = res_compute_id;
    inCpPod.newAccountChargeRefresh();
}

inCpPod.NewPlanImageChange = function(image_id) {
    if (!inCpPod.plan || inCpPod.plan.image_selected == image_id) {
        return;
    }

    $("#incp-podnew-images").find(".incp-form-box-selector-item.selected").removeClass("selected");
    $("#incp-podnew-image-id-" + image_id).addClass("selected");

    inCpPod.plan.image_selected = image_id;
}

inCpPod.newAccountChargeRefresh = function() {
    var alert_id = "#incp-podnew-alert",
        vol_size = parseFloat($("#incp-podnew-resource-value").val());
    if (vol_size <= 0) {
        return;
    }

    // GB
    if (vol_size < 1.0) {
        vol_size = vol_size * 1048576000;
    } else {
        vol_size = vol_size * 1073741824;
    }

    var set = {
        kind: "SpecPodPlanSetup",
        name: "pod-estimate",
        plan: inCpPod.plan_selected,
        zone: inCpPod.plan._zone_selected.split("/")[0],
        cell: inCpPod.plan._zone_selected.split("/")[1],
        res_volume: inCpPod.plan._res_volume.ref_id,
        res_volume_size: parseInt(vol_size),
        boxes: [{
            name: "main",
            image: inCpPod.plan.image_selected,
            res_compute: inCpPod.plan.res_compute_selected,
        }],
    };


    inCp.ApiCmd("charge/pod-estimate?fields=pod&cycles=3600,86400", {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, data) {
            if (err || !data || data.error || data.kind != "PodEstimate") {
                return;
            }
            var cas = [];
            for (var i in data.items) {
                if (data.items[i].cycle_time == 3600) {
                    cas.push(data.items[i].cycle_amount + " / hour");
                } else if (data.items[i].cycle_time == 86400) {
                    cas.push(data.items[i].cycle_amount + " / day");
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
        vol_size = parseFloat($("#incp-podnew-resource-value").val());
    if (vol_size <= 0) {
        return l4i.InnerAlert(alert_id, "alert-danger", "System Storage Not Set");
    }

    if (!inCpPod.plan.res_compute_selected) {
        return l4i.InnerAlert(alert_id, "alert-danger", "Resource Option Not Set");
    }

    if (vol_size >= 1.0) {
        vol_size = parseInt(vol_size) * inCp.ByteGB;
    } else {
        vol_size = parseInt(vol_size * 10) * 100 * inCp.ByteMB;
    }

    if (inCpPod.new_options.app_vol_min &&
        inCpPod.new_options.app_vol_min > 0) {
        if (vol_size < inCpPod.new_options.app_vol_min) {
            return l4i.InnerAlert(alert_id, "alert-danger", "this System Storage requires at least " + inCp.UtilResSizeFormat(inCpPod.new_options.app_vol_min) + " of space to fit the Application Resource Requirements");
        }
    }

    if (inCpPod.new_options.app_spec_id) {
        url = "?exp_filter_app_spec_id=" + inCpPod.new_options.app_spec_id;
    }

    var set = {
        name: $("#incp-podnew-meta-name").val(),
        plan: inCpPod.plan_selected,
        zone: inCpPod.plan._zone_selected.split("/")[0],
        cell: inCpPod.plan._zone_selected.split("/")[1],
        res_volume: inCpPod.plan._res_volume.ref_id,
        res_volume_size: vol_size,
        boxes: [{
            name: "main",
            image: inCpPod.plan.image_selected,
            res_compute: inCpPod.plan.res_compute_selected,
        }],
    };

    if (!set.name || set.name == "") {
        return l4i.InnerAlert(alert_id, 'alert-danger', "Name Not Found");
    }

    $(alert_id).hide();

    inCp.ApiCmd("pod/new" + url, {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {
            if (inCpPod.new_options.open_modal) {
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
            window.setTimeout(function() {
                if (inCpPod.new_options.app_new_callback) {
                    inCpPod.new_options.app_new_callback(null, rsj.pod);
                } else {
                    l4iModal.Close();
                    if (inCpPod.new_options.callback) {
                        inCpPod.new_options.callback(null);
                    } else if (!inCpPod.new_options.open_modal) {
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
                for (var j in pod.operate.replicas[i].ports) {
                    if (!pod.operate.replicas[i].ports[j].host_port) {
                        pod.operate.replicas[i].ports[j].host_port = 0;
                    }
                }
            }
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
                title: "Pod Instance Info",
                tplsrc: tpl,
                width: 900,
                height: 600,
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
    if (!pod_id && inCpPod.entry_active_id) {
        pod_id = inCpPod.entry_active_id;
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
            pod.spec._vol_limit = 0;
            for (var i in pod.spec.boxes) {
                pod.spec._cpu_limit += pod.spec.boxes[i].resources.cpu_limit;
                pod.spec._mem_limit += pod.spec.boxes[i].resources.mem_limit;
            }
            for (var i in pod.spec.volumes) {
                if (pod.spec.volumes[i].name == "system") {
                    pod.spec._vol_limit = pod.spec.volumes[i].size_limit;
                    break;
                }
            }

            var spec_summary = "ID: " + pod.spec.ref.id;
            spec_summary += ", CPU: " + pod.spec._cpu_limit + "m";
            spec_summary += ", RAM: " + inCp.UtilResSizeFormat(pod.spec._mem_limit);
            spec_summary += ", Storage: " + inCp.UtilResSizeFormat(pod.spec._vol_limit);


            l4iModal.Open({
                title: "Pod Instance Info",
                tplsrc: tpl,
                width: 800,
                height: 450,
                data: {
                    pod: pod,
                    _op_actions: actions,
                    _spec_summary: spec_summary,
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
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

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


inCpPod.EntryDel = function(pod_id) {
    if (!pod_id && inCpPod.entry_active_id) {
        pod_id = inCpPod.entry_active_id;
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
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodInstance") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

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
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Pod") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

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
}, {
    name: "Overview",
    uri: "pod/entry/overview",
}, {
    name: "Graphs",
    uri: "pod/entry/stats",
}, {
    name: "Access",
    uri: "pod/entry/setup",
    onclick: "inCpPod.EntryAccess()",
}, {
    name: "Settings",
    uri: "pod/entry/setup",
    onclick: "inCpPod.SetInfo()",
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
        inCpPod.entry_active_id = pod_id;
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
        if (inCpPod.list[i].meta.id == inCpPod.entry_active_id) {
            pod_zone_id = inCpPod.list[i].spec.zone;
            break;
        }
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", "pstatus", function(tpl, pod, pstatus) {

            if (!pod.operate.replicas) {
                pod.operate.replicas = [];
            }
            for (var i in pod.operate.replicas) {
                if (!pod.operate.replicas[i].ports) {
                    pod.operate.replicas[i].ports = [];
                }
                for (var j in pod.operate.replicas[i].ports) {
                    if (!pod.operate.replicas[i].ports[j].host_port) {
                        pod.operate.replicas[i].ports[j].host_port = 0;
                    }
                }
            }
            pod.spec._cpu_limit = 0;
            pod.spec._mem_limit = 0;
            pod.spec._box_image_driver = pod.spec.boxes[0].image.driver;
            for (var i in pod.spec.boxes) {
                pod.spec._cpu_limit += pod.spec.boxes[i].resources.cpu_limit;
                pod.spec._mem_limit += pod.spec.boxes[i].resources.mem_limit;
            }

            inCp.OpToolsClean();
            $("#work-content").html(tpl);

            inCpPod.entry_active = pod;

            l4iTemplate.Render({
                dstid: "incp-podentry-overview",
                tplid: "incp-podentry-overview-info-tpl",
                data: pod,
            });

            l4iTemplate.Render({
                dstid: "incp-podentry-sidebar",
                tplid: "incp-podentry-overview-oplog-tpl",
                data: pstatus,
            });

            setTimeout(inCpPod.entryAutoRefresh, 5000);
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + inCpPod.entry_active_id, {
            api_zone_id: pod_zone_id,
            callback: ep.done("pod"),
        });

        inCp.ApiCmd("pod/status?id=" + inCpPod.entry_active_id, {
            api_zone_id: pod_zone_id,
            callback: ep.done("pstatus"),
        });

        inCp.TplFetch("pod/entry-overview", {
            callback: ep.done("tpl"),
        });
    });
}

inCpPod.entryAutoRefresh = function() {
    var el = document.getElementById("incp-podentry-status-value");
    if (!el || !inCpPod.entry_active_id) {
        return;
    }
    inCp.ApiCmd("pod/status?id=" + inCpPod.entry_active_id, {
        api_zone_id: inCpPod.entry_active.spec.zone,
        callback: function(err, data) {

            if (err || !data || data.error || !data.kind) {
                return;
            }

            if (inCp.OpActionAllow(data.action, inCp.OpActionRunning)) {
                el.innerHTML = '<span class="incp-font-ok">Running</span>';
            } else {
                el.innerHTML = inCp.OpActionStatusTitle(data.action);
            }

            if (!data.replicas) {
                data.replicas = [];
            }
            if (data.replicas.length > inCpPod.entry_active.operate.replicas.length) {
                inCpPod.entry_active.operate.replicas = [];
                for (var i in data.replicas) {
                    inCpPod.entry_active.operate.replicas.push({
                        id: i,
                        node: data.replicas[i].id,
                    });
                }
                l4iTemplate.Render({
                    dstid: "incp-podentry-overview",
                    tplid: "incp-podentry-overview-info-tpl",
                    data: inCpPod.entry_active,
                });
            }

            if (data.replicas.length != inCpPod.entry_active.operate.replicas.length) {
                return inCpPod.EntryOverview();
            }
            for (var i in data.replicas) {

                if (!inCp.OpActionAllow(data.action, inCp.OpActionRunning)) {
                    var elrep = document.getElementById("incp-podentry-box-uptime-value-" + i);
                    if (elrep) {
                        elrep.innerHTML = "00:00:00"
                    }
                    continue;
                }

                for (var j in data.replicas[i].boxes) {
                    if (data.replicas[i].boxes[j].name != "main") {
                        continue;
                    }
                    if (!data.replicas[i].boxes[j].updated || !data.replicas[i].boxes[j].started) {
                        continue;
                    }
                    if (data.replicas[i].boxes[j].ports &&
                        data.replicas[i].boxes[j].ports.length != inCpPod.entry_active.operate.replicas[i].ports.length) {
                        return inCpPod.EntryOverview();
                    }
                    var elrep = document.getElementById("incp-podentry-box-uptime-value-" + i);
                    if (elrep) {
                        var sec = data.replicas[i].boxes[j].updated - data.replicas[i].boxes[j].started;
                        if (sec > 0) {
                            elrep.innerHTML = inCp.TimeUptime(sec);
                        }
                    }
                }
            }


            l4iTemplate.Render({
                dstid: "incp-podentry-sidebar",
                tplid: "incp-podentry-overview-oplog-tpl",
                data: data,
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

inCpPod.EntryStats = function(time_past) {

    if (time_past) {
        inCpPod.entry_active_past = parseInt(time_past);
        if (!inCpPod.entry_active_past) {
            inCpPod.entry_active_past = 3600;
        }
    }
    if (inCpPod.entry_active_past < 600) {
        inCpPod.entry_active_past = 600;
    }
    if (inCpPod.entry_active_past > (30 * 86400)) {
        inCpPod.entry_active_past = 30 * 86400;
    }
    var pod_zone_id = null;
    if (inCpPod.entry_active && inCpPod.entry_active.spec.zone) {
        pod_zone_id = inCpPod.entry_active.spec.zone;
    } else {
        for (var i in inCpPod.list) {
            if (inCpPod.list[i].meta.id == inCpPod.entry_active_id) {
                pod_zone_id = inCpPod.list[i].spec.zone;
                break;
            }
        }
    }

    var stats_url = "id=" + inCpPod.entry_active_id;
    var stats_query = {
        tc: 180,
        tp: inCpPod.entry_active_past,
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
        inCpPod.hchart_def.options.height = "180px";
    } else {
        inCpPod.hchart_def.options.height = "220px";
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
            stats_fsn.options.title = l4i.T("Storage IO / %s", tc_title);

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

            hooto_chart.RenderElement(stats_cpu, "incp-podentry-stats-cpu");
            hooto_chart.RenderElement(stats_ram, "incp-podentry-stats-ram");
            hooto_chart.RenderElement(stats_net, "incp-podentry-stats-net");
            hooto_chart.RenderElement(stats_fss, "incp-podentry-stats-fss");
            hooto_chart.RenderElement(stats_fsn, "incp-podentry-stats-fsn");
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.ApiCmd("pod/entry?id=" + inCpPod.entry_active_id, {
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
    if (!pod_id && inCpPod.entry_active_id) {
        pod_id = inCpPod.entry_active_id;
    }
    if (!pod_id) {
        return alert("No Pod Found");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            var actions = [];
            if (!pod.operate.access) {
                pod.operate.access = l4i.Clone(inCpPod.entry_operate_access_def);
            }
            if (!pod.operate.access.ssh_key) {
                pod.operate.access.ssh_key = "";
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
            "display": "block"
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
            },
        },
    };

    $(alert_id).hide();

    inCp.ApiCmd("pod/access-set", {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {

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

    if (!pod_id) {
        return;
    }

    var alert_id = "#incp-podnew-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", "zones", "plans", function(tpl, pod, zones, plans) {

            if (!pod || !pod.kind || pod.kind != "Pod" || !pod.spec.boxes || pod.spec.boxes.length < 1) {
                return l4iAlert.Open("error", "No Pod Found");
            }

            if (!zones || !zones.kind || zones.kind != "HostZoneList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }
            inCpPod.syszones = zones;

            if (!plans || !plans.kind || plans.kind != "PodSpecPlanList") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            var spec_res_id = pod.spec.boxes[0].resources.ref.id,
                spec_vol_id = null,
                spec_vol_size = null,
                spec_image_id = pod.spec.boxes[0].image.ref.id;
            for (var i in pod.spec.volumes) {
                if (pod.spec.volumes[i].name == "system") {
                    spec_vol_id = pod.spec.volumes[i].ref.id;
                    spec_vol_size = pod.spec.volumes[i].size_limit;
                    break;
                }
            }
            if (!spec_vol_id) {
                return l4iAlert.Open("error", "Invalid Pod Spec");
            }

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


            inCpPod.specSetActive = pod;

            inCpPod.plans = plans;
            inCpPod.plan_selected = pod._plan_selected;

            var fnfre = function() {
                l4iTemplate.Render({
                    dstid: "incp-podnew-plans",
                    tplid: "incp-podnew-plans-tpl",
                    data: {
                        items: inCpPod.plans.items,
                        _plan_selected: inCpPod.plan_selected,
                    },
                });
                inCpPod.NewRefreshPlan();
            }

            l4iModal.Open({
                id: "podset-planset",
                tplsrc: tpl,
                title: "Setting Pod Spec",
                width: "max",
                height: "max",
                callback: function() {
                    l4iTemplate.Render({
                        dstid: "incp-podnew-form",
                        tplid: "incp-podnew-modal",
                        data: {
                            items: inCpPod.plans.items,
                            _plan_selected: inCpPod.plan_selected,
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
        vol_size = parseFloat($("#incp-podnew-resource-value").val());
    if (vol_size <= 0) {
        return l4i.InnerAlert(alert_id, "alert-danger", "System Storage Not Set");
    }

    if (!inCpPod.plan.res_compute_selected) {
        return l4i.InnerAlert(alert_id, "alert-danger", "Resource Option Not Set");
    }

    if (vol_size >= 1.0) {
        vol_size = parseInt(vol_size) * inCp.ByteGB;
    } else {
        vol_size = parseInt(vol_size * 10) * 100 * inCp.ByteMB;
    }

    var set = {
        pod: inCpPod.specSetActive.meta.id,
        name: inCpPod.specSetActive.meta.id,
        plan: inCpPod.plan_selected,
        zone: inCpPod.specSetActive.spec.zone,
        cell: inCpPod.specSetActive.spec.cell,
        res_volume: inCpPod.plan._res_volume.ref_id,
        res_volume_size: vol_size,
        boxes: [{
            name: "main",
            image: inCpPod.plan.image_selected,
            res_compute: inCpPod.plan.res_compute_selected,
        }],
    };

    $(alert_id).hide();

    inCp.ApiCmd("pod/spec-set" + url, {
        method: "POST",
        data: JSON.stringify(set),
        callback: function(err, rsj) {
            l4iModal.ScrollTop();
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
            window.setTimeout(function() {
                l4iModal.Close();
                if (rsj.pod && rsj.pod.length > 8) {
                    inCpPod.EntryIndex(rsj.pod);
                } else {
                    inCpPod.List(null, null);
                }
            }, 1000);
        }
    });
}


