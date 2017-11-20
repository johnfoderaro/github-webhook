# GitHub Webhook

Simple RESTful API endpoint for GitHub webhooks. Listen for JSON payloads and then optionally execute commands asychronously.

## Installing

`npm install @johnfoderaro/github-webhook`

## Usage

#### Listen for a JSON paylaod from GitHub

```javascript
const webhook = require('@johnfoderaro/github-webhook');

const project01 = webhook({
  port: 3000,
  endPoint: '/build/',
  secret: '123456',
  response: 'Payload received. Check logs for details.',
});

project01.listen((response) => {
  if (response.error) {
    return console.error(response.error);
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
    return console.log(response.error);
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
    args: ['i'],
    options: { env: process.env },  
  }];
  project01.execute(commands, (error, project) => {
    if (error) {
      return console.error(error);
    }
    console.log({ 
      stderr: project.stderr,
      stdout: project.stdout,
    });
  });
});
```