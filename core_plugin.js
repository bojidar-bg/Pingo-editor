function LayerManagerPanel(app) {
	Panel.call(this,{"heading":LayerManagerPanel.label});
	var layerList = new ColumnControl();
	this.add(layerList);
	var tracked = [];
	var update = function() {
		for(var i in tracked)
		{
			if(tracked[i].layer == this)
			{
				tracked[i].button.set(true);
			}
			else
			{
				tracked[i].button.set(false);
			}
		}
	}
	var addLayer = function() {
		var layer = this;
		var button = new ButtonControl({"text":this.name,"toggle":true});
		tracked.push({"button":button,"layer":layer});
		button.clicked.add(function() {
			app.layerHolder.set(layer);
		});
		layerList.add(button);
	}
	app.layerHolder.added.add(addLayer);
	for(var i in app.layerHolder.layers)
	{
		addLayer.call(app.layerHolder.layers[i]);
	}
	app.layerHolder.activeChanged.add(update);
	update.call(app.layerHolder.activeLayer);
}
LayerManagerPanel.label = "Layer Manager";
LayerManagerPanel.prototype = Object.create(Panel.prototype);

function WhiteBoardLayer(app) {
	Layer.call(this);
	this.name = "Whiteboard Layer";
	var self = this;
	this._app = app;
	this.tool = "";
	var select = function() {
		self.tool = this.value;
	}
	var freehand = new ListItem({text:"Freehand"});
	freehand.value = "freehand";
	freehand.selected.add(select);
	var rect = new ListItem({text:"Rectangle"});
	rect.value = "rect";
	rect.selected.add(select);
	var circle = new ListItem({text:"Circle"});
	circle.value = "circle";
	circle.selected.add(select);
	this.tools = [
		freehand,
		rect,
		circle
	];
	this.activated.add(function(){
		for(var i in this.tools) {
			this._app.tools.add(this.tools[i]);
			if(this.tool == this.tools[i].value) {
				this.tools[i].element.click();
			}
		}
	});
	var path;
	pathElement = null;
	var sx;
	var sy;
	var id = 0;
	this.element.svg({onLoad : function() {
		self.svgElement = self.element.svg("get");
		self.element.drag("dragstart",function(e,c) {
			sx = (c.startX - app._positionX) * (1/app._zoom);
			sy = (c.startY - app._positionY) * (1/app._zoom);
			path = "M" + sx + "," + sy;
			pathElement = self.svgElement.path(path,{fill:"none",strokeWidth:"3px",stroke:"#000"});
			id = id + 1;
			self._app.dataBackend.send(new DataBackendEvent({"name":"PathStart","data":{"id":id}}));
		}).drag("drag",function(e,c) {
			var x = sx + c.deltaX * (1/app._zoom);
			var y = sy + c.deltaY * (1/app._zoom);
			path += "L" + x + "," + y;
			pathElement.setAttribute("d", path);
			self._app.dataBackend.send(new DataBackendEvent({"name":"PathMove","data":{"id":id,"path":path},"droppable":true}));
		}).drag("dragend",function(e,c) {
			self._app.dataBackend.send(new DataBackendEvent({"name":"PathEnd","data":{"id":id,"path":path}}));
		});;
	},settings:{class_:"whiteboard"}});
}
WhiteBoardLayer.prototype = Object.create(Layer.prototype);
WhiteBoardLayer.label = "Whiteboard";

function LocalStorageBackend(app,options) {
	DataBackend.call(this);
	this.prefix = "pingo-";
	this.storage = localStorage;
	var self = this;
	window.addEventListener("storage", function(event) {
		if(event.key.search(self.prefix + "event-") == 0) {
			self.received.dispatch(new DataBackendEvent({
				"name":event.key.substring((self.prefix + "event-").length + 5),
				"data":JSON.parse(event.newValue)
			}));
		}
	});
}
LocalStorageBackend.prototype = Object.create(DataBackend.prototype);
LocalStorageBackend.prototype.send = function(event) {
	this.storage.setItem(this.prefix + "event-" + Math.round(Math.random()*1632958+46656).toString(36) + "-" + event.name, JSON.stringify(event.data));
}
LocalStorageBackend.prototype.save = function(field, data) {
	this.storage.setItem(this.prefix + "data-" + field, JSON.stringify(data));
}
LocalStorageBackend.prototype.retrieve = function(field) {
	return JSON.parse(this.storage.getItem(this.prefix + "data-" + field));
}
LocalStorageBackend.label = "Local storage";
LocalStorageBackend.icon = "";
