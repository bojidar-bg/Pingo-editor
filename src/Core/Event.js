/**
* Class for event-based stuff
* @class
*/
function Event()
{
	this._handlers = [];
}
/**
* Register a handler for event(chainable)
* @method
* @param  {Function} handler  Callback to be called
* @return                     This, to allow for chaining
*/
Event.prototype.add = function(handler)
{
	this._handlers.push(handler);
	return this;
}
/**
* Calls all handlers for event.
* @method
* @param  {Object} self  Context for the handlers
* @return                This, to allow for chaining
*/
Event.prototype.dispatch = function(self)
{
	for(var i = this._handlers.length - 1; i >= 0; i--) {
		this._handlers[i].call(self);
	}
	return this;
}
/**
* Unegister a handler for event
* @method
* @param  {Function} handler  Callback to be removed
* @return                     True if the handler is removed successfilly
*/
Event.prototype.remove = function(handler)
{
	var index = this._handlers.indexOf(callback);
	if(ind == -1)return false;
	this._handlers.splice(index, 1);
	return true;
}
