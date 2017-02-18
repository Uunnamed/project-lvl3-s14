// @flow
import fs from 'mz/fs';
import save from './save';
import axios from '../lib/axios';
import reporter from './error_reporter';

export default async (link: string, pathToSave: string = './') => {
  try {
    await fs.access(pathToSave, 'w');
    const response = await axios.get(link);
    const [file, logLoad] = await save(response.data, pathToSave, link);
    return `${Array.from(logLoad).join('\n')}\nPage was downloaded as '${file}'`;
  } catch (e) {
    return reporter(e);
  }
};
