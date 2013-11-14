/**
* jQuery EasyUI 1.3.4
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI comboicons Plugin Extensions 1.0 beta
* jQuery EasyUI comboicons 插件扩展
* jquery.comboicons.js
* 二次开发 流云
* 最近更新：2013-09-04
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、jeasyui.extensions.menu.js v1.0 beta late
*   4、jeasyui.extensions.panel.js v1.0 beta late
*   5、jeasyui.extensions.window.js v1.0 beta late
*   6、jeasyui.extensions.dialog.js v1.0 beta late
*   7、jeasyui.extensions.toolbar.js v1.0 beta late
*   8、icons/jeasyui.icons.all.js 和 icons/icon-all.css v1.0 beta late
*   9、jeasyui.extensions.icons.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function createCombo(target) {
        var t = $.util.parseJquery(target).addClass("comboicons-f"),
            state = $.data(target, "comboicons"), opts = state.options
        return t.combo($.extend({}, opts, {
            onShowPanel: function () {
                t.combo("panel").hide();
                state.dialog = $.easyui.icons.showSelector({
                    size: opts.size,
                    selected: t.combo(opts.multiple ? "getValues" : "getValue"),
                    multiple: opts.multiple,
                    onSelect: function (val) {
                        if (val) {
                            var isArray = $.isArray(val), text = isArray ? val.join(", ") : val;
                            t.combo(isArray ? "setValues" : "setValue", val).combo("setText", text);
                        } else {
                            t.combo("clear");
                        }
                    },
                    onClose: function () {
                        var state = $.data(target, "combo");
                        if (state && state.options) { t.combo("hidePanel"); }
                    }
                });
                if ($.util.isTopMost) {
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
    };

    function setValues(target, values) {
        values = $.isArray(values) ? values : [values];
        var text = values.join(", ");
        $(target).combo("setValues", values).combo("setText", text);
    };

    function setValue(target, value) {
        $(target).combo("setValue", value).combo("setText", value);
    };



    $.fn.comboicons = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.comboicons.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.combo(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "comboicons");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "comboicons", { options: $.extend({}, $.fn.comboicons.defaults, $.fn.comboicons.parseOptions(this), options) });
                createCombo(this);
            }
        });
    };

    $.fn.comboicons.parseOptions = function (target) {
        return $.extend({}, $.fn.combo.parseOptions(target));
    };

    $.fn.comboicons.methods = {
        options: function (jq) {
            var copts = jq.combo("options");
            return $.extend($.data(jq[0], 'comboicons').options, {
                originalValue: copts.originalValue,
                disabled: copts.disabled,
                readonly: copts.readonly
            });
        },

        setValues: function (jq, values) { return jq.each(function () { setValues(this, values); }); },

        setValue: function (jq, value) { return jq.each(function () { setValue(this, value); }); }
    };

    $.fn.comboicons.defaults = $.extend({}, $.fn.combo.defaults, {
        size: "16",
        iconCls: "icon-hamburg-zoom"
    });


    $.parser.plugins.push("comboicons");

    if ($.fn.form && $.isArray($.fn.form.comboList)) {
        $.fn.form.comboList.push("comboicons");
    }

})(jQuery);