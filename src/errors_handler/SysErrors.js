// @flow
export default class {
  constructor(e: Object, link, pathToSave) {
    this.e = e;
    this.url = link;
    this.pathToSave = pathToSave;
    this.errors = {
      ENOENT: `No such directory ${this.e.path}`,
      ENOTFOUND: `Server ${this.url} not found or internet connection lost`,
      EACCES: `Permission denied ${this.e.path}`,
      ENETDOWN: 'Network is down',
    };
  }
  getMessage() {
    return this.errors[this.e.code] || this.e.message;
  }
}
