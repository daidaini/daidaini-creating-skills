"""Regression tests for content preservation and template assembly."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('zen_render', ROOT / 'scripts/render.py')
renderer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(renderer)


class RenderTests(unittest.TestCase):
    def test_model_preserves_body_and_derives_navigation(self):
        body = '<p>正文 &amp; 全文</p><pre><code>&lt;/script&gt;\n**code**</code></pre>'
        result = renderer.render({'title': '标题 <&>', 'entries': [
            {'title': '第一章', 'html': body, 'category': '设计', 'id': 'chapter'},
            {'title': '第二章', 'html': '<p>末尾</p>', 'category': '设计'},
            {'title': '第三章', 'html': '<p>未分类</p>'},
        ]}, ROOT)
        self.assertIn(body, result)
        self.assertIn('<title>标题 &lt;&amp;&gt;</title>', result)
        self.assertIn('href="#chapter"', result)
        self.assertEqual(result.count('class="cat" data-cat="cat-1"'), 1)
        self.assertIn('id="entryCount">3</b>', result)
        self.assertNotIn('ZEN:EDIT', result)
        self.assertNotIn('单文件 · 离线可用', result)
        self.assertIn('id="noResults"', result)
        self.assertIn('id="resetFilters"', result)
        template = (ROOT / 'template/zen-base.html').read_text(encoding='utf-8')
        self.assertEqual(result.split('<style>')[1].split('</style>')[0],
                         template.split('<style>')[1].split('</style>')[0])
        self.assertEqual(result.rsplit('<script>', 1)[1], template.rsplit('<script>', 1)[1])

    def test_relative_file_and_invalid_ids(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            (base / 'body.html').write_text('<p>文件正文</p>', encoding='utf-8')
            self.assertIn('<p>文件正文</p>', renderer.render({'title': '标题', 'entries': [
                {'title': '章节', 'html_file': 'body.html'}]}, base))
        for anchor in ['sidebar', 'bad id', 'bad#id']:
            with self.assertRaises(ValueError):
                renderer.render({'title': '标题', 'entries': [{'title': '章', 'id': anchor, 'html': ''}]}, ROOT)
        with self.assertRaises(ValueError):
            renderer.render({'title': '标题', 'entries': [
                {'title': '甲', 'id': 'same', 'html': ''},
                {'title': '乙', 'id': 'same', 'html': ''}]}, ROOT)

    @unittest.skipUnless(renderer.shutil.which('pandoc'), 'pandoc not installed')
    def test_markdown_preserves_semantics_and_anchors(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / 'input.md'
            path.write_text('# 测试文档\n\n导读保留。\n\n## 第一章\n\n**强调**与[外链](https://example.org)。\n\n'
                            '> 引用保留\n\n- 项目甲\n- 项目乙\n\n'
                            '```html\n<h2>不是章节</h2>\n</script>\n```\n\n'
                            '| 名称 | 数值 |\n| --- | --- |\n| 保留 | 42 |\n\n'
                            '## 第二章\n\n### 子标题\n\n末尾全文。\n', encoding='utf-8')
            model = renderer.from_markdown(path, None)
            self.assertEqual(model['title'], '测试文档')
            self.assertEqual(len(model['entries']), 3)
            result = renderer.render(model, path.parent)
            for marker in ['<strong>强调</strong>', '<blockquote>', '<ul>', '<table>',
                           '&lt;h2&gt;不是章节&lt;/h2&gt;', '&lt;/script&gt;', '末尾全文。',
                           'href="#第一章"', '<h3 id="子标题">']:
                self.assertIn(marker, result)

    def test_failed_verification_preserves_existing_output(self):
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            output = base / 'output.html'
            output.write_text('previous deliverable', encoding='utf-8')
            model = base / 'model.json'
            model.write_text(json.dumps({'title': '标题', 'entries': [
                {'title': '章节', 'html': '<img src="https://cdn.jsdelivr.net/image.png">'}]}), encoding='utf-8')
            result = subprocess.run([sys.executable, str(ROOT / 'scripts/render.py'), '--model', str(model),
                                     '-o', str(output)], capture_output=True, encoding='utf-8')
            self.assertEqual(result.returncode, 1)
            self.assertIn('FAIL', result.stdout)
            self.assertNotIn('Traceback', result.stderr)
            self.assertEqual(output.read_text(encoding='utf-8'), 'previous deliverable')


if __name__ == '__main__':
    unittest.main()
