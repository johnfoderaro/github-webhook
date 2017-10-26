const crypto = require('crypto');

function verify(webhook) {
  // webhook.settings.secret
  const { settings: { secret } } = webhook;
  // webhook.payload.header webhook.payload.buffer
  const { payload: { header }, payload: { buffer } } = webhook;
  console.log({ header, buffer, secret });
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(buffer, 'utf-8');
  if (header !== `sha1=${hmac.digest('hex')}`) {
    throw new Error('Invalid signature.');
  }
}

module.exports = verify;
