class WebHook {
  constructor() {
    this.payload = null;
    this.exec = null;
  }
  stream() {
    return new Promise(resolve => setTimeout(() => {
      this.payload = { data: true };
      return resolve(this.payload);
    }, 1000));
  }
  commands(array) {
    return new Promise(resolve => setTimeout(() => {
      this.exec = array;
      return resolve(this.exec);
    }, 1000));
  }
}

const project = new WebHook();

project.stream().then((payload) => {
  project.commands([
    [`git push origin master ${payload.data}`],
    ['npm start'],
  ])
    .then(res => console.log(res))
    .catch(err => console.error(err));
});
