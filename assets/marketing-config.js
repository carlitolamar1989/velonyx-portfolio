/* Velonyx Marketing Pixels Config
 * ==================================================================
 * Meta Dataset (Pixel) ID for Velonyx Systems.
 * Created 2026-04-22 in Meta Events Manager under Business Portfolio
 * "Velonyx Systems" (business_id 2164967130917014).
 * The pixel only loads AFTER the visitor accepts cookies (see
 * assets/cookie-consent.js).
 * ==================================================================
 */
window.VELONYX_MARKETING = {
  META_PIXEL_ID: '1486954096175579'
};

/* Founders' Offer pop-up (assets/founders-popup.js). First 2 clients only:
 * Growth or Elite at 50% off months 1–6 + AI Video free. When both seats are
 * sold, set enabled:false (or seats:0) and the pop-up disappears everywhere. */
window.VELONYX_FOUNDERS = { enabled: true, seats: 2, delayMs: 2000 };

/* Velonyx Assistant Chatbot + Conversational Lead Form
 * ==================================================================
 * Endpoint set 2026-05-31 — points to the AWS Lambda multi-route handler:
 *   POST /chat        — chatbot Q&A
 *   POST /form-turn   — conversational lead form (derived as /form-turn)
 *
 * Both widgets (velonyx-chatbot.js + velonyx-lead-form.js) read this URL.
 * Lead-form widget swaps /chat → /form-turn at runtime.
 * ==================================================================
 */
window.VELONYX_CHATBOT_API_URL = 'https://v8yqczjbdd.execute-api.us-east-1.amazonaws.com/chat';
