const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { jobQueue } = require('./queue');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Create a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const { query, priority } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'query is required' });
    }

    const job = await jobQueue.add(
      'retrieve',
      { query },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 3000 },
        priority: priority || 5,
        removeOnComplete: false,
        removeOnFail: false
      }
    );

    res.status(202).json({ id: job.id, state: 'queued' });
  } catch (err) {
    console.error('Error creating job', err);
    res.status(500).json({ error: 'failed to create job' });
  }
});

// Get job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await jobQueue.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: 'job not found' });

    const state = await job.getState();
    const logs = await job.getLogs();

    res.json({
      id: job.id,
      name: job.name,
      data: job.data,
      state,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason,
      returnvalue: job.returnvalue,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
      logs
    });
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch job' });
  }
});

// Recent jobs for the dashboard
app.get('/api/jobs/recent', async (req, res) => {
  try {
    const jobs = await jobQueue.getJobs(
      ['waiting', 'active', 'completed', 'failed'],
      0,
      30
    );

    const results = await Promise.all(
      jobs.map(async job => {
        const state = await job.getState();
        return {
          id: job.id,
          query: job.data?.query,
          state,
          attemptsMade: job.attemptsMade,
          failedReason: job.failedReason,
          finishedOn: job.finishedOn,
          processedOn: job.processedOn,
          timestamp: job.timestamp
        };
      })
    );

    res.json({ jobs: results });
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch jobs' });
  }
});

// Metrics: counts, throughput, error rate
app.get('/api/metrics', async (req, res) => {
  try {
    const counts = await jobQueue.getJobCounts();
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    const recentCompleted = await jobQueue.getJobs(['completed'], 0, 200);
    const completedInWindow = recentCompleted.filter(
      job => job.finishedOn && job.finishedOn >= fiveMinutesAgo
    );

    const throughputPerMinute = completedInWindow.length / 5;

    const errorRate =
      counts.completed + counts.failed === 0
        ? 0
        : counts.failed / (counts.completed + counts.failed);

    res.json({
      counts,
      throughputPerMinute,
      errorRate
    });
  } catch (err) {
    res.status(500).json({ error: 'failed to fetch metrics' });
  }
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(config.port, () => {
  console.log(`API running on port ${config.port}`);
});
