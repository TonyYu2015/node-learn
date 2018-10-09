var http = require('http'); 
var url = require('url'); 
var qs = require('querystring');
var items = [];

function notFound(res) {
	res.statusCode = 404;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Not Found');
}

function badRequest(res) {
	res.statusCode = 400;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Bad Request');
}

function show(res) {
	var html = '<html><head><title>Todo List</title></head><body>' 
				+ '<h1>Todo List</h1>'
				+ '<ul>'
				+ items.map(function(item, i) {
						return '<li>' + item + '</li>';
				}).join(' ')
				+ '</ul>'
				+ '<form method="post" action="/">'
				+ '<p><input type="text" name="item" /></p>'
				+ '<p><input type="submit" value="Add Item" /></p>'
				+ '</form></body></html>';
		res.setHeader('Content-Type', 'text/html')
		res.setHeader('Content-Length', Buffer.byteLength(html));
		res.end(html);
}

function add (req, res) {
	var body = '';
	req.setEncoding('utf-8');
	req.on('data', function(thunk) {
		body += thunk;
	});
	req.on('end', function() {
		var obj = qs.parse(body);
		items.push(obj.item);
		show(res);
	})
}

var server = http.createServer(function(req, res) {
		if(req.url === '/') {
			switch(req.method){
				case 'POST':
						add(req, res);
			//			var item = ''; 
			//			req.setEncoding('utf-8'); 
			//			req.on('data', function(chunk) { 
			//					item += chunk;
			//			});
			//			req.on('end', function() {
			//					items.push(item);
			//					res.end('OK\n');
			//			});
			//			break;
					break;
				case 'GET':
						show(res);
						break;
			//			var body = items.map(function(item, i) {
			//				return i + ')' + item;
			//			}).join('\n');
			//			res.setHeader('Content-Length', Buffer.byteLength(body));
			//			res.setHeader('Content-Type', 'text/plain; charset="utf-8";')
			//			res.end(body);
			//			break;
			//	case 'DELETE':
			//			var path = url.parse(req.url).pathname;
			//			var i = parseInt(path.slice(1), 10);
			//			if (isNaN(i)) {
			//					res.statusCode = 400;
			//					res.end('Invalid item id');
			//			} else if (!items[i]) {
			//					res.statusCode = 404;
			//					res.end('Item not found');
			//			} else {
			//					items.splice(i, 1);
			//					res.end('OK\n');
			//			}
			//			break;
			}			
		} else {
				notFound(res);
		}

});

server.listen(3000);
