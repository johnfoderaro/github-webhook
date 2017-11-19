const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');

class WebHook {
  constructor(options = {}) {
    this.stdout = [];
    this.stderr = [];
    this.payload = {};
    this.server = null;
    this.settings = WebHook.validate(options);
  }

  static validate(options) {
    const required = ['endPoint', 'port', 'response', 'secret'];
    const properties = Object.entries(options).map(prop => prop[0]).sort();
    required.forEach((item, i) => {
      if (item !== 'port' && typeof options[properties[i]] !== 'string') {
        throw new Error(`${item} value is required and must be a string.`);
      }
      if (item === 'port' && typeof options[properties[i]] !== 'number') {
        throw new Error(`${item} value is required and must be a number.`);
      }
      if (!properties.includes(item)) {
        throw new Error(`${item} is a required configuration property.`);
      }
    });
    return options;
  }

  static verify(webhook) {
    const { payload: { header, buffer }, settings: { secret } } = webhook;
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(buffer, 'utf-8');
    if (header !== `sha1=${hmac.digest('hex')}`) {
      throw new Error('Invalid signature.');
    }
  }

  listen(callback) {
    const server = (handler) => {
      this.server = http.createServer(handler);
      return this.server;
    };
    const writeHead = (res, status, content) => res.writeHead(status, {
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': 'text/json',
      'X-Powered-By': 'https://jfod.me',
    }, content);
    server((req, res) => {
      const reqBody = [];
      req.on('error', err => callback(err));
      req.on('data', chunk => reqBody.push(chunk));
      req.on('end', () => {
        this.payload = {
          header: req.headers['x-hub-signature'],
          buffer: Buffer.concat(reqBody),
          data: JSON.parse(Buffer.concat(reqBody).toString()),
        };
        try {
          WebHook.verify(this);
        } catch (error) {
          const errorString = error.toString();
          writeHead(res, 401, errorString);
          res.end(errorString);
          return callback(error);
        }
        writeHead(res, 200, this.settings.response);
        res.end(this.settings.response);
        return callback(JSON.stringify(this.payload.data));
      });
    }).listen(this.settings.port);
  }

  execute(array, callback) {
    let count = 0;
    const run = (input, next) => {
      const cmd = spawn(input.command, input.args, input.options);
      cmd.stdout.on('data', data => this.stdout.push(data.toString()));
      cmd.stderr.on('data', data => this.stderr.push(data.toString()));
      cmd.on('error', err => callback(err));
      cmd.on('close', code => (code > 0 ? callback(code) : next()));
    };
    const next = () => {
      count += 1;
      const status = count < array.length;
      return status ? run(array[count], next) : callback(this);
    };
    run(array[count], next);
  }
}

module.exports = opts => new WebHook(opts);
