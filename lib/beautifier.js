const _ = require('lodash');
const wrap = require('word-wrap');
const topicParser = require('asyncapi-topic-parser');

const getOperationId = (parsedTopic) => {
  const name = `${parsedTopic.resources.join('-')}-${parsedTopic.operation}`;
  const id = parsedTopic.status ? `${name}-${parsedTopic.status}` : name;
  return _.camelCase(parsedTopic.type === 'event' ? `on-${id}` : id);
};

const sharedStart = (array) => {
  const A = array.concat().sort();
  const a1 = A[0], a2= A[A.length-1], L= a1.length;
  let i = 0;
  while (i<L && a1.charAt(i)=== a2.charAt(i)) i++;
  return a1.substring(0, i);
};

module.exports = (asyncapi) => {
  const services = [];
  asyncapi.baseTopic = asyncapi.baseTopic || '';

  _.each(asyncapi.topics, (topic, topicName) => {
    if (asyncapi.baseTopic.trim().length > 0) {
      const newTopicName = `${asyncapi.baseTopic}.${topicName}`;
      asyncapi.topics[newTopicName] = topic;
      delete asyncapi.topics[topicName];
      topicName = newTopicName;
    }

    const parsedTopic = topicParser.parse(topicName);

    topic['serviceName'] = parsedTopic.service;
    if (!services.includes(parsedTopic.service)) services.push(parsedTopic.service);

    _.each(topic, (operation, operationName) => {
      operation['operationId'] = operation['operationId'] || getOperationId(parsedTopic);
      const description = operation['summary'] || operation['description'] || '';
      const descriptionLines = description ? wrap(description, { width: 60, indent: '' }).split(/\n/) : [];
      operation['descriptionLines'] = descriptionLines;
    });
  });

  asyncapi.__services = services;

  const commonPrefix = sharedStart(Object.keys(asyncapi.topics));
  const levels = commonPrefix.split('.').length - 1;
  asyncapi.__commonTopic = commonPrefix.split('.').slice(0, levels).join('.');
  asyncapi.__commonTopic = `${asyncapi.__commonTopic}.#`;

  return asyncapi;
};
