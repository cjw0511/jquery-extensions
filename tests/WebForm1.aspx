<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm1.aspx.cs" Inherits="DF.WebUI.jqext.tests.WebForm1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>

    <link href="../jquery-easyui-theme/default/easyui.css" rel="stylesheet" type="text/css" />
    <link href="../jquery-easyui-theme/icon.css" rel="stylesheet" type="text/css" />
    <script src="../jquery/jquery-1.11.0.js" type="text/javascript"></script>
    <script src="../jquery-easyui-1.3.6/jquery.easyui.min.js" type="text/javascript"></script>
    <script src="../jquery-easyui-1.3.6/locale/easyui-lang-zh_CN.js" type="text/javascript"></script>

    <script src="../jquery.jdirk.js" type="text/javascript"></script>
    <link href="../jeasyui-extensions/jeasyui.extensions.css" rel="stylesheet" type="text/css" />
    <script src="../jeasyui-extensions/jeasyui.extensions.js" type="text/javascript"></script>
    <script src="../jeasyui-extensions/jeasyui.extensions.linkbutton.js" type="text/javascript"></script>
    <script src="../jeasyui-extensions/jeasyui.extensions.form.js" type="text/javascript"></script>

    <script runat="server">
        protected void Page_Load(object sender, EventArgs args)
        {
            string val = this.Request["btn1"];
            if (!string.IsNullOrWhiteSpace(val))
            {
                this.Response.Write(val);
            }
        }
    </script>

    <script type="text/javascript">
        $(function () {
            $("#btn1").click(function () {
                $("#dd1").form("submit");
            });
        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div id="dd1">
            <label><input name="radio1" type="checkbox" value="0,0" disabled="disabled" checked="checked" />aaa</label>
            <label><input name="radio1" type="checkbox" value="1,1" />bbb</label>
            <label><input name="radio1" type="checkbox" value="2" />ccc</label>
            <label><input name="radio1" type="checkbox" value="3" />ddd</label>
            <hr />
            <input id="btn1" type="checkbox" value="submit" />
        </div>
    </form>
</body>
</html>
