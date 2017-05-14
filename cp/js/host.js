var losCpHost = {
    zones : null,
    single_node: false,
}

losCpHost.ZoneRefresh = function(cb)
{
    var zoneid = l4iSession.Get("loscp_host_zoneid");
    if (!zoneid) {
        zoneid = l4iStorage.Get("loscp_host_zoneid");
    }

    if (losCpHost.zones) {

        if (!zoneid || zoneid.indexOf("/") >= 0) {

            for (var i in losCpHost.zones.items) {
                zoneid = losCpHost.zones.items[i].meta.id;
                break
            }

            l4iSession.Set("loscp_host_zoneid", zoneid);
            l4iStorage.Set("loscp_host_zoneid", zoneid);
        }

        losCpHost.zones._zoneid = zoneid;

        return cb(null, losCpHost.zones);
    }

    losCp.ApiCmd("host/zone-list", {
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

            losCpHost.zones = zones;

            if (!zoneid || zoneid.indexOf("/") >= 0) {

                for (var i in losCpHost.zones.items) {
                    zoneid = losCpHost.zones.items[i].meta.id;
                    break
                }

                l4iSession.Set("loscp_host_zoneid", zoneid);
                l4iStorage.Set("loscp_host_zoneid", zoneid);
            }

            losCpHost.zones._zoneid = zoneid;

            cb(null, losCpHost.zones);
        },
    });
}

