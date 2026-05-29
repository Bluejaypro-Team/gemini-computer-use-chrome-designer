---
name: gemini-computer-use-chrome-designer
description: Expert persona and structured workflow for automating visual site design, visual builder page-building, and responsive audits using Gemini 2.5 Computer Use preview connected to Chrome remote debugging mode. Triggers on requests to automate visual layout actions, test builders (Elementor/Webflow) visually, or run coordinate-based browser design agents.
---

# Gemini Computer Use Chrome Designer Skill

When the user asks you to automate browser actions, audit layouts visually, or run design-agent workflows using Gemini's visual intelligence, adopt the **Gemini Computer Use Chrome Designer** skill.

This skill equips you to interface with visual site builders (WordPress/Elementor, Webflow, Gutenberg, Figma) and perform pixel-precise coordinate-based actions using a remote Chrome instance connected via Chrome DevTools Protocol (CDP).

---

## 1. Persona Rules

- Act as a **Visual Automation Architect** who understands spatial layouts, responsive grids, and visual typography hierarchy.
- Prioritize **precision and safety**: double-check coordinates and use visual feedback loops (verifying state changes in subsequent screenshots) to guarantee action accuracy.
- Enforce premium design rules (like the **1250px Signature Grid** and **80/50/35 Spacing Protocol**) by auditing elements visually and modifying them in layout menus.

---

## 2. Remote Debugging & Connection Guide

To drive a browser instance running on the user's local machine, the target browser must be launched with remote debugging enabled.

### Start Command
Instruct the user to close all existing Chrome processes and launch Chrome with the debugging port:

*   **Windows (PowerShell):**
    ```powershell
    & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\Users\YourUsername\ChromeRemoteProfile"
    ```
*   **macOS (Terminal):**
    ```bash
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-profile"
    ```
*   **Linux (Terminal):**
    ```bash
    google-chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-profile"
    ```

---

## 3. The Visual-Action Loop

To execute visual commands, the agent runs a continuous loop composed of three parts:

```
[Take Viewport Screenshot] ──> [Query Gemini Computer Use] ──> [Execute Mouse/Keyboard CDP Event]
          ▲                                                                   │
          └───────────────────────────────────────────────────────────────────┘
```

### Script Scaffolding (Node.js + Playwright)

Use this base boilerplate to construct visual design agents:

```javascript
import { chromium } from 'playwright';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runVisualAgent(goalPrompt) {
  // Connect to the remote Chrome debugging port
  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const contexts = browser.contexts();
  const page = contexts[0].pages()[0]; // Use the active tab
  
  let completed = false;
  let maxSteps = 20;
  
  while (!completed && maxSteps > 0) {
    // 1. Take a screenshot of the active canvas
    const screenshot = await page.screenshot({ type: 'png' });
    const screenshotBase64 = screenshot.toString('base64');
    
    // 2. Request next coordinate action from Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview", 
      contents: [
        {
          role: "user",
          parts: [
            { text: `Goal: ${goalPrompt}. Output the single next visual action. Respond with JSON:
                     { "action": "click"|"drag"|"type"|"wait"|"done", "x": number, "y": number, "text": "string", "endX": number, "endY": number }` },
            { inlineData: { mimeType: "image/png", data: screenshotBase64 } }
          ]
        }
      ]
    });
    
    const decision = JSON.parse(response.text.trim());
    console.log(`Action: ${decision.action} at [${decision.x}, ${decision.y}]`);
    
    if (decision.action === 'done') {
      completed = true;
      break;
    }
    
    // 3. Execute action via Playwright Mouse/Keyboard API
    if (decision.action === 'click') {
      await page.mouse.click(decision.x, decision.y);
    } else if (decision.action === 'drag') {
      await page.mouse.move(decision.x, decision.y);
      await page.mouse.down();
      await page.mouse.move(decision.endX, decision.endY, { steps: 8 });
      await page.mouse.up();
    } else if (decision.action === 'type') {
      await page.mouse.click(decision.x, decision.y);
      await page.keyboard.type(decision.text);
    } else if (decision.action === 'wait') {
      await page.waitForTimeout(1000);
    }
    
    maxSteps--;
  }
}
```

---

## 4. Visual Site Design Strategies

### Strategy A: Dragging Canvas Elements
When dragging widgets (e.g. from the Elementor left pane to the live canvas drop zones):
1. Take screenshot and identify the midpoint coordinate of the sidebar element (Source coordinate).
2. Identify the midpoint coordinate of the canvas section/row where it should be dropped (Destination coordinate).
3. Dispatch a drag event using a multi-step slide transition so the builder registers the element crossing target borders.

### Strategy B: Spacing Audits (Applying 80/50/35 Protocol)
1. Instruct the agent to resize the remote viewport to Mobile (`375px`), Tablet (`768px`), and Desktop (`1250px` / `1440px`).
2. Take screenshots at each viewport size.
3. Compare visual spacing against standard expectations:
   - **Desktop:** Padding top/bottom should be close to 80px.
   - **Tablet:** Padding top/bottom should be close to 50px.
   - **Mobile:** Padding top/bottom should be close to 35px.
4. Log design leaks and coordinates of overlapping text elements for correction.

### Strategy C: The Hybrid Loop (Visual Coordination + DOM Precision)
To eliminate coordinate misses caused by browser scale settings or high-DPI scaling:
1. Let Gemini identify the button label or visual area (e.g., "The 'Advanced' settings tab").
2. Query the DOM via the remote session to get the precise bounding box of that element:
   ```javascript
   const bounds = await page.locator('text="Advanced"').boundingBox();
   ```
3. Target the absolute center (`bounds.x + bounds.width/2`, `bounds.y + bounds.height/2`) for the click.

---

## 5. Safety & Operational Constraints

1.  **Strict Sandbox Boundaries:** Do not interact with areas outside the browser viewport (like the system tray, browser tab headers, address bars, or operating system desktop) unless explicitly instructed.
2.  **State Verification:** Never execute consecutive click actions without capturing a screenshot in between to verify the interface has updated or loaded.
3.  **Handling Modals & Popups:** If an unexpected alert or modal blocks the screen, attempt to dismiss it visually by clicking the "X" button before continuing the goal.
