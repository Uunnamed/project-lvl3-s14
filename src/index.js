import fs from 'fs';
import save from './save';
import axios from '../lib/axios';

const check = (path) => {
  try {
    fs.accessSync(path, 'w');
    return [false, 'success'];
  } catch (e) {
    return [true, e.message];
  }
};

export default (link, path = '.') =>
  axios.get(link)
  .then((response) => {
    const [err, message] = check(path);
    if (err) {
      return message;
    }
    return save(response.data, path, link)
      .then((result) => {
        const [file, logLoad] = result;
        return `${Array.from(logLoad).join('\n')}\nPage was downloaded as '${file}'`;
      });
  })
  .catch(error => error);
