/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact us: jeasyui@gmail.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI icons Extensions 1.0 beta
* jQuery EasyUI icons 组件扩展
* jeasyui.extensions.icons.js
* 二次开发 陈建伟
* 最近更新：2013-07-24
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

    $.util.namespace("$.easyui.icons");

    $.easyui.icons.showSelector = function (callback, iconCls) {
        var content = $("<div></div>"), value;
        var north = $("<div></div>").attr("data-options", "region: 'north', split: false, border: true").appendTo(content);
        var center = $("<div></div>").attr("data-options", "region: 'center', border: true").appendTo(content);

        $.easyui.showDialog({
            title: "选择图标", iconCls: "", content: content, height: 480,
            saveButtonText: "确定", saveButtonIconCls: "icon-ok", enableApplyButton: false,
            onSave: function () { if ($.isFunction(callback)) { return callback.call(this, value); } }
        });
        $.util.call(function () { content.layout({ fit: true }); });
    };




})(jQuery);