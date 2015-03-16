/**
* Utility functions
* @type {Object}
* @namespace
*/
Utils = {
	/**
	* Snaps coordinates x and y to nearest grid intersection
	* @param  {Number} x X coordinate
	* @param  {Number} y Y coordinate
	* @return {Object} coordinates x and y were snapped to
	* @method
	*/
	snap: function(x,y)
	{
		if(50 - Math.abs(Math.abs(x)%100-50) < 7)
		{
			x = Math.round(x/100)*100;
		}
		else if(10 - Math.abs(Math.abs(x)%20-10) < 4)
		{
			x = Math.round(x/20)*20;
		}

		if(50 - Math.abs(Math.abs(y)%100-50) < 7)
		{
			y = Math.round(y/100)*100;
		}
		else if(10 - Math.abs(Math.abs(y)%20-10) < 4)
		{
			y = Math.round(y/20)*20;
		}
		return {x:x,y:y};
	},
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
