#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const mkdirp = require('mkdirp');
const packageInfo = require('./package.json');
const generate = require('./lib/codegen').process;

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let asyncAPIFile;

const parseOutput = dir => path.resolve(dir);

const showError = err => {
  console.error(red('Something went wrong:'));
  console.error(red(err.stack || err.message));
};

program
  .version(packageInfo.version)
  .arguments('<asyncAPI>')
  .action((asyncAPIFilePath) => {
    asyncAPIFile = path.resolve(asyncAPIFilePath);
  })
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .parse(process.argv);

if (!asyncAPIFile) {
  console.error(red('> Path to AsyncAPI file not provided.'));
  program.help(); // This exits the process
}

mkdirp(program.output, err => {
  if (err) return showError(err);

  generate(asyncAPIFile, program.output).then(() => {
    console.log(green('Done! ✨'));
    console.log(yellow('Check out your shiny new API at ') + magenta(program.output) + yellow('.'));
  }).catch(showError);
});

process.on('unhandledRejection', showError);
