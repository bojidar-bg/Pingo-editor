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
			var el = $("<div style='width:"+parseInt(Math.random()*6+2)*20+"px;height:"+parseInt(Math.random()*6+2)*20+"px;position:absolute;top:"+(20+i*140)+"px;left:"+(20+i*40)+"px;background:hsl("+parseInt(Math.random()*360)+",50%,50%);'></div>");
			el.drag("dragstart",function(e,c) {
				sx = parseInt(el.css("left"));
				sy = parseInt(el.css("top"));
				layer.element.append(el);
			}).drag("drag",function(e,c) {
				var left = sx + c.deltaX * (1/cz);
				var top = sy + c.deltaY * (1/cz);
				var to = Utils.snap(left,top);

				$(this).css("left",to.x);
				$(this).css("top",to.y);
			});
			layer.element.append(el);
		})()
	}
	var sx = 0;
	var sy = 0;
	var mx;
	var my;
	var cx = 0;
	var cy = 0;
	var h = $("#layers-holder");
	var t = $("#layers");
	var bs = 300;
	var cvs = document.createElement("canvas");
	var ctx = cvs.getContext("2d");
	var bgrSize = cz*bs;
	var renderBackground = function(s,s_,d)
	{
		position = bs/s_;
		cvs.width = cvs.height = s_;
		var g1 = 1-position;
		var g_1 = position;
		var g0 = (g1+g_1)/2;
		var t1 = (1-position)*2;
		var t_1 = position*2;
		var t0 = (t1+t_1)/2;
		var sp1 = s_/d/d;
		var sp0 = s_/d;
		var sp_1 = s_;


		ctx.strokeStyle = "rgba(0,0,0,"+g1+")";
		ctx.beginPath();
		for(var i = 0; i < d*d; i++) {
			ctx.moveTo(i*sp1,0);
			ctx.lineTo(i*sp1,s_);
			ctx.moveTo(0,i*sp1);
			ctx.lineTo(s_,i*sp1);
		}
		ctx.stroke();

		ctx.strokeStyle = "rgba(0,0,0,"+g0+")";
		ctx.lineWidth = t0;
		ctx.beginPath();
		for(var i = 0; i < d; i++) {
			ctx.moveTo(i*sp0,0);
			ctx.lineTo(i*sp0,s_);
			ctx.moveTo(0,i*sp0);
			ctx.lineTo(s_,i*sp0);
		}
		ctx.stroke();

		ctx.strokeStyle = "rgba(0,0,0,"+g_1+")";
		ctx.lineWidth = t_1;
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(0,sp_1);
		ctx.lineTo(sp_1,sp_1);
		ctx.lineTo(sp_1,0);
		ctx.lineTo(0,0);
		ctx.stroke();
		return cvs.toDataURL();
	}
	h.css("background","url(" + renderBackground(bs,bs,3) + ")");
	$("#layers-holder").drag("dragstart",function(e,c) {
		sy = parseInt(t.css("margin-top"));
		sx = parseInt(t.css("margin-left"));
	},{which:2}).drag("drag",function(e,c) {
		cx = sx + c.deltaX;
		cy = sy + c.deltaY;
		t.css("margin-left",cx);
		t.css("margin-top",cy);
		h.css("background-position-x",cx);
		h.css("background-position-y",cy);
	},{which:2}).mousewheel(function(event) {
		console.log(cz);
		var nMx = mx - cx;
		var nMy = my - cy;
		var _cz = cz;
		if(event.deltaY * event.deltaFactor > 0)
		{
			cz += event.deltaY * event.deltaFactor * 0.001 * cz;
		}
		else
		{
			cz += 1/(event.deltaY) * event.deltaFactor * 0.001 * cz;
		}
		if(cz > 4)cz = 4;
		if(cz < 0.04)cz = 0.04;
		//width *= 1/cz;
		//height *= 1/cz;
		cx += nMx - nMx * cz / _cz;
		cy += nMy - nMy * cz / _cz;
		t.css("margin-left",cx);
		t.css("margin-top",cy);
		t.css("transform","scale("+cz+","+cz+")");
		bgrSize = bgrSize * cz / _cz;
		var bgrSize_r = bgrSize;
		var d = 3;
		while(bgrSize_r/d > bs)bgrSize_r /= d;
		while(bgrSize_r < bs)bgrSize_r *= d;
		h.css("background","url(" + renderBackground(bgrSize,bgrSize_r,d) + ")");
		//h.css("background-size",bgrSize_r);
		h.css("background-position-x",cx);
		h.css("background-position-y",cy);

	}).mousemove(function(event) {
		mx = event.pageX;
		my = event.pageY;
	});
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
