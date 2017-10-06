const trailingSlash = require('./normalize-slash');

function handler(opts) {
  const options = opts || {};
  const { endPoint } = options;
  function request(req, res) {
    return new Promise((resolve) => {
      let payload = false;
      if (req.method === 'POST') {
        if (trailingSlash(req.url) === endPoint) {
          const body = [];
          // const headers = req.headers; // padd this to validate against body buffer and secret
          req.on('data', chunk => body.push(chunk));
          req.on('end', () => {
            // const bodyBuffer = Buffer.concat(body); // validate against x-hub-signature header
            const bodyString = Buffer.concat(body).toString();
            payload = bodyString;
            res.write('Hook recieved');
            res.writeHead(200);
            res.end();
            return resolve(payload);
          });
        }
      } else {
        res.writeHead(403);
        res.end();
      }
    });
  }
  return request;
}

module.exports = handler;
