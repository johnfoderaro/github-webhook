const http = require('http');
const trailingSlash = require('./lib/normalize-slash');

http.createServer((req, res) => {
  res.writeHead(200);
  if (trailingSlash(req.url) === '/test/') {
    res.write('sup test');
  } else {
    res.write('sup yall');
  }
  return res.end();
}).listen(3000);
