const crypto = require('crypto');

// helper to calculate hash
function calculate(buffer, secret) {
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(buffer, 'utf-8');
  return `sha1=${hmac.digest('hex')}`;
}

// check the sha-1 hash from github
function verify(secret, header, buffer) {
  if (header !== calculate(buffer, secret)) {
    throw new Error('Invalid signature.');
  } else {
    return true;
  }
}

module.exports = verify;
