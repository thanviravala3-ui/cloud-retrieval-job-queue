const { Worker } = require('bullmq');
const config = require('./config');
const { connection } = require('./queue');

// Worker listens on the same queue and processes jobs
const worker = new Worker(
  config.queueName,
  async job => {
    const { query } = job.data;

    // Simulate real retrieval work
    await new Promise(res => setTimeout(res, 1000 + Math.random() * 2000));

    // Return something so the dashboard can show output
    return { result: `Processed query: ${query}` };
  },
  { connection }
);

// Logging
worker.on('completed', job => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});
