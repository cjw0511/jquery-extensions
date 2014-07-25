/**
* jQuery EasyUI BayGUI 1.0 beta
* jQuery EasyUI BayGUI 组件扩展
* jeasyui.baysgui.js
* 二次开发 流云
* 最近更新：2013-10-11
*
* 依赖项：
*   1、jQuery EasyUI 基础库 v1.3.6
*   2、jquery.jdirk.js v1.0 beta late
*   3、jeasyui.extensions.js v1.0 beta late
*   4、jeasyui.extensions.menu.js v1.0 beta late
*   5、jeasyui.extensions.panel.js v1.0 beta late
*   6、jeasyui.extensions.window.js v1.0 beta late
*   7、jeasyui.extensions.dialog.js v1.0 beta late
*   8、jeasyui.extensions.tabs.js v1.0 beta late
*   9、jeasyui.extensions.datagrid.js v1.0 beta late
*   10、jquery.toolbar.js v1.0 beta late
*
* 依赖样式：
*   1、icon-all.css
*
* Copyright (c) 2013-2014 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    $.util.namespace("$.baygui");

    $.baygui.init = function (options) {
        return new $.baygui.init.prototype.inst(options);
    };

    $.baygui.inst = function (options) {
        var bays = this, opts = $.extend({}, $.baygui.defaults, options || {});
        opts.boxesGrid = opts.boxesGrid ? $(opts.boxesGrid) : null;
        opts.baysContainer = opts.baysContainer ? $(opts.baysContainer) : null;
        opts.bayCellBoard = opts.bayCellBoard ? $(opts.bayCellBoard).addClass("bays-selected-label") : null;
        if (!opts.boxesGrid || !opts.boxesGrid.length || !opts.baysContainer || !opts.baysContainer.length) { return null; }

        //opts.columnFilter = { panelHeight: 80, position: "top" }; //如果此行取消注释，则需另将下一行代码注释掉
        opts.columnFilter = null;
        $[opts.baysMethod.toLowerCase()](opts.baysUrl, opts.baysQueryParams, function (baysData) {
            var baysFormatter = $.isFunction(bays.baysDataFilter) ? bays.baysDataFilter : $.baygui.defaults.baysDataFilter;
            baysData = baysFormatter.call(bays, baysData);
            bays.loadBays(baysData);
            var columns = opts.boxesColumns;
            if (!$.isArray(columns)) { columns = [[]]; }
            if (bays.bayRowDnd) {
                columns[0].push({
                    field: "boxDrag", title: "拖动", width: 55, align: "center", formatter: function (val, row, index) {
                        return "<span class=\"bay-row-draggable icon-hamburg-exchange\">拖动</span>";
                    }
                });
            }
            var gridOpts = $.extend({ url: opts.boxesUrl, method: opts.boxesMethod, queryParams: opts.boxesQueryParams, columns: columns }, $.fn.datagrid.parseOptions(opts.boxesGrid[0]), {
                idField: "id",
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: false,
                checkOnSelect: false,
                pagination: false,
                refreshMenu: false,
                enableHeaderContextMenu: true,
                enableHeaderClickMenu: false,
                selectOnRowContextMenu: true,
                columnFilter: opts.columnFilter,
                rowContextMenu: [
                    {
                        text: "设置贝位", iconCls: "icon-hamburg-exchange",
                        disabled: function (e, index, row) { return row.bayCellNo ? true : false; },
                        handler: function (e, index, row) {
                            var bayCell = bays.getCell();
                            if (!bayCell) { return $.messager.show("请先选中一个贝位图单元格！"); }
                            bays.setCell(bayCell.bayCellNo, row, false, true);
                        }
                    },
                    {
                        text: "卸载此箱", iconCls: "icon-standard-cancel",
                        disabled: function (e, index, row) { return row.bayCellNo ? false : true; },
                        handler: function (e, index, row) {
                            return bays.clearBoxCell(row);
                        }
                    }, "-",
                    {
                        text: "定位此贝位单元格",
                        disabled: function (e, index, row) { return row && row.bayCellNo && $.string.isString(row.bayCellNo) && row.bayCellNo.length == 6 ? false : true; },
                        handler: function (e, index, row) {
                            bays.jumpCell(row.bayCellNo);
                        }
                    }, "-",
                    {
                        text: "总数量合计", iconCls: "", handler: function () {
                            var rows = bays.boxesGrid.datagrid("getRows"), sum = rows && $.isArray(rows) ? rows.length : 0;
                            $.messager.show("总箱数为：" + $.number.round(sum, 2));
                        }
                    },
                    {
                        text: "已装载总数合计", iconCls: "", handler: function () {
                            var rows = bays.boxesGrid.datagrid("getRows"),
                                sum = $.array.sum(rows, function (val) {
                                    return val && val.bayCellNo && $.string.isString(val.bayCellNo) && val.bayCellNo.length == 6 ? 1 : 0;
                                });
                            $.messager.show("已装载的总箱数为：" + $.number.round(sum, 2));
                        }
                    },
                    {
                        text: "未装载总数合计", iconCls: "", handler: function () {
                            var rows = bays.boxesGrid.datagrid("getRows"),
                                sum = $.array.sum(rows, function (val) {
                                    return val && (!val.bayCellNo || !$.string.isString(val.bayCellNo) || val.bayCellNo.length != 6) ? 1 : 0;
                                });
                            $.messager.show("未装载的总箱数为：" + $.number.round(sum, 2));
                        }
                    }, "-",
                    {
                        text: "总重量合计", iconCls: "icon-standard-sum", handler: function () {
                            var rows = bays.boxesGrid.datagrid("getRows"), sum = $.array.sum(rows, function (val) {
                                var weight = (val.boxWeight == null || val.boxWeight == undefined) ? 0 : window.parseFloat(val.boxWeight);
                                if (weight == NaN) { weight = 0; }
                                return val.boxWeight;
                            });
                            $.messager.show("总箱重为：" + $.number.round(sum, 2));
                        }
                    },
                    {
                        text: "已装载总重合计", iconCls: "", handler: function () {
                            var rows = bays.boxesGrid.datagrid("getRows"), sum = $.array.sum(rows, function (val) {
                                return val && val.bayCellNo && $.string.isString(val.bayCellNo) && val.bayCellNo.length == 6 && val.boxWeight ? val.boxWeight : 0;
                            });
                            $.messager.show("已装载总箱重为：" + $.number.round(sum, 2));
                        }
                    },
                    {
                        text: "未装载总重合计", iconCls: "", handler: function () {
                            var rows = bays.boxesGrid.datagrid("getRows"), sum = $.array.sum(rows, function (val) {
                                return val && (!val.bayCellNo || !$.string.isString(val.bayCellNo) || val.bayCellNo.length != 6) && val.boxWeight ? val.boxWeight : 0;
                            });
                            $.messager.show("未装载总箱重为：" + $.number.round(sum, 2));
                        }
                    }
                ],
                loadFilter: function (data) {
                    var formatter = $.isFunction(bays.gridDataFilter) ? bays.gridDataFilter : $.baygui.defaults.gridDataFilter,
                        data = formatter.call(bays, data);
                    return $.fn.datagrid.defaults.loadFilter.call(this, data);
                },
                onLoadSuccess: function (data) {
                    $.fn.datagrid.extensions.defaults.onLoadSuccess.apply(this, arguments);
                    data = data ? ($.isArray(data) ? data : data.rows) : [];
                    bays.instBoxesState(data);
                    if ($.isFunction(bays.onLoadBoxes)) { bays.onLoadBoxes.call(bays, data); }
                }
            });
            opts.boxesGrid.datagrid(gridOpts);
        }, "json");
        return $.extend(this, opts);
    };




    function filterBayData(tiers, isNorth) {
        return $.array.filter(tiers, function (val) {
            var tierNo = (val.tierNo == null || val.tierNo == undefined) ? 0 : window.parseInt(val.tierNo);
            if (tierNo == NaN) { tierNo = 0; }
            return isNorth ? (tierNo > 80) : (tierNo > 0 && tierNo <= 80);
        });
    };

    function getBayPanelSize(tiers) {
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

    function getBaySize(northSize, centerSize) {
        return { x: Math.max(northSize.x, centerSize.x), y: northSize.y + centerSize.y };
    };

    function loadBayGrid(bays, p, bay) {
        if (!bay || !$.isArray(bay.tiers) || !bay.tiers.length) { return window.alert("初始化贝位 " + bay.title + " 的网格布局图失败，其属性 tiers 不是一个数组对象或没有任何数据"); }
        var northTiers = filterBayData(bay.tiers, true), centerTiers = filterBayData(bay.tiers, false),
            northSize = getBayPanelSize(northTiers), centerSize = getBayPanelSize(centerTiers), size = getBaySize(northSize, centerSize),
            width = (size.x * ($.baygui.defaults.cell.width + 1)) + $.baygui.defaults.cell.ruleYW + 5,
            height = (size.y * $.baygui.defaults.cell.height) + ($.baygui.defaults.cell.ruleXH * 2) + 15,
            northHeight = (northSize.y * $.baygui.defaults.cell.height) + $.baygui.defaults.cell.ruleXH + 10,
            body = p.panel("body"),
            layout = $("<div style=\"width: " + width + "px; height: " + height + "px;\">" +
                "<div data-options=\"region: 'north', split: true, minHeight: " + northHeight + ", maxHeight: " + northHeight + ", border: false\" style=\"height: " + northHeight + "px; border-bottom-width: 1px;\"></div>" +
                "<div data-options=\"region: 'center', border: false\" style=\"border-top-width: 1px;\"></div>" +
                "</div>").appendTo(body).layout({ fit: false }),
            north = layout.layout("panel", "north").panel("body"), center = layout.layout("panel", "center").panel("body"),
            opts = p.panel("options"), onResize = opts.onResize;
        opts.onResize = function (w, h) {
            if ($.isFunction(onResize)) { onResize.apply(this, arguments); }
            layout.css({ width: Math.max(width, w - 3), height: Math.max(height, h - 3) }).layout("resize");
        };
        p.panel("resize");
        loadBaysGridCell(north, bay, northSize, centerSize, true);
        loadBaysGridCell(center, bay, centerSize, northSize, false);
        loadBaysGridEvent(bays, north, bay, northTiers);
        loadBaysGridEvent(bays, center, bay, centerTiers);
    };

    function loadBaysGridCell(body, bay, size, otherSize, isNorth) {
        var container = $("<div class=\"bays-container\"></div>").appendTo(body),
            grid = $("<table class=\"bays-wrapper\" cellpadding=\"0\" cellspacing=\"0\"></table>").attr("bayNo", bay.bayNo).appendTo(container),
        //  isOdd 表示当前局部贝位区域的x尺寸是不是奇数，如果是奇数则存在 "00" 行位；
            isOdd = $.number.isOdd(size.x);
        //  下面这个循环添加贝位单元格
        for (var i = 1; i <= size.y; i++) {
            var tierNo = $.string.padLeft(i * 2 + (isNorth ? 80 : 0), 2, "0"),
                tr = $("<tr class=\"bay-row\"></tr>").attr("tierNo", tierNo).prependTo(grid);
            for (var j = 0; j < size.x; j++) {
                var rowNo = isOdd ? j : j + 1,
                    method = $.number.isOdd(rowNo) ? "appendTo" : "prependTo";
                rowNo = $.string.padLeft(rowNo, 2, "0");
                $("<td class=\"bay-cell\"><div class=\"bay-cell-item\"><span>&nbsp;</span></div></td>").attr("rowNo", rowNo)[method](tr);
            }
            $("<td class=\"bay-cell bay-cell-ruley\">&nbsp;</td>").text(tierNo).prependTo(tr);
        }

        //  下面这个循环添加贝位标尺
        var ruleX = $("<tr class=\"bay-row bay-cell-rulex\"></tr>").prependTo(grid);
        for (var i = 0; i < size.x; i++) {
            var rowNo = isOdd ? i : i + 1, text = $.string.padLeft(rowNo, 2, "0"),
                method = $.number.isOdd(rowNo) ? "appendTo" : "prependTo";
            $("<td class=\"bay-cell\"></td>").text(text)[method](ruleX);
        }
        $("<td class=\"bay-cell bay-cell-ruley\">&nbsp;</td>").prependTo(ruleX);

        //  下面这段代码设置当贝位区域上下两个局部如果尺寸x不相等，则在尺寸x短的那个贝位局部区域左右两侧填充占位单元格
        var xDiff = otherSize.x - size.x;
        if (xDiff > 0) {
            for (var i = xDiff; i > 0; i -= 2) {
                grid.find("tr.bay-row").each(function () {
                    var tr = this, jqTr = $(this), ruley = jqTr.find("td.bay-cell-ruley"),
                        indentA = $("<td class=\"bay-cell-indent\"></td>").insertAfter(ruley),
                        indentB = $("<td class=\"bay-cell-indent\"></td>").appendTo(tr);
                    if (i < 2) {
                        indentA.addClass("bay-cell-indent-half");
                        indentB.addClass("bay-cell-indent-half");
                    }
                });
            }
        }
    };

    function loadBaysGridEvent(bays, body, bay, tiers, isNorth) {
        tiers = tiers || filterBayData(bay.tiers, isNorth);
        var grid = body.find("table.bays-wrapper"), bayNo = bay.bayNo;
        //  下面这个循环遍历设置贝位图表格中的某些被禁用的单元格显示禁用状态
        $.each(tiers, function (index, item) {
            var tierNo = item.tierNo, bays = $.isArray(item.bays) ? item.bays : [];
            if (!tierNo) { return; }
            $.each(bays, function (i, cell) {
                if (cell.rowNo && cell.disabled) {
                    grid.find("tr[tierNo=" + tierNo + "] td[rowNo=" + cell.rowNo + "]").attr("disabled", true).addClass("bay-cell-disabled");
                }
            });
        });

        //  下面这个循环遍历设置贝位图表格所有单元格的响应事件
        grid.find("tr[tierNo] td[rowNo]:not([disabled])").on({
            //  点击单元格事件
            click: function () {
                var cell = this, td = $(this), tr = td.parent(),
                    rowNo = td.attr("rowNo"), tierNo = tr.attr("tierNo"), bayCellNo = bayNo + rowNo + tierNo;
                if (td.hasClass("bay-cell-selected")) {
                    bays.unSelectCell();
                } else {
                    bays.selectCell(bayCellNo);
                }
            },
            //  鼠标移动事件
            mouseover: function () {
                bayCellTooltip = bays.bayCellTooltip ? true : false;
                if (!bayCellTooltip) { return; }
                var cell = $(this), cellData = getCellData(bays, cell);
                cell.tooltip({
                    trackMouse: true,
                    onHide: function () { $.util.exec(function () { cell.tooltip("destroy"); }); },
                    onShow: function () {
                        var formatter = $.isFunction(bays.tooltipFormatter) ? bays.tooltipFormatter : $.baygui.defaults.tooltipFormatter,
                            content = formatter.call(bays, cellData.bayCellNo, cellData.box, cellData.bayCell);
                        cell.tooltip("update", content);
                    }
                }).tooltip("show");
            },
            //  右键菜单
            contextmenu: function (e) {
                bayCellContextMenu = bays.bayCellContextMenu ? true : false;
                var cell = $(this), cellData = getCellData(bays, cell);
                bays.selectCell(cellData.bayCellNo);
                if (!bayCellContextMenu) { return; }
                e.preventDefault();
                var box = bays.boxesGrid.datagrid("getSelected");
                var items = [
                    {
                        text: function () {
                            return box ? "将箱 " + box.boxNo + " 装载此处" : "设置贝位";
                        },
                        iconCls: "icon-hamburg-exchange",
                        disabled: function () {
                            return box ? false : true;
                        },
                        handler: function () {
                            if (!box) { return; }
                            bays.setCell(cellData.bayCellNo, box.boxNo);
                        }
                    }, "-",
                    { text: "重置该贝位单元格", iconCls: "icon-hamburg-showreel", handler: function () { bays.resetCell(cellData.bayCellNo); } },
                    { text: "清除该贝位单元格", iconCls: "icon-standard-cancel", handler: function () { bays.clearCell(cellData.bayCellNo); } }, "-",
                    { text: "重置当前贝位", iconCls: "icon-hamburg-settings", handler: function () { bays.resetBay(); } },
                    { text: "清除当前贝位", iconCls: "icon-standard-cross", handler: function () { bays.clearBay(); } }, "-",
                    {
                        text: "所选列位(纵向)装载总重", iconCls: "", handler: function () {
                            var cells = bays.baysContainer.find("table.bays-wrapper[bayNo=" + cellData.bayNo + "] td[rowNo=" + cellData.rowNo + "]").map(function () {
                                return getCellData(bays, $(this));
                            }),
                            has40 = $.array.some(cells, function (val) { return val.bayCell.hasClass("bay-cell-bigbox-next"); }),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.box.boxWeight && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? val.box.boxWeight : 0;
                                });
                            $.messager.show("所选列位(纵向)装载总箱重为：" + $.number.round(sum, 2) + (has40 ? "<br/><span style=\"font-weight: bold; color: green\">不包含在上一贝位配载的40'箱重</span>" : ""));
                        }
                    },
                    {
                        text: "所选层位(横向)装载总重", iconCls: "", handler: function () {
                            var cells = bays.baysContainer.find("table.bays-wrapper[bayNo=" + cellData.bayNo + "] tr[tierNo=" + cellData.tierNo + "] td[rowNo]").map(function () {
                                return getCellData(bays, $(this));
                            }),
                            has40 = $.array.some(cells, function (val) { return val.bayCell.hasClass("bay-cell-bigbox-next"); }),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.box.boxWeight && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? val.box.boxWeight : 0;
                                });
                            $.messager.show("所选层位(横向)装载总箱重为：" + $.number.round(sum, 2) + (has40 ? "<br/><span style=\"font-weight: bold; color: green\">不包含在上一贝位配载的40'箱重</span>" : ""));
                        }
                    }, "-",
                    {
                        text: function () { return "所有贝位的" + cellData.rowNo + "行位(纵向)装载总重"; }, iconCls: "",
                        handler: function () {
                            var cells = bays.baysContainer.find("table.bays-wrapper[bayNo] td[rowNo=" + cellData.rowNo + "]").map(function () {
                                return getCellData(bays, $(this));
                            }),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.box.boxWeight && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? val.box.boxWeight : 0;
                                });
                            $.messager.show("所有贝位的" + cellData.rowNo + "行位(纵向)装载总箱重为：" + $.number.round(sum, 2));
                        }
                    },
                    {
                        text: function () { return "所有贝位的" + cellData.tierNo + "层位(横向)装载总重"; }, iconCls: "",
                        handler: function () {
                            var cells = bays.baysContainer.find("table.bays-wrapper[bayNo] tr[tierNo=" + cellData.tierNo + "] td[rowNo]").map(function () {
                                return getCellData(bays, $(this));
                            }),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.box.boxWeight && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? val.box.boxWeight : 0;
                                });
                            $.messager.show("所有贝位的" + cellData.tierNo + "层位(横向)装载总箱重为：" + $.number.round(sum, 2));
                        }
                    }, "-",
                    {
                        text: "当前贝位装载总重", iconCls: "", handler: function () {
                            var cells = bays.getBay(),
                                has40 = $.array.some(cells, function (val) { return val.bayCell.hasClass("bay-cell-bigbox-next"); }),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.box.boxWeight && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? val.box.boxWeight : 0;
                                });
                            $.messager.show("当前贝位装载总箱重为：" + $.number.round(sum, 2) + (has40 ? "<br/><span style=\"font-weight: bold; color: green\">不包含在上一贝位配载的40'箱重</span>" : ""));
                        }
                    },
                    {
                        text: "所有贝位装载总重", iconCls: "icon-standard-sum", handler: function () {
                            var cells = bays.getAll(),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.box.boxWeight && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? val.box.boxWeight : 0;
                                });
                            $.messager.show("当前船只装载总箱重为：" + $.number.round(sum, 2));
                        }
                    }, "-",
                    {
                        text: "所有贝位装载总数", iconCls: "", handler: function () {
                            var cells = bays.getAll(),
                                sum = $.array.sum(cells, function (val) {
                                    return (val && val.box && val.bayCell && !val.bayCell.hasClass("bay-cell-bigbox-next")) ? 1 : 0;
                                });
                            $.messager.show("当前船只装载总箱数为：" + $.number.round(sum, 2));
                        }
                    },
                ];
                $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY });
            }
        }).droppable({
            accept: "span.bay-row-draggable",
            onDrop: function (e, source) {
                var tr = $(source).closest("tr.datagrid-row"), index = parseInt(tr.attr("datagrid-row-index")),
                    row = bays.boxesGrid.datagrid("getRows")[index],
                    cell = getCellData(bays, $(this));
                bays.setCell(cell.bayCellNo, row, false, true);
            }
        });
    };



    function genericGridDataFilter(data) { return data; };

    function genericBaysDataFilter(data) {
        var array = $.isArray(data) ? data : [];
        $.each(array, function (index, item) {
            item.tiers = $.isArray(item.tiers) ? item.tiers : [];
            $.each(item.tiers, function (i, val) {
                val.rows = $.isArray(val.rows) ? val.rows : [];
                val.bays = val.rows;
            });
        });
        return array;
    };

    function genericSaveDataFilter(data) { return data; };


    function genericBoardFormatter(bays, bayCellNo, box) {
        var text = bayCellNo;
        if (box) {
            text = $("<span>" + box.bayCellNo + "&nbsp;箱号：" + box.boxNo +
                "&nbsp;箱型：" + box.boxSpec + box.boxType + box.boxState +
                "&nbsp;箱重：" + box.boxWeight +
                "&nbsp;港口：" + box.fromPort + "-" + box.toPort +
                "</span>");
        } else {
            text = bayCellNo + "，未配载箱";
        }
        return text;
    };

    function genericCellFormatter(bays, bayCellNo, box, bayCell) {
        return $("<span>" + box.fromPort + "-" + box.toPort + "</span><br/>" +
            "<span style=\"color: blue;\">" + box.boxNo + "</span><br/>" +
            "<span style=\"color: green;\">" + (box.boxSpec + box.boxType + "&nbsp;" + box.boxState) + "</span>/<span style=\"color: red;\">" + box.boxWeight + "</span><br/>" +
            "<span>" + box.bayCellNo + "</span>");
    };

    function genericTooltipFormatter(bays, bayCellNo, box, bayCell) {
        return box ? $("<div style=\"width: 160px; height: 80px; line-height: 20px; font-size: 13px;\"><span>" +
            box.fromPort + "-" + box.toPort + "</span><br/><span style=\"color: blue;\">" +
            box.boxNo + "</span><br/><span style=\"color: green;\">" +
            (box.boxSpec + box.boxType + "&nbsp;" + box.boxState) + "</span>/<span style=\"color: red;\">" +
            box.boxWeight + "</span><br/><span style=\"float: right;\">" +
            box.bayCellNo +
            "</span></div>") : bayCellNo + "，未配载箱";
    };






    function loadBoxes(bays, data) {
        if (!$.isArray(data)) { return window.alert("加载 BayGUI 左侧列表数据失败，传入的参数 data 不是一个数组对象"); }
        bay.boxesGrid.datagrid("loadData", data);
    };

    function loadBays(bays, data) {
        if (!$.isArray(data)) { return window.alert("初始化 BayGUI 组件失败，传入的参数 data 不是一个数组对象"); }
        if ($.isFunction(bays.onBeforeLoadBays) && bays.onBeforeLoadBays.call(bays, data) == false) { return; }
        bays.baysData = data;
        var tabs = bays.baysContainer.empty().data("tabs", null).tabs({});
        $.each(data, function (index, bay) {
            var title = bay.title = "Bay" + bay.bayNo + (bay.isEdge ? "##" : "");
            tabs.tabs("add", { id: bay.bayNo, title: title, closable: false, selected: index == 0, refreshable: false });
            var panels = tabs.tabs("tabs"),
                tab = $.array.first(panels, function (val) { return val.panel("options").id == bay.bayNo; });
            if (tab) { loadBayGrid(bays, tab, bay); }
        });
        if ($.isFunction(bays.onLoadBays)) { bays.onLoadBays.call(bays, data); }
    };

    function instBoxesState(bays, data) {
        var boxes = $.array.filter(data, function (val) {
            return val.bayCellNo && $.string.isString(val.bayCellNo) && val.bayCellNo.length == 6;
        });
        if (boxes.length) {
            if (boxes.length > 10) {
                $.easyui.loading({ msg: "正在渲染贝位图表格组件效果，请耐心等耐..." });
                $.util.exec(function () {
                    loadData();
                    $.easyui.loaded();
                }, 100);
            } else {
                loadData();
            }
        }
        function loadData() {
            $.array.sort(boxes, function (a, b) {
                var bayNoA = $.string.left(a.bayCellNo, 2), rowNoA = a.bayCellNo.substr(2, 2), tierNoA = $.string.right(a.bayCellNo, 2),
                    bayNoB = $.string.left(b.bayCellNo, 2), rowNoB = b.bayCellNo.substr(2, 2), tierNoB = $.string.right(b.bayCellNo, 2);
                bayNoA = parseInt(bayNoA); rowNoA = parseInt(rowNoA); tierNoA = parseInt(tierNoA);
                bayNoB = parseInt(bayNoB); rowNoB = parseInt(rowNoB); tierNoB = parseInt(tierNoB);
                if (bayNoA == bayNoB) {
                    if (rowNoA == rowNoB) { return tierNoA - tierNoB; } else { return rowNoA - rowNoB; }
                } else {
                    return bayNoA - bayNoB;
                }
            });
            var floating = bays.floating, crushCasc = bays.crushCasc;
            bays.floating = true;
            bays.crushCasc = true;
            $.each(boxes, function (i, box) {
                setCellInner(bays, box.bayCellNo, box, false, false, true);
            });
            bays.floating = floating;
            bays.crushCasc = crushCasc;
        };
        var bayRowDnd = bays.bayRowDnd ? true : false;
        if (bayRowDnd) {
            var tr = bays.boxesGrid.datagrid("getPanel").find("div.datagrid-view div.datagrid-body table.datagrid-btable tr.datagrid-row");
            bindBayRowDraggable(tr);
        }
    };

    function bindBayRowDraggable(tr) {
        if (!tr || !tr.length) { return; }
        tr.find("span.bay-row-draggable").draggable({
            disabled: false, revert: true, cursor: "pointer", deltaX: 5, deltaY: 5,
            proxy: function (source) {
                var tr = $(source).closest("tr.datagrid-row").clone(), table = $("<table></table>").append(tr);
                return $("<div class=\"bay-row-draggable-wrapper\"></div>").append(table).appendTo("body").hide();
            },
            onBeforeDrag: function (e) {
                return e.which == 1;
            },
            onDrag: function (e) {
                var x = e.pageX - e.data.startX, y = e.pageY - e.data.startY;
                if ((Math.abs(x) + Math.abs(y)) > 10) {
                    $(this).draggable("proxy").show();
                }
            }
        }).off("click.baydnd").on("click.baydnd", function () { return false; });
    };



    function save(bays, callback) {
        bays.saveAs(bays.saveUrl, callback);
    };

    function saveAs(bays, url, callback) {
        if (!url) { return $.messager.show("用于数据保存的远程服务器地址未设定，数据保存失败！"); }
        var rows = bays.boxesGrid.datagrid("getRows"), data = $.array.map(rows, function (box) {
            return { id: box.id, bayCellNo: box.bayCellNo };
        });
        if ($.isFunction(bays.onBeforeSave) && bays.onBeforeSave.call(bays, data, url) == false) { return; }
        var dataFilter = $.isFunction(bays.saveDataFilter) ? bays.saveDataFilter : $.baygui.defaults.saveDataFilter;
        data = dataFilter.call(bays, data);
        var opts = $.extend({
            url: url, type: bays.saveMethod, data: data,
            success: function (ret, textStatus, jqXHR) {
                if ($.isFunction(callback)) { callback.apply(this, arguments); }
                if ($.isFunction(bays.onSave)) { bays.onSave.call(bays, data, url); }
            },
            error: function (response, state, error) {
                if ($.isFunction(bays.onSaveError)) { bays.onSaveError.apply(this, arguments); }
            }
        }, bays.saveAjaxOptions);
        $.ajax(opts);
    };



    function getBayPrevCellDom(bays, bayCellNo) {
        if (!bayCellNo || !$.string.isString(bayCellNo) || bayCellNo.length != 6) { return null; }
        var bayNo = $.string.left(bayCellNo, 2), rowNo = bayCellNo.substr(2, 2), tierNo = $.string.right(bayCellNo, 2);
        bayNo = parseInt(bayNo); if (bayNo == NaN) { return null; }
        if (!$.number.isOdd(bayNo)) { bayNo += 1; }
        if (bayNo == 1) { return null; }
        var bayNoStr = $.string.padLeft(bayNo - 2, 2, "0"),
            bay = $.array.first(bays.baysData, function (val) { return val.bayNo == bayNoStr; });
        if (!bay || bay.isEdge) { return null; }
        return bays.getCellDom(bayNoStr + rowNo + tierNo);
    };

    function getBayNextCellDom(bays, bayCellNo) {
        if (!bayCellNo || !$.string.isString(bayCellNo) || bayCellNo.length != 6) { return null; }
        var bayNo = $.string.left(bayCellNo, 2), rowNo = bayCellNo.substr(2, 2), tierNo = $.string.right(bayCellNo, 2);
        bayNo = parseInt(bayNo); if (bayNo == NaN) { return null; }
        if (!$.number.isOdd(bayNo)) { bayNo -= 1; }
        var bayNoStr = $.string.padLeft(bayNo, 2, "0"),
            bay = $.array.first(bays.baysData, function (val) { return val.bayNo == bayNoStr; });
        if (!bay || bay.isEdge) { return null; }
        bayNo = $.string.padLeft(bayNo + 2, 2, "0");
        return bays.getCellDom(bayNo + rowNo + tierNo);
    };

    function getBayBottomCellDom(bays, bayCellNo) {
        if (!bayCellNo || !$.string.isString(bayCellNo) || bayCellNo.length != 6) { return null; }
        var bayNo = $.string.left(bayCellNo, 2), rowNo = bayCellNo.substr(2, 2), tierNo = $.string.right(bayCellNo, 2);
        tierNo = parseInt(tierNo); if (tierNo == NaN) { return null; }
        tierNo = $.string.padLeft(tierNo - 2, 2, "0");
        return bays.getCellDom(bayNo + rowNo + tierNo);
    }

    function clearCell(bays, bayCellNo) {
        var cell = bays.getCell(bayCellNo);
        if (!cell) { return; }
        $.data(cell.bayCell[0], "box-data", null)
        cell.bayCell.find(">div.bay-cell-item").empty().append("<span>&nbsp;</span>");
        var box = cell.box;
        if (box) {
            if (box.bayCellNo) {
                var rows = bays.boxesGrid.datagrid("getRows"),
                    array = $.array.filter(rows, function (val) { return val.bayCellNo == box.bayCellNo; });
                $.each(array, function (i, row) {
                    var index = bays.boxesGrid.datagrid("getRowIndex", row);
                    row.bayCellNo = null;
                    bays.boxesGrid.datagrid("updateRow", { index: index, row: row }).datagrid("unselectRow", index);
                    if (bays.bayRowDnd) {
                        var tr = bays.boxesGrid.datagrid("getRowDom", index);
                        bindBayRowDraggable(tr);
                    }
                });
            }
            if (box.boxSpec == "40") {
                var otherCell = cell.bayCell.hasClass("bay-cell-bigbox-next") ? getBayPrevCellDom(bays, cell.bayCellNo) : getBayNextCellDom(bays, cell.bayCellNo);
                if (otherCell && otherCell) {
                    $.data(otherCell[0], "box-data", null)
                    otherCell.removeClass("bay-cell-valued bay-cell-bigbox bay-cell-bigbox-next").find(">div.bay-cell-item").empty().append("<span>&nbsp;</span>");
                }
            }
        }
        cell.bayCell.removeClass("bay-cell-valued bay-cell-bigbox bay-cell-bigbox-next");
        if (cell.bayCell.hasClass("bay-cell-selected")) { bays.selectCell(cell.bayCellNo); }
    };

    function clearBay(bays, bayNo) {
        $.each(bays.getBay(bayNo), function (i, item) { bays.clearCell(item.bayCellNo); });
    };

    function clearAll(bays) {
        $.each(bays.getAll(), function (i, item) { bays.clearCell(item.bayCellNo); });
    };

    function clearBoxCell(bays, box) {
        var boxData = $.string.isString(box) ? $.array.first(bays.boxesGrid.datagrid("getRows"), function (val) { return val.boxNo == box; }) : box;
        if (!boxData) { return; }
        bays.clearCell(boxData.bayCellNo);
    };

    function resetCell(bays, bayCellNo) {
        var cell = bays.getCell(bayCellNo), floating = bays.floating, crushCasc = bays.crushCasc;
        if (!cell) { return; }
        bays.floating = true;
        bays.crushCasc = true;
        var prevCellDom = getBayPrevCellDom(bays, cell.bayCellNo);
        if (prevCellDom && prevCellDom.length) {
            var prevCell = getCellData(bays, prevCellDom);
            if (prevCell) {
                var box = $.data(prevCell.bayCell[0], "box-data-inst");
                if (box && box.boxSpec == "40") {
                    var currentBox = $.data(prevCell.bayCell[0], "box-data");
                    if (!currentBox || currentBox.boxNo != box.boxNo) {
                        resetCell(bays, prevCell.bayCellNo);
                    }
                } else {
                    reset();
                }
            } else {
                reset();
            }
        } else {
            reset();
        }
        bays.floating = floating;
        bays.crushCasc = crushCasc;
        function reset() {
            bays.clearCell(cell.bayCellNo);
            var box = $.data(cell.bayCell[0], "box-data-inst"), currentBox = $.data(cell.bayCell[0], "box-data");
            if (box) {
                if (currentBox) {
                    if (box.boxNo != currentBox.boxNo) { setCellInner(bays, cell.bayCellNo, box, false, false, false); }
                } else {
                    setCellInner(bays, cell.bayCellNo, box, false, false, false);
                }
            } else {
                if (currentBox) { bays.clearCell(cell.bayCellNo); }
            }
        };
    };

    function resetBay(bays, bayNo) {
        $.each(bays.getBay(bayNo), function (i, item) { bays.resetCell(item.bayCellNo); });
    };

    function resetAll(bays) {
        $.each(bays.getAll(), function (i, item) { bays.resetCell(item.bayCellNo); });
    };



    function setCellInner(bays, bayCellNo, box, jump, overlayPrompt, isInst) {
        if (!bayCellNo || !box) { return; }
        jump = (jump == null || jump == undefined || !$.util.isBoolean(jump)) ? false : jump;
        overlayPrompt = (overlayPrompt == null || overlayPrompt == undefined || !$.util.isBoolean(overlayPrompt)) ? true : overlayPrompt;
        isInst = (isInst == null || isInst == undefined || !$.util.isBoolean(isInst)) ? false : isInst;
        var cell = bays.getCell(bayCellNo), bottomCell, bottomCellData,
            boxData = $.string.isString(box) ? $.array.first(bays.boxesGrid.datagrid("getRows"), function (val) {
                return val.boxNo == box;
            }) : box;
        if (!cell || !cell.bayCell || !cell.bayCell.length || !boxData) { return; }
        if (!isInst && checkBoxExistsBayCellNo() == false) { return $.messager.show("该箱已放置其他贝位；如需要重新放置，请先在表格的该箱所在行点击右键将其卸载"); }
        if (!isInst && checkFloating() == false) { return $.messager.show("当前设置不允许架空配，请先设置该行位下方的贝位单元格，或启用\"架空配\"功能。"); }
        if (!isInst && checkCrushCasc() == false) { return $.messager.show("当前设置不20'箱架40'箱上，请更改放置方式，或启用\"20'箱架40'箱上\"功能。"); }
        if (boxData.boxSpec == "40") {
            if (checkEdge() == false) { return $.messager.show("当前位置不允许放置 40' 箱，因为该贝位前侧无相邻贝位。"); }
            if (check40Foot() == false) { return $.messager.show("当前位置不允许放置 40' 箱，因为该贝位下一贝位的该位置已经放置了箱。"); }
        }
        if (checkDisabled() == false) { return $.messager.show("当前位置不能放置箱，因为该贝位单元格不可用。"); }
        if (cell.box) {
            if (isInst) {
                bays.clearCell(cell.bayCellNo); setData();
            } else {
                if (overlayPrompt) {
                    $.messager.confirm("操作提醒", $.string.format("当前贝位图单元格({0})已经设置了箱({1})，您是否要覆盖设置？", bayCellNo, cell.box.boxNo), function (c) {
                        if (c) { bays.clearCell(cell.bayCellNo); setData(); }
                    });
                } else {
                    bays.clearCell(cell.bayCellNo); setData();
                }
            }
        } else { setData(); }
        function setData() {
            if (!isInst) {
                refreshBoxes();
            }
            var formatter = $.isFunction(bays.cellFormatter) ? bays.cellFormatter : $.baygui.defaults.cellFormatter,
                cellItem = cell.bayCell.find(">div.bay-cell-item"),
                content = formatter.call(bays, bayCellNo, boxData, cell.bayCell);
            cellItem.empty()[$.string.isString(content) ? "text" : "append"](content);
            $.data(cell.bayCell[0], "box-data", boxData);
            cell.bayCell.addClass("bay-cell-valued");
            if (jump) { bay.jumpCell(cell.bayCellNo); }
            if (isInst) { $.data(cell.bayCell[0], "box-data-inst", boxData); }
            if (cell.bayCell.hasClass("bay-cell-selected")) { bays.selectCell(bayCellNo); }
            if (boxData.boxSpec == "40") { set40Foot(); }
        }
        function instBottomCell() {
            if (!bottomCell) { bottomCell = getBayBottomCellDom(bays, cell.bayCellNo); }
            if (!bottomCellData) { bottomCellData = getCellData(bays, bottomCell); }
        };
        function checkFloating() {
            if (bays.floating) { return true; }
            instBottomCell();
            return bottomCellData && !bottomCellData.box ? false : true;
        };
        function checkCrushCasc() {
            if (bays.crushCasc || (boxData.boxSpec == "40")) { return true; }
            instBottomCell();
            return bottomCellData && bottomCellData.box && bottomCellData.box.boxSpec == "40" ? false : true;
        };
        function check40Foot() {
            var nextCell = getBayNextCellDom(bays, cell.bayCellNo),
                nextCellData = nextCell && nextCell.length ? getCellData(bays, nextCell) : null;
            return nextCellData && nextCellData.box && nextCellData.box.bayCellNo ? false : true;
        };
        function checkEdge() {
            var bay = $.array.first(bays.baysData, function (val) { return val.bayNo == cell.bayNo; });
            if (!bay) { return true; }
            var nextBayNo = parseInt(bay.bayNo) + 2,
                nextBayNoStr = $.string.padLeft(nextBayNo, 2, "0"),
                nextBay = $.array.first(bays.baysData, function (val) { return val.bayNo == nextBayNoStr });
            return !nextBay || (bay && bay.isEdge) ? false : true;
        };
        function checkDisabled() { if (cell.disabled) { return false; } };
        function checkBoxExistsBayCellNo() { if (boxData.bayCellNo) { return false; } };
        function refreshBoxes() {
            boxData.bayCellNo = boxData.boxSpec == "40" ? ($.string.padLeft(parseInt(cell.bayNo) + 1, 2, "0") + cell.rowNo + cell.tierNo)
                : cell.bayCellNo;
            var idField = bays.boxesGrid.datagrid("options").idField, id = boxData[idField], index = bays.boxesGrid.datagrid("getRowIndex", id);
            if ($.isNumeric(index)) {
                bays.boxesGrid.datagrid("updateRow", { index: index, row: boxData }).datagrid("unselectRow", index);
                if (bays.bayRowDnd) {
                    var tr = bays.boxesGrid.datagrid("getRowDom", index);
                    bindBayRowDraggable(tr);
                }
            }
        }
        function set40Foot() {
            cell.bayCell.addClass("bay-cell-bigbox");
            var nextCell = getBayNextCellDom(bays, cell.bayCellNo);
            if (nextCell && nextCell.length) {
                nextCell.addClass("bay-cell-bigbox-next").find("div.bay-cell-item").empty().append("<span>" +
                    boxData.boxNo + "</span><br/><span>该贝位已放置40'箱</span>");
            }
        };
    };

    function setCell(bays, bayCellNo, box, jump, overlayPrompt) {
        if ($.isFunction(bays.onBeforeSetCell) && bays.onBeforeSetCell.call(bays, bayCellNo, box, jump, overlayPrompt) == false) { return; }
        var ret = setCellInner(bays, bayCellNo, box, jump, overlayPrompt, false);
        if ((ret == null || ret == undefined) && $.isFunction(bays.onSetCell)) {
            bays.onSetCell.call(bays, bayCellNo, box, jump, overlayPrompt);
        }
    };

    function setCells(bays, data) {
        if (!$.isARray(data)) { return $.messager.show("批量设置贝位装箱数据状态失败，传入的参数不是一组数组"); }
        $.each(data, function (index, item) { bays.setCell(item); });
    };


    function selectCell(bays, bayCellNo) {
        if ($.isFunction(bays.onBeforeSelectCell) && bays.onBeforeSelectCell.call(bays, bayCellNo) == false) { return; }
        var cell = bays.getCell(bayCellNo);
        if (!cell) { return $.messager.show("该贝位号所表示的单元格不存在"); }
        bays.unSelectCell();
        cell.bayCell.addClass("bay-cell-selected");
        var formatter = $.isFunction(bays.boardFormatter) ? bays.boardFormatter : $.baygui.defaults.boardFormatter,
            text = formatter.call(this, bayCellNo, cell.box);
        setBayCellText(bays, text);
        if ($.isFunction(bays.onSelectCell)) { bays.onSelectCell.call(bays, bayCellNo); }
    };

    function unSelectCell(bays, text) {
        bays.baysContainer.find("table.bays-wrapper[bayNo] tr[tierNo] td.bay-cell-selected[rowNo]").removeClass("bay-cell-selected");
        setBayCellText(bays);
    };

    function setBayCellText(bays, text) {
        text = text || "当前没有选中任何贝位单元格";
        if (bays.bayCellBoard && bays.bayCellBoard.length) {
            bays.bayCellBoard.each(function () {
                if ($.html5.testProp("value", this.tagName)) {
                    $(this).val($.string.isString(text) ? text : $(text).text());
                } else {
                    $(this).empty()[$.string.isString(text) ? "text" : "append"](text);
                }
            });
        }
    };


    function getCell(bays, bayCellNo) {
        var cell = bays.getCellDom(bayCellNo);
        return getCellData(bays, cell);
    };

    function getCellDom(bays, bayCellNo) {
        if (!bayCellNo) { return getSelectedCellDom(bays); }
        if (!$.util.isString(bayCellNo) || bayCellNo.length != 6) { return $.messager.show("传入的是一个不合法的贝位号"); }
        var bayNo = $.string.left(bayCellNo, 2), rowNo = bayCellNo.substr(2, 2), tierNo = $.string.right(bayCellNo, 2);
        if ($.number.isOdd(bayNo)) {
            return bays.baysContainer.find("table.bays-wrapper[bayNo=" + bayNo + "] tr[tierNo=" + tierNo + "] td[rowNo=" + rowNo + "]");
        } else {
            var i = parseInt(bayNo),
                c1 = bays.baysContainer.find("table.bays-wrapper[bayNo=" + $.string.padLeft(i - 1, 2, "0") + "] tr[tierNo=" + tierNo + "] td[rowNo=" + rowNo + "]"),
                c2 = bays.baysContainer.find("table.bays-wrapper[bayNo=" + $.string.padLeft(i + 1, 2, "0") + "] tr[tierNo=" + tierNo + "] td[rowNo=" + rowNo + "]");
            return c1.add(c2);
        }
    };


    function getCellData(bays, cell) {
        if (!cell || !cell.length || !cell.is("td[rowNo]")) { return null; }
        cell = $(cell[0]);
        var tr = cell.closest("tr.bay-row[tierNo]"), table = tr.closest("table.bays-wrapper[bayNo]"),
            bayNo = table.attr("bayNo"), tierNo = tr.attr("tierNo"), rowNo = cell.attr("rowNo"),
            bayCellNo = bayNo + rowNo + tierNo, box,
            disabled = cell.attr("disabled") ? true : false;
        if (cell.hasClass("bay-cell-bigbox-next")) {
            var prevCell = getBayPrevCellDom(bays, bayCellNo);
            if (prevCell && prevCell.length) { box = $.data(prevCell[0], "box-data"); }
        } else {
            box = $.data(cell[0], "box-data");
        }
        return { bayNo: bayNo, tierNo: tierNo, rowNo: rowNo, bayCellNo: bayCellNo, bayCell: cell, disabled: disabled, box: box };
    };

    //  获取当前选中的贝位图单元格，返回的是一个 td.bay-cell[rowNo] 的 jQuery 对象；
    function getSelectedCellDom(bays) {
        return bays.baysContainer.find("table.bays-wrapper[bayNo] tr[tierNo] td[rowNo].bay-cell-selected");
    };

    function getBay(bays, bayNo) {
        var grids = bayNo ? bays.baysContainer.find("table.bays-wrapper[bayNo=" + bayNo + "]") : getSelectedBayGrid(bays);
        return grids.find("tr[tierNo] td[rowNo]").map(function () { return getCellData(bays, $(this)); });
    }

    function getAll(bays) {
        return bays.baysContainer.find("table.bays-wrapper[bayNo] tr[tierNo] td[rowNo]").map(function () { return getCellData(bays, $(this)); });
    };

    function getSelectedBayGrid(bays) {
        return getSelectedBay(bays).find("table.bays-wrapper[bayNo]");
    }

    //  获取当前选中的贝位图页，返回的是一个 div.panel-body 的 jQuery 对象；
    function getSelectedBay(bays) {
        return bays.baysContainer.tabs("getSelected").panel("body");
    };


    function jumpCell(bays, bayCellNo) {
        if (!$.util.isString(bayCellNo) || bayCellNo.length != 6) { return $.messager.show("传入的是一个不合法的贝位号"); }
        var bayNo = $.string.left(bayCellNo, 2);
        bays.jumpBay(bayNo);
        bays.selectCell(bayCellNo);
    };

    function jumpBay(bays, bayNo) {
        if (!bayNo) { return $.messager.show("传入的是一个不合法的贝号"); }
        var bayNo = parseInt(bayNo);
        if (!$.number.isOdd(bayNo)) { bayNo -= 1; }
        bayNo = $.string.padLeft(bayNo, 2, "0");
        var tabs = bays.baysContainer.tabs("tabs"),
            tab = $.array.first(tabs, function (val) {
                return val.panel("options").id == bayNo;
            });
        if (tab) {
            var index = bays.baysContainer.tabs("getTabIndex", tab);
            bays.baysContainer.tabs("select", index);
        }
    };




    //  定义扩展方法集合
    $.baygui.methods = {
        loadBoxes: function (data) { return loadBoxes(this, data); },
        loadBays: function (data) { return loadBays(this, data); },
        instBoxesState: function (data) { return instBoxesState(this, data); },
        save: function (callback) { return save(this, callback); },
        saveAs: function (url, callback) { return saveAs(this, url, callback); },

        getCell: function (bayCellNo) { return getCell(this, bayCellNo); },
        getCellDom: function (bayCellNo) { return getCellDom(this, bayCellNo); },
        getBay: function (bayNo) { return getBay(this, bayNo); },
        getAll: function () { return getAll(this); },

        resetCell: function (bayCellNo) { return resetCell(this, bayCellNo); },
        resetBay: function (bayNo) { return resetBay(this, bayNo); },
        resetAll: function () { return resetAll(this); },

        clearCell: function (bayCellNo) { return clearCell(this, bayCellNo); },
        clearBay: function (bayNo) { return clearBay(this, bayNo); },
        clearAll: function () { return clearAll(this); },
        clearBoxCell: function (box) { return clearBoxCell(this, box); },

        setCell: function (bayCellNo, box, jump, overlayPrompt) { return setCell(this, bayCellNo, box, jump, overlayPrompt); },
        setCells: function (data) { return setCells(this, data); },

        selectCell: function (bayCellNo) { return selectCell(this, bayCellNo); },
        unSelectCell: function () { return unSelectCell(this); },
        jumpCell: function (bayCellNo) { return jumpCell(this, bayCellNo); },
        jumpBay: function (bayNo) { return jumpBay(this, bayNo); }
    };

    //  定义扩展属性集合
    $.baygui.defaults = {
        boxesGrid: null,
        boxesUrl: null,
        boxesMethod: "post",
        boxesQueryParams: null,
        baysContainer: null,
        baysUrl: null,
        baysQueryParams: null,
        baysMethod: "post",
        floating: false,
        crushCasc: false,
        bayCellTooltip: true,
        bayCellContextMenu: true,
        bayRowDnd: true,
        bayCellBoard: null,
        saveUrl: null,
        saveMethod: "post",
        boardFormatter: function (bayCellNo, box) { return genericBoardFormatter(this, bayCellNo, box); },
        cellFormatter: function (bayCellNo, box, bayCell) { return genericCellFormatter(this, bayCellNo, box, bayCell); },
        tooltipFormatter: function (bayCellNo, box, bayCell) { return genericTooltipFormatter(this, bayCellNo, box, bayCell); },
        gridDataFilter: function (data) { return genericGridDataFilter.call(this, data); },
        baysDataFilter: function (data) { return genericBaysDataFilter.call(this, data); },
        saveDataFilter: function (data) { return genericSaveDataFilter.call(this, data); },
        onLoadBoxes: function (data) { },
        onBeforeLoadBays: function (data) { },
        onLoadBays: function (data) { },
        onBeforeSave: function (data, url) { },
        onSave: function (data, url) { },
        onBeforeSetCell: function (bayCellNo, box, jump, overlayPrompt) { },
        onSetCell: function (bayCellNo, box, jump, overlayPrompt) { },
        onBeforeSelectCell: function (bayCellNo) { },
        onSelectCell: function (bayCellNo) { },
        cell: { width: 85, height: 60, ruleXH: 25, ruleYW: 30 }
    };


    $.extend($.baygui.init.prototype = $.baygui.inst.prototype, { inst: $.baygui.inst }, $.baygui.methods, $.baygui.defaults);

    var css =
        ".bays-container { margin: 0px auto; position: absolute; display: table; }" +
        ".bays-wrapper { padding: 0px; margin: 0px; border-width: 0px; }" +
        ".bay-row { height: " + $.baygui.defaults.cell.height + "px; }" +
        ".bay-cell-rulex, .bay-cell-ruley, .bay-cell-indent { background-color: #efefef; background: linear-gradient(to bottom,#F9F9F9 0,#efefef 100%); background-repeat: repeat-x; }" +
        ".bay-cell, .bay-cell-indent { width: " + $.baygui.defaults.cell.width + "px; padding: 0px; margin: 0px; border-top-width: 0px; border-left-width: 0px; border-bottom-width: 1px; border-right-width: 1px; border-color: #ccc; border-style: dotted; }" +
        ".bay-cell-rulex, .bay-cell-ruley, .bay-cell-indent { text-align: center; }" +
        ".bay-cell-rulex { height: " + $.baygui.defaults.cell.ruleXH + "px; }" +
        ".bay-cell-ruley { width: " + $.baygui.defaults.cell.ruleYW + "px; }" +
        ".bay-cell-indent-half { width: " + ($.baygui.defaults.cell.width / 2) + "px; }" +
        ".bay-cell-item { margin: 0px; padding: 0px; width: " + ($.baygui.defaults.cell.width - 4) + "px; height: auto; white-space: nowrap; word-wrap: normal; overflow: hidden; line-height: 14px; }" +
        ".bay-cell-disabled { background-color: gray; }" +
        ".bay-cell-valued { background-color: #DFDFDF; }" +
        ".bay-cell-bigbox { background-color: #999999; }" +
        ".bay-cell-bigbox-next { background-color: #2C2D2D; color: white; }" +
        ".bay-cell-selected { background-color: #89be89; }" +
        ".bays-selected-label { font-weight: bold; color: green; }" +
        ".bay-row-draggable { padding: 2px 4px 2px 18px; background-position: left center; }" +
        ".bay-row-draggable:hover { border-width: 1px; border-style: solid; border-color: #9EC22D; }" +
        ".bay-row-draggable-wrapper { border-width: 1px; border-style: solid; border-color: blue: }";
    $.util.addCss(css);

})(jQuery);