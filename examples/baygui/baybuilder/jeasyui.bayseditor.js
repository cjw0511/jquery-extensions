/**
* jQuery EasyUI BayGUI 1.0 beta
* jQuery EasyUI BayGUI 组件扩展
* jeasyui.baysgui.js
* 二次开发 流云
* 最近更新：2013-10-17
*
* 依赖项：
*   1、jQuery EasyUI 基础库 v1.3.4
*   2、jquery.jdirk.js v1.0 beta late
*   3、jeasyui.extensions.js v1.0 beta late
*   4、jeasyui.extensions.menu.js v1.0 beta late
*   5、jeasyui.extensions.panel.js v1.0 beta late
*   6、jeasyui.extensions.window.js v1.0 beta late
*   7、jeasyui.extensions.dialog.js v1.0 beta late
*   8、jeasyui.extensions.tabs.js v1.0 beta late
*   9、jquery-easyui-toolbar/jquery.toolbar.js v1.0 beta late
*
* 依赖样式：
*   1、icon-all.css
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    //  $.baygui.editor
    $.util.define(
        "$.baygui.editor",
        {
            shipUrl: null,
            shipQueryParams: null,
            shipMethod: "post",
            baysUrl: null,
            baysQueryParams: null,
            baysMethod: "post",
            baysContainer: null,
            enableCellContextMenu: true,
            saveUrl: null,
            saveMethod: "post",
            saveAjaxOptions: null,
            shipDataFilter: function (ship) { return genericShipDataFilter(this, ship); },
            baysDataFilter: function (array) { return genericBaysDataFilter(this, array); },
            saveDataFilter: function (array) { return genericSaveDataFilter(this, array); },

            onBeforeSave: function (data) { },
            onSave: function (data) { },
            onSaveError: function (XMLHttpRequest, textStatus, errorThrown) { },
            onBeforeLoadBays: function (data) { },
            onLoadBays: function (data) { },
            onBeforeSelectCell: function (bayCellNo) { },
            onSelectCell: function (bayCellNo) { },
            onBeforeDisableCell: function (bayCellNo) { },
            onDisableCell: function (bayCellNo) { },
            onBeforeEnableCell: function (bayCellNo) { },
            onEnableCell: function (bayCellNo) { },

            loadBays: function (data) { return loadBays(this, data); },
            save: function (callback) { return save(this, callback); },
            saveAs: function (url, callback) { return saveAs(this, url, callback); },
            getCell: function (bayCellNo) { return getCell(this, bayCellNo); },
            getCellDom: function (bayCellNo) { return getCellDom(this, bayCellNo); },
            getBay: function (bayNo) { return getBay(this, bayNo); },
            getBayRow: function (bayNo, rowNo) { return getBayRow(this, bayNo, rowNo); },
            getBayTier: function (bayNo, tierNo) { return getBayTier(this, bayNo, tierNo); },
            getAll: function () { return getAll(this); },
            selectCell: function (bayCellNo) { return selectCell(this, bayCellNo); },
            unSelectCell: function (bayCellNo) { return unSelectCell(this, bayCellNo); },
            jumpCell: function (bayCellNo) { return jumpCell(this, bayCellNo); },
            jumpBay: function (bayNo) { return jumpBay(this, bayNo); },
            disableCell: function (bayCellNo) { return disableCell(this, bayCellNo); },
            disableTier: function (bayNo, tierNo) { return disableTier(this, bayNo, tierNo); },
            disableRow: function (bayNo, rowNo) { return disableRow(this, bayNo, rowNo); },
            enableCell: function (bayCellNo) { return enableCell(this, bayCellNo); },
            enableTier: function (bayNo, tierNo) { return enableTier(this, bayNo, tierNo); },
            enableRow: function (bayNo, rowNo) { return enableRow(this, bayNo, rowNo); },
            resetCell: function (bayCellNo) { return resetCell(this, bayCellNo); },
            showAddBayDialog: function (callback) { return showAddBayDialog(this, callback); },
            showInsertBayDialog: function (bayNo, callback) { return showInsertBayDialog(this, bayNo, callback); },
            addBay: function (bay, bayNo) { return addBay(this, bay, bayNo); },
            insertBay: function (bayNo, bay) { return insertBay(this, bayNo, bay); },
            removeBay: function (bayNo) { return removeBay(this, bayNo); },

            cell: { width: 70, height: 40, ruleXH: 20, ruleYW: 20 }
        },
        function (options) { return initBays(this, options); }
    );

    function initBays(bays, options) {
        var opts = $.extend({}, options || {});
        opts.baysContainer = opts.baysContainer ? $.util.parseJquery(opts.baysContainer) : null;
        if (!opts.baysContainer || !opts.baysContainer.length) { return null; }
        $[opts.shipMethod.toLowerCase()](opts.shipUrl, opts.shipQueryParams, function (ship) {
            var shipFilter = $.isFunction(bays.shipDataFilter) ? bays.shipDataFilter : $.baygui.editor.defaults.shipDataFilter;
            ship = shipFilter.call(bays, ship);
            $[opts.baysMethod.toLowerCase()](opts.baysUrl, opts.baysQueryParams, function (array) {
                var baysFilter = $.isFunction(bays.baysDataFilter) ? bays.baysDataFilter : $.baygui.editor.defaults.baysDataFilter;
                array = baysFilter.call(bays, array);
                bays.loadBays({ ship: ship, bays: array });
            }, "json");
        }, "json");
        return $.extend(bays, opts);
    };


    function genericShipDataFilter(bays, ship) { return ship; };

    function genericBaysDataFilter(bays, array) { return array };

    function genericSaveDataFilter(bays, array) { return array; };



    function tiersFilter(tiers, isDeck) {
        return $.array.filter(tiers, function (val) {
            var tierNo = (val.tierNo == null || val.tierNo == undefined) ? 0 : window.parseInt(val.tierNo);
            if (tierNo == NaN) { tierNo = 0; }
            return isDeck ? (tierNo > 80) : (tierNo > 0 && tierNo <= 80);
        });
    };

    function calcBayPanelSize(tiers) {
        var tierArray = $.array.map(tiers, function (val) { return val.tierNo; }),
            rowsArray = $.array.reduce(tiers, function (prev, val) {
                var frag = $.array.map(val.rows, function (item) { return item.rowNo; });
                return $.array.merge(prev, frag);
            }, []),
            minX = $.array.min(rowsArray) || 0, maxX = $.array.max(rowsArray) || 0,
            minY = $.array.min(tierArray) || 0, maxY = $.array.max(tierArray) || 0;
        minX = window.parseInt(minX);
        maxX = window.parseInt(maxX);
        minY = window.parseInt(minY);
        maxY = window.parseInt(maxY);
        if ($.number.isOdd(maxX)) { maxX++; }
        var x = maxX, y = maxY > 80 ? maxY - 80 : maxY;
        return { width: (minX == "00") ? x + 1 : x, height: y / 2 };
    };

    function castBaySizeParam(bay) {
        var deckTiers = tiersFilter(bay.tiers, true), underTiers = tiersFilter(bay.tiers, false),
            deck = calcBayPanelSize(deckTiers), under = calcBayPanelSize(underTiers),
            union = { width: Math.max(deck.width, under.width), height: deck.height + under.height };
        return { isEdge: bay.isEdge, deck: deck, under: under, union: union };
    };

    function castBaysToArray(bays) {
        return $.array.reduce(bays, function (prev, bay) {
            var bayNo = $.string.padLeft(bay.bayNo, 2, "0"),
                tiers = $.array.reduce(bay.tiers, function (prevTier, tier) {
                    var tierNo = $.string.padLeft(tier.tierNo, 2, "0"),
                        rows = $.array.map(tier.rows, function (row) {
                            var rowNo = $.string.padLeft(row.rowNo, 2, "0");
                            return { bayNo: bayNo, rowNo: rowNo, tierNo: tierNo, bayCellNo: bayNo + rowNo + tierNo, disabled: row.disabled };
                        });
                    return $.array.merge(prevTier, rows);
                }, []);
            return $.array.merge(prev, tiers);
        }, []);
    };

    function appendBayTab(bays, bay) {
        var data = castBaySizeParam(bay);
        addBayInner(bays, data, bay.bayNo);
    };

    function loadBayGridCellStatus(bays) {
        var cells = castBaysToArray(bays.bays);
        $.each(cells, function (i, cell) {
            if (cell.disabled) {
                var c = bays.getCell(cell.bayCellNo);
                disableCellInner(c);
            }
        });
    };

    function loadBays(bays, data) {
        if (!data || !data.ship || !$.isArray(data.bays)) { return window.alert("初始化 BayGUI 编辑器组件失败，传入的参数 data 不是一个符合格式规范要求的对象"); }
        if ($.isFunction(bays.onBeforeLoadBays) && bays.onBeforeLoadBays.call(bays, data) == false) { return; }
        bays.ship = data.ship;
        bays.bays = data.bays;
        var tabs = bays.baysContainer.empty().data("tabs", null).tabs({
            contextMenu: [
                {
                    text: "删除该贝位", iconCls: "", handler: function (e, title, index) {
                        $.messager.confirm("操作提醒", "您确定要删除贝位 \"" + title + "\" (点击\"保存所有数据\"按钮后才能生效并保存至数据库)？", function (c) {
                            if (c) {
                                var bayNo = bays.baysContainer.tabs("getTab", index).panel("options").id;
                                bays.removeBay(bayNo);
                            }
                        });
                    }
                }, "-",
                { text: "添加贝位", iconCls: "", handler: function (e, title, index) { bays.showAddBayDialog(); } },
                {
                    text: "在该位置插入贝位", iconCls: "", handler: function (e, title, index) {
                        var bayNo = bays.baysContainer.tabs("getTab", index).panel("options").id;
                        bays.showInsertBayDialog(bayNo);
                    }
                }, "-",
                {
                    text: "统计该贝位单元格数", iconCls: "", handler: function (e, title, index) {
                        var bayNo = bays.baysContainer.tabs("getTab", index).panel("options").id,
                            b = bays.getBay(bayNo),
                            cells = castBaysToArray([b]);
                        $.messager.show("该贝位单元格总数为(含被禁用的单元格)：" + cells.length);
                    }
                },
                {
                    text: "统计所有贝位单元格数", iconCls: "", handler: function (e, title, index) {
                        var bs = bays.getAll(), cells = castBaysToArray(bs);
                        $.messager.show("当前所有贝位的单元格综述为(含被禁用的单元格)：" + cells.length);
                    }
                }
            ]
        });
        $.each(data.bays, function (index, bay) { appendBayTab(bays, bay); });
        loadBayGridCellStatus(bays);
        var tabs = bays.baysContainer.tabs("tabs");
        if (tabs.length) { bays.baysContainer.tabs("select", 0); }
        if ($.isFunction(bays.onLoadBays)) { bays.onLoadBays.call(bays, data); }
    };



    function save(bays, callback) {
        return bays.saveAs(bays.saveUrl, callback);
    };

    function saveAs(bays, url, callback) {
        if (!url) { return $.messager.show("用于数据保存的远程服务器地址未设定，数据保存失败！"); }
        var array = bays.getAll(), data = { code: bays.ship.code, bays: array };
        if ($.isFunction(bays.onBeforeSave) && bays.onBeforeSave.call(bays, data, url) == false) { return; }
        var dataFilter = $.isFunction(bays.saveDataFilter) ? bays.saveDataFilter : $.baygui.editor.defaults.saveDataFilter;
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
        }, bays.saveAjaxOptions || {});
        $.ajax(opts);
    };


    function getSelectedCellDom(bays) {
        return bays.baysContainer.find("table.baygui-editor-wrapper[bayNo] tr[tierNo] td[rowNo].baygui-editor-cell-selected");
    };

    function getCell(bays, bayCellNo) {
        var cell = bays.getCellDom(bayCellNo);
        return getCellData(cell);
    };

    function getCellDom(bays, bayCellNo) {
        if (!bayCellNo) { return getSelectedCellDom(bays); }
        if (!$.util.isString(bayCellNo) || bayCellNo.length != 6) { return $.messager.show("传入的是一个不合法的贝位号"); }
        var bayNo = $.string.left(bayCellNo, 2), rowNo = bayCellNo.substr(2, 2), tierNo = $.string.right(bayCellNo, 2);
        return bays.baysContainer.find("table.baygui-editor-wrapper[bayNo=" + bayNo + "] tr[tierNo=" + tierNo + "] td[rowNo=" + rowNo + "]");
    };

    function getBay(bays, bayNo) {
        if (!bayNo) {
            var tab = bays.baysContainer.tabs("getSelected");
            if (!tab) { return null; }
            bayNo = tab.panel("options").id;
        }
        var layout = bays.baysContainer.find("div.baygui-editor-layout[bayNo=" + bayNo + "]");
        if (!layout.length) { return; }
        var isEdge = layout.attr("isEdge") ? true : false,
            trs = layout.find("table.baygui-editor-wrapper[bayNo=" + bayNo + "] tr[tierNo]"),
            tiers = $.array.map(trs, function (val) {
                var tr = $(val), tierNo = tr.attr("tierNo"),
                    tds = tr.find("td[rowNo]"),
                    rows = $.array.map(tds, function (td) {
                        td = $(td);
                        return { rowNo: td.attr("rowNo"), disabled: td.hasClass("baygui-editor-cell-disabled") ? true : false };
                    });
                return { tierNo: tierNo, rows: rows };
            });
        return { bayNo: bayNo, isEdge: isEdge, tiers: tiers };
    };

    function getBayRowDom(bays, bayNo, rowNo) {
        if (!bayNo) { bayNo = "00" }
        if (!rowNo) { rowNo = "00" }
        return bays.baysContainer.find("table.baygui-editor-wrapper[bayNo=" + bayNo + "] tr[tierNo] td[rowNo=" + rowNo + "]");
    };

    function getBayTierDom(bays, bayNo, tierNo) {
        if (!bayNo) { bayNo = "00" }
        if (!tierNo) { tierNo = "00" }
        return bays.baysContainer.find("table.baygui-editor-wrapper[bayNo=" + bayNo + "] tr[tierNo=" + tierNo + "] td[rowNo]");
    };

    function getBayRow(bays, bayNo, rowNo) {
        return getBayRowDom(bays, bayNo, rowNo).map(function () {
            return getCellData($(this));
        });
    };

    function getBayTier(bays, bayNo, tierNo) {
        return getBayTierDom(bays, bayNo, tierNo).map(function () {
            return getCellData($(this));
        });
    };

    function getAll(bays) {
        var tabs = bays.baysContainer.tabs("tabs");
        return $.array.map(tabs, function (val) { return getBay(bays, val.panel("options").id); });
    };


    function selectCell(bays, bayCellNo) {
        var cell = bays.getCell(bayCellNo);
        if (!cell) { return $.messager.show("该贝位号所表示的单元格不存在"); }
        if ($.isFunction(bays.onBeforeSelectCell) && bays.onBeforeSelectCell.call(bays, cell.bayCellNo) == false) { return; }
        bays.unSelectCell();
        cell.bayCell.addClass("baygui-editor-cell-selected");
        if ($.isFunction(bays.onSelectCell)) { bays.onSelectCell.call(bays, bayCellNo); }
    };

    function unSelectCell(bays, bayCellNo) {
        getSelectedCellDom(bays).removeClass("baygui-editor-cell-selected");
    };

    function jumpCell(bays, bayCellNo) {
        if (!$.util.isString(bayCellNo) || bayCellNo.length != 6) { return $.messager.show("传入的是一个不合法的贝位号"); }
        var bayNo = $.string.left(bayCellNo, 2);
        bays.jumpBay(bayNo);
        bays.selectCell(bayCellNo);
    };

    function jumpBay(bays, bayNo) {
        if (!bayNo) { return $.messager.show("传入的是一个不合法的贝号"); }
        var bayNo = window.parseInt(bayNo);
        if (!$.number.isOdd(bayNo)) { bayNo -= 1; }
        bayNo = $.string.padLeft(bayNo, 2, "0");
        var tabs = bays.baysContainer.tabs("tabs"),
            tab = $.array.first(tabs, function (val) { return val.panel("options").id == bayNo; });
        if (tab) {
            var index = bays.baysContainer.tabs("getTabIndex", tab);
            bays.baysContainer.tabs("select", index);
        }
    };


    function disableCellInner(cell) {
        if (cell && cell.bayCellNo) { cell.bayCell.attr("disabled", true).addClass("baygui-editor-cell-disabled"); }
    };

    function disableCell(bays, bayCellNo) {
        var cell = bays.getCell(bayCellNo);
        if (!cell) { return $.messager.show("该贝位号所表示的单元格不存在"); }
        if ($.isFunction(bays.onBeforeDisableCell) && bays.onBeforeDisableCell.call(bays, cell.bayCellNo) == false) { return; }
        disableCellInner(cell);
        if ($.isFunction(bays.onDisableCell)) { bays.onDisableCell.call(bays, cell.bayCellNo); }
    };

    function disableTier(bays, bayNo, tierNo) {
        getBayTierDom(bays, bayNo, tierNo).each(function () {
            var cell = getCellData($(this));
            bays.disableCell(cell.bayCellNo);
        });
    };

    function disableRow(bays, bayNo, rowNo) {
        getBayRowDom(bays, bayNo, rowNo).each(function () {
            var cell = getCellData($(this));
            bays.disableCell(cell.bayCellNo);
        });
    };


    function enableCellInner(cell) {
        if (cell && cell.bayCellNo) { cell.bayCell.removeAttr("disabled").removeClass("baygui-editor-cell-disabled"); }
    };

    function enableCell(bays, bayCellNo) {
        var cell = bays.getCell(bayCellNo);
        if (!cell) { return $.messager.show("该贝位号所表示的单元格不存在"); }
        if ($.isFunction(bays.onBeforeEnableCell) && bays.onBeforeEnableCell.call(bays, cell.bayCellNo) == false) { return; }
        enableCellInner(cell);
        if ($.isFunction(bays.onEnableCell)) { bays.onEnableCell.call(bays, cell.bayCellNo); }
    };

    function enableTier(bays, bayNo, tierNo) {
        getBayTierDom(bays, bayNo, tierNo).each(function () {
            var cell = getCellData($(this));
            bays.enableCell(cell.bayCellNo);
        });
    };

    function enableRow(bays, bayNo, rowNo) {
        getBayRowDom(bays, bayNo, rowNo).each(function () {
            var cell = getCellData($(this));
            bays.enableCell(cell.bayCellNo);
        });
    };

    function resetCell(bays, bayCellNo) {
        var cells = castBaysToArray(bays.bays),
            cell = $.array.first(cells, function (val) { return val.bayCellNo == bayCellNo; });
        if (cell) {
            if (cell.disabled) { bays.disableCell(bayCellNo); } else { bays.enableCell(bayCellNo); }
        }
    };


    function showAddBayDialog(bays, callback) {
        return showInsertBayDialog(bays, null, callback);
    };

    function showInsertBayDialog(bays, bayNo, callback) {
        var tabs = bays.baysContainer.tabs("tabs"),
            tab = $.array.first(tabs, function (val) { return val.panel("options").id == bayNo; }),
            index = tab ? bays.baysContainer.tabs("getTabIndex", tab) : 0,
            isInsert = tab ? true : false;
        var dia = $.easyui.showDialog({
            content: "<div class=\"baygui-editor-form\"></div>",
            title: "添加/插入贝位",
            width: 300,
            height: 340,
            saveButtonText: "确定",
            saveButtonIconCls: "icon-ok",
            enableApplyButton: false,
            topMost: false,
            onSave: function () { return $.isFunction(dia._enter) ? dia._enter() : ($.isFunction(callback) ? callback() : null); }
        });
        $.util.exec(function () {
            var form = dia.dialog("body").find("div.baygui-editor-form");
            form.append("<div><label><input id=\"ckEdge\" type=\"checkbox\" checked=\"checked\" /><span>该贝位有相邻贝位</span></label></div><br />");
            form.append("<fieldset><legend><label><input id=\"ckDeck\" type=\"checkbox\" checked=\"checked\" /><span>是否包含外仓</span></label></legend><div id=\"deckForm\"></div></fieldset><br />");
            form.append("<fieldset><legend><label><input id=\"ckUnder\" type=\"checkbox\" checked=\"checked\" /><span>是否包含内仓</span></label></legend><div id=\"underForm\"></div></fieldset><br />");
            form.append("<fieldset><legend><label><input id=\"ckInsert\" type=\"checkbox\" checked=\"checked\" /><span>在以下贝位前插入</span></label></legend><div id=\"insertForm\"></div></fieldset><br />");
            var ckEdge = form.find("#ckEdge"),
                ckDeck = form.find("#ckDeck"), deckForm = form.find("#deckForm"),
                ckUnder = form.find("#ckUnder"), underForm = form.find("#underForm"),
                ckInsert = form.find("#ckInsert"), insertForm = form.find("#insertForm");
            deckForm.append("<span>列数：</span><input id=\"deckWidth\" class=\"easyui-numberspinner\" data-options=\"min: 1, max: 20\" style=\"width: 50px;\" value=\"6\" />");
            deckForm.append("<span style=\"margin-left: 30px;\">层数：</span><input id=\"deckHeight\" class=\"easyui-numberspinner\" data-options=\"min: 1, max: 9\" style=\"width: 50px;\" value=\"2\" />");
            underForm.append("<span>列数：</span><input id=\"underWidth\" class=\"easyui-numberspinner\" data-options=\"min: 1, max: 20\" style=\"width: 50px;\" value=\"6\" />");
            underForm.append("<span style=\"margin-left: 30px;\">层数：</span><input id=\"underHeight\" class=\"easyui-numberspinner\" data-options=\"min: 1, max: 20\" style=\"width: 50px;\" value=\"3\" />");
            insertForm.append("<input id=\"txtBayNo\" type=\"text\" />");
            $.parser.parse(form[0]);
            var deckWidth = form.find("#deckWidth"), deckHeight = form.find("#deckHeight"),
                underWidth = form.find("#underWidth"), underHeight = form.find("#underHeight"),
                txtBayNo = form.find("#txtBayNo"), tabs = bays.baysContainer.tabs("tabs"),
                array = $.array.map(tabs, function (val) { var opts = val.panel("options"); return { bayNo: opts.id, title: opts.title }; });
            txtBayNo.combobox({ valueField: "bayNo", textField: "title", width: 100, data: array, value: isInsert ? bayNo : null });
            ckDeck.change(function () {
                if (this.checked) {
                    deckWidth.numberspinner("enable"); removeAttr.numberspinner("enable");
                } else {
                    deckWidth.numberspinner("disable"); deckWidth.numberspinner("disable");
                }
            });
            ckUnder.change(function () {
                if (this.checked) {
                    underWidth.numberspinner("enable"); underHeight.numberspinner("enable");
                } else {
                    underWidth.numberspinner("disable"); underHeight.numberspinner("disable");
                }
            });
            ckInsert.change(function () {
                txtBayNo.combobox(this.checked ? "enable" : "disable");
            });
            if (!isInsert) { ckInsert[0].checked = false; txtBayNo.combobox("disable"); }
            dia._enter = function () {
                if (!ckDeck[0].checked && !ckUnder[0].checked) { $.messager.show("内仓和外仓请至少选择一个"); return false; }
                var bay = { isEdge: ckEdge[0].checked ? false : true },
                    deck = { width: window.parseInt(deckWidth.val()), height: window.parseInt(deckHeight.val()) },
                    under = { width: window.parseInt(underWidth.val()), height: window.parseInt(underHeight.val()) };
                if (ckDeck[0].checked) { $.extend(bay, { deck: deck }); }
                if (ckUnder[0].checked) { $.extend(bay, { under: under }); }
                if ($.isFunction(callback)) {
                    return callback.call(dia, bay);
                } else {
                    if (ckInsert[0].checked) {
                        var bayNo = txtBayNo.combobox("getValue");
                        if (!bayNo) { $.messager.show("您勾选了\"在以下贝位前插入\"，请选择一个贝位号"); return false; }
                        return bays.insertBay(bayNo, bay);
                    } else {
                        return bays.addBay(bay);
                    }
                }
            };
        });
        return dia;
    };



    function loadBayPanelGrid(bays, body, bayNo, size, otherSize, isDeck) {
        var container = $("<div class=\"baygui-editor-container\"></div>").attr({ bayNo: bayNo, position: isDeck ? "deck" : "under" }).appendTo(body),
            grid = $("<table class=\"baygui-editor-wrapper\" cellpadding=\"0\" cellspacing=\"0\"></table>").attr({
                bayNo: bayNo, position: isDeck ? "deck" : "under"
            }).appendTo(container),
            //  isOdd 表示当前局部贝位区域的x尺寸是不是奇数，如果是奇数则存在 "00" 行位；
            isOdd = $.number.isOdd(size.width);
        //  下面这个循环添加贝位单元格
        for (var i = 1; i <= size.height; i++) {
            var tierNo = $.string.padLeft(i * 2 + (isDeck ? 80 : 0), 2, "0"),
                tr = $("<tr class=\"baygui-editor-row\"></tr>").attr("tierNo", tierNo).prependTo(grid);
            for (var j = 0; j < size.width; j++) {
                var rowNo = isOdd ? j : j + 1,
                    method = $.number.isOdd(rowNo) ? "appendTo" : "prependTo";
                rowNo = $.string.padLeft(rowNo, 2, "0");
                $("<td class=\"baygui-editor-cell\"><div class=\"baygui-editor-cell-item\">&nbsp;</div></td>").attr("rowNo", rowNo)[method](tr);
            }
            $("<td class=\"baygui-editor-cell baygui-editor-cell-ruley\">&nbsp;</td>").text(tierNo).prependTo(tr);
        }
        //  下面这个循环添加贝位标尺
        var ruleX = $("<tr class=\"baygui-editor-row baygui-editor-cell-rulex\"></tr>").prependTo(grid);
        for (var i = 0; i < size.width; i++) {
            var rowNo = isOdd ? i : i + 1, text = $.string.padLeft(rowNo, 2, "0"),
                method = $.number.isOdd(rowNo) ? "appendTo" : "prependTo";
            $("<td class=\"baygui-editor-cell\"></td>").text(text)[method](ruleX);
        }
        $("<td class=\"baygui-editor-cell baygui-editor-cell-ruley\">&nbsp;</td>").prependTo(ruleX);
        //  下面这段代码设置当贝位区域上下两个局部如果尺寸x不相等，则在尺寸x短的那个贝位局部区域左右两侧填充占位单元格
        var xDiff = otherSize.width - size.width;
        if (xDiff > 0) {
            for (var i = xDiff; i > 0; i -= 2) {
                grid.find("tr.baygui-editor-row").each(function () {
                    var tr = this, jqTr = $(this), ruley = jqTr.find("td.baygui-editor-cell-ruley"),
                        indentA = $("<td class=\"baygui-editor-cell-indent\"></td>").insertAfter(ruley),
                        indentB = $("<td class=\"baygui-editor-cell-indent\"></td>").appendTo(tr);
                    if (i < 2) {
                        indentA.addClass("baygui-editor-cell-indent-half");
                        indentB.addClass("baygui-editor-cell-indent-half");
                    }
                });
            }
        }
    };

    function loadBayGridEvent(bays, body) {
        body.find("table.baygui-editor-wrapper[bayNo] tr[tierNo] td[rowNo]").on({
            click: function () {
                var td = $(this), cell = getCellData(td);
                if (td.hasClass("baygui-editor-cell-selected")) {
                    bays.unSelectCell(cell.bayCellNo);
                } else {
                    bays.selectCell(cell.bayCellNo);
                }
            },
            contextmenu: function (e) {
                var td = $(this), cell = getCellData(td);
                bays.selectCell(cell.bayCellNo);
                if (!bays.enableCellContextMenu) { return; }
                e.preventDefault();
                var items = [
                    {
                        text: "禁用该单元格", iconCls: "", disabled: cell.bayCell.hasClass("baygui-editor-cell-disabled") ? true : false,
                        handler: function (e, title, index) { bays.disableCell(cell.bayCellNo); }
                    },
                    {
                        text: "启用该单元格", iconCls: "", disabled: cell.bayCell.hasClass("baygui-editor-cell-disabled") ? false : true,
                        handler: function (e, title, index) { bays.enableCell(cell.bayCellNo); }
                    }, "-",
                    { text: "重置该单元格", iconCls: "", handler: function (e, title, index) { bays.resetCell(cell.bayCellNo); } }, "-",
                    { text: "禁用该行位(纵向)", iconCls: "", handler: function (e, title, index) { bays.disableRow(cell.bayNo, cell.rowNo); } },
                    { text: "启用该行位(纵向)", iconCls: "", handler: function (e, title, index) { bays.enableRow(cell.bayNo, cell.rowNo); } }, "-",
                    { text: "启用该层位(横向)", iconCls: "", handler: function (e, title, index) { bays.enableTier(cell.bayNo, cell.tierNo); } },
                    { text: "禁用该层位(横向)", iconCls: "", handler: function (e, title, index) { bays.disableTier(cell.bayNo, cell.tierNo); } }, "-",
                    {
                        text: "统计该贝位单元格数", iconCls: "", handler: function (e, title, index) {
                            var b = bays.getBay(cell.bayNo), cells = castBaysToArray([b]);
                            $.messager.show("该贝位单元格总数为(含被禁用的单元格)：" + cells.length);
                        }
                    },
                    {
                        text: "统计所有贝位单元格数", iconCls: "", handler: function (e, title, index) {
                            var bs = bays.getAll(), cells = castBaysToArray(bs);
                            $.messager.show("当前所有贝位的单元格综述为(含被禁用的单元格)：" + cells.length);
                        }
                    },
                ];
                $.easyui.showMenu({ items: items, left: e.pageX, top: e.pageY });
            }
        });
    };

    function loadBayPanel(bays, panel, bay) {
        var deck = bay.deck, under = bay.under, union = bay.union,
            width = (union.width * ($.baygui.editor.defaults.cell.width + 1)) + $.baygui.editor.defaults.cell.ruleYW + 5,
            height = (union.height * $.baygui.editor.defaults.cell.height) + ($.baygui.editor.defaults.cell.ruleXH * 2) + 15,
            deckHeight = (deck.height * $.baygui.editor.defaults.cell.height) + $.baygui.editor.defaults.cell.ruleXH + 8,
            body = panel.panel("body"), opts = panel.panel("options"),
            layout = $("<div class=\"baygui-editor-layout\" style=\"width: " + width + "px; height: " + height + "px;\">" +
                "<div data-options=\"region: 'north', split: true, minHeight: " + deckHeight + ", maxHeight: " + deckHeight + ", border: false\" style=\"height: " + deckHeight + "px; border-bottom-width: 1px;\"></div>" +
                "<div data-options=\"region: 'center', border: false\" style=\"border-top-width: 1px;\"></div>" +
                "</div>").attr("bayNo", bay.bayNo).appendTo(body).layout({ fit: false }),
            deckPanel = layout.layout("panel", "north").panel("body").panel("body"),
            underPanel = layout.layout("panel", "center").panel("body").panel("body"),
            onResize = opts.onResize;
        opts.onResize = function (w, h) {
            if ($.isFunction(onResize)) { onResize.apply(this, arguments); }
            layout.css({ width: Math.max(width, w - 3), height: Math.max(height, h - 3) }).layout("resize");
        };
        if (bay.isEdge) { layout.attr("isEdge", true); }
        panel.panel("resize");
        loadBayPanelGrid(bays, deckPanel, bay.bayNo, deck, under, true);
        loadBayPanelGrid(bays, underPanel, bay.bayNo, under, deck, false);
        loadBayGridEvent(bays, body);
    };



    function getBayTitle(bayNo, isEdge) { return "Bay" + bayNo + (isEdge ? "##" : ""); };

    function addBayInner(bays, bay, bayNo) {
        bay.bayNo = bayNo;
        bay = $.extend(true, { isEdge: false, deck: { width: 0, height: 0 }, under: { width: 0, height: 0 } }, bay);
        if (!bay.union) {
            bay.union = { width: Math.max(bay.deck.width, bay.under.width), height: bay.deck.height + bay.under.height };
        }
        var title = getBayTitle(bayNo, bay.isEdge);
        bays.baysContainer.tabs("add", { id: bayNo, title: title, closable: false, selected: false, refreshable: false });
        var tabs = bays.baysContainer.tabs("tabs"),
            tab = $.array.first(tabs, function (val) { return val.panel("options").id == bayNo; });
        if (tab) { loadBayPanel(bays, tab, bay); }
    };

    function addBay(bays, bay, bayNo) {
        var tabs = bays.baysContainer.tabs("tabs"),
            ides = $.array.map(tabs, function (val) { return val.panel("options").id; });
        if (!bayNo) {
            var id = $.array.max(ides);
            bayNo = id ? $.string.padLeft(window.parseInt(id) + 2, 2, "0") : "01";
        } else {
            if ($.array.contains(ides, bayNo)) { return $.messager.show("当前贝位号已经存在"); }
        }
        bay.bayNo = bayNo;
        if ($.isFunction(bays.onBeforeAddBay) && bays.onBeforeAddBay.call(bays, bay) == false) { return; }
        addBayInner(bays, bay, bayNo);
        tabs = bays.baysContainer.tabs("tabs");
        var tab = $.array.first(tabs, function (val) { return val.panel("options").id == bayNo });
        if (tab) {
            var index = bays.baysContainer.tabs("getTabIndex", tab);
            bays.baysContainer.tabs("select", index);
        }
        if ($.isFunction(bays.onAddBay)) { bays.onAddBay.call(bays, bay); }
    };

    function insertBay(bays, bayNo, bay) {
        var tabs = bays.baysContainer.tabs("tabs"),
            tab = $.array.first(tabs, function (val) { return val.panel("options").id == bayNo; }),
            index = tab ? bays.baysContainer.tabs("getTabIndex", tab) : 0;
        bays.addBay(bay);
        bays.baysContainer.tabs("move", { source: tabs.length - 1, target: index, point: "before" });
        bays.baysContainer.tabs("select", index);
        refreshBaysTitle(bays);
    };

    function removeBay(bays, bayNo) {
        var tabs = bays.baysContainer.tabs("tabs"),
            tab = $.array.first(tabs, function (val) { return val.panel("options").id == bayNo });
        if (!tab) { return $.messager.show("指定的贝位号不存在"); }
        if ($.isFunction(bays.onBeforeRemoveBay) && bays.onBeforeRemoveBay.call(bays, bayNo) == false) { return; }
        var index = bays.baysContainer.tabs("getTabIndex", tab);
        bays.baysContainer.tabs("close", index);
        refreshBaysTitle(bays);
        if ($.isFunction(bays.onRemoveBay)) { bays.onRemoveBay.call(bays, bayNo); }
    };

    function refreshBaysTitle(bays) {
        var tabs = bays.baysContainer.tabs("tabs"), i = 1;
        $.each(tabs, function (index, tab) {
            var body = tab.panel("body"), isEdge = body.find("div.baygui-editor-layout").attr("isEdge") ? true : false,
                bayNo = $.string.padLeft(i, 2, "0"), title = getBayTitle(bayNo, isEdge);
            tab.panel("setTitle", title);
            i += 2;
        });
    };


    function getCellData(cell) {
        if (!cell || !cell.length || !cell.is("td[rowNo]")) { return null; }
        var tr = cell.closest("tr.baygui-editor-row[tierNo]"), table = tr.closest("table.baygui-editor-wrapper[bayNo]"),
            bayNo = table.attr("bayNo"), tierNo = tr.attr("tierNo"), rowNo = cell.attr("rowNo"),
            bayCellNo = bayNo + rowNo + tierNo,
            disabled = cell.hasClass("baygui-editor-cell-disabled") ? true : false;
        return { bayNo: bayNo, tierNo: tierNo, rowNo: rowNo, bayCellNo: bayCellNo, bayCell: cell, disabled: disabled };
    };











    //  $.baygui.viewer
    $.util.define(
        "$.baygui.viewer",
        {
            shipUrl: null,
            shipQueryParams: null,
            shipMethod: "post",
            baysUrl: null,
            baysQueryParams: null,
            baysMethod: "post",
            baysContainer: null,
            shipDataFilter: function (ship) { return genericShipDataFilter(this, ship); },
            baysDataFilter: function (array) { return genericBaysDataFilter(this, array); },

            onBeforeLoadBays: function (data) { },
            onLoadBays: function (data) { },
            onBeforeShowBay: function (bayNo) { },
            onShowBay: function (bayNo) { },

            loadBays: function (data) { return viewerLoadBays(this, data); },
            getBayDom: function (bayNo) { return viewerGetBayDom(this, bayNo); },
            showBay: function (bayNo) { return viewerShowBay(this, bayNo); },

            cell: { width: 30, height: 24, ruleXH: 20, ruleYW: 20 }
        },
        function (options) {
            return initBays(this, options);
        }
    );





    function loadViewerBayPanelGrid(bays, body, bayNo, size, otherSize, isDeck) {
        //  isOdd 表示当前局部贝位区域的x尺寸是不是奇数，如果是奇数则存在 "00" 行位；
        var isOdd = $.number.isOdd(size.width),
            grid = $("<table class=\"baygui-viewer-grid\" cellpadding=\"0\" cellspacing=\"0\"></table>").attr({
                bayNo: bayNo, position: isDeck ? "deck" : "under"
            }).appendTo(body);
        //  下面这个循环添加贝位单元格
        for (var i = 1; i <= size.height; i++) {
            var tierNo = $.string.padLeft(i * 2 + (isDeck ? 80 : 0), 2, "0"),
                tr = $("<tr class=\"baygui-viewer-row\"></tr>").attr("tierNo", tierNo).prependTo(grid);
            for (var j = 0; j < size.width; j++) {
                var rowNo = isOdd ? j : j + 1,
                    method = $.number.isOdd(rowNo) ? "appendTo" : "prependTo";
                rowNo = $.string.padLeft(rowNo, 2, "0");
                $("<td class=\"baygui-viewer-cell\"><div class=\"baygui-viewer-cell-item\">&nbsp;</div></td>").attr("rowNo", rowNo)[method](tr);
            }
            $("<td class=\"baygui-viewer-cell baygui-viewer-cell-ruley\">&nbsp;</td>").text(tierNo).prependTo(tr);
        }
        //  下面这个循环添加贝位标尺
        var ruleX = $("<tr class=\"baygui-viewer-row baygui-viewer-cell-rulex\"></tr>")[isDeck ? "prependTo" : "appendTo"](grid);
        for (var i = 0; i < size.width; i++) {
            var rowNo = isOdd ? i : i + 1, text = $.string.padLeft(rowNo, 2, "0"),
                method = $.number.isOdd(rowNo) ? "appendTo" : "prependTo";
            $("<td class=\"baygui-viewer-cell\"></td>").text(text)[method](ruleX);
        }
        $("<td class=\"baygui-viewer-cell baygui-viewer-cell-ruley\">&nbsp;</td>").prependTo(ruleX);
        //  下面这段代码设置当贝位区域上下两个局部如果尺寸x不相等，则在尺寸x短的那个贝位局部区域左右两侧填充占位单元格
        var xDiff = otherSize.width - size.width;
        if (xDiff > 0) {
            for (var i = xDiff; i > 0; i -= 2) {
                grid.find("tr.baygui-viewer-row").each(function () {
                    var tr = this, jqTr = $(this), ruley = jqTr.find("td.baygui-viewer-cell-ruley"),
                        indentA = $("<td class=\"baygui-viewer-cell-indent\"></td>").insertAfter(ruley),
                        indentB = $("<td class=\"baygui-viewer-cell-indent\"></td>").appendTo(tr);
                    if (i < 2) {
                        indentA.addClass("baygui-viewer-cell-indent-half");
                        indentB.addClass("baygui-viewer-cell-indent-half");
                    }
                });
            }
        }
    };

    function appendBayPartal(bays, bay, baySize, max) {
        var width = max.width * ($.baygui.viewer.defaults.cell.width + 1) + $.baygui.viewer.defaults.cell.ruleYW + 50,
            height = max.height * $.baygui.viewer.defaults.cell.height + ($.baygui.viewer.defaults.cell.ruleXH * 2) + 50,
            container = $("<div class=\"baygui-viewer-container\"></div>"),
            li = $("<li class=\"baygui-viewer-item\"></li>").css({
                width: width, height: height
            }).attr("bayNo", bay.bayNo).append(container).appendTo(bays.ul),
            title = getBayTitle(bay.bayNo, bay.isEdge);
        if (bay.isEdge) { li.attr("isEdge", true); }
        $("<h4 class=\"baygui-viewer-item-title\"></h4>").text(title).appendTo(container);
        var deck = baySize.deck, under = baySize.under, union = baySize.union,
            panelWidth = union.width * ($.baygui.viewer.defaults.cell.width + 1) + 20,
            deckPanel = $("<div class=\"baygui-viewer-panel\"></div>").attr("position", "deck").attr("bayNo", bay.bayNo).appendTo(container).css("width", panelWidth),
            line = $("<hr class=\"baygui-viewer-line\"/>").appendTo(container).css("width", panelWidth),
            undePanel = $("<div class=\"baygui-viewer-panel\"></div>").attr("position", "under").attr("bayNo", bay.bayNo).appendTo(container).css("width", panelWidth);
        loadViewerBayPanelGrid(bays, deckPanel, bay.bayNo, deck, under, true);
        loadViewerBayPanelGrid(bays, undePanel, bay.bayNo, under, deck, false);
        li.on("click", function () { bays.showBay(bay.bayNo); });
    };

    function viewerLoadBays(bays, data) {
        if (!data || !data.ship || !$.isArray(data.bays)) { return window.alert("初始化 BayGUI 编辑器组件失败，传入的参数 data 不是一个符合格式规范要求的对象"); }
        if ($.isFunction(bays.onBeforeLoadBays) && bays.onBeforeLoadBays.call(bays, data) == false) { return; }
        bays.ship = data.ship;
        bays.bays = data.bays;
        bays.sizeList = $.array.map(bays.bays, function (val) { return castBaySizeParam(val); });
        var widthList = $.array.map(bays.sizeList, function (val) { return val.union.width; }),
            heightList = $.array.map(bays.sizeList, function (val) { return val.union.height; }),
            maxWidth = $.array.max(widthList), maxHeight = $.array.max(heightList),
            maxSize = { width: maxWidth, height: maxHeight };
        bays.baysContainer.empty();
        bays.title = $("<h3 class=\"baygui-viewer-title\"></h3>").text(bays.ship.code + ", " + bays.ship.name).appendTo(bays.baysContainer);
        bays.ul = $("<ul class=\"baygui-viewer-list\"></ul>").appendTo(bays.baysContainer);
        $.each(bays.bays, function (index, bay) { appendBayPartal(bays, bay, bays.sizeList[index], maxSize); });
        refreshBaysCellStatus(bays);
        if ($.isFunction(bays.onLoadBays)) { bays.onLoadBays.call(bays, data); }
    };

    function refreshBaysCellStatus(bays) {
        var cells = castBaysToArray(bays.bays);
        $.each(cells, function (i, cell) {
            if (cell.disabled) {
                bays.baysContainer.find("table[bayNo=" + cell.bayNo + "] tr[tierNo=" + cell.tierNo + "] td[rowNo=" + cell.rowNo + "]").addClass("baygui-viewer-cell-disabled").attr("disabled", true);
            }
        });
    };


    function viewerGetBayDom(bays, bayNo) {
        return bays.ul.find("li.baygui-viewer-item[bayNo=" + bayNo + "]");
    };

    function viewerShowBay(bays, bayNo) {
        var li = bays.getBayDom(bayNo);
        if (!li.length) { return $.messager.show("传入的贝位号不存在"); }
        if ($.isFunction(bays.onBeforeShowBay) && bays.onBeforeShowBay.call(bays, bayNo) == false) { return; }
        var container = li.find("div.baygui-viewer-container"),
            width = container.find("hr.baygui-viewer-line").width() * 2 + 100, height = container.height() * 2 + 100,
            dia = $.easyui.showDialog({
                title: "贝位图查看：Bay" + bayNo, enableSaveButton: false, enableApplyButton: false,
                width: width, height: height,
                content: "<div class=\"baygui-viewer-dialog-body\"></div>"
            });
        $.util.exec(function () {
            var body = dia.find("div.baygui-viewer-dialog-body");
            container.clone().css("zoom", 2).appendTo(body);
            if ($.isFunction(bays.onShowBay)) { bays.onShowBay.call(bays, bayNo); }
        });
    };



    var css =
        ".baygui-editor-layout {}" +
        ".baygui-editor-form { padding: 10px; }" +
        ".baygui-editor-container { margin: 0px auto; position: absolute; display: table; }" +
        ".baygui-editor-wrapper { padding: 0px; margin: 0px; border-width: 0px; }" +
        ".baygui-editor-row { height: " + $.baygui.editor.defaults.cell.height + "px; }" +
        ".baygui-editor-cell-rulex, .baygui-editor-cell-ruley, .baygui-editor-cell-indent { background-color: #efefef; background: linear-gradient(to bottom,#F9F9F9 0,#efefef 100%); background-repeat: repeat-x; }" +
        ".baygui-editor-cell, .baygui-editor-cell-indent { width: " + $.baygui.editor.defaults.cell.width + "px; padding: 0px; margin: 0px; border-top-width: 0px; border-left-width: 0px; border-bottom-width: 1px; border-right-width: 1px; border-color: #ccc; border-style: dotted; }" +
        ".baygui-editor-cell:hover, .baygui-viewer-cell:hover { background-color: #CFE875; }" +
        ".baygui-editor-cell-rulex, .baygui-editor-cell-ruley, .baygui-editor-cell-indent, .baygui-viewer-cell-rulex, .baygui-viewer-cell-ruley, .baygui-viewer-cell-indent { text-align: center; }" +
        ".baygui-editor-cell-rulex { height: " + $.baygui.editor.defaults.cell.ruleXH + "px; }" +
        ".baygui-editor-cell-ruley { width: " + $.baygui.editor.defaults.cell.ruleYW + "px; }" +
        ".baygui-editor-cell-indent-half { width: " + ($.baygui.editor.defaults.cell.width / 2) + "px; }" +
        ".baygui-editor-cell-item { margin: 0px; padding: 0px; width: " + ($.baygui.editor.defaults.cell.width - 4) + "px; height: auto; }" +
        ".baygui-editor-cell-disabled { background-color: gray; }" +
        ".baygui-editor-cell-disabled:hover, .baygui-viewer-cell-disabled:hover { background-color: #247D22; }" +
        ".baygui-editor-cell-selected { background-color: #89be89; border-color: #red; }" +
        ".baygui-editor-cell-selected:hover { background-color: #87BF2A; }" +
        ".baygui-editor-cell-disabled.baygui-editor-cell-selected { background-color: #004219; }" +
        ".baygui-editor-cell-disabled.baygui-editor-cell-selected:hover { background-color: #0C6B0F; }" +

        ".baygui-viewer-title { padding: 5px 20px 5px 20px; margin: 0px; text-align: center; }" +
        ".baygui-viewer-list { padding: 10px 20px 10px 20px; }" +
        ".baygui-viewer-item { list-style-type: none; float: left; cursor: pointer; margin: 5px; border-width: 1px; border-color: #fff; border-style: solid; }" +
        ".baygui-viewer-item:hover { border-color: red; }" +
        ".baygui-viewer-item-title { font-weight: normal; margin: 0px; padding: 2px 5px 2px 5px; text-align: center; }" +
        ".baygui-viewer-container { margin: 0px; padding: 0px; }" +
        ".baygui-viewer-line { margin: 2px auto; }" +
        ".baygui-viewer-panel { margin: 0px auto; }" +
        ".baygui-viewer-grid { padding: 0px; margin: 0px; border-width: 0px; }" +
        ".baygui-viewer-grid tr:first-child td { border-top-width: 1px; }" +
        ".baygui-viewer-grid tr td:first-child { border-left-width: 1px; }" +

        ".baygui-viewer-row { height: " + $.baygui.viewer.defaults.cell.height + "px; }" +
        ".baygui-viewer-cell-rulex, .baygui-viewer-cell-ruley, .baygui-viewer-cell-indent { color: black; background-color: #B8B8B8; }" +
        ".baygui-viewer-cell, .baygui-viewer-cell-indent { width: " + $.baygui.viewer.defaults.cell.width + "px; padding: 0px; margin: 0px; border-top-width: 0px; border-left-width: 0px; border-bottom-width: 1px; border-right-width: 1px; border-color: black; border-style: solid; }" +
        ".baygui-viewer-cell-rulex { height: " + $.baygui.viewer.defaults.cell.ruleXH + "px; }" +
        ".baygui-viewer-cell-ruley { width: " + $.baygui.viewer.defaults.cell.ruleYW + "px; }" +
        ".baygui-viewer-cell-indent-half { width: " + ($.baygui.viewer.defaults.cell.width / 2) + "px; }" +
        ".baygui-viewer-cell-item { margin: 0px; padding: 0px; width: " + ($.baygui.viewer.defaults.cell.width - 4) + "px; height: auto; }" +
        ".baygui-viewer-cell-disabled { background-color: #B8B8B8; }" +
        "";
    $.util.addCss(css);

})(jQuery);