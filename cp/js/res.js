var losCpRes = {
    statusls : [
        {phase: "Running", title: "Running"},
        {phase: "Stopped", title: "Stopped"},
    ]
}

losCpRes.Index = function()
{
    losCp.TplFetch("res/index", {
        callback: function(err, data) {
            if (err) {
                return;
            }
            $("#comp-content").html(data);
            losCpResDomain.List();
        },
    });
}

losCpRes.todo = function()
{

}
