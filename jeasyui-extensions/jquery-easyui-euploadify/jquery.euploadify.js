/**
* jQuery EasyUI 1.3.6
* Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI uploadify Plugin Extensions 1.0 beta
* jQuery EasyUI uploadify 插件扩展
* jquery.euploadify.js
* 二次开发 流云
* 最近更新：2014-04-29
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late 和 jeasyui.extensions.window.js v1.0 beta late(可选)
*   5、jeasyui.extensions.progressbar.js v1.0 beta late

*   6、uploadify/jquery.uploadify.js
*   7、uploadify/uploadify.css
*   8、uploadify/uploadify.swf
*   9、uploadify/uploadify.php|uploadify.ashx|uploadify.jsp
*
* Copyright (c) 2013-2014 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {


    function getFileName(target, file) {
        if (!file || !file.name) { return $(target).euploadify("options").emptyText; }
        return $.string.getByteLen(file.name) > 28 ? $.string.leftBytes(file.name, 25) + "..." : file.name;
    };

    function getQueues(target) {
        var state = $.data(target, "euploadify"), data = $("#" + state.uploadifyID).data("uploadify"), ret = [],
            files = (data && data.queueData && data.queueData.files) ? data.queueData.files : [];
        for (var i in files) {
            ret.push(files[i]);
        }
        return ret;
    };


    function create(target) {
        var t = $(target).addClass("euploadify-f").hide(),
            state = $.data(target, "euploadify"), opts = state.options,
            name = t.attr("name");

        state.uploadifyID = "euploadify_" + $.util.guid("N");
        state.queueID = "euploadify_queue_" + $.util.guid("N");
        state.lastFileID = null;

        state.panel = $("<div class=\"euploadify-panel\"></div>").insertAfter(t).append(t).panel(opts);
        state.wrapper = state.panel.panel("body").addClass("euploadify-wrapper");
        state.queue = $("<div id=\"" + state.queueID + "\" class=\"euploadify-queue\"></div>").appendTo(state.wrapper);

        state.valueField = $("<input class=\"euploadify-value\" type=\"hidden\" />").appendTo(state.panel);
        t.removeAttr(name);
        state.valueField.attr("name", name);

        if (opts.originalValue = opts.value) {
            state.valueField.val(opts.value);
        }

        initializeUploadify(target);
        setSize(target);
        if (opts.disabled) { t.euploadify("disable"); }
    };


    function initializeUploadify(target) {
        var state = $.data(target, "euploadify"), opts = state.options, template = String(opts.multiTemplate).toLowerCase();
        if (!$.array.contains(["uploadify", "simple", "bootstrap", "grid"], template)) {
            template = $.fn.euploadify.defaults.multiTemplate;
        }
        var uopts = {
            auto: opts.auto, buttonClass: opts.buttonClass, buttonCursor: opts.buttonCursor, buttonImage: opts.buttonImage,
            buttonText: opts.buttonText, checkExisting: opts.checkExisting, debug: opts.debug,
            fileObjName: opts.fileObjName, fileSizeLimit: opts.fileSizeLimit, fileTypeDesc: opts.fileTypeDesc, fileTypeExts: opts.fileTypeExts,
            formData: opts.formData, width: opts.buttonWidth, height: opts.buttonHeight,
            itemTemplate: opts.multi && template != "custome" ? opts.multiTemplateData[template] : opts.itemTemplate, method: opts.method,
            multi: opts.multi, overrideEvents: opts.overrideEvents, preventCaching: opts.preventCaching, progressData: opts.progressData,
            queueID: state.queueID, queueSizeLimit: opts.queueSizeLimit, removeCompleted: opts.removeCompleted, removeTimeout: opts.removeTimeout,
            requeueErrors: opts.requeueErrors, successTimeout: opts.successTimeout,
            swf: opts.swf, uploader: opts.uploader, uploadLimit: opts.uploadLimit,
            onCancel: function (file) { return opts.onCancel.apply(target, arguments); },
            onClearQueue: function () { return opts.onClearQueue.apply(target, arguments); },
            onDestroy: function () { return opts.onDestroy.apply(target, arguments); },
            onDialogClose: function () { return opts.onDialogClose.apply(target, arguments); },
            onDialogOpen: function () { return opts.onDialogOpen.apply(target, arguments); },
            onDisable: function () { return opts.onDisable.apply(target, arguments); },
            onEnable: function () { return opts.onEnable.apply(target, arguments); },
            onFallback: function () { return opts.onFallback.apply(target, arguments); },
            onInit: function () { return opts.onInit.apply(target, arguments); },
            onQueueComplete: function () { return opts.onQueueComplete.apply(target, arguments); },
            onSelect: function (file) { return opts.onSelect.apply(target, arguments); },
            onSelectError: function () { return opts.onSelectError.apply(target, arguments); },
            onSWFReady: function () { return opts.onSWFReady.apply(target, arguments); },
            onUploadComplete: function (file) { return opts.onUploadComplete.apply(target, arguments); },
            onUploadError: function (file, errorCode, errorMsg, errorString) { return opts.onUploadError.apply(target, arguments); },
            onUploadProgress: function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) { return opts.onUploadProgress.apply(target, arguments); },
            onUploadStart: function () { return opts.onUploadStart.apply(target, arguments); },
            onUploadSuccess: function (file, data, response) { return opts.onUploadSuccess.apply(target, arguments); }
        };
        if (opts.multi) {
            state.wrapper.addClass("euploadify-wrapper-multi euploadify-wrapper-multi-" + template);
            state.buttonbar = $("<div class=\"euploadify-buttonbar\"></div>").insertBefore(state.queue);
            if (template == "grid") { buildGridPanel(target, uopts); }
        } else {
            state.wrapper.addClass("euploadify-wrapper-single");
            state.queue.addClass("euploadify-hidden");
            state.progressbar = $("<div class=\"euploadify-progressbar\"></div>").insertBefore(state.queue).progressbar({
                width: 400, height: 18, value: 0, text: opts.emptyText
            });
            state.buttonbar = $("<div class=\"euploadify-buttonbar\"></div>").insertAfter(state.progressbar);
            $.extend(uopts, {
                onCancel: function (file) {
                    var ret = opts.onCancel.apply(target, arguments), queues = getQueues(target);
                    if (!queues.length) {
                        state.progressbar.progressbar("setText", opts.emptyText).progressbar("setValue", 0);
                        return ret;
                    }
                    var temps = $.array.clone(queues),
                        array = $.array.remove(temps, file, function (a, b) { return a.id == b.id; });
                    if (array.length) {
                        state.progressbar.progressbar("setText", getFileName(target, array[0]) + "(" + $.number.toFileSize(file.size) + ") - 0%").progressbar("setValue", 0);
                    } else {
                        state.progressbar.progressbar("setText", opts.emptyText).progressbar("setValue", 0);
                    }
                    return ret;
                },
                onSelect: function (file) {
                    if (state.lastFileID && !opts.multi) {
                        state.uploadify.uploadify("cancel", state.lastFileID);
                    }
                    if (file) {
                        state.progressbar.progressbar("setText", getFileName(target, file) + "(" + $.number.toFileSize(file.size) + ") - 0%").progressbar("setValue", 0).
                            find(".progressbar-value .progressbar-text").removeClass("progressbar-text-success progressbar-text-error");
                        state.lastFileID = file.id;
                    } else {
                        state.progressbar.progressbar("setText", opts.emptyText).progressbar("setValue", 0).
                            find(".progressbar-value .progressbar-text").removeClass("progressbar-text-success progressbar-text-error");
                    }
                    return opts.onSelect.apply(target, arguments);
                },
                onUploadError: function (file, errorCode, errorMsg, errorString) {
                    if (errorString != "Cancelled" && errorString != "Stopped") {
                        state.progressbar.progressbar("setText", getFileName(target, file) + "(" + opts.errorText + ":" + errorString + ")").
                            find(".progressbar-value .progressbar-text").removeClass("progressbar-text-success progressbar-text-error").addClass("progressbar-text-error");
                    }
                    return opts.onUploadError.apply(target, arguments);
                },
                onUploadProgress: function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                    var val = !bytesTotal ? 0 : (bytesUploaded / bytesTotal * 100).round(2);
                    state.progressbar.progressbar("setText", getFileName(target, file) + "(" + $.number.toFileSize(file.size) + ") - {value}%").progressbar("setValue", val).
                        find(".progressbar-value .progressbar-text").removeClass("progressbar-text-success progressbar-text-error");
                    return opts.onUploadProgress.apply(target, arguments);
                },
                onUploadSuccess: function (file, data, response) {
                    state.progressbar.progressbar("setText", getFileName(target, file) + "(" + opts.finishText + ")").progressbar("setValue", 100).
                        find(".progressbar-value .progressbar-text").removeClass("progressbar-text-success progressbar-text-error").addClass("progressbar-text-success");
                    return opts.onUploadSuccess.apply(target, arguments);
                }
            });
        }

        state.button = $("<a class=\"l-btn l-btn-small euploadify-button euploadify-select" + (opts.buttonPlain ? " l-btn-plain" : "") +
            "\"><span class=\"l-btn-left l-btn-icon-left\"><span class=\"l-btn-icon " + opts.buttonIcon + "\">&nbsp;</span></span></a>").appendTo(state.buttonbar);
        state.uploadify = $("<input id=\"" + state.uploadifyID + "\" type=\"file\" />").insertBefore(state.button.find("span.l-btn-icon")).uploadify(uopts);
        state.uploadify = $("#" + state.uploadifyID);

        state.uploadButton = $("<a class=\"euploadify-button euploadify-upload" + (opts.auto ? " euploadify-hidden" : "") + "\"></a>").appendTo(state.buttonbar).linkbutton({
            plain: opts.buttonPlain, text: opts.uploadText, iconCls: opts.uploadIcon,
            onClick: function () { state.uploadify.uploadify("upload", "*"); }
        });
        state.stopButton = $("<a class=\"euploadify-button euploadify-stop" + (!opts.showStop ? " euploadify-hidden" : "") + "\"></a>").appendTo(state.buttonbar).linkbutton({
            plain: opts.buttonPlain, text: opts.stopText, iconCls: opts.stopIcon,
            onClick: function () {
                var ret = opts.onButtonStop.call(target, this);
                state.uploadify.uploadify("stop");
                return ret;
            }
        });
        state.cancelButton = $("<a class=\"euploadify-button euploadify-cancel" + (!opts.showCancel ? " euploadify-hidden" : "") + "\"></a>").appendTo(state.buttonbar).linkbutton({
            plain: opts.buttonPlain, text: opts.cancelText, iconCls: opts.cancelIcon,
            onClick: function () { state.uploadify.uploadify("cancel", "*"); }
        });
        if (opts.multi && template == "grid") {
            $("<span>-</span>").appendTo(state.buttonbar);
            $("<a class=\"euploadify-button\"></a>").appendTo(state.buttonbar).linkbutton({
                plain: opts.buttonPlain, text: "移除选择", iconCls: "icon-hamburg-busy",
                onClick: function () {
                    var rows = state.grid.datagrid("getChecked"), array = $.array.clone(rows);
                    if (!rows || !rows.length) { return $.easyui.messager.show("请至少选择一行数据"); }
                    $.each(array, function (i, row) {
                        var index = state.grid.datagrid("getRowIndex", row);
                        if (index > -1) { state.grid.datagrid("deleteRow", index);  }
                        state.uploadify.uploadify("cancel", row.id);
                    });
                }
            }).tooltip({ content: "取消选定行的上传任务并删除该行" });
            state.buttonbar.toolbar();
        }
    };


    function buildGridPanel(target, uopts) {
        var state = $.data(target, "euploadify"), opts = state.options,
            layout = state.layout = $("<div class=\"euploadify-gridpanel-layout\"></div>").appendTo(state.wrapper),
            north = state.north = $("<div class=\"euploadify-gridpanel-north\" data-options=\"region: 'north', split: false, border: false\" style=\"height: 33px;\"></div>").appendTo(layout).append(state.buttonbar),
            center = state.center = $("<div class=\"euploadify-gridpanel-center\" data-options=\"region: 'center', border: false\"></div>").appendTo(layout),
            grid = state.grid = $("<table class=\"euploadify-gridpanel-grid\"></table>").appendTo(center);
        state.queue.addClass("euploadify-hidden");
        layout.layout({ fit: true });
        grid.datagrid({
            fit: true, border: false, idField: "id", rownumbers: true, refreshMenu: false, extEditing: true, singleEditing: true,
            frozenColumns: [[
                    { field: "ck", checkbox: true, filterable: false },
                    { field: "name", title: "全文件名", width: 100, filterable: false }
            ]],
            columns: [[
                { field: "customeName", title: "自定义文件名", width: 120, editor: "text", filterable: false },
                { field: "type", title: "类型", width: 60, filterable: false },
                { field: "size", title: "大小", width: 80, filterable: false, formatter: function (val) { return $.number.toFileSize(val); } },
                {
                    field: "progress", title: "上传进度", width: 80, align: "center", filterable: false, formatter: function (val, row) {
                        return "<div class=\"euploadify-gridpanel-progress\">" +
                            "<div class=\"euploadify-gridpanel-progress-value" +
                            (row.status == -3 ? " euploadify-gridpanel-progress-error" : (row.status == -4 ? " euploadify-gridpanel-progress-success" : "")) +
                            "\" style=\"width: " + String(val || 0) + "%;\"></div>" +
                            "</div>";
                    }
                },
                { field: "progressValue", title: "进度值", width: 50, filterable: false, formatter: function (val) { return String(val || 0) + "%"; } },
                {
                    field: "status", title: "状态", width: 80, filterable: false, formatter: function (val, row, index) {
                        var str = opts.FILE_STATUS[val], ret = val == -3 ? ("<span class=\"euploadify-gridpanel-status euploadify-gridpanel-status-error\">" + str + "</span>") :
                            (val == -4 ? ("<span class=\"euploadify-gridpanel-status euploadify-gridpanel-status-success\">" + str + "</span>") : str);
                        return ret;
                    }
                },
                {
                    field: "operate", title: "操作", width: 80, filterable: false, formatter: function (val, row) {
                        return "<div title=\"取消\" class=\"euploadify-button-mini\" onclick=\"javascript: return $.fn.euploadify.cancelQueue(this);\">\
                                    <span class=\"euploadify-button-mini-icon icon-standard-delete\">&nbsp;</span>\
                                </div>\
                                <div title=\"上传\" class=\"euploadify-button-mini\" onclick=\"javascript: return $.fn.euploadify.uploadQueue(this);\">\
                                    <span class=\"euploadify-button-mini-icon icon-standard-arrow-up\">&nbsp;</span>\
                                </div>";
                    }
                }
            ]],
            rowContextMenu: [
                { text: "编辑文件名", iconCls: "icon-edit", handler: function (e, index, row) { grid.datagrid("beginEdit", index); } },
                {
                    text: "取消该文件", iconCls: "icon-standard-delete", handler: function (e, index, row) {
                        if (row.status == -4) {
                            $.easyui.messager.show("该文件已经上传完成，无法取消！");
                        } else {
                            state.uploadify.uploadify("cancel", row.id);
                        }
                    }
                },
                {
                    text: "上传该文件", iconCls: "icon-standard-arrow-up", handler: function (e, index, row) {
                        if (row.status == -4) {
                            $.easyui.messager.show("该文件已经上传完成！");
                        } else {
                            state.uploadify.uploadify("upload", row.id);
                        }
                    }
                }
            ],
            onAfterEdit: function (index, row, changes) {
                if (!row.customeName) {
                    $.easyui.messager.show("自定义文件名不能为空（已经恢复）");
                    var array = String(row.name).split("."), temp = $.array.removeAt(array, array.length - 1), name = temp.join("");
                    grid.datagrid("updateRow", { index: index, row: { customeName: name } });
                }
                return $.fn.datagrid.defaults.onAfterEdit.apply(this, arguments);
            }
        });
        $.extend(uopts, {
            onCancel: function (file) {
                var id = file.id, index = grid.datagrid("getRowIndex", id);
                if (index > -1) { grid.datagrid("deleteRow", index); }
                return opts.onCancel.apply(target, arguments);
            },
            onSelect: function (file) {
                var array = String(file.name).split("."), temp = $.array.removeAt(array, array.length - 1), name = temp.join("");
                grid.datagrid("appendRow", { id: file.id, name: file.name, customeName: name, type: file.type, progress: 0, size: file.size, status: file.filestatus });
                return opts.onSelect.apply(target, arguments);
            },
            onUploadProgress: function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
                var val = !bytesTotal ? 0 : (bytesUploaded / bytesTotal * 100).round(2), id = file.id, index = grid.datagrid("getRowIndex", id);
                if (index > -1) {
                    grid.datagrid("updateRow", { index: index, row: { progress: val, progressValue: val, status: file.filestatus } });
                }
                return opts.onUploadProgress.apply(target, arguments);
            },
            onUploadStart: function (file) {
                var id = file.id, index = grid.datagrid("getRowIndex", id), row = grid.datagrid("getRowData", index);
                state.uploadify.uploadify("settings", "customeName", row.customeName);
                if (index > -1) {
                    grid.datagrid("updateRow", { index: index, row: { status: file.filestatus } });
                }
                return opts.onUploadStart.apply(target, arguments);
            },
            onUploadComplete: function (file) {
                var id = file.id, index = grid.datagrid("getRowIndex", id);
                if (index > -1) {
                    grid.datagrid("updateRow", { index: index, row: { status: file.filestatus } });
                }
                return opts.onUploadComplete.apply(target, arguments);
            }
        });
    };








    function setSize(target) {
        var t = $(target), state = $.data(target, "euploadify"), opts = state.options, fit = t._fit(false);
        if (opts.multi) {
        } else {
            var width = fit.width - state.buttonbar.outerWidth() - 15;
            state.progressbar.progressbar("resize", width);
        }
    };





    $.fn.euploadify = function (options, param) {
        if (typeof options == "string") {
            return $.fn.euploadify.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "euploadify");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "euploadify", { options: $.extend({}, $.fn.euploadify.defaults, $.fn.euploadify.parseOptions(this), options) });
                create(this);
            }
        });
    };


    $.fn.euploadify.cancelQueue = function (mini) {
        var btn = $(mini), t = btn.closest("div.euploadify-wrapper").find(".euploadify-f"),
            state = $.data(t[0], "euploadify"),
            index = window.parseInt(btn.closest("tr.datagrid-row").attr("datagrid-row-index")),
            row = state.grid.datagrid("getRowData", index);
        if (row.status == -4) {
            $.easyui.messager.show("该文件已经上传完成，无法取消！");
        } else {
            state.uploadify.uploadify("cancel", row.id);
        }
        window.event.stopPropagation();
        return false;
    };

    $.fn.euploadify.uploadQueue = function (mini) {
        var btn = $(mini), t = btn.closest("div.euploadify-wrapper").find(".euploadify-f"),
            state = $.data(t[0], "euploadify"),
            index = window.parseInt(btn.closest("tr.datagrid-row").attr("datagrid-row-index")),
            row = state.grid.datagrid("getRowData", index);
        if (row.status == -4) {
            $.easyui.messager.show("该文件已经上传完成！");
        } else {
            state.uploadify.uploadify("upload", row.id);
        }
        window.event.stopPropagation();
        return false;
    };



    $.fn.euploadify.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, [
            "buttonClass", "buttonCursor", "buttonImage", "buttonText", "checkExisting", "fileObjName",
            "fileTypeDesc", "fileTypeExts", "itemTemplate", "method", "progressData", "queueID", "swf", "uploader",
            {
                auto: "boolean", debug: "boolean", multi: "boolean", preventCaching: "boolean", removeCompleted: "boolean", requeueErrors: "boolean"
            },
            {
                fileSizeLimit: "number", height: "number", queueSizeLimit: "number", removeTimeout: "number", successTimeout: "number", uploadLimit: "number", width: "number"
            }
        ]));
    };


    $.fn.euploadify.methods = {

        options: function (jq) { return $.data(jq[0], "euploadify").options; },

        //  从当前上传队列中取消一个或多个文件的上传；该方法的参数 param 可以定义为如下数据类型：
        //      String  : 表示要取消上传的文件的 id 值；如果不定义该参数，则取消队列中第一个文件的上传；如果该值定义为 "*"，则取消队列中所有文件上传；
        //      Boolean : 默认为 false；如果定义为 true，则执行该方法时将不触发 onUploadCancel 事件；
        //  返回值：返回表示当前 easyui-euploadify 控件的 jQuery 链式对象。
        cancel: function (jq, param) { },

        //  从当前文档上下文中销毁该 easyui-euploadify 控件；该方法将触发 onDestroy 事件；
        //  返回值：返回表示当前 easyui-euploadify 控件的 jQuery 链式对象。
        destroy: function (jq) { },

        //  禁用该 easyui-euploadify 控件；该方法将触发 onDisable 事件；
        //      该方法的参数 setDisabled 为 Boolean 类型值，为 true 时表示禁用上传按钮；为 false 表示启用上传按钮；
        //  返回值：返回表示当前 easyui-euploadify 控件的 jQuery 链式对象。
        disable: function (jq, setDisabled) { },

        //  获取或设置 easyui-euploadify 控件中指定名称的属性值；该方法的参数 param 可以定义为如下数据类型：
        //      String  : 该参数指定一个属性名称，该属性名所示的属性值将会被返回；
        //      Object  : 格式如 { name: string, value: object }；设定指定名称的属性为指定的值。
        //  返回值：返回表示当前 easyui-euploadify 控件中指定名称的属性值；或者返回表示当前 easyui-euploadify 控件的 jQuery 链式对象。
        settings: function (jq, param) { },

        //  停止当前上传队列中所有文件的上传。
        //  返回值：返回表示当前 easyui-euploadify 控件的 jQuery 链式对象。
        stop: function (jq) { },

        //  获取当前上传队列中有多少文件数量；
        //  返回值：返回一个 array 类型数组，数组中的每一项都是一个 file 对象；
        queue: function (jq) { },

        //  立即上传当前队列中的特定文件或所有文件。该方法的参数 param 可以定义为如下数据类型：
        //      String  : 表示要立即上传的文件 id 值；如果不定义该参数，则上传队列中的第一个文件；如果该值定义为 "*"，则上传队列中所有文件；
        //  返回值：返回表示当前 easyui-euploadify 控件的 jQuery 链式对象。
        upload: function (jq, param) { },



        resize: function (jq, resize) { },

        enable: function (jq) { },

        validate: function (jq) { },

        isValid: function (jq) { },

        clear: function (jq) { },

        reset: function (jq) { },

        getValues: function (jq) { },

        setValues: function (jq, values) { },

        getValue: function () { },

        setValue: function (jq, value) { }
    };

    $.fn.euploadify.defaults = {


        //  表示 "上传" 按钮的宽度(像素值)；
        width: 120,

        //  表示 "上传" 按钮的高度(像素值)；
        height: 30,

        //  表示当选择了待上传文件后，是否自动执行 upload 方法以上传文件；
        auto: true,

        //  表示 uploadify.swf SWFObject Flash 对象的相对路径；该参数必须设置正确，否则上传控件将无效；
        swf: "uploadify.swf",

        //  表示服务器端接收上传数据的 url 相对路径；该参数必须设置正确，否则上传控件将无效；
        uploader: "uploadify.php",

        //  表示能够上传文件的最大数量；当文件数超出此限制时，将会触发 onUploadError 事件；
        uploadLimit: 999,

        //  表示文件上传时进行 ajax 提交的方法；可选的值为 "post" 或 "get"；
        method: "post",

        //  表示文件在上传过程中，每一个文件块的上传超时事件(秒)；
        successTimeout: 30,

        //  表示被添加到 "上传" 按钮的 html-css 样式类名
        buttonClass: "",

        //  表示当鼠标移动至 "上传" 按钮时，鼠标显示的样式，可能的值为 "hand" 或 "arrow"
        buttonCursor: "hand",

        //  表示 "上传" 按钮附加的背景图片；如果需要设置一个 "上传" 按钮的鼠标悬停时显示的图标，可以用 buttonClass 属性并定义一个具有 hover 效果的 css；
        buttonImage: null,

        //  表示 "上传" 按钮显示的按钮文本；该值也可以定义为 html 标签包含的文本内容，例如 <b>SELECT FILES</b>；
        buttonText: "SELECT FILES",

        //  表示是否校验服务器目标文件夹中已经存在待上传的文件名；
        //      该值如果定义为布尔值 false，则表示不进行校验；
        //      如果定义为一个服务器 url 地址例如 "/uploadify/check-exists.php"，则表示进行服务器校验；该地址如果返回 1 则表示服务器上存在指定的文件名；如果返回 0 则表示不存在。
        checkExisting: false,

        // 表示是否开启 SWFUpload 对象的调试模式
        debug: false,

        //  表示待上传文件对象提交至服务器时，采用的表单字段名；例如当该值定义为 "Filedata" 时，ASP.NET 服务器端可以用 HttpContext.Current.Request["Filedata"] 获取文件的二进制对象；
        fileObjName: "Filedata",

        //  表示文件上传大小上限；
        //      该值可以定义为一个 Number 值，表示文件最大字节数(KB为单位)；
        //      也可以定义为一个以 "KB"、"MB" 或 "GB" 结尾的 String 值；
        //  如果该属性值为 0，则表示不限制文件的上传大小；
        fileSizeLimit: 0,

        //  表示可选择的上传文件类型的描述；
        fileTypeDesc: "All Files",

        //  表示可选择的上传文件的扩展名列表，多个扩展名用半角分号隔开，例如 "*.jpg; *.png; *.gif"
        //  注意：手动输入的文件名将会绕过此验证规则，因此在服务端还需要进行文件类型的校验；
        fileTypeExts: "*.*",

        //  表示随待上传文件被提交至服务器端时，被一并发送至服务器的表单参数；可以在 onUploadStart 事件中动态设置这些参数；
        formData: {},

        //  表示上传文件队列的 HTML 页面显示模板；该值定义为 false 表示按照默认格式显示；该模版中可以使用如下四个变量标签：
        //      instanceID:
        //      fileID:
        //      fileName:
        //      fileSize:
        //  模板使用变量标签的格式如：${fileName}.
        itemTemplate: false,


        //  表示是否能够同时上传多个文件；
        multi: true,

        //  一个 array: <string> 格式数组，数组中的每一项都是一个表示 uploadify 事件名称的字符串；
        //  该属性表示哪些事件在 uploadify 的生命周期中将不会被触发执行；
        overrideEvents: [],

        //  表示浏览器是否缓存 SWFObject；如果该值设置为 false，则 SWF 文件的 url 中将会被添加一个随机值参数，以实现 SWFObject 不缓存效果；
        preventCaching: true,

        //  表示文件上传时的文件上传进度显示方式；
        //      percentage: 表示上传时显示上传进度百分比
        //      speed:  表示上传时显示上传速度
        progressData: "percentage",

        //  一个 HTML-DOM 元素的 ID 值，用于作为文件上传队列显示的容器；如果定义该值，则文件上传队列中每个上传的元素将会被附加到这个 DOM 对象中；
        //      如果该值定义为 false，则文件上传队列显示容器将会动态生成；
        queueID: false,

        //  表示能够同时执行上传操作的文件最大数量；这并不限制该控件可上传文件的最大数量；要限制可上传文件最大数量请用 uploadLimit 参数；
        //      如果添加到上传队列中的文件数量超过此限制，将会触发 onSelectError 事件；
        queueSizeLimit: 999,

        //  表示是否可以移除已经上传完成的文件；
        removeCompleted: true,

        //  表示文件上传完成后将会延迟多少秒后采用上传队列中被移除；
        removeTimeout: 3,

        //  表示文件在上传过程中如果出错是否自动重新上传；
        requeueErrors: false,







        //  当上传队列中的一个或多个文件被执行 cancel 方法而从队列中取消时，该事件将会被触发；
        //      file    : object 类型值；表示被取消上传的文件对象；
        onCancel: function (file) { },

        //  当 cancel 方法被执行并且参数值为 "*"，该事件将会被触发；
        //      queueItemCount: number 类型值；表示取消上传的文件总数量
        onClearQueue: function () { },

        //  当 destroy 方法被调用时，该事件将会被触发；
        onDestroy: function () { },

        //  当浏览文件对话框被关闭时，该事件将会被触发；如果该事件会添加至 overrideEvents 属性，则在将文件添加到上传队列中时如果出现错误，将不会弹出警告消息；
        //      queueData: object 类型值，格式如 { filesSelected: number, filesQueued: number, filesReplaced: number, filesCancelled: number, filesErrored: number }
        onDialogClose: function (queueData) { },

        //  当打开浏览文件对话框后，该事件将会被触发；注意，该事件函数不会在浏览文件对话框打开时被立即执行，而是在窗口关闭时执行。
        onDialogOpen: function () { },

        //  当 disable 方法被调用时，该事件将会被触发；
        onDisable: function () { },

        //  当 disable 方法被调用并且 setDisabled 值为 false 以启用按钮时，该事件将会被触发；
        onEnable: function () { },

        //  在上传控件初始化过程中，如果当前浏览器的 Flash 插件版本不兼容，该事件将会被触发；
        onFallback: function () { },

        //  在 easyui-euploadify 控件第一次被初始化完成后，该事件将会被触发；
        //      instance:   表示 uploadify 对象；
        onInit: function (instance) { },

        //  当上传队列中所有文件被处理完成后，该事件将会被触发；
        //      queueData:  object 类型值，格式如 { uploadsSuccessful: number, uploadsErrored: number }
        onQueueComplete: function (queueData) { },

        //  当打开文件浏览器对话框并选择了要上传的文件之后，该事件将会被触发；
        //      file:   表示被选择的待上传文件；
        onSelect: function (file) { },

        //  当打开文件浏览器对话框并在选择文件出错后，该事件将会被触发；针对每个选择文件出错后，该事件都会被触发一次；
        //      file:   表示触发异常事件的文件对象；
        //      errorCode:表示错误代码，可能的值为如下几种：
        //          QUEUE_LIMIT_EXCEEDED:   选定的文件数量超过限制；
        //          FILE_EXCEEDS_SIZE_LIMIT:选定的文件大小超过限制；
        //          INVALID_FILETYPE:       选定的文件类型超过限制；
        //      errorMsg:表示触发该事件时的错误消息；
        onSelectError: function (file, errorCode, errorMsg) { },

        //  当该控件的 Flash 插件对象加载完成后，该事件将会被触发；
        onSWFReady: function () { },

        //  当文件上传完成(不管成功还是失败)，该事件将会被触发；针对每个上传的文件，该事件都会触发一次；
        //      file:   表示触发该事件的文件对象；
        onUploadComplete: function (file) { },

        //  当文件上传失败后，该事件将会被触发；针对每个上传失败的文件，该事件都会触发一次；
        //      file:   表示触发该事件的文件对象；
        //      errorCode:  表示错误编号
        //      errorMsg:   表示错误消息
        //      errorString:表示错误消息字符串，可能包含所有的错误细节的可读内容；
        onUploadError: function (file, errorCode, errorMsg, errorString) { },

        //  当文件上传进度每次更新时，该事件将会被触发；针对每个上传文件的每次进度更新，该事件都会触发一次；
        //      file:   表示触发该事件的文件对象；
        //      bytesUploaded: 表示该文件自开始上传时至当前时刻已上传的字节总数；
        //      bytesTotal:    表示该文件的字节总数；
        //      totalBytesUploaded: 表示目前为止所有文件的上传字节总数；
        //      totalBytesTotal: 表示所有文件的字节总数
        onUploadProgress: function (file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) { },

        //  当文件上传进度每次更新时，该事件将会被触发；
        //      file:   表示将要被上传的文件对象；
        onUploadStart: function (file) { },

        //  当文件上传成功完成时，该事件将会被触发；针对每个上传成功的文件，该事件都会触发一次；
        //      file:   表示上传完成的文件对象；
        //      data:   文件上传完成后，由服务器端返回的数据；
        //      response:表示文件上传完成后，由服务器端返回的全部数据内容；如果该值为 false，则表示当提交上传后并超过 successTimeout 属性设置的超时时间后，服务器任未有数据返回；
        onUploadSuccess: function (file, data, response) { }
    };


    $.extend($.fn.euploadify.defaults, {

        successTimeout: 3600,
        removeCompleted: false,
        formData: { folder: "uploads" },
        buttonText: "选择文件...",
        multi: false,
        auto: true,

        uploadText: "上传",
        stopText: "停止上传",
        cancelText: "取消上传",
        emptyText: "未选择文件",
        finishText: "上传完成!",
        errorText: "上传失败",
        FILE_STATUS: { "-1": "等待上传", "-2": "正在上传...", "-3": "上传出错", "-4": "上传完成", "-5": "已取消" },

        buttonIcon: "icon-search",
        stopIcon: "icon-hamburg-stop",
        cancelIcon: "icon-standard-cancel",
        uploadIcon: "icon-hamburg-publish",

        //  在设置控件允许可以同时上传多个文件时(multi: true)，多文件列表的显示方式；String 类型值，可选的值限定如下范围：
        //      uploadify:
        //      simple:
        //      list:
        //      grid:
        multiTemplate: "uploadify",

        multiTemplateData: {
            uploadify: $.fn.euploadify.defaults.itemTemplate,
            simple: "<div id=\"${fileID}\" class=\"uploadify-queue-item\">\
            		<div class=\"cancel\">\
            			<a href=\"javascript:$(\'#${instanceID}\').uploadify(\'cancel\', \'${fileID}\')\">X</a>\
            		</div>\
            		<span class=\"fileName\">${fileName} (${fileSize})</span><span class=\"data\"></span>\
            	 </div>",
            bootstrap: ""
        },

        value: null,

        disabled: false,

        queueTemplet: null,

        buttonPlain: true,

        width: "auto",

        height: "auto",

        buttonWidth: 90,

        buttonHeight: 24,

        showStop: false,

        showCancel: false,


        onButtonStop: function () { }
    });


    $.parser.plugins.push("euploadify");

    if ($.fn.form && $.isArray($.fn.form.otherList)) {
        $.array.insert($.fn.form.otherList, 0, "euploadify");
    }

})(jQuery);