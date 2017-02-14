import path from 'path';
import fs from 'fs';
import nock from 'nock';
import download from '../src';

const tmpDir = './__tests__/__fixtures__';
const fpath = fs.mkdtempSync(`${tmpDir}${path.sep}`);
const fname = 'hexlet-io-courses.html';
const testData = 'Test';

test('download & compare content', (done) => {
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
