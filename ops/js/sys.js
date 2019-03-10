var inOpsSys = {
}

inOpsSys.Index = function() {

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", function(tpl) {

            // $("#comp-content").html(tpl);

            l4iTemplate.Render({
                dstid: "comp-content",
                tplsrc: tpl,
                callback: function() {
                    inCp.ModuleNavbarMenuRefresh("inops-sys-nav-tpl");
                    inOpsSys.ConfigIndex();
                },
            });
        });

        ep.fail(function(err) {
            if (err == "AccessDenied") {
                return inCp.AlertAccessDenied();
            }
            alert("Error: " + err);
        });

        inOps.TplFetch("sys/index", {
            callback: ep.done("tpl"),
        });
    });
}

inOpsSys.ConfigIndex = function() {

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create('tpl', 'groups', function(tpl, groups) {

            $("#work-content").html(tpl);

            if (!groups.items) {
                groups.items = [];
            }
            for (var i in groups.items) {
                groups.items[i]._gid = groups.items[i].name.replace(/\//g, "__");
                if (!groups.items[i].title) {
                    groups.items[i].title = groups.items[i].name;
                }
            }

            l4iTemplate.Render({
                dstid: "inops-sys-config-nav",
                tplid: "inops-sys-config-nav-tpl",
                data: {
                    groups: groups,
                },
                callback: function() {
                    if (groups.items.length > 0) {
                        inOpsSys.ConfigGroup(groups.items[i].name);
                    }
                },
            });
        });

        ep.fail(function(err) {
            alert("Error: Please try again later");
        });

        inOps.TplFetch("sys/config", {
            callback: ep.done("tpl"),
        });

        inOps.ApiCmd("sys/configurator-list", {
            callback: ep.done('groups'),
        });
    });

}

inOpsSys.ConfigGroup = function(name) {

    if (!name) {
        return;
    }
    var gid = name.replace(/\//g, "__");

    $("#inops-sys-config-nav").find("a.active").removeClass("active");
    $("#inops-sys-config-nav-item-" + gid).addClass("active");

    var alertId = "#inops-sys-configset-alert";

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create('data', function(data) {

            if (!data || data.kind != "SysConfigWizard") {
                return l4i.InnerAlert(alertId, 'alert-info', "Item Not Found");
            }

            if (!data.option.items) {
                data.option.items = [];
            }


            if (data.configurator.name != data.option.name) {
                return l4i.InnerAlert(alertId, 'alert-info', "Item Not Found");
            }

            for (var k in data.configurator.fields) {
                var name = data.configurator.fields[k].name;
                var auto_fill = data.configurator.fields[k].auto_fill;
                var value = null;
                for (var m in data.option.items) {
                    if (data.option.items[m].name == name) {
                        value = data.option.items[m].value;
                        break;
                    }
                }
                if (!value) {
                    if (data.configurator.fields[k].default) {
                        value = data.configurator.fields[k].default;
                    } else {
                        value = "";
                    }
                }
                if (value == "" && auto_fill) {
                    value = auto_fill;
                }
                data.configurator.fields[k]._value = value;
            }

            l4iTemplate.Render({
                dstid: "inops-sys-config-form",
                tplid: "inops-sys-config-wizard-tpl",
                data: data,
            });
        });

        ep.fail(function(err) {
            alert("Error: Please try again later");
        });

        inOps.ApiCmd("sys/config-wizard?name=" + name, {
            callback: ep.done('data'),
        });
    });
}

inOpsSys.ConfigGroupCommit = function() {

    var form = $("#inops-sys-config-form"),
        alertId = "#inops-sys-config-alert",
        namereg = /^[a-z][a-z0-9_]+$/;

    var req = {
        items: [],
    }

    try {
        req.name = form.find("input[name=cfr_name]").val();

        form.find(".inops-sys-config-item").each(function() {

            req.items.push({
                name: $(this).attr("name").substr(3),
                value: $(this).val(),
            });
        });

    } catch (err) {
        l4i.InnerAlert(alertId, 'error', err);
        return;
    }

    inOps.ApiCmd("sys/config-set", {
        method: "PUT",
        data: JSON.stringify(req),
        callback: function(err, data) {

            if (!data || !data.kind || data.kind != "SysConfig") {

                if (data.error) {
                    return l4i.InnerAlert(alertId, 'error', data.error.message);
                }

                return l4i.InnerAlert(alertId, 'error', "Network Connection Exception");
            }

            l4i.InnerAlert(alertId, 'ok', "Successful updated");
        },
    });
}

