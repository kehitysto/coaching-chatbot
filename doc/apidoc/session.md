# Global





* * *

## Class: exports



## Class: exports


### exports.beginDialog(dialogId, inPlace) 

Start a new dialog

**Parameters**

**dialogId**: `string`, ID of the new dialog to start

**inPlace**: `boolean`, do not progress dialog on returning


### exports.endDialog() 

End execution of the current dialog, and return control to parent


### exports.resetDialog() 

Restart the current dialog from the beginning


### exports.switchDialog(dialogId) 

Switch execution to a different dialog
Replaces the top level of the dialog stack with the new dialog,
 control will be returned to current parent when
 endDialog() is called.

**Parameters**

**dialogId**: `string`, ID of the dialog to switch to


### exports.clearState() 

Completely reset the dialog stack
Control will return to the beginning of the '/' dialog.


### exports.addResult(templateId, quickReplies) 

Add a response to give to the user

**Parameters**

**templateId**: `string`, ID of the string template to use

**quickReplies**: `Array.&lt;{title: string, payload: string}&gt;`, Add a response to give to the user


### exports.send(message, quickReplies) 

Add a response to give to the user

**Parameters**

**message**: `string`, The message to send to the user

**quickReplies**: `Array.&lt;{name: string, payload: string}&gt;`, Add a response to give to the user


### exports.runActions(actionArr, input) 

**Parameters**

**actionArr**: `Array.&lt;string&gt; | string`, ID(s) of actions to be run

**input**: `string`, Optional input to use instead of user message


### exports.next() 

Skip to the next substate of the current dialog


### exports.prev() 

Return to the previous substate of the current dialog




* * *










