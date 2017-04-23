const {{service}} = module.exports = {};

{{#each asyncapi.topics as |topic topicName|}}
  {{#if topic.publish}}
/**
 {{#if topic.publish.descriptionLines}}
 {{#each topic.publish.descriptionLines}}
 * {{this}}
 {{/each}}
 *
 {{/if}}
 * @param {Object} options
 * @param {Object} options.message
 {{#if topic.publish.headers}}
 {{#each topic.publish.headers as |field fieldName|}}
{{{docline field fieldName 'options.message.headers'}}}
 {{/each}}
 {{/if}}
 {{#each topic.publish.payload as |field fieldName|}}
{{{docline field fieldName 'options.message.payload'}}}
 {{/each}}
 */
{{topic.serviceName}}.{{topic.publish.operationId}} = async ({message}) => {
  // Implement your business logic here...
};

  {{/if}}
  {{#if topic.subscribe}}
/**
 {{#if topic.subscribe.descriptionLines}}
 {{#each topic.subscribe.descriptionLines}}
 * {{this}}
 {{/each}}
 *
 {{/if}}
 * @param {Object} options
 * @param {Object} options.message
 {{#each topic.subscribe.headers as |field fieldName|}}
{{{docline field fieldName 'options.message.headers'}}}
 {{/each}}
 {{#each topic.subscribe.payload as |field fieldName|}}
{{{docline field fieldName 'options.message.payload'}}}
 {{/each}}
 */
{{topic.serviceName}}.{{topic.subscribe.operationId}} = async ({message}) => {
  // Implement your business logic here...
};

  {{/if}}
{{/each}}
