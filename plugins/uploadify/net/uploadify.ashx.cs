using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;

namespace NDF.Euploadify
{
    /// <summary>
    /// uploadify 的摘要说明
    /// </summary>
    public class uploadify : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            context.Response.Charset = "utf-8";

            HttpPostedFile file = context.Request.Files["Filedata"];
            string folder = context.Request["folder"],
                id = context.Request["id"],
                value = context.Request["id"];
            string uploadPath = HttpContext.Current.Server.MapPath(folder) + "\\";

            if (file != null)
            {
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }
                file.SaveAs(uploadPath + file.FileName);

                //下面这句代码缺少的话，上传成功后上传队列的显示不会自动消失
                context.Response.Write("{ \"id\": \"" + id + "\", \"status\": true, \"message\": \"上传成功!\", \"value\": \"" + value + "\", \"url\": null }");
            }
            else
            {
                context.Response.Write("{ \"id\": null, \"status\": false, \"message\": \"上传失败!\", \"value\": null, \"url\": null }");
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}