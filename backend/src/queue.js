const { Queue } = require('bullmq');
const config = require('./config');

const connection = {
  host: config.redis.host,
  port: config.redis.port
};

const jobQueue = new Queue(config.queueName, { connection });

module.exports = {
  jobQueue,
  connection
};
