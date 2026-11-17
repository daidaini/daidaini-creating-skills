#!/usr/bin/env node
/**
 * build-html.js — 将一页或多页 SVG 组装成轻量预览外壳（单文件 HTML，零外部依赖）。
 *
 * 能力：分页切换 / 主题切换 / 导出 SVG / 导出 PNG / 查看 IR / 节点 hover 高亮。
 * 说明：HTML 是「编辑外壳」，SVG 才是最终视觉内容；两者共用同一份内联 SVG。
 *
 * 用法：
 *   node build-html.js <out.html> <page-1.svg> [page-2.svg ...] [--title 标题] [--subtitle 副标题] [--json visual-ir.json]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const THEME_VARS = {
  professional: { bg: '#F8FAFC', surface: '#FFFFFF', primary: '#2563EB', secondary: '#0EA5E9', accent: '#F59E0B', text: '#172033', muted: '#64748B', border: '#E2E8F0' },
  tech: { bg: '#0B1220', surface: '#141E33', primary: '#38BDF8', secondary: '#A78BFA', accent: '#F472B6', text: '#E8EFFA', muted: '#94A3B8', border: '#26334C' },
  minimal: { bg: '#FFFFFF', surface: '#FFFFFF', primary: '#111827', secondary: '#6B7280', accent: '#9CA3AF', text: '#111827', muted: '#6B7280', border: '#E5E7EB' },
  paper: { bg: '#FBF8F3', surface: '#FFFDF9', primary: '#8A5A34', secondary: '#5B7B6A', accent: '#B08968', text: '#2B2622', muted: '#7C7267', border: '#E6DCCC' }
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function main() {
  const argv = process.argv.slice(2);
  const out = argv[0];
  const svgs = [];
  let title = '信息图', subtitle = '', jsonPath = null;
  for (let i = 1; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--title') title = argv[++i];
    else if (a === '--subtitle') subtitle = argv[++i];
    else if (a === '--json') jsonPath = argv[++i];
    else if (a.endsWith('.svg')) svgs.push(a);
  }
  if (!out || !svgs.length) {
    console.error('用法: node build-html.js <out.html> <p1.svg> [p2.svg ...] [--title T] [--json ir.json]');
    process.exit(2);
  }

  const blocks = svgs.map((f, i) => {
    let s = fs.readFileSync(path.resolve(f), 'utf8').trim();
    s = s.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!DOCTYPE[^>]*>/gi, '');
    const show = i === 0 ? '' : ' hidden';
    return `<div class="ttig-page" data-page="${i + 1}"${show}>${s}</div>`;
  }).join('\n');

  const irRaw = jsonPath && fs.existsSync(path.resolve(jsonPath))
    ? fs.readFileSync(path.resolve(jsonPath), 'utf8') : '';

  const themeCss = Object.entries(THEME_VARS).map(([name, v]) =>
    `.ttig-root[data-theme="${name}"]{--ttig-bg:${v.bg};--ttig-surface:${v.surface};--ttig-primary:${v.primary};--ttig-secondary:${v.secondary};--ttig-accent:${v.accent};--ttig-text:${v.text};--ttig-muted:${v.muted};--ttig-border:${v.border}}`
  ).join('\n');

  const tabs = svgs.length > 1
    ? `<div class="ttig-tabs">${svgs.map((_, i) => `<button class="ttig-tab${i === 0 ? ' is-active' : ''}" data-go="${i + 1}">第 ${i + 1} 页</button>`).join('')}</div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<style>
  :root{--ui-bg:#F1F5F9;--ui-panel:#FFFFFF;--ui-border:#E2E8F0;--ui-text:#172033;--ui-muted:#64748B;}
  *{box-sizing:border-box}
  body{margin:0;background:var(--ui-bg);color:var(--ui-text);
       font-family:Inter,'Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif;}
  .ttig-bar{position:sticky;top:0;z-index:10;display:flex;align-items:center;gap:12px;flex-wrap:wrap;
            padding:12px 20px;background:rgba(255,255,255,.92);backdrop-filter:blur(8px);
            border-bottom:1px solid var(--ui-border);}
  .ttig-bar h1{margin:0;font-size:16px;font-weight:700;letter-spacing:.2px}
  .ttig-bar .sub{font-size:12px;color:var(--ui-muted)}
  .ttig-spacer{flex:1}
  .ttig-bar button,.ttig-bar select{font:inherit;font-size:13px;padding:6px 12px;border-radius:8px;
            border:1px solid var(--ui-border);background:var(--ui-panel);color:var(--ui-text);cursor:pointer}
  .ttig-bar button:hover{border-color:#94A3B8}
  .ttig-tabs{display:flex;gap:6px}
  .ttig-tab.is-active{background:#2563EB;color:#fff;border-color:#2563EB}
  .ttig-canvas{max-width:1400px;margin:24px auto;padding:0 20px}
  .ttig-page{margin-bottom:24px;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(15,23,42,.10);background:#fff}
  .ttig-page svg{display:block;width:100%;height:auto}
  .ttig-root g[data-role]{cursor:default}
  .ttig-root g[data-role]:hover > rect:first-of-type{stroke-width:3}
  .ttig-foot{max-width:1400px;margin:0 auto 40px;padding:0 20px;color:var(--ui-muted);font-size:12px}
  details.ttig-ir{max-width:1400px;margin:0 auto 32px;padding:0 20px}
  details.ttig-ir summary{cursor:pointer;font-size:13px;color:var(--ui-muted);padding:8px 0}
  details.ttig-ir pre{background:#0F172A;color:#CBD5E1;padding:16px;border-radius:10px;overflow:auto;
            font-size:12px;line-height:1.6;max-height:420px}
</style>
</head>
<body>
<div class="ttig-bar">
  <h1>${esc(title)}</h1>
  ${subtitle ? `<span class="sub">${esc(subtitle)}</span>` : ''}
  <span class="ttig-spacer"></span>
  ${tabs}
  <select id="ttig-theme" title="切换主题">
    <option value="professional">专业 Professional</option>
    <option value="tech">科技 Tech</option>
    <option value="minimal">极简 Minimal</option>
    <option value="paper">纸质 Paper</option>
  </select>
  <button id="ttig-svg">导出 SVG</button>
  <button id="ttig-png">导出 PNG</button>
</div>

<div class="ttig-canvas" id="ttig-canvas">${blocks}</div>

${irRaw ? `<details class="ttig-ir"><summary>查看 Visual IR（渲染输入，可编辑后重新渲染）</summary><pre>${esc(irRaw)}</pre></details>` : ''}

<div class="ttig-foot">由 text-to-infographic 生成 · SVG 为矢量源文件，可直接编辑或嵌入</div>

<script>
${themeCss ? '(function(){var s=document.createElement("style");s.textContent=' + JSON.stringify(themeCss) + ';document.head.appendChild(s);})();' : ''}

(function(){
  var pages = Array.prototype.slice.call(document.querySelectorAll('.ttig-page'));
  var canvas = document.getElementById('ttig-canvas');

  function current(){
    var v = pages.filter(function(p){ return !p.hidden; });
    return v[0] || pages[0];
  }

  Array.prototype.forEach.call(document.querySelectorAll('.ttig-tab'), function(btn){
    btn.addEventListener('click', function(){
      var go = btn.getAttribute('data-go');
      pages.forEach(function(p){ p.hidden = p.getAttribute('data-page') !== go; });
      Array.prototype.forEach.call(document.querySelectorAll('.ttig-tab'), function(b){
        b.classList.toggle('is-active', b === btn);
      });
    });
  });

  document.getElementById('ttig-theme').addEventListener('change', function(e){
    var t = e.target.value;
    pages.forEach(function(p){
      var svg = p.querySelector('svg');
      if (svg) svg.setAttribute('data-theme', t);
    });
  });

  function download(blob, name){
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  document.getElementById('ttig-svg').addEventListener('click', function(){
    var svg = current().querySelector('svg');
    var src = new XMLSerializer().serializeToString(svg);
    download(new Blob(['<?xml version="1.0" encoding="UTF-8"?>\\n' + src], {type:'image/svg+xml'}), 'infographic.svg');
  });

  document.getElementById('ttig-png').addEventListener('click', function(){
    var svg = current().querySelector('svg').cloneNode(true);
    var vb = (svg.getAttribute('viewBox') || '0 0 1600 900').split(/\\s+/);
    var w = parseFloat(vb[2]) || 1600, h = parseFloat(vb[3]) || 900;
    var scale = 2;
    svg.setAttribute('width', w); svg.setAttribute('height', h);
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    var src = new XMLSerializer().serializeToString(svg);
    var img = new Image();
    var url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
    img.onload = function(){
      var c = document.createElement('canvas');
      c.width = w * scale; c.height = h * scale;
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,c.width,c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob(function(b){ if (b) download(b, 'infographic.png'); }, 'image/png');
    };
    img.onerror = function(){ alert('PNG 导出失败：SVG 中可能含浏览器无法栅格化的内容'); };
    img.src = url;
  });
})();
</script>
</body>
</html>`;

  fs.writeFileSync(path.resolve(out), html, 'utf8');
  console.log('[build-html] 已输出 ' + path.resolve(out) + '（' + svgs.length + ' 页）');
}

if (require.main === module) main();
