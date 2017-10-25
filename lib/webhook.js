const http = require('http');
const { spawn } = require('child_process');

const verify = require('./verify');

class WebHook {
  constructor(options = {}) {
    this.payload = {};
    this.stdout = [];
    this.stderr = [];
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
            header: req.headers['x-hub-signature'],
            buffer: Buffer.concat(reqBody),
            data: JSON.parse(Buffer.concat(reqBody).toString()),
          };
          try {
            verify(this.settings.secret, this.payload.header, this.payload.buffer)
          } catch (error) {
            return console.error(error);
          }
          return resolve(this.payload);
        });
      }).listen(this.settings.port);
    });
  }
  execute(array) {
    let count = 0;
    return new Promise((resolve, reject) => {
      const run = (input, next) => {
        const cmd = spawn(input.command, input.args, input.options);
        cmd.stdout.on('data', data => this.stdout.push(data.toString()));
        cmd.stderr.on('data', data => this.stderr.push(data.toString()));
        cmd.on('error', err => reject(err));
        cmd.on('close', code => (code > 0 ? reject(code) : next()));
      };
      const next = () => {
        count += 1;
        const status = count < array.length;
        return status ? run(array[count], next) : resolve(this);
      };
      run(array[count], next);
    });
  }
  log(options) {
    console.log(options);
    return this;
  }
}

module.exports = opts => new WebHook(opts);
