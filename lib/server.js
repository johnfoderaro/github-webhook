const http = require('http');
const trailingSlash = require('./normalize-slash');

function handler(req, res) {
  if (req.method === 'POST') {
    if (trailingSlash(req.url) === '/build/') {
      const body = [];
      // const headers = req.headers; // padd this to validate against body buffer and secret
      req.on('data', chunk => body.push(chunk));
      req.on('end', () => {
        // const bodyBuffer = Buffer.concat(body); // validate against x-hub-signature header
        const bodyString = Buffer.concat(body).toString();
        console.log(bodyString);
      });
      res.write('Hook recieved');
      res.writeHead(200);
    }
  } else {
    res.writeHead(403);
  }
  return res.end();
}

module.exports = opts => http.createServer(handler).listen(opts.port);
