// @flow
import fs from 'mz/fs';
import path from 'path';
import url from 'url';
import os from 'os';
import cheerio from 'cheerio';
import ncp from 'ncp';
import Multispinner from 'multispinner';
import { flatMap } from 'lodash';
import axios from '../lib/axios';


const ParseTags = {
  link: 'href',
  script: 'src',
};

const getFileName = (link) => {
  const { hostname, pathname } = url.parse(link);
  const ext = path.extname(pathname);
  const newPathname = ext ? pathname.slice(0, -ext.length) : pathname;
  return `${`${hostname}${newPathname}`.split(/[\W]+/).filter(e => !!e).join('-')}${ext || '.html'}`;
};

const saveFile = (data, pathToSave, link) => {
  const fname = getFileName(link);
  const fpath = path.resolve(pathToSave, fname);
  return fs.writeFile(fpath, data, 'utf-8').then(() => fname);
};

const getLinks = (data) => {
  const $ = cheerio.load(data);
  const links = flatMap(Object.keys(ParseTags), tag =>
    [...$(tag).map((i, el) => $(el).attr(ParseTags[tag]))]);
  return links.filter(e => !!e);
};

const replaceLinks = (data, dirName, links) =>
  links.reduce((acc, link) => acc.replace(link, `${dirName}/${getFileName(link)}`), data);

const geDirName = (link) => {
  const fname = getFileName(link);
  const extFname = path.extname(fname);
  return `${fname.slice(0, -extFname.length)}_files`;
};

const downloadLinks = async (links, pathToSave) => {
  const multispinner = new Multispinner([...links], { preText: 'Downloading', interval: 0 });
  multispinner.on('done', () => console.log('Completed'));
  const loader = async (link) => {
    try {
      const res = await axios.get(link, { responseType: 'arraybuffer' });
      multispinner.success(link);
      return saveFile(res.data, pathToSave, link);
    } catch (e) {
      multispinner.error(link);
      return e;
    }
  };
  return Promise.all(links.map(loader));
};

const moveDir = (from, to) =>
  new Promise((resolve, reject) => {
    ncp(from, to, err => (err ? reject(err) : resolve()));
  });


const save = async (data: string, pathToSave: string, link: string) => {
  const tmpPath = await fs.mkdtemp(`${path.resolve(os.tmpdir())}${path.sep}`);
  const links = getLinks(data);
  const nameContentDir = geDirName(link);
  const pathContentDir = path.resolve(tmpPath, nameContentDir);
  await fs.mkdir(pathContentDir);
  const newData = replaceLinks(data, nameContentDir, links);
  const nameBaseFile = await saveFile(newData, tmpPath, link);
  await downloadLinks(links, pathContentDir);
  await moveDir(tmpPath, path.resolve(pathToSave));
  return nameBaseFile;
};

export default save;
