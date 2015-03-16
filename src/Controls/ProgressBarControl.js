/**
* Class for progress bars
* @class
* @extends Control
* @param {Object} options - Options for this ProgressBarControl
* @param {Number} [options.progress] - the initial progress {1 - 100%}
* @param {Boolean}[options.showText] - show percentage on this ProgressBarControl
* @param {String} [options.label] - label to be included
*/
function ProgressBarControl(options) {
	options = options || {};
	Control.call(this);
	options.progress = Utils.optional(options.progress,0);
	/**
	* The Jquery element of this ProgressBarControl
	* @type {JQuery}
	*/
	this.element = $("<div class='progress'><div class='progress-bar'><span></span></div></div>");
	/**
	* The element of the bar of this ProgressBarControl
	* @type {JQuery}
	*/
	this.progressbar = this.element.children(".progress-bar");
	/**
	* The text of the bar of this ProgressBarControl
	* @type {JQuery}
	*/
	this.progressbarText = this.progressbar.children();
	this.progressbar.css("width", options.progress + "%");
	this.progressbarText.html(parseInt(options.progress) + "%");
	if(!Utils.optional(options.showText,false)) {
		this.progressbarText.addClass("hidden");
	} else {
		this.progressbar.css("min-width","2em");
	}
	this.label = options.label;
}
ProgressBarControl.prototype = Object.create(Control.prototype);
/**
 * Set the progress of the ProgressBarControl
 * @param {Number} progress The new progress {1 - 100%}
 * @param {Boolean} animated Should the transition be animated?
 * @method
 */
ProgressBarControl.prototype.set = function(progress,animated)
{
	if(animated) {
		this.progressbar.animate({"width" : progress + "%"});
	} else {
		this.progressbar.css({"width" : progress + "%"});
	}
	this.progressbarText.html(parseInt(progress) + "%");
}
