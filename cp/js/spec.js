var inCpSpec = {
    statusls: [
        {
            phase: "Active",
            title: "Active"
        },
        {
            phase: "Suspend",
            title: "Suspend"
        },
    ],
    boxImageSpecs: [{
        distName: "CentOS 6",
        dist: "el6",
        arch: "x64",
    }, {
        distName: "CentOS 7",
        dist: "el7",
        arch: "x64",
    }],
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
        }
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
        volumes: [],
        box: {},
    },
    _boxImages: null,
    _boxQuotas: null,
    keyreg: /^[A-Za-z]\w{2,30}$/,
}

inCpSpec.Index = function() {
    inCp.WorkLoader("-/spec/index");
}

inCpSpec.ImageList = function() {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (tpl) {
                $("#work-content-spec").html(tpl);
            }

            if (data === undefined || data.kind != "BoxImageList") {
                return l4i.InnerAlert("#mix-spec-image-alert", 'error', "Item Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            $("#mix-spec-images-alert").hide();


            l4iTemplate.Render({
                dstid: "mix-spec-images",
                tplid: "mix-spec-images-tpl",
                data: data,
            });
        });

        ep.fail(function(err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        inCp.TplFetch("-/spec/image-list", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("spec/image-list", {
            callback: ep.done("data"),
        });
    });
}


inCpSpec.ImageSetForm = function(imageid) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(inCpSpec.boxImageDef)
            }

            if (!rsj.kind || rsj.kind != "BoxImage") {
                rsj = l4i.Clone(inCpSpec.boxImageDef);
            }

            rsj._statusls = inCpSpec.statusls;
            rsj._specs = inCpSpec.boxImageSpecs;

            l4iModal.Open({
                title: "Box Image Spec Setting",
                tplsrc: tpl,
                data: rsj,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpSpec.ImageSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
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
    });
}

inCpSpec.ImageSetCommit = function() {
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
        }
    };

    inCp.ApiCmd("spec/image-set", {
        method: "POST",
        data: JSON.stringify(req),
        success: function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "BoxImage") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpSpec.ImageList();
            }, 500);
        },
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'error', textStatus + ' ' + xhr.responseText);
        }
    });
}



inCpSpec.QuotaList = function() {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (tpl) {
                $("#work-content-spec").html(tpl);
            }

            if (data === undefined || data.kind != "BoxQuotaList") {
                return l4i.InnerAlert("#mix-spec-quotas-alert", 'error', "Item Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            $("#mix-spec-quotas-alert").hide();


            l4iTemplate.Render({
                dstid: "mix-spec-quotas",
                tplid: "mix-spec-quotas-tpl",
                data: data,
            });
        });

        ep.fail(function(err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        inCp.TplFetch("-/spec/quota-list", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("spec/quota-list", {
            callback: ep.done("data"),
        });
    });
}


inCpSpec.QuotaSetForm = function(quotaid) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(inCpSpec.boxQuotaDef)
            }

            if (!rsj.kind || rsj.kind != "BoxQuota") {
                rsj = l4i.Clone(inCpSpec.boxQuotaDef);
            }

            rsj._statusls = inCpSpec.statusls;

            l4iModal.Open({
                title: "Box Quota Spec Setting",
                tplsrc: tpl,
                data: rsj,
                width: 700,
                height: 500,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpSpec.QuotaSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
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
    });
}

inCpSpec.QuotaSetCommit = function() {
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
        success: function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "BoxQuota") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpSpec.QuotaList();
            }, 500);
        },
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'error', textStatus + ' ' + xhr.responseText);
        }
    });
}

//
inCpSpec.PodList = function() {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (tpl) {
                $("#work-content-spec").html(tpl);
            }

            if (data === undefined || data.kind != "PodSpecList") {
                return l4i.InnerAlert("#mix-spec-pods-alert", 'error', "Item Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            $("#mix-spec-pods-alert").hide();

            // console.log(data);


            l4iTemplate.Render({
                dstid: "mix-spec-pods",
                tplid: "mix-spec-pods-tpl",
                data: data,
            });
        });

        ep.fail(function(err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        inCp.TplFetch("-/spec/pod-list", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("spec/pod-list", {
            callback: ep.done("data"),
        });
    });
}


inCpSpec.PodSetForm = function(podid) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "images", "quotas", "data", function(tpl, images, quotas, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(inCpSpec.podDef)
            }

            if (!rsj.kind || rsj.kind != "PodSpec") {
                rsj = l4i.Clone(inCpSpec.podDef);
            }

            inCpSpec._boxQuotas = quotas;
            inCpSpec._boxImages = images;

            rsj._statusls = inCpSpec.statusls;
            rsj._quotas = quotas;
            rsj._images = images;

            // console.log(rsj);

            l4iModal.Open({
                title: "Pod Spec Setting",
                tplsrc: tpl,
                // data   : rsj,
                width: 980,
                height: 600,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpSpec.PodSetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
                success: function() {

                    l4iTemplate.Render({
                        dstid: "mix-spec-podset",
                        tplid: "mix-spec-podset-tpl",
                        data: rsj,
                        success: function() {

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
        });

        ep.fail(function(err) {
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
    });
}

inCpSpec.PodSetLabelAppend = function() {
    l4iTemplate.Render({
        append: true,
        dstid: "mix-spec-podset-labels",
        tplid: "mix-spec-podset-label-tpl",
    });
}

inCpSpec.PodSetLabelDel = function(field) {
    $(field).parent().parent().remove();
}

inCpSpec.PodSetBoxAppend = function(box) {
    if (!box) {
        box = l4i.Clone(inCpSpec.boxSpecDef);
        box.resource = l4i.Clone(inCpSpec.boxQuotaDef);
        box.image = l4i.Clone(inCpSpec.boxImageDef);
    }

    box._images = inCpSpec._boxImages;
    box._quotas = inCpSpec._boxQuotas;

    box._rowid = Math.random().toString(16).slice(2);

    l4iTemplate.Render({
        append: true,
        dstid: "mix-spec-podset-box",
        tplid: "mix-spec-podset-box-tpl",
        data: box,
        success: function() {

            if (!box.ports || box.ports.length < 1) {
                inCpSpec.PodSetBoxPortAppend(box._rowid);
            }
        },
    });
}

inCpSpec.PodSetBoxDel = function(rowid) {
    $("#mix-spec-podset-box-" + rowid).remove();
}

inCpSpec.PodSetBoxPortAppend = function(rowid) {
    l4iTemplate.Render({
        append: true,
        dstid: "mix-spec-podset-box-ports-" + rowid,
        tplid: "mix-spec-podset-box-port-tpl",
    });
}

inCpSpec.PodSetBoxPortDel = function(field) {
    $(field).parent().parent().remove();
}

inCpSpec.PodSetCommit = function() {
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
        return l4i.InnerAlert(alert_id, 'error', "Invalid Pod Name");
    }

    try {

        form.find(".mix-spec-podset-label").each(function() {

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


        form.find(".mix-spec-podset-box").each(function() {

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
            }

            if (!inCpSpec.keyreg.test(box.meta.name)) {
                throw "Invalid Box Name";
            }

            $(this).find(".mix-spec-podset-box-port").each(function() {

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
        return l4i.InnerAlert(alert_id, 'error', err);
    }

    // console.log(req);

    $(alert_id).hide();

    inCp.ApiCmd("spec/pod-set", {
        method: "POST",
        data: JSON.stringify(req),
        success: function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodSpec") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpSpec.PodList();
            }, 500);
        },
        error: function(xhr, textStatus, error) {
            l4i.InnerAlert(alert_id, 'error', textStatus + ' ' + xhr.responseText);
        }
    });
}


