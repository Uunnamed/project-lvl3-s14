import fs from 'mz/fs';
import os from 'os';
import path from 'path';
import ncp from 'ncp';
import save from './save';
import axios from '../lib/axios';

const moveDir = (from, to) =>
  new Promise((resolve, reject) => {
    ncp(from, to, err => (err ? reject(err) : resolve()));
  });

const tmpDir = path.resolve(os.tmpdir());

export default (link, pathToSave = './') =>
  fs.access(pathToSave, 'w')
    .then(() => axios.get(link))
    .then(response => fs.mkdtemp(`${tmpDir}${path.sep}`).then(tmpPath => [response.data, tmpPath]))
    .then(([data, tmpPath]) =>
      save(data, tmpPath, link)
      // TODO обработка исключения если папка назначения не пуста
        .then(result => moveDir(tmpPath, path.resolve(pathToSave)).then(() => result)))
    .then((result) => {
      const [file, logLoad] = result;
      return `${Array.from(logLoad).join('\n')}\nPage was downloaded as '${file}'`;
    })
    .catch(error => error.message);
