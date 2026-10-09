# Regression and evidence

Run from the repository root:

```text
node geographic-map-artifact/evals/run_regression.js
python -B geographic-map-artifact/evals/run_kml_eval.py
python -B geographic-map-artifact/evals/run_trigger_eval.py
```

The trigger command uses the installed Yao semantic-intent checker; supply `--engine path/to/trigger_eval.py` on another machine. It is a deterministic proxy, not a model activation test. Cases/config live alongside each changed description.

Real-browser runs require Node 18+, `playwright-core`, and an existing Chromium/Chrome binary. They create artifacts/screenshots under an explicitly supplied output directory, never `testing/`:

```text
node geographic-map-artifact/evals/run_browser_eval.js <output-dir> <playwright-core-module-path> <chrome-binary-path>
```

First use downloads fixed library versions; later runs reuse a SHA-checked cache under the output directory. Capture begins before file-URL navigation. Seven synthetic scenarios each test folder and standalone HTML, including zero/missing/same values, holes, points-only, horizontal two-point routes, Leaflet popups/zoom, 390 px viewport, screenshots and a remote-blocked reload. No online tile or actual My Maps import claim is made. Cold/warm dependency timings are component measurements, not agent-task speedups.

Baseline model runs, token cost, real-data production cases, global spherical polygons and online provider availability remain missing evidence. Do not infer a percentage improvement from these fixtures. Keep the package Scaffold until real reuse justifies promotion.
