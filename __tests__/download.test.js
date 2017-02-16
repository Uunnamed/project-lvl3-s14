import path from 'path';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import download from '../src';


const tmpDir = path.resolve(os.tmpdir());
const before = fs.readFileSync('./__tests__/__fixtures__/before.html', 'utf-8');
const after = fs.readFileSync('./__tests__/__fixtures__/after.html', 'utf-8');
const fname = 'ru-hexlet-io-courses.html';
const dirContent = 'ru-hexlet-io-courses_files';

beforeEach(() => nock('http://ru.hexlet.io/')
        .get('/courses')
        .reply(200, before));

test('download & compare content', (done) => {
  const fpath = fs.mkdtempSync(`${tmpDir}${path.sep}`);
  download('http://ru.hexlet.io/courses', fpath).then(() => {
    const pathToFile = path.join(fpath, fname);
    const recived = fs.readFileSync(pathToFile, 'utf-8');
    expect(after).toBe(recived);
    done();
  });
});


test('get files on links', (done) => {
  const fpath = fs.mkdtempSync(`${tmpDir}${path.sep}`);
  download('http://ru.hexlet.io/courses', fpath).then(() => {
    const pathToContentDir = path.join(fpath, dirContent);
    expect(fs.existsSync(pathToContentDir)).toBeTruthy();
    const countFiles = fs.readdirSync(pathToContentDir).length;
    expect(countFiles > 0).toBeTruthy();
    done();
  });
});
