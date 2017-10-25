const crypto = require('crypto');

function verify(webhook) {
  const { settings: secret } = webhook;
  const { payload: signature, payload: buffer } = webhook;
  console.log({ signature, buffer, secret });
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(buffer, 'utf-8');
  if (signature !== `sha1=${hmac.digest('hex')}`) {
    throw new Error('Invalid signature.');
  }
}

module.exports = verify;
