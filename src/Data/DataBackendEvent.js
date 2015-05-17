/**
* DataBackendEvent class
* @class
* @param {Object} options - Options for this DataBackendEvent
* @param {String} options.name - Name of this DataBackendEvent
* @param {Object} options.data - Data of this DataBackendEvent
* @param {Boolean} options.droppable - Is this DataBackendEvent droppable
*/
function DataBackendEvent(options) {
	this.name = options.name;
	this.data = options.data;
	this.droppable = options.droppable;
}
DataBackendEvent.prototype = {}
