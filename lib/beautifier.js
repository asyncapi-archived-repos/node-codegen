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

const yellow = (text) => {
  return `\x1b[33m${text}\x1b[0m`;
};

module.exports = (asyncapi) => {
  const services = [];
  const usedOperations = [];
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

    if (topic.publish && topic.subscribe) {
      console.log(yellow('WARNING:'), `Topic ${topicName} is using publish and subscribe operations. It means that you'll receive the messages you publish. Please double-check this is the behaviour you want achieve.`);
    }

    _.each(topic, (operation, operationName) => {
      if (!usedOperations.includes(operationName)) usedOperations.push(operationName);
      operation['operationId'] = operation['operationId'] || getOperationId(parsedTopic);
      const description = operation['summary'] || operation['description'] || '';
      const descriptionLines = description ? wrap(description, { width: 60, indent: '' }).split(/\n/) : [];
      operation['descriptionLines'] = descriptionLines;
    });
  });

  asyncapi.__usedOperations = usedOperations;
  asyncapi.__services = services;

  const commonPrefix = sharedStart(Object.keys(asyncapi.topics));
  const levels = commonPrefix.split('.').length - 1;
  asyncapi.__commonTopic = commonPrefix.split('.').slice(0, levels).join('.');
  asyncapi.__commonTopic = `${asyncapi.__commonTopic}.#`;

  return asyncapi;
};
