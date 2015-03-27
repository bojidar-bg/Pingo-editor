/**
* Class for dropdowns
* @class
* @extends Control
* @param {Object} options - Options for this DropdownControl
* @param {ListItem[]} [options.items] - items to be put in the dropdown
* @param {String} options.text - text for the dropdown button
* @param {String} [options.label] - label to be included
*/
function DropdownControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this DropdownControl
	* @type {JQuery}
	*/
	this.element = $("\
	<div class='btn-group btn-group-justified'>\
		<div class='btn-group'>\
			<button type='button' class='btn btn-default dropdown-toggle force-radius' data-toggle='dropdown'>\
		  	<span class='text'>" + options.text + "</span>\
				<span class='caret'></span>\
			</button>\
			<ul class='dropdown-menu'></ul>\
		</div>\
	</div>");
	/**
	* The "action" event (context = ListItem)
	* @type {Event}
	*/
	this.action = new Event();
	this.label = options.label;
	if(options.items)
	{
		for(var i in options.items)
		{
			this.add(options.items[i]);
		}
	}
}
DropdownControl.prototype = Object.create(Control.prototype);
DropdownControl.prototype.prepareToolbar = function() {
	this.element.removeClass("btn-group-justified");
}
/**
* Adds a ListItem to this dropdown control
* @param {ListItem} listItem ListItem to be added
*/
DropdownControl.prototype.add = function(listItem) {
	var item;
	if(listItem.disabled)
	{
		item = $("<li><span class='text-muted'>" + listItem.text + "</span></li>");
	}
	else if(listItem.divider)
	{
		item = $("<li class='divider'></li>");
	}
	else
	{
		item = $("<li><a>" + listItem.text + "</a></li>");
		(function(listItem,self){
			item.click(function() {
				self.action.dispatch(listItem);
				listItem.selected.dispatch(listItem);
			})
		})(listItem,this);
	}
	listItem.element = item;
	this.element.children("div").children("ul").append(item);
}
/**
* Changes te text of this DropdownControl (chainable)
* @param {String} text The new text
* @return                this (for chaining)
*/
DropdownControl.prototype.setText = DropdownControl.prototype.set = function(text) {
	this.element.find(".text").html(text);
	return this;
}
/**
* Clears all list items of this dropdown control
*/
DropdownControl.prototype.clear = function() {
	this.element.children("div").children("ul").children(".btn").remove();
}
