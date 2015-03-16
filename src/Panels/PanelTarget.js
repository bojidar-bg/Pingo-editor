/**
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
