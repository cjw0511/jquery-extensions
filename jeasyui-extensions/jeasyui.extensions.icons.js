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
            width: 600, height: 480,
            title: "选择图标",
            iconCls: "icon-hamburg-zoom",
            selected: null,
            multiple: false,
            size: null,
            onSelect: function (value) { }
        }, options);
        opts.size = opts.size || "16";
        opts.title = opts.title + ", 尺寸:" + opts.size;
        var content = $("<div></div>"), value = opts.selected,
            north = $("<div></div>").attr("data-options", "region: 'north', split: false, border: false").appendTo(content),
            center = $("<div></div>").attr("data-options", "region: 'center', title: '可选的图标风格', border: false").appendTo(content),
            toolbar = $("<div></div>").appendTo(north).toolbar(),
            tabs = $("<div></div>").appendTo(center);
        var refreshView = function () {
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
        refreshView();
        $.easyui.showDialog($.extend({}, opts, {
            content: content,
            saveButtonText: "确定",
            saveButtonIconCls: "icon-ok",
            enableApplyButton: false,
            topMost: true,
            onSave: function () { if ($.isFunction(opts.onSelect)) { return opts.onSelect.call(this, value); } }
        }));
        $.util.call(function () {
            content.layout({ fit: true });
            tabs.tabs({ fit: true, border: false });
            var iconStyles = $.array.filter($.easyui.iconStyles, function (item) {
                return item.size.indexOf(opts.size) > -1;
            }).sort(function (a, b) { return a.sort - b.sort; });
            var last,
                singleSelect = function (e) {
                    if (last) { last.removeClass("selected"); }
                    last = $(this);
                    last.addClass("selected");
                    value = last.attr("title");
                    refreshView();
                },
                multipleSelect = function (e) {
                    var li = $(this), iconCls = li.attr("title");
                    if (!value) { value = []; }
                    if (!$.isArray(value)) { value = [value]; }
                    $.array[li.hasClass("selected") ? "remove" : "attach"](value, iconCls);
                    li.toggleClass("selected");
                    refreshView();
                };
            $.each(iconStyles, function () {
                var style = this.name;
                tabs.tabs("add", {
                    id: style, title: style, iconCls: "", closable: false, selected: false, refreshable: false
                });
            });
            var tabsOpts = tabs.tabs("options"), onSelect = tabsOpts.onSelect;
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
            if ($.easyui.iconStyles.length) { tabs.tabs("select", 0); }
        });
    };


    var css =
        "ul.icon-selector-ul { padding: 10px; margin: 0px; }" +
        "ul.icon-selector-ul li { list-style-type: none; float: left; cursor: pointer; margin: 3px; width: 20px; height: 20px; }" +
        "ul.icon-selector-ul li { border-width: 1px; border-color: #fff; border-style: solid; }" +
        "ul.icon-selector-ul li:hover { border-width: 1px; border-color: Red; border-style: solid; }" +
        "ul.icon-selector-ul li span { line-height: 16px; padding-left: 16px; display: inline-block; }" +
        "ul.icon-selector-ul-32 li { width: 36px; height: 36px; }" +
        "ul.icon-selector-ul-32 li span { line-height: 32px; padding-left: 32px; }" +
        "ul.icon-selector-ul li.selected { background-color: rgb(221, 221, 221); }"
    $.util.addCss(css);


})(jQuery);