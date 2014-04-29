<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebForm2_FileUpload.aspx.cs" Inherits="DF.WebUI.jqext.tests.WebForm2_FileUpload" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <input id="File1" name="File1" type="file" multiple="multiple" />
        <hr />
        <asp:FileUpload ID="FileUpload1" runat="server" />
        <hr />
        <input type="submit" />
        <hr />
        <asp:Button ID="Button1" runat="server" Text="Button" OnClick="Button1_Click" />
    </form>
</body>
</html>
