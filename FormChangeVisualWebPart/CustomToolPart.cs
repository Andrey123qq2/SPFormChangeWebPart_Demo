using Microsoft.SharePoint;
using Microsoft.SharePoint.WebPartPages;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.UI.WebControls;

namespace FormChangeWebPart.FormChangeVisualWebPart
{
    class CustomToolPart : ToolPart
    {
        #region HTML Templates
        private readonly string _formTemplate = @"
<!--
<link type=""text/css"" rel=""stylesheet"" href=""PATH_TO_CUSTOM_CSS"">
<script src=""PATH_TO_CUSTOM_SCRIPT"" ></script>
-->
<div id = ""mainTabsContainer"" style=""opacity: 0.5; display: block;"" class=""element_faded"">
	<div id = ""tabs-container"" class=""cf-tabs cf-widget cf-widget-content"">
		<ul class=""tabs cf-tabs-nav cf-corner-all cf-helper-reset cf-helper-clearfix cf-widget-header cf-tabs-nav cf-helper-clearfix cf-widget-header"">
		    <li class=""tab-header cf-tabs-tab cf-corner-top cf-state-default cf-tab"" >
		        <a href = ""#tab10"" class=""cf-tabs-anchor"" id=""cf-id-1"">Generic info</a>
		    </li>
		    <li class=""tab-header cf-tabs-tab cf-corner-top cf-state-default cf-tab"">
			    <a href = ""#tab20"" class=""cf-tabs-anchor"" >Additional info</a>
		    </li>
		    <li class=""tab-header cf-tabs-tab cf-corner-top cf-state-default cf-tab"">
			    <a href = ""#tabDefaultForm"" class=""cf-tabs-anchor"" >Full Form</a>
		    </li>
        </ul>
        <div id= ""tab1"" class=""content-tab tableCell cf-tabs-panel cf-corner-bottom cf-widget-content"">
            <table class=""data-table"">
                {0}
            </table>
        </div>
        <div id= ""tab2"" class=""content-tab tableCell cf-tabs-panel cf-corner-bottom cf-widget-content"">
            <table class=""data-table"">
                <tr>
                    <td>

                    </td>
                    <td>

                    </td>
                </tr>
                <tr>
                    <td>

                    </td>
                    <td>

                    </td>
                </tr>
            </table>
        </div>
        <div id=""tabDefaultFormContent"" class=""content-tab tableCell cf-tabs-panel cf-corner-bottom cf-widget-content"" ></div>
    </div>
</div>
<div style=""text-align: right; margin-top: 8px;"">
	<span class=""customFormSave""></span>
	<span class=""customFormCancel"" ></span>
</div>
</div>
";
        private readonly string _repeatBlockTemplate = @"
            <tr>
              <td>
	            <h4>Field0:</h3>
	            <span class=""customFormField"" data-displayName=""Field0""></span>
              </td>
	              <td>
	                <h4>Field1:</h3>
	                <span class=""customFormField"" data-displayName=""Field1""></span>
                  </td>
	        </tr>
            <tr>
                <td>
	                <h4>Field2:</h3>
	                <span class=""customFormField"" data-displayName=""Field2""></span>
                </td>
	            <td>
	                <h4>Field3:</h3>
	                <span class=""customFormField"" data-displayName=""Field3""></span>
                </td>
            </tr>
";
#endregion
        protected override void CreateChildControls()
        {
            FormChangeVisualWebPart webpart = (FormChangeVisualWebPart)this.ParentToolPane.SelectedWebPart;

            Panel panel = new Panel();
            Button createButton = new Button
            {
                ID = "CreateTemplateButton",
                Text = "Create template"
            };
            createButton.Click += new EventHandler(btn_Click);
            panel.Controls.Add(createButton);
            Controls.Add(panel);
            base.CreateChildControls();
        }
        protected void btn_Click(object sender, EventArgs e)
        {
            byte[] buffer;
            using (var memoryStream = new MemoryStream())
            {
                string htmlFieldsBlock = GetHTMLFieldsBlock();
                string htmlForm = String.Format(_formTemplate, htmlFieldsBlock);
                buffer = Encoding.Default.GetBytes(htmlForm);
                memoryStream.Write(buffer, 0, buffer.Length);
                HttpContext.Current.Response.Clear();
                HttpContext.Current.Response.AddHeader("Content-Disposition", "attachment; filename=CustomFormTemplate.html");
                HttpContext.Current.Response.AddHeader("Content-Length", memoryStream.Length.ToString());
                HttpContext.Current.Response.ContentType = "text/plain";
                memoryStream.WriteTo(HttpContext.Current.Response.OutputStream);
            }
            HttpContext.Current.Response.End();
        }

        private string GetHTMLFieldsBlock() 
        {
            var fieldsForForm = GetSPFieldsForForm();
            string repeatBlockAll = string.Empty;
            string repeatBlock = _repeatBlockTemplate;
            for (int fieldNumber = 0; fieldNumber < fieldsForForm.Count; fieldNumber++) {
                int fieldIndex = fieldNumber % 4;
                repeatBlock = repeatBlock.Replace("Field" + fieldIndex, fieldsForForm[fieldNumber]);
                if (fieldIndex == 3) {
                    repeatBlockAll += repeatBlock;
                    repeatBlock = _repeatBlockTemplate;
                }
            }
            return repeatBlockAll;
        }
        private static SPList GetSPList(string listUrl)
        {
            SPSite site = new SPSite(listUrl);
            SPWeb web = site.OpenWeb();
            SPList list = web.GetList(listUrl);
            return list;
        }
        private static List<string> GetSPFieldsForForm()
        {
            var list = GetSPList(HttpContext.Current.Request.UrlReferrer.OriginalString);
            List<string> fieldsForForm = new List<string>();
            fieldsForForm.Add(list.Fields.GetField("Title").Title);
            List<string> listFieldsNames = list.Fields
                .Cast<SPField>()
                .Where(f => Regex.IsMatch(((SPField)f).InternalName, "^_x.*"))
                .Select(f => f.Title)
                .ToList();
            fieldsForForm.AddRange(listFieldsNames);
            return fieldsForForm;
        }
    }
}