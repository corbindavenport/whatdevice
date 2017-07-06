// Polyfill for Array.prototype.includes()
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes

if (!String.prototype.includes) {
	String.prototype.includes = function(search, start) {
		if (typeof start !== 'number') {
			start = 0;
		}

		if (start + search.length > this.length) {
			return false;
		} else {
			return this.indexOf(search, start) !== -1;
		}
	};
}