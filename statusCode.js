var http = require('http');

var server = http.createServer(function(req, res) {
	var url = 'http://www.google.com';
	var body = '<p>Redirecting to <a href=' + url + '/>' + url + '</p>';
	res.setHeader('Location', url);
	res.setHeader('Content-Length', body.length);
	res.setHeader('Content-Type', 'text/html');
	res.statusCode = 302;
	res.end(body);
});

server.listen(3000);
