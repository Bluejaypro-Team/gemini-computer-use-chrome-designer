/**
 * Shared configuration constants and prompt templates.
 * This module has ZERO dependencies — it is the leaf node of the dependency graph.
 */

/** Default Chrome remote debugging endpoint */
export const CDP_ENDPOINT = 'http://localhost:9222';

/** Default Gemini model identifier */
export const MODEL_ID = 'gemini-2.5-flash-preview';

/** Maximum number of action steps before the agent loop exits */
export const MAX_STEPS = 15;

/** Delay (ms) between actions to let the DOM repaint */
export const REPAINT_DELAY_MS = 1000;

/**
 * Generates the system prompt sent to Gemini alongside each screenshot.
 * @param {string} goalPrompt - The user's design or audit objective.
 * @returns {string}
 */
export function buildSystemPrompt(goalPrompt) {
  return `You are an automated visual QA and site design agent driving a browser. 
Your goal is: "${goalPrompt}".
Based on this screenshot of the browser viewport, output the single next mouse or keyboard action.
Coordinate system is absolute pixels relative to the top-left of the viewport.

Output your response strictly as a JSON object, with no markdown tags or extra text:
{
  "action": "click" | "drag" | "type" | "wait" | "done",
  "x": number, // X coordinate for click, type, or start of drag
  "y": number, // Y coordinate for click, type, or start of drag
  "text": "string", // String to type (only if action is "type")
  "endX": number, // Destination X coordinate (only if action is "drag")
  "endY": number // Destination Y coordinate (only if action is "drag")
}`;
}
