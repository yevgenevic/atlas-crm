# Load & Performance Testing

**Unit 6 criterion: C.M3 — load and performance testing.**

Two ways to test, depending on what's installed.

## Option A — k6 (recommended, full report)

[`load-test.js`](load-test.js) ramps to 50 concurrent virtual users and exercises
the page plus every API endpoint, with pass/fail thresholds.

```bash
# Install k6: https://k6.io/docs/get-started/installation/

# Against local dev/prod build:
k6 run loadtest/load-test.js

# Against the deployed EC2 instance:
k6 run -e BASE_URL=https://crm.example.com loadtest/load-test.js
```

k6 prints `http_req_duration` (avg / p95 / max), `http_reqs` (throughput), and
whether the thresholds passed. **Screenshot this output for your evidence.**

## Option B — Apache Bench (quick, no extra install on most Linux)

```bash
# 1000 requests, 50 concurrent, against the stats API:
ab -n 1000 -c 50 https://crm.example.com/api/stats

# Against the dashboard page:
ab -n 500 -c 25 https://crm.example.com/
```

Record **Requests per second**, **Time per request**, and the response-time
percentiles from the `ab` summary.

## What to capture for the assignment
- The tool output (k6 summary or `ab` summary).
- A note on the instance size tested (e.g. t3.micro) and the result
  (throughput + p95 latency), then relate it to the scaling recommendations in
  [`../docs/improvements.md`](../docs/improvements.md).
