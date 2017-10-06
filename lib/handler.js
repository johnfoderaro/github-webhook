function handler(opts) {
  const options = opts || {};
  return () => options;
}

module.exports = handler;
