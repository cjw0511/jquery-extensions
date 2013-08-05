/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: jeasyui@gmail.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI toolbar Extensions 1.0 beta
* jQuery EasyUI toolbar 组件扩展
* jeasyui.plugins.toolbar.js
* 二次开发 陈建伟
* 最近更新：2013-07-24
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function initialize(target) {
        var t = $.util.parseJquery(target), isDiv = /^(?:div)$/i.test(target.nodeName),
            container = isDiv ? t : $("<div></div>");
        if (!isDiv) { container.attr({ "class": t.attr("class"), "style": t.attr("style") }); t.hide(); }
        var state = $.data(target, "toolbar");
        state.container = container;
        t.addClass("toolbar-f");
        container.addClass("dialog-toolbar toolbar");
    };




    var loader = function (param, success, error) { };


    $.fn.toolbar = function (options, param) {
        if (typeof options == "string") {
            return $.fn.toolbar.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "toolbar");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "toolbar", {
                    options: $.extend({}, $.fn.toolbar.defaults, $.fn.toolbar.parseOptions(this), options)
                });
            }
            initialize(this);
        });
    };

    $.fn.toolbar.parseOptions = function (target) {
        var t = $.util.parseJquery(target);
        return $.extend({}, $.parser.parseOptions(target));
    };

    $.fn.toolbar.methods = {

        options: function (jq) { return $.data(jq[0], 'toolbar').options; },

        destory: function (jq) { },

        resize: function (jq, size) { },

        setText: function (jq, param) { },

        setIcon: function (jq, param) { },

        getItem: function (jq, itemEl) { },

        findItem: function (jq, text) { },

        appendItem: function (jq, options) { },

        removeItem: function (jq, itemEl) { },

        insertItem: function (jq, options) { },

        enableItem: function (jq, itemEl) { },

        disableItem: function (jq, itemEl) { }
    };

    $.fn.toolbar.defaults = {

        //  表示 easyui-toolbar 控件的宽度，Number 类型数值；默认为 auto 表示自适应宽度；
        width: "auto",

        //  表示 easyui-toolbar 控件的高度，Number 类型数值；默认为 auto 表示自适应高度为 26px；
        height: "auto",

        //  表示 easyui-toolbar 控件的横向对齐方式，可选的值为 "left"、"center" 或 "right"；默认为 "left"；
        align: "left",

        //  表示 easyui-toolbar 控件的纵向对齐方式，可选的值为 "top"、"middle" 或 "bottom"；默认为 "middle"；
        valign: "middle",

        //  表示 easyui-toolbar 控件的具体内容信息，为一个 Array 数组对象；数组中的每个元素都包含如下属性：
        //      iconCls:
        //      text:
        //      type:
        //      handler:
        data: null,

        url: null,

        loader: loader,

        onResize: function (width, height) { },

        onClick: function (e, item) { },

        onBeforeDestroy: function () { },

        onDestroy: function () { }
    };



    $.fn.toolbar.extensions = {};



    $.parser.plugins.push("toolbar");


    var css =
        ".toolbar { width: auto; height: 26px; }";
    $.util.addCss(css);

})(jQuery);