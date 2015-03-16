/**
* Class for Toolbar
* @class
* @param {Object} options Options for this Panel
* @param {JQuery} options.element Toolbar's element
* @param {JQuery} options.brand Toolbar's brand
*/
function Toolbar(options) {
	/**
	* The Jquery element of this Toolbar's holder
	* @type {JQuery}
	*/
	this.holderElement = $("\
		<div class='navbar navbar-default navbar-fixed-top'>\
			<div class='container-fluid'>\
				<div class='navbar-heading'>\
      		<span class='navbar-brand' href='#'>" + options.brand + "</span>\
					<div class='navbar-left'></div>\
					<div class='navbar-right'></div>\
				</div>\
			</div>\
		</div>");
	/**
	* The Jquery element of the left side of this Toolbar
	* @type {JQuery}
	*/
	this.elementLeft = this.holderElement.children(".container-fluid").children(".navbar-heading").children(".navbar-left");
	/**
	* The Jquery element of the right side of this Toolbar
	* @type {JQuery}
	*/
	this.elementRight = this.holderElement.children(".container-fluid").children(".navbar-heading").children(".navbar-right");
	options.element.append(this.holderElement);
	var self = this;

}
Toolbar.prototype = {};
/**
* Adds a control to this Toolbar (chainable)
* @method
* @param {Control} control The control to be added
* @param {Boolean} [right] Is the control right or left?
*/
Toolbar.prototype.add = function(control,options) {
	options = options || {};
	control.prepareToolbar();
	var newlet;
	newlet = $("<div class='navbar-left navbar-form'></div>");
	newlet.append(control.element);
	if(options.right) {
		this.elementRight.prepend(newlet);
	} else {
		this.elementLeft.append(newlet);
	}
	control.holder = newlet;
	return this;
}
