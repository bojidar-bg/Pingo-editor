/**
* Class for select boxes
* @class
* @extends DropdownControl
* @param {Object} options - Options for this DropdownControl
* @param {ListItem[]} options.items - items to be put in the dropdown
* @param {String} [options.label] - label to be included
*/
function SelectControl(options) {
	options = options || {};
	options.text = "";
	DropdownControl.call(this,options);
	this._hasText = false;
	self = this;
	this.action.add(function(){self.setText(this.text);});
}
SelectControl.prototype = Object.create(DropdownControl.prototype);
SelectControl.prototype._add = SelectControl.prototype.add;
/**
* Adds a ListItem to this select control
* @param {ListItem} listItem ListItem to be added
*/
SelectControl.prototype.add = function(listItem) {
	if(!this._hasText && !listItem.divider)
	{
		if(listItem.disabled)
		{
			this.set(listItem.text);
		}
		else
		{
			this.action.dispatch(listItem);
		}
		this._hasText = true;
	}
	this._add(listItem);
}
//TODO - add set functionality
