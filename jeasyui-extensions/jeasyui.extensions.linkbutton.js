/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI linkbutton Extensions 1.0 beta
* jQuery EasyUI linkbutton 组件扩展
* jeasyui.extensions.linkbutton.js
* 二次开发 流云
* 最近更新：2013-09-02
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    $.fn.linkbutton.extensions = {};

    function initialize(target) {
        var t = $.util.parseJquery(target), opts = t.linkbutton("options"),
            exts = opts.extensions ? opts.extensions : opts.extensions = {};
        if (!exts._initialized) {
            setStyle(target, opts.style);
            exts._initialized = true;
        }
    };

    function setIcon(target, iconCls) {
        var t = $.util.parseJquery(target), opts = t.linkbutton("options"),
            span = t.find("span.l-btn-empty"), isEmpty = span.length ? true : false;
        if (!isEmpty) { span = t.find("span.l-btn-text"); }
        span.removeClass(opts.iconCls).addClass(iconCls);
        opts.iconCls = iconCls;
    };

    function setText(target, text) {
        var t = $.util.parseJquery(target), opts = t.linkbutton("options"),
            textspan = t.find("span.l-btn-text");
        if (text) {
            textspan.empty().removeClass("l-btn-icon-left l-btn-icon-right").addClass("l-btn-text l-btn-icon-" + opts.iconAlign).addClass(opts.iconCls).text(text);
        } else {
            textspan.empty().removeClass("l-btn-icon-left l-btn-icon-right").removeClass(opts.iconCls);
            $("<span class='l-btn-empty'>&nbsp;</span>").addClass(opts.iconCls).appendTo(textspan);
        }
        opts.text = text;
    };

    function setIconAlign(target, iconAlign) {
        var t = $.util.parseJquery(target), opts = t.linkbutton("options");
        if (!t.find("span.l-btn-empty").length) {
            $.util.exec(function () {
                t.find("span.l-btn-text").removeClass("l-btn-icon-left l-btn-icon-right").addClass("l-btn-icon-" + opts.iconAlign);
            });
        }
        opts.iconAlign = iconAlign;
    }

    function setStyle(target, style) {
        if (style) {
            $.util.parseJquery(target).css(style);
        }
    };

    function setPlain(target, plain) {
        var t = $.util.parseJquery(target), opts = t.linkbutton("options");
        plain = plain ? true : false;
        t[plain ? "addClass" : "removeClass"]("l-btn-plain");
        opts.plain = plain;
    };



    var _linkbutton = $.fn.linkbutton;
    $.fn.linkbutton = function (options, param) {
        if (typeof options == "string") { return _linkbutton.apply(this, arguments); }
        return _linkbutton.apply(this, arguments).each(function () {
            initialize(this);
        });
    };
    $.union($.fn.linkbutton, _linkbutton);


    var defaults = $.fn.linkbutton.extensions.defaults = {
        //  增加 easyui-linkbutton 控件的自定义属性；表示 linkbutton 按钮的自定义样式。
        style: null
    };

    var methods = $.fn.linkbutton.extensions.methods = {
        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的图标；该方法定义如下参数：
        //      iconCls:    String 类型值，表示要设置的新的图标样式
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setIcon: function (jq, iconCls) { return jq.each(function () { setIcon(this, iconCls); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的文字；该方法定义如下参数：
        //      text:   String 类型值，表示要设置的新的按钮文本内容
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setText: function (jq, text) { return jq.each(function () { setText(this, text); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的图标位置；该方法定义如下参数：
        //      iconAlign:   String 类型值，表示要设置的按钮的图标位置；该参数限定取值 "left"、"right"
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setIconAlign: function (jq, iconAlign) { return jq.each(function () { setIconAlign(this, iconAlign); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的自定义样式；该方法定义如下参数：
        //      style:   JSON-Object 类型，表示要设置的按钮的样式
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setStyle: function (jq, style) { return jq.each(function () { setStyle(this, style); }); },

        //  增加 easyui-linkbutton 控件的自定义扩展方法；设置 linkbutton 按钮的 plain 属性；该方法定义如下参数：
        //      plain:   Boolean 类型，表示要设置的按钮的 plain 属性值
        //  返回值：返回表示当前 easyui-linkbutton 控件的 jQuery 链式对象；
        setPlain: function (jq, plain) { return jq.each(function () { setPlain(this, plain); }); }
    };

    $.extend($.fn.linkbutton.defaults, defaults);
    $.extend($.fn.linkbutton.methods, methods);

})(jQuery);