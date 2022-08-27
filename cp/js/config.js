var inCpConfig = {
    specFieldTypes: [
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
        {
            type: 306,
            title: "Text/Markdown",
            lang: "markdown",
        },
    ],
    fieldAutoFills: [
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
    fieldDef: {
        name: "",
        title: "",
        prompt: "",
        type: 1,
        default: "",
        auto_fill: "",
        validates: [],
        description: "",
    },
};


inCpConfig.SpecFieldTypeFetch = function (t) {
    for (var i in inCpConfig.specFieldTypes) {
        if (inCpConfig.specFieldTypes[i].type == t) {
            return inCpConfig.specFieldTypes[i];
        }
    }
    return null;
};


inCpConfig.ConfigInstanceEntry = function (configSpec, configInstance, options) {

    if (!options || !options.callback) {
        return;
    }
    if (!options.title) {
        options.title = "Config Instance";
    }
    configSpec.fields = configSpec.fields || [];
    configInstance.fields = configInstance.fields || [];

    var cfgActive = valueui.utilx.objectClone(configSpec);

    var editors = [];
    for (var i in cfgActive.fields) {

        var type = cfgActive.fields[i].type;
        var name = cfgActive.fields[i].name;
        var autoFill = cfgActive.fields[i].auto_fill;
        var textRows = 4;
        var value = null;
        var readOnly = false;

        for (var j in configInstance.fields) {
            if (name == configInstance.fields[j].name) {
                value = configInstance.fields[j].value;
                break;
            }
        }

        if (!value && cfgActive.fields[i].default_value) {
            value = cfgActive.fields[i].default_value;
        }

        if (autoFill) {
            readOnly = true;
        }

        if (!value && autoFill) {
            for (var j in inCpConfig.specFieldAutoFills) {
                if (inCpConfig.specFieldAutoFills[j].type == autoFill) {
                    value = inCpConfig.specFieldAutoFills[j].title;
                    break;
                }
            }
        }
        if (!value) {
            value = "";
        }

        var fnType = inCpConfig.SpecFieldTypeFetch(type);

        if (fnType && type >= 300 && type <= 399) {
            if (value.length > 10) {
                var arr = value.match(/\n/g);
                if (arr) {
                    textRows = arr.length + 2;
                }
                if (textRows < 4) {
                    textRows = 4;
                } else if (textRows > 20) {
                    textRows = 20;
                }
            }
            editors.push({
                name: name,
                lang: fnType.lang,
                line: textRows,
                readOnly: readOnly,
            });
            cfgActive.fields[i]._textRows = textRows;
            cfgActive.fields[i]._readOnly = readOnly;
            cfgActive.fields[i]._editor = true;
        }

        cfgActive.fields[i]._value = value;
    }

    valueui.modal.open({
        id: "incp-config-instance-entry",
        title: options.title,
        tpluri: inCp.TplPath("config/instance"),
        backEnable: true,
        callback: function () {
            valueui.template.render({
                dstid: "incp-config-instance",
                tplid: "incp-config-instance-tpl",
                data: cfgActive,
                callback: function () {
                    for (var i in editors) {
                        var c = editors[i];
                        inCp.CodeEditor("fn_" + c.name, c.lang, {
                            readOnly: c.readOnly,
                            numberLines: c.line,
                        });
                    }
                    inCpConfig._instanceEntryActive = cfgActive;
                    inCpConfig._instanceEntryOptions = options;
                },
            });
        },
        buttons: [
            {
                onclick: "valueui.modal.close()",
                title: "Close",
            },
            {
                onclick: "inCpConfig.ConfigInstanceEntrySave()",
                title: "Save"
            },
        ],
    });
}

inCpConfig.ConfigInstanceEntrySave = function () {

    if (!inCpConfig._instanceEntryActive
        || !inCpConfig._instanceEntryOptions
        || !inCpConfig._instanceEntryOptions.callback) {
        return;
    }

    var alert_id = "#incp-config-instance-alert";

    var form = $("#incp-config-instance");
    if (!form) {
        return;
    }

    var cfgCommit = {
        name: inCpConfig._instanceEntryActive.name,
        fields: [],
    };

    try {

        for (var i in inCpConfig._instanceEntryActive.fields) {
            var field = inCpConfig._instanceEntryActive.fields[i];
            var value = null;

            if (field.type >= 300 && field.type <= 399) {
                if (field._editor) {
                    value = inCp.CodeEditorValue("fn_" + field.name);
                } else {
                    value = form.find("textarea[name=fn_" + field.name + "]").val();
                }
            } else {
                switch (field.type) {
                    case 1:
                        value = form.find("input[name=fn_" + field.name + "]").val();
                        break;
                }
            }

            if (value) {
                cfgCommit.fields.push({
                    name: field.name,
                    value: value,
                });
            }
        }

    } catch (err) {
        return valueui.alert.innerShow(alert_id, "error", err);
    }

    inCpConfig._instanceEntryOptions.callback(cfgCommit);
}
