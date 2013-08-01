/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: jeasyui@gmail.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI panel Extensions 1.0 beta
* jQuery EasyUI panel 组件扩展
* jeasyui.extensions.panel.js
* 二次开发 陈建伟
* 最近更新：2013-06-24
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/

/*
功能说明：
*/

(function ($, undefined) {


    $.fn.panel.extensions = {};


    //  easyui-panel、easyui-window、easyui-dialog 卸载时回收内存，主要用于 layout、panel(及其继承组件) 使用 iframe 嵌入网页时的内存泄漏问题
    var onBeforeDestroy = function () {
        $("iframe,frame", this).each(function () {
            try {
                if (this.contentWindow && this.contentWindow.close) {
                    this.contentWindow.document.write("");
                    this.contentWindow.close();
                }
                $(this).remove();
                if ($.isFunction(window.CollectGarbage)) { window.CollectGarbage(); }
            } catch (ex) { }
        });
    };
    $.fn.panel.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.window.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.dialog.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.datagrid.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.propertygrid.defaults.onBeforeDestroy = onBeforeDestroy;
    $.fn.treegrid.defaults.onBeforeDestroy = onBeforeDestroy;


    var _onPanelResize = $.fn.panel.defaults.onResize;
    var _onWindowResize = $.fn.panel.defaults.onResize;
    var _onDialogResize = $.fn.panel.defaults.onResize;
    var onResize = function (width, height) {
        var panel = $.util.parseJquery(this), isDia = isDialog(this), isWin = isWindow(this);
        if (isDia) {
            _onDialogResize.apply(this, arguments);
        } else if (isWin) { _onWindowResize.apply(this, arguments); } else {
            _onPanelResize.apply(this, arguments);
        }
        if (!inlayout(panel)) {
            var opts = panel.panel("options");
            opts.minWidth = $.isNumeric(opts.minWidth) ? opts.minWidth : defaults.minHeight;
            opts.maxWidth = $.isNumeric(opts.maxWidth) ? opts.maxWidth : defaults.maxWidth;
            opts.minHeight = $.isNumeric(opts.minHeight) ? opts.minHeight : defaults.minHeight;
            opts.maxHeight = $.isNumeric(opts.maxHeight) ? opts.maxHeight : defaults.maxHeight;
            var resizable = false;
            if (width > opts.maxWidth) { width = opts.maxWidth; resizable = true; }
            if (width < opts.minWidth) { width = opts.minWidth; resizable = true; }
            if (height > opts.maxHeight) { height = opts.maxHeight; resizable = true; }
            if (height < opts.minHeight) { height = opts.minHeight; resizable = true; }
            if (resizable && !opts.fit) {
                panel[isDia ? "dialog" : (isWin ? "window" : "panel")]("resize", { width: width, height: height });
            }
        }
    };

    var inlayout = function (target) {
        var t = $.util.parseJquery(target), body = t.panel("body"), panel = t.panel("panel");
        return body.hasClass("layout-body") && panel.hasClass("layout-panel");
    };

    var intabs = function (target) {
        var t = $.util.parseJquery(target), panel = t.panel("panel"), panels = panel.parent(), container = panels.parent();
        return panels.hasClass("tabs-panels") && container.hasClass("tabs-container");
    };

    var isWindow = function (target) {
        var t = $.util.parseJquery(target), body = t.panel("body");
        return body.hasClass("window-body") && body.parent().hasClass("window");
    };

    var isDialog = function (target) {
        var t = $.util.parseJquery(target), body = t.panel("body");
        return isWindow(target) && (body.children("div.panel").children("div.panel-body.dialog-content").length ? true : false);
    };





    function parseExtensionsBegin(options) {
        options._extensionsPanel = { href: options.href, content: options.content };
        if (!options.iniframe) { return; }
        options.href = null;
        options.content = null;
    };
    function parseExtensionsEnd(target) {
        var panel = $(target), opts = panel.panel("options"),
                exts = opts._extensionsPanel ? opts._extensionsPanel : opts._extensionsPanel = { href: opts.href, content: opts.content };
        opts.href = exts.href; opts.content = exts.content;
        if (opts.iniframe) { refresh(target, opts.href); }
    };

    var _panel = $.fn.panel;
    $.fn.panel = function (options, param) {
        if (typeof options == "string") { return _panel.apply(this, arguments); }
        options = options || {};
        return this.each(function () {
            var jq = $.util.parseJquery(this), opts = $.extend({}, $.fn.panel.parseOptions(this), options);
            parseExtensionsBegin(opts);
            _panel.call(jq, opts);
            parseExtensionsEnd(this);
        });
    };
    $.union($.fn.panel, _panel);


    var _refresh = $.fn.panel.methods.refresh;
    function refresh(target, href) {
        var p = $.util.parseJquery(target), opts = p.panel("options");
        href = href ? opts.href = href : opts.href;
        if (opts.iniframe) {
            var exts = opts._extensionsPanel ? opts._extensionsPanel : opts._extensionsPanel = { href: opts.href, content: opts.content };
            exts.href = opts.href; exts.content = opts.content;
            opts.href = null;
            opts.content = "<iframe class='panel-iframe' frameborder='0' width='100%' height='100%' marginwidth='0px' marginheight='0px' scrolling='auto'></iframe>";
            _refresh.call(p, p);
            opts.href = exts.href; opts.content = exts.content;
            $.util.call(function () { getIframe(target).attr("src", href); });
        } else {
            _refresh.call(p, p, href);
        }
    };

    function getIframe(target) {
        var p = $.util.parseJquery(target), body = p.panel("body");
        return body.children("iframe.panel-iframe");
    };

    var _header = $.fn.panel.methods.header;
    function getHeader(target) {
        var t = $.util.parseJquery(target);
        if (!intabs(target)) { return _header.call(t, t); }
        var panel = t.panel("panel"), index = panel.index(), tabs = panel.closest(".tabs-container");
        return tabs.find(">div.tabs-header>div.tabs-wrap>ul.tabs>li").eq(index);
    };

    var methods = $.fn.panel.extensions.methods = {
        //  判断当前 easyui-panel 是否为 easyui-layout 的 panel 部件；
        //  返回值：如果当前 easyui-panel 是 easyui-layout 的 panel 部件，则返回 true，否则返回 false。
        inlayout: function (jq) { return inlayout(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-window 组件；
        isWindow: function (jq) { return isWindow(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-dialog 组件；
        isDialog: function (jq) { return isDialog(jq[0]); },

        //  判断当前 easyui-panel 是否为 easyui-tabs 的选项卡。
        intabs: function (jq) { return intabs(jq[0]); },

        //  增加 easyui-panel 控件的扩展方法；该方法用于获取当前在 iniframe: true 时当前 panel 控件中的 iframe 容器对象；
        //  备注：如果 inirame: false，则该方法返回一个空的 jQuery 对象。
        iframe: function (jq) { return getIframe(jq[0]); },

        //  重写 easyui-panel 控件的 refresh 方法，用于支持 iniframe 属性。
        refresh: function (jq, href) { return jq.each(function () { refresh(this, href); }); },

        //  重写 easyui-panel 控件的 header 方法，支持位于 easyui-tabs 中的 tab-panel 部件获取 header 对象；
        //  备注：如果该 panel 位于 easyui-tabs 中，则该方法返回 easyui-tabs 的 div.tabs-header div.tabs-wrap ul.tabs 中对应该 tab-panel 的 li 对象。
        header: function (jq) { return getHeader(jq[0]); }
    };
    var defaults = $.fn.panel.extensions.defaults = {
        //  表示 easyui-panel 面板的最小宽度。
        minWidth: 10,

        //  表示 easyui-panel 面板的最大宽度。
        maxWidth: 10000,

        //  表示 easyui-panel 面板的最小高度。
        minHeight: 10,

        //  表示 easyui-panel 面板的最大高度。
        maxHeight: 10000,

        //  重新定义的 onResize 事件。用于扩展四个新增属性 minWidth、maxWidth、minHeight、maxHeight 的功能。
        onResize: onResize,

        //  增加 easyui-panel 控件的扩展属性；该属性表示 href 加载的远程页面是否装载在一个 iframe 中。
        iniframe: false
    };

    $.extend($.fn.panel.defaults, defaults);
    $.extend($.fn.panel.methods, methods);

})(jQuery);