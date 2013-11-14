/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI dialog Extensions 1.0 beta
* jQuery EasyUI dialog 组件扩展
* jeasyui.extensions.dialog.js
* 二次开发 流云
* 最近更新：2013-09-02
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late
*   5、jeasyui.extensions.window.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/

/*
功能说明：
*/

(function ($, undefined) {


    $.fn.dialog.extensions = {};



    var easyui = $.util.$.easyui ? $.util.$.easyui : $.easyui,
        cache = easyui.frameMapCache ? easyui.frameMapCache : easyui.frameMapCache = [];

    function resetCache(iframe) {
        var array = $.array.filter(cache, function (val) { return val.current == iframe; }), l = array.length;
        while (l--) { $.array.remove(cache, array[l]); };
    };

    var getParent = function () {
        var current = $.util.currentFrame;
        if (!current) { return $.util.top; }
        var p = $.array.first(cache, function (val) { return val.current == current; });
        return (p && p.parent && p.parent.contentWindow) ? p.parent.contentWindow : $.util.parent;
    };
    //  该属性仅可以在通过 $.easyui.showDialog 打开的 easyui-dialog 中的 iframe 中使用；
    //  该属性表示父级页面的 window 对象。
    $.easyui.parent = getParent();

    //  该方法仅可以在通过 $.easyui.showDialog 打开的 easyui-dialog 中的 iframe 中使用；
    //  关闭当前页面所在的 easyui-dialog 窗体。
    $.easyui.parent.closeDialog = $.easyui.closeCurrentDialog = function () {
        if ($.util.isTopMost) { return; }
        $.easyui.parent.$($.util.currentFrame).closest("div.window-body").dialog("close");
    };

    $.easyui._showDialog = function (opts, currentFrame) {
        if (opts.onApply == null || opts.onApply == undefined) { opts.onApply = opts.onSave; }
        if (opts.onSave == null || opts.onSave == undefined) { opts.onSave = opts.onApply; }

        var _onClose = opts.onClose;
        opts.onClose = function () {
            if ($.isFunction(_onClose)) { _onClose.apply(this, arguments); }
            if (opts.autoDestroy) {
                $(this).dialog("destroy");
            }
        };

        var _onBeforeDestroy = opts.onBeforeDestroy;
        opts.onBeforeDestroy = function () {
            if (opts.iniframe) {
                var iframe = $(this).dialog("iframe");
                resetCache(iframe[0]);
            }
            if ($.isFunction(_onBeforeDestroy)) { _onBeforeDestroy.apply(this, arguments); }
        };

        if (opts.locale) { opts.inline = true; }
        var dialog = $("<div></div>").appendTo(opts.locale ? opts.locale : "body");

        if (!$.util.likeArray(opts.toolbar)) { opts.toolbar = []; }
        if ($.isArray(opts.toolbar)) {
            $.each(opts.toolbar, function () {
                var handler = this.handler;
                if ($.isFunction(handler)) { this.handler = function () { handler.call(dialog, dialog); }; }
            });
            if (!opts.toolbar.length) { opts.toolbar = null; }
        }

        var buttons = [];
        if (opts.enableApplyButton == true) {
            var btnApply = { text: opts.applyButtonText, iconCls: opts.applyButtonIconCls,
                handler: function (dia) {
                    if ($.isFunction(opts.onApply)) { opts.onApply.call(dia, dia); }
                }
            };
            buttons.push(btnApply);
        }
        if (opts.enableSaveButton == true) {
            var btnSave = { text: opts.saveButtonText, iconCls: opts.saveButtonIconCls,
                handler: function (dia) {
                    var isFunc = $.isFunction(opts.onSave);
                    if (!isFunc || isFunc && opts.onSave.call(dia, dia) !== false) { dia.dialog("close"); }
                }
            };
            buttons.push(btnSave);
        }
        if (opts.enableCloseButton == true) {
            var btnClose = { text: opts.closeButtonText, iconCls: opts.closeButtonIconCls,
                handler: function (dia) { dia.dialog("close"); }
            };
            buttons.push(btnClose);
        }
        if (!$.util.likeArray(opts.buttons) || $.util.isString(opts.buttons)) { opts.buttons = []; }
        $.array.merge(opts.buttons, buttons);
        $.each(opts.buttons, function () {
            var handler = this.handler;
            if ($.isFunction(handler)) { this.handler = function () { handler.call(dialog, dialog); }; }
        });
        if (!opts.buttons.length) { opts.buttons = null; }

        opts = dialog.dialog(opts).dialog("options");

        var buttonbar = dialog.dialog("body").children(".dialog-button").each(function () {
            var color = dialog.css("border-bottom-color");
            $(this).addClass("calendar-header").css({ "height": "auto", "border-top-color": color });
        });
        if (!opts.iniframe) {
            if (opts.href) {
                var toolbuttons = dialog.dialog("header").find(".panel-tool a"), bottombuttons = buttonbar.children("a");
                toolbuttons.attr("disabled", "disabled");
                bottombuttons.linkbutton("disable");
                var onLoad = opts.onLoad;
                opts.onLoad = function () {
                    if ($.isFunction(onLoad)) { onLoad.apply(this, arguments); }
                    $.util.exec(function () {
                        toolbuttons.removeAttr("disabled");
                        bottombuttons.linkbutton("enable");
                    });
                };
            }
        }
        var iframe = dialog.dialog("iframe");
        if (iframe.length) { cache.push({ current: iframe[0], parent: currentFrame }); }
        return dialog;
    };

    //  以 easyui-dialog 方法在当前浏览器窗口的顶级(可访问)窗体中弹出对话框窗口；该函数定义如下参数：
    //      options:    一个 JSON Object，具体格式参考 easyui-dialog 官方 api 中的属性列表。
    //          该参数在 easyui-dialog 官方 api 所有原属性列表基础上，增加如下属性：
    //          iniframe:
    //          enableSaveButton:
    //          enableApplyButton:
    //          enableCloseButton:
    //          onSave:
    //          onClose:
    //          saveButtonText:
    //          applyButtonText:
    //          closeButtonText:
    //          saveButtonIconCls:
    //          applyButtonIconCls:
    //          closeButtonIconCls:
    //  备注：
    //  返回值：返回弹出的 easyui-dialog 的 jQuery 对象。
    $.easyui.showDialog = function (options) {
        var opts = $.extend({}, $.easyui.showDialog.defaults, options);
        if (opts.locale) { opts.topMost = false; }
        var currentFrame = $.util.currentFrame, fn = opts.topMost ? $.util.$.easyui._showDialog : $.easyui._showDialog;
        return fn(opts, currentFrame);
    };

    

    //  通过调用 $.easyui.showDialog 方法，以 easyui-dialog 的方式显示一个 JSON - Object 对象的所有属性值；该函数定义如下参数：
    //      options:    需要显示的 JSON - Object；
    //      dialogOption:  该参数可选，表示要打开的 easyui-dialog 的 options。
    //  备注：该方法一般用于对象值显示，例如可以用于项目开发过程中的参数显示调试。
    //  返回值：返回弹出的 easyui-dialog 的 jQuery 对象。
    $.easyui.showOption = function (options, dialogOption) {
        options = options || "无数据显示。";
        dialogOption = dialogOption || {};
        var opts = $.extend({ topMost: $.easyui.showDialog.defaults.topMost }, dialogOption), jq = opts.topMost ? $.util.$ : $;
        var content = jq("<table></table>").css({ padding: "10px", width: "100%" }), type = jq.type(options);
        if ($.array.contains(["array", "object", "function"], type)) {
            for (var key in options) {
                content.append("<tr><td style='text-align: right; width: 100px;'>" + key + ":</td><td>" + options[key] + "</td></tr>");
            }
        } else {
            content.append("<tr><td style='text-align: right; width: 100px;'>options:</td><td>" + String(options) + "</td></tr>");
        }
        $.extend(opts, {
            title: "显示 options 值",
            width: 480,
            height: 260,
            content: content,
            autoVCenter: false,
            autoHCenter: false,
            enableSaveButton: false,
            enableApplyButton: false
        });
        return $.easyui.showDialog(opts);
    };






    var _refresh = $.fn.dialog.methods.refresh;
    function refresh(target, href) {
        var dia = $.util.parseJquery(target), opts = dia.dialog("options"), panel = dia.dialog("contentPanel"), panelOpts = panel.panel("options");
        href = href ? opts.href = href : opts.href;
        panelOpts.iniframe = opts.iniframe;
        panel.panel("refresh", href);
    };

    function getContentPanel(target) {
        var state = $.data(target, "dialog");
        return state ? state.contentPanel : null;
    };

    function getIframe(target) {
        var panel = getContentPanel(target);
        return panel.panel("iframe");
    };

    function parseExtensionsBegin(options) {
        options._extensionsDialog = { href: options.href, content: options.content, iniframe: options.iniframe };
        if (!options.iniframe) { return; }
        options.href = null;
        options.content = null;
        options.iniframe = false;
    };
    function parseExtensionsEnd(target) {
        var d = $.util.parseJquery(target), opts = d.dialog("options"), exts = opts._extensionsDialog ? opts._extensionsDialog
            : opts._extensionsDialog = { href: opts.href, content: opts.content, iniframe: opts.iniframe };
        opts.href = exts.href; opts.content = exts.content; opts.iniframe = exts.iniframe;
        if (opts.iniframe) { refresh(target, opts.href); }
    };

    var _dialog = $.fn.dialog;
    $.fn.dialog = function (options, param) {
        if (typeof options == "string") { return _dialog.apply(this, arguments); }
        options = options || {};
        return this.each(function () {
            var jq = $.util.parseJquery(this), opts = $.extend({}, $.fn.dialog.parseOptions(this), options);
            parseExtensionsBegin(opts);
            _dialog.call(jq, opts);
            parseExtensionsEnd(this);
        });
    };
    $.union($.fn.dialog, _dialog);


    var methods = $.fn.dialog.extensions.methods = {
        //  修复 easyui-dialog 组件的 options 方法返回的 width 和 height 属性不正确的 BUG
        options: function (jq) {
            var state = $.data(jq[0], "dialog"), opts = state.options,
                pp = jq.panel("options");
            $.extend(opts, {
                closed: pp.closed, collapsed: pp.collapsed, minimized: pp.minimized, maximized: pp.maximized,
                width: pp.width, height: pp.height
            });
            return opts;
        },

        //  扩展 easyui-dialog 控件的自定义方法；获取当前 easyui-dialog 控件的内容面板 panel 对象。
        contentPanel: function (jq) { return getContentPanel(jq[0]); },

        //  重写 easyui-panel 控件的自定义方法 iframe；获取当前 easyui-dialog 控件内容面板 panel 对象中的 iframe 对象。
        //  备注：如果 inirame: false，则该方法返回一个空的 jQuery 对象。
        iframe: function (jq) { return getIframe(jq[0]); },

        //  重写 easyui-dialog 控件的 refresh 方法，用于支持 iniframe 属性。
        refresh: function (jq, href) { return jq.each(function () { refresh(this, href); }); }
    };
    var defaults = $.fn.dialog.extensions.defaults = $.extend({}, $.fn.window.extensions.defaults, {});

    $.extend($.fn.dialog.defaults, defaults);
    $.extend($.fn.dialog.methods, methods);



    //  定义 $.easyui.showDialog 方法打开 easyui-dialog 窗体的默认属性。
    //  备注：该默认属性定义仅在方法 $.easyui.showDialog 中被调用。
    $.easyui.showDialog.defaults = {
        title: "新建对话框",
        iconCls: "icon-standard-application-form",
        width: 600,
        height: 360,
        modal: true,
        collapsible: false,
        maximizable: false,
        closable: true,
        draggable: true,
        resizable: true,
        shadow: true,
        minimizable: false,

        href: null,

        //  表示弹出的 easyui-dialog 窗体是否在关闭时自动销毁并释放浏览器资源；
        //  Boolean 类型值，默认为 true。
        autoDestroy: true,

        //  表示将要打开的 easyui-dialog 的父级容器；可以是一个表示 jQuery 元素选择器的表达式字符串，也可以是一个 html-dom 或 jQuery-dom 对象。
        //  注意：如果设置了该参数，则 topMost 属性将自动设置为 false。
        //      如果为 null 或者 undefined 则表示父级容器为 body 标签。
        locale: null,

        //  是否在顶级窗口打开此 easyui-dialog 组件。
        topMost: true,

        //  是否在iframe加载远程 href 页面数据
        iniframe: false,

        //  是否启用保存按钮，保存按钮点击后会关闭模式对话框
        enableSaveButton: true,

        //  是否启用应用按钮
        enableApplyButton: true,

        //  是否启用关闭按钮
        enableCloseButton: true,

        //  点击保存按钮触发的事件，如果该事件范围 false，则点击保存后窗口不关闭。
        onSave: null,

        //  点击应用按钮触发的事件
        onApply: null,

        //  关闭窗口时应触发的事件，easyui-dialog本身就有
        onClose: null,

        //  保存按钮的文字内容
        saveButtonText: "保存",

        //  应用按钮的文字内容
        applyButtonText: "应用",

        //  关闭按钮的文字内容
        closeButtonText: "关闭",

        //  保存按钮的图标样式
        saveButtonIconCls: "icon-save",

        //  应用按钮的图标样式
        applyButtonIconCls: "icon-ok",

        //  关闭按钮的图标样式
        closeButtonIconCls: "icon-cancel"
    };



})(jQuery);