/**
* Class for Layers
* @class
* @param {Object} options Options for this Panel
* @param {JQuery} options.element Layers's element
*/
function Layer(options) {
	/**
	* The Jquery element of this Layer
	* @type {JQuery}
	*/
	this.element = $("<div class='layer'></div>");
	options.element.append(this.element);
}
Layer.prototype = {};
