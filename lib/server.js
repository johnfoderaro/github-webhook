const http = require('http');
const handler = require('./handler');

function server(opts) {
  const request = handler(opts);
  return http.createServer(request).listen(opts.port);
}

module.exports = server;
