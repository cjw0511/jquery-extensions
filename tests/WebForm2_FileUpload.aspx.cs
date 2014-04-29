using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace DF.WebUI.jqext.tests
{
    public partial class WebForm2_FileUpload : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            //this.SaveFile();
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            //this.SaveFile();
            if (this.FileUpload1.HasFile)
            {
                string directory = this.Request.MapPath("uploads") + "\\";
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                this.FileUpload1.SaveAs(directory + this.FileUpload1.FileName);
            }
        }


        void SaveFile()
        {
            HttpPostedFile file = this.Request.Files["File1"];
            if (file != null)
            {
                string directory = this.Request.MapPath("uploads") + "\\";
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }
                file.SaveAs(directory + file.FileName);
            }
        }
    }
}