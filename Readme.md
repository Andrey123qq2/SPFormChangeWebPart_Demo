# Description
Classic SharePoint forms customization WebPart solution based on javascript.

### Features:
1. Consists of components that configured in the WebPart settings panel
1. The classic WebPart is choosed as the basis for storing components settings
1. The base of the solution is the script /Layouts/FormChangeWebPart/bundle.js, which is a compiled assembly of TypeScript files
1. Does not use external dependencies such as jQuery and plugins built on it (only internal SP dependencies and native JS)
1. Components logic is based on the TypeScript FormFieldWrapper classes, which are wrappers around html form fields and provide an interface for interacting with fields (reading/writing values, blocing/hiding, adding handlers, etc.)

### Components list
1. CustomForm
1. SetTitle
1. AutoCompleteInputs
1. ShowElementsBySelect
1. ShowElementsByGroups
1. ListItem
1. SaveWOCloseButton (not in demo)
1. Attachments (not in demo)
1. DocSet (not in demo)
1. ExtendedLookup (not in demo)
1. ListItemCopy (not in demo)
1. RelatedItemsGetItems (not in demo)
1. RelatedItemsGetTasks (not in demo)
1. RelatedItemsGetByFields (not in demo)
1. RelatedItemsGetByFieldsMulti (not in demo)
1. TextAreaChoices (not in demo)
1. UserAttributes (not in demo)
1. SetFieldsBySelect (not in demo)