import fs from 'mz/fs';
import path from 'path';
import url from 'url';
import os from 'os';
import cheerio from 'cheerio';
import ncp from 'ncp';
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
  const logLoad = new Set();
  const loader = link =>
    axios.get(link, { baseURL: link, responseType: 'arraybuffer' })
      .then(async (resp) => {
        await saveFile(resp.data, pathToSave, resp.config.baseURL);
        logLoad.add(`loaded - ${resp.config.baseURL}`);
      })
      .catch(error => logLoad.add(`no_loaded - ${error.config.baseURL}`));
  await Promise.all(links.map(loader));
  return logLoad;
};

const moveDir = (from, to) =>
  new Promise((resolve, reject) => {
    ncp(from, to, err => (err ? reject(err) : resolve()));
  });

const save = async (data, pathToSave, link) => {
  const tmpPath = await fs.mkdtemp(`${path.resolve(os.tmpdir())}${path.sep}`);
  const links = getLinks(data);
  const dirName = geDirName(link);
  const pathToDir = path.resolve(tmpPath, dirName);
  await fs.mkdir(pathToDir);
  const newData = replaceLinks(data, dirName, links);
  const nameBaseFile = await saveFile(newData, tmpPath, link);
  const logLoad = await downloadLinks(links, pathToDir);
  await moveDir(tmpPath, path.resolve(pathToSave));
  return [nameBaseFile, logLoad];
};

export default save;
