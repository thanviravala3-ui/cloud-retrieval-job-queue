import React, { useEffect, useState } from 'react';
import { createJob, getRecentJobs, getMetrics } from './api';
import { JobTable } from './components/JobTable';
import { MetricsPanel } from './components/MetricsPanel';

export default function App() {
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [creating, setCreating] = useState(false);

  async function refresh() {
    const [jobsData, metricsData] = await Promise.all([
      getRecentJobs(),
      getMetrics()
    ]);
    setJobs(jobsData);
    setMetrics(metricsData);
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setCreating(true);
    await createJob(query.trim());
    setQuery('');
    await refresh();
    setCreating(false);
  }

  return (
    <div>
      <h1>Cloud Retrieval & Job Queue Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter retrieval query"
        />
        <button type="submit" disabled={creating}>
          {creating ? 'Submitting…' : 'Submit Job'}
        </button>
      </form>

      <MetricsPanel metrics={metrics} />
      <JobTable jobs={jobs} />
    </div>
  );
}
