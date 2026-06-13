import { chromium } from 'playwright';
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client. It reads the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

// ─── System Prompt Template ───────────────────────────────────────────────────
const SYSTEM_PROMPT = (goalPrompt) => `You are an automated visual QA and site design agent driving a browser. 
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

// ─── 1. Browser Connection ───────────────────────────────────────────────────

/**
 * Connects to a Chrome instance running with --remote-debugging-port=9222
 * and returns the first active page handle.
 * Exits the process if connection fails or no pages are available.
 * @returns {Promise<{browser: import('playwright').Browser, page: import('playwright').Page}>}
 */
async function connectToChrome() {
  let browser;
  try {
    browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('Connected to remote Chrome instance on port 9222.');
  } catch (error) {
    console.error('Failed to connect to Chrome. Ensure you launched Chrome with:');
    console.error('chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\\Users\\YourUsername\\ChromeRemoteProfile"');
    console.error('Error details:', error.message);
    process.exit(1);
  }

  const contexts = browser.contexts();
  if (contexts.length === 0) {
    console.error('No browser contexts found.');
    await browser.close();
    process.exit(1);
  }

  const pages = contexts[0].pages();
  if (pages.length === 0) {
    console.error('No active pages found in Chrome.');
    await browser.close();
    process.exit(1);
  }

  const page = pages[0]; // Interacts with the first active tab
  console.log(`Targeting active page: "${await page.title()}"`);

  return { browser, page };
}

// ─── 2. Screenshot Capture ───────────────────────────────────────────────────

/**
 * Captures a PNG screenshot of the page viewport and returns it as a base64
 * encoded string, or null on failure.
 * @param {import('playwright').Page} page
 * @returns {Promise<string|null>}
 */
async function captureScreenshot(page) {
  try {
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    return screenshotBuffer.toString('base64');
  } catch (error) {
    console.error('Failed to capture page screenshot:', error.message);
    return null;
  }
}

// ─── 3. Gemini Decision Engine ───────────────────────────────────────────────

/**
 * Strips markdown code-fence wrappers (```json ... ```) that Gemini
 * occasionally wraps around its JSON output.
 * @param {string} text
 * @returns {string}
 */
function stripCodeFences(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```json|```/g, '').trim();
  }
  return cleaned;
}

/**
 * Sends the current viewport screenshot to Gemini and returns the parsed
 * action decision object, or null on API or parse failure.
 * @param {string} base64Screenshot
 * @param {string} goalPrompt
 * @returns {Promise<{action: string, x?: number, y?: number, text?: string, endX?: number, endY?: number}|null>}
 */
async function getNextDecision(base64Screenshot, goalPrompt) {
  console.log('Sending screenshot to Gemini...');

  let response;
  try {
    response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: SYSTEM_PROMPT(goalPrompt) },
            { inlineData: { mimeType: "image/png", data: base64Screenshot } }
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
}

// ─── 4. Action Executor ──────────────────────────────────────────────────────

/**
 * Dispatches a Playwright mouse/keyboard action based on the decision object
 * returned by Gemini. Uses an action dictionary to eliminate nested if/else
 * branching.
 * @param {import('playwright').Page} page
 * @param {{action: string, x?: number, y?: number, text?: string, endX?: number, endY?: number}} decision
 * @returns {Promise<boolean>} true if the action executed successfully
 */
async function executeAction(page, decision) {
  const { action, x, y, text, endX, endY } = decision;

  const actionHandlers = {
    click: async () => {
      console.log(`Clicking at [x: ${x}, y: ${y}]`);
      await page.mouse.click(x, y);
    },
    drag: async () => {
      console.log(`Dragging from [x: ${x}, y: ${y}] to [x: ${endX}, y: ${endY}]`);
      await page.mouse.move(x, y);
      await page.mouse.down();
      // Move in multiple small steps to simulate natural drag-and-drop mechanics
      await page.mouse.move(endX, endY, { steps: 10 });
      await page.mouse.up();
    },
    type: async () => {
      console.log(`Clicking and typing "${text}" at [x: ${x}, y: ${y}]`);
      await page.mouse.click(x, y);
      await page.keyboard.type(text);
    },
    wait: async () => {
      console.log('Waiting 2 seconds...');
      await page.waitForTimeout(2000);
    }
  };

  const handler = actionHandlers[action];
  if (!handler) {
    console.error(`Unknown action type: "${action}"`);
    return false;
  }

  try {
    await handler();
    return true;
  } catch (error) {
    console.error(`Failed to execute action ${action}:`, error.message);
    return false;
  }
}

// ─── 5. Agent Loop ───────────────────────────────────────────────────────────

/**
 * Core step-by-step agent loop. Captures screenshots, queries Gemini for
 * the next visual action, and executes it until the goal is complete or the
 * step budget is exhausted.
 * @param {import('playwright').Page} page
 * @param {string} goalPrompt
 */
async function runAgentLoop(page, goalPrompt) {
  const MAX_STEPS = 15;

  for (let step = 1; step <= MAX_STEPS; step++) {
    console.log(`\n--- Step ${step} ---`);

    // Capture current viewport state
    const screenshot = await captureScreenshot(page);
    if (!screenshot) break;

    // Query Gemini for the next action
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
    await page.waitForTimeout(1000);
  }
}

// ─── Entrypoint ──────────────────────────────────────────────────────────────

/**
 * Runs a visual design agent step-by-step to achieve a design goal.
 * @param {string} goalPrompt - The design or audit instruction to execute.
 */
async function runVisualAgent(goalPrompt) {
  console.log(`Starting visual agent loop with goal: "${goalPrompt}"`);

  const { browser, page } = await connectToChrome();

  await runAgentLoop(page, goalPrompt);

  // Disconnect from the remote browser session
  await browser.close();
  console.log('\nSession completed.');
}

// Read target goal from CLI arguments or use default
const goal = process.argv.slice(2).join(' ') || 'Locate the main logo and click it';
runVisualAgent(goal);
