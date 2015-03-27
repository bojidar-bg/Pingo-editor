/**
* Class for button groups (think toolbars)
* @class
* @extends Control
* @param {Object} options - Options for this ButtonGroupControl
* @param {String} [options.label] - label to be included
* @param {Boolean}[options.radio] - make the button group a radio button group
*/
function ButtonGroupControl(options) {
	options = options || {};
	Control.call(this);
	/**
	* The Jquery element of this ButtonGroupControl
	* @type {JQuery}
	*/
	this.element = $("<div class='btn-group btn-group-justified'></div>");
	this._isRadio = options.radio;
	this.items = [];
	this.label = options.label;
}
ButtonGroupControl.prototype = Object.create(Control.prototype);
ButtonGroupControl.prototype.prepareToolbar = function() {
	this.element.removeClass("btn-group-justified");
}
/**
* Adds a ListItem to this button group control
* @param {ListItem} listItem ListItem to be added
*/
ButtonGroupControl.prototype.add = function(listItem) {
	var item = $("<div class='btn btn-default'>" + listItem.text + "</div>");
	(function(listItem,self){
		item.click(function() {
			if(self._isRadio) {
				for(var i in self.items) {
					self.items[i].element.removeClass("active");
				}
				listItem.element.addClass("active");
			}
			listItem.selected.dispatch(listItem);
		})
	})(listItem,this);
	listItem.element = item;
	this.items.push(listItem);
	this.element.append(item);
}
/**
* Clears all list items of this button group control
*/
ButtonGroupControl.prototype.clear = function() {
	for(var i in this.items) {
		this.items[i].element = null;
	}
	this.items = [];
	this.element.children(".btn").remove();
}
