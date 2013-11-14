/**
* jQuery EasyUI 1.3.4
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI gridselector Extensions 1.0 beta
* jQuery EasyUI gridselector 组件扩展
* jeasyui.extensions.gridselector.js
* 二次开发 流云
* 最近更新：2013-09-05
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late
*   5、jeasyui.extensions.window.js v1.0 beta late
*   6、jeasyui.extensions.dialog.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {


    $.easyui.showGridSelector = function (options) {
        var opts = $.extend({
            width: 580, height: 360,
            title: "选择数据",
            iconCls: "icon-hamburg-zoom",
            maximizable: true,
            collapsible: true,
            selected: null,
            multiple: false,
            onSelect: function (value) { }
        }, options);
        var value = opts.selected,
            dia = $.easyui.showDialog($.extend({}, opts, {
                saveButtonText: "确定",
                saveButtonIconCls: "icon-ok",
                enableApplyButton: false,
                topMost: true,
                onSave: function () { if ($.isFunction(opts.onSelect)) { return opts.onSelect.call(this, value); } }
            }));
        return dia;
    };

    $.easyui.showDblGridSelector = function (options) { };

    $.easyui.showTreeSelector = function (options) { };

    $.easyui.showDblTreeSelector = function (options) { };

    $.easyui.showTreeGridSelector = function (options) { };

    $.easyui.showDblTreeGridSelector = function (options) { };





})(jQuery);