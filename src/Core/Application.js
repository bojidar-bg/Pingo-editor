/**
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
	this.menus.selectBackend = new SelectControl();
	this.menus.selectBackend.add(new ListItem({text:"Select backend",disabled:true}));
	this.menus.selectBackend.add(new ListItem({divider:true}));
	this.register._app = this;
	this.toolbar.add(this.menus.addPanel,{"right":true});
	this.toolbar.add(this.menus.selectBackend,{"right":true});
	//--Layers--//
	var layers = $("#layers");
	var layersHolder = $("#layers-holder");
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
	var li = new ListItem({"text":type.label});
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
	var li = new ListItem({"text":"<img src=" + type.icon + " class='dropdown-icon'>" + type.label});
	var t = type;
	var self = this._app;
	li.selected.add(function() {
		self.dataBackend = new t(self,{});
	});
	this._app.menus.selectBackend.add(li);
}
