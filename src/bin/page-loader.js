#!/usr/bin/env babel-node
// @flow
import program from 'commander';
import download from '../';

program
  .version('0.0.1')
  .description('It\'s cli util for download & save web pages')
  .option('-O, --output [path]', 'path to save file')
  .arguments('<link-for-download>')
  .action(async (link) => {
    console.log(await download(link, program.output));
  });
program.parse(process.argv);
