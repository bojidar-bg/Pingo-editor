/**
* @license MIT
*/

function test()
{
	app = new Application();

	app.register.Panel(CustomPanel);
	app.register.Panel(LayerManagerPanel);
	app.register.DataBackend(NodeBackend);
	app.register.DataBackend(LocalStorageBackend);
	app.register.Layer(CustomLayer);
	app.register.Layer(WhiteBoardLayer);

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
