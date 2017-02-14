import save from './save';
import axios from '../lib/axios';

export default (link, path = '.') =>
  axios.get(link)
  .then((response) => {
    const file = save(response.data, path, link);
    const message = `Page was downloaded as '${path}/${file}'`;
    return message;
  })
  .catch(error => error);
