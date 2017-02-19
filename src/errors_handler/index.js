// @flow
import SysErrors from './SysErrors';
import WebErrors from './WebErrors';

const typeErrors = {
  sys: e => !!e.code,
  web: e => !!e.config,
};

const getTypeErr = e => Object.keys(typeErrors).filter(key => typeErrors[key](e))[0];

const getClassErr = {
  sys: (e, link) => new SysErrors(e, link),
  web: e => new WebErrors(e),
};

export default (e: Object, link: string) => {
  const type = getTypeErr(e);
  return type ? getClassErr[type](e, link).getMessage() : e;
};
