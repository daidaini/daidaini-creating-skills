#!/usr/bin/env python3
"""Exercise the real converter CLI and structural verifier in a temporary folder."""
import importlib.util
import json
import subprocess
import sys
import tempfile
from pathlib import Path
import xml.etree.ElementTree as ET

sys.dont_write_bytecode = True
scripts = Path(__file__).resolve().parents[2] / 'leaflet-route-map' / 'scripts'
spec = importlib.util.spec_from_file_location('kml_verifier', scripts / 'verify-kml.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
ns = {'k': 'http://www.opengis.net/kml/2.2'}
with tempfile.TemporaryDirectory(prefix='map-kml-eval-') as temp:
    source, output = Path(temp) / 'route.json', Path(temp) / 'route.kml'
    geometry = {'type': 'LineString', 'coordinates': [[120, 30], [121, 31]]}
    for name, data in [
        ('OSRM', {'routes': [{'geometry': geometry, 'distance': 1000, 'duration': 120}], 'waypoints': [{'name': 'A&B', 'location': [120, 30]}, {'name': '<end>', 'location': [121, 31]}]}),
        ('route-data without invented statistics', {'geometry': geometry, 'waypoints': [{'name': 'Start', 'location': [120, 30]}, {'name': 'End', 'location': [121, 31]}]})
    ]:
        source.write_text(json.dumps(data), encoding='utf-8')
        subprocess.run([sys.executable, str(scripts / 'convert-kml.py'), str(source), str(output)], check=True, capture_output=True)
        assert module.verify(output, 2) == {'routes': 1, 'points': 2}
        root = ET.parse(output).getroot()
        assert root.findtext('.//k:LineStyle/k:color', namespaces=ns) == 'fff6823b'
        assert root.findtext('.//k:LineString/k:coordinates', namespaces=ns).split() == ['120.0000000,30.0000000', '121.0000000,31.0000000']
        if name.startswith('route-data'):
            assert 'Distance and duration not supplied' in output.read_text(encoding='utf-8')
        print('PASS', name)
    source.write_text(json.dumps({'geometry': {'type': 'LineString', 'coordinates': [[120, 91], [121, 31]]}}), encoding='utf-8')
    assert subprocess.run([sys.executable, str(scripts / 'convert-kml.py'), str(source), str(output)], capture_output=True).returncode != 0
    print('PASS invalid coordinate rejected')
    broken = output.read_text(encoding='utf-8').replace('<Icon><href>', '<href>').replace('</href></Icon>', '</href>')
    output.write_text(broken, encoding='utf-8')
    try:
        module.verify(output)
    except AssertionError:
        print('PASS malformed icon nesting rejected')
    else:
        raise AssertionError('Malformed style passed')
