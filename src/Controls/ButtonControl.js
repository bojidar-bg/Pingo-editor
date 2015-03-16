/**
* Class for buttons
* @class
* @extends Control
* @param {Object} options - Options for this ButtonControl
* @param {String} options.text - button text
* @param {String} [options.label] - label to be included
* @param {Boolean}[options.toggle] - make the button a toggle-button
*/
function ButtonControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this ButtonControl
	* @type {JQuery}
	*/
	this.element = $("<button type='button' class='btn btn-default btn-block'>" + options.text + "</button>");
	this._isToggle = options.toggle;
	this.value = false;
	var self = this;
	this.clicked = new Event();
	this.element.click(function() {
		if(self._isToggle) {
			self.element.toggleClass('active');
			self.value = !self.value;
		}
		self.clicked.dispatch(self);
	});
	this.label = options.label;
}
ButtonControl.prototype = Object.create(Control.prototype);
ButtonControl.prototype.prepareToolbar = function() {
	this.element.removeClass("btn-block");
}
/**
* Changes the text of this ButtonControl (chainable)
* @param {String} text The new text
* @return              this (for chaining)
*/
ButtonControl.prototype.setText = function(text) {
	this.element.html(text);
	return this;
}
/**
* Changes the state (toggled/untoggled) of this ButtonControl (chainable)
* @param {Boolean} state The new state
* @return                this (for chaining)
*/
ButtonControl.prototype.setState = ButtonControl.prototype.set = function(state) {
	if(self._isToggle) {
		self.element.toggleClass('active');
		self.value = !self.value;
	}
	return this;
}
