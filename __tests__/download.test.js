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
