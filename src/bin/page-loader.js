#!/usr/bin/env babel-node
// @flow
import program from 'commander';
import getFile from '../';

program
  .version('0.0.1')
  .description('It\'s cli util for download & save internet pages')
  .option('--output', 'save file')
  .arguments('<source-download>')
  .action((link) => {
    console.log(getFile(link, program.output));
  });
program.parse(process.argv);
