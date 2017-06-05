var losCpApp = {
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
            res_bound_roles: [],
        }
    },
    instBoundPodDef: {
        meta: {
            id: null,
        },
        spec: {
            boxes: [],
        },
    },
    instSet : {},
    instDeployActive: null,
    OpActions: [{
        name: "Start",
        value: 2,
    }, {
        name: "Stop",
        value: 8,
    }],
    OpActionStop: 8,
}

losCpApp.Index = function()
{
    var divstr = "<div id='loscp-module-navbar'>\
  <ul id='loscp-app-navbar' class='loscp-module-nav'>\
    <li><a class='l4i-nav-item' href='#app/inst/list'>App Instances</a></li>\
    <li><a class='l4i-nav-item' href='#app/spec/list'>Specs</a></li>\
  </ul>\
  <ul id='loscp-module-navbar-optools' class='loscp-module-nav loscp-nav-right'></ul>\
</div>\
<div id='work-content'></div>";


    $("#comp-content").html(divstr);

    l4i.UrlEventRegister("app/inst/list", losCpApp.InstListRefresh, "loscp-app-navbar");
    l4i.UrlEventRegister("app/spec/list", losCpAppSpec.ListRefresh, "loscp-app-navbar");

    l4i.UrlEventHandler("app/inst/list", true);
}

losCpApp.InstLaunchNew = function()
{
    l4i.UrlEventHandler("app/spec/list");
}

losCpApp.InstListRefresh = function()
{
    var uri = "?";
    if (document.getElementById("qry_text")) {
        uri += "qry_text="+ $("#qry_text").val();
    }
    uri += "&fields=meta/id|name|updated,spec/meta/id|name|version,operate/action|pod_id,operate/options/name";

    var alert_id = "#loscp-app-instls-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

            if (tpl) {
                $("#work-content").html(tpl);
            }
            losCp.OpToolsRefresh("#loscp-app-instls-optools");

            if (!rsj || rsj.kind != "AppList"
                || !rsj.items || rsj.items.length < 1) {
                return l4i.InnerAlert(alert_id, 'alert-info', "Item Not Found");
            }
            $(alert_id).css({"display": "node"});

            for (var i in rsj.items) {
                if (!rsj.items[i].operate.pod_id || rsj.items[i].operate.pod_id.length < 8) {
                    rsj.items[i].operate.pod_id = "-";
                }
                if (!rsj.items[i].operate.options) {
                    rsj.items[i].operate.options = [];
                }
                if (!rsj.items[i].operate.action) {
                    rsj.items[i].operate.action = losCpApp.OpActionStop;
                }
            }

            l4iTemplate.Render({
                dstid: "loscp-app-instls",
                tplid: "loscp-app-instls-tpl",
                data:  {
                    items: rsj.items,
                    _actions: losCpApp.OpActions,
                },
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("SpecListRefresh error, Please try again later (EC:app-speclist)");
        });

        // template
        var el = document.getElementById("loscp-app-instls");
        if (!el || el.length < 1) {
            losCp.TplFetch("app/inst/list", {
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

        losCp.TplFetch("app/inst/list", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("app-inst/list"+ uri, {
            callback: ep.done("data"),
        });
    });
}


losCpApp.OpOptInfo = function(app_id)
{
    var alert_id = "#loscp-appinst-opopt-info-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, rsj) {

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
                    rsj.spec.configurator[i].fields[k]._value = value;
                }
            }
            
            l4iModal.Open({
                title  : "App Options",
                width  : 900,
                height : 600,
                tplsrc : tpl,
                data   : rsj,
                callback : function(err, data) {
                },
                buttons : [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("SpecListRefresh error, Please try again later (EC:app-speclist)");
        });

        losCp.TplFetch("app/inst/op.opt.info", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("app-inst/entry?id="+ app_id, {
            callback: ep.done("data"),
        });
    });
}


losCpApp.instConfiguratorCallback = null;
losCpApp.InstConfigurator = function(cb)
{
    if (!losCpApp.instDeployActive) {
        return cb();
    }

    if (losCpApp.instDeployActive.spec.configurator &&
        losCpApp.instDeployActive.spec.configurator.fields &&
        losCpApp.instDeployActive.spec.configurator.fields.length > 0) {

        if (!losCpApp.instDeployActive.operate.options) {
            losCpApp.instDeployActive.operate.options = [];
        }
        var option = null;
        for (var i in losCpApp.instDeployActive.operate.options) {
            if (losCpApp.instDeployActive.operate.options[i].name == losCpApp.instDeployActive.spec.configurator.name) {
                option = losCpApp.instDeployActive.operate.options[i];
            }
        }
        if (!option) {
            option = {
                name: losCpApp.instDeployActive.spec.configurator.name,
                items: [],
            }
        } else if (!option.items) {
            option.items = [];
        }

        for (var i in losCpApp.instDeployActive.spec.configurator.fields) {

            var name = losCpApp.instDeployActive.spec.configurator.fields[i].name;
            var value = null;

            for (var j in option.items) {

                if (option.items[j].name == name) {
                    value = option.items[j].value;
                    break;
                }
            }

            if (!value) {
                if (losCpApp.instDeployActive.spec.configurator.fields[i].default) {
                    value = losCpApp.instDeployActive.spec.configurator.fields[i].default;
                } else {
                    value = "";
                }
            }

            losCpApp.instDeployActive.spec.configurator.fields[i]._value = value;
        }

        l4iModal.Open({
            id     : "loscp-appinst-cfgwizard",
            title  : "App Configuration Wizard",
            width  : 900,
            height : 600,
            tpluri : losCp.TplPath("app/inst/cfg-wizard"),
            callback : function(err, data) {

                losCpApp.instConfiguratorCallback = cb;
                l4iTemplate.Render({
                    dstid: "loscp-appinst-cfg-wizard",
                    tplid: "loscp-appinst-cfg-wizard-tpl",
                    data:  {
                        fields: losCpApp.instDeployActive.spec.configurator.fields,
                    }
                });
            },
            buttons : [{
                onclick: "l4iModal.Close()",
                title: "Close",
            }, {
                onclick: "losCpApp.InstConfigCommit()",
                title: "Next",
                style: "btn-primary",
            }],
        });
    } else {
        cb();
    }
}

losCpApp.InstConfigWizardAppBound = function(cfg_name, cfg_defs)
{
    if (!cfg_defs) {
        return;
    }
    var alert_id = "#loscp-appinst-cfg-wizard-alert";

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (!data || data.error || data.kind != "AppList") {
                return
            }

            if (!data.items || data.items.length < 1) {
                return l4i.InnerAlert(alert_id, "alert-danger", "No Fit ("+ cfg_defs +") AppInstance Found");
            }

            l4iModal.Open({
                id     : "loscp-appinst-cfgbound-selector",
                title  : "App Instances",
                tplsrc : tpl,
                data   : data,
                backEnable: true,
                buttons : [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
                fn_selector: function(err, select_item) {
                    $("#loscp-appinst-cfgfield-"+ cfg_name).val(select_item);
                    $("#loscp-appinst-cfgfield-"+ cfg_name +"-dp").text(select_item);
                    l4iModal.Prev();
                },
                callback: function(err, data) {
                    l4iTemplate.Render({
                        dstid: "loscp-appls-selector",
                        tplid: "loscp-appls-selector-tpl",
                        data:  data,
                    });
                },
            });
        });

        ep.fail(function (err) {
            alert("error, Please try again later (EC:loscp-app-cfg)");
        });

        losCp.TplFetch("app/inst/selector", {
            callback: ep.done("tpl"),
        });

        losCp.ApiCmd("app-inst/list?operate_option="+ cfg_defs, {
            callback: ep.done("data"),
        });
    });
}

losCpApp.InstConfigCommit = function(cb)
{
    var alert_id = "#loscp-appinst-cfg-wizard-alert";
    var form = $("#loscp-appinst-cfg-wizard");
    if (!form) {
        return;
    }

    var option = {
        name: losCpApp.instDeployActive.spec.configurator.name,
        items: [],
    }

    try {

        for (var i in losCpApp.instDeployActive.spec.configurator.fields) {
            
            var field = losCpApp.instDeployActive.spec.configurator.fields[i];
            var value = null;

            switch (field.type) {
            case 1:
                value = form.find("input[name=fn_"+ field.name +"]").val();
                break;
            case 10:
                value = form.find("input[name=fn_"+ field.name +"]").val();
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
        id: losCpApp.instDeployActive.meta.id,
        option: option,
    }
    // return console.log(req);

    losCp.ApiCmd("app-inst/config", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

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

            window.setTimeout(function(){
                if (losCpApp.instConfiguratorCallback) {
                    losCpApp.instConfiguratorCallback();
                    losCpApp.instConfiguratorCallback = null;
                }
                l4iModal.Close();
            }, 1000);
        }
    });
}

losCpApp.InstDeploy = function(id, auto_start)
{
    var tplid = "loscp-app-instls";
    var alert_id = "#"+ tplid +"-alert";

    losCp.ApiCmd("app-inst/entry?id="+ id, {
        timeout : 3000,
        callback : function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: "+ err);
            }

            if (!rsj || rsj.kind != "App") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            losCpApp.instDeployActive = rsj;

            losCpApp.InstConfigurator(function() {
                losCpApp.InstDeployCommit(id, auto_start);
            });
        },
    });
}

losCpApp.InstDeployCommit = function(app_id, auto_start)
{
    var tplid = "loscp-app-instls";
    var alert_id = "#"+ tplid +"-alert";

    var uri = "?app_id="+ app_id;
    if (auto_start && auto_start === true) {
        uri += "&operate_action=start";
    }

    losCp.ApiCmd("pod/app-sync"+ uri, {
        method  : "GET",
        timeout : 10000,
        callback : function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed: "+ err);
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
            losCpApp.instDeployActive = null;
        }
    });
}


losCpApp.InstNew = function(spec_id)
{
    if (!spec_id || spec_id.length < 8) {
        return alert("AppSpec error, Please try again later (EC:loscp-app-instset)");
    }

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "spec", function (tpl, spec) {

            if (!spec || !spec.kind || spec.kind != "AppSpec") {
                return alert("AppSpec error, Please try again later (EC:loscp-app-instset)");
            }

            losCpApp.instSet = l4i.Clone(losCpApp.instDef);;
            losCpApp.instSet.spec = spec;

            l4iModal.Open({
                title  : "Launch App Instance",
                width  : 800,
                height : 500,
                tplsrc : tpl,
                data   : losCpApp.instSet,
                callback : function(err, data) {

                },
                buttons : [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "losCpApp.InstNewPodSelect()",
                    title: "Next",
                    style: "btn-primary",
                }],
            });
        });

        ep.fail(function (err) {
            alert("SpecSet error, Please try again later (EC:loscp-app-instset)");
        });

        // template
        losCp.TplFetch("app/inst/new.info.p5", {
            callback: ep.done("tpl"),
        });

        // spec
        if (!spec_id) {
            ep.emit("spec", null);
        } else {
            losCp.ApiCmd("app-spec/entry/?id="+ spec_id, {
                callback: ep.done("spec"),
            });
        }
    });
}

losCpApp.InstNewPodSelect = function()
{
    var alert_id = "#loscp-app-instnew-alert";

    var name = $("#loscp-app-instnew-form").find("input[name='name']").val();
    if (!name) {
        return l4i.InnerAlert(alert_id, "alert-danger", "Spec Name Not Found")
    }

    losCpApp.instSet.meta.name = name;

    l4iModal.Open({
        id     : "loscp-app-instnew-oppod",
        title  : "Select a Pod to Bound",
        width  : 800,
        height : 500,
        tpluri : losCp.TplPath("pod/inst-selector"),
        backEnable: true,
        fn_selector : function(err, rsp) {

            losCp.ApiCmd("pod/entry?id="+ rsp, {
                callback: function(err, podjs) {

                    if (err) {
                        return alert(err);
                    }

                    if (!podjs || podjs.kind != "Pod") {
                        return alert("Pod Not Found");
                    }

                    losCpApp.instSet.operate.pod_id = podjs.meta.id;
                    losCpApp.instSet._operate_pod   = podjs;

                    losCpApp.InstNewConfirm();
                },
            });
        },
        buttons : [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }],
    });
}

losCpApp.InstNewConfirm = function()
{
    l4iModal.Open({
        id     : "loscp-app-instnew-confirm",
        title  : "Confirm",
        tpluri : losCp.TplPath("app/inst/new.confirm.p5"),
        data   : losCpApp.instSet,
        backEnable: true,
        buttons : [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }, {
            onclick: "losCpApp.InstNewCommit()",
            title: "Confirm and Save",
            style: "btn-primary",
        }],
    });
}

losCpApp.InstNewCommit = function()
{
    losCp.ApiCmd("app-inst/set", {
        method  : "POST",
        data    : JSON.stringify(losCpApp.instSet),
        timeout : 3000,
        callback : function(err, rsj) {

            var alertid = "#loscp-app-instnew-cf-alert";

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

            losCpApp.instSet = {};
            l4i.UrlEventHandler("app/inst/list");

            window.setTimeout(function(){
                if (rsj.meta && rsj.meta.id) {
                    losCpApp.InstDeploy(rsj.meta.id, true);
                } else {
                    l4iModal.Close();
                }
            }, 1000);
        }
    });
}


losCpApp.InstSet = function(app_id)
{
    if (!app_id) {
        return alert("No AppID Found");
    }

    losCpApp.inseSet = {};

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "inst", "roles", function (tpl, inst, roles) {

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
                inst.operate.action = losCpApp.OpActionStop;
            }

            losCpApp.instSet = inst;
            losCpApp.instSet._op_actions = losCpApp.OpActions;

            l4iTemplate.Render({
                dstid: "loscp-app-instset",
                tplid: "loscp-app-instset-tpl",
                data:  losCpApp.instSet,
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:loscp-app-instset)");
        });

        // template
        losCp.TplFetch("app/inst/set", {
            callback: ep.done("tpl"),
        });

        l4i.Ajax(losCp.base +"auth/app-role-list", {
            callback: ep.done("roles"),
        });

        // data
        losCp.ApiCmd("app-inst/entry/?id="+ app_id, {
            callback: ep.done("inst"),
        });
    });
}


losCpApp.InstSetCommit = function()
{

    var alert_id = "#loscp-app-instset-alert";
    try {

        var form = $("#loscp-app-instset");
        if (!form) {
            throw "No Form Data Found";
        }

        losCpApp.instSet.meta.name = form.find("input[name=name]").val();

        losCpApp.instSet.operate.res_bound_roles = [];
        form.find("input[name=res_bound_roles]:checked").each(function() {
            
            var val = parseInt($(this).val());
            if (val > 1) {
                losCpApp.instSet.operate.res_bound_roles.push(val);
            }            
        });

        losCpApp.instSet.operate.action = parseInt(form.find("input[name=op_action]:checked").val());

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    losCp.ApiCmd("app-inst/set", {
        method  : "POST",
        data    : JSON.stringify(losCpApp.instSet),
        timeout : 3000,
        callback : function(err, rsj) {

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

            losCpApp.instSet = {};

            window.setTimeout(function(){
                losCpApp.InstListRefresh();
            }, 1000);
        }
    });
}

