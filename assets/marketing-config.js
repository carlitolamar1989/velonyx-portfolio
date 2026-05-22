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

/* Velonyx Assistant Chatbot
 * ==================================================================
 * Set window.VELONYX_CHATBOT_API_URL to make the chatbot AI-powered.
 *
 * To deploy the Anthropic-backed Lambda, follow:
 *   backend/chatbot-lambda/README.md  (≈30 min: Anthropic API key →
 *   AWS Lambda → API Gateway → bash deploy.sh)
 *
 * Then uncomment the line below and replace <API_GATEWAY_ID> with the
 * invocation URL from API Gateway. Once that one line lights up, the
 * widget instantly switches from fallback (lead-capture-only) to full
 * AI mode with Q&A + redirect-button intents. No widget rebuild needed.
 * ==================================================================
 */
// window.VELONYX_CHATBOT_API_URL = 'https://<API_GATEWAY_ID>.execute-api.us-east-1.amazonaws.com/chat';
