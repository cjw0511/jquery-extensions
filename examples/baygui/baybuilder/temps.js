

function tiersFilter(tiers, isOuter) {
    return $.array.filter(tiers, function (val) {
        var tierNo = (val.tierNo == null || val.tierNo == undefined) ? 0 : window.parseInt(val.tierNo);
        if (tierNo == NaN) { tierNo = 0; }
        return isOuter ? (tierNo > 80) : (tierNo > 0 && tierNo <= 80);
    });
};

function calcBayPanelSize(tiers) {
    var tierArray = $.array.map(tiers, function (val) { return val.tierNo; }),
        rowsArray = $.array.reduce(tiers, function (prev, val) {
            var frag = $.array.map(val.bays, function (item) { return item.rowNo; });
            return $.array.merge(prev, frag);
        }, []),
        minX = $.array.min(rowsArray) || 0, maxX = $.array.max(rowsArray) || 0,
        minY = $.array.min(tierArray) || 0, maxY = $.array.max(tierArray) || 0;
    minX = parseInt(minX);
    maxX = parseInt(maxX);
    minY = parseInt(minY);
    maxY = parseInt(maxY);
    if ($.number.isOdd(maxX)) { maxX++; }
    var x = maxX, y = maxY > 80 ? maxY - 80 : maxY;
    return { x: (minX == "00") ? x + 1 : x, y: y / 2 };
};

function calcBaySize(outerSize, innerSize) {
    return { x: Math.max(outerSize.x, innerSize.x), y: outerSize.y + innerSize.y };
};

function loadBayTab(bays, tab, bay) {
    if (!bay || !$.isArray(bay.tiers) || !bay.tiers.length) {
        return window.alert("初始化贝位 " + bay.title + " 的网格布局图失败，其属性 tiers 不是一个数组对象或没有任何数据");
    }
    var outerTiers = tiersFilter(bay.tiers, true), innerTiers = tiersFilter(bay.tiers, false),
        outerSize = calcBayPanelSize(outerTiers), innerSize = calcBayPanelSize(innerTiers), size = calcBaySize(outerSize, innerSize),
        width = (size.x * ($.baygui.editor.defaults.cell.width + 1)) + $.baygui.editor.defaults.cell.ruleYW + 5,
        height = (size.y * $.baygui.editor.defaults.cell.height) + ($.baygui.editor.defaults.cell.ruleXH * 2) + 15,
        outerHeight = (outerSize.y * $.baygui.editor.defaults.cell.height) + $.baygui.editor.defaults.cell.ruleXH + 10,
        body = tab.panel("body"),
        layout = $("<div style=\"width: " + width + "px; height: " + height + "px;\">" +
            "<div data-options=\"region: 'north', split: true, minHeight: " + outerHeight + ", maxHeight: " + outerHeight + ", border: false\" style=\"height: " + outerHeight + "px; border-bottom-width: 1px;\"></div>" +
            "<div data-options=\"region: 'center', border: false\" style=\"border-top-width: 1px;\"></div>" +
            "</div>").appendTo(body).layout({ fit: false }),
        outerPanel = layout.layout("panel", "north").panel("body"), innerPanel = layout.layout("panel", "center").panel("body"),
        opts = tab.panel("options"), onResize = opts.onResize;
    opts.onResize = function (w, h) {
        if ($.isFunction(onResize)) { onResize.apply(this, arguments); }
        layout.css({ width: Math.max(width, w - 3), height: Math.max(height, h - 3) }).layout("resize");
    };
    tab.panel("resize");
};






var title = bay.title = "Bay" + bay.bayNo + (bay.isEdge ? "##" : "");
tabs.tabs("add", { id: bay.bayNo, title: title, closable: false, selected: index == 0 ? true : false, refreshable: false });
var panels = tabs.tabs("tabs"),
    tab = $.array.first(panels, function (val) { return val.panel("options").id == bay.bayNo; });
if (tab) { loadBayTab(bays, tab, bay); }



























