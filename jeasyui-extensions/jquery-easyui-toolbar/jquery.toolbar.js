/**
* jQuery EasyUI 1.3.4
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI toolbar Plugin Extensions 1.0 beta
* jQuery EasyUI toolbar 插件扩展
* jeasyui.plugins.toolbar.js
* 二次开发 流云
* 最近更新：2013-10-31
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*
* Copyright (c) 2013 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function initialize(target) {
        var t = $(target), isDiv = /^(?:div)$/i.test(target.nodeName),
            toolbar = isDiv ? t : $("<div></div>").insertAfter(t);
        if (!isDiv) {
            toolbar.attr({ "class": t.attr("class"), "style": t.attr("style") }).removeClass("easyui-toolbar");
            t.children().each(function () { toolbar[0].appendChild(this); });
            t.hide();
        }
        var state = $.data(target, "toolbar"), opts = state.options;
        state.toolbar = toolbar;
        t.addClass("toolbar-f");
        toolbar.addClass("dialog-toolbar toolbar");
        wrapItems(target);
        setSize(target, { width: opts.width, height: opts.height });
        toolbar.bind("_resize", function () {
            setSize(target);
        });
    };

    function wrapItems(target) {
        var t = $(target), state = $.data(target, "toolbar"),
            toolbar = state.toolbar, opts = state.options,
            cc = toolbar.children();
        state.wrapper = $("<table class='toolbar-wrapper' cellspacing='0' cellpadding='0' ></table>").appendTo(toolbar);
        appendItem(target, cc);
    };

    function setSize(target, size) {
        var t = $(target), state = $.data(target, "toolbar"),
            toolbar = state.toolbar, opts = state.options;
        size = $.extend({ width: opts.width, height: opts.height }, size || {});
        toolbar.css({
            width: size.width, height: size.height
        });
        $.extend(opts, size);
        $.util.exec(function () {
            setAlign(target, opts.align);
            setValign(target, opts.valign);
        });
        opts.onResize.call(target, $.isNumeric(size.width) ? size.width : toolbar.width(), $.isNumeric(size.height) ? size.height : toolbar.height());
    };

    function setAlign(target, align) {
        var t = $(target), state = $.data(target, "toolbar"),
            wrapper = state.wrapper, opts = state.options, left = 0;
        opts.align = align;
        wrapper.removeClass("toolbar-align-left toolbar-align-center toolbar-align-right");
        wrapper.addClass("toolbar-align-" + align);
        if (align == "center") {
            var toolbar = state.toolbar, tWidth = toolbar.width(), width = wrapper.width();
            left = Math.max((tWidth - width) / 2, 0);
        }
        wrapper.css("left", left);
    };

    function setValign(target, valign) {
        var t = $(target), state = $.data(target, "toolbar"),
            toolbar = state.toolbar, wrapper = state.wrapper, opts = state.options,
            tHeight = toolbar.height(), height = wrapper.height(), top;
        opts.valign = valign;
        switch (valign) {
            case "top": top = 0; break;
            case "middle": top = (tHeight - height) / 2; break;
            case "bottom": top = tHeight - height; break;
        }
        wrapper.css("top", Math.max(top, 0));
    };


    var itemTypes = {
        separator: {
            init: function (container) {
                return $("<div class='dialog-tool-separator'></div>").appendTo(container);
            }
        },
        label: {
            defaults: { text: " " },
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {});
                return $("<span class='toolbar-item-label'></span>").text(opts.text).appendTo(container);
            }
        },
        button: {
            defaults: { plain: true, iconCls: "icon-ok" },
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    fn = $.isFunction(opts.onclick) ? opts.onclick : ($.isFunction(opts.handler) ? opts.handler : null),
                    btn = $("<a class='toolbar-item-button'></a>").appendTo(container).linkbutton(opts);
                if ($.isFunction(fn)) { btn.click(function () { fn.call(this, container); }); }
                return btn;
            },
            enable: function (target) {
                $(target).linkbutton("enable");
            },
            disable: function (target) {
                $(target).linkbutton("disable");
            }
        },
        textbox: {
            defaults: { value: null, disabled: false, width: null },
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    box = $("<input type='text' class='toolbar-item-input' />").appendTo(container);
                if (opts.value) { this.setValue(box[0], opts.value); }
                if (opts.disabled) { this.disable(box[0]); }
                if (opts.width) { this.resize(box[0], opts.width); }
                return box;
            },
            setValue: function (target, value) {
                $(target).val(value);
            },
            getValue: function (target) {
                return $(target).val();
            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            },
            enable: function (target) {
                $(target).attr("disabled", true);
            },
            disable: function (target) {
                $(target).removeAttr("disabled", true);
            }
        },
        checkbox: {
            defaults: { checked: false, disabled: false, text: " " },
            init: function (container, options) {
                options = options || {};
                var opts = $.extend({}, this.defaults, $.util.isString(options) ? { text: options} : options),
                    label = $("<label class='toolbar-item-checkbox'></label>").appendTo(container),
                    box = $("<input type='checkbox' class='toolbar-item-checkbox-input' />").appendTo(label),
                    span = $("<span class='toolbar-item-checkbox-text'></span>").text(opts.text).appendTo(label);
                if (opts.checked) { this.setValue(box[0], opts.checked); }
                if (opts.disabled) { this.disable(box[0]); }
                return box;
            },
            setValue: function (target, value) {
                $(target).attr("checked", value ? true : false);
            },
            getValue: function (target) {
                return $(target)[0].checked;
            },
            enable: function (target) {
                var box = $(target), label = box.parent();
                box.removeAttr("disabled");
                label.find(">span.toolbar-item-checkbox-text").removeClass("toolbar-item-checkbox-disabled");
            },
            disable: function (target) {
                var box = $(target), label = box.parent();
                box.attr("disabled", true);
                label.find(">span.toolbar-item-checkbox-text").addClass("toolbar-item-checkbox-disabled");
            }
        },
        validatebox: {
            defaults: { value: null, disabled: false, width: null },
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    box = $("<input type='text' class='toolbar-item-input' />").appendTo(container).validatebox(opts);
                if (opts.value) { this.setValue(box[0], opts.value); }
                if (opts.disabled) { this.disable(box[0]); }
                if (opts.width) { this.resize(box[0], opts.width); }
                return box;
            },
            setValue: function (target, value) {
                $(target).val(value);
            },
            getValue: function (target) {
                return $(target).val();
            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            },
            enable: function (target) {
                $(target).removeAttr("disabled");
            },
            disable: function (target) {
                $(target).attr("disabled", true);
            }
        },
        numberbox: {
            defaults: { width: null },
            init: function (container, options) {
                var box = $("<input type='text' class='toolbar-item-input' />").appendTo(container).numberbox(options);
                if (options.width) { this.resize(box[0], options.width); }
                return box;
            },
            destroy: function (target) {
                $(target).numberbox("destroy");
            },
            setValue: function (target, value) {
                $(target).numberbox("setValue", value);
            },
            getValue: function (target) {
                return $(target).numberbox("getValue");
            },
            resize: function (target, width) {
                $(target)._outerWidth(width);
            },
            enable: function (target) {
                $(target).numberbox("enable");
            },
            disable: function (target) {
                $(target).numberbox("disable");
            }
        },
        datebox: {
            defaults: {},
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    box = $("<input type='text' class='toolbar-item-input' />").appendTo(container).datebox(opts);
                return box;
            },
            destroy: function (target) {
                $(target).datebox("destroy");
            },
            setValue: function (target, value) {
                $(target).datebox("setValue", value);
            },
            getValue: function (target) {
                return $(target).datebox("getValue");
            },
            resize: function (target, width) {
                $(target).datebox("resize", width);
            },
            enable: function (target) {
                $(target).datebox("enable");
            },
            disable: function (target) {
                $(target).datebox("disable");
            }
        },
        combobox: {
            defaults: {},
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    box = $("<input type='text' class='toolbar-item-input' />").appendTo(container).combobox(opts);
                return box;
            },
            destroy: function (target) {
                $(target).combobox("destroy");
            },
            setValue: function (target, value) {
                $(target).combobox($.isArray(value) ? "setValues" : "setValue", value);
            },
            getValue: function (target) {
                var combo = $(target), opts = combo.combobox("options");
                return $(target).combobox(opts.multiples ? "getValues" : "getValue");
            },
            resize: function (target, width) {
                $(target).combobox("resize", width);
            },
            enable: function (target) {
                $(target).combobox("enable");
            },
            disable: function (target) {
                $(target).combobox("disable");
            }
        },
        combotree: {
            defaults: {},
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    box = $("<input type='text' class='toolbar-item-input' />").appendTo(container).combotree(opts);
                return box;
            },
            destroy: function (target) {
                $(target).combotree("destroy");
            },
            setValue: function (target, value) {
                $(target).combotree($.isArray(value) ? "setValues" : "setValue", value);
            },
            getValue: function (target) {
                var combo = $(target), opts = combo.combotree("options");
                return $(target).combotree(opts.multiples ? "getValues" : "getValue");
            },
            resize: function (target, width) {
                $(target).combotree("resize", width);
            },
            enable: function (target) {
                $(target).combotree("enable");
            },
            disable: function (target) {
                $(target).combotree("disable");
            }
        },
        combogrid: {
            defaults: {},
            init: function (container, options) {
                var opts = $.extend({}, this.defaults, options || {}),
                    box = $("<input type='text' class='toolbar-item-input' />").appendTo(container).combogrid(opts);
                return box;
            },
            destroy: function (target) {
                $(target).combogrid("destroy");
            },
            setValue: function (target, value) {
                $(target).combogrid($.isArray(value) ? "setValues" : "setValue", value);
            },
            getValue: function (target) {
                var combo = $(target), opts = combo.combogrid("options");
                return $(target).combogrid(opts.multiples ? "getValues" : "getValue");
            },
            resize: function (target, width) {
                $(target).combogrid("resize", width);
            },
            enable: function (target) {
                $(target).combogrid("enable");
            },
            disable: function (target) {
                $(target).combogrid("disable");
            }
        }
    };
    var itemOptions = {
        id: null,
        type: "button",
        options: null,
        style: null,
        itemCls: null,
        width: null,
        align: null
    };


    function appendItemDOM(target, item) {
        var t = $(target), state = $.data(target, "toolbar"),
            tr = state.wrapper.find("tr:last"),
            cell = $(item).addClass("toolbar-item"),
            text = cell.text();
        if (!tr.length) { tr = $("<tr class='toolbar-row'></tr>").appendTo(state.wrapper); }
        if (/^(?:div|span)$/i.test(cell[0].nodeName) && $.array.contains(["-", "—", "|"], text)) {
            cell.addClass("dialog-tool-separator").text("");
        }
        $("<td class='toolbar-item-container'></td>").append(cell).appendTo(tr);
    };
    function appendItemString(target, str) {
        if (!str) { return; }
        if ($.array.contains(["-", "—", "|"], str)) {
            appendItemDOM(target, $("<span>-</span>")[0]);
        } else if ($.string.isHtmlText(str)) {
            $(str).each(function () { appendItemDOM(target, this); });
        } else {
            appendItemObject(target, { type: "label", options: { text: str} });
        }
    };
    function appendItemObject(target, options) {
        var opts = $.extend({}, itemOptions, options || {}),
            t = $(target), state = $.data(target, "toolbar"),
            tr = state.wrapper.find("tr:last");
        if (!tr.length) { tr = $("<tr class='toolbar-row'></tr>").appendTo(state.wrapper); }
        var td = $("<td class='toolbar-item-container'></td>").appendTo(tr),
            container = td[0],
            builder = state.options.itemTypes[opts.type];
        var item = builder.init(container, opts.options || opts).addClass("toolbar-item");
        if (opts.id != null && opts.id != undefined) { item.attr("id", opts.id); }
        if (opts.itemCls) { td.addClass(opts.itemCls); }
        if (opts.style) { td.css(opts.style); }
        if (opts.width) { td.css("width", opts.width); }
        if (opts.align) { td.css("text-align", opts.align); }
        $.data(item[0], "toolbar-item-builder", builder);
    }

    function appendItem(target, item, dontSize, index) {
        if (!item) { return; }
        if ($.util.isJqueryObject(item) && item.length) {
            item.each(function () {
                appendItemDOM(target, this, index);
            });
        } else if ($.util.isDOM(item)) {
            appendItemDOM(target, item, index);
        } else if ($.util.isString(item)) {
            appendItemString(target, item, index);
        } else if ($.util.likeArray(item)) {
            $.each(item, function (i, n) {
                appendItem(target, n, true, index);
            });
        } else if ($.isFunction(item)) {
            appendItem(target, item.call(target), true, index);
        } else {
            appendItemObject(target, item, index);
        }
        if (!dontSize) { setSize(target); }
    };


    function removeItem(target, index) {
        if (!$.isNumeric(index)) { return; }
        var t = $(target), wrapper = t.toolbar("wrapper"), tr = wrapper.find("tr:last");
        if (tr.length) {
            var td = tr.find(">td");
            if (td.length >= index && td.length < index) {
                var container = td.eq(index), item = container.find(".toolbar-item"), builder = $.data(item[0], "toolbar-item-builder");
                if (builder && $.isFunction(builder.destroy)) { builder.destroy(item[0]); }
                container.remove();
            }
        }
    };

    function updateItem(target, param) { };


    var loader = function (param, success, error) {
        var opts = $(this).toolbar("options");
        if (!opts.url) {
            return false;
        }
        $.ajax({
            type: opts.method, url: opts.url, data: param, dataType: "json",
            success: function (data) {
                success(data);
            }, error: function () {
                error.apply(this, arguments);
            }
        });
    };
    var loadFilter = function (data) {
        data = $.array.likeArray && !$.util.isString(data) ? data : [];
        return $.array.map(data, function (val) {
            return $.extend({}, itemOptions, val || {});
        });
    };



    $.fn.toolbar = function (options, param) {
        if (typeof options == "string") {
            return $.fn.toolbar.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "toolbar");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "toolbar", {
                    options: $.extend({}, $.fn.toolbar.defaults, $.fn.toolbar.parseOptions(this), options)
                });
            }
            initialize(this);
        });
    };

    $.fn.toolbar.parseOptions = function (target) {
        return $.extend({}, $.parser.parseOptions(target, ["width", "height", "align", "valign", "itemTypes"]));
    };

    $.fn.toolbar.methods = {

        options: function (jq) { return $.data(jq[0], 'toolbar').options; },

        resize: function (jq, size) { return jq.each(function () { setSize(this, size); }); },

        align: function (jq, align) { return jq.each(function () { setAlign(this, align); }); },

        valign: function (jq, valign) { return jq.each(function () { setValign(this, valign); }); },

        wrapper: function (jq) { return $.data(jq[0], "toolbar").wrapper; },

        toolbar: function (jq) { return $.data(jq[0], "toolbar").toolbar; },

        //  在当前的 easyui-toolbar 中增加一个工具栏项；该方法的参数 item 可以定义为如下类型：
        //      1、jQuery-DOM 对象：
        //      2、HTML-DOM 对象：
        //      3、String 类型：可以为以下类型：
        //          a："-"、"—"、"|"，表示分割线的 separator
        //          b："<" 开头和 ">" 结尾切字符串度大于等于3，表示 HTML 代码段；
        //          c："\t"、"\n"，表示换行
        //          d：其他长度大于 0 的字符串，表示 label。
        //      4、JSON-Object 对象：
        //          id      : 
        //          type    : $.fn.toolbar.defaults.itemTypes 中定义的工具栏项类型，例如 separator、label、button、textbox、checkbox、numberbox、validatebox、combobox、combotree、combogrid 等；
        //          options : 初始化该工具栏项的参数；
        //          style   :
        //          itemCls :
        //          width   :
        //          align   :
        //      5、Array 数组类型：
        //  返回值：返回表示当前 easyui-toolbar 控件的 jQuery 链式对象。
        appendItem: function (jq, item) { return jq.each(function () { appendItem(this, item); }); },

        removeItem: function (jq, index) { return jq.each(function () { removeItem(this, index); }); },

        //  将当前 easyui-toolbar 中指定位置的工具栏项替换成另一个工具栏项；该方法的参数 param 为一个 JSON-Object，包含如下属性定义：
        //      index:  表示要替换的工具栏项的索引号，从 0 开始计数；
        //      item:   参考 appendItem 方法的参数 item。
        //  返回值：返回表示当前 easyui-toolbar 控件的 jQuery 链式对象。
        updateItem: function (jq, param) { return jq.each(function () { updateItem(this, param); }); },

        enableItem: function (jq, index) { },

        disableItem: function (jq, index) { },

        enable: function (jq) { },

        disable: function (jq) { },

        empty: function (jq) { },

        load: function (jq, queryParams) { },

        reload: function (jq) { },

        loadData: function (jq, data) { },

        items: function (jq) { },

        getItem: function (jq, index) { },

        findItem: function (jq, id) { },

        getData: function (jq) { }
    };

    $.fn.toolbar.defaults = {

        method: "post",

        url: null,

        data: null,

        loader: loader,

        loadFilter: loadFilter,

        //  表示 easyui-toolbar 控件的宽度，Number 类型数值；默认为 auto；
        width: "auto",

        //  表示 easyui-toolbar 控件的高度，Number 类型数值；默认为 auto；
        height: "auto",

        //  表示 easyui-toolbar 控件的横向对齐方式，可选的值为 "left"、"center" 或 "right"；默认为 "left"；
        align: "left",

        //  表示 easyui-toolbar 控件的纵向对齐方式，可选的值为 "top"、"middle" 或 "bottom"；默认为 "middle"；
        valign: "middle",

        //  表示 easyui-toolbar 的尺寸大小重置事件；当控件大小被调整后触发；该事件回调函数定义如下参数：
        //      width: 被设置的新的宽度；
        //      height: 被设置的新的告诉。
        //  回调函数中的 this 表示当前 easyui-toolbar 的 DOM 对象。
        onResize: function (width, height) { },

        //  定义 easyui-toolbar 插件能够添加的工具栏项类型；
        //  开发人员可以通过扩展 $.fn.toolbar.defaults.itemTypes 属性来实现其自定义的 easyui-toolbar 工具栏项类型；
        //      就像扩展 $.fn.datagrid.defaults.editors 一样。
        //  已经内置的工具栏项类型有：
        //      separator   :
        //      label       :
        //      button      :
        //      textbox     :
        //      checkbox    :
        //      validatebox :
        //      numberbox   :
        //      datebox     :
        //      combobox    :
        //      combotree   :
        //      combogrid   :
        itemTypes: itemTypes,

        onLoadSuccess: function (data) { },

        onLoadError: function () { },

        onBeforeLoad: function (param) { }
    };



    $.parser.plugins.push("toolbar");


    var css =
        ".toolbar-f {}" +
        ".toolbar { width: auto; height: auto; min-height: 26px; overflow: hidden; }" +
        ".toolbar-wrapper { position: relative; }" +
        ".toolbar-wrapper td .dialog-tool-separator { height: 22px; margin-left: 2px; margin-right: 2px; }" +
        ".toolbar-align-left { float: left; }" +
        ".toolbar-align-center {}" +
        ".toolbar-align-right { float: right; }" +

        ".toolbar-row {}" +
        ".toolbar-item-container { padding-left: 1px; padding-right: 1px; }" +
        ".toolbar-item, .toolbar-item>* { vertical-align: middle; }" +
        ".toolbar-item-label {}" +
        ".toolbar-item-input {}" +
        ".toolbar-item-button {}" +
        ".toolbar-item-checkbox {}" +
        ".toolbar-item-checkbox-input {}" +
        ".toolbar-item-checkbox-text {}" +
        ".toolbar-item-checkbox-disabled {}" +
        "";
    $.util.addCss(css);

})(jQuery);