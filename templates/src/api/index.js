'use strict';

const hermes = require('hermesjs')();
const buffer2string = require('./middlewares/buffer2string');
const string2json = require('./middlewares/string2json');
const logger = require('./middlewares/logger');
{{#each asyncapi.__schemes as |scheme|}}
const {{capitalize scheme}}Adapter = require('./adapters/{{scheme}}');
{{/each}}
{{#each asyncapi.__services as |service|}}
const {{service}} = require('./routes/{{service}}.js');
{{/each}}

{{#each asyncapi.__schemes as |scheme|}}
hermes.add('broker', {{capitalize scheme}}Adapter);
{{/each}}

hermes.on('broker:ready', ({name}) => {
  console.log(`${name} is listening...`);
});

hermes.use(buffer2string);
hermes.use(string2json);
hermes.use(logger);

{{#each asyncapi.__services as |service|}}
hermes.use({{service}});
{{/each}}

hermes.use((err, message, next) => {
  console.error(err);
  next();
});

hermes.listen();
