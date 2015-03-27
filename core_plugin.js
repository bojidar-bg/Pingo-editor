function LayerMangerPanel(app) {
	Panel.call(this,{"heading":LayerMangerPanel.label});
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
LayerMangerPanel.label = "Layer Manager";
LayerMangerPanel.prototype = Object.create(Panel.prototype);

function WhiteBoardLayer(app) {
	Layer.call(this);
	this.name = "Custom Layer";
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
	this.element.click(function(){alert(self.tool)});
}
WhiteBoardLayer.prototype = Object.create(Layer.prototype);
WhiteBoardLayer.label = "Whiteboard";
