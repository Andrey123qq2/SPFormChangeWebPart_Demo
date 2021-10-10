using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Web;
//using System.Web.UI.WebControls.WebParts;
using Microsoft.SharePoint.WebPartPages;

namespace FormChangeWebPart.FormChangeVisualWebPart
{
    [ToolboxItemAttribute(false)]
    public partial class FormChangeVisualWebPart : WebPart
    {
        public override ToolPart[] GetToolParts()
        {
            ToolPart[] allToolParts = new ToolPart[3];
            WebPartToolPart standardToolParts = new WebPartToolPart();
            CustomPropertyToolPart customToolParts = new CustomPropertyToolPart();

            allToolParts[0] = standardToolParts;
            allToolParts[1] = customToolParts;
            allToolParts[2] = new CustomToolPart();

            return allToolParts;
        }

        #region Save w/o close button - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Save w/o close button"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable Button")]
        public bool SaveWOCloseButtonEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Save w/o close button"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Button title"),
        Description("Button title")]
        public string SaveWOCloseButtonTitle { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Save w/o close button"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after selector"),
        Description("Append after element by selector")]
        public string SaveWOCloseButtonSelector { get; set; }
        #endregion

        # region Show elements by groups - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ShowElementsByGroups"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable show elements by groups")]
        public bool ShowElementsByGroupsEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ShowElementsByGroups"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Array of fields settings JSON"),
        Description("Format:  [{\"Field\":\"FieldTitle1\", \"Groups\": [\"GroupName1\", \"GroupName2\"], \"Mode\": \"hide|disable\", \"Selector\": \"tr|div|...\"}]")]
        public string ShowElementsByGroupsFieldsJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ShowElementsByGroups"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Array of select settings JSON"),
        Description("Format:  [{\"Field\":\"FieldTitle1\", \"Option\": \"OptionTitle\": \"Groups\": [\"GroupName1\", \"GroupName2\"] }]")]
        public string ShowElementsByGroupsSelectOptionsJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ShowElementsByGroups"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Array of selectors settings JSON"),
        Description("Format:  [{\"Selector\":\".class1\", \"Groups\": [\"GroupName1\", \"GroupName2\"] }]")]
        public string ShowElementsByGroupsSelectorsJSON { get; set; }
        #endregion

        #region Related Items (GetItems) - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetItems)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable related items")]
        public bool RelatedItemsGetItemsEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetItems)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Field title"),
        Description("Title of added classic form field")]
        public string RelatedItemsGetItemsFieldTitle { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetItems)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after field"),
        Description("Append after classic field with title")]
        public string RelatedItemsGetItemsAfterField { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetItems)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after selector"),
        Description("Append after selector (custom forms)")]
        public string RelatedItemsGetItemsAfterSelector { get; set; }
        #endregion

        #region Related Items (GetTasks) - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetTasks)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable related items")]
        public bool RelatedItemsGetTasksEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetTasks)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Tasks List Guid"),
        Description("Tasks List Guid")]
        public string RelatedItemsGetTasksListGuid { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetTasks)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Field title"),
        Description("Title of added classic form field")]
        public string RelatedItemsGetTasksFieldTitle { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetTasks)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after field"),
        Description("Append after classic field with title")]
        public string RelatedItemsGetTasksAfterField { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetTasks)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after selector"),
        Description("Append after selector (custom forms)")]
        public string RelatedItemsGetTasksAfterSelector { get; set; }
        #endregion

        #region Related Items (GetByFields) - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable related items")]
        public bool RelatedItemsGetByFieldsEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Related List Guid"),
        Description("Related List Guid")]
        public string RelatedItemsGetByFieldsListGuid { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Field title"),
        Description("Title of added classic form field")]
        public string RelatedItemsGetByFieldsFieldTitle { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after field"),
        Description("Append after classic field with title")]
        public string RelatedItemsGetByFieldsAfterField { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Append after selector"),
        Description("Append after selector (custom forms)")]
        public string RelatedItemsGetByFieldsAfterSelector { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Related Web Url"),
        Description("Url of related list web")]
        public string RelatedItemsGetByFieldsWebUrl { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Current item fields for filter"),
        Description("Format: [\"FieldName1\", \"FieldName2\"]")]
        public string RelatedItemsGetByFieldsSourceFieldsJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFields)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("CAML filter template"),
        Description("CAML filter template to get related items")]
        public string RelatedItemsGetByFieldsCAMLFilter { get; set; }
        #endregion

        #region Related Items (GetByFieldsMulti) - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFieldsMulti)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable related items")]
        public bool RelatedItemsGetByFieldsMultiEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Related Items (GetByFieldsMulti)"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("GetByFields multi params in JSON format"),
        Description("Format: [{\"FieldTitle\": \"FieldTitle1\", \"AfterField\": \"AfterFieldTitle1\", \"AfterSelector\": \"AfterSelector1\", \"ListGuid\": \"ListGuid1\", \"WebUrl\": \"WebUrl1\", \"SourceFields\": [\"Field1\", \"Field2\"], \"CAMLFilter\": \"CAMLFilter1\"}, {...}]")]
        public string RelatedItemsGetByFieldsMultiParamsJSON { get; set; }
        #endregion

        #region DocumentSet - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable component")]
        public bool DocSetEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("UrlField title"),
        Description("Title of url field")]
        public string DocSetUrlFieldDescription { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Library Name"),
        Description("Destination library name")]
        public string DocSetLibraryName { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Fields map"),
        Description("Format: [[\"srcField1\", \"dstFieldIntName1\"], [\"srcField2\": \"dstFieldIntName2\"]]")]
        public string DocSetFieldsMapJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Create subfolders"),
        Description("Format: [\"folder1\", \"folder2\", \"folder3\"]")]
        public string DocSetSubfoldersJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Show subfolders"),
        Description("Show subfolders")]
        public bool DocSetSubfoldersShow { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Dst url field - dst int name"),
        Description("Internal name of destionation url field")]
        public string DocSetDstUrlFieldName { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("DocumentSet"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Dst url field - src field for desc"),
        Description("Source field name for destination url field description")]
        public string DocSetDstUrlFieldSrcFieldName { get; set; }
        #endregion

        #region Attachments - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Attachments"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable attachments component")]
        public bool AttachmentsEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Attachments"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Disable edit"),
        Description("Disable attachments edit")]
        public bool AttachmentsDisableEdit { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Attachments"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Hide buttons"),
        Description("Hide attachments buttons")]
        public bool AttachmentsHideButtons { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Attachments"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Hide buttons by value in url field"),
        Description("Field name")]
        public string AttachmentsHideButtonsByUrlField { get; set; }
        #endregion

        #region UserAttributes - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("UserAttributes"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable user attributes component")]
        public bool UserAttributesEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("UserAttributes"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("User field name"),
        Description("User field name")]
        public string UserAttributesUserField { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("UserAttributes"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Fields to attributes map"),
        Description("Format: [[\"Field1\", \"Attribute1\"], [\"Field2\", \"Attribute2\"]]")]
        public string UserAttributesFieldsMapJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("UserAttributes"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Fields to subAttributes map"),
        Description("Format: [{\"UserAttributesUserField\": \"AttributeSubUser1\", \"UserAttributesFieldsMap\": [\"Field1\", \"Attribute1\"], [\"Field2\": \"Attribute2\"]}]")]
        public string UserAttributesSubAttributesToFieldsMapJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("UserAttributes"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Field reverse fill map"),
        Description("Format: [\"Attribute\", \"FieldWithAttributeValue\"]")]
        public string UserAttributesUserFieldReverseJSON { get; set; }
        #endregion

        #region SetTitle - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("SetTitle"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable title set")]
        public bool SetTitleEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("SetTitle"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Title field"),
        Description("Title field name")]
        public string SetTitleField { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("SetTitle"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Source fields"),
        Description("Format: [\"FieldTitle1\", \"FieldTitle2\"]")]
        public string SetTitleSourceFieldsJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("SetTitle"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Format"),
        Description("Example: {0} - {1} - {2}")]
        public string SetTitleFormat { get; set; }
        #endregion

        #region TextAreaChoices - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("TextAreaChoices"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable text areas choices")]
        public bool TextAreaChoicesEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("TextAreaChoices"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Choices Label"),
        Description("Choices label text")]
        public string TextAreaChoicesLabel { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("TextAreaChoices"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Choices params in JSON format"),
        Description("Format: [{\"TextField\":\"Field1\", \"Choices\" [\"Choice11\", \"Choice12\"]}, \"TextField\":\"Field2\", \"Choices\": [\"Choice21\", \"Choice22\"]}]")]
        public string TextAreaChoicesFieldsOptionsJSON { get; set; }
        #endregion

        #region Show elements by select options - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Show elements by select"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable show elements by groups")]
        public bool ShowElementsBySelectEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Show elements by select"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Fields root selection tag"),
        Description("Selection tag: tr, div")]
        public string ShowElementsBySelectTag { get; set; }

        public enum ShowElementsBySelectModeList { hide, disable };
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Show elements by select"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Mode"),
        Description("Options: hide, disable")]
        public ShowElementsBySelectModeList ShowElementsBySelectMode { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("Show elements by select"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Map select options to fields JSON"),
        Description("Format:  [{\"SelectField\": \"SelectFieldTitle1\", \"Option\":\"OptionTitle1\", \"Fields\": [\"Field1\", \"Field2\"], \"Elements\": [\"selector1\", \"selector2\"]}]")]
        public string ShowElementsBySelectFieldsJSON { get; set; }
        #endregion

        #region AutoCompleteInputs - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("AutoCompleteInputs"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable AutoComplete")]
        public bool AutoCompleteInputsEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("AutoCompleteInputs"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("AutoComplete fields params JSON"),
        Description("Format:  {\"FormUrlField1\": {\"ListId\": \"GUID\", \"WebUrl\": \"URL\", \"ListFieldIntName\": \"Title\", \"Folder\": \"FolderName\", \"UpdateButton\": \"true\", \"FieldsMap\": [[\"ListFieldIntName1\", \"FormFieldTitle1\"], [\"ListFieldIntName2\", \"FormFieldTitle2\"]]}}")]
        public string AutoCompleteInputsFieldsParamsJSON { get; set; }
        #endregion

        #region ExtendedLookup - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ExtendedLookup"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable ExtendedLookup")]
        public bool ExtendedLookupEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ExtendedLookup"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("AutoComplete fields params JSON"),
        Description("Format: {\"FormSelectField1\": {\"ListField\": \"LookupListFieldIntName1\", \"ListId\": \"GUID\", \"WebUrl\": \"URL\", FieldsMap:[[\"lookupListFieldIntName1\",\"formFieldTitle1\"], [\"lookupListFieldIntName2\",\"formFieldTitle1\"]]}}")]
        public string ExtendedLookupParamsJSON { get; set; }
        #endregion

        #region ListItem - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable component")]
        public bool ListItemEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("OnlyUpdate"),
        Description("Disable create item mode")]
        public bool ListItemOnlyUpdate { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("UrlField title"),
        Description("Title of url field")]
        public string ListItemUrlFieldDescription { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Destination Web Url"),
        Description("Destination list web url")]
        public string ListItemWebUrl { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Destination List Id"),
        Description("Destination list GUID")]
        public string ListItemListId { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Fields map"),
        Description("Format: [[\"dstFieldIntName1\": \"formField1\"], [\"dstFieldIntName2\": \"formField2\"]]")]
        public string ListItemFieldsMapJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Dst url field - dst int name"),
        Description("Internal name of destionation url field")]
        public string ListItemDstUrlFieldName { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItem"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Dst url field - src field for desc"),
        Description("Source field name for destination url field description")]
        public string ListItemDstUrlFieldSrcFieldName { get; set; }
        #endregion

        #region ListItemCopy - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItemCopy"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable component")]
        public bool ListItemCopyEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItemCopy"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Dst list new form url"),
        Description("New form url of destination list")]
        public string ListItemCopyNewFormUrl { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItemCopy"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Add button after selector"),
        Description("Css selector to add create button after")]
        public string ListItemCopyAfterSelector { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItemCopy"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Button title"),
        Description("Button title (optional)")]
        public string ListItemCopyTitle { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItemCopy"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Fields map"),
        Description("Format: [[\"formField1\": \"dstField1\"], [\"formField2\": \"dstField2\"]]")]
        public string ListItemCopyFieldsMapJSON { get; set; }

        public enum ListItemCopyModeList { Create, Get, Both };
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("ListItemCopy"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Copy mode"),
        Description("Create - adds button to create item, Get - should be selected in dst list for new form, Both - create and get modes")]
        public ListItemCopyModeList ListItemCopyMode { get; set; }
        #endregion

        #region CustomForm - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable custom form")]
        public bool CustomFormEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("InitTabs"),
        Description("InitTabs")]
        public bool CustomFormInitTabs { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Selectors map"),
        Description("Format: [[\"srcSelector1\", \"dstSelector1\"], [\"srcSelector2\": \"dstSelector2\"]]")]
        public string CustomFormSelectorsMapJSON { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("FullFormSelector"),
        Description("FullFormSelector")]
        public string CustomFormFullFormSelector { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("TabsRootSelector"),
        Description("TabsRootSelector")]
        public string TabsRootSelector { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("TabItemSelector"),
        Description("TabItemSelector")]
        public string TabItemSelector { get; set; }
        
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("CustomForm"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("TabContentItemSelector"),
        Description("TabContentItemSelector")]
        public string TabContentItemSelector { get; set; }
        #endregion

        #region SetFieldsBySelect - properties
        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("SetFieldsBySelect"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Enable"),
        Description("Enable set fields by select")]
        public bool SetFieldsBySelectEnable { get; set; }

        [Browsable(true),
        System.Web.UI.WebControls.WebParts.WebBrowsable(true),
        Category("SetFieldsBySelect"),
        DefaultValue("Default Name"),
        System.Web.UI.WebControls.WebParts.Personalizable(System.Web.UI.WebControls.WebParts.PersonalizationScope.Shared),
        Microsoft.SharePoint.WebPartPages.FriendlyName("Map select options to fields JSON"),
        Description("Format:  [{\"SelectField\": \"SelectFieldTitle1\", \"Option\":\"OptionTitle1\", \"FieldsValuesMap\": [[\"Field1\", \"Value1\"], [\"Field2\", \"Value2\"]], \"FieldsValuesMapDefault\": [[\"Field1\", \"Value1\"], [\"Field2\", \"Value2\"]]}]")]
        public string SetFieldsBySelectFieldsJSON { get; set; }
        #endregion

        // Uncomment the following SecurityPermission attribute only when doing Performance Profiling on a farm solution
        // using the Instrumentation method, and then remove the SecurityPermission attribute when the code is ready
        // for production. Because the SecurityPermission attribute bypasses the security check for callers of
        // your constructor, it's not recommended for production purposes.
        // [System.Security.Permissions.SecurityPermission(System.Security.Permissions.SecurityAction.Assert, UnmanagedCode = true)]
        public FormChangeVisualWebPart()
        {
        }

        private readonly List<string> JSScriptsToLoad = new List<string>{
            "/_layouts/15/FormChangeWebPart/bundle.js?v=2.16.1",
        };

        private readonly List<string> CSSFilesToLoad = new List<string>{
            "/_layouts/15/FormChangeWebPart/TabsManager.css?v=1.0.3",
        };
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            InitializeControl();
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            LoadJSScripts();
        }

        private void LoadJSScripts()
        {
            JSScriptsToLoad.ForEach(f =>
                {
                    string jsName = f.Split('/').Last();
                    Page.ClientScript.RegisterClientScriptInclude(jsName, f);
                });
            CSSFilesToLoad.ForEach(f =>
                {
                    string css = "<link href=\"" + f + "\" type=\"text/css\" rel=\"stylesheet\" />";
                    Page.ClientScript.RegisterClientScriptBlock(this.GetType(), "cssFile", css, false);
                });
        }
    }
}
