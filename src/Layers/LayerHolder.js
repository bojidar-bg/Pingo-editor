/**
 * A class for layer holders
 * @param {Object} options Options for this LayerHolder
 * @param {Jquery} options.element Element for this LayerHolder
 * @class
 */
function LayerHolder(options) {
	/**
	* The Jquery holder element of this LayerHolder
	* @type {JQuery}
	*/
	this.holderElement = $("\
	<div class='layers-holder'>\
		<div class='layers'></div>\
		<div class='layers-overlay'></div>\
	</div>");
	/**
	* The Jquery element of this LayerHolder
	* @type {JQuery}
	*/
	this.element = this.holderElement.children(".layers");
	this.activeLayer = false;
	/**
	* The Jquery overlay element of this LayerHolder
	* @type {JQuery}
	*/
	this.overlayElement = this.holderElement.children(".layers-overlay");
	var self = this;
	this.overlayElement.on("\
	click dblclick mousedown mouseup\
	mousemove mouseover mouseout mouseenter mouseleave\
	keypress keyup keydown",function(event){
		if(!self.activeLayer)return;
		var x = event.pageX;
		var y = event.pageY;
		var nearest = self.activeLayer.element.find("*").nearest({x:x,y:y},{sameX:true,sameY:true});
		if(nearest.length)nearest.trigger(event);
		else self.activeLayer.element.trigger(event);
	});
	options.element.append(this.holderElement);
	this.added = new Event();
	this.activeChanged = new Event();
	this.layers = [];
}
LayerHolder.prototype = {};
/**
 * Add a layer into this holder
 * @param {Layer} layer The layer to be added
 */
LayerHolder.prototype.add = function(layer) {
	this.element.append(layer.element);
	this.layers.push(layer);
	this.added.dispatch(layer);
	this.set(layer);
}
/**
 * Set the active layer of this holder
 * @param {Layer} layer The layer to be set as active
 */
LayerHolder.prototype.set = function(layer) {
	this.activeLayer = layer;
	this.activeChanged.dispatch(layer);
	layer.activated.dispatch(layer);
}
