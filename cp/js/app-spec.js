var losCpAppSpec = {
    def: {
        meta: {
            id     : "",
            name   : "",
            user   : "",
        },
        description : "",
        packages    : [],
        executors   : [],
        service_ports: [],
        roles       : [],
    },
    executorDef : {
        name       : "",
        exec_start : "",
        exec_stop  : "",
        priority   : 0,
        plan       : {
            on_boot : true,
        },
    },
    setActive : {},
    infoCache: null,
    listCache: null,
    active:    null,
    cfgFieldTypes: [{
        type: 1,
        title: "String",
    }, {
        type: 2,
        title: "Select",
    }, {
        type: 10,
        title: "Bound Configurator",
    }],
    cfgFieldDef: {
        name: "",
        title: "",
        prompt: "",
        type: 1,
        default: "",
        validates: [],         
    },
    fieldNameRe: /^[a-z]{1}[0-9a-z_\/]{1,30}$/,
    iamAppRoles: null,
}

//
losCpAppSpec.ListRefresh = function(tplid)
{
    if (!tplid || tplid.indexOf("/") >= 0) {
        tplid = "loscp-app-specls";
    }

    if (!document.getElementById(tplid)) {
        losCp.TplFetch("app/spec/list", {
            callback: function(err, data) {
                $("#work-content").html(data);
                losCp.OpToolsRefresh("#loscp-app-specls-optools");
                losCpAppSpec.listDataRefresh(tplid);
            },
        });
    } else {
        losCpAppSpec.listDataRefresh(tplid);
    }
}

losCpAppSpec.listDataRefresh = function(tplid)
{
    var uri = "";
    var alert_id = "#"+ tplid +"-alert";

    var el = document.getElementById(tplid +"-qry-text");
    if (el && el.value.length > 0) {
        uri = "qry_text="+ el.value;
    }

    losCp.ApiCmd("app-spec/list?"+ uri, {
        timeout : 3000,
        callback : function(err, rsj) {

            if (err || !rsj || rsj.kind != "AppSpecList" || !rsj.items) {
                return l4i.InnerAlert(alert_id, "alert-info", "No more results ...");
            } else {
                $(alert_id).css({"display": "none"});
            }

            for (var i in rsj.items) {

                if (rsj.items[i].packages) {
                    rsj.items[i]._lpm_num = rsj.items[i].packages.length;
                } else {
                    rsj.items[i]._lpm_num = 0;
                }

                if (rsj.items[i].executors) {
                    rsj.items[i]._executor_num = rsj.items[i].executors.length;
                } else {
                    rsj.items[i]._executor_num = 0;
                }

                if (!rsj.items[i].configurator) {
                    rsj.items[i].configurator = {
                        name: "",
                        fields: [],
                    }
                }

                if (!rsj.items[i].configurator.fields) {
                    rsj.items[i].configurator.fields = [];
                }

                for (var j in rsj.items[i].configurator.fields) {

                    if (!rsj.items[i].configurator.fields[j].default) {
                        rsj.items[i].configurator.fields[j].default = ""
                    }
                
                    if (!rsj.items[i].configurator.fields[j].prompt) {
                        rsj.items[i].configurator.fields[j].prompt = ""
                    }

                    if (!rsj.items[i].configurator.fields[j].validates) {
                        rsj.items[i].configurator.fields[j].validates = [];
                    }

                    for (var k in rsj.items[i].configurator.fields[j].validates) {
                        if (!rsj.items[i].configurator.fields[j].validates[k].value) {
                            rsj.items[i].configurator.fields[j].validates[k].value = "";
                        }
                    }
                }
            }

            losCpAppSpec.listCache = l4i.Clone(rsj.items);

            l4iTemplate.Render({
                dstid: tplid,
                tplid: tplid +"-tpl",
                data:  {
                    items: rsj.items,
                },
            });
        }
    });
}

losCpAppSpec.Info = function(id, spec)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", "roles", function (tpl, rsj, roles) {

            if (!rsj || rsj.error || rsj.kind != "AppSpec") {
                return
            }

            if (!rsj.packages) {
                rsj.packages = [];
            }

            if (!rsj.executors) {
                rsj.executors = [];
            }

            for (var i in rsj.executors) {

                if (!rsj.executors[i].exec_start) {
                    rsj.executors[i].exec_start = "";
                }
        
                if (!rsj.executors[i].exec_stop) {
                    rsj.executors[i].exec_stop = "";
                }
        
                if (!rsj.executors[i].priority) {
                    rsj.executors[i].priority = 0;
                }
        
                if (!rsj.executors[i].plan) {
                    rsj.executors[i].plan = {
                        on_boot: true,
                        on_boot_selected: "selected",
                    }
                } else {
        
                    if (rsj.executors[i].plan.on_boot == true) {
                        rsj.executors[i].plan.on_boot_selected = "selected";
                    } else if (rsj.executors[i].plan.on_tick > 0) {
                        rsj.executors[i].plan.on_tick_selected = "selected";
                    }
                }
            }

            if (!rsj.service_ports) {
                rsj.service_ports = [];
            }

            for (var i in rsj.service_ports) {
                if (!rsj.service_ports[i].name) {
                    rsj.service_ports[i].name = "";
                }
                if (!rsj.service_ports[i].box_port) {
                    rsj.service_ports[i].box_port = "";
                }
            }

            rsj._roles = [];
            if (!rsj.roles) {
                rsj.roles = [];
            }
            for (var i in rsj.roles) {
                for (var j in roles.items) {
                    if (rsj.roles[i] == roles.items[j].id) {
                        rsj._roles.push(roles.items[j].meta.name);
                        break;
                    }
                }
            }

            l4iModal.Open({
                title  : "Spec Information",
                width  : 900,
                height : 700,
                tplsrc : tpl,
                data   : rsj,
                buttons : [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
                success: function() {
                    losCp.CodeRender();
                },
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:loscp-app-specset)");
        });

        // template
        losCp.TplFetch("app/spec/info.p5", {
            callback: ep.done("tpl"),
        });

        if (losCpAppSpec.iamAppRoles) {
            ep.emit("roles", losCpAppSpec.iamAppRoles);
        } else {
            l4i.Ajax(losCp.base +"auth/app-role-list", {
                callback: function(err, data) {
                    if (err) {
                        return alert(err);
                    }
                    losCpAppSpec.iamAppRoles = data;
                    ep.emit("roles", data);
                },
            });
        }

        // data
        if (spec) {
            ep.emit("data", spec);
        } else if (losCpAppSpec.InfoCache) {
            ep.emit("data", losCpAppSpec.InfoCache);
        } else if (id) {

            losCp.ApiCmd("app-spec/entry?id="+ id, {
                callback: ep.done("data"),
            });

        } else {
            ep.emit("data", "");
        }
    });
}

losCpAppSpec.Download = function(id)
{
    if (!id) {
        return;
    }
    window.open(losCp.api +"app-spec/entry?id="+ id +"&download=true&fmt_json_indent=true", "Download");
}

losCpAppSpec.Set = function(id)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", "roles", function (tpl, rsj, roles) {

            rsj = rsj || l4i.Clone(losCpAppSpec.def);

            if (!rsj || rsj.error || rsj.kind != "AppSpec") {
                rsj = l4i.Clone(losCpAppSpec.def);
            }

            $("#work-content").html(tpl);
   
            if (!rsj.description) {
                rsj.description = "";
            }

            if (!rsj.packages) {
                rsj.packages = [];
            }

            if (!rsj.executors) {
                rsj.executors = [];
            }

            if (!rsj.service_ports) {
                rsj.service_ports = [];
            }
                
            if (losCp.UserSession.username == "sysadmin") {
                rsj._host_port_enable = true;
            }

            for (var i in rsj.service_ports) {
                if (!rsj.service_ports[i].name) {
                    rsj.service_ports[i].name = "";
                }
                if (!rsj.service_ports[i].box_port) {
                    rsj.service_ports[i].box_port = "";
                }
                if (!rsj.service_ports[i].host_port) {
                    rsj.service_ports[i].host_port = "";
                }
            }

            rsj._roles = l4i.Clone(roles);
            if (!rsj.roles) {
                rsj.roles = [];
            }
            for (var i in rsj.roles) {
                for (var j in rsj._roles.items) {
                    if (rsj.roles[i] == rsj._roles.items[j].id) {
                        rsj._roles.items[j]._checked = true;
                        break;
                    }
                }
            }


            losCpAppSpec.setActive = rsj;

            l4iTemplate.Render({
                dstid: "loscp-app-specset",
                tplid: "loscp-app-specset-tpl",
                data:  {
                    actionTitle : ((rsj.meta.id == "") ? "New Spec" : "Setting"),
                    spec        : rsj,
                },
                success: function() {
                    losCpAppSpec.setPackageRefresh();
                    losCpAppSpec.setExecutorRefresh();

                    if (rsj.service_ports.length == 0) {
                        losCpAppSpec.SetServicePortAppend();
                    }
                },
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:loscp-app-specset)");
        });

        // template
        losCp.TplFetch("app/spec/set", {
            callback: ep.done("tpl"),
        });

        if (losCpAppSpec.iamAppRoles) {
            ep.emit("roles", losCpAppSpec.iamAppRoles);
        } else {
            l4i.Ajax(losCp.base +"auth/app-role-list", {
                callback: function(err, data) {
                    if (err) {
                        return alert(err);
                    }
                    losCpAppSpec.iamAppRoles = data;
                    ep.emit("roles", data);
                },
            });
        }

        // data
        if (!id) {
            ep.emit("data", "");
        } else {
            losCp.ApiCmd("app-spec/entry?id="+ id, {
                callback: ep.done("data"),
            });
        }
    });
}

// TODO
losCpAppSpec.SetPackageSelect = function()
{
    l4iModal.Open({
        title  : "Select a Package to Launch",
        width  : 900,
        height : 550, 
        tpluri : "/lps/-/pkginfo/selector.html",
        fn_selector : function(err, rsp) {
            l4iModal.Close();
            losCpAppSpec.setPackageInfo({id: rsp});
        },
        buttons : [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }],
    });
}

losCpAppSpec.setPackageInfo = function(opt)
{
    var req = "";
    if (opt.id) {
        req += "&id="+ opt.id;
    }
    if (opt.name) {
        req += "&name="+ opt.name;
    }
    if (opt.version) {
        req += "&version="+ opt.version;
    }
    if (opt.release) {
        req += "&release="+ opt.release;
    }

    var alert_id = "#loscp-app-specset-alert";

    l4i.Ajax("/lps/v1/pkg/entry?"+ req, {
        timeout : 10000,
        callback : function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', err);
            }

            if (!rsj || rsj.kind != "Package") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            if (!losCpAppSpec.setActive.packages) {
                losCpAppSpec.setActive.packages = [];
            }

            for (var i in losCpAppSpec.setActive.packages) {

                if (losCpAppSpec.setActive.packages[i].name == rsj.meta.name) {

                    losCpAppSpec.setActive.packages[i] = {
                        name:    rsj.meta.name,
                        version: rsj.version,
                        release: rsj.release,
                        dist:    rsj.pkg_os,
                        arch:    rsj.pkg_arch,
                    }

                    rsj = null;

                    break;
                }
            }

            if (rsj) {
                losCpAppSpec.setActive.packages.push({
                    name:    rsj.meta.name,
                    version: rsj.version,
                    release: rsj.release,
                    dist:    rsj.pkg_os,
                    arch:    rsj.pkg_arch,
                });
            }

            losCpAppSpec.setPackageRefresh();
        }
    });
}

losCpAppSpec.SetPackageRemove = function(name)
{
    if (name.length < 4) {
        return;
    }

    for (var i in losCpAppSpec.setActive.packages) {
        if (losCpAppSpec.setActive.packages[i].name == name) {
            losCpAppSpec.setActive.packages.splice(i, 1);
            break
        }
    }

    losCpAppSpec.setPackageRefresh();
}

losCpAppSpec.setPackageRefresh = function()
{
    if (!losCpAppSpec.setActive || !losCpAppSpec.setActive.packages) {
        return;
    }

    if (losCpAppSpec.setActive.packages.length > 0) {
        $("#loscp-app-specset-lpmls-msg").css({"display": "none"});
    }

    l4iTemplate.Render({
        dstid:  "loscp-app-specset-lpmls",
        tplid:  "loscp-app-specset-lpmls-tpl",
        data:   losCpAppSpec.setActive.packages,
    });
}

losCpAppSpec.SetExecutorSet = function(name)
{
    var title = "Executor Setup";
    var executor = null;
    var alert_id = "#loscp-app-specset-executorset-p5-alert";

    if (name) {

        for (var i in losCpAppSpec.setActive.executors) {

            if (losCpAppSpec.setActive.executors[i].name == name) {
                executor = losCpAppSpec.setActive.executors[i];
                break;
            }
        }

    } else {
        title = "Create new Executor";
    }

    if (!executor) {
        executor = l4i.Clone(losCpAppSpec.executorDef);
    }


    l4iModal.Open({
        title  : title,
        width  : 900,
        height : 600,
        tpluri : losCp.TplPath("app/spec/executor-set"),
        data   : executor,
        callback : function(err) {
            $(alert_id).css({"display": "block"}).text("No Template Found");
        },
        buttons : [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }, {
            onclick: "losCpAppSpec.SetExecutorSave()",
            title: "Save",
            style: "btn-primary",
        }],
    });
}

losCpAppSpec.SetExecutorSave = function()
{
    var form = $("#loscp-app-specset-executorset-p5");
    var alert_id = "#loscp-app-specset-executorset-p5-alert";

    if (!form) {
        return l4i.InnerAlert(alert_id, 'alert-danger', "Bad Request");
    }

    var executor = {
        name: form.find("input[name=name]").val(),
        exec_start: form.find("textarea[name=exec_start]").val(),
        exec_stop: form.find("textarea[name=exec_stop]").val(),
        priority: parseInt(form.find("input[name=priority]").val()),
        plan : {},
    }

    var plan = form.find("select[name=plan]").val();
    switch (plan) {
    case "on_boot":
        executor.plan.on_boot = true;
        break;
    case "on_tick":
        executor.plan.on_tick = 60;
        break;
    }

    if (!executor.name) {
        return l4i.InnerAlert(alert_id, 'alert-danger', "Bad Request");
    }

    for (var i in losCpAppSpec.setActive.executors) {

        if (losCpAppSpec.setActive.executors[i].name == executor.name) {
            losCpAppSpec.setActive.executors[i] = executor;
            executor = null;
            break
        }
    }

    if (executor) {
        losCpAppSpec.setActive.executors.push(executor);
    }

    losCpAppSpec.setExecutorRefresh();

    l4iModal.Close();
}


losCpAppSpec.SetServicePortAppend = function()
{
    var data = {};
    if (losCp.UserSession.username == "sysadmin") {
        data._host_port_enable = true;
    }

    l4iTemplate.Render({
        append : true,
        dstid  : "loscp-app-specset-serviceports",
        tplid  : "loscp-app-specset-serviceport-tpl",
        data   : data,
    });
}

losCpAppSpec.SetServicePortDel = function(field)
{
    $(field).parent().parent().remove();
}


losCpAppSpec.setExecutorRefresh = function()
{
    if (!losCpAppSpec.setActive || !losCpAppSpec.setActive.executors) {
        return;
    }

    if (losCpAppSpec.setActive.executors.length > 0) {
        $("#loscp-app-specset-executorls-msg").css({"display": "none"});
    }

    for (var i in losCpAppSpec.setActive.executors) {

        if (!losCpAppSpec.setActive.executors[i].exec_start) {
            losCpAppSpec.setActive.executors[i].exec_start = "";
        }

        if (!losCpAppSpec.setActive.executors[i].exec_stop) {
            losCpAppSpec.setActive.executors[i].exec_stop = "";
        }

        if (!losCpAppSpec.setActive.executors[i].priority) {
            losCpAppSpec.setActive.executors[i].priority = 0;
        }

        if (!losCpAppSpec.setActive.executors[i].plan) {
            losCpAppSpec.setActive.executors[i].plan = {
                on_boot: true,
                on_boot_selected: "selected",
            }
        } else {

            if (losCpAppSpec.setActive.executors[i].plan.on_boot == true) {
                losCpAppSpec.setActive.executors[i].plan.on_boot_selected = "selected";
            } else if (losCpAppSpec.setActive.executors[i].plan.on_tick > 0) {
                losCpAppSpec.setActive.executors[i].plan.on_tick_selected = "selected";
            }
        }
    }

    l4iTemplate.Render({
        dstid:  "loscp-app-specset-executorls",
        tplid:  "loscp-app-specset-executorls-tpl",
        data:   losCpAppSpec.setActive.executors,
        callback: function() {
            losCp.CodeRender();
        },
    });
}

losCpAppSpec.SetCommit = function()
{
    var alert_id = "#loscp-app-specset-alert";

    try {

        losCpAppSpec.setActive.kind = "AppSpec";

        var form = $("#loscp-app-specset");
        if (!form) {
            throw "No Form Data Found";
        }

        losCpAppSpec.setActive.meta.name = form.find("input[name=name]").val();
        losCpAppSpec.setActive.description = form.find("input[name=description]").val();

        if (!losCpAppSpec.setActive.packages || losCpAppSpec.setActive.packages.length < 1) {
            throw "Required Package Source";
        }

        losCpAppSpec.setActive.service_ports = [];
        form.find(".loscp-app-specset-serviceport-item").each(function() {

            var sp_name = $(this).find("input[name=sp_name]").val();
            var sp_port = parseInt($(this).find("input[name=sp_box_port]").val());
            var sp_hport = 0;

            if (!sp_port || sp_port < 1) {
                return;
            }
            if (sp_port > 65535) {
                throw "Invalid Network BoxPort";
            }

            if (!sp_name || sp_name.length == 0) {
                throw "Invalid Network Name";
            }

            if (losCp.UserSession.username == "sysadmin") {
                sp_hport = parseInt($(this).find("input[name=sp_host_port]").val());
                if (sp_hport > 1024) {
                    sp_hport = 0;
                }
            }

            losCpAppSpec.setActive.service_ports.push({
                name:      sp_name,
                box_port:  sp_port,
                host_port: sp_hport,
            });
        });

        losCpAppSpec.setActive.roles = [];
        form.find("input[name=roles]:checked").each(function() {
            
            var val = parseInt($(this).val());
            if (val > 1) {
                losCpAppSpec.setActive.roles.push(val);
            }            
        });

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    losCp.ApiCmd("app-spec/set", {
        method  : "POST",
        data    : JSON.stringify(losCpAppSpec.setActive),
        timeout : 3000,
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed");
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successful operation");

            window.setTimeout(function(){
                losCpAppSpec.ListRefresh();
                losCpAppSpec.setActive = {};
            }, 1000);
        }
    });
}

losCpAppSpec.SetRaw = function(id)
{
    var title = "New Spec",
        formset = {spec_text: ""};
    if (id) {
        title = "Setting Spec (#"+ id +")";
        formset.meta_id = id;
    } else {
        formset.meta_id = "";
    }

    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            if (data && data.kind && data.kind == "AppSpec") {
                formset.spec_text = JSON.stringify(data, null, "  ");;
            }

            l4iModal.Open({
                title  : title,
                width  : 800,
                height : 500,
                tplsrc : tpl,
                data   : formset,
                buttons : [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "losCpAppSpec.SetRawCommit()",
                    title: "Commit",
                    style: "btn-primary",
                }],
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:loscp-app-specset)");
        });

        // template
        losCp.TplFetch("app/spec/set-raw", {
            callback: ep.done("tpl"),
        });

        if (!id) {
            ep.emit("data", "");
        } else {
            losCp.ApiCmd("app-spec/entry?id="+ id, {
                callback: ep.done("data"),
            });
        }
    });
}

losCpAppSpec.SetRawCommit = function()
{
    var alert_id = "#loscp-app-specset-raw-alert";
    var setActive = null;

    try {

        var form = $("#loscp-app-specset-raw");
        if (!form) {
            throw "No Form Data Found";
        }

        var txt = form.find("textarea[name=spec_text]").val();
        if (!txt || txt.length < 10) {
            throw "No Data Found";
        }
        setActive = JSON.parse(txt)
        if (!setActive) {
            throw "Invalid JSON Data";
        }

        if (!setActive.meta || !setActive.meta.name) {
            throw "No Meta/Name Found";
        }

        for (var i in setActive.service_ports) {

            if (!setActive.service_ports[i].name) {
                throw "Invalid Network Name";
            }
            if (!setActive.service_ports[i].box_port || 
                setActive.service_ports[i].box_port < 1 ||
                setActive.service_ports[i].box_port > 65535) {
                throw "Invalid Network BoxPort";
            }

            if (losCp.UserSession.username == "sysadmin") {
                if (setActive.service_ports[i].host_port > 1024) {
                    setActive.service_ports[i].host_port = 0;
                }
            }
        }

        var id = form.find("input[name=meta_id]").val();
        if (id) {
            setActive.meta.id = id;
        }

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    losCp.ApiCmd("app-spec/set", {
        method  : "POST",
        data    : JSON.stringify(setActive),
        timeout : 3000,
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Failed");
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successful operation");
            losCpAppSpec.ListRefresh();
            window.setTimeout(function(){
                l4iModal.Close();
            }, 500);
        }
    });
}

//
losCpAppSpec.CfgSet = function(spec_id)
{
    seajs.use(["ep"], function (EventProxy) {

        var ep = EventProxy.create("tpl", "data", function (tpl, data) {

            var alert_id = "#loscp-appspec-cfg-fieldlist-alert";

            if (!data || data.error || !data.kind || data.kind != "AppSpec") {

                if (data.error) {
                    return alert(data.error.message);
                }

                return alert("AppSpec Not Found");
            }

            if (!data.configurator) {
                data.configurator = {
                    name: "",
                    fields: [],
                }
            }

            losCpAppSpec.active = l4i.Clone(data);

            l4iModal.Open({
                id:      "loscp-appspec-cfg-fieldlist-modal",
                title  : "Configurator",
                tplsrc : tpl,
                width  : 900,
                height : 600,
                buttons: [{
                    title   : "Cancel",
                    onclick : "l4iModal.Close()",
                }, {
                    title   : "New Field",
                    onclick : 'losCpAppSpec.CfgFieldSet()',
                }, {
                    title   : "Save",
                    onclick : 'losCpAppSpec.CfgSetCommit()',
                    style   : "btn-primary",
                }],
                callback: function() {
                    losCpAppSpec.cfgFieldListRefresh();
                },
            });
        });

        ep.fail(function (err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        losCp.TplFetch("app/spec/cfg-fieldlist", {
            callback: ep.done("tpl"),
        });

        var spec_entry = null;
        if (losCpAppSpec.listCache && losCpAppSpec.listCache.length > 0) {

            for (var i in losCpAppSpec.listCache) { 
                if (losCpAppSpec.listCache[i].meta.id == spec_id) {
                    spec_entry = losCpAppSpec.listCache[i];
                    spec_entry.kind = "AppSpec";
                    break;
                }
            }
        }
        if (spec_entry) {
            ep.emit("data", spec_entry);
        } else {
            losCp.ApiCmd("app-spec/entry?id="+ spec_id, {
                callback: ep.done("data"),
            });
        }
    });
}

losCpAppSpec.cfgFieldListRefresh = function()
{
    losCpAppSpec.active._cfgFieldTypes = losCpAppSpec.cfgFieldTypes;
    l4iTemplate.Render({
        dstid : "loscp-appspec-cfg-fieldlist",
        tplid : "loscp-appspec-cfg-fieldlist-tpl",
        data  : losCpAppSpec.active,
    });
}

losCpAppSpec.CfgSetCommit = function()
{
    var alert_id = "#loscp-appspec-cfg-fieldlist-alert";
    var form = $("#loscp-appspec-cfg-fieldlist");
    if (!form) {
        return;
    }

    try {
        var name = form.find("input[name=name]").val();
        if (!name || !losCpAppSpec.fieldNameRe.test(name)) {
            throw "Invalid Name";
        }
        losCpAppSpec.active.configurator.name = name;
    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    var req = {
        meta : {
            id: losCpAppSpec.active.meta.id,
        },
        configurator: losCpAppSpec.active.configurator,
    }

    losCp.ApiCmd("app-spec/cfg-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            losCpAppSpec.active = null;
            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                l4iModal.Close();
                losCpAppSpec.ListRefresh();
            }, 500);
        }
    });
}

losCpAppSpec.CfgFieldSet = function(name)
{
    if (!losCpAppSpec.active) {
        return;
    }

    var field = null;
    if (name) {
        
        for (var i in losCpAppSpec.active.configurator.fields) {
            if (losCpAppSpec.active.configurator.fields[i].name == name) {
                field = l4i.Clone(losCpAppSpec.active.configurator.fields[i]);
                break;
            }
        }
    }
    if (!field) {
        field = l4i.Clone(losCpAppSpec.cfgFieldDef);
    }
    field._cfgFieldTypes = losCpAppSpec.cfgFieldTypes;

    l4iModal.Open({
        id     : "loscp-appspec-cfgfieldset-modal",
        title  : "Setting Field",
        tpluri : losCp.TplPath("app/spec/cfg-fieldset"),
        buttons: [{
            title   : "Cancel",
            onclick : "l4iModal.Close()",
        }, {
            title   : "Save",
            onclick : 'losCpAppSpec.CfgFieldSetCommit()',
            style   : "btn-primary",
        }],
        callback: function(err) {

            if (err) {
                return;
            }

            l4iTemplate.Render({
                dstid  : "loscp-appspec-cfg-fieldset-form",
                tplid  : "loscp-appspec-cfg-fieldset-tpl",
                data   : field,
                callback: losCpAppSpec.CfgFieldSetValidatorNew,
            });
        },
    });
}


losCpAppSpec.CfgFieldSetValidatorNew = function()
{
    l4iTemplate.Render({
        append : true,
        dstid  : "loscp-app-specset-cfgfield-validators",
        tplid  : "loscp-app-specset-cfgfield-validator-tpl",
    });
}


losCpAppSpec.CfgFieldSetCommit = function()
{
    var alert_id = "#loscp-appspec-cfg-fieldset-alert";
    var form = $("#loscp-appspec-cfg-fieldset-form");
    if (!form) {
        return;
    }

    var field = {
        type: 1,
        validates: [],    
    }
    var name_prev = form.find("input[name=name_prev]").val();

    try {
        field.name = form.find("input[name=name]").val();
        if (!field.name || !losCpAppSpec.fieldNameRe.test(field.name)) {
            throw "Invalid Name";
        }

        field.title = form.find("input[name=title]").val();
        if (!field.title) {
            throw "Invalid Title";
        }

        field.prompt = form.find("input[name=prompt]").val();
        field.default = form.find("input[name=default]").val();

        field.type = parseInt(form.find("select[name=type]").val());
        if (!field.type || field.type < 1 || field.type > 10) {
            throw "Invalid Type";
        }

        form.find(".loscp-app-specset-cfgfield-validator-item").each(function() {

            var fv_key = $(this).find("input[name=fv_key]").val();
            var fv_val = $(this).find("input[name=fv_value]").val();

            if (!fv_key) {
                return;
            }

            field.validates.push({
                key: fv_key,
                value: fv_val,
            });
        });

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    var fields = [];

    for (var i in losCpAppSpec.active.configurator.fields) {

        if (losCpAppSpec.active.configurator.fields[i].name == name_prev && name_prev != field.name) {
            continue;
        }

        if (field && losCpAppSpec.active.configurator.fields[i].name == field.name) {
            fields.push(l4i.Clone(field))
            field = null;
        } else {
            fields.push(losCpAppSpec.active.configurator.fields[i]);
        }
    }

    if (field) {
        fields.push(field);
    }
    if (!losCpAppSpec.active.configurator.name) {
        losCpAppSpec.active.configurator.fields = fields;
        l4iModal.Prev(losCpAppSpec.cfgFieldListRefresh);    
        return;
    }
    var req = {
        meta: {
            id: losCpAppSpec.active.meta.id,
        },
        configurator: {
            name: losCpAppSpec.active.configurator.name,
            fields: fields,
        },
    }

    losCp.ApiCmd("app-spec/cfg-set", {
        method  : "POST",
        data    : JSON.stringify(req),
        callback : function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function(){
                losCpAppSpec.active.configurator.fields = fields;
                l4iModal.Prev(losCpAppSpec.cfgFieldListRefresh);    
            }, 500);
        }
    });
}

