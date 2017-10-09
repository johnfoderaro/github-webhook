class WebHook {
  constructor(options) {
    this.token = options.token;
    this.payload = null;
    this.exec = null;
  }
  listen() {
    return new Promise(resolve => setTimeout(() => {
      this.payload = { repo: 'test01' };
      return resolve(this.payload);
    }, 1000));
  }
  spawn(array) {
    return new Promise(resolve => setTimeout(() => {
      this.exec = array;
      return resolve(this.exec);
    }, 1000));
  }
  log(options) {
    console.log(options);
    return this;
  }
}

const project = new WebHook({ token: 12345 });

const commands = payload => [{
  command: 'git',
  args: ['clone', `https://${project.token}@github.com/${payload.repo}`],
  options: {},
}];

project.listen().then((payload) => {
  project.log('payload recieved.');
  project.spawn(commands(payload))
    .then(stdout => project.log(stdout))
    .catch(stderr => project.log(stderr));
});
