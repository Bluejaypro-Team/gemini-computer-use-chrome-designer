/**
 * Gemini Decision Engine module.
 * Depends on: config.js (buildSystemPrompt, MODEL_ID).
 * The AI client is INJECTED via factory — no module-level global capture.
 */

import { buildSystemPrompt, MODEL_ID } from './config.js';

/**
 * Strips markdown code-fence wrappers (```json ... ```) that Gemini
 * occasionally wraps around its JSON output.
 *
 * @param {string} text
 * @returns {string}
 */
export function stripCodeFences(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```json|```/g, '').trim();
  }
  return cleaned;
}

/**
 * Factory that creates a decision function bound to a specific AI client.
 * This is the dependency injection point — the caller provides the AI client,
 * breaking the circular dependency on module-level globals.
 *
 * @param {import('@google/genai').GoogleGenAI} aiClient - The initialized Gemini client.
 * @param {string} [modelId=MODEL_ID] - Override the model ID (useful for testing).
 * @returns {(base64Screenshot: string, goalPrompt: string) => Promise<object|null>}
 */
export function createDecisionEngine(aiClient, modelId = MODEL_ID) {
  /**
   * Sends the current viewport screenshot to Gemini and returns the parsed
   * action decision object, or null on API or parse failure.
   *
   * @param {string} base64Screenshot
   * @param {string} goalPrompt
   * @returns {Promise<{action: string, x?: number, y?: number, text?: string, endX?: number, endY?: number}|null>}
   */
  return async function getNextDecision(base64Screenshot, goalPrompt) {
    console.log('Sending screenshot to Gemini...');

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: modelId,
        contents: [
          {
            role: 'user',
            parts: [
              { text: buildSystemPrompt(goalPrompt) },
              { inlineData: { mimeType: 'image/png', data: base64Screenshot } }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('API request to Gemini failed:', error.message);
      return null;
    }

    // Clean and parse the response JSON
    const responseText = stripCodeFences(response.text);

    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse Gemini decision response. Raw output was:');
      console.log(responseText);
      return null;
    }
  };
}
