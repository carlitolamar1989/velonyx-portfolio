# Data Processing Agreement / Service-Provider Addendum — DRAFT FOR ATTORNEY REVIEW

**Exhibit A to the Velonyx Master Services Agreement**
**Velonyx Systems LLC** · San Diego County, California · admin@velonyxsystems.com
**Draft date:** 2026-08-16 · **Status:** not in effect

This Data Processing Agreement ("DPA") forms part of the Master Services Agreement (or, for Customers without a signed MSA, the Terms of Service) between **Velonyx Systems LLC** ("Velonyx," "Processor," "Service Provider") and the customer named in that agreement ("Client," "Controller," "Business"). It applies whenever Velonyx processes Client Data to provide the Service.

---

## 1. Roles

1.1 **Client Data** means personal information of Client's customers, prospects, and staff processed through Client's Instance: names, phone numbers, email addresses, message content on all channels, voice-call audio (transient) and transcripts, appointment details, lead qualification answers, consent and opt-out records, and portal usage by Client's owners.

1.2 For Client Data, **Client is the controller** (GDPR) / **business** (CCPA) and **Velonyx is the processor / service provider.** Velonyx processes Client Data only on Client's documented instructions.

1.3 For Velonyx's own website visitors and Velonyx's own sales conversations, Velonyx is the controller; that processing is governed by Velonyx's Privacy Policy, not this DPA.

1.4 Client's customers may also interact with Client via Meta platforms (Instagram, Messenger, WhatsApp) and carriers; those platforms are independent controllers for their own processing under their own terms.

## 2. Processing instructions

2.1 **Instructions.** Client instructs Velonyx to process Client Data to: receive and answer inbound messages and calls with the AI assistant; transcribe calls; qualify leads; book and confirm appointments; send SMS/DM confirmations, reminders, follow-ups, and Client-initiated campaigns; display conversations in the portal; generate the monthly report; enforce opt-outs and spend limits; and maintain, secure, back up, and support the Instance. Additional instructions must be in writing (email suffices) and within the scope of the Service.

2.2 **Nature, purpose, duration:** automated and human-assisted processing to operate an AI front desk for Client's business, for the term of the subscription plus the 30-day transition period.

2.3 **Categories of data subjects:** Client's prospective and existing customers, callers, and messaging contacts; Client's owners and staff using the portal.

2.4 **Categories of data:** Section 1.1. **Prohibited categories:** the sensitive data listed in Section 9 — Client instructs Velonyx **not** to process them and will not knowingly submit them.

2.5 Velonyx will inform Client if, in its opinion, an instruction infringes applicable data-protection law, and may suspend that instruction until resolved.

2.6 **No AI training.** Velonyx does not use Client Data to train or fine-tune AI models, and configures its AI subprocessors so that they do not either. [Carlos: verify current subprocessor settings — Anthropic API defaults to no training; confirm Deepgram/ElevenLabs configuration.]

## 3. Subprocessors

3.1 Client authorizes the subprocessors below. Velonyx has (or will have before Go-Live) a written agreement with each imposing data-protection obligations no less protective than this DPA. [Carlos/LAWYER: confirm each vendor's DPA is accepted on the account — most are click-through; keep copies.]

| Subprocessor | Purpose | Data | Location |
|---|---|---|---|
| Anthropic, PBC | AI model that generates the assistant's replies | Message text, call transcripts, knowledge base | USA |
| Twilio Inc. | SMS delivery, voice calls, phone numbers | Phone numbers, message text, call audio/metadata | USA |
| Deepgram, Inc. | Speech-to-text for voice calls | Call audio (transient), transcripts | USA |
| ElevenLabs, Inc. | Text-to-speech for the AI voice | Reply text | USA |
| Meta Platforms, Inc. | Instagram DM, Facebook Messenger, WhatsApp delivery | Message text, sender IDs | USA / global |
| Google LLC | Google Calendar (booking); Google Analytics on Client's site if enabled | Appointment details, contact name/phone in events; site usage | USA / global |
| Supabase, Inc. | Database and authentication for the Instance | All Client Data at rest | USA [Carlos: confirm region of each project; offer EU region on request?] |
| Vercel Inc. | Application hosting and serverless functions | All Client Data in transit / processing | USA / global edge |
| Resend, Inc. | Transactional email (owner alerts, reports) | Owner email addresses, report content | USA |
| Stripe, Inc. | Payments (when live) — Client's payments to Velonyx only | Client's billing details (not end-customer data) | USA |
| Amazon Web Services, Inc. | Legacy chatbot backend and file storage (Velonyx marketing site; some legacy instances) | Message text, uploaded files | USA (us-east-1) |
| Fly.io | Voice relay server (real-time audio between Twilio and the speech services) | Call audio (transient), transcripts in flight | USA [Carlos: confirm region] |

3.2 **Changes.** Velonyx will give Client at least **15 days' notice** by email before adding or replacing a subprocessor that processes Client Data (the current list is also published at [URL to be created, e.g., velonyxsystems.com/subprocessors]). Client may object on reasonable data-protection grounds within that period; if the Parties cannot resolve the objection, Client may cancel the affected Service without penalty and receive a pro-rated refund of prepaid fees. [LAWYER: is 15 days sufficient / market? 30 is common.]

3.3 Velonyx remains responsible for its subprocessors' performance.

## 4. Security measures

Velonyx maintains, and will not materially reduce during the term, the following (as implemented in the Template as of this draft):

- **Isolation:** each Client has a dedicated Instance — separate deployment, separate database project, separate configuration; no shared multi-tenant database.
- **Access control in the database:** row-level security on every table holding Client Data; read/write limited to an explicit **owner allowlist** (`portal_owners`) — a valid login is not enough; the email must be allowlisted. Public sign-ups disabled on the Instance's auth. Server-side API routes use service credentials that never reach the browser.
- **Encryption:** TLS for all data in transit (browser, webhooks, subprocessor APIs); encryption at rest for the database and file storage.
- **Secrets:** all credentials in environment variables / secret store; never in code or repositories (verified by history scan); rotated at Transfer and on personnel change.
- **Webhook authenticity:** inbound Twilio and Meta webhooks are cryptographically signature-verified; requests with missing or invalid signatures are rejected in production. Scheduled-job endpoints require a secret and fail closed if it is missing; constant-time comparisons.
- **Abuse and spend limits:** per-Instance daily caps on AI usage and SMS with alert-and-pause; per-sender rate limits; outbound SMS restricted to valid North American numbers to prevent toll fraud via injected numbers [Carlos: update if you enable international destinations].
- **Logging hygiene:** hosted logs mask phone numbers and do not include message bodies.
- **Consent and opt-out:** STOP/HELP handled automatically; suppression list checked before every automated send; campaigns require a recorded consent attestation.
- **Personnel:** access to Client Data limited to Velonyx personnel who need it for support; bound by confidentiality.
- **Backups:** database provider point-in-time backups [Carlos: state actual retention, e.g., 7 days on Supabase Pro].
- **Testing:** internal security review of the Template (most recent 2026-08-15) with findings remediated; no third-party audit or certification (SOC 2 / ISO 27001) is held. [LAWYER: state this plainly so no representation is implied.]

## 5. Confidentiality and personnel

Velonyx ensures persons authorized to process Client Data are bound by confidentiality and receive appropriate instruction. Velonyx will not disclose Client Data to third parties other than subprocessors, or as required by law (with notice to Client where lawful).

## 6. Assistance to Client

6.1 **Data subject / consumer requests.** If Velonyx receives a request from Client's customer (access, deletion, correction, portability, opt-out), it will forward it to Client within 5 business days and not respond substantively except to direct the person to Client. On Client's request Velonyx will, within 10 business days, locate, export, correct, or delete the individual's Client Data across the Instance (conversations, leads, bookings, transcripts) and confirm in writing. Consent and opt-out records are retained as legally required evidence even after deletion.
6.2 **DPIAs and consultations.** Reasonable assistance, at Client's cost if material.
6.3 **Audits.** Once per year, on 30 days' notice, Velonyx will answer a reasonable written security questionnaire and provide relevant documentation (this DPA, the security measures, subprocessor DPAs). On-site audits only where required by law or a supervisory authority, at Client's cost. [LAWYER: right level for a one-person company?]

## 7. Personal-data breach

Velonyx will notify Client **without undue delay and no later than 72 hours** after becoming aware of a breach of security affecting Client Data, by email to Client's owner contacts, with what is known at the time (nature, categories and approximate numbers of individuals and records, likely consequences, measures taken and proposed), and will update as more is known. Velonyx will cooperate reasonably with Client's notifications to individuals and regulators. Notification is not an admission of fault. [LAWYER: also reference Cal. Civ. Code 1798.82 for Client's own notice duties.]

## 8. Deletion and return

8.1 **During the term:** deletion of specific individuals' data on Client's verified request under 6.1.
8.2 **On termination or expiry:** for **30 days** after the subscription ends, Client may export Client Data from the portal or receive it as CSV/JSON on request; if the month-12 Transfer applies, the entire database project is transferred to Client instead. After the 30 days Velonyx **deletes** Client Data and the Instance (including subprocessor-side data it controls, such as call recordings/transcripts, and by instructing subprocessors to delete where they retain copies), and confirms in writing on request. Exceptions: SMS consent/opt-out logs and billing records kept as legally required, and residual copies in backups until they age out (max [Carlos: retention]) — protected and not restored to production.
8.3 Retention during the term: conversation data is retained for the life of the subscription so the AI, follow-ups, and reports work; Client may set a shorter retention in writing [Carlos: is this configurable today? If not, delete].

## 9. Prohibited (sensitive) data

Client instructs Velonyx **not** to process, and will not knowingly submit through the Instance: protected health information (HIPAA); personal information of children under 16; payment-card numbers or financial account credentials; Social Security or government ID numbers; biometric identifiers; precise geolocation; or "sensitive personal information" (CPRA §1798.140(ae)) / special-category data (GDPR Art. 9). **Velonyx does not sign HIPAA Business Associate Agreements.** Client will configure the knowledge base and prompt so the AI redirects volunteered sensitive details rather than eliciting them, and will not use the Instance for these categories absent a **separate written agreement**. If Velonyx becomes aware such data has been submitted, it may delete it and will notify Client.

## 10. CCPA / CPRA — service-provider terms

To the extent the CCPA applies to Client Data, Velonyx: (a) will not **sell** or **share** (for cross-context behavioral advertising) Client Data; (b) will not retain, use, or disclose Client Data for any purpose other than the specific business purposes in Section 2 or as permitted by CCPA regulations, including not for Velonyx's commercial purposes or outside the direct business relationship; (c) will not combine Client Data with personal information from other sources except as permitted for service providers; (d) will comply with the CCPA and provide the same level of privacy protection; (e) grants Client the right to take reasonable steps to ensure Velonyx uses Client Data consistently with Client's obligations, and to stop and remediate unauthorized use; (f) will notify Client if it can no longer meet its CCPA obligations; (g) certifies it understands these restrictions. [LAWYER: conform to Cal. Code Regs. tit. 11 §7051 wording.]

## 11. International transfers (EU / UK / other)

11.1 Velonyx and its subprocessors process data in the United States. Where Client is established in the EEA, UK, or Switzerland (or Client Data is otherwise subject to those laws), the Parties will rely on: **[LAWYER: (a) EU Standard Contractual Clauses (Decision 2021/914) Module 2 (controller-to-processor), incorporated by reference with Annexes I–III completed from Sections 1–4 of this DPA; (b) the UK International Data Transfer Addendum; (c) Swiss FADP adjustments; and note the EU–US Data Privacy Framework only if Velonyx self-certifies — it currently does not.]** Onward transfers to subprocessors are covered by those subprocessors' own SCCs/DPF status [Carlos: Anthropic, Twilio, Google, Meta, Supabase, Vercel, Stripe, AWS publish transfer mechanisms; Deepgram, ElevenLabs, Resend, Fly.io — confirm].
11.2 Until this Section is completed by counsel, Velonyx does not represent that the Service meets GDPR/UK GDPR transfer requirements, and Client should not onboard EU/UK-resident customer data through the Instance. [LAWYER/Carlos: decide whether to sell to EU/UK controllers before this is done.]

## 12. Liability and precedence

Liability under this DPA is subject to the limitation of liability in the MSA / Terms [LAWYER: unless you decide on a separate data-protection cap]. In a conflict about the processing of Client Data, this DPA prevails over the MSA and Terms; the SCCs (once incorporated) prevail over this DPA.

## 13. Term

This DPA lasts as long as Velonyx processes Client Data, including the 30-day transition period, and Section 8 survives until deletion or transfer is complete.

---

**Contact for data-protection matters:** admin@velonyxsystems.com (Carlos Glover), (877) 317-8643. [LAWYER: is a designated DPO or EU/UK representative (GDPR Art. 27) required if EU/UK data is processed?]
