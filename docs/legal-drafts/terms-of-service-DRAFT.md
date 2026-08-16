# Terms of Service — DRAFT FOR ATTORNEY REVIEW

**Velonyx Systems LLC** · admin@velonyxsystems.com · (877) 317-8643 · velonyxsystems.com
**Draft date:** 2026-08-16 · **Status:** not in effect; do not publish

> These Terms have two parts. **Part A** applies to everyone who visits velonyxsystems.com or talks to our AI assistant. **Part B** applies to businesses that buy the Velonyx AI Front Desk ("Customers"). Customers who sign a Master Services Agreement (MSA) are governed by the MSA where it conflicts with Part B.

---

## Part A — Website and AI Assistant Terms of Use

### 1. Who we are

Velonyx Systems LLC ("Velonyx," "we," "us") is a California limited liability company based in San Diego County. We build and operate AI front-desk systems for businesses.

### 2. You are talking to an AI

Our website chat, text-message line, phone line, and demo playground are answered by an AI assistant. It will tell you it is an AI, and you can ask for a person at any time. Phone calls with the assistant are transcribed to text so it can respond; the greeting says so. Conversation content is stored as described in our Privacy Policy.

### 3. What the AI is not

The assistant answers questions about Velonyx and helps you book a call. It is **not** legal, financial, medical, tax, or other professional advice, and it can be wrong. Do not rely on it for decisions that need a professional. If it quotes a price or a date, the written quote or booking confirmation from a human at Velonyx controls.

### 4. Acceptable use of the site and demo

Do not: attempt to break, overload, or reverse-engineer the site, the AI, or the demo; use the AI to generate unlawful, harassing, or infringing content; scrape or harvest data; submit someone else's phone number to receive texts; or use the demo to test attacks (prompt injection, toll fraud, spam). We may block access for abuse.

### 5. Text messages from us

If you tick the SMS consent box on our forms or text our number, we may text you about your inquiry (confirmations, replies, reminders, follow-ups). Message frequency varies; message and data rates may apply; reply STOP to opt out, HELP for help. Consent is not a condition of purchase. Full terms: our SMS Terms & Consent page.

### 6. Content and intellectual property

The site, the AI system, our template, and our brand are owned by Velonyx or its licensors. You may view the site for your own information. Nothing here grants you a license to our template code (see Part B, Section 12 for what Customers receive).

### 7. Privacy

Our Privacy Policy explains what we collect and why. When you talk to the AI front desk of one of our **Customers** (a business using our platform), that business is responsible for your data; we process it only on their behalf.

### 8. Disclaimer and liability for the site

The site and demo are provided "as is." To the extent permitted by law, Velonyx is not liable for indirect, incidental, or consequential damages arising from your use of the site or demo, and our total liability to a site visitor is limited to USD 100. [LAWYER: confirm this floor is enforceable for consumers in California and abroad, and whether a jurisdiction-specific carve-out ("some jurisdictions do not allow…") is needed.]

---

## Part B — Customer Terms (Velonyx AI Front Desk)

### 9. The Service

The **Service** is a done-for-you AI front desk: a branded website plus an AI assistant that answers on the channels enabled for you (web chat, SMS, voice calls, Instagram DM, Facebook Messenger, WhatsApp), qualifies leads, books appointments on your Google Calendar, sends SMS confirmations and follow-ups, and an owner portal (installable as an app) with a unified inbox, a Take Over button, push notifications, and a monthly report. Exact deliverables and enabled channels are in your Statement of Work (SOW).

The Service is delivered as an **isolated instance** stamped from Velonyx's master template: your own deployment, your own database, your own configuration.

### 10. Fees

| Item | Amount | When |
|---|---|---|
| Build fee (one-time) | **USD 700** | Due before build work starts |
| Subscription | **USD 70 / month** | First charge at go-live [LAWYER/Carlos: or 30 days after go-live? Old refund page promised "first month free"; the draft assumes first charge at go-live — pick one]; then monthly on the same calendar day |
| Growth add-ons (optional) | **USD 250, 500, or 1,500 / month** per the add-on selected | Added to the monthly charge from the month enabled |

All prices in US dollars, exclusive of taxes. Third-party usage beyond the included allowance in your SOW (for example unusually high SMS or voice-minute volume) may be passed through at cost with prior notice. [Carlos: state the included allowance in the SOW or delete this sentence.] Prices for existing subscriptions change only with 30 days' notice; the change applies from your next billing period.

**Billing is not yet self-serve.** Until online checkout is live, fees are invoiced and paid by the method agreed on your call. When Stripe checkout is live, card payments are processed by Stripe; we never store card numbers.

### 11. Term, renewal, and cancellation

- The subscription starts at go-live and renews **automatically each month** until cancelled.
- **You can cancel online at any time** from the owner portal (Settings → Subscription → Cancel) or by emailing admin@velonyxsystems.com from your account email. No phone call, no notice period, no reason required.
- Cancellation takes effect at the **end of the billing period you have already paid for**. You keep full service until then. We do not prorate partial months. [LAWYER: this is the proposed default. Confirm it satisfies Cal. Bus. & Prof. Code 17600–17606 (online cancellation "in the same medium," clear and conspicuous renewal disclosure, acknowledgment) and whether the pre-checkout disclosure text needs to be specified here.]
- Velonyx may suspend the Service for non-payment after 10 days' written notice, and may terminate for a material breach not cured within 15 days of notice.
- What happens to your data and your instance after cancellation is in Section 13.

### 12. Ownership — what is yours, what is ours, and the month-12 transfer

**Yours, always:** your business content (logo, copy, images, knowledge-base answers), your customer data (conversations, leads, bookings), your domain, your phone number, your social accounts, and your Google Calendar. We use them only to run your Service.

**Ours:** the Velonyx master template — the platform code, prompts, architecture, portal, and know-how — and the Velonyx brand. During the subscription you have a non-exclusive, non-transferable license to use your instance for your business.

**The month-12 transfer.** After **12 consecutive months of paid subscription** (starting at go-live, no unpaid gaps), you may request that Velonyx transfer your instance to you. Within 30 days of your request Velonyx will:

1. transfer the code repository for your instance to your GitHub account (full history);
2. transfer the database (your Supabase project — data, auth users, scheduled jobs) to your Supabase organization;
3. hand over your configuration and walk you through re-hosting on your own Vercel account, your own Google Cloud service account, and, if you are leaving Velonyx entirely, porting your Twilio number and moving your Meta app;
4. rotate or delete every credential Velonyx held for your instance, on a screen-share.

You then **own** that stamped copy outright, and Velonyx grants you a **perpetual, royalty-free, non-exclusive license** to the Velonyx template code embodied in it — you may run it, modify it, and hire anyone to maintain it. You may not resell the template as a product to others. Velonyx keeps the master template and may keep using it for other clients. After transfer, third-party costs (hosting, database, telephony, AI usage, roughly USD [Carlos: number] per month at typical volumes) are yours; you may keep paying Velonyx for a maintenance plan instead. [LAWYER: confirm structure — assignment of the instance + non-exclusive perpetual license to the underlying template — and the resale restriction. Also: what if the client is in arrears at month 12, or the subscription lapsed at month 8 and restarted?]

### 13. What happens when you cancel before month 12

- Your instance stops serving at the end of the paid period.
- For **30 days** after that, you can export your customer data (conversations, leads, bookings) from the portal or by request, and we will hand over your domain, phone number, and social-account access. We do not transfer the code or database before month 12.
- After the 30-day window we delete your instance and its data (except records we must keep by law, such as SMS consent and opt-out logs). Details: our Data Processing Agreement.

### 14. Refunds

Summarized here; the Refund Policy controls.
- Build fee: fully refundable if you cancel **within 48 hours of paying and before kickoff**. Once build work starts (kickoff call held or assets received), the build fee is **non-refundable**, because the engineering hours are spent.
- Monthly fee: not refunded for partial months. If we fail to deliver a paid month of Service (instance down for more than 72 consecutive hours for reasons within our control), we credit that month.
- Ask us before you file a chargeback; we will make it right where the policy applies. [LAWYER: confirm chargeback language does not read as a waiver of consumer rights.]

### 15. Your responsibilities as the business using the AI

You are the business your customers are dealing with. You are the **sender** of every text and the **controller** of your customers' data. Specifically, you agree to:

1. **Consent for texts and DMs.** Only send SMS or DM follow-ups and campaigns to people who gave *prior express written consent* to receive them from your business (TCPA / CTIA rules and their equivalents where you operate). The portal will not start a campaign until you attest that consent exists; that attestation is your representation, and it is your job to keep the consent records.
2. **Calls.** Comply with call-recording and transcription laws where you and your callers are located. The AI voice greeting discloses that the caller is speaking with an AI and that the call is transcribed; do not remove that notice.
3. **AI disclosure.** The AI identifies itself as an AI. Do not configure it to pretend to be a human. Comply with any AI or bot-disclosure law in your jurisdiction.
4. **Knowledge base accuracy.** The AI answers from what you give it. You are responsible for the accuracy and legality of your business content, prices, and claims, and for reviewing what the AI says (the portal shows every conversation; the Take Over button lets you step in).
5. **Sensitive data — read this.** The Service is **not** designed for protected health information (HIPAA), data of children under 16, payment-card data, biometric data, or other sensitive categories. Velonyx **does not sign HIPAA Business Associate Agreements.** Do not route these categories through the Service unless you have a **separate written agreement** with Velonyx. If you are a medical, dental, mental-health, or similar business, tell us on the call — we can build the front desk to take appointment requests without collecting health details, but you must not instruct it to collect them.
6. **Accounts and access.** Keep your portal login secure; the portal is restricted to the owner emails you tell us to allowlist. Give us the access we need (Google Calendar, Meta Business, Twilio if you bring your own) and keep your third-party accounts in good standing.
7. **Lawful use.** No unlawful, deceptive, harassing, or infringing use; no use to send unsolicited bulk messages; no attempt to override the AI's safety or spend limits.

### 16. What Velonyx does and does not promise about the AI

- The AI **can be wrong.** It can misunderstand, mis-quote, hallucinate a fact, or book the wrong slot. We design against this (it answers only from your knowledge base, it books only real free slots, every conversation is visible in your portal), but we do not warrant that any individual answer is accurate.
- The AI gives **no professional advice** on your behalf. If your business gives advice (legal, medical, financial), the AI is a front desk, not the professional.
- The Service depends on third parties (Anthropic, Twilio, Meta, Google, Supabase, Vercel, and others listed in the DPA). We are not responsible for their outages, policy changes, or rejections (for example, Meta app review or carrier A2P registration decisions).
- We provide the tooling for lawful use — STOP/HELP handling, suppression lists, consent checkboxes, campaign consent attestation, AI and transcription disclosures — but **you** are responsible for using it lawfully.

### 17. Warranty

We warrant that we will perform the build and operate the Service in a professional and workmanlike manner and materially as described in your SOW. Your remedy for breach is re-performance or, if we cannot fix it, a refund of the affected fees. Otherwise the Service is provided "as is," and we disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement, to the extent permitted by law.

### 18. Indemnities

- **You** will defend and indemnify Velonyx against third-party claims arising from: texts, DMs, or calls sent by or through your instance without the required consent; your content or knowledge base; your violation of law; or your breach of Section 15.
- **Velonyx** will defend and indemnify you against third-party claims that the Velonyx template code, as delivered by us and unmodified, infringes a US patent, copyright, or trademark. [LAWYER: standard exclusions (client content, combinations, modifications) and Velonyx's right to procure/replace/refund.]

### 19. Limitation of liability

To the extent permitted by law: neither party is liable for indirect, incidental, special, consequential, or punitive damages, or lost profits or revenue; and each party's total liability under these Terms is capped at **the fees you paid Velonyx in the 12 months before the event giving rise to the claim**. The cap does not apply to your payment obligations, either party's indemnities, breach of confidentiality, or gross negligence or wilful misconduct. [LAWYER: confirm cap (12 months vs. old 3-month cap), carve-outs, and whether data-protection claims should sit under a separate super-cap.]

### 20. Confidentiality

Each party keeps the other's non-public business information confidential and uses it only for the Service. Your customer data is covered by the DPA, not just this clause.

### 21. Portfolio use

Unless you opt out in writing, we may name you as a customer and show your public site in our portfolio. We will never show your customer conversations or data.

### 22. Changes to these Terms

We may update these Terms. For Customers, changes take effect at your next billing period after we email you at least 30 days in advance; material adverse changes give you the right to cancel before they apply.

### 23. Governing law and disputes

These Terms are governed by California law. Before filing any claim, the parties will try to resolve it by good-faith negotiation for 30 days, then mediation in San Diego County. Courts in San Diego County, California have exclusive jurisdiction thereafter. [LAWYER: (a) arbitration + class-action waiver instead? (b) enforceability against non-US Customers given worldwide sales; (c) consumer small-claims carve-out.]

### 24. General

Entire agreement (with your SOW, the MSA if signed, the DPA, the Refund Policy, and the Privacy Policy — in that order of precedence in a conflict); no assignment by you without consent except to a successor of your business; force majeure; severability; notices by email to the addresses on file; independent contractors.

### 25. Contact

Velonyx Systems LLC · admin@velonyxsystems.com · (877) 317-8643 · velonyxsystems.com
