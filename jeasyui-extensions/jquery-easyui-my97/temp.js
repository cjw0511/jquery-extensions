/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* My97 DatePicker 4.8 Beta3
* Copyright (c) 2010 My97 All Rights Reserved.
* http://www.my97.net/dp/license.asp
*
* jEasyUI.Plugins.My97DatePicker 1.2.1 beta
* 二次开发 陈建伟(流云)
* 最近更新：2013-05-22
* Copyright 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($) {
    var path = null, fullpath = null;
    var module = "jquery.my97.js";
    var scripts = $("script");
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        var src = script.src;
        if (src.indexOf(module) > -1) {
            path = src.substring(0, src.indexOf(module));
            break;
        }
    }
    fullpath = path + "WdatePicker.js";
    window.loadJs(fullpath, initialize);

    function initialize() {
        var _init = function (target) {
            var state = $.data(target, "my97");
            var opts = state.options;
            opts.readOnly = !opts.editable;
            var t = $(target);
            t.addClass("my97-f datebox-f");
            t.combo(opts);
            var textbox = t.combo('textbox');
            var arrow = textbox.parent().find(".combo-arrow");
            textbox.parent().addClass('datebox my97');
            if (!state._initialized) { _initContainer(); }
            _setValue(target, opts.value);
            function _initContainer() {
                var _onpicking = opts.onpicking;
                opts.onpicking = function (dp) {
                    t.combo("hidePanel");
                    var a = $.isFunction(_onpicking) ? _onpicking.apply(this, arguments) : undefined;
                    if (a == false) { return false; }
                    var date = dp.cal.getNewDateStr();
                    var b = _setValue(target, date);
                    if (b == false) { return true; }
                };
                textbox.click(function () { WdatePicker.call(this, opts); });
                arrow.click(function () { WdatePicker.call(textbox[0], opts); });
                t.combo("panel").hide();
                state._initialized = true;
            }
        };
        var _setValue = function (target, value) {
            var t = $(target);
            var opts = t.my97("options");
            var format = opts.dateFmt || "yyyy-MM-dd";
            value = String(value).isDate() ? new Date(value).format(format) : value;
            if (opts.onSelect.call(t, value) == false) { return false; }
            t.combo("setValue", value).combo("setText", value);
        };
        $.fn.my97 = function (options, param) {
            if (typeof options == "string") {
                var method = $.fn.my97.methods[options];
                if (method) {
                    return method.call(this, this, param);
                } else {
                    return this.combo(options, param);
                }
            }
            options = options || {};
            return this.each(function () {
                var state = $.data(this, "my97");
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, "my97", {
                        options: $.extend({}, $.fn.my97.defaults, $.fn.my97.parseOptions(this), options)
                    });
                }
                _init(this);
            });
        };
        $.fn.my97.parseOptions = function (target) {
            return $.extend({}, $.fn.combo.parseOptions(target));
        };
        $.fn.my97.methods = {
            options: function (jq) {
                return $.data(jq[0], "my97").options;
            },
            setValue: function (jq, value) {
                return jq.each(function () { _setValue(this, value); });
            }
        };
        $.fn.my97.defaults = $.extend({}, $.fn.combo.defaults, {
            missingMessage: $.fn.validatebox.defaults.missingMessage,
            onSelect: function (date) { }
        });
        $.parser.plugins.push("my97");



        var my97editor = {
            init: function (container, options) {
                var my97 = $("<input type=\"text\" />").appendTo(container);
                my97.my97(options);
                return my97;
            },
            destroy: function (target) { $(target).my97("destroy"); },
            getValue: function (target) { return $(target).my97("getValue"); },
            setValue: function (target, value) { $(target).my97("setValue", value); },
            resize: function (target, width) { $(target).my97("resize", width); }
        };

        if ($.fn.datagrid) { $.extend($.fn.datagrid.defaults.editors, { my97: my97editor }); }
    }
})(jQuery);