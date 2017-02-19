// @flow
import FsErrors from './SysErrors';
import WebErrors from './WebErrors';

const typeErrors = {
  sys: e => !!e.code,
  web: e => !!e.config,
};

const getTypeErr = e => Object.keys(typeErrors).filter(key => typeErrors[key](e))[0];

const getClassErr = {
  sys: (...args) => new FsErrors(...args),
  web: (...args) => new WebErrors(...args),
};

export default (e: Object, link: string, pathToSave: string) => {
  const type = getTypeErr(e);
  return type ? getClassErr[type](e, link, pathToSave).getMessage() : e;
};
