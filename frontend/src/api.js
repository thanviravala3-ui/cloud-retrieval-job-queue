import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000'
});

export async function createJob(query) {
  const res = await client.post('/api/jobs', { query });
  return res.data;
}

export async function getRecentJobs() {
  const res = await client.get('/api/jobs/recent');
  return res.data.jobs;
}

export async function getMetrics() {
  const res = await client.get('/api/metrics');
  return res.data;
}
