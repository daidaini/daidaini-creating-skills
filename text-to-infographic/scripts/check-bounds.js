#!/usr/bin/env node
/**
 * check-bounds.js — SVG 溢出校验（overflow validator）。
 *
 * 检查所有图形坐标是否落在 viewBox 内，用于捕捉版式越界。
 * 会剥离带 translate 的图标分组（图标为 24 网格局部坐标，不应按全局坐标判定）。
 *
 * 用法：
 *   node check-bounds.js <a.svg> [b.svg ...]
 *   node check-bounds.js <目录>
 *
 * 退出码：0 = 全部在界内；1 = 发现越界；2 = 无有效输入。
 */
'use strict';

const fs = require('fs');
const path = require('path');

function numAttr(el, name) {
  const m = el.match(new RegExp(name + '="(-?[\\d.]+)"'));
  return m ? Number(m[1]) : null;
}

function collect(svgText) {
  const vb = svgText.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const W = vb ? Number(vb[1]) : null;
  const H = vb ? Number(vb[2]) : null;
  // 图标分组使用局部坐标，先剥离
  const clean = svgText.replace(/<g transform="translate\([^)]*\)[^"]*"[^>]*>[\s\S]*?<\/g>/g, '');
  const pts = [];

  (clean.match(/<rect[^>]*>/g) || []).forEach((r) => {
    const x = numAttr(r, 'x'), y = numAttr(r, 'y'), w = numAttr(r, 'width'), h = numAttr(r, 'height');
    if (x != null && y != null && w != null && h != null) {
      pts.push(['rect', x, y]); pts.push(['rect', x + w, y + h]);
    }
  });
  (clean.match(/<circle[^>]*>/g) || []).forEach((c) => {
    const cx = numAttr(c, 'cx'), cy = numAttr(c, 'cy'), r = numAttr(c, 'r');
    if (cx != null && cy != null && r != null) {
      pts.push(['circle', cx - r, cy - r]); pts.push(['circle', cx + r, cy + r]);
    }
  });
  (clean.match(/<text[^>]*>/g) || []).forEach((t) => {
    const x = numAttr(t, 'x'), y = numAttr(t, 'y');
    if (x != null && y != null) pts.push(['text', x, y]);
  });
  (clean.match(/<path[^>]*d="([^"]*)"/g) || []).forEach((p) => {
    const d = p.match(/d="([^"]*)"/)[1];
    const re = /([MLA])([^MLAZ]*)/g;
    let m;
    while ((m = re.exec(d))) {
      const nums = (m[2].match(/-?[\d.]+/g) || []).map(Number);
      // 只解析显式命令的首段：M 取 1 点，L 取点对，A 取末两点
      if (m[1] === 'M') { if (nums.length >= 2) pts.push(['path', nums[0], nums[1]]); }
      else if (m[1] === 'A') { if (nums.length >= 7) pts.push(['path', nums[5], nums[6]]); }
      else { for (let i = 0; i + 1 < nums.length; i += 2) pts.push(['path', nums[i], nums[i + 1]]); }
    }
  });
  return { W, H, pts };
}

function main() {
  const argv = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  if (!argv.length) {
    console.error('用法: node check-bounds.js <a.svg> [b.svg ...] | <目录>');
    process.exit(2);
  }

  let files = [];
  argv.forEach((a) => {
    const p = path.resolve(a);
    if (fs.statSync(p).isDirectory()) {
      fs.readdirSync(p).filter((f) => f.endsWith('.svg')).forEach((f) => files.push(path.join(p, f)));
    } else files.push(p);
  });
  files = files.filter((f) => f.endsWith('.svg'));
  if (!files.length) { console.error('[check-bounds] 未找到 .svg 文件'); process.exit(2); }

  let bad = 0;
  files.forEach((f) => {
    const { W, H, pts } = collect(fs.readFileSync(f, 'utf8'));
    if (W == null) { console.log(`${path.basename(f)}  缺少 viewBox，跳过`); return; }
    const out = pts.filter((p) => p[1] < -2 || p[2] < -2 || p[1] > W + 2 || p[2] > H + 2);
    if (out.length) bad++;
    const tag = out.length ? 'OVERFLOW' : 'ok';
    console.log(`${path.basename(f).padEnd(28)} ${W}x${H}  pts=${String(pts.length).padStart(4)}  ${tag}`
      + (out.length ? '  e.g. ' + JSON.stringify(out.slice(0, 3)) : ''));
  });

  console.log(bad ? `\n[check-bounds] ${bad} 个文件存在越界坐标` : '\n[check-bounds] 全部坐标均在画布内');
  process.exit(bad ? 1 : 0);
}

if (require.main === module) main();
module.exports = { collect };
