# Chrome DevTools MCP Tool Reference

This document contains the full parameter schemas for all design-relevant Chrome DevTools MCP tools used by the **gemini-computer-use-chrome-designer** skill in **Mode A (Agent-Native)**.

> **Key Concept:** Most interaction tools (`click`, `drag`, `hover`, `fill`) require a **`uid`** — a unique element identifier obtained from the accessibility tree via `take_snapshot`. Always call `take_snapshot` first to get current UIDs before interacting with elements.

---

## take_snapshot

**Purpose:** Capture the accessibility tree of the current page. Returns a structured list of all page elements with unique `uid` identifiers. This is the **primary discovery tool** — use it to find element UIDs before calling `click`, `drag`, `hover`, or `fill`.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `verbose` | boolean | No | Include all available a11y tree information. Default: `false`. |
| `filePath` | string | No | Save snapshot to file instead of returning inline. |

**Usage Notes:**
- Prefer `take_snapshot` over `take_screenshot` for element discovery.
- The snapshot indicates which element is currently selected in the DevTools Elements panel.
- Always use the **latest** snapshot — UIDs may change after page mutations.

---

## take_screenshot

**Purpose:** Capture a visual PNG/JPEG/WebP image of the page or a specific element. Use for visual layout analysis, spacing audits, and design verification.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `uid` | string | No | Screenshot a specific element by UID. Omit for full page. |
| `fullPage` | boolean | No | Capture full scrollable page (incompatible with `uid`). |
| `format` | string | No | `"png"` (default), `"jpeg"`, or `"webp"`. |
| `quality` | number | No | Compression quality 0–100 (JPEG/WebP only). |
| `filePath` | string | No | Save screenshot to file instead of returning inline. |

---

## click

**Purpose:** Click on a page element identified by its UID from the accessibility snapshot.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `uid` | string | **Yes** | The UID of the target element from `take_snapshot`. |
| `dblClick` | boolean | No | Set `true` for double-click. Default: `false`. |
| `includeSnapshot` | boolean | No | Return updated snapshot after click. Default: `false`. |

---

## drag

**Purpose:** Drag one element onto another element. Both source and destination are identified by UID.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `from_uid` | string | **Yes** | UID of the element to drag. |
| `to_uid` | string | **Yes** | UID of the target drop zone element. |
| `includeSnapshot` | boolean | No | Return updated snapshot after drag. Default: `false`. |

---

## hover

**Purpose:** Hover the mouse pointer over a page element. Use for testing hover states, tooltips, and dropdown triggers.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `uid` | string | **Yes** | The UID of the target element from `take_snapshot`. |
| `includeSnapshot` | boolean | No | Return updated snapshot after hover. Default: `false`. |

---

## type_text

**Purpose:** Type text using the keyboard into the currently focused input element. Focus must be established first (e.g., via `click`).

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `text` | string | **Yes** | The text string to type. |
| `submitKey` | string | No | Optional key to press after typing (e.g., `"Enter"`, `"Tab"`). |

---

## fill

**Purpose:** Fill a value into an input, textarea, select, checkbox, or radio button element.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `uid` | string | **Yes** | UID of the input element. |
| `value` | string | **Yes** | Value to fill. Use `"true"`/`"false"` for checkboxes/toggles. |
| `includeSnapshot` | boolean | No | Return updated snapshot after fill. Default: `false`. |

---

## press_key

**Purpose:** Press a key or key combination. Use for keyboard shortcuts, navigation keys, or special key combos.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `key` | string | **Yes** | Key or combo (e.g., `"Enter"`, `"Control+A"`, `"Control+Shift+R"`). |
| `includeSnapshot` | boolean | No | Return updated snapshot after key press. Default: `false`. |

---

## navigate_page

**Purpose:** Navigate to a URL, or go back/forward/reload in browser history.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `type` | string | No | `"url"`, `"back"`, `"forward"`, or `"reload"`. |
| `url` | string | No | Target URL (only when `type` is `"url"`). |
| `timeout` | integer | No | Max wait time in ms. `0` uses default. |
| `ignoreCache` | boolean | No | Ignore cache on reload. |
| `initScript` | string | No | JavaScript to execute before page scripts on next navigation. |

---

## resize_page

**Purpose:** Resize the browser viewport to specific dimensions. Essential for responsive design audits.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `width` | number | **Yes** | Target page width in pixels. |
| `height` | number | **Yes** | Target page height in pixels. |

**Common Breakpoints:**
- Mobile: `375 × 812`
- Tablet: `768 × 1024`
- Desktop: `1440 × 900`

---

## wait_for

**Purpose:** Wait for specified text to appear on the page. Resolves when any of the provided text values appears.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `text` | string[] | **Yes** | Array of text strings. Resolves when any value appears. |
| `timeout` | integer | No | Max wait time in ms. `0` uses default. |

---

## evaluate_script

**Purpose:** Execute a JavaScript function inside the current page. Returns JSON-serializable results. Useful for DOM queries, computed style inspection, and coordinate fallbacks.

| Parameter | Type | Required | Description |
|:---|:---|:---|:---|
| `function` | string | **Yes** | JavaScript function declaration (e.g., `() => document.title`). |
| `args` | string[] | No | Element UIDs to pass as arguments to the function. |
| `filePath` | string | No | Save output to file instead of returning inline. |
| `dialogAction` | string | No | Handle dialogs: `"accept"`, `"dismiss"`, or prompt response. |

**Coordinate Fallback Example:**
```javascript
// When a11y tree doesn't expose a canvas element, find it by coordinates:
(x, y) => {
  const el = document.elementFromPoint(x, y);
  return { tag: el.tagName, id: el.id, classes: el.className };
}
```
