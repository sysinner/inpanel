var inCpHost = {
    zones: null,
    single_node: false,
}

inCpHost.ZoneRefresh = function(cb) {
    var zoneid = valueui.session.Get("incp_host_zoneid");
    if (!zoneid) {
        zoneid = valueui.storage.Get("incp_host_zoneid");
    }

    if (inCpHost.zones) {

        if (!zoneid || zoneid.indexOf("/") >= 0) {

            for (var i in inCpHost.zones.items) {
                zoneid = inCpHost.zones.items[i].meta.id;
                break
            }

            valueui.session.Set("incp_host_zoneid", zoneid);
            valueui.storage.Set("incp_host_zoneid", zoneid);
        }

        inCpHost.zones._zoneid = zoneid;

        return cb(null, inCpHost.zones);
    }

    inCp.ApiCmd("host/zone-list", {
        callback: function(err, zones) {

            if (err) {
                return cb(err, null);
            }

            if (!zones) {
                return cb("Network Connection Exception", null);
            }

            if (zones.error) {
                return cb(zones.error.message, null);
            }

            if (!zones.kind || zones.kind != "HostZoneList") {
                return cb("Network Connection Exception", null);
            }

            inCpHost.zones = zones;

            if (!zoneid || zoneid.indexOf("/") >= 0) {

                for (var i in inCpHost.zones.items) {
                    zoneid = inCpHost.zones.items[i].meta.id;
                    break
                }

                valueui.session.Set("incp_host_zoneid", zoneid);
                valueui.storage.Set("incp_host_zoneid", zoneid);
            }

            inCpHost.zones._zoneid = zoneid;

            cb(null, inCpHost.zones);
        },
    });
}

