import json
import os
import subprocess
import sys

BASE = r"E:/SelfTest/AI_PRJ/daidaini-creating-skills/my-summarize"
EVAL_SCRIPT = r"C:/Users/admin/.agents/skills/yao-meta-skill/scripts/trigger_eval.py"

cmd = [
    sys.executable,
    EVAL_SCRIPT,
    "--description-file", BASE + "/SKILL.md",
    "--baseline-description-file", r"C:/Users/admin/.pi/agent/skills/my-summarize/SKILL.md",
    "--cases", BASE + "/evals/trigger_cases.json",
    "--semantic-config", BASE + "/evals/semantic_config.json",
]
proc = subprocess.run(cmd, capture_output=True)
if proc.returncode not in (0, 2):
    print("STDERR:", proc.stderr[:2000])
    sys.exit(1)

raw = proc.stdout
try:
    stdout_text = raw.decode("utf-8")
except UnicodeDecodeError:
    stdout_text = raw.decode("gbk", errors="replace")
report = json.loads(stdout_text)
os.makedirs(BASE + "/reports", exist_ok=True)
with open(BASE + "/reports/trigger-eval-report.json", "w", encoding="utf-8") as f:
    json.dump(report, f, ensure_ascii=False, indent=2)

print("threshold:", report["threshold"])
print("improved  FP:", report["false_positives"], "FN:", report["false_negatives"],
      "precision:", report["precision"], "recall:", report["recall"])
print("buckets(passed/total):",
      {k: (v["passed"], v["total"]) for k, v in report["bucket_stats"].items()})
print("misfires:", report["misfires"])
c = report.get("comparison", {})
print("baseline  FP:", c.get("baseline_false_positives"), "FN:", c.get("baseline_false_negatives"),
      "precision:", c.get("baseline_precision"), "recall:", c.get("baseline_recall"))
print("deltas FP/FN:", c.get("false_positive_delta"), c.get("false_negative_delta"))
print("exit code from trigger_eval:", proc.returncode)
