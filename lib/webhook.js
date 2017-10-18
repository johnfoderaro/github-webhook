const http = require('http');

class WebHook {
  constructor(options = {}) {
    this.payload = {};
    this.stdout = null;
    this.stderr = null;
    this.server = null;
    this.settings = WebHook.validate(options);
  }
  static validate(options) {
    const required = ['endPoint', 'port', 'response', 'secret', 'token'];
    const properties = Object.entries(options).map(prop => prop[0]).sort();
    required.forEach((item, i) => {
      if (!properties.includes(item)) {
        throw new Error(`${item} is a required configuration property.`);
      }
      if (item !== 'port' && typeof options[properties[i]] !== 'string') {
        throw new Error(`${item} value is required and must be a string.`);
      }
      if (item === 'port' && typeof options[properties[i]] !== 'number') {
        throw new Error(`${item} value is required and must be a number.`);
      }
    });
    return options;
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
            'Content-Length': Buffer.byteLength(this.settings.response),
            'Content-Type': 'text/json',
          });
          res.write(this.settings.response);
          res.end();
          this.payload = {
            headers: req.headers,
            buffer: Buffer.concat(reqBody),
            string: Buffer.concat(reqBody).toString(),
          };
          return resolve(this.payload);
        });
      }).listen(this.settings.port);
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
