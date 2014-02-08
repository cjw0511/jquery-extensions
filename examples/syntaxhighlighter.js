(function () {
    //  判断浏览器版本，如果是IE并且版本低于9，则加载旧版本的 syntaxhighlighter 插件；否则加载最新版本的 syntaxhighlighter 插件。
    if ($.util.browser.msie && $.util.browser.version < 9) {
        $.util.loadJs("../syntaxhighlighter_3.0.83/scripts/shCore.min.js");
        document.writeln("<script src='../syntaxhighlighter_3.0.83/scripts/shCore.min.js' type='text/javascript'></script>");
    } else {
        document.writeln("<script src='../syntaxhighlighter_3.0.83/scripts/shCore.js' type='text/javascript'></script>");
    }
})();