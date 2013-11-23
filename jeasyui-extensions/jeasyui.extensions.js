/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI Generic Plugins Basic Library 1.0 beta
* jQuery EasyUI 通用插件基础库
* jeasyui.extensions.js
* 二次开发 流云
* 最近更新：2013-08-21
*
* 依赖项：jquery.jdirk.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    var coreEasyui = {},
        coreJquery = function () { return $.apply(this, arguments); };

    coreJquery.fn = coreJquery.prototype = {};
    coreJquery.easyui = coreEasyui;

    coreEasyui.getTopEasyuiMessager = function () {
        if ($.util.isTopMost) { return $.messager; }
        return $.util.$ && $.util.$.messager ? $.util.$.messager : $.messager;
    };
    coreEasyui.messager = coreEasyui.getTopEasyuiMessager();

    coreEasyui.getTopEasyuiTooltip = function () {
        if ($.util.isTopMost) { return $.fn.tooltip; }
        return $.util.$ && $.util.$.fn && $.util.$.fn.tooltip ? $.util.$.fn.tooltip : $.fn.tooltip;
    };
    coreEasyui.tooltip = $.fn.tooltip;
    //  对某个元素设置 easyui-tooltip 属性；该函数定义如下参数：
    //      target:     表示要设置 easyui-tooltip 的元素，可以是一个 jQuery 选择器字符串，也可以是一个 DOM 对象或者 jQuery 对象。
    //      options:    表示初始化 easyui-tooltip 的参数信息，为一个 JSON-Object；
    //  备注：通过该方法设置的 easyui-tooltip 属性，在触发 mouseover 事件时，加载 easyui-tooltip，在 tooltip-tip 隐藏时，easyui-tooltip 自动调用 destroy 销毁；
    coreEasyui.tooltip.init = function (target, options) {
        var t = $.util.parseJquery(target);
        t.mouseover(function () {
            t.tooltip($.extend({ trackMouse: true }, options, { onHide: function () {
                if ($.isFunction(options.onHide)) { options.onHide.apply(this, arguments); }
                t.tooltip("destroy");
            }
            })).tooltip("show");
        });
    };

    var icons = { "error": "messager-error", "info": "messager-info", "question": "messager-question", "warning": "messager-warning" },
        _show = $.messager.show, _alert = $.messager.alert, _confirm = $.messager.confirm, _prompt = $.messager.prompt,
        defaults = { title: "操作提醒", confirm: "您确认要进行该操作？", prompt: "请输入相应内容：", icon: "info", loading: "正在加载，请稍等..." };

    //  重写 $.messager.show 方法，使其支持图标以及默认的单个字符串参数的重载；该方法定义如下参数：
    //      options:    表示需要弹出消息的内容、图标和方式等信息，该参数类型可以为如下：
    //          JSON Object: 兼容 $.messager.show 官方默认 API 的所有属性，并在此基础上增加如下参数：
    //              icon: 表示弹出消息的图标，为一个 String 类型值，该值可选的内容与 $.messager.alert 方法的第三个参数可选内容相同；
    //                  包括："error", "info", "question", "warning"；
    //                  具体内容参见 $.messager.alert 该方法的官方默认 API 中第三个参数可选内容。
    //              position: 表示弹出消息的位置，为一个 String 类型值，该值可选的内容定义如下：
    //                  topLeft: 屏幕左上角, topCenter: 屏幕上方中间，topRight: 屏幕右上角
    //                  centerLeft: 屏幕左侧中间，center: 屏幕正中间，centerRight: 屏幕右侧中间
    //                  bottomLeft: 屏幕左下角，bottomCenter: 屏幕下方中间，bottomRight: 屏幕右下角
    //          String: 以 icon: "info"、title: "操作提醒"、msg: options 为默认的方式调用上一重载。
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.show = function (options) {
        var isString = $.util.isString(options) || $.util.isBoolean(options) || $.isNumeric(options);
        if (isString) {
            return arguments.length == 1 ? $.messager.show({ msg: String(options) }) : $.messager.show({ title: options, msg: arguments[1], icon: arguments[2], position: arguments[3] });
        }
        var defaults = $.extend({}, $.messager.defaults, { title: "操作提醒", timeout: 4000, showType: "slide" });
        var position = {
            topLeft: { right: "", left: 0, top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
            topCenter: { right: "", top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
            topRight: { left: "", right: 0, top: document.body.scrollTop + document.documentElement.scrollTop, bottom: "" },
            centerLeft: { left: 0, right: "", bottom: "" },
            center: { right: "", bottom: "" },
            centerRight: { left: "", right: 0, bottom: "" },
            bottomLeft: { left: 0, right: "", top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop },
            bottomCenter: { right: "", top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop },
            bottomRight: { left: "", right: 0, top: "", bottom: -document.body.scrollTop - document.documentElement.scrollTop }
        };
        var opts = $.extend({}, defaults, options);
        opts.style = position[options.position] ? position[options.position] : position.topCenter;
        var iconCls = icons[opts.icon] ? icons[opts.icon] : icons.info;
        opts.msg = "<div class='messager-icon " + iconCls + "'></div>" + "<div>" + opts.msg + "</div>";
        return _show(opts);
    };
    $.union($.messager.show, _show);

    //  重写 $.messager.alert 方法，使其支持如下的多种重载方式：
    //      function (message)
    //      function (message, callback)
    //      function (title, message, callback)
    //      function (title, message, icon)
    //      function (title, message, icon, callback)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.alert = function (title, msg, icon, fn) {
        if (arguments.length == 1) { return _alert(defaults.title, arguments[0], defaults.icon); }
        if (arguments.length == 2) {
            if ($.isFunction(arguments[1])) { return _alert(defaults.title, arguments[0], defaults.icon, arguments[1]); }
            if (arguments[1] in icons) { return _alert(defaults.title, arguments[0], arguments[1]); }
            return _alert.apply(this, arguments);
        }
        if (arguments.length == 3) {
            if ($.isFunction(arguments[2])) {
                return (arguments[1] in icons) ? _alert(defaults.title, arguments[0], arguments[1], arguments[2])
                    : _alert(arguments[0], arguments[1], defaults.icon, arguments[2]);
            }
            return _alert.apply(this, arguments);
        }
        return _alert.apply(this, arguments);
    };

    //  重写 $.messager.confirm 方法，使其支持如下的多种重载方式：
    //      function (message)
    //      function (callback)
    //      function (message, callback)
    //      function (title, message)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.confirm = function (title, msg, fn) {
        if (arguments.length == 1) {
            return $.isFunction(arguments[0]) ? _confirm(defaults.title, defaults.confirm, arguments[0]) : _confirm(defaults.title, arguments[0]);
        }
        if (arguments.length == 2) {
            return $.isFunction(arguments[1]) ? _confirm(defaults.title, arguments[0], arguments[1]) : _confirm(arguments[0], arguments[1]);
        }
        return _confirm.apply(this, arguments);
    };

    //  增加 $.messager.solicit 方法，该方法弹出一个包含三个按钮("是"、"否" 和 "取消")的对话框，点击任意按钮或者关闭对话框时，执行指定的回调函数；
    //      该函数提供如下重载方式：
    //      function (message, callback)
    //      function (title, message, callback)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.solicit = function (title, msg, fn) {
        var options = $.extend({}, (arguments.length == 2) ? { title: defaults.title, msg: arguments[0], fn: arguments[1] }
            : { title: arguments[0], msg: arguments[1], fn: arguments[2] });
        var win = $.messager.confirm(options.title, options.msg, options.fn), opts = win.window("options"), onClose = opts.onClose;
        opts.onClose = function () {
            if ($.isFunction(onClose)) { onClose.apply(this, arguments); }
            if ($.isFunction(options.fn)) { options.fn.call(this, undefined); }
        };
        var button = win.find(">div.messager-button").empty();
        $("<a></a>").linkbutton({ text: "是" }).css("margin-left", "10px").click(function () {
            opts.onClose = onClose; win.window("close"); if ($.isFunction(options.fn)) { options.fn.call(this, true); }
        }).appendTo(button);
        $("<a></a>").linkbutton({ text: "否" }).css("margin-left", "10px").click(function () {
            opts.onClose = onClose; win.window("close"); if ($.isFunction(options.fn)) { options.fn.call(this, false); }
        }).appendTo(button);
        $("<a></a>").linkbutton({ text: "取消" }).css("margin-left", "10px").click(function () {
            opts.onClose = onClose; win.window("close"); if ($.isFunction(options.fn)) { options.fn.call(this, undefined); }
        }).appendTo(button);
        return win;
    };

    //  重写 $.messager.prompt 方法，使其支持如下的多种重载方式：
    //      function (callback)
    //      function (message, callback)
    //      function (title, message)
    //      function (title, message, callback)
    //  返回值：返回弹出的消息框 easyui-window 对象
    $.messager.prompt = function (title, msg, fn) {
        if (arguments.length == 1) {
            return $.isFunction(arguments[0]) ? _prompt(defaults.title, defaults.prompt, arguments[0]) : _prompt(defaults.title, defaults.prompt);
        }
        if (arguments.length == 2) {
            return $.isFunction(arguments[1]) ? _prompt(defaults.title, arguments[0], arguments[1]) : _prompt(arguments[0], arguments[1]);
        }
        return _prompt.apply(this, arguments);
    };


    //  显示类似于 easyui-datagrid 在加载远程数据时显示的 mask 状态层；该函数定义如下重载方式：
    //      function ()
    //      function (options)，其中 options 为一个格式为 { msg, locale, topMost } 的 JSON-Object；
    //  上述参数中：
    //      msg 表示加载显示的消息文本内容，默认为 "正在加载，请稍等..."；
    //      locale 表示加载的区域，可以是一个 jQuery 对象选择器字符串，也可以是一个 jQuery 对象或者 HTML-DOM 对象；默认为字符串 "body"。
    //      topMost 为一个布尔类型参数，默认为 false，表示是否在顶级页面加载此 mask 状态层。
    //  返回值：返回表示弹出的数据加载框和层的 jQuery 对象。
    coreEasyui.loading = function (options) {
        var opts = { msg: defaults.loading, locale: "body", topMost: false };
        options = options || {};
        $.extend(opts, options);
        var jq = opts.topMost ? $.util.$ : $, locale = jq.util.parseJquery(opts.locale), array = locale.children().map(function () {
            var zindex = $(this).css("z-index");
            return $.isNumeric(zindex) ? parseInt(zindex) : 0;
        }), zindex = $.array.max(array);
        locale.addClass("mask-container");
        var mask = jq("<div></div>").addClass("datagrid-mask").css({ display: "block", "z-index": ++zindex }).appendTo(locale);
        var msg = jq("<div></div>").addClass("datagrid-mask-msg").css({ display: "block", left: "50%", "z-index": ++zindex }).html(opts.msg).appendTo(locale);
        msg.css("marginLeft", -msg.outerWidth() / 2);
        return mask.add(msg);
    };

    //  关闭由 $.easyui.loading 方法显示的 "正在加载..." 状态层；该函数定义如下重载方式：
    //      function ()
    //      function (locale)
    //      function (locale, topMost)
    //      function (topMost, locale)
    //      function (options)，其中 options 为一个格式为 { locale, topMost } 的 JSON-Object
    coreEasyui.loaded = function (locale, topMost) {
        var opts = { locale: "body", topMost: false };
        if (arguments.length == 1) {
            if ($.isPlainObject(arguments[0])) {
                $.extend(opts, arguments[0]);
            } else if ($.util.isBoolean(arguments[0])) {
                opts.topMost = arguments[0];
            } else {
                opts.locale = arguments[0];
            }
        }
        if (arguments.length == 2) {
            if ($.util.isBoolean(arguments[0])) {
                $.extend(opts, { locale: arguments[1], topMost: arguments[0] });
            } else {
                $.extend(opts, { locale: arguments[0], topMost: arguments[1] });
            }
        }
        var jq = opts.topMost ? $.util.$ : $, locale = jq.util.parseJquery(opts.locale);
        locale.removeClass("mask-container");
        locale.children("div.datagrid-mask-msg,div.datagrid-mask").remove();
    };


    //  备注： $.messager 表示当前页面的 easyui-messager 对象；
    //         $.easyui.messager 表示可控顶级页面的 easyui-messager 对象；


    //  更改 jQuery EasyUI 中部分控件的国际化语言显示。
    $.extend($.fn.panel.defaults, { loadingMessage: defaults.loading });
    $.extend($.fn.window.defaults, { loadingMessage: defaults.loading });
    $.extend($.fn.dialog.defaults, { loadingMessage: defaults.loading });

    //  更改 jeasyui-combo 组件的非空验证提醒消息语言。
    $.extend($.fn.combo.defaults, { missingMessage: $.fn.validatebox.defaults.missingMessage });



    //  获取或更改 jQuery EasyUI 部分组件的通用错误提示函数；该方法定义如下重载方式：
    //      function():         获取 jQuery EasyUI 部分组件的通用错误提示函数；
    //      function(callback): 更改 jQuery EasyUI 部分组件的通用错误提示函数；
    //  备注：该方法会设置如下组件的 onLoadError 事件；
    //          easyui-form
    //          easyui-combobox
    //          easyui-combotree
    //          easyui-combogrid
    //          easyui-datagrid
    //          easyui-propertygrid
    //          easyui-tree
    //          easyui-treegrid
    //      同时还会设置 jQuery-ajax 的通用错误事件 error。
    coreEasyui.ajaxError = function (callback) {
        if (!arguments.length) { return $.fn.form.defaults.onLoadError; }
        $.fn.form.defaults.onLoadError = callback;
        $.fn.combobox.defaults.onLoadError = callback;
        $.fn.combotree.defaults.onLoadError = callback;
        $.fn.combogrid.defaults.onLoadError = callback;
        $.fn.datagrid.defaults.onLoadError = callback;
        $.fn.propertygrid.defaults.onLoadError = callback;
        $.fn.tree.defaults.onLoadError = callback;
        $.fn.treegrid.defaults.onLoadError = callback;
        $.ajaxSetup({ error: callback });
    };

    var onLoadError = function (XMLHttpRequest, textStatus, errorThrown) {
        $.messager.progress("close");
        if (coreEasyui.messager != $.messager) { coreEasyui.messager.progress("close"); }
        var msg = (XMLHttpRequest && !$.string.isNullOrWhiteSpace(XMLHttpRequest.responseText) ?
                "如果该问题重复出现，请联系您的系统管理员并反馈该故障。<br />" +
                "错误号：" + XMLHttpRequest.status + "(" + XMLHttpRequest.statusText + ")；<hr />" + XMLHttpRequest.responseText :
                "系统出现了一个未指明的错误，如果该问题重复出现，请联系您的系统管理员并反馈该故障。");
        var win = coreEasyui.messager.alert("错误提醒", msg, "error"),
            opts = win.window("options"), panel = win.window("panel"), width = panel.outerWidth(), height = panel.outerHeight();
        if (width > 800 || height > 800) { win.window("resize", { width: width > 800 ? 800 : width, height: height > 800 ? 800 : height }); }
        win.window("center");
    };

    //  更改 jQuery EasyUI 部分组件的通用错误提示。
    coreEasyui.ajaxError(onLoadError);

    //  更改 jQuery.ajax 函数的部分默认属性。
    $.ajaxSetup({
        dataFilter: function (data, type) {
            return $.util.isString(type) && type.toLowerCase(type) == "json" ? $.string.toJSONString(data) : data;
        }
    });


    //  判断当前 jQuery 对象是否是指定名称的已经初始化好的 easyui 插件；该方法定义如下参数：
    //      pluginName：要判断的插件名称，例如 "panel"、"dialog"、"datagrid" 等；
    //  返回值：如果当前 jQuery 对象中的第一个 DOM 元素为 pluginName 参数所示的 easyui 插件且已经被初始化，则返回 true，否则返回 false。
    coreJquery.fn.isEasyUI = function (pluginName) {
        if (!$.array.contains($.parser.plugins, pluginName)) { $.error($.string.format("传入的参数 pluginName: {0} 不是 easyui 插件名。")); }
        if (!this.length) { return false; }
        var state = $.data(this[0], pluginName);
        return state && state.options ? true : false;
    };

    //  判断当前 jQuery 对象是否是指定名称的已经初始化好的 easyui 插件；该方法定义如下参数：
    //      selector:   jQuery 对象选择器，或者 DOM 对象，或者 jQuery 对象均可；
    //      pluginName：要判断的插件名称，例如 "panel"、"dialog"、"datagrid" 等；
    //  返回值：如果 selector 所表示的 jQuery 对象中的第一个 DOM 元素为 pluginName 参数所示的 easyui 插件且已经被初始化，则返回 true，否则返回 false。
    coreEasyui.isEasyUI = function (selector, pluginName) {
        return $.util.parseJquery(selector).isEasyUI(pluginName);
    };



    coreJquery.fn.currentPagination = function () {
        var p = this.closest(".pagination");
        while (p.length && !$.data(p[0], "pagination")) { p = p.parent().closest(".pagination"); }
        return p;
    };

    coreJquery.fn.currentProgressbar = function () {
        var p = this.closest(".progressbar");
        while (p.length && !$.data(p[0], "progressbar")) { p = p.parent().closest(".progressbar"); }
        return p;
    };

    coreJquery.fn.currentPanel = function () {
        var p = this.closest(".panel-body");
        while (p.length && !$.data(p[0], "panel")) { p = p.parent().closest(".panel-body"); }
        return p;
    };

    coreJquery.fn.currentTabPanel = function () {
        var p = this.closest(".panel-body"), panel = p.parent(), panels = panel.parent(), container = panels.parent();
        while (p.length && !($.data(p[0], "panel") && panel.hasClass("panel") && panels.hasClass("tabs-panels") && container.hasClass("tabs-container"))) {
            p = p.parent().closest(".panel-body");
            panel = p.parent();
            panels = panel.parent();
            container = panels.parent();
        }
        return p;
    };

    coreJquery.fn.currentTabIndex = function () {
        var panel = this.currentTabPanel();
        return panel.length ? panel.panel("panel").index() : -1;
    };

    coreJquery.fn.currentTabs = function () {
        var p = this.closest(".tabs-container");
        while (p.length && !$.data(p[0], "tabs")) { p = p.parent().closest(".tabs-container"); }
        return p;
    };

    coreJquery.fn.currentAccordion = function () {
        var p = this.closest(".accordion");
        while (p.length && !$.data(p[0], "accordion")) { p = p.parent().closest(".accordion"); }
        return p;
    };

    coreJquery.fn.currentAccPanel = function () {
        var p = this.closest(".panel-body"), panel = p.parent(), container = panels.parent();
        while (p.length && !($.data(p[0], "panel") && panel.hasClass("panel") && container.hasClass("accordion") && $.data(container[0], "accordion"))) {
            p = p.parent().closest(".panel-body");
            panel = p.parent();
            container = panels.parent();
        }
        return p;
    };

    coreJquery.fn.currentLayout = function () {
        var layout = this.closest(".layout");
        while (layout.length && !$.data(layout[0], "layout")) { layout = layout.closest(".layout"); }
        return layout;
    };

    coreJquery.fn.currentRegion = function () {
        var p = this.closest(".panel.layout-panel"), layout = p.parent(), body = p.children(".panel-body");
        while (p.length && !(layout.hasClass("layout") && $.data(body[0], "panel"))) {
            p = p.parent().closest(".panel.layout-panel");
            layout = p.parent();
            body = p.children(".panel-body");
        }
        return body;
    };

    coreJquery.fn.currentLinkbutton = function () {
        var btn = this.closest(".l-btn");
        while (btn.length && !$.data(btn[0], "linkbutton")) { btn = btn.parent().closest(".layout"); }
        return btn;
    };

    coreJquery.fn.currentCalendar = function () {
        var c = this.closest(".calendar");
        while (c.length && !$.data(c[0], "calendar")) { c = c.parent().closest(".calendar"); }
        return c;
    };

    coreJquery.fn.currentWindow = function () {
        var p = this.closest(".panel-body.window-body");
        while (p.length && !$.data(p[0], "window")) { p = p.parent().closest(".panel-body.window-body"); }
        return p;
    };

    coreJquery.fn.currentDialog = function () {
        var p = this.closest(".panel-body.window-body");
        while (p.length && !$.data(p[0], "dialog")) { p = p.parent().closest(".panel-body.window-body"); }
        return p;
    };

    coreJquery.fn.currentDatagrid = function () {
        var p = this.closest(".datagrid-wrap.panel-body"), dg = p.find(">.datagrid-view>eq(2)");
        while (p.length && !$.data(dg[0], "datagrid")) {
            p = p.parent().closest(".datagrid-wrap.panel-body");
            dg = p.find(">.datagrid-view>eq(2)");
        }
        return dg;
    };

    coreJquery.fn.currentPropertygrid = function () {
        var p = this.closest(".datagrid-wrap.panel-body"), pg = p.find(">.datagrid-view>eq(2)");
        while (p.length && !$.data(pg[0], "propertygrid")) {
            p = p.parent().closest(".datagrid-wrap.panel-body");
            pg = p.find(">.datagrid-view>eq(2)");
        }
        return pg;
    };

    coreJquery.fn.currentTree = function () {
        var t = this.closest(".tree");
        while (t.length && !$.data(t[0], "tree")) { t = t.parent().closest(".tree"); }
        return t;
    };

    coreJquery.fn.currentTreegrid = function () {
        var p = this.closest(".datagrid-wrap.panel-body"), tg = p.find(">.datagrid-view>eq(2)");
        while (p.length && !$.data(tg[0], "treegrid")) {
            p = p.parent().closest(".datagrid-wrap.panel-body");
            tg = p.find(">.datagrid-view>eq(2)");
        }
        return tg;
    };



    $.union(coreJquery);
    $.fn.union(coreJquery.fn);

    var css =
        ".mask-container { position: relative; }";
    $.util.addCss(css);
})(jQuery);