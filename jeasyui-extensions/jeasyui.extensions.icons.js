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
* 最近更新：2013-09-02
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
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    $.util.namespace("$.easyui.icons");

    $.easyui.icons.showSelector = function (options) {
        var opts = $.extend({
            width: 580, height: 480,
            title: "选择图标",
            iconCls: "icon-hamburg-zoom",
            maximizable: true,
            collapsible: true,
            selected: null,
            multiple: false,
            size: null,
            onSelect: function (value) { }
        }, options);
        opts.size = opts.size || "16";
        opts.title = opts.title + ", 尺寸:" + opts.size;
        var value = opts.selected,
            dia = $.easyui.showDialog($.extend({}, opts, {
                content: "<div class=\"icons-layout\"><div data-options=\"region: 'north', split: false, border: false\" style=\"height: 33px; overflow: hidden;\"><div class=\"icons-toolbar\"></div></div><div data-options=\"region: 'center', border: false\"><div class=\"icons-tabs\"></div></div></div>",
                saveButtonText: "确定",
                saveButtonIconCls: "icon-ok",
                enableApplyButton: false,
                topMost: true,
                onSave: function () { if ($.isFunction(opts.onSelect)) { return opts.onSelect.call(this, value); } }
            }));
        $.util.call(function () {
            var content = dia.find("div.icons-layout").layout({ fit: true }),
                toolbar = content.find("div.icons-toolbar").toolbar(),
                tabs = content.find("div.icons-tabs").tabs({ fit: true, border: false }),
                tabsOpts = tabs.tabs("options"),
                onSelect = tabsOpts.onSelect,
                iconStyles = $.array.filter($.easyui.iconStyles, function (item) {
                    return item.size.indexOf(opts.size) > -1;
                }).sort(function (a, b) { return a.sort - b.sort; }),
                last,
                singleSelect = function (e) {
                    if (last) { last.removeClass("selected"); }
                    last = $(this);
                    last.addClass("selected");
                    value = last.attr("title");
                    refreshToolbar();
                },
                multipleSelect = function (e) {
                    var li = $(this), iconCls = li.attr("title");
                    if (!value) { value = []; }
                    if (!$.isArray(value)) { value = [value]; }
                    $.array[li.hasClass("selected") ? "remove" : "attach"](value, iconCls);
                    li.toggleClass("selected");
                    refreshToolbar();
                };
            tabsOpts.onSelect = function (title, index) {
                if ($.isFunction(onSelect)) { onSelect.apply(this, arguments); }
                var tab = tabs.tabs("getTab", index);
                if (tab.find("ul.icon-selector-ul").length) { return; }
                var icons = $.array.filter($.easyui.icons[title], opts.size == "32" ?
                        function (icon) { return icon.iconCls.indexOf("32") > -1; } :
                        function (icon) { return icon.iconCls.indexOf("32") == -1; }
                    );
                var ul = $("<ul class='icon-selector-ul'></ul>").appendTo(tab);
                $.each(icons, function () {
                    var li = $("<li></li>").attr("title", this.iconCls).appendTo(ul).click(opts.multiple ? multipleSelect : singleSelect);
                    $("<span>&nbsp;</span>").addClass(this.iconCls).appendTo(li);
                });
                if (opts.size == "32") { ul.addClass("icon-selector-ul-32"); }
            };
            refreshToolbar();
            $.each(iconStyles, function () {
                var style = this.name;
                tabs.tabs("add", {
                    id: style, title: style, iconCls: "", closable: false, selected: false, refreshable: false
                });
            });
            if ($.easyui.iconStyles.length) { tabs.tabs("select", 0); }
            function refreshToolbar() {
                var wrapper = toolbar.toolbar("wrapper");
                wrapper.find("td").remove();
                if (value) {
                    if ($.isArray(value)) {
                        var title = value.join("\n"),
                                tip = $("<span>，详情</span>").css({
                                    color: "Blue"
                                }).attr("title", title);
                        toolbar.toolbar("append", ["当前共选中的图标数量为：", String(value.length), tip]);
                    } else {
                        var icon = $("<a></a>").linkbutton({ plain: true, iconCls: value })
                        toolbar.toolbar("append", ["当前选中的图标值为：", icon, value]);
                    }
                } else {
                    toolbar.toolbar("append", "当前没有选中图标");
                }
            };
        });
    };


    var css =
        "ul.icon-selector-ul { padding: 10px; margin: 0px; }" +
        "ul.icon-selector-ul li { list-style-type: none; float: left; cursor: pointer; margin: 2px; width: 20px; height: 20px; }" +
        "ul.icon-selector-ul li { border-width: 1px; border-color: #fff; border-style: solid; }" +
        "ul.icon-selector-ul li:hover { border-color: Red; }" +
        "ul.icon-selector-ul li span { line-height: 16px; padding-left: 16px; display: inline-block; }" +
        "ul.icon-selector-ul-32 li { width: 36px; height: 36px; }" +
        "ul.icon-selector-ul-32 li span { line-height: 32px; padding-left: 32px; }" +
        "ul.icon-selector-ul li.selected { border-color: Red; background-color: rgb(221, 221, 221); }"
    $.util.addCss(css);


})(jQuery);