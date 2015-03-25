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
;/**
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
	if(this._isToggle) {
		if(state)
		{
			this.element.addClass('active');
			this.value = true;
		}
		else
		{
			this.element.removeClass('active');
			this.value = false;
		}
	}
	return this;
}
;/**
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
;/**
* Class for dropdowns
* @class
* @extends Control
* @param {Object} options - Options for this DropdownControl
* @param {ListItem[]} [options.items] - items to be put in the dropdown
* @param {String} options.text - text for the dropdown button
* @param {String} [options.label] - label to be included
*/
function DropdownControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this DropdownControl
	* @type {JQuery}
	*/
	this.element = $("\
	<div class='btn-group btn-group-justified'>\
		<div class='btn-group'>\
			<button type='button' class='btn btn-default dropdown-toggle force-radius' data-toggle='dropdown'>\
		  	<span class='text'>" + options.text + "</span>\
				<span class='caret'></span>\
			</button>\
			<ul class='dropdown-menu'></ul>\
		</div>\
	</div>");
	/**
	* The "action" event (context = ListItem)
	* @type {Event}
	*/
	this.action = new Event();
	this.label = options.label;
	if(options.items)
	{
		for(var i in options.items)
		{
			this.add(options.items[i]);
		}
	}
}
DropdownControl.prototype = Object.create(Control.prototype);
DropdownControl.prototype.prepareToolbar = function() {
	this.element.removeClass("btn-group-justified");
}
/**
* Adds a ListItem to this dropdown control
* @param {ListItem} listItem ListItem to be added
*/
DropdownControl.prototype.add = function(listItem) {
	var item;
	if(listItem.disabled)
	{
		item = $("<li><span class='text-muted'>" + listItem.text + "</span></li>");
	}
	else if(listItem.divider)
	{
		item = $("<li class='divider'></li>");
	}
	else
	{
		item = $("<li><a>" + listItem.text + "</a></li>");
		(function(listItem,self){
			item.click(function() {
				self.action.dispatch(listItem);
				listItem.selected.dispatch(listItem);
			})
		})(listItem,this);
	}
	listItem.element = item;
	this.element.children("div").children("ul").append(item);
}
/**
* Changes te text of this DropdownControl (chainable)
* @param {String} text The new text
* @return                this (for chaining)
*/
DropdownControl.prototype.setText = DropdownControl.prototype.set = function(text) {
	this.element.find(".text").html(text);
	return this;
}
;/**
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
;/**
* ListItem class
* @class
* @param {Object} options - Options for this ListItem
* @param {String} [options.text] - Text for this ListItem (if not a divider)
* @param {Boolean} [options.disabled] - Is this ListItem disabled?
* @param {Boolean} [options.divider] - Is this ListItem a divider?
*/
function ListItem(options) {
	this.text = Utils.optional(options.text, "N/A");
	this.disabled = Utils.optional(options.disabled, false);
	this.divider = Utils.optional(options.divider, false);
	/**
	* The Jquery element of this ListItem
	* @type {JQuery}
	*/
	this.element = null;
	/**
	* The "selected" event (context = ListItem)
	* @type {Event}
	*/
	this.selected = new Event();
}
;/**
* Class for progress bars
* @class
* @extends Control
* @param {Object} options - Options for this ProgressBarControl
* @param {Number} [options.progress] - the initial progress {1 - 100%}
* @param {Boolean}[options.showText] - show percentage on this ProgressBarControl
* @param {String} [options.label] - label to be included
*/
function ProgressBarControl(options) {
	options = options || {};
	Control.call(this);
	options.progress = Utils.optional(options.progress,0);
	/**
	* The Jquery element of this ProgressBarControl
	* @type {JQuery}
	*/
	this.element = $("<div class='progress'><div class='progress-bar'><span></span></div></div>");
	/**
	* The element of the bar of this ProgressBarControl
	* @type {JQuery}
	*/
	this.progressbar = this.element.children(".progress-bar");
	/**
	* The text of the bar of this ProgressBarControl
	* @type {JQuery}
	*/
	this.progressbarText = this.progressbar.children();
	this.progressbar.css("width", options.progress + "%");
	this.progressbarText.html(parseInt(options.progress) + "%");
	if(!Utils.optional(options.showText,false)) {
		this.progressbarText.addClass("hidden");
	} else {
		this.progressbar.css("min-width","2em");
	}
	this.label = options.label;
}
ProgressBarControl.prototype = Object.create(Control.prototype);
/**
 * Set the progress of the ProgressBarControl
 * @param {Number} progress The new progress {1 - 100%}
 * @param {Boolean} animated Should the transition be animated?
 * @method
 */
ProgressBarControl.prototype.set = function(progress,animated)
{
	if(animated) {
		this.progressbar.animate({"width" : progress + "%"});
	} else {
		this.progressbar.css({"width" : progress + "%"});
	}
	this.progressbarText.html(parseInt(progress) + "%");
}
;/**
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
;/**
* Class for select boxes
* @class
* @extends DropdownControl
* @param {Object} options - Options for this DropdownControl
* @param {ListItem[]} options.items - items to be put in the dropdown
* @param {String} [options.label] - label to be included
*/
function SelectControl(options) {
	options = options || {};
	options.text = "";
	DropdownControl.call(this,options);
	this._hasText = false;
	var self = this;
	this.action.add(function(){self.setText(this.text);});
}
SelectControl.prototype = Object.create(DropdownControl.prototype);
SelectControl.prototype._add = SelectControl.prototype.add;
/**
* Adds a ListItem to this select control
* @param {ListItem} listItem ListItem to be added
*/
SelectControl.prototype.add = function(listItem) {
	if(!this._hasText && !listItem.divider)
	{
		if(listItem.disabled)
		{
			this.set(listItem.text);
		}
		else
		{
			this.action.dispatch(listItem);
		}
		this._hasText = true;
	}
	this._add(listItem);
}
//TODO - add set functionality
;/**
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
;/**
* Application class
* @class
* @param {Object} options options for this application
*/
function Application(options) {
	var self = this;
	//--Panels--//
	this.left = new PanelTarget({element:$("#left .panel-target-holder"),app:this});
	this.right = new PanelTarget({element:$("#right .panel-target-holder"),isRight:true,app:this});
	this.toolbar = new Toolbar({element:$("#navbar"),brand:"<span class='glyphicon glyphicon-pencil'></span> Pingo"});
	this.activePanelTarget = this.left;
	//--Menus--//
	this.dataBackend = null;
	this.menus = {};
	this.menus.addPanel = new DropdownControl({text:"Add panel"});
	this.menus.addLayer = new DropdownControl({text:"Add layer"});
	this.menus.selectBackend = new SelectControl();
	this.menus.selectBackend.add(new ListItem({text:"Select backend",disabled:true}));
	this.menus.selectBackend.add(new ListItem({divider:true}));
	this.register._app = this;
	this.toolbar.add(this.menus.addPanel,{"right":true});
	this.toolbar.add(this.menus.addLayer,{"right":true});
	this.toolbar.add(this.menus.selectBackend,{"right":true});
	//--Layers--//
	this.layerHolder = new LayerHolder({"element":$("body")});
	var layers = this.layerHolder.element;
	var layersHolder = this.layerHolder.holderElement;
	var startX = 0;
	var startY = 0;
	var currentX = 0;
	var currentY = 0;
	layersHolder.css("background","url(" + this._drawGrid() + ")");
	//Pan//
	var startX, startY;
	layersHolder.drag("dragstart", function(event,data) {
		startX = parseInt(layers.css("margin-left"));
		startY = parseInt(layers.css("margin-top"));
	},{which:2});
	layersHolder.drag("drag", function(event,data) {
		currentX = startX + data.deltaX;
		currentY = startY + data.deltaY;
		layers.css("margin-left", currentX);
		layers.css("margin-top", currentY);
		layersHolder.css("background-position-x", currentX);
		layersHolder.css("background-position-y", currentY);
	},{which:2});
	//Zoom//
	layersHolder.mousewheel(function(event) {
		var relativeMouseX = event.pageX - currentX;
		var relativeMouseY = event.pageY - currentY;
		var oldZoom = self._zoom;
		if(event.deltaY * event.deltaFactor > 0)// zoom in
		{
			self._zoom += event.deltaY * event.deltaFactor * 0.001 * self._zoom;
		}
		else// zoom out
		{
			self._zoom += 1/(event.deltaY) * event.deltaFactor * 0.001 * self._zoom;
		}
		if(self._zoom > self._maxZoom)self._zoom = self._maxZoom;
		if(self._zoom < self._minZoom)self._zoom = self._minZoom;
		currentX += relativeMouseX - relativeMouseX * self._zoom / oldZoom;
		currentY += relativeMouseY - relativeMouseY * self._zoom / oldZoom;
		layers.css("margin-left", currentX);
		layers.css("margin-top", currentY);
		layers.css("transform","scale(" + self._zoom + "," + self._zoom + ")");
		//Draw the grid
		var backgroundSize = self._gridSize * self._zoom;
		while(backgroundSize/self._gridDivisions > self._gridSize) { // TODO - maybe these while cycles are unneeded?
			backgroundSize /= self._gridDivisions;
		}
		while(backgroundSize < self._gridSize) {
			backgroundSize *= self._gridDivisions;
		}
		self._realGridSize = backgroundSize;
		layersHolder.css("background","url(" + self._drawGrid() + ")");
		layersHolder.css("background-position-x", currentX);
		layersHolder.css("background-position-y", currentY);
	});
}
/*--Methods--*/
Application.prototype = {};
Application.prototype._gridDivisions = 4;
Application.prototype._gridSize = 200;
Application.prototype._realGridSize = 200;
Application.prototype._minZoom = 0.0625;
Application.prototype._zoom = 1;
Application.prototype._maxZoom = 4;
Application.prototype._drawGrid = function()
{
	var position = this._gridSize/this._realGridSize;
	this._drawGrid.canvas.width = this._drawGrid.canvas.height = this._realGridSize;
	var lineStyle = [{opacity:0,thickness:0,spacing:Infinity},{opacity:0,thickness:0,spacing:Infinity},{opacity:0,thickness:0,spacing:Infinity}];
	//Smallest lines//
	lineStyle[2].opacity = 1-position;
	lineStyle[2].thickness = lineStyle[2].opacity * 2;
	lineStyle[2].spacing = this._realGridSize / this._gridDivisions / this._gridDivisions;
	//Medium lines//
	lineStyle[1].opacity = 0.5;
	lineStyle[1].thickness = lineStyle[1].opacity * 2;
	lineStyle[1].spacing = this._realGridSize / this._gridDivisions;
	//Largest lines//
	lineStyle[0].opacity = position;
	lineStyle[0].thickness = lineStyle[0].opacity * 2;
	lineStyle[0].spacing = this._realGridSize;
	//Drawing//
	for(var i in lineStyle)
	{
		this._drawGrid.context.strokeStyle = "rgba(0,0,0," + lineStyle[i].opacity + ")";
		this._drawGrid.context.beginPath();
		for(var distance = 0; distance <= this._realGridSize; distance += lineStyle[i].spacing) {
			this._drawGrid.context.moveTo(distance, 0);
			this._drawGrid.context.lineTo(distance, this._realGridSize);
			this._drawGrid.context.moveTo(0, distance);
			this._drawGrid.context.lineTo(this._realGridSize, distance);
		}
		this._drawGrid.context.stroke();
	}
	return this._drawGrid.canvas.toDataURL();
}
Application.prototype._drawGrid.canvas = document.createElement("canvas");
Application.prototype._drawGrid.context = Application.prototype._drawGrid.canvas.getContext("2d");
	/**
	* Snaps coordinates x and y to nearest grid intersection
	* @param  {Number} x X coordinate
	* @param  {Number} y Y coordinate
	* @return {Object} coordinates x and y were snapped to ({x:<snapped on X>,y:<snapped on Y>})
	* @method
	*/
Application.prototype.snap = function(x,y) {
	var position = this._gridSize/this._realGridSize;
	var atraction = 8;
	var lineSnaps = [{spacing:1,force:0},{spacing:1,force:0},{spacing:1,force:0}];
	//Smallest lines//
	lineSnaps[2].force = 1-position;
	lineSnaps[2].spacing = this._realGridSize / this._gridDivisions / this._gridDivisions;
	//Medium lines//
	lineSnaps[1].force = 0.5;
	lineSnaps[1].spacing = this._realGridSize / this._gridDivisions;
	//Largest lines//
	lineSnaps[0].force = position;
	lineSnaps[0].spacing = this._realGridSize;
	//Snaping//
	for(var i in lineSnaps)
	{
		var x_dist = lineSnaps[i].spacing / 2 - Math.abs(Math.abs(x) % lineSnaps[i].spacing - lineSnaps[i].spacing / 2);
		var y_dist = lineSnaps[i].spacing / 2 - Math.abs(Math.abs(y) % lineSnaps[i].spacing - lineSnaps[i].spacing / 2);
		if(x_dist < lineSnaps[i].force * atraction)
		{
			x = Math.round(x/lineSnaps[i].spacing)*lineSnaps[i].spacing;
		}
		if(y_dist < lineSnaps[i].force * atraction)
		{
			y = Math.round(y/lineSnaps[i].spacing)*lineSnaps[i].spacing;
		}
	}
	return {x:x,y:y};
};
Application.prototype.register = {};
/**
 * Register a panel
 * @param {function} type The panel class
 * @method
 */
Application.prototype.register.Panel = function(type)
{
	var li = new ListItem({"text":(type.icon?"<img src=" + type.icon + " class='dropdown-icon'>":"") + type.label});
	var t = type;
	var self = this._app;
	li.selected.add(function() {
		var panel = new t(self);
		self.activePanelTarget.add(panel);
	});
	this._app.menus.addPanel.add(li);
}
/**
 * Register a data backend
 * @param {function} type The data backend class
 * @method
 */
Application.prototype.register.DataBackend = function(type)
{
	var li = new ListItem({"text":(type.icon?"<img src=" + type.icon + " class='dropdown-icon'>":"") + type.label});
	var t = type;
	var self = this._app;
	li.selected.add(function() {
		self.dataBackend = new t(self,{});
	});
	this._app.menus.selectBackend.add(li);
}
/**
 * Register a layer
 * @param {function} type The layer class
 * @method
 */
Application.prototype.register.Layer = function(type)
{
	var li = new ListItem({"text":(type.icon?"<img src=" + type.icon + " class='dropdown-icon'>":"") + type.label});
	var t = type;
	var self = this._app;
	li.selected.add(function() {
		var layer = new t(self);
		self.layerHolder.add(layer);
	});
	this._app.menus.addLayer.add(li);
}
;/**
* Class for event-based stuff
* @class
*/
function Event()
{
	this._handlers = [];
}
/**
* Register a handler for event(chainable)
* @method
* @param  {Function} handler  Callback to be called
* @return                     This, to allow for chaining
*/
Event.prototype.add = function(handler)
{
	this._handlers.push(handler);
	return this;
}
/**
* Calls all handlers for event.
* @method
* @param  {Object} self  Context for the handlers
* @return                This, to allow for chaining
*/
Event.prototype.dispatch = function(self)
{
	for(var i = this._handlers.length - 1; i >= 0; i--) {
		this._handlers[i].call(self);
	}
	return this;
}
/**
* Unegister a handler for event
* @method
* @param  {Function} handler  Callback to be removed
* @return                     True if the handler is removed successfilly
*/
Event.prototype.remove = function(handler)
{
	var index = this._handlers.indexOf(callback);
	if(ind == -1)return false;
	this._handlers.splice(index, 1);
	return true;
}
;/**
* Utility functions
* @type {Object}
* @namespace
*/
Utils = {
	/**
	 * Make a parameter optional
	 * @param  {Object} value param value
	 * @param  {Object} normal default value
	 * @return {Object} value if value is set, default otherwise
	 * @method
	 */
	optional: function(value, normal)
	{
		if(typeof value != typeof undefined) {
			return value;
		}
		else {
			return normal;
		}
	}
}
;/**
* Interface for the dataBackend
* @param {Object} options Options for this DataBackend
* @virtual
* @class
*/
function DataBackend(app,options) {
	/**
	 * The "received" event (context = DataBackend)
	 * @type {Event}
	 */
	this.received = new Event();
}
DataBackend.prototype = {};
/**
* Sends and event to the queue
* @param  {String}  event     Name of the event to be send
* @param  {Object}  eventData Data for the event
* @param  {Boolean} [minor]   Is dropping the event an option?
*/
DataBackend.prototype.send = function(event, eventData, minor) {}
/**
* Saves data
* @param  {String}  field     Name of the field to write to
* @param  {Object}  data      Data for saving
*/
DataBackend.prototype.save = function(field, data) {}
/**
* Retreive data stored in field
* @param  {String} field Field to read from
* @return {Object}       Data read
*/
DataBackend.prototype.retrieve = function(field) {}
;/**
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
}
Layer.prototype = {};
;/**
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
		self.activeLayer.element.find("*").nearest({x:x,y:y},{sameX:true,sameY:true}).trigger(event);
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
}
;/**
* Class for Panels
* @class
* @param {Object} options Options for this Panel
* @param {String} options.heading Panel's heading
*/
function Panel(options) {
	var element = $("\
	<div class='panel panel-default'>\
		<div class='panel-heading clearfix'>\
			<button type='button' class='panel-size icon-btn'>\
				<small class='glyphicon glyphicon-chevron-down'></small>\
			</button>\
			<h3 class='panel-title pull-left'>" + options.heading + "</h3>\
			<button type='button' class='panel-close icon-btn'>\
				<small class='glyphicon glyphicon-remove'></small>\
			</button>\
		</div>\
		<div class='panel-body'></div>\
	</div>");
		/**
		* The Jquery element of this Panel
		* @type {JQuery}
		*/
	this.element = element;
		/**
		* The Jquery element of this Panel's heading
		* @type {JQuery}
		*/
	this.headingElement = element.children(".panel-heading");
		/**
		* The Jquery element of this Panel's body
		* @type {JQuery}
		*/
	this.bodyElement = element.children(".panel-body");
	this._toggled = true;
	var self = this;
	this.headingElement.children(".panel-close").click(function() {
		self.destroy();
		$(this).off("click");
	})
	this.headingElement.children(".panel-size").click(function() {
		if(self._toggled)
		{
			$(this).children().removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-right");
			self.bodyElement.slideUp(400,function(){self._updateScrollbar()});
		}
		else
		{
			$(this).children().removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-down");
			self.bodyElement.slideDown(400,function(){self._updateScrollbar()});
		}
		self._toggled = !self._toggled;
	})
	this.element.on("controlRemoved",function(){self._updateScrollbar();});
	this._target = null;

}
Panel._setLabel = function(label){this.holder.children("label").html(label);}
Panel.panelName = "Generic Panel";
Panel.prototype = {};
Panel.prototype._updateScrollbar = function() {
	var p = this.element.parent();
	if(p && p.getNiceScroll())
	{
		p.getNiceScroll().resize();
	}
}
/**
* Adds a control to this Panel (chainable)
* @method
* @param {Control} control The control to be added
*/
Panel.prototype.add = function(control) {
	var newlet;
	if(control.label) {
		newlet = $("<div class='from-group'><label class='col-xs-4 control-label'>"+control.label+"</label><div class='col-xs-8'></div><div class='clearfix'></div></div>");
		newlet.children(".col-xs-8").append(control.element);
	} else {
		newlet = $("<div class='from-group'><div class='col-xs-12'></div><div class='clearfix'></div></div>");
		newlet.children(".col-xs-12").append(control.element);
	}
	control.holder = newlet;
	control.setLabel = Panel._setLabel;
	this.bodyElement.append(newlet);
	this._updateScrollbar();
	return this;
}
/**
* Destroy this Panel
* @method
*/
Panel.prototype.destroy = function() {
	this.element.parent().sortable("option","remove")(null,{});
	this.element.css({"height":this.element.css("height"),"margin-bottom":this.element.css("margin-bottom"),"opacity":"1"})
	this.element.animate({"height":"0px","opacity":"0","margin-bottom":"0px"},400,"easeInOutQuad",function(){$(this).remove()});
}
;/**
* Target for dropping panels
* @class
* @param {Object} options Options for this PanelTarget
* @param {JQuery} options.element Jquery element in which this PanelTarget will be placed
* @param {JQuery} options.app The Application this panel target is in.(used for Application.activePanelTarget)
* @param {Boolean} [options.isRight] Is this PanelTarget on the right?
*/
function PanelTarget(options) {
	/**
	* The Jquery element of this PanelTarget
	* @type {JQuery}
	*/
	this.element = $("<div class='panel-target contracted'></div>");
	/**
	* The extension of this PanelTarget
	* @type {PanelTarget}
	*/
	this.extendTarget = null;
	var self = this;
	this._count = 0;
	this._isRight = options.isRight;
	this._contracted = true;
	this._removed = false;
	this._app = options.app;
	this.element.sortable({//TODO: add functionality
		connectWith: ".panel-target",
		handle: ".panel-heading",
		placeholder: "panel-target-placeholder bg-primary",
		tolerance: "pointer",
		appendTo: $("#overlay"),
		opacity: 0.9,
		//zIndex: 104,
		distance: 30,
		helper: 'clone',
		start: function (event, ui) {
			$(ui.item).hide();
		},
		stop: function (event, ui) {
			$(ui.item).show();
		},
		remove: function(event, ui) {
			self._count--;
			if(self._count <= 0) {
				self.element.css({"width":self.element.css("width")})
				self.element.animate({"width":"0px"},400,"easeOutQuint",function(){$(this).remove()});
				self._removed = true;
			}
			else
			{
				self._app.activePanelTarget = self;
			}
		},
		receive: function(event, ui) {
			self._app.activePanelTarget = self;
			if(self.extendTarget == null) {
				self.extendTarget = new PanelTarget({
					element: self.element.parent(),
					isRight: self._isRight,
					app: self._app
				});
				if(self._contracted) {
					self._contracted = false;
					self.element.addClass("expanding").removeClass("contracted",400,"easeOutQuint",function(){self.element.removeClass("expanding")});
					self.element.niceScroll({
						horizrailenabled: false,
						railalign: "left",

					});
					if(self._isRight) {
						self.element.resizable({
							handles:"w",
							minWidth:200,
							resize: function(event,ui) {
								ui.element.css("left",0)
							}
						});
					} else {
						self.element.resizable({
							handles:"e",
							minWidth:200
						});
					}
				}
			}
			self._count++;
		}
	}).disableSelection();
	this.element.click(function(){
		self._app.activePanelTarget = self;
	});
	if(options.isRight) {
		options.element.prepend(this.element);
	} else {
		options.element.append(this.element);
	}
}
PanelTarget.prototype = {};
/**
* Adds a panel to this PanelTarget (chainable)
* @method
* @param {Panel} panel Panel to be added
*/
PanelTarget.prototype.add = function(panel) {
	var self = this;
	while(self && self._removed)self=self.extendTarget;
	if(!self)return;
	self._app.activePanelTarget = self;
	self.element.append(panel.element);
	if(self.extendTarget == null) {
		self.extendTarget = new PanelTarget({
			element: self.element.parent(),
			isRight: self._isRight,
			app: self._app
		});
		self.extendTarget._perviousTarget = self;
		if(self._contracted) {
			self._contracted = false;
			self.element.removeClass("contracted");
			self.element.niceScroll({
				horizrailenabled: false,
				railalign: "left"
			});
			if(self._isRight) {
				self.element.resizable({
					handles:"w",
					minWidth:200,
					resize: function(event,ui) {
						ui.element.css("left",0)
					}
				});
			} else {
				self.element.resizable({
					handles:"e",
					minWidth:200
				});
			}
		}
	}
	self._count++;
	return self;
}
;/**
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
;/**
* @license MIT
*/

function test()
{
	app = new Application();

	app.register.Panel(CustomPanel);
	app.register.Panel(LayerMangerPanel);
	app.register.DataBackend(NodeBackend);
	app.register.Layer(CustomLayer);

}
window.onload=test;
//{class;extends Control}(options:{}) - Text control

//TODO: Make JsPlumb actually work
/*jsPlumb.ready(function() {
	instance = jsPlumb.getInstance({Connector:["Bezier",{curviness:50}]});
	instance.setContainer("canvas");
	instance.draggable("test");
	instance.draggable("test1");
	instance.draggable("test2");
	instance.connect({target:"test",source:"test1",detachable:true,anchor:["Top", "Bottom","Left","Right"]})
	instance.connect({target:"test",source:"test2",detachable:true,anchor:["Top", "Bottom","Left","Right"]})
	instance.connect({target:"test1",source:"test2",detachable:true,anchor:["Top", "Bottom","Left","Right"]})
});*/
