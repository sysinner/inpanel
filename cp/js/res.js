var inCpRes = {
    statusls: [
        {
            phase: "Running",
            title: "Running"
        },
        {
            phase: "Stopped",
            title: "Stopped"
        },
    ]
}

inCpRes.Index = function() {
    inCp.TplFetch("res/index", {
        callback: function(err, data) {
            if (err) {
                return;
            }
            $("#comp-content").html(data);
            inCpResDomain.List();
        },
    });
}

inCpRes.todo = function() {}
