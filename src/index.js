import axios from 'axios';
import save from './save';

export default (link, path = './var/tmp') =>
  axios.get(link)
  .then(response => save(response.data, path, link))
  .catch(error => error);
