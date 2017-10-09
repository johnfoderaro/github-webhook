const http = require('http');

class WebHook {
  constructor(options = {}) {
    this.payload = null;
    this.stdout = null;
    this.stderr = null;
    this.server = handler => http.createServer(handler);    
    this.port = WebHook.validate(options.port, 'port');
    this.token = WebHook.validate(options.token, 'token');
    this.secret = WebHook.validate(options.secret, 'scret');
    this.endPoint = WebHook.validate(options.endPoint, 'endPoint');
  }
  static validate(object, type) {
    return object || new Error(`${type} is required.`);
  }
  listen() {
    return new Promise((resolve, reject) => {
      this.server((req, res) => {
        const reqBody = [];
        const resBody = 'Payload received. Check logs for details.';
        req.on('error', err => reject(err));
        req.on('data', chunk => reqBody.push(chunk));
        req.on('end', () => {
          res.writeHead(200, {
            'Content-Length': Buffer.byteLength(resBody),
            'Content-Type': 'text/json',
          });
          res.write(resBody);
          res.end();
          this.payload = {
            headers: req.headers,
            buffer: Buffer.concat(reqBody),
            string: Buffer.concat(reqBody).toString(),
          };
          return resolve(this.payload);
        });
      }).listen(this.port);
    });
  }
  // commands(input, callback) {
  //   this.stream(callback);
  //   // const readStream = () =>
  //   return callback(input);
  // }
}

module.exports = opts => new WebHook(opts);
