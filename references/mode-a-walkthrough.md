# Mode A Walkthrough: Agent-Native MCP Conversation Loop

This document demonstrates a complete multi-turn agent conversation loop using **Mode A (Agent-Native)** execution. The agent uses Chrome DevTools MCP tools — no API key, no Playwright, no external script.

---

## Scenario

**Goal:** Navigate to a WordPress site's Elementor editor, drag a Heading widget into the first section, type "Welcome to Dr. Watts", and verify the heading is visible.

**Prerequisites:**
- Chrome is running with `--remote-debugging-port=9222`
- The user is logged into WP Admin in the remote browser
- The Antigravity agent has access to the `chrome-devtools-mcp` server

---

## Turn 1: Navigate to the Elementor Editor

**Agent reasoning:** The user wants to edit the homepage in Elementor. I need to navigate to the Elementor editor URL.

**MCP call:**
```
Tool:    navigate_page
Server:  chrome-devtools-mcp
Args:    { "type": "url", "url": "https://example.com/wp-admin/post.php?post=1&action=elementor" }
```

**Result:** Page begins loading the Elementor editor interface.

---

## Turn 2: Wait for the Editor to Load

**Agent reasoning:** Elementor takes several seconds to initialize. I should wait for a known UI element to appear before interacting.

**MCP call:**
```
Tool:    wait_for
Server:  chrome-devtools-mcp
Args:    { "text": ["Drag widget here", "Add New Section"], "timeout": 15000 }
```

**Result:** The text "Drag widget here" appeared on the page. Editor is ready.

---

## Turn 3: Take Accessibility Snapshot

**Agent reasoning:** I need to discover the element UIDs for the widget panel and the canvas drop zone.

**MCP call:**
```
Tool:    take_snapshot
Server:  chrome-devtools-mcp
Args:    { "verbose": true }
```

**Result (abbreviated):**
```
[role="navigation"] uid="nav-1" "Elementor Panel"
  [role="search"] uid="search-1" "Search Widget..."
  [role="listitem"] uid="widget-heading" "Heading"
  [role="listitem"] uid="widget-image" "Image"
  [role="listitem"] uid="widget-text" "Text Editor"
  [role="listitem"] uid="widget-button" "Button"
  ...
[role="main"] uid="canvas-1" "Elementor Canvas"
  [role="region"] uid="section-1" "Section"
    [role="region"] uid="column-1" "Column"
      [role="button"] uid="dropzone-1" "Drag widget here"
```

**Agent reasoning:** I can see `uid="widget-heading"` (the Heading widget in the sidebar) and `uid="dropzone-1"` (the canvas drop zone). These are my drag source and target.

---

## Turn 4: Drag the Heading Widget into the Canvas

**Agent reasoning:** I'll drag the Heading widget from the sidebar panel into the drop zone on the canvas.

**MCP call:**
```
Tool:    drag
Server:  chrome-devtools-mcp
Args:    { "from_uid": "widget-heading", "to_uid": "dropzone-1", "includeSnapshot": true }
```

**Result:** The drag action executed successfully. The response includes an updated snapshot showing the Heading widget is now inside the section:

```
[role="main"] uid="canvas-1" "Elementor Canvas"
  [role="region"] uid="section-1" "Section"
    [role="region"] uid="column-1" "Column"
      [role="heading"] uid="heading-1" "Add Your Heading Text Here"
```

**Agent reasoning:** The heading widget has been placed. Its default text is "Add Your Heading Text Here" and its UID is `heading-1`.

---

## Turn 5: Click the Heading to Select It

**Agent reasoning:** I need to click the heading element to put it in edit mode so I can change its text.

**MCP call:**
```
Tool:    click
Server:  chrome-devtools-mcp
Args:    { "uid": "heading-1", "includeSnapshot": true }
```

**Result:** The heading is now selected. The Elementor left panel has switched to the "Edit Heading" controls. The updated snapshot shows an active text input area.

---

## Turn 6: Clear Existing Text and Type New Heading

**Agent reasoning:** The heading currently says "Add Your Heading Text Here". I need to select all existing text and replace it.

**MCP call 1 — Select all text:**
```
Tool:    press_key
Server:  chrome-devtools-mcp
Args:    { "key": "Control+A" }
```

**MCP call 2 — Type the new heading:**
```
Tool:    type_text
Server:  chrome-devtools-mcp
Args:    { "text": "Welcome to Dr. Watts" }
```

**Result:** The heading text has been replaced with "Welcome to Dr. Watts".

---

## Turn 7: Verify the Change Visually

**Agent reasoning:** I should take a screenshot to confirm the heading renders correctly on the canvas with proper styling and spacing.

**MCP call:**
```
Tool:    take_screenshot
Server:  chrome-devtools-mcp
Args:    { "format": "png" }
```

**Result:** Screenshot captured. The agent's built-in vision model analyzes the image and confirms:
- ✅ The heading "Welcome to Dr. Watts" is visible in the first section
- ✅ The text is properly centered within the column
- ✅ No layout overflow or overlapping elements detected

---

## Turn 8: Final Snapshot Verification

**Agent reasoning:** I'll take one final accessibility snapshot to confirm the DOM state matches expectations.

**MCP call:**
```
Tool:    take_snapshot
Server:  chrome-devtools-mcp
Args:    {}
```

**Result (abbreviated):**
```
[role="main"] uid="canvas-1" "Elementor Canvas"
  [role="region"] uid="section-1" "Section"
    [role="region"] uid="column-1" "Column"
      [role="heading"] uid="heading-1" "Welcome to Dr. Watts"
```

**Agent response to user:**
> Done! I've dragged a Heading widget into the first section and set the text to "Welcome to Dr. Watts". The heading is properly placed and visible on the canvas. You can now click **Update** in Elementor to save the changes.

---

## Loop Summary

| Turn | Action | MCP Tool | Purpose |
|:---|:---|:---|:---|
| 1 | Navigate | `navigate_page` | Open the Elementor editor |
| 2 | Wait | `wait_for` | Wait for editor to finish loading |
| 3 | Discover | `take_snapshot` | Find widget and drop zone UIDs |
| 4 | Drag | `drag` | Place the Heading widget on canvas |
| 5 | Click | `click` | Select the heading for editing |
| 6 | Type | `press_key` + `type_text` | Replace default text |
| 7 | Verify (visual) | `take_screenshot` | Confirm visual layout |
| 8 | Verify (DOM) | `take_snapshot` | Confirm accessibility tree state |

---

## Key Principles Demonstrated

1. **Snapshot-First:** Every interaction starts with `take_snapshot` to get fresh UIDs.
2. **UID-Based Targeting:** Elements are addressed by semantic UID, not fragile pixel coordinates.
3. **Dual Verification:** Both visual (`take_screenshot`) and structural (`take_snapshot`) verification are used to confirm success.
4. **Progressive Execution:** Each turn performs exactly one logical action, verifies, then proceeds.
