/**
* jQuery EasyUI 1.3.6
* Copyright (c) 2009-2014 www.jeasyui.com. All rights reserved.
*
* Licensed under the GPL or commercial licenses
* To use it on other terms please contact author: info@jeasyui.com
* http://www.gnu.org/licenses/gpl.txt
* http://www.jeasyui.com/license_commercial.php
*
* jQuery EasyUI CodeMirror Plugin Extensions 1.0 beta
* jQuery EasyUI CodeMirror 插件扩展
* jquery.codemirror.js
* 二次开发 流云
* 最近更新：2014-04-09
*
* 依赖项：
*   1、jquery.jdirk.js v1.0 beta late
*   2、jeasyui.extensions.js v1.0 beta late

*   3、codemirror-4.0/lib/codemirror.css
*   4、codemirror-4.0/lib/codemirror.js
*   5、codemirror-4.0/mode/xml/xml.js
*   6、codemirror-4.0/mode/javascript/javascript.js
*   7、codemirror-4.0/mode/vbscript/vbscript.js
*   8、codemirror-4.0/mode/css/css.js
*   9、codemirror-4.0/mode/htmlmixed/htmlmixed.js
*
* Copyright (c) 2013-2014 ChenJianwei personal All rights reserved.
* http://www.chenjianwei.org
*/
(function ($, undefined) {

    function create(target) {
        var t = $(target).addClass("codemirror-f").hide(),
            text = target.innerText, cc = t.children(),
            state = $.data(target, "codemirror"), opts = state.options,
            name = t.attr("name"), id = state.editorId = "codemirror_" + $.util.guid("N"),
            isDiv = /^(?:div)$/i.test(target.nodeName),
            codemirror = state.codemirror = isDiv ? t : $("<div class=\"codemirror\"></div>").insertAfter(t).hide(),
            wrapper = state.wrapper = $("<textarea></textarea>").insertAfter(codemirror).attr("id", id);
        if (name) {
            t.attr("codemirrorName", name).removeAttr("name");
            wrapper.attr("name", name);
        }
        if (text) { wrapper.text(text); }
        cc.each(function () { wrapper.append(this); });

        if (opts.value) {
            wrapper.empty();
        }
        opts.originalValue = opts.initialContent;
        if (opts.templet) {
            opts.toolbars = opts.toolbarsTemplet[opts.templet]
        }
        state.editor = UE.getEditor(id, opts);

    };







    $.fn.codemirror = function (options, param) {
        if (typeof options == "string") {
            return $.fn.codemirror.methods[options](this, param);
        }
        options = options || {};
        return this.each(function () {
            var state = $.data(this, "codemirror");
            if (state) {
                $.extend(state.options, options);
            } else {
                $.data(this, "codemirror", { options: $.extend({}, $.fn.codemirror.defaults, $.fn.codemirror.parseOptions(this), options) });
                create(this);
            }
        });
    };


    $.fn.codemirror.events = [
            "ready", "destroy", "reset", "focus", "langReady",
            "beforeExecCommand", "afterExecCommand", "firstBeforeExecCommand",
            "beforeGetContent", "afterGetContent", "getAllHtml", "beforeSetContent", "afterSetContent",
            "selectionchange", "beforeSelectionChange", "afterSelectionChange", "contentChange"
    ];
    $.fn.codemirror.parseOptions = function (target) {
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


    $.fn.codemirror.methods = {

        options: function (jq) { return $.data(jq[0], "codemirror").options; },

        editor: function (jq) { return $.data(jq[0], "codemirror").editor; },

        wrapper: function (jq) { return $.data(jq[0], "codemirror").wrapper; },

        resize: function (jq, size) { return jq.each(function () { resize(this, size); }); },








        //  销毁编辑器实例，使用textarea代替
        destroy: function (jq) { return jq.each(function () { destroy(this); }); },


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

        reset: function (jq) { return jq.each(function () { reset(this); }); },

        //
        append: function (jq, value) { return jq.each(function () { setValue(this, value, true); }); },

        //  同 focus 方法；
        setFocus: function (jq, toEnd) { return jq.each(function () { setFocus(this, toEnd); }); },

        //  清空文档
        clear: function (jq) { return jq.each(function () { clear(this); }); }
    };

    $.fn.codemirror.defaults = {

        fit: false,

        width: 600,

        height: 150,

        disabled: false,

        
        //  CodeMirror 初始化时编辑器中的内容；string|CodeMirror.Doc
        value: "",
        //  CodeMirror 编辑器的代码类型模式；String 类型值，其值可以是 text/html、javascript、json 等；
        //  当使用指定的模式 mode 后，页面上同时需加载特定的模式 js 文件；
        //  如果不定义该参数，则默认取第一个加载的编辑器 mode
        //  string|object
        mode: null,
        //  CodeMirror 编辑器的主题 css 风格；string
        theme: "default",
        //  CodeMirror 编辑器的代码缩进空格数；integer
        indentUnit: 2,
        //  指定 CodeMirror 编辑器的进行换行时代码是否自动缩进；boolean
        smartIndent: true,
        //  指定 CodeMirror 编辑器的制表符宽度；integer
        tabSize: 4,
        //  指定 CodeMirror 编辑器中是否用制表符来替换缩进空格；boolean
        indentWithTabs: false,
        //  指定 CodeMirror 编辑器是否在当行内容改变时自动判断缩进；boolean
        electricChars: true,
        //  指定 CodeMirror 编辑器中哪些字符将会被占位符替代；RegExp
        specialChars: CodeMirror.defaults.specialChars,
        //  function 类型值
        specialCharPlaceholder: CodeMirror.defaults.specialCharPlaceholder,
        //  指定 CodeMirror 编辑器中在光标移动位置时指针是否可见；boolean
        rtlMoveVisually: CodeMirror.defaults.rtlMoveVisually,
        //  string 类型值；指定 CodeMirror 编辑器中的键盘映射配置；
        //  配置详情参见 http://codemirror.net/doc/manual.html#keymaps
        keyMap: "default",
        //  JSON-Object 类型；指定 CodeMirror 编辑器中除 keyMap 外额外的键盘快捷键配置
        //  配置详情参见 http://codemirror.net/doc/manual.html#option_keyMap
        extraKeys: null,
        //  boolean 类型值；指定 CodeMirror 编辑器中当行代码过长时是否自动换行（如果自动换行则不显示横向滚动条）
        lineWrapping: false,
        //  boolean 类型值；指定 CodeMirror 编辑器是否显示行号
        lineNumbers: false,
        //  integer 类型值；指定 CodeMirror 编辑器以代码中的那一行作为起始行；行索引号从 1 开始计数；
        firstLineNumber: 1,
        //  function 类型值；这是一个回调函数，用于格式化行号
        lineNumberFormatter: CodeMirror.defaults.lineNumberFormatter,
        //
        gutters: CodeMirror.defaults.gutters,
        //  boolean 类型值；指定 CodeMirror 编辑器中滚动条在移动时，标尺部分（行号和工具栏）是否固定不动
        fixedGutter: true,
        //  boolean 类型值；指定 CodeMirror 编辑器在 fixedGutter 参数为 true 时，控件的左右滚动条是否另起一个 scrollbar 显示；
        coverGutterNextToScrollbar: false,
        //  boolean | string 类型值；指定 CodeMirror 编辑器是否为只读不可编辑状态
        //  该参数值可以为 true、false、或者字符串值 "nocursor"；如果值为 "nocursor" 则编辑器不仅不可编辑同时也不能得到输入焦点；
        readOnly: false,
        //  boolean 类型值；指定 CodeMirror 编辑器在用鼠标进行内容选择时是否始终显示输入焦点
        showCursorWhenSelecting: false,
        //  integer 类型值；指定 CodeMirror 编辑器所能支持的最大撤销次数
        undoDepth: 200,
        //  integer 类型值；该值表示当 CodeMirror 编辑器内容发生改变时的事件调用延迟时间(毫秒数)；
        historyEventDelay: 1250,
        // integer 类型值；指定　CodeMirror 编辑器在页面上被分配的 HTML-tabIndex 属性值；如果不指定该属性值，将会被自动分配；
        tabindex: null,
        //  boolean 类型值；指定 CodeMirror 编辑器在初始化后是否自动获取焦点；
        autofocus: null,

        /************************************************/
        //  boolean 类型值；指定 CodeMirror 编辑器是否启用文本拖放功能；
        dragDrop: true,
        //  number 类型值；指定 CodeMirror 编辑器中输入光标的闪烁速率(毫秒数)；如果该参数为 0，则输入光标不闪烁；
        cursorBlinkRate: 530,
        //  number 类型值；指定 CodeMirror 编辑器中输入光标的边界空白位置margin
        cursorScrollMargin: 0,
        //  number 类型值；指定 CodeMirror 编辑器中输入光标的高度；默认是1表示占满整行高度；
        //  例如，可以设置为 0.5 表示半行高度，设置为 2 表示占满 2 行高度；
        cursorHeight: 1,
        //  boolean 类型值；指定 CodeMirror 编辑器控件中点击鼠标右键后，是否自动清空区域文本选中效果；
        resetSelectionOnContextMenu: true,
        //  number 类型值；代码的高亮效果显示是通过一个伪后台线程执行来完成的，以下两个参数表示这个伪后台线程的工作和延迟时间(毫秒数)；
        //  通过改变如下两个参数的值，可以增强高亮实时刷新的效果或者降低对浏览器性能的开销；
        workTime: 100, workDelay: 100,
        //  number 类型值；指定 CodeMirror 编辑器在获取输入焦点后自动检测编辑器内文本内容变化的时间频率(毫秒数)；
        //  该值的大小将影响到 change 事件的调用延迟时间；
        pollInterval: 100,
        //  boolean 类型值；指定 CodeMirror 在处理代码高亮效果显示时，对于相邻的同类型字符块是否合并到一个 span 中来显示；
        //  如果该值设置为 true，将能一定程度提高代码高亮解析的效率，但是可能会改变某些特殊类型样式(例如圆角)的显示效果
        flattenSpans: true,
        //  boolean 类型值；指定 CodeMirror 在解析不同 mode 类型代码块高亮效果时，是否根据不同的 mode 设定在不同标记前加一个用于标记的 css 类；
        addModeClass: false,
        //  number 类型值；指定 CodeMirror 编辑器进行代码高亮解析的最大标签处理数量；该值设置的越大，同一个代码块中所能解析的文本域更大，但是也将会消耗更多的浏览器性能；
        maxHighlightLength: 10000,
        //  number 类型值；
        viewportMargin: 10
    };


    $.parser.plugins.push("codemirror");

    if ($.fn.form && $.isArray($.fn.form.otherList)) {
        $.array.insert($.fn.form.otherList, 0, "codemirror");
    }

})(jQuery);