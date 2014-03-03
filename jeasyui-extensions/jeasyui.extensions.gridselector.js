/**
* jQuery EasyUI 1.3.5
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
* 最近更新：2014-02-28
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


    //  增加自定义扩展方法 $.easyui.showGridSelector；该方法弹出一个 easyui-datagrid 选择框窗口；该方法定义如下参数：
    //      options: 这是一个 JSON-Object 对象；
    //              具体格式参考 $.easyui.showDialog 方法的参数 options 的格式 和 easyui-datagrid 的初始化参数 options 的格式；
    //              该参数格式在 $.easyui.showDialog 参数 options 格式基础上扩展了如下属性：
    //          selected:
    //          onSelect:
    //  返回值：返回弹出窗口的 easyui-dialog 控件对象(jQuery-DOM 格式)。
    $.easyui.showGridSelector = function (options) {
        var opts = $.extend({
            width: 580, minWidth: 580, height: 360, minHeight: 360,
            title: "选择数据",
            iconCls: "icon-hamburg-zoom",
            maximizable: true,
            collapsible: true,
            selected: null,
            extToolbar: false,
            onSelect: function (value) { }
        }, options);
        var value = opts.singleSelect ? opts.selected : ($.util.likeArrayNotString(opts.selected) ? opts.selected : (opts.selected ? [opts.selected] : [])),
            tempData = value ? ($.util.likeArrayNotString(value) ? $.array.clone(value) : value) : null,
            dg = null,
            dia = $.easyui.showDialog($.extend({}, opts, {
                content: "<div class=\"grid-selector-container\"></div>",
                saveButtonText: "确定",
                saveButtonIconCls: "icon-ok",
                enableApplyButton: false,
                toolbar: "",
                onSave: function () {
                    if ($.isFunction(opts.onSelect)) { return opts.onSelect.call(dg[0], value); }
                }
            }));
        $.util.exec(function () {
            var container = dia.find(".grid-selector-container"),
                dgOpts = $.util.excludeProperties(opts, ["id", "width", "height", "left", "top", "cls", "bodyCls", "style", "content", "href"]),
                refreshSelected = function () {
                    var tOpts = dg.datagrid("options");
                    if (opts.singleSelect) {
                        var row = dg.datagrid("getSelected");
                        value = row ? row[tOpts.idField] : null;
                    } else {
                        var rows = dg.datagrid("getSelections");
                        value = $.array.map(rows, function (val) { return val[tOpts.idField]; });
                    }
                };
            dgOpts = $.extend({ striped: true, checkOnSelect: true, selectOnCheck: true, rownumbers: true }, dgOpts, {
                noheader: true, fit: true, border: false, doSize: true,
                onSelect: function (index, row) { refreshSelected(); },
                onUnselect: function (index, row) { refreshSelected(); },
                onSelectAll: function (rows) { refreshSelected(); },
                onUnselectAll: function (rows) { refreshSelected(); },
                onLoadSuccess: function (data) {
                    if (!tempData) { return; }
                    if ($.util.likeArrayNotString(tempData)) {
                        $.each(tempData, function (i, val) {
                            dg.datagrid("selectRecord", val);
                        });
                    } else {
                        dg.datagrid("selectRecord", tempData);
                    }
                }
            });
            if ($.util.likeArrayNotString(opts.toolbar) && opts.extToolbar) {
                dgOpts.toolbar = null;
                container.append("<div data-options=\"region: 'north', split: false, border: false\"><div class=\"grid-selector-toolbar\"></div></div>" +
                    "<div data-options=\"region: 'center', border: false\"><div class=\"grid-selector\"></div></div>");
                container.find("div.grid-selector-toolbar").toolbar({ data: opts.toolbar });
                dg = container.find("div.grid-selector");
                container.layout({ fit: true });
            } else {
                dg = container.addClass("grid-selector");
            }
            dg.datagrid(dgOpts);
        });
        return dia;
    };

    $.easyui.showDblGridSelector = function (options) { };

    $.easyui.showTreeSelector = function (options) { };

    $.easyui.showDblTreeSelector = function (options) { };

    $.easyui.showTreeGridSelector = function (options) { };

    $.easyui.showDblTreeGridSelector = function (options) { };





})(jQuery);