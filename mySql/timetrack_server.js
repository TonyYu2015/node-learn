var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

var db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'me',
	password: '',
	database: 'timetrack',
	port: '3306'
});

db.connect(function(err) {
	if(err){
		console.log('error connecting', err.stack);
	}
	console.log('connected as id', db.threadId)
})

var server = http.createServer(function(req, res) {
	switch(req.method) {
		case 'POST':
			switch(req.url) {
				case '/':
					work.add(db, req, res);
					break;
				case '/archive':
					work.archive(db, req, res);
					break;
				case '/delete':
					work.delete(db, req, res);
					break;
			}
			break;
		case 'GET':
			switch(req.url){
				case '/':
					work.show(db, res);
					break;
				case '/archived':
					work.showArchived(db, res);
					break;
			}
			break;
	}
})

db.query(
	"CREATE TABLE IF NOT EXISTS word ("
	+ "id INT(10) NOT FULL AUTO_INCREMENT, "
	+ "hours DECIMAL(5,2) DEFAULT 0, "
	+ "date DATE, "
	+ "archived INT(1) DEFAULT 0, "
	+ "description LONGTEXT, "
	+ "PRIMARY KEY(id))",
	function(err){
		if(err) throw err;
		console.log('Server started ...');
		server.listen(3000, '127.0.0.1');
	}

)
