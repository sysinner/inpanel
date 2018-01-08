var inOpsApp = {
    planset_active: null,
    list_nav_menus: [{
        name: "App Instances",
        uri: "app/list",
    }],
}

inOpsApp.Index = function() {
    inCp.ModuleNavbarMenu("ops/app/list", inOpsApp.list_nav_menus);

    l4i.UrlEventRegister("app/list", inOpsApp.List, "incp-module-navbar-menus");

    l4i.UrlEventHandler("app/list", true);
}

inOpsApp.List = function() {
    inCpApp.InstListRefresh({
        ops_mode: true,
    });
}

