/**
* jQuery EasyUI 1.3.5
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI comboselector Plugin Extensions 1.0 beta
* jQuery EasyUI comboselector 插件扩展
* jquery.comboselector.js
* 二次开发 流云
* 最近更新：2014-03-17
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.combo.js v1.0 beta late
*   4、jeasyui.extensions.menu.js v1.0 beta late
*   5、jeasyui.extensions.panel.js v1.0 beta late
*   6、jeasyui.extensions.window.js v1.0 beta late
*   7、jeasyui.extensions.dialog.js v1.0 beta late
*   8、jeasyui.extensions.datagrid.js v1.0 beta late
*   9、jeasyui.extensions.gridselector.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function create(target) {
        var state = $.data(target, "comboselector"), opts = state.options,
            idField = state.idField = opts.valueField || opts.idField,
            valueField = state.valueField = opts.valueField || idField,
            t = $(target).addClass("comboselector-f").combo($.extend({}, opts, {
                onShowPanel: function () {
                    t.combo("panel").hide();
                    var grid = opts.selectorTypes[opts.selector];
                    state.dialog = grid.method($.extend({}, opts, {
                        width: $.isNumeric(opts.panelWidth) ? opts.panelWidth : grid.width,
                        height: $.isNumeric(opts.panelHeight) ? opts.panelHeight : grid.height,
                        selected: t.combo(opts.multiple ? "getValues" : "getValue"),
                        singleSelect: opts.multiple ? false : true,
                        idField: idField, data: opts.url ? undefined : state.data,
                        buttons: [
                            {
                                index: 101.5, text: "清除", iconCls: "icon-standard-cancel", handler: function (d) {
                                    t.combo("clear");
                                    d.close();
                                }
                            }
                        ],
                        onEnter: function (val) {
                            if (val) {
                                var isArray = $.util.likeArrayNotString(val),
                                    values = isArray ? $.array.map(val, function (value) { return value[idField]; }) : [val[idField]];
                                setValues(target, values);
                            } else {
                                t.combo("clear");
                            }
                        },
                        onClose: function () {
                            var state = $.data(target, "combo");
                            if (state && state.options) { t.combo("hidePanel"); }
                        },
                        onLoadSuccess: function (data) {
                            state.data = data ? ($.util.likeArrayNotString(data) ? data : data.rows) : [];
                            if ($.isFunction(opts.onLoadSuccess)) {
                                opts.onLoadSuccess.apply(this, arguments);
                            }
                        },
                        onLoadError: function () {
                            $.fn.datagrid.defaults.onLoadError.apply(this, arguments);
                            if ($.isFunction(opts.onLoadError)) {
                                opts.onLoadError.apply(this, arguments);
                            }
                        },
                        onBeforeLoad: function (param) {
                            $.fn.datagrid.defaults.onBeforeLoad.apply(this, arguments);
                            if ($.isFunction(opts.onBeforeLoad)) {
                                opts.onBeforeLoad.apply(this, arguments);
                            }
                        }
                    }));
                    var dopts = state.dialog.dialog("options");
                    if (!$.util.isTopMost && !dopts.topMost || $.util.isTopMost) {
                        var textbox = t.combo("textbox"), offset = textbox.offset();
                        state.dialog.dialog("move", $.extend(offset, { top: offset.top + textbox.outerHeight() + 2 }))
                    }
                    if ($.isFunction(opts.onShowPanel)) { opts.onShowPanel.apply(this, arguments); }
                },
                onHidePanel: function () {
                    if (state.dialog) {
                        var dia = state.dialog, dopts = dia.dialog("options");
                        state.dialog = null;
                        if (!dopts.closed) { dia.dialog("close"); }
                    }
                    if ($.isFunction(opts.onHidePanel)) { opts.onHidePanel.apply(this, arguments); }
                },
                onDestroy: function () {
                    if (state.dialog) {
                        state.dialog.dialog("destroy");
                        state.dialog = null;
                    }
                    if ($.isFunction(opts.onDestroy)) { opts.onDestroy.apply(this, arguments); }
                },
                onChange: function (newValue, oldValue) {
                    if ($.isFunction(opts.onChange)) {
                        opts.onChange.apply(this, arguments);
                    }
                }
            }));

        if (opts.text) {
            setText(target, opts.text);
        } else {
            if (opts.value) {
                setValues(target, $.util.likeArrayNotString(opts.value) ? opts.value : [opts.value]);
            }
        }
    };


    function setValues(target, values) {
        var t = $(target), state = $.data(target, "comboselector"), opts = state.options,
            array = $.util.likeArrayNotString(values) ? values : [values],
            getText = function (value) {
                var row = $.array.first(state.data, function (val) { return val[state.idField] == value; });
                return row ? row[opts.textField] : null;
            },
            hasTextField = $.util.likeArrayNotString(state.data) && opts.textField,
            text = hasTextField ? $.array.map(array, function (val) { return getText(val); }).join(opts.separator) : $.array.join(array, opts.separator);
        t.combo("setValues", array).combo("setText", text || array.join(opts.separator));
    };

    function setText(target, text) {
        $(target).combo("setText", text).comboselector("options").text = text;
    };


    function loadData(target, data) {
        var t = $(target), state = $.data(target, "comboselector");
        if (state.dialog) {
            state.dialog.find(".grid-selector").datagrid("loadData", data);
        } else {
            state.data = data;
        }
    };




    var selectorTypes = {
        grid: { method: $.easyui.showGridSelector, width: 580, height: 360 },
        dblgrid: { method: $.easyui.showDblGridSelector, width: 900, height: 580 },
        tree: { method: $.easyui.showTreeSelector, width: 900, height: 580 },
        treegrid: { method: $.easyui.showTreeGridSelector, width: 580, height: 360 },
        treewithgrid: { method: $.easyui.showTreeWithGridSelector, width: 580, height: 360 }
    };




    $.fn.comboselector = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.comboselector.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.combo(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "comboselector");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "comboselector", { options: $.extend({}, $.fn.comboselector.defaults, $.fn.comboselector.parseOptions(this), options) });
                create(this);
            }
        });
    };

    $.fn.comboselector.parseOptions = function (target) {
        return $.extend({},
            $.fn.combo.parseOptions(target),
            $.fn.datagrid.parseOptions(target),
            $.parser.parseOptions(target, ["text", "selector", "iconCls", { extToolbar: "boolean" }])
            );
    };

    $.fn.comboselector.methods = {
        options: function (jq) {
            var opts = jq.combo("options"), copts = $.data(jq[0], 'comboselector').options;
            return $.extend(copts, {
                originalValue: opts.originalValue, disabled: opts.disabled, readonly: opts.readonly
            });
        },

        setValues: function (jq, values) { return jq.each(function () { setValues(this, values); }); },

        setValue: function (jq, value) { return jq.each(function () { setValues(this, [value]); }); },

        setText: function (jq, text) { return jq.each(function () { setText(this, text); }); },

        loadData: function (jq, data) { return jq.each(function () { loadData(this, data); }); },

        getData: function (jq) { return $.data(jq[0], "comboselector").data; }
    };

    $.fn.comboselector.defaults = $.extend({}, $.fn.combo.defaults, {

        //  表示弹出的表格选择框的类型；这是一个 String 类型值，可选的值有：
        //      grid    :
        //      dblgrid :
        //      tree    :
        //      treegrid:
        //      treewithgrid:
        selector: "grid",

        text: null,
        extToolbar: false,

        panelWidth: "auto",
        panelHeight: "auto",

        autoShowPanel: false,

        iconCls: "icon-standard-application-form-magnify",

        selectorTypes: selectorTypes,


        onLoadSuccess: function (data) { },

        onLoadError: function () { },

        onBeforeLoad: function (param) { }
    });


    if ($.fn.datagrid) {
        $.extend($.fn.datagrid.defaults.editors, {
            comboselector: {
                init: function (container, options) {
                    var box = $("<input type=\"text\"></input>").appendTo(container).comboselector(options);
                    box.comboselector("textbox").addClass("datagrid-editable-input");
                    return box;
                },
                destroy: function (target) {
                    $(target).comboselector("destroy");
                },
                getValue: function (target) {
                    var t = $(target), opts = t.comboselector("options");
                    return t.comboselector(opts.multiple ? "getValues" : "getValue");
                },
                setValue: function (target, value) {
                    $(target).comboselector($.util.likeArrayNotString(value) ? "setValues" : "setValue", value);
                },
                resize: function (target, width) {
                    $(target).comboselector("resize", width);
                },
                setFocus: function (target) {
                    $(target).comboselector("textbox").focus();
                }
            }
        });
    }


    $.parser.plugins.push("comboselector");

    if ($.fn.form && $.isArray($.fn.form.comboList)) {
        $.fn.form.comboList.push("comboselector");
    }

})(jQuery);