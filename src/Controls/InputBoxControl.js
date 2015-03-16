/**
* Class for input boxes controls
* @class
* @extends Control
* @param {Object} [options] - Options for this InputBoxControl
* @param {String} [options.placeholder] - placeholder text
* @param {Boolean}[options.password] - is this InputBoxControl used for password input?
* @param {String} [options.label] - label to be included
*/
function InputBoxControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this InputBoxControl
	* @type {JQuery}
	*/
	this.element = $("<input type='" + (Utils.optional(options.password,false)?"password":"text") +
		"' class='form-control' placeholder='" + Utils.optional(options.placeholder,"") +
	"'>");
	var self = this;
	/**
	* The "changed" event (context = InputBoxControl)
	* @type {Event}
	*/
	this.changed = new Event();
	this.element.keyup(function() {self.value = self.element.val();self.changed.dispatch(self);});
	this.label = options.label;
}
InputBoxControl.prototype = Object.create(Control.prototype);
/**
* Changes the value of this InputBoxControl (chainable)
* @param {String} text The new text
* @return                this (for chaining)
*/
InputBoxControl.prototype.setText = InputBoxControl.prototype.set = function(value) {
	this.element.val(value);
	return this;
}
