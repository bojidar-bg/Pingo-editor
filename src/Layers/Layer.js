/**
* Class for Layers
* @class
* @param {Object} options Options for this Panel
*/
function Layer(options) {
	/**
	* The Jquery element of this Layer
	* @type {JQuery}
	*/
	this.element = $("<div class='layer'></div>");
	/**
	* The name of this Layer
	* @type {String}
	*/
	this.name = "Unnamed layer";
	this.activated = new Event();
}
Layer.prototype = {};
