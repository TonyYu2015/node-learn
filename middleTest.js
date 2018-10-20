function setup(format) {
	var regexp = /:(\w+)/g;
	return function logger(req, res, next) {
		var str = format.replace(regexp, function(match, properyt) {
			return req[properyt];
		});
		console.log(str);

		next();
	}
}
