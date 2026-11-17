#!/usr/bin/env node
/**
 * validate-ir.js — Semantic IR / Visual IR 校验器。
 *
 * 用法：
 *   node validate-ir.js <ir.json> [--semantic|--visual] [--strict]
 *
 * 退出码：0 = 通过（或仅 WARN）；1 = 存在 ERROR；2 = 无法解析。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const PATTERNS = ['comparison', 'process', 'hierarchy', 'funnel', 'timeline', 'overview'];
const UNIT_TYPES = ['claim', 'step', 'entity', 'event', 'metric', 'cause', 'effect', 'category', 'decision', 'action'];
const EMPHASIS = ['high', 'medium', 'low'];
const ICONS = [
  'document', 'search', 'users', 'chart', 'gear', 'check', 'warning', 'lightbulb',
  'rocket', 'target', 'clock', 'shield', 'database', 'chat', 'sparkles', 'arrow-right'
];

const issues = [];
function add(level, where, msg) { issues.push({ level, where, msg }); }

/* ---- 对比度 ---- */
function hex2rgb(h) {
  const s = String(h).replace('#', '').trim();
  const full = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}
function lum(rgb) {
  const a = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
function contrast(fg, bg) {
  const a = hex2rgb(fg), b = hex2rgb(bg);
  if (!a || !b) return null;
  const l1 = lum(a), l2 = lum(b);
  const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
}

/* ---- Semantic IR ---- */
function validateSemantic(ir, strict) {
  if (!ir.document_title && !ir.core_message) add('ERROR', 'root', '缺少 document_title 或 core_message');
  if (!ir.core_message) add('WARN', 'root', '缺少 core_message（一句话结论），后续难以判断信息是否服务于主旨');
  if (!ir.audience) add('WARN', 'root', '缺少 audience（目标受众）');

  const units = ir.units || [];
  if (!units.length) { add('ERROR', 'units', '信息单元为空'); return; }

  if (units.length < 3) add('WARN', 'units', `主信息单元仅 ${units.length} 个，低于建议下限 3`);
  if (units.length > 7) add(strict ? 'ERROR' : 'WARN', 'units', `主信息单元 ${units.length} 个，超过建议上限 7，应降级为注释或拆分到下一页`);

  const ids = new Set();
  units.forEach((u, i) => {
    const w = `units[${i}]`;
    if (!u.id) add('ERROR', w, '缺少 id');
    else if (ids.has(u.id)) add('ERROR', w, `id 重复: ${u.id}`);
    else ids.add(u.id);
    if (!u.title) add('ERROR', w, '缺少 title');
    if (!u.summary) add('WARN', w, '缺少 summary');
    if (u.type && !UNIT_TYPES.includes(u.type)) add('WARN', w, `未知 type: ${u.type}（建议取值：${UNIT_TYPES.join(' / ')}）`);
    if (u.title && u.title.length > 24) add('WARN', w, `title 过长（${u.title.length} 字），应压缩到 24 字内`);
    if (u.summary && u.summary.length > 80) add('WARN', w, `summary 过长（${u.summary.length} 字），单单元正文建议 ≤80 字`);
    if (u.importance != null && (u.importance < 0 || u.importance > 1)) add('ERROR', w, 'importance 应在 [0,1]');
  });

  const rel = ir.relations || [];
  rel.forEach((c, i) => {
    const w = `relations[${i}]`;
    if (!ids.has(c.from)) add('ERROR', w, `from 引用不存在的单元: ${c.from}`);
    if (!ids.has(c.to)) add('ERROR', w, `to 引用不存在的单元: ${c.to}`);
    if (!c.type) add('WARN', w, '缺少关系 type');
  });
  if (!rel.length) add('WARN', 'relations', '未声明单元关系，结构选择缺少依据，易退化为卡片堆砌');
}

/* ---- Visual IR ---- */
function validateVisual(ir, strict) {
  const pages = ir.pages || (ir.page ? [ir.page] : []);
  if (!pages.length) { add('ERROR', 'root', '未找到 page / pages'); return; }

  pages.forEach((p, pi) => {
    const w = `page[${pi + 1}]`;
    if (!p.title) add('WARN', w, '缺少页面标题；标题应表达结论，而非主题标签');
    const els = p.elements || [];
    if (!els.length) { add('ERROR', w, 'elements 为空'); return; }
    if (els.length > 7) add(strict ? 'ERROR' : 'WARN', w, `单页 ${els.length} 个节点，超过 7 个主单元上限`);
    if (els.length > 9) add('ERROR', w, `单页 ${els.length} 个节点过多，必须拆分多页`);

    const pattern = p.pattern;
    if (!pattern) add('ERROR', w, '缺少 pattern');
    else if (!PATTERNS.includes(pattern)) add('ERROR', w, `未知 pattern: ${pattern}`);

    if (pattern === 'comparison' && els.length < 2) add('ERROR', w, 'comparison 至少需要 2 个并列实体');
    if (els.filter((e) => e.emphasis === 'high').length > 2) {
      add('WARN', w, 'emphasis: high 超过 2 个，视觉权重被平均化');
    }
    if (pattern === 'timeline' && els.length < 3) add('WARN', w, 'timeline 建议至少 3 个时间节点，否则应改用 process 或 overview');
    if (pattern === 'funnel' && els.length < 3) add('WARN', w, 'funnel 建议至少 3 个阶段');
    if (pattern === 'timeline') {
      const noDate = els.filter((e) => !e.label && !e.date && !e.meta).length;
      if (noDate > els.length / 2) add('WARN', w, '多数时间线节点缺少日期/时期标记，时间轴不成立');
    }
    if (pattern === 'funnel') {
      const noVal = els.filter((e) => !e.value).length;
      if (noVal === els.length) add('WARN', w, 'funnel 全部节点缺少数量/比例，收缩关系无法验证');
    }

    const ids = new Set();
    const titles = new Set();
    els.forEach((e, i) => {
      const ew = `${w}.elements[${i}]`;
      const id = e.id || `node-${i + 1}`;
      if (ids.has(id)) add('ERROR', ew, `id 重复: ${id}`);
      ids.add(id);
      if (!e.title) add('ERROR', ew, '缺少 title');
      if (e.title && e.title.length > 24) add('WARN', ew, `title 过长（${e.title.length} 字）`);
      if (e.body && e.body.length > 90) add('WARN', ew, `body 过长（${e.body.length} 字），渲染时会缩字或溢出`);
      if (e.title && titles.has(e.title)) add('WARN', ew, `标题重复: ${e.title}`);
      titles.add(e.title);
      if (!e.unit_ref && strict) add('WARN', ew, '缺少 unit_ref，无法回溯到语义单元');
      if (e.emphasis != null && !EMPHASIS.includes(e.emphasis)) {
        add('ERROR', ew, `未知 emphasis: ${e.emphasis}（可选 ${EMPHASIS.join(' / ')}）`);
      }
      if (e.icon != null && !ICONS.includes(e.icon)) {
        add('WARN', ew, `未知 icon: ${e.icon}，渲染时将不显示图标（可选 ${ICONS.join(' / ')}）`);
      }
    });

    (p.connections || []).forEach((c, i) => {
      const cw = `${w}.connections[${i}]`;
      if (!ids.has(c.from)) add('ERROR', cw, `from 引用不存在的节点: ${c.from}`);
      if (!ids.has(c.to)) add('ERROR', cw, `to 引用不存在的节点: ${c.to}`);
    });

    if (pattern === 'hierarchy' && !(p.connections || []).length) {
      add('WARN', w, 'hierarchy 未声明父子连接，将退化为均分层级');
    }
    if (['process', 'timeline', 'funnel'].includes(pattern) && !(p.connections || []).length && els.length > 2) {
      add('WARN', w, `${pattern} 未声明顺序连接，顺序关系只能靠位置推断`);
    }
  });

  const th = ir.theme || {};
  const bg = th.bg || '#F8FAFC';
  const text = th.text || '#172033';
  const cr = contrast(text, bg);
  if (cr != null && cr < 4.5) add('WARN', 'theme', `正文/背景对比度 ${cr}:1 低于 WCAG AA 4.5:1`);
  const muted = th.muted || '#64748B';
  const cm = contrast(muted, bg);
  if (cm != null && cm < 3) add('WARN', 'theme', `次要文字/背景对比度 ${cm}:1 低于 3:1`);
}

function main() {
  const argv = process.argv.slice(2);
  let file = null, mode = 'auto', strict = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--semantic') mode = 'semantic';
    else if (a === '--visual') mode = 'visual';
    else if (a === '--strict') strict = true;
    else if (!a.startsWith('-')) file = a;
  }
  if (!file) { console.error('用法: node validate-ir.js <ir.json> [--semantic|--visual] [--strict]'); process.exit(2); }

  let ir;
  try { ir = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')); }
  catch (e) { console.error('[validate-ir] JSON 解析失败: ' + e.message); process.exit(2); }

  const isSemantic = mode === 'semantic' || (mode === 'auto' && Array.isArray(ir.units));
  if (isSemantic) validateSemantic(ir, strict);
  else validateVisual(ir, strict);

  const errs = issues.filter((x) => x.level === 'ERROR');
  const warns = issues.filter((x) => x.level === 'WARN');

  console.log(`[validate-ir] 模式: ${isSemantic ? 'Semantic IR' : 'Visual IR'}  文件: ${file}`);
  console.log(`[validate-ir] ERROR ${errs.length}  WARN ${warns.length}`);
  issues.forEach((x) => console.log(`  ${x.level.padEnd(5)} ${x.where.padEnd(26)} ${x.msg}`));
  if (!issues.length) console.log('  OK   未发现问题');

  process.exit(errs.length ? 1 : 0);
}

if (require.main === module) main();
