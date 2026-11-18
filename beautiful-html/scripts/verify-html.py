#!/usr/bin/env python3
"""Static checklist runner for beautiful-html outputs.

Usage:
    python3 scripts/verify-html.py <path-to.html> [--strict]

Enforces hard technical/content-cleanliness invariants as FAIL (single-file,
no leftover REPLACE placeholders, no generator branding, raw Markdown fence
leakage, responsive + print rules) and reports style-agnostic editorial craft
signals as PASS/WARN without forcing one preset's decorative motifs onto all
aesthetics.

Exit code 0 when no FAIL (and no WARN under --strict), 1 otherwise.
"""

import argparse
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

PASS, FAIL, WARN = "PASS", "FAIL", "WARN"


def _strip_code_and_styles(html: str) -> str:
    s = re.sub(r"<!--[\s\S]*?-->", "", html)
    for tag in ("script", "style", "pre", "code", "textarea", "svg"):
        s = re.sub(rf"<{tag}\b[^>]*>[\s\S]*?</{tag}>", "", s, flags=re.I)
    return s


def _looks_blue_purple(hexc: str) -> bool:
    h = hexc.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        return False
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return b > 120 and b >= r and b > g


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("html", help="path to the generated HTML file")
    ap.add_argument("--strict", action="store_true", help="treat WARN results as failures")
    args = ap.parse_args()

    try:
        with open(args.html, encoding="utf-8") as fh:
            src = fh.read()
    except OSError as exc:
        print(f"{FAIL}  cannot read {args.html}: {exc}")
        return 1

    results: list[tuple[str, str, str]] = []

    # --- 1. Single-file invariant (no external JS; no external CSS except Google Fonts) ---
    external_scripts = re.findall(r"<script[^>]*\bsrc\s*=", src, re.I)
    external_css = re.findall(
        r'<link[^>]*rel=["\']stylesheet["\'][^>]*href=["\'](?!https://fonts\.googleapis)',
        src,
        re.I,
    )
    if not external_scripts and not external_css:
        results.append((PASS, "single file: inline styles/scripts only (Google Fonts allowed)", ""))
    else:
        results.append(
            (
                FAIL,
                f"external resources found (js={len(external_scripts)}, css={len(external_css)})",
                "inline <style>/<script> only; Google Fonts <link> is the only allowed external stylesheet",
            )
        )

    # --- 2. Typography setup ---
    has_gfonts = "fonts.googleapis.com" in src and "<link" in src
    has_fontface = "@font-face" in src
    has_font_tokens = bool(re.search(r"--[a-z-]*(?:display|body|serif|sans|mono|font)[a-z-]*\s*:", src, re.I))
    if has_gfonts or has_fontface:
        results.append((PASS, "web/embedded typography present", ""))
    elif has_font_tokens:
        results.append((PASS, "explicit CSS font-role tokens present (offline/system stack)", ""))
    else:
        results.append((WARN, "no Google Fonts, @font-face, or font-role CSS variables detected", "define distinct display/body font stacks"))

    # --- 3. Color & editorial craft signals (style-agnostic) ---
    gradients = re.findall(r"linear-gradient\s*\([^)]*\)", src, re.I)
    suspicious = []
    for g in gradients:
        hexes = re.findall(r"#([0-9a-fA-F]{3,6})\b", g)
        if any(_looks_blue_purple(h) for h in hexes):
            suspicious.append(g)
    if suspicious:
        results.append((WARN, "possible generic blue/purple linear-gradient detected", " ".join(suspicious[:2])))
    else:
        results.append((PASS, "palette avoids generic blue/purple gradient", ""))

    craft_cues = [
        name
        for name, ok in [
            ("css-tokens", ":root" in src and "--" in src),
            ("offset-shadow", bool(re.search(r"box-shadow\s*:\s*[\-0-9]+px\s+[\-0-9]+px\s+0\b", src))),
            ("editorial-rules", bool(re.search(r"border(?:-(?:top|bottom|left|right))?\s*:[^;]*(?:double|[2-9]px\s+solid)", src))),
            ("rotated-motif", "rotate(" in src or "data-rot" in src),
            ("hollow-or-oversized-num", "-webkit-text-stroke" in src or "clamp(" in src),
            ("vertical-type", "vertical-rl" in src),
            ("inline-svg", "<svg" in src.lower()),
            ("grid-layout", bool(re.search(r"display\s*:\s*grid", src))),
        ]
        if ok
    ]
    if len(craft_cues) >= 3:
        results.append((PASS, f"editorial craft signals present ({', '.join(craft_cues[:5])})", ""))
    else:
        results.append((WARN, f"few editorial craft signals detected ({', '.join(craft_cues) or 'none'})", "add deliberate typographic scale, rules, tokens, or layout contrast"))

    # --- 4. Semantic landmarks ---
    landmarks = [t for t in ("<main", "<section", "<nav") if t in src.lower()]
    if len(landmarks) >= 2:
        results.append((PASS, f"semantic landmarks present ({', '.join(landmarks)})", ""))
    else:
        results.append((WARN, "sparse semantic landmarks", "use <main>, <nav>, <section>/<article>"))

    # --- 5. Responsive viewport + media query + wide-table overflow ---
    has_viewport = bool(re.search(r'<meta[^>]*name=["\']viewport["\']', src, re.I))
    has_media = bool(re.search(r"@media[^{]*(?:max-width|min-width)", src, re.I))
    if has_viewport and has_media:
        results.append((PASS, "viewport meta and responsive @media query present", ""))
    else:
        results.append((FAIL, "missing viewport meta or responsive @media query", "add <meta name='viewport'> and mobile @media breakpoint"))

    if "<table" in src.lower():
        if "table-scroll" in src or re.search(r"overflow-x\s*:\s*auto", src, re.I):
            results.append((PASS, "table horizontal overflow handled", ""))
        else:
            results.append((WARN, "<table> present without overflow-x: auto wrapper", "wrap wide tables in an overflow-x: auto container"))

    # --- 6. Print stylesheet ---
    print_blocks = re.findall(r"@media\s+print\s*\{([\s\S]*?\})\s*\}", src, re.I)
    if "@media print" in src.lower():
        has_nav_aside = "<aside" in src.lower() or 'class="sidebar"' in src
        if not has_nav_aside or re.search(r"@media\s+print[\s\S]*?display\s*:\s*none", src, re.I):
            results.append((PASS, "@media print rules present", ""))
        else:
            results.append((WARN, "@media print present but no display:none rule found for navigation chrome", "hide fixed sidebar/nav in @media print"))
    else:
        results.append((FAIL, "missing @media print rules", "add @media print to hide navigation chrome and clean backgrounds"))

    # --- 7. No unfilled REPLACE placeholders ---
    leftover = len(re.findall(r"REPLACE", src))
    if leftover == 0:
        results.append((PASS, "no unfilled REPLACE placeholders", ""))
    else:
        results.append((FAIL, f"{leftover} unfilled REPLACE placeholder(s) remain", "fill or remove all REPLACE markers"))

    # --- 8. No raw Markdown fence leakage in prose ---
    prose = _strip_code_and_styles(src)
    if "```" in prose:
        results.append((FAIL, "raw Markdown code fence (```) leaked into rendered HTML", "convert fenced blocks to <pre><code>"))
    else:
        results.append((PASS, "no raw Markdown fences in prose", ""))

    # --- 9. No generator/skill branding ---
    skill_hits = re.findall(r"beautiful[\s-]*html", src, re.I)
    if skill_hits:
        results.append((FAIL, f"generator/skill branding present ({len(skill_hits)}x)", "remove 'beautiful-html' / 'Beautiful HTML' from all HTML and comments"))
    else:
        results.append((PASS, "no generator/skill branding", ""))

    chrome = " ".join(re.findall(r"<(?:footer|aside)[\s\S]*?</(?:footer|aside)>", src, re.I))
    chrome_slogans = re.findall(r"设计感知识手册|TEMPLATE READY|CYBERPUNK PRESET", chrome, re.I)
    if chrome_slogans:
        results.append((FAIL, f"template slogan in sidebar/footer ({len(chrome_slogans)}x)", "keep colophon/sidebar to real document metadata only"))
    else:
        results.append((PASS, "sidebar/footer free of template slogans", ""))

    statuses = {PASS: 0, WARN: 0, FAIL: 0}
    print(f"verify: {args.html}")
    print("-" * 70)
    for status, msg, hint in results:
        statuses[status] += 1
        line = f"{status:4}  {msg}"
        if hint and status in (FAIL, WARN):
            line += f"\n          -> {hint}"
        print(line)
    print("-" * 70)
    print(f"summary: {statuses[PASS]} pass, {statuses[WARN]} warn, {statuses[FAIL]} fail")

    failed = statuses[FAIL] > 0 or (args.strict and statuses[WARN] > 0)
    print("result: " + ("FAIL (fix before delivery)" if failed else "OK (visual browser check still required)"))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
