import React from 'react';

export function JobTable({ jobs }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Job ID</th>
          <th>Query</th>
          <th>Status</th>
          <th>Attempts</th>
          <th>Finished</th>
        </tr>
      </thead>
      <tbody>
        {jobs.map(job => (
          <tr key={job.id}>
            <td>{job.id}</td>
            <td>{job.query}</td>
            <td>{job.state}</td>
            <td>{job.attemptsMade}</td>
            <td>
              {job.finishedOn
                ? new Date(job.finishedOn).toLocaleTimeString()
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
