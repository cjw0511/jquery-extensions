/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI combo Extensions 1.0 beta
* jQuery EasyUI combo 组件扩展
* jeasyui.extensions.combo.js
* 二次开发 流云
* 最近更新：2013-08-02
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    $.fn.combo.extensions = {};

    function setPrompt(target, prompt) {
        var t = $.util.parseJquery(target), opts = t.combo("options"), textbox = t.combo("textbox");
        opts.prompt = prompt;
        textbox.validatebox("setPrompt", prompt);
    };

    function setIcon(target, iconCls) {
        var t = $.util.parseJquery(target), state = $.data(target, "combo"), combo = state.combo;
        var arrow = combo.find("span.combo-arrow").removeAttr("class").addClass("combo-arrow");
        if (iconCls) { arrow.addClass(iconCls); }
        t.combo("options").iconCls = iconCls;
    }

    function setRequired(target, required) {
        var t = $.util.parseJquery(target), opts = t.combo("options"), textbox = t.combo("textbox");
        opts.required = textbox.validatebox("options").required = required;
    };

    var _destroy = $.fn.combo.methods.destroy;
    function destroy(target) {
        var t = $(target), opts = t.combo("options");
        if ($.isFunction(opts.onBeforeDestroy) && opts.onBeforeDestroy.call(target) == false) { return; }
        _destroy.call(target, t);
        if ($.isFunction(opts.onDestroy)) { opts.onDestroy.call(target); }
    };

    function getCombo(target) {
        return $.data(target, "combo").combo;
    };




    function initialize(target) {
        var t = $.util.parseJquery(target), state = $.data(target, "combo"),
            opts = t.combo("options"), panel = state.panel,
            combo = state.combo, arrow = combo.find(".combo-arrow"),
            exts = opts.extensions ? opts.extensions : opts.extensions = {};
        if (!exts._initialized) {
            t.combo("textbox").focus(function () {
                if (opts.autoShowPanel && panel.is(":hidden")) { t.combo("showPanel"); }
            });
            arrow.unbind("click.combo").bind("click.combo", function () {
                if (panel.is(":visible")) {
                    t.combo("hidePanel");
                } else {
                    $("div.combo-panel:visible").panel("close");
                    t.combo("showPanel");
                    t.combo("textbox").focus();
                }
            });
            if (opts.iconCls) { t.combo("setIcon", opts.iconCls); }
            if ($.util.browser.msie && combo._outerWidth() != opts.width) {
                $.util.exec(function () { t.combo("resize", opts.width); });
            }
            exts._initialized = true;
        }
    }


    var _combo = $.fn.combo;
    $.fn.combo = function (options, param) {
        if (typeof options == "string") { return _combo.apply(this, arguments); }
        return _combo.apply(this, arguments).each(function () {
            initialize(this);
        });
    };
    $.union($.fn.combo, _combo);


    var defaults = $.fn.combo.extensions.defaults = {
        //  增加 easyui-combo 的自定义扩展属性；表示该 combo 组件的 iconCls 图标样式类；
        //  String 类型值，默认为 null。
        iconCls: null,

        //  增加 easyui-combo 的自定义扩展属性；表示该 combox 组件是否在 textbox 文本显示框获取焦点时自动执行 showPanel 方法显示下拉 panel 面板；
        //  Boolean 类型值，默认为 true。
        autoShowPanel: true,

        onBeforeDestroy: function () { },

        onDestroy: function () { }
    };

    var methods = $.fn.combo.extensions.methods = {
        //  扩展 easyui-combo 组件的自定义方法；用于设置 easyui-combo 控件的右侧显示图标，该方法定义如下参数：
        //      iconCls:    String 类型的值，表示需要设置的图标的 css 类样式名，例如 "icon-ok", "icon-save"
        //  返回值：返回表示当前 easyui-combo 控件的 jQuery 链式对象。
        setIcon: function (jq, iconCls) { return jq.each(function () { setIcon(this, iconCls); }); },

        //  扩展 easyui-combo 组件的自定义方法；用于设置启用或者禁用 easyui-combo 控件的表单验证功能，该方法定义如下参数：
        //      required:   Boolean 类型的值，表示启用或者禁用 easyui-combo 控件的表单验证功能。
        //  返回值：返回表示当前 easyui-combo 控件的 jQuery 链式对象。
        setRequired: function (jq, required) { return jq.each(function () { setRequired(this, required); }); },

        //  扩展 easyui-combo 组件的自定义方法；用于设置该 combo 的 textbox 输入框的 prompt(输入提示文字) 值；该方法定义如下参数：
        //      prompt: String 类型值，表示要被设置的 prompt 值；
        //  返回值：返回表示当前 easyui-combo 控件的 jQuery 链式对象。
        setPrompt: function (jq, prompt) { return jq.each(function () { setPrompt(this, prompt); }); },

        destroy: function (jq) { return jq.each(function () { destroy(this); }); },

        combo: function (jq) { return getCombo(jq[0]); }
    };
    $.extend($.fn.combo.defaults, defaults);
    $.extend($.fn.combo.methods, methods);

})(jQuery);