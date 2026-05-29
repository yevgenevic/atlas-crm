# Atlas Apparel — Wholesale CRM

A CRM web app for a wholesale clothing company: dashboard with live KPIs, and full
CRUD management of customers, orders, and products. Built as a server-side service
and deployed on AWS EC2 inside a designed VPC, behind Nginx with HTTPS.

**Stack:** Next.js 14 (App Router) · React 18 · Tailwind CSS · Framer Motion ·
Next.js API routes · SQLite (`better-sqlite3`).

---

## BTEC Unit 6 — criteria mapping

| Criterion | Where it's evidenced |
|---|---|
| **B.P3** Server-side service | API route handlers in [`app/api/`](app/api/) + [`lib/db.js`](lib/db.js) (SQLite) |
| **C.P5** Network design | [`docs/network-design.md`](docs/network-design.md) — VPC, subnets, IP plan, SG rules, diagram |
| **C.P6** EC2 deployment | This README (§ Deployment) + [`deploy/`](deploy/) (Nginx, systemd, deploy script) |
| **B.P4** HTTPS | [`deploy/nginx.conf`](deploy/nginx.conf) + certbot steps (§ Deployment step 7) |
| **C.M3** Load testing | [`loadtest/`](loadtest/) — k6 script + Apache Bench instructions |
| **D.P7** Improvements | [`docs/improvements.md`](docs/improvements.md) |
| **D.P8** CI/CD | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) + [`deploy.yml`](.github/workflows/deploy.yml) |

> **Evidence note:** the configs/scripts/docs here *enable* each criterion. For the
> marks you still capture the proof on your AWS account — screenshots of the VPC /
> subnets / security groups, the live site over HTTPS, and the load-test output.

---

## Local development

```bash
npm ci          # install exact dependencies
npm run dev     # http://localhost:3000
```

The SQLite database (`data/crm.db`) is created and seeded automatically on first
run (8 customers, 12 products, 10 orders).

```bash
npm run build   # production build
npm start       # serve the production build on :3000
```

---

## Project structure

```
app/
  api/{customers,orders,products}/  GET/POST + [id] PUT/DELETE route handlers
  api/stats/                        dashboard KPIs
  page.js  customers/  orders/  products/   the four pages
components/   Sidebar, Modal, StatCard, StatusBadge, PageHeader
lib/          db.js (SQLite + schema + seed), format.js
deploy/       nginx.conf, atlas-crm.service, deploy.sh
docs/         network-design.md, improvements.md
loadtest/     load-test.js (k6), README.md
.github/      workflows/ci.yml, workflows/deploy.yml
```

---

## Deployment to AWS EC2

Full network spec (CIDRs, subnets, routing, SG rules) is in
[`docs/network-design.md`](docs/network-design.md). Summary build:

### 1. Network (VPC)
Create `atlas-crm-vpc` (`10.0.0.0/16`), a public subnet (`10.0.1.0/24`), an
Internet Gateway, and a route table sending `0.0.0.0/0` to the IGW. See the design
doc for the full four-subnet / two-AZ layout.

### 2. Security group
Create `sg-web`: inbound **443** and **80** from `0.0.0.0/0`, **22** from your IP
only. (Port 3000 is never exposed — Nginx fronts it.)

### 3. Launch the instance
Ubuntu 22.04 LTS, `t3.micro`, in the public subnet, with `sg-web` and a key pair.
Allocate and associate an **Elastic IP** so the public address is stable.

### 4. Install runtime
```bash
ssh -i your-key.pem ubuntu@<elastic-ip>
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential nginx certbot python3-certbot-nginx
```
(Node 20 LTS is recommended — `better-sqlite3` ships a prebuilt binary for it, so
no native compile is needed.)

### 5. Get the app & build
```bash
cd ~ && git clone <your-repo-url> atlas-crm && cd atlas-crm
npm ci
npm run build
```

### 6. Run as a service
```bash
sudo cp deploy/atlas-crm.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now atlas-crm
sudo systemctl status atlas-crm        # should be active (running)
```

### 7. Nginx + HTTPS  (B.P4)
Point a DNS **A record** for `crm.yourdomain.com` at the Elastic IP, then:
```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/atlas-crm
# edit the file: replace crm.example.com with your domain
sudo ln -s /etc/nginx/sites-available/atlas-crm /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d crm.yourdomain.com   # issues + installs the TLS cert
```
Visit **https://crm.yourdomain.com** — done.

### 8. Updates
```bash
bash deploy/deploy.sh    # git pull → npm ci → build → restart service
```

---

## CI/CD  (D.P8)
- **`ci.yml`** runs on every push/PR: `npm ci` + `npm run build`.
- **`deploy.yml`** is a manual (`workflow_dispatch`) SSH deploy. Add repo secrets
  `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, then run it from the Actions tab.

## Load testing  (C.M3)
See [`loadtest/README.md`](loadtest/README.md) — `k6 run loadtest/load-test.js`.

## Improvements  (D.P7)
See [`docs/improvements.md`](docs/improvements.md).
