var inCpAppSpec = {
    def: {
        meta: {
            id: "",
            name: "",
            user: "",
            title: "",
            subtitle: "",
        },
        description: "",
        type_tags: [],
        packages: [],
        executors: [],
        service_ports: [],
        depends: [],
        dep_remotes: [],
        roles: [],
        exp_res: {},
        replica: {
            min: 1,
            max: 1,
        },
    },
    executorDef: {
        name: "",
        exec_start: "",
        exec_stop: "",
        priority: 8,
        plan: {
            on_boot: true,
        },
    },
    setActive: {},
    infoCache: null,
    active: null,
    cfgFieldTypes: [
        {
            type: 1,
            title: "String",
        },
        {
            type: 2,
            title: "Select",
        },
        {
            type: 300,
            title: "Text",
            lang: "shell",
        },
        {
            type: 301,
            title: "Text/JSON",
            lang: "json",
        },
        {
            type: 302,
            title: "Text/TOML",
            lang: "toml",
        },
        {
            type: 303,
            title: "Text/YAML",
            lang: "yaml",
        },
        {
            type: 304,
            title: "Text/INI",
            lang: "ini",
        },
        {
            type: 305,
            title: "Text/JavaProperties",
            lang: "shell",
        },
    ],
    cfgFieldAutoFills: [
        {
            type: "",
            title: "Disable",
        },
        {
            type: "defval",
            title: "Default Value",
        },
        {
            type: "hexstr_32",
            title: "Random Hex String (32 length)",
        },
        {
            type: "base64_48",
            title: "Random Base64 String (48 length)",
        },
    ],
    cfgFieldDef: {
        name: "",
        title: "",
        prompt: "",
        type: 1,
        default: "",
        auto_fill: "",
        validates: [],
        description: "",
    },
    deploySysStates: [
        {
            title: "Stateful",
            value: 1,
        },
        {
            title: "Stateless",
            value: 2,
        },
    ],
    deployNetworkModes: [
        {
            title: "Bridge",
            value: 1,
        },
        {
            title: "Host (sysadmin)",
            value: 2,
        },
    ],
    deploySysStateful: 1,
    deploySysStateless: 2,
    fieldNameRe: /^[a-z]{1}[0-9a-z_\/\-]{1,30}$/,
    iamAppRoles: null,
    vcsDef: {
        dir: "apps/demo",
        url: "https://github.com/inpack/demo-web-go.git",
        branch: "master",
        plan: "on_boot",
        auth_user: "",
        auth_pass: "",
        hook_exec_restart: "",
        hook_pod_restart: false,
    },
    listActives: null,
};

inCpAppSpec.CfgFieldTypeFetch = function (t) {
    for (var i in inCpAppSpec.cfgFieldTypes) {
        if (inCpAppSpec.cfgFieldTypes[i].type == t) {
            return inCpAppSpec.cfgFieldTypes[i];
        }
    }
    return null;
};

//
inCpAppSpec.ListRefresh = function (tplid) {
    if (!tplid || tplid.indexOf("/") >= 0) {
        tplid = "incp-app-specls";
    }

    if (!document.getElementById(tplid)) {
        inCp.TplFetch("app/spec/list", {
            callback: function (err, data) {
                $("#work-content").html(data);
                inCp.OpToolsRefresh("#incp-app-specls-optools");
                inCpAppSpec.listDataRefresh(tplid);
            },
        });
    } else {
        inCpAppSpec.listDataRefresh(tplid);
    }
};

inCpAppSpec.listDataRefresh = function (tplid, options) {
    options = options || {};
    var uri = "";
    var alert_id = "#" + tplid + "-alert";

    var el = document.getElementById(tplid + "-qry-text");
    if (el && el.value.length > 0) {
        uri = "qry_text=" + el.value;
    }
    uri +=
        "&fields=meta/id|name|user|version|updated,depends/name,dep_remotes/name,packages/name,executors/name,configurator/name,configurator/fields/name";

    inCp.ApiCmd("app-spec/list?" + uri, {
        timeout: 3000,
        callback: function (err, rsj) {
            if (err || !rsj || rsj.kind != "AppSpecList" || !rsj.items) {
                return l4i.InnerAlert(alert_id, "alert-info", "No more results ...");
            } else {
                $(alert_id).css({
                    display: "none",
                });
            }

            for (var i in rsj.items) {
                if (!rsj.items[i].depends) {
                    rsj.items[i].depends = [];
                }

                if (!rsj.items[i].dep_remotes) {
                    rsj.items[i].dep_remotes = [];
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
                    };
                }

                if (!rsj.items[i].configurator.fields) {
                    rsj.items[i].configurator.fields = [];
                }

                for (var j in rsj.items[i].configurator.fields) {
                    if (!rsj.items[i].configurator.fields[j].default) {
                        rsj.items[i].configurator.fields[j].default = "";
                    }

                    if (!rsj.items[i].configurator.fields[j].prompt) {
                        rsj.items[i].configurator.fields[j].prompt = "";
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

            inCpAppSpec.listActives = rsj.items;

            l4iTemplate.Render({
                dstid: tplid,
                tplid: tplid + "-tpl",
                data: {
                    items: rsj.items,
                    options: options,
                },
            });
        },
    });
};

inCpAppSpec.ListSelector = function (options) {
    options = options || {};

    if (!options.title) {
        options.title = "Select a Depend AppSpec";
    }

    if (!options.width) {
        options.width = 1200;
    }

    if (!options.height) {
        options.height = 600;
    }

    if (!options.fn_selector) {
        options.fn_selector = function () {
            l4iModal.Close();
        };
    }

    var subOptions = {};
    if (options.cfg_selector) {
        subOptions.cfg_selector = true;
    }

    l4iModal.Open({
        title: options.title,
        width: options.width,
        height: options.height,
        tpluri: inCp.TplPath("app/spec/selector-v2"),
        fn_selector: options.fn_selector,
        callback: function () {
            inCpAppSpec.listDataRefresh("incp-app-specls-selector", subOptions);
        },
        buttons: [
            {
                onclick: "l4iModal.Close()",
                title: "Close",
            },
        ],
    });
};

inCpAppSpec.ListSelectorClick = function (id) {
    if (l4iModal.CurOptions.fn_selector) {
        var options = {
            id: id,
            configs: [],
        };
        var check = $("#appspec-cfg-main-" + id);
        if (check && check.is(":checked")) {
            options.configs.push(check.val());
        }
        l4iModal.CurOptions.fn_selector(null, options);
    }
};

inCpAppSpec.ListSelectorQueryCommit = function () {
    var options = {};
    var v = $("#incp-app-specls-selector-option-cfg-selector").val();
    if (v && v == "true") {
        options.cfg_selector = true;
    }
    inCpAppSpec.listDataRefresh("incp-app-specls-selector", options);
};

inCpAppSpec.Info = function (id, spec, version, app_id) {
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create(
            "tpl",
            "data",
            "roles",
            "tags",
            function (tpl, rsj, roles, tags) {
                if (!rsj || rsj.error || rsj.kind != "AppSpec") {
                    return l4iAlert.Open("error", "AppSpec Not Found");
                }

                if (!rsj.depends) {
                    rsj.depends = [];
                }

                if (!rsj.dep_remotes) {
                    rsj.dep_remotes = [];
                }

                if (!rsj.packages) {
                    rsj.packages = [];
                }

                if (!rsj.vcs_repos) {
                    rsj.vcs_repos = [];
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
                        };
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

                for (var i in rsj.dep_remotes) {
                    if (!rsj.dep_remotes[i].name) {
                        rsj.dep_remotes[i].name = "";
                    }
                    if (!rsj.dep_remotes[i].configs) {
                        rsj.dep_remotes[i].configs = [];
                    }
                }

                if (!rsj.exp_deploy) {
                    rsj.exp_deploy = {};
                }
                if (!rsj.exp_deploy.rep_min) {
                    rsj.exp_deploy.rep_min = 1;
                    rsj.exp_deploy.rep_max = 1;
                }
                if (!rsj.exp_deploy.failover_time) {
                    rsj.exp_deploy.failover_time = 300;
                }
                if (!rsj.exp_deploy.failover_num_max) {
                    rsj.exp_deploy.failover_num_max = 0;
                } else if (rsj.exp_deploy.failover_num_max > 0) {
                    rsj.exp_deploy._failover_enable = true;
                }
                if (!rsj.exp_deploy.failover_rate_max) {
                    rsj.exp_deploy.failover_rate_max = 0;
                } else if (rsj.exp_deploy.failover_rate_max > 0) {
                    rsj.exp_deploy._failover_enable = true;
                }

                if (!rsj.exp_deploy.sys_state) {
                    rsj.exp_deploy.sys_state = inCpAppSpec.deploySysStateful;
                }
                for (var i in inCpAppSpec.deploySysStates) {
                    if (inCpAppSpec.deploySysStates[i].value == rsj.exp_deploy.sys_state) {
                        rsj.exp_deploy._sys_state = inCpAppSpec.deploySysStates[i].title;
                        break;
                    }
                }
                if (!rsj.exp_deploy._sys_state) {
                    rsj.exp_deploy._sys_state = "";
                }
                rsj.exp_res._cpu_min = (rsj.exp_res.cpu_min / 10).toFixed(1);

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
                rsj._multi_replica_enable = inCp.syscfg.zone_master.multi_replica_enable;

                rsj._type_tags = [];
                rsj.type_tags = rsj.type_tags ? rsj.type_tags : [];
                for (var i in rsj.type_tags) {
                    for (var j in tags.items) {
                        if (rsj.type_tags[i] == tags.items[j].name) {
                            rsj._type_tags.push(tags.items[j].value);
                            break;
                        }
                    }
                }

                rsj.runtime_images = rsj.runtime_images || [];

                l4iModal.Open({
                    title: "AppSpec Information",
                    width: 1400,
                    width_min: 1000,
                    height: "max",
                    tplsrc: tpl,
                    data: rsj,
                    buttons: [
                        {
                            onclick: 'inCpAppSpec.Download("' + rsj.meta.id + '")',
                            title: "Download the AppSpec file",
                            style: "btn-primary",
                        },
                        {
                            onclick: "l4iModal.Close()",
                            title: "Close",
                            style: "btn-primary",
                        },
                    ],
                    callback: function () {
                        inCp.CodeRender();
                    },
                });
            }
        );

        ep.fail(function (err) {
            // TODO
            alert("AppSpecSet error, Please try again later (EC:incp-app-specset)");
        });

        // template
        inCp.TplFetch("app/spec/info.p5", {
            callback: ep.done("tpl"),
        });

        if (inCpAppSpec.iamAppRoles) {
            ep.emit("roles", inCpAppSpec.iamAppRoles);
        } else {
            l4i.Ajax(inCp.base + "auth/app-role-list", {
                callback: function (err, data) {
                    if (err) {
                        return alert(err);
                    }
                    inCpAppSpec.iamAppRoles = data;
                    ep.emit("roles", data);
                },
            });
        }

        if (inCpAppSpec.TypeTagList) {
            ep.emit("tags", inCpAppSpec.TypeTagList);
        } else {
            inCp.ApiCmd("app-spec/type-tag-list", {
                callback: function (err, data) {
                    if (err) {
                        return alert(err);
                    }
                    if (!data || !data.items) {
                        return alert("network error");
                    }
                    inCpAppSpec.TypeTagList = data;
                    ep.emit("tags", data);
                },
            });
        }

        // data
        if (spec) {
            ep.emit("data", spec);
        } else if (inCpAppSpec.InfoCache) {
            ep.emit("data", inCpAppSpec.InfoCache);
        } else if (id) {
            var url = "app-spec/entry?id=" + id;
            if (version) {
                url += "&version=" + version;
            }
            if (app_id) {
                url += "&app_id=" + app_id;
            }

            inCp.ApiCmd(url, {
                callback: ep.done("data"),
            });
        } else {
            ep.emit("data", "");
        }
    });
};

inCpAppSpec.Download = function (id) {
    if (!id) {
        return;
    }
    window.open(inCp.api + "app-spec/entry?id=" + id + "&download=true&ct=toml", "Download");
};

inCpAppSpec.ItemDel = function (id) {
    if (!id) {
        return alert("No Item Found");
    }

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", function (tpl) {
            l4iModal.Open({
                title: "AppSpec Delete",
                tplsrc: tpl,
                width: 800,
                height: 200,
                data: {
                    _id: id,
                },
                buttons: [
                    {
                        onclick: "l4iModal.Close()",
                        title: "Close",
                    },
                    {
                        onclick: "inCpAppSpec.ItemDelCommit()",
                        title: "Confirm to Destroy",
                        style: "btn btn-danger",
                    },
                ],
            });
        });

        ep.fail(function (err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        inCp.TplFetch("app/spec/item-del", {
            callback: ep.done("tpl"),
        });
    });
};

inCpAppSpec.ItemDelCommit = function () {
    var alert_id = "#incp-appspecitem-del-alert";
    var form = $("#incp-appspecitem-del");
    var id = form.find("input[name=app_spec_id]").val();

    inCp.ApiCmd("app-spec/item-del?id=" + id, {
        method: "GET",
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "error", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "ok", "Successfully Updated");

            $("#app-spec-" + id + "-row").remove();

            window.setTimeout(function () {
                l4iModal.Close();
            }, 1000);
        },
    });
};

inCpAppSpec.Set = function (id) {
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create(
            "tpl",
            "data",
            "roles",
            "tags",
            function (tpl, rsj, roles, tags) {
                rsj = rsj || l4i.Clone(inCpAppSpec.def);

                if (!rsj || rsj.error || rsj.kind != "AppSpec") {
                    rsj = l4i.Clone(inCpAppSpec.def);
                }

                $("#work-content").html(tpl);

                rsj.meta.name = rsj.meta.name ? rsj.meta.name : "";
                rsj.meta.title = rsj.meta.title ? rsj.meta.title : "";
                rsj.meta.subtitle = rsj.meta.subtitle ? rsj.meta.subtitle : "";

                rsj.description = rsj.description ? rsj.description : "";
                rsj.comment = rsj.comment ? rsj.comment : "";

                rsj.packages = rsj.packages ? rsj.packages : [];
                rsj.executors = rsj.executors ? rsj.executors : [];

                rsj.service_ports = rsj.service_ports ? rsj.service_ports : [];

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

                for (var i in rsj.dep_remotes) {
                    if (!rsj.dep_remotes[i].name) {
                        rsj.dep_remotes[i].name = "";
                    }
                    if (!rsj.dep_remotes[i].configs) {
                        rsj.dep_remotes[i].configs = [];
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

                if (!rsj.exp_res.cpu_min) {
                    rsj.exp_res.cpu_min = 1;
                }
                rsj.exp_res._cpu_min = (rsj.exp_res.cpu_min / 10).toFixed(1);

                if (!rsj.exp_res.mem_min) {
                    rsj.exp_res.mem_min = 32;
                }

                if (!rsj.exp_res.vol_min) {
                    rsj.exp_res.vol_min = 1;
                }

                if (!rsj.exp_deploy) {
                    rsj.exp_deploy = {};
                }
                if (!rsj.exp_deploy.rep_min || rsj.exp_deploy.rep_min < 1) {
                    rsj.exp_deploy.rep_min = 1;
                }
                if (!rsj.exp_deploy.rep_max || rsj.exp_deploy.rep_max < 1) {
                    rsj.exp_deploy.rep_max = 1;
                } else if (rsj.exp_deploy.rep_max > inCpPod.OpRepMax) {
                    rsj.exp_deploy.rep_max = inCpPod.OpRepMax;
                }
                if (rsj.exp_deploy.rep_min > rsj.exp_deploy.rep_max) {
                    rsj.exp_deploy.rep_min = rsj.exp_deploy.rep_max;
                }
                if (!rsj.exp_deploy.failover_time) {
                    rsj.exp_deploy.failover_time = 600;
                }
                if (!rsj.exp_deploy.failover_num_max) {
                    rsj.exp_deploy.failover_num_max = 0;
                } else if (rsj.exp_deploy.failover_num_max > 0) {
                    rsj.exp_deploy._failover_enable = true;
                }
                if (!rsj.exp_deploy.failover_rate_max) {
                    rsj.exp_deploy.failover_rate_max = 0;
                } else if (rsj.exp_deploy.failover_rate_max > 0) {
                    rsj.exp_deploy._failover_enable = true;
                }
                if (!rsj.exp_deploy.sys_state) {
                    rsj.exp_deploy.sys_state = inCpAppSpec.deploySysStateful;
                }

                rsj._type_tags = l4i.Clone(tags);
                rsj.type_tags = rsj.type_tags ? rsj.type_tags : [];
                for (var i in rsj.type_tags) {
                    for (var j in rsj._type_tags.items) {
                        if (rsj._type_tags.items[j].name == rsj.type_tags[i]) {
                            rsj._type_tags.items[j]._checked = true;
                            break;
                        }
                    }
                }

                rsj.runtime_images = rsj.runtime_images ? rsj.runtime_images : [];

                inCpAppSpec.setActive = rsj;

                l4iTemplate.Render({
                    dstid: "incp-app-specset",
                    tplid: "incp-app-specset-tpl",
                    data: {
                        actionTitle:
                            rsj.meta.id == "" ? "New AppSpec" : "Setting (" + rsj.meta.id + ")",
                        spec: rsj,
                        _multi_replica_enable: inCp.syscfg.zone_master.multi_replica_enable,
                        _deploy_sys_states: inCpAppSpec.deploySysStates,
                        _deploy_network_modes: inCpAppSpec.deployNetworkModes,
                    },
                    callback: function () {
                        inCpAppSpec.setDependRefresh();
                        inCpAppSpec.setDepRemoteRefresh();
                        inCpAppSpec.setPackRefresh();
                        inCpAppSpec.setVcsRefresh();
                        inCpAppSpec.setExecutorRefresh();

                        if (rsj.service_ports.length == 0) {
                            inCpAppSpec.SetServicePortAppend();
                        }
                    },
                });
            }
        );

        ep.fail(function (err) {
            // TODO
            alert("AppSpecSet error, Please try again later (EC:incp-app-specset)");
        });

        // template
        inCp.TplFetch("app/spec/set", {
            callback: ep.done("tpl"),
        });

        if (inCpAppSpec.iamAppRoles) {
            ep.emit("roles", inCpAppSpec.iamAppRoles);
        } else {
            l4i.Ajax(inCp.base + "auth/app-role-list", {
                callback: function (err, data) {
                    if (err) {
                        return alert(err);
                    }
                    inCpAppSpec.iamAppRoles = data;
                    ep.emit("roles", data);
                },
            });
        }

        if (inCpAppSpec.TypeTagList) {
            ep.emit("tags", inCpAppSpec.TypeTagList);
        } else {
            inCp.ApiCmd("app-spec/type-tag-list", {
                callback: function (err, data) {
                    if (err) {
                        return alert(err);
                    }
                    if (!data || !data.items) {
                        return alert("network error");
                    }
                    inCpAppSpec.TypeTagList = data;
                    ep.emit("tags", data);
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
};

// TODO
inCpAppSpec.SetDependSelect = function () {
    inCpAppSpec.ListSelector({
        title: "Select a Internally dependent AppSpec",
        width: 1000,
        height: 600,
        fn_selector: function (err, options) {
            l4iModal.Close();
            inCpAppSpec.setDependEntry(options);
        },
    });
};

inCpAppSpec.setDependEntry = function (opt) {
    if (!opt || !opt.id) {
        return;
    }
    if (opt.id == inCpAppSpec.setActive.meta.id) {
        return;
    }

    var alert_id = "#incp-app-specset-alert";

    inCp.ApiCmd("app-spec/entry?id=" + opt.id, {
        timeout: 10000,
        callback: function (err, rsj) {
            if (err) {
                return l4i.InnerAlert(alert_id, "error", err);
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, "error", msg);
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
                    };
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
        },
    });
};

inCpAppSpec.SetDependRemove = function (id) {
    if (id.length < 1) {
        return;
    }

    for (var i in inCpAppSpec.setActive.depends) {
        if (inCpAppSpec.setActive.depends[i].id == id) {
            inCpAppSpec.setActive.depends.splice(i, 1);
            break;
        }
    }

    inCpAppSpec.setDependRefresh();
};

inCpAppSpec.setDependRefresh = function () {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.depends) {
        return;
    }

    var display = "none";
    if (inCpAppSpec.setActive.depends.length > 0) {
        //
    } else {
        display = "inline-block";
    }
    $("#incp-app-specset-depls-msg").css({
        display: display,
    });

    l4iTemplate.Render({
        dstid: "incp-app-specset-depls",
        tplid: "incp-app-specset-depls-tpl",
        data: {
            items: inCpAppSpec.setActive.depends,
        },
    });
};

inCpAppSpec.SetDepRemoteSelect = function () {
    inCpAppSpec.ListSelector({
        title: "Select a Remotely dependent AppSpec",
        width: 1100,
        height: 600,
        cfg_selector: true,
        fn_selector: function (err, options) {
            l4iModal.Close();
            inCpAppSpec.setDepRemoteEntry(options);
        },
    });
};

inCpAppSpec.setDepRemoteEntry = function (opt) {
    if (!opt || !opt.id) {
        return;
    }
    if (opt.id == inCpAppSpec.setActive.meta.id) {
        return;
    }

    if (!opt.configs) {
        opt.configs = [];
    }

    var alert_id = "#incp-app-specset-alert";

    inCp.ApiCmd("app-spec/entry?id=" + opt.id, {
        timeout: 10000,
        callback: function (err, rsj) {
            if (err) {
                return l4i.InnerAlert(alert_id, "error", err);
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, "error", msg);
            }

            if (!inCpAppSpec.setActive.dep_remotes) {
                inCpAppSpec.setActive.dep_remotes = [];
            }

            for (var i in inCpAppSpec.setActive.dep_remotes) {
                if (inCpAppSpec.setActive.dep_remotes[i].id == rsj.meta.id) {
                    inCpAppSpec.setActive.dep_remotes[i] = {
                        id: rsj.meta.id,
                        name: rsj.meta.name,
                        version: rsj.meta.version,
                        configs: opt.configs,
                    };
                    rsj = null;
                    break;
                }
            }

            if (rsj) {
                inCpAppSpec.setActive.dep_remotes.push({
                    id: rsj.meta.id,
                    name: rsj.meta.name,
                    version: rsj.meta.version,
                    configs: opt.configs,
                });
            }

            inCpAppSpec.setDepRemoteRefresh();
        },
    });
};

inCpAppSpec.SetDepRemoteRemove = function (id) {
    if (id.length < 1) {
        return;
    }

    for (var i in inCpAppSpec.setActive.dep_remotes) {
        if (inCpAppSpec.setActive.dep_remotes[i].id == id) {
            inCpAppSpec.setActive.dep_remotes.splice(i, 1);
            break;
        }
    }

    inCpAppSpec.setDepRemoteRefresh();
};

inCpAppSpec.setDepRemoteRefresh = function () {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.dep_remotes) {
        return;
    }

    var display = "none";
    if (inCpAppSpec.setActive.dep_remotes.length > 0) {
        //
    } else {
        display = "inline-block";
    }
    $("#incp-app-specset-depremotes-msg").css({
        display: display,
    });

    l4iTemplate.Render({
        dstid: "incp-app-specset-depremotes",
        tplid: "incp-app-specset-depremotes-tpl",
        data: {
            items: inCpAppSpec.setActive.dep_remotes,
        },
    });
};

// TODO
inCpAppSpec.SetPackSelect = function () {
    l4iModal.Open({
        title: "Select a dependent Package",
        width: 900,
        height: 600,
        tpluri: inCp.base + "/ips/~/ips/tpl/pkginfo/selector.html",
        fn_selector: function (err, rsp) {
            l4iModal.Close();
            inCpAppSpec.setPackInfo({
                id: rsp,
            });
        },
        buttons: [
            {
                onclick: "l4iModal.Close()",
                title: "Close",
            },
        ],
    });
};

inCpAppSpec.setPackInfo = function (opt) {
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
        callback: function (err, rsj) {
            if (err) {
                return l4i.InnerAlert(alert_id, "error", err);
            }

            if (!rsj || rsj.kind != "Pack") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, "error", msg);
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
                    };
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

            inCpAppSpec.setPackRefresh();
        },
    });
};

inCpAppSpec.SetPackRemove = function (name) {
    if (name.length < 1) {
        return;
    }

    for (var i in inCpAppSpec.setActive.packages) {
        if (inCpAppSpec.setActive.packages[i].name == name) {
            inCpAppSpec.setActive.packages.splice(i, 1);
            break;
        }
    }

    inCpAppSpec.setPackRefresh();
};

inCpAppSpec.SetPackVersionRefresh = function (name) {
    if (name.length < 1) {
        return;
    }

    var v = $("#app_spec_setform_pkg_" + name).val();
    if (!v || v.length < 1) {
        return;
    }

    for (var i in inCpAppSpec.setActive.packages) {
        if (inCpAppSpec.setActive.packages[i].name == name) {
            inCpAppSpec.setActive.packages[i].version = v;
            $("#app_spec_setform_pkg_vol_" + name).text("/usr/sysinner/" + name + "/" + v);
            break;
        }
    }
};

inCpAppSpec.setPackRefresh = function () {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.packages) {
        return;
    }

    var display = "none";
    if (inCpAppSpec.setActive.packages.length > 0) {
        //
    } else {
        display = "inline-block";
    }
    $("#incp-app-specset-ipmls-msg").css({
        display: display,
    });

    l4iTemplate.Render({
        dstid: "incp-app-specset-ipmls",
        tplid: "incp-app-specset-ipmls-tpl",
        data: {
            items: inCpAppSpec.setActive.packages,
        },
    });
};

inCpAppSpec.SetVcsSet = function (dir) {
    var item = null,
        modal_title = "Setting Git Repo";

    if (dir && inCpAppSpec.setActive.vcs_repos) {
        for (var i in inCpAppSpec.setActive.vcs_repos) {
            if (inCpAppSpec.setActive.vcs_repos[i].dir == dir) {
                item = inCpAppSpec.setActive.vcs_repos[i];
                break;
            }
        }
    }
    if (!item) {
        item = l4i.Clone(inCpAppSpec.vcsDef);
        modal_title = "Import from Git Repo";
    }
    if (!item.hook_exec_restart) {
        item.hook_exec_restart = "";
    }
    if (!item.auth_user) {
        item.auth_user = "";
    }
    if (!item.auth_pass) {
        item.auth_pass = "";
    }
    if (!item.branch) {
        item.branch = "";
    }

    l4iModal.Open({
        title: modal_title,
        width: 1000,
        height: 600,
        tpluri: inCp.TplPath("app/spec/set-vcs-set"),
        data: item,
        buttons: [
            {
                onclick: "l4iModal.Close()",
                title: "Cancel",
            },
            {
                onclick: "inCpAppSpec.SetVcsSetCommit()",
                title: "OK",
                style: "btn-primary",
            },
        ],
    });
};

inCpAppSpec.vcsDirReg = /^([a-zA-Z0-9\.\/\-_]{1,100})$/;
inCpAppSpec.vcsGitHttpRe = /^(https?:\/\/)([\w\-_.\/]+)(.git)$/;
inCpAppSpec.vcsGitBranchRe = /^([\w\-_.]+)$/;

inCpAppSpec.SetVcsSetCommit = function () {
    var alert_id = "#incp-app-specset-vcsset-alert";

    try {
        var form = $("#incp-app-specset-vcsset");
        if (!form) {
            throw "No Form Data Found";
        }

        var url = form.find("input[name=vcs_url]").val();
        if (!inCpAppSpec.vcsGitHttpRe.test(url)) {
            throw "Invalid Git Repo URL";
        }

        var bn = form.find("input[name=vcs_branch]").val();
        if (!inCpAppSpec.vcsGitBranchRe.test(bn)) {
            throw "Invalid Branch Name";
        }

        var auth_user = form.find("input[name=vcs_auth_user]").val();
        var auth_pass = form.find("input[name=vcs_auth_pass]").val();

        var dir = form.find("input[name=vcs_dir]").val();
        if (!inCpAppSpec.vcsDirReg.test(dir)) {
            throw "Invalid Target Directory";
        }

        var plan = form.find("select[name=vcs_plan]").val();
        switch (plan) {
            case "on_boot":
                break;
            case "on_update":
                break;
            default:
                throw "Invalid Plan";
                break;
        }

        var hook_exec = form.find("input[name=vcs_hook_exec_restart]").val();
        if (!hook_exec) {
            hook_exec = "";
        }
        if (hook_exec) {
            var found = false;
            for (var i in inCpAppSpec.setActive.executors) {
                if (inCpAppSpec.setActive.executors[i].name == hook_exec) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                throw "No Executor Name (" + hook_exec + ") Found";
            }
        }

        var hook_pod = form.find("select[name=vcs_hook_pod_restart]").val();
        if (hook_pod != "yes") {
            hook_pod = false;
        } else {
            hook_pod = true;
        }

        var vcsItem = {
            dir: dir,
            url: url,
            branch: bn,
            plan: plan,
            auth_user: auth_user,
            auth_pass: auth_pass,
            hook_exec_restart: hook_exec,
            hook_pod_restart: hook_pod,
        };
        var ok = false;

        if (!inCpAppSpec.setActive.vcs_repos) {
            inCpAppSpec.setActive.vcs_repos = [];
        }
        for (var i in inCpAppSpec.setActive.vcs_repos) {
            if (inCpAppSpec.setActive.vcs_repos[i].dir == dir) {
                inCpAppSpec.setActive.vcs_repos[i] = vcsItem;
                ok = true;
                break;
            }
        }
        if (!ok) {
            inCpAppSpec.setActive.vcs_repos.push(vcsItem);
        }
    } catch (err) {
        return l4i.InnerAlert(alert_id, "error", err);
    }

    inCpAppSpec.setVcsRefresh();
    l4iModal.Close();
};

inCpAppSpec.setVcsRefresh = function () {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.vcs_repos) {
        return;
    }

    var display = "none";
    if (inCpAppSpec.setActive.vcs_repos && inCpAppSpec.setActive.vcs_repos.length > 0) {
        //
    } else {
        display = "inline-block";
    }
    $("#incp-app-specset-vcsls-msg").css({
        display: display,
    });

    for (var i in inCpAppSpec.setActive.vcs_repos) {
        if (!inCpAppSpec.setActive.vcs_repos[i].branch) {
            inCpAppSpec.setActive.vcs_repos[i].branch = "master";
        }

        if (!inCpAppSpec.setActive.vcs_repos[i].plan) {
            inCpAppSpec.setActive.vcs_repos[i].plan = "on_boot";
        }
    }

    l4iTemplate.Render({
        dstid: "incp-app-specset-vcsls",
        tplid: "incp-app-specset-vcsls-tpl",
        data: {
            items: inCpAppSpec.setActive.vcs_repos,
        },
    });
};

inCpAppSpec.SetVcsRemove = function (dir) {
    if (!dir) {
        dir = "";
    }

    for (var i in inCpAppSpec.setActive.vcs_repos) {
        if (inCpAppSpec.setActive.vcs_repos[i].dir == dir) {
            inCpAppSpec.setActive.vcs_repos.splice(i, 1);
            break;
        }
    }

    inCpAppSpec.setVcsRefresh();
};

inCpAppSpec.SetExecutorSet = function (name) {
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
        width: 1200,
        min_width: 960,
        height: 1000,
        tpluri: inCp.TplPath("app/spec/executor-set"),
        data: executor,
        callback: function (err) {
            if (err) {
                return;
            }
            inCp.CodeEditor("spec_exec_start", "shell", {
                numberLines: 12,
            });
            inCp.CodeEditor("spec_exec_stop", "shell", {
                numberLines: 6,
            });
        },
        buttons: [
            {
                onclick: "l4iModal.Close()",
                title: "Cancel",
            },
            {
                onclick: "inCpAppSpec.SetExecutorSave()",
                title: "OK",
                style: "btn-primary",
            },
        ],
    });
};

inCpAppSpec.SetExecutorSave = function () {
    var alert_id = "#incp-app-specset-executorset-p5-alert";

    try {
        var form = $("#incp-app-specset-executorset-p5");

        if (!form) {
            throw "No Form Data Found";
        }

        var executor = {
            name: form.find("input[name=name]").val(),
            // exec_start: form.find("textarea[name=exec_start]").val(),
            // exec_stop: form.find("textarea[name=exec_stop]").val(),
            priority: parseInt(form.find("input[name=priority]").val()),
            plan: {},
        };

        //
        executor.exec_start = inCp.CodeEditorValue("spec_exec_start");
        if (!executor.exec_start) {
            throw "ExecStart Not Setup";
        }

        //
        executor.exec_stop = inCp.CodeEditorValue("spec_exec_stop");

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
            throw "Name Not Found";
        }

        for (var i in inCpAppSpec.setActive.executors) {
            if (inCpAppSpec.setActive.executors[i].name == executor.name) {
                inCpAppSpec.setActive.executors[i] = executor;
                executor = null;
                break;
            }
        }

        if (executor) {
            inCpAppSpec.setActive.executors.push(executor);
        }
    } catch (err) {
        return l4i.InnerAlert(alert_id, "error", err);
    }

    inCpAppSpec.setExecutorRefresh();

    l4iModal.Close();
};

inCpAppSpec.SetExecutorRemove = function (name) {
    if (name.length < 4) {
        return;
    }

    for (var i in inCpAppSpec.setActive.executors) {
        if (inCpAppSpec.setActive.executors[i].name == name) {
            inCpAppSpec.setActive.executors.splice(i, 1);
            break;
        }
    }

    inCpAppSpec.setExecutorRefresh();
};

inCpAppSpec.SetServicePortAppend = function () {
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
};

inCpAppSpec.SetServicePortDel = function (field) {
    $(field).parent().parent().remove();
};

inCpAppSpec.setExecutorRefresh = function () {
    if (!inCpAppSpec.setActive || !inCpAppSpec.setActive.executors) {
        return;
    }

    var display = "none";
    if (inCpAppSpec.setActive.executors.length > 0) {
        //
    } else {
        display = "inline-block";
    }
    $("#incp-app-specset-executorls-msg").css({
        display: display,
    });

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
            };
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
        callback: function () {
            inCp.CodeRender();
        },
    });
};

inCpAppSpec.SetDeployFailoverRefresh = function () {
    var el = document.getElementById("exp_deploy_failover_checkbox");
    var el2 = document.getElementById("exp_deploy_failover_box");
    if (!el || !el2) {
        return;
    }
    if (el.checked === true) {
        el2.style.display = "block";
    } else {
        el2.style.display = "none";
    }
};

inCpAppSpec.SetCommit = function () {
    var footer_id = "incp-appspec-set-footer";

    try {
        inCpAppSpec.setActive.kind = "AppSpec";

        var form = $("#incp-app-specset");
        if (!form) {
            throw "No Form Data Found";
        }

        inCpAppSpec.setActive.meta.id = form.find("input[name=meta_id]").val();
        inCpAppSpec.setActive.meta.name = form.find("input[name=meta_name]").val();
        inCpAppSpec.setActive.meta.subtitle = form.find("input[name=meta_subtitle]").val();
        inCpAppSpec.setActive.description = form.find("textarea[name=description]").val();
        inCpAppSpec.setActive.comment = form.find("input[name=comment]").val();

        var dep_pv = 0;
        if (inCpAppSpec.setActive.packages && inCpAppSpec.setActive.packages.length > 0) {
            dep_pv += 1;
        }
        if (inCpAppSpec.setActive.vcs_repos && inCpAppSpec.setActive.vcs_repos.length > 0) {
            dep_pv += 1;
        }
        if (dep_pv < 1) {
            // throw "Required Package or Git Repo";
        }

        for (var i in inCpAppSpec.setActive.depends) {
            var v = $("#app_specset_depend_version_" + inCpAppSpec.setActive.depends[i].id).val();
            if (v && v.length) {
                inCpAppSpec.setActive.depends[i].version = v;
            }
        }

        for (var i in inCpAppSpec.setActive.dep_remotes) {
            var v = $(
                "#app_specset_dep_remote_version_" + inCpAppSpec.setActive.dep_remotes[i].id
            ).val();
            if (v && v.length) {
                inCpAppSpec.setActive.dep_remotes[i].version = v;
            }
        }

        inCpAppSpec.setActive.service_ports = [];
        form.find(".incp-app-specset-serviceport-item").each(function () {
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

        inCpAppSpec.setActive.runtime_images = form
            .find("input[name=runtime_images]")
            .val()
            .split(",");

        inCpAppSpec.setActive.roles = [];
        form.find("input[name=roles]:checked").each(function () {
            var val = parseInt($(this).val());
            if (val > 1) {
                inCpAppSpec.setActive.roles.push(val);
            }
        });

        inCpAppSpec.setActive.type_tags = [];
        form.find("input[name=type_tags]:checked").each(function () {
            var val = $(this).val();
            if (val && val.length > 0) {
                inCpAppSpec.setActive.type_tags.push(val);
            }
        });

        inCpAppSpec.setActive.exp_res.cpu_min = parseInt(
            parseFloat(form.find("input[name=exp_res_cpu_min]").val()) * 10
        );
        inCpAppSpec.setActive.exp_res.mem_min = parseInt(
            form.find("input[name=exp_res_mem_min]").val()
        );
        inCpAppSpec.setActive.exp_res.vol_min = parseInt(
            form.find("input[name=exp_res_vol_min]").val()
        );
        if (inCpAppSpec.setActive.exp_res.vol_min < 1) {
            inCpAppSpec.setActive.exp_res.vol_min = 1;
        }

        //
        var rep_min = parseInt(form.find("input[name=exp_deploy_rep_min]").val());
        var rep_max = parseInt(form.find("input[name=exp_deploy_rep_max]").val());
        if (rep_min < 1) {
            rep_min = 1;
        }
        if (rep_max < 1) {
            rep_max = 1;
        } else if (rep_max > inCpPod.OpRepMax) {
            rep_max = inCpPod.OpRepMax;
        }
        if (rep_min > rep_max) {
            rep_min = rep_max;
        }
        inCpAppSpec.setActive.exp_deploy.rep_min = rep_min;
        inCpAppSpec.setActive.exp_deploy.rep_max = rep_max;

        //
        var sys_state = parseInt(form.find("select[name=exp_deploy_sys_state]").val());
        if (
            sys_state != inCpAppSpec.deploySysStateless &&
            sys_state != inCpAppSpec.deploySysStateful
        ) {
            sys_state = inCpAppSpec.deploySysStateful;
        }
        inCpAppSpec.setActive.exp_deploy.sys_state = sys_state;

        //
        var network_mode = parseInt(form.find("select[name=exp_deploy_network_mode]").val());
        if (network_mode < 1) {
            network_mode = 1;
        }
        inCpAppSpec.setActive.exp_deploy.network_mode = network_mode;

        //
        var fail_time = parseInt(form.find("input[name=exp_deploy_failover_time]").val());
        var fail_num_max = parseInt(form.find("input[name=exp_deploy_failover_num_max]").val());
        var fail_rate_max = parseInt(form.find("input[name=exp_deploy_failover_rate_max]").val());
        if (fail_time < 0) {
            fail_time = 0;
        }
        if (fail_num_max < 0) {
            fail_num_max = 0;
        }
        if (fail_rate_max < 0) {
            fail_rate_max = 0;
        }
        inCpAppSpec.setActive.exp_deploy.failover_time = fail_time;
        inCpAppSpec.setActive.exp_deploy.failover_num_max = fail_num_max;
        inCpAppSpec.setActive.exp_deploy.failover_rate_max = fail_rate_max;
    } catch (err) {
        return l4iModal.FootAlert("error", "valid fail : " + err, 3000, footer_id);
    }

    inCp.ApiCmd("app-spec/set", {
        method: "POST",
        data: JSON.stringify(inCpAppSpec.setActive),
        timeout: 3000,
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4iModal.FootAlert("error", "network error", 3000, footer_id);
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4iModal.FootAlert("error", msg, 3000, footer_id);
            }

            l4iModal.FootAlert("ok", "Successful operation", 3000, footer_id);

            window.setTimeout(function () {
                inCpAppSpec.ListRefresh();
                inCpAppSpec.setActive = {};
            }, 1000);
        },
    });
};

inCpAppSpec.SetRaw = function (id) {
    var formset = {
        actionTitle: "New AppSpec",
        spec_text: "",
    };
    if (id) {
        formset.actionTitle = "Setting AppSpec (" + id + ")";
        formset.meta_id = id;
    } else {
        formset.meta_id = "";
    }

    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("data", function (data) {
            formset.spec_text = data;

            l4iTemplate.Render({
                dstid: "incp-app-specset",
                tplid: "incp-app-specset-raw-tpl",
                data: formset,
                callback: function () {
                    var bh = $(window).height();
                    var pp = $("#incp-app-specset").position();
                    var height = bh - pp.top - 250;
                    if (height < 200) {
                        height = 200;
                    }

                    inCp.CodeEditor("incp-app-specset-spectext", "toml", {
                        height: height,
                    });
                },
            });
        });

        ep.fail(function (err) {
            // TODO
            alert("AppSpecSet error, Please try again later (EC:incp-app-specset)");
        });

        if (!id) {
            ep.emit("data", "");
        } else {
            inCp.ApiCmd("app-spec/entry?ct=toml&id=" + id, {
                callback: ep.done("data"),
            });
        }
    });
};

inCpAppSpec.SetRawCommit = function () {
    var alert_id = "#incp-app-specset-alert";
    var setActive = null;

    try {
        var form = $("#incp-app-specset");
        if (!form) {
            throw "No Form Data Found";
        }

        var txt = inCp.CodeEditorValue("incp-app-specset-spectext");
        if (!txt || txt.length < 10) {
            throw "No Data Found";
        }

        setActive = txt;
    } catch (err) {
        return l4i.InnerAlert(alert_id, "error", err);
    }

    inCp.ApiCmd("app-spec/set", {
        method: "POST",
        data: setActive,
        timeout: 3000,
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, "error", "Failed");
            }

            if (!rsj || rsj.kind != "AppSpec") {
                var msg = "Bad Request";
                if (rsj.error) {
                    msg = rsj.error.message;
                }
                return l4i.InnerAlert(alert_id, "error", msg);
            }

            l4i.InnerAlert(alert_id, "ok", "Successful operation");
            window.setTimeout(function () {
                inCpAppSpec.ListRefresh();
            }, 1000);
        },
    });
};

//
inCpAppSpec.CfgSet = function (spec_id) {
    seajs.use(["ep"], function (EventProxy) {
        var ep = EventProxy.create("tpl", "data", function (tpl, data) {
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
                };
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

            var btns = [
                {
                    title: "Cancel",
                    onclick: "l4iModal.Close()",
                },
            ];
            if (inCp.UserSession.username == data.meta.user) {
                /**
                        btns.push({
                            title: "New Field",
                            onclick: 'inCpAppSpec.CfgFieldSet()',
                            style: "btn-primary",
                        });
                */
                btns.push({
                    title: "Save",
                    onclick: "inCpAppSpec.CfgSetCommit()",
                    style: "btn-primary",
                });
            }

            l4iModal.Open({
                id: "incp-appspec-cfg-fieldlist-modal",
                title: "Configurator",
                tplsrc: tpl,
                width: 1200,
                height: 800,
                buttons: btns,
                callback: function () {
                    inCpAppSpec.cfgFieldListRefresh();
                },
            });
        });

        ep.fail(function (err) {
            alert("ApiCmd error, Please try again later (EC:001)");
        });

        inCp.TplFetch("app/spec/cfg-fieldlist", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("app-spec/entry?id=" + spec_id, {
            callback: ep.done("data"),
        });
    });
};

inCpAppSpec.cfgFieldListRefresh = function () {
    var name = null;
    var elem = $("#incp-appspec-cfg-fieldlist-name");
    if (elem) {
        name = elem.val();
    }
    if (!name || name.length < 4) {
        if (
            inCpAppSpec.active.configurator.name &&
            inCpAppSpec.active.configurator.name.length > 3
        ) {
            name = inCpAppSpec.active.configurator.name;
        } else {
            name = "cfg/" + inCpAppSpec.active.meta.id;
        }
    }

    inCpAppSpec.active._cfgFieldTypes = inCpAppSpec.cfgFieldTypes;
    inCpAppSpec.active._cfgFieldAutoFills = inCpAppSpec.cfgFieldAutoFills;
    l4iTemplate.Render({
        dstid: "incp-appspec-cfg-fieldlist",
        tplid: "incp-appspec-cfg-fieldlist-tpl",
        data: inCpAppSpec.active,
        callback: function () {
            if (name && name.length > 0) {
                $("#incp-appspec-cfg-fieldlist-name").val(name);
            }
        },
    });
};

inCpAppSpec.CfgFieldSubString = function (str, len) {
    if (str && str.length > len) {
        return str.substring(0, len) + " (size " + str.length + ") ...";
    }
    return str;
};

inCpAppSpec.CfgSetCommit = function () {
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
        if (!name.startsWith("cfg/")) {
            name = "cfg/" + name;
        }
        inCpAppSpec.active.configurator.name = name;
    } catch (err) {
        return l4i.InnerAlert(alert_id, "error", err);
    }

    var req = {
        meta: {
            id: inCpAppSpec.active.meta.id,
        },
        configurator: inCpAppSpec.active.configurator,
    };

    inCp.ApiCmd("app-spec/cfg-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "error", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            inCpAppSpec.active = null;
            l4i.InnerAlert(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                l4iModal.Close();
                inCpAppSpec.ListRefresh();
            }, 500);
        },
    });
};

inCpAppSpec.CfgFieldSet = function (name) {
    if (!inCpAppSpec.active) {
        return;
    }
    var cname = $("#incp-appspec-cfg-fieldlist-name");
    if (cname) {
        inCpAppSpec.active.configurator.name = cname.val();
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
    if (!field.description) {
        field.description = "";
    }
    field._cfgFieldTypes = inCpAppSpec.cfgFieldTypes;
    field._cfgFieldAutoFills = inCpAppSpec.cfgFieldAutoFills;

    l4iModal.Open({
        id: "incp-appspec-cfgfieldset-modal",
        title: "Setting Field",
        tpluri: inCp.TplPath("app/spec/cfg-fieldset"),
        buttons: [
            {
                title: "Cancel",
                onclick: "l4iModal.Close()",
            },
            {
                title: "Delete",
                onclick: "inCpAppSpec.CfgFieldDelCommit()",
            },
            {
                title: "Save",
                onclick: "inCpAppSpec.CfgFieldSetCommit()",
                style: "btn-primary",
            },
        ],
        callback: function (err) {
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
};

inCpAppSpec.CfgFieldSetValidatorNew = function () {
    l4iTemplate.Render({
        append: true,
        dstid: "incp-app-specset-cfgfield-validators",
        tplid: "incp-app-specset-cfgfield-validator-tpl",
    });
};

inCpAppSpec.CfgFieldSetCommit = function () {
    var alert_id = "#incp-appspec-cfg-fieldset-alert";
    var form = $("#incp-appspec-cfg-fieldset-form");
    if (!form) {
        return;
    }

    var field = {
        type: 1,
        validates: [],
    };
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
        field.description = form.find("textarea[name=description]").val();

        field.prompt = form.find("input[name=prompt]").val();
        field.default = form.find("textarea[name=default]").val();

        field.auto_fill = form.find("select[name=auto_fill]").val();

        field.type = parseInt(form.find("select[name=type]").val());
        if (!field.type || field.type < 1 || field.type > 999) {
            throw "Invalid Type";
        }

        form.find(".incp-app-specset-cfgfield-validator-item").each(function () {
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
        return l4i.InnerAlert(alert_id, "error", err);
    }

    var fields = [];

    for (var i in inCpAppSpec.active.configurator.fields) {
        if (
            inCpAppSpec.active.configurator.fields[i].name == name_prev &&
            name_prev != field.name
        ) {
            continue;
        }

        if (field && inCpAppSpec.active.configurator.fields[i].name == field.name) {
            fields.push(l4i.Clone(field));
            field = null;
        } else {
            fields.push(inCpAppSpec.active.configurator.fields[i]);
        }
    }

    if (field) {
        fields.push(field);
    }
    if (!inCpAppSpec.active.configurator.name || inCpAppSpec.active.configurator.name.length < 1) {
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
    };

    inCp.ApiCmd("app-spec/cfg-set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "error", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                inCpAppSpec.active.configurator.fields = fields;
                l4iModal.Prev(inCpAppSpec.cfgFieldListRefresh);
            }, 500);
        },
    });
};

inCpAppSpec.CfgFieldDelCommit = function () {
    var alert_id = "#incp-appspec-cfg-fieldset-alert";
    var form = $("#incp-appspec-cfg-fieldset-form");
    if (!form) {
        return;
    }

    var field = {};

    try {
        field.name = form.find("input[name=name]").val();
        if (!field.name || !inCpAppSpec.fieldNameRe.test(field.name)) {
            throw "Invalid Name";
        }
    } catch (err) {
        return l4i.InnerAlert(alert_id, "error", err);
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
    };

    for (var i in inCpAppSpec.active.configurator.fields) {
        if (inCpAppSpec.active.configurator.fields[i].name == field.name) {
            req.configurator.fields.push(l4i.Clone(field));
        } else {
            fields.push(inCpAppSpec.active.configurator.fields[i]);
        }
    }

    if (req.configurator.fields.length == 0) {
        return l4i.InnerAlert(alert_id, "error", "No field name Found");
    }

    inCp.ApiCmd("app-spec/cfg-field-del", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            if (rsj.error) {
                return l4i.InnerAlert(alert_id, "error", rsj.error.message);
            }

            if (!rsj.kind || rsj.kind != "AppSpec") {
                return l4i.InnerAlert(alert_id, "error", "Network Connection Exception");
            }

            l4i.InnerAlert(alert_id, "ok", "Successfully Updated");

            window.setTimeout(function () {
                inCpAppSpec.active.configurator.fields = fields;
                l4iModal.Prev(inCpAppSpec.cfgFieldListRefresh);
            }, 500);
        },
    });
};
