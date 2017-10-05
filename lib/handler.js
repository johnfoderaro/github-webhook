function handler(opts) {
  const options = opts || false;
  return () => options;
}

module.exports = handler;
