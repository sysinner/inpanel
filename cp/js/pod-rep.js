var inCpPodRep = {

}

inCpPodRep.Set = function(podId, repId, options) {

    seajs.use(["ep"], function(EventProxy) {

        var ep = EventProxy.create("tpl", "pod", function(tpl, pod) {

            if (!pod.kind || pod.kind != "Pod") {
                return; // l4iModal.FootAlert('error', "Pod Not Found");
            }

            l4iModal.Open({
                title: "Pod Replica Setting",
                tplsrc: tpl,
                data: {
                    _pod_id: podId,
                    _rep_id: repId,
                // _op_actions: l4i.Clone(inCp.OpActions), 
                },
                width: 900,
                height: 400,
                buttons: [{
                    onclick: "l4iModal.Close()",
                    title: "Close",
                }, {
                    onclick: "inCpPodRep.SetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                }],
            });
        });

        ep.fail(function(err) {
            alert("Network Connection Error, Please try again later (EC:incp-pod)");
        });

        // template
        inCp.TplFetch("pod/rep/set", {
            callback: ep.done("tpl"),
        });

        inCp.ApiCmd("pod/entry?id=" + podId, {
            callback: ep.done("pod"),
        });
    });
}

inCpPodRep.SetCommit = function() {

    var req = {
        meta: {
        },
        replica: {
        },
    }
    try {
        var form = $("#incp-podrep-set");
        if (!form) {
            throw "form not found";
        }

        req.meta.id = form.find("input[name=pod_id]").val();
        req.replica.rep_id = parseInt(form.find("input[name=rep_id]").val());

        var opAction = form.find("input[name=pod_rep_action_migrate]:checked").val();
        if (opAction && opAction == "yes") {
            req.replica.action = inCp.OpActionMigrate;
        }

    } catch (err) {
        return l4iModal.FootAlert('error', err, 3000);
    }

    inCp.ApiCmd("pod-rep/set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function(err, rsj) {

            if (err || !rsj) {
                return l4iModal.FootAlert('error', "Network Connection Exception", 3000);
            }

            if (rsj.error) {
                return l4iModal.FootAlert('error', rsj.error.message, 3000);
            }

            if (!rsj.kind || rsj.kind != "PodRep") {
                return l4iModal.FootAlert('error', "Network Connection Exception", 3000);
            }

            l4iModal.FootAlert('ok', "Successfully Updated");

            window.setTimeout(function() {
                l4iModal.Close();
            }, 1000);
        }
    });
}

