#!/usr/bin/env python3
"""Run Yao's deterministic semantic-intent proxy; not an actual model router eval."""
import argparse
import json
from pathlib import Path
import subprocess
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--engine', type=Path, default=Path.home() / '.agents/skills/yao-meta-skill/scripts/trigger_eval.py')
args = parser.parse_args()
repository = Path(__file__).resolve().parents[2]
failed = False
for name in ('geographic-map-artifact', 'd3-offline-map'):
    root = repository / name
    result = subprocess.run([sys.executable, '-B', str(args.engine), '--description-file', str(root / 'SKILL.md'), '--cases', str(root / 'evals/trigger_cases.json'), '--semantic-config', str(root / 'evals/semantic_config.json')], capture_output=True, encoding='utf-8', errors='replace')
    if result.returncode not in (0, 2):
        raise RuntimeError(result.stderr or result.stdout)
    report = json.loads(result.stdout)
    report['evidence_kind'] = 'deterministic-semantic-intent-proxy; not model activation evidence'
    (root / 'reports').mkdir(exist_ok=True)
    (root / 'reports/trigger-eval-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(name, 'FP:', report['false_positives'], 'FN:', report['false_negatives'], 'buckets:', report['bucket_stats'])
    failed |= report['false_positives'] > 0 or report['false_negatives'] > 0
sys.exit(1 if failed else 0)
