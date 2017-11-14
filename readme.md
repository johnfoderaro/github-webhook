# GitHub Webhook

Simple RESTful API endpoint for GitHub webhooks. Listen for JSON payloads and then optionally execute commands asychronously.

## Installing

`npm install @johnfoderaro/github-webhook`

## Usage

```javascript
const webhook = require('@johnfoderaro/github-webhook');

const project01 = webhook({
  port: 3000,
  endPoint: '/build/',
  secret: '123456',
  response: 'Payload received. Check logs for details.',
});

project01.listen().then((payload) => {
  project01.execute([{
    command: 'ls',
    args: ['-a'],
    options: { env: process.env },
  }])
  .then(data => console.log(data.stdout))
  .catch(err => console.err(err));
});
```