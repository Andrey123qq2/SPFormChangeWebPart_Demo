import { FormFieldWrappersManager } from 'spform-field-wrapper';

export class SPFormHelpers {
    public static setFieldsBySPListItem(listItem: SP.ListItem, fieldsMap: Array<Array<string>> = []): void {
        let ffwManager = FormFieldWrappersManager.getInstance();
        let processedUserFields: Array<string> = [];
        fieldsMap.forEach(fMap => {
            let lookupFieldValue = listItem.get_item(fMap[0]);
            if (lookupFieldValue == null || typeof lookupFieldValue == "undefined")
                return;
            let formField = fMap[1];
            let fieldWrapper = ffwManager.getField(formField);
            // set null to user field only if it is filled first time in this loop
            if (fieldWrapper.fieldType.match("User") && processedUserFields.indexOf(formField) == -1) {
                fieldWrapper.value = null;
                processedUserFields.push(formField);
            };
            // set empty array instead of null userFieldValue if this field was processed
            if (fieldWrapper.fieldType.match("User") && processedUserFields.indexOf(formField) != -1 && lookupFieldValue == null)
                lookupFieldValue = [];
            fieldWrapper.value = lookupFieldValue;
        });
    }

    public static getCurrentItemSPFieldUrlValue(description: string): SP.FieldUrlValue {
        let currentItemUrl = location.href.replace("EditForm", "DispForm").replace(/&.*$/, "");
        var fieldUrlValue = new SP.FieldUrlValue();
        fieldUrlValue.set_url(currentItemUrl);
        fieldUrlValue.set_description(description);
        return fieldUrlValue;
    }

    public static addHtmlAfterSelector(html: string, afterSelector: string): void {
        let wrappedHtml = "<div style='margin-top: 4px;'>" + html + "</div>";
        let htmlToNode = new DOMParser().parseFromString(wrappedHtml, 'text/html').body.childNodes[0];
        document.querySelector(afterSelector).appendChild(htmlToNode); //".related-tasks"
    }

    public static addFieldAfter(fieldTitle: string, fieldContent: string, fielTitleAfter: string): void {
        var tableRowHtml = "<td nowrap=\"true\" valign=\"top\" width=\"113px\" class=\"ms-formlabel\">\
		<h3 class=\"ms-standardheader\"><nobr>" + fieldTitle + "</nobr></h3></td>\
		<td valign=\"top\" width=\"350px\" class=\"ms-formbody\">" + fieldContent + "</td>";
        let formHeaders = document.querySelectorAll(".ms-h3.ms-standardheader");
        Array.prototype.slice.call(formHeaders).forEach(h => {
            if (h.textContent.trim() == fielTitleAfter) {
                let fieldTableRow = h.closest("tr");
                let newTableRow = document.createElement("tr");
                newTableRow.innerHTML = tableRowHtml;
                fieldTableRow.after(newTableRow);
            };
        });
    }
    public static resizeModalDialog(): void {
        SP.SOD.executeOrDelayUntilScriptLoaded(this._resizeModalDialog, 'sp.ui.dialog.js');
    }

    private static _resizeModalDialog() {
        let dlg: any = SP.UI.ModalDialog.get_childDialog();

        if (dlg != null) {
            // dlg.$Q_0 - is dialog maximized
            // dlg.get_$b_0() - is dialog a modal

            //if (!dlg.$Q_0 && dlg.get_$b_0()) {
            // resize the dialog
            dlg.autoSize();
            let xPos, yPos, //x & y co-ordinates to move modal to...
                win = (SP.UI.Dialog as any).get_$1(), // the very bottom browser window object
                xScroll = (SP.UI.Dialog as any).$1x(win), // browser x-scroll pos
                yScroll = (SP.UI.Dialog as any).$20(win); // browser y-scroll pos

            //SP.UI.Dialog.$1P(win) - get browser viewport width
            //SP.UI.Dialog.$1O(win) - get browser viewport height
            //dlg.$3_0 - modal's DOM element

            // calculate x-pos based on viewport and dialog width
            xPos = (((SP.UI.Dialog as any).$1P(win) - dlg.$3_0.offsetWidth) / 2) + xScroll;

            // if x-pos is out of view (content too wide), re-position to left edge + 10px
            if (xPos < xScroll + 10) { xPos = xScroll + 10; }

            // calculate y-pos based on viewport and dialog height
            yPos = (((SP.UI.Dialog as any).$1O(win) - dlg.$3_0.offsetHeight) / 2) + yScroll;

            // if x-pos is out of view (content too high), re-position to top edge + 10px
            if (yPos < yScroll + 10) { yPos = yScroll + 10; }

            // store dialog's new x-y co-ordinates
            dlg.$K_0 = xPos;
            dlg.$W_0 = yPos;

            // move dialog to x-y pos
            dlg.$p_0(dlg.$K_0, dlg.$W_0);

            // set dialog title bar text width
            dlg.$1b_0();

            // size down the dialog width/height if it's larger than browser viewport
            dlg.$27_0();

            //}

        }

    }
}