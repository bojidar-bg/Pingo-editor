/**
* Class for text controls(descriptions, etc.)
* @class
* @extends Control
* @param {Object} options - Options for this TextControl
* @param {String} options.text - text
*/
function TextControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this TextControl
	* @type {JQuery}
	*/
	this.element = $("<span class='btn-block'>" + options.text + "</span>");
}
TextControl.prototype = Object.create(Control.prototype);
TextControl.prototype.prepareToolbar = function() {
	this.element.removeClass("btn-block");
}
/**
* Changes the text of this TextControl (chainable)
* @param {String} text The new text
* @return                this (for chaining)
*/
TextControl.prototype.setText = TextControl.prototype.set = function(text) {
	this.element.html(text);
	return this;
}
