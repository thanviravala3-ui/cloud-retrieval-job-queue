import React from 'react';

export function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  const { counts, throughputPerMinute, errorRate } = metrics;

  return (
    <div>
      <h3>System Metrics</h3>
      <p>Waiting: {counts.waiting}</p>
      <p>Active: {counts.active}</p>
      <p>Completed: {counts.completed}</p>
      <p>Failed: {counts.failed}</p>
      <p>Throughput (jobs/min): {throughputPerMinute.toFixed(2)}</p>
      <p>Error rate: {(errorRate * 100).toFixed(1)}%</p>
    </div>
  );
}
