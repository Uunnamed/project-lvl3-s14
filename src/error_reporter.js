// @flow
import path from 'path';

class FsErrors {
  constructor(e) {
    this.e = e;
    this.errors = {
      ENOENT: `No such directory ${path.resolve(this.e.path)}`,
      // ...the same
    };
  }
  getMessage() {
    return this.errors[this.e.code];
  }
}

class WebErrors {
  constructor(e) {
    this.e = e;
    this.errors = {
      404: `Error 404 ${e.config.url} page not found`,
      // ...the same
    };
  }
  getMessage() {
    return this.errors[this.e.response.status];
  }
}

const typeErrors = {
  fs: e => !!e.code,
  web: e => !!e.response,
};

const getTypeErr = e => Object.keys(typeErrors).filter(key => typeErrors[key](e))[0];

const getClassErr = {
  fs: e => new FsErrors(e),
  web: e => new WebErrors(e),
};

export default (e: Object) => getClassErr[getTypeErr(e)](e).getMessage();
