var inCpResDomain = {
    op_actions: [
        {
            action: 1,
            title: "Start"
        },
        {
            action: 2,
            title: "Stop"
        },
        {
            action: 3,
            title: "Destroy"
        },
    ],
    inst_active: null,
    bound_basepath_re: /^[0-9a-zA-Z.-~\/]{1,30}$/,
    bound_podid_re: /^[0-9a-f]{16,20}$/,
    boundset_def: {
        action: 1,
        value: "pod:",
        _name: "/",
        _podid: "",
        _boxport: "",
        _upstream: "",
        _redirect_url: "",
    },
    bound_types: [{
        title: "Pod/BoxPort",
        type: "pod",
    }, {
        title: "IP/Port",
        type: "upstream",
    }, {
        title: "Redirect",
        type: "redirect",
    }],
}

inCpResDomain.List = function() {
    var uri = "?type=domain";
    uri += "&fields=meta/id|name|updated,description,bounds/name,operate/app_id,action";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            inCp.OpToolsRefresh("#incp-resdomain-optools");

            var alert_id = "#incp-resdomain-list-alert";

            if (data.error || !data.kind || data.kind != "ResourceList") {

                if (data.error) {
                    return l4i.InnerAlert(alert_id, 'error', data.error.message);
                }

                return l4i.InnerAlert(alert_id, 'error', "Items Not Found");
            }

            if (!data.items) {
                data.items = [];
            }

            for (var i in data.items) {

                if (!data.items[i].action) {
                    data.items[i].action = "ok";
                }
                if (!data.items[i].description) {
                    data.items[i].description = "";
                }
                if (!data.items[i].operate) {
                    data.items[i].operate = {};
                }
                if (!data.items[i].operate.app_id) {
                    data.items[i].operate.app_id = "-";
                }
                if (!data.items[i].bounds) {
                    data.items[i].bounds = [];
                }

                data.items[i]._name = data.items[i].meta.name.substr("domain/".length);
            }

            $(alert_id).hide();

            l4iTemplate.Render({
                dstid: "incp-resdomain-list",
                tplid: "incp-resdomain-list-tpl",
                data: data,
                callback: function(err) {
                    if (err) {
                        return;
                    }
                },
            });
        });

        ep.fail(function(err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        inCp.TplFetch("res/domain-list", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("resource/list" + uri, {
            callback: ep.done("data"),
        });
    });
}

inCpResDomain.New = function() {
    l4iModal.Open({
        title: "Domain Add",
        tpluri: inCp.TplPath("res/domain-new"),
        width: 600,
        height: 400,
        buttons: [{
            title: "Cancel",
            onclick: "l4iModal.Close()",
        }, {
            title: "Save",
            onclick: 'inCpResDomain.NewCommit()',
            style: "btn-primary",
        }],
    });
}

inCpResDomain.NewCommit = function() {
    var form = $("#incp-resdomain-new-form");
    var alert_id = "#incp-resdomain-new-alert";

    if (!form) {
        return;
    }

    var req = {
        meta: {
            name: form.find("input[name=meta_name]").val(),
        },
    };

    inCp.ApiCmd("resource/domain-new", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Resource") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpResDomain.List();
            }, 500);
        }
    });
}

inCpResDomain.Set = function(name) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            // if (tpl) {
            //     $("#work-content").html(tpl);
            // }

            var alert_id = "#incp-resdomain-set-alert";

            if (!data || data.error || !data.kind || data.kind != "Resource") {

                if (data.error) {
                    return l4i.InnerAlert(alert_id, 'error', data.error.message);
                }

                return l4i.InnerAlert(alert_id, 'error', "Item Not Found");
            }

            if (!data.action) {
                data.action = "ok";
            }
            if (!data.description) {
                data.description = "";
            }

            data._name = data.meta.name.substr("domain/".length);

            l4iModal.Open({
                title: "Domain Set",
                tplsrc: tpl,
                width: 600,
                height: 400,
                data: data,
                buttons: [{
                    title: "Cancel",
                    onclick: "l4iModal.Close()",
                }, {
                    title: "Save",
                    onclick: 'inCpResDomain.SetCommit()',
                    style: "btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        inCp.TplFetch("res/domain-set", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("resource/domain?name=" + name, {
            callback: ep.done("data"),
        });
    });
}

inCpResDomain.SetCommit = function() {
    var form = $("#incp-resdomain-set-form");
    var alert_id = "#incp-resdomain-set-alert";

    if (!form) {
        return;
    }

    var req = {
        meta: {
            name: form.find("input[name=meta_name]").val(),
            user: form.find("input[name=meta_user]").val(),
        },
        description: form.find("input[name=description]").val(),
    };

    inCp.ApiCmd("resource/domain-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Resource") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpResDomain.List();
            }, 500);
        }
    });
}


inCpResDomain.BoundList = function(name) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            var alert_id = "#incp-resdomain-boundlist-alert";

            if (!data || data.error || !data.kind || data.kind != "Resource") {

                if (data.error) {
                    return alert(data.error.message);
                // return l4i.InnerAlert(alert_id, 'error', data.error.message);
                }

                return alert("Resource Not Found");
            // return l4i.InnerAlert(alert_id, 'error', "Item Not Found");
            }

            if (!data.action) {
                data.action = "ok";
            }
            if (!data.description) {
                data.description = "";
            }
            if (!data.bounds) {
                data.bounds = [];
            }
            for (var i in data.bounds) {
                data.bounds[i]._name = data.bounds[i].name.substr("domain/basepath".length);
                if (data.bounds[i]._name == "") {
                    data.bounds[i]._name = "/";
                }
                if (!data.bounds[i]._type) {
                    data.bounds[i]._type = "pod";
                }

                var vpi = data.bounds[i].value.indexOf(":");
                if (vpi > 1) {

                    switch (data.bounds[i].value.substr(0, vpi)) {
                        case "pod":
                            break;

                        case "upstream":
                            break;

                        case "redirect":
                            break;

                        default:
                    // TODO
                    }
                    data.bounds[i]._value = data.bounds[i].value.substr(vpi + 1);
                    data.bounds[i]._type = data.bounds[i].value.substr(0, vpi);
                } else {
                    data.bounds[i]._value = "";
                    data.bounds[i]._type = "pod";
                }
            }

            data._name = data.meta.name.substr("domain/".length);
            inCpResDomain.inst_active = l4i.Clone(data);

            data._actions = inCpResDomain.op_actions;
            data._types = inCpResDomain.bound_types;

            l4iModal.Open({
                id: "incp-resdomain-boundlist-modal",
                title: "Domain Bounds",
                tplsrc: tpl,
                width: 900,
                height: 600,
                buttons: [{
                    title: "Cancel",
                    onclick: "l4iModal.Close()",
                }, {
                    title: "Binding New",
                    onclick: 'inCpResDomain.BoundSet()',
                    style: "btn-primary",
                }],
                success: function() {

                    if (data.bounds.length == 0) {
                        return l4i.InnerAlert(alert_id, 'alert-info', "No Resource Bound");
                    }

                    l4iTemplate.Render({
                        dstid: "incp-resdomain-boundlist",
                        tplid: "incp-resdomain-boundlist-tpl",
                        data: data,
                    });
                },
            });
        });

        ep.fail(function(err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        inCp.TplFetch("res/domain-bound-list", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("resource/domain?name=" + name, {
            callback: ep.done("data"),
        });
    });
}


inCpResDomain.BoundSet = function(name) {
    if (!inCpResDomain.inst_active) {
        return;
    }

    var bound = null;
    if (name) {

        for (var i in inCpResDomain.inst_active.bounds) {
            if (inCpResDomain.inst_active.bounds[i].name == name) {
                bound = l4i.Clone(inCpResDomain.inst_active.bounds[i]);
                break;
            }
        }
    }
    if (!bound) {
        bound = l4i.Clone(inCpResDomain.boundset_def);
    }
    if (!bound.value) {
        bound.value = "pod:";
    }
    var pi = bound.value.indexOf(":");
    if (pi < 2) {
        pi = bound.value.indexOf("/");
    // TODO return;
    }
    if (pi < 2) {
        return;
    }

    bound._type = bound.value.substr(0, pi);
    bound._value = bound.value.substr(pi + 1);

    switch (bound._type) {
        case "pod":
            var values = bound._value.split(":");
            if (values.length != 2) {
                values = bound._value.split("/"); // TODO
            }
            if (values.length == 2) {
                bound._podid = values[0];
                bound._boxport = values[1];
            }
            break;

        case "upstream":
            break;

        case "redirect":
            break;

        default:
            return;
    }

    if (!bound._podid) {
        bound._podid = "";
        bound._boxport = "";
    }
    if (!bound._value) {
        bound._value = "";
    }

    bound._actions = inCpResDomain.op_actions;
    bound._types = inCpResDomain.bound_types;

    inCpResDomain.inst_active_bound = bound;

    l4iModal.Open({
        id: "incp-resdomain-boundset-modal",
        title: "Binding",
        tpluri: inCp.TplPath("res/domain-bound-set"),
        data: bound,
        callback: function(err, data) {
            $("#incp-resdomain-boundset-type-" + bound._type).css({
                "display": "block"
            });
        },
        buttons: [{
            title: "Cancel",
            onclick: "l4iModal.Close()",
        }, {
            title: "Save",
            onclick: 'inCpResDomain.BoundSetCommit()',
            style: "btn-primary",
        }],
    });
}

inCpResDomain.BoundSetTypeOnChange = function(elem) {
    if (!inCpResDomain.inst_active_bound) {
        return;
    }

    if (!elem) {
        return;
    }

    var typeid = $(elem).val();
    if (inCpResDomain.inst_active_bound._type == typeid) {
        return;
    }

    $("#incp-resdomain-boundset-type-" + inCpResDomain.inst_active_bound._type).css({
        "display": "none"
    });
    $("#incp-resdomain-boundset-type-" + typeid).css({
        "display": "block"
    });

    inCpResDomain.inst_active_bound._type = typeid;
}

inCpResDomain.BoundSetCommit = function() {
    var alert_id = "#incp-resdomain-boundset-alert";

    var form = $("#incp-resdomain-boundset-form");
    if (!form) {
        return;
    }

    var req = {
        meta: {
            name: inCpResDomain.inst_active.meta.name,
        },
        bounds: [],
    }

    try {
        var basepath = form.find("input[name=bound_basepath]").val();
        if (!basepath || !inCpResDomain.bound_basepath_re.test(basepath)) {
            throw "Invalid BaseURI";
        }

        var action = parseInt(form.find("input[name=bound_action]:checked").val());
        if (action < 1) {
            throw "Invalid Action";
        }

        var type = form.find("select[name=type]").val();
        if (!type) {
            throw "Invalid Type";
        }

        var value = "";
        switch (type) {
            case "pod":
                var podid = form.find("input[name=bound_podid]").val();
                if (!podid || !inCpResDomain.bound_podid_re.test(podid)) {
                    throw "Invalid Pod ID";
                }

                var port = parseInt(form.find("input[name=bound_boxport]").val());
                if (port < 1 || port > 65535) {
                    throw "Invalid Box Port";
                }
                value = "pod:" + podid + ":" + port;
                break;

            case "upstream":
                value = "upstream:" + form.find("input[name=bound_upstream]").val();
                break;

            case "redirect":
                value = "redirect:" + form.find("input[name=bound_redirect]").val();
                break;
        }

        req.bounds.push({
            name: "domain/basepath/" + basepath,
            value: value,
            action: action,
        });

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'error', err);
    }

    inCp.ApiCmd("resource/domain-bound", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Resource") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            inCpResDomain.inst_active = null;
            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpResDomain.List();
            }, 500);
        }
    });
}


inCpResDomain.Deploy = function(name) {
    if (!name) {
        return;
    }
    inCp.ApiCmd("resource/domain?name=" + name, {
        callback: function(err, data) {
            if (err || !data.kind) {
                return;
            }
            inCpResDomain.inst_active = data;
            // return inCpResDomain.DeploySelectApp();
            if (!data.operate.app_id || data.operate.app_id.length < 16) {
                inCpResDomain.DeploySelectApp();
            } else {
                inCpResDomain.DeployWizard(name);
            }
        },
    });
}

inCpResDomain.DeployWizard = function(name) {
    l4iModal.Open({
        id: "incp-resdomain-deploy",
        title: "Resource Domain Deploy Wizard",
        width: 800,
        height: 300,
        tpluri: inCp.TplPath("res/domain-deploy"),
        callback: function(err, data) {
            l4iTemplate.Render({
                dstid: "incp-resdomain-deploy-wizard",
                tplid: "incp-resdomain-deploy-wizard-tpl",
                data: {
                    _app_id: inCpResDomain.inst_active.operate.app_id,
                },
            });
        },
        buttons: [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }, {
            onclick: "inCpResDomain.DeployCommit()",
            title: "Next",
            style: "btn-primary",
        }],
    });
}

inCpResDomain.DeploySelectApp = function(name) {
    if (!inCpResDomain.inst_active) {
        return;
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "inst", function(tpl, inst) {

            if (!inst || !inst.kind || inst.kind != "AppList") {
                return alert("AppInst error, Please try again later (EC:incp-appset)");
            }

            l4iModal.Open({
                title: "Select a App to Deploy",
                width: 800,
                height: 400,
                tplsrc: tpl,
                callback: function(err) {
                    if (err) {
                        return;
                    }
                    l4iTemplate.Render({
                        dstid: "incp-appls-selector",
                        tplid: "incp-appls-selector-tpl",
                        data: inst,
                    });
                },
                fn_selector: function(err, data) {
                    if (err || !data || data.length < 16) {
                        return;
                    }
                    inCpResDomain.inst_active.operate.app_id = data;
                    inCpResDomain.DeployCommit();
                },
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
            });
        });

        ep.fail(function(err) {
            alert("SpecSet error, Please try again later (EC:incp-appset)");
        });

        // template
        inCp.TplFetch("app/inst/selector", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("app/list-op-res?res_type=domain", {
            callback: ep.done("inst"),
        });
    });
}

inCpResDomain.DeployCommit = function() {
    if (!inCpResDomain.inst_active || !inCpResDomain.inst_active.operate.app_id) {
        return;
    }

    var alert_id = "#incp-resdomain-list-alert";
    var req = {
        meta: {
            name: inCpResDomain.inst_active.meta.name,
        },
        operate: {
            app_id: inCpResDomain.inst_active.operate.app_id,
        },
    }

    inCp.ApiCmd("app/op-res-set", {
        method: "POST",
        data: JSON.stringify(req),
        timeout: 3000,
        callback: function(err, rsj) {

            l4iModal.Close();

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Failed");
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'error', msg);
            }

            l4i.InnerAlert(alert_id, 'ok', "Successful operation");

            window.setTimeout(function() {
                inCpResDomain.inst_active = null;
                inCpResDomain.List();
            }, 1000);
        }
    });
}

