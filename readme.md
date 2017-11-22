# GitHub Webhook

Simple module for interacting with GitHub Webhooks. Listen for GitHub JSON payloads and then optionally execute commands asychronously based upon data from the payload. This class is essentially a wrapper around several core Node.js modules -- specifically: `http`, `crypto` and `child_process`.

## Benefits

This is a slimmed down version of code that I have been using over the past several months which helps facilitate some of my project's continous integration and deployment needs. I find that the GitHub Webhook feature is very useful, especially with "release" events, as different builds and destinations can be triggered. That way, a project can be built, tested, and deployed automatically with little manual intervention beyond standard release notes and GitHub best practices. Place this app behind an NGINX reverse proxy, pair it up with PM2, and you'll be all set. Enjoy!

## Installing

`npm install @johnfoderaro/github-webhook`

## Examples

#### Listen for a JSON paylaod response from GitHub

```javascript
const webhook = require('@johnfoderaro/github-webhook');

const project01 = webhook({
  port: 3000,
  endPoint: '/build/',
  secret: '<YOUR GITHUB WEB HOOK SECRET>',
  response: 'Payload received. Check logs for details.',
});

project01.listen((response) => {
  if (response.error) {
    console.error(response.error);
    return;
  }
  const data = JSON.parse(response.data);
  console.log(data);
});
```

#### Execute commands after recieving a JSON payload from GitHub

```javascript
const webhook = require('@johnfoderaro/github-webhook');

const project01 = webhook({
  port: 3000,
  endPoint: '/build/',
  secret: '<YOUR GITHUB WEB HOOK SECRET>',
  response: 'Payload received. Check logs for details.',
});

project01.listen((response) => {
  if (response.error) {
    console.log(response.error);
    return;
  }
  const data = JSON.parse(response.data);
  const repo = data.name;
  const url = data.repository.html_url;
  const commands = [{
    command: 'git',
    args: ['clone', url],
    options: { env: process.env },
  }, {
    command: 'cd',
    args: [repo],
    options: { env: process.env },
  }, {
    command: 'npm',
    args: ['run', 'build'],
    options: { env: process.env },
  }];
  project01.execute(commands, (error, output) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log({ output });
  });
});
```

## Usage

#### `webhook(object)`

`webhook(object)` returns an instance of the `Webhook` class and accepts an options object as its only argument. The options object must contain the following required pieces of inforation:

```
{
  port: <number>,
  endPoint: <string>,
  secret: <string>,
  response: <string>,
}
```

`port` must be a number and is passed to the instantiated `http` server. This will most likely want to be reverse proxied by through something like NGINX.

`endPoint` must be a string and is the specific pathname that your Node app is accessible at, such as `/build/` or `/postreceive`. This is also provided to GitHub within the repository's webhook settings. Example `https://example.com/postreceive`.

`secret` must be string for an HMAC hext digest of the payload itself. This is provided to GitHub within the repository's webhook settings.

`response` must be a string. This is the response body to GitHub after a successful POST request.

The `Webhook` class instance returns a `settings` and `server` object. The `server` object is the `http` instance instantiated by the `Webhook` instance.

### Instance Methods

#### `listen(callback)`

The `listen` method accepts a callback function as its argument, returning an object containing `error` and `data` properties from the class's instantiated `http` server. The `data` property is a JSON object containing the payload from GitHub.

#### `execute(array, callback)`

The `execute` method accepts an array and a callback as its arguments. The array represents an array of commands to be executed asychronously from the `spawn` method within the class's own `child_process` instance. This array must contain objects in an format identical to that of what's defined within the Node.js documentation for the `spawn` method itself. For more information, please read about the [`spawn` method in the Child Processes documentation](https://nodejs.org/docs/latest-v8.x/api/child_process.html#child_process_child_process_spawn_command_args_options).

```
{
  command: <string>,
  args: <array>,
  options: <object>,
}
```

The callback function returns an `error` and an `output`. `output` is an object with:

```
{
  stdout: <array>,
  stderr: <array>,
}
```

`stdout` and `stderr` are both arrays containing all stdout and stderr streams, per command execution, converted to strings.

## License

The MIT License (MIT)

Copyright (c) 2017 John Foderaro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.