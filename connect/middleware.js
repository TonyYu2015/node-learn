var connect = require('connect');

connect()
.use(logger)
.use('/blog', blog)
.use('/posts', blog)
.use(hello)
.listen(3000);

function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
}

function logger(req, res, next) {
  console.log('%s %s', req.method, req.url);
  next();
}

function blog() {
  // todo
}
