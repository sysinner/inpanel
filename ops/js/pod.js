var inOpsPod = {
    specPlanDef: {
        meta: {
            id: "",
            name: "",
        },
        res_computes: [],
        res_compute_default: "",
        res_compute_charge: {
            type: 0,
            cycle: 0,
            cpu: 0.1,
            memory: 0.0001,
        },
        res_volumes: [],
        images: [],
    },
    spec_status_def: [
        {
            name: "active",
            value: "Active",
        },
        {
            name: "suspend",
            value: "Suspend",
        },
    ],
    planset_active: null,
    list_nav_menus: [
        {
            name: "Pod Instances",
            uri: "pod/list",
        },
        {
            name: "Spec Plans",
            uri: "pod-spec/plan-list",
        },
        {
            name: "Images",
            uri: "pod-spec/image-list",
        },
    ],
    image_actives: null,
    image_def: {
        meta: {
            id: "",
            name: "",
        },
        name: "",
        tag: "",
        driver: "docker",
        os_dist: "",
        arch: "",
        action: 1 << 1,
        sort_order: 10,
    },
    image_action_active: 1 << 1,
};

inOpsPod.Index = function () {
    inCp.ModuleNavbarMenu("ops/pod/list", inOpsPod.list_nav_menus);

    valueui.url.eventRegister("pod/list", inOpsPod.List, "incp-module-navbar-menus");
    valueui.url.eventRegister(
        "pod-spec/plan-list",
        inOpsPod.SpecPlanList,
        "incp-module-navbar-menus"
    );
    valueui.url.eventRegister(
        "pod-spec/image-list",
        inOpsPod.SpecPlanImageList,
        "incp-module-navbar-menus"
    );

    valueui.url.eventHandler("pod/list", true);
};

inOpsPod.List = function () {
    inCpPod.List(null, {
        ops_mode: true,
        exp_filter_meta_user_all: true,
        entry_back: inOpsPod.Index,
    });
    // inCp.ModuleNavbarMenu("ops/pod/list", inOpsPod.list_nav_menus);
};

inOpsPod.SpecPlanList = function () {
    var tplid = "inops-podspec-planls";
    var alert_id = "#" + tplid + "-alert";
    var uri = "";

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        if (tpl) {
            $("#work-content").html(tpl);
        }
        inCp.OpToolsRefresh("#inops-podspec-planls-optools");

        var errMsg = valueui.utilx.errorKindCheck(null, data, "PodSpecPlanList");
        if (errMsg) {
            return valueui.alert.innerShow(alert_id, "error", errMsg);
        }

        if (!data.items) {
            data.items = [];
        }
        for (var i in data.items) {
            var zones = [];
            for (var j in data.items[i].zones) {
                zones.push(data.items[i].zones[j].name);
            }
            data.items[i]._zones = zones;
        }

        if (data.items.length < 1) {
            return valueui.alert.innerShow(alert_id, "info", "No Item Found Yet ...");
        }

        valueui.template.render({
            dstid: tplid,
            tplid: tplid + "-tpl",
            data: data,
            callback: function (err) {
                //
            },
        });
    });

    ep.fail(function (err) {
        alert("ListRefresh error, Please try again later (EC:001)");
    });

    inOps.TplFetch("pod/spec/plan-list", {
        callback: ep.done("tpl"),
    });

    inOps.ApiCmd("pod-spec/plan-list" + uri, {
        callback: ep.done("data"),
    });
};

inOpsPod.SpecPlanSet = function (name) {
    var ep = valueui.newEventProxy(
        "tpl",
        "plan",
        "zones",
        "rescomputes",
        "images",
        "resvolumes",
        function (tpl, plan, zones, rescomputes, images, resvolumes) {
            if (!plan || !plan.kind || plan.kind != "PodSpecPlan") {
                plan = valueui.utilx.objectClone(inOpsPod.specPlanDef);
            }

            if (zones.error && zones.error.code == "AccessDenied") {
                return inCp.AlertAccessDenied();
            }

            if (!zones.kind || zones.kind != "HostZoneList") {
                return alert("HostZoneList Not Found");
            }

            if (!rescomputes.kind || rescomputes.kind != "PodSpecResComputeList") {
                return alert("PodSpecResComputeList Not Found");
            }

            if (!images.kind || images.kind != "PodSpecBoxImageList") {
                return alert("PodSpecBoxImageList Not Found");
            }

            if (!resvolumes.kind || resvolumes.kind != "PodSpecResVolumeList") {
                return alert("PodSpecResVolumeList Not Found");
            }

            if (tpl) {
                $("#work-content").html(tpl);
            }
            inCp.OpToolsClean();

            if (!plan.labels) {
                plan.labels = [];
            }
            if (!plan.annotations) {
                plan.annotations = [];
            }

            plan._statuses = valueui.utilx.objectClone(inOpsPod.spec_status_def);
            for (var i in plan._statuses) {
                if (plan._statuses[i].name == plan.status) {
                    plan._statuses[i]._selected = true;
                    break;
                }
            }

            //
            var plan_zones = [];
            for (var i in plan.zones) {
                for (var j in plan.zones[i].cells) {
                    plan_zones.push(plan.zones[i].name + "/" + plan.zones[i].cells[j]);
                }
            }
            for (var i in zones.items) {
                for (var j in zones.items[i].cells) {
                    if (
                        inCp.ArrayStringHas(
                            plan_zones,
                            zones.items[i].meta.id + "/" + zones.items[i].cells[j].meta.id
                        )
                    ) {
                        zones.items[i].cells[j]._selected = true;
                    }
                }
            }

            //
            var plan_rescomputes = [];
            for (var i in plan.res_computes) {
                plan_rescomputes.push(plan.res_computes[i].ref_id);
            }
            for (var i in rescomputes.items) {
                if (inCp.ArrayStringHas(plan_rescomputes, rescomputes.items[i].meta.id)) {
                    rescomputes.items[i]._selected = true;
                }
            }

            //
            var plan_images = [];
            for (var i in plan.images) {
                plan_images.push(plan.images[i].ref_id);
            }
            for (var i in images.items) {
                if (inCp.ArrayStringHas(plan_images, images.items[i].meta.id)) {
                    images.items[i]._selected = true;
                }
            }

            //
            var plan_resvolumes = [];
            for (var i in plan.res_volumes) {
                plan_resvolumes.push(plan.res_volumes[i].ref_id);
            }
            for (var i in resvolumes.items) {
                if (inCp.ArrayStringHas(plan_resvolumes, resvolumes.items[i].meta.id)) {
                    resvolumes.items[i]._selected = true;
                }
                if (resvolumes.items[i].attrs) {
                    if (inCp.OpActionAllow(resvolumes.items[i].attrs, inCp.ResVolValueAttrSSD)) {
                        resvolumes.items[i]._attrs = "SSD";
                    }
                }
            }

            if (!plan.sort_order) {
                plan.sort_order = 0;
            }

            //
            inOpsPod.planset_active = plan;
            inOpsPod.planset_active._zones = zones;
            inOpsPod.planset_active._rescomputes = rescomputes;
            inOpsPod.planset_active._images = images;
            inOpsPod.planset_active._resvolumes = resvolumes;

            valueui.template.render({
                dstid: "inops-podspec-planset",
                tplid: "inops-podspec-planset-tpl",
                data: plan,
            });
        }
    );

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:mix-spec-podset)");
    });

    inOps.TplFetch("pod/spec/plan-set", {
        callback: ep.done("tpl"),
    });

    inOps.ApiCmd("host/zone-list?fields=cells", {
        callback: ep.done("zones"),
    });

    inOps.ApiCmd("pod-spec/res-compute-list", {
        callback: ep.done("rescomputes"),
    });

    inOps.ApiCmd("pod-spec/box-image-list?action=" + inOpsPod.image_action_active, {
        callback: ep.done("images"),
    });

    inOps.ApiCmd("pod-spec/res-volume-list", {
        callback: ep.done("resvolumes"),
    });

    if (!name) {
        ep.emit("plan", null);
    } else {
        inOps.ApiCmd("pod-spec/plan-entry?id=" + name, {
            callback: ep.done("plan"),
        });
    }
};

inOpsPod.SpecPlanSetAnnotationAppend = function () {
    valueui.template.render({
        append: true,
        dstid: "inops-podspec-planset-annotations",
        tplid: "inops-podspec-planset-annotation-tpl",
    });
};

inOpsPod.SpecPlanSetAnnotationDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsPod.SpecPlanSetLabelAppend = function () {
    valueui.template.render({
        append: true,
        dstid: "inops-podspec-planset-labels",
        tplid: "inops-podspec-planset-label-tpl",
    });
};

inOpsPod.SpecPlanSetLabelDel = function (field) {
    $(field).parent().parent().remove();
};

inOpsPod.SpecPlanSetClusterChange = function (zone, cell) {
    if (!inOpsPod.planset_active || !inOpsPod.planset_active._zones) {
        return;
    }
    for (var i in inOpsPod.planset_active._zones.items) {
        if (zone != inOpsPod.planset_active._zones.items[i].meta.id) {
            continue;
        }
        for (var j in inOpsPod.planset_active._zones.items[i].cells) {
            if (cell != inOpsPod.planset_active._zones.items[i].cells[j].meta.id) {
                continue;
            }
            if (inOpsPod.planset_active._zones.items[i].cells[j]._selected) {
                inOpsPod.planset_active._zones.items[i].cells[j]._selected = false;
                $("#inops-podspec-planset-zone-id-" + zone + "-" + cell).removeClass("selected");
            } else {
                inOpsPod.planset_active._zones.items[i].cells[j]._selected = true;
                $("#inops-podspec-planset-zone-id-" + zone + "-" + cell).addClass("selected");
            }
            break;
        }
        break;
    }
};

inOpsPod.SpecPlanSetResComputeChange = function (res_compute_id) {
    if (!inOpsPod.planset_active || !inOpsPod.planset_active._rescomputes) {
        return;
    }
    for (var i in inOpsPod.planset_active._rescomputes.items) {
        if (res_compute_id != inOpsPod.planset_active._rescomputes.items[i].meta.id) {
            continue;
        }
        if (inOpsPod.planset_active._rescomputes.items[i]._selected) {
            inOpsPod.planset_active._rescomputes.items[i]._selected = false;
            $("#inops-podspec-planset-res-compute-id-" + res_compute_id).removeClass("selected");
        } else {
            inOpsPod.planset_active._rescomputes.items[i]._selected = true;
            $("#inops-podspec-planset-res-compute-id-" + res_compute_id).addClass("selected");
        }
        break;
    }
};

inOpsPod.SpecPlanSetBoxImageChange = function (image_id) {
    if (!inOpsPod.planset_active || !inOpsPod.planset_active._images) {
        return;
    }
    var image_id_enc = valueui.utilx.cryptoMd5(image_id);
    for (var i in inOpsPod.planset_active._images.items) {
        if (image_id != inOpsPod.planset_active._images.items[i].meta.id) {
            continue;
        }
        if (inOpsPod.planset_active._images.items[i]._selected) {
            inOpsPod.planset_active._images.items[i]._selected = false;
            $("#inops-podspec-planset-box-image-id-" + image_id_enc).removeClass("selected");
        } else {
            inOpsPod.planset_active._images.items[i]._selected = true;
            $("#inops-podspec-planset-box-image-id-" + image_id_enc).addClass("selected");
        }
        break;
    }
};

inOpsPod.SpecPlanSetResVolumeChange = function (res_volume_id) {
    if (!inOpsPod.planset_active || !inOpsPod.planset_active._resvolumes) {
        return;
    }
    for (var i in inOpsPod.planset_active._resvolumes.items) {
        if (res_volume_id != inOpsPod.planset_active._resvolumes.items[i].meta.id) {
            continue;
        }
        if (inOpsPod.planset_active._resvolumes.items[i]._selected) {
            inOpsPod.planset_active._resvolumes.items[i]._selected = false;
            $("#inops-podspec-planset-res-volume-id-" + res_volume_id).removeClass("selected");
        } else {
            inOpsPod.planset_active._resvolumes.items[i]._selected = true;
            $("#inops-podspec-planset-res-volume-id-" + res_volume_id).addClass("selected");
        }
        break;
    }
};

inOpsPod.SpecPlanSetCommit = function () {
    if (!inOpsPod.planset_active || !inOpsPod.planset_active._resvolumes) {
        return;
    }
    var alert_id = "#inops-podspec-planset-alert";
    var form = $("#inops-podspec-planset");
    if (!form) {
        return;
    }

    var req = {
        meta: {},
        status: "",
        sort_order: 0,
        labels: [],
        annotations: [],
        zones: [],
        res_computes: [],
        res_volumes: [],
        images: [],
    };

    try {
        form.find(".inops-podspec-planset-label-item").each(function () {
            var name = $(this).find("input[name=label_name]").val();
            var value = $(this).find("input[name=label_value]").val();
            req.labels.push({
                name: name,
                value: value,
            });
        });

        form.find(".inops-podspec-planset-annotation-item").each(function () {
            var name = $(this).find("input[name=annotation_name]").val();
            var value = $(this).find("input[name=annotation_value]").val();
            req.annotations.push({
                name: name,
                value: value,
            });
        });

        req.status = form.find("input[name=plan_status]:checked").val();
        req.sort_order = parseInt(form.find("input[name=plan_sort_order]").val());
        req.meta.id = form.find("input[name=plan_meta_id]").val();
        req.meta.name = form.find("input[name=plan_meta_name]").val();

        for (var i in inOpsPod.planset_active._zones.items) {
            var item = inOpsPod.planset_active._zones.items[i];
            var cells = [];
            for (var j in item.cells) {
                if (item.cells[j]._selected) {
                    cells.push(item.cells[j].meta.id);
                }
            }
            if (cells.length > 0) {
                req.zones.push({
                    name: item.meta.id,
                    cells: cells,
                });
            }
        }

        for (var i in inOpsPod.planset_active._rescomputes.items) {
            var item = inOpsPod.planset_active._rescomputes.items[i];
            if (item._selected) {
                req.res_computes.push({
                    ref_id: item.meta.id,
                });
            }
        }

        for (var i in inOpsPod.planset_active._images.items) {
            var item = inOpsPod.planset_active._images.items[i];
            if (item._selected) {
                req.images.push({
                    ref_id: item.meta.id,
                });
            }
        }

        for (var i in inOpsPod.planset_active._resvolumes.items) {
            var item = inOpsPod.planset_active._resvolumes.items[i];
            if (item._selected) {
                req.res_volumes.push({
                    ref_id: item.meta.id,
                });
            }
        }
    } catch (err) {
        return valueui.alert.innerShow(alert_id, "error", err);
    }

    inOps.ApiCmd("pod-spec/plan-set", {
        method: "POST",
        data: JSON.stringify(req),
        timeout: 3000,
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "PodSpecPlan");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successful operation");

            window.setTimeout(function () {
                inOpsPod.SpecPlanList();
            }, 500);
        },
    });
};

inOpsPod.SpecPlanImageList = function () {
    var tplid = "inops-podspec-imagels";
    var alert_id = "#" + tplid + "-alert";
    var uri = "";

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        if (tpl) {
            $("#work-content").html(tpl);
        }
        inCp.OpToolsRefresh("#inops-podspec-imagels-optools");

        var errMsg = valueui.utilx.errorKindCheck(null, rsj, "PodSpecBoxImageList");
        if (errMsg) {
            return valueui.alert.innerShow(alert_id, "error", errMsg);
        }

        if (!data.items) {
            data.items = [];
        }
        for (var i in data.items) {
        }

        if (data.items.length < 1) {
            return valueui.alert.innerShow(alert_id, "info", "No Item Found Yet ...");
        }

        inOpsPod.image_actives = data.items;

        valueui.template.render({
            dstid: tplid,
            tplid: tplid + "-tpl",
            data: {
                items: data.items,
                actions: valueui.utilx.objectClone(inOps.ooActions),
            },
            callback: function (err) {
                //
            },
        });
    });

    ep.fail(function (err) {
        alert("ListRefresh error, Please try again later (EC:001)");
    });

    inOps.TplFetch("pod/spec/box-image-list", {
        callback: ep.done("tpl"),
    });

    inOps.ApiCmd("pod-spec/box-image-list" + uri, {
        callback: ep.done("data"),
    });
};

inOpsPod.SpecPlanImageSet = function (id) {
    var image = null;
    if (inOpsPod.image_actives) {
        for (var i in inOpsPod.image_actives) {
            if (inOpsPod.image_actives[i].meta.id == id) {
                image = inOpsPod.image_actives[i];
                break;
            }
        }
    }
    if (!image) {
        image = inOpsPod.image_def;
    }

    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        var title = "Image Settings";
        if (data.meta.id == "") {
            title = "New Image";
        }
        inOpsPod.image_active = data;

        valueui.modal.open({
            title: title,
            tplsrc: tpl,
            width: 900,
            height: 600,
            data: {
                image: data,
                actions: valueui.utilx.objectClone(inOps.ooActions),
            },
            buttons: [
                {
                    onclick: "valueui.modal.close()",
                    title: "Close",
                },
                {
                    onclick: "inOpsPod.SpecPlanImageSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                },
            ],
        });
    });

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:mix-spec-podset)");
    });

    inOps.TplFetch("pod/spec/box-image-set", {
        callback: ep.done("tpl"),
    });

    ep.emit("data", image);
};

inOpsPod.SpecPlanImageSetCommit = function () {
    if (!inOpsPod.image_active) {
        return;
    }

    var alert_id = "#inops-podspec-imageset-alert";
    var form = $("#inops-podspec-imageset-form");
    if (!form) {
        return;
    }

    var req = {
        meta: {},
        action: "",
        sort_order: 0,
        driver: "",
        tag: "",
    };

    try {
        req.name = form.find("input[name=name]").val();
        req.tag = form.find("input[name=tag]").val();
        req.meta.id = req.name + ":" + req.tag;
        req.meta.name = form.find("input[name=meta_name]").val();

        req.action = parseInt(form.find("input[name=action]:checked").val());
        req.sort_order = parseInt(form.find("input[name=sort_order]").val());
        req.driver = form.find("input[name=driver]").val();
        req.os_dist = form.find("input[name=os_dist]").val();
        req.arch = form.find("input[name=arch]").val();
    } catch (err) {
        return valueui.alert.innerShow(alert_id, "error", err);
    }

    inOps.ApiCmd("pod-spec/box-image-set", {
        method: "POST",
        data: JSON.stringify(req),
        timeout: 3000,
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "PodSpecBoxImage");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successful operation");

            window.setTimeout(function () {
                inOpsPod.SpecPlanImageList();
                valueui.modal.close();
            }, 1000);
        },
    });
};
