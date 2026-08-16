# Master Services Agreement — DRAFT FOR ATTORNEY REVIEW

**Velonyx Systems LLC** · San Diego County, California · admin@velonyxsystems.com · (877) 317-8643
**Draft date:** 2026-08-16 · **Status:** not in effect; signed per client via e-signature once approved

This Master Services Agreement ("Agreement") is entered into on the date of last electronic signature ("Effective Date") between **Velonyx Systems LLC**, a California limited liability company ("Velonyx"), and **[CLIENT LEGAL NAME]**, [entity type and state/country] with its principal place of business at [ADDRESS] ("Client"). Each is a "Party."

---

## 1. Definitions

- **Service** — the Velonyx AI Front Desk described in Section 2 and the applicable SOW.
- **Template** — Velonyx's master platform: source code, prompts, database schema, portal, scripts, runbooks, architecture, and know-how, as it exists and as Velonyx improves it. Owned by Velonyx.
- **Instance** — the copy of the Template stamped and configured for Client: Client's private code repository, Client's dedicated database project (Supabase), Client's deployment, environment configuration, and `client.config` values.
- **Client Content** — everything Client provides or approves for the Instance: brand assets, copy, images, business hours, prices, FAQ / knowledge-base answers, greetings.
- **Client Data** — personal information and conversation content of Client's customers, prospects, and staff processed through the Instance (messages, call transcripts, phone numbers, names, bookings, leads, consent records).
- **SOW** — a Statement of Work signed by both Parties under this Agreement.
- **DPA** — the Data Processing Agreement attached as Exhibit A.
- **Go-Live** — the date the Instance is switched to serve real traffic on Client's channels, confirmed by email.
- **Transfer Date** — the date the Instance is transferred to Client under Section 6.3.

## 2. Services

2.1 **What Velonyx provides.** A done-for-you AI front desk: (a) a branded website; (b) an AI assistant that answers on the channels enabled in the SOW (web chat, SMS, voice calls with transcription, Instagram DM, Facebook Messenger, WhatsApp), qualifies leads, books appointments on Client's Google Calendar, sends SMS confirmations, and runs automatic follow-ups; (c) an owner portal (installable as a PWA) with unified inbox, Take Over, push notifications, and a monthly report; (d) hosting, monitoring, and maintenance of the Instance during the subscription.

2.2 **How.** Velonyx stamps a dedicated Instance from the Template and configures it from Client Content. Nothing in the Instance is shared with other Velonyx clients: separate deployment, separate database, separate configuration. [Carlos: some credentials (AI key, Twilio account, Google service account) are currently shared across instances until handoff — either state that here or make per-client keys the default. See audit §3 item 9.]

2.3 **SOWs.** Each SOW states deliverables, enabled channels, timeline, fees, and acceptance criteria. If a SOW conflicts with this Agreement, the SOW controls for that engagement only, except that a SOW cannot change Sections 6 (Ownership), 7 (Data), 11 (Liability), or 13 (Sensitive Data).

2.4 **Changes.** Scope changes after SOW signature require a written change request accepted by both Parties (email is fine), stating the change, any fee, and any timeline impact.

## 3. Term and Renewal

3.1 This Agreement starts on the Effective Date and continues while any SOW or subscription is active, plus the transition period in Section 12.

3.2 **Subscription.** The monthly subscription starts at Go-Live and **renews automatically month to month** until cancelled under Section 12.1.

3.3 **Consecutive Paid Months.** For Section 6.3, a "Consecutive Paid Month" is a subscription month for which the fee was paid in full by its due date (or within the 10-day cure period). A lapse resets the count unless Velonyx agrees otherwise in writing. [LAWYER: is a hard reset fair/enforceable? Alternative: pause the count, don't reset.]

## 4. Fees and Payment

4.1 **Build fee:** USD 700, one-time, invoiced on SOW signature and due before build work starts.
4.2 **Subscription:** USD 70 per month, first charge at Go-Live, then monthly. [Carlos/LAWYER: or first charge 30 days after Go-Live — see Terms §10.]
4.3 **Add-ons:** optional growth add-ons at USD 250, 500, or 1,500 per month as selected in writing; added to the monthly charge; may be dropped at the end of any billing period.
4.4 **Pass-through usage.** Third-party usage above the allowance in the SOW (SMS segments, voice minutes, AI tokens) is billed at cost with 7 days' notice. Velonyx enforces daily spend caps on the Instance and will pause rather than overrun them.
4.5 **Taxes** are Client's responsibility except taxes on Velonyx's income.
4.6 **Late payment.** Fees unpaid 10 days after the due date accrue interest at 1.0% per month or the maximum lawful rate, whichever is lower, and Velonyx may suspend the Instance after written notice. [LAWYER: old MSA had 1.5%; confirm.]
4.7 **Price changes** to the subscription require 30 days' notice and apply from the next billing period; Client may cancel before they apply.
4.8 **Payment method.** Until online checkout is live, by invoice. When live, by card through Stripe under Stripe's terms.

## 5. Client Obligations

5.1 Provide Client Content, access (Google Calendar, Meta Business Manager, phone-number porting or Twilio access if bringing a number), business hours, and a decision-maker within the timelines in the SOW.
5.2 Review and approve the AI's knowledge base and greetings before Go-Live; keep them accurate afterward through the portal.
5.3 Keep portal credentials secure. The portal only admits emails on Client's owner allowlist; Client tells Velonyx who to allow.
5.4 **Lawful messaging.** Client is the sender of every SMS, DM, and call placed through the Instance and is responsible for: (a) obtaining and retaining *prior express written consent* before any marketing text or DM campaign (TCPA, CTIA, and local equivalents); (b) truthfully completing the consent attestation the portal requires before a campaign starts; (c) honoring the STOP/opt-out list (the Instance enforces it automatically — Client must not bypass it); (d) call-recording and transcription consent laws where Client and its callers are located; (e) any AI or bot-disclosure law applicable to Client. Velonyx provides the tooling (consent checkboxes, STOP/HELP handling, suppression list, campaign attestation, AI and transcription disclosures in every greeting) and Client must not disable it.
5.5 **Accuracy.** Client is responsible for the truth and legality of Client Content and of what the AI says based on it. The AI does not give professional advice on Client's behalf.
5.6 Not use the Instance for unlawful, deceptive, harassing, or infringing purposes, or to send unsolicited bulk messages.

## 6. Ownership and Intellectual Property

6.1 **Client owns, at all times:** Client Content, Client Data, Client's domain name, Client's phone number(s), Client's social accounts and Meta assets, and Client's Google Calendar. Velonyx uses them only to perform the Service.

6.2 **Velonyx owns, at all times:** the Template, all improvements to it (including improvements suggested by or arising from work for Client, without identifying Client), and the Velonyx brand. **During the subscription** Velonyx grants Client a non-exclusive, non-transferable, revocable license to use the Instance for Client's own business.

6.3 **Month-12 Transfer.** After **twelve (12) Consecutive Paid Months**, Client may request transfer of the Instance. Within 30 days of the request Velonyx will, following its Handoff procedure:

  (a) transfer the Instance's code repository, including history, to a GitHub account controlled by Client;
  (b) transfer the Instance's Supabase project (data, auth users, scheduled jobs) to a Supabase organization controlled by Client, after which Client takes over that project's billing;
  (c) provide the Instance's configuration and environment values (by screen-share, never by email) and assist Client to deploy on Client's own Vercel account and Client's own Google Cloud service account, and to update the booking calendar accordingly;
  (d) if Client is leaving Velonyx entirely, initiate porting of Client's Twilio number to Client's account and assist in moving the Meta app to Client's Business portfolio (Client acknowledges carrier A2P/toll-free re-registration and Meta App Review may need to be redone under Client's brand);
  (e) rotate or delete every credential Velonyx held for the Instance, and remove Velonyx's portal user, on a screen-share with Client;
  (f) run the smoke test on Client's deployment and confirm all subsystems pass.

6.4 **Effect of Transfer.** On completion of 6.3, Velonyx **assigns to Client all of Velonyx's right, title, and interest in the Instance** (the specific stamped copy, its configuration, and its data) and grants Client a **perpetual, irrevocable, worldwide, royalty-free, non-exclusive license** to the Template code embodied in the Instance, to use, host, modify, and have maintained by anyone, for Client's own business. Client may not sublicense, sell, or offer the Template or the Instance as a platform to third parties. Velonyx retains ownership of the Template and may continue to use it for other clients. Velonyx has no further hosting, maintenance, or support obligation for the transferred Instance unless Client buys a maintenance plan. [LAWYER: confirm this structure (assignment of the copy + non-exclusive license to the underlying template) achieves the marketing promise "you own it" without giving away the Template, and whether the anti-resale restriction is enforceable post-transfer. Also confirm no warranty on the transferred code beyond the smoke test.]

6.5 **After Transfer**, Client bears all third-party costs of running the Instance (currently about USD [Carlos: number] per month at typical volumes for database, hosting, telephony, and AI usage), unless Client elects a Velonyx maintenance plan.

6.6 **Before month 12**, no transfer of code or database occurs; Section 12.3 governs data export.

6.7 **Feedback** Client gives about the Template may be used by Velonyx freely.

6.8 **Portfolio.** Velonyx may identify Client as a customer and show Client's public website, unless Client opts out in writing. Velonyx will not display Client Data.

## 7. Data Protection

7.1 The Parties agree that for Client Data, **Client is the controller / business and Velonyx is the processor / service provider.** The DPA (Exhibit A) governs Velonyx's processing of Client Data, the subprocessor list, security measures, breach notice, and deletion.
7.2 Velonyx will not sell or share Client Data, will use it only to provide the Service, and will not use Client Data to train AI models. [Carlos: verify subprocessor terms — Anthropic API data is not used for training by default; confirm the same for Deepgram/ElevenLabs settings in use.]
7.3 Client is responsible for its own privacy notices to its customers, including disclosure that an AI answers, that calls are transcribed, and that Velonyx and its subprocessors process the data.

## 8. Confidentiality

Each Party will protect the other's Confidential Information (non-public business, technical, and financial information, marked or reasonably understood as confidential) with at least reasonable care, use it only for this Agreement, and disclose it only to personnel and subprocessors who need it and are bound by similar obligations. Excludes information that is public, already known, independently developed, or lawfully received from a third party. Compelled disclosure allowed with notice where lawful. Survives 3 years after termination; trade secrets, indefinitely. Client Data is governed by the DPA rather than this Section.

## 9. Warranties and Disclaimers

9.1 **Velonyx warrants** that (a) it will perform the Services in a professional and workmanlike manner; (b) the Instance at Go-Live will materially conform to the SOW; (c) the AI will identify itself as an AI and voice greetings will disclose transcription; (d) the Instance will honor STOP/opt-out requests automatically. Client's exclusive remedy for breach of (a)–(b) is re-performance, or if Velonyx cannot re-perform within 30 days, a refund of the fees for the non-conforming Service.
9.2 **AI disclaimer.** Client acknowledges the AI can be wrong, can misunderstand, and can produce inaccurate or unexpected output. Velonyx does not warrant the accuracy of any individual AI response or booking. Client is responsible for monitoring conversations through the portal.
9.3 **Third parties.** The Service depends on third-party providers (listed in the DPA). Velonyx is not liable for their outages, changes, or decisions (including carrier registration outcomes and Meta App Review), but will use reasonable efforts to work around them.
9.4 **Client warrants** it has the rights to Client Content, that it will comply with Section 5.4, and that it will not route data described in Section 13 through the Instance.
9.5 EXCEPT AS STATED, THE SERVICE IS PROVIDED "AS IS," AND VELONYX DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE EXTENT PERMITTED BY LAW.

## 10. Indemnification

10.1 **By Client.** Client will defend, indemnify, and hold Velonyx harmless from third-party claims, fines, and penalties (including TCPA statutory damages and regulatory fines) arising from: (a) messages, calls, or campaigns sent by or through the Instance without required consent or in violation of law; (b) Client Content or Client's knowledge base; (c) Client's breach of Sections 5.4, 5.5, or 13; (d) Client's violation of law.
10.2 **By Velonyx.** Velonyx will defend, indemnify, and hold Client harmless from third-party claims that the Template code as delivered by Velonyx (unmodified, and excluding Client Content and third-party services) infringes a US copyright, trademark, or trade secret, or a US patent. [LAWYER: patent inclusion?] If such a claim arises Velonyx may modify or replace the affected code or, if not commercially reasonable, terminate and refund prepaid unused fees.
10.3 **Procedure.** Prompt notice, control of the defense by the indemnifying Party, reasonable cooperation, no settlement admitting fault by the indemnified Party without consent.

## 11. Limitation of Liability

11.1 NEITHER PARTY IS LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOST PROFITS, REVENUE, OR DATA, HOWEVER CAUSED.
11.2 EACH PARTY'S TOTAL LIABILITY UNDER THIS AGREEMENT IS LIMITED TO **THE FEES PAID BY CLIENT TO VELONYX IN THE TWELVE (12) MONTHS PRECEDING THE EVENT GIVING RISE TO THE CLAIM.**
11.3 The exclusions in 11.1 and the cap in 11.2 do not apply to: Client's payment obligations; either Party's indemnity obligations under Section 10; breach of Section 8; or gross negligence, fraud, or wilful misconduct. [LAWYER: (a) 12 months vs. old 3-month cap; (b) whether to add a separate, higher cap (e.g., 2x fees) for Velonyx's breach of the DPA rather than an uncapped carve-out; (c) whether the Client-indemnity carve-out is too broad given TCPA damages can be enormous relative to fees.]

## 12. Termination and Transition

12.1 **Cancellation by Client.** Client may cancel the subscription at any time **online from the portal** or by email to admin@velonyxsystems.com; effective at the end of the current paid billing period; no notice period; no proration. Client may terminate a build before kickoff under the Refund Policy.
12.2 **Termination for cause.** Either Party may terminate for material breach not cured within 15 days of written notice. Velonyx may suspend immediately for unlawful use, Section 13 violations, or unpaid fees after Section 4.6 notice.
12.3 **Transition (30 days).** For 30 days after the subscription ends, Velonyx will: (a) make Client Data available for export from the portal or as CSV/JSON on request; (b) release Client's domain, phone number, and Meta assets to Client's control; (c) if the Section 6.3 conditions are met, perform the Transfer. After the 30 days Velonyx deletes the Instance and Client Data per the DPA, retaining only what law requires (SMS consent and opt-out records) and billing records.
12.4 **Survival.** Sections 6.1, 6.2, 6.4 (if Transfer occurred), 7, 8, 9.5, 10, 11, 12.3–12.4, 14, 15.

## 13. Sensitive Data — Prohibited Without a Separate Agreement

13.1 The Service is **not** designed, and Velonyx does not offer it, for: protected health information under HIPAA; personal information of children under 16; payment-card data (PCI-DSS); biometric identifiers; precise geolocation; government IDs; financial account credentials; or other "sensitive personal information" as defined by the CCPA/CPRA or GDPR special categories.
13.2 **Velonyx does not sign HIPAA Business Associate Agreements.** Client must not configure the Instance to request, and must instruct its customers not to provide, the categories in 13.1, unless the Parties have signed a **separate written agreement** covering that data. Client accepts that customers may volunteer such information in free-text; the Parties will note in the SOW how the AI is instructed to redirect such disclosures. [LAWYER: is this carve-out sufficient for a med-spa/dental client that only takes appointment requests, or should Velonyx refuse HIPAA-covered entities entirely?]
13.3 Breach of this Section is a material breach and is indemnified by Client under Section 10.1.

## 14. Dispute Resolution and Governing Law

California law governs, without regard to conflicts principles. The Parties will negotiate in good faith for 30 days, then mediate in San Diego County before litigation. Exclusive venue: state and federal courts in San Diego County, California; each Party consents to jurisdiction. Prevailing Party recovers reasonable attorneys' fees. Either Party may seek injunctive relief for IP or confidentiality breaches without waiting. [LAWYER: arbitration alternative; enforceability against non-US Clients; whether to reference the CISG exclusion for international sales.]

## 15. General

Independent contractors; no agency. Entire agreement — this Agreement, its Exhibits (A: DPA; B: Refund Policy), and SOWs; order of precedence: DPA (for data matters), then this Agreement, then SOW, then Refund Policy. Amendments in writing (email suffices for change requests under 2.4). Assignment: Client may assign to a successor of substantially all its business on notice; Velonyx may assign to a successor. Force majeure. Severability. Notices by email to the addresses in the signature block, effective on send during business days. Electronic signatures binding. Counterparts. [LAWYER: keep or drop the old MSA's Freelance Worker Protection Act reference and the "independent business" ABC-test recitals — Velonyx is an entity, not an individual freelancer.]

## Exhibits

- **Exhibit A — Data Processing Agreement** (`dpa-DRAFT.md`)
- **Exhibit B — Refund Policy** (`refund-policy-DRAFT.md`)
- **Statement(s) of Work** (`sow-template-DRAFT.md`)

---

**Velonyx Systems LLC** — By: ______________________ Name: Carlos Glover Title: Founder Date: ________
**[CLIENT LEGAL NAME]** — By: ______________________ Name: ______________ Title: ______________ Date: ________
