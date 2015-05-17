/**
* Class for Dialogs
* @class
* @param {Object} options Options for this Panel
* @param {String} options.heading Dialogs's heading
*/
function Dialog(options) {
	var element = $("\
	<div class='modal fade' role='dialog'>\
		<div class='modal-dialog'>\
			<div class='modal-content'>\
				<div class='modal-header'>\
					<button type='button' class='close'>\
							<small class='glyphicon glyphicon-remove'></small>\
					</button>\
					<h4 class='modal-title'>" + options.heading + "</h4>\
				</div>\
				<div class='modal-body'>\
					<div class='container-fluid'></div>\
				</div>\
				<div class='modal-footer form-inline'></div>\
			</div>\
		</div>\
	</div>");
		/**
		* The Jquery element of this Dialog
		* @type {JQuery}
		*/
	this.element = element;

	$("body").append(this.element);

	element.modal({"show":true, "backdrop":"static", "keyboard": false});
		/**
		* The Jquery element of this Dialog's heading
		* @type {JQuery}
		*/
	this.headingElement = element.find(".modal-title");
		/**
		* The Jquery element of this Dialog's body
		* @type {JQuery}
		*/
	this.bodyElement = element.find(".container-fluid");
		/**
		* The Jquery element of this Dialog's footer
		* @type {JQuery}
		*/
	this.footerElement = element.find(".modal-footer");
	var self = this;
	this.element.find(".close").click(function() {
		self.destroy();
		$(this).off("click");
	})
	this._target = null;

}
Dialog._setLabel = function(label){this.holder.children("label").html(label);}
Dialog.prototype = {};
/**
* Adds a control to this Dialog's body (chainable)
* @method
* @param {Control} control The control to be added
*/
Dialog.prototype.addToBody = Dialog.prototype.add = function(control) {
	var newlet;
	if(control.label) {
		newlet = $("<div class='form-group'><label class='col-xs-4 control-label'>"+control.label+"</label><div class='col-xs-8'></div><div class='clearfix'></div></div>");
		newlet.children(".col-xs-8").append(control.element);
	} else {
		newlet = $("<div class='form-group'><div class='col-xs-12'></div><div class='clearfix'></div></div>");
		newlet.children(".col-xs-12").append(control.element);
	}
	control.holder = newlet;
	control.setLabel = Panel._setLabel;
	this.bodyElement.append(newlet);
	return this;
}
/**
* Adds a control to this Dialog's footer (chainable)
* @method
* @param {Control} control The control to be added
*/
Dialog.prototype.addFooter = function(control) {
	control.prepareToolbar();
	var newlet;
	newlet = $("<div class='form-group'></div>");
	newlet.append(control.element);
	this.footerElement.append(newlet);
	control.holder = newlet;
	return this;
}
/**
* Destroy this Dialog
* @method
*/
Dialog.prototype.destroy = function() {
	var self = this;
	this.element.modal("hide");
	this.element.on("hidden.bs.modal", function (e){
	  self.element.remove();
	});
}
