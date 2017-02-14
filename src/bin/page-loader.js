#!/usr/bin/env babel-node
// @flow
import program from 'commander';
import download from '../';

program
  .version('0.0.1')
  .description('It\'s cli util for download & save web pages')
  .option('-O, --output [path]', 'path to save file')
  .arguments('<link-for-download>')
  .action((link) => {
    download(link, program.output).then(result => console.log(result));
  });
program.parse(process.argv);
