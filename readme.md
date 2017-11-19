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

project01.listen()
  .then(payload => console.log(JSON.parse(payload));
  .catch(err => console.err(err));
});
```

#### Execute commands after recieving a JSON payload from GitHub

```javascript
const webhook = require('@johnfoderaro/github-webhook');

const project01 = webhook({
  port: 3000,
  endPoint: '/build/',
  secret: '123456',
  response: 'Payload received. Check logs for details.',
});

project01.listen().then((payload) => {
  const data = JSON.parse(payload);
  const repo = data.name;
  const url = data.repository.html_url;
  project01.execute([{
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
  }])
  .then(project => console.log(project.stdout))
  .catch(err => console.err(err));
});
```