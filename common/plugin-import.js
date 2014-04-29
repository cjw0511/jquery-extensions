
(function () {

    var plugins = {
        ueditor: [
            "<link href=\"../plugins/ueditor/ue1.3.6-utf8-net/themes/default/css/ueditor.css\" rel=\"stylesheet\"/>",
            "<script src=\"../plugins/ueditor/ue1.3.6-utf8-net/ueditor.config.js\"></script>",
            "<script src=\"../plugins/ueditor/ue1.3.6-utf8-net/ueditor.all.js\"></script>",
            "<script src=\"../plugins/ueditor/ue1.3.6-utf8-net/lang/zh-cn/zh-cn.js\"></script>",
            "<script src=\"../jeasyui-extensions/jquery-easyui-ueditor/jquery.ueditor.js\"></script>"
        ],
        umeditor: [
            "<link href=\"../plugins/ueditor/ume1.2.2-utf8-net/themes/default/css/umeditor.css\" rel=\"stylesheet\"/>",
            "<script src=\"../plugins/ueditor/ume1.2.2-utf8-net/umeditor.config.js\"></script>",
            "<script src=\"../plugins/ueditor/ume1.2.2-utf8-net/umeditor.js\"></script>",
            "<script src=\"../plugins/ueditor/ume1.2.2-utf8-net/lang/zh-cn/zh-cn.js\"></script>"
        ],
        syntaxhighlighter: [
            "<script src=\"../plugins/syntaxhighlighter_3.0.83/scripts/shCore.min.js\"></script>",
            "<script src=\"../plugins/syntaxhighlighter_3.0.83/scripts/shBrushJScript.js\"></script>",
            "<script src=\"../plugins/syntaxhighlighter_3.0.83/scripts/shBrushXml.js\"></script>",
            "<link href=\"../plugins/syntaxhighlighter_3.0.83/styles/shCoreDefault.css\" rel=\"stylesheet\" type=\"text/css\"/>"
        ],
        my97: [
            "<script src=\"../plugins/My97DatePicker/WdatePicker.js\"></script>",
            "<script src=\"../jeasyui-extensions/jquery-easyui-my97/jquery.my97.js\"></script>"
        ],
        codemirror: [
            "<link href=\"../plugins/codemirror-4.0/lib/codemirror.css\" rel=\"stylesheet\"/>",
            "<script src=\"../plugins/codemirror-4.0/lib/codemirror.js\"></script>",
            "<script src=\"../plugins/codemirror-4.0/mode/xml/xml.js\"></script>",
            "<script src=\"../plugins/codemirror-4.0/mode/javascript/javascript.js\"></script>",
            "<script src=\"../plugins/codemirror-4.0/mode/vbscript/vbscript.js\"></script>",
            "<script src=\"../plugins/codemirror-4.0/mode/css/css.js\"></script>",
            "<script src=\"../plugins/codemirror-4.0/mode/htmlmixed/htmlmixed.js\"></script>",
            "<script src=\"../jeasyui-extensions/jquery-easyui-codemirror/jquery.codemirror.js\"></script>"
        ],
        euploadify: [
            "<link href=\"../plugins/uploadify/uploadify.css\" rel=\"stylesheet\"/>",
            "<script src=\"../plugins/uploadify/jquery.uploadify.js\"></script>",
            "<script src=\"../jeasyui-extensions/jquery-easyui-euploadify/jquery.euploadify.js\"></script>"
        ]
    };

    var list = ["syntaxhighlighter", "codemirror"];
    $.each(list, function (i, name) {
        loadPlugin(name, true);
    });

    loadPlugin($.util.request["plugin"]);

    function loadPlugin(name, flag) {
        if (name) {
            var names = String(name).split(",");
            for (var i = 0; i < names.length; i++) {
                var plugin = plugins[names[i]];
                if (plugin && (flag || !$.array.contains(list, names[i]))) {
                    $.each(plugin, function (index, n) {
                        document.write(n);
                    });
                }
            }
        }
    };

})();