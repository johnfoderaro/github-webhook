const WebHook = require('./lib/webhook');

const project = WebHook({
  port: 3000,
  endPoint: '/build/',
  token: '123456',
  secret: '123456',
  response: 'Payload received. Check logs for details.',
});

project.listen().then((payload) => {
  // console.log(payload);
}).catch(err => console.error(err));
