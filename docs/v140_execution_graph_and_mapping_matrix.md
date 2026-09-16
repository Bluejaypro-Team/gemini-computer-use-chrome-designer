# Gemini Computer-Use Chrome Designer v1.4.0: Execution-Level Architecture & Forensic Error Mapping Matrix

**Skill**: `gemini-computer-use-chrome-designer`  
**Version**: `1.4.0`  
**Status**: `installed` (Cryptographically Verified)  
**Manifest SHA-256**: `96968afc25aeba40961ef1305846811f98e57287441df641ec8b165a4e672c94`  
**Author**: Bluejaypro Visual Automation Architect  
**Category**: Visual Builder Automation & CRO Design Studio  
**Date**: September 16, 2026  

---

## 1. Executive Architectural Foundation

The **Gemini Computer-Use Chrome Designer v1.4.0** framework provides a production-grade, deterministic visual builder automation pipeline for WordPress, Elementor, and modern web environments. The architecture transitions the AI agent from brittle, coordinate-based drag-and-drop actions to an authoritative **Dual-Node Separation of Concerns** backed by a **Zero Widget Injection Architecture**.

```
+---------------------------------------------------------------------------------------+
|                                CHROME RUNTIME LAYER                                    |
|  [--force-device-scale-factor=1] [--disable-dev-shm-usage] [--hide-scrollbars]        |
|  [CDP Emulation.setDeviceMetricsOverride: 1920x1080 @ 1.0 DPR]                        |
+-------------------------------------------+-------------------------------------------+
                                            |
                +---------------------------+---------------------------+
                |                                                       |
                v                                                       v
+-------------------------------+                       +-------------------------------+
|     NODE A: VISION CRITIC     |                       |    NODE B: DOM/CDP EXECUTOR   |
|   (Read-Only Visual Quality)  |                       |  (Deterministic State Engine) |
+-------------------------------+                       +-------------------------------+
| * Full-frame 1080p audit      |                       | * Iframe Context Isolation     |
| * Typography hierarchy check  |                       | * Container Pre-Audit ($e.run)|
| * WCAG 2.1 AA contrast audit  |                       | * In-Place Repeater Duplication|
| * Multi-viewport verification |                       | * Zero Raw HTML Validation    |
| * Overflow detection critic   |                       | * Verified Ajax Save Gate     |
+-------------------------------+                       +-------------------------------+
                |                                                       |
                +---------------------------> <-------------------------+
                                            |
                                            v
+---------------------------------------------------------------------------------------+
|                         3-CLUSTER SEQUENTIAL INTERCEPTION                             |
|  Cluster C: Pre-Flight Environment  ->  Cluster A: DOM & Structural Execution         |
|                                     ->  Cluster B: Responsive QA & State Persistence  |
+---------------------------------------------------------------------------------------+
```

### Core Invariant Principles
1. **Dual-Node Separation**:
   - **Node A (Vision Critic)**: Read-only visual observer. Captures high-fidelity 1080p canvas screenshots, analyzes visual balance, computes contrast ratios, and flags layout anomalies. Node A NEVER generates coordinate clicks or performs drag-and-drop actions.
   - **Node B (DOM/CDP Executor)**: Programmatic execution engine. Directly interfaces with Elementor's native JavaScript API (`window.$e.run`), executes container queries, triggers in-place repeater duplications, applies control settings, and validates server save responses.
2. **Zero Widget Injection Paradigm**:
   - The agent is strictly prohibited from dragging standalone widgets from the sidebar palette ($x < 300\text{px}$) onto repeating structured sections (e.g., accordions, services grids, testimonials, icon lists).
   - Repetitive structures MUST be created by pre-auditing the parent container and duplicating an existing child item in-place using `$e.run('document/repeater/duplicate')` or `.elementor-repeater-tool-duplicate`.
3. **Quadruple-DPI Lock**:
   - Guarantees exact 1:1 pixel coordinate parity between visual inspection models and the underlying rendering engine across cloud and local Linux/Windows runners.

---

## 2. The 3-Cluster Sequential Interception Pipeline

All builder operations are governed by a sequential, fail-safe pipeline divided into three architectural clusters:

```
[START] 
   |
   v
================================================================================
CLUSTER C: PRE-FLIGHT ENVIRONMENT & RUNTIME INITIALIZATION
================================================================================
   |--> Lock Browser Flags (--force-device-scale-factor=1, --disable-dev-shm-usage)
   |--> Send CDP Emulation.setDeviceMetricsOverride (1920x1080, dpr=1.0)
   |--> Assert Domain Boundary (target origin == current origin)
   |--> Isolate Iframe Context (iframe#elementor-preview-iframe vs top-level)
   v
================================================================================
CLUSTER A: DOM & STRUCTURAL EXECUTION (Zero-Widget Injection)
================================================================================
   |--> Pre-Audit Container Model (Flexbox Container vs Legacy Inner Section)
   |--> In-Place Repeater Duplication ($e.run('document/repeater/duplicate'))
   |--> Reject Raw HTML / <style> / <script> Injection
   |--> Apply Native Settings ($e.run('document/elements/settings'))
   v
================================================================================
CLUSTER B: RESPONSIVE VALIDATION & STATE PERSISTENCE VERIFICATION
================================================================================
   |--> Mobile Horizontal Overflow Gate (scrollWidth <= innerWidth @ 375px)
   |--> WCAG 2.1 AA Contrast Shielding Verification (>= 4.5:1 ratio)
   |--> Async Save Response Interception (admin-ajax.php 200 OK)
   |--> Post-Publish Full-Frame Frontend Telemetry Audit
   v
[VERIFIED SUCCESS]
```

---

## 3. The 10-Class Forensic Error Taxonomy & Interception Contract

The v1.4.0 engine establishes dedicated programmatic exception classes and runtime interception gates for the 10 failure modes identified in automated builder execution:

| Class | Severity | Error Name | Trigger Condition | Automated Remediation & Interception Gate |
| :--- | :--- | :--- | :--- | :--- |
| **Class 1** | **CRITICAL** | `RogueStandaloneWidgetError` | Agent attempts to insert a standalone widget into a structured repeating section rather than duplicating an existing child. | Pre-audit parent container model; invoke `$e.run('document/repeater/duplicate')` or `.elementor-repeater-tool-duplicate`. Purge rogue standalone element immediately if detected. |
| **Class 2** | **CRITICAL** | `RawHtmlInjectionError` | Agent attempts to insert custom `<style>`, `<script>`, or raw HTML code widgets. | Decompose requirements into native builder widgets (Heading, Text Editor, Button, Table, Accordion). Parse content payloads with strict regex rejecting `<style>`/`<script>`. |
| **Class 3** | **HIGH** | `CoordinateDriftError` | Chrome runs on displays with `devicePixelRatio != 1.0`, causing coordinate clicks to miss targets by 125%–200%. | Enforce Quadruple-DPI Lock: `--force-device-scale-factor=1`, `device_scale_factor=1.0`, and CDP `Emulation.setDeviceMetricsOverride`. |
| **Class 4** | **HIGH** | `CanvasIframeMismatchError` | Agent queries or dispatches actions to top-level `window.document` instead of `iframe#elementor-preview-iframe`. | Pre-flight frame resolution: automatically target preview iframe frame context for canvas elements and top-level for editor panels. |
| **Class 5** | **CRITICAL** | `DragPlacementFailureError` | Agent clicks sidebar palette ($x < 300\text{px}$) and attempts to drag a widget onto the canvas, dropping it into the wrong container or failing completely. | Prohibit palette dragging. Use Node B programmatic API commands (`$e.run`) and in-place component duplication. |
| **Class 6** | **MEDIUM** | `HorizontalOverflowError` | Content or nested container widths exceed viewport boundary at 375px mobile breakpoint (`scrollWidth > innerWidth`). | Query `document.documentElement.scrollWidth > window.innerWidth`; identify failing nodes via `getBoundingClientRect().right > innerWidth`; strip fixed pixel widths. |
| **Class 7** | **HIGH** | `SilentSaveFailureError` | Agent clicks the "Update"/"Publish" button but leaves before the async AJAX request completes, losing all canvas edits. | Intercept HTTP POST to `admin-ajax.php?action=elementor_ajax`; await `.elementor-button-state-success`; enforce 15,000ms timeout with retry. |
| **Class 8** | **HIGH** | `SharedMemoryExhaustionError` | Headless Chrome runs on containerized Linux VMs without `/dev/shm` partition enlargement, triggering `SIGBUS` crashes. | Pass `--disable-dev-shm-usage`, `--no-sandbox`, and `--disable-setuid-sandbox` on all cloud VM browser launches. |
| **Class 9** | **HIGH** | `ContrastDefectError` | Text placed over dark hero overlays or background images fails WCAG 2.1 AA contrast ratio (< 4.5:1 for body, < 3:1 for headings). | Enforce dark backdrop overlay (`rgba(15, 23, 42, 0.75)` to `0.88`); lock typography to pure white (`#FFFFFF`) with Gold accents (`#EAB308`). |
| **Class 10**| **MEDIUM** | `CrossDomainNavigationError`| Accidental click on an external link or unconstrained redirect navigates away from the target WordPress staging environment. | Assert `window.location.origin` equality before and after every navigation action. Reject navigation outside approved domain whitelist. |

---

## 4. Execution-Level Step-by-Step Graph & Implementation

### Step 1: Pre-Flight Launch & Environment Hard-Locking
- **Target**: Ensure deterministic rendering environment.
- **Actions**:
  - Launch Chromium with 8-flag Cloud Runner suite:
    `--force-device-scale-factor=1`, `--high-dpi-support=1`, `--disable-dev-shm-usage`, `--no-sandbox`, `--disable-setuid-sandbox`, `--window-size=1920,1080`, `--disable-gpu`, `--hide-scrollbars`.
  - Create browser context with `device_scale_factor=1.0`.
  - Dispatch CDP override: `Emulation.setDeviceMetricsOverride(width=1920, height=1080, deviceScaleFactor=1.0, mobile=False)`.
  - Navigate to target site and assert `window.location.origin` matches whitelist.
  - Resolve `iframe#elementor-preview-iframe` execution context.

### Step 2: Hero Section Scaffolding & Contrast Shielding
- **Target**: High-converting, WCAG-compliant hero section.
- **Actions**:
  - Query container engine (Flexbox Container vs Section).
  - Lock container to **1250px Signature Grid** (`max-width: 1250px; margin: 0 auto;`).
  - Height set to `80vh`.
  - Apply background image with **Mandatory Contrast Shielding**:
    `linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.88) 100%)`.
  - Heading: Montserrat 600, color `#FFFFFF` (Contrast Ratio $\ge 7.0:1$).
  - Button: Gold `#EAB308`, text `#0F172A`, 0.3s hover transition.

### Step 3: Core Sections Ingestion via In-Place Duplication
- **Target**: Services Grid, Testimonials, About, and Contact Form.
- **Actions**:
  - **About Section**: 2-column balanced container (50/50 split, 40px gap).
  - **Services Grid**:
    - Configure Item 1 as ground-truth template (Icon Box).
    - Duplicate Items 2 and 3 in-place using:
      ```javascript
      $e.run('document/repeater/duplicate', {
          container: parentContainer,
          name: 'items',
          index: 0
      });
      ```
    - Update copied instances in-place using Node B `modify_widget_text`:
      ```javascript
      const container = window.elementor.getContainer(widgetId);
      window.$e.run('document/elements/settings', {
          container: container,
          settings: { [field]: value }
      });
      ```
  - **Testimonials**: In-place duplication of slide items.
  - **Contact Form**: Native Form widget (Name, Email, Phone, Message).
  - **Footer**: Midnight Blue (`#0F172A`) with high-contrast slate links.

### Step 4: Declarative Design System & 80/50/35 Spacing Rhythm
- **Spacing Rhythm**:
  - Desktop ($\ge 1250\text{px}$): `80px` padding top & bottom.
  - Tablet ($768\text{px} - 1024\text{px}$): `50px` padding top & bottom.
  - Mobile ($< 768\text{px}$): `35px` padding top & bottom.
- **Typography Scale**: Montserrat (Headings, 600), Inter (Body, 400, line-height 1.6).
- **Zero Raw HTML**: Absolute rejection of `<style>` and `<script>` code widgets.

### Step 5: Multi-Viewport Responsive QA & Overflow Gate
- **Breakpoints**: 1920x1080 (Desktop), 768x1024 (Tablet), 375x812 (Mobile).
- **Overflow Detection Script**:
  ```javascript
  () => {
      const doc = document.documentElement;
      const hasOverflow = doc.scrollWidth > window.innerWidth;
      const offenders = hasOverflow ? 
          [...document.querySelectorAll('*')]
              .filter(el => el.getBoundingClientRect().right > window.innerWidth)
              .map(el => ({ tag: el.tagName, class: el.className, right: el.getBoundingClientRect().right }))
          : [];
      return { hasOverflow, offenders };
  }
  ```
- If `hasOverflow` is true, automatically strip fixed widths and reset margins before publishing.

### Step 6: State Persistence & Async Save Interception
- **Actions**:
  - Dispatch native save: `window.$e.run('document/save/publish')`.
  - Await HTTP 200 response from `wp-admin/admin-ajax.php?action=elementor_ajax`.
  - Verify `.elementor-button-state-success` class on publish button.
  - Timeout after 15,000ms to eliminate silent save loss.
  - Launch clean browser session and capture post-publish verification screenshot.

### Step 7: Telemetry & Architectural Reporting
- Produce verified structured checklist across all 10 Forensic Error Classes.
- Confirm 1250px Signature Grid compliance and 80/50/35 spacing rhythm.
- Attach desktop, tablet, and mobile screenshot paths.

---

## 5. Code Implementation Ground Truth (`chrome_designer_agent.py`)

The following production code snippet (lines 481–517) demonstrates Node B targeted modification and purge/repair duplication:

```python
    def purge_and_repair_repeater(self, parent_container_id, rogue_widget_id):
        """
        Purges rogue standalone widget and repairs layout via native in-place duplication.
        """
        print(f"[Detection & Purge] Purging rogue widget '{rogue_widget_id}'...")
        script = f"""
        () => {{
            const rogue = document.querySelector('[data-id="{rogue_widget_id}"]');
            if (rogue) {{
                rogue.remove();
                return {{ success: true, purged: '{rogue_widget_id}' }};
            }}
            return {{ success: false, error: 'Rogue widget not found in DOM' }};
        }}
        """
        purge_res = self.page.evaluate(script)
        print(f"[Detection & Purge] Purge result: {json.dumps(purge_res)}")
        
        repair_res = self.duplicate_repeater_item(parent_container_id, repeater_name="items", source_index=0)
        return {
            "purge": purge_res,
            "repaired_duplication": repair_res
        }

    def modify_widget_text(self, widget_id, field="editor", value=""):
        """
        Node B targeted text modification without coordinate clicking or widget dragging.
        """
        self.validate_content_payload(value)
        self.verify_selected_element(widget_id)
        
        print(f"[Node B Modify] Updating field '{field}' on widget '{widget_id}'...")
        script = f"""
        () => {{
            try {{
                const container = window.elementor.getContainer('{widget_id}');
                if (!container) return {{ success: false, error: 'Widget container not found' }};
                
                const settingsUpdate = {{}};
                settingsUpdate['{field}'] = {json.dumps(value)};
                
                window.$e.run('document/elements/settings', {{
                    container: container,
                    settings: settingsUpdate
                }});
                return {{ success: true, updated_field: '{field}' }};
            }} catch(e) {{
                return {{ success: false, error: String(e) }};
            }}
        }}
        """
        return self.page.evaluate(script)
```

---

## 6. The 8 Declarative ENFORCED Governance Rules (`manifest.json` v1.4.0)

1. **`html-injection-revocation`** (ENFORCED): Prohibits raw `<style>`, `<script>`, or code widgets. All elements must use native builder widgets.
2. **`nested-component-repeater-protocol`** (ENFORCED): Mandates parent container pre-audit and in-place duplication via `$e.run` rather than dropping standalone widgets.
3. **`color-contrast-accessibility-guardrail`** (ENFORCED): Requires text over dark overlays to use pure white (`#FFFFFF`) with Gold accents (`#EAB308`) and semi-transparent backdrop shielding.
4. **`quadruple-dpi-lock-invariance`** (ENFORCED): Locks device scale factor to 1.0 and viewports to 1920x1080 at browser arg, context, and CDP levels.
5. **`cloud-runner-shm-guardrail`** (ENFORCED): Enforces `--disable-dev-shm-usage`, `--no-sandbox`, and `--disable-setuid-sandbox` on all containerized Linux VM runs.
6. **`signature-grid-and-spacing-rhythm`** (ENFORCED): Mandates 1250px max-width container bounds and the 80/50/35 padding rhythm across all responsive breakpoints.
7. **`mobile-horizontal-overflow-gate`** (ENFORCED): Audits `scrollWidth <= innerWidth` at 375px and strips offending fixed pixel widths prior to publishing.
8. **`state-persistence-ajax-gate`** (ENFORCED): Intercepts `admin-ajax.php?action=elementor_ajax` 200 OK responses to eliminate silent save loss.

---
*End of Specification Document*
