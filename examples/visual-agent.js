import { chromium } from 'playwright';
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client. It reads the GEMINI_API_KEY environment variable.
const ai = new GoogleGenAI({});

/**
 * Runs a visual design agent step-by-step to achieve a design goal.
 * @param {string} goalPrompt - The design or audit instruction to execute.
 */
async function runVisualAgent(goalPrompt) {
  console.log(`Starting visual agent loop with goal: "${goalPrompt}"`);
  
  let browser;
  try {
    // 1. Connect to the existing Chrome instance running in remote debugging mode (port 9222)
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

  let completed = false;
  let maxSteps = 15;
  let step = 1;

  while (!completed && maxSteps > 0) {
    console.log(`\n--- Step ${step} ---`);
    
    // 2. Capture screenshot of the current page viewport
    let screenshotBuffer;
    try {
      screenshotBuffer = await page.screenshot({ type: 'png' });
    } catch (error) {
      console.error('Failed to capture page screenshot:', error.message);
      break;
    }
    const base64Screenshot = screenshotBuffer.toString('base64');

    // 3. Query Gemini for the next action based on the screenshot and visual layout
    console.log('Sending screenshot to Gemini...');
    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview", 
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are an automated visual QA and site design agent driving a browser. 
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
}`
              },
              {
                inlineData: {
                  mimeType: "image/png",
                  data: base64Screenshot
                }
              }
            ]
          }
        ]
      });
    } catch (error) {
      console.error('API request to Gemini failed:', error.message);
      break;
    }

    // Clean and parse the response JSON
    let responseText = response.text.trim();
    // Strip markdown code block wrappers if Gemini outputs them
    if (responseText.startsWith('```')) {
      responseText = responseText.replace(/```json|```/g, '').trim();
    }

    let decision;
    try {
      decision = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse Gemini decision response. Raw output was:');
      console.log(responseText);
      break;
    }

    console.log(`Action chosen: "${decision.action}"`);

    // 4. Handle "done" action
    if (decision.action === 'done') {
      console.log('Goal accomplished! Closing loop.');
      completed = true;
      break;
    }

    // 5. Execute action using Playwright Mouse and Keyboard API
    try {
      if (decision.action === 'click') {
        console.log(`Clicking at [x: ${decision.x}, y: ${decision.y}]`);
        await page.mouse.click(decision.x, decision.y);
      } else if (decision.action === 'drag') {
        console.log(`Dragging from [x: ${decision.x}, y: ${decision.y}] to [x: ${decision.endX}, y: ${decision.endY}]`);
        await page.mouse.move(decision.x, decision.y);
        await page.mouse.down();
        // Move in multiple small steps to simulate natural drag-and-drop mechanics
        await page.mouse.move(decision.endX, decision.endY, { steps: 10 });
        await page.mouse.up();
      } else if (decision.action === 'type') {
        console.log(`Clicking and typing "${decision.text}" at [x: ${decision.x}, y: ${decision.y}]`);
        await page.mouse.click(decision.x, decision.y);
        await page.keyboard.type(decision.text);
      } else if (decision.action === 'wait') {
        console.log('Waiting 2 seconds...');
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.error(`Failed to execute action ${decision.action}:`, error.message);
      break;
    }

    // Pause briefly to let the DOM paint the changes
    await page.waitForTimeout(1000);
    
    step++;
    maxSteps--;
  }

  // Disconnect from the remote browser session
  await browser.close();
  console.log('\nSession completed.');
}

// Read target goal from CLI arguments or use default
const goal = process.argv.slice(2).join(' ') || 'Locate the main logo and click it';
runVisualAgent(goal);
