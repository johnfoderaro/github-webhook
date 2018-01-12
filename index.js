const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');

class Webhook {
  constructor(options = {}) {
    this.server = null;
    this.settings = Webhook.validate(options);
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

  static verify(input) {
    const { data, signature, secret } = input;
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(data, 'utf-8');
    if (signature !== `sha1=${hmac.digest('hex')}`) {
      throw new Error('Invalid signature.');
    }
  }

  listen(callback) {
    const { settings: { port, response, secret } } = this;
    const server = (handler) => {
      this.server = http.createServer(handler);
      return this.server;
    };
    const writeHead = (res, status, content) => res.writeHead(status, {
      'Content-Length': Buffer.byteLength(content),
      'Content-Type': 'text/json',
    }, content);
    server((req, res) => {
      const buffer = [];
      const { headers } = req;
      req.on('error', error => callback({ error, data: null, headers }));
      req.on('data', chunk => buffer.push(chunk));
      req.on('end', () => {
        const signature = headers['x-hub-signature'];
        const data = Buffer.concat(buffer).toString();
        try {
          Webhook.verify({ data, signature, secret });
        } catch (error) {
          const errorString = error.toString();
          writeHead(res, 401, errorString);
          res.end(errorString);
          return callback({ error, data: null, headers });
        }
        writeHead(res, 200, response);
        res.end(response);
        return callback({ error: null, data: JSON.parse(data), headers });
      });
    }).listen(port, () => console.log(`github-webhook listening on port: ${port}`));
    return this;
  }

  execute(array, callback) {
    let count = 0;
    const output = { stdout: [], stderr: [] };
    const run = (input, next) => {
      const cmd = spawn(input.command, input.args, input.options);
      const push = (type, data) => output[type].push(data.toString());
      cmd.stdout.on('data', data => push('stdout', data));
      cmd.stderr.on('data', data => push('stderr', data));
      cmd.on('error', error => callback(error, null));
      cmd.on('close', code => (code > 0 ? callback(new Error(`child process exited with code ${code}`), null) : next()));
    };
    const next = () => {
      count += 1;
      const status = count < array.length;
      return status ? run(array[count], next) : callback(null, output);
    };
    run(array[count], next);
    return this;
  }
}

module.exports = opts => new Webhook(opts);
