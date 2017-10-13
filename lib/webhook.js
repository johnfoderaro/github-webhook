const http = require('http');

class WebHook {
  constructor(options = {}) {
    this.payload = null;
    this.stdout = null;
    this.stderr = null;
    this.server = null;
    this.settings = WebHook.validate(options);
    // this.port = WebHook.validate(options.port, 'port');
    // this.token = WebHook.validate(options.token, 'token');
    // this.secret = WebHook.validate(options.secret, 'scret');
    // this.response = WebHook.validate(options.response, 'response');
    // this.endPoint = WebHook.validate(options.endPoint, 'endPoint');
  }
  static validate(object, type) {
    const types = {
      response: 'string',
      endPoint: 'string',
      port: 'number',
      secret: 'string',
      token: 'string',
    };
    const input = Object.entries(object).sort();
    const settings = Object.entries(types).sort();
    settings.forEach((setting) => {
      console.log(setting);
    });
    console.log({ input, settings });
    // const valid = input.filter(setting => settings.includes(setting));
    // console.log(valid);
    // return object || new Error(`${type} is required.`);
  }
  listen() {
    const server = (handler) => {
      this.server = http.createServer(handler);
      return this.server;
    };
    return new Promise((resolve, reject) => {
      server((req, res) => {
        const reqBody = [];
        req.on('error', err => reject(err));
        req.on('data', chunk => reqBody.push(chunk));
        req.on('end', () => {
          res.writeHead(200, {
            'Content-Length': Buffer.byteLength(this.response),
            'Content-Type': 'text/json',
          });
          res.write(this.response);
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
  spawn(array) {
    return new Promise(resolve => setTimeout(() => {
      this.stdout = 'stdout';
      this.stderr = 'stderr';
      return resolve(this.stdout);
    }, 1000));
  }
  log(options) {
    console.log(options);
    return this;
  }
}

module.exports = opts => new WebHook(opts);
