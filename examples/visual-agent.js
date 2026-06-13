/**
 * visual-agent.js — Composition Root (Entrypoint)
 *
 * This file is the ONLY place where dependencies are wired together.
 * It imports all modules, constructs the dependency graph, and runs the agent.
 *
 * Dependency Graph (acyclic):
 *
 *   config.js          (leaf — zero imports)
 *      ↑
 *   browser.js         (imports config.js for CDP_ENDPOINT)
 *   decision.js        (imports config.js for buildSystemPrompt, MODEL_ID)
 *   actions.js          (leaf — zero imports)
 *      ↑
 *   agent-loop.js      (imports config.js for MAX_STEPS, REPAINT_DELAY_MS)
 *      ↑
 *   visual-agent.js    (composition root — wires everything, runs the loop)
 */

import 'dotenv/config'; // Must be line 1 to load .env before any other module reads process.env

import { GoogleGenAI } from '@google/genai';
import { connectToChrome, captureScreenshot } from './lib/browser.js';
import { createDecisionEngine } from './lib/decision.js';
import { executeAction } from './lib/actions.js';
import { runAgentLoop } from './lib/agent-loop.js';

// ─── Construct Dependencies ──────────────────────────────────────────────────

// 1. Initialize the Gemini API client (reads GEMINI_API_KEY from environment)
const ai = new GoogleGenAI({});

// 2. Create the decision engine with the injected AI client
const getNextDecision = createDecisionEngine(ai);

// 3. Bundle all dependencies for the agent loop
const agentDeps = {
  captureScreenshot,
  getNextDecision,
  executeAction
};

// ─── Entrypoint ──────────────────────────────────────────────────────────────

/**
 * Runs a visual design agent step-by-step to achieve a design goal.
 * @param {string} goalPrompt - The design or audit instruction to execute.
 */
async function runVisualAgent(goalPrompt) {
  console.log(`Starting visual agent loop with goal: "${goalPrompt}"`);

  const { browser, page } = await connectToChrome();

  await runAgentLoop(page, goalPrompt, agentDeps);

  // Disconnect from the remote browser session
  await browser.close();
  console.log('\nSession completed.');
}

// Read target goal from CLI arguments or use default
const goal = process.argv.slice(2).join(' ') || 'Locate the main logo and click it';
runVisualAgent(goal);
