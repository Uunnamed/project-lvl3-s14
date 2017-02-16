import path from 'path';
import fs from 'fs';
import nock from 'nock';
import os from 'os';
import download from '../src';

const tmpDir = path.resolve(os.tmpdir());

test('download & compare content', (done) => {
  const fname = 'hexlet-io-courses.html';
  const fpath = fs.mkdtempSync(`${tmpDir}${path.sep}`);
  const testData = 'Test';
  nock('http://hexlet.io/')
        .get('/courses')
        .reply(200, testData);
  download('http://hexlet.io/courses', fpath).then(() => {
    const pathToFile = path.join(fpath, fname);
    const recived = fs.readFileSync(pathToFile, 'utf-8');
    expect(testData).toBe(recived);
    done();
  });
});


test('test replace links', (done) => {
  const fname = 'ru-hexlet-io-courses.html';
  const fpath = fs.mkdtempSync(`${tmpDir}${path.sep}`);
  const before = fs.readFileSync('./__tests__/__fixtures__/before.html', 'utf-8');
  const after = fs.readFileSync('./__tests__/__fixtures__/after.html', 'utf-8');
  nock('http://ru.hexlet.io/')
        .get('/courses')
        .reply(200, before);
  download('http://ru.hexlet.io/courses', fpath).then(() => {
    const pathToFile = path.join(fpath, fname);
    const recived = fs.readFileSync(pathToFile, 'utf-8');
    expect(after).toBe(recived);
    done();
  });
});
