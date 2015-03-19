/**
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
			var el = $("<div style='width:"+parseInt(Math.random()*6+2)*25+"px;height:"+parseInt(Math.random()*6+2)*25+"px;position:absolute;top:"+(20+i*140)+"px;left:"+(20+i*50)+"px;background:hsl("+parseInt(Math.random()*225)+",50%,50%);'></div>");
			el.drag("dragstart",function(e,c) {
				sx = parseInt(el.css("left"));
				sy = parseInt(el.css("top"));
				layer.element.append(el);
			}).drag("drag",function(e,c) {
				var left = sx + c.deltaX * (1/app._zoom);
				var top = sy + c.deltaY * (1/app._zoom);
				var to = app.snap(left,top);

				$(this).css("left",to.x);
				$(this).css("top",to.y);
			});
			layer.element.append(el);
		})()
	}
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
