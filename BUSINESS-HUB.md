# Velonyx Systems — Business Hub

> **This is your home base.** Open this conversation in Cursor any time you need to work on Velonyx business projects. Everything is organized below.

---

## Quick Access — Project Folders

### Velonyx Systems Website
- **Path:** `velonyx-website/index.html`
- Main business website for velonyxsystems.com
- Logo assets in `velonyx-website/assets/`
- Backend Lambda function: `velonyx-website/backend/lambda_function.py`

### Cloud Backend (AWS + Twilio)
The booking system runs on a serverless AWS backend:

| Service | What It Does |
|---------|-------------|
| **AWS Lambda** | `velonyx-booking` — processes form submissions, sends SMS + email |
| **AWS API Gateway** | `https://hkb4uflm35.execute-api.us-east-1.amazonaws.com/book` |
| **AWS SES** | Sends styled booking notification emails to admin@velonyxsystems.com |
| **Twilio** | Sends SMS confirmation texts to clients from (877) 317-8643 |
| **IAM User** | `velonyx-admin` — admin user (root key deleted, best practice) |

**AWS Console Login:** `https://964604399458.signin.aws.amazon.com/console`
**Twilio Dashboard:** `https://console.twilio.com`

### Client Demo Sites
Sample websites to showcase to potential clients:

| Demo | Path |
|------|------|
| Barber Shop | `client-demos/barber/index.html` |
| Fitness Studio | `client-demos/fitness/index.html` |
| Photography | `client-demos/photo/index.html` |

### Business Documents
- **Path:** `business-docs/`
- `bank-info-tax-preparer.html` — Banking info for tax preparer
- `VHS-intake-info.txt` — Client intake information

### Content & Drafts
- **Path:** `content/`
- `MEDIUM-POST-FULL.md` — Medium blog post (full version)
- `MEDIUM-POST-COPY-PASTE.md` — Medium blog post (copy-paste version)
- `docker-project-medium-linkedin-draft.md` — Docker project post draft

### Challenge Coin
- **Path:** `challenge-coin/index.html`
- Border Patrol challenge coin design project

---

## Folder Structure

```
Cursor-Claude/
├── BUSINESS-HUB.md              <-- You are here
├── velonyx-website/             <-- Main Velonyx site
│   ├── index.html
│   ├── backend/
│   │   └── lambda_function.py   <-- AWS Lambda (booking handler)
│   └── assets/
│       ├── vs-logo.png
│       └── vs-logo-shield.png
├── client-demos/                <-- Demo sites for clients
│   ├── barber/index.html
│   ├── fitness/index.html
│   └── photo/index.html
├── business-docs/               <-- Tax, banking, intake docs
│   ├── bank-info-tax-preparer.html
│   └── VHS-intake-info.txt
├── content/                     <-- Blog posts & drafts
│   ├── MEDIUM-POST-FULL.md
│   ├── MEDIUM-POST-COPY-PASTE.md
│   └── docker-project-medium-linkedin-draft.md
├── challenge-coin/              <-- Challenge coin project
│   ├── index.html
│   └── AI-PROMPTS.md
└── index.html                   <-- Hello Blue Team Cohort page
```

---

## How to Work

1. Open this chat in Cursor to get back to your business workspace
2. Ask Claude to open any project file listed above
3. To preview a website, ask Claude to launch it in the browser
4. To create a new client demo, ask Claude to add one to `client-demos/`

---

*Last organized: March 25, 2026*
*Backend deployed: March 25, 2026 — AWS Lambda + API Gateway + SES + Twilio*
