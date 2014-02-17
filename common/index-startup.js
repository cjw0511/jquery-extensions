
(function ($) {

    var hash = window.location.hash;

    $(function () {
        window.mainpage.instMainMenus();
        window.mainpage.instFavoMenus();
        window.mainpage.instTimerSpan();
        window.mainpage.bindNavTabButtonEvent();
        window.mainpage.bindToolbarButtonEvent();
        window.mainpage.bindMainTabButtonEvent();

        window.donate.reload();
        window.link.reload();

        var portal = $("#portal"), layout = $("#mainLayout"), navTab = $("#navTab"), themeCombo = $("#themeSelector");

        $.util.exec(function () {
            if ($.util.browser.webkit) { navTab.tabs("select", 1).tabs("select", 0); }
            layout.removeClass("hidden").layout("resize");

            var theme = $.easyui.theme(), themeName = $.cookie("themeName");
            if (themeName && themeName != theme) { window.mainpage.setTheme(themeName, false); }
            themeCombo.combobox("setValue", themeName || window.mainpage.themeData[0].path);

            if ($.util.browser.msie && ($.util.browser.version < 10)) {
                portal.portal("addColumn").portal("removeColumn", portal.portal("columns") - 1).portal("resize");
            }

            $("#maskContainer").remove();

            var size = $.util.windowSize();
            //  判断当浏览器窗口宽度小于像素 1280 时，右侧 region-panel 自动收缩
            if (size.width < 1280) { layout.layout("collapse", "east"); }

            window.mainpage.mainTab.loadHash(hash);
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