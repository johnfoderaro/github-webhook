module.exports = url => (
  url.charAt(url.length - 1) === '/' ? url : `${url}/`
);
