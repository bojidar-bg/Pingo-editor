/**
* Class for vertical lists of controls
* @class
* @extends Control
* @param {Object} options - Options for this ColumnControl
*/
function ColumnControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this ColumnControl
	* @type {JQuery}
	*/
	this.element = $("<div class='panel panel-default'><div class='panel-body list'></div></div>");
	/**
	* The Jquery list element of this ColumnControl
	* @type {JQuery}
	*/
	this.listElement = this.element.children(".list");
}
ColumnControl.prototype = Object.create(Control.prototype);
ColumnControl._setLabel = function(label) {
	this.holder.children("label").html(label);
}
/**
* Adds a control to this RowControl (chainable)
* @method
* @param {Control} control The control to be added
*/
ColumnControl.prototype.add = function(control) {
	var newlet;
	if(control.label) {
		newlet = $("<div class='from-group'><label class='col-xs-4 control-label'>"+control.label+"</label><div class='col-xs-8'></div><div class='clearfix'></div></div>");
		newlet.children(".col-xs-8").append(control.element);
	} else {
		newlet = $("<div class='from-group'><div class='col-xs-12'></div><div class='clearfix'></div></div>");
		newlet.children(".col-xs-12").append(control.element);
	}
	control.holder = newlet;
	control.setLabel = ColumnControl._setLabel;
	this.listElement.append(newlet);
	//this.holder._updateScrollbar();
	return this;
}
