
(function ($) {

    var hash = window.location.hash, start = new Date();

    $(function () {
        window.onbeforeunload = function () { return "您确定要退出本程序？"; };

        window.mainpage.instMainMenus();
        window.mainpage.instFavoMenus();
        window.mainpage.instTimerSpan();
        window.mainpage.bindNavTabsButtonEvent();
        window.mainpage.bindToolbarButtonEvent();
        window.mainpage.bindMainTabsButtonEvent();

        window.donate.reload();
        window.link.reload();

        var portal = $("#portal"), layout = $("#mainLayout"), navTabs = $("#navTabs"), themeCombo = $("#themeSelector");

        $.util.exec(function () {
            var theme = $.easyui.theme(), themeName = $.cookie("themeName");
            if (themeName && themeName != theme) { window.mainpage.setTheme(themeName, false); }

            layout.removeClass("hidden").layout("resize");

            $("#maskContainer").remove();

            var size = $.util.windowSize();
            //  判断当浏览器窗口宽度小于像素 1280 时，右侧 region-panel 自动收缩
            if (size.width < 1280) { layout.layout("collapse", "east"); }

            window.mainpage.mainTabs.loadHash(hash);

            var stop = new Date();
            $.easyui.messager.show({ msg: "当前页面加载耗时(毫秒)：" + $.date.diff(start, "ms", stop), position: "bottomRight" });
        });

        $("#A1").click(function () {
            portal.portal("addColumn");
        });
        $("#A2").click(function () {
            portal.portal("removeColumn", portal.portal("columns") - 1);
        });

        $("#A3").click(function () {
            $.easyui.loading();
            $.util.exec(function () { $.easyui.loaded(); }, 1000);
        });

        $("#A4").click(function () {
            //$.easyui.showDialog({
            //    href: "http://www.baidu.com", iniframe: true
            //});
            var str = "jqext/common/index-startup.js", url = $.util.resolveUrl(str);
            window.mainpage.util.getUrlResponse(url, function (text) {
                alert(text);
            });
        });

        $("#btn3").click(function () {
            var t = $("#navMenu_Tree"), node = t.tree("getNode", $("div[node-id=1107]")[0]);
            t.tree("setText", { target: node.target, text: "icon-ok" });
        });



        $.util.namespace("mainpage.util");
        window.mainpage.util.getUrlResponse = function (url, callback) {
            $.get("./tests/HttpUtility.asmx/GetUrlResponse", { url: url }, function (data) {
                var text = $(data).text();
                if ($.isFunction(callback)) { callback.call(this, text); }
            });
        };
    });
    

})(jQuery);