# Velonyx Unified AI Lead System — AWS Lambda backend

This Lambda is the brain behind the entire Velonyx AI lead system on `velonyxsystems.com`:

1. **Chatbot** (Q&A on the marketing site) — `POST /chat`
2. **Conversational lead form** (intent-driven intake) — `POST /form-turn`
3. **Two-way SMS** (Twilio webhook) — `POST /sms/inbound`

The same Anthropic model (Claude Haiku 4.5) + the same business-context prompts power all three. Conversation state stitches together in one Supabase row per lead.

---

## Morning checklist for Carlos (~30 min total)

### 1. Anthropic API key (~2 min)
1. **https://console.anthropic.com** → Settings → Billing → add payment method, fund $5+ credit, set $100/month spend cap
2. Settings → API Keys → **Create Key** → name `velonyx-chatbot-lambda` → copy `sk-ant-api03-…`

### 2. Supabase migration (~2 min)
1. Open your trades-template Supabase project → **SQL Editor → New query**
2. Open `backend/supabase-migrations/001_leads.sql` from this repo, copy the entire file
3. Paste into the SQL Editor → **Run**
4. Verify: `select count(*) from public.leads;` → returns 0
5. Settings → API → copy: **Project URL** (`https://…supabase.co`) and **service_role secret** (starts with `eyJ…` or `sb_secret_…`)

### 3. Twilio (~3 min)
1. **https://console.twilio.com** → Account → General settings → copy **Account SID** and **Auth Token**
2. Phone Numbers → Manage → confirm you own `+18773178643` (or whichever number you'll send from)
3. **Critical for US SMS:** Messaging → Regulatory Compliance → A2P 10DLC → confirm **Brand: APPROVED** + **Campaign: APPROVED**. If not approved, US SMS will be filtered/blocked. Registration takes 1-3 weeks.
4. Phone Numbers → click your number → scroll to **Messaging Configuration** → **A Message Comes In**: leave blank for now — we'll set it in Step 7 after the API Gateway URL is known.

### 4. Resend (~3 min)
1. **https://resend.com** → API Keys → **Create API Key** → name `velonyx-lambda` → copy `re_…`
2. Domains → **Add Domain** → enter `velonyxsystems.com` → follow the DNS instructions (TXT + MX records). Verification takes 2-30 minutes after DNS propagates.
3. Once verified, your send address is `something@velonyxsystems.com` (e.g. `leads@velonyxsystems.com`).

### 5. Create the AWS Lambda function (~3 min)
1. **https://console.aws.amazon.com** → top-right region → **us-east-1**
2. Lambda → **Create function** → Author from scratch
3. **Function name:** `velonyx-chatbot` · **Runtime:** Node.js 20.x · **Architecture:** x86_64 · default permissions → **Create**
4. Inside the function:
   - **Configuration → General configuration → Edit:** Memory `256 MB`, Timeout `30 sec` → Save
   - **Configuration → Environment variables → Edit → Add** (paste each):

| Env var | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-…` (from Step 1) |
| `SUPABASE_URL` | Your Supabase project URL (from Step 2) |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key (from Step 2) |
| `TWILIO_ACCOUNT_SID` | `AC…` (from Step 3) |
| `TWILIO_AUTH_TOKEN` | (from Step 3) |
| `TWILIO_MESSAGING_SERVICE_SID` | `MG…` (your Messaging Service SID — **preferred for toll-free**) |
| `TWILIO_PHONE_FROM` | `+18773178643` — **only set if no Messaging Service** (fallback) |
| `RESEND_API_KEY` | `re_…` (from Step 4) |
| `RESEND_FROM_ADDRESS` | `Velonyx <leads@velonyxsystems.com>` (verified in Step 4) |
| `OWNER_EMAIL` | `admin@velonyxsystems.com` (where you get lead alerts) |
| `OWNER_PHONE` | Your cell in E.164 format, e.g. `+15551234567` |
| `ALLOWED_ORIGIN` | `https://velonyxsystems.com` (optional, this is the default) |

### 6. Upload the function code (~1 min)
You have two options:

**Option A — pre-built zip (fastest):**
Use the `function.zip` Claude sent you in chat. Lambda → Code → **Upload from → .zip file** → upload → Save.

**Option B — bash script (requires AWS CLI):**
```bash
cd backend/chatbot-lambda
bash deploy.sh
```

### 7. Create API Gateway HTTP API with 3 routes (~6 min)
1. AWS Console → **API Gateway** → Create API → **HTTP API** → Build
2. **Integrations:** Add integration → Lambda → `velonyx-chatbot` (region us-east-1)
3. **API name:** `velonyx-chatbot-api` → Next
4. **Configure routes** — add THREE routes:

| Method | Path | Integration |
|---|---|---|
| POST | `/chat` | velonyx-chatbot |
| POST | `/form-turn` | velonyx-chatbot |
| POST | `/sms/inbound` | velonyx-chatbot |

5. Stages: default `$default`, auto-deploy on → Next → Create

6. **Configure CORS** (left sidebar → CORS):
   - Access-Control-Allow-Origin: `https://velonyxsystems.com`
   - Access-Control-Allow-Methods: `POST`, `OPTIONS`
   - Access-Control-Allow-Headers: `content-type`
   - Save

7. Copy the **Invoke URL** at the top — looks like `https://abc123.execute-api.us-east-1.amazonaws.com`. **Paste this URL in chat to Claude** — Claude will wire it into `assets/marketing-config.js`.

### 8. Wire Twilio inbound SMS webhook (~1 min)

**Preferred (if using a Messaging Service):**
1. Twilio Console → **Messaging → Services** → click your Messaging Service (e.g. "Velonyx Lead System")
2. Left sidebar → **Integration**
3. **Incoming Messages** → **Send a webhook**
   - Request URL: `<your API Gateway invoke URL>/sms/inbound`
   - HTTP method: `POST`
4. Save

**Fallback (raw phone number, no Messaging Service):**
1. Twilio Console → Phone Numbers → Manage → click your number
2. Scroll to **Messaging Configuration** → **A Message Comes In** → set:
   - Webhook: `<your API Gateway invoke URL>/sms/inbound`
   - HTTP Method: `POST`
3. Save

Either way: when a lead's SMS lands, Twilio POSTs to that URL → Lambda routes → Claude generates a reply → TwiML response → Twilio sends the reply.

**Why Messaging Service is preferred:** carrier filter rules + delivery troubleshooting + sticky-sender (a lead always gets replies from the same number even if you add more) all live at the Messaging Service level. If you set the webhook on both the service AND the phone number, the **phone number's webhook wins** — so keep the per-number webhook blank when using a service.

### 9. Test end-to-end (~3 min on your real phone)
1. Open velonyxsystems.com on your phone
2. Click the chatbot launcher → ask "What's the $700 build include?" → expect real Claude reply (not canned)
3. Ask "I want one — how do I start?" → expect handoff → form modal opens
4. In the form: type your name → your phone → "interested in the lead system"
5. Within ~30 seconds, your phone gets an SMS from `+18773178643` (or your number)
6. Reply to the SMS → expect AI reply within ~5 seconds
7. Check `admin@velonyxsystems.com` for a Resend notification email
8. Check the Supabase `leads` table — one row with full conversation log
9. Reply STOP → confirm thread closes, lead status = `stopped`

---

## Architecture

```
Browser (velonyxsystems.com)
  ├─ assets/velonyx-chatbot.js     ← chatbot widget, hands off on intent
  └─ assets/velonyx-lead-form.js   ← conversational form modal
       │
       ▼ POST /chat or /form-turn
  AWS API Gateway HTTP API
       │
       ▼
  Lambda: velonyx-chatbot (path-routed)
       │
       ├─ /chat        → Claude + 3 tools (capture_lead, redirect_to_page, initiate_lead_capture)
       ├─ /form-turn   → Claude + complete_capture tool
       │                  ↓ on completion:
       │                  ├─ Supabase: insert leads row
       │                  ├─ Twilio: send opening SMS
       │                  └─ Resend: email Carlos · Twilio: SMS Carlos
       │
       └─ /sms/inbound ← Twilio webhook
                          ↓
                          Supabase: lookup lead, append turn
                          Claude + 2 tools (book_call, handoff_to_carlos)
                          Twilio: TwiML reply
                          Supabase: append bot turn
```

## Files

| File | Purpose |
|---|---|
| `index.js` | Multi-route Lambda handler (path-based dispatch) |
| `system-prompt.md` | Chat mode (Q&A + redirect + handoff) |
| `system-prompt-form.md` | Form mode (collect name/phone/interest) |
| `system-prompt-sms.md` | SMS mode (continue conversation, book the call) |
| `lib/http.js` | Tiny https.request wrapper |
| `lib/supabase.js` | PostgREST REST client (service_role) |
| `lib/twilio.js` | Twilio Messages API client + TwiML helpers |
| `lib/resend.js` | Resend REST client |
| `lib/intent.js` | Phone normalization, intent regex, hash helpers |
| `package.json` | `@anthropic-ai/sdk` only |
| `deploy.sh` | Zip + upload via AWS CLI |
| `../supabase-migrations/001_leads.sql` | Initial schema |

## Costs

**Claude Haiku 4.5 (per turn):** ~$0.0001-0.0005
**Per full lead lifecycle** (5 chat + 3 form + 8 SMS turns): ~$0.012
**Twilio SMS** (US, A2P 10DLC): ~$0.008 per outbound + $0.008 per inbound = ~$0.13 per lead lifecycle
**Resend:** free under 3,000 emails/month
**Supabase:** free under 500MB / 50K rows

**Per-lead total ballpark:** ~$0.15 (Claude + Twilio dominate)

## Cost safeguards (locked in code)

| Lever | Cap |
|---|---|
| Anthropic spend | $100/month (set in Anthropic console) |
| Form turns per session | 15 |
| SMS turns per lead lifetime | 30 |
| Lambda max_tokens per call | 800 |
| Chat history window sent to model | 20 turns |
| Lambda timeout | 30s |

## Updating the bot's behavior

| Change | Where |
|---|---|
| Voice / tone | `system-prompt.md` (chat), `system-prompt-form.md` (form), `system-prompt-sms.md` (SMS) |
| Pricing / tier list | All 3 prompts (search for "Essentials" / "Growth" / "Elite") |
| Add a redirect destination | `index.js` → `resolveRedirect()` + `redirect_to_page` enum |
| Add a new chat tool | `index.js` → `TOOLS_CHAT` array + handler in `handleChat()` |

After any change: `bash deploy.sh` (or upload a new zip via console). Changes take effect on the next Lambda cold-start (~10s after upload).

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Chatbot shows "Let me get you to Carlos" canned fallback | Lambda URL not wired in marketing-config.js | Confirm `assets/marketing-config.js` line is uncommented and points to your API Gateway URL with `/chat` suffix |
| Chat works but form fails ("having trouble") | `/form-turn` route missing in API Gateway | API Gateway → Routes → add `POST /form-turn` |
| Form completes but no SMS arrives | Twilio not configured or 10DLC blocked | Lambda CloudWatch logs → look for `twilio sendSms` errors; verify env vars and 10DLC status |
| SMS arrives but reply doesn't trigger AI | Twilio webhook URL not set | Twilio Console → number → Messaging Configuration → `A Message Comes In` = `<API URL>/sms/inbound` |
| Lambda crashes on cold-start | Missing env var | Configuration → Environment variables → confirm all 10 vars are set |
| Lead not in Supabase | service_role key wrong | Run a SQL test in Supabase: insert a row manually to verify the connection |
| Spend cap hits fast | Bot abuse | Add per-IP rate limit (DynamoDB token bucket) in `handleChat`/`handleFormTurn` |

## Future enhancements (out of scope for v1)

- Per-IP rate limiting via DynamoDB
- AI Voice Agent (Twilio Voice + Claude — separate Lambda)
- Conversation logging to CloudWatch for replay/debugging
- Streaming responses for chat (real-time token-by-token feel)
- Multilingual support (Spanish for the trades market)
