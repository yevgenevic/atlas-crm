# Improvement Recommendations

**Unit 6 criterion: D.P7 — Recommendations for improvement.**
Evaluation of the current solution and prioritised recommendations, grouped by
theme. Each item names the current limitation and the proposed change.

## Current solution — honest assessment

**Strengths**
- Real server-side service (Next.js API routes) with persistent storage.
- Clean separation: Nginx (TLS) → app (:3000) → database.
- Reproducible deployment (systemd service, deploy script, CI build).

**Limitations** (addressed below): single point of failure, on-disk SQLite, no
authentication, no monitoring, manual scaling.

---

## 1. Availability & scaling
| # | Recommendation | Why (current limitation) |
|---|---|---|
| 1 | Add an **Application Load Balancer** + **Auto Scaling Group** across eu-west-2a/2b | Single EC2 = single point of failure; can't handle traffic spikes |
| 2 | Run **2+ app instances** in the two public subnets already designed | Horizontal scaling, zero-downtime deploys |

## 2. Data
| # | Recommendation | Why |
|---|---|---|
| 3 | Migrate **SQLite → Amazon RDS (PostgreSQL)** in the private subnets | SQLite is single-node and tied to one EBS volume; RDS gives Multi-AZ failover, automated backups, and lets multiple app nodes share state |
| 4 | Enable **automated backups / snapshots** (RDS) or scheduled EBS snapshots (interim) | No backup strategy today — data loss risk |

## 3. Security
| # | Recommendation | Why |
|---|---|---|
| 5 | Add **authentication & authorisation** (e.g. NextAuth, Cognito) | The CRM is currently open to anyone who can reach it |
| 6 | Move config to **SSM Parameter Store / Secrets Manager** | Avoid hard-coded values; rotate secrets safely |
| 7 | Add **AWS WAF** + security headers (HSTS, CSP) and restrict TLS to 1.2+ | Mitigate common web attacks |
| 8 | Restrict SSH via **SSM Session Manager** instead of port 22 | Removes the inbound SSH port entirely |

## 4. Observability
| # | Recommendation | Why |
|---|---|---|
| 9 | Ship logs/metrics to **CloudWatch** + alarms (CPU, 5xx, latency) | No monitoring today; failures are invisible |
| 10 | Add a **`/api/health`** endpoint for the load balancer health checks | Enables ALB + automated recovery |

## 5. Performance
| # | Recommendation | Why |
|---|---|---|
| 11 | Put **CloudFront (CDN)** in front for static assets | Lower latency for distant clients, less load on EC2 |
| 12 | Add **rate limiting** on API routes (Nginx `limit_req` or app-level) | Protect against abuse / accidental load |

## 6. Delivery
| # | Recommendation | Why |
|---|---|---|
| 13 | Add **automated tests** (unit + API) to the CI workflow | CI currently builds but doesn't test behaviour |
| 14 | Add a **staging environment** before production deploys | Catch issues before they reach users |

---

### Suggested order (highest impact first)
1. Authentication (#5) — biggest security gap.
2. RDS migration + backups (#3, #4) — durability.
3. ALB + Auto Scaling (#1, #2) + health endpoint (#10) — availability.
4. CloudWatch monitoring (#9).
5. Everything else as time allows.
