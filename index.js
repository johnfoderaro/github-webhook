const server = require('./lib/server');

// TODO async await to deal with server post data

async function webHook(opts) {
  let payload = false;
  try {
    payload = await server(opts);
  } catch (error) {
    console.error(error);
  }
  return payload;
}

webHook({ port: 3000, endPoint: '/build/' }).then(playload => console.log({ playload }));

// module.exports = webHook;
