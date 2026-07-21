#!/usr/bin/env python3
"""
trigger_eval.py — One-Page Cheat Sheet Trigger Evaluation
Validates trigger coverage: positive, negative, and near-neighbor cases.
Usage: python3 scripts/trigger_eval.py
"""

import re
import json
import sys
from pathlib import Path

SKILL_DIR = Path(__file__).resolve().parent.parent
SKILL_MD = SKILL_DIR / "SKILL.md"
INTERFACE = SKILL_DIR / "agents" / "interface.yaml"
REPORT = SKILL_DIR / "reports" / "trigger_eval_report.md"

def extract_description(path):
    """Extract frontmatter description from SKILL.md."""
    content = path.read_text(encoding="utf-8")
    # Simple YAML frontmatter parser
    m = re.match(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not m:
        raise ValueError("No frontmatter found")
    fm = m.group(1)
    desc_m = re.search(r'description:\s*"(.+?)"', fm)
    if not desc_m:
        desc_m = re.search(r"description:\s*'(.+?)'", fm)
    if not desc_m:
        desc_m = re.search(r"description:\s*(.+)", fm)
    return desc_m.group(1).strip() if desc_m else ""

def parse_description(desc):
    """Parse trigger phrases from description text."""
    triggers = []
    # Find quoted phrases
    triggers.extend(re.findall(r'"([^"]+)"', desc))
    triggers.extend(re.findall(r"'([^']+)'", desc))
    return list(set(t.lower() for t in triggers))

def load_interface_triggers(path):
    """Load triggers from interface.yaml."""
    if not path.exists():
        return {"positive": [], "negative": [], "near_neighbors": []}
    content = path.read_text(encoding="utf-8")
    
    result = {"positive": [], "negative": [], "near_neighbors": []}
    
    # Simple YAML parsing for expected structure
    current_section = None
    for line in content.split("\n"):
        m = re.match(r"^\s+(positive|negative|near_neighbors):", line)
        if m:
            current_section = m.group(1)
            continue
        m = re.match(r'^\s+-\s+"(.+)"', line)
        if m and current_section:
            result[current_section].append(m.group(1).lower())
        m = re.match(r"^\s+-\s+'(.+)'", line)
        if m and current_section:
            result[current_section].append(m.group(1).lower())
    
    return result

def test_cases():
    """Return (input, expected_trigger: bool) pairs."""
    return [
        # Should trigger (positive)
        ("给我一个 Python 的 cheat sheet", True),
        ("帮我整理一下重点", True),
        ("我需要 SQL JOIN 的速查表", True),
        ("can you give me a quick reference for React hooks", True),

        ("给我一个浓缩版的 Kubernetes 知识点总结", True),
        ("cram sheet for statistics exam", True),
        ("one-pager on Docker networking", True),
        ("复习资料 - CSS Grid 布局", True),
        ("考前速览：线性代数公式", True),
        ("study guide for machine learning interview", True),
        ("帮我做一份 Git 操作的备忘录", True),
        ("记忆卡：英语不规则动词", True),
        ("show me a cheat sheet for Linux commands", True),
        
        # Should NOT trigger (negative)
        ("给我一个详细的 Python 教程", False),
        ("deep dive into React performance", False),
        ("comprehensive tutorial on Docker", False),
        ("帮我规划一个系统学习路径", False),
        ("什么是 REST API", False),
        ("比较 React 和 Vue 的区别", False),
        ("帮我写一篇关于气候变化的文章", False),
        
        # Edge cases
        ("cheat sheet for everything about programming", True),  # triggers but should warn about scope
        ("速查表", True),  # minimal trigger
        ("cheat sheet", True),  # minimal trigger
    ]

def run_eval():
    desc = extract_description(SKILL_MD)
    triggers_in_desc = parse_description(desc)
    interface_triggers = load_interface_triggers(INTERFACE)
    
    cases = test_cases()
    
    passed = 0
    failed = 0
    results = []
    
    for input_text, expected in cases:
        input_lower = input_text.lower()
        
        # Check if any positive trigger phrase is in input
        found_positive = any(t in input_lower for t in triggers_in_desc)
        
        # Check negative indicators
        found_negative = any(t in input_lower for t in 
            ["detailed", "deep dive", "comprehensive", "系统学习", "详细教程", "教程"])
        
        # Determine result
        triggered = found_positive and not found_negative
        
        if expected == True and triggered:
            status = "PASS"
            passed += 1
        elif expected == False and not triggered:
            status = "PASS"
            passed += 1
        else:
            status = "FAIL"
            failed += 1
        
        results.append({
            "input": input_text[:60],
            "expected": expected,
            "got": triggered,
            "status": status
        })
    
    # Generate report
    total = passed + failed
    report_lines = [
        "# Trigger Evaluation Report",
        "",
        f"**Date**: (auto-generated)",
        f"**Total cases**: {total}",
        f"**Passed**: {passed}",
        f"**Failed**: {failed}",
        f"**Pass rate**: {passed/total*100:.0f}%",
        "",
        f"**Triggers in description**: {len(triggers_in_desc)}",
        f"**Triggers in interface.yaml**: {len(interface_triggers['positive'])}",
        "",
        "## Results",
        "",
        "| Input | Expected | Got | Status |",
        "|---|---|---|---|",
    ]
    for r in results:
        report_lines.append(f"| {r['input']} | {r['expected']} | {r['got']} | {r['status']} |")
    
    report_lines.extend([
        "",
        "## Coverage Gaps",
        "",
    ])
    
    # Find gaps
    for t in interface_triggers.get("positive", []):
        if t not in triggers_in_desc:
            report_lines.append(f"- ⚠️  Interface trigger `{t}` not found in SKILL.md description")
    
    report_lines.extend([
        "",
        "## Recommendations",
        "",
    ])
    
    if failed > 0:
        report_lines.append(f"- ❌ {failed} cases failed — review trigger logic or description wording")
    if passed == total:
        report_lines.append("- ✅ All cases pass — trigger coverage is solid")
    
    report_lines.append("- Consider adding more near-neighbor negative cases")
    report_lines.append("- Add adversarial test cases (phrases designed to confuse routing)")
    
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text("\n".join(report_lines), encoding="utf-8")
    
    print(f"Trigger eval: {passed}/{total} passed ({passed/total*100:.0f}%)")
    print(f"Report: {REPORT}")
    
    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(run_eval())
