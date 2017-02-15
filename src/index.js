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
    const file = save(response.data, path, link);
    const result = `Page was downloaded as '${path}/${file}'`;
    return result;
  })
  .catch(error => error);
