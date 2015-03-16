/**
* ListItem class
* @class
* @param {Object} options - Options for this ListItem
* @param {String} [options.text] - Text for this ListItem (if not a divider)
* @param {Boolean} [options.disabled] - Is this ListItem disabled?
* @param {Boolean} [options.divider] - Is this ListItem a divider?
*/
function ListItem(options) {
	this.text = Utils.optional(options.text, "N/A");
	this.disabled = Utils.optional(options.disabled, false);
	this.divider = Utils.optional(options.divider, false);
	/**
	* The Jquery element of this ListItem
	* @type {JQuery}
	*/
	this.element = null;
	/**
	* The "selected" event (context = ListItem)
	* @type {Event}
	*/
	this.selected = new Event();
}
