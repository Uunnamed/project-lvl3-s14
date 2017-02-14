import axios from 'axios';
import path from 'path';
import fs from 'fs';
import httpAdapter from 'axios/lib/adapters/http';
import nock from 'nock';
import download from '../src';

axios.defaults.adapter = httpAdapter;
const tmpDir = './__tests__/__fixtures__';
const fpath = fs.mkdtempSync(tmpDir + path.sep);
const fname = 'hexlet-io-courses.html';
const testData = 'Test';
nock('http://hexlet.io/')
      .get('/courses')
      .reply(200, testData);

test('begin', () => {
  download('http://hexlet.io/courses', fpath).then(() => {
    const pathToFile = fpath + path.sep + fname;
    const recived = fs.readFileSync(pathToFile, 'utf-8');
    fs.unlinkSync(pathToFile);
    fs.rmdirSync(fpath);
    expect(testData).toBe(recived);
  });
});
