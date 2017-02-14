import axios from 'axios';
import save from './save';

export default (link, path = './var/tmp') =>
  axios.get(link)
  .then((response) => {
    const file = save(response.data, path, link);
    const message = `Page was downloaded as '${file}'`;
    return message;
  })
  .catch(error => error);
