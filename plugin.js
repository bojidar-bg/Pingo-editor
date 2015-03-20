function CustomPanel(app) {
	Panel.call(this,{"heading":"Custom Panel"});
	var bc = new ProgressBarControl({"progress":0,"label":"Connecting","showText":Math.random()>0.5});
	var text = new TextControl({"text":"(No data is actually being transmited)"});
	this.add(bc);
	this.add(text);
	var cp = 0;
	var self = this;
	var si = setInterval(function(){
		if(cp < 100)
		{
			bc.set(cp);
			var _cp = cp;
			cp += Math.random()*5;
			if(_cp <= 10 && cp > 10)
			{
				bc.setLabel("Receiving data");
			}
			else if(_cp <= 60 && cp > 60)
			{
				bc.setLabel("Processing form");
			}
			else if(_cp <= 90 && cp > 90)
			{
				bc.setLabel("Receiving data");
			}
		}
		else
		{
			clearInterval(si);
			bc.remove();
			text.remove();
			var user = new InputBoxControl({"label":"Username"});
			var password = new InputBoxControl({"label":"Password","password":true});
			var login = new ButtonControl({"text":"Login"});
			var sliderTest = new SliderControl({"label":"Opacity","value":100,"min":0,"max":100});
			text = new TextControl({"text":"demo/demo123"});
			self.add(user).add(password).add(login).add(sliderTest).add(text);
			login.clicked.add(function(){
				if(user.value == "demo" && password.value == "demo123")
				{
					user.remove();
					password.remove();
					login.remove();
					sliderTest.remove();
					text.set("Success!");
				}
				else
				{
					alert("Wrong username or password!");
				}
				password.set("");
			});
		}
	},00+Math.random()*200);
}
CustomPanel.label = "Test Panel";
CustomPanel.prototype = Object.create(Panel.prototype);

function CustomLayer(app) {
	Layer.call(this);
	var self = this;
	for(i =0; i<8; i++)
	{
		( function() {
			var sx = 0;
			var sy = 0;
			var el = $("<div style='width:"+parseInt(Math.random()*6+2)*25+"px;height:"+parseInt(Math.random()*6+2)*25+"px;position:absolute;top:"+(20+i*140)+"px;left:"+(20+i*50)+"px;background:hsl("+parseInt(Math.random()*225)+",50%,50%);'></div>");
			el.drag("dragstart",function(e,c) {
				sx = parseInt(el.css("left"));
				sy = parseInt(el.css("top"));
				self.element.append(el);
			}).drag("drag",function(e,c) {
				var left = sx + c.deltaX * (1/app._zoom);
				var top = sy + c.deltaY * (1/app._zoom);
				var to = app.snap(left,top);

				$(this).css("left",to.x);
				$(this).css("top",to.y);
			});
			self.element.append(el);
		})()
	}
}
CustomLayer.prototype = Object.create(Layer.prototype);
CustomLayer.label = "Test Layer";

function SliderControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this SliderControl
	* @type {JQuery}
	*/
	this.element = $("\
		<div class='col-xs-9 no-padding'>\
			<div class='progress'>\
				<div class='progress-bar'></div>\
				<div class='slider-handle btn btn-default'></div>\
			</div>\
		</div>\
		<div class='col-xs-3 no-padding'>\
			<input type='text' class='form-control centered'>\
		</div>");
	this.sliderbar = this.element.children(".progress").children(".progress-bar");
	this.handle = this.element.children(".progress").children(".slider-handle");
	this.inputbox = this.element.children("input");
	this.sliderbarText = this.sliderbar.children();
	this._min = (typeof options.min == typeof undefined)?-5:options.min;
	this._max = (typeof options.max == typeof undefined)?10:options.max;
	this._range =  - this._min + this._max;
	this._precision = 2
	this.value = 0;
	if(typeof options.showText == typeof undefined || !options.showText) {
		//this.sliderbar.css("min-width","3em");
	} else {
		this.sliderbarText.addClass("hidden");
	}
	this.set(options.value ||  (this._min + this._max)/2);
	var self = this;
	this.handle.drag("dragstart",function(e,c) {
    self.sx = self.value;
  }).drag(function (e,c) {
		var dx = c.deltaX/self.element.width()*self._range;
		self.set(self.sx + dx);
	});
	this.inputbox.change(function(){
		self.set(self.inputbox.val());
	})
	//this.element.click(function() {self.dispatch("ButtonControl.click",self.element);});
	this.label = options.label;
}
SliderControl.prototype = Object.create(Control.prototype);
SliderControl.prototype.set = function(value)
{
	this.value = parseFloat(value);
	this.value = +this.value.toFixed(this._precision);
	if(this.value > this._max)this.value = this._max;
	if(this.value < this._min)this.value = this._min;
	this.sliderbarText.html(this.value);
	this.sliderbar.css("width", (-this._min+this.value)/this._range*100 + "%");
	this.inputbox.val(this.value);
}

function NodeBackend(app,options) {
	DataBackend.call(this);
	/*this.socket = io(window.location.toString());
	this.socket.on('event', function (data) {
		console.log(data);
	});*/
}
NodeBackend.prototype = Object.create(DataBackend.prototype);
NodeBackend.prototype.send = function(event, eventData,minor)
{
	//this.socket.emit('event',{name:event,data:eventData});
}
NodeBackend.label = "Node.js (Not working)";
NodeBackend.icon = "./nodejs.png";
