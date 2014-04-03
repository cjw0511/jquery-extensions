/**
* jQuery EasyUI 1.3.5
* Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI ueditor Plugin Extensions 1.0 beta
* jQuery EasyUI ueditor 插件扩展
* jquery.ueditor.js
* 二次开发 流云
* 最近更新：2014-04-02
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late
*   3、
*   4、
*   5、
*
* Copyright (c) 2013-2014 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function create(target) {
        var t = $(target).addClass("ueditor-f").hide(),
            text = target.innerText, cc = t.children(),
            state = $.data(target, "ueditor"), opts = state.options,
            name = t.attr("name"), id = state.editorId = "ueditor_" + $.util.guid("N"),
            isDiv = /^(?:div)$/i.test(target.nodeName),
            ueditor = state.ueditor = isDiv ? t : $("<div class=\"ueditor\"></div>").insertAfter(t).hide(),
            wrapper = state.wrapper = $("<textarea></textarea>").insertAfter(ueditor).attr("id", id);
        if (name) {
            t.attr("ueditorName", name).removeAttr("name");
            wrapper.attr("name", name);
        }
        if (text) { wrapper.text(text); }
        cc.each(function () { wrapper.append(this); });

        if (opts.value) {
            wrapper.empty();
            opts.initialContent = opts.value;
        }
        opts.originalValue = opts.initialContent;
        if (opts.templet) {
            opts.toolbars = opts.toolbarsTemplet[opts.templet]
        }
        state.editor = UE.getEditor(id, opts);

        initialEvents(target);
        initialState(target);
    };

    function initialEvents(target) {
        var state = $.data(target, "ueditor"), opts = state.options;
        $.each($.fn.ueditor.events, function (i, n) {
            var eventName = "on" + n, e = opts[eventName];
            state.editor.addListener(n, function () {
                if ($.isFunction(e)) { e.apply(target, arguments); }
                if (n == "contentChange") {
                    var val = opts.value = $(target).ueditor("getValue");
                    state.wrapper.val(val);
                }
            });
        });
    };

    function initialState(target) {
        var state = $.data(target, "ueditor"), opts = state.options, checkCount = 10;
        state.ueditor.bind('_resize', function () {
            if (opts.fit == true) {
                setSize(target);
            }
            return false;
        });
        $.util.exec(checkState);
        function checkState() {
            state.edui = state.wrapper.prev();
            state.eduieditor = state.edui.find(">div.edui-editor");
            state.toolbarbox = state.eduieditor.find(">div.edui-editor-toolbarbox");
            state.iframeholder = state.eduieditor.find(">div.edui-editor-iframeholder");
            state.bottomContainer = state.eduieditor.find(">div.edui-editor-bottomContainer");
            state.scalelayer = state.eduieditor.find(">div[id$=scalelayer]");

            if (state.editor.iframe && state.editor.iframe.parentNode && state.editor.iframe.parentNode.style && state.editor.body) {
                setSize(target);
                if (opts.disabled) { disable(target); }
            } else {
                if (--checkCount) {
                    $.util.exec(checkState, 100);
                }
            }
        };
    };




    function setSize(target) {
        var t = $(target), opts = t.ueditor("options");
        opts.fit ? $.extend(opts, t._fit()) : t._fit(false);
        resize(target, { width: opts.width, height: opts.height });
    };

    function setWidth(target, width) {
        var t = $(target), state = $.data(target, "ueditor"),
            opts = t.ueditor("options"), editor = t.ueditor("editor");
        opts.width = width;
        state.iframeholder.width(width);
        state.eduieditor.width(width);
    };

    function setHeight(target, height) {
        var t = $(target), state = $.data(target, "ueditor"),
            opts = t.ueditor("options"), editor = t.ueditor("editor"),
            vheight = opts.holderHeight = height - state.toolbarbox.height() - state.bottomContainer.height() - state.scalelayer.height();
        opts.height = height;
        editor.setHeight(vheight);
    };

    function resize(target, param) {
        var t = $(target), opts = t.ueditor("options"),
            size = $.extend({ width: opts.width, height: opts.height }, param || {});
        setWidth(target, size.width);
        setHeight(target, size.height);
        if ($.isFunction(opts.onResize)) { opts.onResize.call(target, size.width, size.height); }
    };



    function enableEditor(target, except) {
        var state = $.data(target, "ueditor"), opts = state.options;
        opts.disabled = false;
        return state.editor.setEnabled(except);
    };

    function disableEditor(target, except) {
        var state = $.data(target, "ueditor"), opts = state.options;
        opts.disabled = true;
        return state.editor.setDisabled(except);
    };

    function showEditor(target) {
        var state = $.data(target, "ueditor"), opts = state.options;
        opts.isShow = true;
        return state.editor.setShow();
    };

    function hideEditor(target) {
        var state = $.data(target, "ueditor"), opts = state.options;
        opts.isShow = false;
        return state.editor.setHide();
    };


    function destroy(target) {
        var t = $(target), state = $.data(target, "ueditor");
        state.editor.destroy();
        if (state.ueditor) { state.ueditor.remove(); }
        if (state.wrapper) { state.wrapper.remove(); }
        t.remove();
    };

    function sync(target, formId) {
        var state = $.data(target, "ueditor");
        if (formId) {
            return state.editor.sync();
        } else {
            return state.editor.sync(formId);
        }
    };

    function addshortcutkey(target, param) {
        var state = $.data(target, "ueditor");
        return state.editor.addshortcutkey(param);
    };

    function setFocus(target, toEnd) {
        var state = $.data(target, "ueditor");
        if (typeof toEnd == "boolean") {
            return state.editor.focus(toEnd);
        } else {
            return state.editor.focus();
        }
    };

    function execCommand(target, cmdName) {
        var state = $.data(target, "ueditor");
        return state.editor.execCommand(cmdName);
    };

    function queryCommandState(target, cmdName) {
        var state = $.data(target, "ueditor");
        return state.editor.queryCommandState(cmdName);
    };

    function queryCommandValue(target, cmdName) {
        var state = $.data(target, "ueditor");
        return state.editor.queryCommandValue(cmdName);
    };

    function hasContents(target, tags) {
        var state = $.data(target, "ueditor");
        if (tags) {
            var array = $.util.likeArrayNotString(tags) ? tags : []
            return state.editor.hasContents(array);
        } else {
            return state.editor.hasContents();
        }
    };

    function reset(target) {
        var state = $.data(target, "ueditor"), opts = state.options;
        setValue(target, opts.originalValue);
        return state.editor.reset();
    };

    function getLang(target, path) {
        var state = $.data(target, "ueditor");
        return state.editor.getLang(path);
    };

    function getContentLength(target, ingoneHtml) {
        var state = $.data(target, "ueditor");
        if (typeof ingoneHtml == "boolean") {
            return state.editor.getContentLength(ingoneHtml);
        } else {
            return state.editor.getContentLength();
        }
    };

    function addInputRule(target, rule) {
        var state = $.data(target, "ueditor");
        return state.editor.addInputRule(rule);
    };

    function addOutputRule(target, rule) {
        var state = $.data(target, "ueditor");
        return state.editor.addOutputRule(rule);
    };





    function getValue(target, param) {
        var state = $.data(target, "ueditor"), opts = state.options;
        return $(target).ueditor(opts.valueMethod, param);
    };

    function getContent(target, filter) {
        var state = $.data(target, "ueditor");
        return $.isFunction(filter) ? state.editor.getContent(filter) : state.editor.getContent();
    };

    function getAllHtml(target) {
        var state = $.data(target, "ueditor");
        return state.editor.getAllHtml();
    };

    function getPlainTxt(target) {
        var state = $.data(target, "ueditor");
        return state.editor.getPlainTxt();
    };

    function getContentTxt(target) {
        var state = $.data(target, "ueditor");
        return state.editor.getContentTxt();
    };


    function setValue(target, value, isAppendTo) {
        var state = $.data(target, "ueditor");
        if (isAppendTo) {
            return state.editor.setContent(value, true);
        } else {
            return state.editor.setContent(value);
        }
    };

    function setContent(target, param) {
        var state = $.data(target, "ueditor");
        param = param || "";
        if (typeof param == "string") {
            return state.editor.setContent(param);
        } else {
            return state.editor.setContent(param.value, param.isAppendTo);
        }
    };

    function clear(target) {
        var state = $.data(target, "ueditor");
        state.editor.execCommand("cleardoc");
    };




    $.fn.ueditor = function (options, param) {
        if (typeof options == "string") {
            return $.fn.ueditor.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "ueditor");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "ueditor", { options: $.extend({}, $.fn.ueditor.defaults, $.fn.ueditor.parseOptions(this), options) });
                create(this);
            }
        });
    };


    $.fn.ueditor.events = [
            "ready", "destroy", "reset", "focus", "langReady",
            "beforeExecCommand", "afterExecCommand", "firstBeforeExecCommand",
            "beforeGetContent", "afterGetContent", "getAllHtml", "beforeSetContent", "afterSetContent",
            "selectionchange", "beforeSelectionChange", "afterSelectionChange", "contentChange"
    ];
    $.fn.ueditor.config = window.UEDITOR_CONFIG;
    $.fn.ueditor.toolbars = [[
        'fullscreen', 'source', '|', 'undo', 'redo', '|',
        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
        'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
        'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
        'directionalityltr', 'directionalityrtl', 'indent', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
        'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'gmap', 'insertframe', 'insertcode', 'webapp', 'pagebreak', 'template', 'background', '|',
        'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
        'print', 'preview', 'searchreplace', 'help', 'drafts'
    ]];
    $.fn.ueditor.properties = [
        "toolbars", "enableAutoSave", "saveInterval"
    ];
    $.fn.ueditor.parseOptions = function (target) {
        var t = $(target);
        return $.extend({}, $.parser.parseOptions(target, [
            "lang", "theme", "charset", "initialContent", "textarea", "wordCountMsg", "tabNode", "sourceEditor", "value", "templet", "valueMethod",
            {
                enableAutoSave: "boolean", isShow: "boolean", focus: "boolean", fullscreen: "boolean", readonly: "boolean",
                imagePopup: "boolean", emotionLocalization: "boolean", pasteplain: "boolean", wordCount: "boolean", elementPathEnabled: "boolean",
                autoHeightEnabled: "boolean", scaleEnabled: "boolean", tableDragable: "boolean", sourceEditorFirst: "boolean", fit: "boolean", disabled: "boolean"
            },
            { saveInterval: "number", zIndex: "number", maximumWords: "number", tabSize: "number", width: "number", height: "number" }
        ]));
    };


    $.fn.ueditor.methods = {

        options: function (jq) { return $.data(jq[0], "ueditor").options; },

        editor: function (jq) { return $.data(jq[0], "ueditor").editor; },

        wrapper: function (jq) { return $.data(jq[0], "ueditor").wrapper; },

        resize: function (jq, size) { return jq.each(function () { resize(this, size); }); },


        //  销毁编辑器实例，使用textarea代替
        destroy: function (jq) { return jq.each(function () { destroy(this); }); },

        //  同步数据到编辑器所在的form 从编辑器的容器节点向上查找form元素
        //      若找到，就同步编辑内容到找到的form里，为提交数据做准备，主要用于是手动提交的情况 后台取得数据的键值，使用你容器上的name属性
        //      如果没有就使用参数里的textarea项
        sync: function (jq, formId) { return jq.each(function () { sync(this, formId); }); },

        //  为编辑器的编辑命令提供快捷键 这个接口是为插件扩展提供的接口,主要是为新添加的插件，如果需要添加快捷键，所提供的接口
        //  该方法的参数 param 表示命令名和快捷键键值对对象，多个按钮的快捷键用“＋”分隔，格式如 { "Bold" : "ctrl+66", "Italic" : "ctrl+73" }
        addshortcutkey: function (jq, param) { return jq.each(function () { return jq.each(function () { addshortcutkey(this, param); }); }); },

        //  获取编辑器的内容。 可以通过参数定义编辑器内置的判空规则
        getContent: function (jq, filter) { return getContent(jq[0], filter); },

        //  取得完整的html代码，可以直接显示成完整的html文档
        getAllHtml: function (jq) { return getAllHtml(jq[0]); },

        //  得到编辑器的纯文本内容，但会保留段落格式
        getPlainTxt: function (jq) { return getPlainTxt(jq[0]); },

        //  获取编辑器中的纯文本内容,没有段落格式
        getContentTxt: function (jq) { return getContentTxt(jq[0]); },

        //  设置编辑器的内容，可修改编辑器当前的html内容；该方法的参数 param 可以为以下类型；
        //      String：value
        //      Object：{ value, isAppendTo }
        setContent: function (jq, param) { return jq.each(function () { setContent(this, param); }); },

        //  让编辑器获得焦点，默认focus到编辑器头部，toEnd确定focus位置
        focus: function (jq, toEnd) { return jq.each(function () { setFocus(this, toEnd); }); },

        //  执行编辑命令cmdName，完成富文本编辑效果
        execCommand: function (jq, cmdName) { return execCommand(jq[0], cmdName); },

        //  根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
        queryCommandState: function (jq, cmdName) { return queryCommandState(jq[0], cmdName); },

        //  根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
        queryCommandValue: function (jq, cmdName) { return queryCommandValue(jq[0], cmdName); },

        //  检查编辑区域中是否有内容，若包含参数tags中的节点类型，直接返回true
        hasContents: function (jq, tags) { return hasContents(jq[0], tags); },

        //  重置编辑器，可用来做多个tab使用同一个编辑器实例
        reset: function (jq) { return jq.each(function () { reset(this); }); },

        //  设置当前编辑区域可以编辑,except中的命令除外
        setEnabled: function (jq, except) { return jq.each(function () { enableEditor(this, except); }); },

        //  设置当前编辑区域不可编辑,except中的命令除外
        setDisabled: function (jq, except) { return jq.each(function () { disableEditor(this, except); }); },

        //  显示编辑器
        setShow: function (jq) { return jq.each(function () { showEditor(this); }); },

        //  隐藏编辑器
        setHide: function (jq) { return jq.each(function () { hideEditor(this); }); },

        //  根据指定的路径，获取对应的语言资源
        getLang: function (jq, path) { return getLang(jq[0], path); },

        //  计算编辑器html内容或纯文本字符串的长度
        getContentLength: function (jq, ingoneHtml) { return getContentLength(jq[0], ingoneHtml); },

        //  注册输入过滤规则
        addInputRule: function (jq, rule) { return jq.each(function () { addInputRule(this, rule); }); },

        //  注册输出过滤规则
        addOutputRule: function (jq, rule) { return jq.each(function () { addOutputRule(this, rule); }); },


        //  同 setShow 方法
        show: function (jq) { return jq.each(function () { showEditor(this); }); },

        //  同 setHide 方法
        hide: function (jq) { return jq.each(function () { hideEditor(this); }); },

        //  同 setEnabled 方法
        enable: function (jq, except) { return jq.each(function () { enableEditor(this, except); }); },

        //  同 setDisabled 方法
        disable: function (jq, except) { return jq.each(function () { disableEditor(this, except); }); },

        //  
        getValue: function (jq, param) { return getValue(jq[0], param); },

        //
        setValue: function (jq, value) { return jq.each(function () { setValue(this, value); }); },

        //
        append: function (jq, value) { return jq.each(function () { setValue(this, value, true); }); },

        //  同 focus 方法；
        setFocus: function (jq, toEnd) { return jq.each(function () { setFocus(this, toEnd); }); },

        //  清空文档
        clear: function (jq) { return jq.each(function () { clear(this); }); }
    };

    $.fn.ueditor.defaults = {

        //  工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
        toolbars: $.fn.ueditor.toolbars,
        //  语言配置项,默认是zh-cn
        lang: "zh-cn",
        //  是否启用自动保存
        enableAutoSave: true,
        //  自动保存间隔时间， 单位ms
        saveInterval: 500,
        //  主题配置项,默认是default。
        theme: "default",
        //  针对getAllHtml方法，会在对应的head标签中增加该编码设置。
        charset: "utf-8",
        //  常用配置项目
        isShow: true,
        //  初始化编辑器的内容,也可以通过textarea/script给值，看官网例子
        initialContent: "",
        //  提交表单时，服务器获取编辑器提交内容的所用的参数
        textarea: "editorValue",
        //  初始化时，是否让编辑器获得焦点true或false
        focus: false,
        //  是否开启初始化时即全屏，默认为 false
        fullscreen: false,
        //  编辑器初始化结束后,编辑区域是否是只读的，默认是false
        readonly: false,
        //  编辑器层级的基数,默认是900
        zIndex: 900,
        //  图片操作的浮层开关，默认打开
        imagePopup: true,
        //  是否开启表情本地化，默认关闭。若要开启请确保emotion文件夹下包含官网提供的images表情文件夹
        emotionLocalization: true,
        //  是否默认为纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴
        pasteplain: false,
        //  字号列表
        fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36],
        //  段落格式列表，值留空时支持多语言自动识别，若配置，则以配置值为准
        paragraph: { p: "", h1: "", h2: "", h3: "", h4: "", h5: "", h6: "" },
        //  段前间距 值和显示的名字相同
        rowspacingtop: ['5', '10', '15', '20', '25'],
        //  段后间距 值和显示的名字相同
        rowspacingbottom: ['5', '10', '15', '20', '25'],
        //行内间距 值和显示的名字相同
        lineheight: ['1', '1.5', '1.75', '2', '3', '4', '5'],
        //快捷菜单，即选中部分文字后浮现出的快捷菜单内容
        shortcutMenu: ["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"],
        //  是否开启字数统计
        wordCount: true,
        //  允许的最大字符数
        maximumWords: 10000,
        //  字数统计提示，{#count}代表当前字数，{#leave}代表还可以输入多少字符数,留空支持多语言自动切换，否则按此配置显示
        wordCountMsg: "当前已输入 {#count} 个字符，您还可以输入{#leave} 个字符",
        //  点击tab键时移动的距离,tabSize倍数
        tabSize: 4,
        //  tabNode什么字符做为单位
        tabNode: "&nbsp;",
        //  是否启用元素路径，默认是显示
        elementPathEnabled: true,
        //  是否自动长高,默认true
        autoHeightEnabled: true,
        //  是否可以拉伸长高,默认false
        scaleEnabled: false,
        //  表格是否可以拖拽
        tableDragable: true,
        //  源码的查看方式,codemirror 是代码高亮，textarea是文本框,默认是codemirror
        sourceEditor: $.util.browser.msie && $.util.browser.version < 8 ? "textarea" : "codemirror",
        //  编辑器初始化完成后是否进入源码模式，默认为 false
        sourceEditorFirst: false,


        fit: false,

        width: 600,

        height: 150,
        //  同 initialContent，表示初始化编辑器的内容；不过其优先级高于 initialContent 和 textarea/script 的 innerText；
        //  当设置了该属性后，初始化编辑器的内容将被强制设为该属性值，而无论是否设置了 initialContent 或 textarea/script 的 innerText；
        value: null,

        toolbarsTemplet: {
            simple: [[]],
            complex: [[]],
            full: $.fn.ueditor.toolbars
        },

        templet: null,
        //  getValue 方法所使用的内部取值方法
        valueMethod: "getContent",
        //  编辑器初始化完成后是否立即将其执行 setDisabled 操作使其禁用；
        disabled: false,


        //  编辑器准备就绪后会触发该事件
        onready: function () { },

        //  执行destroy方法,会触发该事件
        ondestroy: function () { },

        //  执行reset方法,会触发该事件
        onreset: function () { },

        //  执行focus方法,会触发该事件
        onfocus: function () { },

        //  语言加载完成会触发该事件
        onlangReady: function () { },

        //  运行命令之后会触发该命令
        onbeforeExecCommand: function () { },

        //  运行命令之后会触发该命令
        onafterExecCommand: function () { },

        //  运行命令之前会触发该命令
        onfirstBeforeExecCommand: function () { },

        //  在getContent方法执行之前会触发该事件
        onbeforeGetContent: function () { },

        //  在getContent方法执行之后会触发该事件
        onafterGetContent: function () { },

        //  在getAllHtml方法执行时会触发该事件
        ongetAllHtml: function () { },

        //  在setContent方法执行之前会触发该事件
        onbeforeSetContent: function () { },

        //  在setContent方法执行之后会触发该事件
        onafterSetContent: function () { },

        //  每当编辑器内部选区发生改变时，将触发该事件
        onselectionchange: function () { },

        //  在所有selectionchange的监听函数执行之前，会触发该事件
        onbeforeSelectionChange: function () { },

        //  在所有selectionchange的监听函数执行完之后，会触发该事件
        onafterSelectionChange: function () { },

        //  编辑器内容发生改变时会触发该事件
        oncontentChange: function () { },


        //  当调整编辑器大小时，触发该事件
        onResize: function (width, height) { }
    };


    $.parser.plugins.push("ueditor");

    if ($.fn.form && $.isArray($.fn.form.otherList)) {
        $.array.insert($.fn.form.otherList, 0, "ueditor");
    }

})(jQuery);