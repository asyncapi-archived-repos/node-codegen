const config = require('../../lib/config');
{{#compare adapter '===' 'amqp' }}
const hermesAMQP = require('hermesjs-amqp');

const adapter = hermesAMQP({
  exchange: config.broker.amqp.exchange,
  username: config.broker.amqp.username,
  password: config.broker.amqp.password,
  host: config.broker.amqp.host,
  port: config.broker.amqp.port,
  topic: config.broker.amqp.topic,
  queue: config.broker.amqp.queue,
  queue_options: config.broker.amqp.queue_options,
  subscribe: {{shouldSubscribe ../asyncapi}} // ATTENTION: If subscribe is true you might receive the messages you send.
});
{{/compare}}
{{#compare adapter '===' 'mqtt' }}
const hermesMQTT = require('hermesjs-mqtt');

const adapter = hermesMQTT({
  host_url: config.broker.mqtt.host_url,
  topics: config.broker.mqtt.topics,
  qos: config.broker.mqtt.qos,
  protocol: config.broker.mqtt.protocol,
  retain: config.broker.mqtt.retain,
  subscribe: {{shouldSubscribe ../asyncapi}} // ATTENTION: If subscribe is true you might receive the messages you send.
});
{{/compare}}

module.exports = adapter;
