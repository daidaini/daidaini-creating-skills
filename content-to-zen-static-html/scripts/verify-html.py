#!/usr/bin/env python3
"""content-to-zen-static-html checklist runner.

Usage:
    python scripts/verify-html.py <path-to.html> [--strict] [--expect-entries N]

Static heuristics for the zen single-file HTML deliverable. Exit 0 when no
FAIL (with --strict, WARN also fails). Visual quality still needs a real
browser pass: open the file, click search/theme/drawer, watch the console.
"""

import argparse
import json
import re
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

PASS, FAIL, WARN = "PASS", "FAIL", "WARN"


def island_entry_count(islands):
    """Best-effort item count inside type=application/json data islands.

    Way B renders entries at runtime, so the static <article> count is 0;
    --expect-entries has to look inside the island instead. Accepts a bare
    list, {"entries": [...]}, or a dict with exactly one list value.
    """
    for raw in islands:
        if "<" in raw:
            continue
        try:
            data = json.loads(raw)
        except ValueError:
            continue
        if isinstance(data, list):
            return len(data)
        if isinstance(data, dict):
            if isinstance(data.get("entries"), list):
                return len(data["entries"])
            lists = [v for v in data.values() if isinstance(v, list)]
            if len(lists) == 1:
                return len(lists[0])
    return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("html", help="path to the generated HTML file")
    ap.add_argument("--strict", action="store_true", help="treat WARN as failure")
    ap.add_argument("--expect-entries", type=int, default=None,
                    help="expected number of .entry articles (source item count)")
    args = ap.parse_args()

    try:
        with open(args.html, encoding="utf-8") as fh:
            src = fh.read()
    except OSError as exc:
        print(f"{FAIL}  cannot read {args.html}: {exc}")
        return 1

    results: list[tuple[str, str, str]] = []
    # Strip JSON data islands and HTML comments before scanning: neither
    # renders, so examples/notes inside them must not trip dependency or
    # structure checks.
    data_islands = re.findall(
        r"<script[^>]*type=[\"']application/json[\"'][^>]*>(.*?)</script>",
        src, re.S)
    body = re.sub(r"<!--.*?-->", "", src, flags=re.S)
    for island in data_islands:
        body = body.replace(island, "")
    # Strip <pre>/<code> for dependency scans: code samples that merely show
    # fetch()/CDN URLs are not runtime deps (knowledge docs are in scope).
    probe = re.sub(r"<pre.*?</pre>", "", body, flags=re.S)
    probe = re.sub(r"<code.*?</code>", "", probe, flags=re.S)

    # --- 1. External dependencies (the core promise: offline single file) ---
    if re.search(r"<script[^>]+src\s*=", probe):
        results.append((FAIL, "external <script src> found", "page must inline all JS"))
    else:
        results.append((PASS, "no external <script src>", ""))

    if re.search(r"<link[^>]+rel=[\"']?stylesheet", probe):
        results.append((FAIL, "external stylesheet <link> found", "page must inline all CSS"))
    else:
        results.append((PASS, "no external stylesheet <link>", ""))

    if re.search(r"(fetch\s*\(|XMLHttpRequest)", probe):
        results.append((FAIL, "fetch()/XHR found", "content must be embedded, not loaded at runtime"))
    else:
        results.append((PASS, "no fetch()/XHR", ""))

    # URL-shaped only (host must sit in the URL authority), so prose that
    # merely names a host (e.g. "we sourced photos from unsplash") passes.
    cdn_pat = re.compile(
        r"(?:https?:)?//[a-z0-9.-]*?(?:fonts\.googleapis|fonts\.gstatic|cdn\.jsdelivr|"
        r"jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare|googleapis\.com|bootstrapcdn|"
        r"jquery\.com|unsplash\.com|pexels\.com|picsum)[a-z0-9./-]*",
        re.I)
    m = cdn_pat.search(probe)
    if m:
        results.append((FAIL, f"CDN/external-host reference found: {m.group(1)}",
                        "system fonts + inline SVG only"))
    else:
        results.append((PASS, "no CDN or stock-image hosts", ""))

    if re.search(r"<img[^>]+src=[\"']https?:", probe):
        results.append((FAIL, "remote <img src> found", "images must be inline SVG or base64"))
    else:
        results.append((PASS, "no remote images", ""))

    # Other offline leaks the checks above don't cover.
    if re.search(r"@import\s*(?:url\s*\(|[\"'])", probe, re.I):
        results.append((FAIL, "CSS @import found", "inline the imported rules; page must be self-contained"))
    else:
        results.append((PASS, "no CSS @import", ""))

    if re.search(r"url\(\s*[\"']?(?:https?:)?//", probe, re.I):
        results.append((FAIL, "remote url(...) reference found", "use inline SVG data URIs only"))
    else:
        results.append((PASS, "no remote url(...) references", ""))

    if re.search(r"<iframe[^>]+src\s*=", probe):
        results.append((FAIL, "iframe with src found", "iframes are runtime dependencies"))
    else:
        results.append((PASS, "no iframes", ""))

    # --- 2. Structure ---
    if re.search(r"<meta[^>]+charset", src, re.I) or src.lstrip().lower().startswith("<?xml"):
        results.append((PASS, "charset declared", ""))
    else:
        results.append((FAIL, "no charset declaration", "add <meta charset=\"utf-8\">"))

    if re.search(r"<meta[^>]+name=[\"']?viewport", src, re.I):
        results.append((PASS, "viewport meta present", ""))
    else:
        results.append((FAIL, "no viewport meta", "mobile rendering will break"))

    n_entries = len(re.findall(r"<article[^>]+class=[\"'][^\"']*\bentry\b", body))
    if args.expect_entries is not None:
        actual, src_label = n_entries, "entry count"
        if n_entries == 0 and data_islands:
            actual = island_entry_count(data_islands)
            src_label = "JSON island entry count"
        if actual is None:
            results.append((WARN, "cannot count JSON-rendered entries",
                            "check the item count in the browser instead"))
        elif actual == args.expect_entries:
            results.append((PASS, f"{src_label} matches source ({actual})", ""))
        else:
            results.append((FAIL, f"{src_label} {actual} != expected {args.expect_entries}",
                            "content was truncated or inflated"))
    elif n_entries == 0:
        if data_islands:
            results.append((PASS, "entries rendered from a JSON data island",
                            "static count is 0 by design"))
        else:
            results.append((WARN, "no <article class=\"entry\"> found",
                            "short docs may use plain sections; verify intentionally"))
    else:
        results.append((PASS, f"{n_entries} entry articles", ""))

    # --- 3. Interaction hooks (search / filter / toc / theme) ---
    for needle, label in [
        ("searchInput", "search input"),
        ("tocNav", "TOC nav"),
        ("themeToggle", "theme toggle"),
    ]:
        if needle in body:
            results.append((PASS, f"{label} present", ""))
        else:
            results.append((WARN, f"{label} missing (id {needle})",
                            "ok only if doc is short / plain display"))

    # --- 4. JSON embedding safety ---
    if data_islands:
        raw_lt = [i for i in data_islands if "<" in i]
        broken = []
        for i in data_islands:
            if "<" in i:
                continue
            try:
                json.loads(i)
            except ValueError:
                broken.append(i)
        if raw_lt:
            results.append((FAIL, "raw `<` inside JSON island",
                            "escape `<` as \\u003c or switch to direct HTML"))
        elif broken:
            results.append((FAIL, "JSON island is not valid JSON (premature `</script>` or syntax error)",
                            "escape `<` as \\u003c and re-check the page"))
        else:
            results.append((PASS, "JSON island escaped and parses as JSON", ""))
    elif re.search(r"JSON\.parse", body):
        results.append((WARN, "JSON.parse without a type=application/json island",
                        "check how data is embedded"))

    # --- 5. Markdown residue ---
    # Code blocks and CSS are exempt (raw syntax there is intentional).
    scrub = re.sub(r"<style.*?</style>", "", probe, flags=re.S)
    residue = []
    for pat, label in [
        (r"(^|\n)#{1,6}\s+\S", "markdown heading `# `"),
        (r"\*\*[^\s*][^*]{1,60}\*\*", "markdown bold `**x**`"),
        (r"(^|\n)\s*[-*]\s+\S", "markdown bullet `- x`"),
        (r"\[[^\]]{1,60}\]\(https?://[^)]{1,120}\)", "markdown link `[x](url)`"),
        (r"(^|\n)\|.+\|\n\|[-: |]+\|", "markdown table pipe row"),
    ]:
        if re.search(pat, scrub):
            residue.append(label)
    if residue:
        results.append((FAIL, f"markdown residue in prose: {', '.join(residue)}",
                        "parse syntax into HTML elements"))
    else:
        results.append((PASS, "no markdown residue in prose", ""))

    # --- 6. Visual-system basics ---
    if "prefers-reduced-motion" in body:
        results.append((PASS, "prefers-reduced-motion respected", ""))
    else:
        results.append((WARN, "no prefers-reduced-motion rule", "animations should be disabled for users who opt out"))

    if re.search(r"aria-label=", body):
        results.append((PASS, "aria-label present", ""))
    else:
        results.append((WARN, "no aria-label found", "icon buttons need labels"))

    if "clamp(" in body:
        results.append((PASS, "clamp() fluid type", ""))
    else:
        results.append((WARN, "no clamp() usage", "headings won't scale fluidly"))

    # duplicated ids
    ids = re.findall(r"\bid=[\"']([^\"']+)[\"']", body)
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if dupes:
        results.append((FAIL, f"duplicate ids: {', '.join(dupes[:5])}", "anchors and JS hooks break"))
    else:
        results.append((PASS, "ids unique", ""))

    # --- 7. Entry / TOC / category consistency (was a manual step) ---
    entry_tags = [t for t in re.findall(r"<article\b[^>]*>", body)
                  if re.search(r"\bclass=[\"'][^\"']*\bentry\b", t)]
    entry_ids, entry_cats, no_id = [], [], 0
    for tag in entry_tags:
        m = re.search(r"\bid=[\"']([^\"']+)[\"']", tag)
        if m:
            entry_ids.append(m.group(1))
        else:
            no_id += 1
        c = re.search(r"\bdata-cat=[\"']([^\"']+)[\"']", tag)
        entry_cats.append(c.group(1) if c else None)
    if entry_tags and no_id:
        results.append((FAIL, f"{no_id} entry article(s) missing id",
                        "anchors and TOC links need a stable id"))
    elif entry_ids:
        results.append((PASS, "every entry has an id", ""))

    toc_m = re.search(r"<nav[^>]*id=[\"']tocNav[\"'][^>]*>(.*?)</nav>", body, re.S)
    if toc_m:
        toc_hrefs = re.findall(r"href=[\"']#([^\"']+)[\"']", toc_m.group(1))
        broken = [h for h in toc_hrefs if h not in set(ids)]
        if broken:
            results.append((FAIL, f"toc links to missing anchors: {', '.join(broken[:5])}",
                            "anchor target does not exist"))
        else:
            results.append((PASS, "all toc links resolve to real ids", ""))
        href_set = set(toc_hrefs)
        unlinked = [i for i in entry_ids if i not in href_set]
        if unlinked:
            results.append((FAIL, f"entries without toc link: {', '.join(unlinked[:5])}",
                            "add a matching <a> in #tocNav per entry"))
        elif entry_ids:
            results.append((PASS, "every entry has a toc link", ""))

    cat_m = re.search(r"<nav[^>]*id=[\"']catNav[\"'][^>]*>(.*?)</nav>", body, re.S)
    if cat_m and entry_tags:
        buttons = set(re.findall(r"data-cat=[\"']([^\"']+)[\"']", cat_m.group(1)))
        specific = buttons - {"all"}
        if specific:
            orphan = sorted({c for c in entry_cats if c and c not in buttons})
            if orphan:
                results.append((FAIL, f"entry data-cat without filter button: {', '.join(orphan)}",
                                "add a matching <button data-cat> in #catNav"))
            else:
                results.append((PASS, "every entry data-cat has a filter button", ""))
            unc = sum(1 for c in entry_cats if c is None)
            if unc:
                results.append((WARN, f"{unc} entry article(s) without data-cat",
                                "they never appear under specific filters"))
        used = {c for c in entry_cats if c}
        dead = sorted(specific - used)
        if dead:
            results.append((WARN, f"filter buttons with no entries: {', '.join(dead)}",
                            "remove the button or fix the data-cat mismatch"))

    # --- ZEN:EDIT placeholders (checked on src, including comments) ---
    if "ZEN:EDIT" in src:
        results.append((FAIL, "template placeholder ZEN:EDIT remains",
                        "replace every ZEN:EDIT and delete the header comment block"))
    else:
        results.append((PASS, "no ZEN:EDIT placeholder", ""))

    # --- Report ---
    n_fail = sum(1 for s, _, _ in results if s == FAIL)
    n_warn = sum(1 for s, _, _ in results if s == WARN)
    for s, label, note in results:
        line = f"{s}  {label}"
        if note:
            line += f"  — {note}"
        print(line)
    print(f"\n{len(results)} checks: {n_fail} FAIL, {n_warn} WARN")
    if n_fail or (args.strict and n_warn):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
