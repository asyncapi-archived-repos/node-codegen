const path = require('path');
const process = require('../lib/codegen').process;

process(path.resolve(__dirname, 'sample.yml'), path.resolve(__dirname, './output/'));
