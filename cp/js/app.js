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
        spec: {},
    },
    instSet: {},
    instDeployActive: null,
    list_options: {},
    listActives: null,
}

inCpApp.Index = function() {
    var divstr = "<div id='incp-module-navbar'>\
  <ul id='incp-module-navbar-menus' class='incp-module-nav'>\
    <li><a class='l4i-nav-item' href='#app/inst/list'>App Instances</a></li>\
    <li><a class='l4i-nav-item' href='#app/spec/list'>AppSpec Center</a></li>\
  </ul>\
  <ul id='incp-module-navbar-optools' class='incp-module-nav incp-nav-right'></ul>\
</div>\
<div id='work-content'></div>";


    $("#comp-content").html(divstr);

    l4i.UrlEventClean("incp-module-navbar-menus");
    l4i.UrlEventRegister("app/inst/list", inCpApp.InstListRefresh, "incp-module-navbar-menus");
    l4i.UrlEventRegister("app/spec/list", inCpAppSpec.ListRefresh, "incp-module-navbar-menus");

    inCpApp.list_options = {};
    l4i.UrlEventHandler("app/inst/list", true);
}

inCpApp.InstLaunchNew = function() {
    l4i.UrlEventHandler("app/spec/list");
}

inCpApp.InstListRefresh = function(options) {
    var uri = "?";
    if (document.getElementById("qry_text")) {
        uri += "qry_text=" + $("#qry_text").val();
    }
    uri += "&fields=meta/id|name|user|updated,spec/meta/id|name|version,operate/action|pod_id,operate/options/name";

    var alert_id = "#incp-appls-alert";

    if (options) {
        inCpApp.list_options = options;
    } else {
        options = inCpApp.list_options;
    }
    if (!options.ops_mode) {
        // inCp.ModuleNavbarMenu("cp/app/list", inCpApp.list_nav_menus, "app/list");
    } else {
        uri += "&filter_meta_user=all";
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, rsj) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            if (options.ops_mode) {
                inCp.OpToolsClean();
            } else {
                inCp.OpToolsRefresh("#incp-appls-optools");
            }

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
            inCpApp.listActives = rsj;

            l4iTemplate.Render({
                dstid: "incp-appls",
                tplid: "incp-appls-tpl",
                data: {
                    items: rsj.items,
                    _actions: inCp.OpActions,
                    _options: options,
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

/*
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
                return l4i.InnerAlert(alert_id, 'error', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                l4i.InnerAlert(alert_id, 'error', msg);
                return;
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
                width: 1000,
                height: 1000,
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

inCpApp.instConfigurator = function(cb) {

    if (cb && typeof cb === "function" && !inCpApp.instConfiguratorCallback) {
        inCpApp.instConfiguratorCallback = cb;
    }

    if (!inCpApp.instConfiguratorCallback) {
        return;
    }

    if (!inCpApp.instDeployActive) {
        return inCpApp.instConfiguratorCallback();
    }

    if (!inCpApp.instDeployActive.spec.depends) {
        inCpApp.instDeployActive.spec.depends = [];
    }

    for (var i in inCpApp.instDeployActive.spec.depends) {

        if (inCpApp.instDeployActive.spec.depends[i]._setid) {
            continue;
        }
        inCpApp.instDeployActive.spec.depends[i]._setid = inCpApp.instDeployActive.spec.depends[i].id;

        var url = "app-spec/entry?id=" + inCpApp.instDeployActive.spec.depends[i].id;
        url += "&version=" + inCpApp.instDeployActive.spec.depends[i].version;

        return inCp.ApiCmd(url, {
            callback: function(err, data) {
                if (err) {
                    return alert(err); // TODO
                }
                if (data.error) {
                    return l4iAlert.Open("error", data.error.message);
                }
                if (data && data.meta.id == inCpApp.instDeployActive.spec.depends[i].id) {
                    return inCpApp.instConfiguratorEntry(data.configurator, data.meta.id);
                }
            },
        });
    }

    if (inCpApp.instDeployActive.spec.configurator &&
        !inCpApp.instDeployActive.spec.configurator._setid) {
        inCpApp.instDeployActive.spec.configurator._setid = inCpApp.instDeployActive.spec.meta.id;
        return inCpApp.instConfiguratorEntry(inCpApp.instDeployActive.spec.configurator, inCpApp.instDeployActive.spec.meta.id);
    }

    for (var i in inCpApp.instDeployActive.spec.depends) {
        inCpApp.instDeployActive.spec.depends[i]._setid = null;
    }
    if (inCpApp.instDeployActive.spec.configurator) {
        inCpApp.instDeployActive.spec.configurator._setid = null;
    }

    inCpApp.instConfiguratorCallback();

    inCpApp.instDeployActive = null;
    inCpApp.instConfiguratorCallback = null;
}

inCpApp.instConfiguratorEntryActive = null;
inCpApp.instConfiguratorEntry = function(configurator, spec_id) {

    if (configurator &&
        configurator.fields &&
        configurator.fields.length > 0) {

        inCpApp.instConfiguratorEntryActive = configurator;
        inCpApp.instConfiguratorEntryActive.spec_id = spec_id;

        if (!inCpApp.instDeployActive.operate.options) {
            inCpApp.instDeployActive.operate.options = [];
        }
        var option = null;
        for (var i in inCpApp.instDeployActive.operate.options) {
            if (inCpApp.instDeployActive.operate.options[i].name == configurator.name) {
                option = inCpApp.instDeployActive.operate.options[i];
            }
        }
        if (!option) {
            option = {
                name: configurator.name,
                items: [],
            }
        } else if (!option.items) {
            option.items = [];
        }

        for (var i in configurator.fields) {

            var name = configurator.fields[i].name;
            var auto_fill = configurator.fields[i].auto_fill;
            var value = null;

            for (var j in option.items) {

                if (option.items[j].name == name) {
                    value = option.items[j].value;
                    break;
                }
            }

            if (!value) {
                if (configurator.fields[i].default) {
                    value = configurator.fields[i].default;
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

            configurator.fields[i]._value = value;
        }

        var depRemotes = [];
        console.log(spec_id);
        console.log(inCpApp.instDeployActive.spec.meta.id);
        if (spec_id == inCpApp.instDeployActive.spec.meta.id) {
            depRemotes = inCpApp.instDeployActive.spec.dep_remotes;
            for (var i in inCpApp.instDeployActive.operate.options) {
                if (!inCpApp.instDeployActive.operate.options[i].ref) {
                    continue;
                }
                for (var j in depRemotes) {
                    if (depRemotes[j].id == inCpApp.instDeployActive.operate.options[i].ref.spec_id) {
                        depRemotes[j]._app_id = inCpApp.instDeployActive.operate.options[i].ref.app_id;
                        break;
                    }
                }
            }
        }

        l4iModal.Open({
            id: "incp-appinst-cfgwizard",
            title: "App Configuration Wizard : " + configurator.name,
            width: 900,
            height: 600,
            tpluri: inCp.TplPath("app/inst/cfg-wizard"),
            callback: function(err, data) {

                l4iTemplate.Render({
                    dstid: "incp-appinst-cfg-wizard",
                    tplid: "incp-appinst-cfg-wizard-tpl",
                    data: {
                        name: configurator.name,
                        fields: configurator.fields,
                        dep_remotes: depRemotes,
                    }
                });
            },
            buttons: [{
                onclick: "l4iModal.Close()",
                title: "Close",
            }, {
                onclick: "inCpApp.instConfigCommit()",
                title: "Next",
                style: "btn-primary",
            }],
        });
    } else {
        inCpApp.instConfigurator();
    }
}

inCpApp.InstConfigWizardAppBound = function(spec_id) {

    var alert_id = "#incp-appinst-cfg-wizard-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (!data || data.error || data.kind != "AppList") {
                return
            }

            if (!data.items || data.items.length < 1) {
                return l4i.InnerAlert(alert_id, "error", "No Fit AppSpec (" + spec_id + ") AppInstance Found");
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
                    $("#incp-appinst-cfgfield-" + spec_id).val(select_item);
                    $("#incp-appinst-cfgfield-" + spec_id + "-dp").text(select_item);
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

        inCp.ApiCmd("app/list?spec_id=" + spec_id, {
            callback: ep.done("data"),
        });
    });
}


inCpApp.instConfigCommit = function() {

    if (!inCpApp.instConfiguratorEntryActive) {
        return;
    }

    var alert_id = "#incp-appinst-cfg-wizard-alert";
    var form = $("#incp-appinst-cfg-wizard");
    if (!form) {
        return;
    }

    var option = {
        name: inCpApp.instConfiguratorEntryActive.name,
        items: [],
    }

    var req = {
        id: inCpApp.instDeployActive.meta.id,
        option: option,
        dep_remotes: [],
    }


    try {

        for (var i in inCpApp.instConfiguratorEntryActive.fields) {

            var field = inCpApp.instConfiguratorEntryActive.fields[i];
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

        if (inCpApp.instConfiguratorEntryActive.spec_id == inCpApp.instDeployActive.spec.meta.id) {

            for (var i in inCpApp.instDeployActive.spec.dep_remotes) {

                var field = inCpApp.instDeployActive.spec.dep_remotes[i];
                var value = form.find("input[name=fn_" + field.id + "]").val();

                if (value) {
                    req.dep_remotes.push({
                        spec_id: field.id,
                        app_id: value,
                    });
                }
            }
        }

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'error', err);
    }

    // return console.log(req);
    if (inCpApp.instConfiguratorEntryActive.spec_id &&
        inCpApp.instConfiguratorEntryActive.spec_id.length > 8) {
        req.spec_id = inCpApp.instConfiguratorEntryActive.spec_id;
    }


    inCp.ApiCmd("app/config", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'error', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppInstConfig") {
                return l4i.InnerAlert(alert_id, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'ok', "Successfully Updated");

            window.setTimeout(function() {
                l4i.InnerAlert(alert_id, "");
                l4iModal.Close(function() {
                    if (inCpApp.instConfiguratorCallback) {
                        inCpApp.instConfigurator();
                    }
                });
            }, 300);
        }
    });
}

var inCpAppInstDeployActivePod = null;
inCpApp.InstDeploy = function(id, auto_start) {
    var tplid = "incp-appls";
    var alert_id = "#" + tplid + "-alert";

    inCp.ApiCmd("app/entry?id=" + id, {
        timeout: 3000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'error', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'error', msg);
            }

            inCpApp.instDeployActive = rsj;
            inCpAppInstDeployActivePod = rsj.operate.pod_id;

            inCpApp.instConfiguratorCallback = null;
            inCpApp.instConfigurator(function() {
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
                return l4i.InnerAlert(alert_id, 'error', "Failed: " + err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                l4i.InnerAlert(alert_id, 'error', msg);
                return;
            }

            inCpApp.instDeployActive = null;

            l4iModal.Close(function() {

                var msg = l4i.T("Successfully deployed Application to Container (ID: %s)",
                    inCpAppInstDeployActivePod);

                l4iModal.Open({
                    title: "Deployment",
                    width: 600,
                    height: 200,
                    tplsrc: "<div class='alert alert-success'>" + msg + "</div>",
                    buttons: [{
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    }, {
                        onclick: 'inCpApp.InstPodEntryIndex("' + inCpAppInstDeployActivePod + '")',
                        title: "Go to Container Details",
                        style: "btn btn-primary",
                    }],
                });
            });
        }
    });
}




inCpApp.InstNew = function(spec_id) {
    if (!spec_id || spec_id.length < 4) {
        return alert("AppSpec error, Please try again later (EC:incp-appset)");
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "spec", function(tpl, spec) {

            if (!spec || !spec.kind || spec.kind != "AppSpec") {
                return alert("AppSpec error, Please try again later (EC:incp-appset)");
            }

            inCpApp.instSet = l4i.Clone(inCpApp.instDef);

            spec.exp_res._cpu_min = (spec.exp_res.cpu_min / 10).toFixed(1);
            inCpApp.instSet.spec = spec;

            l4iModal.Open({
                title: "Create new App Instance",
                width: 900,
                height: 400,
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

inCpApp.instNewPodSelectCallback = function(err, pod_id) {
    inCp.ApiCmd("pod/entry?id=" + pod_id, {
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
}

inCpApp.InstNewPodSelect = function() {
    var alert_id = "#incp-appnew-alert";

    var name = $("#incp-appnew-form").find("input[name='name']").val();
    if (!name) {
        return l4i.InnerAlert(alert_id, "error", "Spec Name Not Found")
    }

    inCpApp.instSet.meta.name = name;

    l4iModal.Open({
        id: "incp-appnew-oppod",
        title: "Bind App to Pod", // Select a Pod to Bound",
        width: 900,
        height: 500,
        tpluri: inCp.TplPath("pod/inst-selector"),
        backEnable: true,
        callback: function() {
            inCpPod.List("incp-podls-selector", {
                "operate_action": inCp.OpActionStart,
                "exp_filter_app_notin": inCpApp.instSet.spec.meta.id,
                "exp_filter_app_spec_id": inCpApp.instSet.spec.meta.id,
                "new_options": {
                    "open_modal": true,
                    "app_cpu_min": (inCpApp.instSet.spec.exp_res.cpu_min / 10).toFixed(1),
                    "app_mem_min": inCpApp.instSet.spec.exp_res.mem_min,
                    "app_vol_min": inCpApp.instSet.spec.exp_res.vol_min,
                    "app_new_callback": inCpApp.instNewPodSelectCallback,
                    "app_spec_id": inCpApp.instSet.spec.meta.id,
                },
            });
        },
        fn_selector: inCpApp.instNewPodSelectCallback,
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
        width: 900,
        height: 500,
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
                return l4i.InnerAlert(alertid, 'error', msg);
            }

            l4i.InnerAlert(alertid, 'ok', "Successful operation");

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


inCpApp.InstSet = function(app_id, spec_id) {
    if (!app_id) {
        return alert("No AppID Found");
    }

    inCpApp.instSet = {};
    var spec_version = "";

    if (inCpApp.listActives && inCpApp.listActives.items) {
        for (var i in inCpApp.listActives.items) {
            if (inCpApp.listActives.items[i].meta.id == app_id) {
                inCpApp.instSet = inCpApp.listActives.items[i];
                if (spec_id == inCpApp.instSet.spec.meta.id) {
                    spec_version = inCpApp.instSet.spec.meta.version;
                }
                break;
            }
        }
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "inst", "roles", "spec_vs", function(tpl, inst, roles, spec_vs) {

            if (!inst || inst.error || inst.kind != "App") {
                return l4iInner.Open("error", "App Not Found");
            }

            if (!roles || roles.error || roles.kind != "UserRoleList") {
                return l4iInner.Open("error", "RoleList Not Found");
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

            if (spec_vs && spec_vs.items && spec_vs.items.length > 0) {
                var hit = false;
                for (var i in spec_vs.items) {
                    if (spec_vs.items[i].version == inst.spec.meta.version) {
                        hit = true;
                        break;
                    }
                }
                if (!hit) {
                    spec_vs.items.push({
                        version: inst.spec.meta.version,
                        created: inst.spec.meta.updated,
                        comment: "",
                    });
                }
                inCpApp.instSet._spec_vs = spec_vs.items;
            }

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

        if (spec_id) {
            inCp.ApiCmd("app-spec/version-list?id=" + spec_id + "&version=" + spec_version, {
                callback: ep.done("spec_vs"),
            });
        } else {
            ep.emit("spec_vs", null);
        }

        // data
        inCp.ApiCmd("app/entry/?id=" + app_id, {
            callback: ep.done("inst"),
        });
    });
}

inCpApp.InstSetCommit = function(options) {

    options = options || {};

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

        var version = form.find("#app_spec_version").val();
        if (version) {
            inCpApp.instSet.spec.meta.version = version;
        }

        inCpApp.instSet.operate.action = parseInt(form.find("input[name=op_action]:checked").val());

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'error', err);
    }

    inCp.ApiCmd("app/set", {
        method: "POST",
        data: JSON.stringify(inCpApp.instSet),
        timeout: 3000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'error', err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'error', msg);
            }

            var msg = "Successful updated";
            if (options.deploy) {
                msg += ", Next starts the deployment ...";
            }


            l4i.InnerAlert(alert_id, 'ok', msg);


            window.setTimeout(function() {
                inCpApp.InstListRefresh();
                if (options.deploy) {
                    inCpApp.InstDeploy(inCpApp.instSet.meta.id);
                }
                inCpApp.instSet = {};
            }, 1000);
        }
    });
}

inCpApp.InstSetCommitAndDeploy = function() {
    inCpApp.InstSetCommit({
        deploy: true,
    });
}

inCpApp.InstPodInfo = function(pod_id) {
    inCpPod.Info(pod_id, {
        buttons: [{
            title: "Detail",
            onclick: "inCpApp.InstPodEntryIndex(\"" + pod_id + "\")",
            style: "btn-success",
        }],
    });
}

inCpApp.InstPodEntryIndex = function(pod_id) {
    l4iModal.Close();
    l4i.UrlEventActive("pod/index");
    inCpPod.EntryIndex(pod_id);
}

