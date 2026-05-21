# Velonyx Chatbot — AWS Lambda Backend

This folder contains the production Lambda backend for the Velonyx Assistant chatbot widget on `velonyxsystems.com`.

**Status:** Code ready. **Deployment pending Carlos** (this morning checklist).

When this Lambda is deployed and its URL is wired into `assets/marketing-config.js`, the widget switches from fallback mode (lead-capture only) to **AI mode** (full conversational chatbot with tool-use lead capture). No frontend code change needed.

---

## Morning checklist (~10–20 minutes)

### 1. Create Anthropic API key (~30 sec)

1. Open https://console.anthropic.com
2. Sign in (or create account if needed)
3. Settings → API Keys → Create Key. Name it `velonyx-chatbot-lambda`. Copy the key (starts with `sk-ant-…`) — you'll paste it as a Lambda env var below.
4. Settings → Billing → set a **monthly spend cap of $100** under the velonyx-chatbot workspace (or default workspace if no separate workspace). Alert at 80%.

### 2. Create the Lambda function (~3 min)

1. Open AWS Lambda console → Create function → Author from scratch
2. **Function name:** `velonyx-chatbot`
3. **Runtime:** Node.js 20.x
4. **Architecture:** x86_64
5. **Permissions:** create new role with basic Lambda permissions (default is fine — Lambda only needs outbound network)
6. Click Create function

Once created, in the function configuration:

7. **General configuration → Edit:**
   - Memory: 256 MB
   - Timeout: 30 seconds
8. **Environment variables → Edit → Add:**
   - `ANTHROPIC_API_KEY` = `<paste key from step 1>`
   - (Optional) `ALLOWED_ORIGIN` = `https://velonyxsystems.com` (defaults to this if not set)

### 3. Deploy the code (~3 min)

You have two options:

**Option A — Bash script (if AWS CLI is configured locally):**

```bash
cd backend/chatbot-lambda
bash deploy.sh
```

The script installs `@anthropic-ai/sdk`, zips everything, and uploads to the function. Done.

**Option B — Manual zip upload via console:**

```bash
cd backend/chatbot-lambda
npm install --omit=dev
zip -r function.zip index.js system-prompt.md package.json node_modules
```

Then in the Lambda console: Code → Upload from → .zip file → upload `function.zip`.

### 4. Front the Lambda with API Gateway (~5 min)

1. AWS API Gateway → Create API → HTTP API → Build
2. **Integrations:** Add integration → Lambda → select `velonyx-chatbot` (same region)
3. **Routes:** `POST /chat` → integration: velonyx-chatbot
4. **Stages:** default `$default` is fine, auto-deploy on
5. **CORS:** Configure CORS → 
   - Access-Control-Allow-Origin: `https://velonyxsystems.com`
   - Access-Control-Allow-Methods: `POST,OPTIONS`
   - Access-Control-Allow-Headers: `content-type`
6. Click Create. Copy the **Invoke URL** (looks like `https://<id>.execute-api.us-east-1.amazonaws.com`).

### 5. Wire the URL into the marketing site (~1 min)

Edit `assets/marketing-config.js`:

```js
// Before:
// window.VELONYX_CHATBOT_API_URL = 'https://<API_GATEWAY_ID>.execute-api.us-east-1.amazonaws.com/chat';

// After (uncomment + paste your real URL):
window.VELONYX_CHATBOT_API_URL = 'https://abc123def.execute-api.us-east-1.amazonaws.com/chat';
```

Commit + push to `main`. GitHub Pages redeploys in ~30 seconds. The widget switches from fallback to AI mode automatically.

### 6. Verify (~2 min)

Open https://velonyxsystems.com on your phone, click the gold chat bubble in the bottom-right corner, and try:

- "What's the $700 build include?"
- "How long does it take?"
- "I'm interested. My number is 555-123-4567 and I'm Carlos at Acme HVAC."

You should see real conversational replies, and the last message should fire a lead capture into your existing leads pipeline (Lambda at `jyo775chsk.execute-api.us-east-1.amazonaws.com/leads`).

If anything fails, the widget transparently falls back to the lead-capture flow — no broken UX.

---

## Architecture summary

```
Browser (velonyxsystems.com)
  └─ assets/velonyx-chatbot.js  ← embeddable widget, fallback-aware
       │ (mode: AI when window.VELONYX_CHATBOT_API_URL is set)
       │
       ▼
  POST /chat → API Gateway HTTP API
       │
       ▼
  AWS Lambda: velonyx-chatbot
       │
       ├─ Pre-filter: jailbreak regex on user message → polite refusal if matched
       │
       ├─ Anthropic API call (Claude Haiku 4.5)
       │    - Model: claude-haiku-4-5-20251001
       │    - System prompt: loaded from system-prompt.md on cold-start
       │    - Tools: capture_lead(name, phone, email, service, summary)
       │    - max_tokens: 800 per turn
       │    - history: last 20 turns from the client
       │
       ├─ If model calls capture_lead tool:
       │    └─ POST to existing leads Lambda → admin dashboard + SMS to Carlos
       │
       ├─ Post-filter: strip non-whitelisted URLs from output
       │
       └─ Return { reply, leadCaptured } as JSON
```

## Costs

**Claude Haiku 4.5 pricing (as of Jan 2026):**
- Input: $1 per 1M tokens
- Output: $5 per 1M tokens

**Per-conversation estimate:**
A typical chat is 4–8 turns at ~300 tokens per turn = ~2.4K tokens = **~$0.0096 per conversation**.

**At 1,000 conversations/month:** ~$9.60
**At 10,000 conversations/month:** ~$96

**The $100/month spend cap set in step 1 gives you ~10K conversations of headroom.** If the cap fires, Anthropic stops accepting calls — the widget gracefully degrades to fallback (lead-capture only).

## Token budget (per session)

The Lambda enforces:
- Max output tokens per turn: 800
- History sent to model: last 20 turns (client-side trim)
- No persistent storage; conversation state lives in the browser

## Editing the bot's behavior

**Change the bot's knowledge (pricing, FAQ answers, plans):**  
Edit `system-prompt.md`, zip + redeploy via `deploy.sh`. The system prompt is loaded on cold-start, so changes take effect within a few minutes (or instantly if you force a new cold-start by editing function configuration).

**Change tone:**  
Edit the "Voice and tone" section in `system-prompt.md`.

**Add a new lead-capture trigger:**  
Edit the "Lead-capture triggers" section in `system-prompt.md`.

**Disable lead capture:**  
Remove the `TOOLS` array in `index.js` (set to `[]`).

## Testing locally (optional)

Set `ANTHROPIC_API_KEY` in your shell, then:

```bash
cd backend/chatbot-lambda
npm install
node -e "
  const handler = require('./index.js').handler;
  handler({
    requestContext: { http: { method: 'POST' } },
    body: JSON.stringify({
      sessionId: 'test-local',
      message: 'What is the \$700 build?',
      history: []
    })
  }).then(r => console.log(JSON.parse(r.body)));
"
```

## Sample API Gateway test event (for the Lambda console "Test" tab)

```json
{
  "requestContext": { "http": { "method": "POST" } },
  "body": "{\"sessionId\":\"test\",\"message\":\"What is the $700 build?\",\"history\":[]}"
}
```

Expected response status `200`, body contains `reply` field with a relevant assistant message.

---

## Troubleshooting

**Widget shows "having trouble connecting":**  
- Check Lambda CloudWatch logs for the error
- Verify `ANTHROPIC_API_KEY` is set in Lambda env vars
- Verify API Gateway CORS allows `https://velonyxsystems.com`
- Verify the URL in `marketing-config.js` matches the API Gateway invoke URL + `/chat` route

**Lead-capture tool fires but leads don't land in dashboard:**  
- Check Lambda logs — the lead POST is logged on failure
- Verify the existing leads Lambda (`jyo775chsk.execute-api.us-east-1.amazonaws.com/leads`) is healthy
- The `source: "chatbot"` field needs to be acceptable to the leads Lambda — if it strict-validates, edit the leads Lambda to allow it, or remove that field from `index.js` line ~155

**Spend cap hit too fast:**  
- Check Anthropic console for the spend graph
- If you're seeing organic abuse / bots hammering the endpoint, add a simple rate limiter (cap requests per `sessionId` per hour) in `index.js`

---

## Future enhancements (out of scope for the initial deploy)

- Conversation logging to DynamoDB for admin review
- Per-client config templating (when you want to white-label the bot for client builds)
- Streaming responses (token-by-token) instead of waiting for the full reply
- Voice input (Web Speech API) on the widget side
- Multilingual support (Spanish-speaking trades market)

These are documented in the broader product roadmap; this Lambda is the MVP.
