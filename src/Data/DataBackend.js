/**
* Interface for the dataBackend
* @param {Object} options Options for this DataBackend
* @virtual
* @class
*/
function DataBackend(app,options) {
	/**
	 * The "received" event (context = DataBackend)
	 * @type {Event}
	 */
	this.received = new Event();
}
DataBackend.prototype = {};
/**
* Sends and event to the queue
* @param  {String}  event     Name of the event to be send
* @param  {Object}  eventData Data for the event
* @param  {Boolean} [minor]   Is dropping the event an option?
*/
DataBackend.prototype.send = function(event, eventData, minor) {}
/**
* Saves data
* @param  {String}  field     Name of the field to write to
* @param  {Object}  data      Data for saving
*/
DataBackend.prototype.save = function(field, data) {}
/**
* Retreive data stored in field
* @param  {String} field Field to read from
* @return {Object}       Data read
*/
DataBackend.prototype.retrieve = function(field) {}
