# Boundary and Gates Summary

## Mode

`Scaffold`

This package is a lightweight routing and composition layer over the existing local `leaflet-route-map` and `d3-offline-map` skills. It adds the missing boundary-plus-route composite mode without duplicating their mature implementation assets.

## Owned job

Choose a map rendering mode, produce a local browser-verifiable artifact, and enforce shared data, offline, and evidence rules.

## Output contract

Every run must produce local HTML, local data payload(s), required local assets, a README, and verification notes. A screenshot is required when browser automation is available. Route runs may additionally produce Google My Maps-compatible KML.

## Explicit exclusions

- live navigation, traffic, geocoding, or POI search
- tile hosting and production GIS systems
- high-precision boundaries without appropriate source data
- regulated public-map publishing

## Resource boundary

- `SKILL.md`: routing table, safe defaults, output contract, hard boundaries.
- `references/routing-and-data-contract.md`: mode choice and exact payload contract.
- `references/verification-and-boundaries.md`: browser checks, offline evidence, data/publication limits.
- Existing sibling skills retain their Leaflet/D3 templates and deterministic scripts to avoid copy divergence.

## Manual gates applied

- Trigger boundary: positive route, choropleth, and composite requests are distinct from excluded live-GIS requests.
- Data boundary: all persisted geography is `[lon, lat]`; Leaflet conversion is local to rendering.
- Offline boundary: local libraries alone never justify an offline claim.
- Verification boundary: every mode has independently testable layer evidence.

## Deferred

- Trigger-evaluation fixture set
- A bundled composite D3 template
- Standalone packaging that vendors sibling scripts/templates
- Automated browser fixture tests

## Promotion triggers

Promote once composite rendering has been used successfully in multiple projects, or once this package must install independently from its sibling skills. At that point, add a bundled template, deterministic composite-data packer, and routing holdout tests.
