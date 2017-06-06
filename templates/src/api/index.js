'use strict';

const hermes = require('hermesjs')();
const json2string = require('./middlewares/json2string');
const logger = require('./middlewares/logger');
{{#each asyncapi.schemes as |scheme|}}
const {{capitalize scheme}}Adapter = require('./adapters/{{scheme}}');
{{/each}}
{{#each asyncapi.__services as |service|}}
const {{service}} = require('./routes/{{service}}.js');
{{/each}}

{{#each asyncapi.schemes as |scheme|}}
hermes.add('broker', {{capitalize scheme}}Adapter);
{{/each}}

hermes.on('broker:ready', ({name}) => {
  console.log(`${name} is listening...`);
});

hermes.use(logger);
hermes.from.client.use(json2string);

{{#each asyncapi.__services as |service|}}
hermes.use({{service}});
{{/each}}

hermes.use((err, message, next) => {
  console.error(err);
  next();
});

hermes.listen();
