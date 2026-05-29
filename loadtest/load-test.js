// Atlas Apparel CRM — load / performance test (k6)
// Unit 6 criterion: C.M3 — load and performance testing.
//
// Install k6:  https://k6.io/docs/get-started/installation/
// Run against local:  k6 run loadtest/load-test.js
// Run against EC2:    k6 run -e BASE_URL=https://crm.example.com loadtest/load-test.js
//
// Ramps virtual users up to 50, hits the page + every API endpoint, and fails
// the run if the 95th-percentile response is slower than 500ms or >1% error.

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // ramp up
    { duration: '1m', target: 50 }, // sustain peak load
    { duration: '30s', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'], // less than 1% errors
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const endpoints = [
  '/',
  '/api/stats',
  '/api/customers',
  '/api/orders',
  '/api/products',
];

export default function () {
  for (const path of endpoints) {
    const res = http.get(`${BASE_URL}${path}`);
    check(res, {
      [`${path} -> 200`]: (r) => r.status === 200,
    });
  }
  sleep(1);
}
