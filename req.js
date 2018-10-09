var http = require('http');

var server = http.createServer(function(req, res) {
		req.on('data', function(chunk) {
				console.log('parsing', chunk);
		});
		req.on('end', function() {
				console.log('parse done');
				res.end();
		})
});

server.listen(3000);
