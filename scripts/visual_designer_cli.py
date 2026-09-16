#!/usr/bin/env python3
"""
Visual Designer CLI - Master Orchestrator for Gemini Computer Use Chrome Designer (v1.4.0)
Entrypoint declared in manifest.json:
C:/Users/User/.gemini/config/skills/gemini-computer-use-chrome-designer/scripts/visual_designer_cli.py

Supports:
- audit: Node A visual QA & responsive spacing audit (1250px grid, 80/50/35 protocol)
- duplicate: Node B in-place repeater duplication ($e.run('document/repeater/duplicate'))
- modify-text: Node B targeted text modification by widget ID
- style: Node B WCAG 2.1 AA styling & dark overlay contrast shielding
- purge: Detection & purge of rogue standalone widgets
- verify: Pre-flight checks (CDP connection, DPI normalization, domain assertion)
- real-case: Executes grounded Burnette Construction FAQ item #9 duplication trace
- --cloud-runner: Autonomous headless Chromium runner with gcloud Linux VM flags
"""

import sys
import os
import argparse
import json
from pathlib import Path

# Add scripts directory to path to import agent engine
SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS_DIR))

from chrome_designer_agent import (
    ChromeDesignerAgent,
    SidebarExclusionViolationError,
    DomainBoundaryViolationError,
    RogueWidgetDetectedError,
    PanelDesyncError,
    UnsavedChangesError
)

def build_parser():
    parser = argparse.ArgumentParser(
        prog="visual_designer_cli",
        description="Gemini Computer Use Chrome Designer - Zero Widget Injection Orchestrator (v1.4.0)"
    )
    parser.add_argument("--cdp-url", default="http://localhost:9222", help="CDP endpoint URL (default: http://localhost:9222)")
    parser.add_argument("--domain", help="Enforce strict target domain lock (e.g. burnet.elkgroveseocompany.com)")
    parser.add_argument("--cloud-runner", action="store_true", help="Launch autonomous headless Chromium with gcloud Linux VM flags (Quadruple-DPI lock & memory armor)")

    subparsers = parser.add_subparsers(dest="command", help="Available subcommands")

    # verify
    verify_p = subparsers.add_parser("verify", help="Run pre-flight checks (CDP/Cloud Runner, DPI, URL domain match)")
    verify_p.add_argument("--url", help="Expected page URL")

    # audit (Node A)
    audit_p = subparsers.add_parser("audit", help="Run Node A visual audit and responsive spacing check")
    audit_p.add_argument("--url", required=True, help="Target URL to navigate and audit")
    audit_p.add_argument("--goal", default="Audit page layout, 1250px grid, and 80/50/35 spacing", help="Visual audit prompt")
    audit_p.add_argument("--viewports", nargs="+", type=int, default=[1250, 768, 375], help="Viewports to audit")

    # duplicate (Node B)
    dup_p = subparsers.add_parser("duplicate", help="Run Node B in-place repeater duplication")
    dup_p.add_argument("--url", required=True, help="Target page URL")
    dup_p.add_argument("--container-id", required=True, help="Parent container model ID (e.g. 53383ea)")
    dup_p.add_argument("--repeater-name", default="items", help="Repeater property name (default: items)")
    dup_p.add_argument("--source-index", type=int, default=0, help="Index of item to duplicate (default: 0)")

    # modify-text (Node B)
    mod_p = subparsers.add_parser("modify-text", help="Run Node B targeted text modification")
    mod_p.add_argument("--url", required=True, help="Target page URL")
    mod_p.add_argument("--widget-id", required=True, help="Target widget ID (e.g. 9c3d93f)")
    mod_p.add_argument("--field", default="editor", help="Setting key (e.g. title, editor, heading)")
    mod_p.add_argument("--value", required=True, help="New text content to set")

    # style (Node B)
    style_p = subparsers.add_parser("style", help="Apply WCAG 2.1 AA styling & contrast shielding")
    style_p.add_argument("--url", required=True, help="Target page URL")
    style_p.add_argument("--widget-id", required=True, help="Target widget ID")
    style_p.add_argument("--is-dark-overlay", action="store_true", help="Apply #FFFFFF + Gold #EAB308 + rgba(15,23,42,0.7) shielding")

    # purge (Node B)
    purge_p = subparsers.add_parser("purge", help="Detect and purge rogue standalone widgets")
    purge_p.add_argument("--url", required=True, help="Target page URL")
    purge_p.add_argument("--rogue-id", required=True, help="Rogue standalone widget ID to delete (e.g. cc5bc34)")
    purge_p.add_argument("--parent-container-id", required=True, help="Parent repeater container to repair")

    # real-case (End-to-End Pipeline)
    case_p = subparsers.add_parser("real-case", help="Execute real-world Burnette Construction ADU FAQ duplication pipeline")
    case_p.add_argument("--staging-url", default="https://burnet.elkgroveseocompany.com", help="Target staging WordPress root URL")

    return parser

def main():
    parser = build_parser()
    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(0)

    agent = ChromeDesignerAgent(
        cdp_url=args.cdp_url,
        expected_domain=args.domain,
        use_cloud_runner=args.cloud_runner
    )

    try:
        if args.command == "verify":
            agent.connect(create_new_tab=False)
            preflight = agent.run_preflight_checks(expected_url=args.url)
            print("\n[PRE-FLIGHT AUDIT]:", json.dumps(preflight, indent=2))
            agent.disconnect()

        elif args.command == "audit":
            agent.connect(create_new_tab=True)
            results = agent.run_node_a_visual_audit(args.url, args.goal, viewports=args.viewports)
            print("\n[VISUAL AUDIT RESULTS]:", json.dumps(results, indent=2))
            agent.disconnect()

        elif args.command == "duplicate":
            agent.connect(create_new_tab=False)
            agent.assert_domain_boundary(args.url)
            result = agent.duplicate_repeater_item(
                container_id=args.container_id,
                repeater_name=args.repeater_name,
                source_index=args.source_index
            )
            print("\n[IN-PLACE DUPLICATION RESULT]:", json.dumps(result, indent=2))
            agent.save_and_verify()
            agent.disconnect()

        elif args.command == "modify-text":
            agent.connect(create_new_tab=False)
            agent.assert_domain_boundary(args.url)
            result = agent.modify_widget_text(
                widget_id=args.widget_id,
                field=args.field,
                value=args.value
            )
            print("\n[TEXT MODIFICATION RESULT]:", json.dumps(result, indent=2))
            agent.save_and_verify()
            agent.disconnect()

        elif args.command == "style":
            agent.connect(create_new_tab=False)
            agent.assert_domain_boundary(args.url)
            result = agent.apply_styling_guardrail(
                widget_id=args.widget_id,
                is_dark_overlay=args.is_dark_overlay
            )
            print("\n[STYLING RESULT]:", json.dumps(result, indent=2))
            agent.save_and_verify()
            agent.disconnect()

        elif args.command == "purge":
            agent.connect(create_new_tab=False)
            agent.assert_domain_boundary(args.url)
            result = agent.purge_rogue_widget_and_repair(
                rogue_id=args.rogue_id,
                parent_container_id=args.parent_container_id
            )
            print("\n[PURGE & REPAIR RESULT]:", json.dumps(result, indent=2))
            agent.save_and_verify()
            agent.disconnect()

        elif args.command == "real-case":
            agent.connect(create_new_tab=False)
            result = agent.execute_real_case_burnette_faq(args.staging_url)
            print("\n[REAL-WORLD CASE RESULT]:", json.dumps(result, indent=2))
            agent.disconnect()

    except (SidebarExclusionViolationError, DomainBoundaryViolationError, 
            RogueWidgetDetectedError, PanelDesyncError, UnsavedChangesError) as e:
        print(f"\n[GOVERNANCE ERROR - {type(e).__name__}]: {e}", file=sys.stderr)
        sys.exit(2)
    except Exception as e:
        print(f"\n[UNEXPECTED ERROR]: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
