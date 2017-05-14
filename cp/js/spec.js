var losCpSpec = {
    statusls : [
        {phase: "Active", title: "Active"},
        {phase: "Suspend", title: "Suspend"},
    ],
    boxImageSpecs : [{
        distName : "CentOS 6",
        dist     : "el6",
        arch     : "x64",
    }, {
        distName : "CentOS 7",
        dist     : "el7",
        arch     : "x64",
    }],
    boxSpecDef : {
        meta : {
            id : "",
            name : "",
        },
        ports : [],
        image : null,
        resource : null,
    },
    boxImageDef : {
        meta : {
            id : "",
            name : "",
        },
        driver : "docker",
        spec : {
            dist : "el7",
            arch : "x64",
        },
        status : {
            phase : "Active",
        }
    },
    boxQuotaDef : {
        meta : {
            id : "",
            name : "",
        },
        phase : "Active",
        mem_size  : 100,
        cpu_num   : 100,
        stor_size : 100,
    },
    podDef : {
        meta : {
            id : "",
            name : "",
        },
        phase : "Active",
        volumes : [],
        boxes : [],
    },
    _boxImages : null,
    _boxQuotas : null,
    keyreg : /^[A-Za-z]\w{2,30}$/,
}

losCpSpec.Index = function()
{
    losCp.WorkLoader("-/spec/index");
}

losCpSpec.ImageList = function()
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (tpl) {
                $("#work-content-spec").html(tpl);
            }

            if (data === undefined || data.kind != "BoxImageList") {
                return l4i.InnerAlert("#mix-spec-image-alert", 'alert-danger', "Item Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            $("#mix-spec-images-alert").hide();


            l4iTemplate.Render({
                dstid : "mix-spec-images",
                tplid : "mix-spec-images-tpl",
                data  : data,
            });
        });

        ep.fail(function (err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        losCp.TplFetch("-/spec/image-list", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("spec/image-list", {
            callback: ep.done("data"),
        });
    });
}


losCpSpec.ImageSetForm = function(imageid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(losCpSpec.boxImageDef)
            }

            if (!rsj.kind || rsj.kind != "BoxImage") {
                rsj = l4i.Clone(losCpSpec.boxImageDef);
            }

            rsj._statusls = losCpSpec.statusls;
            rsj._specs = losCpSpec.boxImageSpecs;

            l4iModal.Open({
                title  : "Box Image Spec Setting",
                tplsrc : tpl,
                data   : rsj,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "losCpSpec.ImageSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:mix-spec-imageset)");
        });

        // template
        losCp.TplFetch("-/spec/image-set", {
            callback: ep.done("tpl"),
        });

        // data
        if (!imageid) {
            ep.emit("data", null);
        } else {
            losCp.ApiCmd("spec/image-entry?imageid="+ imageid, {
                callback: ep.done("data"),
            });
        }
    });
}

losCpSpec.ImageSetCommit = function()
{
    var form = $("#mix-spec-image-form");

    var req = {
        meta : {
            id : form.find("input[name=meta_id]").val(),
            name : form.find("input[name=meta_name]").val(),
        },
        status : {
            phase : form.find("input[name=status_phase]:checked").val(),
        },
        spec : {
            dist : form.find("input[name=spec_dist]:checked").val(),
        }
    };

    losCp.ApiCmd("spec/image-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert("#mix-spec-imageset-alert", 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert("#mix-spec-imageset-alert", 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "BoxImage") {
                return l4i.InnerAlert("#mix-spec-imageset-alert", 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert("#mix-spec-imageset-alert", 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpSpec.ImageList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert("#mix-spec-imageset-alert", 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}



losCpSpec.QuotaList = function()
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (tpl) {
                $("#work-content-spec").html(tpl);
            }

            if (data === undefined || data.kind != "BoxQuotaList") {
                return l4i.InnerAlert("#mix-spec-quotas-alert", 'alert-danger', "Item Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            $("#mix-spec-quotas-alert").hide();


            l4iTemplate.Render({
                dstid : "mix-spec-quotas",
                tplid : "mix-spec-quotas-tpl",
                data  : data,
            });
        });

        ep.fail(function (err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        losCp.TplFetch("-/spec/quota-list", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("spec/quota-list", {
            callback: ep.done("data"),
        });
    });
}


losCpSpec.QuotaSetForm = function(quotaid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(losCpSpec.boxQuotaDef)
            }

            if (!rsj.kind || rsj.kind != "BoxQuota") {
                rsj = l4i.Clone(losCpSpec.boxQuotaDef);
            }

            rsj._statusls = losCpSpec.statusls;

            l4iModal.Open({
                title  : "Box Quota Spec Setting",
                tplsrc : tpl,
                data   : rsj,
                width  : 700,
                height : 500,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "losCpSpec.QuotaSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:mix-spec-quotaset)");
        });

        // template
        losCp.TplFetch("-/spec/quota-set", {
            callback: ep.done("tpl"),
        });

        // data
        if (!quotaid) {
            ep.emit("data", null);
        } else {
            losCp.ApiCmd("spec/quota-entry?quotaid="+ quotaid, {
                callback: ep.done("data"),
            });
        }
    });
}

losCpSpec.QuotaSetCommit = function()
{
    var form = $("#mix-spec-quota-form");

    var req = {
        meta : {
            id : form.find("input[name=meta_id]").val(),
            name : form.find("input[name=meta_name]").val(),
        },
        phase : form.find("input[name=phase]:checked").val(),
        mem_size : parseInt(form.find("input[name=mem_size]").val()),
        cpu_num : parseInt(form.find("input[name=cpu_num]").val()),
        stor_size : parseInt(form.find("input[name=stor_size]").val()),
    };

    losCp.ApiCmd("spec/quota-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert("#mix-spec-quotaset-alert", 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert("#mix-spec-quotaset-alert", 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "BoxQuota") {
                return l4i.InnerAlert("#mix-spec-quotaset-alert", 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert("#mix-spec-quotaset-alert", 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpSpec.QuotaList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert("#mix-spec-quotaset-alert", 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}

//
losCpSpec.PodList = function()
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (tpl) {
                $("#work-content-spec").html(tpl);
            }

            if (data === undefined || data.kind != "PodSpecList") {
                return l4i.InnerAlert("#mix-spec-pods-alert", 'alert-danger', "Item Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            $("#mix-spec-pods-alert").hide();

            // console.log(data);


            l4iTemplate.Render({
                dstid : "mix-spec-pods",
                tplid : "mix-spec-pods-tpl",
                data  : data,
            });
        });

        ep.fail(function (err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        losCp.TplFetch("-/spec/pod-list", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("spec/pod-list", {
            callback: ep.done("data"),
        });
    });
}


losCpSpec.PodSetForm = function(podid)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "images", "quotas", "data", function (tpl, images, quotas, rsj) {

            if (!rsj) {
                rsj = l4i.Clone(losCpSpec.podDef)
            }

            if (!rsj.kind || rsj.kind != "PodSpec") {
                rsj = l4i.Clone(losCpSpec.podDef);
            }

            losCpSpec._boxQuotas = quotas;
            losCpSpec._boxImages = images;

            rsj._statusls = losCpSpec.statusls;
            rsj._quotas = quotas;
            rsj._images = images;

            // console.log(rsj);

            l4iModal.Open({
                title  : "Pod Spec Setting",
                tplsrc : tpl,
                // data   : rsj,
                width  : 980,
                height : 600,
                buttons: [{
                    onclick : "l4iModal.Close()",
                    title   : "Close",
                }, {
                    onclick : "losCpSpec.PodSetCommit()",
                    title   : "Save",
                    style   : "btn btn-primary",
                }],
                success : function() {

                    l4iTemplate.Render({
                        dstid  : "mix-spec-podset",
                        tplid  : "mix-spec-podset-tpl",
                        data   : rsj,
                        success : function() {

                            if (!rsj.labels || rsj.labels.length < 1) {
                                losCpSpec.PodSetLabelAppend();
                            }

                            if (rsj.boxes && rsj.boxes.length > 0) {

                                for (var i in rsj.boxes) {
                                    losCpSpec.PodSetBoxAppend(rsj.boxes[i]);
                                }

                            } else {
                                 losCpSpec.PodSetBoxAppend();
                            }

                        },
                    });
                },
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:mix-spec-podset)");
        });

        // template
        losCp.TplFetch("-/spec/pod-set", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("spec/image-list", {
            callback: ep.done("images"),
        });

        losCp.ApiCmd("spec/quota-list", {
            callback: ep.done("quotas"),
        });

        // data
        if (!podid) {
            ep.emit("data", null);
        } else {
            losCp.ApiCmd("spec/pod-entry?podid="+ podid, {
                callback: ep.done("data"),
            });
        }
    });
}

losCpSpec.PodSetLabelAppend = function()
{
    l4iTemplate.Render({
        append : true,
        dstid  : "mix-spec-podset-labels",
        tplid  : "mix-spec-podset-label-tpl",
    });
}

losCpSpec.PodSetLabelDel = function(field)
{
    $(field).parent().parent().remove();
}

losCpSpec.PodSetBoxAppend = function(box)
{
    if (!box) {
        box = l4i.Clone(losCpSpec.boxSpecDef);
        box.resource = l4i.Clone(losCpSpec.boxQuotaDef);
        box.image    = l4i.Clone(losCpSpec.boxImageDef);
    }

    box._images = losCpSpec._boxImages;
    box._quotas = losCpSpec._boxQuotas;

    box._rowid  = Math.random().toString(16).slice(2);

    l4iTemplate.Render({
        append : true,
        dstid  : "mix-spec-podset-boxes",
        tplid  : "mix-spec-podset-box-tpl",
        data   : box,
        success : function() {

            if (!box.ports || box.ports.length < 1) {
                losCpSpec.PodSetBoxPortAppend(box._rowid);
            }
        },
    });
}

losCpSpec.PodSetBoxDel = function(rowid)
{
    $("#mix-spec-podset-box-" + rowid).remove();
}

losCpSpec.PodSetBoxPortAppend = function(rowid)
{
    l4iTemplate.Render({
        append : true,
        dstid  : "mix-spec-podset-box-ports-"+ rowid,
        tplid  : "mix-spec-podset-box-port-tpl",
    });
}

losCpSpec.PodSetBoxPortDel = function(field)
{
    $(field).parent().parent().remove();
}

losCpSpec.PodSetCommit = function()
{
    var form = $("#mix-spec-podset");

    var req = {
        meta : {
            id : form.find("input[name=meta_id]").val(),
            name : form.find("input[name=meta_name]").val(),
        },
        phase : form.find("input[name=phase]:checked").val(),
        labels : [],
        boxes  : [],
    };

    if (!losCpSpec.keyreg.test(req.meta.name)) {
        return l4i.InnerAlert("#mix-spec-podset-alert", 'alert-danger', "Invalid Pod Name");
    }

    try {

        form.find(".mix-spec-podset-label").each(function() {

            var key = $(this).find("input[name=label_key]").val();
            var val = $(this).find("input[name=label_value]").val();

            if (!key || key.length < 1) {
                return;
            }

            if (!losCpSpec.keyreg.test(key)) {
                throw "Invalid Lable Key";
            }

            req.labels.push({
                key: key,
                val: val,
            });
        });


        form.find(".mix-spec-podset-box").each(function() {

            var box = {
                meta : {
                    id   : $(this).find("input[name=box_id]").val(),
                    name : $(this).find("input[name=box_name]").val(),
                },
                image : {
                    meta : {
                        id : $(this).find("select[name=spec_image_id]").val(),
                    },
                },
                resource : {
                    meta : {
                        id : $(this).find("select[name=spec_quota_id]").val(),
                    },
                },
                ports : [],
            }

            if (!losCpSpec.keyreg.test(box.meta.name)) {
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

            req.boxes.push(box);
        });

    } catch (err) {
        return l4i.InnerAlert("#mix-spec-podset-alert", 'alert-danger', err);
    }

    // console.log(req);

    $("#mix-spec-podset-alert").hide();

    losCp.ApiCmd("spec/pod-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        success : function(rsj) {

            if (!rsj) {
                return l4i.InnerAlert("#mix-spec-podset-alert", 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert("#mix-spec-podset-alert", 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "PodSpec") {
                return l4i.InnerAlert("#mix-spec-podset-alert", 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert("#mix-spec-podset-alert", 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpSpec.PodList();
            }, 500);
        },
        error : function(xhr, textStatus, error) {
            l4i.InnerAlert("#mix-spec-podset-alert", 'alert-danger', textStatus+' '+xhr.responseText);
        }
    });
}


