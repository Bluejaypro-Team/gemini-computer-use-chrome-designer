/**
 * Agent Loop module.
 * Depends on: config.js (MAX_STEPS, REPAINT_DELAY_MS).
 * All behavior-producing dependencies (screenshot, decision, action) are INJECTED
 * via the deps object — no implicit coupling to other modules.
 */

import { MAX_STEPS, REPAINT_DELAY_MS } from './config.js';

/**
 * @typedef {Object} AgentDeps
 * @property {(page: import('playwright').Page) => Promise<string|null>} captureScreenshot
 * @property {(base64Screenshot: string, goalPrompt: string) => Promise<object|null>} getNextDecision
 * @property {(page: import('playwright').Page, decision: object) => Promise<boolean>} executeAction
 */

/**
 * Core step-by-step agent loop. Captures screenshots, queries the decision
 * engine for the next visual action, and executes it until the goal is
 * complete or the step budget is exhausted.
 *
 * All functional dependencies are injected via the `deps` parameter,
 * making this loop fully testable with mock implementations.
 *
 * @param {import('playwright').Page} page - Playwright page handle.
 * @param {string} goalPrompt - The design or audit instruction.
 * @param {AgentDeps} deps - Injected dependencies.
 * @param {number} [maxSteps=MAX_STEPS] - Override step budget.
 */
export async function runAgentLoop(page, goalPrompt, deps, maxSteps = MAX_STEPS) {
  const { captureScreenshot, getNextDecision, executeAction } = deps;

  for (let step = 1; step <= maxSteps; step++) {
    console.log(`\n--- Step ${step} ---`);

    // Capture current viewport state
    const screenshot = await captureScreenshot(page);
    if (!screenshot) break;

    // Query decision engine for the next action
    const decision = await getNextDecision(screenshot, goalPrompt);
    if (!decision) break;

    console.log(`Action chosen: "${decision.action}"`);

    // Handle "done" action
    if (decision.action === 'done') {
      console.log('Goal accomplished! Closing loop.');
      return;
    }

    // Execute the visual action on the remote browser
    const success = await executeAction(page, decision);
    if (!success) break;

    // Pause briefly to let the DOM paint the changes
    await page.waitForTimeout(REPAINT_DELAY_MS);
  }
}
