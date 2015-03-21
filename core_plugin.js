function LayerMangerPanel(app) {
	Panel.call(this,{"heading":LayerMangerPanel.label});
	var layerList = new ColumnControl();
	this.add(layerList);
	var buttons = [];
	var addLayer = function() {
		var layer = this;
		var button = new ButtonControl({"text":this.name,"toggle":true});
		buttons.push(button);
		button.clicked.add(function() {
			app.layerHolder.activeLayer = layer;
			for(var i in buttons)buttons[i].set(false);
			button.set(true);
		});
		layerList.add(button);
	}
	app.layerHolder.added.add(addLayer);
}
LayerMangerPanel.label = "Layer Manager";
LayerMangerPanel.prototype = Object.create(Panel.prototype);
