var inCpSpec = {
    statusls: [
        {
            phase: "Active",
            title: "Active",
        },
        {
            phase: "Suspend",
            title: "Suspend",
        },
    ],
    boxImageSpecs: [
        {
            distName: "CentOS 7",
            dist: "el7",
            arch: "x64",
        },
        {
            distName: "CentOS 8",
            dist: "el8",
            arch: "x64",
        },
    ],
    boxSpecDef: {
        meta: {
            id: "",
            name: "",
        },
        ports: [],
        image: null,
        resource: null,
    },
    boxImageDef: {
        meta: {
            id: "",
            name: "",
        },
        driver: "docker",
        spec: {
            dist: "el7",
            arch: "x64",
        },
        status: {
            phase: "Active",
        },
    },
    boxQuotaDef: {
        meta: {
            id: "",
            name: "",
        },
        phase: "Active",
        mem_size: 100,
        cpu_num: 100,
        stor_size: 100,
    },
    podDef: {
        meta: {
            id: "",
            name: "",
        },
        phase: "Active",
        vol_sys: {},
        box: {},
    },
    _boxImages: null,
    _boxQuotas: null,
    keyreg: /^[A-Za-z]\w{2,30}$/,
};

inCpSpec.Index = function () {
    inCp.WorkLoader("-/spec/index");
};

inCpSpec.ImageList = function () {
    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        if (tpl) {
            $("#work-content-spec").html(tpl);
        }

        var alert_id = "#mix-spec-image-alert";

        var errMsg = valueui.utilx.errorKindCheck(null, data, "BoxImageList");
        if (errMsg) {
            return valueui.alert.innerShow(alert_id, "error", errMsg);
        }

        if (!data.items) {
            data.items = [];
        }

        $("#mix-spec-images-alert").hide();

        valueui.template.render({
            dstid: "mix-spec-images",
            tplid: "mix-spec-images-tpl",
            data: data,
        });
    });

    ep.fail(function (err) {
        alert("ListRefresh error, Please try again later (EC:001)");
    });

    inCp.TplFetch("-/spec/image-list", {
        callback: ep.done("tpl"),
    });

    inCp.ApiCmd("spec/image-list", {
        callback: ep.done("data"),
    });
};

inCpSpec.ImageSetForm = function (imageid) {
    var ep = valueui.newEventProxy("tpl", "data", function (tpl, rsj) {
        if (!rsj) {
            rsj = valueui.utilx.objectClone(inCpSpec.boxImageDef);
        } else if (!rsj.kind || rsj.kind != "BoxImage") {
            rsj = valueui.utilx.objectClone(inCpSpec.boxImageDef);
        }

        rsj._statusls = inCpSpec.statusls;
        rsj._specs = inCpSpec.boxImageSpecs;

        valueui.modal.open({
            title: "Box Image Spec Setting",
            tplsrc: tpl,
            data: rsj,
            buttons: [
                {
                    onclick: "valueui.modal.close()",
                    title: "Close",
                },
                {
                    onclick: "inCpSpec.ImageSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                },
            ],
        });
    });

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:mix-spec-imageset)");
    });

    // template
    inCp.TplFetch("-/spec/image-set", {
        callback: ep.done("tpl"),
    });

    // data
    if (!imageid) {
        ep.emit("data", null);
    } else {
        inCp.ApiCmd("spec/image-entry?imageid=" + imageid, {
            callback: ep.done("data"),
        });
    }
};

inCpSpec.ImageSetCommit = function () {
    var alert_id = "#mix-spec-imageset-alert";
    var form = $("#mix-spec-image-form");

    var req = {
        meta: {
            id: form.find("input[name=meta_id]").val(),
            name: form.find("input[name=meta_name]").val(),
        },
        status: {
            phase: form.find("input[name=status_phase]:checked").val(),
        },
        spec: {
            dist: form.find("input[name=spec_dist]:checked").val(),
        },
    };

    inCp.ApiCmd("spec/image-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "BoxImage");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.close();
                inCpSpec.ImageList();
            }, 500);
        },
        error: function (xhr, textStatus, error) {
            valueui.alert.innerShow(alert_id, "error", textStatus + " " + xhr.responseText);
        },
    });
};

inCpSpec.QuotaList = function () {
    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        if (tpl) {
            $("#work-content-spec").html(tpl);
        }

        var alert_id = "#mix-spec-quotas-alert";

        var errMsg = valueui.utilx.errorKindCheck(null, data, "BoxQuotaList");
        if (errMsg) {
            return valueui.alert.innerShow(alert_id, "error", errMsg);
        }

        if (!data.items) {
            data.items = [];
        }

        $("#mix-spec-quotas-alert").hide();

        valueui.template.render({
            dstid: "mix-spec-quotas",
            tplid: "mix-spec-quotas-tpl",
            data: data,
        });
    });

    ep.fail(function (err) {
        alert("ListRefresh error, Please try again later (EC:001)");
    });

    inCp.TplFetch("-/spec/quota-list", {
        callback: ep.done("tpl"),
    });

    inCp.ApiCmd("spec/quota-list", {
        callback: ep.done("data"),
    });
};

inCpSpec.QuotaSetForm = function (quotaid) {
    var ep = valueui.newEventProxy("tpl", "data", function (tpl, rsj) {
        if (!rsj) {
            rsj = valueui.utilx.objectClone(inCpSpec.boxQuotaDef);
        }

        if (!rsj.kind || rsj.kind != "BoxQuota") {
            rsj = valueui.utilx.objectClone(inCpSpec.boxQuotaDef);
        }

        rsj._statusls = inCpSpec.statusls;

        valueui.modal.open({
            title: "Box Quota Spec Setting",
            tplsrc: tpl,
            data: rsj,
            width: 700,
            height: 500,
            buttons: [
                {
                    onclick: "valueui.modal.close()",
                    title: "Close",
                },
                {
                    onclick: "inCpSpec.QuotaSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                },
            ],
        });
    });

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:mix-spec-quotaset)");
    });

    // template
    inCp.TplFetch("-/spec/quota-set", {
        callback: ep.done("tpl"),
    });

    // data
    if (!quotaid) {
        ep.emit("data", null);
    } else {
        inCp.ApiCmd("spec/quota-entry?quotaid=" + quotaid, {
            callback: ep.done("data"),
        });
    }
};

inCpSpec.QuotaSetCommit = function () {
    var alert_id = "#mix-spec-quotaset-alert";
    var form = $("#mix-spec-quota-form");

    var req = {
        meta: {
            id: form.find("input[name=meta_id]").val(),
            name: form.find("input[name=meta_name]").val(),
        },
        phase: form.find("input[name=phase]:checked").val(),
        mem_size: parseInt(form.find("input[name=mem_size]").val()),
        cpu_num: parseInt(form.find("input[name=cpu_num]").val()),
        stor_size: parseInt(form.find("input[name=stor_size]").val()),
    };

    inCp.ApiCmd("spec/quota-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "BoxQuota");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.close();
                inCpSpec.QuotaList();
            }, 500);
        },
        error: function (xhr, textStatus, error) {
            valueui.alert.innerShow(alert_id, "error", textStatus + " " + xhr.responseText);
        },
    });
};

//
inCpSpec.PodList = function () {
    var ep = valueui.newEventProxy("tpl", "data", function (tpl, data) {
        if (tpl) {
            $("#work-content-spec").html(tpl);
        }

        var alert_id = "#mix-spec-pods-alert";

        var errMsg = valueui.utilx.errorKindCheck(null, data, "PodSpecList");
        if (errMsg) {
            return valueui.alert.innerShow(alert_id, "error", errMsg);
        }

        if (!data.items) {
            data.items = [];
        }

        $("#mix-spec-pods-alert").hide();

        // console.log(data);

        valueui.template.render({
            dstid: "mix-spec-pods",
            tplid: "mix-spec-pods-tpl",
            data: data,
        });
    });

    ep.fail(function (err) {
        alert("ListRefresh error, Please try again later (EC:001)");
    });

    inCp.TplFetch("-/spec/pod-list", {
        callback: ep.done("tpl"),
    });

    inCp.ApiCmd("spec/pod-list", {
        callback: ep.done("data"),
    });
};

inCpSpec.PodSetForm = function (podid) {
    var ep = valueui.newEventProxy(
        "tpl",
        "images",
        "quotas",
        "data",
        function (tpl, images, quotas, rsj) {
            if (!rsj) {
                rsj = valueui.utilx.objectClone(inCpSpec.podDef);
            }

            if (!rsj.kind || rsj.kind != "PodSpec") {
                rsj = valueui.utilx.objectClone(inCpSpec.podDef);
            }

            inCpSpec._boxQuotas = quotas;
            inCpSpec._boxImages = images;

            rsj._statusls = inCpSpec.statusls;
            rsj._quotas = quotas;
            rsj._images = images;

            // console.log(rsj);

            valueui.modal.open({
                title: "Pod Spec Setting",
                tplsrc: tpl,
                // data   : rsj,
                width: 980,
                height: 600,
                buttons: [
                    {
                        onclick: "valueui.modal.close()",
                        title: "Close",
                    },
                    {
                        onclick: "inCpSpec.PodSetCommit()",
                        title: "Save",
                        style: "btn btn-primary",
                    },
                ],
                callback: function () {
                    valueui.template.render({
                        dstid: "mix-spec-podset",
                        tplid: "mix-spec-podset-tpl",
                        data: rsj,
                        callback: function () {
                            if (!rsj.labels || rsj.labels.length < 1) {
                                inCpSpec.PodSetLabelAppend();
                            }

                            if (rsj.box) {
                                inCpSpec.PodSetBoxAppend(rsj.box);
                            } else {
                                inCpSpec.PodSetBoxAppend();
                            }
                        },
                    });
                },
            });
        }
    );

    ep.fail(function (err) {
        alert("SpecSet error, Please try again later (EC:mix-spec-podset)");
    });

    // template
    inCp.TplFetch("-/spec/pod-set", {
        callback: ep.done("tpl"),
    });

    inCp.ApiCmd("spec/image-list", {
        callback: ep.done("images"),
    });

    inCp.ApiCmd("spec/quota-list", {
        callback: ep.done("quotas"),
    });

    // data
    if (!podid) {
        ep.emit("data", null);
    } else {
        inCp.ApiCmd("spec/pod-entry?podid=" + podid, {
            callback: ep.done("data"),
        });
    }
};

inCpSpec.PodSetLabelAppend = function () {
    valueui.template.render({
        append: true,
        dstid: "mix-spec-podset-labels",
        tplid: "mix-spec-podset-label-tpl",
    });
};

inCpSpec.PodSetLabelDel = function (field) {
    $(field).parent().parent().remove();
};

inCpSpec.PodSetBoxAppend = function (box) {
    if (!box) {
        box = valueui.utilx.objectClone(inCpSpec.boxSpecDef);
        box.resource = valueui.utilx.objectClone(inCpSpec.boxQuotaDef);
        box.image = valueui.utilx.objectClone(inCpSpec.boxImageDef);
    }

    box._images = inCpSpec._boxImages;
    box._quotas = inCpSpec._boxQuotas;

    box._rowid = Math.random().toString(16).slice(2);

    valueui.template.render({
        append: true,
        dstid: "mix-spec-podset-box",
        tplid: "mix-spec-podset-box-tpl",
        data: box,
        callback: function () {
            if (!box.ports || box.ports.length < 1) {
                inCpSpec.PodSetBoxPortAppend(box._rowid);
            }
        },
    });
};

inCpSpec.PodSetBoxDel = function (rowid) {
    $("#mix-spec-podset-box-" + rowid).remove();
};

inCpSpec.PodSetBoxPortAppend = function (rowid) {
    valueui.template.render({
        append: true,
        dstid: "mix-spec-podset-box-ports-" + rowid,
        tplid: "mix-spec-podset-box-port-tpl",
    });
};

inCpSpec.PodSetBoxPortDel = function (field) {
    $(field).parent().parent().remove();
};

inCpSpec.PodSetCommit = function () {
    var alert_id = "#mix-spec-podset-alert";
    var form = $("#mix-spec-podset");

    var req = {
        meta: {
            id: form.find("input[name=meta_id]").val(),
            name: form.find("input[name=meta_name]").val(),
        },
        phase: form.find("input[name=phase]:checked").val(),
        labels: [],
        box: {},
    };

    if (!inCpSpec.keyreg.test(req.meta.name)) {
        return valueui.alert.innerShow(alert_id, "error", "Invalid Pod Name");
    }

    try {
        form.find(".mix-spec-podset-label").each(function () {
            var key = $(this).find("input[name=label_key]").val();
            var val = $(this).find("input[name=label_value]").val();

            if (!key || key.length < 1) {
                return;
            }

            if (!inCpSpec.keyreg.test(key)) {
                throw "Invalid Lable Key";
            }

            req.labels.push({
                key: key,
                val: val,
            });
        });

        form.find(".mix-spec-podset-box").each(function () {
            var box = {
                meta: {
                    id: $(this).find("input[name=box_id]").val(),
                    name: $(this).find("input[name=box_name]").val(),
                },
                image: {
                    meta: {
                        id: $(this).find("select[name=spec_image_id]").val(),
                    },
                },
                resource: {
                    meta: {
                        id: $(this).find("select[name=spec_quota_id]").val(),
                    },
                },
                ports: [],
            };

            if (!inCpSpec.keyreg.test(box.meta.name)) {
                throw "Invalid Box Name";
            }

            $(this)
                .find(".mix-spec-podset-box-port")
                .each(function () {
                    var bport = parseInt($(this).find("input[name=spec_box_port]").val());
                    if (!bport || bport < 1) {
                        return;
                    }
                    if (bport > 65535) {
                        throw "Invalid Network Port";
                    }

                    box.ports.push({
                        boxPort: bport,
                    });
                });

            req.box = box;
        });
    } catch (err) {
        return valueui.alert.innerShow(alert_id, "error", err);
    }

    // console.log(req);

    $(alert_id).hide();

    inCp.ApiCmd("spec/pod-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            var errMsg = valueui.utilx.errorKindCheck(err, rsj, "PodSpec");
            if (errMsg) {
                return valueui.alert.innerShow(alert_id, "error", errMsg);
            }

            valueui.alert.innerShow(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.close();
                inCpSpec.PodList();
            }, 500);
        },
        error: function (xhr, textStatus, error) {
            valueui.alert.innerShow(alert_id, "error", textStatus + " " + xhr.responseText);
        },
    });
};
