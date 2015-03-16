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
	if(self._isToggle) {
		self.element.toggleClass('active');
		self.value = !self.value;
	}
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
	self = this;
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
	this.left = new PanelTarget({element:$("#left .panel-target-holder"),app:this});
	this.right = new PanelTarget({element:$("#right .panel-target-holder"),isRight:true,app:this});
	this.toolbar = new Toolbar({element:$("#navbar"),brand:"<span class='glyphicon glyphicon-pencil'></span> Pingo"});
	this.activePanelTarget = this.left;
	this.dataBackend = null;
	this.menus = {};
	this.menus.addPanel = new DropdownControl({text:"Add panel"});
	this.menus.selectBackend = new SelectControl();
	this.menus.selectBackend.add(new ListItem({text:"Select backend",disabled:true}));
	this.menus.selectBackend.add(new ListItem({divider:true}));
	this.register._app = this;
	this.toolbar.add(this.menus.addPanel,{"right":true});
	this.toolbar.add(this.menus.selectBackend,{"right":true});
}
Application.prototype = {};
Application.prototype.register = {};
Application.prototype.register.Panel = function(type)
{
	var li = new ListItem({"text":type.label});
	var t = type;
	var self = this._app;
	li.selected.add(function() {
		var panel = new t(self);
		self.activePanelTarget.add(panel);
	});
	this._app.menus.addPanel.add(li);
}
Application.prototype.register.DataBackend = function(type)
{
	var li = new ListItem({"text":"<img src=" + type.icon + " class='dropdown-icon'>" + type.label});
	var t = type;
	var self = this._app;
	li.selected.add(function() {
		self.dataBackend = new t(self,{});
	});
	this._app.menus.selectBackend.add(li);
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
;/**
* Utility functions
* @type {Object}
* @namespace
*/
Utils = {
	/**
	* Snaps coordinates x and y to nearest grid intersection
	* @param  {Number} x X coordinate
	* @param  {Number} y Y coordinate
	* @return {Object} coordinates x and y were snapped to
	* @method
	*/
	snap: function(x,y)
	{
		if(50 - Math.abs(Math.abs(x)%100-50) < 7)
		{
			x = Math.round(x/100)*100;
		}
		else if(10 - Math.abs(Math.abs(x)%20-10) < 4)
		{
			x = Math.round(x/20)*20;
		}

		if(50 - Math.abs(Math.abs(y)%100-50) < 7)
		{
			y = Math.round(y/100)*100;
		}
		else if(10 - Math.abs(Math.abs(y)%20-10) < 4)
		{
			y = Math.round(y/20)*20;
		}
		return {x:x,y:y};
	},
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
	app.register.DataBackend(NodeBackend);

	layer = new Layer({element:$("#layers")});
	var z = 0;
	var cz = 1;
	for(i =0; i<8; i++)
	{
		( function() {
			var sx = 0;
			var sy = 0;
			var el = $("<div style='width:"+parseInt(Math.random()*6+2)*20+"px;height:"+parseInt(Math.random()*6+2)*20+"px;position:absolute;top:"+(20+i*140)+"px;left:"+(20+i*40)+"px;background:hsl("+parseInt(Math.random()*360)+",50%,50%);'></div>");
			el.drag("dragstart",function(e,c) {
				sx = parseInt(el.css("left"));
				sy = parseInt(el.css("top"));
				layer.element.append(el);
			}).drag("drag",function(e,c) {
				var left = sx + c.deltaX * (1/cz);
				var top = sy + c.deltaY * (1/cz);
				var to = Utils.snap(left,top);

				$(this).css("left",to.x);
				$(this).css("top",to.y);
			});
			layer.element.append(el);
		})()
	}
	var sx = 0;
	var sy = 0;
	var mx;
	var my;
	var cx = 0;
	var cy = 0;
	var h = $("#layers-holder");
	var t = $("#layers");
	var bs = 300;
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	var bgrSize = cz*bs;
	var renderBackground = function(s,s_,d)
	{
		position = bs/s_;
		cvs.width = cvs.height = s_;
		var g1 = 1-position;
		var g_1 = position;
		var g0 = (g1+g_1)/2;
		var t1 = (1-position)*2;
		var t_1 = position*2;
		var t0 = (t1+t_1)/2;
		var sp1 = s_/d/d;
		var sp0 = s_/d;
		var sp_1 = s_;


		ctx.strokeStyle = "rgba(0,0,0,"+g1+")";
		ctx.beginPath();
		for(var i = 0; i < d*d; i++) {
			ctx.moveTo(i*sp1,0);
			ctx.lineTo(i*sp1,s_);
			ctx.moveTo(0,i*sp1);
			ctx.lineTo(s_,i*sp1);
		}
		ctx.stroke();

		ctx.strokeStyle = "rgba(0,0,0,"+g0+")";
		ctx.lineWidth = t0;
		ctx.beginPath();
		for(var i = 0; i < d; i++) {
			ctx.moveTo(i*sp0,0);
			ctx.lineTo(i*sp0,s_);
			ctx.moveTo(0,i*sp0);
			ctx.lineTo(s_,i*sp0);
		}
		ctx.stroke();

		ctx.strokeStyle = "rgba(0,0,0,"+g_1+")";
		ctx.lineWidth = t_1;
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(0,sp_1);
		ctx.lineTo(sp_1,sp_1);
		ctx.lineTo(sp_1,0);
		ctx.lineTo(0,0);
		ctx.stroke();
		return cvs.toDataURL();
	}
	h.css("background","url(" + renderBackground(bs,bs,3) + ")");
	$("#layers-holder").drag("dragstart",function(e,c) {
		sy = parseInt(t.css("margin-top"));
		sx = parseInt(t.css("margin-left"));
	},{which:2}).drag("drag",function(e,c) {
		cx = sx + c.deltaX;
		cy = sy + c.deltaY;
		t.css("margin-left",cx);
		t.css("margin-top",cy);
		h.css("background-position-x",cx);
		h.css("background-position-y",cy);
	},{which:2}).mousewheel(function(event) {
		console.log(cz);
		var nMx = mx - cx;
		var nMy = my - cy;
		var _cz = cz;
		if(event.deltaY * event.deltaFactor > 0)
		{
			cz += event.deltaY * event.deltaFactor * 0.001 * cz;
		}
		else
		{
			cz += 1/(event.deltaY) * event.deltaFactor * 0.001 * cz;
		}
		if(cz > 4)cz = 4;
		if(cz < 0.04)cz = 0.04;
		//width *= 1/cz;
		//height *= 1/cz;
		cx += nMx - nMx * cz / _cz;
		cy += nMy - nMy * cz / _cz;
		t.css("margin-left",cx);
		t.css("margin-top",cy);
		t.css("transform","scale("+cz+","+cz+")");
		bgrSize = bgrSize * cz / _cz;
		var bgrSize_r = bgrSize;
		var d = 3;
		while(bgrSize_r/d > bs)bgrSize_r /= d;
		while(bgrSize_r < bs)bgrSize_r *= d;
		h.css("background","url(" + renderBackground(bgrSize,bgrSize_r,d) + ")");
		//h.css("background-size",bgrSize_r);
		h.css("background-position-x",cx);
		h.css("background-position-y",cy);

	}).mousemove(function(event) {
		mx = event.pageX;
		my = event.pageY;
	});
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
