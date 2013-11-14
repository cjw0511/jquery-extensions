/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI combogrid Extensions 1.0 beta
* jQuery EasyUI combogrid 组件扩展
* jeasyui.extensions.combogrid.js
* 二次开发 流云
* 最近更新：2013-07-29
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.datagrid.js v1.0 beta late
*   5、jeasyui.extensions.panel.js v1.0 beta late 和 jeasyui.extensions.window.js v1.0 beta late(可选)
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    $.fn.combogrid.extensions = {};


    var methods = $.fn.combogrid.extensions.methods = {};
    var defaults = $.fn.combogrid.extensions.defaults = $.extend({}, $.fn.datagrid.extensions.defaults, {
        //  覆盖 easyui-combogrid 的事件 onLoadSuccess 以支持 easyui-datagrid 的自定义扩展功能；
        onLoadSuccess: function (data) {
            var t = $.util.parseJquery(this), grid = t.combogrid("grid");
            $.fn.datagrid.extensions.defaults.onLoadSuccess.call(grid, data);
        },

        //  覆盖 easyui-combogrid 的事件 onResizeColumn 以支持 easyui-datagrid 的自定义扩展功能；
        onResizeColumn: function (field, width) {
            var t = $.util.parseJquery(this), grid = t.combogrid("grid");
            $.fn.datagrid.extensions.defaults.onResizeColumn.call(grid, field, width);
        }
    });

    $.extend($.fn.combogrid.defaults, defaults);
    $.extend($.fn.combogrid.methods, methods);

    //  增加 easyui-datagrid 中 editors 属性对 easyui-combogrid 的支持。
    if ($.fn.datagrid) {
        $.extend($.fn.datagrid.defaults.editors, {
            combogrid: {
                init: function (container, options) {
                    return $("<select class='datagrid-editable-input' ></select>").appendTo(container).combogrid(options);
                },
                destroy: function (target) { $.util.parseJquery(target).combogrid("destroy"); },
                getValue: function (target) {
                    var t = $.util.parseJquery(target), opts = t.combogrid("options");
                    return t.combogrid(opts.multiple ? "getValues" : "getValue");
                },
                setValue: function (target, value) {
                    $.util.parseJquery(target).combogrid($.isArray(value) ? "setValues" : "setValue", value);
                },
                resize: function (target, width) { $(target).combogrid("resize"); }
            }
        });
    }
})(jQuery);