var inCpApp = {
    instDef: {
        kind: "App",
        meta: {
            id: "",
            name: ""
        },
        spec: {
            meta: {
                id: null,
                name: null
            }
        },
        operate: {
            pod_id: null,
            options: [],
            action: 1 << 1,
            res_bound_roles: [],
        },
    },
    instBoundPodDef: {
        meta: {
            id: null,
        },
        spec: {
            boxes: [],
        },
    },
    instSet: {},
    instDeployActive: null,
}

inCpApp.Index = function() {
    var divstr = "<div id='incp-module-navbar'>\
  <ul id='incp-app-navbar' class='incp-module-nav'>\
    <li><a class='l4i-nav-item' href='#app/inst/list'>App Instances</a></li>\
    <li><a class='l4i-nav-item' href='#app/spec/list'>Specs</a></li>\
  </ul>\
  <ul id='incp-module-navbar-optools' class='incp-module-nav incp-nav-right'></ul>\
</div>\
<div id='work-content'></div>";


    $("#comp-content").html(divstr);

    l4i.UrlEventRegister("app/inst/list", inCpApp.InstListRefresh, "incp-app-navbar");
    l4i.UrlEventRegister("app/spec/list", inCpAppSpec.ListRefresh, "incp-app-navbar");

    l4i.UrlEventHandler("app/inst/list", true);
}

inCpApp.InstLaunchNew = function() {
    l4i.UrlEventHandler("app/spec/list");
}

inCpApp.InstListRefresh = function() {
    var uri = "?";
    if (document.getElementById("qry_text")) {
        uri += "qry_text=" + $("#qry_text").val();
    }
    uri += "&fields=meta/id|name|updated,spec/meta/id|name|version,operate/action|pod_id,operate/options/name";

    var alert_id = "#incp-appls-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            inCp.OpToolsRefresh("#incp-appls-optools");

            if (!rsj || rsj.kind != "AppList"
                || !rsj.items || rsj.items.length < 1) {
                return l4i.InnerAlert(alert_id, 'alert-info', "Item Not Found");
            }
            $(alert_id).css({
                "display": "node"
            });

            for (var i in rsj.items) {
                if (!rsj.items[i].operate.pod_id || rsj.items[i].operate.pod_id.length < 8) {
                    rsj.items[i].operate.pod_id = "-";
                }
                if (!rsj.items[i].operate.options) {
                    rsj.items[i].operate.options = [];
                }
                if (!rsj.items[i].operate.action) {
                    rsj.items[i].operate.action = inCp.OpActionStop;
                }
            }

            l4iTemplate.Render({
                dstid: "incp-appls",
                tplid: "incp-appls-tpl",
                data: {
                    items: rsj.items,
                    _actions: inCp.OpActions,
                },
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("SpecListRefresh error, Please try again later (EC:app-speclist)");
        });

        // template
        var el = document.getElementById("incp-appls");
        if (!el || el.length < 1) {
            inCp.TplFetch("app/inst/list", {
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

        inCp.TplFetch("app/inst/list", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("app/list" + uri, {
            callback: ep.done("data"),
        });
    });
}


inCpApp.InstListOpActionChange = function(app_id, obj, tplid) {
    if (!app_id) {
        return;
    }
    var op_action = parseInt($(obj).val());
    if (op_action < 1) {
        return;
    }

    if (!tplid) {
        tplid = "incp-appls";
    }
    var alert_id = "#" + tplid + "-alert";

    var uri = "?app_id=" + app_id + "&op_action=" + op_action;

    inCp.ApiCmd("app/op-action-set" + uri, {
        method: "GET",
        timeout: 10000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "App") {
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


inCpApp.OpOptInfo = function(app_id) {
    var alert_id = "#incp-appinst-opopt-info-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (!rsj || rsj.kind != "App") {
                return l4i.InnerAlert(alert_id, 'alert-info', "Item Not Found");
            }

            if (!rsj.operate.options) {
                rsj.operate.options = [];
            }

            for (var i in rsj.spec.configurator) {

                var option = null;
                for (var j in rsj.operate.options) {
                    if (rsj.spec.configurator[i].name == rsj.operate.options[j].name) {
                        option = rsj.operate.options[j];
                        break;
                    }
                }

                for (var k in rsj.spec.configurator[i].fields) {
                    var name = rsj.spec.configurator[i].fields[k].name;
                    var auto_fill = rsj.spec.configurator[i].fields[k].auto_fill;
                    var value = null;
                    if (option) {
                        for (var m in option.items) {
                            if (option.items[m].name == name) {
                                value = option.items[m].value;
                                break;
                            }
                        }
                    }
                    if (!value) {
                        if (rsj.spec.configurator[i].fields[k].default) {
                            value = rsj.spec.configurator[i].fields[k].default;
                        } else {
                            value = "";
                        }
                    }
                    if (value == "" && auto_fill) {
                        value = auto_fill;
                    }
                    rsj.spec.configurator[i].fields[k]._value = value;
                }
            }

            l4iModal.Open({
                title: "App Options",
                width: 900,
                height: 600,
                tplsrc: tpl,
                data: rsj,
                callback: function(err, data) {},
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("SpecListRefresh error, Please try again later (EC:app-speclist)");
        });

        inCp.TplFetch("app/inst/op.opt.info", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("app/entry?id=" + app_id, {
            callback: ep.done("data"),
        });
    });
}


inCpApp.instConfiguratorCallback = null;
inCpApp.InstConfigurator = function(cb) {
    if (!inCpApp.instDeployActive) {
        return cb();
    }

    if (inCpApp.instDeployActive.spec.configurator &&
        inCpApp.instDeployActive.spec.configurator.fields &&
        inCpApp.instDeployActive.spec.configurator.fields.length > 0) {

        if (!inCpApp.instDeployActive.operate.options) {
            inCpApp.instDeployActive.operate.options = [];
        }
        var option = null;
        for (var i in inCpApp.instDeployActive.operate.options) {
            if (inCpApp.instDeployActive.operate.options[i].name == inCpApp.instDeployActive.spec.configurator.name) {
                option = inCpApp.instDeployActive.operate.options[i];
            }
        }
        if (!option) {
            option = {
                name: inCpApp.instDeployActive.spec.configurator.name,
                items: [],
            }
        } else if (!option.items) {
            option.items = [];
        }

        for (var i in inCpApp.instDeployActive.spec.configurator.fields) {

            var name = inCpApp.instDeployActive.spec.configurator.fields[i].name;
            var auto_fill = inCpApp.instDeployActive.spec.configurator.fields[i].auto_fill;
            var value = null;

            for (var j in option.items) {

                if (option.items[j].name == name) {
                    value = option.items[j].value;
                    break;
                }
            }

            if (!value) {
                if (inCpApp.instDeployActive.spec.configurator.fields[i].default) {
                    value = inCpApp.instDeployActive.spec.configurator.fields[i].default;
                }
            }
            if (!value && auto_fill) {
                for (var j in inCpAppSpec.cfgFieldAutoFills) {
                    if (inCpAppSpec.cfgFieldAutoFills[j].type == auto_fill) {
                        value = inCpAppSpec.cfgFieldAutoFills[j].title;
                        break;
                    }
                }
            }
            if (!value) {
                value = "";
            }

            inCpApp.instDeployActive.spec.configurator.fields[i]._value = value;
        }

        l4iModal.Open({
            id: "incp-appinst-cfgwizard",
            title: "App Configuration Wizard",
            width: 900,
            height: 600,
            tpluri: inCp.TplPath("app/inst/cfg-wizard"),
            callback: function(err, data) {

                inCpApp.instConfiguratorCallback = cb;
                l4iTemplate.Render({
                    dstid: "incp-appinst-cfg-wizard",
                    tplid: "incp-appinst-cfg-wizard-tpl",
                    data: {
                        fields: inCpApp.instDeployActive.spec.configurator.fields,
                    }
                });
            },
            buttons: [{
                onclick: "l4iModal.Close()",
                title: "Close",
            }, {
                onclick: "inCpApp.InstConfigCommit()",
                title: "Next",
                style: "btn-primary",
            }],
        });
    } else {
        cb();
    }
}

inCpApp.InstConfigWizardAppBound = function(cfg_name, cfg_defs) {
    if (!cfg_defs) {
        return;
    }
    var alert_id = "#incp-appinst-cfg-wizard-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (!data || data.error || data.kind != "AppList") {
                return
            }

            if (!data.items || data.items.length < 1) {
                return l4i.InnerAlert(alert_id, "alert-danger", "No Fit (" + cfg_defs + ") AppInstance Found");
            }

            l4iModal.Open({
                id: "incp-appinst-cfgbound-selector",
                title: "App Instances",
                tplsrc: tpl,
                data: data,
                backEnable: true,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
                fn_selector: function(err, select_item) {
                    $("#incp-appinst-cfgfield-" + cfg_name).val(select_item);
                    $("#incp-appinst-cfgfield-" + cfg_name + "-dp").text(select_item);
                    l4iModal.Prev();
                },
                callback: function(err, data) {
                    l4iTemplate.Render({
                        dstid: "incp-appls-selector",
                        tplid: "incp-appls-selector-tpl",
                        data: data,
                    });
                },
            });
        });

        ep.fail(function(err) {
            alert("error, Please try again later (EC:incp-app-cfg)");
        });

        inCp.TplFetch("app/inst/selector", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("app/list?operate_option=" + cfg_defs, {
            callback: ep.done("data"),
        });
    });
}

inCpApp.InstConfigCommit = function(cb) {
    var alert_id = "#incp-appinst-cfg-wizard-alert";
    var form = $("#incp-appinst-cfg-wizard");
    if (!form) {
        return;
    }

    var option = {
        name: inCpApp.instDeployActive.spec.configurator.name,
        items: [],
    }

    try {

        for (var i in inCpApp.instDeployActive.spec.configurator.fields) {

            var field = inCpApp.instDeployActive.spec.configurator.fields[i];
            var value = null;

            switch (field.type) {
                case 1:
                    value = form.find("input[name=fn_" + field.name + "]").val();
                    break;
                case 10:
                    value = form.find("input[name=fn_" + field.name + "]").val();
                    break;
            }

            if (value) {
                option.items.push({
                    name: field.name,
                    value: value,
                });
            }
        }

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    var req = {
        id: inCpApp.instDeployActive.meta.id,
        option: option,
    }
    // return console.log(req);

    inCp.ApiCmd("app/config", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppInstConfig") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function() {
                if (inCpApp.instConfiguratorCallback) {
                    inCpApp.instConfiguratorCallback();
                    inCpApp.instConfiguratorCallback = null;
                }
                l4iModal.Close();
            }, 1000);
        }
    });
}

inCpApp.InstDeploy = function(id, auto_start) {
    var tplid = "incp-appls";
    var alert_id = "#" + tplid + "-alert";

    inCp.ApiCmd("app/entry?id=" + id, {
        timeout: 3000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            inCpApp.instDeployActive = rsj;

            inCpApp.InstConfigurator(function() {
                inCpApp.InstDeployCommit(id, auto_start);
            });
        },
    });
}

inCpApp.InstDeployCommit = function(app_id, auto_start) {
    var tplid = "incp-appls";
    var alert_id = "#" + tplid + "-alert";

    var uri = "?app_id=" + app_id;
    if (auto_start && auto_start === true) {
        uri += "&operate_action=start";
    }

    inCp.ApiCmd("pod/app-sync" + uri, {
        method: "GET",
        timeout: 10000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                l4i.InnerAlert(alert_id, 'alert-danger', msg);
                return;
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successful deployed");
            inCpApp.instDeployActive = null;
            l4iModal.Close();
        }
    });
}


inCpApp.InstNew = function(spec_id) {
    if (!spec_id || spec_id.length < 8) {
        return alert("AppSpec error, Please try again later (EC:incp-appset)");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "spec", function(tpl, spec) {

            if (!spec || !spec.kind || spec.kind != "AppSpec") {
                return alert("AppSpec error, Please try again later (EC:incp-appset)");
            }

            inCpApp.instSet = l4i.Clone(inCpApp.instDef);;
            inCpApp.instSet.spec = spec;

            l4iModal.Open({
                title: "Launch App Instance",
                width: 800,
                height: 500,
                tplsrc: tpl,
                data: inCpApp.instSet,
                callback: function(err, data) {},
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpApp.InstNewPodSelect()",
                    title: "Next",
                    style: "btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
            alert("SpecSet error, Please try again later (EC:incp-appset)");
        });

        // template
        inCp.TplFetch("app/inst/new.info.p5", {
            callback: ep.done("tpl"),
        });

        // spec
        if (!spec_id) {
            ep.emit("spec", null);
        } else {
            inCp.ApiCmd("app-spec/entry/?id=" + spec_id, {
                callback: ep.done("spec"),
            });
        }
    });
}

inCpApp.InstNewPodSelect = function() {
    var alert_id = "#incp-appnew-alert";

    var name = $("#incp-appnew-form").find("input[name='name']").val();
    if (!name) {
        return l4i.InnerAlert(alert_id, "alert-danger", "Spec Name Not Found")
    }

    inCpApp.instSet.meta.name = name;

    l4iModal.Open({
        id: "incp-appnew-oppod",
        title: "Select a Pod to Bound",
        width: 800,
        height: 500,
        tpluri: inCp.TplPath("pod/inst-selector"),
        backEnable: true,
        fn_selector: function(err, rsp) {

            inCp.ApiCmd("pod/entry?id=" + rsp, {
                callback: function(err, podjs) {

                    if (err) {
                        return alert(err);
                    }

                    if (!podjs || podjs.kind != "Pod") {
                        return alert("Pod Not Found");
                    }

                    inCpApp.instSet.operate.pod_id = podjs.meta.id;
                    inCpApp.instSet._operate_pod = podjs;

                    inCpApp.InstNewConfirm();
                },
            });
        },
        buttons: [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }],
    });
}

inCpApp.InstNewConfirm = function() {
    l4iModal.Open({
        id: "incp-appnew-confirm",
        title: "Confirm",
        tpluri: inCp.TplPath("app/inst/new.confirm.p5"),
        data: inCpApp.instSet,
        backEnable: true,
        buttons: [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }, {
            onclick: "inCpApp.InstNewCommit()",
            title: "Confirm and Save",
            style: "btn-primary",
        }],
    });
}

inCpApp.InstNewCommit = function() {
    inCp.ApiCmd("app/set", {
        method: "POST",
        data: JSON.stringify(inCpApp.instSet),
        timeout: 3000,
        callback: function(err, rsj) {

            var alertid = "#incp-appnew-cf-alert";

            if (err || !rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (err) {
                    msg = err;
                } else if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alertid, 'alert-danger', msg);
            }

            l4i.InnerAlert(alertid, 'alert-success', "Successful operation");

            inCpApp.instSet = {};
            l4i.UrlEventHandler("app/inst/list");

            window.setTimeout(function() {
                if (rsj.meta && rsj.meta.id) {
                    inCpApp.InstDeploy(rsj.meta.id, true);
                } else {
                    l4iModal.Close();
                }
            }, 1000);
        }
    });
}


inCpApp.InstSet = function(app_id) {
    if (!app_id) {
        return alert("No AppID Found");
    }

    inCpApp.inseSet = {};

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "inst", "roles", function(tpl, inst, roles) {

            if (!inst || inst.error || inst.kind != "App") {
                return alert("App Not Found")
            }

            if (!roles || roles.error || roles.kind != "UserRoleList") {
                return alert("RoleList Not Found")
            }

            $("#work-content").html(tpl);

            if (!inst.operate) {
                inst.operate = {};
            }
            if (!inst.operate.res_bound_roles) {
                inst.operate.res_bound_roles = [];
            }
            inst.operate._res_bound_roles = l4i.Clone(roles);
            for (var i in inst.operate.res_bound_roles) {
                for (var j in inst.operate._res_bound_roles.items) {
                    if (inst.operate.res_bound_roles[i] == inst.operate._res_bound_roles.items[j].id) {
                        inst.operate._res_bound_roles.items[j]._checked = true;
                        break;
                    }
                }
            }
            if (!inst.operate.action) {
                inst.operate.action = inCp.OpActionStop;
            }

            inCpApp.instSet = inst;
            inCpApp.instSet._op_actions = inCp.OpActions;

            l4iTemplate.Render({
                dstid: "incp-appset",
                tplid: "incp-appset-tpl",
                data: inCpApp.instSet,
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:incp-appset)");
        });

        // template
        inCp.TplFetch("app/inst/set", {
            callback: ep.done("tpl"),
        });

        l4i.Ajax(inCp.base + "auth/app-role-list", {
            callback: ep.done("roles"),
        });

        // data
        inCp.ApiCmd("app/entry/?id=" + app_id, {
            callback: ep.done("inst"),
        });
    });
}


inCpApp.InstSetCommit = function() {

    var alert_id = "#incp-appset-alert";
    try {

        var form = $("#incp-appset");
        if (!form) {
            throw "No Form Data Found";
        }

        inCpApp.instSet.meta.name = form.find("input[name=name]").val();

        inCpApp.instSet.operate.res_bound_roles = [];
        form.find("input[name=res_bound_roles]:checked").each(function() {

            var val = parseInt($(this).val());
            if (val > 1) {
                inCpApp.instSet.operate.res_bound_roles.push(val);
            }
        });

        inCpApp.instSet.operate.action = parseInt(form.find("input[name=op_action]:checked").val());

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    inCp.ApiCmd("app/set", {
        method: "POST",
        data: JSON.stringify(inCpApp.instSet),
        timeout: 3000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successful operation");

            inCpApp.instSet = {};

            window.setTimeout(function() {
                inCpApp.InstListRefresh();
            }, 1000);
        }
    });
}

