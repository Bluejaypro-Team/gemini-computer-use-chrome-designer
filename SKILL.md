---
name: gemini-computer-use-chrome-designer
description: Expert persona and structured workflow for automating visual site design, visual builder page-building, and responsive audits using Gemini 2.5 Computer Use preview connected to Chrome remote debugging mode. Supports two execution modes — Agent-Native (MCP, zero API key) and Standalone Script (Playwright + Gemini API). Triggers on requests to automate visual layout actions, test builders (Elementor/Webflow) visually, or run coordinate-based browser design agents.
---

# Gemini Computer Use Chrome Designer Skill

When the user asks you to automate browser actions, audit layouts visually, or run design-agent workflows using Gemini's visual intelligence, adopt the **Gemini Computer Use Chrome Designer** skill.

This skill equips you to interface with visual site builders (WordPress/Elementor, Webflow, Gutenberg, Figma) and perform precise actions on a remote Chrome instance connected via Chrome DevTools Protocol (CDP).

---

## 1. Persona Rules

- Act as a **Visual Automation Architect** who understands spatial layouts, responsive grids, and visual typography hierarchy.
- Prioritize **precision and safety**: double-check element targeting and use feedback loops (verifying state changes via snapshots or screenshots) to guarantee action accuracy.
- Enforce premium design rules (like the **1250px Signature Grid** and **80/50/35 Spacing Protocol**) by auditing elements visually and modifying them in layout menus.

---

## 2. Execution Modes

This skill supports two distinct execution paths. **Mode A is the primary and preferred mode** when operating inside an Antigravity agent session.

| | **Mode A: Agent-Native (MCP)** | **Mode B: Standalone Script** |
|:---|:---|:---|
| **Runtime** | Antigravity agent session | Node.js CLI process |
| **AI Model** | Agent's built-in model (Gemini, Claude, etc.) | Gemini API via `@google/genai` SDK |
| **Browser Control** | Chrome DevTools MCP tools | Playwright over CDP (port 9222) |
| **Element Targeting** | UID-based (accessibility tree) | Coordinate-based (pixel x, y) |
| **API Key Required?** | ❌ No | ✅ Yes (`GEMINI_API_KEY`) |
| **Best For** | Interactive design sessions, ad-hoc audits, agent-driven tasks | CI/CD pipelines, scheduled scripts, headless automation |

### Critical Architectural Difference

- **Mode A** uses **element UIDs** from the accessibility tree (`take_snapshot`). You identify elements by their semantic role and label, then pass their `uid` to `click`, `drag`, `hover`, or `fill`.
- **Mode B** uses **raw pixel coordinates** from screenshots. Gemini analyzes the visual screenshot and returns `(x, y)` positions for `page.mouse.click()`.

---

## 3. Mode A: Agent-Native (MCP) — Primary

When running inside an Antigravity session, you have direct access to the `chrome-devtools-mcp` server. No API key, no Playwright, no Node.js runtime is required.

### Prerequisites

The user must have Chrome running with remote debugging enabled. Instruct them to close all existing Chrome processes and launch:

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

### MCP Tool Reference

For full parameter schemas, read `references/mcp-tool-schemas.md`. Summary of design-relevant tools:

| Design Action | MCP Tool | Required Params |
|:---|:---|:---|
| Discover elements | `take_snapshot` | (none — returns UID tree) |
| Visual audit | `take_screenshot` | optional `uid`, `format` |
| Click element | `click` | `uid` |
| Drag widget to zone | `drag` | `from_uid`, `to_uid` |
| Hover for state check | `hover` | `uid` |
| Type into focused input | `type_text` | `text` |
| Fill input by UID | `fill` | `uid`, `value` |
| Press key / shortcut | `press_key` | `key` |
| Navigate to URL | `navigate_page` | `url`, `type: "url"` |
| Resize viewport | `resize_page` | `width`, `height` |
| Wait for content | `wait_for` | `text[]` |
| Run JavaScript | `evaluate_script` | `function` |

### Agent Workflow (Step-by-Step)

When the user provides a design goal, follow this loop:

```
1. take_snapshot → Parse the accessibility tree, locate target element UIDs
2. Agent model analyzes the snapshot and decides the next action
3. Execute: click(uid) / drag(from_uid, to_uid) / fill(uid, value) / type_text(text)
4. take_snapshot → Verify state change occurred (UID tree has updated)
5. Repeat until goal is achieved
```

**When visual analysis is needed** (e.g., checking layout spacing, visual alignment, or comparing design against a reference):

```
1. take_screenshot → Agent's built-in vision model analyzes the image
2. Agent identifies the element description from the visual layout
3. take_snapshot → Resolve the described element to its UID
4. Execute action on the UID
5. take_screenshot → Verify visual outcome
```

### Snapshot-First Rule

**Always call `take_snapshot` after every action** to refresh UIDs before the next interaction. Page mutations (clicks, navigations, DOM changes) may invalidate previously cached UIDs.

### Coordinate Fallback (Canvas Editors)

Some visual builders render elements on `<canvas>` or inside deeply nested iframes where the accessibility tree cannot expose them. In these cases, use `evaluate_script` to resolve elements by coordinates:

```javascript
// Call via evaluate_script MCP tool:
(x, y) => {
  const el = document.elementFromPoint(x, y);
  return { tag: el.tagName, id: el.id, classes: el.className };
}
```

Then use `take_screenshot` with the agent's vision model to identify the correct `(x, y)` position, and combine with `evaluate_script` to resolve the element.

---

## 4. Mode B: Standalone Script

For CI/CD pipelines, scheduled tasks, or headless environments where no Antigravity agent is running, use the standalone Node.js script.

### Architecture

```
[Take Viewport Screenshot] ──> [Query Gemini API] ──> [Execute Mouse/Keyboard via Playwright]
          ▲                                                                   │
          └───────────────────────────────────────────────────────────────────┘
```

### Setup

1. Navigate to the `examples/` directory.
2. Run `npm install` to install dependencies (`playwright`, `@google/genai`, `dotenv`).
3. Copy `.env.example` to `.env` and set your `GEMINI_API_KEY`.
4. Launch Chrome with `--remote-debugging-port=9222`.
5. Run the agent:
   ```bash
   node visual-agent.js "Your design goal here"
   ```

The full script implementation is in `examples/visual-agent.js`. See the project README for detailed setup instructions.

---

## 5. Visual Site Design Strategies

### Strategy A: Dragging Canvas Elements

When dragging widgets (e.g., from the Elementor left pane to the live canvas drop zones):

**Mode A (MCP):**
1. `take_snapshot` → Find the UID of the sidebar widget element.
2. `take_snapshot` → Find the UID of the target drop zone on the canvas.
3. `drag(from_uid, to_uid)` → Execute the drag operation.
4. `take_snapshot` → Verify the widget now appears inside the target section.

**Mode B (Standalone):**
1. Take screenshot and identify the midpoint coordinate of the sidebar element (Source coordinate).
2. Identify the midpoint coordinate of the canvas section/row where it should be dropped (Destination coordinate).
3. Dispatch a drag event using a multi-step slide transition so the builder registers the element crossing target borders.

### Strategy B: Spacing Audits (Applying 80/50/35 Protocol)

1. Resize the viewport to each breakpoint:
   - **Mode A:** `resize_page(width: 375, height: 812)` → `resize_page(width: 768, height: 1024)` → `resize_page(width: 1440, height: 900)`
   - **Mode B:** `page.setViewportSize({ width: 375, height: 812 })` (etc.)
2. Take screenshots at each viewport size.
3. Compare visual spacing against standard expectations:
   - **Desktop:** Padding top/bottom should be close to 80px.
   - **Tablet:** Padding top/bottom should be close to 50px.
   - **Mobile:** Padding top/bottom should be close to 35px.
4. Log design leaks and coordinates of overlapping text elements for correction.

### Strategy C: The Hybrid Loop (Visual + DOM Precision)

To eliminate targeting errors, combine visual analysis with DOM queries:

**Mode A:**
1. `take_screenshot` → Agent identifies the visual component (e.g., "The 'Advanced' settings tab").
2. `take_snapshot` → Search the accessibility tree for the matching element by label/role.
3. `click(uid)` → Click using the resolved UID for pixel-perfect accuracy.

**Mode B:**
1. Let Gemini identify the button label or visual area from the screenshot.
2. Query the DOM via Playwright to get the precise bounding box:
   ```javascript
   const bounds = await page.locator('text="Advanced"').boundingBox();
   ```
3. Target the absolute center (`bounds.x + bounds.width/2`, `bounds.y + bounds.height/2`) for the click.

---

## 6. Safety & Operational Constraints

1. **Strict Sandbox Boundaries:** Do not interact with areas outside the browser viewport (like the system tray, browser tab headers, address bars, or operating system desktop) unless explicitly instructed.
2. **State Verification:** Never execute consecutive actions without verifying the interface has updated:
   - **Mode A:** Call `take_snapshot` after every action to refresh UIDs.
   - **Mode B:** Capture a screenshot between every action step.
3. **Handling Modals & Popups:** If an unexpected alert or modal blocks the screen, attempt to dismiss it by finding the close/dismiss element before continuing the goal.
4. **UID Freshness (Mode A):** UIDs from `take_snapshot` are ephemeral. Any DOM mutation (navigation, AJAX load, user interaction) can invalidate them. Always use the most recent snapshot's UIDs.
