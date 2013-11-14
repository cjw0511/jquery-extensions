/**
* jQuery EasyUI 1.3.4
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
*   9、jeasyui.extensions.gridselector.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function createCombo(target) {
        
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
                createCombo(this);
            }
        });
    };

    $.fn.comboselector.parseOptions = function (target) {
        return $.extend({}, $.fn.combo.parseOptions(target), $.parser.parseOptions(target, []));
    };

    $.fn.comboselector.methods = {};

    $.fn.comboselector.defaults = {};


    $.parser.plugins.push("comboselector");




})(jQuery);