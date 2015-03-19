/**
* Utility functions
* @type {Object}
* @namespace
*/
Utils = {
	/**
	 * Make a parameter optional
	 * @param  {Object} value param value
	 * @param  {Object} normal default value
	 * @return {Object} value if value is set, default otherwise
	 * @method
	 */
	optional: function(value, normal)
	{
		if(typeof value != typeof undefined) {
			return value;
		}
		else {
			return normal;
		}
	}
}
