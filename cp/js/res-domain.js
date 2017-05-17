var losCpResDomain = {
    op_actions : [
        {action: 1, title: "Start"},
        {action: 2, title: "Stop"},
        {action: 3, title: "Destroy"},
    ],
    instances : [], // cache
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

losCpResDomain.List = function()
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            losCp.OpToolsRefresh("#loscp-resdomain-optools");

            var alert_id = "#loscp-resdomain-list-alert";

            if (data.error || !data.kind || data.kind != "ResourceList") {

                if (data.error) {
                    return l4i.InnerAlert(alert_id, 'alert-danger', data.error.message);
                }

                return l4i.InnerAlert(alert_id, 'alert-danger', "Items Not Found");
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

            losCpResDomain.instances = data.items;

            $(alert_id).hide();

            l4iTemplate.Render({
                dstid : "loscp-resdomain-list",
                tplid : "loscp-resdomain-list-tpl",
                data  : data,
                callback: function(err) {
                    if (err) {
                        return;
                    }
                },
            });
        });

        ep.fail(function (err) {
            alert("ListRefresh error, Please try again later (EC:001)");
        });

        losCp.TplFetch("res/domain-list", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("resource/list?type=domain", {
            callback: ep.done("data"),
        });
    });
}

losCpResDomain.New = function()
{
    l4iModal.Open({
        title  : "Domain Add",
        tpluri : losCp.TplPath("res/domain-new"),
        width  : 600,
        height : 400,
        buttons: [{
            title: "Cancel",
            onclick : "l4iModal.Close()",
        }, {
            title: "Save",
            onclick : 'losCpResDomain.NewCommit()',
            style   : "btn-primary",
        }],
    });
}

losCpResDomain.NewCommit = function()
{
    var form = $("#loscp-resdomain-new-form");
    var alert_id = "#loscp-resdomain-new-alert";

    if (!form) {
        return;
    }

    var req = {
        meta : {
            name : form.find("input[name=meta_name]").val(),
        },
    };

    losCp.ApiCmd("resource/domain-new", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Resource") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpResDomain.List();
            }, 500);
        }
    });
}

losCpResDomain.Set = function(name)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            // if (tpl) {
            //     $("#work-content").html(tpl);
            // }

            var alert_id = "#loscp-resdomain-set-alert";

            if (!data || data.error || !data.kind || data.kind != "Resource") {

                if (data.error) {
                    return l4i.InnerAlert(alert_id, 'alert-danger', data.error.message);
                }

                return l4i.InnerAlert(alert_id, 'alert-danger', "Item Not Found");
            }

            if (!data.action) {
                data.action = "ok";
            }
            if (!data.description) {
                data.description = "";
            }

            data._name = data.meta.name.substr("domain/".length);

            l4iModal.Open({
                title  : "Domain Set",
                tplsrc : tpl,
                width  : 600,
                height : 400,
                data   : data,
                buttons: [{
                    title: "Cancel",
                    onclick : "l4iModal.Close()",
                }, {
                    title: "Save",
                    onclick : 'losCpResDomain.SetCommit()',
                    style   : "btn-primary",
                }],
            });
        });

        ep.fail(function (err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        losCp.TplFetch("res/domain-set", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("resource/domain?name="+ name, {
            callback: ep.done("data"),
        });
    });
}

losCpResDomain.SetCommit = function()
{
    var form = $("#loscp-resdomain-set-form");
    var alert_id = "#loscp-resdomain-set-alert";

    if (!form) {
        return;
    }

    var req = {
        meta : {
            name : form.find("input[name=meta_name]").val(),
        },
        description: form.find("input[name=description]").val(),
    };

    losCp.ApiCmd("resource/domain-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Resource") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpResDomain.List();
            }, 500);
        }
    });
}


losCpResDomain.BoundList = function(name)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            var alert_id = "#loscp-resdomain-boundlist-alert";

            if (!data || data.error || !data.kind || data.kind != "Resource") {

                if (data.error) {
                    return alert(data.error.message);
                    // return l4i.InnerAlert(alert_id, 'alert-danger', data.error.message);
                }

                return alert("Resource Not Found");
                // return l4i.InnerAlert(alert_id, 'alert-danger', "Item Not Found");
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
            losCpResDomain.inst_active = l4i.Clone(data);

            data._actions = losCpResDomain.op_actions;
            data._types = losCpResDomain.bound_types;

            l4iModal.Open({
                id:      "loscp-resdomain-boundlist-modal",
                title  : "Domain Bounds",
                tplsrc : tpl,
                width  : 900,
                height : 500,
                buttons: [{
                    title: "Cancel",
                    onclick : "l4iModal.Close()",
                }, {
                    title: "Binding New",
                    onclick : 'losCpResDomain.BoundSet()',
                    style   : "btn-primary",
                }],
                success: function() {

                    if (data.bounds.length == 0) {
                        return l4i.InnerAlert(alert_id, 'alert-info', "No Resource Bound");
                    }

                    l4iTemplate.Render({
                        dstid : "loscp-resdomain-boundlist",
                        tplid : "loscp-resdomain-boundlist-tpl",
                        data  : data,
                    });
                },
            });
        });

        ep.fail(function (err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        losCp.TplFetch("res/domain-bound-list", {
            callback: ep.done("tpl"),
        });

        var domain_entry = null;
        if (losCpResDomain.instances && losCpResDomain.instances.length > 0) {

            for (var i in losCpResDomain.instances) { 
                if (losCpResDomain.instances[i]._name == name) {
                    domain_entry = losCpResDomain.instances[i];
                    domain_entry.kind = "Resource";
                    break;
                }
            }
        }
        if (domain_entry) {
            ep.emit("data", domain_entry);
        } else {
            losCp.ApiCmd("resource/domain?name="+ name, {
                callback: ep.done("data"),
            });
        }
    });
}


losCpResDomain.BoundSet = function(name)
{
    if (!losCpResDomain.inst_active) {
        return;
    }

    var bound = null;
    if (name) {
        
        for (var i in losCpResDomain.inst_active.bounds) {
            if (losCpResDomain.inst_active.bounds[i].name == name) {
                bound = l4i.Clone(losCpResDomain.inst_active.bounds[i]);
                break;
            }
        }
    }
    if (!bound) {
        bound = l4i.Clone(losCpResDomain.boundset_def);
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
        bound._podid   = "";
        bound._boxport = "";
    }
    if (!bound._value) {
        bound._value = "";
    }

    bound._actions = losCpResDomain.op_actions;
    bound._types = losCpResDomain.bound_types;

    losCpResDomain.inst_active_bound = bound;

    l4iModal.Open({
        id     : "loscp-resdomain-boundset-modal",
        title  : "Binding",
        tpluri : losCp.TplPath("res/domain-bound-set"),
        data   : bound,
        callback: function(err, data) {
            $("#loscp-resdomain-boundset-type-"+ bound._type).css({"display": "block"});
        },
        buttons: [{
            title: "Cancel",
            onclick : "l4iModal.Close()",
        }, {
            title: "Save",
            onclick : 'losCpResDomain.BoundSetCommit()',
            style   : "btn-primary",
        }],
    });
}

losCpResDomain.BoundSetTypeOnChange = function(elem)
{
    if (!losCpResDomain.inst_active_bound) {
        return;
    }

    if (!elem) {
        return;
    }

    var typeid = $(elem).val();
    if (losCpResDomain.inst_active_bound._type == typeid) {
        return;
    }

    $("#loscp-resdomain-boundset-type-"+ losCpResDomain.inst_active_bound._type).css({"display": "none"});
    $("#loscp-resdomain-boundset-type-"+ typeid).css({"display": "block"});

    losCpResDomain.inst_active_bound._type = typeid;
}

losCpResDomain.BoundSetCommit = function()
{
    var alert_id = "#loscp-resdomain-boundset-alert";

    var form = $("#loscp-resdomain-boundset-form");
    if (!form) {
        return;
    }

    var req = {
        meta : {
            name: losCpResDomain.inst_active.meta.name,
        },
        bounds: [],
    }

    try {
        var basepath = form.find("input[name=bound_basepath]").val();
        if (!basepath || !losCpResDomain.bound_basepath_re.test(basepath)) {
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
            if (!podid || !losCpResDomain.bound_podid_re.test(podid)) {
                throw "Invalid Pod ID";
            }

            var port = parseInt(form.find("input[name=bound_boxport]").val());
            if (port < 1 || port > 65535) {
                throw "Invalid Box Port";
            }
            value = "pod:"+ podid +":"+ port;
            break;

        case "upstream":
            value = "upstream:"+ form.find("input[name=bound_upstream]").val();
            break;

        case "redirect":
            value = "redirect:"+ form.find("input[name=bound_redirect]").val();
            break;
        }

        req.bounds.push({
            name:   "domain/basepath/"+ basepath,
            value:  value,
            action: action,
        });

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    losCp.ApiCmd("resource/domain-bound", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "Resource") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            losCpResDomain.inst_active = null;
            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpResDomain.List();
            }, 500);
        }
    });
}


losCpResDomain.Deploy = function(name)
{
    if (!name || !losCpResDomain.instances) {
        return;
    }

    var inst = null;

    for (var i in losCpResDomain.instances) {

        if (name == losCpResDomain.instances[i]._name) {
            inst = l4i.Clone(losCpResDomain.instances[i]);
            break;
        }
    }

    if (!inst) {
        return;
    }

    losCpResDomain.inst_active = inst;

    if (!inst.operate.app_id || inst.operate.app_id.length < 16) {
        losCpResDomain.DeploySelectApp();
    } else {
        losCpResDomain.DeployWizard(name);
    }
}

losCpResDomain.DeployWizard = function(name)
{
    l4iModal.Open({
        id     : "loscp-resdomain-deploy",
        title  : "Resource Domain Deploy Wizard",
        width  : 800,
        height : 300,
        tpluri : losCp.TplPath("res/domain-deploy"),
        callback : function(err, data) {
            l4iTemplate.Render({
                dstid: "loscp-resdomain-deploy-wizard",
                tplid: "loscp-resdomain-deploy-wizard-tpl",
                data:  {
                    _app_id: losCpResDomain.inst_active.operate.app_id,
                },
            });
        },
        buttons : [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }, {
            onclick: "losCpResDomain.DeployCommit()",
            title: "Next",
            style: "btn-primary",
        }],
    });
}
        
losCpResDomain.DeploySelectApp = function(name)
{    
    if (!losCpResDomain.inst_active || !losCpResDomain.inst_active.operate.app_id) {
        return;
    }

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "inst", function (tpl, inst) {

            if (!inst || !inst.kind || inst.kind != "AppList") {
                return alert("AppInst error, Please try again later (EC:loscp-app-instset)");
            }

            l4iModal.Open({
                title  : "Select a App to Deploy",
                width  : 800,
                height : 400,
                tplsrc : tpl,
                callback: function(err) {
                    if (err) {
                        return;
                    }
                    l4iTemplate.Render({
                        dstid : "loscp-appls-selector",
                        tplid : "loscp-appls-selector-tpl",
                        data  : inst,
                    });
                },
                fn_selector: function(err, data) {
                    if (err || !data || data.length < 16) {
                        return;
                    }
                    losCpResDomain.inst_active.operate.app_id = data;
                    losCpResDomain.DeployCommit();
                    l4iModal.Close();
                },
                buttons : [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:loscp-app-instset)");
        });

        // template
        losCp.TplFetch("app/inst/selector", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("app-inst/list-op-res?res_type=domain", {
            callback: ep.done("inst"),
        });
    });
}

losCpResDomain.DeployCommit = function()
{
    if (!losCpResDomain.inst_active || !losCpResDomain.inst_active.operate.app_id) {
        return;
    }

    var alert_id = "#loscp-resdomain-list-alert";
    var req = {
        meta: {
            name: losCpResDomain.inst_active.meta.name,
        },
        operate: {
            app_id: losCpResDomain.inst_active.operate.app_id,
        },
    }

    losCp.ApiCmd("app-inst/op-res-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        timeout : 3000,
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed");
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successful operation");

            window.setTimeout(function(){
                losCpResDomain.instances = null;
                losCpResDomain.inst_active = null;
                losCpResDomain.List();
                l4iModal.Close();
            }, 500);
        }
    });
}

