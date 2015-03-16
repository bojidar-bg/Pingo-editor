/**
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
