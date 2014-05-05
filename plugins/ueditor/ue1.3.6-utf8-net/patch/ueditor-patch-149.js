/**
 * 修复在chrome 34.0.1847.116版本里domUtils.removeAttributeNode报错问题
 * 详细请看issue页面: https://github.com/fex-team/ueditor/issues/149
 * Date: 2014-4-29
 **/
(function () {
    var attrFix = UE.browser.ie && UE.browser.version < 9 ? {
        tabindex:"tabIndex",
        readonly:"readOnly",
        "for":"htmlFor",
        "class":"className",
        maxlength:"maxLength",
        cellspacing:"cellSpacing",
        cellpadding:"cellPadding",
        rowspan:"rowSpan",
        colspan:"colSpan",
        usemap:"useMap",
        frameborder:"frameBorder"
    } : {
        tabindex:"tabIndex",
        readonly:"readOnly"
    };
    if (!UE.browser.ie) {
        UE.dom.domUtils.removeAttributes = function (node, attrNames) {
            attrNames = UE.utils.isArray(attrNames) ? attrNames : UE.utils.trim(attrNames).replace(/[ ]{2,}/g,' ').split(' ');
            for (var i = 0, ci; ci = attrNames[i++];) {
                ci = attrFix[ci] || ci;
                switch (ci) {
                    case 'className':
                        node[ci] = '';
                        break;
                    case 'style':
                        node.style.cssText = '';
                        var val = node.getAttributeNode('style');
                        !UE.browser.ie && val && node.removeAttributeNode(val);
                }
                node.removeAttribute(ci);
            }
        };
    }
})();