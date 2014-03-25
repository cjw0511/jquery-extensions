/**
* jQuery EasyUI 1.3.5
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI searchbox Extensions 1.0 beta
* jQuery EasyUI searchbox 组件扩展
* jeasyui.extensions.searchbox.js
* 二次开发 流云
* 最近更新：2014-03-12
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.linkbutton.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    $.fn.searchbox.extensions = {};


    function initialize(target) {
        var box = $(target), state = $.data(target, "searchbox"), opts = state.options,
            textbox = state.searchbox.find("input.searchbox-text"), btn = state.searchbox.find(".searchbox-button");;
        btn.unbind("click.searchbox").bind("click.searchbox", function () {
            if (!opts.disabled) {
                opts.searcher.call(target, opts.value, textbox._propAttr("name"));
            }
        });
        setDisabled(target, opts.disabled);
    };




    function setDisabled(target, disabled) {
        var box = $(target), state = $.data(target, "searchbox"), opts = state.options,
            textbox = state.searchbox.find("input.searchbox-text"), menu = state.searchbox.find("a.searchbox-menu");
        if (disabled) {
            opts.disabled = true;
            box.attr("disabled", true);
            textbox.attr("disabled", true);
            menu.menubutton("disable");
        } else {
            opts.disabled = false;
            box.removeAttr("disabled");
            textbox.removeAttr("disabled");
            menu.menubutton("enable");
        }
    };


    var _searchbox = $.fn.searchbox;
    $.fn.searchbox = function (options, param) {
        if (typeof options == "string") {
            return _searchbox.apply(this, arguments);
        }
        options = options || {};
        return this.each(function () {
            var jq = $(this), hasInit = $.data(this, "searchbox") ? true : false,
                opts = hasInit ? options : $.extend({}, $.fn.searchbox.parseOptions(this), $.parser.parseOptions(this, [{
                    disabled: jq.attr("disabled") ? true : undefined
                }]), options);
            _searchbox.call(jq, opts);
            initialize(this);
        });
    };
    $.union($.fn.searchbox, _searchbox);


    var methods = $.fn.searchbox.extensions.methods = {

        disable: function (jq) { return jq.each(function () { setDisabled(this, true); }); },

        enable: function (jq) { return jq.each(function () { setDisabled(this, false); }); }

    };
    var defaults = $.extend({}, $.fn.searchbox.extensions.defaults, {

        //  扩展 easyui-searchbox 的自定义属性，表示控件在初始化时是否被禁用；
        disabled: false
    });

    $.extend($.fn.searchbox.defaults, defaults);
    $.extend($.fn.searchbox.methods, methods);


    $.extend($.fn.datagrid.defaults.editors, {
        searchbox: {
            init: function (container, options) {
                var box = $("<input type=\"text\"></input>").appendTo(container).searchbox(options);
                box.searchbox("textbox").addClass("datagrid-editable-input");
                return box;
            },
            destroy: function (target) {
                $(target).searchbox("destroy");
            },
            getValue: function (target) {
                return $(target).searchbox("getValue");
            },
            setValue: function (target, value) {
                $(target).searchbox("setValue", value);
            },
            resize: function (target, width) {
                $(target).searchbox("resize", width);
            },
            setFocus: function (target) {
                $(target).searchbox("textbox").focus();
            }
        }
    });


})(jQuery);