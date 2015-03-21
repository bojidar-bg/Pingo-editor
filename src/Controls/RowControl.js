/**
* Class for horizontal lists of controls
* @class
* @extends Control
* @param {Object} options - Options for this RowControl
*/
function RowControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this RowControl
	* @type {JQuery}
	*/
	this.element = $("<div class='form-inline'></div>");
}
RowControl.prototype = Object.create(Control.prototype);
/**
* Adds a control to this RowControl (chainable)
* @method
* @param {Control} control The control to be added
*/
RowControl.prototype.add = function(control) {
	control.prepareToolbar();
	var newlet = $("<div class='form-group'></div>");
	newlet.append(control.element);
	control.holder = newlet;
	this.element.append(newlet);
	//this.holder._updateScrollbar();
	return this;
}
