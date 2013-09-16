

(function ($) {

    $.util.namespace("mainpage.nav");
    $.util.namespace("mainpage.favo");
    $.util.namespace("mainpage.mainTabs");
    $.util.namespace("donate");

    var homePageTitle = "主页", homePageHref = null, navMenuList = "#navMenu_list",
        navMenuTree = "#navMenu_Tree", mainTab = "#mainTab", navTab = "#navTab", favoMenuTree = "#favoMenu_Tree",
        mainLayout = "#mainLayout", northPanel = "#northPanel", themeSelector = "#themeSelector",
        westLayout = "#westLayout", westCenterLayout = "#westCenterLayout", westFavoLayout = "#westFavoLayout",
        westSouthPanel = "#westSouthPanel", homePanel = "#homePanel";


    //  按照指定的根节点菜单 id，加载其相应的子菜单树面板数据；该方法定义如下参数：
    //      id: 表示根节点菜单的 id；
    window.mainpage.loadMenu = function (id) {
        $(navMenuList).find("a").attr("disabled", true);
        $.easyui.loading({ locale: westCenterLayout });
        var root = $.extend({}, $.array.first(window.mainpage.navMenusData, function (val) { return val.id == id; })),
            menus = id == "10" ? window.mainpage.docMenus : (id == "11" ? window.mainpage.apiMenus : []);
        root.children = menus;
        var t = $(navMenuTree).tree("loadData", [root]);
    };

    //  将指定的根节点数据集合数据加载至左侧面板中“导航菜单”的 ul 控件中；该方法定义如下参数：
    //      menus:  为一个 Array 对象；数组中的每一个元素都是一个表示根节点菜单数据的 JSON-Object。
    window.mainpage.loadNavMenus = function () {
        var ul = $(navMenuList).empty(), menus = window.mainpage.navMenusData;
        $.each(menus, function (i, item) {
            var li = $("<li></li>").appendTo(ul);
            var pp = $("<div></div>").addClass("panel-header panel-header-noborder").appendTo(li);
            var a = $("<a></a>").attr({ href: "javascript:void(0);", target: "_self" }).hover(function () {
                a.addClass("tree-node-selected");
            }, function () {
                if (!a.hasClass("selected")) { $(this).removeClass("tree-node-selected"); }
            }).click(function () {
                if (a.is(".tree-node-selected.selected") || a.attr("disabled")) { return; }
                a.closest("ul").find("a").removeClass("tree-node-selected selected");
                a.addClass("tree-node-selected selected");
                window.mainpage.loadMenu(item.id);
            }).appendTo(pp);
            $.data(a[0], "menu-item", item);
            var span = $("<span></span>").addClass("nav-menu").appendTo(a);
            $("<span></span>").addClass("nav-menu-icon" + (item.iconCls ? " " + item.iconCls : "")).text(item.text).appendTo(span);
        });
        var layout = $(westLayout), south = layout.layout("panel", "south"), southOpts = south.panel("options");
        southOpts.minHeight = 5 + Math.min(menus.length, 3) * 27; southOpts.maxHeight = 5 + menus.length * 27;
        layout.layout("resize");
    };

    window.mainpage.instTreeStatus = function (target) {
        var t = $.util.parseJquery(target), array = t.tree("getRoots");
        $.each(array, function () {
            var cc = t.tree("getChildren", this.target);
            t.tree("expand", this.target);
            $.each(cc, function () { t.tree("collapseAll", this.target); });
        });
    };

    //  初始化 westSouthPanel 位置的“导航菜单”区域子菜单 ul 控件(仅初始化 easyui-tree 对象，不加载数据)。
    window.mainpage.instNavTree = function () {
        var t = $(navMenuTree).tree({
            animate: true,
            lines: true,
            toggleOnClick: true,
            selectOnContextMenu: true,
            smooth: false,
            showOption: true,
            onClick: function (node) {
                window.mainpage.addModuleTab(node);
            },
            onLoadSuccess: function (node, data) {
                $.util.call(function () { $(navMenuList).find("a").removeAttr("disabled"); });
                window.mainpage.instTreeStatus(this);
                $.easyui.loaded(westCenterLayout);
            },
            contextMenu: [
                { text: "打开/转到", iconCls: "icon-standard-application-add", handler: function (e, node) {
                    window.mainpage.addModuleTab(node);
                }
                }, "-",
                { text: "添加至个人收藏", iconCls: "icon-standard-feed-add", disabled: function (e, node) { return !t.tree("isLeaf", node.target); }, handler: function (e, node) { window.mainpage.nav.addFavo(node.id); } },
                { text: "重命名", iconCls: "icon-hamburg-pencil", handler: function (e, node) { t.tree("beginEdit", node.target); } }, "-",
                { text: "刷新", iconCls: "icon-cologne-refresh", handler: function (e, node) { window.mainpage.nav.refreshTree(); } }
            ],
            onAfterEdit: function (node) { window.mainpage.nav.rename(node.id, node.text); }
        });
    };

    //  初始化应用程序主界面左侧面板中“导航菜单”的数据，并加载特定的子菜单树数据。
    window.mainpage.instMainMenus = function () {
        window.mainpage.loadNavMenus();
        window.mainpage.instNavTree();
        var selectIndex = 8;
        if (window.mainpage.navMenusData.length) {
            $(navMenuList).find("a").eq(selectIndex > -1 && selectIndex < window.mainpage.navMenusData.length ? selectIndex : 0).click();
        }
    };


    //  将指定的根节点数据集合数据加载至左侧面板中“个人收藏”的 ul 控件中；该方法定义如下参数：
    //      menus:  为一个 Array 对象；数组中的每一个元素都是一个表示根节点菜单数据的 JSON-Object。
    window.mainpage.loadFavoMenus = function () {
        $.easyui.loading({ locale: westFavoLayout });
        $(favoMenuTree).tree("loadData", window.mainpage.navMenusData);
    };

    //  初始化 westSouthPanel 位置“个人收藏”的 ul 控件(仅初始化 easyui-tree 对象，不加载数据)。
    window.mainpage.instFavoTree = function () {
        var t = $(favoMenuTree).tree({
            animate: true,
            lines: true,
            dnd: true,
            toggleOnClick: true,
            showOption: true,
            onBeforeDrop: function (target, source, point) {
                var node = $(this).tree("getNode", target);
                if (point == "append" || !point) {
                    if (!node || !node.attributes || !node.attributes.folder) { return false; }
                }
            },
            selectOnContextMenu: true,
            onClick: function (node) {
                window.mainpage.addModuleTab(node);
            },
            onLoadSuccess: function (node, data) {
                window.mainpage.instTreeStatus(this);
                $.easyui.loaded(westFavoLayout);
            },
            contextMenu: [
                { text: "打开/转到", iconCls: "icon-standard-application-add", handler: function (e, node) {
                    window.mainpage.addModuleTab(node);
                }
                }, "-",
                { text: "添加目录", iconCls: "icon-standard-folder-add", handler: function (e, node) { window.mainpage.favo.addFolder(node); } }, "-",
                { text: "从个人收藏删除", iconCls: "icon-standard-feed-delete", handler: function (e, node) { window.mainpage.favo.removeFavo(node.id); } },
                { text: "重命名", iconCls: "icon-hamburg-pencil", handler: function (e, node) { t.tree("beginEdit", node.target); } }, "-",
                { text: "刷新", iconCls: "icon-cologne-refresh", handler: function (e, node) { window.mainpage.favo.refreshTree(); } }
            ],
            onAfterEdit: function (node) { window.mainpage.favo.rename(node.id, node.text); }
        });
    };

    //  初始化应用程序主界面左侧面板中“个人收藏”的数据。
    window.mainpage.instFavoMenus = function () {
        window.mainpage.instFavoTree();
        window.mainpage.loadFavoMenus();
    };


    window.mainpage.instTimerSpan = function () {
        var timerSpan = $("#timerSpan"), interval = function () { timerSpan.text($.date.toLongDateTimeString(new Date())); };
        interval();
        window.setInterval(interval, 1000);
    };

    window.mainpage.bindToolbarButtonEvent = function () {
        var searchOpts = $("#topSearchbox").searchbox("options"), searcher = searchOpts.searcher;
        searchOpts.searcher = function (value, name) {
            if ($.isFunction(searcher)) { searcher.apply(this, arguments); }
            window.mainpage.search(name, value);
        };
        $("#btnHideNorth").click(function () { window.mainpage.hideNorth(); });
        var btnShow = $("#btnShowNorth").click(function () { window.mainpage.showNorth(); });
        var l = $(mainLayout), north = l.layout("panel", "north"), panel = north.panel("panel"),
            toolbar = $("#toolbar"), topbar = $("#topbar"), top = toolbar.css("top"),
            opts = north.panel("options"), onCollapse = opts.onCollapse, onExpand = opts.onExpand;
        opts.onCollapse = function () {
            if ($.isFunction(onCollapse)) { onCollapse.apply(this, arguments); }
            btnShow.show();
            toolbar.insertBefore(panel).css("top", 0);
        };
        opts.onExpand = function () {
            if ($.isFunction(onExpand)) { onExpand.apply(this, arguments); }
            btnShow.hide();
            toolbar.insertAfter(topbar).css("top", top);
        };

        $(themeSelector).combobox({
            width: 140, editable: false, data: $.easyui.theme.dataSource, valueField: "path", textField: "name",
            value: $.easyui.theme.dataSource[0].path,
            onSelect: function (record) {
                var opts = $(this).combobox("options");
                window.mainpage.setTheme(record[opts.valueField])
            }
        });
    };

    window.mainpage.search = function (value, name) { $.easyui.messager.show($.string.format("您设置的主题为：value: {0}, name: {1}", value, name)); };

    window.mainpage.setTheme = function (theme) {
        $.easyui.theme(true, theme, function (item) {
            var win = $.easyui.messager.show($.string.format("您设置了新的系统主题皮肤为：{0}，{1}。", item.name, item.path));
            if ($.util.browser.msie) { win.removeAttr("style"); }
        });
    };

    window.mainpage.bindMainTabsButtonEvent = function () {
        $("#mainTabs_junmpHome").click(function () { window.mainpage.mainTabs.jumpHome(); });
        $("#mainTabs_closeTab").click(function () { window.mainpage.mainTabs.closeCurrentTab(); });
        $("#mainTabs_closeOther").click(function () { window.mainpage.mainTabs.closeOtherTabs(); });
        $("#mainTabs_closeLeft").click(function () { window.mainpage.mainTabs.closeLeftTabs(); });
        $("#mainTabs_closeRight").click(function () { window.mainpage.mainTabs.closeRightTabs(); });
        $("#mainTabs_closeAll").click(function () { window.mainpage.mainTabs.closeAllTabs(); });
    };

    window.mainpage.bindNavTabsButtonEvent = function () {
        $("#navMenu_refresh").click(function () { window.mainpage.refreshNavTab(); });

        $("#navMenu_Favo").click(function () { window.mainpage.nav.addFavo(); });
        $("#navMenu_Rename").click(function () { window.mainpage.nav.rename(); });
        $("#navMenu_expand").click(function () { window.mainpage.nav.expand(); });
        $("#navMenu_collapse").click(function () { window.mainpage.nav.collapse(); });
        $("#navMenu_collapseCurrentAll").click(function () { window.mainpage.nav.expandCurrentAll(); });
        $("#navMenu_expandCurrentAll").click(function () { window.mainpage.nav.collapseCurrentAll(); });
        $("#navMenu_collapseAll").click(function () { window.mainpage.nav.expandAll(); });
        $("#navMenu_expandAll").click(function () { window.mainpage.nav.collapseAll(); });

        $("#favoMenu_Favo").click(function () { window.mainpage.favo.removeFavo(); });
        $("#favoMenu_Rename").click(function () { window.mainpage.favo.rename(); });
        $("#favoMenu_expand").click(function () { window.mainpage.favo.expand(); });
        $("#favoMenu_collapse").click(function () { window.mainpage.favo.collapse(); });
        $("#favoMenu_collapseCurrentAll").click(function () { window.mainpage.favo.expandCurrentAll(); });
        $("#favoMenu_expandCurrentAll").click(function () { window.mainpage.favo.collapseCurrentAll(); });
        $("#favoMenu_collapseAll").click(function () { window.mainpage.favo.expandAll(); });
        $("#favoMenu_expandAll").click(function () { window.mainpage.favo.collapseAll(); });
    };

    window.mainpage.hideNorth = function () { $(mainLayout).layout("collapse", "north"); };

    window.mainpage.showNorth = function () { $(mainLayout).layout("expand", "north"); };

    window.mainpage.addModuleTab = function (node) {
        var n = node || {}, attrs = node.attributes || {}, opts = $.extend({}, n, { title: n.text }, attrs);
        if (!opts.href) { return; }
        window.mainpage.mainTabs.addModule(opts);
    };

    //  判断指定的选项卡是否存在于当前主页面的选项卡组中；
    //  返回值：返回的值可能是以下几种：
    //      0:  表示不存在于当前选项卡组中；
    //      1:  表示仅 title 值存在于当前选项卡组中；
    //      2:  表示 title 和 href 都存在于当前选项卡组中；
    window.mainpage.mainTabs.isExists = function (title, href) {
        var t = $(mainTab), tabs = t.tabs("tabs"), array = $.array.map(tabs, function (val) { return val.panel("options"); }),
            list = $.array.filter(array, function (val) { return val.title == title; }), ret = list.length ? 1 : 0;
        if (ret && $.array.some(list, function (val) { return val.href == href; })) { ret = 2; }
        return ret;
    };

    window.mainpage.mainTabs.tabDefaultOption = {
        title: "新建选项卡", href: "", iniframe: true, closable: true, refreshable: true, iconCls: "icon-standard-tab", repeatable: true, selected: true
    };
    window.mainpage.mainTabs.parseCreateTabArgs = function (args) {
        var ret = {};
        if (!args || !args.length) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption);
        } else if (args.length == 1) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, typeof args[0] == "object" ? args[0] : { href: args[0] });
        } else if (args.length == 2) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { titel: args[0], href: args[1] });
        } else if (args.length == 3) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2] });
        } else if (args.length == 4) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3] });
        } else if (args.length == 5) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4] });
        } else if (args.length == 6) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4], refreshable: args[5] });
        } else if (args.length >= 7) {
            $.extend(ret, window.mainpage.mainTabs.tabDefaultOption, { titel: args[0], href: args[1], iconCls: args[2], iniframe: args[3], closable: args[4], refreshable: args[5], selected: args[6] });
        }
        return ret;
    };

    window.mainpage.mainTabs.createTab = function (title, href, iconCls, iniframe, closable, refreshable, selected) {
        var t = $(mainTab), i = 0, opts = window.mainpage.mainTabs.parseCreateTabArgs(arguments);
        while (t.tabs("getTab", opts.title + (i ? String(i) : ""))) { i++; }
        t.tabs("add", opts);
    };

    //  添加一个新的模块选项卡；该方法重载方式如下：
    //      function (tabOption)
    //      function (href)
    //      function (title, href)
    //      function (title, href, iconCls)
    //      function (title, href, iconCls, iniframe)
    //      function (title, href, iconCls, iniframe, closable)
    //      function (title, href, iconCls, iniframe, closable, refreshable)
    //      function (title, href, iconCls, iniframe, closable, refreshable, selected)
    window.mainpage.mainTabs.addModule = function (title, href, iconCls, iniframe, closable, refreshable, selected) {
        var opts = window.mainpage.mainTabs.parseCreateTabArgs(arguments), isExists = window.mainpage.mainTabs.isExists(opts.title, opts.href);
        switch (isExists) {
            case 0: window.mainpage.mainTabs.createTab(opts); break;
            case 1: window.mainpage.mainTabs.createTab(opts); break;
            case 2: window.mainpage.mainTabs.jumeTab(opts.title); break;
            default: break;
        }
    };

    window.mainpage.mainTabs.jumeTab = function (which) { $(mainTab).tabs("select", which); };

    window.mainpage.mainTabs.jumpHome = function () {
        var t = $(mainTab), tabs = t.tabs("tabs"), panel = $.array.first(tabs, function (val) {
            var opts = val.panel("options");
            return opts.title == homePageTitle && opts.href == homePageHref;
        });
        if (panel && panel.length) {
            var index = t.tabs("getTabIndex", panel);
            t.tabs("select", index);
        }
    }

    window.mainpage.mainTabs.closeTab = function (which) { $(mainTab).tabs("close", which); };

    window.mainpage.mainTabs.closeCurrentTab = function () {
        var t = $(mainTab), index = t.tabs("getSelectedIndex");
        return t.tabs("closeClosable", index);
    };

    window.mainpage.mainTabs.closeOtherTabs = function (index) {
        var t = $(mainTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeOtherClosable", index);
    };

    window.mainpage.mainTabs.closeLeftTabs = function (index) {
        var t = $(mainTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeLeftClosable", index);
    };

    window.mainpage.mainTabs.closeRightTabs = function (index) {
        var t = $(mainTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        return t.tabs("closeRightClosable", index);
    };

    window.mainpage.mainTabs.closeAllTabs = function () {
        return $(mainTab).tabs("closeAllClosable");
    };


    window.mainpage.refreshNavTab = function (index) {
        var t = $(navTab);
        if (index == null || index == undefined) { index = t.tabs("getSelectedIndex"); }
        if (index == 0) { window.mainpage.nav.refreshNav(); } else { window.mainpage.favo.refreshTree(); }
    };




    window.mainpage.nav.refreshNav = function () { window.mainpage.instMainMenus(); };

    window.mainpage.nav.refreshTree = function () { $(navMenuList).find("a.tree-node-selected.selected").click(); };

    window.mainpage.nav.addFavo = function (id) {
        var t = $(navMenuTree), node = arguments.length ? t.tree("find", id) : t.tree("getSelected");
        if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
    };

    window.mainpage.nav.rename = function (id, text) {
        var t = $(navMenuTree), node;
        if (!arguments.length) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
            t.tree("beginEdit", node.target);
        } else { }
    };

    window.mainpage.nav.expand = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expand", node.target);
    };

    window.mainpage.nav.collapse = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapse", node.target);
    };

    window.mainpage.nav.expandCurrentAll = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expandAll", node.target);
    };

    window.mainpage.nav.collapseCurrentAll = function (id) {
        var t = $(navMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapseAll", node.target);
    };

    window.mainpage.nav.expandAll = function () { $(navMenuTree).tree("expandAll"); };

    window.mainpage.nav.collapseAll = function () { $(navMenuTree).tree("collapseAll"); };


    window.mainpage.favo.refreshTree = function () { window.mainpage.loadFavoMenus() };

    window.mainpage.favo.removeFavo = function (id) {
        var t = $(favoMenuTree), node = arguments.length ? t.tree("find", id) : t.tree("getSelected");
        if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
    };

    window.mainpage.favo.rename = function (id, text) {
        var t = $(favoMenuTree), node;
        if (!arguments.length) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
            t.tree("beginEdit", node.target);
        } else { }
    };

    var folderId = 20;
    window.mainpage.favo.addFolder = function (node) {
        var t = $(favoMenuTree);
        node = node || t.tree("getSelected");
        $.easyui.messager.prompt("请输入添加的目录名称：", function (name) {
            if (name == null || name == undefined) { return; }
            if (String(name).trim() == "") { return $.easyui.messager.show("请输入目录名称！"); }
            if (node) {
                t.tree("insert", { after: node.target, data: { id: folderId++, text: name, iconCls: "icon-hamburg-folder", attributes: { folder: true}} });
            } else {

            }
        });
    }

    window.mainpage.favo.expand = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expand", node.target);
    };

    window.mainpage.favo.collapse = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapse", node.target);
    };

    window.mainpage.favo.expandCurrentAll = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("expandAll", node.target);
    };

    window.mainpage.favo.collapseCurrentAll = function (id) {
        var t = $(favoMenuTree), node;
        if (id == null || id == undefined) {
            node = t.tree("getSelected");
            if (!node) { return $.easyui.messager.show("请先选择一行数据"); }
        } else {
            node = t.tree("find", id);
            if (!node) { return $.easyui.messager.show("请传入有效的参数 id(菜单标识号)"); }
        }
        t.tree("collapseAll", node.target);
    };

    window.mainpage.favo.expandAll = function () { $(favoMenuTree).tree("expandAll"); };

    window.mainpage.favo.collapseAll = function () { $(favoMenuTree).tree("collapseAll"); };






    //初始化捐赠列表数据
    window.donate.init = function () {
        var donate = $("#donateList");
        $.ajax({
            url: "https://raw.github.com/cjw0511/jquery-extensions/master/common/donate-data.js",
            method: "get",
            dataType: "script",
            success: function () {
                $.each(window.donate.data, function (i, item) {
                    var li = $("<li></li>").appendTo(donate);
                    $("<span></span>").addClass("donate-name").text(item.name).appendTo(li);
                    $("<span></span>").addClass("donate-date").text(item.date).appendTo(li);
                    $("<span></span>").text("(").appendTo(li);
                    $("<span></span>").addClass("donate-total").text(item.total).appendTo(li);
                    $("<span></span>").text("元)").appendTo(li);
                });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var li = $("<li></li>").appendTo(donate);
                $("<span></span>").text("获取捐赠列表数据失败").appendTo(li);
            }
        });
    };

})(jQuery);