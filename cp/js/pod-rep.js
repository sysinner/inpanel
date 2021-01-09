var inCpPodRep = {};

inCpPodRep.Set = function (podId, repId, options) {
    var ep = valueui.NewEventProxy("tpl", "pod", function (tpl, pod) {
        if (!pod.kind || pod.kind != "Pod") {
            return; // valueui.modal.FootAlert('error', "Pod Not Found");
        }

        valueui.modal.Open({
            title: "Pod Replica Setting",
            tplsrc: tpl,
            data: {
                _pod_id: podId,
                _rep_id: repId,
                // _op_actions: valueui.utilx.ObjectClone(inCp.OpActions),
            },
            width: 900,
            height: 400,
            buttons: [
                {
                    onclick: "valueui.modal.Close()",
                    title: "Close",
                },
                {
                    onclick: "inCpPodRep.SetCommit()",
                    title: "Save",
                    style: "btn btn-primary",
                },
            ],
        });
    });

    ep.fail(function (err) {
        alert("Network Connection Error, Please try again later (EC:incp-pod)");
    });

    // template
    inCp.TplFetch("pod/rep/set", {
        callback: ep.done("tpl"),
    });

    inCp.ApiCmd("pod/entry?id=" + podId, {
        callback: ep.done("pod"),
    });
};

inCpPodRep.SetCommit = function () {
    var req = {
        meta: {},
        replica: {},
    };
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
        return valueui.modal.FootAlert("error", err, 3000);
    }

    inCp.ApiCmd("pod-rep/set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return valueui.modal.FootAlert("error", "Network Connection Exception", 3000);
            }

            if (rsj.error) {
                return valueui.modal.FootAlert("error", rsj.error.message, 3000);
            }

            if (!rsj.kind || rsj.kind != "PodRep") {
                return valueui.modal.FootAlert("error", "Network Connection Exception", 3000);
            }

            valueui.modal.FootAlert("ok", "Successfully Updated");

            window.setTimeout(function () {
                valueui.modal.Close();
            }, 1000);
        },
    });
};

inCpPodRep.failoverConfirmActive = {};
inCpPodRep.FailoverConfirm = function (podId, repId) {
    inCpPodRep.failoverConfirmActive = {
        pod_id: podId,
        rep_id: repId,
    };

    valueui.modal.Open({
        title: "Pod Replica Failover Confirm",
        tplsrc:
            "<div class='alert alert-danger'>This current replica is not available, the system will create a replica on the new host. This operation is risky (may lose data), do you confirm to continue?</div>",
        width: 900,
        height: 300,
        buttons: [
            {
                onclick: "valueui.modal.Close()",
                title: "Close",
            },
            {
                onclick: "inCpPodRep.FailoverCommit()",
                title: "Confirm to start failover task",
                style: "btn btn-danger",
            },
        ],
    });
};

inCpPodRep.FailoverCommit = function () {
    var req = {
        meta: {
            id: inCpPodRep.failoverConfirmActive.pod_id,
        },
        replica: {
            rep_id: inCpPodRep.failoverConfirmActive.rep_id,
            action: inCp.OpActionFailover,
        },
    };

    inCp.ApiCmd("pod-rep/set", {
        method: "POST",
        data: JSON.stringify(req),
        callback: function (err, rsj) {
            if (err || !rsj) {
                return valueui.modal.FootAlert("error", "Network Connection Exception", 3000);
            }

            if (rsj.error) {
                return valueui.modal.FootAlert("error", rsj.error.message, 3000);
            }

            if (!rsj.kind || rsj.kind != "PodRep") {
                return valueui.modal.FootAlert("error", "Network Connection Exception", 3000);
            }

            valueui.modal.FootAlert("ok", "Successfully Updated");

            window.setTimeout(function () {
                inCpPodRep.failoverConfirmActive = {};
                valueui.modal.Close();
            }, 1000);
        },
    });
};
