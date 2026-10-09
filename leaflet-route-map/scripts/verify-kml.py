#!/usr/bin/env python3
"""Structural KML checks (not full XSD validation or a My Maps import test)."""
import argparse
import math
import re
import xml.etree.ElementTree as ET


def verify(path, expected_points=None):
    root = ET.parse(path).getroot()
    ns = {'k': 'http://www.opengis.net/kml/2.2'}
    assert root.tag == '{' + ns['k'] + '}kml', 'Wrong KML namespace'
    lines = root.findall('.//k:LineString', ns)
    points = root.findall('.//k:Point', ns)
    assert len(lines) == 1, 'Expected one LineString'
    if expected_points is not None:
        assert len(points) == expected_points, 'Unexpected point count'
    for geometry in lines + points:
        text = geometry.findtext('k:coordinates', '', ns)
        positions = [tuple(map(float, p.split(','))) for p in text.split()]
        assert len(positions) >= (2 if geometry in lines else 1), 'Missing coordinates'
        for p in positions:
            assert len(p) in (2, 3) and all(math.isfinite(v) for v in p), 'Invalid coordinate'
            assert -180 <= p[0] <= 180 and -90 <= p[1] <= 90, 'Coordinate out of range'
    for style in root.findall('.//k:IconStyle', ns):
        assert style.find('k:href', ns) is None, 'href must be nested in Icon'
        assert style.findtext('k:Icon/k:href', '', ns), 'Missing Icon/href'
    for color in root.findall('.//k:color', ns):
        assert re.fullmatch('[0-9a-fA-F]{8}', color.text or ''), 'Invalid AABBGGRR color'
    return {'routes': len(lines), 'points': len(points)}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('path')
    parser.add_argument('--points', type=int)
    args = parser.parse_args()
    print(verify(args.path, args.points))
