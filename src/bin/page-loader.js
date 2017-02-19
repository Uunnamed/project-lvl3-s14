#!/usr/bin/env babel-node
// @flow
import program from 'commander';
import download from '../';

program
  .version('0.1.5')
  .description('It\'s cli util for download & save web pages')
  .option('-O, --output [path]', 'path to save file')
  .arguments('<link-for-download>')
  .action(async (link) => {
    try {
      console.log(await download(link, program.output));
    } catch (e) {
      console.log(e);
    }
  });
program.parse(process.argv);
