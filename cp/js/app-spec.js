var inCpAppSpec = {
    def: {
        meta: {
            id: "",
            name: "",
            user: "",
        },
        description: "",
        packages: [],
        executors: [],
        service_ports: [],
        depends: [],
        roles: [],
    },
    executorDef: {
        name: "",
        exec_start: "",
        exec_stop: "",
        priority: 0,
        plan: {
            on_boot: true,
        },
    },
    setActive: {},
    infoCache: null,
    active: null,
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
    cfgFieldAutoFills: [{
        type: "",
        title: "Disable",
    }, {
        type: "defval",
        title: "Default Value",
    }, {
        type: "hexstr_32",
        title: "Random Hex String (32 length)",
    }, {
        type: "base64_48",
        title: "Random Base64 String (48 length)",
    }],
    cfgFieldDef: {
        name: "",
        title: "",
        prompt: "",
        type: 1,
        default: "",
        auto_fill: "",
        validates: [],
    },
    fieldNameRe: /^[a-z]{1}[0-9a-z_\/\-]{1,30}$/,
    iamAppRoles: null,
}

//
inCpAppSpec.ListRefresh = function(tplid) {
    if (!tplid || tplid.indexOf("/") >= 0) {
        tplid = "incp-app-specls";
    }

    if (!document.getElementById(tplid)) {
        inCp.TplFetch("app/spec/list", {
            callback: function(err, data) {
                $("#work-content").html(data);
                inCp.OpToolsRefresh("#incp-app-specls-optools");
                inCpAppSpec.listDataRefresh(tplid);
            },
        });
    } else {
        inCpAppSpec.listDataRefresh(tplid);
    }
}

inCpAppSpec.listDataRefresh = function(tplid) {
    var uri = "";
    var alert_id = "#" + tplid + "-alert";

    var el = document.getElementById(tplid + "-qry-text");
    if (el && el.value.length > 0) {
        uri = "qry_text=" + el.value;
    }
    uri += "&fields=meta/id|name|user|version|updated,depends/name,packages/name,executors/name,configurator/name,configurator/fields/name";

    inCp.ApiCmd("app-spec/list?" + uri, {
        timeout: 3000,
        callback: function(err, rsj) {

            if (err || !rsj || rsj.kind != "AppSpecList" || !rsj.items) {
                return l4i.InnerAlert(alert_id, "alert-info", "No more results ...");
            } else {
                $(alert_id).css({
                    "display": "none"
                });
            }

            for (var i in rsj.items) {

                if (!rsj.items[i].depends) {
                    rsj.items[i].depends = [];
                }

                if (rsj.items[i].packages) {
                    rsj.items[i]._ipm_num = rsj.items[i].packages.length;
                } else {
                    rsj.items[i]._ipm_num = 0;
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

            l4iTemplate.Render({
                dstid: tplid,
                tplid: tplid + "-tpl",
                data: {
                    items: rsj.items,
                },
            });
        }
    });
}

inCpAppSpec.Info = function(id, spec) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", "roles", function(tpl, rsj, roles) {

            if (!rsj || rsj.error || rsj.kind != "AppSpec") {
                return
            }

            if (!rsj.depends) {
                rsj.depends = [];
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

            for (var i in rsj.depends) {
                if (!rsj.depends[i].name) {
                    rsj.depends[i].name = "";
                }
            }

            rsj._roles = [];
            if (!rsj.roles) {
                rsj.roles = [];
            }
            for (var i in rsj.roles) {
                for (var j in roles.items) {
                    if (rsj.roles[i] == roles.items[j].id) {
                        rsj._roles.push(roles.items[j].name);
                        break;
                    }
                }
            }

            l4iModal.Open({
                title: "Spec Information",
                width: 1000,
                height: 750,
                tplsrc: tpl,
                data: rsj,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }],
                success: function() {
                    inCp.CodeRender();
                },
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:incp-app-specset)");
        });

        // template
        inCp.TplFetch("app/spec/info.p5", {
            callback: ep.done("tpl"),
        });

        if (inCpAppSpec.iamAppRoles) {
            ep.emit("roles", inCpAppSpec.iamAppRoles);
        } else {
            l4i.Ajax(inCp.base + "auth/app-role-list", {
                callback: function(err, data) {
                    if (err) {
                        return alert(err);
                    }
                    inCpAppSpec.iamAppRoles = data;
                    ep.emit("roles", data);
                },
            });
        }

        // data
        if (spec) {
            ep.emit("data", spec);
        } else if (inCpAppSpec.InfoCache) {
            ep.emit("data", inCpAppSpec.InfoCache);
        } else if (id) {

            inCp.ApiCmd("app-spec/entry?id=" + id, {
                callback: ep.done("data"),
            });

        } else {
            ep.emit("data", "");
        }
    });
}

inCpAppSpec.Download = function(id) {
    if (!id) {
        return;
    }
    window.open(inCp.api + "app-spec/entry?id=" + id + "&download=true&fmt_json_indent=true", "Download");
}

inCpAppSpec.Set = function(id) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", "roles", function(tpl, rsj, roles) {

            rsj = rsj || l4i.Clone(inCpAppSpec.def);

            if (!rsj || rsj.error || rsj.kind != "AppSpec") {
                rsj = l4i.Clone(inCpAppSpec.def);
            }

            $("#work-content").html(tpl);

            if (!rsj.meta.name) {
                rsj.meta.name = "";
            }

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

            if (inCp.UserSession.username == "sysadmin") {
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

            for (var i in rsj.depends) {
                if (!rsj.depends[i].name) {
                    rsj.depends[i].name = "";
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


            inCpAppSpec.setActive = rsj;

            l4iTemplate.Render({
                dstid: "incp-app-specset",
                tplid: "incp-app-specset-tpl",
                data: {
                    actionTitle: ((rsj.meta.id == "") ? "New Spec" : "Setting (" + rsj.meta.id + ")"),
                    spec: rsj,
                },
                success: function() {
                    inCpAppSpec.setDependRefresh();
                    inCpAppSpec.setPackageRefresh();
                    inCpAppSpec.setExecutorRefresh();

                    if (rsj.service_ports.length == 0) {
                        inCpAppSpec.SetServicePortAppend();
                    }
                },
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:incp-app-specset)");
        });

        // template
        inCp.TplFetch("app/spec/set", {
            callback: ep.done("tpl"),
        });

        if (inCpAppSpec.iamAppRoles) {
            ep.emit("roles", inCpAppSpec.iamAppRoles);
        } else {
            l4i.Ajax(inCp.base + "auth/app-role-list", {
                callback: function(err, data) {
                    if (err) {
                        return alert(err);
                    }
                    inCpAppSpec.iamAppRoles = data;
                    ep.emit("roles", data);
                },
            });
        }

        // data
        if (!id) {
            ep.emit("data", "");
        } else {
            inCp.ApiCmd("app-spec/entry?id=" + id, {
                callback: ep.done("data"),
            });
        }
    });
}

// TODO
inCpAppSpec.SetDependSelect = function() {
    l4iModal.Open({
        title: "Select a Depend AppSpec",
        width: 950,
        height: 600,
        tpluri: inCp.TplPath("app/spec/selector"),
        fn_selector: function(err, rsp) {
            l4iModal.Close();
            inCpAppSpec.setDependEntry({
                id: rsp
            });
        },
        buttons: [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }],
    });
}

inCpAppSpec.setDependEntry = function(opt) {
    if (!opt || !opt.id) {
        return;
    }
    if (opt.id == inCpAppSpec.setActive.meta.id) {
        return;
    }

    var alert_id = "#incp-app-specset-alert";

    inCp.ApiCmd("app-spec/entry?id=" + opt.id, {
        timeout: 10000,
        callback: function(err, rsj) {

            if (err) {
                return l4i.InnerAlert(alert_id, 'alert-danger', err);
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, 'alert-danger', msg);
            }

            if (!inCpAppSpec.setActive.depends) {
                inCpAppSpec.setActive.depends = [];
            }

            for (var i in inCpAppSpec.setActive.depends) {

                if (inCpAppSpec.setActive.depends[i].id == rsj.meta.id) {
                    inCpAppSpec.setActive.depends[i] = {
                        id: rsj.meta.id,
                        name: rsj.meta.name,
                        version: rsj.meta.version,
                    }
                    rsj = null;
                    break;
                }
            }

            if (rsj) {
                inCpAppSpec.setActive.depends.push({
                    id: rsj.meta.id,
                    name: rsj.meta.name,
                    version: rsj.meta.version,
                });
            }

            inCpAppSpec.setDependRefresh();
        }
    });
}

inCpAppSpec.SetDependRemove = function(id) {
    if (id.length < 8) {
        return;
    }

    for (var i in inCpAppSpec.setActive.depends) {
        if (inCpAppSpec.setActive.depends[i].id == id) {
            inCpAppSpec.setActive.depends.splice(i, 1);
            break
        }
    }

    inCpAppSpec.setDependRefresh();
}

inCpAppSpec.setDependRefresh = function() {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.depends) {
        return;
    }

    if (inCpAppSpec.setActive.depends.length > 0) {
        $("#incp-app-specset-depls-msg").css({
            "display": "none"
        });
    }

    l4iTemplate.Render({
        dstid: "incp-app-specset-depls",
        tplid: "incp-app-specset-depls-tpl",
        data: inCpAppSpec.setActive.depends,
    });
}

// TODO
inCpAppSpec.SetPackageSelect = function() {
    l4iModal.Open({
        title: "Select a Package to Launch",
        width: 900,
        height: 600,
        tpluri: inCp.base + "/ips/~/ips/tpl/pkginfo/selector.html",
        fn_selector: function(err, rsp) {
            l4iModal.Close();
            inCpAppSpec.setPackageInfo({
                id: rsp
            });
        },
        buttons: [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }],
    });
}

inCpAppSpec.setPackageInfo = function(opt) {
    var req = "";
    if (opt.id) {
        req += "&id=" + opt.id;
    }
    if (opt.name) {
        req += "&name=" + opt.name;
    }
    if (opt.version) {
        req += "&version=" + opt.version;
    }
    if (opt.release) {
        req += "&release=" + opt.release;
    }

    var alert_id = "#incp-app-specset-alert";

    l4i.Ajax("/ips/v1/pkg/entry?" + req, {
        timeout: 10000,
        callback: function(err, rsj) {

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

            if (!inCpAppSpec.setActive.packages) {
                inCpAppSpec.setActive.packages = [];
            }

            for (var i in inCpAppSpec.setActive.packages) {

                if (inCpAppSpec.setActive.packages[i].name == rsj.meta.name) {
                    inCpAppSpec.setActive.packages[i] = {
                        name: rsj.meta.name,
                        version: rsj.version.version,
                        release: rsj.version.release,
                        dist: rsj.version.dist,
                        arch: rsj.version.arch,
                    }
                    rsj = null;
                    break;
                }
            }

            if (rsj) {
                inCpAppSpec.setActive.packages.push({
                    name: rsj.meta.name,
                    version: rsj.version.version,
                    release: rsj.version.release,
                    dist: rsj.version.dist,
                    arch: rsj.version.arch,
                });
            }

            inCpAppSpec.setPackageRefresh();
        }
    });
}

inCpAppSpec.SetPackageRemove = function(name) {
    if (name.length < 4) {
        return;
    }

    for (var i in inCpAppSpec.setActive.packages) {
        if (inCpAppSpec.setActive.packages[i].name == name) {
            inCpAppSpec.setActive.packages.splice(i, 1);
            break
        }
    }

    inCpAppSpec.setPackageRefresh();
}

inCpAppSpec.setPackageRefresh = function() {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.packages) {
        return;
    }

    if (inCpAppSpec.setActive.packages.length > 0) {
        $("#incp-app-specset-ipmls-msg").css({
            "display": "none"
        });
    }

    l4iTemplate.Render({
        dstid: "incp-app-specset-ipmls",
        tplid: "incp-app-specset-ipmls-tpl",
        data: inCpAppSpec.setActive.packages,
    });
}

inCpAppSpec.SetExecutorSet = function(name) {
    var title = "Executor Setup";
    var executor = null;
    var alert_id = "#incp-app-specset-executorset-p5-alert";

    if (name) {

        for (var i in inCpAppSpec.setActive.executors) {

            if (inCpAppSpec.setActive.executors[i].name == name) {
                executor = inCpAppSpec.setActive.executors[i];
                break;
            }
        }

    } else {
        title = "Create new Executor";
    }

    if (!executor) {
        executor = l4i.Clone(inCpAppSpec.executorDef);
    }


    l4iModal.Open({
        title: title,
        width: 960,
        height: 700,
        tpluri: inCp.TplPath("app/spec/executor-set"),
        data: executor,
        callback: function(err) {
            $(alert_id).css({
                "display": "block"
            }).text("No Template Found");
        },
        buttons: [{
            onclick: "l4iModal.Close()",
            title: "Close",
        }, {
            onclick: "inCpAppSpec.SetExecutorSave()",
            title: "Save",
            style: "btn-primary",
        }],
    });
}

inCpAppSpec.SetExecutorSave = function() {
    var form = $("#incp-app-specset-executorset-p5");
    var alert_id = "#incp-app-specset-executorset-p5-alert";

    if (!form) {
        return l4i.InnerAlert(alert_id, 'alert-danger', "Bad Request");
    }

    var executor = {
        name: form.find("input[name=name]").val(),
        exec_start: form.find("textarea[name=exec_start]").val(),
        exec_stop: form.find("textarea[name=exec_stop]").val(),
        priority: parseInt(form.find("input[name=priority]").val()),
        plan: {},
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

    for (var i in inCpAppSpec.setActive.executors) {

        if (inCpAppSpec.setActive.executors[i].name == executor.name) {
            inCpAppSpec.setActive.executors[i] = executor;
            executor = null;
            break
        }
    }

    if (executor) {
        inCpAppSpec.setActive.executors.push(executor);
    }

    inCpAppSpec.setExecutorRefresh();

    l4iModal.Close();
}

inCpAppSpec.SetExecutorRemove = function(name) {
    if (name.length < 4) {
        return;
    }

    for (var i in inCpAppSpec.setActive.executors) {
        if (inCpAppSpec.setActive.executors[i].name == name) {
            inCpAppSpec.setActive.executors.splice(i, 1);
            break
        }
    }

    inCpAppSpec.setExecutorRefresh();
}

inCpAppSpec.SetServicePortAppend = function() {
    var data = {};
    if (inCp.UserSession.username == "sysadmin") {
        data._host_port_enable = true;
    }

    l4iTemplate.Render({
        append: true,
        dstid: "incp-app-specset-serviceports",
        tplid: "incp-app-specset-serviceport-tpl",
        data: data,
    });
}

inCpAppSpec.SetServicePortDel = function(field) {
    $(field).parent().parent().remove();
}


inCpAppSpec.setExecutorRefresh = function() {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.executors) {
        return;
    }

    if (inCpAppSpec.setActive.executors.length > 0) {
        $("#incp-app-specset-executorls-msg").css({
            "display": "none"
        });
    }

    for (var i in inCpAppSpec.setActive.executors) {

        if (!inCpAppSpec.setActive.executors[i].exec_start) {
            inCpAppSpec.setActive.executors[i].exec_start = "";
        }

        if (!inCpAppSpec.setActive.executors[i].exec_stop) {
            inCpAppSpec.setActive.executors[i].exec_stop = "";
        }

        if (!inCpAppSpec.setActive.executors[i].priority) {
            inCpAppSpec.setActive.executors[i].priority = 0;
        }

        if (!inCpAppSpec.setActive.executors[i].plan) {
            inCpAppSpec.setActive.executors[i].plan = {
                on_boot: true,
                on_boot_selected: "selected",
            }
        } else {

            if (inCpAppSpec.setActive.executors[i].plan.on_boot == true) {
                inCpAppSpec.setActive.executors[i].plan.on_boot_selected = "selected";
            } else if (inCpAppSpec.setActive.executors[i].plan.on_tick > 0) {
                inCpAppSpec.setActive.executors[i].plan.on_tick_selected = "selected";
            }
        }
    }

    l4iTemplate.Render({
        dstid: "incp-app-specset-executorls",
        tplid: "incp-app-specset-executorls-tpl",
        data: inCpAppSpec.setActive.executors,
        callback: function() {
            inCp.CodeRender();
        },
    });
}

inCpAppSpec.SetCommit = function() {
    var alert_id = "#incp-app-specset-alert";

    try {

        inCpAppSpec.setActive.kind = "AppSpec";

        var form = $("#incp-app-specset");
        if (!form) {
            throw "No Form Data Found";
        }

        inCpAppSpec.setActive.meta.id = form.find("input[name=meta_id]").val();
        inCpAppSpec.setActive.meta.name = form.find("input[name=meta_name]").val();
        inCpAppSpec.setActive.description = form.find("input[name=description]").val();

        if (!inCpAppSpec.setActive.packages || inCpAppSpec.setActive.packages.length < 1) {
            throw "Required Package Source";
        }

        inCpAppSpec.setActive.service_ports = [];
        form.find(".incp-app-specset-serviceport-item").each(function() {

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

            if (inCp.UserSession.username == "sysadmin") {
                sp_hport = parseInt($(this).find("input[name=sp_host_port]").val());
                if (sp_hport > 1024) {
                    sp_hport = 0;
                }
            }

            inCpAppSpec.setActive.service_ports.push({
                name: sp_name,
                box_port: sp_port,
                host_port: sp_hport,
            });
        });

        inCpAppSpec.setActive.roles = [];
        form.find("input[name=roles]:checked").each(function() {

            var val = parseInt($(this).val());
            if (val > 1) {
                inCpAppSpec.setActive.roles.push(val);
            }
        });

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    inCp.ApiCmd("app-spec/set", {
        method: "POST",
        data: JSON.stringify(inCpAppSpec.setActive),
        timeout: 3000,
        callback: function(err, rsj) {

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

            window.setTimeout(function() {
                inCpAppSpec.ListRefresh();
                inCpAppSpec.setActive = {};
            }, 1000);
        }
    });
}

inCpAppSpec.SetRaw = function(id) {
    var title = "New Spec",
        formset = {
            spec_text: ""
        };
    if (id) {
        title = "Setting Spec (" + id + ")";
        formset.meta_id = id;
    } else {
        formset.meta_id = "";
    }

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            if (data && data.kind && data.kind == "AppSpec") {
                formset.spec_text = JSON.stringify(data, null, "  ");;
            }

            l4iModal.Open({
                title: title,
                width: 800,
                height: 500,
                tplsrc: tpl,
                data: formset,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpAppSpec.SetRawCommit()",
                    title: "Commit",
                    style: "btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
            // TODO
            alert("SpecSet error, Please try again later (EC:incp-app-specset)");
        });

        // template
        inCp.TplFetch("app/spec/set-raw", {
            callback: ep.done("tpl"),
        });

        if (!id) {
            ep.emit("data", "");
        } else {
            inCp.ApiCmd("app-spec/entry?id=" + id, {
                callback: ep.done("data"),
            });
        }
    });
}

inCpAppSpec.SetRawCommit = function() {
    var alert_id = "#incp-app-specset-raw-alert";
    var setActive = null;

    try {

        var form = $("#incp-app-specset-raw");
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

        if (!setActive.meta || !setActive.meta.id) {
            throw "No Meta/ID Found";
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

            if (inCp.UserSession.username == "sysadmin") {
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

    inCp.ApiCmd("app-spec/set", {
        method: "POST",
        data: JSON.stringify(setActive),
        timeout: 3000,
        callback: function(err, rsj) {

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
            inCpAppSpec.ListRefresh();
            window.setTimeout(function() {
                l4iModal.Close();
            }, 500);
        }
    });
}

//
inCpAppSpec.CfgSet = function(spec_id) {
    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "data", function(tpl, data) {

            var alert_id = "#incp-appspec-cfg-fieldlist-alert";

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

            if (!data.configurator.fields) {
                data.configurator.fields = [];
            }

            for (var j in data.configurator.fields) {
                if (!data.configurator.fields[j].default) {
                    data.configurator.fields[j].default = "";
                }
                if (!data.configurator.fields[j].auto_fill) {
                    data.configurator.fields[j].auto_fill = "";
                }
                if (!data.configurator.fields[j].prompt) {
                    data.configurator.fields[j].prompt = "";
                }
                if (!data.configurator.fields[j].validates) {
                    data.configurator.fields[j].validates = [];
                }
                for (var k in data.configurator.fields[j].validates) {
                    if (!data.configurator.fields[j].validates[k].value) {
                        data.configurator.fields[j].validates[k].value = "";
                    }
                }
            }

            inCpAppSpec.active = l4i.Clone(data);

            var btns = [{
                title: "Cancel",
                onclick: "l4iModal.Close()",
            }];
            if (inCp.UserSession.username == data.meta.user) {
                btns.push({
                    title: "New Field",
                    onclick: 'inCpAppSpec.CfgFieldSet()',
                });
                btns.push({
                    title: "Save",
                    onclick: 'inCpAppSpec.CfgSetCommit()',
                    style: "btn-primary",
                });
            }

            l4iModal.Open({
                id: "incp-appspec-cfg-fieldlist-modal",
                title: "Configurator",
                tplsrc: tpl,
                width: 900,
                height: 600,
                buttons: btns,
                callback: function() {
                    inCpAppSpec.cfgFieldListRefresh();
                },
            });
        });

        ep.fail(function(err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        inCp.TplFetch("app/spec/cfg-fieldlist", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("app-spec/entry?id=" + spec_id, {
            callback: ep.done("data"),
        });
    });
}

inCpAppSpec.cfgFieldListRefresh = function() {
    inCpAppSpec.active._cfgFieldTypes = inCpAppSpec.cfgFieldTypes;
    inCpAppSpec.active._cfgFieldAutoFills = inCpAppSpec.cfgFieldAutoFills;
    l4iTemplate.Render({
        dstid: "incp-appspec-cfg-fieldlist",
        tplid: "incp-appspec-cfg-fieldlist-tpl",
        data: inCpAppSpec.active,
    });
}

inCpAppSpec.CfgSetCommit = function() {
    var alert_id = "#incp-appspec-cfg-fieldlist-alert";
    var form = $("#incp-appspec-cfg-fieldlist");
    if (!form) {
        return;
    }

    try {
        var name = form.find("input[name=name]").val();
        if (!name || !inCpAppSpec.fieldNameRe.test(name)) {
            throw "Invalid Name";
        }
        inCpAppSpec.active.configurator.name = name;
    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    var req = {
        meta: {
            id: inCpAppSpec.active.meta.id,
        },
        configurator: inCpAppSpec.active.configurator,
    }

    inCp.ApiCmd("app-spec/cfg-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, 'alert-danger', rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, 'alert-danger', "Network Connection Exception");
            }

            inCpAppSpec.active = null;
            l4i.InnerAlert(alert_id, 'alert-success', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
                inCpAppSpec.ListRefresh();
            }, 500);
        }
    });
}

inCpAppSpec.CfgFieldSet = function(name) {
    if (!inCpAppSpec.active) {
        return;
    }

    var field = null;
    if (name) {

        for (var i in inCpAppSpec.active.configurator.fields) {
            if (inCpAppSpec.active.configurator.fields[i].name == name) {
                field = l4i.Clone(inCpAppSpec.active.configurator.fields[i]);
                break;
            }
        }
    }
    if (!field) {
        field = l4i.Clone(inCpAppSpec.cfgFieldDef);
    }
    field._cfgFieldTypes = inCpAppSpec.cfgFieldTypes;
    field._cfgFieldAutoFills = inCpAppSpec.cfgFieldAutoFills;

    l4iModal.Open({
        id: "incp-appspec-cfgfieldset-modal",
        title: "Setting Field",
        tpluri: inCp.TplPath("app/spec/cfg-fieldset"),
        buttons: [{
            title: "Cancel",
            onclick: "l4iModal.Close()",
        }, {
            title: "Delete",
            onclick: "inCpAppSpec.CfgFieldDelCommit()",
        }, {
            title: "Save",
            onclick: 'inCpAppSpec.CfgFieldSetCommit()',
            style: "btn-primary",
        }],
        callback: function(err) {

            if (err) {
                return;
            }

            l4iTemplate.Render({
                dstid: "incp-appspec-cfg-fieldset-form",
                tplid: "incp-appspec-cfg-fieldset-tpl",
                data: field,
                callback: inCpAppSpec.CfgFieldSetValidatorNew,
            });
        },
    });
}


inCpAppSpec.CfgFieldSetValidatorNew = function() {
    l4iTemplate.Render({
        append: true,
        dstid: "incp-app-specset-cfgfield-validators",
        tplid: "incp-app-specset-cfgfield-validator-tpl",
    });
}


inCpAppSpec.CfgFieldSetCommit = function() {
    var alert_id = "#incp-appspec-cfg-fieldset-alert";
    var form = $("#incp-appspec-cfg-fieldset-form");
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
        if (!field.name || !inCpAppSpec.fieldNameRe.test(field.name)) {
            throw "Invalid Name";
        }

        field.title = form.find("input[name=title]").val();
        if (!field.title) {
            throw "Invalid Title";
        }

        field.prompt = form.find("input[name=prompt]").val();
        field.default = form.find("input[name=default]").val();

        field.auto_fill = form.find("select[name=auto_fill]").val();

        field.type = parseInt(form.find("select[name=type]").val());
        if (!field.type || field.type < 1 || field.type > 10) {
            throw "Invalid Type";
        }

        form.find(".incp-app-specset-cfgfield-validator-item").each(function() {
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

    for (var i in inCpAppSpec.active.configurator.fields) {

        if (inCpAppSpec.active.configurator.fields[i].name == name_prev && name_prev != field.name) {
            continue;
        }

        if (field && inCpAppSpec.active.configurator.fields[i].name == field.name) {
            fields.push(l4i.Clone(field))
            field = null;
        } else {
            fields.push(inCpAppSpec.active.configurator.fields[i]);
        }
    }

    if (field) {
        fields.push(field);
    }
    if (!inCpAppSpec.active.configurator.name) {
        inCpAppSpec.active.configurator.fields = fields;
        l4iModal.Prev(inCpAppSpec.cfgFieldListRefresh);
        return;
    }
    var req = {
        meta: {
            id: inCpAppSpec.active.meta.id,
        },
        configurator: {
            name: inCpAppSpec.active.configurator.name,
            fields: fields,
        },
    }

    inCp.ApiCmd("app-spec/cfg-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

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

            window.setTimeout(function() {
                inCpAppSpec.active.configurator.fields = fields;
                l4iModal.Prev(inCpAppSpec.cfgFieldListRefresh);
            }, 500);
        }
    });
}


inCpAppSpec.CfgFieldDelCommit = function() {
    var alert_id = "#incp-appspec-cfg-fieldset-alert";
    var form = $("#incp-appspec-cfg-fieldset-form");
    if (!form) {
        return;
    }

    var field = {
    }

    try {
        field.name = form.find("input[name=name]").val();
        if (!field.name || !inCpAppSpec.fieldNameRe.test(field.name)) {
            throw "Invalid Name";
        }

    } catch (err) {
        return l4i.InnerAlert(alert_id, 'alert-danger', err);
    }

    var fields = [];
    var req = {
        meta: {
            id: inCpAppSpec.active.meta.id,
        },
        configurator: {
            name: inCpAppSpec.active.configurator.name,
            fields: [],
        },
    }

    for (var i in inCpAppSpec.active.configurator.fields) {

        if (inCpAppSpec.active.configurator.fields[i].name == field.name) {
            req.configurator.fields.push(l4i.Clone(field));
        } else {
            fields.push(inCpAppSpec.active.configurator.fields[i]);
        }
    }

    if (req.configurator.fields.length == 0) {
        return l4i.InnerAlert(alert_id, 'alert-danger', "No field name Found");
    }

    inCp.ApiCmd("app-spec/cfg-field-del", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

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

            window.setTimeout(function() {
                inCpAppSpec.active.configurator.fields = fields;
                l4iModal.Prev(inCpAppSpec.cfgFieldListRefresh);
            }, 500);
        }
    });
}

