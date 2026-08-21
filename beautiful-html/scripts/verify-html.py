#!/usr/bin/env python3
"""beautiful-html static checklist runner.

Usage:
    python scripts/verify-html.py <path-to.html> [--strict]

Checks the generated HTML against the design-system quick checklist.
Static heuristics only: visual quality still needs a real-browser pass
(open the file, check anchor jumps, mobile collapse, console errors,
and take a screenshot).

Exit code 0 when no FAIL, 1 when any FAIL.
"""

import argparse
import re
import sys

# Windows consoles may default to GBK; force UTF-8-safe output.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

PASS, FAIL, WARN = "PASS", "FAIL", "WARN"


def has(haystack: str, needle: str) -> bool:
    return needle in haystack


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("html", help="path to the generated HTML file")
    ap.add_argument("--strict", action="store_true",
                    help="treat WARN results as failures")
    args = ap.parse_args()

    try:
        with open(args.html, encoding="utf-8") as fh:
            src = fh.read()
    except OSError as exc:
        print(f"{FAIL}  cannot read {args.html}: {exc}")
        return 1

    results: list[tuple[str, str, str]] = []

    # --- 1. Google Fonts, not system fonts only ---
    if has(src, "fonts.googleapis.com") and has(src, "<link"):
        results.append((PASS, "Google Fonts <link> present", ""))
    else:
        results.append((FAIL, "Google Fonts <link> missing", "add fonts.googleapis.com <link>" ))

    # --- 2. No default blue/purple gradient as main identity ---
    gradients = re.findall(r"linear-gradient\s*\([^)]*\)", src)
    suspicious = []
    for g in gradients:
        if re.search(r"#(?:[0-9a-fA-F]{3,8})", g):
            hexes = re.findall(r"#([0-9a-fA-F]{3,8})", g)
            if any(_looks_blue_purple(h) for h in hexes):
                suspicious.append(g)
    if suspicious:
        results.append((WARN, "possible blue/purple gradient present",
                        " ".join(suspicious[:2])))
    elif gradients:
        results.append((PASS, "gradients present but none flagged blue/purple", ""))
    else:
        results.append((PASS, "no linear-gradient (solid color identity OK)", ""))

    # --- 3. Offset solid shadows, not blur-only ---
    offset = re.findall(r"box-shadow\s*:\s*([^;}]+)", src)
    has_offset = any(re.search(r"^\s*[\-0-9]+px\s+[\-0-9]+px\s+0(?:\s|;|})", s) for s in offset)
    has_blur_only = any(re.search(r"^\s*0\s+0\s+[\-0-9]+px", s) for s in offset)
    if has_offset:
        results.append((PASS, "offset solid shadows found (e.g. 6px 6px 0)", ""))
    else:
        results.append((FAIL, "no offset solid box-shadow found",
                        "use e.g. box-shadow: 6px 6px 0 var(--line), not blur shadows"))
    if has_blur_only:
        results.append((WARN, "blur-style box-shadow detected", "prefer offset solid shadows"))

    # --- 4. At least one rotated element ---
    if has(src, "rotate(") or re.search(r"data-rot", src):
        results.append((PASS, "rotated element(s) found", ""))
    else:
        results.append((FAIL, "no rotated element found", "add transform: rotate(-3deg) sticker/label"))

    # --- 5. Hollow/outlined chapter numbers ---
    if has(src, "-webkit-text-stroke") and has(src, "color: transparent"):
        results.append((PASS, "hollow outlined text present (chapter numbers)", ""))
    else:
        results.append((WARN, "hollow stroke numbers not detected",
                        "use color:transparent + -webkit-text-stroke for chapter numbers"))

    # --- 6. Semantic HTML tags ---
    missing = [t for t in ("<aside", "<nav", "<section", "<table") if t not in src]
    if not missing:
        results.append((PASS, "semantic tags present (aside/nav/section/table)", ""))
    else:
        results.append((WARN, "missing semantic tags", ", ".join(missing)))

    # --- 7. Responsive + table scroll ---
    if re.search(r"@media[^{]*max-width", src):
        results.append((PASS, "responsive media query present", ""))
    else:
        results.append((FAIL, "no responsive @media query", "add @media (max-width: 900px)"))
    if has(src, "table-scroll") or has(src, "overflow-x: auto"):
        results.append((PASS, "table horizontal scroll handled", ""))
    else:
        results.append((WARN, "wide-table scroll wrapper not detected", "wrap tables in .table-scroll"))

    # --- 8. Print style hides sidebar ---
    if re.search(r"@media\s+print", src) and re.search(r"@media\s+print[\s\S]*?\.sidebar\s*\{[^}]*display:\s*none", src):
        results.append((PASS, "@media print hides sidebar", ""))
    else:
        results.append((FAIL, "@media print does not hide sidebar", "add @media print { .sidebar { display:none } }"))

    # --- 9. Single file, no external JS framework / css ---
    external_scripts = re.findall(r"<script[^>]*\bsrc\s*=", src)
    external_css = re.findall(r'<link[^>]*rel="stylesheet"[^>]*href="(?!https://fonts\.googleapis)', src)
    if not external_scripts and not external_css:
        results.append((PASS, "single file: no external script/css (fonts link allowed)", ""))
    else:
        results.append((FAIL, f"external resources found (js={len(external_scripts)}, css={len(external_css)})",
                        "inline <style> only; Google Fonts <link> is the only allowed external"))
    if re.search(r"<script", src):
        results.append((PASS, "inline <script> OK (no framework)", ""))

    # --- 10. No leftover placeholders ---
    leftover = len(re.findall(r"REPLACE", src))
    if leftover == 0:
        results.append((PASS, "no unfilled REPLACE placeholders", ""))
    else:
        results.append((FAIL, f"{leftover} unfilled REPLACE placeholder(s) remain",
                        "fill or remove all REPLACE comments"))

    # --- Report ---
    statuses = {"PASS": 0, "WARN": 0, "FAIL": 0}
    print(f"verify: {args.html}")
    print("-" * 70)
    for status, msg, hint in results:
        statuses[status] += 1
        line = f"{status:4}  {msg}"
        if hint and status in (FAIL, WARN):
            line += f"\n          -> {hint}"
        print(line)
    print("-" * 70)
    print(f"summary: {statuses['PASS']} pass, {statuses['WARN']} warn, {statuses['FAIL']} fail")

    failed = statuses["FAIL"] > 0
    if args.strict:
        failed = failed or statuses["WARN"] > 0
    print("result: " + ("FAIL (fix before delivery)" if failed else "OK (visual check still required)"))
    return 1 if failed else 0


def _looks_blue_purple(hexc: str) -> bool:
    """Heuristic: does a #rrggbb (or 3-digit) hex look blue/purple-dominant?"""
    h = hexc.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        return False
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return b > 120 and b >= r and b > g


if __name__ == "__main__":
    sys.exit(main())
