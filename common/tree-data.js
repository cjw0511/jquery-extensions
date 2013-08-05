(function ($) {

    $.util.namespace("mainpage.nav");

    window.mainpage.navMenusData = [
        { id: "1", text: "百度一下", iconCls: "icon-hamburg-docs", attributes: { href: "http://www.baidu.com", iniframe: true, closable: true, refreshable: true, selected: true} },
        { id: "2", text: "测试菜单 1", iconCls: "icon-standard-accept" },
        { id: "3", text: "测试菜单 2", iconCls: "icon-standard-add" },
        { id: "4", text: "测试菜单 3", iconCls: "icon-standard-anchor" },
        { id: "5", text: "测试菜单 4", iconCls: "icon-standard-application" },
        { id: "6", text: "测试菜单 5", iconCls: "icon-standard-application-add" },
        { id: "8", text: "测试菜单 6", iconCls: "icon-standard-application-cascade" },
        { id: "9", text: "测试菜单 7", iconCls: "icon-standard-application-delete" },
        { id: "10", text: "扩展 API 文档", iconCls: "icon-hamburg-docs" },
        { id: "11", text: "演示 DEMO", iconCls: "icon-hamburg-product-design" }
    ];

    window.mainpage.apiMenus = [
        { id: "1101", text: "jQuery jDirk", pid: "11", attributes: { href: "examples/example.html?jdirk"} },
        { id: "1102", text: "Base", pid: "11", children: [
            { id: "110201", text: "Messager", pid: "1102", attributes: { href: "examples/example.html?messager"} },
            { id: "110202", text: "Tooltip", pid: "1102" },
            { id: "110203", text: "Mask-Loading", pid: "1102" }
        ] },

        { id: "1103", text: "Layout", pid: "11", children: [
            { id: "110301", text: "Panel", pid: "1103", children: [
                { id: "11030101", text: "Href加载在Iframe中", pid: "110301" },
                { id: "11030102", text: "其他功能扩展", pid: "110301" }
            ] },

            { id: "110302", text: "Tabs", pid: "1103", children: [
                { id: "11030201", text: "Tab选项卡头右键菜单", pid: "110302", children: [
                    { id: "1103020101", text: "默认菜单", pid: "11030201" },
                    { id: "1103020102", text: "自定义菜单", pid: "11030201" },
                    { id: "1103020103", text: "自定义动态菜单", pid: "11030201" }
                ]
                },
                { id: "11030202", text: "可刷新的Tab", pid: "110302" },
                { id: "11030203", text: "新增加的Tab自动加载至iframe中", pid: "110302" },
                { id: "11030204", text: "移动和插入Tab", pid: "110302" },
                { id: "11030205", text: "其他扩展功能", pid: "110302" }
            ] },
        ] },

        { id: "1104", text: "Menu and Button", pid: "11", children: [
            { id: "110401", text: "Menu", pid: "1104", children: [
                { id: "11040101", text: "动态批量创建Menu", pid: "110401" },
                { id: "11040102", text: "自定义Menu-Item的样式", pid: "110401" }
            ] },
            { id: "110402", text: "LinkButton", pid: "1104" }
        ] },

        { id: "1105", text: "Form", pid: "11", children: [
            { id: "110501", text: "Form", pid: "1105", children: [
                { id: "11050101", text: "支持div-form", pid: "110501" },
                { id: "11050102", text: "获取表单数据", pid: "110501" },
                { id: "11050103", text: "其他扩展功能", pid: "110501" }
            ] },

            { id: "110502", text: "Validatebox", pid: "1105", children: [
                { id: "11050201", text: "增强的Rules", pid: "11050201" },
                { id: "11050202", text: "输入提示文字", pid: "11050201" }
            ] },

            { id: "110503", text: "Combo", pid: "1105", children: [
                { id: "11050301", text: "输入框获取焦点时自动展开Panel", pid: "110503" },
                { id: "11050302", text: "其他扩展功能", pid: "110503" }
            ] },

            { id: "110504", text: "ComboBox", pid: "1105" },
            { id: "110505", text: "ComboGrid", pid: "1105" },
            { id: "110506", text: "ComboTree", pid: "1105" }
        ] },

        { id: "1106", text: "Window", pid: "11", children: [
            { id: "110601", text: "Window", pid: "1106", children: [
                { id: "11060101", text: "自动屏幕居中", pid: "110601" },
                { id: "11060102", text: "ESC键关闭", pid: "110601" },
                { id: "11060103", text: "双击窗体头部时自动最大化/还原", pid: "110601" },
                { id: "11060104", text: "Href加载在Iframe中", pid: "110601" },
                { id: "11060105", text: "窗体头部右键菜单", pid: "110601", children: [
                    { id: "1106010501", text: "默认菜单", pid: "11060105" },
                    { id: "1106010502", text: "自定义菜单", pid: "11060105" },
                    { id: "1106010503", text: "自定义动态菜单", pid: "11060105" }
                ] },
                { id: "11060106", text: "不能移出容器边界", pid: "110601" }
            ] },

            { id: "110602", text: "Dialog", pid: "1106", children: [
                { id: "11060201", text: "自动屏幕居中", pid: "110602" },
                { id: "11060202", text: "ESC键关闭", pid: "110602" },
                { id: "11060203", text: "双击窗体头部时自动最大化/还原", pid: "110602" },
                { id: "11060204", text: "Href加载在Iframe中", pid: "110602" },
                { id: "11060205", text: "窗体头部右键菜单", pid: "110602", children: [
                    { id: "1106020501", text: "默认菜单", pid: "11060205" },
                    { id: "1106020502", text: "自定义菜单", pid: "11060205" },
                    { id: "1106020503", text: "自定义动态菜单", pid: "11060205" }
                ] },
                { id: "11060206", text: "快速创建Dialog", pid: "110602", children: [
                    { id: "1106020601", text: "创建Dialog", pid: "11060206" },
                    { id: "1106020602", text: "创建自定义工具栏和按纽栏的Dialog", pid: "11060206" },
                    { id: "1106020603", text: "创建Iframe-Dialog", pid: "11060206" },
                    { id: "1106020604", text: "Iframe-Dialog与父级页面互调用", pid: "11060206" }
                ] }
            ] }
        ] },

        { id: "1107", text: "DataGrid and Tree", pid: "11", children: [
            { id: "110701", text: "DataGrid", pid: "1107", children: [
                { id: "11070101", text: "表头过滤器", pid: "110701", children: [
                    { id: "1107010101", text: "简单过滤器效果", pid: "11070101" },
                    { id: "1107010102", text: "复杂过滤器效果", pid: "11070101" },
                    { id: "1107010103", text: "过滤器操作", pid: "11070101" }
                ] },

                { id: "11070102", text: "表头右键菜单", pid: "110701", children: [
                    { id: "1107010201", text: "默认菜单", pid: "11070102" },
                    { id: "1107010202", text: "自定义菜单", pid: "11070102" },
                    { id: "1107010203", text: "自定义动态菜单", pid: "11070102" }
                ] },

                { id: "11070103", text: "行右键菜单", pid: "110701", children: [
                    { id: "1107010301", text: "默认菜单", pid: "11070103" },
                    { id: "1107010302", text: "自定义菜单", pid: "11070103" },
                    { id: "1107010303", text: "自定义动态菜单", pid: "11070103" },
                    { id: "1107010304", text: "自定义菜单自动绑定双击行事件", pid: "11070103" }
                ] },

                { id: "11070104", text: "行拖动排序功能", pid: "110701", children: [
                    { id: "1107010401", text: "基本功能", pid: "11070104" },
                    { id: "1107010402", text: "行拖动事件回调", pid: "11070104" }
                ] },

                { id: "11070105", text: "Tooltip", pid: "110701", children: [
                    { id: "1107010501", text: "行 Tooltip", pid: "11070105" },
                    { id: "1107010502", text: "自定义样式的行 Tooltip", pid: "11070105" },
                    { id: "1107010503", text: "列 Tooltip", pid: "11070105" },
                    { id: "1107010504", text: "自定义样式的列 Tooltip", pid: "11070105" }
                ] },

                { id: "11070106", text: "仿ExtRowEditing编辑风格", pid: "110701", children: [
                    { id: "1107010601", text: "单行编辑状态RowEditing", pid: "11070106" },
                    { id: "1107010602", text: "多行编辑状态RowEditing", pid: "11070106" }
                ] },

                { id: "11070107", text: "列冻结/取消冻结", pid: "110701" },
                { id: "11070108", text: "自适应屏幕大小", pid: "110701" },
                { id: "11070109", text: "其他扩展功能", pid: "110701" }
            ] },

            { id: "110702", text: "Tree", pid: "1107", children: [
                { id: "11070201", text: "右键菜单", pid: "110702", children: [
                    { id: "1107020101", text: "默认菜单", pid: "11070201" },
                    { id: "1107020102", text: "自定义菜单", pid: "11070201" },
                    { id: "1107020103", text: "自定义动态菜单", pid: "11070201" },
                    { id: "1107020104", text: "自定义菜单自动绑定双击事件", pid: "11070201" }
                ] },
                { id: "11070202", text: "平滑数据支持", pid: "110702" },
                { id: "11070203", text: "单击节点自动展开/折叠", pid: "110702" },
                { id: "11070204", text: "节点展开控制", pid: "110702" },
                { id: "11070205", text: "其他扩展功能", pid: "110702" }
            ] },

            { id: "110703", text: "TreeGrid", pid: "1107", children: [
                { id: "11070301", text: "表头过滤器", pid: "110703", children: [
                    { id: "1107030101", text: "简单过滤器效果", pid: "11070301" },
                    { id: "1107030102", text: "复杂过滤器效果", pid: "11070301" },
                    { id: "1107030103", text: "过滤器操作", pid: "11070301" }
                ] },

                { id: "11070302", text: "表头右键菜单", pid: "110703", children: [
                    { id: "1107030201", text: "默认菜单", pid: "11070302" },
                    { id: "1107030202", text: "自定义菜单", pid: "11070302" },
                    { id: "1107030203", text: "自定义动态菜单", pid: "11070302" }
                ] },

                { id: "11070303", text: "行右键菜单", pid: "110703", children: [
                    { id: "1107030301", text: "默认菜单", pid: "11070303" },
                    { id: "1107030302", text: "自定义菜单", pid: "11070303" },
                    { id: "1107030303", text: "自定义动态菜单", pid: "11070303" },
                    { id: "1107030304", text: "自定义菜单自动绑定双击行事件", pid: "11070303" }
                ] },

                { id: "11070304", text: "行拖动排序功能", pid: "110703", children: [
                    { id: "1107030401", text: "基本功能", pid: "11070304" },
                    { id: "1107030402", text: "行拖动事件回调", pid: "11070304" }
                ] },

                { id: "11070305", text: "Tooltip", pid: "110703", children: [
                    { id: "1107030501", text: "行 Tooltip", pid: "11070305" },
                    { id: "1107030502", text: "自定义样式的行 Tooltip", pid: "11070305" },
                    { id: "1107030503", text: "列 Tooltip", pid: "11070305" },
                    { id: "1107030504", text: "自定义样式的列 Tooltip", pid: "11070305" }
                ] },

                { id: "11070306", text: "仿ExtRowEditing编辑风格", pid: "110703", children: [
                    { id: "1107030601", text: "单行编辑状态RowEditing", pid: "11070306" },
                    { id: "1107030602", text: "多行编辑状态RowEditing", pid: "11070306" }
                ] },

                { id: "11070307", text: "列冻结/取消冻结", pid: "110703" },
                { id: "11070308", text: "自适应屏幕大小", pid: "110703" },
                { id: "11070309", text: "其他扩展功能", pid: "110703" }
            ] }
        ] },

        { id: "1108", text: "Others", pid: "11", children: [
            { id: "110801", text: "Icons", pid: "1108" },
            { id: "110802", text: "GridSelector", pid: "1108" },
            { id: "110803", text: "Toolbar", pid: "1108" },
            { id: "110804", text: "Portal", pid: "1108" }
        ] }
    ];

    window.mainpage.docMenus = [
        { id: "1001", text: "Base", pid: "10" },
        { id: "1002", text: "Layout", pid: "10" },
        { id: "1003", text: "Menu and Button", pid: "10" },
        { id: "1004", text: "Form", pid: "10" },
        { id: "1005", text: "Window", pid: "10" },
        { id: "1006", text: "DataGrid and Tree", pid: "10" },
        { id: "1007", text: "Others", pid: "10" }
    ];

})(jQuery);