/**
* jQuery EasyUI 1.3.3
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI theme Extensions 1.0 beta
* jQuery EasyUI theme 组件扩展
* jeasyui.extensions.theme.js
* 二次开发 流云
* 最近更新：2013-08-19
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($) {

    $.util.namespace("$.easyui");

    $.easyui.theme = function () {
        if (arguments.length == 0) { return getTheme(); }
        if (arguments.length > 0) {
            if (arguments[0] === true) {
                return setTopTheme($.util.$, arguments[1], arguments[2], arguments[3]);
            } else {
                return arguments[0] === false ? setTheme($, arguments[1], arguments[2], arguments[3]) : setTheme($, arguments[0], arguments[1], arguments[2]);
            }
        }
    };

    function getTheme() {
        var link = $("link[href$='easyui.css']"), href = link.attr("href"), array = href.split("/");
        return array.length > 1 ? array[array.length - 2] : array[array.length - 1];
    };

    function setTheme(jq, theme, callback, thisArg) {
        var link = jq("link[href$='easyui.css']"), href = link.attr("href"), array = href.split("/");
        if (arguments.length > 1) { array[array.length - 2] = theme; } else { jq.array.insert(array, 0, theme); }
        link.attr("href", array.join("/"));
        callbackFunc(callback, theme, thisArg);
    };

    function setTopTheme(jq, theme, callback, thisArg) {
        setTheme(jq, theme);
        jq("iframe,iframe").each(function () {
            try {
                if (jq.util && jq.util.isWindow(this.contentWindow) && jq.util.isObject(this.contentWindow.document)
                    && jq.isFunction(this.contentWindow.$) && this.contentWindow.$.easyui && this.contentWindow.$.easyui.theme) {
                    setTopTheme(this.contentWindow.$, theme);
                }
            } catch (ex) { };
        });
        callbackFunc(callback, theme, thisArg);
    };

    function callbackFunc(callback, theme, thisArg) {
        if (!$.isFunction(callback)) { return; }
        var item = $.array.first($.easyui.theme.dataSource, function (val) { return val.path == theme; });
        if (item) { theme = item; }
        callback.call(thisArg, theme);
    };

    $.easyui.theme.dataSource = [
        { id: 1, name: "默认(天空蓝,推荐)", path: "default" },
        { id: 2, name: "金属黑(推荐)", path: "black" },
        { id: 3, name: "银色(推荐)", path: "bootstrap" },
        { id: 4, name: "灰霾(推荐)", path: "gray" },
        { id: 5, name: "清泉", path: "jqueryui-cupertino" },
        { id: 6, name: "黑色蜂巢", path: "jqueryui-dark-hive" },
        { id: 7, name: "杏黄", path: "jqueryui-pepper-grinder" },
        { id: 8, name: "阳光", path: "jqueryui-sunny" },
        { id: 9, name: "磁贴（标准）", path: "metro-standard" },
        { id: 10, name: "磁贴（蓝）", path: "metro-blue" },
        { id: 11, name: "磁贴（灰）", path: "metro-gray" },
        { id: 12, name: "磁贴（绿）", path: "metro-green" },
        { id: 13, name: "磁贴（橙）", path: "metro-orange" },
        { id: 14, name: "磁贴（红）", path: "metro-red" }
    ];




})(jQuery);





