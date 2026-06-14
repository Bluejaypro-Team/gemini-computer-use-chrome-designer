# Visual Elementor Design — Prompting Guide

Complete prompt reference for designing WordPress/Elementor pages using **Mode A (Agent-Native)** — direct browser interaction via Chrome DevTools MCP, zero code injection.

---

## Prerequisites Checklist

Before using any prompt below, ensure:

- [ ] Chrome is running with remote debugging:
  ```powershell
  & "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\Users\pczoon\ChromeRemoteProfile"
  ```
- [ ] You are logged into WP Admin in that browser window
- [ ] The target page is open (either in WP Admin dashboard or already in Elementor editor)

---

## Prompt Anatomy

Every effective prompt contains 3 layers:

```
[TARGET]     →  Where to work (URL, page name, section)
[ACTION]     →  What to build/change/audit
[STANDARDS]  →  Design constraints (colors, spacing, fonts, responsive rules)
```

**Example:**
```
Navigate to {site_url}/wp-admin,                          ← TARGET
open the homepage in Elementor and add a Hero section      ← ACTION
with 80px top/bottom padding and Inter font at 48px.       ← STANDARDS
```

---

## Prompt Templates

### 1. Full Page Build (From Scratch)

> Navigate to `{site_url}/wp-admin`, open the page titled **"{page_title}"** in Elementor, and build a complete landing page with the following sections in order:
>
> 1. **Hero Section** — Heading: `{hero_heading}`, Subheading: `{hero_subheading}`, CTA Button text: `{cta_text}`, CTA color: `{cta_color}`
> 2. **Trust Bar** — Display these trust items in a row: `{trust_item_1}`, `{trust_item_2}`, `{trust_item_3}`, `{trust_item_4}`
> 3. **Services Grid** — 3-column grid with these services: `{service_1}`, `{service_2}`, `{service_3}`. Each card gets an icon, title, and one-sentence description.
> 4. **Testimonial** — Quote: `{testimonial_quote}`, Attribution: `{testimonial_name}`, `{testimonial_title}`
> 5. **CTA Footer** — Heading: `{footer_cta_heading}`, Button: `{footer_cta_text}`, Phone: `{phone_number}`
>
> **Design Rules:** Use `{primary_color}` as the primary accent, `{font_family}` font throughout, 80px desktop / 50px tablet / 35px mobile section padding. All sections use 1250px max-width centered containers. Click **Update** when finished.

**Placeholder Reference:**

| Placeholder | Example Value |
|:---|:---|
| `{site_url}` | `https://drwattselectric.com` |
| `{page_title}` | `Home` |
| `{hero_heading}` | `Expert Electrical Services in Sacramento` |
| `{hero_subheading}` | `Licensed, Insured, and Available 24/7` |
| `{cta_text}` | `Get a Free Quote` |
| `{cta_color}` | `#D4AF37` (gold) |
| `{trust_item_1}` | `Licensed & Insured` |
| `{trust_item_2}` | `24/7 Emergency Service` |
| `{trust_item_3}` | `5-Star Google Reviews` |
| `{trust_item_4}` | `Free Estimates` |
| `{service_1}` | `Panel Upgrades` |
| `{service_2}` | `EV Charger Installation` |
| `{service_3}` | `Whole-Home Rewiring` |
| `{testimonial_quote}` | `Dr. Watts saved us during a power emergency...` |
| `{testimonial_name}` | `Sarah M.` |
| `{testimonial_title}` | `Sacramento Homeowner` |
| `{footer_cta_heading}` | `Ready to Get Started?` |
| `{footer_cta_text}` | `Call Now` |
| `{phone_number}` | `(916) 555-0199` |
| `{primary_color}` | `#D4AF37` |
| `{font_family}` | `Inter` |

---

### 2. Add a Single Section

> Open the Elementor editor for **"{page_title}"** on `{site_url}`. Scroll to the `{insert_position}` of the page and add a new **{section_type}** section with:
>
> - Heading: `{section_heading}`
> - Body text: `{section_body}`
> - Background color: `{bg_color}`
> - Padding: 80px top/bottom desktop, 50px tablet, 35px mobile
>
> Click **Update** when done.

| Placeholder | Example Value |
|:---|:---|
| `{insert_position}` | `bottom` / `below the Hero` / `above the footer` |
| `{section_type}` | `How It Works` / `FAQ` / `Service Grid` / `Testimonial Carousel` |
| `{section_heading}` | `How Our Process Works` |
| `{section_body}` | `Step 1: Schedule a consultation...` |
| `{bg_color}` | `#1A1A2E` (dark navy) |

---

### 3. Edit Existing Text Content

> Open `{site_url}` in Elementor. Find the section with the heading **"{existing_heading}"** and replace:
>
> - Heading → `{new_heading}`
> - Subheading → `{new_subheading}`
> - Button text → `{new_button_text}`
> - Button link → `{new_button_url}`
>
> Do not change any styling, spacing, or layout. Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{existing_heading}` | `Welcome to Our Company` |
| `{new_heading}` | `Sacramento's #1 Electrical Contractor` |
| `{new_subheading}` | `Serving the Greater Sacramento Area Since 2005` |
| `{new_button_text}` | `Book Online` |
| `{new_button_url}` | `https://drwattselectric.com/book` |

---

### 4. Change Colors & Typography

> Open the Elementor editor for the **"{page_title}"** page on `{site_url}`. Update the global design tokens:
>
> - Primary color → `{new_primary}`
> - Secondary color → `{new_secondary}`
> - Body font → `{new_body_font}` at `{body_size}`
> - Heading font → `{new_heading_font}` at `{heading_size}`
> - Button style → `{button_bg}` background, `{button_text_color}` text, `{button_radius}` border radius
>
> Apply these across ALL sections on the page. Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{new_primary}` | `#D4AF37` |
| `{new_secondary}` | `#1A1A2E` |
| `{new_body_font}` | `Inter` |
| `{body_size}` | `16px` |
| `{new_heading_font}` | `Outfit` |
| `{heading_size}` | `42px` |
| `{button_bg}` | `#D4AF37` |
| `{button_text_color}` | `#FFFFFF` |
| `{button_radius}` | `8px` |

---

### 5. Responsive Design Adjustment

> Open `{site_url}` in Elementor. Switch to **{breakpoint}** view and audit the entire page for:
>
> - Headings that overflow or wrap awkwardly → reduce font size to `{mobile_heading_size}`
> - Section padding → set to `{mobile_padding}` top/bottom
> - Column stacking → ensure `{stack_behavior}`
> - CTA buttons → make full width
> - Images → ensure they scale down without cropping
>
> Take a screenshot at each breakpoint when done. Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{breakpoint}` | `Mobile (375px)` / `Tablet (768px)` |
| `{mobile_heading_size}` | `28px` |
| `{mobile_padding}` | `35px` |
| `{stack_behavior}` | `single column vertical stack` |

---

### 6. Spacing & Alignment Audit

> Open `{site_url}` in Elementor. Audit every section on the page for the **80/50/35 Spacing Protocol**:
>
> - Desktop: `80px` top/bottom padding per section
> - Tablet: `50px` top/bottom padding
> - Mobile: `35px` top/bottom padding
>
> Fix any section that does not comply. Also verify:
> - All sections use `{max_width}` centered inner containers
> - No horizontal overflow at any breakpoint
> - Consistent vertical rhythm between sections
>
> Take screenshots at 1440px, 768px, and 375px when finished. Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{max_width}` | `1250px` |

---

### 7. Widget Drag-and-Drop

> Open `{site_url}` in Elementor. In the **{target_section}** section:
>
> 1. Drag a **{widget_type}** widget from the left panel into `{drop_position}`
> 2. Configure it with: `{widget_config}`
> 3. Style it with: `{widget_style}`
>
> Click **Update** when done.

| Placeholder | Example Value |
|:---|:---|
| `{target_section}` | `Hero section` / `second row` / `below the heading` |
| `{widget_type}` | `Button` / `Image` / `Icon Box` / `Star Rating` / `Google Maps` |
| `{drop_position}` | `the right column` / `below the subheading` / `above the CTA` |
| `{widget_config}` | `Button text: "Call Now", Link: tel:9165550199` |
| `{widget_style}` | `Gold background (#D4AF37), white text, 8px radius, 16px font` |

---

### 8. Visual QA Audit (No Changes)

> Navigate to `{site_url}`. **Do NOT open Elementor.** View the live frontend page and take screenshots at these viewports:
>
> - Desktop: `1440 × 900`
> - Tablet: `768 × 1024`
> - Mobile: `375 × 812`
>
> For each viewport, report:
> - Any text overflow or clipping
> - Any images that don't scale properly
> - Any buttons that are too small to tap (< 44px)
> - Any horizontal scroll (overflow)
> - Any inconsistent section spacing
>
> Output a structured audit table with findings.

*(No placeholders needed — this is a read-only audit)*

---

### 9. Clone & Customize a Section

> Open `{site_url}` in Elementor. Find the **{source_section}** section, right-click it, and **Duplicate** it. In the new copy:
>
> - Change heading to: `{new_section_heading}`
> - Change body text to: `{new_section_body}`
> - Change background color to: `{new_section_bg}`
> - Move it to: `{new_position}`
>
> Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{source_section}` | `Services Grid` |
| `{new_section_heading}` | `Residential Specialties` |
| `{new_section_body}` | `From kitchen remodels to outdoor lighting...` |
| `{new_section_bg}` | `#F5F5F5` |
| `{new_position}` | `below the original Services Grid` |

---

### 10. Navigation & Footer Editing

> Open `{site_url}` in Elementor (edit the **{template_type}** template). Update the following:
>
> - Logo: click the existing logo and replace with `{new_logo_url}`
> - Menu items: `{menu_items}`
> - Phone number in header: `{phone_number}`
> - Footer copyright: `{copyright_text}`
> - Social links: `{social_links}`
>
> Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{template_type}` | `Header` / `Footer` |
| `{new_logo_url}` | `https://drwattselectric.com/wp-content/uploads/logo.png` |
| `{menu_items}` | `Home, Services, About, Contact, Blog` |
| `{phone_number}` | `(916) 555-0199` |
| `{copyright_text}` | `© 2026 Dr. Watts Electric. All rights reserved.` |
| `{social_links}` | `Facebook: fb.com/drwatts, Instagram: @drwattselectric` |

---

### 11. Image Replacement

> Open `{site_url}` in Elementor. Find the image in the **{target_section}** section and replace it:
>
> - Old image description: `{old_image_description}`
> - New image URL: `{new_image_url}`
> - Alt text: `{alt_text}`
> - Image size: `{image_size}`
> - Object fit: `{object_fit}`
>
> Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{target_section}` | `Hero section` |
| `{old_image_description}` | `the stock photo of a house` |
| `{new_image_url}` | `https://example.com/new-hero.jpg` |
| `{alt_text}` | `Licensed electrician installing panel upgrade in Sacramento home` |
| `{image_size}` | `Full width` / `600x400` |
| `{object_fit}` | `Cover` / `Contain` |

---

### 12. Build From Design Reference

> Open `{site_url}` in Elementor. I want the page to look like `{reference_url}`. Recreate the visual style:
>
> - Match the overall layout structure (number of sections, column arrangement)
> - Match the color palette as closely as possible
> - Match the typography sizing and weights
> - Match the spacing and padding patterns
> - Use this content instead: `{content_source}`
>
> Apply the **80/50/35 spacing protocol** across all breakpoints. Click **Update**.

| Placeholder | Example Value |
|:---|:---|
| `{reference_url}` | `https://competitor-site.com` |
| `{content_source}` | `Use the content already on our current homepage` |

---

## Modifier Flags

Append these to any prompt for extra control:

| Flag | Effect |
|:---|:---|
| `Take screenshots at each step` | Agent captures visual proof after every action |
| `Do not click Update — I want to review first` | Agent stops before saving |
| `Use the Elementor Navigator panel` | Agent uses the layer tree for precise element selection |
| `Switch to dark mode first` | Agent toggles Elementor's dark UI before editing |
| `Start from a blank page — delete all existing content` | Agent clears the canvas first |
| `Work in tablet view only` | Agent stays in tablet responsive mode |
| `Verify against the 1250px grid` | Agent checks container widths after placement |

---

## Compound Prompt Example (Full Workflow)

This combines multiple templates into a single end-to-end session:

> **Phase 1 — Preparation:**
> Navigate to `https://drwattselectric.com/wp-admin`. Open the page "Home" in Elementor. Delete all existing sections to start fresh.
>
> **Phase 2 — Build:**
> Build these sections in order:
> 1. Hero: Heading "24/7 Emergency Electrical Services", subheading "Licensed & Insured in Sacramento", gold CTA button "Get a Free Quote"
> 2. Trust Bar: 4 icon boxes in a row — "Licensed", "Insured", "5-Star Rated", "Free Estimates"
> 3. Services Grid: 3 cards — "Panel Upgrades", "EV Charger Installation", "Whole-Home Rewiring"
> 4. Testimonial: "Dr. Watts saved us during a power emergency at 2AM. Professional and fast." — Sarah M., Sacramento
> 5. CTA Footer: "Ready to Get Started?" with a "Call (916) 555-0199" button
>
> **Phase 3 — Style:**
> Primary color: #D4AF37 (gold). Secondary: #1A1A2E (dark navy). Font: Inter. All headings 42px desktop / 28px mobile. All section padding: 80/50/35.
>
> **Phase 4 — Responsive QA:**
> Switch to tablet (768px) and mobile (375px) views. Fix any overflow, stacking, or spacing issues. Make all CTA buttons full-width on mobile.
>
> **Phase 5 — Save:**
> Take a final screenshot at desktop, tablet, and mobile. Then click Update.

---

## Quick Copy-Paste Templates

### Minimal (fastest)
```
Open {site_url} in Elementor. Add a {widget_type} widget to the {target_section}
with text "{content}". Style: {color} background, white text. Update.
```

### Standard
```
Navigate to {site_url}/wp-admin, open "{page_title}" in Elementor.
Add a {section_type} section below {reference_point} with heading "{heading}"
and body "{body_text}".
Use {primary_color} accent, {font} font, 80/50/35 padding. Update.
```

### Full Spec
```
Navigate to {site_url}/wp-admin, open "{page_title}" in Elementor.
Build: [numbered section list with exact content]
Style: [colors, fonts, sizes]
Responsive: [breakpoint-specific overrides]
Verify: [take screenshots at 1440, 768, 375]
Save: [Update]
```
