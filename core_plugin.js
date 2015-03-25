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
