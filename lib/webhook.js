const http = require('http');

class WebHook {
  constructor(options = {}) {
    this.port = options.port
      ? options.port : WebHook.error('port');

    this.endPoint = options.endPoint ?
      options.endPoint : WebHook.error('endPoint');

    this.server = handler => http.createServer(handler);
    this.payload = null;
    this.
  }
  static error(type) {
    throw new Error(`${type} is required.`);
  }
  async stream() {
    await this.server((req, res) => {
      return new Promise((resolve, reject) => {
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
          this.response = {
            headers: req.headers,
            buffer: Buffer.concat(reqBody),
            string: Buffer.concat(reqBody).toString(),
          };
          return resolve(this);
        });
      });
    }).listen(this.port);
  }
  // commands(input, callback) {
  //   this.stream(callback);
  //   // const readStream = () =>
  //   return callback(input);
  // }
}

module.exports = opts => new WebHook(opts);
