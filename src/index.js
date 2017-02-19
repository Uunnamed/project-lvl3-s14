// @flow
import fs from 'mz/fs';
import save from './save';
import axios from '../lib/axios';
import getErrorMessage from './errors_handler/';

export default async (link: string, pathToSave: string = './') => {
  try {
    await fs.access(pathToSave, 'w');
    const response = await axios.get(link);
    const file = await save(response.data, pathToSave, link);
    return `Page was downloaded as '${file}'`;
  } catch (e) {
    return getErrorMessage(e, link, pathToSave);
  }
};
