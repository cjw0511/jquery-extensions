jquery-extensions
====================================================================
jQuery && jEasyUI 扩展功能集合
该扩展功能基于 jQuery 1.9.x 和 jQuery EasyUI 1.3.3 实现

jQuery EasyUI 1.3.3
Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.

Licensed under the GPL or commercial licenses
To use it on other terms please contact us: jeasyui@gmail.com
http://www.gnu.org/licenses/gpl.txt
http://www.jeasyui.com/license_commercial.php

jqueyr-extensions
二次开发 陈建伟
最近更新：2013-08-25

Copyright (c) 2013 ChenJianwei personal All rights reserved.
http://www.chenjianwei.org
====================================================================

使用本扩展前请仔细阅读本文件。

一、扩展说明
    本扩展集合包含两大部分：
    1、jquery 基础库扩展；由文件 jquery.jdirk.js 实现；该文件扩充了 jquery 的基础功能，主要体现在：
        A、增加了大量的 jquery-utility，为前端开发提供诸多便利；
        B、对 javascript 的基础对象 String、Date、Array、Number、Boolean 进行了大量的实例方法扩充；
        C、增加了 jquery 对 HTML5 属性验证的支持；
        D、增加了在 IE6/7 环境下对 JSON 数据格式的支持(整合 json2.js)；
    2、jeasyui 功能扩展；该部分扩展涵盖四个部分：
        A、jeasyui 扩展基础库；由 文件 jeasyui.extensions.js 实现；该文件提供的功能主要体现在：
            a、封装了 jeasyui 的 ajax 错误处理；
            b、改进了 messager、tooltip 的调用方式；
            c、增强了 jeasyui 控件处理通过 ajax 请求的远程 json 数据的容错性；
            d、增加了部分 jeasyui 支持的其他基础方法；
        B、对 jeasyui 的现有插件进行了功能扩展；已经功能扩展的插件包括(在目录 "jeasyui-extensions" 的 js 文件名以 "jeasyui.extensions" 开头)：
            a、validatebox
            b、combo
            c、combobox
            e、form
            f、menu
            g、panel
            h、window
            i、dialog
            j、tree
            k、datagrid
            l、treegrid
            m、combogrid
            n、combotree
            o、tabs
        C、新增部分 jeasyui 插件，包括：
            a、toolbar(所在目录为 "jeasyui-extensions/jquery-easyui-toolbar")；
            b、my97；
            c、ckeditor；
            d、uploadify；
        D、对 jeasyui 官方提供的部分扩展插件进行了代码重构或 BUG 修复，并增强其部分功能；这部分插件包括：
            a、portal(所在目录为 "jeasyui-extensions/jquery-easyui-portal")；

二、文件目录说明
    请参考 API 文档中的说明；

三、引用方式
    请参考 API 文档中的说明；

四、注意事项
    1、请勿修改本文件夹下任何文件的名称，请勿删除本文件夹下任何文件；

五、API 和 DEMO 文档
    关于本扩展集合的 API 和 DEMO 文档，请打开本文件夹中的 index.html 查看。



其他：
    1、关于 jquery-easyui-datagrid 相关API，参见：
            官方 API(英文)：http://www.jeasyui.com/documentation/index.php
            中文社区 API  ：http://api.btboys.com/
    2、转载请注明出处；如需在您自己的项目用引用本扩展集合，请遵循 gpl-v3 协议；
    3、jEasyUI 中文社区：
            http://www.jeasyuicn.com/
            http://bbs.jeasyuicn.com/
    4、jEasyUI 中文社区 QQ 群号：70168958

