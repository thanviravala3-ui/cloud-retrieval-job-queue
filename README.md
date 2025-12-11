# Cloud Retrieval & Job Queue System: AppDev Architecture Demo

This project is a small end-to-end demo of an async retrieval and job queue system,
similar to what an AWS AppDev / ProServe team would build for a customer.

It has three main parts:

- **Backend API (Node.js + Redis + BullMQ)**  
  - Accepts retrieval requests as jobs
  - Pushes jobs into a Redis-backed queue
  - Exposes REST endpoints for job status and aggregate metrics

- **Worker Service (Containerized Node.js workers)**  
  - Listens on the same queue
  - Processes jobs asynchronously
  - Publishes results and error information for monitoring

- **React Dashboard**  
  - Shows recent jobs, their state, and attempts
  - Displays basic metrics such as throughput and error rate
  - Gives a simple “operations console” for the system

The architecture is intentionally small but mirrors real distributed systems:
API service, queue, worker pool, and observability surfaced through a dashboard.

---

## Tech Stack

- Node.js / Express
- Redis + BullMQ for async job queueing
- React for the dashboard
- Docker for containerizing the API and worker services

---

## High-Level Flow

1. A client calls `POST /api/jobs` with a retrieval query.
2. The API creates a job in the Redis queue.
3. One of the worker containers picks up the job and “processes” it.
4. The worker writes the result back to the job payload.
5. The dashboard calls:
   - `GET /api/jobs/recent` to show recent jobs
   - `GET /api/metrics` to show throughput/error rate
