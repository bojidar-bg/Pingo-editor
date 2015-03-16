/**
* Base class for controls to inherit
* @class
*/
function Control() {
	/**
	* The Jquery element of this Control
	* @type {JQuery}
	*/
	this.element = null;
	/**
	* The Jquery holder of this Control
	* @type {JQuery}
	*/
	this.holder = null;
	/**
	* The label of this Control (applicable only before add, use .setLabel afterwards)
	* @type {String}
	*/
	this.label = null;
	/**
	* The value of this Control
	* @type {*}
	*/
	this.value = null;
}
Control.prototype = {};
Control.prototype.prepareToolbar = function(){}
/**
 * Remove this Control
 * @method
 */
Control.prototype.remove = function(){
	this.holder.trigger("controlRemoved");
	this.holder.remove();
}
Control.prototype.set = function(value) {}
Control.prototype.setLabel = function(label) {}
