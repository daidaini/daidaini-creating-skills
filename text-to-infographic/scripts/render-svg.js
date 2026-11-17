#!/usr/bin/env node
/**
 * render-svg.js — Visual IR (JSON) -> SVG，确定性排版。
 *
 * 定位：本脚本只做「排版、测量、渲染」，不做任何内容理解。
 * 语义压缩与结构选择由 LLM 在上一阶段产出的 Visual IR 决定。
 *
 * 用法：
 *   node render-svg.js <visual-ir.json> [-o out.svg] [--stdout] [--pretty]
 *   cat visual-ir.json | node render-svg.js --stdin -o out.svg
 *
 * 多页：Visual IR 含 pages[] 时，-o out.svg 会拆分为 out-p1.svg / out-p2.svg ...
 *
 * 零依赖（仅 Node 标准库）。
 */
'use strict';

const fs = require('fs');
const path = require('path');

/* ============================================================
 * 0. 工具函数：文本度量 / 换行 / 缩放适配
 * ============================================================ */

const CJK_RE = /[\u2e80-\u9fff\u3000-\u303f\uf900-\ufaff\uff00-\uffef\u3040-\u30ff]/;

function r(n) { return Math.round(Number(n) * 100) / 100; }

function charW(ch, fs) {
  if (CJK_RE.test(ch)) return fs;
  if (ch === ' ') return fs * 0.28;
  if (/[iljIt.,;:'`|!()[\]/\\-]/.test(ch)) return fs * 0.33;
  if (/[A-Z]/.test(ch)) return fs * 0.64;
  if (/[mwMW@%&]/.test(ch)) return fs * 0.86;
  return fs * 0.54;
}

function textW(t, fs) {
  let w = 0;
  for (const ch of String(t)) w += charW(ch, fs);
  return w;
}

/** 切分：CJK 逐字可断，西文按词整体保留 */
function tokenize(t) {
  const out = [];
  let buf = '';
  for (const ch of String(t)) {
    if (CJK_RE.test(ch)) {
      if (buf) { out.push(buf); buf = ''; }
      out.push(ch);
    } else if (ch === ' ') {
      buf += ch; out.push(buf); buf = '';
    } else {
      buf += ch;
    }
  }
  if (buf) out.push(buf);
  return out;
}

function wrapText(t, fs, maxW) {
  if (!t) return [];
  const lines = [];
  let line = '';
  for (const tk of tokenize(t)) {
    const cand = line + tk;
    if (line && textW(cand, fs) > maxW) {
      lines.push(line.replace(/\s+$/, ''));
      line = tk.replace(/^\s+/, '');
    } else {
      line = cand;
    }
  }
  if (line.trim()) lines.push(line.replace(/\s+$/, ''));
  return lines;
}

/** 在给定盒子里找到最大可用字号（不溢出），从 max 递减到 min */
function fitText(t, maxW, maxH, o) {
  const opt = o || {};
  const max = opt.max || 24;
  const min = opt.min || 10;
  const lhMul = opt.lineHeight || 1.4;
  if (!t) return { size: max, lines: [], lh: max * lhMul };
  for (let size = max; size >= min; size -= 1) {
    const lines = wrapText(t, size, maxW);
    if (lines.length * size * lhMul <= maxH + 0.5) {
      return { size, lines, lh: size * lhMul };
    }
  }
  const size = min;
  return { size, lines: wrapText(t, size, maxW), lh: size * lhMul };
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 多行文本块（tspan 逐行定位，保证可编辑、可选中） */
function textBlock(x, y, lines, size, color, o) {
  const opt = o || {};
  const lh = size * (opt.lineHeight || 1.4);
  const anchor = opt.anchor || 'start';
  const weight = opt.weight || 400;
  const ls = opt.letterSpacing ? ` letter-spacing="${opt.letterSpacing}"` : '';
  const op = opt.opacity != null ? ` opacity="${opt.opacity}"` : '';
  const inner = lines.map((ln, i) =>
    `<tspan x="${r(x)}" y="${r(y + i * lh)}">${esc(ln)}</tspan>`
  ).join('');
  return `<text x="${r(x)}" y="${r(y)}" fill="${color}" font-size="${r(size)}" font-weight="${weight}" text-anchor="${anchor}"${ls}${op}>${inner}</text>`;
}

/* ============================================================
 * 1. 主题
 * ============================================================ */

const THEMES = {
  professional: {
    bg: '#F8FAFC', surface: '#FFFFFF', primary: '#2563EB', secondary: '#0EA5E9',
    accent: '#F59E0B', text: '#172033', muted: '#64748B', border: '#E2E8F0'
  },
  tech: {
    bg: '#0B1220', surface: '#141E33', primary: '#38BDF8', secondary: '#A78BFA',
    accent: '#F472B6', text: '#E8EFFA', muted: '#94A3B8', border: '#26334C'
  },
  minimal: {
    bg: '#FFFFFF', surface: '#FFFFFF', primary: '#111827', secondary: '#6B7280',
    accent: '#9CA3AF', text: '#111827', muted: '#6B7280', border: '#E5E7EB'
  },
  paper: {
    bg: '#FBF8F3', surface: '#FFFDF9', primary: '#8A5A34', secondary: '#5B7B6A',
    accent: '#B08968', text: '#2B2622', muted: '#7C7267', border: '#E6DCCC'
  }
};

function resolveTheme(t) {
  const base = THEMES[(t && t.theme) || 'professional'] || THEMES.professional;
  return Object.assign({}, base, t || {});
}

/* ============================================================
 * 2. 图标（内联 24x24 路径，避免外部依赖）
 * ============================================================ */

const ICONS = {
  document: 'M6 2h7l5 5v15H6z M13 2v5h5',
  search: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z M20 20l-4.6-4.6',
  users: 'M8 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 8 11z M2 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5 M16.5 5.2a3 3 0 0 1 0 5.8 M18 14.8c2.2.7 4 2.6 4 5.2',
  chart: 'M4 20V10 M10 20V4 M16 20v-7 M22 20H2',
  gear: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15H2.9a2 2 0 1 1 0-4H3a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.3V4a2 2 0 1 1 4 0v.3a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21.1 11H22a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  check: 'M20 6L9 17l-5-5',
  warning: 'M12 3l9 16H3z M12 9v4 M12 16.5v.5',
  lightbulb: 'M9 18h6 M10 21h4 M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z',
  rocket: 'M5 15s-1 3-2 4c0 0 3 1 6-1 M9 18l-3-3c1-4 4-7 8-8l3 3c-1 4-4 7-8 8z M14.5 5.5a4 4 0 1 1 4 4',
  target: 'M12 12h.01 M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z M12 7v5l3.5 2',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  database: 'M12 7c4.4 0 8-1.1 8-2.5S16.4 2 12 2 4 3.1 4 4.5 7.6 7 12 7z M4 4.5v15C4 21 7.6 22 12 22s8-1 8-2.5v-15 M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5',
  chat: 'M21 12a8 8 0 0 1-8 8H8l-5 3 1.4-4.4A8 8 0 1 1 21 12z',
  sparkles: 'M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z M18 15l.9 2.3 2.3.9-2.3.9L18 21l-.9-2.3-2.3-.9 2.3-.9z',
  'arrow-right': 'M4 12h15 M13 6l6 6-6 6'
};

function iconSvg(name, x, y, size, color) {
  const d = ICONS[name];
  if (!d) return '';
  const k = size / 24;
  return `<g transform="translate(${r(x)} ${r(y)}) scale(${r(k)})"><path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}

/* ============================================================
 * 3. 通用绘图件
 * ============================================================ */

function markerDefs() {
  return `<defs>
<marker id="ttig-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ttig-primary,#2563EB)"/></marker>
<marker id="ttig-arrow-muted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="var(--ttig-muted,#64748B)"/></marker>
</defs>`;
}

function arrow(x1, y1, x2, y2, kind, w) {
  const mk = kind === 'muted' ? 'ttig-arrow-muted' : 'ttig-arrow';
  const color = kind === 'muted' ? 'var(--ttig-muted,#64748B)' : 'var(--ttig-primary,#2563EB)';
  const sw = w || 2.2;
  return `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${color}" stroke-width="${sw}" marker-end="url(#${mk})" stroke-linecap="round"/>`;
}

function edge(x1, y1, x2, y2, kind) {
  // 正交折线（用于层级树）
  const my = (y1 + y2) / 2;
  const d = `M ${r(x1)} ${r(y1)} L ${r(x1)} ${r(my)} L ${r(x2)} ${r(my)} L ${r(x2)} ${r(y2)}`;
  const color = kind === 'muted' ? 'var(--ttig-muted,#64748B)' : 'var(--ttig-secondary,#0EA5E9)';
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
}

/**
 * 通用卡片节点：徽标 + 标题 + 正文（+ 可选大数字 value）
 */
function card(o) {
  const {
    x, y, w, h, id, role, unitRef, title, body, value, index,
    emphasis, u, icon, align
  } = o;
  const p = 18 * u;
  const strong = emphasis === 'high';
  const weak = emphasis === 'low';
  const border = strong ? 'var(--ttig-primary,#2563EB)' : 'var(--ttig-border,#E2E8F0)';
  const sw = strong ? 2.6 * u : (weak ? 1 * u : 1.4 * u);
  const dash = weak ? ' stroke-dasharray="6 5"' : '';
  const titleColor = strong ? 'var(--ttig-primary,#2563EB)' : (weak ? 'var(--ttig-muted,#64748B)' : 'var(--ttig-text,#172033)');
  const bodyColor = 'var(--ttig-muted,#64748B)';
  const a = align || 'left';
  const tx = a === 'center' ? x + w / 2 : x + p;
  const anchor = a === 'center' ? 'middle' : 'start';

  const out = [];
  out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${r(12 * u)}" fill="var(--ttig-surface,#FFFFFF)" stroke="${border}" stroke-width="${r(sw)}"${dash}/>`);
  if (strong) {
    out.push(`<rect x="${r(x)}" y="${r(y + 8 * u)}" width="${r(5 * u)}" height="${r(h - 16 * u)}" rx="${r(2.5 * u)}" fill="var(--ttig-primary,#2563EB)"/>`);
  }

  let cy = y + p;

  // 徽标
  if (index != null) {
    const br = 15 * u;
    const bcx = a === 'center' ? x + w / 2 : x + p + br;
    const bcy = y + p + br;
    out.push(`<circle cx="${r(bcx)}" cy="${r(bcy)}" r="${r(br)}" fill="${strong ? 'var(--ttig-primary,#2563EB)' : 'var(--ttig-secondary,#0EA5E9)'}" opacity="${strong ? 1 : 0.85}"/>`);
    out.push(`<text x="${r(bcx)}" y="${r(bcy)}" fill="#FFFFFF" font-size="${r(15 * u)}" font-weight="700" text-anchor="middle" dominant-baseline="central">${esc(index)}</text>`);
    cy = y + p + br * 2 + 12 * u;
  } else if (icon) {
    out.push(iconSvg(icon, x + p, y + p, 26 * u, strong ? 'var(--ttig-primary,#2563EB)' : 'var(--ttig-secondary,#0EA5E9)'));
    cy = y + p + 34 * u;
  }

  // 大数字
  if (value) {
    const vf = fitText(value, w - 2 * p, 44 * u, { max: Math.round(34 * u), min: 14 * u, lineHeight: 1.15 });
    out.push(textBlock(tx, cy + vf.size * 0.9, vf.lines, vf.size, 'var(--ttig-accent,#F59E0B)', { anchor, weight: 700, lineHeight: 1.15 }));
    cy += vf.size * vf.lines.length * 1.15 + 8 * u;
  }

  // 标题
  const availH = Math.max(20 * u, y + h - p - cy - (body ? 40 * u : 0));
  const tf = fitText(title || '', w - 2 * p, Math.min(availH, 68 * u), { max: Math.round(24 * u), min: 12 * u, lineHeight: 1.32 });
  if (tf.lines.length) {
    out.push(textBlock(tx, cy + tf.size, tf.lines, tf.size, titleColor, { anchor, weight: 700, lineHeight: 1.32 }));
    cy += tf.lines.length * tf.lh + 8 * u;
  }

  // 正文
  if (body) {
    const bh = Math.max(16 * u, y + h - p - cy);
    const bf = fitText(body, w - 2 * p, bh, { max: Math.round(16 * u), min: 10 * u, lineHeight: 1.5 });
    out.push(textBlock(tx, cy + bf.size, bf.lines, bf.size, bodyColor, { anchor, weight: 400, lineHeight: 1.5 }));
  }

  const gid = id || 'node';
  return `<g id="${esc(gid)}" data-role="${esc(role || 'node')}"${unitRef ? ` data-unit-id="${esc(unitRef)}"` : ''}>${out.join('')}</g>`;
}

function normItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map((it) => (typeof it === 'string' ? { label: it, value: '' } : { label: it.label || '', value: it.value != null ? String(it.value) : '' }));
}

/* ============================================================
 * 4. 布局模板
 *    key = `${pattern}:${layout}`
 * ============================================================ */

const LAYOUTS = {};

/* ---------- process ---------- */

LAYOUTS['process:horizontal-steps'] = function (ctx) {
  const { els, box, u, theme, page } = ctx;
  const n = els.length;
  const gap = 30 * u;
  const w = (box.w - gap * (n - 1)) / n;
  const h = Math.min(Math.max(box.h * 0.72, 170 * u), 330 * u);
  const y = box.y + (box.h - h) / 2;
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const x1 = box.x + i * (w + gap);
    out.push(arrow(x1 + w + 4 * u, y + h / 2, x1 + w + gap - 6 * u, y + h / 2, 'primary', 2.4 * u));
  }
  els.forEach((e, i) => {
    out.push(card({
      x: box.x + i * (w + gap), y, w, h,
      id: e.id, role: e.role || 'process-node', unitRef: e.unit_ref,
      title: e.title, body: e.body, value: e.value, index: e.index != null ? e.index : i + 1,
      emphasis: e.emphasis, u, icon: e.icon
    }));
  });
  void theme; void page;
  return out.join('');
};

LAYOUTS['process:vertical-roadmap'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const rowH = box.h / n;
  const h = Math.min(rowH - 18 * u, 150 * u);
  const spineX = box.x + 44 * u;
  const cardX = spineX + 40 * u;
  const w = box.x + box.w - cardX;
  const out = [];
  out.push(`<line x1="${r(spineX)}" y1="${r(box.y + h / 2)}" x2="${r(spineX)}" y2="${r(box.y + (n - 1) * rowH + h / 2)}" stroke="var(--ttig-border,#E2E8F0)" stroke-width="${r(3 * u)}" stroke-linecap="round"/>`);
  els.forEach((e, i) => {
    const y = box.y + i * rowH + (rowH - h) / 2;
    out.push(`<circle cx="${r(spineX)}" cy="${r(y + h / 2)}" r="${r(11 * u)}" fill="var(--ttig-primary,#2563EB)"/>`);
    out.push(`<circle cx="${r(spineX)}" cy="${r(y + h / 2)}" r="${r(19 * u)}" fill="none" stroke="var(--ttig-primary,#2563EB)" stroke-width="${r(2 * u)}" opacity="0.28"/>`);
    out.push(card({
      x: cardX, y, w, h,
      id: e.id, role: e.role || 'process-node', unitRef: e.unit_ref,
      title: e.title, body: e.body, value: e.value, index: e.index != null ? e.index : i + 1,
      emphasis: e.emphasis, u, icon: e.icon
    }));
  });
  return out.join('');
};

LAYOUTS['process:cycle'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const rx = Math.min(box.w * 0.34, box.h * 0.62);
  const ry = Math.min(box.h * 0.34, box.w * 0.40);
  const bw = Math.min(230 * u, box.w / 3.4), bh = 108 * u;
  const out = [];
  const pos = [];
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    pos.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
  }
  // 弧形连接
  const arx = rx * 0.78, ary = ry * 0.78;
  for (let i = 0; i < n; i++) {
    const a1 = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.28;
    const a2 = -Math.PI / 2 + ((i + 1) / n) * Math.PI * 2 - 0.28;
    if (n === 1) break;
    const x1 = cx + Math.cos(a1) * arx, y1 = cy + Math.sin(a1) * ary;
    const x2 = cx + Math.cos(a2) * arx, y2 = cy + Math.sin(a2) * ary;
    out.push(`<path d="M ${r(x1)} ${r(y1)} A ${r(arx)} ${r(ary)} 0 0 1 ${r(x2)} ${r(y2)}" fill="none" stroke="var(--ttig-primary,#2563EB)" stroke-width="${r(2 * u)}" marker-end="url(#ttig-arrow)" opacity="0.75"/>`);
  }
  els.forEach((e, i) => {
    out.push(card({
      x: pos[i].x - bw / 2, y: pos[i].y - bh / 2, w: bw, h: bh,
      id: e.id, role: e.role || 'process-node', unitRef: e.unit_ref,
      title: e.title, body: '', value: '', index: e.index != null ? e.index : i + 1,
      emphasis: e.emphasis, u, icon: e.icon, align: 'center'
    }));
  });
  return out.join('');
};

/* ---------- comparison ---------- */

function comparisonPanel(o) {
  const { x, y, w, h, u, el, tone, icon } = o;
  const out = [];
  const strong = el.emphasis === 'high';
  const headFill = tone === 'primary' ? 'var(--ttig-primary,#2563EB)'
    : tone === 'secondary' ? 'var(--ttig-secondary,#0EA5E9)'
      : tone === 'accent' ? 'var(--ttig-accent,#F59E0B)' : 'var(--ttig-muted,#64748B)';
  const headH = 66 * u;
  out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${r(12 * u)}" fill="var(--ttig-surface,#FFFFFF)" stroke="var(--ttig-border,#E2E8F0)" stroke-width="${r(strong ? 2.4 * u : 1.2 * u)}"/>`);
  out.push(`<path d="M ${r(x)} ${r(y + 12 * u)} a ${r(12 * u)} ${r(12 * u)} 0 0 1 ${r(12 * u)} ${r(-12 * u)} h ${r(w - 24 * u)} a ${r(12 * u)} ${r(12 * u)} 0 0 1 ${r(12 * u)} ${r(12 * u)} v ${r(headH - 12 * u)} h ${r(-w)} z" fill="${headFill}"/>`);

  const p = 20 * u;
  let tx = x + p;
  const tf = fitText(el.title || '', w - 2 * p - (icon ? 40 * u : 0), headH - 18 * u, { max: Math.round(24 * u), min: 13 * u, lineHeight: 1.25 });
  out.push(textBlock(tx, y + headH / 2 + tf.size * 0.38, tf.lines, tf.size, '#FFFFFF', { weight: 700, lineHeight: 1.25 }));
  if (icon) out.push(iconSvg(icon, x + w - p - 26 * u, y + headH / 2 - 13 * u, 26 * u, '#FFFFFF'));

  const items = normItems(el.items);
  let ry = y + headH + 16 * u;
  if (items.length) {
    const rowH = Math.min((h - headH - 32 * u) / items.length, 64 * u);
    items.forEach((it, i) => {
      const yy = ry + i * rowH;
      if (i > 0) out.push(`<line x1="${r(x + p)}" y1="${r(yy - 4 * u)}" x2="${r(x + w - p)}" y2="${r(yy - 4 * u)}" stroke="var(--ttig-border,#E2E8F0)" stroke-width="1" opacity="0.8"/>`);
      const lf = fitText(it.label, w - 2 * p - (it.value ? textW(it.value, 18 * u) + 28 * u : 0), rowH * 0.7, { max: Math.round(17 * u), min: 11 * u, lineHeight: 1.35 });
      out.push(textBlock(x + p, yy + rowH / 2 + lf.size * 0.36, lf.lines, lf.size, 'var(--ttig-text,#172033)', { lineHeight: 1.35 }));
      if (it.value) {
        out.push(`<text x="${r(x + w - p)}" y="${r(yy + rowH / 2)}" fill="var(--ttig-primary,#2563EB)" font-size="${r(18 * u)}" font-weight="700" text-anchor="end" dominant-baseline="central">${esc(it.value)}</text>`);
      }
    });
  } else if (el.body) {
    const bf = fitText(el.body, w - 2 * p, h - headH - 32 * u, { max: Math.round(17 * u), min: 11 * u, lineHeight: 1.55 });
    out.push(textBlock(x + p, ry + bf.size, bf.lines, bf.size, 'var(--ttig-muted,#64748B)', { lineHeight: 1.55 }));
  }
  return `<g id="${esc(el.id)}" data-role="${esc(el.role || 'compare-entity')}"${el.unit_ref ? ` data-unit-id="${esc(el.unit_ref)}"` : ''}>${out.join('')}</g>`;
}

function comparisonGrid(ctx, tones) {
  const { els, box, u } = ctx;
  const n = els.length;
  const gap = 26 * u;
  const w = (box.w - gap * (n - 1)) / n;
  const h = Math.min(box.h, 620 * u);
  const y = box.y + (box.h - h) / 2;
  const out = [];
  els.forEach((e, i) => {
    out.push(comparisonPanel({
      x: box.x + i * (w + gap), y, w, h, u, el: e,
      tone: tones[i % tones.length], icon: e.icon
    }));
  });
  return out.join('');
}

LAYOUTS['comparison:split-2'] = (ctx) => comparisonGrid(ctx, ['primary', 'secondary']);
LAYOUTS['comparison:matrix-3'] = (ctx) => comparisonGrid(ctx, ['primary', 'secondary', 'accent']);

LAYOUTS['comparison:before-after'] = function (ctx) {
  const { els, box, u } = ctx;
  const gap = 72 * u;
  const w = (box.w - gap) / 2;
  const h = Math.min(box.h, 560 * u);
  const y = box.y + (box.h - h) / 2;
  const out = [];
  out.push(comparisonPanel({ x: box.x, y, w, h, u, el: els[0], tone: 'muted' }));
  if (els[1]) out.push(comparisonPanel({ x: box.x + w + gap, y, w, h, u, el: els[1], tone: 'primary' }));
  out.push(arrow(box.x + w + 12 * u, y + h / 2, box.x + w + gap - 16 * u, y + h / 2, 'primary', 3 * u));
  return out.join('');
};

LAYOUTS['comparison:pros-cons'] = function (ctx) {
  const { els, box, u } = ctx;
  const gap = 34 * u;
  const w = (box.w - gap) / 2;
  const h = Math.min(box.h, 620 * u);
  const y = box.y + (box.h - h) / 2;
  const out = [];
  const sides = [
    { title: els[0] && els[0].title ? els[0].title : '优势', items: normItems(els[0] && els[0].items), color: 'var(--ttig-secondary,#0EA5E9)', sign: '+' },
    { title: els[1] && els[1].title ? els[1].title : '风险', items: normItems(els[1] && els[1].items), color: 'var(--ttig-accent,#F59E0B)', sign: '−' }
  ];
  sides.forEach((sd, i) => {
    const x = box.x + i * (w + gap);
    out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${r(12 * u)}" fill="var(--ttig-surface,#FFFFFF)" stroke="var(--ttig-border,#E2E8F0)" stroke-width="1.2"/>`);
    out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(6 * u)}" rx="${r(3 * u)}" fill="${sd.color}"/>`);
    const p = 22 * u;
    const tf = fitText(sd.title, w - 2 * p, 40 * u, { max: Math.round(22 * u), min: 13 * u, lineHeight: 1.25 });
    out.push(textBlock(x + p, y + p + tf.size + 8 * u, tf.lines, tf.size, sd.color, { weight: 700, lineHeight: 1.25 }));
    let ry = y + p + 56 * u;
    const rowH = Math.min((h - 76 * u - p) / Math.max(sd.items.length, 1), 62 * u);
    sd.items.forEach((it, k) => {
      const yy = ry + k * rowH;
      out.push(`<text x="${r(x + p)}" y="${r(yy + rowH / 2)}" fill="${sd.color}" font-size="${r(20 * u)}" font-weight="700" dominant-baseline="central">${sd.sign}</text>`);
      const lf = fitText(it.label || it.value, w - 2 * p - 34 * u, rowH * 0.8, { max: Math.round(17 * u), min: 11 * u, lineHeight: 1.4 });
      out.push(textBlock(x + p + 34 * u, yy + rowH / 2 + lf.size * 0.36, lf.lines, lf.size, 'var(--ttig-text,#172033)', { lineHeight: 1.4 }));
    });
  });
  return out.join('');
};

/* ---------- hierarchy ---------- */

function buildTree(els, conns) {
  const ids = new Set(els.map((e) => e.id));
  const parent = new Map();
  const children = new Map();
  conns.filter((c) => ['parent', 'contains', 'child', 'belongs_to'].includes(c.type)).forEach((c) => {
    if (!ids.has(c.from) || !ids.has(c.to)) return;
    parent.set(c.to, c.from);
    if (!children.has(c.from)) children.set(c.from, []);
    children.get(c.from).push(c.to);
  });
  let roots = els.filter((e) => !parent.has(e.id)).map((e) => e.id);
  if (!roots.length) roots = [els[0].id];
  const levels = [];
  const seen = new Set();
  let frontier = roots.filter((id) => ids.has(id));
  while (frontier.length && levels.length < 8) {
    levels.push(frontier);
    frontier.forEach((id) => seen.add(id));
    const next = [];
    frontier.forEach((id) => (children.get(id) || []).forEach((c) => { if (!seen.has(c)) next.push(c); }));
    frontier = next;
  }
  // 未被任何层级覆盖的节点（孤立节点）归入最后一层
  els.forEach((e) => { if (!seen.has(e.id)) levels[levels.length - 1].push(e.id); });
  return { levels, children, byId: new Map(els.map((e) => [e.id, e])) };
}

LAYOUTS['hierarchy:top-down-tree'] = function (ctx) {
  const { els, box, u, conns } = ctx;
  const { levels, byId } = buildTree(els, conns);
  const out = [];
  const L = levels.length;
  const nodeH = Math.min(96 * u, (box.h - (L - 1) * 60 * u) / L);
  const levelY = [];
  for (let l = 0; l < L; l++) levelY.push(box.y + l * (box.h - nodeH) / Math.max(L - 1, 1));
  const pos = new Map();
  levels.forEach((ids, l) => {
    const n = ids.length;
    const w = Math.min(240 * u, (box.w - 20 * u * (n - 1)) / n);
    const totalW = n * w + (n - 1) * 20 * u;
    const startX = box.x + (box.w - totalW) / 2;
    ids.forEach((id, i) => {
      pos.set(id, { x: startX + i * (w + 20 * u), y: levelY[l], w, h: nodeH });
    });
  });
  // 连线
  conns.filter((c) => ['parent', 'contains', 'child', 'belongs_to'].includes(c.type)).forEach((c) => {
    const a = pos.get(c.from), b = pos.get(c.to);
    if (!a || !b) return;
    out.push(edge(a.x + a.w / 2, a.y + a.h, b.x + b.w / 2, b.y, 'default'));
  });
  levels.forEach((ids) => ids.forEach((id) => {
    const e = byId.get(id), p = pos.get(id);
    if (!e || !p) return;
    out.push(card({
      x: p.x, y: p.y, w: p.w, h: p.h,
      id: e.id, role: e.role || 'hierarchy-node', unitRef: e.unit_ref,
      title: e.title, body: e.body, value: e.value, index: null,
      emphasis: e.emphasis, u, icon: e.icon, align: 'center'
    }));
  }));
  return out.join('');
};

LAYOUTS['hierarchy:radial-tree'] = function (ctx) {
  const { els, box, u, conns } = ctx;
  const { levels, byId } = buildTree(els, conns);
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const maxR = Math.min(box.w / 2 - 90 * u, box.h / 2 - 70 * u);
  const out = [];
  const pos = new Map();
  levels.forEach((ids, l) => {
    const rad = l === 0 ? 0 : maxR * (l / Math.max(levels.length - 1, 1));
    const n = ids.length;
    ids.forEach((id, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2 + (l === 0 ? 0 : 0);
      const x = l === 0 ? cx : cx + Math.cos(a) * rad;
      const y = l === 0 ? cy : cy + Math.sin(a) * rad * 0.82;
      pos.set(id, { x, y, w: Math.min(200 * u, box.w / 4.2), h: Math.min(88 * u, box.h / 5) });
    });
  });
  conns.filter((c) => ['parent', 'contains', 'child', 'belongs_to'].includes(c.type)).forEach((c) => {
    const a = pos.get(c.from), b = pos.get(c.to);
    if (!a || !b) return;
    out.push(`<line x1="${r(a.x)}" y1="${r(a.y)}" x2="${r(b.x)}" y2="${r(b.y)}" stroke="var(--ttig-secondary,#0EA5E9)" stroke-width="1.8" opacity="0.7"/>`);
  });
  levels.forEach((ids) => ids.forEach((id) => {
    const e = byId.get(id), p = pos.get(id);
    if (!e || !p) return;
    out.push(card({
      x: p.x - p.w / 2, y: p.y - p.h / 2, w: p.w, h: p.h,
      id: e.id, role: e.role || 'hierarchy-node', unitRef: e.unit_ref,
      title: e.title, body: '', value: '', index: null,
      emphasis: e.emphasis, u, align: 'center'
    }));
  }));
  return out.join('');
};

LAYOUTS['hierarchy:layered-pyramid'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const gap = 10 * u;
  const layerH = (box.h - gap * (n - 1)) / n;
  const out = [];
  const cx = box.x + box.w / 2;
  // 边界宽度：j = 0..n 共 n+1 条边界，f(0)=0.30，f(n)=1.0，保证底层不溢出
  const bf = (j) => 0.30 + 0.70 * (j / n);
  els.forEach((e, i) => {
    const w0 = box.w * Math.min(1, bf(i));
    const w1 = box.w * Math.min(1, bf(i + 1));
    const y0 = box.y + i * (layerH + gap);
    const y1 = y0 + layerH;
    const op = 1 - 0.11 * i;
    out.push(`<path d="M ${r(cx - w0 / 2)} ${r(y0)} L ${r(cx + w0 / 2)} ${r(y0)} L ${r(cx + w1 / 2)} ${r(y1)} L ${r(cx - w1 / 2)} ${r(y1)} Z" fill="var(--ttig-primary,#2563EB)" opacity="${r(op)}"/>`);
    const tf = fitText(e.title || '', w0 - 40 * u, layerH * 0.6, { max: Math.round(21 * u), min: 12 * u, lineHeight: 1.3 });
    out.push(textBlock(cx, y0 + layerH / 2 + tf.size * 0.36, tf.lines, tf.size, '#FFFFFF', { anchor: 'middle', weight: 700, lineHeight: 1.3 }));
    if (e.body) {
      const bf = fitText(e.body, w1 - 40 * u, layerH * 0.3, { max: Math.round(14 * u), min: 10 * u, lineHeight: 1.35 });
      out.push(textBlock(cx, y1 - 14 * u, bf.lines, bf.size, '#FFFFFF', { anchor: 'middle', opacity: 0.85, lineHeight: 1.35 }));
    }
  });
  return out.join('');
};

/* ---------- funnel ---------- */

LAYOUTS['funnel:centered-funnel'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const gap = 8 * u;
  const stageH = (box.h - gap * (n - 1)) / n;
  const wTop = box.w * 0.94, wBot = box.w * 0.34;
  const cx = box.x + box.w / 2;
  const out = [];
  els.forEach((e, i) => {
    const a = wTop + (wBot - wTop) * (i / n);
    const b = wTop + (wBot - wTop) * ((i + 1) / n);
    const y0 = box.y + i * (stageH + gap);
    const y1 = y0 + stageH;
    const op = 0.95 - 0.12 * i;
    out.push(`<g id="${esc(e.id)}" data-role="funnel-stage"${e.unit_ref ? ` data-unit-id="${esc(e.unit_ref)}"` : ''}>`);
    out.push(`<path d="M ${r(cx - a / 2)} ${r(y0)} L ${r(cx + a / 2)} ${r(y0)} L ${r(cx + b / 2)} ${r(y1)} L ${r(cx - b / 2)} ${r(y1)} Z" fill="var(--ttig-primary,#2563EB)" opacity="${r(op)}"/>`);
    const inner = Math.min(a, b) - 48 * u;
    if (e.value) {
      const vf = fitText(e.value, inner, stageH * 0.45, { max: Math.round(30 * u), min: 13 * u, lineHeight: 1.15 });
      out.push(textBlock(cx, y0 + stageH * 0.42, vf.lines, vf.size, '#FFFFFF', { anchor: 'middle', weight: 700, lineHeight: 1.15 }));
    }
    const tf = fitText(e.title || '', inner, stageH * 0.4, { max: Math.round(19 * u), min: 11 * u, lineHeight: 1.3 });
    out.push(textBlock(cx, y0 + stageH * (e.value ? 0.78 : 0.58), tf.lines, tf.size, '#FFFFFF', { anchor: 'middle', weight: 600, lineHeight: 1.3 }));
    if (e.body) {
      const bf = fitText(e.body, inner, stageH * 0.24, { max: Math.round(13 * u), min: 10 * u, lineHeight: 1.3 });
      out.push(textBlock(cx, y1 - 10 * u, bf.lines, bf.size, '#FFFFFF', { anchor: 'middle', opacity: 0.85, lineHeight: 1.3 }));
    }
    out.push('</g>');
  });
  return out.join('');
};

LAYOUTS['funnel:horizontal-conversion'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const gap = 14 * u;
  const barH = Math.min((box.h - gap * (n - 1)) / n, 92 * u);
  const out = [];
  els.forEach((e, i) => {
    const w = box.w * (0.96 - 0.60 * (i / Math.max(n - 1, 1)));
    const x = box.x + (box.w - w) / 2;
    const y = box.y + i * (barH + gap);
    out.push(`<g id="${esc(e.id)}" data-role="funnel-stage"${e.unit_ref ? ` data-unit-id="${esc(e.unit_ref)}"` : ''}>`);
    out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(barH)}" rx="${r(8 * u)}" fill="var(--ttig-primary,#2563EB)" opacity="${r(0.95 - 0.11 * i)}"/>`);
    const tf = fitText(e.title || '', w - 40 * u, barH * 0.6, { max: Math.round(19 * u), min: 11 * u, lineHeight: 1.3 });
    out.push(textBlock(x + 20 * u, y + barH / 2 + tf.size * 0.36, tf.lines, tf.size, '#FFFFFF', { weight: 600, lineHeight: 1.3 }));
    if (e.value) {
      out.push(`<text x="${r(x + w - 20 * u)}" y="${r(y + barH / 2)}" fill="#FFFFFF" font-size="${r(22 * u)}" font-weight="700" text-anchor="end" dominant-baseline="central">${esc(e.value)}</text>`);
    }
    out.push('</g>');
  });
  return out.join('');
};

LAYOUTS['funnel:narrowing-pipeline'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const colW = box.w / n;
  const cy = box.y + box.h / 2;
  const out = [];
  const heights = els.map((_, i) => box.h * (1 - 0.58 * (i / Math.max(n - 1, 1))));
  els.forEach((e, i) => {
    const x0 = box.x + i * colW, x1 = x0 + colW - 6 * u;
    const h0 = heights[i], h1 = i + 1 < n ? heights[i + 1] : heights[n - 1] * 0.86;
    out.push(`<g id="${esc(e.id)}" data-role="funnel-stage"${e.unit_ref ? ` data-unit-id="${esc(e.unit_ref)}"` : ''}>`);
    out.push(`<path d="M ${r(x0)} ${r(cy - h0 / 2)} L ${r(x1)} ${r(cy - h1 / 2)} L ${r(x1)} ${r(cy + h1 / 2)} L ${r(x0)} ${r(cy + h0 / 2)} Z" fill="var(--ttig-primary,#2563EB)" opacity="${r(0.94 - 0.10 * i)}"/>`);
    const tf = fitText(e.title || '', colW - 30 * u, Math.max(h0, h1) * 0.5, { max: Math.round(19 * u), min: 11 * u, lineHeight: 1.3 });
    out.push(textBlock(x0 + colW / 2, cy + tf.size * 0.36, tf.lines, tf.size, '#FFFFFF', { anchor: 'middle', weight: 600, lineHeight: 1.3 }));
    if (e.value) {
      const vf = fitText(e.value, colW - 30 * u, 34 * u, { max: Math.round(22 * u), min: 12 * u, lineHeight: 1.2 });
      out.push(textBlock(x0 + colW / 2, cy + h0 / 2 - 18 * u, vf.lines, vf.size, '#FFFFFF', { anchor: 'middle', weight: 700, opacity: 0.92, lineHeight: 1.2 }));
    }
    out.push('</g>');
  });
  return out.join('');
};

/* ---------- timeline ---------- */

function timelineCard(o) {
  const { x, y, w, h, u, e, index } = o;
  const out = [];
  out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" rx="${r(12 * u)}" fill="var(--ttig-surface,#FFFFFF)" stroke="var(--ttig-border,#E2E8F0)" stroke-width="${r(e.emphasis === 'high' ? 2.4 * u : 1.2 * u)}"/>`);
  if (e.emphasis === 'high') {
    out.push(`<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(5 * u)}" rx="${r(2.5 * u)}" fill="var(--ttig-primary,#2563EB)"/>`);
  }
  const p = 18 * u;
  let cy = y + p;
  const label = e.label || e.date || e.meta || '';
  if (label) {
    out.push(`<text x="${r(x + p)}" y="${r(cy + 14 * u)}" fill="var(--ttig-primary,#2563EB)" font-size="${r(14 * u)}" font-weight="700" letter-spacing="0.5">${esc(label)}</text>`);
    cy += 30 * u;
  }
  const tf = fitText(e.title || '', w - 2 * p, (h - (cy - y) - p) * 0.5, { max: Math.round(20 * u), min: 12 * u, lineHeight: 1.32 });
  out.push(textBlock(x + p, cy + tf.size, tf.lines, tf.size, 'var(--ttig-text,#172033)', { weight: 700, lineHeight: 1.32 }));
  cy += tf.lines.length * tf.lh + 6 * u;
  if (e.body) {
    const bf = fitText(e.body, w - 2 * p, y + h - p - cy, { max: Math.round(15 * u), min: 10 * u, lineHeight: 1.5 });
    out.push(textBlock(x + p, cy + bf.size, bf.lines, bf.size, 'var(--ttig-muted,#64748B)', { lineHeight: 1.5 }));
  }
  void index;
  return `<g id="${esc(e.id)}" data-role="${esc(e.role || 'timeline-event')}"${e.unit_ref ? ` data-unit-id="${esc(e.unit_ref)}"` : ''}>${out.join('')}</g>`;
}

LAYOUTS['timeline:horizontal'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const axisY = box.y + box.h * 0.68;
  const out = [];
  out.push(`<line x1="${r(box.x)}" y1="${r(axisY)}" x2="${r(box.x + box.w)}" y2="${r(axisY)}" stroke="var(--ttig-border,#E2E8F0)" stroke-width="${r(3 * u)}" stroke-linecap="round"/>`);
  const cardW = Math.min(240 * u, box.w / n - 22 * u);
  const cardH = Math.min(box.h * 0.58, 180 * u);
  els.forEach((e, i) => {
    const x = box.x + box.w * ((i + 0.5) / n);
    out.push(`<line x1="${r(x)}" y1="${r(axisY)}" x2="${r(x)}" y2="${r(axisY - 26 * u)}" stroke="var(--ttig-primary,#2563EB)" stroke-width="1.6" opacity="0.6"/>`);
    out.push(`<circle cx="${r(x)}" cy="${r(axisY)}" r="${r(9 * u)}" fill="var(--ttig-primary,#2563EB)"/>`);
    out.push(`<circle cx="${r(x)}" cy="${r(axisY)}" r="${r(16 * u)}" fill="none" stroke="var(--ttig-primary,#2563EB)" stroke-width="${r(2 * u)}" opacity="0.25"/>`);
    const lb = e.label || e.date || e.meta || '';
    if (lb) {
      out.push(`<text x="${r(x)}" y="${r(axisY + 34 * u)}" fill="var(--ttig-muted,#64748B)" font-size="${r(14 * u)}" font-weight="600" text-anchor="middle">${esc(lb)}</text>`);
    }
    out.push(timelineCard({ x: x - cardW / 2, y: axisY - 26 * u - cardH, w: cardW, h: cardH, u, e, index: i + 1 }));
  });
  return out.join('');
};

LAYOUTS['timeline:alternating'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const axisY = box.y + box.h / 2;
  const out = [];
  out.push(`<line x1="${r(box.x)}" y1="${r(axisY)}" x2="${r(box.x + box.w)}" y2="${r(axisY)}" stroke="var(--ttig-border,#E2E8F0)" stroke-width="${r(3 * u)}" stroke-linecap="round"/>`);
  const cardW = Math.min(230 * u, box.w / n - 20 * u);
  const cardH = Math.min(box.h * 0.40, 165 * u);
  els.forEach((e, i) => {
    const x = box.x + box.w * ((i + 0.5) / n);
    const above = i % 2 === 0;
    out.push(`<line x1="${r(x)}" y1="${r(axisY)}" x2="${r(x)}" y2="${r(axisY + (above ? -24 : 24) * u)}" stroke="var(--ttig-primary,#2563EB)" stroke-width="1.6" opacity="0.6"/>`);
    out.push(`<circle cx="${r(x)}" cy="${r(axisY)}" r="${r(9 * u)}" fill="var(--ttig-primary,#2563EB)"/>`);
    const y = above ? axisY - 24 * u - cardH : axisY + 24 * u;
    out.push(timelineCard({ x: x - cardW / 2, y, w: cardW, h: cardH, u, e, index: i + 1 }));
  });
  return out.join('');
};

LAYOUTS['timeline:vertical'] = function (ctx) {
  const { els, box, u } = ctx;
  const n = els.length;
  const spineX = box.x + box.w / 2;
  const rowH = box.h / n;
  const cardW = box.w * 0.40;
  const cardH = Math.min(rowH - 16 * u, 150 * u);
  const out = [];
  out.push(`<line x1="${r(spineX)}" y1="${r(box.y + rowH / 2)}" x2="${r(spineX)}" y2="${r(box.y + (n - 0.5) * rowH)}" stroke="var(--ttig-border,#E2E8F0)" stroke-width="${r(3 * u)}" stroke-linecap="round"/>`);
  els.forEach((e, i) => {
    const y = box.y + i * rowH + (rowH - cardH) / 2;
    const cy = y + cardH / 2;
    const left = i % 2 === 0;
    out.push(`<circle cx="${r(spineX)}" cy="${r(cy)}" r="${r(9 * u)}" fill="var(--ttig-primary,#2563EB)"/>`);
    out.push(`<circle cx="${r(spineX)}" cy="${r(cy)}" r="${r(16 * u)}" fill="none" stroke="var(--ttig-primary,#2563EB)" stroke-width="${r(2 * u)}" opacity="0.25"/>`);
    const cx = left ? spineX - 26 * u - cardW : spineX + 26 * u;
    out.push(`<line x1="${r(spineX)}" y1="${r(cy)}" x2="${r(left ? spineX - 26 * u : spineX + 26 * u)}" y2="${r(cy)}" stroke="var(--ttig-primary,#2563EB)" stroke-width="1.6" opacity="0.55"/>`);
    out.push(timelineCard({ x: cx, y, w: cardW, h: cardH, u, e, index: i + 1 }));
  });
  return out.join('');
};

/* ---------- overview ---------- */

LAYOUTS['overview:radial-hub'] = function (ctx) {
  const { els, box, u } = ctx;
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  const hub = els[0] || { id: 'hub', title: '' };
  const spokes = els.slice(1);
  const hubW = Math.min(360 * u, box.w * 0.30), hubH = Math.min(150 * u, box.h * 0.24);
  const rx = box.w / 2 - hubW / 2 - 60 * u;
  const ry = box.h / 2 - 70 * u;
  const out = [];
  const sw = Math.min(210 * u, box.w * 0.20), sh = Math.min(96 * u, box.h * 0.16);
  spokes.forEach((e, i) => {
    const a = -Math.PI / 2 + (i / Math.max(spokes.length, 1)) * Math.PI * 2;
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
    out.push(`<line x1="${r(cx)}" y1="${r(cy)}" x2="${r(x)}" y2="${r(y)}" stroke="var(--ttig-secondary,#0EA5E9)" stroke-width="1.8" opacity="0.55"/>`);
    out.push(card({
      x: x - sw / 2, y: y - sh / 2, w: sw, h: sh,
      id: e.id, role: e.role || 'spoke-node', unitRef: e.unit_ref,
      title: e.title, body: '', value: e.value, index: null,
      emphasis: e.emphasis, u, icon: e.icon, align: 'center'
    }));
  });
  out.push(card({
    x: cx - hubW / 2, y: cy - hubH / 2, w: hubW, h: hubH,
    id: hub.id, role: hub.role || 'hub-node', unitRef: hub.unit_ref,
    title: hub.title, body: hub.body, value: hub.value, index: null,
    emphasis: 'high', u, align: 'center'
  }));
  return out.join('');
};

/* ============================================================
 * 5. 默认版式选择
 * ============================================================ */

function defaultLayout(pattern, els, W, H) {
  const n = els.length;
  const portrait = H > W * 1.15;
  switch (pattern) {
    case 'comparison': return n <= 2 ? 'split-2' : 'matrix-3';
    case 'process': return portrait && n > 3 ? 'vertical-roadmap' : 'horizontal-steps';
    case 'hierarchy': return 'top-down-tree';
    case 'funnel': return 'centered-funnel';
    case 'timeline': return portrait ? 'vertical' : 'horizontal';
    case 'overview': default: return 'radial-hub';
  }
}

const PATTERNS = ['comparison', 'process', 'hierarchy', 'funnel', 'timeline', 'overview'];

/* ============================================================
 * 6. 页面渲染
 * ============================================================ */

/* 供自定义版式（--layout-file）复用，勿复制一份 */
const HELPERS = { r, esc, fitText, textBlock, iconSvg, card, arrow, edge, normItems };

function renderPage(ir, page, pageIdx, pageTotal) {
  const W = ir.canvas.width, H = ir.canvas.height;
  const M = ir.canvas.margin;
  const u = W / 1600;
  const th = resolveTheme(ir.theme);
  const ff = (ir.theme && ir.theme.font_family) || "Inter, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";
  const parts = [];

  parts.push(`<rect x="0" y="0" width="${r(W)}" height="${r(H)}" fill="var(--ttig-bg,${th.bg})"/>`);

  // ---- 页眉 ----
  let top = M;
  if (page.title) {
    const tMax = Math.round(44 * u);
    const tf = fitText(page.title, W - 2 * M - (page.eyebrow ? 260 * u : 0), tMax * 1.6, { max: tMax, min: Math.round(20 * u), lineHeight: 1.22 });
    parts.push(textBlock(M, top + tf.size, tf.lines, tf.size, 'var(--ttig-text,' + th.text + ')', { weight: 700, lineHeight: 1.22 }));
    top += tf.lines.length * tf.lh + 10 * u;
    if (page.subtitle) {
      const sMax = Math.round(21 * u);
      const sf = fitText(page.subtitle, W - 2 * M - (page.eyebrow ? 260 * u : 0), sMax * 1.8, { max: sMax, min: Math.round(13 * u), lineHeight: 1.4 });
      parts.push(textBlock(M, top + sf.size, sf.lines, sf.size, 'var(--ttig-muted,' + th.muted + ')', { weight: 400, lineHeight: 1.4 }));
      top += sf.lines.length * sf.lh + 18 * u;
    }
    if (page.eyebrow) {
      parts.push(`<text x="${r(W - M)}" y="${r(M + 18 * u)}" fill="var(--ttig-primary,${th.primary})" font-size="${r(14 * u)}" font-weight="700" text-anchor="end" letter-spacing="1.5">${esc(String(page.eyebrow).toUpperCase())}</text>`);
    }
    parts.push(`<line x1="${r(M)}" y1="${r(top)}" x2="${r(W - M)}" y2="${r(top)}" stroke="var(--ttig-border,${th.border})" stroke-width="1.5" opacity="0.9"/>`);
    top += 30 * u;
  }

  // ---- 页脚 ----
  const footer = page.footer || {};
  const hasFooter = !!(footer.note || footer.source || pageTotal > 1);
  const footH = hasFooter ? 36 * u : 10 * u;
  const bottom = H - M - footH;

  if (hasFooter) {
    const fy = H - M;
    if (footer.note) {
      const nf = fitText(footer.note, W - 2 * M - 260 * u, 26 * u, { max: Math.round(14 * u), min: 10 * u, lineHeight: 1.35 });
      parts.push(textBlock(M, fy, nf.lines, nf.size, 'var(--ttig-muted,' + th.muted + ')', { lineHeight: 1.35 }));
    }
    const rightText = pageTotal > 1 ? `${footer.source ? footer.source + '   ·   ' : ''}${pageIdx}/${pageTotal}` : (footer.source || '');
    if (rightText) {
      parts.push(`<text x="${r(W - M)}" y="${r(fy)}" fill="var(--ttig-muted,${th.muted})" font-size="${r(13 * u)}" text-anchor="end">${esc(rightText)}</text>`);
    }
  }

  // ---- 内容区 ----
  const box = { x: M, y: top, w: W - 2 * M, h: Math.max(80, bottom - top) };
  const els = (page.elements || []).map((e, i) => Object.assign({ id: e.id || `node-${i + 1}` }, e));
  const conns = (page.connections || []).filter((c) => c && c.from && c.to);
  const pattern = PATTERNS.includes(page.pattern) ? page.pattern : 'overview';
  const layout = page.layout || defaultLayout(pattern, els, W, H);
  const key = `${pattern}:${layout}`;
  const fn = LAYOUTS[key] || LAYOUTS[`${pattern}:${defaultLayout(pattern, els, W, H)}`] || LAYOUTS['overview:radial-hub'];

  const contentBox = Object.assign({}, box);
  if (pattern === 'funnel' || pattern === 'hierarchy' || pattern === 'timeline') {
    const maxH = pattern === 'timeline' ? 660 * u : 720 * u;
    if (contentBox.h > maxH) {
      contentBox.y += (contentBox.h - maxH) / 2;
      contentBox.h = maxH;
    }
  }

  const g = fn({ els, conns, box: contentBox, u, theme: th, page, helpers: HELPERS });
  parts.push(`<g id="content" data-pattern="${esc(pattern)}" data-layout="${esc(layout)}">${g}</g>`);

  const vars = Object.entries({
    '--ttig-bg': th.bg, '--ttig-surface': th.surface, '--ttig-primary': th.primary,
    '--ttig-secondary': th.secondary, '--ttig-accent': th.accent, '--ttig-text': th.text,
    '--ttig-muted': th.muted, '--ttig-border': th.border
  }).map(([k, v]) => `${k}:${v}`).join(';');

  const label = [page.title, page.subtitle].filter(Boolean).join(' — ');
  return `<svg xmlns="http://www.w3.org/2000/svg" class="ttig-root" viewBox="0 0 ${r(W)} ${r(H)}" width="${r(W)}" height="${r(H)}" font-family="${esc(ff)}" role="img" aria-label="${esc(label)}" data-pattern="${esc(pattern)}" data-layout="${esc(layout)}">
<style>.ttig-root{${vars}}</style>
${markerDefs()}
${parts.join('\n')}
</svg>`;
}

/* ============================================================
 * 7. 输入归一化
 * ============================================================ */

const ASPECT = { '16:9': [1600, 900], '4:3': [1600, 1200], '1:1': [1400, 1400], '9:16': [1080, 1920], '3:2': [1600, 1067] };

function normalize(ir) {
  const out = JSON.parse(JSON.stringify(ir));
  if (!out.canvas) out.canvas = {};
  const ar = out.canvas.aspect_ratio || '16:9';
  const dim = ASPECT[ar] || [1600, 900];
  out.canvas.width = out.canvas.width || dim[0];
  out.canvas.height = out.canvas.height || dim[1];
  out.canvas.margin = out.canvas.margin || Math.round(out.canvas.width * 0.042);
  out.canvas.aspect_ratio = ar;
  out.theme = out.theme || { theme: 'professional' };
  if (!out.pages) {
    out.pages = [{
      title: out.page && out.page.title,
      subtitle: out.page && out.page.subtitle,
      eyebrow: out.page && out.page.eyebrow,
      pattern: (out.page && out.page.pattern) || 'overview',
      layout: out.page && out.page.layout,
      footer: out.page && out.page.footer,
      elements: out.elements || [],
      connections: out.connections || []
    }];
  }
  // 多页继承画布/主题
  out.pages.forEach((p) => { if (!p.elements) p.elements = []; if (!p.connections) p.connections = []; });
  return out;
}

/* ============================================================
 * 8. CLI
 * ============================================================ */

function main() {
  const argv = process.argv.slice(2);
  const opts = { file: null, out: null, stdout: false, stdin: false, layoutFile: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-o' || a === '--out') opts.out = argv[++i];
    else if (a === '--stdout') opts.stdout = true;
    else if (a === '--stdin') opts.stdin = true;
    else if (a === '--layout-file') opts.layoutFile = argv[++i];
    else if (!a.startsWith('-')) opts.file = a;
  }

  if (opts.layoutFile) {
    try {
      const mod = require(path.resolve(opts.layoutFile));
      const custom = mod && mod.default ? mod.default : mod;
      Object.keys(custom || {}).forEach((k) => {
        if (typeof custom[k] !== 'function') return;
        if (LAYOUTS[k]) console.error(`[render-svg] 自定义版式覆盖内置: ${k}`);
        LAYOUTS[k] = custom[k];
      });
    } catch (e) {
      console.error('[render-svg] 加载 --layout-file 失败: ' + e.message);
      process.exit(2);
    }
  }

  let raw;
  if (opts.stdin || !opts.file) {
    raw = fs.readFileSync(0, 'utf8');
  } else {
    raw = fs.readFileSync(path.resolve(opts.file), 'utf8');
  }

  let ir;
  try { ir = JSON.parse(raw); }
  catch (e) { console.error('[render-svg] JSON 解析失败: ' + e.message); process.exit(2); }

  ir = normalize(ir);
  const total = ir.pages.length;
  const results = ir.pages.map((p, i) => renderPage(ir, p, i + 1, total));

  if (opts.stdout || (!opts.out && opts.stdin)) {
    process.stdout.write(results.join('\n'));
    return;
  }
  if (!opts.out) { console.error('[render-svg] 缺少 -o 输出路径'); process.exit(2); }

  const outPath = path.resolve(opts.out);
  if (total === 1) {
    fs.writeFileSync(outPath, results[0] + '\n', 'utf8');
    console.log('[render-svg] 已输出 ' + outPath);
  } else {
    const dir = path.dirname(outPath);
    const base = path.basename(outPath, path.extname(outPath));
    const ext = path.extname(outPath) || '.svg';
    results.forEach((s, i) => {
      const p = path.join(dir, `${base}-p${i + 1}${ext}`);
      fs.writeFileSync(p, s + '\n', 'utf8');
      console.log('[render-svg] 已输出 ' + p);
    });
  }
}

if (require.main === module) main();
module.exports = {
  renderPage, normalize, THEMES, LAYOUTS,
  helpers: HELPERS
};
