var inCpHost = {
    zones: null,
    single_node: false,
};

inCpHost.ZoneRefresh = function (cb) {
    var zoneid = valueui.session.get("incp_host_zoneid");
    if (!zoneid) {
        zoneid = valueui.storage.get("incp_host_zoneid");
    }

    if (inCpHost.zones) {
        if (!zoneid || zoneid.indexOf("/") >= 0) {
            for (var i in inCpHost.zones.items) {
                zoneid = inCpHost.zones.items[i].meta.id;
                break;
            }

            valueui.session.set("incp_host_zoneid", zoneid);
            valueui.storage.set("incp_host_zoneid", zoneid);
        }

        inCpHost.zones._zoneid = zoneid;

        return cb(null, inCpHost.zones);
    }

    inCp.ApiCmd("host/zone-list", {
        callback: function (err, zones) {
            var errMsg = valueui.utilx.errorKindCheck(err, zones, "HostZoneList");
            if (errMsg) {
                return cb(errMsg);
            }

            inCpHost.zones = zones;

            if (!zoneid || zoneid.indexOf("/") >= 0) {
                for (var i in inCpHost.zones.items) {
                    zoneid = inCpHost.zones.items[i].meta.id;
                    break;
                }

                valueui.session.set("incp_host_zoneid", zoneid);
                valueui.storage.set("incp_host_zoneid", zoneid);
            }

            inCpHost.zones._zoneid = zoneid;

            cb(null, inCpHost.zones);
        },
    });
};
