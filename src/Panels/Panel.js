/**
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
