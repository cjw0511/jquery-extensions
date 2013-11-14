jquery-extensions
====================
<p>
jQuery && jEasyUI 扩展功能集合<br />
该扩展功能基于 jQuery 1.9.x 和 jQuery EasyUI 1.3.4 实现<br />
<br />
jQuery EasyUI 1.3.4<br />
Copyright (c) 2009-2013 www.jeasyui.com. All rights reserved.<br />
<br />
Licensed under the GPL or commercial licenses<br />
To use it on other terms please contact author: info@jeasyui.com<br />
<a href="http://www.gnu.org/licenses/gpl.txt" target="_blank">http://www.gnu.org/licenses/gpl.txt</a>
<br />
<a href="http://www.jeasyui.com/license_commercial.php" target="_blank">http://www.jeasyui.com/license_commercial.php</a>
<br />
<br />
jqueyr-extensions<br />
二次开发：流云<br />
<br />
Copyright (c) 2013 ChenJianwei personal All rights reserved.<br />
<a href="http://www.chenjianwei.org" target="_blank">http://www.chenjianwei.org</a><br />
<a href="http://cjw0511.cnblogs.com" target="_blank">http://cjw0511.cnblogs.com</a>
</p>
<h3>使用本扩展前请仔细阅读本文件。</h3>
<ul>
    <li>
        扩展说明
        <p>
            本扩展集合包含两大部分：
            <ul>
                <li>
                    jquery 基础库扩展；由文件 jquery.jdirk.js 实现；该文件扩充了 jquery 的基础功能，主要体现在：
                    <ul>
                        <li>增加了大量的 jquery-utility，为前端开发提供诸多便利；</li>
                        <li>对 javascript 的基础对象 String、Date、Array、Number、Boolean 进行了大量的静态和实例方法扩充；</li>
                        <li>增加了 jquery 对 HTML5 属性验证的支持；</li>
                        <li>增加了在 IE6/7 环境下对 JSON 数据格式的支持(整合 json2.js)；</li>
                    </ul>
                </li>
                <li>
                    jeasyui 功能扩展；该部分扩展涵盖四个部分：
                    <ul>
                        <li>
                            jeasyui 扩展基础库；由 文件 jeasyui.extensions.js 实现；该文件提供的功能主要体现在：
                            <ul>
                                <li>封装了 jeasyui 的 ajax 错误处理；</li>
                                <li>改进了 messager、tooltip 的调用方式；</li>
                                <li>增强了 jeasyui 控件处理通过 ajax 请求的远程 json 数据的容错性；</li>
                                <li>增加了部分 jeasyui 支持的其他基础方法；</li>
                            </ul>
                        </li>
                        <li>
                            对 jeasyui 的现有插件进行了功能扩展；已经功能扩展的插件包括(在目录 "jeasyui-extensions" 的 js 文件名以 "jeasyui.extensions" 开头)：
                            <ul>
                                <li>linkbutton</li>
                                <li>validatebox</li>
                                <li>combo</li>
                                <li>combobox</li>
                                <li>form</li>
                                <li>menu</li>
                                <li>panel</li>
                                <li>window</li>
                                <li>dialog</li>
                                <li>tree</li>
                                <li>datagrid</li>
                                <li>treegrid</li>
                                <li>combogrid</li>
                                <li>combotree</li>
                                <li>tabs</li>
                            </ul>
                        </li>
                        <li>
                            新增部分 jeasyui 插件，包括：
                            <ul>
                                <li>gridselector 和 dblgridselector</li>
                                <li>toolbar(所在目录为 "jeasyui-extensions/jquery-easyui-toolbar")；</li>
                                <li>theme；</li>
                                <li>my97；</li>
                                <li>ckeditor；</li>
                                <li>uploadify；</li>
                            </ul>
                        </li>
                        <li>
                            对 jeasyui 官方提供的部分扩展插件进行了代码重构或 BUG 修复，并增强其部分功能；这部分插件包括：
                            <ul>
                                <li>portal(所在目录为 "jeasyui-extensions/jquery-easyui-portal")；</li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </p>
    </li>

    <li>
        文件目录说明
        <p>
            ─jquery-extensions               该扩展项目的根目录<br />
              ├─common                      提供 index.html 页面运行的部分支持 javascript 文件<br />
              ├─docs                        关于该扩展项目的文档目录<br />
              ├─examples                    关于该扩展项目的 DEMO 目录<br />
              ├─icons                       图标库，包含整理好的约 3600 个图标及其符合 jeasyui 图标格式要求的 css 定义、数据源 javascript 脚本定义<br />
              ├─jeasyui-extensions          该扩展项目的插件扩展源代码主目录<br />
              ├─jquery                      该目录用于存放 jquery 基础库<br />
              ├─jquery-easyui-1.3.3         该目录用于存放 jquery-easyui 插件基础库 1.3.3 版<br />
              ├─jquery-easyui-1.3.4         该目录用于存放 jquery-easyui 插件基础库 1.3.4 版<br />
              ├─jquery-easyui-theme         该目录用于存放本扩展中的所有皮肤文件<br />
              ├─syntaxhighlighter_3.0.83    syntaxhighlighter插件，用于在文档DEMO中对代码的显示提供格式化支持<br />
              │<br />
              ├─changelog.txt               该扩展项目的更新日志<br />
              ├─index.html                  该扩展项目的演示主文件(运行演示 DEMO，用 WEB 浏览器打开此文件即可)<br />
              ├─jquery.jdirk.js             jquery.jdirk.js 扩展库源代码文件<br />
              ├─LICENSE                     该扩展项目遵循的 GPL-v3 协议说明文件<br />
              └─README.md                   该扩展项目的 README.md 文件(本文件)<br />
        </p>
    </li>

    <li>
        引用方式
        <p>请参考 API 文档中的说明；</p>
    </li>

    <li>
        注意事项
        <p>请勿修改本文件夹下任何文件的名称，请勿删除本文件夹下任何文件；</p>
    </li>

    <li>
        API 和 DEMO 文档
        <p>关于本扩展集合的 API 和 DEMO 文档，请将本插件打包下载后，打开本文件夹中的 index.html 查看。</p>
    </li>

    <li>
        其他：
        <ul>
            <li>源码下载：<a href="https://github.com/cjw0511/jquery-extensions/" target="_blank">https://github.com/cjw0511/jquery-extensions/</a></li>
            <li>在线演示地址：<a href="http://jqext.sinaapp.com/" target="_blank">http://jqext.sinaapp.com/</a></li>
            <li>
                对于本扩展有任何意见或者建议，欢迎大家及时向我反馈，可以发邮件至我信箱
                <a href="mailto:cjw0511@qq.com">cjw0511@qq.com</a>(标题请注明 jEasyUI 扩展相关)；<br />
                在时间允许的情况下我会尽可能的给大家回复。
            </li>
            <li>转载请注明出处；如需在您自己的项目用引用本扩展集合，请遵循 gpl-v3 协议；</li>
            <li>
                关于 jquery-easyui 相关API，参见：
                <ul>
                    <li>官方 API(英文)：<a href="http://www.jeasyui.com/documentation/index.php" target="_blank">http://www.jeasyui.com/documentation/index.php</a></li>
                    <li>中文社区 API  ：<a href="http://api.btboys.com/" target="_blank">http://api.btboys.com/</a></li>
                </ul>
            </li>
            <li>
                jEasyUI 中文社区：
                <ul>
                    <li><a href="http://www.jeasyuicn.com/" target="_blank">http://www.jeasyuicn.com/</a></li>
                    <li><a href="http://bbs.jeasyuicn.com/" target="_blank">http://bbs.jeasyuicn.com/</a></li>
                </ul>
            </li>
            <li>jEasyUI 中文社区 QQ 群号：70168958</li>
        </ul>
    </li>
</ul>