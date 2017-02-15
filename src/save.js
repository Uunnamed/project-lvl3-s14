import fs from 'fs';
import path from 'path';
import url from 'url';

const getFileName = (link) => {
  const { hostname, pathname } = url.parse(link);
  return `${`${hostname}${pathname}`.split(/[\W]+/).filter(e => e !== '').join('-')}.html`;
};

const save = (data, pathToSave, link) => {
  const fname = getFileName(link);
  const fpath = path.resolve(pathToSave, fname);
  fs.writeFileSync(fpath, data, 'utf-8');
  return fname;
};

export default save;
