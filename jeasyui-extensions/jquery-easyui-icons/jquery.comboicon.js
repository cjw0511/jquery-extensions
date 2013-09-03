/**
* jQuery EasyUI 1.3.4
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: jeasyui@gmail.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI comboicon Plugin Extensions 1.0 beta
* jQuery EasyUI comboicon 插件扩展
* jquery.comboicon.js
* 二次开发 陈建伟
* 最近更新：2013-09-03
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

    function createDialog(target, opts) {
        var t = $.util.parseJquery(target);
        return t.combo($.extend({}, opts, {
            onShowPanel: function () {
                var panel = t.combo("panel"), copts = t.combo("options"), vals = t.combo(copts.multiple ? "getValues" : "getValue");
                panel.hide();
                $.easyui.icons.showSelector({
                    size: opts.size,
                    selected: vals,
                    multiple: opts.multiple,
                    onSelect: function (val) {
                        var isArray = $.isArray(val), text = isArray ? val.join(", ") : val;
                        t.combo(isArray ? "setValues" : "setValue", val).combo("setText", text);
                    },
                    onClose: function () {
                        t.combo("hidePanel");
                    }
                });
            }
        }));
    };

    function wrapDialog(target, opts) {
        
    };



    $.fn.comboicon = function (options, param) {
        if (typeof options == "string") {
            var method = $.fn.comboicon.methods[options];
            if (method) {
                return method(this, param);
            } else {
                return this.combo(options, param);
            }
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "comboicon");
            if (state) {
                $.extend(state.options, options);
            } else {
                var opts = $.extend({}, $.fn.comboicon.defaults, $.fn.comboicon.parseOptions(this), options);
                $.data(this, "comboicon", {
                    options: opts,
                    dialog: createDialog(this, opts)
                });
                wrapDialog(this);
            }
        });
    };

    $.fn.comboicon.parseOptions = function (target) {
        return $.extend({}, $.fn.combo.parseOptions(target));
    };

    $.fn.comboicon.methods = {
        options: function (jq) {
            var copts = jq.combo("options");
            return $.extend($.data(jq[0], 'comboicon').options, {
                originalValue: copts.originalValue,
                disabled: copts.disabled,
                readonly: copts.readonly
            });
        }
    };

    $.fn.comboicon.defaults = $.extend({}, $.fn.combo.defaults, {
        size: "16",
        iconCls: "icon-hamburg-zoom"
    });


    $.parser.plugins.push("comboicon");


})(jQuery);