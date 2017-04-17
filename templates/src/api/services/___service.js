const {{service}} = module.exports = {};

{{#each asyncapi.topics as |topic topicName|}}
  {{#if topic.publish}}
    {{#if topic.publish.descriptionLines}}
/**
 {{#each topic.publish.descriptionLines}}
 * {{this}}
 {{/each}}
 */
    {{/if}}
{{topic.serviceName}}.{{topic.publish.operationId}} = async ({message}) => {
  // Implement you business logic here...
};

  {{/if}}
  {{#if topic.subscribe}}
    {{#if topic.subscribe.descriptionLines}}
/**
 {{#each topic.subscribe.descriptionLines}}
 * {{this}}
 {{/each}}
 */
    {{/if}}
{{topic.serviceName}}.{{topic.subscribe.operationId}} = async ({message}) => {
  // Implement you business logic here...
};

  {{/if}}
{{/each}}
