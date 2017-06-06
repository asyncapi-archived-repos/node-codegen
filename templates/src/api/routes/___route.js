const router = require('hermesjs-router')();
const {{service}} = require('../services/{{service}}');

{{#each asyncapi.topics as |topic topicName|}}
  {{#if topic.publish}}
    {{#if topic.publish.descriptionLines}}
/**
 {{#each topic.publish.descriptionLines}}
 * {{this}}
 {{/each}}
 */
    {{/if}}
router.use('{{dotsToSlashes topicName}}', async (message, next) => {
  await {{topic.serviceName}}.{{topic.publish.operationId}}({message});
  next();
});

  {{/if}}
  {{#if topic.subscribe}}
    {{#if topic.subscribe.descriptionLines}}
/**
 {{#each topic.subscribe.descriptionLines}}
 * {{this}}
 {{/each}}
 */
    {{/if}}
router.use('{{dotsToSlashes topicName}}', async (message, next) => {
  await {{topic.serviceName}}.{{topic.subscribe.operationId}}({message});
  next();
});

  {{/if}}
{{/each}}
module.exports = router;
