const http = require('http');

function post(options) {
  const body = options.data;
  const request = http.request({
    port: options.port,
    path: options.path,
    method: 'POST',
    host: '127.0.0.1',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    },
  });
  request.on('error', error => console.error(error));
  request.write(body);
  request.end();
}

module.exports = post;
