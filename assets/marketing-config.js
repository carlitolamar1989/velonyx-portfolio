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
