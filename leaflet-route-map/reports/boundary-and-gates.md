# Boundary and Gates Summary

## Mode

`Scaffold`

Reason: this is a project-local reusable workflow derived from one completed route-map demo. It is useful enough to route as a skill, but not yet a team/library/governed release.

## Owned job

Build a complete Leaflet route-map demo artifact:

- local Leaflet JS/CSS assets
- local test route data
- route polyline
- start/waypoint/finish markers
- stats/popup UI
- browser verification and screenshot when possible

## Output contract

Leaflet HTML output (required):

- `index.html`
- `vendor/leaflet/leaflet.css`
- `vendor/leaflet/leaflet.js`
- route data usable by the browser, preferably `data/route-data.js`
- a short `README.md`

KML output (optional, when user requests Google My Maps export):

- `data/route.kml` — valid KML with 1 LineString + N Point placemarks
- `scripts/convert-kml.py` — reusable conversion script

Recommended:

- raw fetched route response, e.g. `data/osrm-route.json`
- screenshot evidence, e.g. `screenshot.png`
- verification notes with route coordinate count and rendered marker/path checks

## Near-neighbor exclusions

Do not route here for:

- D3 choropleth or administrative boundary maps
- Natural Earth / TopoJSON region-coloring work
- live geocoding, traffic, POI search, or turn-by-turn navigation
- production-grade routing engines or backend GIS pipelines
- public regulated map publishing / map approval workflows
- fully offline maps unless offline tile data is provided or explicitly requested

## Asset design justification

- `SKILL.md` is lean so activation cost stays low.
- `references/workflow.md` holds the reusable implementation details, commands, verification checks, and pitfalls.
- `agents/interface.yaml` makes the skill adapter-friendly and states degradation behavior.
- No template HTML is bundled in the first iteration because the proven `roadmap/index.html` can serve as the immediate local example; future reuse can promote a generic template if repeated generation shows drift.

## Gates applied

Manual checks used for this scaffold:

- structure check: `SKILL.md`, `agents/interface.yaml`, `references/workflow.md`, and report exist
- boundary check: description includes both positive triggers and exclusions
- output-risk check: workflow warns about coordinate order, false offline claims, and `file://` JSON fetch issues
- evidence check: references record the validated `roadmap/` run and browser verification signals

## Gates deferred

Deferred until Production/Library promotion:

- `trigger_eval.py`
- `validate_skill.py`
- route-confusion holdout set
- packaged template generation tests
- offline tile fixture tests
- governance/trust report

## Promotion triggers

Promote beyond Scaffold if any of these happen:

- the skill is reused for multiple projects or teammates
- users confuse it with `d3-offline-map`
- generated HTML starts drifting in quality
- fully offline tile support becomes a repeated requirement
- the workflow needs deterministic scripts for route fetching, data conversion, or template rendering
